# Authentication & Session Management Testing

## Objective

Assess the application's authentication mechanisms, session management, password recovery, and account controls to identify authentication bypasses, weak credential handling, and session-related vulnerabilities.

> **Rule:** Every login mechanism should be considered a potential attack surface.

---

# 1. User Registration

Review the registration process.

Check for:

- Self-registration enabled
- Invite-only registration
- Role assignment
- Email verification bypass
- Duplicate usernames/emails
- Username enumeration

Try modifying registration requests.

Example fields:

- role
- isAdmin
- verified
- active
- accountType

---

# 2. Login Functionality

Test login behavior.

Check:

- Default credentials
- Weak passwords
- SQL Injection
- NoSQL Injection
- LDAP Injection
- Username enumeration
- Account lockout
- Rate limiting

Observe differences in:

- Status codes
- Response length
- Error messages
- Response time

---

# 3. Password Policy

Evaluate:

- Minimum length
- Complexity
- Password reuse
- Password history
- Common passwords
- Maximum length restrictions

Weak password policies often enable password spraying.

---

# 4. Password Spraying

If multiple usernames are known, test a small set of common passwords.

Useful tools:

- Burp Intruder
- Hydra
- CredSpray

Always consider:

- Account lockout policy
- Rate limiting
- Engagement scope

---

# 5. Password Reset Functionality

Review:

- Reset tokens
- OTPs
- Security questions
- Email verification
- Token expiration
- Token reuse

Attempt:

- Token prediction
- Token replay
- User enumeration
- Host header injection
- Password reset poisoning

---

# 6. Multi-Factor Authentication (MFA)

If MFA exists:

Check:

- MFA enforcement
- Backup codes
- Recovery workflow
- Session reuse
- Remember-me functionality

Attempt:

- MFA bypass
- Direct API access
- Alternate authentication flows

---

# 7. Session Management

Inspect session cookies.

Check:

- Secure
- HttpOnly
- SameSite
- Expiration
- Rotation after login
- Rotation after password change
- Logout invalidation

Determine whether:

- Sessions expire correctly
- Old sessions remain valid
- Multiple concurrent sessions are allowed

---

# 8. Session Fixation

Attempt to authenticate using a pre-existing session.

Check whether the session ID changes after successful login.

---

# 9. Session Hijacking

If another valid session is obtained:

Attempt:

- Cookie replay
- Session reuse
- Session cloning

Verify whether the application detects concurrent use.

---

# 10. Remember-Me Functionality

Review persistent login cookies.

Determine:

- Plaintext values
- Predictable tokens
- Long-lived sessions
- Server-side validation

---

# 11. JWT Testing

If JWTs are used:

Inspect:

- Header
- Payload
- Signature
- Expiration
- Algorithm

Look for:

- Information disclosure
- Weak algorithms
- Missing signature validation
- Long expiration

Do **not** assume a JWT is secure just because it is signed.

---

# 12. OAuth / SSO

If OAuth or Single Sign-On is present:

Review:

- Redirect URIs
- State parameter
- Scope
- Token reuse
- Logout behavior

---

# 13. Account Lockout

Determine:

- Lockout threshold
- Lockout duration
- CAPTCHA enforcement
- IP-based restrictions

---

# 14. Logout Functionality

Verify:

- Session invalidation
- Token invalidation
- Cookie deletion
- Browser back-button behavior

---

# 15. Compare Different Accounts

Create multiple users if possible.

Compare:

- Login responses
- Session cookies
- Available functionality
- API responses

Different user roles often expose hidden behavior.

---

## Tips

- Always create at least two user accounts if registration is available.
- Compare authenticated and unauthenticated requests.
- Compare low-privilege and high-privilege users.
- Review every authentication-related API endpoint.
- Password reset functionality is frequently overlooked but commonly vulnerable.
- Always inspect cookies and JWTs after login.

---

## Checklist

- [ ] Test user registration.
- [ ] Test login functionality.
- [ ] Review password policy.
- [ ] Perform password spraying (if permitted).
- [ ] Test password reset workflow.
- [ ] Assess MFA implementation.
- [ ] Review session management.
- [ ] Test session fixation.
- [ ] Test session hijacking.
- [ ] Review Remember-Me functionality.
- [ ] Analyze JWTs.
- [ ] Test OAuth / SSO (if present).
- [ ] Evaluate account lockout.
- [ ] Verify logout behavior.
- [ ] Compare multiple user accounts.