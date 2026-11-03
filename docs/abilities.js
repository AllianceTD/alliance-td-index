// Original records: Game place 90647947106358, 2026-10-29.
// November patch additions: verified Game/Lobby source snapshots, 2026-11-02.
// These are display records, not gameplay settings. Conditional damage is excluded from base DPS.
export const ABILITIES = {
 'Hyper Titan Speaker Man':[
  {name:{en:'Hypercharge',ru:'Гиперзаряд'},description:{en:'Charges for 20 in-game seconds inside Upgraded Titan Cinema Man’s nearest attack radius. A full charge grants +12% damage and +25% attack speed for 20 in-game seconds. Then it can charge again.',ru:'Заряжается 20 игровых секунд в ближнем радиусе атаки Улучшенного Титана Синемамена. Полный заряд даёт +12% урона и +25% скорости атаки на 20 игровых секунд. Затем может зарядиться снова.'}}
 ],
 'Injured Upgraded Titan Camera Man':[
  {name:{en:'Backup Power',ru:'Резервное питание'},description:{en:'Deals 15% more damage while no other Titan is within 15 studs.',ru:'Наносит на 15% больше урона, если в радиусе 15 студов нет другого титана.'}}
 ],
 'Upgraded Titan Saw Arm Camera Man':[
  {name:{en:'Rev Up',ru:'Разгон'},description:{en:'Successful main attacks reduce the main attack cooldown by 3% per stack, up to 5 stacks (15%). Resets after 4 in-game seconds without a hit.',ru:'Успешные основные атаки уменьшают кулдаун основной атаки на 3% за заряд, до 5 зарядов (15%). Сбрасывается после 4 игровых секунд без попаданий.'}}
 ],
 'Upgraded Titan Toxic Gun Camera Man':[
  {name:{en:'Toxic Contamination',ru:'Токсичное заражение'},description:{en:'Toxic shots poison surviving targets. Repeated applications refresh the effect rather than adding independent poison stacks.',ru:'Токсичные выстрелы отравляют выжившие цели. Повторное попадание обновляет эффект, а не добавляет независимые стаки яда.'}},
  {name:{en:'Critical Mass',ru:'Критическая масса'},description:{en:'The core deals 20% more damage when its attack hits at least 5 enemies.',ru:'Ядро наносит на 20% больше урона, когда атака задевает минимум 5 врагов.'}}
 ],
 'Injured Upgraded Titan Speaker Man':[
  {name:{en:'Emergency Output',ru:'Аварийная мощность'},description:{en:'The core laser deals 20% more damage while there are no enemies inside knife range.',ru:'Лазер ядра наносит на 20% больше урона, пока в радиусе ножа нет врагов.'}}
 ],
 'Fat Upgraded Titan Camera Man':[
  {name:{en:'Heavy Swing',ru:'Тяжёлый замах'},description:{en:'Successful gun attacks add a charge, up to 10. The next hammer hit consumes the charges for +3% damage each, up to +30%.',ru:'Успешные атаки пушки дают заряд, максимум 10. Следующее попадание молотом расходует заряды и получает +3% урона за каждый, до +30%.'}}
 ],
 'Golden Large Camera Man':[
  {name:{en:'Golden Volley',ru:'Золотой залп'},description:{en:'Every fifth ranged attack fires three projectiles instead of one.',ru:'Каждая пятая дальняя атака выпускает три снаряда вместо одного.'}},
  {name:{en:'Boss Hunter',ru:'Охотник на боссов'},description:{en:'Deals double damage against enemies marked as bosses.',ru:'Наносит двойной урон врагам, отмеченным как боссы.'}},
  {name:{en:'Golden Bounty',ru:'Золотая награда'},description:{en:'Its killing blows grant its owner double the normal kill Cash in the match. This does not multiply lobby coins.',ru:'За добивание врага владелец получает двойную награду Cash в матче. Монеты лобби этот бонус не умножает.'}}
 ],
 'Ghost Speaker Man':[
  {name:{en:'Ghost Fear',ru:'Призрачный страх'},description:{en:'A surviving enemy hit by a summoned ghost has a 10% chance to retreat for 3 seconds at 40% speed. The enemy then has a 12-second recovery. Bosses retreat for 0.5 seconds with a 60-second cooldown.',ru:'У врага, пережившего столкновение с призванным призраком, есть 10% шанс отступать 3 секунды со скоростью 40%. Затем у цели восстановление 12 секунд. Боссы отступают 0,5 секунды с кулдауном 60 секунд.'}}
 ],
 'Poseidon Camera Man':[
  {name:{en:'Rising Tide',ru:'Нарастающий прилив'},description:{en:'Hits build up to 5 marks on the enemy. Each mark adds 8% damage to Poseidon’s hits, up to +40%. Marks expire after 4 seconds without another hit.',ru:'Попадания накапливают на враге до 5 меток. Каждая даёт +8% урона атакам Посейдона по этой цели, максимум +40%. Метки исчезают через 4 секунды без нового попадания.'}}
 ],
 'Party Titan TV Man':[
  {name:{en:'Party Overload',ru:'Праздничная перегрузка'},description:{en:'Every fifth attack with targets deals 2.5× damage.',ru:'Каждая пятая атака по врагам наносит урон ×2,5.'}}
 ],
 'Large Grim Reaper':[
  {name:{en:'Execution',ru:'Казнь'},description:{en:'Each scythe swing has a 1% chance to execute its main non-boss target. One roll per swing, with a 10-second in-game cooldown after success.',ru:'Каждый взмах косы имеет 1% шанс казнить основную цель, кроме боссов. Одна проверка за взмах; после успеха — кулдаун 10 игровых секунд.'}},
  {name:{en:'Growing Army',ru:'Растущая армия'},description:{en:'Successful resurrections can raise this Grim’s ally cap up to 5 for the current match: 5% from 2 to 3, 2.5% from 3 to 4, and 1% from 4 to 5.',ru:'Успешное воскрешение может увеличить лимит союзников этого Грима до 5 на текущий матч: 5% с 2 до 3, 2,5% с 3 до 4 и 1% с 4 до 5.'}},
  {name:{en:'Soul Collection',ru:'Сбор душ'},description:{en:'Collects one soul per enemy personally killed, including splash kills, up to 50. Kills by summons do not count. Souls reset when sold or when the match ends.',ru:'Получает душу за каждого лично убитого врага, включая сплеш, максимум 50. Убийства призывов не считаются. Души сбрасываются при продаже и в конце матча.'}},
  {active:true,name:{en:'Soul Harvest',ru:'Жатва душ'},description:{en:'At level 4, spend 50 souls to summon a Scientist Toilet ally with 100,000 HP. Cooldown: 60 in-game seconds. Only one such boss can be alive per player.',ru:'На 4-м уровне тратит 50 душ и призывает союзного туалета-учёного со 100 000 HP. Кулдаун — 60 игровых секунд. У игрока может быть только один такой живой босс.'}}
 ],
 'DJ Speaker Man':[
  {name:{en:'DJ Aura',ru:'Аура диджея'},description:{en:'Boosts nearby units. At maximum level: +25% damage, +12% range and −20% attack cooldown. Multiple DJs use the best bonus rather than adding their bonuses together.',ru:'Усиливает ближайших юнитов. На максимальном уровне: +25% урона, +12% дальности и −20% кулдауна атаки. Несколько диджеев дают лучший бонус, а не складывают бонусы.'}}
 ]
};

const active=(en,ru,enDescription,ruDescription,price,cooldown,minLevel=1)=>({active:true,name:{en,ru},description:{en:enDescription,ru:ruDescription},price,cooldown,minLevel});
ABILITIES['Titan Speaker Man 2.0']=[active('Core Barrage','Залп ядра','Fires a burst of 40 core projectiles, each configured for 1,000 damage.','Выпускает залп из 40 снарядов ядра, каждый с базовым уроном 1000.',3000,60)];
ABILITIES['Speaker Woman 2.0']=[active('Katana Spinner','Вращение катан','Spins with katanas for up to 5 seconds. Hits accelerate while damage per hit gradually decreases.','Вращается с катанами до 5 секунд. Попадания ускоряются, а урон каждого попадания постепенно уменьшается.',500,40,3)];
ABILITIES['Glitch Plunger Man']=[active('Glitch Rush','Глитч-рывок','Hold the ability to charge a rush. Charge determines the number of passes, up to 8, with 1.5× damage per pass.','Удерживай способность, чтобы зарядить рывок. Заряд определяет число проходов, максимум 8, с уроном ×1,5 за проход.',1500,45)];
ABILITIES['Upgraded Titan Cinema Man']=[
 active('Cinema Leap','Прыжок Синемы','Leaps to attack an enemy and returns after the attack.','Прыгает к врагу для атаки и затем возвращается.',2000,40),
 active('Cinema Shift','Перемещение Синемы','Choose a valid location to move this Titan. Cannot be used while TV Swarm is active.','Позволяет выбрать допустимое место для перемещения титана. Недоступно, пока активен рой ТВ.',1000,30),
 active('TV Swarm','Рой ТВ','Deploys three TV drones with red, fire and mind-control attacks. Can be toggled.','Выпускает три ТВ-дрона с красным экраном, огнём и контролем разума. Переключаемая способность.',null,3),
 active('Cinema Spin','Вращение Синемы','Performs a short spin with three timed hits against enemies in sword range.','Выполняет короткое вращение с тремя попаданиями по врагам в радиусе меча.',2500,45)
];
for(const id of ['Camera Strider','Speaker Strider'])ABILITIES[id]=[active('Strider Rush','Перемещение страйдера','Choose a valid location for the strider to walk to.','Выбери допустимую точку, к которой страйдер перейдёт.',0,60)];
ABILITIES['TV Strider']=[active('Strider Blink','Телепорт страйдера','Teleports the strider to a valid location you select.','Телепортирует страйдера в выбранное допустимое место.',0,60)];
ABILITIES['TV Strider'].push(
 {name:{en:'Signal Resonance',ru:'Резонанс сигнала'},description:{en:'A successful screen hit marks its target for 1 in-game second. This Strider’s cannons deal 25% more damage to its marked targets. Marks do not stack, and another Strider cannot use them. Flying enemies and glasses-blocked screen hits cannot be marked.',ru:'Успешное попадание экраном помечает цель на 1 игровую секунду. Пушки этого страйдера наносят ей на 25% больше урона. Метки не складываются и не усиливают другой страйдер. Экран не помечает летающих врагов и цели, защищённые очками.'}},
 {...active('Screen Shift','Смена экрана','Cycles Red → Orange → Purple → Red. Red retains full screen damage. Orange and Purple retain 75%. Orange burns for twice the base screen hit damage per second for 5 in-game seconds (800 burn DPS at max level). Purple slows normal enemies by 40% and bosses by 20%; hits refresh the 1-second slow. Burns refresh instead of stacking; only the strongest slow applies. Cannons keep their base damage in every mode.', 'Переключает Красный → Оранжевый → Фиолетовый → Красный. Красный сохраняет полный урон экрана. Оранжевый и фиолетовый сохраняют 75%. Оранжевый поджигает на 5 игровых секунд: урон в секунду равен удвоенному базовому урону экрана за попадание (800 урона/с на максимальном уровне). Фиолетовый замедляет обычных врагов на 40%, боссов — на 20%; попадания обновляют замедление длительностью 1 секунда. Огонь обновляется, а не складывается; действует самое сильное замедление. Урон пушек во всех режимах сохраняется.',0,10,3),icon:'assets/abilities/tv-screen-shift.png'}
);
ABILITIES['Titan TV Man']=[{name:{en:'White Flash',ru:'Белая вспышка'},description:{en:'Every 8 accumulated in-game seconds of attacking, its screen stuns surviving targets for 0.75 seconds, or 0.2 seconds for bosses. Glasses block the flash. A target has an 8-second immunity shared across all Titan TV Men.',ru:'Каждые 8 накопленных игровых секунд атаки экран оглушает выживших врагов на 0,75 секунды, боссов — на 0,2 секунды. Очки блокируют вспышку. После срабатывания цель получает иммунитет на 8 секунд ко всем Титанам ТВ.'}}];
ABILITIES['Speaker Woman']=[{name:{en:'Echo',ru:'Эхо'},description:{en:'After 0.25 in-game seconds, repeats 35% of the attack damage against the surviving enemies that the original attack actually hit. Echo cannot trigger itself. The attack cone is now 55°.',ru:'Через 0,25 игровой секунды повторяет 35% урона атаки по выжившим врагам, которых задело исходное попадание. Эхо не запускает новое эхо. Угол атаки увеличен до 55°.'}}];
ABILITIES['Titan Camera Man']=[{name:{en:'Close Combat',ru:'Ближний бой'},description:{en:'The gun deals 20% more damage to enemies inside this Titan’s melee attack range. This does not multiply the melee hit or the attacks of summoned Titans.',ru:'Пушка наносит на 20% больше урона врагам в радиусе ближней атаки этого титана. Ближний удар и атаки призванных титанов этот бонус не усиливает.'}}];
ABILITIES['Upgraded Titan Camera Man']=[{name:{en:'Titan Breaker',ru:'Сокрушитель титанов'},description:{en:'Hammer attacks deal 50% more damage against bosses, including Glitch Toilet. The gun keeps its normal damage.',ru:'Молот наносит на 50% больше урона боссам, включая Глитч-туалета. Урон пушки сохраняется.'}}];
ABILITIES['Jester Speaker Man']=[{name:{en:'Lucky Strike',ru:'Удачный удар'},description:{en:'Each attack has a 20% chance to deal double damage to its entire cone. One roll per attack, shared by every target hit.',ru:'Каждая атака имеет 20% шанс нанести двойной урон по всему конусу. Одна проверка за атаку, общая для всех задетых целей.'}}];
ABILITIES['Camera Helicopter']=[{name:{en:'Reinforcements',ru:'Подкрепление'},description:{en:'The squad changes with each upgrade: Camera Man → 2 Camera Men → Large Camera Man → Large Camera Man + 2 Camera Men → Titan Camera Man. Each ally uses one attack: gun, knife or laser respectively. Camera Men and the Titan can hit flying enemies; the Large Camera Man cannot. Allies use compact, proportional models. Upgrading replaces the previous squad; the new level begins spawning immediately.',ru:'Состав отряда меняется при улучшении: Камерамен → 2 Камерамена → Большой Камерамен → Большой Камерамен + 2 Камерамена → Титан Камерамен. У каждого союзника одна атака: пушка, нож или лазер соответственно. Обычные камерамены и титан бьют воздух, большой камерамен — только землю. Модели уменьшены с сохранением пропорций. Улучшение заменяет старый отряд; призыв нового уровня начинается сразу.'}}];
ABILITIES['Ushanka Camera Man']=[{name:{en:'Damage Ramp',ru:'Нарастающий урон'},description:{en:'Each main attack builds 10% additional damage for the next attack, up to 2× base damage. Resets after more than 2 in-game seconds without attacking. Changing targets does not reset it. At max level: 2,812.5 base DPS, up to 5,625 at full ramp.',ru:'Каждая основная атака добавляет 10% урона для следующей, максимум до удвоенного базового урона. Сбрасывается после паузы в атаках дольше 2 игровых секунд. Смена цели не сбрасывает усиление. На максимальном уровне: 2812,5 базового DPS, до 5625 при полном разгоне.'}}];
ABILITIES['Rocket Large Camera Man']=[{name:{en:'Burn',ru:'Поджог'},description:{en:'Splash rockets apply burn. At max level it deals 90 damage every 0.35 in-game seconds for 4.5 seconds: about 257.1 additional DPS while burning. Direct damage is 2,000 DPS; burn is shown separately.',ru:'Ракеты со сплешем поджигают врагов. На максимальном уровне огонь наносит 90 урона каждые 0,35 игровой секунды в течение 4,5 секунды: около 257,1 дополнительного DPS во время горения. Прямой урон — 2000 DPS; огонь указан отдельно.'}}];
Object.assign(ABILITIES['Large Grim Reaper'].find(a=>a.active),{price:0,cooldown:60,minLevel:4});

export function abilitySections(id,lang,escape){
 const list=ABILITIES[id]||[];
 const pick=value=>value?.[lang]||value?.en||'';
 return [false,true].map(active=>{
  const entries=list.filter(a=>!!a.active===active);if(!entries.length)return '';
  const heading=lang==='ru'?(active?'АКТИВНЫЕ СПОСОБНОСТИ':'ПАССИВНЫЕ СПОСОБНОСТИ'):(active?'ACTIVE ABILITIES':'PASSIVE ABILITIES');
  return `<div class="section-label ability-section-label">${heading}</div>${entries.map(a=>`<div class="ability-block ${active?'is-active':'is-passive'}"><span class="ability-kind">${active?'⚡':'✦'} ${lang==='ru'?(active?'Активная':'Пассивная'):(active?'Active':'Passive')}</span>${a.icon?`<img class="ability-icon" src="${escape(a.icon)}" alt="" loading="lazy">`:''}<h4>${escape(pick(a.name))}</h4><p>${escape(pick(a.description))}</p>${active&&a.cooldown!=null?`<div class="ability-facts"><span>${lang==='ru'?'КД':'Cooldown'}: ${a.cooldown}${lang==='ru'?'с':'s'}</span>${a.price!=null?`<span>${lang==='ru'?'Цена':'Cost'}: ${a.price} Cash</span>`:''}<span>${lang==='ru'?'Ур.':'Lv.'} ${a.minLevel||1}+</span></div>`:''}</div>`).join('')}`;
 }).join('');
}
