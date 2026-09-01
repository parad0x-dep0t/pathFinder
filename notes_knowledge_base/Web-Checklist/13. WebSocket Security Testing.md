# WebSocket Security Testing

## Objective

Assess WebSocket communication for authentication, authorization, input validation, business logic, and message handling vulnerabilities.

> **Rule:** Treat every WebSocket as a separate API. Every message can potentially be manipulated.

---

# 1. Identify WebSockets

Look for:

- `ws://`
- `wss://`

Check:

- Browser Developer Tools → Network → WS
- Burp Suite Proxy
- JavaScript files

Review:

- Connection URL
- Parameters
- Authentication method
- Initial handshake

---

# 2. Analyze the Handshake

Inspect the initial WebSocket request.

Review:

- Cookies
- JWTs
- API Keys
- Authorization Headers
- Origin Header
- Sec-WebSocket-Key
- Query Parameters

Determine how authentication is performed.

---

# 3. Authentication Testing

Test:

- Missing authentication
- Expired tokens
- Invalid tokens
- Anonymous connections
- Session reuse

Determine whether authentication is enforced only during connection establishment or for every action.

---

# 4. Authorization Testing

Test whether users can perform unauthorized actions.

Examples:

- Read another user's messages
- Send messages as another user
- Join unauthorized channels
- Subscribe to restricted topics

Always compare multiple user accounts.

---

# 5. Message Tampering

Modify every message.

Test:

- IDs
- UUIDs
- Roles
- Usernames
- Object IDs
- Channel IDs

Examples:

```json
{
  "userId": 5
}
```

↓

```json
{
  "userId": 1
}
```

---

# 6. Input Validation

Test every message for:

- SQL Injection
- NoSQL Injection
- XSS
- SSTI
- Command Injection
- LDAP Injection
- XXE (XML messages)
- Path Traversal

Treat WebSocket messages exactly like HTTP requests.

---

# 7. Message Replay

Replay captured messages.

Determine:

- Can messages be reused?
- Are timestamps validated?
- Are nonces enforced?

Useful for:

- Payments
- Chat
- Transactions
- Voting
- Notifications

---

# 8. Business Logic Testing

Review application logic.

Test:

- Duplicate actions
- Workflow bypass
- Invalid state changes
- Negative values
- Replay attacks

---

# 9. Race Conditions

Send multiple messages simultaneously.

Examples:

- Wallet operations
- Purchases
- Transfers
- Voting
- Rewards
- Inventory

Useful tools:

- Burp Repeater
- Turbo Intruder
- Custom scripts

---

# 10. Channel Enumeration

Identify:

- Public channels
- Private channels
- Admin channels
- Notification channels

Attempt subscribing to unauthorized channels.

---

# 11. Sensitive Information Disclosure

Inspect every message.

Look for:

- Internal IPs
- Stack traces
- User roles
- Session IDs
- API Keys
- Password hashes
- Email addresses

---

# 12. Client-Side Validation

Modify messages directly.

Never rely on:

- Disabled UI controls
- JavaScript validation
- Hidden fields

---

# 13. Rate Limiting

Determine whether message frequency is restricted.

Test:

- Message flooding
- Login attempts
- OTP requests
- Chat spam
- Notifications

---

# 14. Origin Validation

Review the `Origin` header during the WebSocket handshake.

Determine whether unauthorized origins can establish a connection.

---

# 15. Connection Management

Review:

- Session timeout
- Idle timeout
- Logout behavior
- Reconnection handling

Determine whether old sessions remain valid after logout.

---

# 16. API Mapping

Document:

- Message types
- Endpoints
- Channels
- Events
- Parameters
- Authentication requirements

Treat the WebSocket protocol as another API surface.

---

## Tips

- Every WebSocket message is equivalent to an API request.
- Test authorization on every action, not just the initial connection.
- Replay messages and modify object identifiers.
- Compare messages between multiple user roles.
- Inspect both the WebSocket handshake and subsequent messages.
- Use Burp Suite's WebSocket history to replay and modify traffic.

---

## Checklist

- [ ] Identify WebSocket endpoints.
- [ ] Analyze the handshake.
- [ ] Test authentication.
- [ ] Test authorization.
- [ ] Modify message parameters.
- [ ] Test input validation.
- [ ] Replay captured messages.
- [ ] Test business logic.
- [ ] Test race conditions.
- [ ] Enumerate channels.
- [ ] Check for sensitive information disclosure.
- [ ] Bypass client-side validation.
- [ ] Test rate limiting.
- [ ] Validate Origin handling.
- [ ] Review session management.
- [ ] Document the WebSocket API.