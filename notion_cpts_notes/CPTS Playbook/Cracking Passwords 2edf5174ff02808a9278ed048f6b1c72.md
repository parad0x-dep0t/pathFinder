# Cracking Passwords

# Hashcat

| **Command** | **Description** |
| --- | --- |
| `sudo hashcat -m <mode> <hash-or-file> <wordlist>` | Wordlist bruteforce. |
| `hashcat --force <password-list> -r <custom-rule> --stdout | sort | uniq > mut_password.list` | Use Hashcat to generate a rule-based wordlist. |
| `sed -i '/^.\{4,15\}$/!d' mut_password.list` | Keep only entries in a list that are within a certain size. |

Wordlists to use:

- `/usr/share/wordlists/rockyou.txt` (for passwords)
- `/usr/share/hashcat/rules/rockyou-30000.rule` (for mutation rules)

# **John The Ripper**

| **Command** | **Description** |
| --- | --- |
| `john --wordlist=<wordlist> <hash-file>` | Cracking hash with a wordlist. |
| `sed 's/^.*://' <jtr-hash> > <hashcat-hash>` | Converts a JtR hash into a format that can be cracked by Hashcat. |

## **John the Ripper Conversions**

| **Tool** | **Description** |
| --- | --- |
| `pdf2john <file>.pdf > <file>.hash` | Converts PDF documents for John. |
| `ssh2john <private-key> > <file>.hash` | Converts SSH private keys for John. |
| `mscash2john <file>.dit > <file>.hash` | Converts MS Cash hashes for John. |
| `keychain2john <file>.keychain > <file>.hash` | Converts OS X keychain files for John. |
| `rar2john <file>.rar > <file>.hash` | Converts RAR archives for John. |
| `pfx2john <file>.pfx > <file>.hash` | Converts PKCS#12 files for John. |
| `truecrypt_volume2john <file>.tc > <file>.hash` | Converts TrueCrypt volumes for John. |
| `keepass2john <file>.kdbx > <file>.hash` | Converts KeePass databases for John. |
| `vncpcap2john <file>.pcap > <file>.hash` | Converts VNC PCAP files for John. |
| `putty2john <file>.log > <file>.hash` | Converts PuTTY private keys for John. |
| `zip2john <file>.zip > <file>.hash` | Converts ZIP archives for John. |
| `hccap2john <file>.hccapx > <file>.hash` | Converts WPA/WPA2 handshake captures for John. |
| `office2john <file>.docx > <file>.hashoffice2john <file>.xlsx > <file>.hash` | Converts MS Office documents for John. |
| `wpa2john <file>.cap > <file>.hash` | Converts WPA/WPA2 handshakes for John. |
| `bitlocker2john -i <file>.vhd > <file>.hash` | Converts VHD file for John. |
| `locate *2john* | grep <format>` | Check to see if there is a converter tool installed. |