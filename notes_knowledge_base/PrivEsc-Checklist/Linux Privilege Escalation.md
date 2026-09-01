# Linux Privilege Escalation Checklist

## Objective

Identify local privilege escalation vectors, recover credentials, exploit misconfigurations, and obtain root privileges.

> **Rule:** Enumerate manually first, then validate findings with automated tools.

---

# 1. Basic Enumeration

Determine:

- Current user
- Groups
- Hostname
- Kernel version
- Distribution
- Architecture

```bash
whoami
id
hostname
uname -a
cat /etc/os-release
```

Check:

- Environment variables
- PATH
- HOME
- SHELL

```bash
env
echo $PATH
```

Look for:

- Credentials
- API keys
- Interesting usernames

---

# 2. Automated Enumeration

Run:

- LinPEAS
- LinEnum
- pspy

---

# 3. Environment Variables

Review:

```bash
env
printenv
echo $PATH
```

Look for:

- Credentials
- Tokens
- Writable PATH
- API Keys

---

# 4. Sudo Permissions

```bash
sudo -l
```

Look for:

- NOPASSWD
- Environment preservation
- Wildcards
- Allowed binaries

Reference:

- GTFOBins

---

# 5. SUID Binaries

```bash
find / -perm -4000 -type f 2>/dev/null
```

Check every uncommon binary against GTFOBins.

---

# 6. Linux Capabilities

```bash
getcap -r / 2>/dev/null
```

Interesting:

- cap_setuid
- cap_setgid
- cap_dac_override
- cap_sys_admin

Reference:

- GTFOBins

---

# 7. Cron Jobs

Review:

```bash
cat /etc/crontab
ls -la /etc/cron*
crontab -l
```

Run:

```bash
pspy64
```

Look for:

- Hidden cron jobs
- Writable scripts
- PATH hijacking

---

# 8. Systemd Services & Timers

Enumerate services:

```bash
systemctl list-units --type=service
```

Timers:

```bash
systemctl list-timers --all
```

Look for:

- Writable service files
- Writable timer scripts
- Custom services

---

# 9. Writable Files

Interesting targets:

```bash
find / -writable -type f 2>/dev/null
```

Check:

```text
/etc/passwd
/etc/shadow
/etc/sudoers
```

---

# 10. Running Services

```bash
ss -tunlp
```

or

```bash
netstat -tunlp
```

Focus on:

- Localhost services
- Admin panels
- Databases
- APIs

---

# 11. Database Enumeration

Locate databases:

```bash
find / -name mysql 2>/dev/null
find / -name psql 2>/dev/null
find / -name redis-cli 2>/dev/null
```

Search:

```text
/var/www/
/var/www/html/
/opt/
/srv/
```

Look for:

- Database credentials
- Root passwords

---

# 12. Configuration Files

Search:

```bash
find / -type f \( \
-name ".env" -o \
-name "config.php" -o \
-name "wp-config.php" -o \
-name "settings.py" -o \
-name "application.properties" -o \
-name "database.yml" \
\) 2>/dev/null
```

Look for:

- Passwords
- SSH Keys
- API Keys
- Tokens

---

# 13. SSH Credentials

```bash
find /home -name id_rsa 2>/dev/null
find /home -name authorized_keys 2>/dev/null
find /home -name known_hosts 2>/dev/null
```

---

# 14. Password Reuse

Always try:

```
username : username
root : root
```

Also try recovered passwords for:

- sudo
- su
- SSH
- Databases

---

# 15. Mail Enumeration

```bash
cat /var/mail/*
cat /var/spool/mail/*
```

Look for:

- Credentials
- Password resets
- Internal communications

---

# 16. Interesting Groups

```bash
id
groups
```

Interesting groups:

- docker
- disk
- lxd
- adm
- shadow
- sudo
- wheel
- libvirt
- kvm

---

# 17. Docker Privilege Escalation

Check:

```bash
groups
```

If in docker group:

```bash
docker images
docker ps
```

Docker group membership frequently leads to root.

---

# 18. LXD / LXC Privilege Escalation

Check:

```bash
groups
```

Look for:

```
lxd
```

LXD group membership frequently allows root access.

---

# 19. NFS Misconfigurations

Check mounted shares:

```bash
mount
cat /etc/fstab
showmount -e <SERVER>
```

Look for:

- no_root_squash
- Writable exports

---

# 20. Kernel Exploits

Review:

```bash
uname -a
```

Common:

- PwnKit
- DirtyPipe
- DirtyCow
- OverlayFS

Always verify exploit applicability.

---

# 21. Suspicious Binaries

Inspect:

```bash
strings <binary>
```

Look for:

- Passwords
- API Keys
- Hidden functionality
- Missing libraries

---

# 22. Shared Library Hijacking

Check:

```bash
ldd <binary>
```

Errors:

```
cannot open shared object file
```

Create missing libraries where applicable.

---

# 23. PATH Hijacking

Check:

```bash
echo $PATH
```

Review scripts for binaries called without absolute paths.

---

# 24. Wildcard Injection

Review scripts using:

- tar
- rsync
- zip
- chmod
- chown

Look for:

```bash
tar *
```

instead of:

```bash
tar -- *
```

Cron jobs often execute these as root.

---

# 25. Backup Scripts

Search:

```bash
find / -name "*backup*" 2>/dev/null
find / -name "*.sh" 2>/dev/null
```

Look for:

- Root-owned scripts
- Writable scripts
- Credentials
- PATH hijacking

---

# 26. Mounted Filesystems

```bash
mount
cat /etc/fstab
lsblk
df -h
```

Look for:

- Writable mounts
- NFS
- CIFS
- Docker mounts

---

# 27. Containers

Determine:

```bash
cat /proc/1/cgroup
```

Check:

- Docker
- Kubernetes
- LXC

Look for:

- Docker socket
- Privileged containers
- Mounted host filesystem

---

# 28. Checklist

- [ ] Run manual enumeration.
- [ ] Run LinPEAS.
- [ ] Review environment variables.
- [ ] Check `sudo -l`.
- [ ] Enumerate SUID binaries.
- [ ] Enumerate capabilities.
- [ ] Check cron jobs.
- [ ] Review systemd services and timers.
- [ ] Search writable files.
- [ ] Enumerate running services.
- [ ] Enumerate databases.
- [ ] Search configuration files.
- [ ] Check SSH keys.
- [ ] Test password reuse.
- [ ] Read local mail.
- [ ] Review user groups.
- [ ] Check Docker group.
- [ ] Check LXD/LXC group.
- [ ] Check NFS misconfigurations.
- [ ] Review kernel exploits.
- [ ] Analyze suspicious binaries.
- [ ] Check shared library hijacking.
- [ ] Check PATH hijacking.
- [ ] Check wildcard injection.
- [ ] Review backup scripts.
- [ ] Review mounted filesystems.
- [ ] Check for container escapes.