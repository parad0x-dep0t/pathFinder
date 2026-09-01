# Content Discovery & Attack Surface Mapping

## Objective

Discover hidden directories, files, virtual hosts, subdomains, parameters, APIs, backups, and administrative interfaces that expand the application's attack surface.

> **Rule:** Every new directory or endpoint should trigger another round of enumeration.

---

# 1. Directory Discovery

Enumerate hidden directories.

## FFUF

```bash
ffuf -u http://<TARGET>/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

Useful wordlists:

- SecLists
- Dirbuster
- raft-medium-directories
- quickhits.txt

Interesting findings:

- `/admin`
- `/backup`
- `/test`
- `/dev`
- `/staging`
- `/old`
- `/uploads`

---

# 2. File Discovery

Search for common files.

```bash
ffuf -u http://<TARGET>/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -e .php,.txt,.bak,.zip,.tar,.gz,.old,.conf,.config,.ini,.xml,.json
```

Interesting extensions:

- `.bak`
- `.old`
- `.zip`
- `.tar.gz`
- `.conf`
- `.config`
- `.sql`
- `.env`
- `.swp`
- `.orig`

---

# 3. Recursive Fuzzing

If new directories are discovered, enumerate them recursively.

```bash
ffuf -u http://<TARGET>/FUZZ -w <WORDLIST> -recursion
```

> **Tip:** Limit recursion depth during exams to avoid wasting time.

---

# 4. Virtual Host Enumeration

If a hostname is known, enumerate virtual hosts.

```bash
ffuf -u http://<TARGET> -H "Host: FUZZ.example.local" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs <DEFAULT_SIZE>
```

Every discovered virtual host should be added to:

```text
/etc/hosts
```

Then repeat:

- Technology Fingerprinting
- Directory Fuzzing
- Manual Browsing

---

# 5. Subdomain Enumeration

When a real domain exists:

```bash
ffuf -u http://FUZZ.example.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt
```

Other useful tools:

- gobuster
- amass
- assetfinder
- subfinder

---

# 6. Parameter Discovery

Hidden parameters often expose new functionality.

## GET Parameters

```bash
ffuf -u "http://<TARGET>/index.php?FUZZ=test" -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt
```

## POST Parameters

```bash
ffuf -u http://<TARGET>/login -X POST -d "FUZZ=test" -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt
```

---

# 7. Backup Discovery

Search for backups.

Common names:

```text
backup.zip
backup.tar.gz
site.zip
www.zip
db.sql
database.sql
old.zip
config.old
```

---

# 8. Hidden Files

Always check:

```text
robots.txt
```

```text
sitemap.xml
```

```text
.git/
```

```text
.env
```

```text
.git/HEAD
```

```text
.htaccess
```

```text
.web.config
```

```text
crossdomain.xml
```

```text
clientaccesspolicy.xml
```

---

# 9. API Discovery

Search for APIs.

Common endpoints:

```text
/api
/api/v1
/swagger
/swagger-ui
/openapi.json
/graphql
/redoc
/docs
```

Review JavaScript for additional API endpoints.

---

# 10. Administrative Interfaces

Look for:

```text
/admin
/login
/manage
/dashboard
/cms
/backend
/phpmyadmin
/adminer
/jenkins
/grafana
/prometheus
```

---

# 11. Build the Attack Surface

Document every discovered resource.

Include:

- Directories
- Files
- Login pages
- Upload functionality
- APIs
- Virtual Hosts
- Admin panels
- Backup files
- Configuration files

This inventory becomes the roadmap for manual testing.

---

## Attack Surface Expansion

Every time you discover:

- New directory
- New virtual host
- New subdomain
- New API
- New login page
- New upload feature

Repeat:

- Technology Fingerprinting
- Directory Discovery
- Manual Browsing
- JavaScript Analysis

Enumeration is recursive.

---

## Tips

- Never stop after the first successful FFUF scan.
- Every new endpoint may expose an entirely different application.
- Enumerate virtual hosts before assuming there is only one website.
- Read `robots.txt` and `sitemap.xml` before fuzzing.
- Download and inspect every backup or configuration file discovered.
- Review JavaScript after every new page is found.

---

## Checklist

- [ ] Perform directory discovery.
- [ ] Perform file discovery.
- [ ] Perform recursive fuzzing.
- [ ] Enumerate virtual hosts.
- [ ] Enumerate subdomains.
- [ ] Discover hidden parameters.
- [ ] Search for backup files.
- [ ] Check common hidden files.
- [ ] Enumerate API endpoints.
- [ ] Locate administrative interfaces.
- [ ] Build the complete attack surface.

```
Found New Directory?
        │
        ▼
Browse It Manually
        │
        ▼
Fingerprint Technology
        │
        ▼
Check Source Code
        │
        ▼
Review JavaScript
        │
        ▼
Run FFUF Again
        │
        ▼
Found More Content?
        │
      Yes ───────────────► Repeat
        │
       No
        │
        ▼
Continue Testing
```