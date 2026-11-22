/* =============== v59: interface limpa — uma informação em um lugar, notificações que abrem =============== */
/* para onde cada notificação leva */
function NOTEGO(x){const t=(x.title||'')+' '+(x.body||'');
  if(/Compromisso|^Hoje:|Hoje: |Inscrições|Convite|faltou ao|não voltou|Players' party|aula|Agenda/i.test(t))return'hash:#torneio';
  if(/contrato|patroc|Advertência|ação da|quer você no|provocação|reunião|assistiu|recado|foi embora|proposta/i.test(t))return'tab:pat';
  if(/Mãe|Pai|Irmã|Irmão|família|magoad|chatead|Almoço/i.test(t))return'tab:fam';
  if(/aniversário|vácuo|bolo|aposta|emprest/i.test(t))return'tab:amigos';
  if(/venceu o heads-up|Você venceu .*!|lenda/i.test(t))return'tab:legado';
  if(/Flagra|Ressaca|Burnout|Cabeça|Downswing|Dormiu|apagou|humor/i.test(t))return'tab:casa';
  if(/entrevista|Feltro|manchete/i.test(t))return'tab:midia';
  return''}
VG.NM.amigos='🍻 Amigos';VG.NM.namoro=VG.NM.namoro||'💘 Namoro';
{const P=VG.G.find(g=>g[0]==='pessoas');if(P&&!P[3].includes('amigos'))P[3].splice(P[3].indexOf('cel')+1,0,'amigos')}
/* tocar numa notificação: marca lida e leva até o assunto */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-note]');if(!b)return;e.preventDefault();e.stopPropagation();const s=LIFE.s,x=s&&s.notes[+b.dataset.note];if(!x)return;
  x.read=true;LIFE.commit();const g=NOTEGO(x);HUD.last='';HUD.render();if(g)HOJE.go(g);else{b.classList.remove('new');b.classList.toggle('open')}},true);
/* abriu o celular: o que está na tela conta como visto */
{const _rl=renderLife;renderLife=function(){const r=_rl.apply(this,arguments);try{const s=LIFE.s;if(s&&LIFE.tab==='cel'&&!LIFE.open&&s.notes.some(x=>!x.read)){s.notes.forEach(x=>x.read=true);LIFE.commit();HUD.last='';HUD.render();try{LIFE.badge&&LIFE.badge()}catch(e){}}}catch(e){}return r}}
/* calendário da semana na tela inicial: um olhar nos próximos compromissos */
const WEEK={
  html(){if(!CAL.on())return'';const t=CAL.today(),A=CAL.st();let h='';
    for(let d=t;d<t+10;d++){const ev=CAL.events(d),it=CAL.items(d),reg=ev.filter(e=>A.reg[e.key]),big=ev.some(e=>bigIds().includes(e.id)),hol=HOL.of(d),[wd,dm]=CAL.fmt(d).split(', ');
      const lines=[...it.map(x=>`<span class="wk-i">${x.emo||'📌'} ${lx(x.title).slice(0,22)}</span>`),...reg.map(e=>`<span class="wk-r">✓ ${e.E.emo} ${e.E.nm.slice(0,20)}</span>`),...ev.filter(e=>!A.reg[e.key]).slice(0,2).map(e=>`<span class="wk-e">${e.E.emo} ${e.E.nm.slice(0,20)}${e.part?` · dia ${e.part+1}`:''}</span>`)];
      h+=`<button class="wk-d${d===t?' hoje':''}${big?' big':''}${it.length||reg.length?' busy':''}" data-wk="${d}"><span class="wk-h"><b>${d===t?'Hoje':wd}</b><span>${dm}</span>${hol?`<span title="${hol.nm}">${hol.emo}</span>`:''}</span>${lines.slice(0,3).join('')||'<span class="wk-e muted">livre</span>'}</button>`}
    return`<div class="panel wk"><h3>📅 Próximos dias <button class="sm" data-wk="all" style="float:right;font-family:inherit">Agenda completa ›</button></h3><div class="wk-row">${h}</div></div>`}};
{const _hh=HOJE.html;HOJE.html=function(){return WEEK.html()+_hh.apply(this,arguments)}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-wk]');if(!b)return;e.preventDefault();e.stopPropagation();try{MIS.view='ag'}catch(x){}location.hash='#torneio';
  const d=b.dataset.wk;if(d!=='all')setTimeout(()=>{const el=[...document.querySelectorAll('#tourRoot .agday,#tourRoot h3,#tourRoot .nsec')].find(x=>x.textContent.includes(CAL.fmt(+d).split(', ')[1]));if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},250)},true);
