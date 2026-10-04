# MyMemory — Roadmap

## Aktueller Stand

Fertig und live: clientseitige App (wie MyTafelfussball) mit Demos, Datei-Import
(F:/A:/---), KI-Prompt, Direktlinks mit Daten im URL-Fragment und QR-Codes.

Dazugekommen:

- **«Memory erstellen»** als ein ein-/ausklappbares Kästchen — Anleitung,
  KI-Prompt, Ablage-Fläche und ein Textfeld zum direkten Einfügen.
- **Editor** (`#edit=<id>` / `#new=<ordner>`): Titel, Ordner und Paare
  bearbeiten, hinzufügen, umsortieren, löschen — mit LaTeX-Vorschau.
- **Ordner** wie in MyKahoot: beliebig tief, anlegen/umbenennen/löschen (nur
  leer), Umhängen von Memories und Ordnern per Drag & Drop, Dateien direkt auf
  einen Ordner ziehbar. Gespeichert wird neu `{ memories, folders }`.
- **Ordner auf dem Computer** wie in MyVoci (Chrome/Edge): unter der Liste
  «Ordner wählen», danach liegen die Memories als `.txt` dort (Unterordner =
  Ordner), Änderungen im Finder kommen beim Fensterwechsel herein.
- **Spielfarben pro Spieler**: offene Karten mit Rand in der Farbe des Spielers
  am Zug, gefundene Paare behalten die Farbe dessen, der sie fand.
- **Umbruch**: erst ganze Wörter (Schrift kleiner), dann Silbentrennung, erst
  zuletzt mitten im Wort. Wörter ab 14 Buchstaben dürfen gleich getrennt
  werden, sonst zwängt ein einziges Kompositum das ganze Feld klein.
- **Spielfeld passt ins Fenster** (`useBoardLayout`): für jede Spaltenzahl die
  grösste Kachel, die Breite und Höhe erlauben; leere Plätze kosten etwas, die
  angebrochene Reihe steht mittig (flex-wrap). Unter 110 px Kachel wird
  gescrollt (Handy: 3 Spalten). Das Feld darf breiter sein als die Spalte.
  Schriftleiter neu bis 32 px für grosse Kacheln.
- **Anzeigetafel** im Spiel: «Spieler 1  2 : 1  Spieler 2» in einer Zeile.
- **Längere Einträge**: die Kartenschrift verkleinert sich stufenweise, bis der
  Text in die Kachel passt (24–14 px, auf dem Handy 18–10 px). Gemessen wird
  **einmal für alle Karten** in einer unsichtbaren Kopie einer Kachel: der
  längste Eintrag bestimmt die Stufe, damit alle Kacheln gleich beschriftet sind
  und die Schrift beim Aufdecken nicht springt. Einträge, die auf **keiner**
  Stufe passen (eine Formel bricht nicht um), reden bei der Stufenwahl nicht mit
  und bekommen allein eine kleinere Schrift — halbierend gesucht, nicht unter
  8 px. Passt kein einziger Eintrag, sind es keine Ausreisser: dann gilt für
  alle wieder die unterste Stufe.
- **KI-Prompt im MyKahoot-Stil**: Ausfüll-Block zuoberst (Thema/Material,
  Klasse, Anzahl Paare, Sprache), darunter die Vorgaben; die KI liefert
  `.txt`-Datei *und* denselben Text zum Kopieren. Der Dateiname beginnt mit
  `Memory_` (zum Wiederfinden im Download-Ordner); der Import streift genau
  dieses Präfix ab, aber nur mit Unterstrich — «Memory Vokabeln.txt» heisst
  wirklich so.
- **Export**: einzelnes Memory als `.txt` (mit `# Titel` zuoberst, damit der
  Titel den Weg zurück übersteht), alle zusammen als ZIP mit der Ordnerstruktur
  der App, leere Ordner inklusive. JSZip wird erst beim ersten Export vom CDN
  geholt — wer nur einem Link folgt, lädt es gar nicht.
- **Sprache DE/EN** wie in MyKahoot: Wörterbuch `I18N` + `t()`, im Browser
  gemerkt, umgeschaltet im Kästchen **Einstellungen** (oben rechts) — auf der
  Übersicht *und* im Spiel. Jeder Hash, den die App schreibt, trägt die Sprache
  am Ende (`&l=<de|en>`) — damit die Klasse in der geteilten Sprache landet und
  trotzdem umschalten kann; `withLang`/`routePart` sind die einzige Stelle, die
  das Format kennt. Den KI-Prompt gibt es in beiden Sprachen, die Sprache des
  Memorys steht im Ausfüll-Block. Übersetzt wird nur die Oberfläche, nie der
  Inhalt — auch die Beispiele bleiben deutsch.
- **Sprache pro Memory** (`memory.lang`, optional): im Editor wählbar, in der
  Liste als Kürzel sichtbar. `toHash`/`directLink` geben sie an `withLang`
  weiter, sonst gilt dort die eingestellte — der Rest läuft über den
  bestehenden `&l=`-Mechanismus, es gibt keinen zweiten Kanal daneben.
  Zurück auf der Übersicht gilt wieder die eigene Wahl: die steht schon in
  `LANG_KEY`, `restoreLang()` holt sie von dort statt sie ein zweites Mal zu
  merken — das hält auch ein Neuladen mitten im Spiel aus. `applyLang` ist die
  einzige Stelle, die die angezeigte Sprache wechselt.
  In der `.txt` steht die Sprache als Zeile `Sprache: en` bzw. `Language: en`
  (der KI-Prompt verlangt sie, `toFile` schreibt sie in der Sprache des
  Memorys, `langInFile` liest beide Schlüssel tolerant — auch «Englisch»,
  «German»); MyTafelfussball überliest die Zeile wie den Titel. Nicht in den
  Link-Daten, dort reicht `&l=`.
  **Re-Import** mit gleichem Titel überschreibt nur, was der Import wirklich
  mitbringt (`{ ...alt, ...neu }` über dieselbe `insertMemory`-Regel wie das
  Speichern): Sprache, Ordner und id des alten Stands bleiben stehen, wenn
  Datei bzw. Ablageort nichts anderes sagen — die id, damit ein `#local=<id>`
  nicht ins Leere zeigt. Ein Ordner zählt nur als Ansage, wenn die Datei
  wirklich dorthin gezogen wurde; der Hauptordner (`''`) ist dabei so gezielt
  wie jeder andere, «kein Ziel» ist `undefined`.
- **Spielernamen**: «Spieler 1/2» in der Kopfzeile ist anklickbar und wird zum
  Eingabefeld — vor dem ersten Zug oder mitten im Spiel; kein Startdialog davor,
  damit der Weg über Direktlink/QR ohne Hürde ins Spiel führt. Leer = wieder der
  Standardname, der so auch der Sprache folgt; max. 14 Zeichen wegen der
  Kopfzeile auf dem Handy. Die Namen leben nur in der Spielkomponente: «Nochmal
  spielen» behält sie, der Weg über die Übersicht räumt sie ab. Weder im Memory
  noch im Link.
- **Symbole** als einfache 2D-Strichzeichnungen (SVG) statt Emoji — die kamen je
  nach System als bunte 3D-Bildchen.

- [x] **My-Designsystem** (04.10.2026, Auftrag `~/MySuite/auftraege/03-MyMemory.md`):
  Tokens/Schemen aus `design/` (Kopie aus MySuite), Budapest/Aubergine, Hell und
  Dunkel, kompakte Liste mit Ordnern an der Linie, Knöpfe/Umschalter/Symbolknöpfe
  nach DESIGN.md, Spielfarben statt Rot/Blau, Elefant als Favicon/App-Icon und im
  Leerzustand. In den Einstellungen neu: Farbschema, Akzentfarbe, Hell/Dunkel/System.
  Ohne Kopfleiste (wie MyKahoot). Details und Abweichungen: `CLAUDE.md`.
- [x] **CLAUDE.md** angelegt.
- [x] **Markenzug wie MyKahoot** (04.10.2026): Elefant rechts vom Titel, ohne Kachel,
  als Maske in `currentColor` (`logo-elefant.svg` aus `tools/make-logo.py`).
- [x] **Einstellungen wie MyKahoot** (04.10.2026): mit genug Platz am rechten
  Fensterrand neben der (dafür schmaleren) Spalte, sonst über den Inhalt; zu per Knopf,
  Klick daneben, Esc. Regel steht in MySuite `DESIGN.md`.
- [x] **Rand oben** (04.10.2026): Hell 8-Bit-Pixel, Dunkel farbiges Neuronen-Netz —
  dicht am oberen Rand, nach unten ausdünnend, Farben aus dem Schema.
- [x] **Beispiele ausblenden** (04.10.2026): Auge-Knopf, zurück über die Einstellungen.

## Backlog

- **Erzwungenes Hell/Dunkel** (MySuite): `my-schemen.css` wählt Akzent und Töne nur
  per `prefers-color-scheme` — wer «Hell» auf einem dunklen Mac erzwingt, bekommt den
  Dunkel-Akzent (Aubergine #A17BBC, weisse Schrift darauf nur 3.5:1). Lösung gehört
  nach MySuite (Schemen auch an `data-modus` hängen), nicht hierher.
- **Layout ansprechender** (Skizzen 04.10.2026, noch nicht gewählt; 1 Tapete ist als
  «Rand oben» umgesetzt): 2 Spieltisch aus Filz mit gemustertem Kartenrücken,
  3 Wendeanimation in 3D + Paar fliegt zum Spieler, 4 gefundene Paare als gefächerter
  Stapel pro Spieler, 5 Elefant als Maskottchen (zeigt, wer am Zug ist, reagiert auf Paare).

- **Zissou + eigener Ton** (MySuite): `[data-schema="zissou"]` setzt `--akzent-ink`
  immer dunkel, auch wenn ein dunkler Ton (Tiefsee, Rost …) der Akzent ist.

- **ZIP wieder einlesen**: der Import kennt nur `.txt`; ein aus dem Export
  gezogenes ZIP samt Ordnern zurückzuholen wäre das fehlende Gegenstück.

- **Memory mit Bildern** (17.07.2026 zurückgestellt):
  1. Bild-URLs: `F: https://.../bild.jpg` als Bild auf der Karte rendern —
     Links/QR bleiben kurz, ideal für bereits gehostete Bilder.
  2. Eigene Fotos per ZIP-Import (`bild:datei.jpg`-Referenzen, beim Import
     clientseitig verkleinern, im Browser speichern; Teilen per Datei statt
     Link/QR — dafür zu gross).
