# Input Validation & Injection Testing

## Objective

Identify vulnerabilities caused by improper input validation that allow attackers to execute code, manipulate queries, access unauthorized data, or compromise the underlying system.

> **Rule:** Every user-controlled input is a potential attack surface.

---

# 1. Identify User Input

Before testing, identify every place where user input is accepted.

Examples:

- URL parameters
- POST body
- JSON body
- XML body
- Headers
- Cookies
- JWT Claims
- File Names
- Search Fields
- Login Forms
- Registration
- Profile Fields
- API Parameters

---

# 2. Initial Input Validation

For every parameter test:

```
'
"
`
\
/
../
../../
../../../
NULL
%00
-1
0
999999999
true
false
[]
{}
```

Observe:

- Error messages
- Different responses
- Status codes
- Response length
- Time differences

---

# 3. SQL Injection

Check every parameter.

Look for:

- Error-based SQLi
- Boolean-based SQLi
- Time-based SQLi
- UNION SQLi
- Stacked Queries
- Second-order SQLi

Useful tools:

- sqlmap
- Burp Repeater

---

# 4. NoSQL Injection

Common targets:

- MongoDB
- CouchDB

Test:

```
{"$ne":null}
```

```
{"$gt":""}
```

```
'||1==1//
```

---

# 5. Command Injection

Test:

```
;
&
|
||
&&
`
$()
```

Examples:

```
;whoami
```

```
&&id
```

```
|ping
```

---

# 6. Server-Side Template Injection (SSTI)

Common payload:

```
{{7*7}}
```

Other engines:

- Twig
- Jinja2
- Freemarker
- Velocity
- Smarty
- Handlebars
- Mustache

---

# 7. Cross-Site Scripting (XSS)

Test:

- Reflected
- Stored
- DOM

Injection points:

- Search
- Comments
- Profile
- Messages
- File Names

---

# 8. XXE

If XML is accepted:

Test:

- External entities
- File disclosure
- SSRF

Targets:

- SOAP
- XML Upload
- SVG

---

# 9. SSRF

Look for:

- Image URL
- PDF Generator
- Webhooks
- URL Preview
- Import Features

Test:

- localhost
- 127.0.0.1
- Metadata endpoints
- Internal IPs

---

# 10. LDAP Injection

Common targets:

- Login
- Search

---

# 11. XPath Injection

Common targets:

- XML Authentication
- XML Search

---

# 12. CRLF Injection

Test:

```
%0d%0a
```

Look for:

- Header Injection
- Response Splitting

---

# 13. HTTP Parameter Pollution

Duplicate parameters.

Example:

```
id=1&id=2
```

---

# 14. Prototype Pollution

JSON APIs.

Look for:

```
__proto__
constructor
prototype
```

---

# 15. HTTP Request Smuggling

Only if:

- Reverse Proxy
- Load Balancer
- Multiple HTTP Servers

---

# 16. Open Redirect

Check:

```
redirect=
next=
return=
url=
continue=
```

---

# 17. XML Injection

If XML is accepted.

---

# 18. CSV Injection

Export functionality.

Payloads:

```
=cmd
```

```
=HYPERLINK(...)
```

---

# 19. Expression Language Injection

Frameworks:

- Spring
- JSP
- JSF

---

# 20. Template Enumeration

Identify:

- Jinja2
- Twig
- Freemarker
- Velocity
- Handlebars
- Smarty

---

# 21. Fuzz Every Parameter

After manual testing.

Use:

- Burp Intruder
- ffuf
- Turbo Intruder

---

## Tips

- Every parameter deserves testing.
- APIs are often less protected than the UI.
- Don't rely solely on sqlmap.
- Read error messages carefully.
- A single vulnerable parameter can lead to complete compromise.
- Always test manually before using automation.

---

## Checklist

- [ ] Identify all user-controlled input.
- [ ] Perform initial input validation.
- [ ] Test SQL Injection.
- [ ] Test NoSQL Injection.
- [ ] Test Command Injection.
- [ ] Test SSTI.
- [ ] Test XSS.
- [ ] Test XXE.
- [ ] Test SSRF.
- [ ] Test LDAP Injection.
- [ ] Test XPath Injection.
- [ ] Test CRLF Injection.
- [ ] Test HTTP Parameter Pollution.
- [ ] Test Prototype Pollution.
- [ ] Test HTTP Request Smuggling.
- [ ] Test Open Redirect.
- [ ] Test XML Injection.
- [ ] Test CSV Injection.
- [ ] Test Expression Language Injection.
- [ ] Fuzz all parameters.