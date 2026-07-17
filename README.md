# MyMemory

Memory-Spiel für 2 Spieler mit eigenen Aufgabensets – für den Unterricht.
Komplett clientseitig (wie MyTafelfussball): kein Backend, keine Inhalte auf GitHub.

**Live:** https://manuel-benz.github.io/MyMemory/

## Memory erstellen

1. Auf der Website den **KI-Prompt kopieren** (Button) und zusammen mit dem
   Material (z.B. PDF) in ein KI-Tool wie Claude oder ChatGPT einfügen.
2. Die erhaltene `.txt`-Datei auf die Website **ziehen** (oder die
   Ablage-Fläche anklicken). Der Dateiname wird zum Titel.
3. Das Memory erscheint unter „Meine Memories" – gespeichert im Browser
   (`localStorage`), nirgendwo sonst.

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
- Kurz halten (max. ~40 Zeichen), damit es auf die Karte passt.
- Jede Rückseite darf nur zu genau einer Vorderseite passen.
- Das alte Markdown-Format (`# Titel`, `## Vorderseite` + Folgezeile) wird
  beim Import weiterhin verstanden.

Es werden immer **alle Paare** der Datei gespielt (Kacheln = 2 × Paare);
das Raster passt sich der Anzahl an.

## Teilen mit der Klasse

Neben jedem Memory:

- **🔗 Direktlink kopieren** – das komplette Memory steckt komprimiert im
  Link selbst (im `#`-Fragment, verlässt den Browser nicht Richtung Server).
  SuS klicken und spielen sofort, ohne Import.
- **📱 QR-Code anzeigen** – derselbe Link als QR-Code, z.B. für den Beamer.

Die Beispiele (Wurzeln, Hauptstädte Europas) sind fest in die App eingebaut.

## Technik

Eine einzelne [index.html](index.html): React, Tailwind, KaTeX und
qrcode-generator per CDN, kein Build-Schritt. GitHub Pages liefert direkt
vom main-Branch aus. Lokal testen: Datei im Browser öffnen geht nicht
(fetch/Clipboard), stattdessen `python3 -m http.server` und
`http://localhost:8000` öffnen.
