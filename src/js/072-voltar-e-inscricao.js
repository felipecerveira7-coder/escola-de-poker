/* =============== v61: botão Voltar e inscrição só quando o dia ainda está livre =============== */
const NAV={stack:[],cur:null,busy:false,
  snap(){const h=location.hash||'#vida';return{h,t:h==='#vida'?LIFE.tab:'',o:h==='#vida'?LIFE.open:null,y:window.scrollY}},
  key(x){return x?x.h+'|'+x.t+'|'+(x.o||''):''},
  track(){if(this.busy)return;const n=this.snap();if(this.cur&&this.key(n)!==this.key(this.cur)){this.stack.push(this.cur);if(this.stack.length>30)this.stack.shift()}if(this.cur&&this.key(n)===this.key(this.cur)){this.cur.y=n.y;return}this.cur=n;try{HUD.last='';HUD.render()}catch(e){}},
  can(){return this.stack.length>0},
  back(){const p=this.stack.pop();if(!p)return;this.busy=true;try{SFX.play('whoosh')}catch(e){}
    const done=()=>{if(p.h==='#vida'){LIFE.tab=p.t||'hoje';LIFE.open=p.o||null;try{renderLife()}catch(e){}}this.cur=p;setTimeout(()=>{window.scrollTo(0,p.y||0);this.busy=false;HUD.last='';HUD.render()},40)};
    if(location.hash!==p.h){location.hash=p.h;setTimeout(done,60)}else done()}};
{const _rl=renderLife;renderLife=function(){const r=_rl.apply(this,arguments);try{if(location.hash==='#vida'||location.hash==='')NAV.track()}catch(e){}return r}}
addEventListener('hashchange',()=>setTimeout(()=>{try{NAV.track()}catch(e){}},30));
addEventListener('scroll',()=>{if(NAV.cur&&!NAV.busy)NAV.cur.y=window.scrollY},{passive:true});
/* botão na barra do topo */
{const _hr=HUD.render;HUD.render=function(){_hr.apply(this,arguments);const el=document.getElementById('hud');if(!el||el.style.display==='none')return;let b=el.querySelector('.hu-bk');
  if(NAV.can()){if(!b){b=document.createElement('button');b.className='hu-bk';b.setAttribute('aria-label','Voltar');b.innerHTML='‹';b.onclick=e=>{e.stopPropagation();NAV.back()};el.prepend(b)}}else if(b)b.remove()}}
/* inscrição: se o dia de hoje já foi usado com outra coisa, não dá pra se inscrever no torneio de hoje */
function dayTaken(ev){const A=CAL.st(),t=CAL.today();return!!(ev&&ev.first===t&&A.used[t]&&A.used[t]!==ev.key)}
{const _rg=CAL.register;CAL.register=function(key){const ev=this.byKey(key);if(dayTaken(ev))return`Hoje você já usou o dia (${this.usedTxt()}). Só dá pra fazer uma coisa por dia: o ${ev.E.nm} de hoje fica pra próxima.`;return _rg.apply(this,arguments)}}
{const _sr=SPX.reg;SPX.reg=function(key){const ev=CAL.byKey(key);if(dayTaken(ev))return`Hoje você já usou o dia. O ${ev.E.nm} de hoje fica pra próxima.`;return _sr.apply(this,arguments)}}
CAL.usedTxt=function(){const u=this.st().used[this.today()]||'';return u.startsWith('item')?'com um compromisso':u==='rest'?'descansando':u==='live'?'fazendo live':u==='train'?'treinando':u==='hg'?'com o home game':u.includes('@')?'com outro torneio':u==='trip'?'de férias':'com outra coisa'};
/* fim do dia: inscrito num torneio que não deu pra jogar porque o dia foi usado com outra coisa = inscrição devolvida, sem falta */
function regRefund(key,why){const A=CAL.st(),r=A.reg[key],ev=CAL.byKey(key);if(!r)return 0;let v=0;
  if(r.paid){v+=r.paid;WALLET.add(r.paid,`Estorno: ${ev?ev.E.nm:'torneio'} (${why})`)}
  if(r.sp){const c=SPX.c(r.sp);if(c&&r.bud)c.bud+=r.bud}
  delete A.reg[key];return v}
{const _ed=CAL.endDay;CAL.endDay=function(d){const A=this.st();try{this.events(d).forEach(ev=>{const r=A.reg[ev.key];if(!r||A.done[ev.key]||ev.first!==d)return;const inGame=TOUR.g&&TOUR.g.ev&&TOUR.g.ev.key===ev.key,sv=SAVES.data&&SAVES.data.tour;if(inGame||(sv&&sv.ev&&sv.ev.key===ev.key))return;
    if(A.used[d]&&A.used[d]!==ev.key){const v=regRefund(ev.key,'o dia já estava ocupado');LIFE.note('↩️',`Inscrição devolvida: ${ev.E.nm}`,`Você usou o dia com outra coisa, então não dava pra jogar.${v?` R$ ${brl(v)} voltaram pra carteira.`:''}${r.sp?' A verba voltou pro patrocinador, sem advertência.':''}`)}})}catch(e){console.warn(e)}
  return _ed.apply(this,arguments)}}
/* conserta saves antigos: faltas marcadas em dias que já estavam ocupados */
function fixOldNoShows(){const s=LIFE.s;if(!s||s.fixNS1)return;s.fixNS1=1;const A=CAL.st();let n=0,v=0;
  Object.entries(A.done).forEach(([k,dn])=>{if(!dn||!dn.noshow||dn.place)return;const d=+k.split('@')[1],r=A.reg[k];if(!r||!A.used[d]||A.used[d]===k)return;
    if(r.pen&&r.sp){const c=LIFE.spById(r.sp);if(c&&c.warn>0){c.warn--;LIFE.addFame(.5)}}
    if(r.paid){v+=r.paid;WALLET.add(r.paid,`Estorno: falta cobrada por engano (${k.split('@')[0]})`)}delete A.done[k];delete A.reg[k];n++});
  if(n){LIFE.note('↩️','Falta cancelada',`${n} falta${n>1?'s':''} em torneio que não dava pra jogar (o dia já estava ocupado) foi${n>1?'ram':''} retirada${n>1?'s':''}.${v?` R$ ${brl(v)} devolvidos.`:''} Advertências dos patrocinadores por isso também foram retiradas.`)}LIFE.commit()}
{const _rl=renderLife;renderLife=function(){try{if(LIFE.s&&CAL.on())fixOldNoShows()}catch(e){}return _rl.apply(this,arguments)}}
