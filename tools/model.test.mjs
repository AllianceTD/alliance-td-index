import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { levels, directDps, filterUnits, chance, maxDps } from '../docs/model.js';
const data = JSON.parse(readFileSync(new URL('../docs/data.json',import.meta.url),'utf8'));
const units=data.units;
test('all units have stable unique IDs and upgrade levels',()=>{
 assert.equal(new Set(units.map(x=>x.Id)).size,units.length);
 for(const u of units){assert.ok(levels(u).length>0,u.Id);assert.ok(Number.isFinite(maxDps(u)),u.Id);}
});
test('Hyper direct DPS includes guns, core and knife; conditional boost is excluded',()=>{
 const u=units.find(x=>x.Id==='Hyper Titan Speaker Man');assert.equal(levels(u).length,6);
 assert.equal(directDps(levels(u)[0]),2600);assert.equal(maxDps(u),25000);
});
test('zero cooldown does not produce infinity',()=>{
 assert.equal(directDps({Damage:100,Cooldown:0}),0);
 assert.equal(directDps({Damage:100,Cooldown:1,HandDamage:50,HandCooldown:2}),125);
});
test('search, rarity, sources and saved filter compose',()=>{
 assert.equal(filterUnits(units,{query:'hyper'}).length,1);
 assert.equal(filterUnits(units,{query:'hyper',rarity:'Basic'}).length,0);
 assert.equal(filterUnits(units,{source:'craft'}).every(u=>u.Sources.some(s=>s.Kind==='Craft')),true);
 assert.deepEqual(filterUnits(units,{savedOnly:true,bookmarks:['Camera Man']}).map(x=>x.Id),['Camera Man']);
});
test('DPS sorting is numeric and does not mutate catalog',()=>{
 const ids=units.map(u=>u.Id);const sorted=filterUnits(units,{sort:'dps'});
 for(let i=1;i<sorted.length;i++)assert.ok(maxDps(sorted[i-1])>=maxDps(sorted[i]));
 assert.deepEqual(units.map(u=>u.Id),ids);
});

test('summon uses obtain sources rather than stale summon flags',()=>{
 const list=filterUnits(units,{source:'summon'});
 assert.ok(list.some(u=>u.Id==='Camera Man'));
 assert.ok(list.every(u=>u.Sources.some(s=>s.Kind==='Summon')));
 for(const id of ['10M Speaker Man','Builder Camera Man','DJ Speaker Man','Titan Camera Man','TV Woman'])assert.ok(!list.some(u=>u.Id===id),id);
 const flagged={Id:'flagged',Rarity:'Exclusive',Settings:{IsInSummon:true},Sources:[{Kind:'Summon'}]};
 assert.equal(filterUnits([flagged],{source:'summon'}).length,0);
});
test('exclusive and event filters include exactly their catalog rarity',()=>{
 for(const [source,rarity]of [['exclusive','Exclusive'],['event','Event']]){
  const list=filterUnits(units,{source});
  assert.equal(list.length,units.filter(u=>u.Rarity===rarity).length);
  assert.ok(list.every(u=>u.Rarity===rarity));
 }
 assert.equal(filterUnits(units,{source:'event',query:'builder'}).length,1);
});
test('fractional probabilities are rendered as percent',()=>{assert.equal(chance(.005),'0.5%');assert.equal(chance(.015),'1.5%');});
test('craft references point to known entries',()=>{
 for(const recipe of data.crafts){assert.ok(units.some(u=>u.Id===recipe.Output),recipe.Output);
  for(const input of recipe.Inputs){if(input.Material)assert.ok(data.materials[input.Material]);else assert.ok(units.some(u=>u.Id===input.Unit),input.Unit);assert.ok(input.Amount>0);}
 }
});
test('base reward snapshot includes Halloween and all seven modes',()=>{assert.equal(Object.keys(data.modes).length,7);assert.equal(data.modes.Halloween.WinCoins,1500);});
test('asset map resolves to packaged files',()=>{
 const assets=JSON.parse(readFileSync(new URL('../docs/asset-map.json',import.meta.url),'utf8'));
 for(const [id,path]of Object.entries(assets))assert.ok(existsSync(fileURLToPath(new URL('../docs/'+path,import.meta.url))),id);
});
