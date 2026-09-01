'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  MarkerType,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import {
  Server,
  Terminal,
  Key,
  Network,
  Maximize2,
  Plus,
  RefreshCw,
  X,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Compass,
  ArrowRight,
  Layers,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Globe,
  HelpCircle,
  Filter,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Target, Credential, StepPhase, StepStatus } from '@/types';
import { useTargetStore } from '@/store/useTargetStore';
import {
  HostNode,
  ServiceNode,
  TechniqueNode,
  CredentialNode,
  SessionNode,
} from './AttackNodes';
import { getPlaybooksForTarget, getPlaybookById, PLAYBOOKS } from '@/lib/playbooks';
import { resolveCommandTemplate } from '@/lib/variableResolver';

const nodeTypes: NodeTypes = {
  host: HostNode,
  service: ServiceNode,
  technique: TechniqueNode,
  credential: CredentialNode,
  session: SessionNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 250;
const nodeHeight = 110;

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'LR') {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 40, ranksep: 70 });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id) || { x: 0, y: 0 };
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

interface AttackGraphViewProps {
  onOpenTargetModal: (target?: Target) => void;
  onOpenNmapModal: () => void;
}

export const AttackGraphView: React.FC<AttackGraphViewProps> = ({
  onOpenTargetModal,
  onOpenNmapModal,
}) => {
  const {
    targets,
    activeTargetId,
    switchTarget,
    setActiveView,
    setActivePlaybookId,
    setStepStatus,
    experienceLevel,
    isStreamerMode,
  } = useTargetStore();

  const [selectedNode, setSelectedNode] = useState<{
    type: 'host' | 'service' | 'technique' | 'credential' | 'session';
    id: string;
    data: any;
  } | null>(null);

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [layoutDir, setLayoutDir] = useState<'LR' | 'TB'>('LR');

  // Track expanded service node IDs (interactive branch unfolding)
  const [expandedServiceIds, setExpandedServiceIds] = useState<Set<string>>(new Set());
  // Optional filter for single service isolation
  const [activeServiceFilter, setActiveServiceFilter] = useState<string | 'all'>('all');

  const activeTarget = activeTargetId ? targets[activeTargetId] || null : null;

  // Available playbooks for active target
  const applicablePlaybooks = useMemo(() => {
    if (!activeTarget) return [];
    return getPlaybooksForTarget(
      activeTarget.openPorts || [],
      activeTarget.shellState?.hasShell || false,
      activeTarget.os,
      activeTarget.portServices
    );
  }, [activeTarget]);

  // Build the Mindmap attack tree from targets & applicable playbooks
  const { initialNodes, initialEdges } = useMemo(() => {
    const rawNodes: Node[] = [];
    const rawEdges: Edge[] = [];

    const targetList = Object.values(targets);

    targetList.forEach((t) => {
      // 1. Host / Target Node
      rawNodes.push({
        id: t.id,
        type: 'host',
        data: {
          targetId: t.id,
          name: t.name,
          ipOrHostname: t.ipOrHostname,
          os: t.os,
          domain: t.domain,
          openPorts: t.openPorts || [],
          hasShell: t.shellState?.hasShell || false,
          privilegeLevel: t.shellState?.privilegeLevel || 'unprivileged',
        },
        position: { x: 0, y: 0 },
      });

      // Playbooks for this target
      const playbooks = getPlaybooksForTarget(
        t.openPorts || [],
        t.shellState?.hasShell || false,
        t.os,
        t.portServices
      );

      const completedMap = t.completedSteps || {};

      // 2. Service / Playbook Nodes
      playbooks.forEach((pb) => {
        // If filtering to a specific service, skip others
        if (activeServiceFilter !== 'all' && pb.id !== activeServiceFilter) {
          return;
        }

        const primaryPort = pb.port_triggers?.[0] || 0;
        const svcNodeId = `svc-${t.id}-${pb.id}`;
        const isExpanded = expandedServiceIds.has(svcNodeId);

        const pbSteps = pb.steps || [];
        const completedCount = pbSteps.filter(
          (s) => completedMap[s.id] === 'completed'
        ).length;

        rawNodes.push({
          id: svcNodeId,
          type: 'service',
          data: {
            targetId: t.id,
            port: primaryPort,
            serviceName: pb.name,
            playbookId: pb.id,
            totalSteps: pbSteps.length,
            completedSteps: completedCount,
            isOpen: true,
            isExpanded: isExpanded,
          },
          position: { x: 0, y: 0 },
        });

        // Edge: Host -> Service
        rawEdges.push({
          id: `edge-${t.id}-${svcNodeId}`,
          source: t.id,
          target: svcNodeId,
          animated: isExpanded,
          label: primaryPort ? `Port ${primaryPort}` : pb.category,
          style: {
            stroke: isExpanded ? '#06b6d4' : '#334155',
            strokeWidth: isExpanded ? 2 : 1.5,
          },
          labelStyle: { fill: isExpanded ? '#67e8f9' : '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
          labelBgStyle: { fill: '#0b1120', fillOpacity: 0.9 },
          markerEnd: { type: MarkerType.ArrowClosed, color: isExpanded ? '#06b6d4' : '#475569' },
        });

        // 3. Technique / Step Nodes (ONLY rendered if service is expanded!)
        if (isExpanded) {
          let prevStepNodeId = svcNodeId;
          pbSteps.forEach((step, stepIdx) => {
            const stepNodeId = `step-${t.id}-${step.id}`;
            const isDone = completedMap[step.id] === 'completed';

            rawNodes.push({
              id: stepNodeId,
              type: 'technique',
              data: {
                targetId: t.id,
                stepId: step.id,
                playbookId: pb.id,
                title: step.title,
                phase: step.phase,
                command: step.command,
                isCompleted: isDone,
                status: completedMap[step.id] || 'not-started',
                rawStep: step,
              },
              position: { x: 0, y: 0 },
            });

            // Edge: Service / Prev Step -> Current Step
            rawEdges.push({
              id: `edge-${prevStepNodeId}-${stepNodeId}`,
              source: prevStepNodeId,
              target: stepNodeId,
              animated: isDone,
              style: {
                stroke: isDone ? '#10b981' : '#06b6d4',
                strokeWidth: isDone ? 2 : 1.5,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: isDone ? '#10b981' : '#06b6d4',
              },
            });

            prevStepNodeId = stepNodeId;
          });
        }
      });

      // 4. Session Node if shell is active
      if (t.shellState?.hasShell) {
        const sessionNodeId = `session-${t.id}`;
        rawNodes.push({
          id: sessionNodeId,
          type: 'session',
          data: {
            targetId: t.id,
            user: t.shellState.user,
            privilegeLevel: t.shellState.privilegeLevel,
            shellType: t.os === 'windows' ? 'PowerShell' : 'Bash / PTY',
          },
          position: { x: 0, y: 0 },
        });

        rawEdges.push({
          id: `edge-${t.id}-${sessionNodeId}`,
          source: t.id,
          target: sessionNodeId,
          animated: true,
          label: `${t.shellState.privilegeLevel === 'root' || t.shellState.privilegeLevel === 'system' ? 'Root/SYSTEM' : 'Foothold'} Shell`,
          style: { stroke: '#10b981', strokeWidth: 2 },
          labelStyle: { fill: '#6ee7b7', fontSize: 10, fontFamily: 'monospace' },
          labelBgStyle: { fill: '#0b1120', fillOpacity: 0.9 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        });
      }

      // 5. Credential Nodes
      (t.credentials || []).forEach((c) => {
        const credNodeId = `cred-${c.id}`;
        rawNodes.push({
          id: credNodeId,
          type: 'credential',
          data: {
            credentialId: c.id,
            username: c.username,
            domain: c.domain || t.domain,
            hasPassword: !!c.password,
            hasHash: !!c.hash,
            service: c.service,
            rawCred: c,
          },
          position: { x: 0, y: 0 },
        });

        rawEdges.push({
          id: `edge-${t.id}-${credNodeId}`,
          source: t.id,
          target: credNodeId,
          animated: true,
          label: 'Harvested Cred',
          style: { stroke: '#f59e0b', strokeWidth: 1.8 },
          labelStyle: { fill: '#fcd34d', fontSize: 10, fontFamily: 'monospace' },
          labelBgStyle: { fill: '#0b1120', fillOpacity: 0.9 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
        });
      });
    });

    const layouted = getLayoutedElements(rawNodes, rawEdges, layoutDir);
    return { initialNodes: layouted.nodes, initialEdges: layouted.edges };
  }, [targets, layoutDir, expandedServiceIds, activeServiceFilter]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Synchronize layouted nodes when targets, layout, or expansions change
  useEffect(() => {
    const layouted = getLayoutedElements(initialNodes, initialEdges, layoutDir);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [initialNodes, initialEdges, layoutDir, setNodes, setEdges]);

  // Handle node selection & branch expanding
  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode({
      type: node.type as any,
      id: node.id,
      data: node.data,
    });
    setIsInspectorOpen(true);

    // If clicking a Service node, toggle its attack branch expansion!
    if (node.type === 'service') {
      setExpandedServiceIds((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
    }

    // Switch active target if node belongs to a target
    const tId = (node.data as any)?.targetId;
    if (tId && tId !== activeTargetId) {
      switchTarget(tId);
    }
  };

  const handleExpandAll = () => {
    if (!activeTarget) return;
    const allIds = new Set<string>();
    applicablePlaybooks.forEach((pb) => {
      allIds.add(`svc-${activeTarget.id}-${pb.id}`);
    });
    setExpandedServiceIds(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedServiceIds(new Set());
  };

  const handleToggleStepStatus = (stepId: string) => {
    if (!activeTarget) return;
    const current = activeTarget.completedSteps?.[stepId];
    const newStatus: StepStatus = current === 'completed' ? 'not-started' : 'completed';
    setStepStatus(stepId, newStatus);
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1500);
  };

  // Resolved command for inspected step
  const inspectedResolvedCommand = useMemo(() => {
    if (!selectedNode || selectedNode.type !== 'technique' || !activeTarget) return '';
    const rawStep = selectedNode.data.rawStep;
    if (!rawStep) return selectedNode.data.command || '';

    const firstCred = activeTarget.credentials?.[0] || null;
    return resolveCommandTemplate(rawStep.command, {
      target: activeTarget,
      activeCredential: firstCred,
      isStreamerMode,
    }).resolvedString;
  }, [selectedNode, activeTarget, isStreamerMode]);

  return (
    <div className="flex flex-col h-full bg-[#050811] text-slate-200 relative overflow-hidden font-mono">
      {/* Top Toolbar */}
      <div className="border-b border-slate-800/80 bg-[#080d1a]/95 backdrop-blur px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-100 uppercase tracking-wider">
                Attack Mindmap
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                Interactive Branching
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Click any Service node to expand its attack path • Click technique nodes for commands
            </span>
          </div>
        </div>

        {/* Service Quick-Selector / Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-[11px]">
            <button
              type="button"
              onClick={() => setActiveServiceFilter('all')}
              className={`px-2.5 py-0.5 rounded-lg transition-all font-semibold ${
                activeServiceFilter === 'all'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Services ({applicablePlaybooks.length})
            </button>

            {applicablePlaybooks.slice(0, 6).map((pb) => {
              const port = pb.port_triggers?.[0];
              const isSelected = activeServiceFilter === pb.id;
              return (
                <button
                  key={pb.id}
                  type="button"
                  onClick={() => {
                    setActiveServiceFilter(isSelected ? 'all' : pb.id);
                    if (activeTarget) {
                      const svcId = `svc-${activeTarget.id}-${pb.id}`;
                      setExpandedServiceIds(new Set([svcId]));
                    }
                  }}
                  className={`px-2 py-0.5 rounded-lg transition-all text-[10px] flex items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span>{port ? `${port}` : ''} {pb.id.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Expand / Collapse All */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-2 py-1 rounded text-[10px] text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              title="Expand all service attack paths"
            >
              + Expand All
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-2 py-1 rounded text-[10px] text-slate-300 hover:text-rose-300 hover:bg-slate-800 transition-colors"
              title="Collapse all service branches"
            >
              - Collapse All
            </button>
          </div>

          {/* Layout Direction Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setLayoutDir('LR')}
              className={`px-2 py-1 rounded text-[10px] transition-colors ${
                layoutDir === 'LR'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LR
            </button>
            <button
              type="button"
              onClick={() => setLayoutDir('TB')}
              className={`px-2 py-1 rounded text-[10px] transition-colors ${
                layoutDir === 'TB'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TB
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex">
        <div className="flex-1 h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
            defaultEdgeOptions={{
              type: 'smoothstep',
            }}
          >
            <Background color="#1e293b" gap={24} size={1.2} variant={BackgroundVariant.Dots} />
            <Controls className="!bg-[#0b1120] !border-slate-800 !text-slate-300" />
            <MiniMap
              nodeColor={(n) => {
                if (n.type === 'host') return '#06b6d4';
                if (n.type === 'service') return '#38bdf8';
                if (n.type === 'technique') return '#10b981';
                if (n.type === 'credential') return '#f59e0b';
                if (n.type === 'session') return '#22c55e';
                return '#64748b';
              }}
              className="!bg-[#080d1a] !border-slate-800 !rounded-xl !shadow-2xl"
              maskColor="rgba(5, 8, 17, 0.7)"
            />
          </ReactFlow>
        </div>

        {/* ========================================== */}
        {/* BLOODHOUND-STYLE RIGHT-HAND INSPECTOR PANEL */}
        {/* ========================================== */}
        {isInspectorOpen && selectedNode && (
          <aside className="w-full sm:w-96 lg:w-[440px] bg-[#080d1a] border-l border-slate-800 flex flex-col h-full z-20 shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Inspector Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0b1120]">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {selectedNode.type === 'host' && <Server className="w-4 h-4" />}
                  {selectedNode.type === 'service' && <Globe className="w-4 h-4" />}
                  {selectedNode.type === 'technique' && <Terminal className="w-4 h-4" />}
                  {selectedNode.type === 'credential' && <Key className="w-4 h-4" />}
                  {selectedNode.type === 'session' && <ShieldCheck className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block font-bold">
                    Node Inspector • {selectedNode.type}
                  </span>
                  <h3 className="text-xs font-bold text-slate-100 font-mono truncate">
                    {selectedNode.data?.name ||
                      selectedNode.data?.serviceName ||
                      selectedNode.data?.title ||
                      selectedNode.data?.username ||
                      'Node Details'}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsInspectorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inspector Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
              {/* 1. TECHNIQUE / ATTACK STEP INSPECTOR */}
              {selectedNode.type === 'technique' && (
                <div className="space-y-4">
                  {/* Status & Phase Header */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {selectedNode.data.phase}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Target: <strong className="text-slate-200">{activeTarget?.ipOrHostname}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStepStatus(selectedNode.data.stepId)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                        activeTarget?.completedSteps?.[selectedNode.data.stepId] === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600 shadow-cyber-sm'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-600 hover:text-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {activeTarget?.completedSteps?.[selectedNode.data.stepId] === 'completed'
                          ? 'Completed ✓'
                          : 'Mark Done'}
                      </span>
                    </button>
                  </div>

                  {/* Title & Purpose */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 mb-1">
                      {selectedNode.data.title}
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {selectedNode.data.rawStep?.purpose || 'Execute this attack technique against the target service.'}
                    </p>
                  </div>

                  {/* Resolved Terminal Command */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-emerald-400">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Ready-to-Execute Terminal Command:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCommand(inspectedResolvedCommand)}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold transition-colors"
                      >
                        {copiedCmd ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs break-all select-all shadow-inner leading-relaxed">
                      {inspectedResolvedCommand}
                    </div>
                  </div>

                  {/* Expected Output */}
                  {selectedNode.data.rawStep?.expected_output && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Expected Output / Indicators of Success:
                      </label>
                      <div className="space-y-1">
                        {selectedNode.data.rawStep.expected_output.map((out: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] text-emerald-400/90 font-mono"
                          >
                            ✓ {out}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common Pitfalls / Gotchas */}
                  {experienceLevel !== 'advanced' &&
                    selectedNode.data.rawStep?.common_mistakes &&
                    selectedNode.data.rawStep.common_mistakes.length > 0 && (
                      <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
                        <label className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Common Pitfalls & Gotchas:</span>
                        </label>
                        <ul className="list-disc list-inside text-rose-200/80 text-[11px] space-y-0.5">
                          {selectedNode.data.rawStep.common_mistakes.map((m: string, idx: number) => (
                            <li key={idx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Jump to Roadmap Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedNode.data.playbookId) {
                        setActivePlaybookId(selectedNode.data.playbookId);
                      }
                      setActiveView('roadmap');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 font-bold transition-colors"
                  >
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>View in Full 5-Phase Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}

              {/* 2. SERVICE NODE INSPECTOR */}
              {selectedNode.type === 'service' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-bold text-sm">
                        {selectedNode.data.serviceName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800">
                        Port {selectedNode.data.port}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Target host has this service open. Click on the node in the canvas or use the button below to expand the attack path branch.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedServiceIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(selectedNode.id)) {
                            next.delete(selectedNode.id);
                          } else {
                            next.add(selectedNode.id);
                          }
                          return next;
                        });
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-700 hover:bg-cyan-900 font-bold transition-colors shadow-cyber-cyan text-center"
                    >
                      {expandedServiceIds.has(selectedNode.id)
                        ? '[-] Collapse Attack Branch'
                        : '[+] Expand Attack Branch'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (selectedNode.data.playbookId) {
                          setActivePlaybookId(selectedNode.data.playbookId);
                        }
                        setActiveView('roadmap');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold transition-colors"
                      title="Open in Roadmap"
                    >
                      <Compass className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* 3. HOST NODE INSPECTOR */}
              {selectedNode.type === 'host' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-100 font-bold text-sm">
                        {selectedNode.data.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 capitalize">
                        {selectedNode.data.os}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs space-y-1">
                      <div>IP / Hostname: <strong className="text-slate-200">{selectedNode.data.ipOrHostname}</strong></div>
                      {selectedNode.data.domain && (
                        <div>Domain: <strong className="text-slate-200">{selectedNode.data.domain}</strong></div>
                      )}
                      <div>Open Services: <strong className="text-cyan-300">{selectedNode.data.openPorts?.length || 0} Ports</strong></div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenTargetModal(activeTarget || undefined)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 font-bold transition-colors"
                  >
                    <span>Edit Target / Configure Ports</span>
                  </button>
                </div>
              )}

              {/* 4. CREDENTIAL NODE INSPECTOR */}
              {selectedNode.type === 'credential' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/50 space-y-2">
                    <span className="text-amber-300 font-bold text-sm block">
                      {selectedNode.data.username}
                    </span>
                    <div className="text-slate-300 text-xs space-y-1">
                      {selectedNode.data.domain && <div>Domain: <strong>{selectedNode.data.domain}</strong></div>}
                      {selectedNode.data.rawCred?.password && (
                        <div>Password: <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">{selectedNode.data.rawCred.password}</code></div>
                      )}
                      {selectedNode.data.rawCred?.hash && (
                        <div className="break-all">Hash: <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded text-[10px]">{selectedNode.data.rawCred.hash}</code></div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveView('credentials')}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-950 text-amber-300 border border-amber-700 hover:bg-amber-900 flex items-center justify-center gap-2 font-bold transition-colors"
                  >
                    <span>Manage All Credentials</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 5. SESSION / SHELL NODE INSPECTOR */}
              {selectedNode.type === 'session' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-700/60 space-y-2">
                    <span className="text-emerald-300 font-bold text-sm block">
                      Active Shell Session
                    </span>
                    <div className="text-slate-300 text-xs space-y-1">
                      <div>User: <strong className="text-emerald-400">{selectedNode.data.user}</strong></div>
                      <div>Privilege Level: <strong className="uppercase text-emerald-400">{selectedNode.data.privilegeLevel}</strong></div>
                      <div>Shell Environment: <strong>{selectedNode.data.shellType}</strong></div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveView('shell')}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-600 hover:bg-emerald-900 flex items-center justify-center gap-2 font-bold transition-colors shadow-cyber-sm"
                  >
                    <span>Open Shell State Manager</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
