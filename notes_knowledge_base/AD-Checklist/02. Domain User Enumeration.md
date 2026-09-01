# Username Collection

## Objective

Enumerate valid domain usernames using unauthenticated and authenticated techniques. A comprehensive user list is essential for password spraying, Kerberoasting, AS-REP Roasting, BloodHound collection, and other Active Directory attacks.

---

## 1. Enumerate Users with Kerbrute

Use **Kerbrute** to validate usernames without generating failed login events (Kerberos pre-authentication requests).

### Using the SecLists xato Username Wordlist

```bash
kerbrute userenum -d <DOMAIN.LOCAL> --dc <DC_IP> /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt
```

### Example

```bash
kerbrute userenum -d corp.local --dc 192.168.1.10 /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt
```

> **Purpose:** Identify valid Active Directory usernames for further attacks.

---

## 2. Enumerate Users via RID Bruteforce

If anonymous or authenticated SMB access is available, enumerate domain users by brute-forcing Relative Identifiers (RIDs).

```bash
nxc smb <TARGET_IP> -u '' -p '' --rid-brute

# By default, RID brute-forcing enumerates RIDs up to 4000.
# If the highest discovered RID is close to 4000, increase the limit and run it again.

nxc smb <TARGET_IP> -u '' -p '' --rid-brute 6000

# If necessary, increase it further:

nxc smb <TARGET_IP> -u '' -p '' --rid-brute 8000
```

### Example Output

```text
500  Administrator
501  Guest
502  krbtgt
1103 jsmith
1104 svc_backup
```

> **Purpose:** Recover usernames even when LDAP enumeration is restricted.

---

## 3. Enumerate Users over SMB

If valid credentials are available, retrieve domain users through SMB.

```bash
nxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --users
```

### Using NTLM Hashes

```bash
nxc smb <TARGET_IP> -u <USER> -H <NTLM_HASH> --users
```

> **Purpose:** Enumerate users using authenticated SMB sessions.

---

## 4. Enumerate Users over LDAP

LDAP often provides richer user information than SMB.

```bash
nxc ldap <TARGET_IP> -u <USER> -p <PASSWORD> --users
```

### Using NTLM Hashes

```bash
nxc ldap <TARGET_IP> -u <USER> -H <NTLM_HASH> --users
```

> **Note:** In some environments, `--rid-brute` succeeds while `ldap --users` is restricted due to LDAP permissions.

---

## 5. Enumerate Users with rpcclient

If RPC allows anonymous or authenticated access:

```bash
rpcclient -U "" -N <TARGET_IP>
```

Inside the RPC shell:

```text
enumdomusers
```

Other useful commands:

```text
enumdomgroups
queryuser <RID>
querydispinfo
```

> **Purpose:** Enumerate domain users through the RPC service.

---

## 6. Check User Descriptions

User description fields frequently contain valuable information such as:

- Temporary passwords
- Initial passwords
- Employee IDs
- Email addresses
- Department names
- Service account notes

### Using SMB

```bash
nxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --users
```

### Using LDAP

```bash
nxc ldap <TARGET_IP> -u <USER> -p <PASSWORD> --users
```

> **Look for:**
>
> - `Password: Summer2024!`
> - `Temp Password`
> - `VPN Account`
> - `Service Account`
> - `Do not disable`
> - `SQL Service`
> - `Backup Account`

---

## 7. Build a Master Username List

Combine usernames from all enumeration methods into a single file.

```bash
cat kerbrute.txt rid-brute.txt ldap-users.txt smb-users.txt | sort -u > users.txt
```

### Verify the Number of Users

```bash
wc -l users.txt
```

> **Purpose:** Create a clean username list for password spraying, Kerberoasting, AS-REP Roasting, BloodHound, and other AD enumeration activities.

---

## Tips

- Use multiple enumeration techniques—different services may expose different users.
- RID bruteforcing can succeed even when LDAP enumeration is blocked.
- LDAP typically exposes additional attributes (description, email, groups, etc.).
- Always inspect user descriptions for accidentally exposed credentials.
- Remove duplicate usernames before using the list for password spraying or Kerberos attacks.

---

## Checklist

- [ ] Enumerate users with Kerbrute.
- [ ] Perform RID bruteforcing using nxc.
- [ ] Enumerate users over SMB.
- [ ] Enumerate users over LDAP.
- [ ] Enumerate users using rpcclient.
- [ ] Review user descriptions for passwords or sensitive information.
- [ ] Merge and deduplicate all discovered usernames into a master list.
