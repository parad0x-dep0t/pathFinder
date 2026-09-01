'use client';

import React, { useState, useEffect } from 'react';
import { useTargetStore } from '@/store/useTargetStore';
import { getPlaybookById } from '@/lib/playbooks';
import { Target } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { RecommendationBanner } from '@/components/recommendations/RecommendationBanner';
import { PlaybookView } from '@/components/playbooks/PlaybookView';
import { CredentialsVault } from '@/components/credentials/CredentialsVault';
import { ShellStateView } from '@/components/shell/ShellStateView';
import { NotesEditor } from '@/components/notes/NotesEditor';
import { TargetModal } from '@/components/targets/TargetModal';
import { NmapImportModal } from '@/components/nmap/NmapImportModal';
import { TargetRoadmapView } from '@/components/roadmap/TargetRoadmapView';
// import { AttackGraphView } from '@/components/graph/AttackGraphView';
import { ResetConfirmModal } from '@/components/common/ResetConfirmModal';
// import { WelcomeModeModal } from '@/components/layout/WelcomeModeModal';
import { Crosshair, ShieldCheck, Terminal, Compass, Network, Sparkles, BookOpen } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isNmapModalOpen, setIsNmapModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [targetToEdit, setTargetToEdit] = useState<Target | null>(null);

  const {
    targets,
    activeTargetId,
    activeCredentialId,
    activePlaybookId,
    activeView,
    setActivePlaybookId,
    setActiveView,
    resetAllData,
  } = useTargetStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400 animate-spin" />
          <span>Initializing Pathfinder Environment...</span>
        </div>
      </div>
    );
  }

  const activeTarget = activeTargetId ? targets[activeTargetId] || null : null;
  const activeCredential = activeTarget?.credentials?.find(
    (c) => c.id === activeCredentialId
  ) || null;

  const currentPlaybook = getPlaybookById(activePlaybookId);

  const handleOpenTargetModal = (target?: Target) => {
    setTargetToEdit(target || null);
    setIsTargetModalOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050811] text-slate-200">
      {/* Sidebar */}
      <Sidebar
        target={activeTarget}
        onOpenTargetModal={handleOpenTargetModal}
        onOpenNmapModal={() => setIsNmapModalOpen(true)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeTarget ? (
          <>
            {/* Top Workspace Banner */}
            <Header
              target={activeTarget}
              activeCredential={activeCredential}
              onOpenNewTargetModal={() => handleOpenTargetModal()}
              onOpenNmapModal={() => setIsNmapModalOpen(true)}
              onOpenResetModal={() => setIsResetModalOpen(true)}
            />

            {/* Scrollable Viewport */}
            <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
              {/* Dynamic Recommendation Banner */}
              <RecommendationBanner
                target={activeTarget}
                activeCredential={activeCredential}
              />

              {/* View Router (Roadmap default) */}
              {(activeView === 'roadmap' || activeView === 'graph') && (
                <TargetRoadmapView
                  target={activeTarget}
                  activeCredential={activeCredential}
                  onSelectPlaybook={(pId) => {
                    setActivePlaybookId(pId);
                    setActiveView('playbook');
                  }}
                />
              )}

              {/* Attack Graph View temporarily commented out
              {activeView === 'graph' && (
                <AttackGraphView
                  onOpenTargetModal={handleOpenTargetModal}
                  onOpenNmapModal={() => setIsNmapModalOpen(true)}
                />
              )}
              */}

              {activeView === 'playbook' && (
                currentPlaybook ? (
                  <PlaybookView
                    playbook={currentPlaybook}
                    target={activeTarget}
                    activeCredential={activeCredential}
                  />
                ) : (
                  <div className="p-8 rounded-xl border border-slate-800 bg-[#0b1120] text-center space-y-3 font-mono">
                    <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-sm text-slate-300 font-bold">No Playbook Selected</p>
                    <p className="text-xs text-slate-500">
                      Select a playbook from the sidebar (e.g. SMB, HTTP, Kerberos, Linux PrivEsc) to view guided steps.
                    </p>
                  </div>
                )
              )}

              {activeView === 'credentials' && (
                <CredentialsVault target={activeTarget} />
              )}

              {activeView === 'shell' && (
                <ShellStateView target={activeTarget} />
              )}

              {activeView === 'notes' && <NotesEditor target={activeTarget} />}
            </main>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="max-w-xl w-full space-y-6 rounded-2xl border border-slate-800 bg-[#0b1120] p-8 shadow-cyber-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 w-14 h-14 mx-auto flex items-center justify-center text-emerald-400 shadow-cyber-sm">
                <Compass className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
                  Pathfinder Methodology Companion
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  Interactive penetration testing playbook assistant. Add a target machine manually or import an Nmap scan output to activate guided methodology playbooks.
                </p>
              </div>

              {/* 3-Step Guide */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                  <span className="text-emerald-400 font-bold block">01. Add Target</span>
                  <span className="text-slate-400 leading-relaxed block">
                    Enter target IP <span className="text-slate-500">(e.g. 10.10.11.45)</span> or import Nmap scan.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                  <span className="text-cyan-400 font-bold block">02. Select Ports</span>
                  <span className="text-slate-400 leading-relaxed block">
                    Toggle open services <span className="text-slate-500">(e.g. 80, 445, 88)</span>.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                  <span className="text-amber-400 font-bold block">03. Follow Steps</span>
                  <span className="text-slate-400 leading-relaxed block">
                    Execute guided commands & track foothold.
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsNmapModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-mono font-bold text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-cyan-800/80 hover:border-cyan-500 shadow-cyber-sm transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  <Network className="w-4 h-4 text-cyan-400" />
                  <span>⚡ Import Nmap Output</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenTargetModal()}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-cyber-md transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>+ Create Target Manually</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Target Modal */}
      <TargetModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        targetToEdit={targetToEdit}
      />

      {/* Nmap Import Modal */}
      <NmapImportModal
        isOpen={isNmapModalOpen}
        onClose={() => setIsNmapModalOpen(false)}
        activeTarget={activeTarget}
      />

      {/* Start Fresh Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetAllData}
      />
    </div>
  );
}
