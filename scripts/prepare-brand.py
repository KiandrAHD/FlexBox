"""Generate transparent branding from the original JPG; Pillow is tooling only."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root / 'logo_flexbox.jpg'
if not source.exists():
    source = root / 'flexbox/logo_flexbox.jpg'
image = Image.open(source).convert('RGBA')
pixels = image.load()
# Background is black. Preserve solid brand colors; soften only near-black JPEG edges.
for y in range(image.height):
    for x in range(image.width):
        r, g, b, _ = pixels[x, y]
        alpha = round(255 * min(1, max(0, (max(r, g, b) - 8) / 20)))
        pixels[x, y] = (r, g, b, alpha)
out = root / 'assets/logo'
out.mkdir(exist_ok=True, parents=True)
image.save(out / 'flexbox-mark.png', optimize=True)
for filename, size, inset, transparent in [
    ('icon.png', 1024, 160, False),
    ('adaptive-icon.png', 1024, 240, True),
    ('favicon.png', 64, 6, False),
    ('splash-icon.png', 512, 80, True),
]:
    canvas = Image.new('RGBA', (size, size), (247, 247, 243, 0 if transparent else 255))
    mark = image.copy()
    mark.thumbnail((size - inset * 2, size - inset * 2), Image.Resampling.LANCZOS)
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    canvas.save(root / 'assets' / filename, optimize=True)
