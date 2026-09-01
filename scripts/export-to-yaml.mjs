import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read existing playbooks data
const playbooksPath = path.join(__dirname, '..', 'src', 'lib', 'playbooks.ts');
const fileContent = fs.readFileSync(playbooksPath, 'utf8');

// Extract the PLAYBOOKS array JSON-like content
const match = fileContent.match(/export const PLAYBOOKS: Playbook\[\] = (\[[\s\S]*?\]);\s*export function/);
if (!match) {
  console.error('Failed to match PLAYBOOKS array in playbooks.ts');
  process.exit(1);
}

// Evaluate cleanly or parse
const playbooks = eval(match[1]);
console.log(`Found ${playbooks.length} playbooks to export to YAML structure.`);

const knowledgeBaseDir = path.join(__dirname, '..', 'knowledge');

const folderMapping = {
  smb: 'network/smb',
  http: 'network/http',
  ftp: 'network/ftp',
  ssh: 'network/ssh',
  dns: 'network/dns',
  kerberos: 'network/kerberos',
  ldap: 'network/ldap',
  mssql: 'network/mssql',
  winrm: 'network/winrm',
  redis: 'network/redis',
  'file-inclusion': 'web/file-inclusion',
  'sqli-sqlmap': 'web/sqli',
  'file-upload': 'web/file-upload',
  'command-injection': 'web/command-injection',
  'ad-attacks': 'ad/ad-attacks',
  'windows-privesc': 'privesc/windows',
  'linux-privesc': 'privesc/linux',
  pivoting: 'pivoting/pivoting',
  'shells-transfer': 'pivoting/shells-transfer',
  'password-cracking': 'passwords/password-cracking',
};

// Add enhanced if_success, if_failure, and references
playbooks.forEach((p) => {
  p.steps.forEach((step) => {
    if (!step.references) {
      if (step.id.startsWith('linux-')) {
        step.references = ['https://gtfobins.github.io/', 'https://book.hacktricks.xyz/linux-hardening/privilege-escalation'];
      } else if (step.id.startsWith('win-')) {
        step.references = ['https://lolbas-project.github.io/', 'https://book.hacktricks.xyz/windows-hardening/windows-local-privilege-escalation'];
      } else if (step.id.startsWith('lfi-') || step.id.startsWith('sqli-') || step.id.startsWith('cmd-') || step.id.startsWith('upload-')) {
        step.references = ['https://github.com/swisskyrepo/PayloadsAllTheThings', 'https://portswigger.net/web-security'];
      } else if (step.id.startsWith('ad-') || step.id.startsWith('kerb-') || step.id.startsWith('ldap-')) {
        step.references = ['https://wadcoms.github.io/', 'https://book.hacktricks.xyz/windows-hardening/active-directory-methodology'];
      } else {
        step.references = ['https://book.hacktricks.xyz/'];
      }
    }

    if (!step.if_success) {
      if (step.phase === 'reconnaissance') {
        step.if_success = 'Identified vulnerable service versions. Proceed to deep enumeration and account harvesting.';
      } else if (step.phase === 'enumeration') {
        step.if_success = 'Discovered valid accounts or endpoints. Test for credential spraying, auth bypasses, or injection vectors.';
      } else if (step.phase === 'exploitation') {
        step.if_success = 'Foothold confirmed! Stabilize TTY shell and proceed to local privilege escalation triage.';
      } else if (step.phase === 'privesc') {
        step.if_success = 'Elevated to root / SYSTEM! Dump local SAM/LSASS secrets and establish persistence.';
      } else {
        step.if_success = 'Proceed to next attack phase.';
      }
    }

    if (!step.if_failure) {
      if (step.phase === 'enumeration') {
        step.if_failure = 'No output found. Try alternative wordlists (e.g. SecLists raft-medium), test different domain contexts, or check alternate ports.';
      } else if (step.phase === 'exploitation') {
        step.if_failure = 'Exploit failed or blocked. Inspect WAF/filter responses, try encoding bypasses, or pivot to alternative open service ports.';
      } else {
        step.if_failure = 'Step returned negative result. Check firewall rules, protocol versions, or review alternative credentials.';
      }
    }
  });

  const relativeFolder = folderMapping[p.id] || `other/${p.id}`;
  const targetFolder = path.join(knowledgeBaseDir, relativeFolder);

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  const yamlContent = yaml.dump(p, { indent: 2, lineWidth: -1 });
  fs.writeFileSync(path.join(targetFolder, 'playbook.yaml'), yamlContent, 'utf8');
  console.log(`✓ Exported playbook [${p.id}] -> ${relativeFolder}/playbook.yaml`);
});

console.log('Done exporting modular YAML playbooks!');
