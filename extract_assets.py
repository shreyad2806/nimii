import os
from PIL import Image

# 1. Login page: kitten sleeping on cloud (clean crop)
im_login = Image.open('public/images/design-reference/loginPage.png')
crop_cloud = im_login.crop((125, 455, 655, 855))
crop_cloud.save('public/images/mascot/kitten-cloud.png')

# 2. Home page: kitten with yarn
im_home = Image.open('public/images/design-reference/homePage.png')
crop_yarn = im_home.crop((820, 80, 1310, 375))
crop_yarn.save('public/images/mascot/kitten-yarn.png')

# 3. Sidebar sleepy kitten
crop_sleepy = im_home.crop((45, 680, 185, 770))
crop_sleepy.save('public/images/mascot/kitten-sleepy.png')

# 4. Celebrating kitten (homePage bottom right)
crop_celeb = im_home.crop((1435, 805, 1595, 880))
crop_celeb.save('public/images/mascot/kitten-celebrating.png')

# 5. Loops page: checklist mascot (right side)
im_loops = Image.open('public/images/design-reference/loopPage.png')
crop_check = im_loops.crop((1400, 645, 1600, 775))
crop_check.save('public/images/mascot/kitten-checklist.png')

# 6. Loops page: top banner kitten
crop_loops_b = im_loops.crop((1025, 10, 1375, 230))
crop_loops_b.save('public/images/mascot/kitten-banner-loops.png')

# 7. Memory page: top banner lying kitten
im_memory = Image.open('public/images/design-reference/memoryPage.png')
crop_mem_b = im_memory.crop((925, 15, 1275, 225))
crop_mem_b.save('public/images/mascot/kitten-banner-memory.png')

# 8. Memory page: peeking kitten at bottom right of memory insights
crop_mem_peek = im_memory.crop((1045, 860, 1190, 948))
crop_mem_peek.save('public/images/mascot/kitten-peeking.png')

# 9. History page: sleeping curled kitten top banner
im_hist = Image.open('public/images/design-reference/historyPage.png')
crop_hist_sleep = im_hist.crop((995, 55, 1255, 175))
crop_hist_sleep.save('public/images/mascot/kitten-sleeping.png')

# 10. History page: celebration kitten bottom right
crop_hist_celeb = im_hist.crop((1420, 770, 1590, 855))
crop_hist_celeb.save('public/images/mascot/kitten-hist-celeb.png')

# 11. Settings page: kitten with laptop
im_sett = Image.open('public/images/design-reference/settingsPage.png')
crop_laptop = im_sett.crop((1345, 185, 1660, 460))
crop_laptop.save('public/images/mascot/kitten-laptop.png')

# 12. Chat page: peeking kitten above composer
im_chat = Image.open('public/images/design-reference/chatPage.png')
crop_chat_peek = im_chat.crop((1080, 825, 1225, 895))
crop_chat_peek.save('public/images/mascot/kitten-chat-peek.png')

# 13. Brand Logo (top left)
crop_logo = im_home.crop((55, 30, 180, 155))
crop_logo.save('public/images/mascot/nimii-logo.png')

# 14. Assistant message avatar
crop_avatar = im_chat.crop((262, 192, 332, 255))
crop_avatar.save('public/images/mascot/nimii-avatar.png')

# 15. Also extract full scenic background from homePage or loginPage
# In homePage, we can synthesize or extract the full landscape
bg_canvas = im_home.copy()
# The sky and mountains are behind everything. Let's save a wide background slice
bg_sky = im_home.crop((0, 0, 1671, 941))
bg_sky.save('public/images/backgrounds/bg-main.png')

print('All assets refreshed and saved successfully!')
