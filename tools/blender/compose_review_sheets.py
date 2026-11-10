"""Compose before/after comparison sheets from the review renders (needs Pillow).
python3 tools/blender/compose_review_sheets.py docs/phase-2/evidence/renders
Top row: before. Bottom row: after. Same camera per column.
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(sys.argv[1])
SHEETS = {
    "comparison-geometry": [("front", "Frontal"), ("three-quarter", "Tres cuartos")],
    "comparison-eyelids": [("neutral", "Abierto"), ("blink-half", "Medio"), ("blink-closed", "Cerrado")],
    "comparison-mouth": [("neutral", "Neutral"), ("smile", "Sonrisa"), ("open", "Abierta")],
}
CELL, PAD, HEAD = 520, 12, 44
try:
    font = ImageFont.truetype("DejaVuSans-Bold.ttf", 22)
except OSError:
    font = ImageFont.load_default()

for name, columns in SHEETS.items():
    width = PAD + len(columns) * (CELL + PAD)
    height = PAD + 2 * (HEAD + CELL + PAD)
    sheet = Image.new("RGB", (width, height), (18, 20, 28))
    draw = ImageDraw.Draw(sheet)
    for row, (folder, label) in enumerate((("before", "ANTES"), ("after", "DESPUÉS"))):
        top = PAD + row * (HEAD + CELL + PAD)
        for column, (stem, title) in enumerate(columns):
            left = PAD + column * (CELL + PAD)
            image = Image.open(root / folder / (stem + ".png")).convert("RGB").resize((CELL, CELL), Image.LANCZOS)
            draw.text((left + 4, top + 8), label + " · " + title, fill=(235, 238, 250), font=font)
            sheet.paste(image, (left, top + HEAD))
    sheet.save(root / (name + ".jpg"), quality=88)
    print("wrote", root / (name + ".jpg"))
