# Web Enumeration

# **Directory & Page Fuzzing**

| **Action** | **Description** |
| --- | --- |
| Check these pages:
`robots.txt
sitemap.xml
.git` | TODO maybe this should be on another article, or just on my methodology page |
| `ffuf -c -w <wordlist> -u http://<target-ip-or-domain>:<port>/FUZZ` | Fuzz for web directories using a single wordlist. If no iterator term is specified, `FUZZ` is assumed by default. |
| `ffuf -c -w <ext-wordlist> -u http://<target-ip-or-domain>:<port>/indexFUZZ` | Fuzz for index files in a web directory using a file extension wordlist. The accepted extensions should be known before starting. |
| `ffuf -c -w <filename-wordlist> -u http://<target-ip-or-domain>:<port>/FUZZ<extension>` | Once the extension is identified, fuzz for files with that specific extension. |
| `ffuf -c -w <wordlist> -u http://<target-ip-or-domain>:<port>/FUZZ -e <dot-extension>` | TODO just extension, no recursion |
| `ffuf -c -w <wordlist> -u http://<target-ip-or-domain>:<port>/FUZZ -recursion -recursion-depth <depth> -e <dot-extension>` | Recursively fuzz both web directories and files. If a directory is found, the search continues within that branch. This is more noisy and time-consuming but automated.TODO Let know this is a hail mary |

Wordlists to use:

- `/usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-small.txt` (for filenames)
- `/usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt` (for filenames)
- `/usr/share/wordlists/seclists/Discovery/Web-Content/web-extensions.txt` (for extensions)
- `/usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-extensions-lowercase.txt` (for extensions)

# **Parameter & Value Fuzzing**

| **Action** | **Description** |
| --- | --- |
| `curl -s http://<target-ip-or-domain>:<port>/admin.php | wc -c` | **(GET)** Get the baseline response to filter out bad results. Change the page URL as needed. |
| `ffuf -c -w <parameter-wordlist> -u http://<target-ip-or-domain>:<port>/admin.php?FUZZ=<appropriate-key> -fs <char-count>` | **(GET)** Fuzz parameters using the character count from the baseline to filter out bad results. |
| `curl -s http://<target-ip-or-domain>:<port>/admin.php -X POST -H "Content-Type: application/x-www-form-urlencoded" | wc -c` | **(POST)** Get the baseline response to filter out bad results. Change the page URL as needed. |
| `ffuf -c -w <parameter-wordlist> -u http://<target-ip-or-domain>:<port>/admin.php -X POST -d 'FUZZ=<appropriate-key>' -H 'Content-Type: application/x-www-form-urlencoded' -fs <char-count>` | **(POST)** Fuzz parameters using the character count from the baseline to filter out bad results. |

Wordlists to use:

| `/usr/share/wordlists/seclists/Discovery/Web-Content/burp-parameter-names.txt` (for parameters) |
| --- |
|  `/usr/share/wordlists/seclists/Fuzzing/LFI/LFI-Jhaddix.txt` (for LFI path traversal) |
| `/usr/share/wordlists/seclists/Discovery/Web-Content/default-web-root-directory-linux.txt` 

`/usr/share/wordlists/seclists/Discovery/Web-Content/default-web-root-directory-windows.txt` (for LFI web root fuzzing) |
|  `for i in $(seq 1 1000); do echo $i >> ids.txt; done` (for value sequences) |

# **Passive Subdomain Enumeration**

| **Action** | **Description** |
| --- | --- |
| `whois <target-FQDN>`
or
`whois <target-ip>` | Perform a WHOIS lookup to retrieve registration and contact details of the target domain. |
| `whois -h <whois-server> ...` | Perform a WHOIS lookup using a specified WHOIS server. |
| `curl -s https://crt.sh/\?q\=<target-domain>\&output\=json | jq .` | Retrieve certificate transparency logs for a domain from Crt.sh. |
| `curl -s https://crt.sh/\?q\=<target-domain>\&output\=json | jq . | grep name | cut -d":" -f2 | grep -v "CN=" | cut -d'"' -f2 | awk '{gsub(/\\n/,"\n");}1;' | sort -u > subdomain.lst` | Extract unique subdomains from Crt.sh logs and save them to `subdomain.lst`. |
| `for i in $(cat subdomain.lst); do host $i | grep "has address" | grep <target-domain> | cut -d" " -f4 >> ip-addresses.txt; done` | Resolve IP addresses for discovered subdomains and save to `ip-addresses.txt`. |
| `for i in $(cat ip-addresses.txt); do shodan host $i; done` | Scan each resolved IP address using Shodan for open ports or vulnerabilities. |
| [https://domain.glass/](https://domain.glass/) | Retrieve aggregated information about the domain. |
| [https://buckets.grayhatwarfare.com/files](https://buckets.grayhatwarfare.com/files) | Search for public cloud storage buckets related to the target domain. |
| [https://www.virustotal.com/gui/domain/](https://www.virustotal.com/gui/domain/) | View DNS history and related information that might reveal subdomains. |

# **Subdomain & Virtual Host Fuzzing**

| **Action** | **Description** |
| --- | --- |
| `curl -s -H "Host: nonexistant.<target-domain>" <target-ip>:<port> | wc -c` | Determine the character count for a “host-less” page to filter out bad results during V-Host fuzzing. |
| `ffuf -c -w <wordlist> -u http://<target-ip-or-domain>:<port>/ -H 'Host: FUZZ.<target-domain>' -fs <char-count>` | Fuzz for virtual hosts, filtering based on the character count. After finding a valid V-Host, add it to `/etc/hosts`. |
| `ffuf -c -w <wordlist> -u http://FUZZ.<target-domain>/` | Fuzz for DNS subdomains (works on public websites only). Avoid IP addresses, use real DNS domains. |

Wordlists to use:

|  `/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt` |
| --- |
|  `/usr/share/seclists/Discovery/DNS/namelist.txt` |

# Common Web App Enumeration