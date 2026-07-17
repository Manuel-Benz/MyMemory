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

Danach committen und pushen – der Pages-Workflow generiert den Index
(`memories/index.json`) automatisch und deployt die Seite.

## Direktlinks

Auf der Übersicht kopiert der 🔗-Knopf den Direktlink eines Memorys, z.B.
`https://manuel-benz.github.io/MyMemory/?memory=Mathematik%2Fwurzeln` –
damit starten Schülerinnen und Schüler direkt im richtigen Spiel.

## Lokal testen

```bash
node build-index.mjs        # Index generieren
python3 -m http.server 8000 # dann http://localhost:8000 öffnen
```
