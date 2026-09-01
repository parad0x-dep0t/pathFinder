import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Target,
  Credential,
  ShellState,
  StepStatus,
  ActiveView,
  TargetOS,
  PrivilegeLevel,
  ExperienceLevel,
} from '@/types';

interface TargetStoreState {
  targets: Record<string, Target>;
  activeTargetId: string | null;
  activeCredentialId: string | null;
  activePlaybookId: string;
  activeView: ActiveView;
  searchFilter: string;
  isStreamerMode: boolean;
  experienceLevel: ExperienceLevel;

  // Actions
  setExperienceLevel: (level: ExperienceLevel) => void;
  toggleStreamerMode: () => void;
  createTarget: (data: {
    name: string;
    ipOrHostname: string;
    os: TargetOS;
    domain?: string;
    openPorts?: number[];
    portServices?: Record<number, string>;
  }) => string;
  updateTarget: (id: string, updates: Partial<Target>) => void;
  deleteTarget: (id: string) => void;
  switchTarget: (id: string) => void;

  togglePort: (port: number) => void;
  setOpenPorts: (ports: number[]) => void;
  setStepStatus: (stepId: string, status: StepStatus) => void;

  addCredential: (cred: Omit<Credential, 'id'>) => string;
  updateCredential: (id: string, cred: Partial<Credential>) => void;
  deleteCredential: (id: string) => void;
  setActiveCredentialId: (id: string | null) => void;

  updateShellState: (shellState: Partial<ShellState>) => void;

  updateNotes: (notes: string) => void;
  setActiveView: (view: ActiveView) => void;
  setActivePlaybookId: (playbookId: string) => void;
  setSearchFilter: (filter: string) => void;
  resetAllData: () => void;
}

export const useTargetStore = create<TargetStoreState>()(
  persist(
    (set, get) => ({
      targets: {},
      activeTargetId: null,
      activeCredentialId: null,
      activePlaybookId: 'smb',
      activeView: 'roadmap',
      searchFilter: '',
      isStreamerMode: false,
      experienceLevel: 'beginner',

      setExperienceLevel: (experienceLevel) => set({ experienceLevel }),
      toggleStreamerMode: () => set((state) => ({ isStreamerMode: !state.isStreamerMode })),

      createTarget: ({ name, ipOrHostname, os, domain = '', openPorts = [], portServices = {} }) => {
        const id = `target-${Date.now()}`;
        const newTarget: Target = {
          id,
          name,
          ipOrHostname,
          os,
          domain,
          openPorts,
          portServices,
          credentials: [],
          shellState: {
            hasShell: false,
            user: '',
            groups: [],
            privilegeLevel: 'unprivileged',
          },
          completedSteps: {},
          notes: `# Target Notes - ${name}\n- IP/Host: \`${ipOrHostname}\`\n- Created: ${new Date().toLocaleDateString()}\n`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Auto-select first matching playbook
        let defaultPlaybook = get().activePlaybookId;
        const isHttpService = Object.values(portServices).some(s => s.toLowerCase() === 'http' || s.toLowerCase() === 'https');
        if (openPorts.includes(80) || openPorts.includes(443) || openPorts.includes(8080) || isHttpService) {
          defaultPlaybook = 'http';
        } else if (openPorts.includes(445) || openPorts.includes(139) || Object.values(portServices).includes('smb')) {
          defaultPlaybook = 'smb';
        } else if (openPorts.includes(88) || Object.values(portServices).includes('kerberos')) {
          defaultPlaybook = 'kerberos';
        } else if (openPorts.includes(22) || Object.values(portServices).includes('ssh')) {
          defaultPlaybook = 'ssh';
        } else if (openPorts.length > 0) {
          defaultPlaybook = 'unknown-service';
        }

        set((state) => ({
          targets: { ...state.targets, [id]: newTarget },
          activeTargetId: id,
          activeCredentialId: null,
          activePlaybookId: defaultPlaybook,
          activeView: 'roadmap',
        }));

        return id;
      },

      updateTarget: (id, updates) => {
        set((state) => {
          const existing = state.targets[id];
          if (!existing) return state;
          return {
            targets: {
              ...state.targets,
              [id]: {
                ...existing,
                ...updates,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      deleteTarget: (id) => {
        set((state) => {
          const newTargets = { ...state.targets };
          delete newTargets[id];
          const remainingIds = Object.keys(newTargets);
          const nextActiveId =
            state.activeTargetId === id
              ? remainingIds.length > 0
                ? remainingIds[0]
                : null
              : state.activeTargetId;

          return {
            targets: newTargets,
            activeTargetId: nextActiveId,
          };
        });
      },

      switchTarget: (id) => {
        set((state) => {
          const target = state.targets[id];
          const firstCredId = target?.credentials?.[0]?.id || null;
          return {
            activeTargetId: id,
            activeCredentialId: firstCredId,
          };
        });
      },

      togglePort: (port) => {
        const { activeTargetId, targets } = get();
        if (!activeTargetId || !targets[activeTargetId]) return;

        const currentPorts = targets[activeTargetId].openPorts || [];
        const newPorts = currentPorts.includes(port)
          ? currentPorts.filter((p) => p !== port)
          : [...currentPorts, port].sort((a, b) => a - b);

        get().updateTarget(activeTargetId, { openPorts: newPorts });
      },

      setOpenPorts: (ports) => {
        const { activeTargetId } = get();
        if (!activeTargetId) return;
        get().updateTarget(activeTargetId, { openPorts: ports.sort((a, b) => a - b) });
      },

      setStepStatus: (stepId, status) => {
        const { activeTargetId, targets } = get();
        if (!activeTargetId || !targets[activeTargetId]) return;

        const currentCompleted = targets[activeTargetId].completedSteps || {};
        get().updateTarget(activeTargetId, {
          completedSteps: {
            ...currentCompleted,
            [stepId]: status,
          },
        });
      },

      addCredential: (cred) => {
        const { activeTargetId, targets } = get();
        if (!activeTargetId || !targets[activeTargetId]) return '';

        const credId = `cred-${Date.now()}`;
        const newCred: Credential = { ...cred, id: credId };
        const currentCreds = targets[activeTargetId].credentials || [];

        get().updateTarget(activeTargetId, {
          credentials: [...currentCreds, newCred],
        });

        // Set as active if none selected
        if (!get().activeCredentialId) {
          set({ activeCredentialId: credId });
        }

        return credId;
      },

      updateCredential: (id, updates) => {
        const { activeTargetId, targets } = get();
        if (!activeTargetId || !targets[activeTargetId]) return;

        const currentCreds = targets[activeTargetId].credentials || [];
        const newCreds = currentCreds.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        );

        get().updateTarget(activeTargetId, { credentials: newCreds });
      },

      deleteCredential: (id) => {
        const { activeTargetId, targets } = get();
        if (!activeTargetId || !targets[activeTargetId]) return;

        const currentCreds = targets[activeTargetId].credentials || [];
        const newCreds = currentCreds.filter((c) => c.id !== id);

        get().updateTarget(activeTargetId, { credentials: newCreds });

        if (get().activeCredentialId === id) {
          set({
            activeCredentialId: newCreds.length > 0 ? newCreds[0].id : null,
          });
        }
      },

      setActiveCredentialId: (id) => {
        set({ activeCredentialId: id });
      },

      updateShellState: (updates) => {
        const { activeTargetId, targets } = get();
        if (!activeTargetId || !targets[activeTargetId]) return;

        const currentShell = targets[activeTargetId].shellState || {
          hasShell: false,
          user: '',
          groups: [],
          privilegeLevel: 'unprivileged' as PrivilegeLevel,
        };

        get().updateTarget(activeTargetId, {
          shellState: {
            ...currentShell,
            ...updates,
          },
        });
      },

      updateNotes: (notes) => {
        const { activeTargetId } = get();
        if (!activeTargetId) return;
        get().updateTarget(activeTargetId, { notes });
      },

      setActiveView: (view) => set({ activeView: view }),
      setActivePlaybookId: (playbookId) => {
        set({ activePlaybookId: playbookId, activeView: 'playbook' });
      },
      setSearchFilter: (searchFilter) => set({ searchFilter }),

      resetAllData: () => {
        set({
          targets: {},
          activeTargetId: null,
          activeCredentialId: null,
          activePlaybookId: 'smb',
          activeView: 'roadmap',
          isStreamerMode: false,
          experienceLevel: 'beginner',
        });
      },
    }),
    {
      name: 'pathfinder-workspace-clean-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
