from PIL import Image
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# 1. Chat page: peeking kitten (full crop including whiskers and paws)
im_chat = Image.open(ROOT / 'public/images/design-reference/chatPage.png')
# Full peeking kitten is around x: 1040 to 1240, y: 760 to 895
crop_peek = im_chat.crop((1040, 765, 1240, 895))
crop_peek.save(ROOT / 'public/images/mascot/kitten-chat-peek.png')

# 2. Login page: kitten on cloud
# In loginPage.png, let's crop the kitten on the lavender cloud cleanly
im_login = Image.open(ROOT / 'public/images/design-reference/loginPage.png')
crop_cloud = im_login.crop((120, 450, 680, 840))
crop_cloud.save(ROOT / 'public/images/mascot/kitten-cloud.png')

# 3. Sidebar sleepy kitten: clean crop
im_home = Image.open(ROOT / 'public/images/design-reference/homePage.png')
crop_sleepy = im_home.crop((50, 685, 180, 760))
crop_sleepy.save(ROOT / 'public/images/mascot/kitten-sleepy.png')

# Function to feather/remove rectangular edge
def remove_box_background(image_path, out_path, bg_color=(220, 235, 255), tolerance=40):
    img = Image.open(image_path).convert("RGBA")
    arr = np.array(img, dtype=float)
    h, w, _ = arr.shape

    # Find pixels matching the sky background
    # Top edge average
    top_sky = np.mean(arr[0:5, :, :3], axis=(0, 1))
    dist = np.linalg.norm(arr[:, :, :3] - top_sky, axis=2)

    # Fur and outlines have lower brightness or saturation differences
    # Smooth alpha mask
    alpha = np.clip((dist - 15) / 20.0 * 255.0, 0, 255)

    # Protect dark lines and kitten body (anything not pure sky)
    is_solid = (arr[:, :, 0] < 200) | (arr[:, :, 1] < 200) | (arr[:, :, 2] < 220)
    alpha[is_solid] = 255

    # Keep bottom opaque for ground/shadow
    alpha[-10:, :] = 255

    arr[:, :, 3] = alpha
    res = Image.fromarray(arr.astype(np.uint8), "RGBA")
    res.save(out_path)

remove_box_background(ROOT / 'public/images/mascot/kitten-yarn.png', ROOT / 'public/images/mascot/kitten-yarn.png')
remove_box_background(ROOT / 'public/images/mascot/kitten-banner-memory.png', ROOT / 'public/images/mascot/kitten-banner-memory.png')
remove_box_background(ROOT / 'public/images/mascot/kitten-banner-loops.png', ROOT / 'public/images/mascot/kitten-banner-loops.png')
remove_box_background(ROOT / 'public/images/mascot/kitten-sleeping.png', ROOT / 'public/images/mascot/kitten-sleeping.png')
remove_box_background(ROOT / 'public/images/mascot/kitten-chat-peek.png', ROOT / 'public/images/mascot/kitten-chat-peek.png')

print("Refined crops and transparency applied successfully!")
