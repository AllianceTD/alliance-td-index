"""Apply the verified November patch snapshots without exporting game/server code.

Usage: python tools/sync-game-data.py --source-root <directory containing outputs>
Only the reviewed unit modules/configs are read. This never connects to Roblox.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path

args = argparse.ArgumentParser()
args.add_argument('--source-root', type=Path, required=True)
root = args.parse_args().source_root.resolve()
repo = Path(__file__).resolve().parents[1]
data_path = repo / 'docs/data.json'
data = json.loads(data_path.read_text(encoding='utf-8'))
if data.get('verification',{}).get('fullCatalogVerifiedAt','') > '2026-11-02':
    raise SystemExit('A newer full catalog is present. Use sync-full-catalog.py instead of the historical patch-only importer.')
sources = []

def read(relative):
    path = root / relative
    raw = path.read_bytes()
    sources.append({'path': relative, 'sha256': hashlib.sha256(raw).hexdigest()})
    return raw.decode('utf-8-sig')

def primitive(value):
    if value.startswith('"'):
        return json.loads(value)
    if value in ('true', 'false'):
        return value == 'true'
    return float(value) if '.' in value else int(value)

def fields(body):
    body = re.sub(r'--[^\n]*', '', body)
    pattern = r'(\w+)\s*=\s*("[^"\n]*"|true|false|-?\d+(?:\.\d+)?)\s*[,;]?'
    result = {m[1]: primitive(m[2]) for m in re.finditer(pattern, body)}
    assert not re.sub(pattern, '', body).strip(), 'Unexpected source expression'
    return result

def levels(source):
    matches = list(re.finditer(r'\[(\d+)\]\s*=\s*\{(.*?)\n\s*\},', source, re.S))
    assert matches and [int(m[1]) for m in matches] == list(range(1, len(matches) + 1))
    result, inherited = [], {}
    for match in matches:
        inherited.update(fields(match[2]))
        result.append(dict(inherited))
    return result

def dps(level):
    return sum(level.get(p + 'Damage', 0) / level[p + 'Cooldown']
               for p in ('', 'Hand', 'Knife') if level.get(p + 'Cooldown', 0) > 0)

def update_unit(id, unit_levels):
    unit = next(u for u in data['units'] if u['Id'] == id)
    unit['Levels'] = unit_levels
    unit['Price'] = unit_levels[0]['Price']
    stats = unit['Stats']
    for key in ('Damage', 'Range', 'Cooldown', 'HandDamage', 'HandRange', 'HandCooldown',
                'AttackAngle', 'SpawnerHp', 'SpawnMaxUnits', 'SpawnLifetime', 'SpawnMoveSpeed'):
        name = 'Radius' if key == 'Range' else key
        if key in unit_levels[0]:
            stats[name] = unit_levels[0][key]
            stats['Max' + name] = unit_levels[-1][key]
    stats['DPS'], stats['MaxDPS'] = dps(unit_levels[0]), dps(unit_levels[-1])
    if id == 'Camera Helicopter':
        stats['SpawnCooldown'] = unit_levels[0]['Cooldown']
        stats['MaxSpawnCooldown'] = unit_levels[-1]['Cooldown']
    unit['DataStatus'] = 'upcoming'
    unit['VerifiedAt'] = '2026-11-02'

classic = 'outputs/classic-unit-passives-2026-11-02/after/lobby/'
changed = ['Titan TV Man', 'Speaker Woman', 'Titan Camera Man', 'Upgraded Titan Camera Man', 'Jester Speaker Man']
for id in changed:
    update_unit(id, levels(read(classic + 'ReplicatedStorage.Modules.Units.' + id + '.luau')))
update_unit('TV Strider', levels(read('outputs/tv-strider-buff-2026-11-02/lobby-after/ReplicatedStorage.Modules.Units.TV Strider.luau')))

source = read('outputs/camera-helicopter-rework-2026-11-02/new/CameraHelicopterConfig.luau')
inherited, helicopter_levels = {}, []
for match in re.finditer(r'\[(\d+)\]\s*=\s*\{(.*?)\n\t\},', source, re.S):
    body = match[2]
    calls = re.findall(r'member\("([^"]+)",\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)', body)
    assert calls
    body = re.sub(r'SpawnUnits\s*=\s*\{.*?\},', '', body, flags=re.S)
    inherited.update(fields(body))
    level = dict(inherited)
    level['SpawnUnits'] = []
    for name, hp, damage, attack_range, cooldown, interval in calls:
        level['SpawnUnits'].append({
            'Unit': name, 'Name': name, 'SpawnerHp': float(hp), 'Damage': float(damage),
            'Range': float(attack_range), 'AttackCooldown': float(cooldown), 'Cooldown': float(interval),
            'AttackFlyToilet': name != 'Large Camera Man',
            'AttackName': {'Camera Man': 'Gun', 'Large Camera Man': 'Knife', 'Titan Camera Man': 'Laser'}[name],
        })
    helicopter_levels.append(level)
assert len(helicopter_levels) == 5
update_unit('Camera Helicopter', helicopter_levels)

source = read('outputs/camera-helicopter-rework-2026-11-02/after/game/ServerScriptService.Game.Main.TowerSystem.luau')
limits = re.search(r'local UNIT_PLACEMENT_LIMITS = \{(.*?)\n\}', source, re.S)[1]
data['limits'] = {m[1] or m[2]: int(m[3]) for m in re.finditer(r'\[(?:"(.*?)"|\'(.*?)\')\]\s*=\s*(\d+)', limits)}
assert data['limits']['TV Strider'] == 6 and 'Zombie Camera Man' not in data['limits']
zombie = next(u for u in data['units'] if u['Id'] == 'Zombie Camera Man')
zombie.update(DataStatus='upcoming', VerifiedAt='2026-11-02', PersonalLimitRemoved=True)
data['updatedAt'] = '2026-11-03'
data['verification'] = {
    'lastFullExportAt': data['exportedAt'],
    'patchVerifiedAt': '2026-11-02',
    'patchStatus': 'upcoming',
    'patchedUnits': changed + ['TV Strider', 'Camera Helicopter', 'Zombie Camera Man'],
}
for relative in [
    'outputs/classic-unit-passives-2026-11-02/new/ClassicUnitPassivesConfig.luau',
    'outputs/tv-strider-buff-2026-11-02/SignalResonanceConfig.luau',
    'outputs/tv-screen-shift-2026-11-02/new/ScreenShiftConfig.luau',
]:
    read(relative)
data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(repo / 'tools/game-sync-sources.json').write_text(json.dumps({
    'verifiedAt': '2026-11-02', 'catalogUpdatedAt': '2026-11-03',
    'method': 'Reviewed Edit-mode source snapshots, checked in Game and Lobby before export.',
    'sources': sources,
}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Updated 8 units and verified match placement limits; preserved all other catalog data.')
