# CMS, Framework & Enterprise Application Testing

## Objective

Identify the CMS, framework, or enterprise application in use, enumerate version-specific functionality, discover administrative interfaces, identify weak configurations, abuse built-in functionality, and verify publicly known vulnerabilities.

> **Rule:** Once the technology is identified, stop generic testing and switch to framework-specific enumeration.

---

# 1. Technology Identification

Identify the underlying technology using:

- HTTP Headers
- HTML Source
- Cookies
- Error Pages
- JavaScript
- Login Pages
- robots.txt
- Favicon
- Default directories
- EyeWitness screenshots

Useful tools:

- WhatWeb
- Wappalyzer
- EyeWitness
- Nmap HTTP scripts

Identify:

- CMS / Framework
- Version
- Web Server
- Operating System
- Programming Language

---

# 2. Version Enumeration

Determine the exact version.

Sources:

- Meta Tags
- README files
- CHANGELOG files
- XML manifests
- JavaScript
- HTML comments
- Dependency files

Always search:

- SearchSploit
- Exploit-DB
- GitHub PoCs
- Vendor Advisories
- NVD

---

# 3. Administrative Interfaces

Look for:

```text
/admin
/wp-admin
/administrator
/manager
/host-manager
/login
/backend
/cms
```

Check:

- Default Credentials
- Weak Passwords
- Login Bruteforce Protection

---

# 4. Framework-Specific Enumeration

---

## WordPress

Identify:

- Version
- Users
- Plugins
- Themes
- XML-RPC

Useful tool:

```bash
wpscan --url http://<TARGET> --enumerate ap,at,u
```

Check:

- Vulnerable plugins
- Vulnerable themes
- Upload directory
- Backups
- xmlrpc.php

Attempt:

- XML-RPC Bruteforce
- Plugin exploits
- Theme exploits
- Weak credentials

---

## Joomla

Identify:

- Version
- Components
- Templates
- Extensions

Useful tools:

- droopescan
- JoomlaScan

Check:

- README.txt
- joomla.xml
- Administrator panel

Attempt:

- Default credentials
- Template editing
- Component exploits
- Template web shell upload

---

## Drupal

Identify:

- Version
- Nodes
- Modules
- Themes

Useful tool:

```bash
droopescan scan drupal -u http://<TARGET>
```

Check:

- CHANGELOG.txt
- README.txt
- /node/<id>

Attempt:

- Drupalgeddon
- Drupalgeddon2
- Drupalgeddon3
- PHP Filter Module (legacy versions)

---

## Laravel

Check:

```text
/.env
/_ignition
/storage/logs
/vendor
```

Look for:

- APP_KEY disclosure
- Debug mode
- Ignition
- Environment file exposure

---

## Django

Check:

```text
/admin
```

Review:

- Debug pages
- Static files
- CSRF implementation

---

## Spring Boot

Check:

```text
/actuator
```

Interesting endpoints:

- health
- env
- heapdump
- mappings
- metrics
- beans

---

## ASP.NET

Review:

- ViewState
- EventValidation
- Trace.axd
- Elmah
- Web.config

---

## Tomcat

Check:

```text
/manager
/host-manager
/docs
```

Attempt:

- Default credentials
- WAR upload
- CGI vulnerabilities
- Tomcat Manager abuse

Search for:

- CVE-2019-0232 (Tomcat CGI RCE)

---

## Jenkins

Check:

```text
/login
/script
/configureSecurity
```

Attempt:

- Default credentials
- Anonymous access
- Script Console
- Groovy code execution

---

## Splunk

Check:

- Version
- Authentication
- Free/Trial mode
- Management interface

Attempt:

- Default credentials
- Search abuse
- App upload

---

## GitLab

Check:

```text
/help
```

Identify:

- Version
- Public repositories
- Registration enabled

Search for:

- Version-specific CVEs

---

## ColdFusion

Identify:

- .cfm pages
- CFIDE
- cfdocs

Check:

- Administrator interface
- Default files
- Debug pages

Search for:

- Known RCEs
- File upload vulnerabilities
- Command Injection

---

## IIS

Check:

- TRACE enabled
- IIS Version
- Short Name Enumeration (8.3)

Useful tool:

- IIS ShortName Scanner

---

## CGI

Look for:

```text
/cgi-bin/
/cgi/
```

Attempt:

- Shellshock
- Command Injection
- CGI Enumeration

---

# 5. Common Misconfigurations

Review:

- Debug mode enabled
- Default credentials
- Public documentation
- Backup files
- Configuration files
- Dependency files
- Exposed logs
- Sample applications
- Development endpoints

---

# 6. Built-in Functionality Abuse

If authenticated, check for:

- Template editing
- Theme editing
- Plugin installation
- Extension installation
- Module installation
- Package upload
- Script Console
- WAR deployment
- Scheduled Tasks
- Job Execution

These frequently lead directly to Remote Code Execution (RCE).

---

# 7. Public Exploits

For every identified product:

- SearchSploit
- Exploit-DB
- GitHub PoCs
- Vendor Advisories
- NVD

Verify:

- Product version
- Operating system
- Authentication requirements
- Exploit prerequisites

Never run an exploit without confirming the version.

---

# 8. Checklist

- [ ] Identify CMS / Framework / Enterprise Application
- [ ] Determine the exact version
- [ ] Locate administrative interfaces
- [ ] Test default credentials
- [ ] Perform framework-specific enumeration
- [ ] Review public configuration files
- [ ] Check for debug mode
- [ ] Search for publicly known exploits
- [ ] Abuse built-in administrative functionality
- [ ] Verify version-specific CVEs