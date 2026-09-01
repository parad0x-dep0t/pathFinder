'use client';

import React, { useState } from 'react';
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  User,
  Hash,
  Globe,
  Radio,
  Sparkles,
} from 'lucide-react';
import { Target, Credential } from '@/types';
import { useTargetStore } from '@/store/useTargetStore';

interface CredentialsVaultProps {
  target: Target;
}

export const CredentialsVault: React.FC<CredentialsVaultProps> = ({ target }) => {
  const {
    activeCredentialId,
    setActiveCredentialId,
    addCredential,
    deleteCredential,
  } = useTargetStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hash, setHash] = useState('');
  const [domain, setDomain] = useState(target.domain || '');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    addCredential({
      username: username.trim(),
      password: password.trim() || undefined,
      hash: hash.trim() || undefined,
      domain: domain.trim() || undefined,
      service: service.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    // Reset Form
    setUsername('');
    setPassword('');
    setHash('');
    setService('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">Credentials Vault</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {target.credentials.length} stored
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage discovered target usernames, passwords, and hashes. Select an active credential to automatically resolve <code className="text-emerald-400 font-mono">{"{{USERNAME}}"}</code> and <code className="text-emerald-400 font-mono">{"{{PASSWORD}}"}</code> across all playbooks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-cyber-sm transition-transform hover:scale-105 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Credential</span>
        </button>
      </div>

      {/* Credentials Table / Cards */}
      {target.credentials.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center text-slate-400 bg-slate-900/30">
          <Key className="w-10 h-10 mx-auto mb-2 text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No credentials stored yet.</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Discovered usernames, passwords, or NTLM hashes will appear here. Add one to test automated command template substitution.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800 hover:bg-emerald-900/80 transition-colors"
          >
            + Add First Credential
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-[#0b1120] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Active</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Password</th>
                  <th className="py-3 px-4">Hash / Token</th>
                  <th className="py-3 px-4">Domain / Service</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {target.credentials.map((cred) => {
                  const isActive = activeCredentialId === cred.id;
                  return (
                    <tr
                      key={cred.id}
                      className={`transition-colors ${
                        isActive
                          ? 'bg-emerald-950/20 text-slate-100'
                          : 'hover:bg-slate-900/40 text-slate-300'
                      }`}
                    >
                      {/* Active Radio */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="radio"
                          name="activeCredential"
                          checked={isActive}
                          onChange={() => setActiveCredentialId(cred.id)}
                          className="accent-emerald-500 cursor-pointer w-4 h-4"
                          title="Select as active credential for command resolution"
                        />
                      </td>

                      {/* Username */}
                      <td className="py-3 px-4 font-semibold text-emerald-300">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cred.username}</span>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="py-3 px-4">
                        {cred.password ? (
                          <div className="flex items-center gap-2">
                            <span className="text-amber-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {cred.password}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(cred.password!, `pass-${cred.id}`)}
                              className="text-slate-400 hover:text-emerald-300"
                              title="Copy password"
                            >
                              {copiedId === `pass-${cred.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Hash */}
                      <td className="py-3 px-4">
                        {cred.hash ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 max-w-[140px] truncate"
                              title={cred.hash}
                            >
                              {cred.hash}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(cred.hash!, `hash-${cred.id}`)}
                              className="text-slate-400 hover:text-emerald-300"
                              title="Copy hash"
                            >
                              {copiedId === `hash-${cred.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Domain / Service */}
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        <div>{cred.domain || target.domain || 'Local'}</div>
                        {cred.service && (
                          <span className="text-[10px] text-cyan-400">
                            {cred.service}
                          </span>
                        )}
                      </td>

                      {/* Notes */}
                      <td className="py-3 px-4 text-slate-400 text-xs font-sans max-w-[200px] truncate">
                        {cred.notes || '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteCredential(cred.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Delete credential"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Credential Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b1120] border border-slate-800 rounded-xl max-w-md w-full p-5 shadow-cyber-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">Add Discovered Credential</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Username <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. administrator or svc-sql"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Plaintext Password
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Password123!"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
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

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  NTLM / Kerberos Hash
                </label>
                <input
                  type="text"
                  placeholder="e.g. aad3b435b51404eeaad3b435b51404ee:..."
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Associated Service
                </label>
                <input
                  type="text"
                  placeholder="e.g. SMB / WinRM / SSH / MSSQL"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Context / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extracted from memory or config backup"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-slate-950 font-bold bg-emerald-400 hover:bg-emerald-300 shadow-cyber-sm"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
