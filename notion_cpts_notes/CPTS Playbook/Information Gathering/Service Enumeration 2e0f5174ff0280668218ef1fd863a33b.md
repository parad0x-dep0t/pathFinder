# Service Enumeration

# **FTP (21)**

| **Action** | **Description** |
| --- | --- |
| `sudo nmap -sC -sV -p 21 -v <target>` | Performs an Nmap scan on the FTP service to identify versions, scripts, and checks for anonymous login. Quite noisy. |
| `sudo nmap -sV -p21 --script ftp-anon <target-ip>` | Runs an Nmap script to check for anonymous authentication on the target FTP server. |
| `ftp <target>nc -nv <target> 21telnet <target> 21` | Different ways to connect to a remote FTP service. |
| `wget -m --no-passive ftp://<user>:<password>@<target-ip>` | Recursively downloads all accessible files from the target FTP server using Wget. |

Common anonymous login credentials include:

- `anonymous`:`anonymous`
- `anonymous`:Blank
- `ftp`:`ftp`
- `guest`:`guest` Check the [Creds](https://field-manual.brunorochamoura.com/manual/information-gathering/service-enumeration/tools/creds/) tools for more default credentials.

The default ports for FTP are TCP port 21 for control commands and TCP port 20 for data transfer.

# **SSH (22)**

| **Action** | **Description** |
| --- | --- |
| `ssh-audit <target>` | Perform a security audit of the target SSH service, checking for vulnerabilities and misconfigurations. |
| `ssh <user>@<target>` | Log in to the SSH server using the SSH client. |
| `ssh -i private.key <user>@<target>` | Log in to the SSH server using a private key for authentication. |
| `ssh <user>@<target> -o PreferredAuthentications=password` | Force password-based authentication for login. |
| `cat /etc/ssh/sshd_config | grep -E 'PermitRootLogin|PubkeyAuthentication'` | If you have a shell on the target, check if root login or public key authentication is enabled on the server. |

# **SMTP (25,465,587)**

The default ports for SMTP is 25, but secure encrypted like SMTPS may use ports 465 and 587.

| **Action** | **Description** |
| --- | --- |
| `sudo nmap -sC -sV -p25 -v <target>` | Uses Nmap to fingerprint the mail server. The default scripts include “smtp-commands,” which lists all valid SMTP commands that the server can execute. |
| `telnet <target> 25` | Connects to the remote STMP service using telnet. |
| `sudo nmap -p25 --script smtp-open-relay -v <target>` | Test whether the mail server is an open relay. |
| `smtp-user-enum -M <mode> -U <wordlist> -t <target> -w <timeout-in-seconds> -v` | Enumerate potential usernames on the mail server using a wordlist. This method can be unreliable based on the server’s configuration.For mode, try `VRFY`, `EXPN` and `RCPT`. If you have a known user as |
| `swaks --server <target> --auth LOGIN --auth-user <user>@<domain> --auth-password <password> --from <user>@<domain> --to <victim>@<domain> --attach @<attachment-file> --header 'Subject: <subject>' --body '<body>'` | Sends an email using `swaks`.If you need to specify a file, use `@` as a prefix. |
| Wordlists to use: | `/usr/share/wordlists/seclists/Usernames/top-usernames-shortlist.txt` (Short, good for first round)
`/usr/share/wordlists/seclists/Usernames/xato-net-10-million-usernames.txt` (Very long) |

## **Common SMTP Commands**

| **Action** | **Description** |
| --- | --- |
| `AUTH PLAIN <base64-encoded-credentials>` | Authenticates the user by sending credentials in cleartext, typically in base64 encoding. |
| `HELO <domain-name>` | Initiates the session by identifying the client with its computer name (e.g., `HELO example.com`). |
| `EHLO <domain-name>` | Extends the HELO command to provide additional information about the client’s capabilities (e.g., `EHLO example.com`). |
| `MAIL FROM:<email-address>` | Specifies the sender’s email address (e.g., `MAIL FROM:<sender@example.com>`). |
| `RCPT TO:<email-address>` | Specifies the recipient’s email address (e.g., `RCPT TO:<recipient@example.com>`). |
| `DATA` | Starts the transmission of the email’s content. |
| `RSET` | Cancels the current email transmission while keeping the connection open. |
| `VRFY <email-address>` | Checks if a mailbox is available to receive messages (e.g., `VRFY user@example.com`). Can be used to attempt user enumeration via response codes. |
| `EXPN <email-address>` | Verifies if a mailbox exists for receiving messages (e.g., `EXPN user@example.com`), similar to VRFY. |
| `NOOP` | Requests a response from the server to keep the connection active and prevent a timeout. |
| `QUIT` | Ends the session with the server. |

# **DNS (53)**

| **Action** | **Description** |
| --- | --- |
| `sudo nmap -p53 -sV -sC -T4 -v <target-ip>` | Scans the target for DNS services and provides version and script information. |
| General enumeration:`dnsrecon -d <domain>`
Brute-force enumeration (more in-depth):`dnsrecon -d <domain> -D /usr/share/wordlists/seclists/Discovery/DNS/fierce-hostlist.txt -t brt`
Using custom nameserver:`dnsrecon ... -n <nameserver>` | Performs automated and advanced DNS enumeration using [DNSRecon](https://github.com/darkoperator/dnsrecon). |
| Retrieve all record types:`host <domain> <optional-nameserver>`
Query a specific record type (e.g., `A`, `TXT`, `NS`, `MX`):`host -t <record-type> <domain> <optional-nameserver>`
Attempt a zone transfer:`host -l <domain> <nameserver>`
More accurate output instead of human-friendly:`host -v ...` | Uses the `host` command, a native Linux tool, to query DNS records, including specific record types, and attempt zone transfers. |
| Retrieve all record types:`nslookup <domain> <optional-nameserver>`
Query a specific record type (e.g., `A`, `TXT`, `NS`, `MX`):`nslookup -type=<record-type> <domain> <optional-nameserver>`
Attempt a zone transfer:`nslookup -type=AXFR <domain> <optional-nameserver>` | Uses `nslookup`, a native Windows tool, to query DNS records interactively or directly from the command line. It can also attempt zone transfers, though most servers block this. |
| **Note 1:** According to [RFC 8482](https://datatracker.ietf.org/doc/html/rfc8482), `ANY` DNS queries may be deprecated. In that case, specific record types should be used. |  |
| **Note 2**: `AXFR` refers to Asynchronous Full Transfer Zone. |  |

# **TFTP (69)**

| **Action** | **Description** |
| --- | --- |
| `connect` | Specifies the remote host and optionally the port for file transfers. |
| `get` | Downloads a file or set of files from the remote host to the local host. |
| `put` | Uploads a file or set of files from the local host to the remote host. |
| `quit` | Exits the TFTP client. |
| `status` | Displays the current TFTP status, including transfer mode (ASCII or binary), connection status, and timeout value. |
| `verbose` | Toggles verbose mode on or off, providing more detailed information during file transfers. |
- **TFTP (Trivial File Transfer Protocol) is a simplified version of [FTP Enumeration (21)](https://field-manual.brunorochamoura.com/manual/information-gathering/service-enumeration/services/ftp-enumeration-21/), designed for fast and lightweight file transfers, but without the complexity of FTP’s features.**
- **However, TFTP lacks essential security mechanisms like authentication and encryption, making it vulnerable to unauthorized access and data interception.** Due to this lack of security, TFTP is typically only used in controlled, local, or isolated networks where these risks are minimized.
- Unlike FTP, TFTP does not support directory listing, and file management is more basic.

# **Finger (79)**

| **Action** | **Description** |
| --- | --- |
| `nc -vn <IP> 79` | Performs banner grabbing via the Finger service. |
| `finger @<IP>` | Lists all users on the target system (may not always work). |
| `finger <USERNAME>@<IP>` | Queries the existence of a specific user on the target system. |
| `msfconsole -x 'use auxiliary/scanner/finger/finger_users'` | Metasploit module for enumerating users using a wordlist (avoid the default wordlist, it’s less effective). |
| Some good wordlists for the Metasploit module: | **Shorter usernames**: `/usr/share/wordlists/seclists/Usernames/Names/names.txt`**Larger username set**: `/usr/share/wordlists/seclists/Usernames/xato-net-10-million-usernames.txt` |
- **The Finger service provides detailed information about users on a computer or network**, typically including their login name, full name, and sometimes additional information, such as contact details or office location.
- **You may leverage this service to enumerate local users on the target host.**
- **However, Finger is considered largely obsolete and is rarely used on modern systems.** It’s mostly found on older, legacy systems.

# **Kerberos (88)**

| **Action** | **Description** |
| --- | --- |
| `sudo nmap <target> -sV -v -p 88` | Nmap scans the Kerberos service. If detected, very likely to be a Domain Controller. |
- **Kerberos is a stateless authentication protocol that serves as the primary authentication mechanism within Microsoft Active Directory environments.**
- It ensures secure communication between clients and services by utilizing a trusted Key Distribution Center (KDC) located on Domain Controllers.
- By employing tickets, Kerberos authentication effectively separates user credentials from resource requests, preventing passwords from being transmitted over the network.

The KDC issues two key cryptographic credentials:

- **Ticket Granting Ticket (TGT)**:
    - Allows users to request additional service tickets.
    - Eliminates the need to re-enter credentials.
- **Ticket Granting Service (TGS)**:
    - Authorizes access to specific network services.
    - Grants access by presenting the relevant ticket to the service.

# **POP3 (110,995)**

| **Action** | **Description** |
| --- | --- |
| `sudo nmap --script "pop3-capabilities or pop3-ntlm-info" -sV -v -p <port> <target>` | Performs an Nmap scan to identify POP3 service capabilities and information. |
| `telnet <target> 110` | Connects to the POP3 service (unencrypted). |
| `openssl s_client -connect <target>:995` | Connects to the POP3S service (encrypted) using SSL. |
| **Note**: If you’re having issues with interacting with IMAP via the command line, consider using the [Evolution](https://wiki.gnome.org/Apps/Evolution) mail client. |  |

## **Common POP3 Commands**

| **Action** | **Description** |
| --- | --- |
| `USER <username>` | Identifies the user to the POP3 server. |
| `PASS <password>` | Authenticates the user with the provided password. |
| `STAT` | Requests the number of emails stored on the server. |
| `LIST` | Retrieves the number and size of all emails on the server. |
| `RETR <id>` | Requests the server to deliver the email specified by ID. |
| `DELE <id>` | Requests the server to delete the email specified by ID. |
| `CAPA` | Requests the server to display its capabilities. |
| `RSET` | Resets the state of the session, clearing any previous commands or flags. |
| `QUIT` | Closes the connection with the POP3 server. |

# **NFS (111, 2049)**

| **Action** | **Description** |
| --- | --- |
| `sudo nmap --script nfs* -sV -p111,2049 -v <target>` | Footprint NFS with Nmap. |
| `showmount -e <target>` | Show available NFS shares. |
| This can’t be done via proxychains.`sudo mount -t nfs <target>:/<share> <local-dir> -o nolock` | Mount the specific NFS share to a directory in the local filesystem. |
| `mount | grep nfs` | After mounting, get the settings for the share. |
| `sudo umount <local-dir>` | Unmount the specific NFS share from the local filesystem. |
| `lsof | grep '<target-NFS>'` | If unable to unmount due to target being busy, find the PID of processes using the share. |
| `kill -9 <PID>` | Kill the processes to allow unmounting. |

# **SMB (139, 445)**

| **Action** | **Description** |
| --- | --- |
| `nxc smb <target> -u '' -p '' --shares` | Anonymous login to SMB, lists available shares. |
| `nxc smb <target> -u 'guest' -p '' --shares` | Guest login to SMB, lists available shares. |
| `nxc smb <target> -u 'anonymous' -p '' --shares` | Anonymous login with ‘anonymous’ username to SMB, lists available shares. |
| `nxc smb <target> -u <user> -p '<password>' --shares` | Login with specified username and password to SMB, lists available shares. |
| `smbclient -L <target>` | Lists available SMB shares without authentication. |
| `smbclient -L <target> -U '' -p ''` | Lists available SMB shares with anonymous authentication. |
| `smbclient -L <target> -U '<user>' -p '<password>'` | Lists available SMB shares with normal user authentication. |
| `smbclient -N //<target>/<share>` | Connects to a specific SMB share with anonymous authentication. |
| `smbclient -U <user> //<target>/<share>` | Connects to a specific SMB share with user authentication. (Password prompt may appear) |
| `sudo mount //<target>/<share> <local-dir> -o` | Mounts a SMB share to a local directory for file access. Useful for large files. |
| `sudo mount //<target>/<share> <local-dir> -o username=<username>,password=<password>` | Mounts an SMB share with user authentication. Ideal for large file access. |
| `sudo umount <local-dir>` | Unmounts the SMB share from the local directory. May result in a seg fault, but it’s not an issue. |

> Note: 
1. If you’re facing timeouts when downloading large files, try mounting the SMB share. 
2. In an Active Directory environment, include the `-d <domain>` flag.
> 

## **Interacting from Windows**

| **Action** | **Description** |
| --- | --- |
| `net view \\<host> /all` | Displays all SMB shares, domain and resources of a host. |
| `dir \\<host>\<share>\` | Displays the contents of the specified share. |
| `net use n: \\<host>\<share>\` | Maps the specified file share to drive N: (or another unused letter). |
| `net use n: \\<host>\<share>\ /user:<user> <password>` | Maps the file share to drive N: with authentication. |
| `net use n: /delete` | Disconnects from the file share, replacing N: with the mapped drive letter. |

## **RPC-Client**

| **Action** | **Description** |
| --- | --- |
| `rpcclient -U "" -N <target>` | Connects to the SMB server without authentication, if allowed. |
| `rpcclient -U "<user>" <target>` | Connects to the SMB server with authentication. |
| `srvinfo` | Retrieves information about the target SMB server. |
| `enumdomains` | Enumerates all domains deployed in the network. |
| `querydominfo` | Provides detailed information about the domain, server, and users in the network. |
| `netshareenumall` | Lists all available shares on the SMB server. |
| `netsharegetinfo <share>` | Retrieves information about a specific SMB share. |
| `enumdomusers` | Enumerates all domain users and their associated RID (e.g., `user[:<username>] rid:[<rid>]`). |
| `queryuser <User_RID>` | Provides detailed information about a specific user based on their RID. |
| `querygroup <Group_RID>` | Retrieves detailed information about a specific group based on its RID. |

## **Spidering SMB Shares**

| **Action** | **Description** |
| --- | --- |
| `nxc smb <target> -u <user> -p '<password>' --shares` | Checks if the account has access to shared folders. |
| `nxc smb <target> -u <user> -p '<password>' --spider <share> --pattern <search-term>` | Spiders through a share to find files containing a specific string.TODO This syntax is lacking |
| `nxc smb <target> -u <user> -p '<password>' --spider <share> --regex <regex>` | Spiders through a share to find files matching a regex pattern.TODO This syntax is lacking |
| `nxc smb <target> -u <user> -p '<password>' --share <share> --get-file <remote-file> <local-file>` | Downloads a file from an SMB share.TODO This syntax is lacking |
| `nxc smb <target> -u <user> -p '<password>' --share <share> --put-file <local-file> <remote-file>` | Uploads a file to an SMB share.TODO relevant here? |
| `nxc smb <target> -u <user> -p '<password>' -M spider_plus -o DOWNLOAD_FLAG=TRUE` | Downloads all files from all non-excluded shares to `/tmp/cme_spider_plus`. |

# **IMAP (143, 993)**

| **Action** | **Description** |
| --- | --- |
| `sudo nmap --script "imap-capabilities or imap-ntlm-info" -sV -v -p <port> <target>` | Performs an Nmap scan to gather information about the IMAP service. |
| `telnet <target> 143` | Connects to the unencrypted IMAP service. |
| `openssl s_client -connect <target>:993` | Connects to the encrypted IMAPS service using SSL. |

## **Common IMAP Commands**

| **Action** | **Description** |
| --- | --- |
| `1 LOGIN <username> <password>` | Authenticates the user with the provided username and password. |
| `1 LIST "" *` | Lists all available mailboxes on the server. |
| `1 CREATE "<mailbox>"` | Creates a new mailbox with the specified name. |
| `1 DELETE "<mailbox>"` | Deletes the specified mailbox. |
| `1 RENAME "<old>" "<new>"` | Renames a mailbox from old name to new name. |
| `1 LSUB "" *` | Lists the subscribed mailboxes for the user. |
| `1 SELECT <mailbox>` | Selects the specified mailbox for accessing messages. |
| `1 UNSELECT <mailbox>` | Deselects the currently selected mailbox. |
| `1 FETCH <ID> all` | Fetches all data associated with the message identified by the given ID. |
| `1 CLOSE` | Closes the current mailbox and removes any marked messages. |
| `1 LOGOUT` | Ends the session and logs the user out from the IMAP server. |

# **SNMP (161,162,10161,10162)**

snmpwalk -v2c -c public 192.168.135.156 NET-SNMP-EXTEND-MIB::nsExtendObjects

| **Action** | **Description** |
| --- | --- |
| `sudo nmap -sUV -p 161,162,10161,10162 -v <target>` | Performs an Nmap scan on the SNMP service to the identify version. We want it to be v1 or v2c. |
| `snmpcheck <target>` | Automatically retrieves information from the SNMP service and displays it in a more organized way.This does **not** replace brute-force scanning. |
| `onesixtyone -c /usr/share/seclists/Discovery/SNMP/snmp.txt <target>` | Performs a brute force attack on the SNMP community string. The community string is enclosed in square brackets. |
| `snmpwalk -v <1|2c|3> -c <community-string> -oA <target>` | Initiates an SNMP scan on a target, starting from the root of the MIB tree. |
| `sudo apt install download-mibssnmpwalk ... NET-SNMP-EXTEND-MIB::nsExtendOutputFull` | Installs MIB files (including NET-SNMP-EXTEND-MIB) and then uses `snmpwalk` to enumerate the output of custom scripts or commands defined on the remote SNMP agent.**Very important**, often reveals new information. |
| `snmpwalk -v <1|2c|3> -c <community-string> -oA <target> <OID>` | Conducts an SNMP scan on a target, starting from a specific Object Identifier (OID). |
| System Processes: `1.3.6.1.2.1.25.1.6.0`Running Programs: `1.3.6.1.2.1.25.4.2.1.2`Processes Path: `1.3.6.1.2.1.25.4.2.1.4`Storage Units: `1.3.6.1.2.1.25.2.3.1.4`Software Name: `1.3.6.1.2.1.25.6.3.1.2`User Accounts: `1.3.6.1.4.1.77.1.2.25`TCP Local Ports: `1.3.6.1.2.1.6.13.1.3` | These some noteworthy OIDs used by Microsoft Windows SNMP.If the target is a Windows machine, try these before brute-forcing all OIDs. |
| `snmpwalk -v2c -c public 192.168.135.156 NET-SNMP-EXTEND-MIB::nsExtendObjects` | MOST Important command |

# **LDAP (389, 636, 3268, 3269)**

TODO nxc stuff here [https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-ldap.html](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-ldap.html)

| **Command** | **Description** |
| --- | --- |
| `ldapsearch -x -H ldap://<target>` | Anonymous bind, basic info |
| `ldapsearch -x -H ldap://<target> -b "dc=domain,dc=com"` | Anonymous bind with base DN |
| `ldapsearch -x -H ldap://<target> -D "user@domain" -w "pass" -b "dc=domain,dc=com"` | Authenticated bind |
| `nxc ldap <target> -u '' -p ''` | Anonymous LDAP enumeration |
| `nxc ldap <target> -u 'user' -p 'pass'` | Authenticated LDAP enumeration |
| `python windapsearch.py -d domain.com --dc-ip <target>` | Comprehensive Windows LDAP enumeration |

# **IPMI (623)**

| **Action** | **Description** |
| --- | --- |
| `sudo nmap -sU --script ipmi-version -p 623 <target>` | Perform an IPMI version scan using Nmap. |
| `msfconsole -x "use auxiliary/scanner/ipmi/ipmi_version; set RHOSTS <target>; run;"` | Scan for IPMI version using Metasploit. |
| `msfconsole -x "use auxiliary/scanner/ipmi/ipmi_dumphashes; set RHOSTS <target>; run;"` | Extract password hashes by exploiting a flaw in RAKP version 2.0. |
| `root`:`calvinADMIN`:`ADMIN` | Try the following default credentials. 
More information about these accounts below. |
| **Note:** Use Hashcat mode `7300` to crack RAKP hashes. |  |

The default credentials for some common vendors:

- **Dell iDRAC**
    - Username: `root`
    - Password: `calvin`
- **HP iLO**
    - Username: `Administrator`
    - Password: Randomized 8-character string consisting of numbers and uppercase letters
- **Supermicro IPMI**
    - Username: `ADMIN`
    - Password: `ADMIN` Check the [Creds](https://field-manual.brunorochamoura.com/manual/information-gathering/service-enumeration/tools/creds/) tools for more default credentials.

# **Rsync (873)**

| **Action** | **Description** |
| --- | --- |
| `sudo nmap -sV -p 873 <target>` | Scan for Rsync version to determine protocol version. |
| `nc -nv <target> 873` | Probe for accessible Rsync modules. |
| `msfconsole -x "use auxiliary/scanner/rsync/modules_list; set RHOSTS <target>; run;"` | Enumerate shared Rsync modules using Metasploit. |
| `rsync -av --list-only rsync://<target>/<module>` | List files from an open Rsync module. |
| `rsync -av rsync://<target>/<module> ./rsyn_shared` | Copy all files from an open Rsync module to the local machine. |
| **Note 1**: When using Rsync CLI, specify a user with the syntax: `rsync://<user>@<target>/<module>`. |  |
| **Note 2**: To transfer files using SSH encryption, add the `-e ssh` flag. For non-standard SSH ports, use `-e ssh -p<port>`. |  |

# **MSSQL (1433, 1434, 2433)**

## From Linux:

| **Action** | **Description** |
| --- | --- |
| `nxc mssql <target> -u <username> -p <password> -d >domain>` | Specifies an Active Directory account. |
| `nxc mssql <target> -u <username> -p <password> -d .` | Specifies a local Windows account; use a dot (.) for the domain option or provide the target machine name. |
| `nxc mssql <target> -u <username> -p <password> --local-auth` | Specifies a SQL account; use the `--local-auth` flag. |
| `nxc mssql ... -q '<query>'` | Executes a query against the MSSQL service. |
| `impacket-mssqlclient <username>:<password>@<target> -windows-auth` | Uses Impacket’s MSSQL client to authenticate using Windows credentials. |
| **Note**: If [NetExec](https://github.com/Pennyw0rth/NetExec) outputs a `Pwn3d!` when authenticating, the user is a Database Administrator. |  |

## From **Windows (Powershell):**

| **Action** | **Description** |
| --- | --- |
| `sqlcmd -S <target> -U <user> -P '<password>' -y 30 -Y 30` | Logs in to the MSSQL server with the [sqlcmd](https://learn.microsoft.com/en-us/sql/tools/sqlcmd/sqlcmd-utility?view=sql-server-ver16), which is a built-in tool. |
| `Import-Module .\PowerUpSQL.ps1Get-SQLInstanceDomainGet-SQLQuery -Verbose -Instance "<server-ip>,<server-port>" -username "<domain>\<user>" -password "<password>" -query 'Select @@version'` | Uses the [PowerUpSQL](https://github.com/NetSPI/PowerUpSQL) tool to query the server. |

### **T-SQL Commands**

Transact-SQL (T-SQL) is Microsoft’s extension of SQL used with MSSQL.

| **Action** | **Description** |
| --- | --- |
| `SELECT name FROM sys.databases;` | Show all databases. |
| `USE <database>;` | Select a specific database. |
| `SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE';`
**Alternative:** `SELECT table_name FROM <database>.INFORMATION_SCHEMA.TABLES` | Show all tables in the selected database. |
| `SELECT column_name FROM information_schema.columns WHERE table_name = '<table>';` | Show all columns in the specified table. |
| `SELECT * FROM <table>;`
**Alternative:** `SELECT * FROM [<database>].[dbo].<table>` | Show all records from the specified table. |
| `SELECT * FROM <table> WHERE <column> = '<string>';` | Search for a string in a specific column of the table. |

# **Oracle TNS (1521)**

| **Action** | **Description** |
| --- | --- |
| `sudo nmap --script "oracle-tns-version" -p 1521 -sV -v <target>` | Perform a version scan using Nmap. |
| `msfconsole -x "use auxiliary/scanner/oracle/sid_enum; set RHOSTS <target>; run;"` | SID enumeration via Metasploit (works on versions < 9.2.0.8). |
| `odat sidguesser -s <target>` | Brute force SID with odat. |
| `sudo odat passwordguesser -s <target> -d <sid>` | Credential brute force with odat. |
| `odat all -s <target>` | Perform various scans to gather information about Oracle database services. |
| `sqlplus <user>/<pass>@<target>/<sid>` | Log in to the Oracle database. |
| `sqlplus <user>/<pass>@<target>/<sid> as sysdba` | Log in to the Oracle database as sysdba (admin). |
| `SYS`:`CHANGE_ON_INSTALL
DBSNMP`:`DBSNMP
SCOTT`:`TIGER
OUTLN`:`OUTLN
WMSYS`:`WMSYS
PCMS_SYS`:`PCMS_SYS` | Try the following default credentials. |

# **MySQL (3306)**

| **Action** | **Description** |
| --- | --- |
| `sudo nmap -sV -sC -p 3306 <target>` | Nmap scan on MySQL service, will display hostname and version. |
| `mysql -u <user> -p -h <target>` | Connects to the MySQL server. |

## **SQL Commands**

### Enum

| **Action** | **Description** |
| --- | --- |
| `SHOW databases;` | Show all databases. |
| `USE <database>;` | Select one of the existing databases. |
| `SHOW TABLES;` | Show all available tables in the selected database. |
| `DESCRIBE <table>;` | Show all columns and their type in the selected table. |
| `SHOW COLUMNS FROM <table>;` | Show all columns in the selected table. |

### **SELECT Statement**

| **Command** | **Description** |
| --- | --- |
| `SELECT * FROM <table>;` | Show all columns in the desired table. |
| `SELECT <column_X>, <column_Y> FROM <table>;` | Show some columns in the desired table. |
| `SELECT * FROM <table> WHERE <column> = "<string>";` | Search for the needed string in the desired table. |

### **INSERT Statement**

| **Command** | **Description** |
| --- | --- |
| `INSERT INTO <table> VALUES (<column_value_1>, <column_value_2>);` | Insert values in a table. Columns are by order. |
| `INSERT INTO <table>(<column_X>, <column_Y>) VALUES (<value_X>, <value_Y>);` | Insert values for certain columns in a table. The rest of the columns are empty or default. |

### **UPDATE Statement**

| **Command** | **Description** |
| --- | --- |
| `UPDATE <table> SET <column_X>=<value_X>, <column_Y>=<value_Y>, ... WHERE <condition>;` | Updates a specific record in a table according to some condition. |

### **Table Manipulation**

| **Command** | **Description** |
| --- | --- |
| `DROP <table>;` | Removes a table from the database. |
| `ALTER TABLE <table> ADD <new-column> <data-type>;` | Adds a column to a table. |
| `ALTER TABLE <table> RENAME <new-column> <data-type>;` | Alters the name of a table’s column. |

# **RDP (3389)**

| **Action** | **Description** |
| --- | --- |
| `sudo nmap -sV -sC -p3389 --script rdp* <target>` | Footprint via Nmap scan. Reveals encryption standards, hostname, etc. Quite noisy. |
| `rdp-sec-check.pl <target>` | Check the security settings of the RDP service. |
| `xfreerdp /u:<user> /p:'<password>' /v:<target> /dynamic-resolution` | Log in to the RDP server from Linux with high fidelity. |
| `xfreerdp ... /bpp:8 /network:modem /compression -themes -wallpaper /clipboard /audio-mode:1 /auto-reconnect -glyph-cache` | Log in to the RDP server from Linux with low fidelity. Use this if RDP is too slow. |
| `xfreerdp ... /drive:linux,<local-directory>`
On the Windows host, use this command to find where the drive is:`net use` | Login to the RDP server from Linux while mounting a local directory. Excellent for exfiltration. |
| `mstsc.exe` | Windows’ native RDP Client. |