# 🧭 Pathfinder // CTF & Penetration Testing Playbook Companion

> **A modern, high-density, interactive penetration testing and CTF engagement assistant.** Built for security professionals, CTF players (HackTheBox, Proving Grounds, TryHackMe), and penetration testers to navigate service enumeration, exploitation, privilege escalation, and lateral movement with speed and precision.

![Pathfinder Banner](https://img.shields.io/badge/Pathfinder-v2.0-emerald?style=for-the-badge&logo=compass)
![Next.js 14](https://img.shields.io/badge/Next.js-14.2-cyan?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-Dark_Theme-slate?style=for-the-badge&logo=tailwindcss)
![Playbooks](https://img.shields.io/badge/Playbooks-40_Modules-emerald?style=for-the-badge)

---

## ⚡ Key Capabilities

- **🗺️ 5-Phase Engagement Roadmap:**
  - Structured, step-by-step workflow covering:
    1. **Phase 1:** Target Reconnaissance & OSINT
    2. **Phase 2:** Service Enumeration (26+ Port Presets + Custom Ports)
    3. **Phase 3:** Foothold & Initial Exploitation
    4. **Phase 4:** Privilege Escalation (Linux & Windows)
    5. **Phase 5:** Post-Exploitation, Secrets Dumping & Lateral Movement
- **📚 40 Modular Service & Attack Playbooks:**
  - Network Services: `FTP`, `SSH`, `SMTP`, `DNS`, `TFTP`, `Finger`, `HTTP`, `Kerberos`, `POP3/IMAP`, `NFS`, `SNMP`, `LDAP`, `IPMI`, `Rsync`, `SMB`, `MSSQL`, `Oracle TNS`, `MySQL`, `RDP`, `WinRM`, `Redis`, and raw daemons.
  - Active Directory & Enterprise Networks: **AD CS (Certipy ESC1-ESC8 & Shadow Credentials)**, **Kerberos Delegations & RBCD**, **NoPac Domain Controller Takeover**, **PetitPotam NTLM Relay**, **Child-to-Parent Forest Trusts**, **DCSync & Secrets Dumping**.
  - Web Exploitation: **LFI / RFI & Stream Wrappers**, **SQL Injection & SQLMap**, **File Upload Bypasses**, **Command Injection**, **XSS**, **XXE**, **WordPress / Tomcat / Jenkins / Drupal**.
  - PrivEsc & Pivoting: **Linux Capabilities & SUID/Cron**, **Windows Tokens & Privileged Groups**, **LOLBAS & GTFOBins**, **Chisel & Ligolo-ng**, **Password Cracking Modes**.
- **⚡ Live Dynamic Command Interpolation:**
  - Automatically replaces `{{TARGET}}`, `{{PORT}}`, `{{USERNAME}}`, `{{PASSWORD}}`, `{{DOMAIN}}`, and `{{LHOST}}` with real-time target data.
  - 1-Click clean terminal copy (`Copied!`).
- **🎚️ Adaptive Operator Experience Levels:**
  - **Beginner Mode:** Comprehensive explanations, success indicators, expected terminal outputs, and common pitfalls/gotchas.
  - **Intermediate Mode:** Clean view with commands, purpose, and key gotchas.
  - **Pro / Fast Mode:** High-density command boxes for fast execution.
- **📄 GitHub-Flavored Markdown Notes Editor:**
  - Full GFM support (tables, blockquotes, task lists, fenced code blocks) with auto-save to LocalStorage.
- **🛡️ Streamer / Privacy Mode:**
  - 1-click masking of sensitive passwords and hashes during streaming or screen sharing.
- **⚡ Fast Nmap XML & Grepable Importer:**
  - Paste any Nmap output (`nmap -sC -sV`) to instantly auto-discover ports, services, OS, and activate applicable playbooks.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/pathFinder.git
cd pathFinder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with Cyber Dark Palette
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with Persistent LocalStorage
- **Icons:** [Lucide React](https://lucide.dev/)
- **Validation:** [Zod](https://zod.dev/) Schema Validation for Playbooks
- **Markdown:** [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)

---

## ⚠️ Legal & Ethical Disclaimer

> **IMPORTANT:** Pathfinder is developed and distributed strictly for **educational purposes**, CTF competitions (e.g., HackTheBox, TryHackMe, Proving Grounds), and authorized penetration testing engagements where explicit, written permission has been obtained from the system owners. 
> 
> Unauthorized testing, exploitation, or attacking of networks and systems without explicit authorization is illegal. The developers and contributors assume no liability and are not responsible for any misuse, damage, or legal consequences caused by this tool.

---

## 📄 License & Acknowledgments

- **License:** MIT License. Built for ethical penetration testing and CTF educational purposes.
- **Methodology & Sources:** Inspired by HackTricks, PayloadsAllTheThings, WADComs, GTFOBins, LOLBAS Project, Orange Cyberdefense Mindmaps, and HTB Academy CPTS methodology.

