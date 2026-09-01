# Initial Enumeration

## Objective

Perform initial reconnaissance against the target to identify exposed services, potential anonymous access, and misconfigurations before proceeding with Active Directory enumeration.

---

## 1. Scan All TCP Ports

Identify all open TCP ports and the services running on the target.

### Fast TCP Port Scan

```bash
nmap -Pn -p- --min-rate 1000 -T4 <TARGET_IP> -oA tcp-all-ports

OR
# Scanner.sh is in the repo
bash scanner.sh <IP> <output-file-name>
```

### Service & Version Detection

```bash
nmap -Pn -sC -sV -p <OPEN_PORTS> <TARGET_IP> -oA tcp-services
```

> **Tip:** Save the list of open ports from the first scan and use them in the second scan.

---

## 2. Scan UDP Ports

Many Active Directory services (such as DNS, Kerberos, and NTP) use UDP.

### Top UDP Ports

```bash
sudo nmap -Pn -sU --top-ports 100 <TARGET_IP> -oA udp-top100
```

### Full UDP Scan (Optional)

```bash
sudo nmap -Pn -sU -p- <TARGET_IP> -oA udp-all
```

> **Note:** Full UDP scans are significantly slower than TCP scans.

---

## 3. Check LDAP for Anonymous Access

Determine whether the LDAP server allows anonymous binds.

### LDAP RootDSE Enumeration

```bash
ldapsearch -x -H ldap://<TARGET_IP> -s base
```

### Attempt Anonymous Directory Enumeration

```bash
ldapsearch -x -H ldap://<TARGET_IP> -b "DC=<DOMAIN>,DC=<TLD>"
```

### Verify LDAP Ports

- **389** - LDAP
- **636** - LDAPS
- **3268** - Global Catalog
- **3269** - Global Catalog (SSL)

> **Goal:** Determine whether user, group, or domain information can be retrieved without authentication.

---

## 4. Check RPC for Anonymous Access

Determine whether the RPC service allows anonymous enumeration.

### Enumerate Using rpcclient

```bash
rpcclient -U "" -N <TARGET_IP>
```

If successful, try:

```text
enumdomusers
enumdomgroups
querydominfo
lsaquery
```

### Alternative (Impacket)

```bash
lookupsid.py anonymous@<TARGET_IP> -no-pass
```

> **Goal:** Identify whether users, groups, SIDs, or domain information can be enumerated anonymously.

---

## 5. Check SMB for Anonymous Access

Determine whether SMB permits anonymous authentication.

### List Available Shares

```bash
smbclient -L //<TARGET_IP> -N
```

### Enumerate SMB Information

```bash
enum4linux -a <TARGET_IP>
enum4linux-ng <TARGET_IP>
```

or

```bash
nxc smb <TARGET_IP>
nxc smb <TARGET_IP> --generate-hosts-file hosts-file
nxc smb <TARGET_IP>  -u '' -p '' --shares
```

> **Goal:** Identify accessible shares and determine whether null sessions are permitted.

---

## 6. Check for Public SMB Shares

Identify readable or writable shares that do not require authentication.

### Connect to a Share

```bash
smbclient //<TARGET_IP>/<SHARE_NAME> -N
```

### Useful SMB Commands

```text
ls
cd
get <file>
put <file>
mkdir <directory>
```

### Recursively Download Files

```bash
smbclient //<TARGET_IP>/<SHARE_NAME> -N
```

Inside the SMB shell:

```text
recurse ON
prompt OFF
mget *
```

> **Look for:**
>
> - Configuration files
> - Passwords
> - SSH keys
> - Backup files
> - Scripts
> - Database exports
> - Credentials
> - Group Policy Preferences (GPP)
> - Documentation containing sensitive information

---

## Common AD Ports

| Port | Service |
|------|---------|
| 53 | DNS |
| 88 | Kerberos |
| 135 | RPC Endpoint Mapper |
| 139 | NetBIOS Session Service |
| 389 | LDAP |
| 445 | SMB |
| 464 | Kerberos Password Change |
| 593 | RPC over HTTP |
| 636 | LDAPS |
| 3268 | Global Catalog |
| 3269 | Global Catalog (SSL) |
| 5985 | WinRM (HTTP) |
| 5986 | WinRM (HTTPS) |
| 9389 | Active Directory Web Services |

---

## Checklist

- [ ] Scan all TCP ports.
- [ ] Perform service/version detection.
- [ ] Scan common UDP ports.
- [ ] Test for anonymous LDAP access.
- [ ] Test for anonymous RPC access.
- [ ] Test for anonymous SMB access.
- [ ] Enumerate SMB shares.
- [ ] Check for readable and writable public shares.
- [ ] Download interesting files for offline analysis.
