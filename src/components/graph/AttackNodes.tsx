'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import {
  Server,
  Terminal,
  Key,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Network,
  Globe,
  Radio,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  FileCode,
  Zap,
} from 'lucide-react';
import {
  HostNodeData,
  ServiceNodeData,
  TechniqueNodeData,
  CredentialNodeData,
  SessionNodeData,
} from '@/types';

export type HostNodeType = Node<HostNodeData, 'host'>;
export type ServiceNodeType = Node<ServiceNodeData, 'service'>;
export type TechniqueNodeType = Node<TechniqueNodeData, 'technique'>;
export type CredentialNodeType = Node<CredentialNodeData, 'credential'>;
export type SessionNodeType = Node<SessionNodeData, 'session'>;

// ==========================================
// 1. HOST / TARGET NODE
// ==========================================
export const HostNode = memo(({ data, selected }: NodeProps<HostNodeType>) => {
  const host = data;

  return (
    <div
      className={`min-w-[240px] max-w-[280px] rounded-2xl border bg-[#0b1120] p-4 shadow-cyber-md transition-all cursor-pointer ${
        selected
          ? 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-cyber-cyan'
          : host.hasShell
          ? 'border-emerald-500/80 bg-gradient-to-b from-[#0b1120] to-emerald-950/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-slate-950 !-left-1.5"
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2 overflow-hidden">
          <div
            className={`p-1.5 rounded-xl border ${
              host.hasShell
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-xs text-slate-100 font-mono truncate">
              {host.name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {host.ipOrHostname}
            </div>
          </div>
        </div>

        {host.hasShell ? (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 animate-pulse">
            PWNED
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-slate-900 text-slate-500 border border-slate-800">
            TARGET
          </span>
        )}
      </div>

      {/* Ports summary */}
      <div className="py-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>OS: <strong className="text-slate-200 capitalize">{host.os}</strong></span>
          <span>{host.openPorts?.length || 0} Open Services</span>
        </div>

        <div className="flex flex-wrap gap-1 max-h-[50px] overflow-hidden">
          {(!host.openPorts || host.openPorts.length === 0) ? (
            <span className="text-[10px] text-slate-500 font-mono">No ports discovered</span>
          ) : (
            host.openPorts.slice(0, 6).map((port) => (
              <span
                key={port}
                className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 text-cyan-300 border border-slate-800"
              >
                {port}
              </span>
            ))
          )}
          {host.openPorts && host.openPorts.length > 6 && (
            <span className="text-[10px] font-mono text-slate-500">
              +{host.openPorts.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Click for details</span>
        <span className="text-cyan-400 font-bold">➔</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-slate-950 !-right-1.5"
      />
    </div>
  );
});

HostNode.displayName = 'HostNode';

// ==========================================
// 2. SERVICE NODE (PORT / PROTOCOL)
// ==========================================
export const ServiceNode = memo(({ data, selected }: NodeProps<ServiceNodeType>) => {
  const svc = data;
  const isDone = svc.completedSteps > 0 && svc.completedSteps === svc.totalSteps;
  const isExpanded = !!svc.isExpanded;

  return (
    <div
      className={`min-w-[210px] max-w-[250px] rounded-2xl border bg-[#080d1a] p-3.5 shadow-cyber-sm transition-all cursor-pointer ${
        selected
          ? 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-cyber-cyan'
          : isExpanded
          ? 'border-cyan-500/70 bg-gradient-to-b from-[#080d1a] to-cyan-950/30'
          : isDone
          ? 'border-emerald-600/60 bg-gradient-to-b from-[#080d1a] to-emerald-950/30'
          : 'border-slate-800 hover:border-slate-700 bg-gradient-to-b from-[#080d1a] to-slate-900/40'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-slate-950 !-left-1.5"
      />

      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 overflow-hidden">
          <div
            className={`p-1.5 rounded-xl border ${
              isExpanded
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-xs text-cyan-300 font-mono truncate uppercase">
              {svc.serviceName}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Port {svc.port}
            </div>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-900 text-slate-300 border border-slate-800 font-semibold shrink-0">
          {svc.completedSteps}/{svc.totalSteps}
        </span>
      </div>

      {/* Expand / Collapse Action Footer */}
      <div className="pt-2 flex items-center justify-between text-[10px] font-mono">
        <span className="text-slate-400">
          {isExpanded ? 'Path Active' : `${svc.totalSteps} Attack Steps`}
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition-all ${
            isExpanded
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-sm'
              : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-cyan-500 hover:text-cyan-300'
          }`}
        >
          {isExpanded ? '[-] Collapse' : '[+] Expand'}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className={`!w-3 !h-3 !border-2 !border-slate-950 !-right-1.5 ${
          isExpanded ? '!bg-emerald-400' : '!bg-cyan-400'
        }`}
      />
    </div>
  );
});

ServiceNode.displayName = 'ServiceNode';

// ==========================================
// 3. TECHNIQUE / ATTACK STEP NODE
// ==========================================
export const TechniqueNode = memo(({ data, selected }: NodeProps<TechniqueNodeType>) => {
  const step = data;

  const phaseColors: Record<string, { bg: string; text: string; border: string }> = {
    reconnaissance: { bg: 'bg-cyan-950/80', text: 'text-cyan-400', border: 'border-cyan-700/80' },
    enumeration: { bg: 'bg-blue-950/80', text: 'text-blue-400', border: 'border-blue-700/80' },
    exploitation: { bg: 'bg-amber-950/80', text: 'text-amber-400', border: 'border-amber-700/80' },
    privesc: { bg: 'bg-purple-950/80', text: 'text-purple-400', border: 'border-purple-700/80' },
    'post-exploitation': { bg: 'bg-emerald-950/80', text: 'text-emerald-400', border: 'border-emerald-700/80' },
  };

  const style = phaseColors[step.phase] || phaseColors.enumeration;

  return (
    <div
      className={`min-w-[210px] max-w-[250px] rounded-2xl border bg-[#0b1120] p-3 shadow-cyber-sm transition-all cursor-pointer ${
        selected
          ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-cyber-sm'
          : step.isCompleted
          ? 'border-emerald-500/80 bg-gradient-to-b from-[#0b1120] to-emerald-950/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-slate-950 !-left-1.5"
      />

      <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800/80">
        <span
          className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold border ${style.bg} ${style.text} ${style.border}`}
        >
          {step.phase}
        </span>

        {step.isCompleted ? (
          <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>DONE</span>
          </span>
        ) : (
          <span className="text-[9px] font-mono text-slate-500">PENDING</span>
        )}
      </div>

      <div className="py-1.5">
        <div className="font-bold text-xs text-slate-200 font-mono truncate leading-snug">
          {step.title}
        </div>
        <div className="text-[10px] text-slate-400 font-mono truncate pt-0.5 opacity-80">
          {step.command}
        </div>
      </div>

      <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Click for command</span>
        <span className="text-emerald-400 font-bold">⚡</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-slate-950 !-right-1.5"
      />
    </div>
  );
});

TechniqueNode.displayName = 'TechniqueNode';

// ==========================================
// 4. CREDENTIAL NODE
// ==========================================
export const CredentialNode = memo(({ data, selected }: NodeProps<CredentialNodeType>) => {
  const cred = data;

  return (
    <div
      className={`min-w-[190px] max-w-[230px] rounded-2xl border bg-[#0b1120] p-3.5 shadow-cyber-sm transition-all cursor-pointer ${
        selected
          ? 'border-amber-400 ring-2 ring-amber-500/50'
          : 'border-amber-900/40 bg-gradient-to-b from-[#0b1120] to-amber-950/20 hover:border-amber-700/60'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-slate-950 !-left-1.5"
      />

      <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
        <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Key className="w-3.5 h-3.5" />
        </div>
        <div className="overflow-hidden">
          <div className="font-bold text-xs text-amber-300 font-mono truncate">
            {cred.username}
          </div>
          {cred.domain && (
            <div className="text-[10px] text-slate-400 font-mono truncate">
              {cred.domain}
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>{cred.hasPassword ? 'Password' : cred.hasHash ? 'NTLM Hash' : 'User Account'}</span>
        <span className="text-amber-400 font-semibold">Cred</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-slate-950 !-right-1.5"
      />
    </div>
  );
});

CredentialNode.displayName = 'CredentialNode';

// ==========================================
// 5. SESSION / SHELL NODE
// ==========================================
export const SessionNode = memo(({ data, selected }: NodeProps<SessionNodeType>) => {
  const session = data;
  const isRoot = session.privilegeLevel === 'root' || session.privilegeLevel === 'system';

  return (
    <div
      className={`min-w-[190px] max-w-[230px] rounded-2xl border bg-[#0b1120] p-3.5 shadow-cyber-sm transition-all cursor-pointer ${
        selected
          ? 'border-emerald-400 ring-2 ring-emerald-500/50'
          : isRoot
          ? 'border-emerald-500/80 bg-gradient-to-b from-[#0b1120] to-emerald-950/40'
          : 'border-cyan-800/60 bg-gradient-to-b from-[#0b1120] to-cyan-950/20'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-slate-950 !-left-1.5"
      />

      <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
        <div
          className={`p-1.5 rounded-xl border ${
            isRoot
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
        </div>
        <div className="overflow-hidden">
          <div className="font-bold text-xs text-slate-100 font-mono truncate">
            {session.user || 'Interactive Shell'}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono uppercase font-bold">
            {session.privilegeLevel}
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Active Shell</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-slate-950 !-right-1.5"
      />
    </div>
  );
});

SessionNode.displayName = 'SessionNode';
