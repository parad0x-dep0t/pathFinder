'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  CircleDashed,
  SkipForward,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  FileTerminal,
  ShieldCheck,
  Shield,
  Compass,
  Flame,
  Zap,
  ExternalLink,
  Check,
  XCircle,
  Info,
} from 'lucide-react';
import { PlaybookStep, StepStatus, Target, Credential, StepPhase } from '@/types';
import { CommandBlock } from './CommandBlock';
import { useTargetStore } from '@/store/useTargetStore';

interface StepCardProps {
  step: PlaybookStep;
  status: StepStatus;
  onStatusChange: (status: StepStatus) => void;
  target: Target;
  activeCredential?: Credential | null;
  isHighlighted?: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  status,
  onStatusChange,
  target,
  activeCredential,
  isHighlighted = false,
}) => {
  const { experienceLevel } = useTargetStore();
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showExpectedOutput, setShowExpectedOutput] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);

  const getPhaseBadge = (phase: StepPhase) => {
    switch (phase) {
      case 'reconnaissance':
        return {
          label: 'Recon',
          color: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
          icon: Compass,
        };
      case 'enumeration':
        return {
          label: 'Enum',
          color: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
          icon: Zap,
        };
      case 'exploitation':
        return {
          label: 'Exploit',
          color: 'bg-rose-950/70 text-rose-300 border-rose-800/60',
          icon: Flame,
        };
      case 'privesc':
        return {
          label: 'PrivEsc',
          color: 'bg-purple-950/70 text-purple-300 border-purple-800/60',
          icon: ShieldCheck,
        };
      case 'post-exploitation':
        return {
          label: 'Post-Exploit',
          color: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60',
          icon: Shield,
        };
      default:
        return {
          label: 'Action',
          color: 'bg-slate-900 text-slate-300 border-slate-700',
          icon: Zap,
        };
    }
  };

  const phaseMeta = getPhaseBadge(step.phase);
  const PhaseIcon = phaseMeta.icon;

  const getStatusColor = (st: StepStatus) => {
    switch (st) {
      case 'completed':
        return 'border-emerald-500/50 bg-emerald-950/20';
      case 'in-progress':
        return 'border-amber-500/50 bg-amber-950/20';
      case 'skipped':
        return 'border-slate-700 bg-slate-900/40 opacity-70';
      default:
        return 'border-slate-800 bg-[#0b1120]/90';
    }
  };

  const getReferenceLabel = (url: string) => {
    if (url.includes('gtfobins')) return 'GTFOBins';
    if (url.includes('lolbas')) return 'LOLBAS';
    if (url.includes('hacktricks')) return 'HackTricks';
    if (url.includes('wadcoms')) return 'WadComs';
    if (url.includes('PayloadsAllTheThings')) return 'PayloadsAllTheThings';
    if (url.includes('portswigger')) return 'PortSwigger';
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return 'Docs';
    }
  };

  // Determine visibility based on Experience Level
  const isProMode = experienceLevel === 'advanced' && !showCardDetails;
  const isIntermediateMode = experienceLevel === 'intermediate' && !showCardDetails;
  const showFullBeginnerDetails = experienceLevel === 'beginner' || showCardDetails;

  return (
    <div
      id={`step-${step.id}`}
      className={`rounded-xl border transition-all ${
        isProMode ? 'p-3 space-y-2' : 'p-4 sm:p-5 space-y-3.5'
      } ${getStatusColor(status)} ${
        isHighlighted ? 'ring-2 ring-emerald-500/80 shadow-cyber-sm' : 'shadow-sm'
      }`}
    >
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Phase Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono border font-medium ${phaseMeta.color}`}
            >
              <PhaseIcon className="w-3 h-3" />
              <span>{phaseMeta.label}</span>
            </span>

            {/* Status indicator pill */}
            {status === 'completed' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Done</span>
              </span>
            )}
            {status === 'in-progress' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-700 font-semibold">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Running</span>
              </span>
            )}
            {status === 'skipped' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-700">
                <SkipForward className="w-3 h-3" />
                <span>Skipped</span>
              </span>
            )}

            {/* Per-card toggle to expand/collapse details */}
            {(experienceLevel === 'intermediate' || experienceLevel === 'advanced') && (
              <button
                type="button"
                onClick={() => setShowCardDetails(!showCardDetails)}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  showCardDetails
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700 font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title={showCardDetails ? 'Hide full details' : 'Show full beginner details for this step'}
              >
                <Info className="w-3 h-3" />
                <span>{showCardDetails ? 'Compact' : 'Details'}</span>
              </button>
            )}
          </div>

          <h3 className={`${isProMode ? 'text-sm font-semibold' : 'text-base sm:text-lg font-bold'} text-slate-100 leading-snug`}>
            {step.title}
          </h3>

          {!isProMode && (
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {step.purpose}
            </p>
          )}
        </div>

        {/* Step Status Controls */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 shrink-0 self-start">
          <button
            type="button"
            onClick={() => onStatusChange('not-started')}
            title="Reset to Not Started"
            className={`p-1.5 rounded text-xs font-mono transition-colors ${
              status === 'not-started'
                ? 'bg-slate-800 text-slate-200 font-bold shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <CircleDashed className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('in-progress')}
            title="Mark In Progress"
            className={`p-1.5 rounded text-xs font-mono transition-colors ${
              status === 'in-progress'
                ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold'
                : 'text-slate-500 hover:text-amber-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('completed')}
            title="Mark Completed"
            className={`p-1.5 rounded text-xs font-mono transition-colors ${
              status === 'completed'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold shadow-cyber-sm'
                : 'text-slate-500 hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('skipped')}
            title="Skip this step"
            className={`p-1.5 rounded text-xs font-mono transition-colors ${
              status === 'skipped'
                ? 'bg-slate-800 text-slate-400 font-bold'
                : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Command Block with Variable Resolution */}
      <div>
        <CommandBlock
          commandTemplate={step.command}
          target={target}
          activeCredential={activeCredential}
        />
      </div>

      {/* Beginner Mode: Decision Branching (If Success / If Failure) */}
      {showFullBeginnerDetails && (step.if_success || step.if_failure) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          {step.if_success && (
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-emerald-200/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>If Successful / Valid:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                {step.if_success}
              </p>
            </div>
          )}

          {step.if_failure && (
            <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-rose-200/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-400">
                <XCircle className="w-3.5 h-3.5" />
                <span>If Unsuccessful / Blocked:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                {step.if_failure}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Accordions & References */}
      {!isProMode && (
        <div className="space-y-2 text-xs">
          {/* Expected Output Accordion (Shown in Beginner mode or when expanded) */}
          {showFullBeginnerDetails && step.expected_output && step.expected_output.length > 0 && (
            <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowExpectedOutput(!showExpectedOutput)}
                className="w-full flex items-center justify-between px-3 py-2 text-left font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileTerminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold">Expected Terminal Output ({step.expected_output.length})</span>
                </div>
                {showExpectedOutput ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {showExpectedOutput && (
                <div className="p-3 border-t border-slate-800/60 bg-[#050914] space-y-2">
                  {step.expected_output.map((out, idx) => (
                    <pre
                      key={idx}
                      className="p-2.5 rounded bg-slate-900/90 text-cyan-200 font-mono text-[11px] whitespace-pre-wrap border border-slate-800/80 overflow-x-auto"
                    >
                      {out}
                    </pre>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Common Mistakes Accordion (Shown in Beginner and Intermediate) */}
          {step.common_mistakes && step.common_mistakes.length > 0 && (
            <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowMistakes(!showMistakes)}
                className="w-full flex items-center justify-between px-3 py-2 text-left font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">Common Pitfalls & Mistakes ({step.common_mistakes.length})</span>
                </div>
                {showMistakes ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {showMistakes && (
                <div className="p-3 border-t border-slate-800/60 bg-amber-950/10">
                  <ul className="space-y-1.5 list-disc list-inside text-amber-200/90 leading-relaxed font-sans text-xs">
                    {step.common_mistakes.map((mistake, idx) => (
                      <li key={idx} className="pl-1">
                        <span className="text-slate-300">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Outbound Documentation References */}
          {step.references && step.references.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              <span className="text-[10px] font-mono text-slate-500">References:</span>
              {step.references.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/90 text-cyan-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700 transition-colors"
                >
                  <span>{getReferenceLabel(url)}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
