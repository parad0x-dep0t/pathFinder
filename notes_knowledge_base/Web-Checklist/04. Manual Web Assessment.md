# Manual Web Assessment

## Objective

Interact with every feature of the application to understand its functionality, identify hidden behavior, and discover vulnerabilities that automated tools cannot detect.

> **Rule:** Never rely solely on automated scanners. Manual testing finds the majority of real-world vulnerabilities.

---

# 1. Browse the Entire Application

Visit every page and every link.

Look for:

- Login pages
- Registration pages
- Forgot Password
- Contact forms
- Search functionality
- File uploads
- Profile pages
- Settings
- Admin panels
- Dashboards
- API documentation

Take notes on every feature.

---

# 2. Use Burp Suite for Everything

Add the target to scope before browsing.

Intercept every request.

Inspect:

- GET parameters
- POST parameters
- Cookies
- Headers
- JSON bodies
- XML bodies
- Multipart requests

Never browse the application without Burp.

---

# 3. Review Every Request

For every request ask 'Can I':

- Change the HTTP method?
- Remove a parameter?
- Add a parameter?
- Change an ID?
- Change a filename?
- Change the Content-Type?
- Remove authentication?
- Replay the request?
- Change my role?
- Send it to another endpoint?

---

# 4. Review Every Response

Responses frequently contain useful information.

Look for:

- Hidden IDs
- User roles
- UUIDs
- API endpoints
- Internal paths
- Version numbers
- Debug messages
- Stack traces
- Tokens

Don't only analyze requests—responses often reveal more.

---

# 5. View Page Source

Review every page source.

Look for:

- HTML comments
- TODO comments
- Disabled functionality
- Hidden forms
- Hidden inputs
- API endpoints
- JavaScript references
- Secrets

---

# 6. Analyze JavaScript

Inspect every JavaScript file.

Search for:

- Hidden endpoints
- Internal APIs
- API Keys
- JWTs
- Access Tokens
- Hardcoded credentials
- Debug functionality
- Admin-only functions

Useful tools:

- LinkFinder
- SecretFinder
- JSParser

---

# 7. Manipulate Parameters

Modify every parameter.

Try:

- Negative numbers
- Large numbers
- NULL
- Empty values
- Boolean values
- Different data types
- UUIDs
- Other user's IDs

Never trust client-side validation.

---

# 8. Check for IDOR

Whenever IDs appear:

Try changing:

```
/profile?id=1
```

↓

```
/profile?id=2
```

Look for:

- User profiles
- Orders
- Invoices
- Documents
- Images
- Downloads

---

# 9. Test HTTP Methods

Try:

- GET
- POST
- PUT
- PATCH
- DELETE

Some endpoints accept multiple methods.

---

# 10. Check Authentication State

Test requests:

- Logged in
- Logged out
- Different user
- Different role

Many authorization issues appear only after changing accounts.

---

# 11. Manipulate JSON Requests

If JSON is used:

Try adding fields.

Example:

```json
{
    "username":"test",
    "password":"Password123!",
    "role":"admin",
    "isAdmin":true,
    "verified":true
}
```

Common Mass Assignment fields:

- role
- isAdmin
- admin
- verified
- enabled
- active
- userType
- permissions

---

# 12. Review Cookies

Inspect every cookie.

Check:

- JWT
- Session ID
- Base64
- Serialized objects

Attempt decoding.

---

# 13. Trigger Error Conditions

Generate unexpected input.

Examples:

```
'
"
\
../../
{{7*7}}
${7*7}
<test>
```

Framework errors frequently reveal:

- Versions
- Stack traces
- File paths
- SQL queries

---

# 14. Compare User Roles

If multiple accounts exist:

Compare:

- Requests
- Responses
- Cookies
- APIs
- Navigation

Different roles often expose hidden functionality.

---

# 15. Document Interesting Endpoints

Record:

- APIs
- Uploads
- Downloads
- Admin pages
- Profile pages
- Export functions
- Import functions

These become primary targets during exploitation.

---

## Tips

- Read every response carefully.
- Modify every parameter at least once.
- Every numeric ID should be tested for IDOR.
- Review every JavaScript file.
- Never trust hidden fields or disabled buttons.
- Burp Repeater is your best friend during manual testing.
- Client-side restrictions can often be bypassed by modifying requests.

---

## Checklist

- [ ] Browse every page.
- [ ] Proxy all traffic through Burp Suite.
- [ ] Inspect every request.
- [ ] Inspect every response.
- [ ] Review page source.
- [ ] Analyze JavaScript files.
- [ ] Manipulate parameters.
- [ ] Test for IDOR.
- [ ] Test different HTTP methods.
- [ ] Compare authenticated and unauthenticated requests.
- [ ] Test JSON for Mass Assignment.
- [ ] Review cookies.
- [ ] Trigger error conditions.
- [ ] Compare different user roles.
- [ ] Document interesting endpoints.