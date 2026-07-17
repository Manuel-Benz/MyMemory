# MyMemory

Memory-Spiel für 2 Spieler mit austauschbaren Aufgabensets – für den Unterricht.
Live: https://manuel-benz.github.io/MyMemory/

## Neues Memory anlegen

Eine Markdown-Datei unter `memories/` ablegen (Unterordner = Themen in der Übersicht):

```markdown
# Titel des Memorys

## Vorderseite der Karte
Rückseite der Karte

## $\sqrt{169}$
$13$
```

- Pro Paar: `## Vorderseite`, die nächste Zeile ist die Rückseite.
- LaTeX in `$...$` wird mit KaTeX gerendert, Text und LaTeX sind mischbar.
- Bei mehr als 12 Paaren wählt jede Runde zufällig 12 aus.

Danach veröffentlichen (siehe Ablage) – der Pages-Workflow generiert den Index
(`memories/index.json`) automatisch und deployt die Seite.

## Ablage: Wo liegen die Memories?

Wie bei MyKahoot liegen die Memories in einem lokalen Ordner deiner Wahl;
das Repo ist nur die Veröffentlichungs-Kopie für die Website.

```bash
node publish.mjs --set-dir ~/Documents/Memories  # Ablage festlegen (einmalig);
                                                 # ein leerer Ordner wird mit den
                                                 # bisherigen Memories befüllt
node publish.mjs --dir                           # zeigt die aktuelle Ablage
node publish.mjs                                 # veröffentlichen: Ablage → Repo,
                                                 # Commit, Push, Pages deployt
node publish.mjs --set-dir ""                    # zurück auf Repo-Betrieb
```

Ohne Konfiguration gilt Repo-Betrieb: die Ablage ist `memories/` im Repo, und
Veröffentlichen ist einfach `node publish.mjs` (oder git commit + push von Hand).
Die Ordnerwahl liegt in `~/Library/Application Support/MyMemory/config.json`.

**Beachte:** Alles, was veröffentlicht wird, landet im öffentlichen GitHub-Repo
und ist über die Website für alle sichtbar. Was nicht öffentlich sein soll,
gehört nur in die lokale Ablage, nicht in ein Memory, das du veröffentlichst.

## Direktlinks

Auf der Übersicht kopiert der 🔗-Knopf den Direktlink eines Memorys, z.B.
`https://manuel-benz.github.io/MyMemory/?memory=Mathematik%2Fwurzeln` –
damit starten Schülerinnen und Schüler direkt im richtigen Spiel.

## Lokal testen

```bash
node build-index.mjs        # Index generieren
python3 -m http.server 8000 # dann http://localhost:8000 öffnen
```
