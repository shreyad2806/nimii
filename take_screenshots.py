import subprocess
import time
import os
import urllib.request
import sys

def log(msg):
    print(msg, flush=True)

os.makedirs('screenshots', exist_ok=True)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

log("Starting Next.js server on 127.0.0.1:3333...")
server_proc = subprocess.Popen(
    ["node", "./node_modules/next/dist/bin/next", "start", "-p", "3333", "-H", "127.0.0.1"],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)

# Wait for server
ready = False
for i in range(20):
    time.sleep(1)
    try:
        req = urllib.request.Request("http://127.0.0.1:3333/app", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=2) as resp:
            if resp.status == 200:
                ready = True
                log("Server is ready and responding!")
                break
    except Exception as e:
        log(f"Waiting for server... ({i+1})")

if not ready:
    log("Server failed to respond in time.")
    subprocess.run(["taskkill", "/F", "/T", "/PID", str(server_proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    sys.exit(1)

pages = [
    ("home", "http://127.0.0.1:3333/app"),
    ("login", "http://127.0.0.1:3333/login"),
    ("chat", "http://127.0.0.1:3333/app/chat/conv-1"),
    ("memory", "http://127.0.0.1:3333/app/memory"),
    ("loops", "http://127.0.0.1:3333/app/loops"),
    ("history", "http://127.0.0.1:3333/app/history"),
    ("settings", "http://127.0.0.1:3333/app/settings"),
]

# Desktop
for name, url in pages:
    out_file = os.path.abspath(f"screenshots/{name}-desktop.png")
    log(f"Capturing {name} desktop...")
    subprocess.run([
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--virtual-time-budget=2500",
        "--window-size=1672,941",
        f"--screenshot={out_file}",
        url
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# Mobile
for name, url in pages:
    out_file = os.path.abspath(f"screenshots/{name}-mobile.png")
    log(f"Capturing {name} mobile...")
    subprocess.run([
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--virtual-time-budget=2500",
        "--window-size=390,844",
        f"--screenshot={out_file}",
        url
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

log("Stopping server...")
subprocess.run(["taskkill", "/F", "/T", "/PID", str(server_proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
log("All screenshots captured!")
