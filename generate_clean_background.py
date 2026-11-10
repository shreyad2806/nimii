import os
from PIL import Image, ImageFilter, ImageDraw
import numpy as np

os.makedirs('public/images/backgrounds', exist_ok=True)

# Create a high-res 1920x1080 dreamy scenic anime background
w, h = 1920, 1080
base = Image.new('RGB', (w, h))

# Linear gradient from soft sky blue (#DBEAFE) to lavender (#EDE9FE) to soft blush peach (#FED7AA)
for y in range(h):
    t = y / h
    # top: (218, 233, 254) -> mid: (237, 231, 253) -> bottom: (254, 235, 226)
    if t < 0.5:
        sub_t = t / 0.5
        r = int(218 * (1 - sub_t) + 237 * sub_t)
        g = int(233 * (1 - sub_t) + 231 * sub_t)
        b = int(254 * (1 - sub_t) + 253 * sub_t)
    else:
        sub_t = (t - 0.5) / 0.5
        r = int(237 * (1 - sub_t) + 254 * sub_t)
        g = int(231 * (1 - sub_t) + 235 * sub_t)
        b = int(253 * (1 - sub_t) + 226 * sub_t)
    for x in range(w):
        base.putpixel((x, y), (r, g, b))

# Let's paint soft dreamy clouds and mountains
draw = ImageDraw.Draw(base, 'RGBA')

# Distant soft mountains (lavender-purple: 200, 195, 235, 120)
mountain_pts = [
    (0, 750),
    (300, 680),
    (650, 720),
    (1100, 640),
    (1550, 700),
    (1920, 660),
    (1920, 1080),
    (0, 1080)
]
draw.polygon(mountain_pts, fill=(205, 200, 240, 110))

# Closer rolling hills (soft peach-lavender: 245, 225, 230, 140)
hill_pts = [
    (0, 850),
    (400, 800),
    (900, 860),
    (1400, 790),
    (1920, 830),
    (1920, 1080),
    (0, 1080)
]
draw.polygon(hill_pts, fill=(245, 225, 232, 140))

# Smooth with subtle Gaussian blur for anime landscape feel
base = base.filter(ImageFilter.GaussianBlur(radius=8))

# Save pristine clean background
base.save('public/images/backgrounds/bg-dreamy.png')
print("Pristine dreamy background created successfully!")
