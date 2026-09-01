'use client';

import React from 'react';
import { AlertTriangle, Trash2, X, RotateCcw, Sparkles } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-cyber-md space-y-0">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-mono">
                Start Fresh Engagement
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Workspace Reset Confirmation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs font-mono leading-relaxed text-slate-300">
          <p>
            Are you sure you want to clear out your existing workspace data?
          </p>
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/50 space-y-2 text-amber-200/90 font-sans text-xs">
            <p className="font-semibold flex items-center gap-1.5 text-amber-300">
              <Trash2 className="w-4 h-4" />
              The following will be reset:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li>All targets & discovered open ports</li>
              <li>Stored credentials and password hashes</li>
              <li>Interactive shell status & privileges</li>
              <li>Engagement notes & custom variables</li>
              <li>Methodology checklist progress</li>
            </ul>
          </div>
          <p className="text-slate-400 text-[11px]">
            You will have a completely clean start ready for your next CTF machine or penetration test.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-4 bg-slate-950/60 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Data & Start Fresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
