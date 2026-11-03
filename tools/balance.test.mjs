import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {directDps,maxDps} from '../docs/model.js';
import {passiveOutcomes,screenModes,squadGroups,squadDps,balanceDetails} from '../docs/balance.js';
import {ABILITIES,abilitySections} from '../docs/abilities.js';
const data=JSON.parse(fs.readFileSync(new URL('../docs/data.json',import.meta.url)));
const unit=id=>data.units.find(u=>u.Id===id);
const max=id=>unit(id).Levels.at(-1);
const approx=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);

test('all revised max-level DPS totals agree with the reviewed gameplay values',()=>{
 for(const [id,dps] of Object.entries({'Titan TV Man':1500,'Speaker Woman':900,'Titan Camera Man':4500,'Upgraded Titan Camera Man':10000,'Jester Speaker Man':500,'TV Strider':7500,'Zombie Camera Man':6000,'Camera Helicopter':0}))approx(maxDps(unit(id)),dps);
 assert.equal(max('Titan TV Man').Range,22);
 assert.equal(max('Speaker Woman').AttackAngle,55);
 assert.equal(max('TV Strider').Range,26);
});

test('conditional DPS is not folded into base DPS and uses the affected attack only',()=>{
 for(const [id,expected] of [['Speaker Woman',1215],['Jester Speaker Man',600],['Titan Camera Man',5200],['Upgraded Titan Camera Man',12000],['TV Strider',8375]])approx(passiveOutcomes(id,max(id))[0].value,expected);
 const start=unit('Titan Camera Man').Levels[0];
 approx(passiveOutcomes('Titan Camera Man',start)[0].value,1550);
 assert.equal(directDps(start),1350);
});

test('Screen Shift remains locked before level 3 and does not multiply cannon damage',()=>{
 assert.deepEqual(screenModes(max('TV Strider'),2),[]);
 const modes=screenModes(max('TV Strider'),5);
 assert.deepEqual(modes.map(m=>m.direct),[7500,6500,6500]);
 assert.deepEqual(modes.map(m=>m.resonance),[8375,7375,7375]);
 assert.equal(modes[1].burn,800);
 assert.equal(modes[1].resonance+modes[1].burn,8175);
 assert.equal(modes[0].burn,0);
 assert.equal(ABILITIES['TV Strider'].filter(a=>a.active).length,2,'Blink must survive the addition of Screen Shift');
});

test('Helicopter progression uses the intended squad composition, health and targeting',()=>{
 const lv=unit('Camera Helicopter').Levels;
 assert.deepEqual(lv.map(s=>s.SpawnUnits.map(m=>m.Unit)),[['Camera Man'],['Camera Man','Camera Man'],['Large Camera Man'],['Large Camera Man','Camera Man','Camera Man'],['Titan Camera Man']]);
 assert.deepEqual(lv.map(s=>s.SpawnMaxUnits),[2,4,2,6,2]);
 assert.deepEqual(lv.map(s=>s.Cooldown),[14,13,12,11,10]);
 assert.deepEqual(lv.map(s=>s.SpawnUnits.map(m=>m.SpawnerHp)),[[1000],[1800,1800],[7000],[16000,5000,5000],[45000]]);
 for(const s of lv)for(const m of s.SpawnUnits)assert.equal(m.AttackFlyToilet,m.Unit!=='Large Camera Man');
 assert.equal(squadGroups(lv[3]).length,2);
 assert.equal(squadGroups(lv[3])[1].count,2);
 approx(squadDps(lv[3]),725);
 approx(squadDps(lv[4]),2400);
 approx(squadDps(lv[1]),2*28/.95);
 assert.equal(lv[0].Price+lv.slice(0,-1).reduce((sum,s)=>sum+s.UpgradePrice,0),10250);
});

test('verified placement limits use the current unit ID and distinguish removed personal caps',()=>{
 assert.equal(data.limits['TV Strider'],6);
 assert.equal(data.limits['Camera Helicopter'],3);
 assert.equal(data.limits['Hyper Titan Speaker Man'],2);
 assert.ok(!Object.hasOwn(data.limits,'Hyper Upgraded Titan Speaker Man'));
 assert.ok(!Object.hasOwn(data.limits,'Zombie Camera Man'));
 assert.equal(unit('Zombie Camera Man').PersonalLimitRemoved,true);
});

test('patch records and rendered panels are bilingual, escaped, and marked as forthcoming',()=>{
 for(const id of data.verification.patchedUnits){assert.equal(unit(id).DataStatus,'upcoming');assert.equal(unit(id).VerifiedAt,'2026-11-02');}
 for(const id of ['Titan TV Man','Speaker Woman','Titan Camera Man','Upgraded Titan Camera Man','Jester Speaker Man','TV Strider','Camera Helicopter']){
  for(const a of ABILITIES[id])assert.ok(a.name.en&&a.name.ru&&a.description.en&&a.description.ru);
 }
 for(const lang of ['en','ru']){
  const heli=balanceDetails('Camera Helicopter',max('Camera Helicopter'),5,lang,s=>s);
  assert.ok(heli.includes('45,000'));assert.ok(heli.includes('2,400'));assert.ok(!heli.includes('undefined'));
  const modes=balanceDetails('TV Strider',max('TV Strider'),5,lang,s=>s);
  assert.ok(modes.includes('8,175'));assert.ok(modes.includes('tv-screen-purple.png'));
  assert.ok(abilitySections('TV Strider',lang,s=>s).includes('tv-screen-shift.png'));
 }
 const injection={...max('Camera Helicopter'),SpawnUnits:[{...max('Camera Helicopter').SpawnUnits[0],Unit:'<script>'}]};
 assert.ok(balanceDetails('Camera Helicopter',injection,5,'en',s=>String(s).replaceAll('<','&lt;')).includes('&lt;script>'));
});

test('all four Screen Shift icons are bundled assets',()=>{
 for(const name of ['shift','red','orange','purple'])assert.ok(fs.statSync(new URL(`../docs/assets/abilities/tv-screen-${name}.png`,import.meta.url)).size>1000);
});
