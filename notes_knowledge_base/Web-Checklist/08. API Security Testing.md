# API Security Testing

## Objective

Identify vulnerabilities in REST, GraphQL, SOAP, and other APIs by testing authentication, authorization, object access, input validation, rate limiting, business logic, and hidden functionality.

> **Rule:** Treat the API as a separate application. Never assume the web UI exposes every available endpoint.

---

# 1. Discover API Endpoints

Identify all API endpoints.

Sources:

- JavaScript files
- Network tab
- Burp Suite Proxy
- Swagger/OpenAPI
- GraphQL Playground
- Mobile applications
- Source code

Common paths:

```
/api
/api/v1
/api/v2
/swagger
/swagger-ui
/openapi.json
/graphql
/docs
/redoc
```

---

# 2. Map the API

Document:

- Endpoints
- Methods
- Parameters
- Authentication
- Request Body
- Response Format

Understand how objects relate to each other before testing.

---

# 3. Authentication Testing

Determine:

- Authentication required?
- JWT?
- Session Cookie?
- API Key?
- OAuth?
- Basic Auth?

Test:

- Missing authentication
- Expired tokens
- Invalid tokens
- Anonymous access

---

# 4. Authorization Testing (BOLA / IDOR)

Test every object identifier.

Examples:

```
GET /api/users/10
```

↓

```
GET /api/users/11
```

Common objects:

- Users
- Orders
- Files
- Tickets
- Messages
- Invoices

---

# 5. Function-Level Authorization (BFLA)

Test privileged endpoints.

Examples:

```
POST /api/admin/create-user
DELETE /api/users/15
PUT /api/settings
```

Attempt access as:

- Guest
- Standard User
- Different User

---

# 6. Mass Assignment

Add additional JSON properties.

Example:

```json
{
    "username":"test",
    "role":"admin",
    "isAdmin":true,
    "verified":true,
    "permissions":["*"]
}
```

Common fields:

- role
- admin
- isAdmin
- active
- verified
- permissions
- tenant
- accountType

---

# 7. Input Validation

Test every parameter.

Examples:

```
'
"
../
{{7*7}}
;id
```

Also test:

- SQLi
- NoSQLi
- SSTI
- XSS
- Command Injection

---

# 8. HTTP Method Testing

Try:

- GET
- POST
- PUT
- PATCH
- DELETE
- OPTIONS

Some APIs only validate authorization on specific methods.

---

# 9. Content-Type Testing

Change:

```
application/json
```

↓

```
application/xml
```

↓

```
multipart/form-data
```

↓

```
text/plain
```

Different parsers may behave differently.

---

# 10. HTTP Verb Tampering

Examples:

```
GET → POST
POST → PUT
PUT → PATCH
DELETE → POST
```

Authorization may differ by HTTP method.

---

# 11. Parameter Pollution

Duplicate parameters.

Example:

```
id=5&id=6
```

---

# 12. Hidden Parameters

Test for undocumented parameters.

Examples:

```
admin=true
debug=true
internal=true
test=true
```

Use:

- Burp Param Miner
- ffuf
- Arjun

---

# 13. Rate Limiting

Determine:

- Login rate limits
- OTP limits
- Password reset limits
- Registration limits
- API throttling

Test:

- Burp Intruder
- Turbo Intruder

---

# 14. JWT Testing

Inspect:

- Header
- Payload
- Signature
- Expiration
- Algorithm

Review claims such as:

- role
- admin
- permissions
- userid

---

# 15. GraphQL Testing

If GraphQL is present:

Check:

- Introspection
- Hidden queries
- Hidden mutations
- Field-level authorization
- Object-level authorization

Useful tools:

- GraphQL Voyager
- InQL
- Clairvoyance

---

# 16. Swagger / OpenAPI

Review:

- Hidden endpoints
- Deprecated endpoints
- Admin APIs
- Internal APIs
- Example requests

Swagger often exposes functionality not linked from the UI.

---

# 17. API Versioning

Test:

```
/api/v1/
/api/v2/
/api/internal/
/api/dev/
```

Older API versions may lack security controls.

---

# 18. Business Logic

Test:

- Negative values
- Duplicate requests
- Race conditions
- Price manipulation
- Workflow bypass
- Approval bypass

---

# 19. Sensitive Data Exposure

Review API responses for:

- Password hashes
- API keys
- Internal IPs
- Stack traces
- Email addresses
- User roles
- Debug information

---

# 20. API Fuzzing

Fuzz:

- Parameters
- Headers
- JSON properties
- Endpoints

Useful tools:

- ffuf
- Burp Intruder
- Turbo Intruder
- Arjun

---

## Tips

- APIs often expose functionality that is not available in the web interface.
- Test every object identifier for BOLA (IDOR).
- Compare requests between different user roles.
- Review Swagger/OpenAPI documentation before fuzzing.
- Change HTTP methods and Content-Types—they frequently reveal inconsistent authorization checks.
- Replay requests and test for race conditions on critical operations.

---

## Checklist

- [ ] Discover API endpoints.
- [ ] Map the API.
- [ ] Test authentication.
- [ ] Test BOLA / IDOR.
- [ ] Test function-level authorization.
- [ ] Test mass assignment.
- [ ] Test input validation.
- [ ] Test HTTP methods.
- [ ] Test Content-Type handling.
- [ ] Test parameter pollution.
- [ ] Discover hidden parameters.
- [ ] Test rate limiting.
- [ ] Review JWTs.
- [ ] Test GraphQL.
- [ ] Review Swagger/OpenAPI.
- [ ] Test API versioning.
- [ ] Test business logic.
- [ ] Check for sensitive data exposure.
- [ ] Fuzz API parameters.