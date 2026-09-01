'use client';

import React, { useState, useMemo } from 'react';
import {
  KNOWLEDGE_NOTES,
  KnowledgeNoteItem,
  searchKnowledgeNotes,
} from '@/lib/notesKnowledgeData';
import { Target, Credential } from '@/types';
import { useTargetStore } from '@/store/useTargetStore';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  FileText,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Tag,
  Shield,
  Zap,
  Terminal,
  FolderOpen,
  ArrowRight,
  Hash,
  Layers,
  Code2,
  List,
} from 'lucide-react';

interface KnowledgeBaseHubProps {
  target: Target | null;
  activeCredential?: Credential | null;
}

export const KnowledgeBaseHub: React.FC<KnowledgeBaseHubProps> = ({
  target,
  activeCredential,
}) => {
  const { updateNotes } = useTargetStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    KNOWLEDGE_NOTES[0]?.id || ''
  );
  const [interpolateVars, setInterpolateVars] = useState(true);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [appendFeedback, setAppendFeedback] = useState(false);
  const [showToc, setShowToc] = useState(false);

  // Extract unique categories in order
  const categories = useMemo(() => {
    const set = new Set<string>();
    KNOWLEDGE_NOTES.forEach((n) => {
      if (n.category) set.add(n.category);
    });
    return Array.from(set);
  }, []);

  // Filter notes based on category and search query
  const filteredNotes = useMemo(() => {
    return searchKnowledgeNotes(searchQuery, selectedCategory);
  }, [selectedCategory, searchQuery]);

  const currentNote = useMemo(() => {
    return (
      filteredNotes.find((n) => n.id === selectedNoteId) ||
      filteredNotes[0] ||
      KNOWLEDGE_NOTES[0]
    );
  }, [filteredNotes, selectedNoteId]);

  // Interpolate placeholders like <target>, <target-ip>, <target_ip>, {{TARGET}}, <user>, <password>, <domain>, <hash>
  const resolvedContent = useMemo(() => {
    if (!currentNote) return '';
    let text = currentNote.content;

    if (interpolateVars && target) {
      const ip = target.ipOrHostname || '10.10.10.10';
      const user = activeCredential?.username || target.shellState?.user || 'administrator';
      const pass = activeCredential?.password || 'Password123!';
      const hash = activeCredential?.hash || 'aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0';
      const domain = target.domain || 'corp.local';

      text = text
        .replace(/<target(?:-ip|_ip)?>|<IP>|<target-host>|\{\{TARGET\}\}/gi, ip)
        .replace(/<user(?:name)?>|<attacker-user>|\{\{USERNAME\}\}/gi, user)
        .replace(/<password>|\{\{PASSWORD\}\}/gi, pass)
        .replace(/<hash>|<nthash>|\{\{HASH\}\}/gi, hash)
        .replace(/<domain(?:-name)?>|<realm>|\{\{DOMAIN\}\}/gi, domain);
    }

    return text;
  }, [currentNote, interpolateVars, target, activeCredential]);

  const handleCopyCode = (code: string, index: number) => {
    let resolvedCode = code;
    if (interpolateVars && target) {
      const ip = target.ipOrHostname || '10.10.10.10';
      const user = activeCredential?.username || target.shellState?.user || 'administrator';
      const pass = activeCredential?.password || 'Password123!';
      const hash = activeCredential?.hash || 'aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0';
      const domain = target.domain || 'corp.local';

      resolvedCode = resolvedCode
        .replace(/<target(?:-ip|_ip)?>|<IP>|<target-host>|\{\{TARGET\}\}/gi, ip)
        .replace(/<user(?:name)?>|<attacker-user>|\{\{USERNAME\}\}/gi, user)
        .replace(/<password>|\{\{PASSWORD\}\}/gi, pass)
        .replace(/<hash>|<nthash>|\{\{HASH\}\}/gi, hash)
        .replace(/<domain(?:-name)?>|<realm>|\{\{DOMAIN\}\}/gi, domain);
    }

    navigator.clipboard.writeText(resolvedCode);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 1500);
  };

  const handleAppendToTargetNotes = () => {
    if (!target || !currentNote) return;
    const existing = target.notes || '';
    const addition = `\n\n## [Field Manual] ${currentNote.title}\n${resolvedContent}\n`;
    updateNotes(existing + addition);
    setAppendFeedback(true);
    setTimeout(() => setAppendFeedback(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Hub Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 shadow-cyber-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-100">
                    Field Manual & Knowledge Hub
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                    {KNOWLEDGE_NOTES.length} Guides
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Comprehensive offline penetration testing checklists, Active Directory attack flows, privilege escalation methods, web security techniques, and field notes.
                </p>
              </div>
            </div>
          </div>

          {/* Interpolation Toggle */}
          {target && (
            <div className="flex items-center gap-2 text-xs bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Live Target Injection:</span>
              <button
                type="button"
                onClick={() => setInterpolateVars(!interpolateVars)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                  interpolateVars
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-cyber-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {interpolateVars ? `ON (${target.ipOrHostname})` : 'OFF (Raw <tags>)'}
              </button>
            </div>
          )}
        </div>

        {/* Search & Category Filter Pills */}
        <div className="space-y-3 pt-2 border-t border-slate-800/60">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search all 65 guides, tools, and commands (e.g. bloodhound, certipy, silver ticket, linpeas, ffuf, jwt, docker)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              All Guides ({KNOWLEDGE_NOTES.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Notes Index List */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-[#0b1120] p-3 space-y-1.5 max-h-[75vh] overflow-y-auto text-xs">
          <div className="px-2 py-1 text-[11px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Documents ({filteredNotes.length})</span>
            {selectedCategory !== 'all' && (
              <span className="text-emerald-400 font-normal truncate max-w-[140px]">
                {selectedCategory}
              </span>
            )}
          </div>

          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-slate-500 italic">
              No matching guides found for "{searchQuery}".
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = currentNote?.id === note.id;
              return (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700 shadow-cyber-sm'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5 truncate flex-1">
                    <div className="font-semibold text-xs truncate">
                      {note.title}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate flex items-center gap-1.5">
                      <FolderOpen className="w-2.5 h-2.5 text-slate-600 shrink-0" />
                      <span className="truncate">{note.subcategory || note.category}</span>
                      {note.commands.length > 0 && (
                        <span className="text-cyan-500 shrink-0">({note.commands.length} cmds)</span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Right Side: Active Guide Document Viewer */}
        <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-[#0b1120] p-6 shadow-cyber-md space-y-6 max-h-[85vh] overflow-y-auto">
          {currentNote ? (
            <div className="space-y-6">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-cyan-400 border border-slate-800">
                      {currentNote.category}
                    </span>
                    {currentNote.subcategory && (
                      <span className="text-xs text-slate-500">
                        / {currentNote.subcategory}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      • {(currentNote.size / 1024).toFixed(1)} KB ({currentNote.lineCount} lines)
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                    {currentNote.title}
                  </h1>

                  {/* Tags */}
                  {currentNote.tags && currentNote.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {currentNote.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.2 rounded text-[10px] bg-slate-900/80 text-slate-400 border border-slate-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {currentNote.headings && currentNote.headings.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowToc(!showToc)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                        showToc
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                      title="Toggle Table of Contents"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">TOC</span>
                    </button>
                  )}

                  {target && (
                    <button
                      type="button"
                      onClick={handleAppendToTargetNotes}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-sm"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{appendFeedback ? '✓ Appended!' : 'Append to Notes'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Table of Contents Drawer */}
              {showToc && currentNote.headings && currentNote.headings.length > 0 && (
                <div className="p-4 rounded-xl bg-[#060a14] border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Table of Contents</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                    {currentNote.headings.map((h, idx) => (
                      <div
                        key={idx}
                        className={`truncate py-0.5 text-slate-400 hover:text-emerald-300 cursor-pointer ${
                          h.level === 1 ? 'font-bold text-slate-200' : h.level === 2 ? 'pl-2' : 'pl-4 text-slate-500'
                        }`}
                      >
                        {h.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Command Cards Quick-Access Carousel */}
              {currentNote.commands && currentNote.commands.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-bold text-slate-300">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Quick Command Snippets ({currentNote.commands.length})</span>
                    </span>
                    <span className="text-[11px] text-slate-500">1-Click Live Target Copy</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto">
                    {currentNote.commands.slice(0, 10).map((cmd, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#060a14] border border-slate-800 flex items-center justify-between gap-3 group hover:border-emerald-800/80 transition-colors"
                      >
                        <div className="overflow-hidden flex-1">
                          <span className="text-[10px] text-slate-500 uppercase block mb-0.5">
                            {cmd.language || 'bash'}
                          </span>
                          <code className="text-xs text-emerald-300 truncate block font-mono">
                            {cmd.code.split('\n')[0]}
                          </code>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(cmd.code, idx)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-700 text-xs text-slate-300 hover:text-emerald-400 flex items-center gap-1 transition-all shrink-0"
                          title="Copy command with target interpolation"
                        >
                          {copiedCodeIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 text-[11px]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="text-[11px]">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Rendered Markdown Body */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Full Document Content
                </div>
                <pre className="p-4 rounded-xl bg-[#060a14] border border-slate-800 text-slate-200 text-xs whitespace-pre-wrap overflow-x-auto leading-relaxed selection:bg-emerald-500/30">
                  {resolvedContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select a guide from the left index to view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
