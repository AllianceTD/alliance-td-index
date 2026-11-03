import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {countdown,sortedReleases,localized} from '../docs/updates.js';
import {ABILITIES,abilitySections} from '../docs/abilities.js';
const config=JSON.parse(fs.readFileSync(new URL('../docs/updates.json',import.meta.url)));
test('Moscow 19:00 countdown is timezone independent',()=>{
 const at='2026-11-02T19:00:00+03:00';
 assert.equal(new Date(at).toISOString(),'2026-11-02T16:00:00.000Z');
 assert.deepEqual(countdown(at,Date.parse('2026-11-01T15:59:59Z')),{status:'scheduled',days:1,hours:0,minutes:0,seconds:1});
});
test('missing, invalid and elapsed timer dates have safe distinct states',()=>{
 assert.equal(countdown(null).status,'unknown');assert.equal(countdown('bad').status,'unknown');
 assert.equal(countdown('2026-11-02T19:00:00+03:00',Date.parse('2026-11-02T19:00:00+03:00')).status,'due');
});

test('pending patch is a preview without inventing a release date or version',()=>{
 assert.equal(config.currentVersion,'15');
 assert.equal(new Date(config.nextUpdate.releaseAt).toISOString(),'2026-11-06T16:00:00.000Z');
 const ordered=sortedReleases(config.releases);
 assert.equal(ordered[0].id,'Template15');
 assert.equal(ordered[0].date,'2026-11-02');
 const pending=ordered[1];
 assert.equal(pending.status,'upcoming');
 assert.equal(config.releases.filter(r=>r.status!=='upcoming')[0].version,'15');
});
test('release history sorts newest first without mutating source',()=>{
 const list=[{date:'2026-10-01',version:'1'},{date:'2026-10-28',version:'2'}];
 assert.equal(sortedReleases(list)[0].version,'2');assert.equal(list[0].version,'1');
 for(const release of config.releases){assert.ok(release.title.en&&release.title.ru);assert.ok(release.sections.length);}
 assert.equal(localized({en:'Hello'},'ru'),'Hello');
});
test('ability records refer to known units and have both languages',()=>{
 const units=JSON.parse(fs.readFileSync(new URL('../docs/data.json',import.meta.url))).units;
 for(const [id,entries] of Object.entries(ABILITIES)){
  assert.ok(units.some(u=>u.Id===id),id);
  for(const entry of entries)assert.ok(entry.name.en&&entry.name.ru&&entry.description.en&&entry.description.ru,id);
 }
});
test('active and passive abilities render in separate sections',()=>{
 const html=abilitySections('Large Grim Reaper','ru',s=>s);
 assert.ok(html.includes('ПАССИВНЫЕ СПОСОБНОСТИ'));assert.ok(html.includes('АКТИВНЫЕ СПОСОБНОСТИ'));
 assert.ok(html.includes('Жатва душ'));assert.ok(html.includes('Ур. 4+'));
 assert.equal(abilitySections('Camera Man','en',s=>s),'');
});
