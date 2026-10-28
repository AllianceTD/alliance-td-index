export function countdown(releaseAt,now=Date.now()){
 if(!releaseAt)return {status:'unknown'};
 const target=Date.parse(releaseAt);
 if(!Number.isFinite(target))return {status:'unknown'};
 const seconds=Math.ceil((target-now)/1000);
 if(seconds<=0)return {status:'due'};
 return {status:'scheduled',days:Math.floor(seconds/86400),hours:Math.floor(seconds%86400/3600),minutes:Math.floor(seconds%3600/60),seconds:seconds%60};
}
export function localized(value,lang){return typeof value==='string'?value:value?.[lang]||value?.en||value?.ru||'';}
export function sortedReleases(releases){return [...(releases||[])].sort((a,b)=>String(b.date).localeCompare(String(a.date))||Number(b.version)-Number(a.version));}
export function createUpdates({banner,lang,escape}){
 let config=null;
 const text=(en,ru)=>lang()==='ru'?ru:en;
 const l=value=>escape(localized(value,lang()));
 const date=value=>new Intl.DateTimeFormat(lang()==='ru'?'ru-RU':'en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Moscow'}).format(new Date(value.length===10?value+'T12:00:00+03:00':value));
 function tick(){
  const target=banner.querySelector('[data-countdown]');if(!target||!config)return;
  const remaining=countdown(config.nextUpdate?.releaseAt);
  if(remaining.status==='unknown'){target.innerHTML=`<span class="timer-message">${text('Date to be announced','Дата скоро появится')}</span>`;return;}
  if(remaining.status==='due'){target.innerHTML=`<span class="timer-message">${text('Scheduled time reached · waiting for news','Время наступило · ждём новостей')}</span>`;return;}
  const labels=text(['DAYS','HRS','MIN','SEC'],['ДНИ','ЧАС','МИН','СЕК']);
  const values=[remaining.days,remaining.hours,remaining.minutes,remaining.seconds];
  // Keep the seconds update silent for screen readers.
  target.innerHTML=values.map((value,i)=>`<span class="timer-unit"><b>${String(value).padStart(2,'0')}</b><small>${labels[i]}</small></span>`).join('');
 }
 function render(){
  if(!config){banner.hidden=true;return;}
  document.querySelector('.patch').textContent=`${text('UPDATE','ОБНОВЛЕНИЕ')} ${config.currentVersion||''}`;
  banner.hidden=config.nextUpdate?.enabled===false;
  if(banner.hidden)return;
  const at=config.nextUpdate?.releaseAt;
  const valid=at&&Number.isFinite(Date.parse(at));
  const time=valid?new Intl.DateTimeFormat(lang()==='ru'?'ru-RU':'en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Moscow'}).format(new Date(at)):'';
  banner.innerHTML=`<div class="update-banner-copy"><span class="update-eyebrow">✦ ${text('COMING NEXT','СКОРО В ИГРЕ')}</span><h2>${l(config.nextUpdate?.title)}</h2><p>${valid?`${escape(date(at))} · ${time} ${text('Moscow time','МСК')}`:text('Stay tuned for the next announcement.','Следи за новостями — дату объявим здесь.')}</p></div><div class="countdown" data-countdown></div><a class="update-log-link" href="#updates">${text('Update log','Журнал обновлений')} <span aria-hidden="true">↗</span></a>`;
  tick();
 }
 function cards(query=''){
  if(!config)return `<p class="info-banner">${text('Update log is temporarily unavailable. Please refresh later.','Журнал обновлений временно недоступен. Попробуй обновить страницу позже.')}</p>`;
  const releases=sortedReleases(config.releases).filter(r=>JSON.stringify(r).toLowerCase().includes(query.trim().toLowerCase()));
  return releases.map((r,i)=>`<article class="release-card"><div class="release-meta"><span class="release-version">${text('UPDATE','ОБНОВЛЕНИЕ')} ${escape(r.version)}</span><time datetime="${escape(r.date)}">${escape(date(r.date))}</time>${i===0&&!query?`<span class="release-latest">${text('LATEST','ПОСЛЕДНЕЕ')}</span>`:''}</div><h2>${l(r.title)}</h2><div class="release-sections">${(r.sections||[]).map(s=>`<section><h3>${l(s.title)}</h3><ul>${(s.items||[]).map(item=>`<li>${l(item)}</li>`).join('')}</ul></section>`).join('')}</div></article>`).join('')||`<p class="info-banner">${text('No updates found.','Обновления не найдены.')}</p>`;
 }
 return {async load(){try{const response=await fetch('updates.json',{cache:'no-store'});if(!response.ok)throw Error(response.status);const value=await response.json();if(!Array.isArray(value.releases))throw Error('Invalid releases');config=value;}catch(error){console.warn('Update log unavailable',error);}render();},render,cards,tick};
}
