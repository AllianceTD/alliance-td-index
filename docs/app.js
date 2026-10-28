import { RARITIES, levels, levelStats, directDps, maxDps, isSummoner, fmt, compact, chance, filterUnits } from './model.js';

const paths = {
  camera:'M3 7h12v10H3zM15 10l6-3v10l-6-3M6 4h6',
  units:'M8 3h8v7H8zM5 13h14v8H5zM3 14v6M21 14v6M10 10v3M14 10v3',
  backpack:'M7 7V5a5 5 0 0 1 10 0v2M6 7h12l2 14H4zM8 13h8v5H8z',
  craft:'M3 21l9-9M13 3l8 8-4 4-8-8zM5 3l3 3M18 18l3 3',
  enemy:'M5 3h14v9H5zM3 12h18v3a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7zM9 7h6M9 22v-3M15 22v-3',
  flag:'M5 22V3M5 4c5-5 9 5 14 0v10c-5 5-9-5-14 0',
  book:'M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2zM12 6v15',
  bookmark:'M6 3h12v19l-6-4-6 4z',
  search:'M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  sparkles:'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
  mouse:'M5 3l14 9-7 1-3 7z',
  damage:'M4 20L18 6M14 3l7 7M3 16l5 5M5 3l16 16',
  range:'M12 2v4M12 18v4M2 12h4M18 12h4M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  clock:'M12 7v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  crate:'M3 7l9-5 9 5v11l-9 5-9-5zM3 7l9 5 9-5M12 12v11M7 4l10 6',
  coin:'M12 6v12M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  plane:'M2 12l20-9-9 19-3-9zM10 13L22 3',
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.sparkles}"/></svg>`;
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const translations = {
 en:{companion:'Your game companion',saved:'Saved',explore:'EXPLORE THE INDEX',units:'Units',items:'Items & crates',crafts:'Crafting',toilets:'Toilets & drops',modes:'Game modes',knowUnit:'Know your next unit.',sidebarNote:'Check its upgrades, find its recipe, and plan your team.',gameData:'From the game index',eyebrow:'THE ALLIANCE, AT A GLANCE',fieldGuide:'FIELD GUIDE',tapCard:'Select a card to explore',statsNote:'Stats at 1× speed · No external buffs',collectionNote:'Bookmarks stay in this browser',footerNote:'Built for the community. Made to help you plan.',compare:'Compare units',comparison:'Unit comparison',all:'All units',summon:'Summon',summoner:'Summoners',allRarities:'All rarities',rarity:'Rarity',name:'Name A–Z',highest:'Highest DPS',lowest:'Lowest cost',search:'Search your alliance…',details:'UNIT DETAILS',damage:'Damage',range:'Range',cooldown:'Cooldown',dps:'Direct DPS',upgrade:'Next upgrade',sell:'Sell value',limit:'Placement limit',attacks:'ATTACKS & EFFECTS',obtain:'HOW TO GET',level:'Level',max:'MAX',base:'Base attacks · without conditional passives',missing:'No entries found',trySearch:'Try another search or clear your filters.',reset:'Clear filters',bookmarked:'Added to your saved units',unbookmarked:'Removed from saved units',chooseTwo:'Choose at least two units to compare.',maxCompare:'You can compare up to three units.',noDps:'Summoner / support',sourceMissing:'Source not listed in the current index',allItems:'All items',materials:'Materials',crates:'Crates',coin:'Coins',tickets:'Tickets',available:'Available',soon:'Coming soon',dropChance:'Drop chance',baseRewards:'BASE REWARDS',winCoins:'Win coins',winXp:'Win XP',loseCoins:'Coins / cleared wave on loss',winPumpkins:'Win pumpkins',snapshot:'Updated',noLimits:'Not listed',craftHint:'Crafting consumes the listed units, materials and currencies.',enemyHint:'Material drops from the current index. Enemy HP and speed need verification in the match place.',modeHint:'Base rewards before map modifiers, passes, potions and friend bonuses. Lobby data snapshot.',ready:'Explore the catalog',seconds:'s',special:'Additional attacks are included in direct DPS when available.',unverifiedLimit:'Reference from the lobby index; match limits may differ.',cost:'Placement cost',materialSources:'DROPS FROM',recipe:'CRAFTING RECIPE',dropNote:'Probabilities are per eligible drop check. Endless rare boss materials use one check per boss type per wave.'},
 ru:{companion:'Твой справочник по игре',saved:'Избранное',explore:'РАЗДЕЛЫ СПРАВОЧНИКА',units:'Юниты',items:'Предметы и ящики',crafts:'Крафты',toilets:'Туалеты и дроп',modes:'Режимы',knowUnit:'Выбери следующего юнита.',sidebarNote:'Изучи улучшения, найди рецепт и собери свою команду.',gameData:'Из игрового индекса',eyebrow:'ВСЯ ALLIANCE — ПЕРЕД ТОБОЙ',fieldGuide:'СПРАВОЧНИК',tapCard:'Выбери карточку',statsNote:'Характеристики при 1× · Без внешних баффов',collectionNote:'Избранное хранится в этом браузере',footerNote:'Для сообщества. Чтобы проще собрать команду.',compare:'Сравнить юнитов',comparison:'Сравнение юнитов',all:'Все юниты',summon:'Саммон',summoner:'Призыватели',allRarities:'Все редкости',rarity:'Редкость',name:'Название A–Z',highest:'Больше DPS',lowest:'Дешевле',search:'Найти в справочнике…',details:'ИНФОРМАЦИЯ О ЮНИТЕ',damage:'Урон',range:'Дальность',cooldown:'Кулдаун',dps:'Прямой DPS',upgrade:'Следующее улучшение',sell:'Продажа',limit:'Лимит установки',attacks:'АТАКИ И ЭФФЕКТЫ',obtain:'КАК ПОЛУЧИТЬ',level:'Уровень',max:'МАКС',base:'Базовые атаки · без условных пассивок',missing:'Ничего не найдено',trySearch:'Попробуй другой запрос или сбрось фильтры.',reset:'Сбросить фильтры',bookmarked:'Добавлено в избранное',unbookmarked:'Удалено из избранного',chooseTwo:'Выбери минимум двух юнитов.',maxCompare:'Можно сравнить до трёх юнитов.',noDps:'Призыв / поддержка',sourceMissing:'Источник не указан в текущем индексе',allItems:'Все предметы',materials:'Материалы',crates:'Ящики',coin:'Монеты',tickets:'Тикеты',available:'Доступно',soon:'Скоро',dropChance:'Шанс выпадения',baseRewards:'БАЗОВЫЕ НАГРАДЫ',winCoins:'Монеты за победу',winXp:'Опыт за победу',loseCoins:'Монеты за волну при поражении',winPumpkins:'Тыквы за победу',snapshot:'Обновлено',noLimits:'Не указан',craftHint:'Крафт расходует указанных юнитов, материалы и валюту.',enemyHint:'Дроп материалов из текущего индекса. Здоровье и скорость врагов нужно проверить в матч-плейсе.',modeHint:'Награды без множителей карты, пропусков, зелий и бонусов друзей. Снимок данных лобби.',ready:'Исследуй каталог',seconds:'с',special:'Дополнительные атаки включены в прямой DPS, если они указаны.',unverifiedLimit:'Справочник лобби; фактический лимит в матче может отличаться.',cost:'Цена установки',materialSources:'ВЫПАДАЕТ С',recipe:'РЕЦЕПТ КРАФТА',dropNote:'Шансы указаны на подходящую проверку дропа. В Endless редкие материалы проверяются один раз на тип босса за волну.'},
};
translations.en.boosts='Potions'; translations.ru.boosts='Зелья';
function readStorage(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
let lang = readStorage('atd-language','en'); if(!translations[lang])lang='en';
let bookmarks = readStorage('atd-bookmarks',[]); if(!Array.isArray(bookmarks))bookmarks=[];
let DATA, ASSETS, page='units', query='', rarity='', sort='rarity', source='', savedOnly=false, selected=null, selectedLevel=0, itemKind='', compare=[];
const t = key => translations[lang][key] || translations.en[key] || key;
const saveStorage = (key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
function asset(raw){const id=String(raw||'').match(/(?:rbxassetid:\/\/)?(\d+)/)?.[1];return id?ASSETS[id]:null;}
function image(raw, name, className=''){const url=asset(raw);return url?`<img class="${className}" src="${url}" alt="${esc(name)}" loading="lazy">`:`<span class="card-visual-fallback ${className}">${icon('units')}</span>`;}
function color(rarity){return RARITIES[rarity]||'#a9b3c2';}
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,2600);}
function hydration(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
function translate(){
 document.documentElement.lang=lang;
 document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
 $('language').innerHTML=`${lang.toUpperCase()} <span>⌄</span>`;
 $('footer-language').setAttribute('aria-label',lang==='ru'?'Язык: русский. Переключить на английский.':'Language: English. Switch to Russian.');
 $('footer-language').querySelectorAll('[data-lang]').forEach(option=>option.classList.toggle('active',option.dataset.lang===lang));
 $('search').placeholder=t('search');
 $('rarity').options[0].textContent=t('allRarities');
 const sortOptions=['rarity','name','highest','lowest']; [...$('sort').options].forEach((o,i)=>o.textContent=t(sortOptions[i]));
 $('saved-count').textContent=bookmarks.length;
 const date=new Date(DATA.exportedAt).toLocaleDateString(lang==='ru'?'ru-RU':'en-GB',{day:'numeric',month:'short',year:'numeric'});
 $('update-date').textContent=date;$('snapshot-label').textContent=`${t('snapshot')} ${date}`;
}
function heading(){
 const title={units:lang==='en'?'Find your next <em>favorite.</em>':'Найди нового <em>любимчика.</em>',items:lang==='en'?'A little loot. <em>A lot of possibilities.</em>':'Предметы для <em>больших планов.</em>',crafts:lang==='en'?'Build something <em>stronger.</em>':'Создай кого-то <em>сильнее.</em>',toilets:lang==='en'?'Know your <em>enemy.</em>':'Знай своего <em>врага.</em>',modes:lang==='en'?'Pick your next <em>challenge.</em>':'Выбери новое <em>испытание.</em>'};
 const desc={units:lang==='en'?'Every unit. Every upgrade. One place to explore.':'Юниты, улучшения и способы получения — в одном месте.',items:lang==='en'?'Crates, crafting materials, and where to find them.':'Ящики, материалы для крафта и где их найти.',crafts:t('craftHint'),toilets:t('enemyHint'),modes:t('modeHint')};
 $('page-title').innerHTML=title[page];$('page-description').textContent=desc[page];$('section-title').textContent=t(page);
 $('section-icon').innerHTML=icon({units:'units',items:'backpack',crafts:'craft',toilets:'enemy',modes:'flag'}[page]);
 document.querySelectorAll('.nav-link').forEach(a=>{a.classList.toggle('active',a.dataset.page===page);if(a.dataset.page===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 $('saved-button').classList.toggle('active',savedOnly);
 const unitPage=page==='units';$('rarity').hidden=!unitPage;$('sort').hidden=!unitPage;
 const quick=unitPage?[['',t('all'),'units'],['summon',t('summon'),'sparkles'],['craft',t('crafts'),'craft'],['summoner',t('summoner'),'flag']]:page==='items'?[['',t('allItems'),'backpack'],['Material',t('materials'),'craft'],['Crate',t('crates'),'crate'],['Boost',t('boosts'),'sparkles']]:[];
 $('quick-filters').innerHTML=quick.map(([key,title,ico])=>`<button class="filter-chip ${(unitPage?source:itemKind)===key?'active':''}" data-filter="${key}">${icon(ico)}${esc(title)}</button>`).join('');
 const narrow=page==='units'||page==='items';document.querySelector('.index-body').classList.toggle('no-detail',!narrow);$('catalog').classList.toggle('wide',!narrow);
}
function unitCard(unit){
 const dps=maxDps(unit);const saved=bookmarks.includes(unit.Id);
 return `<article class="unit-card ${selected?.Id===unit.Id?'selected':''}" style="--rarity:${color(unit.Rarity)}"><span class="card-price">$ ${compact(unit.Price)}</span><button class="favorite ${saved?'active':''}" data-save="${esc(unit.Id)}" aria-label="${saved?'Remove bookmark':'Bookmark'} ${esc(unit.DisplayName)}" aria-pressed="${saved}">${icon('bookmark')}</button><button class="compare-toggle ${compare.includes(unit.Id)?'active':''}" data-compare="${esc(unit.Id)}" aria-label="Compare ${esc(unit.DisplayName)}" aria-pressed="${compare.includes(unit.Id)}">${compare.includes(unit.Id)?'✓':'+'}</button><button class="card-main" data-select="${esc(unit.Id)}" aria-label="${esc(unit.DisplayName)}, ${esc(unit.Rarity)}">${image(unit.Icon,unit.DisplayName,'card-image')}<span class="card-info"><span class="card-name">${esc(unit.DisplayName||unit.Id)}</span><span class="card-meta"><span class="card-rarity">${esc(unit.Rarity)}</span><span class="card-dps">${dps>0?`${compact(dps)} DPS`:isSummoner(unit)?t('summoner'):(lang==='en'?'Support':'Поддержка')}</span></span></span></button></article>`;
}
function items(){return [...Object.entries(DATA.materials).map(([Id,u])=>({...u,Id,Kind:'Material'})),...Object.entries(DATA.crates.Crates||{}).filter(([id,u])=>u.OpeningStyle!=='Voucher'&&u.OpeningStyle!=='Terminal').map(([Id,u])=>({...u,Id,Kind:'Crate',Rarity:u.Rarity||'Exclusive'})),...Object.entries(DATA.boosts).map(([Id,u])=>({...u,Id:'boost:'+Id,Kind:'Boost',Rarity:'Potion'}))];}
function itemCard(item){return `<article class="unit-card ${selected?.Id===item.Id?'selected':''}" style="--rarity:${color(item.Rarity)}"><button class="card-main" data-item="${esc(item.Id)}">${image(item.Icon,item.DisplayName||item.Id,'card-image')}<span class="card-info"><span class="card-name">${esc(item.DisplayName||item.Id)}</span><span class="card-meta"><span class="card-rarity">${esc(item.Rarity||t('crates'))}</span><span class="card-dps">${item.Kind==='Material'?t('materials'):item.Kind==='Boost'?t('boosts'):t('crates')}</span></span></span></button></article>`;}
function empty(){return `<div class="empty-state">${icon('search')}<h3>${t('missing')}</h3><p>${t('trySearch')}</p><button class="reset-button" data-reset>${t('reset')}</button></div>`;}
function renderCatalog(){
 heading();let html='',count=0;const q=query.trim().toLowerCase();
 if(page==='units'){
  const list=filterUnits(DATA.units,{query,rarity,source,savedOnly,bookmarks,sort,orders:DATA.orders});count=list.length;html=list.map(unitCard).join('');
 }else if(page==='items'){
  const list=items().filter(x=>(!itemKind||x.Kind===itemKind)&&`${x.Id} ${x.DisplayName}`.toLowerCase().includes(q));count=list.length;html=list.map(itemCard).join('');
 }else if(page==='crafts'){
  const list=DATA.crafts.filter(x=>`${x.Output} ${(x.Inputs||[]).map(i=>i.Unit||i.Material).join(' ')}`.toLowerCase().includes(q));count=list.length;html=list.map(recipeCard).join('');
 }else if(page==='toilets'){
  const list=Object.entries(DATA.drops).filter(([name,drops])=>`${name} ${drops.map(x=>x.Item).join(' ')}`.toLowerCase().includes(q));count=list.length;
  html=`<div class="info-banner">${esc(t('enemyHint'))} ${esc(t('dropNote'))}</div>`+list.map(([name,drops])=>`<article class="enemy-card"><div class="enemy-icon">${icon('enemy')}</div><h3>${esc(name)}</h3><p>${t('dropChance')}</p>${drops.map(d=>`<div class="drop-item">${image(DATA.materials[d.Item]?.Icon,d.Item)}<span>${esc(d.Item)}</span><b>${chance(d.Chance)}</b></div>`).join('')}</article>`).join('');
 }else{
  const list=Object.entries(DATA.modes).filter(([name])=>name.toLowerCase().includes(q));count=list.length;
  const colors=['#85cf80','#61c8da','#efc169','#e8a570','#da8591','#c29ce5','#8eb8e5'];
  html=`<div class="info-banner">${esc(t('modeHint'))}</div>`+list.map(([name,m],i)=>`<article class="mode-card" style="--mode-color:${colors[i]}"><span class="mode-number">0${i+1}</span><small>${t('baseRewards')}</small><h3>${esc(name)}</h3>${name==='Endless'?`<div class="mode-stat"><span>${lang==='en'?'Coins / cleared wave':'Монеты за волну'}</span><b>${fmt(m.CoinsPerClearedWave)}</b></div><div class="mode-stat"><span>${lang==='en'?'XP / cleared wave':'Опыт за волну'}</span><b>${fmt(m.XpPerClearedWave)}</b></div><p>${lang==='en'?'Additional rewards are rolled at wave milestones.':'На этапах волн разыгрываются дополнительные награды.'}</p>`:[['winCoins',m.WinCoins],['winXp',m.XpEarn],['loseCoins',m.CoinsPerClearedWave],['winPumpkins',m.WinPumpkins]].map(([key,value])=>`<div class="mode-stat"><span>${t(key)}</span><b>${fmt(value||0)}</b></div>`).join('')}</article>`).join('');
 }
 if(!count)html=empty();$('catalog').innerHTML=html;$('result-count').textContent=`${count} ${lang==='ru'?'найдено':'entries'}`;
}
function recipeCard(recipe){
 const unit=DATA.units.find(u=>u.Id===recipe.Output);
 return `<article class="recipe-card">${recipe.Enabled===false?`<span class="recipe-status">${t('soon')}</span>`:''}<div class="recipe-head">${image(unit?.Icon,recipe.Output)}<div><h3>${esc(recipe.Output)}</h3><small>${esc(unit?.Rarity||'')}</small></div></div>${(recipe.Inputs||[]).map(input=>{const name=input.Unit||input.Material;const found=DATA.units.find(u=>u.Id===name)||DATA.materials[name];return `<div class="recipe-input">${image(found?.Icon,name)}<span>${esc(name)}</span><b>×${fmt(input.Amount)}</b></div>`;}).join('')}${recipe.CoinCost||recipe.TicketCost?`<div class="recipe-price">${recipe.CoinCost?`<span>${fmt(recipe.CoinCost)} ${t('coin')}</span>`:''}${recipe.TicketCost?`<span>${fmt(recipe.TicketCost)} ${t('tickets')}</span>`:''}</div>`:''}</article>`;
}
function stat(iconName,title,value){return `<div class="stat-box"><span>${icon(iconName)}${esc(title)}</span><strong>${esc(value)}</strong></div>`;}
function line(title,value){return `<div class="detail-line"><span>${esc(title)}</span><strong>${esc(value)}</strong></div>`;}
function sources(unit){
 const entries=(unit.Sources||[]).filter(s=>!(unit.Id===DATA.GroupChestConfig?.BonusUnit&&s.Title==='Group / VIP Chest'));
 if(unit.Id===DATA.GroupChestConfig?.BonusUnit)entries.push({Kind:'Event',Title:'Group Chest',Detail:chance(DATA.GroupChestConfig.BonusUnitChance)});
 if(unit.Id===DATA.VIPChestConfig?.BonusUnit)entries.push({Kind:'Event',Title:'VIP Chest',Detail:chance(DATA.VIPChestConfig.BonusUnitChance)});
 return entries.length?entries.map(s=>`<div class="source-entry">${icon({Craft:'craft',Crate:'crate',Summon:'sparkles',Robux:'coin'}[s.Kind]||'flag')}<div><b>${esc(s.Title)}</b>${s.Detail?`<small>${esc(s.Detail)}</small>`:''}</div></div>`).join(''):`<p class="tiny-note">${t('sourceMissing')}</p>`;
}
function effectBlocks(unit,s){
 let html='';
 for(const [prefix,name]of [['','Main attack'],['Hand',s.TwoRangeName||'Secondary attack'],['Knife','Knife']]){
  if(!Number(s[`${prefix}Damage`]))continue;
  const type=s[`${prefix}AttackType`]||'Single';const range=s[prefix?`${prefix}Range`:'Range'];const cd=s[`${prefix}Cooldown`];
  html+=`<div class="attack-block"><b>${esc(name)}</b><p>${fmt(s[`${prefix}Damage`],1)} DMG · ${fmt(cd,2)}${t('seconds')} · ${esc(type)}${range?` · ${fmt(range,1)} ${t('range').toLowerCase()}`:''}</p></div>`;
 }
 const effects=[];
 if(s.SplashRadius)effects.push(`Splash radius: ${fmt(s.SplashRadius,1)}`);
 if(s.SlowPercent)effects.push(`Slow: ${fmt(s.SlowPercent)}%${s.SlowDuration?` / ${fmt(s.SlowDuration,1)}s`:''}`);
 if(s.BleedDamagePerSec)effects.push(`Bleed: ${fmt(s.BleedDamagePerSec)} DPS / ${fmt(s.BleedCd,1)}s`);
 if(s.BurnDamagePerSec)effects.push(`Burn: ${fmt(s.BurnDamagePerSec)} DPS`);
 if(s.SpawnerHp)effects.push(`Summon HP: ${fmt(s.SpawnerHp)}`);
 if(s.SpawnCooldown)effects.push(`Summon cooldown: ${fmt(s.SpawnCooldown,1)}s`);
 if(s.SpawnMaxUnits)effects.push(`Summon limit: ${fmt(s.SpawnMaxUnits)}`);
 if(s.SpawnUnit)effects.push(`Summons: ${s.SpawnUnit}`);
 if(effects.length)html+=`<div class="attack-block"><b>${lang==='en'?'Additional effects':'Дополнительные эффекты'}</b><p>${effects.map(esc).join('<br>')}</p></div>`;
 return html;
}
function renderDetails(){
 if(!selected){$('details').innerHTML=`<div class="empty-state">${icon('mouse')}<p>${t('tapCard')}</p></div>`;return;}
 const unit=selected;const isUnit=page==='units';const stats=levelStats(unit,selectedLevel);const levelList=levels(unit);
 let html=`<div class="detail-topline"><span>${isUnit?t('details'):t('items').toUpperCase()}</span><button class="detail-close" data-close-detail aria-label="Close details">×</button></div><div class="detail-hero" style="--rarity:${color(unit.Rarity)}">${image(unit.Icon,unit.DisplayName||unit.Id)}<span class="rarity-badge">${esc(unit.Rarity||t('crates'))}</span></div><h3 class="detail-name">${esc(unit.DisplayName||unit.Id)}</h3>`;
 if(isUnit){
  const tags=[];if(stats.AttackType)tags.push(stats.AttackType);if(stats.AttackFlyToilet||stats.AttackFlyToiletHand)tags.push(lang==='en'?'Targets air':'Бьёт воздух');if(isSummoner(unit))tags.push(t('summoner'));
  html+=`<div class="detail-subtitle">${esc(t('base'))}</div><div class="level-tabs" aria-label="Upgrade level">${levelList.map((_,i)=>`<button data-level="${i}" class="${i===selectedLevel?'active':''}" aria-pressed="${i===selectedLevel}">${i===levelList.length-1?t('max'):`LV ${i+1}`}</button>`).join('')}</div><div class="stats-grid">${stat('damage',t('damage'),fmt(stats.Damage||0,1))}${stat('range',t('range'),fmt(stats.Range||0,1))}${stat('clock',t('cooldown'),`${fmt(stats.Cooldown||0,2)}${t('seconds')}`)}</div><div class="dps-box"><small>${t('dps')}</small><strong>${directDps(stats)>0?fmt(directDps(stats),1):'—'}</strong></div><p class="tiny-note">${t('special')}</p><div class="section-label">${t('cost').toUpperCase()}</div>${line(t('cost'),`$ ${fmt(unit.Price)}`)}${stats.UpgradePrice&&selectedLevel<levelList.length-1?line(t('upgrade'),`$ ${fmt(stats.UpgradePrice)}`):''}${line(t('sell'),stats.SellPrice?`$ ${fmt(stats.SellPrice)}`:'—')}${DATA.limits[unit.Id]?line(t('limit'),DATA.limits[unit.Id]):''}<div class="detail-tags" style="margin-top:9px">${tags.map(x=>`<span class="detail-tag">${esc(x)}</span>`).join('')}</div>${DATA.limits[unit.Id]?`<p class="tiny-note">${t('unverifiedLimit')}</p>`:''}<div class="section-label">${t('attacks')}</div>${effectBlocks(unit,stats)}<div class="section-label">${t('obtain')}</div>${sources(unit)}`;
 }else if(unit.Kind==='Boost'){
  html+=`<div class="section-label">${t('boosts').toUpperCase()}</div>${line(lang==='en'?'Effect':'Эффект',unit.Description)}${line(lang==='en'?'Duration':'Длительность',`${fmt(unit.DurationSeconds/60)} min`)}`;
 }else if(unit.Kind==='Material'){
  html+=`<p class="tiny-note">${esc(unit.Description||'')}</p><div class="section-label">${t('materialSources')}</div>`;
  for(const [name,drops]of Object.entries(DATA.drops)){for(const drop of drops){if(drop.Item===unit.Id)html+=line(name,chance(drop.Chance));}}
  html+=`<p class="tiny-note">${t('dropNote')}</p><div class="section-label">${t('recipe')}</div>`;
  DATA.crafts.filter(r=>(r.Inputs||[]).some(x=>x.Material===unit.Id)).forEach(r=>{const input=r.Inputs.find(x=>x.Material===unit.Id);html+=line(r.Output,`×${fmt(input.Amount)}`);});
 }else{
  html+=`<div class="section-label">${lang==='en'?'POSSIBLE REWARDS':'ВОЗМОЖНЫЕ НАГРАДЫ'}</div>`;
  (Array.isArray(unit.Rewards)?unit.Rewards:[]).forEach(r=>{html+=line(r.UnitName||r.Id||r.Type,r.Chance!=null?`${fmt(r.Chance,3)}%`:r.Amount?`×${r.Amount}`:'—');});
  if(!unit.Rewards?.length)html+=`<p class="tiny-note">${t('sourceMissing')}</p>`;
 }
 $('details').innerHTML=html;
}
function closeDetails(){$('details').classList.remove('mobile-open');$('details').removeAttribute('role');$('details').removeAttribute('aria-modal');$('detail-backdrop').hidden=true;document.body.classList.remove('modal-open');}
function openDetails(){if(matchMedia('(max-width:900px)').matches){$('details').classList.add('mobile-open');$('details').setAttribute('role','dialog');$('details').setAttribute('aria-modal','true');$('detail-backdrop').hidden=false;document.body.classList.add('modal-open');$('details').querySelector('[data-close-detail]')?.focus();}else $('details').scrollTop=0;}
function route(){
 const parts=location.hash.slice(1).split('/');let next=parts[0];if(!['units','items','crafts','toilets','modes'].includes(next))next='units';
 const changedPage=page!==next;page=next;
 if(changedPage){query='';$('search').value='';rarity='';$('rarity').value='';source='';itemKind='';savedOnly=false;selected=null;closeDetails();}
 if(page==='units'){
  let id;try{id=decodeURIComponent(parts.slice(1).join('/'));}catch{id='';}
  const unit=DATA.units.find(x=>x.Id===id)||(!selected?DATA.units.find(x=>x.Id==='Hyper Titan Speaker Man')||DATA.units[0]:selected);
  if(unit?.Id!==selected?.Id){selected=unit;selectedLevel=levels(unit).length-1;}
 }else if(page==='items'){
  if(!selected)selected=items()[0];
 }
 renderCatalog();renderDetails();translate();
}
function toggleCompare(id){
 if(compare.includes(id))compare=compare.filter(x=>x!==id);else if(compare.length<3)compare.push(id);else{toast(t('maxCompare'));return;}
 $('compare-bar').hidden=!compare.length;$('compare-count').textContent=`${compare.length}/3 ${t('units').toLowerCase()}`;renderCatalog();
}
function showComparison(){
 if(compare.length<2){toast(t('chooseTwo'));return;}
 const units=compare.map(id=>DATA.units.find(u=>u.Id===id));
 const metrics=[[t('rarity'),u=>u.Rarity],[t('dps'),u=>fmt(maxDps(u),1)],[t('damage'),u=>fmt(levels(u).at(-1)?.Damage||0)],[t('range'),u=>fmt(levels(u).at(-1)?.Range||0,1)],[t('cooldown'),u=>`${fmt(levels(u).at(-1)?.Cooldown||0,2)}s`],[t('cost'),u=>`$ ${fmt(u.Price)}`],[t('limit'),u=>DATA.limits[u.Id]||'—']];
 $('comparison-content').innerHTML=`<p class="tiny-note">${t('base')} · ${t('max')}</p><table><thead><tr><th></th>${units.map(u=>`<th>${image(u.Icon,u.DisplayName)}<strong>${esc(u.DisplayName)}</strong></th>`).join('')}</tr></thead><tbody>${metrics.map(([title,get])=>`<tr><td>${esc(title)}</td>${units.map(u=>`<td>${esc(get(u))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 $('compare-dialog').showModal();
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.dataset.save){const id=button.dataset.save;const existed=bookmarks.includes(id);bookmarks=existed?bookmarks.filter(x=>x!==id):[...bookmarks,id];saveStorage('atd-bookmarks',bookmarks);$('saved-count').textContent=bookmarks.length;toast(t(existed?'unbookmarked':'bookmarked'));renderCatalog();}
 else if(button.dataset.compare)toggleCompare(button.dataset.compare);
 else if(button.dataset.select){const unit=DATA.units.find(u=>u.Id===button.dataset.select);selected=unit;selectedLevel=levels(unit).length-1;history.replaceState(null,'',`#units/${encodeURIComponent(unit.Id)}`);renderCatalog();renderDetails();openDetails();}
 else if(button.dataset.item){selected=items().find(x=>x.Id===button.dataset.item);renderCatalog();renderDetails();openDetails();}
 else if(button.dataset.level!=null){selectedLevel=Number(button.dataset.level);renderDetails();}
 else if(button.dataset.filter!=null){if(page==='units')source=button.dataset.filter;else itemKind=button.dataset.filter;renderCatalog();}
 else if(button.hasAttribute('data-reset')){query='';rarity='';source='';itemKind='';savedOnly=false;$('search').value='';$('rarity').value='';renderCatalog();}
 else if(button.hasAttribute('data-close-detail'))closeDetails();
});
$('search').addEventListener('input',()=>{query=$('search').value;renderCatalog();});
$('rarity').addEventListener('change',()=>{rarity=$('rarity').value;renderCatalog();});
$('sort').addEventListener('change',()=>{sort=$('sort').value;renderCatalog();});
function toggleLanguage(){lang=lang==='en'?'ru':'en';saveStorage('atd-language',lang);translate();renderCatalog();renderDetails();}
$('language').addEventListener('click',toggleLanguage);
$('footer-language').addEventListener('click',toggleLanguage);
$('saved-button').addEventListener('click',()=>{if(page!=='units'){location.hash='units';page='units';selected=DATA.units[0];selectedLevel=levels(selected).length-1;}savedOnly=!savedOnly;renderCatalog();renderDetails();});
$('compare-open').addEventListener('click',showComparison);
$('compare-clear').addEventListener('click',()=>{compare=[];$('compare-bar').hidden=true;renderCatalog();});
$('compare-close').addEventListener('click',()=>$('compare-dialog').close());
$('compare-dialog').addEventListener('click',e=>{if(e.target===$('compare-dialog'))$('compare-dialog').close();});
$('detail-backdrop').addEventListener('click',closeDetails);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDetails();if(e.key==='Tab'&&$('details').classList.contains('mobile-open')){const list=[...$('details').querySelectorAll('button,a,input,select')].filter(x=>!x.disabled);const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}if(e.key==='/'&&!document.body.classList.contains('modal-open')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();$('search').focus();}});
window.addEventListener('hashchange',route);
window.addEventListener('resize',()=>{if(innerWidth>900)closeDetails();});
hydration();
try{
 const responses=await Promise.all([fetch('data.json'),fetch('asset-map.json')]);
 if(responses.some(r=>!r.ok))throw new Error('Index data unavailable');
 [DATA,ASSETS]=await Promise.all(responses.map(r=>r.json()));
 bookmarks=bookmarks.filter(x=>DATA.units.some(u=>u.Id===x));
 $('unit-count').textContent=DATA.units.length;
 Object.keys(RARITIES).forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;$('rarity').append(option);});
 translate();route();
}catch(error){console.error(error);$('catalog').innerHTML=`<div class="empty-state">${icon('book')}<h3>The index couldn't load.</h3><p>Check your connection and refresh the page.</p><button class="reset-button" onclick="location.reload()">Try again</button></div>`;$('result-count').textContent='Offline';}
