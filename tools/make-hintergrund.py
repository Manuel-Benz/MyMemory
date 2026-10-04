#!/usr/bin/env python3
"""Erzeugt die Ränder, die oben dicht beginnen und nach unten ausdünnen (wie Dschungel
und Blut in MyKahoot): hintergrund/neuro-N.svg (Dunkel: Neuronen-Netz) und
hintergrund/pixel-N.svg (Hell: 8-Bit-Blöcke, die nach unten zerbröseln).

Jede Datei ist eine Farbschicht und dient als CSS-Maske (.rand in index.html):
eingefärbt wird mit Tokens des Schemas (--akzent, --rad-N), damit der Rand jedes
Farbschema mitmacht. Darum enthält eine Datei nur Alpha, keine Farbe.
Kachelbreite 1200 px, nahtlos in x (Kanten werden um ±1200 gespiegelt gezeichnet).

    python3 tools/make-hintergrund.py   # schreibt Masse + Version selbst nach index.html
"""
import hashlib
import math
import re
import random
from pathlib import Path

W = 1200
HOEHE = {'neuro': 460, 'pixel': 300}  # Kachelhöhe je Satz
out = Path(__file__).resolve().parent.parent / 'hintergrund'
out.mkdir(exist_ok=True)


def save(name, h, body, defs=''):
    (out / name).write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{h}" viewBox="0 0 {W} {h}">'
        f'<defs>{defs}</defs>{body}</svg>')


def merged(items):
    """Linien gleicher Strichstärke und Deckkraft als EIN Pfad: weniger Elemente,
    die der Browser für die Maske einzeln rastern muss."""
    groups = {}
    for key, d in items: groups.setdefault(key, []).append(d)
    return [f'<path d="{"".join(ds)}" stroke="#000" stroke-width="{sw}" fill="none" opacity="{a}"/>'
            for (sw, a), ds in groups.items()]


def shifts(x_min, x_max, margin=4):
    """Versätze, unter denen ein Element sichtbar ist: 0 und, wenn es über eine Kante
    ragt, die Kopie auf der anderen Seite. Alles dreifach zu zeichnen kostete das
    Dreifache an Datei und Malzeit für Kopien, die ganz ausserhalb liegen."""
    out = [0]
    if x_min < margin: out.append(W)
    if x_max > W - margin: out.append(-W)
    return out


def wrapped(x, margin):
    """x und, falls nahe am Rand, die Kopie auf der anderen Seite (nahtlos in x)."""
    return [x + dx for dx in shifts(x, x, margin)]


# ---------- Neuronen (Dunkel) ----------
# Schicht 0 = feine Fasern in --akzent, 1..6 = Zellen samt eigenen Ausläufern in den
# Rad-Farben. Dichte und Deckkraft nehmen mit der Höhe ab; dazu hängen einzelne lange
# Axone wie Lianen herab, damit der Rand nach unten ausfranst statt abzubrechen.
def neuro():
    H = HOEHE['neuro']
    rnd = random.Random(11)
    layers = 7
    parts = [[] for _ in range(layers)]
    lines = [[] for _ in range(layers)]  # ((Strich, Deckkraft), d) → merged()
    fade = lambda y: max(0.0, 1 - y / (H - 20)) ** 1.3

    nodes = []
    for _ in range(330):
        y = rnd.random() ** 2.4 * (H - 60)
        nodes.append((rnd.random() * W, y, 1 + rnd.randrange(layers - 1), rnd.random()))

    def path_d(x1, y1, x2, y2, bend):
        mx, my = (x1 + x2) / 2 + bend * (y2 - y1), (y1 + y2) / 2 - bend * (x2 - x1)
        return f'M{x1:.1f} {y1:.1f}Q{mx:.1f} {my:.1f} {x2:.1f} {y2:.1f}'

    # Verbindungen: jede Zelle zu ihren 3 nächsten Nachbarn (zyklisch in x)
    for i, (x, y, c, _) in enumerate(nodes):
        near = sorted(
            ((min(abs(x - u), W - abs(x - u)) ** 2 + (y - v) ** 2, j) for j, (u, v, _, _) in enumerate(nodes) if j != i)
        )[:3]
        for d2, j in near:
            d = math.sqrt(d2)
            if d > 110 or j < i: continue
            u, v = nodes[j][0], nodes[j][1]
            if abs(x - u) > W / 2: u += W if u < x else -W
            a = 0.85 * fade(max(y, v))
            if a < 0.03: continue
            bend = rnd.uniform(-0.25, 0.25)
            layer = c if rnd.random() < 0.55 else 0          # farbig oder feine Faser
            sw = 1.4 if layer else 0.9
            for dx in shifts(min(x, u) - 30, max(x, u) + 30):  # ±30: Bogen der Kurve
                lines[layer].append(((sw, f'{a:.2f}'), path_d(x + dx, y, u + dx, v, bend)))
            # Impuls unterwegs: ein Punkt auf einem Teil der Verbindungen
            if rnd.random() < 0.3:
                t = rnd.random()
                px, py = x + (u - x) * t, y + (v - y) * t
                for qx in wrapped(px, 6):
                    parts[c].append(f'<circle cx="{qx:.1f}" cy="{py:.1f}" r="1.8" fill="#000" opacity="{a:.2f}"/>')

    # Axone wie Lianen: von oben ein leicht pendelnder Faden, Seitenäste, Endknopf
    for _ in range(26):
        x, y = rnd.random() * W, rnd.random() * 40
        c = 1 + rnd.randrange(layers - 1)
        length = 140 + rnd.random() ** 1.5 * 280
        pts = [(x, y)]
        while y < length:
            y += 14
            x += rnd.uniform(-6, 6)
            pts.append((x, y))
            if rnd.random() < 0.18:  # Seitenast (Dendrit)
                bx, by = x + rnd.choice((-1, 1)) * rnd.uniform(14, 30), y + rnd.uniform(6, 20)
                for dx in shifts(min(x, bx), max(x, bx)):
                    lines[c].append(((1, f'{0.8 * fade(by):.2f}'), f'M{x + dx:.1f} {y:.1f}L{bx + dx:.1f} {by:.1f}'))
        xs = [px for px, _ in pts]
        for dx in shifts(min(xs), max(xs)):
            d = 'M' + 'L'.join(f'{px + dx:.1f} {py:.1f}' for px, py in pts)
            lines[c].append(((1.3, f'{0.75 * fade(length / 2):.2f}'), d))
        ex, ey = pts[-1]
        nodes.append((ex, ey, c, 0.9))

    # Zellen: Hof + Kern, gross oben, klein unten. Der Hof ist ein radialer Verlauf
    # statt eines Weichzeichners (feGaussianBlur): sieht gleich aus, aber der Browser
    # muss nicht für jede der Hunderte Zellen ein eigenes Filterbild rechnen — das
    # machte das Laden im Dunkelmodus zäh.
    for x, y, c, s in nodes:
        f = fade(y)
        if f < 0.04: continue
        r = (1.6 + s * 3.2) * (0.5 + 0.5 * f)
        for qx in wrapped(x, 4 * r + 8):
            parts[c].append(f'<circle cx="{qx:.1f}" cy="{y:.1f}" r="{r * 3.2 + 8:.1f}" fill="url(#hof)" opacity="{0.28 * f:.2f}"/>')
            parts[c].append(f'<circle cx="{qx:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="#000" opacity="{min(1, 0.4 + f):.2f}"/>')

    defs = ('<radialGradient id="hof"><stop offset="0" stop-opacity=".75"/><stop offset=".45" stop-opacity=".5"/>'
            '<stop offset="1" stop-opacity="0"/></radialGradient>')
    for i, p in enumerate(parts):
        save(f'neuro-{i}.svg', H, ''.join(merged(lines[i]) + p), defs)


# ---------- Pixel (Hell) ----------
# Raster 16 px. Oben zwei volle Reihen, darunter fällt die Wahrscheinlichkeit; einzelne
# Spalten «tropfen» weiter hinab. Schicht 0 = --akzent (der Grossteil), 1..3 = Rad-Farben.
def pixel():
    H, Q = HOEHE['pixel'], 16
    rnd = random.Random(5)
    parts = [[] for _ in range(4)]
    drip = {cx: rnd.random() ** 3 * 0.6 for cx in range(W // Q)}  # Zusatztiefe je Spalte
    for cy in range(H // Q):
        for cx in range(W // Q):
            t = cy * Q / H
            if cy < 2:
                p = 1.0
            else:
                streuung = (1 - t) ** 3.0
                tropfen = 1 - max(0, t - drip[cx]) * 4 if t < drip[cx] + 0.25 else 0  # Spalte bleibt bis drip[cx] voll
                p = max(streuung, tropfen) * 0.92
            if rnd.random() >= p: continue
            layer = 0 if rnd.random() < 0.58 else 1 + rnd.randrange(3)
            a = 1.0 if cy < 2 else 0.3 + 0.6 * (1 - t) * rnd.uniform(0.6, 1)
            parts[layer].append(f'<rect x="{cx * Q}" y="{cy * Q}" width="{Q - 1}" height="{Q - 1}" fill="#000" opacity="{a:.2f}"/>')
    for i, p in enumerate(parts):
        save(f'pixel-{i}.svg', H, ''.join(p))


neuro()
pixel()

# Masse und Version gehen von hier direkt in index.html (zwischen den Marken «rand-daten»),
# damit dort nichts von Hand nachzuziehen ist; V ändert sich mit dem Inhalt der Dateien.
V = hashlib.md5(b''.join(f.read_bytes() for f in sorted(out.glob('*.svg')))).hexdigest()[:8]
html = out.parent / 'index.html'
daten = f"const V = '{V}', W = {W}, H = {HOEHE};"
neu, n = re.subn(r'(// <rand-daten>\n\s*).*?(\n\s*// </rand-daten>)', lambda m: m[1] + daten + m[2],
                 html.read_text(encoding='utf-8'), flags=re.S)
assert n == 1, 'Marken «rand-daten» in index.html nicht gefunden'
html.write_text(neu, encoding='utf-8')
for f in sorted(out.iterdir()):
    print(f'{f.name}: {f.stat().st_size // 1024} KB')
