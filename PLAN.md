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

## Backlog

- **Memory mit Bildern** (17.07.2026 zurückgestellt):
  1. Bild-URLs: `F: https://.../bild.jpg` als Bild auf der Karte rendern —
     Links/QR bleiben kurz, ideal für bereits gehostete Bilder.
  2. Eigene Fotos per ZIP-Import (`bild:datei.jpg`-Referenzen, beim Import
     clientseitig verkleinern, im Browser speichern; Teilen per Datei statt
     Link/QR — dafür zu gross).
