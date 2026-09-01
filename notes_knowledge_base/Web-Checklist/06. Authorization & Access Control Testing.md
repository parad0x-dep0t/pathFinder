# Authorization & Access Control Testing

## Objective

Determine whether users can access resources, functions, or data beyond their intended permissions by manipulating requests, identifiers, roles, or APIs.

> **Rule:** Authentication verifies *who you are*. Authorization determines *what you can access*. Never assume authentication implies proper authorization.

---

# 1. Horizontal Privilege Escalation (IDOR)

Test whether you can access another user's resources.

Examples:

```
/profile?id=10
```

↓

```
/profile?id=11
```

Common targets:

- Profiles
- Orders
- Invoices
- Messages
- Documents
- Images
- Tickets
- API Objects

---

# 2. Vertical Privilege Escalation

Determine whether a low-privileged user can access administrator functionality.

Look for:

- `/admin`
- `/dashboard`
- `/manage`
- `/staff`
- `/internal`
- `/api/admin`

Test:

- Direct browsing
- API endpoints
- Hidden links
- JavaScript endpoints

---

# 3. Forced Browsing

Try accessing resources directly.

Examples:

```
/admin
/admin.php
/manage
/debug
/dev
/test
```

Also check:

- robots.txt
- sitemap.xml
- JavaScript
- Backup files

---

# 4. Parameter Tampering

Modify parameters.

Examples:

```
role=user
```

↓

```
role=admin
```

```
userid=15
```

↓

```
userid=1
```

Test:

- User IDs
- UUIDs
- Roles
- Status
- Permissions
- Prices
- Account IDs

---

# 5. Mass Assignment

Add parameters that are not exposed by the client.

Examples:

```json
{
  "username":"test",
  "password":"Password123!",
  "role":"admin",
  "isAdmin":true,
  "verified":true,
  "active":true
}
```

Interesting fields:

- role
- admin
- isAdmin
- verified
- active
- permissions
- accountType
- tenant
- group

---

# 6. HTTP Method Testing

Try alternative HTTP methods.

Examples:

GET

POST

PUT

PATCH

DELETE

OPTIONS

Some endpoints only enforce authorization on specific methods.

---

# 7. Compare Multiple Users

Create at least two accounts whenever registration is available.

Compare:

- Responses
- Cookies
- JWTs
- API requests
- Available functionality

Different users often reveal authorization flaws.

---

# 8. JWT Authorization

Inspect JWT payloads.

Look for:

- role
- admin
- userid
- permissions
- groups

If the application trusts client-controlled claims, changing these values may affect authorization.

---

# 9. API Authorization

Test every API endpoint.

Questions to ask:

- Can another user access this object?
- Can a normal user call an admin API?
- Can parameters be modified?
- Can hidden fields be supplied?

---

# 10. File Access

Attempt to access:

- Other users' uploads
- Private documents
- Exported reports
- Backups

Change:

```
/uploads/user1/file.pdf
```

↓

```
/uploads/user2/file.pdf
```

---

# 11. Function-Level Authorization

Every button usually corresponds to an API request.

Try calling the request directly.

Examples:

- Delete User
- Create User
- Promote User
- Change Password
- Export Data

Never trust hidden buttons.

---

# 12. Multi-Tenant Testing

If multiple organizations or tenants exist:

Try changing:

- Organization ID
- Tenant ID
- Customer ID
- Company ID

Look for cross-tenant data access.

---

# 13. Object-Level Authorization (API)

Test every identifier.

Examples:

```
/api/users/5
```

↓

```
/api/users/6
```

```
/api/orders/100
```

↓

```
/api/orders/101
```

APIs are frequently vulnerable to Broken Object Level Authorization (BOLA).

---

# 14. Business Workflow Authorization

Test workflow restrictions.

Examples:

- Approve your own request
- Cancel another user's order
- Skip approval steps
- Modify completed transactions
- Access hidden workflow stages

---

## Tips

- Every numeric ID should be tested.
- Every UUID should be tested.
- Every hidden API endpoint should be tested.
- Compare low-privilege and administrator accounts.
- Test authorization on both the UI and the API.
- Hidden buttons do **not** provide security.
- Always intercept requests with Burp before assuming access is denied.

For every request ask 'Can I':

- Remove authentication?
- Use another user's ID?
- Use another user's UUID?
- Add admin=true?
- Change role=user → admin?
- Replay the request?
- Change the HTTP method?
- Access the endpoint directly?
- Perform the action twice?
- Call the API instead of using the UI?

---

## Checklist

- [ ] Test Horizontal Privilege Escalation (IDOR).
- [ ] Test Vertical Privilege Escalation.
- [ ] Perform Forced Browsing.
- [ ] Modify parameters.
- [ ] Test Mass Assignment.
- [ ] Test alternative HTTP methods.
- [ ] Compare multiple user accounts.
- [ ] Review JWT authorization.
- [ ] Test API authorization.
- [ ] Test file access controls.
- [ ] Test function-level authorization.
- [ ] Test multi-tenant isolation.
- [ ] Test object-level authorization (BOLA).
- [ ] Test business workflow authorization.