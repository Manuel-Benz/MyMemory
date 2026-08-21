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
  `.txt`-Datei *und* denselben Text zum Kopieren.
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
- **Spielernamen**: «Spieler 1/2» in der Kopfzeile ist anklickbar und wird zum
  Eingabefeld — vor dem ersten Zug oder mitten im Spiel; kein Startdialog davor,
  damit der Weg über Direktlink/QR ohne Hürde ins Spiel führt. Leer = wieder der
  Standardname, der so auch der Sprache folgt; max. 14 Zeichen wegen der
  Kopfzeile auf dem Handy. Die Namen leben nur in der Spielkomponente: «Nochmal
  spielen» behält sie, der Weg über die Übersicht räumt sie ab. Weder im Memory
  noch im Link.
- **Symbole** als einfache 2D-Strichzeichnungen (SVG) statt Emoji — die kamen je
  nach System als bunte 3D-Bildchen.

## Backlog

- **ZIP wieder einlesen**: der Import kennt nur `.txt`; ein aus dem Export
  gezogenes ZIP samt Ordnern zurückzuholen wäre das fehlende Gegenstück.

- **Memory mit Bildern** (17.07.2026 zurückgestellt):
  1. Bild-URLs: `F: https://.../bild.jpg` als Bild auf der Karte rendern —
     Links/QR bleiben kurz, ideal für bereits gehostete Bilder.
  2. Eigene Fotos per ZIP-Import (`bild:datei.jpg`-Referenzen, beim Import
     clientseitig verkleinern, im Browser speichern; Teilen per Datei statt
     Link/QR — dafür zu gross).
