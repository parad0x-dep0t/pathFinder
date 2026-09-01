'use client';

import React, { useState, useMemo } from 'react';
import {
  NOTION_CPTS_NOTES,
  NotionNoteItem,
  searchNotionNotes,
} from '@/lib/notionNotesData';
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
} from 'lucide-react';

interface NotionKnowledgeHubProps {
  target: Target | null;
  activeCredential?: Credential | null;
}

export const NotionKnowledgeHub: React.FC<NotionKnowledgeHubProps> = ({
  target,
  activeCredential,
}) => {
  const { updateNotes } = useTargetStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    NOTION_CPTS_NOTES[0]?.id || ''
  );
  const [interpolateVars, setInterpolateVars] = useState(true);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [appendFeedback, setAppendFeedback] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    NOTION_CPTS_NOTES.forEach((n) => {
      if (n.category) set.add(n.category);
    });
    return Array.from(set);
  }, []);

  // Filter notes based on category and search query
  const filteredNotes = useMemo(() => {
    let list = NOTION_CPTS_NOTES;
    if (selectedCategory !== 'all') {
      list = list.filter((n) => n.category === selectedCategory);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const currentNote = useMemo(() => {
    return (
      filteredNotes.find((n) => n.id === selectedNoteId) ||
      filteredNotes[0] ||
      NOTION_CPTS_NOTES[0]
    );
  }, [filteredNotes, selectedNoteId]);

  // Interpolate placeholders like <target>, <target-ip>, <user>, <password>, <domain>
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
        .replace(/<target(?:-ip)?>|<IP>|<target-host>/gi, ip)
        .replace(/<user(?:name)?>|<attacker-user>/gi, user)
        .replace(/<password>/gi, pass)
        .replace(/<hash>/gi, hash)
        .replace(/<domain(?:-name)?>|<realm>/gi, domain);
    }

    return text;
  }, [currentNote, interpolateVars, target, activeCredential]);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 1500);
  };

  const handleAppendToTargetNotes = () => {
    if (!target || !currentNote) return;
    const existing = target.notes || '';
    const addition = `\n\n## [CPTS Playbook] ${currentNote.title}\n${resolvedContent}\n`;
    updateNotes(existing + addition);
    setAppendFeedback(true);
    setTimeout(() => setAppendFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hub Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-100 font-mono">
                    CPTS Playbook & Field Manual
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                    {NOTION_CPTS_NOTES.length} Guides
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Comprehensive offline penetration testing methodology, enumeration cheatsheets, privilege escalation guides, and procedures.
                </p>
              </div>
            </div>
          </div>

          {/* Interpolation Toggle */}
          {target && (
            <div className="flex items-center gap-2 font-mono text-xs bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Live Variable Target:</span>
              <button
                type="button"
                onClick={() => setInterpolateVars(!interpolateVars)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
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
              placeholder="Search all 28 CPTS guides, tools, commands, and vectors (e.g. mssql, impacket, potato, chisel, bloodhound)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              All Guides ({NOTION_CPTS_NOTES.length})
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
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-[#0b1120] p-3 space-y-1.5 max-h-[75vh] overflow-y-auto font-mono text-xs">
          <div className="px-2 py-1 text-[11px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Sections ({filteredNotes.length})</span>
            {selectedCategory !== 'all' && (
              <span className="text-emerald-400 font-normal truncate max-w-[120px]">
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
                    <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                      <FolderOpen className="w-2.5 h-2.5 text-slate-600" />
                      <span>{note.category}</span>
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
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-cyan-400 border border-slate-800">
                      {currentNote.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {(currentNote.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
                    {currentNote.title}
                  </h1>
                </div>

                {target && (
                  <button
                    type="button"
                    onClick={handleAppendToTargetNotes}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-sm shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{appendFeedback ? '✓ Appended to Notes!' : 'Append to Target Notes'}</span>
                  </button>
                )}
              </div>

              {/* Rendered Markdown Body */}
              <div className="prose prose-invert max-w-none font-sans text-xs text-slate-300 space-y-4 leading-relaxed">
                <pre className="p-4 rounded-xl bg-[#060a14] border border-slate-800 text-slate-200 font-mono text-xs whitespace-pre-wrap overflow-x-auto selection:bg-emerald-500/30">
                  {resolvedContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              Select a guide from the left list to view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
