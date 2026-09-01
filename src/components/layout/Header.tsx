'use client';

import React from 'react';
import {
  Server,
  Globe,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Key,
  RotateCcw,
  Plus,
  Compass,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Target, Credential, ActiveView } from '@/types';
import { useTargetStore } from '@/store/useTargetStore';
import { PLAYBOOKS } from '@/lib/playbooks';

interface HeaderProps {
  target: Target;
  activeCredential?: Credential | null;
  onOpenNewTargetModal: () => void;
  onOpenNmapModal: () => void;
  onOpenResetModal: () => void;
  onOpenWelcomeModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  target,
  activeCredential,
  onOpenNewTargetModal,
  onOpenNmapModal,
  onOpenResetModal,
}) => {
  const {
    activeView,
    setActiveView,
    isStreamerMode,
    toggleStreamerMode,
    experienceLevel,
    setExperienceLevel,
  } = useTargetStore();

  const getShellBadge = () => {
    const shell = target.shellState;
    if (!shell?.hasShell) {
      return {
        label: 'No Shell Access',
        color: 'bg-slate-900 text-rose-400 border-rose-900/60',
        dot: 'bg-rose-500',
        icon: ShieldAlert,
      };
    }
    if (shell.privilegeLevel === 'root' || shell.privilegeLevel === 'system') {
      return {
        label: `${shell.privilegeLevel === 'root' ? 'ROOT' : 'SYSTEM'} ACCESS`,
        color: 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-cyber-sm',
        dot: 'bg-emerald-400 animate-pulse',
        icon: ShieldCheck,
      };
    }
    return {
      label: `User Shell (${shell.user || 'unprivileged'})`,
      color: 'bg-amber-950 text-amber-300 border-amber-700',
      dot: 'bg-amber-400',
      icon: Shield,
    };
  };

  const shellMeta = getShellBadge();

  // Calculate overall target progress across all applicable playbooks
  const applicablePlaybooks = PLAYBOOKS.filter((p) => {
    if (p.requires_shell) return target.shellState?.hasShell;
    return p.port_triggers.some((port) => target.openPorts.includes(port));
  });

  const totalSteps = applicablePlaybooks.reduce(
    (acc, p) => acc + p.steps.length,
    0
  );
  const completedMap = target.completedSteps || {};
  const completedStepsCount = Object.keys(completedMap).filter(
    (sId) => completedMap[sId] === 'completed'
  ).length;

  const progressPercentage =
    totalSteps > 0 ? Math.min(100, Math.round((completedStepsCount / totalSteps) * 100)) : 0;

  return (
    <header className="border-b border-slate-800 bg-[#080d1a]/80 backdrop-blur sticky top-0 z-30 px-4 py-3 flex flex-wrap items-center justify-between gap-4 font-mono">
      {/* Left Target Info */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shadow-cyber-sm">
          <Server className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm text-slate-100 font-mono tracking-wide">
              {target.name}
            </h1>
            <span className="text-xs text-emerald-400 font-mono">
              ({target.ipOrHostname})
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
            {target.domain && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>{target.domain}</span>
              </span>
            )}

            {/* OS */}
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-400 border border-slate-800 uppercase">
              {target.os}
            </span>
          </div>
        </div>
      </div>

      {/* Center & Right Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* DETAIL / EXPERIENCE LEVEL SELECTOR */}
        <div className="bg-slate-950/90 border border-slate-800 p-0.5 rounded-xl flex items-center shadow-inner text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setExperienceLevel('beginner')}
            className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
              experienceLevel === 'beginner'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-cyber-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Beginner Mode: Full explanations, if-success/if-failure guidance, expected output, and pitfalls"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Beginner</span>
          </button>

          <button
            type="button"
            onClick={() => setExperienceLevel('intermediate')}
            className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
              experienceLevel === 'intermediate'
                ? 'bg-amber-950 text-amber-300 border border-amber-700 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Intermediate Mode: Commands, purpose, and common pitfalls (Hides repetitive if-success/if-failure boxes)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Intermediate</span>
          </button>

          <button
            type="button"
            onClick={() => setExperienceLevel('advanced')}
            className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
              experienceLevel === 'advanced'
                ? 'bg-rose-950 text-rose-300 border border-rose-700 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pro / Fast Mode: High-density commands only with 1-click copy"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Pro</span>
          </button>
        </div>

        {/* Right: Shell Status, Active Cred, Streamer Mode, Progress, Actions */}
        <div className="flex items-center gap-2.5 flex-wrap justify-between lg:justify-end">
          {/* Streamer / Censor Mode Toggle */}
          <button
            type="button"
            onClick={toggleStreamerMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
              isStreamerMode
                ? 'bg-purple-950/80 text-purple-300 border-purple-700 shadow-sm font-bold'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={isStreamerMode ? 'Streamer Mode ON: Sensitive credentials are masked (Click to show)' : 'Streamer Mode OFF: Click to mask sensitive secrets'}
          >
            {isStreamerMode ? <EyeOff className="w-3.5 h-3.5 text-purple-400" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isStreamerMode ? 'Censor ON' : 'Censor'}</span>
          </button>

          {/* Shell Status Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border font-semibold ${shellMeta.color}`}
          >
            <span className={`w-2 h-2 rounded-full ${shellMeta.dot}`} />
            <span>{shellMeta.label}</span>
          </div>

          {/* Active Credential Pill */}
          {activeCredential && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-900 text-amber-300 border border-slate-800"
              title="Active credential used for command interpolation"
            >
              <Key className="w-3 h-3 text-amber-400" />
              <span>{activeCredential.username}</span>
            </div>
          )}

          {/* Target Progress Pill */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-lg text-xs font-mono">
            <span className="text-slate-400">Progress:</span>
            <span className="text-emerald-400 font-bold">
              {completedStepsCount}/{totalSteps} ({progressPercentage}%)
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenNmapModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-cyan-800/60 font-semibold transition-all hover:border-cyan-500"
              title="Import Nmap scan results to update open ports"
            >
              <span className="text-cyan-400">⚡</span>
              <span className="hidden sm:inline">Import Nmap</span>
            </button>
            <button
              type="button"
              onClick={onOpenNewTargetModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-950 bg-emerald-400 hover:bg-emerald-300 font-bold transition-all shadow-cyber-sm"
              title="Create new target engagement"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Target</span>
            </button>
            <button
              type="button"
              onClick={onOpenResetModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-rose-300 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/80 transition-all font-medium"
              title="Start fresh and clear out old engagement data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Start Fresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
