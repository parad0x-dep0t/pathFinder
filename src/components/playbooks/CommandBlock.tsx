'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal, Eye, Code2 } from 'lucide-react';
import { Target, Credential } from '@/types';
import { resolveCommandTemplate } from '@/lib/variableResolver';
import { useTargetStore } from '@/store/useTargetStore';

interface CommandBlockProps {
  commandTemplate: string;
  target: Target;
  activeCredential?: Credential | null;
}

export const CommandBlock: React.FC<CommandBlockProps> = ({
  commandTemplate,
  target,
  activeCredential,
}) => {
  const { isStreamerMode } = useTargetStore();
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const resolved = resolveCommandTemplate(commandTemplate, {
    target,
    activeCredential,
    isStreamerMode,
  });

  const handleCopy = async () => {
    const textToCopy = showRaw ? commandTemplate : resolved.resolvedString;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-[#070d19] overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-medium text-slate-300">Command</span>
          {resolved.variablesUsed.length > 0 && (
            <div className="flex items-center gap-1.5 ml-2">
              {resolved.variablesUsed.map((v) => (
                <span
                  key={v}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
                  title={`Variable {{${v}}}`}
                >
                  ${v}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowRaw(!showRaw)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Toggle between Resolved and Template string"
          >
            {showRaw ? (
              <>
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>Resolved</span>
              </>
            ) : (
              <>
                <Code2 className="w-3 h-3 text-amber-400" />
                <span>Template</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-cyber-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-emerald-300 border border-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Command Content */}
      <div className="p-3 font-mono text-xs md:text-sm text-slate-100 overflow-x-auto selection:bg-emerald-500/40">
        {showRaw ? (
          <code className="text-amber-200/90">{commandTemplate}</code>
        ) : (
          <code>
            {resolved.tokens.map((token, idx) => {
              if (token.type === 'variable') {
                return (
                  <span
                    key={idx}
                    className="inline-block px-1 py-0.2 mx-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-semibold cursor-help transition-transform hover:scale-105"
                    title={`Template variable: ${token.raw}`}
                  >
                    {token.resolvedValue}
                  </span>
                );
              }
              return <span key={idx}>{token.raw}</span>;
            })}
          </code>
        )}
      </div>
    </div>
  );
};
