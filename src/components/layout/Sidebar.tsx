'use client';

import React, { useState } from 'react';
import {
  Compass,
  Crosshair,
  Key,
  Terminal,
  Package,
  FileText,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  Shield,
  Layers,
  Network,
  Zap,
  CheckCircle2,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { Target, ActiveView } from '@/types';
import { useTargetStore } from '@/store/useTargetStore';
import { PLAYBOOKS } from '@/lib/playbooks';

interface SidebarProps {
  target: Target | null;
  onOpenTargetModal: (targetToEdit?: Target) => void;
  onOpenNmapModal: () => void;
  onOpenResetModal?: () => void;
  onOpenWelcomeModal?: () => void;
}

const COMMON_PORT_LIST = [
  { port: 21, name: 'FTP' },
  { port: 22, name: 'SSH' },
  { port: 25, name: 'SMTP' },
  { port: 53, name: 'DNS' },
  { port: 69, name: 'TFTP' },
  { port: 79, name: 'Finger' },
  { port: 80, name: 'HTTP' },
  { port: 88, name: 'Kerberos' },
  { port: 110, name: 'POP3' },
  { port: 111, name: 'RPC/NFS' },
  { port: 139, name: 'NetBIOS' },
  { port: 143, name: 'IMAP' },
  { port: 161, name: 'SNMP' },
  { port: 389, name: 'LDAP' },
  { port: 443, name: 'HTTPS' },
  { port: 445, name: 'SMB' },
  { port: 623, name: 'IPMI' },
  { port: 873, name: 'Rsync' },
  { port: 1433, name: 'MSSQL' },
  { port: 1521, name: 'Oracle' },
  { port: 2049, name: 'NFS' },
  { port: 3306, name: 'MySQL' },
  { port: 3389, name: 'RDP' },
  { port: 5985, name: 'WinRM' },
  { port: 6379, name: 'Redis' },
  { port: 8080, name: 'HTTP-Alt' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  target,
  onOpenTargetModal,
  onOpenNmapModal,
  onOpenResetModal,
  onOpenWelcomeModal,
}) => {
  const {
    targets,
    activeTargetId,
    switchTarget,
    deleteTarget,
    activePlaybookId,
    setActivePlaybookId,
    activeView,
    setActiveView,
    togglePort,
    updateTarget,
  } = useTargetStore();

  const [showTargetSelect, setShowTargetSelect] = useState(false);
  const [quickPortInput, setQuickPortInput] = useState('');
  const targetList = Object.values(targets);

  const handleQuickAddPort = () => {
    if (!target) return;
    const num = parseInt(quickPortInput.trim(), 10);
    if (!isNaN(num) && num > 0 && num <= 65535) {
      if (!target.openPorts.includes(num)) {
        const newPorts = [...target.openPorts, num].sort((a, b) => a - b);
        const newServices = { ...(target.portServices || {}) };
        if (!newServices[num]) {
          newServices[num] = num === 443 || num === 8443 ? 'https' : 'http';
        }
        updateTarget(target.id, { openPorts: newPorts, portServices: newServices });
      }
      setQuickPortInput('');
    }
  };

  return (
    <aside className="w-full lg:w-72 bg-[#080d1a] border-r border-slate-800 flex flex-col h-auto lg:h-screen shrink-0 text-slate-300">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 font-mono tracking-wider text-sm">
                PATHFINDER
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                v1.0
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 block tracking-tight">
              METHODOLOGY COMPANION
            </span>
          </div>
        </div>
      </div>

      {/* Target Selector Widget */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target Engagement</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenNmapModal}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
              title="Import Nmap scan"
            >
              <span>⚡ Nmap</span>
            </button>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={() => onOpenTargetModal()}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>
        </div>

        {target ? (
          <div className="relative">
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono">
              <select
                value={activeTargetId || ''}
                onChange={(e) => switchTarget(e.target.value)}
                className="bg-transparent text-slate-200 font-bold focus:outline-none w-full cursor-pointer"
              >
                {targetList.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                    {t.name} ({t.ipOrHostname})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 ml-2">
                <button
                  type="button"
                  onClick={() => onOpenTargetModal(target)}
                  className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
                  title="Edit Target Details"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                {targetList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteTarget(target.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"
                    title="Delete Target"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onOpenTargetModal()}
              className="w-full py-2 px-3 rounded-lg border border-dashed border-slate-700 hover:border-emerald-500 text-xs font-mono text-slate-400 hover:text-emerald-300 text-center block transition-colors"
            >
              + Create First Target
            </button>
            <button
              type="button"
              onClick={onOpenNmapModal}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-900/90 border border-cyan-800/60 hover:border-cyan-500 text-[11px] font-mono text-cyan-300 text-center block transition-colors"
            >
              ⚡ Import from Nmap Scan
            </button>
          </div>
        )}
      </div>

      {/* Main Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {/* Section 1: Discovered Ports Checklist */}
        {target && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Services</span>
              </span>
              <span className="text-slate-500">
                {target.openPorts?.length || 0} active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
              {(() => {
                // Merge preset ports and target's discovered/custom ports
                const portMap = new Map<number, string>();
                COMMON_PORT_LIST.forEach((p) => portMap.set(p.port, p.name));
                if (target.openPorts) {
                  target.openPorts.forEach((p) => {
                    if (!portMap.has(p)) {
                      const svc = target.portServices?.[p] || 'custom';
                      portMap.set(p, svc.toUpperCase());
                    }
                  });
                }

                const allItems = Array.from(portMap.entries())
                  .map(([port, name]) => ({ port, name }))
                  .sort((a, b) => a.port - b.port);

                return allItems.map((item) => {
                  const isOpen = target.openPorts?.includes(item.port);
                  const isCustom = !COMMON_PORT_LIST.some((cp) => cp.port === item.port);
                  return (
                    <button
                      key={item.port}
                      type="button"
                      onClick={() => togglePort(item.port)}
                      className={`px-2 py-1.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                        isOpen
                          ? isCustom
                            ? 'bg-cyan-950/70 text-cyan-300 border-cyan-700/80 font-bold shadow-cyber-cyan'
                            : 'bg-emerald-950/70 text-emerald-300 border-emerald-700/80 font-bold shadow-cyber-sm'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-200'
                      }`}
                      title={
                        isCustom
                          ? `Port ${item.port} (${item.name}) - Custom Discovered Service`
                          : `Port ${item.port} (${item.name})`
                      }
                    >
                      <span className="truncate">
                        {item.port} {item.name}
                      </span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOpen
                            ? isCustom
                              ? 'bg-cyan-400'
                              : 'bg-emerald-400'
                            : 'bg-slate-700'
                        }`}
                      />
                    </button>
                  );
                });
              })()}
            </div>

            {/* Quick Port Adder */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="number"
                placeholder="+ Port (e.g. 8978)"
                value={quickPortInput}
                onChange={(e) => setQuickPortInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleQuickAddPort();
                  }
                }}
                className="flex-1 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={handleQuickAddPort}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-mono border border-slate-700 font-semibold transition-colors"
                title="Add open port to this target"
              >
                + Add
              </button>
            </div>
          </div>
        )}

        {/* Section 2: Dual Views (Roadmap & Attack Graph) */}
        <div className="space-y-2">
          {target && (
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setActiveView('roadmap')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  activeView === 'roadmap'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-cyber-sm font-bold'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-emerald-800/80 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-xs">Roadmap</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">5-Phase Order</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('graph')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  activeView === 'graph'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-cyber-cyan font-bold'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-cyan-800/80 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-xs">Attack Graph</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">Visual Canvas</span>
              </button>
            </div>
          )}

          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pt-2 mb-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Service Playbooks</span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            {PLAYBOOKS.map((playbook) => {
              const isSelected =
                activeView === 'playbook' && activePlaybookId === playbook.id;

              // Check if triggered
              const isPortTriggered =
                target?.openPorts &&
                playbook.port_triggers.some((p) =>
                  target.openPorts.includes(p)
                );
              const isShellTriggered =
                playbook.requires_shell && target?.shellState?.hasShell;
              const isApplicable = isPortTriggered || isShellTriggered;

              const completedMap = target?.completedSteps || {};
              const completedCount = playbook.steps.filter(
                (s) => completedMap[s.id] === 'completed'
              ).length;
              const totalSteps = playbook.steps.length;

              return (
                <button
                  key={playbook.id}
                  type="button"
                  onClick={() => setActivePlaybookId(playbook.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-slate-100 border-emerald-500 shadow-cyber-sm font-semibold'
                      : isApplicable
                      ? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                      : 'bg-slate-950/40 text-slate-500 border-slate-800/40 hover:text-slate-400 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isApplicable
                          ? 'bg-emerald-400 shadow-cyber-sm'
                          : 'bg-slate-700'
                      }`}
                    />
                    <span className="truncate">{playbook.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border ${
                        completedCount === totalSteps && totalSteps > 0
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {completedCount}/{totalSteps}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Workspace Tools & Loot */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Workspace Views</span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            {/* Field Manual & Knowledge Hub */}
            <button
              type="button"
              onClick={() => setActiveView('knowledge')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                activeView === 'knowledge'
                  ? 'bg-slate-800 text-emerald-300 border-emerald-500 shadow-sm font-semibold'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Field Manual & Notes</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                65 Guides
              </span>
            </button>

            {/* Credentials Vault */}
            <button
              type="button"
              onClick={() => setActiveView('credentials')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                activeView === 'credentials'
                  ? 'bg-slate-800 text-amber-300 border-amber-500 shadow-sm font-semibold'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Credentials Vault</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                {target?.credentials?.length || 0}
              </span>
            </button>

            {/* Shell State */}
            <button
              type="button"
              onClick={() => setActiveView('shell')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                activeView === 'shell'
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500 shadow-sm font-semibold'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Shell / Access State</span>
              </div>
              <span
                className={`w-2 h-2 rounded-full ${
                  target?.shellState?.hasShell ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
              />
            </button>

            {/* Target Notes */}
            <button
              type="button"
              onClick={() => setActiveView('notes')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                activeView === 'notes'
                  ? 'bg-slate-800 text-emerald-300 border-emerald-500 shadow-sm font-semibold'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Engagement Notes</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info & Reset Action */}
      <div className="p-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 space-y-2 bg-[#060a14]">
        {onOpenWelcomeModal && (
          <button
            type="button"
            onClick={onOpenWelcomeModal}
            className="w-full py-1.5 px-2 rounded-lg text-cyan-300 hover:bg-cyan-950/40 border border-cyan-900/60 flex items-center justify-center gap-1.5 transition-all text-xs font-semibold"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Switch Workspace Mode</span>
          </button>
        )}
        {onOpenResetModal && (
          <button
            type="button"
            onClick={onOpenResetModal}
            className="w-full py-1.5 px-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 border border-slate-800/80 hover:border-rose-900/60 flex items-center justify-center gap-1.5 transition-all text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Fresh / Reset Data</span>
          </button>
        )}
        <div className="flex items-center justify-between">
          <span>Offline Playbook Guide</span>
          <span className="text-emerald-500/80">LocalStorage Active</span>
        </div>
      </div>
    </aside>
  );
};
