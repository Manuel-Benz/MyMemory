# MyMemory

Memory-Spiel für 2 Spieler im Unterricht. Komplett clientseitig, live auf
GitHub Pages (https://manuel-benz.github.io/MyMemory/). Nutzerdoku: `README.md`,
Stand und Backlog: `PLAN.md`.

## Stack

Eine einzige `index.html`: React 18 + Babel standalone, Tailwind per CDN
(Konfiguration inline im `<head>`), KaTeX, qrcode-generator; JSZip wird erst beim
Export nachgeladen. **Kein Build-Schritt, kein Backend.** Daten im Browser
(`localStorage`) bzw. komprimiert im URL-Fragment (`#m=…`). Optional (Chrome/Edge am
Computer) liegen die Memories als `.txt` in einem verknüpften Ordner — Logik aus
MyVoci (`readDir`/`fromDisk`/`mirrorDir`, Handle in IndexedDB `mymemory`→`kv`→`dir`,
`mirrored`-Ref, eine Promise-Kette, Nachlesen beim Fenster-Fokus); Begründungen dort
in der CLAUDE.md. Abweichungen: Identität eines Memorys ist Ordner + Titel
(`memoryPlace`, Ordner über `safeDir`) bzw. dieselbe Datei (`sameSlot`) — Import und
Editor prüfen dagegen; `known`-Ref (ids, die wir geschrieben haben) statt nur
`disk`-Flag; `readDir` liest gebündelt und cached nach Grösse + Änderungszeit;
`takeDisk` verwirft einen Lesestand, wenn sich der Store währenddessen geändert hat.
Ordnernamen gehen durch `cleanName` (keine Dateisystem-Zeichen).

## Befehle

```bash
python3 -m http.server 8765        # lokal ansehen: http://127.0.0.1:8765/
~/MySuite/sync.sh memory            # Design-Dateien neu nach design/ kopieren
```

Deploy = `git push` auf `main` (GitHub Pages).

## Konventionen

- Deutsch, Schweizer Schreibweise (`ss`), Kommentare erklären das «Warum».
- Oberfläche zweisprachig: jeder Text über `t()` aus `I18N` (beide Tabellen mit
  denselben Schlüsseln). Inhalte (Memories, Beispiele) werden nie übersetzt.
- Hash-Routen nur über `toHash`/`withLang`/`getRoute`; Sprache steht als `&l=` am Ende.
- `localStorage` nur über `readLocal`/`writeLocal` (dürfen scheitern).
- Dateiformat F:/A:/--- identisch mit MyTafelfussball.

## Design (My-Designsystem)

- Quelle ist **`~/MySuite`**; `design/` ist eine Kopie (`design/HERKUNFT.txt`) und
  wird **nie** hier geändert. Farbwert falsch → in MySuite ändern (css + DESIGN.md +
  referenz + Änderungsliste), prüfen, dann `./sync.sh` für alle Apps.
- Standard: Schema **Grand Budapest Hotel**, Akzent **Ton 3 Aubergine**
  (#4A2569 / #A17BBC), Listenform **kompakt**, Icon Elefant.
- `tailwind.config` kennt **nur** Token-Farben (`text-text-2`, `bg-akzent-weich`,
  `text-rot` …) — eine alte Klasse wie `text-red-600` erzeugt gar nichts.
- Komponenten (`.knopf-1/-2/-n`, `.symbol`, `.umschalter`, `.liste-zeile`,
  `.kachel`, `.karte-*`) stehen im `<style type="text/tailwindcss">` (sonst gewinnt
  Tailwinds Preflight über die Knopf-Flächen).
- Eigene Variablen heissen **nie** wie Tokens (`--akzent`, `--karte` …), sonst
  überschreiben sie das Schema still. Abgeleitete Flächen per
  `color-mix(…, var(--karte))`, damit sie Hell/Dunkel mitmachen.
- Schema/Ton (`mymemory_look`) und Hell/Dunkel/System (`mymemory_modus`) setzt ein
  Skript im `<head>` vor dem ersten Zeichnen als `data-schema`/`data-ton`/`data-modus`
  am `<html>`; die Einstellungen schreiben dieselben Schlüssel (`applyLook`/`applyModus`).
- Sichtprüfung headless: `prefers-color-scheme` per CDP ausdrücklich setzen, sonst
  erbt Chrome den Modus des Macs.

### Abweichungen

- **Keine Kopfleiste** (wie MyKahoot): Startseite mit Markenzug (Titel, rechts
  daneben der Elefant ohne Kachel als Maske in `currentColor`, `logo-elefant.svg` aus
  `tools/make-logo.py` — nach neuem Icon neu erzeugen), im Spiel die bisherige Kopfzeile (Übersicht · Titel · Einstellungen).
- **Einstellungen** (`<Settings />`, wie MyKahoot, Regel in MySuite DESIGN.md): ab
  1200 px (Spiel 1100 px, Spalte schmaler erst ab 1360 px) wandern Knopf + Kästchen an den rechten Fensterrand (12/14 px
  oben/rechts wie MyKahoot) und die
  Spalte wird schmaler (`COLUMN`/`SETTINGS_DOCK`), darunter klappt das Kästchen über den
  Inhalt. Nie schiebt es die Spalte nach unten.
- **Spielfeld** (`useBoardLayout`): Spaltenzahl und Breite rechnet ein Hook aus Fensterbreite
  und -höhe (alles ohne Scrollen, sonst ab Kachel < `MIN_TILE` scrollen). Das Feld darf
  breiter sein als `COLUMN.wide` (zentriert per `margin-left: calc(50% − w/2)`); `.board`
  ist flex-wrap, damit die angebrochene letzte Reihe mittig steht. Die Schriftmessung
  (`useSharedFontSize`) folgt der Kachelgrösse per ResizeObserver.
- **Rand oben** (wie Dschungel/Blut in MyKahoot): Hell = Pixel, Dunkel = Neuronen-Netz.
  `hintergrund/*.svg` aus `tools/make-hintergrund.py`, je Farbschicht eine Maske, gefüllt
  mit Schema-Tokens (`--akzent`, `--rad-N`, `--spiel-3`) — macht jedes Schema mit. Das
  Skript schreibt Version `V` und Kachelmasse selbst in `index.html` (Marken «rand-daten»);
  die Farbzuordnung der Schichten steht im Skript unter `<body>`. Frei stehender Text auf dem Rand (auch Titel, Lade-/Fehlertext): `.frei`;
  Knöpfe darauf: `.auf-rand` (deckend, Hover als Schleier).
- **Beispiele ausblendbar** (`mymemory_beispiele`, `useExamplesShown`): Auge-Knopf an der
  Liste, zurück über die Einstellungen.
- **Spielfarben:** Spieler 1 = `--spiel-1`, Spieler 2 =
  `--spiel-4`; offene Karten (mit Rand) und gefundene Paare tragen die Farbe des Spielers, Kartenrücken = Akzent. `--spiel-2` bleibt
  aussen vor (in Budapest identisch mit dem Akzent). In «Isle of Dogs» sind `--spiel-1`/`-4` fast gleich: dort nimmt Spieler 2 `--blau`. Spielfarbe nur als Fläche/Punkt,
  Punktzahlen in `--text` (Rosa erreicht als Schrift nur 2:1).
- **Eigener Umschalter Hell/Dunkel/System** (`data-modus`). Bekannte Grenze aus
  my-schemen.css: der Schema-Akzent folgt weiter dem OS-Modus.
- **QR-Code** immer schwarz auf weissem Grund (`.qr`, einziger fester Farbwert) —
  sonst scannt ihn kein Handy.
- App-Icon `apple-touch-icon.png` (180 px) ist aus `design/icons/memory.svg`
  erzeugt (`magick -background '#4A2569' … -flatten`); nach Icon-Änderung neu erzeugen.
