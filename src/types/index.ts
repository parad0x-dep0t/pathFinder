export type TargetOS = 'windows' | 'linux' | 'other';
export type PrivilegeLevel = 'unprivileged' | 'root' | 'system';
export type StepStatus = 'not-started' | 'in-progress' | 'completed' | 'skipped';
export type StepPhase = 'reconnaissance' | 'enumeration' | 'exploitation' | 'privesc' | 'post-exploitation';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Credential {
  id: string;
  username: string;
  password?: string;
  hash?: string;
  domain?: string;
  service?: string;
  notes?: string;
}

export interface ShellState {
  hasShell: boolean;
  user: string;
  groups: string[];
  privilegeLevel: PrivilegeLevel;
}

export interface Target {
  id: string;
  name: string;
  ipOrHostname: string;
  os: TargetOS;
  domain: string;
  openPorts: number[];
  portServices?: Record<number, string>;
  credentials: Credential[];
  shellState: ShellState;
  completedSteps: Record<string, StepStatus>;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaybookStep {
  id: string;
  title: string;
  phase: StepPhase;
  purpose: string;
  command: string;
  expected_output: string[];
  common_mistakes: string[];
  if_success?: string;
  if_failure?: string;
  references?: string[];
}

export interface PlaybookMetadata {
  id: string;
  name: string;
  category: 'network' | 'privesc' | 'post-exploitation' | 'web' | 'passwords' | 'ad';
  description: string;
  port_triggers: number[];
  service_triggers?: string[];
  requires_shell?: boolean;
  target_os?: TargetOS;
  tags: string[];
}

export interface Playbook extends PlaybookMetadata {
  steps: PlaybookStep[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  playbookId: string;
  stepId: string;
  priority: 'critical' | 'high' | 'medium' | 'info';
  reason: string;
  commandPreview?: string;
}

export interface VariableContext {
  target: Target;
  activeCredential?: Credential | null;
  customVars?: Record<string, string>;
  isStreamerMode?: boolean;
}

export type ActiveView = 'roadmap' | 'graph' | 'playbook' | 'credentials' | 'shell' | 'notes';

// ==========================================
// Attack Graph Types
// ==========================================
export type AttackNodeType = 'host' | 'service' | 'technique' | 'credential' | 'session' | 'pivot';

export interface HostNodeData extends Record<string, unknown> {
  targetId: string;
  name: string;
  ipOrHostname: string;
  os: TargetOS;
  domain?: string;
  openPorts: number[];
  hasShell: boolean;
  privilegeLevel: PrivilegeLevel;
  isSelected?: boolean;
}

export interface ServiceNodeData extends Record<string, unknown> {
  targetId: string;
  port: number;
  serviceName: string;
  playbookId?: string;
  totalSteps: number;
  completedSteps: number;
  isOpen: boolean;
  isExpanded?: boolean;
}

export interface TechniqueNodeData extends Record<string, unknown> {
  targetId: string;
  stepId: string;
  playbookId: string;
  title: string;
  phase: StepPhase;
  command: string;
  isCompleted: boolean;
  status: StepStatus;
}

export interface CredentialNodeData extends Record<string, unknown> {
  credentialId: string;
  username: string;
  domain?: string;
  hasPassword: boolean;
  hasHash: boolean;
  service?: string;
  isDomainAdmin?: boolean;
}

export interface SessionNodeData extends Record<string, unknown> {
  targetId: string;
  user: string;
  privilegeLevel: PrivilegeLevel;
  shellType: string;
}

export interface PivotNodeData extends Record<string, unknown> {
  sourceTargetId: string;
  interfaceName: string;
  internalSubnet: string;
  pivotType: 'chisel' | 'ligolo-ng' | 'ssh-socks';
}
