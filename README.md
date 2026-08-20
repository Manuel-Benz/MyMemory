# MyMemory

Memory-Spiel für 2 Spieler mit eigenen Aufgabensets – für den Unterricht.
Komplett clientseitig (wie MyTafelfussball): kein Backend, keine Inhalte auf GitHub.

**Live:** https://manuel-benz.github.io/MyMemory/

Die Oberfläche gibt es auf **Deutsch und Englisch**: Schieberegler-Symbol oben
rechts → „Einstellungen" → Sprache. Der Browser merkt sich die Wahl, der
KI-Prompt wechselt mit. Übersetzt wird nur die Oberfläche — Memories, Titel und
die Beispiele bleiben, wie sie sind.

## Memory erstellen

Alles steckt im aufklappbaren Kästchen **„Memory erstellen"**:

1. Den **KI-Prompt kopieren** (Button) und in ein KI-Tool wie Claude oder
   ChatGPT einfügen. Dort **den Block zuoberst ausfüllen** (Thema oder Material,
   Klasse, Anzahl Paare, **Sprache des Memorys**); Material wie ein PDF einfach
   anhängen.
2. Die KI liefert eine `.txt`-Datei **und** denselben Text zum Kopieren. Datei
   auf die Website **ziehen** (oder die Ablage-Fläche anklicken) — der Dateiname
   wird zum Titel. Oder den Text ins Feld **„oder Text einfügen"** kopieren und
   einen Titel eintippen.
3. Das Memory erscheint unter „Meine Memories" – gespeichert im Browser
   (`localStorage`), nirgendwo sonst.

Von Hand geht es auch: das **+** neben „Meine Memories" öffnet den Editor.

Format (identisch mit MyTafelfussball – dieselbe Datei funktioniert in beiden Apps):

```
F: Was ist die Hauptstadt der Schweiz?
A: Bern
---
F: $\sqrt{169}$
A: $13$
---
```

- `F:` Vorderseite, `A:` Rückseite, `---` als Trenner (`Q:` statt `F:` geht auch).
- Steht eine Zeile `# Titel` in der Datei, wird sie zum Titel; sonst zählt der
  Dateiname.
- LaTeX in `$...$` wird mit KaTeX gerendert, mischbar mit Text.
- Kurz halten (Richtwert ~40 Zeichen): **Alle Kacheln tragen dieselbe
  Schriftgrösse** — der längste Eintrag bestimmt die Stufe für das ganze
  Spielfeld (24 → 22 → 20 → 18 → 16 → 14 px, auf dem Handy 18 → 10 px). Ein
  einziger langer Eintrag macht die Schrift also überall kleiner; sehr Langes
  bleibt auf der untersten Stufe trotzdem eng.
- Jede Rückseite darf nur zu genau einer Vorderseite passen.
- Das alte Markdown-Format (`# Titel`, `## Vorderseite` + Folgezeile) wird
  beim Import weiterhin verstanden.

Es werden immer **alle Paare** der Datei gespielt (Kacheln = 2 × Paare);
das Raster passt sich der Anzahl an.

## Bearbeiten und ordnen

- Der **Stift** neben einem eigenen Memory öffnet den **Editor**: Titel, Ordner
  und alle Paare ändern, Paare hinzufügen, verschieben (↑ ↓) oder löschen. LaTeX
  wird direkt unter dem Feld als Vorschau gerendert.
- **Ordner** wie in MyKahoot: das **Ordner-Symbol** legt einen an (auch
  Unterordner, beliebig tief), der **Stift** benennt um, der **Papierkorb**
  löscht ihn – nur wenn er leer ist.
- **Umhängen per Ziehen**: Memories und ganze Ordner lassen sich in einen
  anderen Ordner oder zurück in die Liste (= Hauptordner) ziehen. Eine `.txt`
  direkt auf einen Ordner gezogen wird gleich dort importiert.
- Welche Ordner offen sind, merkt sich der Browser.

## Exportieren

- Der **Pfeil nach unten** neben einem Memory lädt es als `.txt` herunter —
  genau das Format, das der Import und MyTafelfussball verstehen. Der Titel
  steht als `# Titel` zuoberst in der Datei, damit er den Weg zurück unverändert
  übersteht (MyTafelfussball überliest die Zeile).
- Derselbe Pfeil neben „Meine Memories" packt **alle** eigenen Memories in ein ZIP; die
  Ordner der App werden zu Ordnern im ZIP, leere Ordner kommen mit.

## Teilen mit der Klasse

Neben jedem Memory:

- **Direktlink kopieren** (Kettensymbol) – das komplette Memory steckt komprimiert im
  Link selbst (im `#`-Fragment, verlässt den Browser nicht Richtung Server).
  SuS klicken und spielen sofort, ohne Import.
- **QR-Code anzeigen** (QR-Symbol) – derselbe Link als QR-Code, z.B. für den Beamer.

Die Beispiele (Wurzeln, Hauptstädte Europas) sind fest in die App eingebaut.
Ordner sind reine Browser-Ordnung und stecken **nicht** im Link — geteilt wird
immer das einzelne Memory.

## Technik

Eine einzelne [index.html](index.html): React, Tailwind, KaTeX und
qrcode-generator per CDN, kein Build-Schritt; JSZip kommt erst dazu, wenn
jemand alle Memories exportiert.
GitHub Pages liefert direkt vom main-Branch aus. Lokal testen: Datei im Browser
öffnen geht nicht (fetch/Clipboard), stattdessen `python3 -m http.server` und
`http://localhost:8000` öffnen.
