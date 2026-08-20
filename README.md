# MyMemory

Memory-Spiel für 2 Spieler mit eigenen Aufgabensets – für den Unterricht.
Komplett clientseitig (wie MyTafelfussball): kein Backend, keine Inhalte auf GitHub.

**Live:** https://manuel-benz.github.io/MyMemory/

## Memory erstellen

Alles steckt im aufklappbaren Kästchen **„Memory erstellen"**:

1. Den **KI-Prompt kopieren** (Button) und in ein KI-Tool wie Claude oder
   ChatGPT einfügen. Dort **den Block zuoberst ausfüllen** (Thema oder Material,
   Klasse, Anzahl Paare); Material wie ein PDF einfach anhängen.
2. Die KI liefert eine `.txt`-Datei **und** denselben Text zum Kopieren. Datei
   auf die Website **ziehen** (oder die Ablage-Fläche anklicken) — der Dateiname
   wird zum Titel. Oder den Text ins Feld **„oder Text einfügen"** kopieren und
   einen Titel eintippen.
3. Das Memory erscheint unter „Meine Memories" – gespeichert im Browser
   (`localStorage`), nirgendwo sonst.

Von Hand geht es auch: **➕** neben „Meine Memories" öffnet den Editor.

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
- LaTeX in `$...$` wird mit KaTeX gerendert, mischbar mit Text.
- Kurz halten (Richtwert ~40 Zeichen): Längeres wird auf der Karte automatisch
  kleiner gesetzt (24 → 22 → 20 → 18 → 16 → 14 px, auf dem Handy 18 → 10 px),
  sehr Langes bleibt trotzdem eng.
- Jede Rückseite darf nur zu genau einer Vorderseite passen.
- Das alte Markdown-Format (`# Titel`, `## Vorderseite` + Folgezeile) wird
  beim Import weiterhin verstanden.

Es werden immer **alle Paare** der Datei gespielt (Kacheln = 2 × Paare);
das Raster passt sich der Anzahl an.

## Bearbeiten und ordnen

- **✎** neben einem eigenen Memory öffnet den **Editor**: Titel, Ordner und
  alle Paare ändern, Paare hinzufügen, verschieben (↑ ↓) oder löschen. LaTeX
  wird direkt unter dem Feld als Vorschau gerendert.
- **Ordner** wie in MyKahoot: **📁** legt einen an (auch Unterordner, beliebig
  tief), **✎** benennt um, **🗑️** löscht ihn – nur wenn er leer ist.
- **Umhängen per Ziehen**: Memories und ganze Ordner lassen sich in einen
  anderen Ordner oder zurück in die Liste (= Hauptordner) ziehen. Eine `.txt`
  direkt auf einen Ordner gezogen wird gleich dort importiert.
- Welche Ordner offen sind, merkt sich der Browser.

## Teilen mit der Klasse

Neben jedem Memory:

- **🔗 Direktlink kopieren** – das komplette Memory steckt komprimiert im
  Link selbst (im `#`-Fragment, verlässt den Browser nicht Richtung Server).
  SuS klicken und spielen sofort, ohne Import.
- **📱 QR-Code anzeigen** – derselbe Link als QR-Code, z.B. für den Beamer.

Die Beispiele (Wurzeln, Hauptstädte Europas) sind fest in die App eingebaut.
Ordner sind reine Browser-Ordnung und stecken **nicht** im Link — geteilt wird
immer das einzelne Memory.

## Technik

Eine einzelne [index.html](index.html): React, Tailwind, KaTeX und
qrcode-generator per CDN, kein Build-Schritt. GitHub Pages liefert direkt
vom main-Branch aus. Lokal testen: Datei im Browser öffnen geht nicht
(fetch/Clipboard), stattdessen `python3 -m http.server` und
`http://localhost:8000` öffnen.
