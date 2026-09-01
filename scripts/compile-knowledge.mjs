import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'knowledge');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'generatedPlaybooks.json');

const StepPhaseSchema = z.enum([
  'reconnaissance',
  'enumeration',
  'exploitation',
  'privesc',
  'post-exploitation',
]);

const TargetOSSchema = z.enum(['windows', 'linux', 'other']);

const PlaybookCategorySchema = z.enum([
  'network',
  'privesc',
  'post-exploitation',
  'web',
  'passwords',
  'ad',
]);

const PlaybookStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  phase: StepPhaseSchema,
  purpose: z.string(),
  command: z.string(),
  expected_output: z.array(z.string()).default([]),
  common_mistakes: z.array(z.string()).default([]),
  if_success: z.string().optional(),
  if_failure: z.string().optional(),
  references: z.array(z.string()).default([]),
});

const PlaybookSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: PlaybookCategorySchema,
  description: z.string(),
  port_triggers: z.array(z.number()).default([]),
  requires_shell: z.boolean().optional(),
  target_os: TargetOSSchema.optional(),
  tags: z.array(z.string()).default([]),
  steps: z.array(PlaybookStepSchema),
});

function loadYamlFilesFromDirectory(dir) {
  const playbooks = [];
  if (!fs.existsSync(dir)) return playbooks;

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    // Check if current directory has a playbook.yaml or metadata.yaml + commands.yaml
    const filenames = entries.map((e) => e.name);

    if (filenames.includes('playbook.yaml') || filenames.includes('playbook.yml')) {
      const pPath = path.join(currentDir, filenames.find((f) => f.startsWith('playbook.')));
      try {
        const doc = yaml.load(fs.readFileSync(pPath, 'utf8'));
        const validated = PlaybookSchema.parse(doc);
        playbooks.push(validated);
      } catch (err) {
        console.error(`[YAML Error in ${pPath}]:`, err.message);
      }
    } else if (filenames.includes('metadata.yaml') && filenames.includes('commands.yaml')) {
      const metaPath = path.join(currentDir, 'metadata.yaml');
      const cmdsPath = path.join(currentDir, 'commands.yaml');
      try {
        const meta = yaml.load(fs.readFileSync(metaPath, 'utf8'));
        const steps = yaml.load(fs.readFileSync(cmdsPath, 'utf8'));
        const combined = {
          ...meta,
          steps: Array.isArray(steps) ? steps : [],
        };
        const validated = PlaybookSchema.parse(combined);
        playbooks.push(validated);
      } catch (err) {
        console.error(`[YAML Error in ${currentDir}]:`, err.message);
      }
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(currentDir, entry.name));
      }
    }
  }

  walk(dir);
  return playbooks;
}

console.log('⚡ Compiling modular YAML Knowledge Base from /knowledge...');
const loadedPlaybooks = loadYamlFilesFromDirectory(KNOWLEDGE_DIR);

console.log(`✓ Validated and loaded ${loadedPlaybooks.length} playbooks from YAML files.`);

// Ensure target directory exists
const targetDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(loadedPlaybooks, null, 2), 'utf8');
console.log(`✓ Successfully compiled to ${OUTPUT_FILE}`);
