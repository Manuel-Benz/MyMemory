// Erzeugt memories/index.json aus allen .md-Dateien unter memories/.
// Wird vom Pages-Workflow beim Deploy ausgeführt; lokal: node build-index.mjs
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';

const ROOT = 'memories';
const memories = [];

(function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.md')) {
      const md = readFileSync(full, 'utf8');
      const m = md.match(/^#\s+(.+)$/m);
      const id = relative(ROOT, full).replace(/\.md$/, '');
      memories.push({
        id,
        title: m ? m[1].trim() : id,
        dir: relative(ROOT, dir) || '',
      });
    }
  }
})(ROOT);

writeFileSync(join(ROOT, 'index.json'), JSON.stringify({ memories }, null, 2) + '\n');
console.log(`${memories.length} Memories indexiert.`);
