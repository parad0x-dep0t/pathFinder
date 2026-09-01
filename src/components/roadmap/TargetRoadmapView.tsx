'use client';

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Zap,
  Flame,
  ShieldCheck,
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Filter,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Target, Credential, PlaybookStep, StepStatus, StepPhase, Playbook } from '@/types';
import { getPlaybooksForTarget } from '@/lib/playbooks';
import { useTargetStore } from '@/store/useTargetStore';
import { StepCard } from '@/components/playbooks/StepCard';

interface TargetRoadmapViewProps {
  target: Target;
  activeCredential?: Credential | null;
  onSelectPlaybook?: (playbookId: string) => void;
}

interface RoadmapStepItem {
  step: PlaybookStep;
  playbook: Playbook;
  phase: StepPhase;
}

const PHASES_CONFIG: {
  id: StepPhase;
  num: number;
  label: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeBg: string;
  badgeBg: string;
}[] = [
  {
    id: 'reconnaissance',
    num: 1,
    label: 'Recon & Fingerprinting',
    shortDesc: 'Identify service versions, OS details, banners, and security signing.',
    icon: Compass,
    color: 'text-cyan-400',
    activeBg: 'bg-cyan-950/40 border-cyan-500/60',
    badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
  },
  {
    id: 'enumeration',
    num: 2,
    label: 'Deep Enumeration',
    shortDesc: 'Discover user accounts, shares, web directories, vhosts, and naming contexts.',
    icon: Zap,
    color: 'text-emerald-400',
    activeBg: 'bg-emerald-950/40 border-emerald-500/60',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
  },
  {
    id: 'exploitation',
    num: 3,
    label: 'Initial Foothold & Exploit',
    shortDesc: 'Execute vulnerability payloads, auth bypasses, password sprays, and get a shell.',
    icon: Flame,
    color: 'text-rose-400',
    activeBg: 'bg-rose-950/40 border-rose-500/60',
    badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
  },
  {
    id: 'privesc',
    num: 4,
    label: 'Privilege Escalation',
    shortDesc: 'Escalate from standard user to root / NT AUTHORITY\\SYSTEM.',
    icon: ShieldCheck,
    color: 'text-purple-400',
    activeBg: 'bg-purple-950/40 border-purple-500/60',
    badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
  },
  {
    id: 'post-exploitation',
    num: 5,
    label: 'Post-Exploitation & Pivoting',
    shortDesc: 'Stabilize TTY, dump secrets/SAM/LSASS, and pivot to internal subnets.',
    icon: Shield,
    color: 'text-indigo-400',
    activeBg: 'bg-indigo-950/40 border-indigo-500/60',
    badgeBg: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
  },
];

export const TargetRoadmapView: React.FC<TargetRoadmapViewProps> = ({
  target,
  activeCredential,
  onSelectPlaybook,
}) => {
  const { setStepStatus } = useTargetStore();
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'focused' | 'all'>('focused');

  const completedMap = target.completedSteps || {};
  const hasShell = target.shellState?.hasShell || false;
  const targetOS = target.os || 'other';
  const openPorts = target.openPorts || [];
  const portServices = target.portServices || {};

  // Assemble all applicable playbooks for this target
  const applicablePlaybooks = useMemo(() => {
    return getPlaybooksForTarget(openPorts, hasShell, targetOS, portServices);
  }, [openPorts, hasShell, targetOS, portServices]);

  // Aggregate and sort all steps into the 5 chronological phases
  const stepsByPhase = useMemo(() => {
    const map: Record<StepPhase, RoadmapStepItem[]> = {
      reconnaissance: [],
      enumeration: [],
      exploitation: [],
      privesc: [],
      'post-exploitation': [],
    };

    applicablePlaybooks.forEach((playbook) => {
      playbook.steps.forEach((step) => {
        const phase = step.phase || 'enumeration';
        if (map[phase]) {
          map[phase].push({ step, playbook, phase });
        }
      });
    });

    return map;
  }, [applicablePlaybooks]);

  // Calculate stats per phase
  const phaseStats = useMemo(() => {
    return PHASES_CONFIG.map((cfg) => {
      const items = stepsByPhase[cfg.id] || [];
      const completed = items.filter(
        (i) => completedMap[i.step.id] === 'completed'
      ).length;
      const skipped = items.filter(
        (i) => completedMap[i.step.id] === 'skipped'
      ).length;
      const total = items.length;
      const isDone = total > 0 && completed + skipped >= total;
      return {
        ...cfg,
        total,
        completed,
        skipped,
        isDone,
      };
    });
  }, [stepsByPhase, completedMap]);

  // Total overall progress
  const totalAllSteps = phaseStats.reduce((acc, p) => acc + p.total, 0);
  const totalCompletedSteps = phaseStats.reduce((acc, p) => acc + p.completed, 0);
  const totalProgressPercent = totalAllSteps > 0 ? Math.round((totalCompletedSteps / totalAllSteps) * 100) : 0;

  // Find the first unfinished step across the roadmap as the Current Focus Step
  const currentFocusItem = useMemo(() => {
    for (const phaseConfig of PHASES_CONFIG) {
      const items = stepsByPhase[phaseConfig.id] || [];
      for (const item of items) {
        const status = completedMap[item.step.id];
        if (status !== 'completed' && status !== 'skipped') {
          return item;
        }
      }
    }
    return null;
  }, [stepsByPhase, completedMap]);

  const currentPhaseConfig = PHASES_CONFIG[activePhaseIndex] || PHASES_CONFIG[0];
  const currentPhaseItems = stepsByPhase[currentPhaseConfig.id] || [];

  return (
    <div className="space-y-6">
      {/* Top Target Overview Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Target Attack Roadmap
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {openPorts.length} Open Ports Detected • {applicablePlaybooks.length} Active Vectors
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <span>{target.name}</span>
              <span className="text-sm font-mono text-slate-400 font-normal">({target.ipOrHostname})</span>
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Chronologically ordered pentest pipeline. Progress stage-by-stage from initial service fingerprinting to enumeration, exploitation, and post-exploitation.
            </p>
          </div>

          {/* Overall Target Progress Card */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 min-w-[210px] shrink-0 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Roadmap Progress</span>
              <span className="text-emerald-400 font-bold text-sm">
                {totalCompletedSteps}/{totalAllSteps} ({totalProgressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${totalProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5">
              <span>Target OS: <strong className="text-slate-200 capitalize">{target.os}</strong></span>
              <span>Shell: <strong className={hasShell ? 'text-emerald-400' : 'text-slate-400'}>{hasShell ? 'Acquired' : 'None'}</strong></span>
            </div>
          </div>
        </div>

        {/* Phase Stepper Pipeline */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {phaseStats.map((p, idx) => {
              const Icon = p.icon;
              const isActive = activePhaseIndex === idx;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePhaseIndex(idx)}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[78px] ${
                    isActive
                      ? `${p.activeBg} border-2 shadow-cyber-sm font-semibold`
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-full text-[11px] font-mono flex items-center justify-center font-bold ${
                        p.isDone
                          ? 'bg-emerald-500 text-slate-950'
                          : isActive
                          ? 'bg-slate-100 text-slate-900'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.isDone ? '✓' : p.num}
                      </span>
                      <span className={`text-xs font-bold font-mono truncate ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                        {p.label.split(' ')[0]}
                      </span>
                    </div>

                    <Icon className={`w-3.5 h-3.5 shrink-0 ${p.color}`} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono mt-2">
                    <span className="text-slate-400">
                      {p.completed}/{p.total} done
                    </span>
                    {p.isDone ? (
                      <span className="text-emerald-400 font-bold">Passed</span>
                    ) : p.total === 0 ? (
                      <span className="text-slate-500">N/A</span>
                    ) : (
                      <span className={isActive ? 'text-cyan-300' : 'text-slate-500'}>
                        {p.total - (p.completed + p.skipped)} left
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Immediate Focus Recommendation Box (Highlights the Next Single Action) */}
      {currentFocusItem && (
        <div className="rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-[#0b1120] p-4 shadow-cyber-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                Recommended Next Action (Phase {PHASES_CONFIG.find(p => p.id === currentFocusItem.phase)?.num}: {currentFocusItem.phase})
              </span>
            </div>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Vector: {currentFocusItem.playbook.name}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-100">
              {currentFocusItem.step.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentFocusItem.step.purpose}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                const targetIdx = PHASES_CONFIG.findIndex(p => p.id === currentFocusItem.phase);
                if (targetIdx >= 0) setActivePhaseIndex(targetIdx);
              }}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              <span>Jump to this step in Phase {PHASES_CONFIG.find(p => p.id === currentFocusItem.phase)?.num}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setStepStatus(currentFocusItem.step.id, 'completed')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Done & Advance</span>
            </button>
          </div>
        </div>
      )}

      {/* Phase Controls & View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${currentPhaseConfig.badgeBg}`}>
            {React.createElement(currentPhaseConfig.icon, { className: 'w-4 h-4' })}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200">
              Phase {currentPhaseConfig.num}: {currentPhaseConfig.label} ({currentPhaseItems.length} Steps)
            </h2>
            <p className="text-[11px] text-slate-400">
              {currentPhaseConfig.shortDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Mode Switcher: Focused Phase vs All Phases */}
          <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex items-center text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode('focused')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'focused'
                  ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phase Focus Mode
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'all'
                  ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Phases Overview
            </button>
          </div>
        </div>
      </div>

      {/* Step Cards List */}
      <div className="space-y-6">
        {viewMode === 'focused' ? (
          // Single Focused Phase View
          currentPhaseItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-400 space-y-2">
              <Compass className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-sm font-medium text-slate-300">
                No methodology steps required for this phase based on currently active ports or shell state.
              </p>
              <p className="text-xs text-slate-500">
                You can proceed directly to the next phase below.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentPhaseItems.map(({ step, playbook }) => {
                const status = (completedMap[step.id] as StepStatus) || 'not-started';
                const isCurrentFocus = currentFocusItem?.step.id === step.id;
                return (
                  <div key={step.id} className="space-y-1">
                    <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Playbook: <strong className="text-slate-200">{playbook.name}</strong>
                      </span>
                      {playbook.port_triggers.length > 0 && (
                        <span>Ports: {playbook.port_triggers.join(', ')}</span>
                      )}
                    </div>
                    <StepCard
                      step={step}
                      status={status}
                      onStatusChange={(newStatus) => setStepStatus(step.id, newStatus)}
                      target={target}
                      activeCredential={activeCredential}
                      isHighlighted={isCurrentFocus}
                    />
                  </div>
                );
              })}
            </div>
          )
        ) : (
          // All Phases Grouped View
          <div className="space-y-8">
            {PHASES_CONFIG.map((phaseCfg, pIdx) => {
              const items = stepsByPhase[phaseCfg.id] || [];
              if (items.length === 0) return null;
              return (
                <div key={phaseCfg.id} className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 text-xs font-mono font-bold flex items-center justify-center">
                      {phaseCfg.num}
                    </span>
                    <h3 className="text-base font-bold text-slate-100">
                      Phase {phaseCfg.num}: {phaseCfg.label}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">
                      ({items.length} steps)
                    </span>
                  </div>

                  <div className="space-y-4 pl-2 sm:pl-4 border-l-2 border-slate-800/80">
                    {items.map(({ step, playbook }) => {
                      const status = (completedMap[step.id] as StepStatus) || 'not-started';
                      const isCurrentFocus = currentFocusItem?.step.id === step.id;
                      return (
                        <div key={step.id} className="space-y-1">
                          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
                            <span>Playbook: <strong className="text-slate-200">{playbook.name}</strong></span>
                            {playbook.port_triggers.length > 0 && (
                              <span>Ports: {playbook.port_triggers.join(', ')}</span>
                            )}
                          </div>
                          <StepCard
                            step={step}
                            status={status}
                            onStatusChange={(newStatus) => setStepStatus(step.id, newStatus)}
                            target={target}
                            activeCredential={activeCredential}
                            isHighlighted={isCurrentFocus}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      {viewMode === 'focused' && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            disabled={activePhaseIndex === 0}
            onClick={() => setActivePhaseIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-mono text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous Phase
          </button>

          <span className="text-xs font-mono text-slate-400">
            Phase {activePhaseIndex + 1} of {PHASES_CONFIG.length}
          </span>

          <button
            type="button"
            disabled={activePhaseIndex === PHASES_CONFIG.length - 1}
            onClick={() => setActivePhaseIndex((prev) => Math.min(PHASES_CONFIG.length - 1, prev + 1))}
            className="px-4 py-2 rounded-xl border border-emerald-800/80 bg-emerald-950/60 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-900/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <span>Next Phase</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
