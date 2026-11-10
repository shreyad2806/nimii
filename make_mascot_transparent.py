from PIL import Image
import numpy as np

def make_transparent_edges(img_path, out_path, bg_tolerance=30):
    img = Image.open(img_path).convert("RGBA")
    data = np.array(img)
    h, w, _ = data.shape

    # Sample edge background colors from top-left, top-right
    top_left = data[0, 0, :3].astype(float)
    top_right = data[0, w-1, :3].astype(float)

    # Calculate distance to background color
    dist_tl = np.linalg.norm(data[:, :, :3] - top_left, axis=2)
    dist_tr = np.linalg.norm(data[:, :, :3] - top_right, axis=2)
    min_dist = np.minimum(dist_tl, dist_tr)

    # Soft alpha feathering
    alpha = np.clip((min_dist - bg_tolerance) / 25.0 * 255.0, 0, 255).astype(np.uint8)
    
    # Don't touch the center body of the kitten
    center_y, center_x = h // 2, w // 2
    # Only feather outer regions
    y_indices, x_indices = np.ogrid[:h, :w]
    # Keep the kitten opaque if it has strong dark lines or kitten fur
    is_kitten = (data[:, :, 0] < 190) | (data[:, :, 1] < 190) | (data[:, :, 2] < 190)
    alpha[is_kitten] = 255

    data[:, :, 3] = np.maximum(alpha, np.where(is_kitten, 255, alpha))
    result = Image.fromarray(data, "RGBA")
    result.save(out_path)
    print(f"Processed {img_path} -> {out_path}")

mascot_list = [
    ('public/images/mascot/kitten-yarn.png', 'public/images/mascot/kitten-yarn.png'),
    ('public/images/mascot/kitten-cloud.png', 'public/images/mascot/kitten-cloud.png'),
    ('public/images/mascot/kitten-checklist.png', 'public/images/mascot/kitten-checklist.png'),
    ('public/images/mascot/kitten-laptop.png', 'public/images/mascot/kitten-laptop.png'),
    ('public/images/mascot/kitten-banner-loops.png', 'public/images/mascot/kitten-banner-loops.png'),
    ('public/images/mascot/kitten-banner-memory.png', 'public/images/mascot/kitten-banner-memory.png'),
    ('public/images/mascot/kitten-sleeping.png', 'public/images/mascot/kitten-sleeping.png'),
    ('public/images/mascot/kitten-celebrating.png', 'public/images/mascot/kitten-celebrating.png'),
    ('public/images/mascot/kitten-sleepy.png', 'public/images/mascot/kitten-sleepy.png'),
]

for in_p, out_p in mascot_list:
    make_transparent_edges(in_p, out_p)
