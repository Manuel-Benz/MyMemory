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
  Text in die Kachel passt (24–14 px, auf dem Handy 18–10 px).
- **KI-Prompt im MyKahoot-Stil**: Ausfüll-Block zuoberst (Thema/Material,
  Klasse, Anzahl Paare), darunter die Vorgaben; die KI liefert `.txt`-Datei
  *und* denselben Text zum Kopieren.

## Backlog

- **Memory mit Bildern** (17.07.2026 zurückgestellt):
  1. Bild-URLs: `F: https://.../bild.jpg` als Bild auf der Karte rendern —
     Links/QR bleiben kurz, ideal für bereits gehostete Bilder.
  2. Eigene Fotos per ZIP-Import (`bild:datei.jpg`-Referenzen, beim Import
     clientseitig verkleinern, im Browser speichern; Teilen per Datei statt
     Link/QR — dafür zu gross).
