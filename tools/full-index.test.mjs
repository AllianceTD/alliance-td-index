import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MODE_ORDER,modeCards,rngProbabilities,rngGuide} from '../docs/modes.js';
import {maxDps} from '../docs/model.js';
import {passiveOutcomes} from '../docs/balance.js';
import {russianText} from '../docs/locale.js';
const read=name=>JSON.parse(fs.readFileSync(new URL(name,import.meta.url)));
const data=read('../docs/data.json'),updates=read('../docs/updates.json'),raw=read('./game-release-log.json');
const unit=id=>data.units.find(u=>u.Id===id);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);

test('every in-game release and every section item is copied, including sections omitted from SectionOrder',()=>{
 const official=updates.releases.filter(r=>r.source==='in-game changelog');
 assert.equal(official.length,Object.keys(raw).length);assert.equal(official.length,16);
 for(const [id,source] of Object.entries(raw)){
  const copy=official.find(r=>r.id===id);assert.ok(copy,id);
  assert.equal(copy.date,source.ReleaseDate);assert.equal(copy.version,String(source.Number));
  for(const [key,items] of Object.entries(source)){
   if(key==='SectionOrder'||!Array.isArray(items))continue;
   const section=copy.sections.find(s=>s.sourceKey===key);assert.ok(section,`${id}: ${key}`);
   assert.deepEqual(section.items.map(i=>i.en),items,`${id}: ${key}`);
   assert.ok(section.title.ru);assert.ok(section.items.every(i=>i.en&&i.ru));
  }
 }
 const latest=official.find(r=>r.id==='Template15');
 assert.ok(latest.sections.find(s=>s.sourceKey==='COMING SOON'));
 assert.ok(latest.sections.flatMap(s=>s.items).some(i=>i.en.includes('RNG Mode')));
 assert.ok(latest.sections.flatMap(s=>s.items).some(i=>i.en.includes('Trading Plaza')));
 assert.ok(official.find(r=>r.id==='Template14').sections.find(s=>s.sourceKey==='Exclusive'));
});

test('both new units include every level, source, icon and verified personal limit',()=>{
 assert.equal(data.units.length,62);
 const assets=read('../docs/asset-map.json');
 for(const [id,count] of [['Ushanka Camera Man',5],['Rocket Large Camera Man',4]]){
  const u=unit(id);assert.equal(u.Levels.length,count);assert.equal(data.limits[id],3);
  assert.ok(u.Sources.length);assert.ok(assets[u.Icon.match(/\d+/)[0]]);
  assert.notEqual(russianText(id),id);
 }
 near(maxDps(unit('Ushanka Camera Man')),2812.5);
 near(passiveOutcomes('Ushanka Camera Man',unit('Ushanka Camera Man').Levels.at(-1))[0].value,5625);
 near(maxDps(unit('Rocket Large Camera Man')),2000);
 near(passiveOutcomes('Rocket Large Camera Man',unit('Rocket Large Camera Man').Levels.at(-1))[0].value,2000+90/.35);
});

test('RNG active pool is independent of summon eligibility and probabilities remain normalized with upgrades',()=>{
 assert.equal(data.rng.UnitPool.length,61);
 assert.ok(!data.rng.UnitPool.some(u=>u.Id==='10M Titan Speaker Man'));
 assert.ok(data.rng.UnitPool.some(u=>u.Id==='Hyper Titan Speaker Man'));
 for(const luck of [1,1.15,1.3,1.5,1.75,2]){
  const pool=rngProbabilities(data.rng.UnitPool,luck);
  near(pool.reduce((sum,u)=>sum+u.probability,0),1);
  assert.ok(pool.every(u=>u.probability>0&&u.probability<1));
 }
 const chance=(luck,id)=>rngProbabilities(data.rng.UnitPool,luck).find(u=>u.Id===id).probability;
 assert.ok(chance(2,'Hyper Titan Speaker Man')>chance(1,'Hyper Titan Speaker Man'));
});

test('RNG guide uses all four upgrades and modifiers, 60 waves and all six bosses',()=>{
 assert.equal(data.rng.Waves,60);assert.equal(data.rng.SlotCount,5);
 assert.deepEqual(data.rng.ModifierWaves,[10,20,30,40,50]);
 assert.equal(data.rng.Bosses.length,6);assert.equal(data.rng.Bosses.at(-1).Unit,'Scientist Toilet');
 assert.equal(data.rng.FinalBossHp,5000000);
 for(const lang of ['en','ru']){
  const rendered=rngGuide(data,lang,s=>s,2);
  assert.equal((rendered.match(/<section>/g)||[]).length,8);
  assert.ok(rendered.includes('rng-luck'));assert.match(rendered,/5[, ]000[, ]000/);
  assert.ok(!rendered.includes('undefined'));
  const modes=modeCards(data,lang,s=>s);
  assert.equal(modes.count,8);assert.ok(modes.html.includes('rng-guide'));
  assert.equal(modeCards(data,lang,s=>s,'rng').count,1);
 }
 assert.equal(MODE_ORDER.at(-1),'RNG');
});

test('next countdown matches 6 November at 19:00 Moscow / 7:00 PM',()=>{
 const at=new Date(updates.nextUpdate.releaseAt);
 assert.equal(at.toISOString(),'2026-11-06T16:00:00.000Z');
 assert.equal(new Intl.DateTimeFormat('ru-RU',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Moscow'}).format(at),'19:00');
 assert.equal(new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Europe/Moscow'}).format(at),'7:00 PM');
});
