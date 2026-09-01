'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Filter,
  Search,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
  Compass,
  Zap,
  Flame,
  ShieldCheck,
  Shield,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { Target, Credential, Playbook, StepPhase, StepStatus } from '@/types';
import { useTargetStore } from '@/store/useTargetStore';
import { StepCard } from './StepCard';

interface PlaybookViewProps {
  playbook: Playbook;
  target: Target;
  activeCredential?: Credential | null;
}

const PHASE_ORDER: { id: StepPhase; num: number; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'reconnaissance', num: 1, label: 'Recon', icon: Compass },
  { id: 'enumeration', num: 2, label: 'Enumeration', icon: Zap },
  { id: 'exploitation', num: 3, label: 'Exploitation', icon: Flame },
  { id: 'privesc', num: 4, label: 'PrivEsc', icon: ShieldCheck },
  { id: 'post-exploitation', num: 5, label: 'Post-Exploit', icon: Shield },
];

export const PlaybookView: React.FC<PlaybookViewProps> = ({
  playbook,
  target,
  activeCredential,
}) => {
  const { setStepStatus } = useTargetStore();
  const completedMap = target.completedSteps || {};

  // Find phases present in this specific playbook
  const availablePhases = useMemo(() => {
    const presentPhases = new Set(playbook.steps.map((s) => s.phase || 'enumeration'));
    return PHASE_ORDER.filter((p) => presentPhases.has(p.id));
  }, [playbook.steps]);

  // Find the first phase that has unfinished steps to focus on by default
  const defaultPhaseId = useMemo(() => {
    for (const p of availablePhases) {
      const stepsInPhase = playbook.steps.filter((s) => (s.phase || 'enumeration') === p.id);
      const isUnfinished = stepsInPhase.some(
        (s) => completedMap[s.id] !== 'completed' && completedMap[s.id] !== 'skipped'
      );
      if (isUnfinished) return p.id;
    }
    return availablePhases[0]?.id || 'enumeration';
  }, [availablePhases, playbook.steps, completedMap]);

  const [selectedPhase, setSelectedPhase] = useState<string>(defaultPhaseId);
  const [viewMode, setViewMode] = useState<'stepper' | 'all'>('stepper');
  const [query, setQuery] = useState('');

  const completedCount = playbook.steps.filter(
    (s) => completedMap[s.id] === 'completed'
  ).length;
  const progressPercent = Math.round(
    (completedCount / (playbook.steps.length || 1)) * 100
  );

  const filteredSteps = useMemo(() => {
    return playbook.steps.filter((step) => {
      if (viewMode === 'stepper' && selectedPhase !== 'all' && (step.phase || 'enumeration') !== selectedPhase) {
        return false;
      }
      if (query.trim() !== '') {
        const q = query.toLowerCase();
        const matchTitle = step.title.toLowerCase().includes(q);
        const matchPurpose = step.purpose.toLowerCase().includes(q);
        const matchCmd = step.command.toLowerCase().includes(q);
        return matchTitle || matchPurpose || matchCmd;
      }
      return true;
    });
  }, [playbook.steps, viewMode, selectedPhase, query]);

  // Calculate current active phase index in availablePhases list
  const currentPhaseIndex = availablePhases.findIndex((p) => p.id === selectedPhase);

  return (
    <div className="space-y-6">
      {/* Playbook Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 uppercase">
                {playbook.category}
              </span>
              {playbook.port_triggers.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400 font-mono">Ports:</span>
                  {playbook.port_triggers.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-cyan-300 border border-slate-700 font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-100">
              {playbook.name}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-4xl">
              {playbook.description}
            </p>
          </div>

          {/* Progress widget */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 min-w-[190px] shrink-0 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Playbook Progress</span>
              <span className="text-emerald-400 font-bold">
                {completedCount}/{playbook.steps.length} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Phase Stepper Tabs */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {availablePhases.map((p, idx) => {
                const Icon = p.icon;
                const stepsInPhase = playbook.steps.filter((s) => (s.phase || 'enumeration') === p.id);
                const doneInPhase = stepsInPhase.filter(
                  (s) => completedMap[s.id] === 'completed' || completedMap[s.id] === 'skipped'
                ).length;
                const isPhaseComplete = stepsInPhase.length > 0 && doneInPhase >= stepsInPhase.length;
                const isSelected = viewMode === 'stepper' && selectedPhase === p.id;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setViewMode('stepper');
                      setSelectedPhase(p.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-all whitespace-nowrap border ${
                      isSelected
                        ? 'bg-slate-800 text-emerald-300 border-emerald-500 shadow-sm font-bold'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isPhaseComplete ? 'bg-emerald-500 text-slate-950' : isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isPhaseComplete ? '✓' : idx + 1}
                    </span>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{p.label}</span>
                    <span className="text-[10px] text-slate-500">
                      ({doneInPhase}/{stepsInPhase.length})
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                  viewMode === 'all'
                    ? 'bg-slate-800 text-emerald-300 border-emerald-500 font-bold'
                    : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                All Steps ({playbook.steps.length})
              </button>
            </div>

            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter steps..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900/90 text-slate-200 text-xs font-mono rounded-lg pl-8 pr-3 py-1.5 border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {filteredSteps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-500" />
            <p className="text-sm font-medium text-slate-300">No methodology steps match the selected filter.</p>
            <p className="text-xs text-slate-500 mt-1">Try selecting &quot;All Steps&quot; or clearing your search query.</p>
          </div>
        ) : (
          filteredSteps.map((step) => {
            const status = (completedMap[step.id] as StepStatus) || 'not-started';
            return (
              <StepCard
                key={step.id}
                step={step}
                status={status}
                onStatusChange={(newStatus) => setStepStatus(step.id, newStatus)}
                target={target}
                activeCredential={activeCredential}
              />
            );
          })
        )}
      </div>

      {/* Phase Stepper Next Advance Button */}
      {viewMode === 'stepper' && availablePhases.length > 1 && currentPhaseIndex < availablePhases.length - 1 && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              const nextPhase = availablePhases[currentPhaseIndex + 1];
              if (nextPhase) setSelectedPhase(nextPhase.id);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Proceed to Next Phase ({availablePhases[currentPhaseIndex + 1]?.label})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
