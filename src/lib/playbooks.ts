import { Playbook } from '@/types';
import compiledPlaybooks from './generatedPlaybooks.json';

const categoryOrder: Record<string, number> = {
  network: 1,
  web: 2,
  ad: 3,
  privesc: 4,
  'post-exploitation': 5,
  passwords: 6,
};

function sortPlaybooks(list: Playbook[]): Playbook[] {
  return [...list].sort((a, b) => {
    const catA = categoryOrder[a.category] || 99;
    const catB = categoryOrder[b.category] || 99;
    if (catA !== catB) return catA - catB;

    // For network services, sort by lowest port number
    const minPortA = a.port_triggers && a.port_triggers.length > 0 ? Math.min(...a.port_triggers) : 99999;
    const minPortB = b.port_triggers && b.port_triggers.length > 0 ? Math.min(...b.port_triggers) : 99999;
    if (minPortA !== minPortB) return minPortA - minPortB;

    return a.name.localeCompare(b.name);
  });
}

export const PLAYBOOKS: Playbook[] = sortPlaybooks(compiledPlaybooks as Playbook[]);

export function getPlaybookById(id: string): Playbook | undefined {
  return PLAYBOOKS.find((p) => p.id === id);
}

export function getPlaybooksForTarget(
  openPorts: number[],
  hasShell: boolean,
  os: string,
  portServices?: Record<number, string>
): Playbook[] {
  const serviceList = portServices ? Object.values(portServices).map((s) => s.toLowerCase()) : [];

  const filtered = PLAYBOOKS.filter((playbook) => {
    // If it's a password cracking guide, make it universally available
    if (playbook.category === 'passwords') return true;

    if (playbook.requires_shell) {
      if (!hasShell) return false;
      if (playbook.target_os && playbook.target_os !== os) return false;
      return true;
    }

    // 1. Port triggers match
    const portMatch = playbook.port_triggers.some((port) => openPorts.includes(port));
    if (portMatch) return true;

    // 2. Service triggers match (e.g. port 8978 mapped to 'http')
    if (playbook.service_triggers && playbook.service_triggers.length > 0) {
      const serviceMatch = playbook.service_triggers.some((st) =>
        serviceList.includes(st.toLowerCase())
      );
      if (serviceMatch) return true;
    }

    // 3. Category match fallback if service mapped
    if (playbook.category === 'web' && serviceList.some((s) => s.includes('http') || s.includes('web'))) {
      return true;
    }

    // 4. Unknown port triage playbook trigger
    if (
      playbook.id === 'unknown-service' &&
      openPorts.some(
        (p) =>
          portServices?.[p] === 'unknown' ||
          (![21, 22, 53, 80, 88, 123, 139, 389, 443, 445, 1433, 3389, 5985, 6379, 8080].includes(p) &&
            !['http', 'ssh', 'ftp', 'smb', 'ldap', 'mssql', 'winrm', 'redis', 'dns', 'kerberos', 'ntp'].includes(
              portServices?.[p] || ''
            ))
      )
    ) {
      return true;
    }

    return false;
  });

  return sortPlaybooks(filtered);
}
