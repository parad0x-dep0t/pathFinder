const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'notion_cpts_notes', 'CPTS Playbook');
const outputFile = path.join(__dirname, '..', 'src', 'lib', 'notionNotesData.ts');

function cleanTitle(filename) {
  // Notion appends a 32-char hex id, e.g. "Service Enumeration 2e0f5174ff0280668218ef1fd863a33b.md"
  return filename.replace(/\s+[0-9a-f]{32}\.md$/i, '').replace(/\.md$/i, '').trim();
}

function walkDir(dir, category = 'General') {
  let results = [];
  const list = fs.readdirSync(dir);

  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subCat = cleanTitle(item);
      results = results.concat(walkDir(fullPath, subCat));
    } else if (item.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const title = cleanTitle(item);
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      results.push({
        id,
        title,
        category,
        content,
        size: stat.size,
      });
    }
  }

  return results;
}

const allNotes = walkDir(rootDir);
console.log(`Parsed ${allNotes.length} Notion CPTS Notes!`);

const tsContent = `// Auto-generated Notion CPTS Playbook Knowledge Base
export interface NotionNoteItem {
  id: string;
  title: string;
  category: string;
  content: string;
  size: number;
}

export const NOTION_CPTS_NOTES: NotionNoteItem[] = ${JSON.stringify(allNotes, null, 2)};

export function getNotionNoteById(id: string): NotionNoteItem | undefined {
  return NOTION_CPTS_NOTES.find((n) => n.id === id);
}

export function searchNotionNotes(query: string): NotionNoteItem[] {
  if (!query || !query.trim()) return NOTION_CPTS_NOTES;
  const q = query.toLowerCase();
  return NOTION_CPTS_NOTES.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
  );
}
`;

fs.writeFileSync(outputFile, tsContent, 'utf8');
console.log(`Successfully generated ${outputFile}`);
