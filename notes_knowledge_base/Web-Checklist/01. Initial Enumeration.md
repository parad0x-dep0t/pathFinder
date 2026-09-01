# Initial Enumeration

## Objective

Identify all exposed services, determine the attack surface, fingerprint technologies, and collect enough information to decide the next phase of testing.

> **Rule:** Never rush to the web application. Fully enumerate the host and all exposed services first.

---

# 1. Port Enumeration

Begin by identifying all exposed TCP ports.

## Full TCP Scan

```bash
nmap -p- --min-rate 10000 -T4 -oA nmap_full <TARGET_IP>
```

## Service & Version Detection

```bash
nmap -sC -sV -p <PORTS> -oA nmap_services <TARGET_IP>
```

## UDP Enumeration

Don't ignore UDP during exams.

```bash
sudo nmap -sU --top-ports 100 -oA nmap_udp <TARGET_IP>
```

---

# 2. Identify Running Services

For every open port determine:

- Service
- Version
- Operating System
- Framework
- Possible CVEs
- Authentication Required?
- Default Credentials?
- Public Exploit?

Useful tools:

- Nmap
- WhatWeb
- Searchsploit
- curl

---

# 3. HTTP Service Discovery

For every HTTP/HTTPS port discovered:

Identify:

- HTTP/HTTPS
- Redirects
- Virtual Hosts
- TLS
- Default Page
- Authentication
- Technologies

---

# 4. TLS Enumeration (HTTPS)

If HTTPS is available:

Check:

- Certificate CN
- SANs
- Expiration
- Internal hostnames
- Weak TLS versions

Useful tools:

```bash
sslscan <TARGET_IP>
```

```bash
openssl s_client -connect <TARGET_IP>:443
```

Internal hostnames frequently reveal additional attack surfaces.

---

# 5. Banner Grabbing

Collect banners manually.

HTTP

```bash
curl -I http://<TARGET_IP>
```

HTTPS

```bash
curl -k -I https://<TARGET_IP>
```

Generic

```bash
nc <TARGET_IP> <PORT>
```

Look for:

- Version numbers
- Frameworks
- Server software
- Custom headers

---

# 6. Technology Fingerprinting

Determine the application's technology stack.

```bash
whatweb http://<TARGET_IP>
```

Also inspect:

- Response headers
- HTML source
- JavaScript
- Cookies
- Error pages

Identify:

- PHP
- ASP.NET
- Java
- NodeJS
- Python
- Ruby
- CMS
- Reverse Proxy

---

# 7. Search for Public Exploits

Every version discovered should be researched.

```bash
searchsploit <SERVICE> <VERSION>
```

Also search:

- Google
- GitHub
- CVE Details
- NVD

---

# 8. Examine HTTP Methods

Check supported HTTP verbs.

```bash
curl -X OPTIONS http://<TARGET_IP> -i
```

Look for:

- PUT
- DELETE
- TRACE
- CONNECT
- PATCH

Misconfigured HTTP methods can sometimes lead to file upload or authentication bypass.

---

# 9. DNS Enumeration

If a hostname is available:

Check:

- A records
- AAAA
- MX
- TXT
- CNAME

Attempt:

- Subdomain enumeration
- Zone transfers (AXFR)
- Virtual Host discovery

---

# 10. Build an Attack Surface

Before proceeding, document:

- Open ports
- Technologies
- CMS
- Framework
- Login pages
- APIs
- File upload functionality
- Admin panels
- Interesting hostnames

This becomes your roadmap for the remainder of the assessment.

---

## Tips

- Enumerate every open port before focusing on the web application.
- Always inspect both HTTP and HTTPS separately.
- Search every version number you discover.
- Internal hostnames found in certificates often lead to additional virtual hosts.
- Keep detailed notes—small details discovered during enumeration often become critical later.

---

## Checklist

- [ ] Scan all TCP ports.
- [ ] Scan common UDP ports.
- [ ] Enumerate service versions.
- [ ] Identify HTTP/HTTPS services.
- [ ] Enumerate TLS certificates.
- [ ] Perform banner grabbing.
- [ ] Fingerprint technologies.
- [ ] Search for public exploits.
- [ ] Enumerate supported HTTP methods.
- [ ] Perform DNS enumeration.
- [ ] Build an attack surface map.