// Headless-Prüfung des Ordner-Wegs (design/js/my-ablage.js + Format von MyMemory):
// die OPFS-Wurzel gilt als verbundener Ordner (Handle in IndexedDB mymemory → kv →
// dir), dann Spiegeln, Nachlesen, Löschen im «Finder», Link. Nach jedem
// ./sync.sh memory laufen lassen:
//   node tools/test-ordner.js
// Braucht Playwright samt Chromium (PLAYWRIGHT=<Pfad zum Paket>, falls nicht
// installiert) und Internet (React, Babel, Tailwind kommen vom CDN).
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const A = require('../design/js/my-ablage.js');
const PORT = 8772;
const base = `http://127.0.0.1:${PORT}/`;
const results = [];
const check = (ok, msg) => { results.push(ok); console.log(`${ok ? '✅' : '❌'} ${msg}`); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'],
    { cwd: path.join(__dirname, '..'), stdio: 'ignore' });
  process.on('exit', () => server.kill());
  for (let i = 0; i < 100; i++) { try { await fetch(base); break; } catch { await wait(50); } }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(base);
  // Ausgangslage: drei Memories nur im Browser, OPFS leer und als Ordner verbunden
  await page.evaluate(async () => {
    const root = await navigator.storage.getDirectory();
    for await (const name of root.keys()) await root.removeEntry(name, { recursive: true });
    localStorage.setItem('mymemory', JSON.stringify({
      memories: [
        { id: 's1', title: 'Unité 3 – La maison', dir: 'Französisch/Klasse 2', pairs: [{ question: 'das Haus', answer: 'la maison' }] },
        { id: 's2', title: 'Lektion 12', dir: '', pairs: [{ question: 'lieben', answer: 'amare' }] },
        { id: 's3', title: 'Lektion 2', dir: '', pairs: [{ question: 'sein', answer: 'esse' }] },
      ],
      folders: ['Leer'],
    }));
    await MyAblage.handleStore('mymemory').save(root); // derselbe Weg wie die App
  });
  const files = () => page.evaluate(async () => {
    const out = [];
    const walk = async (h, p) => { for await (const [n, e] of h.entries()) { if (e.kind === 'directory') { out.push(p + n + '/'); await walk(e, p + n + '/'); } else out.push(p + n); } };
    await walk(await navigator.storage.getDirectory(), '');
    return out.sort();
  });
  const store = () => page.evaluate(() => JSON.parse(localStorage.getItem('mymemory')));
  // Warten auf den Zustand statt fester Pausen: `fn` läuft im Browser, bis es
  // wahr liefert. Selbst abgefragt, weil page.waitForFunction eine async-Funktion
  // sofort als erfüllt nimmt (ein Promise ist «wahr»).
  const until = async (fn, arg, ms = 15000) => {
    for (const end = Date.now() + ms; Date.now() < end; await wait(100)) if (await page.evaluate(fn, arg)) return true;
    throw new Error('Zeitlimit');
  };
  // fertig geschrieben = vorhanden und nicht leer
  const hasFiles = (...paths) => until(async (paths) => {
    const root = await navigator.storage.getDirectory();
    for (const p of paths) {
      let h = root;
      const parts = p.split('/');
      try {
        for (const d of parts.slice(0, -1)) h = await h.getDirectoryHandle(d);
        if (!(await (await h.getFileHandle(parts.at(-1))).getFile()).size) return false;
      } catch { return false; }
    }
    return true;
  }, paths);
  const storeHas = (title, want = true) => until(([t, w]) => (JSON.parse(localStorage.getItem('mymemory')).memories.some((s) => s.title === t)) === w, [title, want]);
  const refocus = () => page.evaluate(() => window.dispatchEvent(new Event('focus')));

  await page.reload();
  // Chromium listet eine Datei, solange sie geschrieben wird, nicht in entries():
  // darum auf das fertige Schreiben warten statt eine Momentaufnahme zu prüfen
  const written = await hasFiles('Französisch/Klasse 2/Unite 3 - La maison.txt', 'Lektion 12.txt', 'Lektion 2.txt').then(() => true, () => false);
  const f = await files();
  check(written, `Memories aus dem Browser landen im Ordner, Namen ohne Umlaute (${f.join(', ')})`);
  const text = await page.evaluate(async () => {
    const r = await navigator.storage.getDirectory();
    const fh = await r.getFileHandle('Lektion 12.txt');
    return (await fh.getFile()).text();
  });
  check(text.startsWith('# Lektion 12\n') && text.includes('F: lieben\nA: amare'), 'Dateiinhalt im Memory-Format');

  const order = (await store()).memories.filter((s) => s.title.startsWith('Lektion')).map((s) => s.title);
  check(order.join() === 'Lektion 2,Lektion 12', `natürlich sortiert (${order.join(' · ')})`);

  // Ordner umbenennen, Vorgabe unverändert bestätigen: nichts darf umziehen (der
  // alte Name hat einen Umlaut, die Namensregel ergäbe «Franzoesisch»)
  await page.getByTitle(/Ordner umbenennen|Rename folder/).first().click();
  const okBtn = page.getByRole('button', { name: /^(Umbenennen|Rename)$/ });
  await okBtn.click();
  await okBtn.waitFor({ state: 'detached' });
  const fr = (await store()).memories.find((m) => m.id === 's1');
  check(fr && fr.dir === 'Französisch/Klasse 2' && !(await files()).some((p) => p.startsWith('Franzoesisch')),
    `Umbenennen ohne Änderung lässt den Ordner stehen (${fr && fr.dir})`);

  // Von Hand angelegte Datei kommt beim Fokus in die Liste und behält ihren Namen
  await page.evaluate(async () => {
    const r = await navigator.storage.getDirectory();
    const w = await (await r.getFileHandle('Fremd.txt', { create: true })).createWritable();
    await w.write('# Von Hand\n\nF: Hund\nA: dog\n---\n');
    await w.close();
  });
  await refocus();
  await storeHas('Von Hand');
  let st = await store();
  const hand = st.memories.find((s) => s.title === 'Von Hand');
  check(!!hand && hand.file === 'Fremd.txt', 'Datei von Hand erscheint als Memory, `file` gemerkt');

  // Im Finder gelöscht → beim Fokus weg (Lektion 12 kam nie aus dem Ordner, nur
  // hinein: dass sie trotzdem verschwindet, ist `known`)
  await page.evaluate(async () => (await navigator.storage.getDirectory()).removeEntry('Lektion 12.txt'));
  await refocus();
  await storeHas('Lektion 12', false);
  st = await store();
  check(!st.memories.some((s) => s.title === 'Lektion 12'), 'im Ordner gelöschtes Memory verschwindet');

  // Link: Memory-Format [Titel, Paare]. MyMemory spielt ihn direkt (speichert ihn nicht):
  // geprüft wird, dass packLink/unpackLink zum Format passen
  const data = await A.packLink(['Im Restaurant', [['die Rechnung', "l'addition"]]]);
  await page.goto(`${base}#m=${data}`);
  check(await until(() => document.body.innerText.includes('Im Restaurant')).then(() => true, () => false),
    'Link öffnet das Memory');

  check(errors.length === 0, `keine Fehler in der Konsole${errors.length ? ': ' + errors.join(' | ') : ''}`);
  await browser.close();
  const ok = results.every(Boolean);
  console.log(ok ? 'ALLES OK' : 'FEHLGESCHLAGEN');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
