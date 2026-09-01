# BloodHound Analysis & Attack Path Discovery

## Objective

Use BloodHound (or RustHound) to identify privilege escalation paths, excessive permissions, Kerberos attack opportunities, delegation issues, and routes to Domain Admin.

> **Rule:** Every time you compromise a new user or obtain higher privileges, **collect BloodHound data again**. New permissions often reveal entirely new attack paths.

---

# 1. Collect BloodHound Data

## Windows (SharpHound)

```powershell
.\SharpHound.exe -c All
```

or

```powershell
Invoke-BloodHound -CollectionMethod All
```

## Linux (BloodHound.py)

```bash
bloodhound-python -u <USER> -p <PASSWORD> -d <DOMAIN> -dc <DC_HOST> -c All -ns <DC_IP>
```

## RustHound

```bash
rusthound -d <DOMAIN> -u <USER> -p <PASSWORD> -f bloodhound.zip
```

Import the collected ZIP file into BloodHound.

---

# 2. Analyze Attack Paths

Start with the built-in BloodHound queries.

Focus on:

- Shortest Paths to Domain Admin
- Shortest Paths to High Value Targets
- High Value Targets
- Owned Principals
- Tier Zero Assets

---

# 3. Review Privileged Groups

Identify membership in privileged groups.

Look for:

- Domain Admins
- Enterprise Admins
- Schema Admins
- Account Operators
- Backup Operators
- Server Operators
- DNSAdmins
- Print Operators

Review nested group memberships as well.

---

# 4. Check for Kerberos Attack Opportunities

BloodHound can quickly identify:

- Kerberoastable Accounts
- AS-REP Roastable Users
- Constrained Delegation
- Unconstrained Delegation
- Resource-Based Constrained Delegation (RBCD)

Always investigate these before attempting manual enumeration.

---

# 5. Review ACL-Based Attack Paths

Look for objects where the compromised account has dangerous permissions.

Interesting rights include:

- GenericAll
- GenericWrite
- WriteOwner
- WriteDACL
- ForceChangePassword
- AddMember
- AddSelf
- AllExtendedRights

These permissions often allow privilege escalation without exploiting software vulnerabilities.

---

# 6. Check for DCSync Rights

Determine whether the current user has replication privileges.

Look for:

- GetChanges
- GetChangesAll
- GetChangesInFilteredSet

If present, DCSync may be possible without Domain Admin membership.

---

# 7. Enumerate Delegation

Review all delegation relationships.

Focus on:

- Unconstrained Delegation
- Constrained Delegation
- Resource-Based Constrained Delegation (RBCD)

---

# 8. Check for AD CS Attack Paths

If Active Directory Certificate Services is present, identify:

- Vulnerable certificate templates
- Enrollment rights
- ESC attack paths

BloodHound CE can visualize many AD CS attack paths.

---

# 9. Review User Sessions

Identify privileged users currently logged into systems.

Look for:

- Domain Admin sessions
- Service account sessions
- Administrative workstations

These often become excellent lateral movement targets.

---

# 10. Re-Collect BloodHound Data

Always collect BloodHound data again after:

- Compromising a new user
- Obtaining local administrator privileges
- Dumping credentials
- Performing lateral movement
- Becoming Domain Admin

> **New user = New BloodHound collection.**

Many attack paths only appear after additional privileges are obtained.

---

## BloodHound Checklist

- [ ] Collect BloodHound data.
- [ ] Import data into BloodHound.
- [ ] Review shortest paths to Domain Admin.
- [ ] Review shortest paths to High Value Targets.
- [ ] Check Kerberoastable accounts.
- [ ] Check AS-REP Roastable users.
- [ ] Review exploitable ACLs.
- [ ] Check for DCSync rights.
- [ ] Enumerate delegation (Unconstrained, Constrained, RBCD).
- [ ] Review AD CS attack paths.
- [ ] Check active privileged sessions.
- [ ] Re-collect BloodHound data after every privilege escalation or newly compromised user.

---

## Tips

- BloodHound is a **decision-making tool**, not just a data collector.
- Prioritize the **shortest and lowest-noise** attack path.
- Always investigate ACL-based privilege escalation before attempting password attacks.
- Re-run BloodHound after every successful compromise—new edges and attack paths frequently appear.
- Use BloodHound to validate privilege escalation opportunities before executing them.
