from PIL import Image, ImageFilter
import numpy as np
from collections import deque

def isolate_clean(img_path, out_path, tol=40):
    img = Image.open(img_path).convert("RGBA")
    arr = np.array(img)
    h, w, _ = arr.shape
    
    visited = np.zeros((h, w), dtype=bool)
    is_bg = np.zeros((h, w), dtype=bool)
    
    # Sample background color from outer perimeter
    bg_samples = [arr[0, 0, :3].astype(float), arr[0, w-1, :3].astype(float), arr[0, w//2, :3].astype(float)]
    
    queue = deque()
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
        pixel = arr[cy, cx, :3].astype(float)
        
        # Check if character (dark outline, dark fur, pink nose/ears, purple laptop, white checklist text)
        is_char = (pixel[0] < 185 and pixel[1] < 185) or (pixel[0] < 155) or (pixel[1] < 150 and pixel[2] > 180) # purple laptop
        
        min_d = min(np.linalg.norm(pixel - bg) for bg in bg_samples)
        if min_d < tol and not is_char:
            is_bg[cy, cx] = True
            for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
                ny, nx = cy + dy, cx + dx
                if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))
                    
    alpha = np.where(is_bg, 0, 255).astype(np.uint8)
    alpha_img = Image.fromarray(alpha, mode='L').filter(ImageFilter.GaussianBlur(radius=0.7))
    arr[:, :, 3] = np.array(alpha_img)
    Image.fromarray(arr, "RGBA").save(out_path)
    print(f"Isolated clean: {out_path}")

isolate_clean('public/images/mascot/kitten-laptop.png', 'public/images/mascot/kitten-laptop.png')
isolate_clean('public/images/mascot/kitten-checklist.png', 'public/images/mascot/kitten-checklist.png')
isolate_clean('public/images/mascot/kitten-celebrating.png', 'public/images/mascot/kitten-celebrating.png')
isolate_clean('public/images/mascot/kitten-sleepy.png', 'public/images/mascot/kitten-sleepy.png')
