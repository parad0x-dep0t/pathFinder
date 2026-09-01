# Client-Side Security Testing

## Objective

Assess client-side code, browser storage, security policies, and browser-based functionality for vulnerabilities that could lead to XSS, information disclosure, privilege escalation, or bypass of security controls.

> **Rule:** Never assume JavaScript is just presentation logic. Modern applications often implement authentication, authorization, and business logic on the client.

---

# 1. JavaScript Analysis

Review every JavaScript file.

Look for:

- Hidden API endpoints
- Hardcoded credentials
- API Keys
- Access Tokens
- Internal URLs
- Feature flags
- Hidden admin functionality
- Debug code

Useful tools:

- LinkFinder
- SecretFinder
- JSParser
- Burp Suite

---

# 2. DOM-Based XSS

Identify user-controlled data flowing into dangerous DOM sinks.

Common sources:

- URL
- Hash fragment
- postMessage
- localStorage
- sessionStorage
- Cookies

Common sinks:

- innerHTML
- outerHTML
- document.write()
- eval()
- setTimeout()
- setInterval()

---

# 3. Browser Storage

Inspect:

- localStorage
- sessionStorage
- IndexedDB
- WebSQL (legacy)
- Cookies

Look for:

- JWTs
- Session Tokens
- API Keys
- User Information
- Secrets

---

# 4. Cookie Security

Review every cookie.

Check:

- Secure
- HttpOnly
- SameSite
- Expiration
- Scope

Determine whether sensitive information is stored in client-accessible cookies.

---

# 5. Cross-Origin Resource Sharing (CORS)

Review:

- Access-Control-Allow-Origin
- Access-Control-Allow-Credentials
- Access-Control-Allow-Headers
- Access-Control-Allow-Methods

Look for:

- Wildcard origins
- Reflection of Origin header
- Credentialed cross-origin requests

---

# 6. Content Security Policy (CSP)

Review:

- script-src
- object-src
- default-src
- frame-src
- connect-src

Determine whether CSP meaningfully restricts script execution.

---

# 7. Clickjacking

Check:

- X-Frame-Options
- Content-Security-Policy (frame-ancestors)

Attempt embedding the application inside an iframe.

---

# 8. postMessage()

Review JavaScript for:

```javascript
window.postMessage()
```

Check:

- Origin validation
- Message validation
- Sensitive data exposure

---

# 9. Web Workers

Identify:

- Dedicated Workers
- Shared Workers
- Service Workers

Review:

- Cached resources
- Offline functionality
- Sensitive data

---

# 10. Service Workers

Inspect:

- Cache contents
- Cached API responses
- Offline resources

Determine whether sensitive data is cached.

---

# 11. Source Maps

Look for:

```text
*.map
```

Review:

- Original source code
- Comments
- Internal function names
- Secrets

---

# 12. Client-Side Routing

For SPAs (React, Angular, Vue):

Check:

- Hidden routes
- Admin routes
- Debug pages
- Feature flags

---

# 13. Browser Developer Tools

Inspect:

- Console
- Network
- Storage
- Sources
- Performance

Look for:

- Debug messages
- Tokens
- Secrets
- Hidden requests

---

# 14. Sensitive Information Disclosure

Review:

- JavaScript comments
- Source maps
- Browser storage
- Console output
- Error messages

---

# 15. Checklist

- [ ] Review JavaScript files.
- [ ] Test for DOM-based XSS.
- [ ] Inspect browser storage.
- [ ] Review cookie security.
- [ ] Test CORS configuration.
- [ ] Review CSP.
- [ ] Test for Clickjacking.
- [ ] Analyze postMessage().
- [ ] Review Web Workers.
- [ ] Review Service Workers.
- [ ] Search for source maps.
- [ ] Inspect SPA routes.
- [ ] Use browser developer tools.
- [ ] Check for client-side information disclosure.