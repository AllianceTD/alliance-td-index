import {fmt,chance} from './model.js?v=full-index-20261103';

export const MODE_ORDER=['Easy','Medium','Hard','Insane','Crazy','Halloween','Endless','RNG'];
const names={Easy:['Easy','Лёгкий'],Medium:['Medium','Средний'],Hard:['Hard','Сложный'],Insane:['Insane','Безумный'],Crazy:['Crazy','Сумасшедший'],Halloween:['Halloween','Хэллоуин'],Endless:['Endless','Бесконечный'],RNG:['RNG Mode','RNG-режим']};
export function rngProbabilities(pool,luck=1){
 const power=1/Math.max(1,Number(luck)||1);
 const entries=pool.map(u=>({...u,adjusted:u.Weight**power}));
 const sum=entries.reduce((total,u)=>total+u.adjusted,0);
 return entries.map(u=>({Id:u.Id,probability:sum>0?u.adjusted/sum:0})).sort((a,b)=>b.probability-a.probability||a.Id.localeCompare(b.Id));
}
export function modeCards(data,lang,escape,query='',luck=1){
 const ru=lang==='ru',text=(en,ruText)=>ru?ruText:en;
 const stat=(label,value)=>`<div class="mode-stat"><span>${escape(label)}</span><b>${escape(value)}</b></div>`;
 const list=MODE_ORDER.filter(id=>data.modes[id]&&`${id} ${names[id].join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()));
 const colors=['#85cf80','#61c8da','#efc169','#e8a570','#da8591','#c29ce5','#8eb8e5','#b1ef78'];
 const cards=list.map(id=>{
  const m=data.modes[id],map=data.maps.Maps.find(map=>map.Mode===id),index=MODE_ORDER.indexOf(id);
  const title=names[id][ru?1:0];
  let body=id==='Endless'?stat(text('Coins / cleared wave','Монеты за пройденную волну'),fmt(m.CoinsPerClearedWave))+stat(text('XP / cleared wave','Опыт за пройденную волну'),fmt(m.XpPerClearedWave)):
   stat(text('Win coins','Монеты за победу'),fmt(m.WinCoins))+stat(text('Win XP','Опыт за победу'),fmt(m.XpEarn))+stat(text('Coins / cleared wave on loss','Монеты за волну при поражении'),fmt(m.CoinsPerClearedWave))+stat(text('Win pumpkins','Тыквы за победу'),fmt(m.WinPumpkins||0));
  if(m.WinTickets)body+=stat(text('Win tickets','Тикеты за победу'),fmt(m.WinTickets));
  if(id!=='Endless'&&map?.Waves)body=stat(text('Waves','Волны'),fmt(map.Waves))+body;
  if(m.PumpkinsPerMilestone)body+=stat(text('Pumpkins / 10-wave milestone','Тыквы за каждые 10 волн'),fmt(m.PumpkinsPerMilestone));
  if(m.WaveCrateChance)body+=stat(text('Crate chance per cleared wave','Шанс ящика за пройденную волну'),chance(m.WaveCrateChance));
  if(m.ClanXpPerStep)body+=stat(text('Clan XP / 5 waves','Опыт клана за 5 волн'),fmt(m.ClanXpPerStep));
  return `<article class="mode-card" style="--mode-color:${colors[index]}"><span class="mode-number">${String(index+1).padStart(2,'0')}</span><small>${text('BASE REWARDS','БАЗОВЫЕ НАГРАДЫ')}</small><h3>${escape(title)}</h3>${body}${id==='RNG'?`<p>${text('Build your five-slot team by rolling units during the match. See the guide below.','Собирай команду из пяти ячеек случайными роллами в матче. Подробности ниже.')}</p>`:''}</article>`;
 }).join('');
 return {count:list.length,html:cards+(list.includes('RNG')?rngGuide(data,lang,escape,luck):'')};
}

export function rngGuide(data,lang,escape,luck=1){
 const rng=data.rng;if(!rng)return '';
 const ru=lang==='ru',text=(en,ruText)=>ru?ruText:en;
 const titles={MoreLuck:['More Luck','Больше удачи'],FasterRoll:['Faster Roll','Быстрее роллы'],DoubleRoll:['Double Roll','Двойной ролл'],MoreCash:['More Cash','Больше Cash']};
 const modifiers={
  CashZone:{name:['Cash Zone','Денежная зона'],description:['Stand in the circle to receive 50 in-match Cash each second for 60 seconds. It can appear at most twice per match.','Встань в круг, чтобы получать по 50 Cash в матче каждую секунду в течение 60 секунд. Выпадает не более двух раз за матч.']},
  RapidWaves:{name:['Rapid Waves','Быстрые волны'],description:['The next four waves auto-skip after 1 second.','Следующие четыре волны автоматически пропускаются через 1 секунду.']},
  DoubleProblems:{name:['Double Problems','Двойные проблемы'],description:['Always chosen after wave 40. From wave 41 onward, twice as many enemies spawn for the rest of the match.','Обязательно появляется после 40-й волны. Начиная с 41-й волны и до конца матча появляется вдвое больше врагов.']},
  Discount:{name:['Discount','Скидка'],description:['Unit upgrades cost 25% less for the next ten waves.','Улучшения юнитов стоят на 25% дешевле в течение следующих десяти волн.']},
 };
 const pick=a=>a[ru?1:0];
 const upgradeText=(id,value)=>id==='MoreLuck'?`×${fmt(value,2)}`:id==='FasterRoll'?`${fmt((1-value)*100)}% ${text('shorter roll','короче ролл')}`:id==='DoubleRoll'?text('Two results every roll','Два результата каждого ролла'):`+${fmt((value-1)*100)}% Cash`;
 const options=[1,...rng.Upgrades.MoreLuck.Levels.map(row=>row.Value)];
 const pool=rngProbabilities(rng.UnitPool,luck);
 return `<article class="rng-guide"><div class="rng-guide-head"><span class="rng-symbol" aria-hidden="true">🎲</span><div><small>${text('FUN MODE','РАЗВЛЕКАТЕЛЬНЫЙ РЕЖИМ')} · ${rng.Waves} ${text('WAVES','ВОЛН')}</small><h2>${text('Build your team as you roll.','Собирай команду прямо в матче.')}</h2></div></div><p>${text('RNG uses its own five-slot match loadout. Roll a unit, then Equip it into a slot or Skip the result. Rolls do not add units to your permanent inventory. Roll upgrades use battle Cash and reset with the match.','В RNG отдельный набор из пяти ячеек на матч. Получи случайного юнита, затем выбери ячейку через Equip или пропусти результат через Skip. Роллы не добавляют юнитов в постоянный инвентарь. Улучшения роллов покупаются за Cash в катке и сбрасываются с матчем.')}</p><div class="rng-highlights"><span>${rng.Waves} ${text('waves','волн')}</span><span>${rng.SlotCount} ${text('team slots','ячеек команды')}</span><span>${rng.UnitPool.length} ${text('units in the roll pool','юнит в пуле роллов')}</span><span>${fmt(data.modes.RNG.WinCoins)} ${text('win coins','монет за победу')} + ${fmt(data.modes.RNG.WinTickets)} ${text('tickets','тикета')}</span></div><h3>${text('Match upgrades','Улучшения в матче')}</h3><div class="rng-upgrades">${rng.UpgradeOrder.map(id=>`<section><h4>${escape(pick(titles[id]))}</h4><table><thead><tr><th>${text('Lv.','Ур.')}</th><th>Cash</th><th>${text('Effect','Эффект')}</th></tr></thead><tbody>${rng.Upgrades[id].Levels.map((row,i)=>`<tr><td>${i+1}</td><td>${fmt(row.Cost)}</td><td>${escape(upgradeText(id,row.Value))}</td></tr>`).join('')}</tbody></table></section>`).join('')}</div><h3>${text('Wave modifiers','Модификаторы волн')}</h3><p>${text('A modifier is revealed after waves 10, 20, 30, 40 and 50. Double Problems is fixed at wave 40; the other reveals use the eligible weighted pool.','Модификатор раскрывается после волн 10, 20, 30, 40 и 50. После 40-й всегда выпадают двойные проблемы; остальные выбираются случайно из доступных вариантов с учётом их веса.')}</p><div class="rng-modifiers">${rng.ModifierOrder.map(id=>`<section><h4>${escape(pick(modifiers[id].name))}</h4><p>${escape(pick(modifiers[id].description))}</p></section>`).join('')}</div><h3>${text('Boss checkpoints','Волны с боссами')}</h3><div class="rng-bosses">${rng.Bosses.map(b=>`<span><b>${b.Wave}</b> ${escape(b.Unit)}</span>`).join('')}</div><p>${text('The final Scientist Toilet is configured with 5,000,000 HP.','Финальный туалет-учёный настроен на 5 000 000 HP.')}</p><details class="rng-pool"><summary>${text('Unit roll probabilities','Шансы юнитов в роллах')} · ${pool.length}</summary><label for="rng-luck">${text('More Luck upgrade','Улучшение удачи')}</label><select id="rng-luck">${options.map((value,i)=>`<option value="${value}"${Number(luck)===value?' selected':''}>${i===0?text('No upgrade','Без улучшений'):`${text('Level','Уровень')} ${i}`} · ×${fmt(value,2)}</option>`).join('')}</select><p>${text('These are RNG-mode probabilities, not lobby summon or crate chances. Each chance is its adjusted weight divided by the entire active pool. Luck changes that distribution; it does not add percentage points to each result.','Это шансы RNG-режима, а не саммона или ящиков в лобби. Шанс равен скорректированному весу юнита, делённому на сумму весов всего доступного пула. Удача меняет распределение и не прибавляет процентные пункты к каждому результату.')}</p><div class="rng-pool-table"><table><thead><tr><th>${text('Unit','Юнит')}</th><th>${text('Chance','Шанс')}</th></tr></thead><tbody>${pool.map(row=>`<tr><td><a href="#units/${encodeURIComponent(row.Id)}">${escape(row.Id)}</a></td><td>${chance(row.probability)}</td></tr>`).join('')}</tbody></table></div></details></article>`;
}
