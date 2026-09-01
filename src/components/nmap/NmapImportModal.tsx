'use client';

import React, { useState, useMemo } from 'react';
import {
  FileCode,
  Upload,
  ClipboardPaste,
  CheckCircle2,
  AlertCircle,
  Network,
  Server,
  Globe,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useTargetStore } from '@/store/useTargetStore';
import { parseNmapOutput, ParsedNmapResult } from '@/lib/nmapParser';
import { Target } from '@/types';

interface NmapImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTarget?: Target | null;
}

export const NmapImportModal: React.FC<NmapImportModalProps> = ({
  isOpen,
  onClose,
  activeTarget,
}) => {
  const { createTarget, updateTarget, setOpenPorts } = useTargetStore();

  const [rawContent, setRawContent] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [importMode, setImportMode] = useState<'new' | 'update'>(
    activeTarget ? 'update' : 'new'
  );

  // Parse result dynamically whenever content changes
  const parsedResult: ParsedNmapResult | null = useMemo(() => {
    if (!rawContent.trim()) return null;
    try {
      return parseNmapOutput(rawContent);
    } catch (e) {
      return null;
    }
  }, [rawContent]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setRawContent(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setRawContent(text);
    };
    reader.readAsText(file);
  };

  const handlePasteSample = () => {
    const sample = `# Nmap 7.94 scan initiated
Nmap scan report for authority.htb (10.10.11.222)
Host is up (0.045s latency).
Not shown: 993 closed tcp ports (reset)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
80/tcp   open  http          Microsoft IIS httpd 10.0
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2024-03-20 18:22:15Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP
445/tcp  open  microsoft-ds  Windows Server 2019 Standard 17763 microsoft-ds
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows_server_2019`;
    setRawContent(sample);
  };

  const handleApply = () => {
    if (!parsedResult) return;

    if (importMode === 'update' && activeTarget) {
      // Merge ports with existing
      const mergedPorts = Array.from(
        new Set([...(activeTarget.openPorts || []), ...parsedResult.openPorts])
      ).sort((a, b) => a - b);

      updateTarget(activeTarget.id, {
        openPorts: mergedPorts,
        os: parsedResult.os || activeTarget.os,
        domain: parsedResult.domain || activeTarget.domain,
        ipOrHostname:
          activeTarget.ipOrHostname === '10.10.10.10'
            ? parsedResult.ipOrHostname
            : activeTarget.ipOrHostname,
      });
    } else {
      createTarget({
        name: parsedResult.name,
        ipOrHostname: parsedResult.ipOrHostname,
        domain: parsedResult.domain || '',
        os: parsedResult.os,
        openPorts: parsedResult.openPorts,
      });
    }

    setRawContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-cyber-md space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-mono">
                Import Nmap Scan Output
              </h3>
              <p className="text-xs text-slate-400">
                Upload or paste <code className="text-emerald-400 font-mono">nmap -sC -sV</code>, <code className="text-emerald-400 font-mono">-oG</code>, or XML scan results.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-mono"
          >
            ✕
          </button>
        </div>

        {/* Input Area (Upload or Paste) */}
        <div className="space-y-3 font-mono text-xs">
          {/* Action header with Sample paste */}
          <div className="flex items-center justify-between">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <ClipboardPaste className="w-3.5 h-3.5 text-cyan-400" />
              <span>Paste Scan Output or Drag & Drop File</span>
            </label>
            <button
              type="button"
              onClick={handlePasteSample}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              + Paste Sample Scan
            </button>
          </div>

          {/* Drag & Drop Box + Textarea */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`relative rounded-xl border transition-colors ${
              dragActive
                ? 'border-emerald-500 bg-emerald-950/20'
                : 'border-slate-800 bg-[#070d19]'
            }`}
          >
            <textarea
              rows={7}
              placeholder="Paste nmap scan results here... (e.g. Nmap scan report for 10.10.11.45 ... 80/tcp open http ...)"
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              className="w-full bg-transparent p-3 text-xs font-mono text-slate-200 focus:outline-none placeholder:text-slate-600 resize-y selection:bg-emerald-500/40"
            />

            {/* File upload trigger bar */}
            <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-300 transition-colors">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload file (.nmap, .txt, .gnmap, .xml)</span>
                <input
                  type="file"
                  accept=".nmap,.txt,.gnmap,.xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {rawContent && (
                <button
                  type="button"
                  onClick={() => setRawContent('')}
                  className="text-slate-500 hover:text-rose-400"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Parsed Preview */}
        {parsedResult && (
          <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/15 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-emerald-300 font-semibold border-b border-emerald-800/40 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Live Parser Extraction</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700">
                {parsedResult.openPorts.length} Open Port(s) Detected
              </span>
            </div>

            {/* Target Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase block">IP / Host</span>
                <span className="text-slate-200 font-bold truncate block">
                  {parsedResult.ipOrHostname}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase block">Detected OS</span>
                <span className="text-cyan-300 font-bold uppercase block">
                  {parsedResult.os}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase block">Domain</span>
                <span className="text-amber-300 truncate block">
                  {parsedResult.domain || 'None / Local'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase block">Target Name</span>
                <span className="text-slate-200 font-bold truncate block">
                  {parsedResult.name}
                </span>
              </div>
            </div>

            {/* Open Ports List */}
            {parsedResult.openPorts.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-slate-400 text-[11px]">Discovered Services:</span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-900/90 rounded-lg border border-slate-800">
                  {parsedResult.portsDetail.length > 0
                    ? parsedResult.portsDetail.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-emerald-300 border border-emerald-800/60 font-semibold"
                          title={p.version || p.service}
                        >
                          {p.port}/{p.protocol} ({p.service})
                        </span>
                      ))
                    : parsedResult.openPorts.map((port) => (
                        <span
                          key={port}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-emerald-300 border border-emerald-800/60"
                        >
                          Port {port}
                        </span>
                      ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Target Destination Switcher (If Active Target exists) */}
        {activeTarget && (
          <div className="space-y-2 font-mono text-xs">
            <label className="text-slate-400 block">Import Action</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setImportMode('update')}
                className={`p-2.5 rounded-xl border text-left transition-colors ${
                  importMode === 'update'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <span className="block text-xs">Update Active Target</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  Merge ports into {activeTarget.name}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setImportMode('new')}
                className={`p-2.5 rounded-xl border text-left transition-colors ${
                  importMode === 'new'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <span className="block text-xs">Create New Target</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  Create fresh target machine
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!parsedResult}
            onClick={handleApply}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:pointer-events-none shadow-cyber-sm"
          >
            <span>{importMode === 'update' ? 'Update Target Ports' : 'Create Target from Scan'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
