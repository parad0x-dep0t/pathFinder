'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  Eye,
  Edit3,
  Save,
  Check,
  Code,
  List,
  Heading,
  Terminal,
  Columns,
  Sparkles,
} from 'lucide-react';
import { Target } from '@/types';
import { useTargetStore } from '@/store/useTargetStore';

interface NotesEditorProps {
  target: Target;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({ target }) => {
  const { updateNotes } = useTargetStore();
  const [content, setContent] = useState(target.notes || '');
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = () => {
    updateNotes(content);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const insertTemplate = (templateType: string) => {
    let snippet = '';
    switch (templateType) {
      case 'vuln':
        snippet = `\n\n### Vulnerability Finding: [Vulnerability Name]
- **Service/Port:** \n- **Severity:** High / Critical
- **Description:** \n
\`\`\`bash
# Proof of Concept / Exploitation Command
\`\`\`
- **Impact & Fix:** \n`;
        break;
      case 'cred':
        snippet = `\n\n### Discovered Credential
| Username | Password / NTLM Hash | Domain | Service / Port | Privileges |
| :--- | :--- | :--- | :--- | :--- |
| admin | Summer2024! | corp.local | SMB / 445 | Local Administrator |
`;
        break;
      case 'flag':
        snippet = `\n\n### Flag Capture
- **Type:** User / Root
- **Flag Value:** \`HTB{...}\`
- **Proof Command:** \`whoami && cat /root/root.txt\`
`;
        break;
      case 'checklist':
        snippet = `\n\n### Next Steps Checklist
- [ ] Scan full TCP port range (1-65535)
- [ ] Check for top UDP services (SNMP, TFTP, DNS)
- [ ] Fuzz web virtual hosts and API directories (\`ffuf\`)
- [ ] Check SUID binaries and Sudo rights (\`sudo -l\`)
- [ ] Enumerate Active Directory Kerberoastable SPNs
`;
        break;
    }
    setContent((prev) => prev + snippet);
    updateNotes(content + snippet);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">Target Notes & Findings</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-900 text-slate-400 border border-slate-800">
              {target.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Store target recon notes, vulnerability documentation, flag captures, and loot in GitHub-Flavored Markdown.
          </p>
        </div>

        {/* View Mode Controls & Save */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex items-center gap-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                mode === 'edit'
                  ? 'bg-slate-800 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors hidden md:flex ${
                mode === 'split'
                  ? 'bg-slate-800 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                mode === 'preview'
                  ? 'bg-slate-800 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              savedFeedback
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-cyber-sm'
            }`}
          >
            {savedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Snippet Insert Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <span className="text-slate-500 text-[11px] shrink-0">Insert Template:</span>
        <button
          type="button"
          onClick={() => insertTemplate('vuln')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-slate-700 whitespace-nowrap transition-colors"
        >
          + Vulnerability Finding
        </button>
        <button
          type="button"
          onClick={() => insertTemplate('cred')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-slate-700 whitespace-nowrap transition-colors"
        >
          + Credential Table
        </button>
        <button
          type="button"
          onClick={() => insertTemplate('flag')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-slate-700 whitespace-nowrap transition-colors"
        >
          + Flag Capture
        </button>
        <button
          type="button"
          onClick={() => insertTemplate('checklist')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-purple-300 hover:border-slate-700 whitespace-nowrap transition-colors"
        >
          + Next Steps Checklist
        </button>
      </div>

      {/* Editor Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Textarea Editor */}
        {(mode === 'edit' || mode === 'split') && (
          <div className={`space-y-1.5 ${mode === 'edit' ? 'md:col-span-2' : ''}`}>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                updateNotes(e.target.value);
              }}
              rows={22}
              placeholder="Type markdown notes here... Supports GitHub Flavored Markdown (tables, checklists, code fences, etc.)"
              className="w-full bg-[#070d19] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y selection:bg-emerald-500/40"
            />
          </div>
        )}

        {/* Rich GFM Live Preview */}
        {(mode === 'preview' || mode === 'split') && (
          <div
            className={`rounded-xl border border-slate-800 bg-[#0b1120] p-5 overflow-y-auto max-h-[500px] ${
              mode === 'preview' ? 'md:col-span-2' : ''
            }`}
          >
            <div className="text-[11px] font-mono uppercase text-slate-500 mb-3 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span>GitHub-Flavored Markdown Preview</span>
              <span className="text-emerald-400">● Live GFM</span>
            </div>

            {content.trim() === '' ? (
              <p className="text-xs text-slate-500 italic">No notes content to preview.</p>
            ) : (
              <div className="prose prose-invert prose-emerald max-w-none text-xs leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-lg font-bold text-emerald-400 mt-4 mb-2 pb-1 border-b border-slate-800 font-mono" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-base font-bold text-cyan-300 mt-3 mb-1.5 pb-1 border-b border-slate-800/80 font-mono" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-sm font-semibold text-slate-100 mt-2.5 mb-1 font-mono" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-3">
                        <table className="min-w-full text-xs font-mono border-collapse border border-slate-800 bg-slate-950/60" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th className="border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-left text-slate-300 font-semibold" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border border-slate-800 px-3 py-1.5 text-slate-300" {...props} />
                    ),
                    code: ({ node, className, children, ...props }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="px-1.5 py-0.5 rounded bg-slate-900 text-emerald-300 border border-slate-800 font-mono text-[11px]" {...props}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <pre className="p-3 rounded-xl bg-[#050914] text-cyan-200 border border-slate-800 font-mono text-xs overflow-x-auto my-2">
                          <code {...props}>{children}</code>
                        </pre>
                      );
                    },
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-2 border-emerald-500 pl-3 italic text-slate-400 my-2" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside space-y-1 my-1 text-slate-300" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside space-y-1 my-1 text-slate-300" {...props} />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
