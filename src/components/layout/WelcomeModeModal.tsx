'use client';

import React from 'react';
import {
  Compass,
  Network,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Layers,
  Zap,
  Globe,
  Radio,
  X,
} from 'lucide-react';
import { ActiveView } from '@/types';
import { useTargetStore } from '@/store/useTargetStore';

interface WelcomeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: 'roadmap' | 'graph') => void;
  onOpenNmapModal?: () => void;
  onOpenTargetModal?: () => void;
}

export const WelcomeModeModal: React.FC<WelcomeModeModalProps> = ({
  isOpen,
  onClose,
  onSelectMode,
  onOpenNmapModal,
  onOpenTargetModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-4xl w-full rounded-3xl border border-slate-800 bg-[#080d1a] p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden text-slate-200 font-mono">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button if user already had a session */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
          title="Close and continue"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-slate-300">PATHFINDER v2.0</span>
            <span>•</span>
            <span className="text-cyan-400">CTF & PENTEST METHODOLOGY</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Choose Your Operational View
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Select how you would like to navigate your penetration testing engagement. You can seamlessly switch between views at any time.
          </p>
        </div>

        {/* Two Separate Interactive Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Card 1: ROADMAP VIEW */}
          <div
            onClick={() => {
              onSelectMode('roadmap');
              onClose();
            }}
            className="group relative rounded-2xl border border-slate-800 hover:border-emerald-500/80 bg-gradient-to-b from-[#0b1120] to-emerald-950/20 p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-cyber-md hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  STRUCTURED
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                  5-Phase Methodology Roadmap
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Linear, step-by-step penetration testing checklist across 5 engagement phases: Reconnaissance, Service Enumeration, Foothold, Privilege Escalation, and Post-Exploitation.
                </p>
              </div>

              {/* Feature bullets */}
              <div className="space-y-2 pt-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Phase-by-phase execution checklist</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Adaptive Beginner / Inter / Pro modes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>40 Modular Service Playbooks</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>Launch Roadmap Mode</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: ATTACK GRAPH & MINDMAP VIEW */}
          <div
            onClick={() => {
              onSelectMode('graph');
              onClose();
            }}
            className="group relative rounded-2xl border border-slate-800 hover:border-cyan-500/80 bg-gradient-to-b from-[#0b1120] to-cyan-950/20 p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-cyber-cyan hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Network className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  BLOODHOUND STYLE
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  Interactive Attack Graph & Mindmap
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Visual node-based attack tree inspired by BloodHound & the Orange Cyberdefense AD mindmap. Click on ports and attack nodes to inspect commands in the side drawer.
                </p>
              </div>

              {/* Feature bullets */}
              <div className="space-y-2 pt-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Target $\rightarrow$ Port $\rightarrow$ Attack branch tree</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Right-hand BloodHound command drawer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Active attack path glowing vectors</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
              <span>Launch Attack Graph Mode</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="mt-8 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Shortcut: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">Alt + V</kbd> to toggle views instantly anytime.</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenNmapModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNmapModal();
                }}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
              >
                ⚡ Import Nmap Scan
              </button>
            )}
            {onOpenTargetModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTargetModal();
                }}
                className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                + Create Target
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
