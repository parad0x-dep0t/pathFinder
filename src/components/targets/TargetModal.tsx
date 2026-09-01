'use client';

import React, { useState } from 'react';
import { Target, TargetOS } from '@/types';
import { useTargetStore } from '@/store/useTargetStore';
import { parseNmapOutput } from '@/lib/nmapParser';
import { Crosshair, Server, Globe, Network, Upload, Sparkles, ClipboardPaste } from 'lucide-react';

interface TargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetToEdit?: Target | null;
}

const COMMON_PORTS = [
  { port: 21, label: '21 FTP' },
  { port: 22, label: '22 SSH' },
  { port: 25, label: '25 SMTP' },
  { port: 53, label: '53 DNS' },
  { port: 69, label: '69 TFTP' },
  { port: 79, label: '79 Finger' },
  { port: 80, label: '80 HTTP' },
  { port: 88, label: '88 Kerberos' },
  { port: 110, label: '110 POP3' },
  { port: 111, label: '111 RPC/NFS' },
  { port: 139, label: '139 NetBIOS' },
  { port: 143, label: '143 IMAP' },
  { port: 161, label: '161 SNMP' },
  { port: 389, label: '389 LDAP' },
  { port: 443, label: '443 HTTPS' },
  { port: 445, label: '445 SMB' },
  { port: 623, label: '623 IPMI' },
  { port: 873, label: '873 Rsync' },
  { port: 1433, label: '1433 MSSQL' },
  { port: 1521, label: '1521 Oracle' },
  { port: 2049, label: '2049 NFS' },
  { port: 3306, label: '3306 MySQL' },
  { port: 3389, label: '3389 RDP' },
  { port: 5985, label: '5985 WinRM' },
  { port: 6379, label: '6379 Redis' },
  { port: 8080, label: '8080 HTTP-Alt' },
];

export const TargetModal: React.FC<TargetModalProps> = ({
  isOpen,
  onClose,
  targetToEdit,
}) => {
  const { createTarget, updateTarget } = useTargetStore();

  const [name, setName] = useState(targetToEdit ? targetToEdit.name : '');
  const [ipOrHostname, setIpOrHostname] = useState(
    targetToEdit ? targetToEdit.ipOrHostname : ''
  );
  const [domain, setDomain] = useState(targetToEdit ? targetToEdit.domain : '');
  const [os, setOs] = useState<TargetOS>(
    targetToEdit ? targetToEdit.os : 'linux'
  );
  const [selectedPorts, setSelectedPorts] = useState<number[]>(
    targetToEdit ? targetToEdit.openPorts : [80, 445]
  );
  const [portServices, setPortServices] = useState<Record<number, string>>(
    targetToEdit ? (targetToEdit.portServices || {}) : {}
  );
  const [customPortInput, setCustomPortInput] = useState('');
  const [showNmapAutofill, setShowNmapAutofill] = useState(false);
  const [nmapInput, setNmapInput] = useState('');
  const [autofillSuccess, setAutofillSuccess] = useState(false);

  if (!isOpen) return null;

  const togglePort = (port: number) => {
    if (selectedPorts.includes(port)) {
      setSelectedPorts(selectedPorts.filter((p) => p !== port));
    } else {
      setSelectedPorts([...selectedPorts, port].sort((a, b) => a - b));
    }
  };

  const handleAddCustomPort = () => {
    const num = parseInt(customPortInput.trim(), 10);
    if (!isNaN(num) && num > 0 && num <= 65535 && !selectedPorts.includes(num)) {
      setSelectedPorts([...selectedPorts, num].sort((a, b) => a - b));
      // Default non-standard web ports to http
      if (!portServices[num]) {
        setPortServices((prev) => ({ ...prev, [num]: num === 443 || num === 8443 ? 'https' : 'http' }));
      }
      setCustomPortInput('');
    }
  };

  const handleApplyNmapAutofill = (textToParse: string) => {
    if (!textToParse.trim()) return;
    try {
      const parsed = parseNmapOutput(textToParse);
      if (parsed.ipOrHostname) setIpOrHostname(parsed.ipOrHostname);
      if (parsed.name) setName(parsed.name);
      if (parsed.domain) setDomain(parsed.domain);
      if (parsed.os) setOs(parsed.os);
      if (parsed.openPorts.length > 0) setSelectedPorts(parsed.openPorts);
      if (parsed.portServices && Object.keys(parsed.portServices).length > 0) {
        setPortServices((prev) => ({ ...prev, ...parsed.portServices }));
      }
      setAutofillSuccess(true);
      setTimeout(() => {
        setAutofillSuccess(false);
        setShowNmapAutofill(false);
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNmapFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setNmapInput(text);
        handleApplyNmapAutofill(text);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ipOrHostname.trim()) return;

    if (targetToEdit) {
      updateTarget(targetToEdit.id, {
        name: name.trim(),
        ipOrHostname: ipOrHostname.trim(),
        domain: domain.trim(),
        os,
        openPorts: selectedPorts,
        portServices,
      });
    } else {
      createTarget({
        name: name.trim(),
        ipOrHostname: ipOrHostname.trim(),
        domain: domain.trim(),
        os,
        openPorts: selectedPorts,
        portServices,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b1120] border border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-cyber-md space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">
              {targetToEdit ? 'Edit Target Machine' : 'Create New Target Machine'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNmapAutofill(!showNmapAutofill)}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 bg-slate-900 border border-cyan-800/60 px-2 py-0.5 rounded flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Autofill Nmap</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 text-sm font-mono"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Collapsible Nmap Autofill Drawer */}
        {showNmapAutofill && (
          <div className="p-3 rounded-xl border border-cyan-800/60 bg-cyan-950/20 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-cyan-300 font-semibold flex items-center gap-1">
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Paste Nmap Output to Autofill</span>
              </span>
              <label className="text-[11px] text-cyan-400 hover:text-cyan-200 cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept=".nmap,.txt,.gnmap,.xml"
                  onChange={handleNmapFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              rows={4}
              placeholder="Paste raw scan results (e.g. Nmap scan report for 10.10.11.45...)"
              value={nmapInput}
              onChange={(e) => setNmapInput(e.target.value)}
              className="w-full bg-[#070d19] border border-cyan-900/60 rounded-lg p-2 text-slate-200 text-[11px] focus:outline-none focus:border-cyan-500 font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => handleApplyNmapAutofill(nmapInput)}
                className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-sm"
              >
                {autofillSuccess ? '✓ Parsed & Applied!' : 'Parse & Autofill'}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {/* Target Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Target Identifier / Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. HTB: Authority or DC01"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* IP / Hostname */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                IP or Hostname <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 10.10.11.45"
                value={ipOrHostname}
                onChange={(e) => setIpOrHostname(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Domain */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Domain / Realm
              </label>
              <input
                type="text"
                placeholder="e.g. corp.local"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* OS */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Target Operating System
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['linux', 'windows', 'other'] as TargetOS[]).map((osType) => (
                <button
                  key={osType}
                  type="button"
                  onClick={() => setOs(osType)}
                  className={`py-2 rounded-lg border capitalize transition-colors ${
                    os === osType
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {osType}
                </button>
              ))}
            </div>
          </div>

          {/* Discovered Ports */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-semibold">
              Discovered Open Ports
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-900/60 rounded-lg border border-slate-800">
              {COMMON_PORTS.map((item) => {
                const isSelected = selectedPorts.includes(item.port);
                return (
                  <button
                    key={item.port}
                    type="button"
                    onClick={() => togglePort(item.port)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                      isSelected
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Custom port adder */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                placeholder="e.g. 8443 or 8978 or 3306..."
                value={customPortInput}
                onChange={(e) => setCustomPortInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomPort();
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddCustomPort}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
              >
                + Add Port
              </button>
            </div>

            {/* Non-Standard Port Service Mappings */}
            {selectedPorts.filter(
              (p) => ![21, 22, 53, 80, 88, 139, 389, 443, 445, 1433, 3389, 5985, 6379].includes(p)
            ).length > 0 && (
              <div className="space-y-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 mt-2">
                <label className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Port Service Mapping (Auto-detected from Nmap Banners)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPorts
                    .filter(
                      (p) =>
                        ![21, 22, 53, 80, 88, 139, 389, 443, 445, 1433, 3389, 5985, 6379].includes(p)
                    )
                    .map((port) => (
                      <div
                        key={port}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono"
                      >
                        <span className="font-bold text-slate-200">Port {port}:</span>
                        <select
                          value={portServices[port] || 'http'}
                          onChange={(e) =>
                            setPortServices({ ...portServices, [port]: e.target.value })
                          }
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-cyan-300 text-xs focus:ring-1 focus:ring-cyan-500 font-mono"
                        >
                          <option value="http">🌐 HTTP / Web App</option>
                          <option value="https">🔒 HTTPS / TLS</option>
                          <option value="ssh">💻 SSH Shell</option>
                          <option value="ftp">📁 FTP</option>
                          <option value="smb">📂 SMB / Samba</option>
                          <option value="mysql">🗄️ MySQL / MariaDB</option>
                          <option value="redis">⚡ Redis</option>
                          <option value="unknown">❓ Unknown / Raw</option>
                        </select>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-slate-950 font-bold bg-emerald-400 hover:bg-emerald-300 shadow-cyber-sm"
            >
              {targetToEdit ? 'Update Target' : 'Create Target'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
