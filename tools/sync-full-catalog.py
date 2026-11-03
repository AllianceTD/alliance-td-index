"""Import a read-only Studio export; this script never connects to or edits Roblox."""
import argparse
import hashlib
import json
import re
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('export', type=Path)
parser.add_argument('--burn', type=Path, required=True)
args = parser.parse_args()
repo = Path(__file__).resolve().parents[1]
bundle = json.loads(args.export.read_text(encoding='utf-8'))
burn = json.loads(args.burn.read_text(encoding='utf-8'))
path = repo/'docs/data.json'
data = json.loads(path.read_text(encoding='utf-8'))
old = {u['Id']: u for u in data['units']}
units = bundle['units']
assert len(units) == len(bundle['lobby']['units'])
for u in units:
    assert u['Levels'] and all(isinstance(level, dict) for level in u['Levels']), u['Id']
    previous = old.get(u['Id'], {})
    for key in ('DataStatus', 'PersonalLimitRemoved', 'ReleasedAt'):
        if key in previous:
            u[key] = previous[key]
    u['VerifiedAt'] = '2026-11-03'
    for level, stats in enumerate(u['Levels']):
        if u['Id'] == 'Camera Helicopter':
            for member in stats.get('SpawnUnits',[]):
                member['AttackName'] = {'Camera Man':'Gun','Large Camera Man':'Knife','Titan Camera Man':'Laser'}[member['Unit']]
        if u['Id'] in burn:
            entry = burn[u['Id']][min(level, len(burn[u['Id']])-1)]
            stats.update(BurnDamagePerSec=entry['DamagePerTick']/entry['TickInterval'],
                         BurnDuration=entry['Duration'], BurnTickInterval=entry['TickInterval'])
data['units'] = units
cfg = bundle['lobby']['configs']
for field, key in [('crates','Crates'),('materials','ItemsData'),('crafts','UnitCraftConfig'),
                   ('maps','MapConfig'),('boosts','BoostConfig'),('orders','Orders')]:
    data[field] = cfg[key]['Recipes'] if field == 'crafts' else cfg[key]
data['drops'] = cfg['ItemDropConfig']['Drops']
for key in ['GroupChestConfig','VIPChestConfig','VIPChestDrops']:
    data[key] = cfg[key]
data['modes'] = bundle['game']['rewards']
data['maps'] = {'Maps':[{k:v for k,v in m.items() if k in ('Id','DisplayName','Category','Mode','Icon','CoinMultiplier','Waves')}
                        for m in bundle['game']['maps']['Maps']]}
# The match config is authoritative for rewards; the lobby's older preview differs.
data['rewardSource'] = {'placeId':90647947106358,'module':'ReplicatedStorage.Shared.ModeRewardConfig','verifiedAt':'2026-11-03'}
limits = bundle['extraSources']['ServerScriptService.Game.Main.TowerSystem']
data['limits'] = {m[1] or m[2]:int(m[3]) for m in re.finditer(r'\[(?:"(.*?)"|\'(.*?)\')\]\s*=\s*(\d+)', limits)}
rng = bundle['game']['configs']
pool = rng['RNGUnitsConfig']['Units']
data['rng'] = {
    'MapId':'RNG_Mode','Waves':rng['RNGWaveConfig']['WaveCount'],'SlotCount':5,
    'Bosses':[{'Wave':w,'Unit':name} for w,name in [(10,'G-Toilet'),(20,'G-Toilet'),(30,'G-Toilet'),(40,'G-Toilet 2.0'),(50,'G-Toilet 2.0'),(60,'Scientist Toilet')]],
    'FinalBossHp':5000000,'ModifierWaves':[10,20,30,40,50],
    'Upgrades':rng['RNGUpgradeConfig']['Upgrades'],'UpgradeOrder':rng['RNGUpgradeConfig']['Order'],
    'Modifiers':rng['RNGModifierConfig']['Definitions'],'ModifierOrder':rng['RNGModifierConfig']['Order'],
    'UnitPool':[{'Id':id,'Weight':pool[id]['Weight']} for id in bundle['game']['activeRNGUnits']],
    'VerifiedAt':'2026-11-03',
}
data['ranks'] = {'Ranks':cfg['RankConfig']['Ranks'],'Rewards':cfg['RankRewardConfig']['Rewards'],'Cooldowns':cfg['RankRewardConfig']['RewardCooldowns']}
data['updatedAt'] = '2026-11-03'
data['exportedAt'] = '2026-11-03'
data['verification'].update(lastFullExportAt='2026-11-03',fullCatalogVerifiedAt='2026-11-03',
    sourcePlaces=[121982847335554,90647947106358],readOnly=True)
path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
releases = bundle['lobby']['releases']
(repo/'tools/game-release-log.json').write_text(json.dumps(releases,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
proof = {'verifiedAt':'2026-11-03','readOnly':True,'unitCount':len(units),
         'modeCount':len(data['modes']),'releaseCount':len(releases),
         'releaseLogSha256':hashlib.sha256(bundle['lobbySources']['StarterGui.UpdateLOG.UpdateLogs'].encode()).hexdigest(),
         'configSha256':{k:hashlib.sha256(v.encode()).hexdigest() for k,v in bundle['gameSources'].items()}}
(repo/'tools/full-catalog-verification.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(f"Imported {len(units)} units, {len(data['modes'])} modes, {len(releases)} game release records; no Roblox writes.")
