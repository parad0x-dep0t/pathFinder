# Active Directory Enumeration

# Host Enumeration

## Linux

| **Command** | **Description** |
| --- | --- |
| `nxc smb <network-range>` | Scans the specified network range for SMB services, helping identify live Windows hosts. |
| `sudo responder -I <network-interface> -A` | Captures LLMNR, NBT-NS, and MDNS traffic on the specified interface to passively identify hosts.Analyze mode (`-A`) avoids active poisoning. |
| [Pivoting Reconnaissance](https://field-manual.brunorochamoura.com/manual/lateral-movement/pivoting/pivoting-recon/) | Techniques and tools used for internal reconnaissance after gaining a foothold in the network. |

## Windows

| **Command** | **Description** |
| --- | --- |
| [BloodHound & SharpHound](https://field-manual.brunorochamoura.com/manual/information-gathering/active-directory-enumeration/tools/bloodhound-sharphound/) | BloodHound can be used to enumerate the entire AD network and visualize relationships. |
| Get all info:`Get-NetComputer` 
Just crucial information:`Get-NetComputer | select cn,operatingsystem,dnshostname` | [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1) command to list domain computers and filter key details. |
| `nslookup <dnshostname>` | Resolves a hostname to an IP address via DNS. |

# **Users & Groups Enumeration**

## Without Access

| **Command** | **Description** |
| --- | --- |
| `nxc smb <dc> --usersnxc smb <dc> -u '' -p '' --users` | **(SMB)** Attempts to enumerate users via an SMB NULL session.Only works if the target allows SMB NULL sessions. |
| `ldapsearch -H ldap://<dc> -x -b "<domain-dn>" -s sub "(&(objectclass=user))" | grep sAMAccountName: | cut -f2 -d" "`
The Distinguished Name (DN) for the domain follows a structure like this:Domain: `BRM.COM` → DN: `DC=BRM,DC=COM` | **(LDAP)** Attempts to enumerate users via an anonymous LDAP bind.Only works if anonymous binding is enabled (rare). |
| `nxc smb <target> -u '' -p '' --rid-brute --rid-brute <max_rid>nxc smb <target> -u 'guest' -p '' --rid-brute --rid-brute <max_rid>` | **(Brute Force)** Uses RID brute forcing to enumerate domain objects. Defaults to RIDs up to 4000; using 8000+ is recommended for better coverage. |
| `kerbrute userenum -d <domain> --dc <dc> <wordlist> -o <output-file>`
Copy the output to a file, then extract users with:`sed -n 's/.*VALID USERNAME:[[:space:]]*\([^@]*\)@.*/\1/p' output.txt > users.lst` | **(Brute Force)** Uses Kerbrute and a worslist to enumerate valid usernames via Kerberos pre-authentication does not trigger account lockouts.Try to determine the username format and find a suitable wordlist. |
| `sudo responder -r -I <network-interface>` | **(Network Poisoning)** Launches Responder with default settings.Intercepts LLMNR/NBT-NS requests to capture usernames and password hashes.Usernames must be extracted manually. |

## With Access

### Linux

| **Command** | **Description** |
| --- | --- |
| `nxc smb <dc-ip> -u <user> -p <password> --users`Copy the output to a file, then extract users with:`awk '$5 ~ /^[a-zA-Z0-9_]+$/ && NF >= 5 { print $5 }' output.txt > users.lst` | **(SMB)** Retrieves a list of all users in the domain.Also shows the count of bad password attempts for each user. |
| `nxc smb <dc-ip> -u <user> -p <password> --groups` | **(SMB)** Retrieves a list of all groups in the domain.Includes the member count for each group.Pay special attention to key groups such as:- Administrators- Domain Admins- Executives |
| `nxc smb <host> -u <user> -p <password> --loggedon-users` | **(SMB)** Lists users currently logged on to the specified host (requires local admin rights).This could be a valuable opportunity to steal domain admin credentials from memory or impersonate them. |

### Windows

| **Command** | **Description** |
| --- | --- |
| `Get-NetDomain` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Retrieves basic information about the current Active Directory domain. |
| All information:`Get-NetUser`Only crucial information:`Get-NetUser | select cn,pwdlastset,lastlogon` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Lists all domain users, including details like password last set and last logon time. |
| All information:`Get-NetGroup`Only crucial information:`Get-NetGroup | select cn` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Enumerates all domain groups. |
| `Get-NetUser -SPN | select samaccountname,serviceprincipalname` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Finds accounts with Service Principal Names (SPNs), useful for Kerberoasting. |
| `Get-NetSession -Verbose -ComputerName <cn>` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Lists active user sessions on a remote computer (requires local admin rights).This could be a valuable opportunity to steal domain admin credentials from memory or impersonate them. |
| All users:`net user /domain`Specific user:`net user <user> /domain` | **(CMD)** Lists all domain users or detailed info for a specific user. |
| All groups:`net group /domain`Specific group:`net group <group> /domain` | **(CMD)** Lists all domain groups or members of a specified group. |

# **Password Policy Enumeration**

### Authenticated

| **Command** | **Description** |
| --- | --- |
| `nxc smb <dc> -u <user> -p <password> --pass-pol` | **(Linux)** Retrieves password policy from a domain controller using SMB via NetExec. |
| `Get-DomainPolicy` | **([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1))** Retrieves domain-wide password and Kerberos policy from Active Directory. |
| `net accounts` | **(CMD)** Displays local password and account lockout policies on a Windows host. |

### SMB Null Session

| **Command** | **Description** |
| --- | --- |
| `nxc smb <dc> -pass-pol` | **(Linux)** Retrieves domain password policy via SMB NULL session, if allowed, using NetExec. |
| `rpcclient -U "" -N <dc>querydominfogetdompwinfo` | **(Linux)** Uses SMB NULL session, if enabled, to query domain and password policy info via `rpcclient`. |

### LDAP Anonymous Binds

| **Command** | **Description** |
| --- | --- |
| `ldapsearch -H ldap://<dc> -x -b "<domain-dn>" -s sub "*" | grep -m 1 -B 10 pwdHistoryLength`
The Distinguished Name (DN) for the domain follows a structure like this:Domain: `BRM.COM` → DN: `DC=BRM,DC=COM` | **(Linux)** Retrieves password policy from the domain controller using anonymous SMB bind, if allowed. |

# **Object Permissions Enumeration**

| **Command** | **Description** |
| --- | --- |
| `Find-LocalAdminAccess` | Searches for computers where a specified user has local administrator rights within the domain.Depending on the size of the environment, it may take a few minutes for this command to finish. |
| `$sid = Convert-NameToSid <user>Get-DomainObjectACL -ResolveGUIDs -Identity * | ? {$_.SecurityIdentifier -eq $sid}` | Finds AD objects where the specified user (converted to SID) has explicit permissions set in their ACLs. |
| `Find-DomainShare`Add `-CheckShareAccess` for only readable sharesYou can then `dir \\<dns-hostname>\<share-name>` | Enumerates domain shares, optionally filtering for shares accessible with read permissions. |

# **BloodHound & SharpHound**

| **Command** | **Description** |
| --- | --- |
| PowerShell collector:`Import-Module .\Sharphound.ps1Invoke-BloodHound -CollectionMethod All -OutputDirectory .`
Executable collector:`BloodHound.exe -CollectionMethod All -OutputDirectory .` | Uses [SharpHound](https://github.com/SpecterOps/SharpHound/releases), the official BloodHound collector, to gather AD data from a Windows host via PowerShell or executable. |
| Run collector:`bloodhound-python -u '<user>' -p '<password>' -ns <nameserver> -d <domain> -c all`
Zip the JSON files created, so that it can be fed to BloodHound:`zip -r <output-file>.zip *.json` | Uses the [BloodHound Python collector](https://gitlab.com/kalilinux/packages/bloodhound.py) to gather AD data from a Linux host.Usually, the Domain Controller is also the nameserver.This has limitations, collecting from a Windows domain-joined host is more reliable. |
| Start neo4j daemon:`sudo neo4j start`
Open bloodhound via the GUIStops the daemon after use:`sudo neo4j stop` | Starts the Neo4j graph database, which is required to run BloodHound.The GUI connects to this service to visualize and query data. |