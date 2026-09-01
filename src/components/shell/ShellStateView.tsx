'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  Plus,
  X,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';
import { Target, PrivilegeLevel, TargetOS } from '@/types';
import { useTargetStore } from '@/store/useTargetStore';

interface ShellStateViewProps {
  target: Target;
}

const COMMON_LINUX_GROUPS = [
  'docker',
  'sudo',
  'lxd',
  'wheel',
  'adm',
  'disk',
  'shadow',
  'video',
  'kvm',
];

export const ShellStateView: React.FC<ShellStateViewProps> = ({ target }) => {
  const { updateShellState, updateTarget } = useTargetStore();
  const shell = target.shellState || {
    hasShell: false,
    user: '',
    groups: [],
    privilegeLevel: 'unprivileged' as PrivilegeLevel,
  };

  const [newGroupInput, setNewGroupInput] = useState('');

  const handleToggleShell = (val: boolean) => {
    updateShellState({
      hasShell: val,
      user: val ? shell.user || (target.os === 'windows' ? 'IUSR' : 'www-data') : '',
    });
  };

  const handleAddGroup = (groupName: string) => {
    const trimmed = groupName.trim().toLowerCase();
    if (!trimmed || shell.groups.includes(trimmed)) return;
    updateShellState({
      groups: [...shell.groups, trimmed],
    });
    setNewGroupInput('');
  };

  const handleRemoveGroup = (groupName: string) => {
    updateShellState({
      groups: shell.groups.filter((g) => g !== groupName),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 shadow-sm space-y-1">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-slate-100">Shell & Foothold State</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Configure your current access level on the target. Pathfinder dynamically updates post-exploitation playbooks and privilege escalation recommendations as your access changes.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Foothold & OS card */}
        <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-5">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Target OS & Access Switch</span>
          </h3>

          {/* Shell Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
            <div>
              <div className="text-xs font-semibold text-slate-200">Shell Acquired?</div>
              <div className="text-[11px] text-slate-400">
                {shell.hasShell ? 'Active interactive shell on target' : 'No shell acquired yet'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleShell(!shell.hasShell)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                shell.hasShell
                  ? 'bg-emerald-500 text-slate-950 shadow-cyber-sm'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {shell.hasShell ? '🟢 ONLINE' : '🔴 NO ACCESS'}
            </button>
          </div>

          {/* OS Picker */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 block">
              Target Operating System
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {(['linux', 'windows', 'other'] as TargetOS[]).map((osType) => (
                <button
                  key={osType}
                  type="button"
                  onClick={() => updateTarget(target.id, { os: osType })}
                  className={`py-2 rounded-lg border capitalize transition-colors ${
                    target.os === osType
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {osType}
                </button>
              ))}
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 block">
              Compromised User Account
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                disabled={!shell.hasShell}
                placeholder="e.g. www-data or developer"
                value={shell.user}
                onChange={(e) => updateShellState({ user: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
              />
            </div>
          </div>
        </div>

        {/* Privilege Level & Groups */}
        <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 space-y-5">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Privileges & Groups</span>
          </h3>

          {/* Privilege Level Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 block">
              Current Privilege Level
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: 'unprivileged', label: '🟡 Unpriv User', icon: Shield },
                { id: 'root', label: '🟢 Root (Linux)', icon: ShieldCheck },
                { id: 'system', label: '💎 SYSTEM (Win)', icon: ShieldAlert },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  disabled={!shell.hasShell}
                  onClick={() =>
                    updateShellState({
                      privilegeLevel: lvl.id as PrivilegeLevel,
                    })
                  }
                  className={`py-2 px-1 rounded-lg border text-center transition-colors disabled:opacity-40 ${
                    shell.privilegeLevel === lvl.id
                      ? 'bg-slate-800 text-emerald-300 border-emerald-600 font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-[11px]">{lvl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group Membership Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-400">
                User Groups (<code className="text-emerald-400 font-mono">id / groups</code>)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                Trigger privesc vectors
              </span>
            </div>

            {/* Tags display */}
            <div className="min-h-[42px] p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 flex-wrap">
              {shell.groups.length === 0 ? (
                <span className="text-xs text-slate-600 font-mono italic">
                  No secondary groups added yet.
                </span>
              ) : (
                shell.groups.map((grp) => (
                  <span
                    key={grp}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
                      grp === 'docker' || grp === 'lxd' || grp === 'sudo'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                        : 'bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                  >
                    <span>{grp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGroup(grp)}
                      className="hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom group add */}
            <div className="flex gap-2">
              <input
                type="text"
                disabled={!shell.hasShell}
                placeholder="e.g. docker, lxd, sudo..."
                value={newGroupInput}
                onChange={(e) => setNewGroupInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddGroup(newGroupInput);
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
              />
              <button
                type="button"
                disabled={!shell.hasShell || !newGroupInput.trim()}
                onClick={() => handleAddGroup(newGroupInput)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono disabled:opacity-40 border border-slate-700"
              >
                Add
              </button>
            </div>

            {/* Quick-add pills */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-500 block mb-1.5">
                Quick-add common escalation groups:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {COMMON_LINUX_GROUPS.map((cg) => {
                  const isPresent = shell.groups.includes(cg);
                  return (
                    <button
                      key={cg}
                      type="button"
                      disabled={!shell.hasShell || isPresent}
                      onClick={() => handleAddGroup(cg)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                        isPresent
                          ? 'opacity-30 border-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-slate-900 text-cyan-300 border-slate-800 hover:border-cyan-700 hover:bg-slate-800'
                      }`}
                    >
                      +{cg}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
