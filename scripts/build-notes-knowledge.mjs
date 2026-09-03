import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NOTES_DIR = path.join(__dirname, '..', 'notes_knowledge_base');
const CPTS_DIR = path.join(__dirname, '..', 'notion_cpts_notes', 'CPTS Playbook');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'notesKnowledgeData.ts');

function cleanTitle(filename) {
  return filename
    .replace(/^[0-9]+(\.[0-9]+)?\.\s*/, '') // Remove prefix like "01. " or "10.1 "
    .replace(/\s+[0-9a-f]{32}\.md$/i, '') // Remove Notion hex IDs
    .replace(/\.md$/i, '')
    .trim();
}

function extractHeadings(content) {
  const headings = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].replace(/[`*#]/g, '').trim(),
      });
    }
  }
  return headings;
}

function extractCommands(content) {
  const commands = [];
  const regex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const lang = match[1] || 'bash';
    const code = match[2].trim();
    if (code && !lang.includes('text') && !lang.includes('output')) {
      commands.push({
        language: lang,
        code,
      });
    }
  }
  return commands;
}

function extractTags(content, title) {
  const text = `${title} ${content}`.toLowerCase();
  const candidateTags = [
    'nmap', 'mimikatz', 'bloodhound', 'certipy', 'rubeus', 'ffuf', 'impacket',
    'sqlmap', 'burp', 'hashcat', 'chisel', 'ligolo', 'psexec', 'winrm',
    'kerberoasting', 'asreproast', 'timeroasting', 'timeroast', 'ntp', 'silver ticket', 'golden ticket', 'pass-the-ticket',
    'pass-the-hash', 'linpeas', 'winpeas', 'gtfobins', 'lolbas', 'adcs', 'esc1',
    'ldap', 'smb', 'kerberos', 'graphql', 'jwt', 'idor', 'sqli', 'lfi', 'rce',
    'xss', 'ssrf', 'xxe', 'privesc', 'persistence', 'lateral movement', 'sudo', 'suid'
  ];

  return candidateTags.filter((t) => text.includes(t));
}

function determineCategory(relPath) {
  const normalized = relPath.toLowerCase().replace(/\\/g, '/');
  if (normalized.includes('ad-checklist') || normalized.includes('silver-ticket') || normalized.includes('kerberos')) {
    return 'Active Directory & Kerberos';
  }
  if (normalized.includes('privesc-checklist') || normalized.includes('privilege escalation')) {
    return 'Privilege Escalation';
  }
  if (normalized.includes('web-checklist') || normalized.includes('web')) {
    return 'Web Application Security';
  }
  if (normalized.includes('post-exploitation') || normalized.includes('credential hunting')) {
    return 'Post-Exploitation & Looting';
  }
  if (normalized.includes('cpts')) {
    return 'CPTS Field Playbooks';
  }
  return 'General Methodologies';
}

function walkDirectory(dir, isCpts = false) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(walkDirectory(fullPath, isCpts));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const stat = fs.statSync(fullPath);
      const relPath = path.relative(isCpts ? path.join(__dirname, '..', 'notion_cpts_notes') : NOTES_DIR, fullPath);
      
      const rawTitle = cleanTitle(entry.name);
      // If title is generic like "README" or first heading exists, refine
      const firstHeading = extractHeadings(content)[0]?.text;
      const title = firstHeading && (rawTitle === 'README' || rawTitle.length < 3) ? firstHeading : rawTitle;

      const category = isCpts ? 'CPTS Field Playbooks' : determineCategory(relPath);
      const subcategory = path.dirname(relPath) !== '.' ? path.dirname(relPath).replace(/\\/g, ' / ') : undefined;

      const id = (relPath.replace(/\.md$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');

      results.push({
        id,
        title,
        category,
        subcategory,
        filePath: relPath.replace(/\\/g, '/'),
        content,
        headings: extractHeadings(content),
        commands: extractCommands(content),
        tags: extractTags(content, title),
        size: stat.size,
        lineCount: content.split('\n').length,
      });
    }
  }

  return results;
}

console.log('⚡ Parsing and indexing all Markdown notes from /notes_knowledge_base...');
const notesKnowledge = walkDirectory(NOTES_DIR, false);
console.log(`✓ Indexed ${notesKnowledge.length} comprehensive guides from notes_knowledge_base.`);

let cptsNotes = [];
if (fs.existsSync(CPTS_DIR)) {
  console.log('⚡ Indexing Notion CPTS Field Playbooks...');
  cptsNotes = walkDirectory(CPTS_DIR, true);
  console.log(`✓ Indexed ${cptsNotes.length} Notion CPTS playbooks.`);
}

const allNotes = [...notesKnowledge, ...cptsNotes];

// Sort notes by category and title
const categoryOrder = {
  'Active Directory & Kerberos': 1,
  'Web Application Security': 2,
  'Privilege Escalation': 3,
  'Post-Exploitation & Looting': 4,
  'CPTS Field Playbooks': 5,
  'General Methodologies': 6,
};

allNotes.sort((a, b) => {
  const orderA = categoryOrder[a.category] || 99;
  const orderB = categoryOrder[b.category] || 99;
  if (orderA !== orderB) return orderA - orderB;
  return a.title.localeCompare(b.title);
});

const tsContent = `// Auto-generated Comprehensive Field Manual & Knowledge Base
// Contains all markdown guides from All-Notes & CPTS Playbooks

export interface NoteHeading {
  level: number;
  text: string;
}

export interface NoteCommand {
  language: string;
  code: string;
  title?: string;
}

export interface KnowledgeNoteItem {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  filePath: string;
  content: string;
  headings: NoteHeading[];
  commands: NoteCommand[];
  tags: string[];
  size: number;
  lineCount: number;
}

export const KNOWLEDGE_NOTES: KnowledgeNoteItem[] = ${JSON.stringify(allNotes, null, 2)};

// Backward compatibility alias for legacy components
export const NOTION_CPTS_NOTES = KNOWLEDGE_NOTES;

export function getKnowledgeNoteById(id: string): KnowledgeNoteItem | undefined {
  return KNOWLEDGE_NOTES.find((n) => n.id === id);
}

export function searchKnowledgeNotes(query: string, category?: string): KnowledgeNoteItem[] {
  let list = KNOWLEDGE_NOTES;
  if (category && category !== 'all') {
    list = list.filter((n) => n.category === category);
  }
  if (!query || !query.trim()) return list;

  const q = query.toLowerCase().trim();
  return list.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      (n.subcategory && n.subcategory.toLowerCase().includes(q)) ||
      n.tags.some((t) => t.includes(q)) ||
      n.content.toLowerCase().includes(q)
  );
}
`;

fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');
console.log(`✓ Successfully compiled ${allNotes.length} guides into ${OUTPUT_FILE}`);
