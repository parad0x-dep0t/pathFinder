'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, Zap, Compass, CheckCircle2 } from 'lucide-react';
import { Target, Credential } from '@/types';
import { getRecommendedSteps } from '@/lib/recommender';
import { useTargetStore } from '@/store/useTargetStore';

interface RecommendationBannerProps {
  target: Target;
  activeCredential?: Credential | null;
}

export const RecommendationBanner: React.FC<RecommendationBannerProps> = ({
  target,
  activeCredential,
}) => {
  const { setActivePlaybookId, setStepStatus } = useTargetStore();
  const recommendations = getRecommendedSteps(target);

  if (recommendations.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 flex items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>All immediate tactical playbooks and steps for current open ports have been reviewed.</span>
        </div>
      </div>
    );
  }

  const primaryRec = recommendations[0];

  const handleJumpToStep = () => {
    setActivePlaybookId(primaryRec.playbookId);
    setTimeout(() => {
      const el = document.getElementById(`step-${primaryRec.stepId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const getPriorityStyles = (p: string) => {
    switch (p) {
      case 'critical':
        return {
          badge: 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse',
          border: 'border-rose-900/60 bg-gradient-to-r from-rose-950/20 via-slate-900/80 to-slate-900/80',
          icon: ShieldAlert,
          iconColor: 'text-rose-400',
        };
      case 'high':
        return {
          badge: 'bg-amber-950 text-amber-300 border-amber-800',
          border: 'border-amber-900/60 bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-slate-900/80',
          icon: Zap,
          iconColor: 'text-amber-400',
        };
      default:
        return {
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
          border: 'border-emerald-900/60 bg-gradient-to-r from-emerald-950/20 via-slate-900/80 to-slate-900/80',
          icon: Compass,
          iconColor: 'text-emerald-400',
        };
    }
  };

  const meta = getPriorityStyles(primaryRec.priority);
  const Icon = meta.icon;

  return (
    <div className={`rounded-xl border p-4 shadow-cyber-sm transition-all ${meta.border}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left info */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Recommended Next Tactical Action</span>
            </div>
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold ${meta.badge}`}
            >
              {primaryRec.priority}
            </span>
          </div>

          <div className="flex items-start gap-2.5 pt-0.5">
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${meta.iconColor}`} />
            <div>
              <h4 className="text-sm md:text-base font-bold text-slate-100">
                {primaryRec.title}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {primaryRec.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="text-slate-500">Trigger Reason:</span>
                <span className="text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                  {primaryRec.reason}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={() => setStepStatus(primaryRec.stepId, 'completed')}
            className="px-3 py-2 rounded-lg text-xs font-mono font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-emerald-300 border border-slate-700 transition-colors"
            title="Mark this recommended step as completed"
          >
            Mark Done
          </button>
          <button
            type="button"
            onClick={handleJumpToStep}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-cyber-sm transition-transform hover:scale-105"
          >
            <span>Jump to Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
