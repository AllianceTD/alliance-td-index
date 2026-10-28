import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {russianText} from '../docs/locale.js';
const data=JSON.parse(fs.readFileSync(new URL('../docs/data.json',import.meta.url)));
test('every material name and description has a Russian translation',()=>{
 for(const item of Object.values(data.materials))for(const key of ['DisplayName','Description']){
  assert.notEqual(russianText(item[key]),item[key]);
  assert.doesNotMatch(russianText(item[key]).replaceAll('G-туалет','туалет'),/[A-Za-z]/);
 }
});
test('all unit names and enemy names translate while version numbers survive',()=>{
 for(const name of [...data.units.map(u=>u.DisplayName),...Object.keys(data.drops)])assert.notEqual(russianText(name),name);
 assert.equal(russianText('G-Toilet 3.0'),'G-туалет 3.0');
 assert.equal(russianText('Camera Woman 2.0'),'Камера-вумен 2.0');
});
test('long phrases take precedence and existing Russian text remains unchanged',()=>{
 assert.equal(russianText('Core Laser'),'Лазер ядра');
 assert.equal(russianText('Heavy Arm Mechanism'),'Механизм тяжёлой руки');
 assert.equal(russianText('Механизм тяжёлой руки'),'Механизм тяжёлой руки');
 assert.equal(russianText('35% / 0.3s'),'35% / 0.3с');
 assert.ok(russianText('Heavy Arm Mechanism Heavy Arm Mechanism').includes('тяжёлой'));
});
