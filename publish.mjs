// Veröffentlicht die Memories aus dem lokalen Datenordner auf die Website:
// Ordner → repo/memories synchronisieren, committen, pushen (Pages deployt dann).
//
//   node publish.mjs                  Memories veröffentlichen
//   node publish.mjs --dir            zeigt den aktuellen Datenordner
//   node publish.mjs --set-dir <pfad> Datenordner festlegen (wie bei MyKahoot);
//                                     ist er leer, werden die bisherigen
//                                     Memories als Startbestand hineinkopiert
//   node publish.mjs --set-dir ""     zurück auf Repo-Betrieb (memories/ im Repo)
//
// Die Wahl des Ordners liegt in der Maschinen-Konfig (Application Support),
// nicht im Repo — sie gehört zur Maschine, nicht zu den Inhalten.
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const REPO_ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO_MEMORIES = path.join(REPO_ROOT, 'memories');

const CONFIG_DIR = process.platform === 'darwin'
  ? path.join(os.homedir(), 'Library', 'Application Support', 'MyMemory')
  : path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'), 'mymemory');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

const readConfig = () => {
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); } catch { return {}; }
};

// Leerer Wert löscht den Key → zurück auf Repo-Betrieb
const writeConfig = (patch) => {
  const cfg = { ...readConfig(), ...patch };
  for (const key of Object.keys(cfg)) if (!cfg[key]) delete cfg[key];
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n');
};

const memoriesDir = () =>
  process.env.MYMEMORY_DIR ? path.resolve(process.env.MYMEMORY_DIR)
    : readConfig().memoriesDir || REPO_MEMORIES;

const git = (...args) =>
  execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();

const args = process.argv.slice(2);

if (args[0] === '--dir') {
  const dir = memoriesDir();
  console.log(dir + (dir === REPO_MEMORIES ? ' (Repo-Betrieb, kein eigener Ordner gesetzt)' : ''));
  process.exit(0);
}

if (args[0] === '--set-dir') {
  const target = (args[1] || '').trim();
  if (!target) {
    writeConfig({ memoriesDir: '' });
    console.log(`Zurück auf Repo-Betrieb: ${REPO_MEMORIES}`);
    process.exit(0);
  }
  const resolved = path.resolve(target);
  if (!fs.existsSync(resolved)) {
    // Ein fehlender Wunsch-Ordner wird nicht stillschweigend angelegt —
    // Tippfehler oder nicht eingehängtes Laufwerk sollen auffallen.
    console.error(`Der Ordner existiert nicht: ${resolved}`);
    process.exit(1);
  }
  const hasContent = fs.readdirSync(resolved).some((n) => !n.startsWith('.'));
  if (!hasContent && fs.existsSync(REPO_MEMORIES)) {
    fs.cpSync(REPO_MEMORIES, resolved, {
      recursive: true,
      filter: (p) => path.basename(p) !== 'index.json', // wird generiert, gehört nicht zur Ablage
    });
    console.log(`Bisherige Memories als Startbestand nach ${resolved} kopiert.`);
  }
  writeConfig({ memoriesDir: resolved });
  console.log(`Datenordner: ${resolved}`);
  console.log('Veröffentlichen mit: node publish.mjs');
  process.exit(0);
}

// ---- Veröffentlichen ----
const src = memoriesDir();
if (!fs.existsSync(src)) {
  console.error(`Datenordner nicht gefunden: ${src}\n(gelöscht oder Laufwerk nicht da? Ändern mit --set-dir)`);
  process.exit(1);
}

if (src !== REPO_MEMORIES) {
  // Repo-Kopie ist reines Veröffentlichungs-Artefakt: komplett ersetzen,
  // damit lokal Gelöschtes auch von der Website verschwindet.
  fs.rmSync(REPO_MEMORIES, { recursive: true, force: true });
  fs.cpSync(src, REPO_MEMORIES, { recursive: true });
  fs.rmSync(path.join(REPO_MEMORIES, 'index.json'), { force: true }); // generiert der Workflow
  console.log(`Synchronisiert: ${src} → ${REPO_MEMORIES}`);
}

git('add', '-A', 'memories');
if (!git('status', '--porcelain', 'memories')) {
  console.log('Keine Änderungen an den Memories — nichts zu veröffentlichen.');
  process.exit(0);
}
git('commit', '-m', 'Memories aktualisiert');
git('push');
console.log('Veröffentlicht — in ca. 1 Minute live auf https://manuel-benz.github.io/MyMemory/');
