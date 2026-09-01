# Business Logic Testing

## Objective

Identify flaws in the application's workflow, business rules, and transaction logic that allow unauthorized actions, financial abuse, privilege escalation, or bypassing intended restrictions.

> **Rule:** Think like a malicious user, not just a penetration tester. Ask yourself, "What assumptions is the application making?"

---

# 1. Understand the Workflow

Before testing:

- Register a new account
- Browse every feature
- Understand the normal workflow
- Identify business rules
- Identify trust boundaries

Questions to ask:

- What is the expected behavior?
- What assumptions does the application make?
- Can I skip a required step?

---

# 2. Price Manipulation

Inspect every purchase request.

Modify:

- Price
- Quantity
- Currency
- Discounts
- Tax
- Shipping Cost

Examples:

```
price=100
```

↓

```
price=1
```

```
quantity=5
```

↓

```
quantity=-5
```

---

# 3. Coupon & Discount Abuse

Test:

- Reuse expired coupons
- Apply multiple coupons
- Negative discounts
- Apply coupon after payment
- Remove coupon after validation
- Reuse one-time coupons

---

# 4. Payment Logic

Check whether you can:

- Skip payment
- Pay less
- Pay twice
- Cancel after payment
- Modify payment status
- Replay payment requests

---

# 5. Quantity Manipulation

Try:

```
0
```

```
-1
```

```
999999999
```

```
0.5
```

```
1e10
```

---

# 6. Workflow Bypass

Attempt to skip required steps.

Examples:

```
Register
↓

Login
↓

Purchase
```

Can you directly access:

```
/checkout
```

Without:

```
/cart
```

---

# 7. Approval Workflow

Test:

- Approve your own request
- Reject another user's request
- Skip manager approval
- Replay approval requests
- Modify approval status

---

# 8. Race Conditions

Identify operations involving:

- Payments
- Wallets
- Coupons
- Gift Cards
- Reward Points
- Transfers
- Inventory

Attempt:

- Duplicate requests
- Simultaneous requests
- Replay requests

Use:

- Burp Repeater (Send Group)
- Turbo Intruder

---

# 9. Replay Attacks

Repeat requests.

Examples:

- Purchase
- Payment
- Password Reset
- OTP Verification
- Coupon Redemption
- Invitation Acceptance

Determine whether requests can be reused.

---

# 10. State Manipulation

Modify:

```
status=pending
```

↓

```
status=approved
```

```
verified=false
```

↓

```
verified=true
```

---

# 11. Client-Side Validation

Never trust JavaScript.

Remove:

- Disabled buttons
- Hidden fields
- Read-only fields
- Client-side validation

Modify requests directly in Burp.

---

# 12. Time-Based Logic

Test:

- Expired tokens
- Expired coupons
- Password reset links
- Invitation links
- Trial periods

Can expired objects still be used?

---

# 13. User Role Changes

Attempt to modify:

```
role=user
```

↓

```
role=admin
```

```
isAdmin=false
```

↓

```
isAdmin=true
```

---

# 14. OTP Logic

Check:

- OTP reuse
- OTP prediction
- OTP replay
- OTP brute force
- OTP expiration
- OTP race conditions

---

# 15. Email Verification

Test:

- Skip verification
- Reuse verification token
- Modify email address
- Replay verification requests

---

# 16. Account Lifecycle

Test:

- Deleted accounts
- Disabled accounts
- Locked accounts
- Pending accounts

Can they still:

- Login?
- Reset password?
- Access APIs?

---

# 17. Transaction Integrity

Determine whether transactions can be:

- Modified
- Replayed
- Cancelled
- Duplicated
- Reversed

---

# 18. Hidden Features

Look for:

- Beta features
- Debug endpoints
- Hidden buttons
- Hidden API routes

---

# 19. Compare User Roles

Create:

- Guest
- User
- Premium User
- Moderator
- Administrator

Compare every workflow.

---

# 20. Think Like a User

Ask yourself:

- Can I perform this action twice?
- Can I perform it out of order?
- Can I perform it faster than expected?
- Can I perform it as another user?
- Can I avoid paying?
- Can I gain more than I should?

---

## Tips

- Business Logic vulnerabilities are rarely discovered by automated scanners.
- Follow the normal workflow before attempting to break it.
- Test every financial transaction.
- Replay every important request.
- Race conditions often occur in payment, coupon, and wallet functionality.
- If the application trusts client-supplied values, try modifying them.
- Compare workflows between different user roles.

---

## Checklist

- [ ] Understand the application workflow.
- [ ] Test price manipulation.
- [ ] Test coupon abuse.
- [ ] Test payment logic.
- [ ] Test quantity manipulation.
- [ ] Test workflow bypass.
- [ ] Test approval processes.
- [ ] Test race conditions.
- [ ] Test replay attacks.
- [ ] Test state manipulation.
- [ ] Bypass client-side validation.
- [ ] Test time-based logic.
- [ ] Test role changes.
- [ ] Test OTP implementation.
- [ ] Test email verification.
- [ ] Test account lifecycle.
- [ ] Test transaction integrity.
- [ ] Look for hidden functionality.
- [ ] Compare user roles.
- [ ] Challenge every business assumption.