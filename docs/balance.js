import {directDps, fmt} from './model.js?v=balance-20261103';

// Expected/conditional outcomes are deliberately separate from base attack DPS.
export function passiveOutcomes(id, stats) {
 const base=directDps(stats);
 const gun=stats.Damage/stats.Cooldown||0;
 const hand=stats.HandDamage/stats.HandCooldown||0;
 switch(id){
  case 'Speaker Woman':return [{label:{en:'With Echo',ru:'С учётом эха'},value:base*1.35}];
  case 'Jester Speaker Man':return [{label:{en:'Average with Lucky Strike',ru:'Средний с учётом удачных ударов'},value:base*1.2},{label:{en:'During a Lucky Strike',ru:'При удачном ударе'},value:base*2}];
  case 'Titan Camera Man':return [{label:{en:'Gun + melee, inside melee range',ru:'Пушка + удар в ближнем радиусе'},value:base+gun*.2}];
  case 'Upgraded Titan Camera Man':return [{label:{en:'Gun + hammer against a boss',ru:'Пушка + молот против босса'},value:base+hand*.5}];
  case 'TV Strider':return [{label:{en:'Red + Signal Resonance',ru:'Красный + резонанс сигнала'},value:gun+hand*1.25}];
  case 'Ushanka Camera Man':return [{label:{en:'At full damage ramp',ru:'При полном разгоне урона'},value:base*(stats.RampMax||1)}];
  case 'Rocket Large Camera Man':return [{label:{en:'Direct damage + active burn',ru:'Прямой урон + действующий огонь'},value:base+(stats.BurnDamagePerSec||0)}];
  default:return [];
 }
}
export function screenModes(stats,level){
 if(level<3)return [];
 const gun=stats.Damage/stats.Cooldown||0;
 const cannons=stats.HandDamage/stats.HandCooldown||0;
 const burn=(stats.Damage||0)*2;
 return [
  {id:'red',name:{en:'Red · Destruction',ru:'Красный · Разрушение'},direct:gun+cannons,resonance:gun+cannons*1.25,burn:0},
  {id:'orange',name:{en:'Orange · Incineration',ru:'Оранжевый · Испепеление'},direct:gun*.75+cannons,resonance:gun*.75+cannons*1.25,burn},
  {id:'purple',name:{en:'Purple · Interference',ru:'Фиолетовый · Помехи'},direct:gun*.75+cannons,resonance:gun*.75+cannons*1.25,burn:0},
 ];
}
export function squadGroups(stats){
 const groups=[];
 for(const member of stats.SpawnUnits||[]){
  const old=groups.find(g=>g.Unit===member.Unit&&g.SpawnerHp===member.SpawnerHp&&g.Damage===member.Damage&&g.AttackCooldown===member.AttackCooldown);
  if(old)old.count++;else groups.push({...member,count:1});
 }
 return groups;
}
export function squadDps(stats){return (stats.SpawnUnits||[]).reduce((sum,m)=>sum+(m.AttackCooldown>0?m.Damage/m.AttackCooldown:0),0);}
export function balanceDetails(id,stats,level,lang,escape){
 const pick=v=>v[lang]||v.en;
 const text=(en,ru)=>lang==='ru'?ru:en;
 let html='';
 const outcomes=passiveOutcomes(id,stats);
 if(outcomes.length)html+=`<div class="conditional-stats"><h4>${text('WITH PASSIVES','С УЧЁТОМ ПАССИВОК')}</h4>${outcomes.map(o=>`<div class="detail-line"><span>${escape(pick(o.label))}</span><strong>${fmt(o.value,1)} DPS</strong></div>`).join('')}<p>${text('Per target, while the stated conditions hold. Base DPS above excludes these bonuses.','На одну цель при соблюдении указанных условий. В базовом DPS выше эти бонусы не учтены.')}</p></div>`;
 if(id==='TV Strider'){
  const modes=screenModes(stats,level);
  if(modes.length)html+=`<div class="section-label">${text('SCREEN MODES','РЕЖИМЫ ЭКРАНА')}</div>${modes.map(mode=>`<div class="screen-mode ${mode.id}"><div class="screen-mode-heading"><img src="assets/abilities/tv-screen-${mode.id}.png" alt="" loading="lazy"><h4>${escape(pick(mode.name))}</h4></div><div class="detail-line"><span>${text('Direct DPS','Прямой DPS')}</span><strong>${fmt(mode.direct,1)}</strong></div><div class="detail-line"><span>${text('With resonance','С резонансом')}</span><strong>${fmt(mode.resonance,1)}</strong></div>${mode.burn?`<div class="detail-line"><span>${text('Burn DPS · 5 seconds','Огонь, урон/с · 5 секунд')}</span><strong>+${fmt(mode.burn)}</strong></div><div class="detail-line"><span>${text('Resonance + active burn','Резонанс + действующий огонь')}</span><strong>${fmt(mode.resonance+mode.burn,1)}</strong></div>`:''}${mode.id==='purple'?`<p>${text('Slow: 40% · bosses: 20%. Refreshes for 1 second per hit.','Замедление: 40% · боссы: 20%. Обновляется на 1 секунду при попадании.')}</p>`:''}</div>`).join('')}`;
  else html+=`<p class="tiny-note">${text('Screen Shift unlocks at level 3.','Смена экрана открывается на 3-м уровне.')}</p>`;
 }
 if(id==='Camera Helicopter'){
  html+=`<div class="section-label">${text('SQUAD PER SPAWN','ОТРЯД ЗА ПРИЗЫВ')}</div>${squadGroups(stats).map(m=>`<div class="reinforcement-card"><h4>${m.count} × ${escape(m.Unit)}</h4><div class="detail-line"><span>${text('HP per ally','HP каждого союзника')}</span><strong>${fmt(m.SpawnerHp)}</strong></div><div class="detail-line"><span>${escape(m.AttackName)} · ${text('damage','урон')}</span><strong>${fmt(m.Damage)}</strong></div><div class="detail-line"><span>${text('Attack cooldown','Кулдаун атаки')}</span><strong>${fmt(m.AttackCooldown,2)}${text('s','с')}</strong></div><div class="detail-line"><span>${text('Attack range','Радиус атаки')}</span><strong>${fmt(m.Range)}</strong></div><div class="detail-line"><span>${text('DPS per ally','DPS каждого')}</span><strong>${fmt(m.Damage/m.AttackCooldown,1)}</strong></div><p>${m.AttackFlyToilet?text('Ground + flying targets','Наземные и летающие цели'):text('Ground targets only','Только наземные цели')}</p></div>`).join('')}<div class="conditional-stats"><div class="detail-line"><span>${text('One squad’s attack DPS','Атакующий DPS одного отряда')}</span><strong>${fmt(squadDps(stats),1)}</strong></div><div class="detail-line"><span>${text('Spawn interval','Интервал призыва')}</span><strong>${fmt(stats.Cooldown)}${text('s','с')}</strong></div><div class="detail-line"><span>${text('Total allies alive per Helicopter','Всего живых союзников на вертолёт')}</span><strong>${fmt(stats.SpawnMaxUnits)}</strong></div><div class="detail-line"><span>${text('Ally lifetime','Время жизни союзника')}</span><strong>${fmt(stats.SpawnLifetime)}${text('s','с')}</strong></div><p>${text('Attack DPS excludes collision damage and is not the Helicopter’s direct DPS.','Атакующий DPS не учитывает таран и не является прямым DPS самого вертолёта.')}</p></div>`;
 }
 return html;
}
