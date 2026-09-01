# Windows Enumeration & PrivEsc

# **Enumeration**

- Enumerate users and groups
    - [ ]  List local users
    - [ ]  List local groups
    - Check membership of interesting groups
        - [ ]  Local Administrator
        - [ ]  Remote Desktop Users (RDP access)
        - [ ]  Remote Management Users (WinRM access)
- Enumerate operating system information
    - [ ]  Windows version and [build number](https://en.wikipedia.org/wiki/List_of_Microsoft_Windows_versions)
    - [ ]  Architecture (32 or 64 bit)
- Enumerate network information
    - [ ]  IP addresses and network interfaces
    - [ ]  List active connections and listening ports
- Enumerate program and processes information
    - [ ]  List all installed applications and services
    - [ ]  Look at processes for any running applications that are not installed
- [ ]  Enumerate security features

# **Privilege Escalation**

# **Global**

- [ ]  Try [WinPEAS](https://github.com/peass-ng/PEASS-ng/tree/master/winPEAS)
- Look for vulnerable services
    - [ ]  Services with weak executable permissions
    - [ ]  Services where we can alter the executable path
    - [ ]  Unquoted service paths
    - [ ]  Services prone to DLL hijacking
- [ ]  Check if `AlwaysInstallElevated` is enabled.
- [ ]  Search for CVEs in installed programs.
- [ ]  See if there are known exploits for the Windows version.

# **Per User**

- [ ]  Check user’s privileges
- [ ]  Check which groups user belongs to
- [ ]  Look for secrets in shell environment variables
- [ ]  Hunt for credentials
- [ ]  Look for Unquoted Service Paths
- [ ]  Look for exploitable Scheduled Tasks
- [ ]  Try planting malicious SCF and LINK files on writeable SMB shares.

# **After Administrator**

- Dump secrets
    - [ ]  Get credentials using LaZagne
    - [ ]  Dump SAM & LSA
    - [ ]  Dump LSASS memory
    - [ ]  Dump `NTDS.dit` (if Domain Controller)