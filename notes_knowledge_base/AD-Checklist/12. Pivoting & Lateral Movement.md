# Pivoting & Lateral Movement

## Objective

Pivot into inaccessible network segments, enumerate newly discovered hosts, validate recovered credentials, and move laterally throughout the Active Directory environment.

---

# 1. Network Discovery

Determine whether additional internal networks are reachable.

Check:

- Additional network adapters
- VPN interfaces
- Hyper-V adapters
- Docker networks
- Multiple subnets
- Static routes

Windows:

```cmd
ipconfig /all
```

```cmd
route print
```

Linux:

```bash
ip addr
```

```bash
ip route
```

> Multiple network interfaces often indicate additional internal segments that require pivoting.

---

# 2. Network Pivoting

If the compromised host has access to another subnet, establish a pivot.

## Ligolo-ng

Start the proxy.

```bash
proxy
```

Start the agent.

```bash
agent
```

Add a route to the newly discovered subnet.

Example:

```bash
sudo ip route add 192.168.240.0/24 dev ligolo
```

> Replace the subnet with the newly discovered network.

---

# 3. Enumerate Through the Pivot

After routing traffic through the tunnel, enumerate the new network.

Host discovery:

```bash
nmap -sn 192.168.240.0/24
```

Port scan:

```bash
nmap -Pn -sV -p- 192.168.240.0/24
```

Continue enumeration as if directly connected.

---

# 4. Validate Every Credential

Whenever new credentials are recovered:

- Test every discovered host.
- Test every accessible protocol.
- Test local authentication.

Never assume credentials only work on the machine where they were found.

---

# 5. Password Spraying

Spray recovered passwords across the environment when permitted by the engagement scope.

Common targets:

- SMB
- WinRM
- RDP
- LDAP
- MSSQL
- SSH

Use:

- `nxc`

Always consider account lockout policies.

---

# 6. Pass-the-Hash

Whenever NTLM hashes are recovered:

Test:

- SMB
- WinRM
- PsExec
- WMIExec
- SMBExec

Hashes frequently work across multiple hosts due to administrator password reuse.

---

# 7. Test Local Authentication

Never forget local authentication.

```bash
nxc smb <TARGET> -u <USER> -p <PASSWORD> --local-auth
```

Password reuse among local administrator accounts is common.

---

# 8. Switch User Context

If valid credentials are discovered but remote logon is not permitted, execute processes as another user.

Example:

```cmd
RunasCs.exe <DOMAIN>\<USER> <PASSWORD> whoami
```

or

```cmd
RunasCs.exe <DOMAIN>\<USER> <PASSWORD> cmd.exe
```

Useful for validating credentials before attempting lateral movement.

---

# 9. Test Every Protocol

Recovered credentials should be tested against every exposed service.

Check:

- SMB
- WinRM
- LDAP
- MSSQL
- SSH
- FTP
- RDP
- HTTP applications

Different services frequently enforce different authentication mechanisms.

---

# 10. Target High-Value Systems

Do not focus solely on Domain Controllers.

High-value targets often include:

- Database servers
- File servers
- Backup servers
- Certificate servers
- SQL Servers
- Exchange servers
- SCCM servers
- Application servers
- Jump hosts

These systems frequently contain sensitive credentials or business data without requiring Domain Admin privileges.

---

# 11. Re-Enumerate

Every successful compromise should trigger another round of enumeration.

Repeat:

- BloodHound
- SMB enumeration
- Session enumeration
- Credential hunting
- Privilege escalation
- Network discovery

New privileges often reveal additional attack paths.

---

## Tips

- Always check for additional network interfaces after obtaining a shell.
- Pivot before assuming a network is inaccessible.
- Reuse every recovered credential across all discovered hosts.
- Never forget `--local-auth`.
- Test passwords before hashes whenever both are available.
- Valuable data often resides on file servers and database servers—not only Domain Controllers.
- Re-run BloodHound after every successful lateral movement.
- Validate credentials manually if automated tools produce unexpected results.

---

## Checklist

- [ ] Enumerate network interfaces.
- [ ] Identify additional subnets.
- [ ] Establish a Ligolo-ng pivot.
- [ ] Add routes to newly discovered networks.
- [ ] Scan through the pivot.
- [ ] Validate recovered credentials.
- [ ] Perform password spraying.
- [ ] Perform Pass-the-Hash.
- [ ] Test local authentication.
- [ ] Switch user context with RunasCs when appropriate.
- [ ] Test every protocol.
- [ ] Target high-value systems.
- [ ] Re-enumerate after every successful compromise.
