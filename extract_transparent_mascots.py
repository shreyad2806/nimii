import os
from PIL import Image, ImageFilter
import numpy as np

os.makedirs('public/images/mascot', exist_ok=True)

def isolate_mascot_with_floodfill(img_path, out_path, bg_point=(0, 0), tolerance=35):
    img = Image.open(img_path).convert("RGBA")
    arr = np.array(img)
    h, w, _ = arr.shape
    
    # Let's find background pixels connected to the borders
    from collections import deque
    visited = np.zeros((h, w), dtype=bool)
    is_bg = np.zeros((h, w), dtype=bool)
    
    # Sample background color from multiple edge points
    sample_points = [(0, 0), (0, w//2), (0, w-1), (h//4, 0), (h//4, w-1)]
    bg_colors = [arr[y, x, :3].astype(float) for y, x in sample_points if x < w and y < h]
    
    # Queue for BFS from image borders
    queue = deque()
    # Add top border, left border, right border
    for x in range(w):
        queue.append((0, x))
        visited[0, x] = True
    for y in range(h):
        queue.append((y, 0))
        queue.append((y, w-1))
        visited[y, 0] = True
        visited[y, w-1] = True
        
    while queue:
        cy, cx = queue.popleft()
        
        # Check if color is close to any background sample
        pixel = arr[cy, cx, :3].astype(float)
        # Check if it looks like background (light pastel blue/lavender/peach, high brightness, low edge)
        # Character dark lines or fur have distinct color / darkness
        is_character = (pixel[0] < 185 and pixel[1] < 185) or (pixel[0] < 150) or (pixel[2] < 150 and pixel[0] > 180) # yarn or fur shadow
        
        # Distance to closest bg color
        min_d = min(np.linalg.norm(pixel - bgc) for bgc in bg_colors)
        
        if min_d < tolerance and not is_character:
            is_bg[cy, cx] = True
            for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
                ny, nx = cy + dy, cx + dx
                if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))
                    
    # Generate alpha channel
    # Blur the mask slightly for soft anti-aliased fur edges
    alpha = np.where(is_bg, 0, 255).astype(np.uint8)
    alpha_img = Image.fromarray(alpha, mode='L')
    alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(radius=0.8))
    
    arr[:, :, 3] = np.array(alpha_img)
    result = Image.fromarray(arr, "RGBA")
    result.save(out_path)
    print(f"Isolated: {out_path}")

# Apply to all mascots
targets = [
    ('public/images/mascot/kitten-yarn.png', 'public/images/mascot/kitten-yarn.png'),
    ('public/images/mascot/kitten-chat-peek.png', 'public/images/mascot/kitten-chat-peek.png'),
    ('public/images/mascot/kitten-banner-loops.png', 'public/images/mascot/kitten-banner-loops.png'),
    ('public/images/mascot/kitten-banner-memory.png', 'public/images/mascot/kitten-banner-memory.png'),
    ('public/images/mascot/kitten-sleeping.png', 'public/images/mascot/kitten-sleeping.png'),
    ('public/images/mascot/kitten-checklist.png', 'public/images/mascot/kitten-checklist.png'),
    ('public/images/mascot/kitten-sleepy.png', 'public/images/mascot/kitten-sleepy.png'),
]

for src, dst in targets:
    isolate_mascot_with_floodfill(src, dst)
print("Finished floodfill isolation!")
