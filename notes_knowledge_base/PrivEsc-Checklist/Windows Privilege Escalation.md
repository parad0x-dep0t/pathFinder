# Windows Privilege Escalation Checklist

## Objective

Enumerate the Windows host, identify privilege escalation vectors, recover credentials, abuse misconfigurations, and obtain SYSTEM or Administrator privileges.

> **Rule:** Enumerate manually first, then validate findings using automated tools.

---

# 1. Basic Enumeration

Determine:

```cmd
whoami
hostname
systeminfo
whoami /groups
whoami /priv
```

Check:

- Current user
- Groups
- Integrity Level
- Privileges
- Windows Version
- Patch Level

---

# 2. Automated Enumeration

Run:

- WinPEAS
- PowerUp.ps1
- PrivescCheck.ps1 (HTML Report)
- Seatbelt.exe
- SharpUp.exe
- Watson.exe
- BeRoot.exe

Example:

```powershell
Import-Module .\PowerUp.ps1
Invoke-AllChecks
```

---

# 3. Environment Variables

```cmd
set
```

Look for:

- Credentials
- API Keys
- Tokens
- Interesting paths

---

# 4. PowerShell History

Current User

```powershell
(Get-PSReadLineOption).HistorySavePath
gc (Get-PSReadLineOption).HistorySavePath
```

All Users

```powershell
foreach($u in (Get-ChildItem C:\Users).FullName){
type "$u\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt"
}
```

---

# 5. Stored Credentials

```cmd
cmdkey /list
```

---

# 6. DPAPI

Useful tools:

- SharpDPAPI
- Mimikatz

Look for:

- Browser passwords
- WiFi credentials
- Vault credentials

---

# 7. Registry Credentials

Check:

```cmd
reg query HKLM /f password /t REG_SZ /s
reg query HKCU /f password /t REG_SZ /s
```

Interesting:

```cmd
reg query HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon
```

PuTTY

```cmd
reg query HKCU\Software\SimonTatham\PuTTY\Sessions
```

---

# 8. Browser Credentials

Useful tools:

- SharpChrome
- LaZagne
- Mimikatz DPAPI

---

# 9. Startup Applications

Current User

```cmd
dir "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
```

All Users

```cmd
dir "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup"
```

Check:

- Writable files
- Executables
- Scripts

---

# 10. Installed Applications

Review:

```cmd
wmic product get name,version
```

Also inspect:

```
C:\Program Files
C:\Program Files (x86)
```

Look for:

- Credentials
- Configuration files
- Service binaries

---

# 11. User Directories

Review every profile.

```
Desktop
Documents
Downloads
Pictures
Videos
```

Look for:

- Passwords
- SSH Keys
- RDP files
- VPN configs
- KeePass databases

---

# 12. Interesting Files

Search:

```powershell
Get-ChildItem C:\ -Recurse -Force -Include `
*.txt,*.log,*.config,*.xml,*.ini,*.kdbx,*.ppk,*.rdp,*.ps1,*.bat,*.cmd,*.vbs `
-ErrorAction SilentlyContinue
```

---

# 13. Services

Enumerate:

```cmd
sc query
```

Review:

- Service permissions
- Writable binaries
- Unquoted Service Paths

PowerUp checks these automatically.

---

# 14. Unquoted Service Paths

PowerUp

or

```cmd
wmic service get name,displayname,pathname,startmode
```

Look for:

```
Program Files\Service Folder\Service.exe
```

without quotes.

---

# 15. Weak Service Permissions

Check:

- SERVICE_CHANGE_CONFIG
- SERVICE_START
- SERVICE_STOP

Useful:

```cmd
accesschk.exe
```

---

# 16. Scheduled Tasks

```cmd
schtasks /query /fo LIST /v
```

Check:

- Writable executables
- Writable scripts

---

# 17. AlwaysInstallElevated

```cmd
reg query HKCU\Software\Policies\Microsoft\Windows\Installer

reg query HKLM\Software\Policies\Microsoft\Windows\Installer
```

---

# 18. Token Privileges

```cmd
whoami /priv
```

Interesting:

- SeImpersonatePrivilege
- SeAssignPrimaryTokenPrivilege
- SeBackupPrivilege
- SeRestorePrivilege

Juicy Potato family

- JuicyPotato
- RoguePotato
- PrintSpoofer
- GodPotato
- SweetPotato

---

# 19. DLL Hijacking

Review custom applications.

Useful:

```cmd
procmon
```

Look for:

- Missing DLLs
- Writable locations

---

# 20. PATH Hijacking

Review:

```cmd
echo %PATH%
```

Look for writable directories.

---

# 21. Writable Directories

```powershell
Get-ChildItem C:\ -Directory -Recurse -ErrorAction SilentlyContinue
```

Interesting:

- ProgramData
- Temp
- Public

---

# 22. File Permissions

Useful:

```cmd
icacls
```

Look for:

- Modify
- Full Control

---

# 23. SAM & SYSTEM

If Administrator:

```cmd
reg save HKLM\SAM sam.save

reg save HKLM\SYSTEM system.save
```

---

# 24. LSA Secrets

Administrator

Useful:

- Mimikatz
- secretsdump.py

---

# 25. Credential Manager

```cmd
vaultcmd /list
```

---

# 26. Running Processes

```cmd
tasklist /v
```

Look for:

- Password managers
- Backup software
- Database software

---

# 27. Network Services

```cmd
netstat -ano
```

Look for:

- Localhost services
- Admin panels
- Databases

---

# 28. Installed Drivers

```cmd
driverquery
```

Look for vulnerable drivers.

Useful:

- LOLDrivers
- CVE search

---

# 29. Windows Defender

```powershell
Get-MpComputerStatus
```

Check:

- Exclusions
- Disabled protections

---

# 30. UAC

```cmd
reg query HKLM\Software\Microsoft\Windows\CurrentVersion\Policies\System
```

Look for:

- AutoElevate opportunities
- UAC level

---

# 31. Cached Credentials

Administrator

Useful:

- Mimikatz

Check:

- logonpasswords
- sekurlsa
- wdigest

---

# 32. AV & EDR

Identify:

- Antivirus
- EDR
- Logging

Useful:

```cmd
sc query
tasklist
```

---

# 33. Backup Operators

Check:

```cmd
whoami /groups
```

Interesting groups:

- Backup Operators
- Print Operators
- Server Operators
- Hyper-V Administrators

---

# 34. IIS / XAMPP

Review:

```
inetpub
xampp
```

Look for:

- web.config
- config.php
- .env
- database credentials

---

# 36. Print Spooler

Determine whether the Print Spooler service is running.

```cmd
sc query spooler
```

Check:

- PrintNightmare applicability
- PrinterBug (for NTLM coercion in AD)
- Spooler enabled on Domain Controllers

---

# 37. Backup Privileges

Review:

```cmd
whoami /priv
whoami /groups
```

Interesting:

- SeBackupPrivilege
- SeRestorePrivilege

Abuse examples:

- Read SAM
- Read SYSTEM
- Read NTDS.dit (Domain Controller)
- Backup Operators group

Useful tools:

- robocopy /b
- diskshadow
- secretsdump.py

---

# 38. MSI Installation Abuse

Review:

```cmd
reg query HKLM\Software\Policies\Microsoft\Windows\Installer

reg query HKCU\Software\Policies\Microsoft\Windows\Installer
```

Check:

- AlwaysInstallElevated
- Writable MSI packages
- MSI repair abuse

---

# 39. Named Pipe Impersonation

Check:

```cmd
whoami /priv
```

Interesting privilege:

- SeImpersonatePrivilege

Useful tools:

- PrintSpoofer
- JuicyPotato
- RoguePotato
- SweetPotato
- GodPotato

---

# 40. Vulnerable Drivers

Enumerate:

```cmd
driverquery

pnputil /enum-drivers
```

Review:

- Outdated drivers
- Third-party drivers
- LOLDrivers database

Look for:

- BYOVD opportunities
- Known CVEs

---

# 41. Third-Party Software

Enumerate:

```cmd
wmic product get name,version

dir "C:\Program Files"

dir "C:\Program Files (x86)"
```

Look for:

- Backup software
- Monitoring agents
- Antivirus
- Remote management software
- Database software

Search:

- SearchSploit
- CVEs
- Vendor advisories

---

# 42. Windows Services Review

Review all services.

```cmd
sc query

wmic service get name,displayname,pathname,startmode
```

Check:

- Writable binaries
- DLL hijacking
- Weak ACLs
- Unquoted service paths
- Service account credentials

---

# 43. Interesting Privileged Groups

```cmd
whoami /groups
```

Review membership in:

- Administrators
- Backup Operators
- Print Operators
- Server Operators
- Hyper-V Administrators
- Remote Management Users
- Remote Desktop Users
- Event Log Readers
- Distributed COM Users

Research any unfamiliar privileged group before dismissing it.

---

# 44. Domain-Specific Checks

If the machine is domain joined:

Check:

- Cached domain credentials
- Active user sessions
- Mounted shares
- WinRM access
- RDP access
- Kerberos tickets
- Machine account permissions

Useful tools:

- Mimikatz
- Rubeus
- SharpHound
- Seatbelt

---

# 45. Kerberos & Session Enumeration

Review:

```cmd
klist
query user
qwinsta
```

Useful tools:

- Rubeus triage
- Rubeus dump
- Mimikatz sekurlsa::tickets

Look for:

- Cached TGTs
- Service Tickets
- Domain Admin sessions
- High-value user logons

A compromised administrator session may allow Pass-the-Ticket or credential extraction without needing to crack passwords.

---

# 46. Final Checklist

Before leaving the machine, ensure you have checked:

- [ ] WinPEAS
- [ ] PowerUp
- [ ] Seatbelt
- [ ] PowerShell History
- [ ] Environment Variables
- [ ] Registry Credentials
- [ ] Browser Credentials
- [ ] DPAPI
- [ ] Stored Credentials
- [ ] Services
- [ ] Scheduled Tasks
- [ ] Startup Applications
- [ ] Installed Software
- [ ] User Directories
- [ ] Configuration Files
- [ ] Token Privileges
- [ ] Potato Exploits
- [ ] DLL Hijacking
- [ ] PATH Hijacking
- [ ] Writable Files
- [ ] SAM & SYSTEM
- [ ] LSA Secrets
- [ ] Credential Manager
- [ ] Running Processes
- [ ] Localhost Services
- [ ] Installed Drivers
- [ ] Windows Defender
- [ ] UAC
- [ ] Cached Credentials
- [ ] AV / EDR
- [ ] Privileged Groups
- [ ] IIS / XAMPP
- [ ] Print Spooler
- [ ] Backup Privileges
- [ ] MSI Abuse
- [ ] Named Pipe Impersonation
- [ ] Third-Party Software
- [ ] Domain-Specific Enumeration
- [ ] Kerberos & Session Enumeration