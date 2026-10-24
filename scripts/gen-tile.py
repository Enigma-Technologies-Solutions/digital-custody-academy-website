#!/usr/bin/env python3
"""Generate the DCA tile from Poppins 700 outlines (styleguide v2.0, section 02).

Same construction as the ETS product tiles (see sanctum/scripts/gen-monogram.py):
Academy Navy square, Custody Blue frame inset, white letters, and a Custody
Blue square on the baseline after the last letter.

Writes public/dca-tile.svg. Render the PNGs from it (see README).

Usage: python3 scripts/gen-tile.py path/to/Poppins-700.woff2
Requires: pip install fonttools brotli
"""
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
NAVY, BLUE, WHITE = "#1B3A6B", "#5B8FD9", "#FFFFFF"
TRACKING = -20          # font units between letters
DOT, DOT_GAP = 150, 70  # blue terminal square and its gap, font units


def glyphs(font_path: str, text: str):
    font = TTFont(font_path)
    gs, cmap = font.getGlyphSet(), font.getBestCmap()
    x, parts, box = 0, [], [1e9, 1e9, -1e9, -1e9]
    for ch in text:
        g = gs[cmap[ord(ch)]]
        pen, bp = SVGPathPen(gs), BoundsPen(gs)
        g.draw(pen)
        g.draw(bp)
        b = bp.bounds
        parts.append((x, pen.getCommands()))
        box = [min(box[0], x + b[0]), min(box[1], b[1]), max(box[2], x + b[2]), max(box[3], b[3])]
        x += g.width + TRACKING
    return parts, box


def tile(font_path, size, frame_inset, frame_w, letter_frac, text="DCA"):
    parts, (xmin, ymin, xmax, ymax) = glyphs(font_path, text)
    w_units = (xmax - xmin) + DOT_GAP + DOT
    s = letter_frac * size / w_units
    tx = (size - w_units * s) / 2 - xmin * s
    baseline = (size + (ymax - ymin) * s) / 2 + ymin * s
    fi = frame_inset + frame_w / 2
    inner = size - 2 * frame_inset - frame_w
    out = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">',
        "  <title>Digital Custody Academy</title>",
        f'  <rect width="{size}" height="{size}" fill="{NAVY}"/>',
        f'  <rect x="{fi:.2f}" y="{fi:.2f}" width="{inner:.2f}" height="{inner:.2f}" fill="none" stroke="{BLUE}" stroke-width="{frame_w}"/>',
        f'  <g fill="{WHITE}" transform="translate({tx:.2f} {baseline:.2f}) scale({s:.5f} {-s:.5f})">',
    ]
    out += [f'    <path transform="translate({x} 0)" d="{d}"/>' for x, d in parts]
    dx = tx + (xmax + DOT_GAP) * s
    out += [
        "  </g>",
        f'  <rect x="{dx:.2f}" y="{baseline - DOT * s:.2f}" width="{DOT * s:.2f}" height="{DOT * s:.2f}" fill="{BLUE}"/>',
        "</svg>",
    ]
    return "\n".join(out) + "\n"


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    (ROOT / "public/dca-tile.svg").write_text(tile(sys.argv[1], 64, 5, 3, 0.66))
    print("wrote", ROOT / "public/dca-tile.svg")
