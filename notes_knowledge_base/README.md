# Active Directory Pentesting Attack Flow

```text
Pentesting Methodology
│
├── 01. Web Pentesting Playbook
│      ├── HTTP Enumeration
│      ├── Content Discovery
│      ├── Authentication
│      ├── Authorization
│      ├── Injection
│      ├── API Testing
│      ├── File Handling
│      ├── Business Logic
│      ├── CMS Testing
│      ├── Client-Side
│      ├── WebSockets
│      └── Post Exploitation
│
└── 02. Active Directory Playbook
       ├── Domain Enumeration
       ├── Kerberos
       ├── Credential Abuse
       ├── BloodHound
       ├── Ticket Abuse
       ├── Pivoting
       └── Persistence
```

## Typical Attack Progression

```text
Recon
   │
   ▼
User Enumeration
   │
   ▼
Credential Discovery
   │
   ▼
Initial Foothold
   │
   ▼
Local Enumeration
   │
   ▼
Privilege Escalation
   │
   ▼
Credential Harvesting
   │
   ▼
Lateral Movement
   │
   ▼
Active Directory Enumeration
   │
   ▼
Domain Administrator
   │
   ▼
Kerberos Abuse
   │
   ▼
Persistence
```
