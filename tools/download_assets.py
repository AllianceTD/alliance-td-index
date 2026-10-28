"""Download public Roblox thumbnails; never reads browser cookies or account credentials."""
import concurrent.futures
import json
import re
import urllib.request
import urllib.error
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "docs"
data = json.loads((DIST / "data.json").read_text(encoding="utf-8"))
ids = set(re.findall(r"rbxassetid://([0-9]+)", json.dumps(data)))
ids.update(["137198142323588", "136135385929328", "102505941801998", "123506330618996", "96036128271037", "93332651879381"])
ids.discard("0")
urls = {}
ids = sorted(ids)
for offset in range(0, len(ids), 20):
    url = "https://thumbnails.roblox.com/v1/assets?assetIds=" + ",".join(ids[offset:offset+20]) + "&size=420x420&format=Png&isCircular=false"
    for attempt in range(5):
        try:
            response = json.load(urllib.request.urlopen(url, timeout=30))
            break
        except urllib.error.HTTPError as exc:
            if exc.code != 429 or attempt == 4:
                raise
            time.sleep(min(20, 3 * (attempt + 1)))
    for entry in response.get("data", []):
        if entry.get("state") == "Completed" and entry.get("imageUrl"):
            urls[str(entry["targetId"])] = entry["imageUrl"]
    time.sleep(1)

def download(pair):
    asset_id, url = pair
    target = DIST / "assets" / f"{asset_id}.png"
    try:
        if not target.exists():
            image = urllib.request.urlopen(url, timeout=30).read()
            if not image.startswith(b"\x89PNG"):
                return asset_id, None
            target.write_bytes(image)
        return asset_id, f"assets/{asset_id}.png"
    except Exception as exc:
        print(f"Unavailable thumbnail {asset_id}: {type(exc).__name__}")
        return asset_id, None

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    result = dict(pool.map(download, urls.items()))
result = {key: value for key, value in result.items() if value}
(DIST / "asset-map.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
print(f"Downloaded {len(result)} public thumbnails; {len(ids)-len(result)} unavailable.")
