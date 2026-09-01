# HTTP Enumeration & Technology Fingerprinting

## Objective

Enumerate every HTTP/HTTPS endpoint to identify the web server, application framework, CMS, programming language, technologies, virtual hosts, and hidden attack surface before attempting exploitation.

> **Rule:** Never start fuzzing immediately. Fingerprint the application first.

---

# 1. Inspect the Homepage

Browse the application manually.

Check for:

- Login pages
- Registration pages
- Admin panels
- Error messages
- Copyright year
- Application name
- Company name
- Email addresses
- Usernames
- Version numbers

Read **every page** carefully.

---

# 2. Examine HTTP Headers

Inspect response headers.

```bash
curl -I http://<TARGET>
```

HTTPS

```bash
curl -k -I https://<TARGET>
```

Look for:

- Server
- X-Powered-By
- X-AspNet-Version
- X-Generator
- X-Backend-Server
- X-Frame-Options
- CSP
- Cookies

Google unknown headers.

---

# 3. Identify the Technology Stack

Fingerprint the application.

```bash
whatweb http://<TARGET>
```

```bash
wapiti -u http://<TARGET>
```

Identify:

- PHP
- ASP.NET
- JSP
- NodeJS
- Python
- Ruby
- Laravel
- Django
- Spring
- Express
- WordPress
- Joomla
- Drupal
- Magento

---

# 4. Examine HTML Source

View page source.

Look for:

- Comments
- Hidden endpoints
- JavaScript files
- API URLs
- Debug messages
- Credentials
- API Keys
- TODO comments

---

# 5. JavaScript Enumeration

Review every JavaScript file.

Look for:

- Hidden API endpoints
- AJAX requests
- Internal URLs
- API Keys
- Tokens
- Secrets
- Hardcoded credentials
- Admin functions

Useful tools:

- LinkFinder
- SecretFinder
- JSParser

---

# 6. Examine Cookies

Inspect every cookie.

Check:

- Secure
- HttpOnly
- SameSite

Determine:

- Session cookies
- JWTs
- Base64
- Serialized objects

Attempt decoding if applicable.

---

# 7. Identify the Framework

Framework-specific behavior often reveals attack paths.

Examples:

| Framework | Indicators |
|-----------|------------|
| Laravel | `/vendor`, Ignition, `_ignition` |
| Django | CSRF cookie, debug pages |
| ASP.NET | `__VIEWSTATE`, `.aspx` |
| Spring | Whitelabel Error Page |
| Rails | `_rails_session` |
| Express | `X-Powered-By: Express` |

---

# 8. Error Page Analysis

Trigger errors intentionally.

Examples:

```text
/nonexistent
/'"
/../../../
```

Look for:

- Stack traces
- Framework names
- Versions
- File paths
- Source code
- SQL errors

---

# 9. HTTP Methods

Check supported methods.

```bash
curl -X OPTIONS http://<TARGET> -i
```

Interesting methods:

- PUT
- DELETE
- PATCH
- TRACE
- CONNECT

Misconfigured methods sometimes allow file uploads.

---

# 10. Security Headers

Review:

- CSP
- HSTS
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

Missing headers aren't always exploitable but may provide useful context.

---

# 11. Robots & Sitemap

Check:

```text
/robots.txt
```

```text
/sitemap.xml
```

Look for:

- Hidden directories
- Admin panels
- Backup paths
- API endpoints

---

# 12. Hidden Files

Attempt common files.

```text
/.git/
/.git/HEAD
/.env
/.svn/
/backup.zip
/backup.tar.gz
/config.php.bak
/phpinfo.php
/server-status
```

---

# 13. Build the Technology Profile

Before moving on, document:

- Web Server
- Programming Language
- Framework
- CMS
- Version
- Authentication
- Session Mechanism
- API Type
- Interesting Headers
- JavaScript Files
- Hidden Endpoints

This profile guides the rest of the assessment.

---

## Tips

- Read every page before fuzzing.
- Review every JavaScript file.
- Google every unknown framework or header.
- Framework identification often reveals public exploits.
- Error pages frequently leak valuable information.

---

## Checklist

- [ ] Browse every page.
- [ ] Review HTTP headers.
- [ ] Fingerprint technologies.
- [ ] Inspect HTML source.
- [ ] Review JavaScript files.
- [ ] Analyze cookies.
- [ ] Identify the framework.
- [ ] Trigger error pages.
- [ ] Enumerate HTTP methods.
- [ ] Review security headers.
- [ ] Check robots.txt and sitemap.xml.
- [ ] Check common hidden files.
- [ ] Build the technology profile.