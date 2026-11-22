/* =============== v58: momentos de cinema — mesa final, heads-up, título, eliminação, manchete, mensagem chegando =============== */
const CINE={q:[],busy:false,
  show(html,ms,cls,after){this.q.push({html,ms,cls,after});if(!this.busy)this.next()},
  next(){const it=this.q.shift();if(!it){this.busy=false;return}this.busy=true;let ov=document.getElementById('cine');if(!ov){ov=document.createElement('div');ov.id='cine';document.body.appendChild(ov)}
    ov.className='cine '+(it.cls||'');ov.innerHTML=it.html+'<div class="cskip">toque pra continuar</div>';let done=false;
    const end=()=>{if(done)return;done=true;clearTimeout(tm);ov.classList.add('out');setTimeout(()=>{ov.remove();if(it.after)try{it.after()}catch(e){}this.next()},380)};
    const tm=setTimeout(end,it.ms);ov.onclick=end;if(it.cls&&it.cls.includes('conf'))this.confetti(ov)},
  confetti(ov){const c=document.createElement('canvas');c.className='cconf';ov.prepend(c);const W=c.width=innerWidth*devicePixelRatio,H=c.height=innerHeight*devicePixelRatio,x=c.getContext('2d'),C=['#f0c96e','#e0483e','#5fcf8a','#4f9fe0','#ffffff','#c0396b'];
    const P=[...Array(150)].map(()=>({x:Math.random()*W,y:-Math.random()*H*.6,vx:(Math.random()-.5)*3,vy:2+Math.random()*4,r:Math.random()*6,w:6+Math.random()*8,c:C[Math.random()*C.length|0],s:Math.random()*.2}));
    const f=()=>{if(!c.isConnected)return;x.clearRect(0,0,W,H);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy*devicePixelRatio;p.r+=p.s;if(p.y>H)p.y=-20;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.w/2,-p.w/4,p.w,p.w/2);x.restore()});requestAnimationFrame(f)};f()},
  trophy(sz,gold){const g=gold===false?['#d9dde2','#9aa3ad']:['#ffe08a','#c9a63e'];return`<svg class="ctrof" width="${sz}" height="${sz}" viewBox="0 0 120 120"><defs><linearGradient id="trg${sz}" x1="0" x2="1"><stop offset="0" stop-color="${g[1]}"/><stop offset=".45" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[1]}"/></linearGradient></defs>
    <path d="M30 20 L90 20 L88 50 Q84 74 60 78 Q36 74 32 50Z" fill="url(#trg${sz})"/><path d="M30 26 Q12 26 14 42 Q16 56 34 58" fill="none" stroke="${g[1]}" stroke-width="5"/><path d="M90 26 Q108 26 106 42 Q104 56 86 58" fill="none" stroke="${g[1]}" stroke-width="5"/>
    <rect x="54" y="76" width="12" height="16" fill="${g[1]}"/><rect x="40" y="92" width="40" height="8" rx="2" fill="url(#trg${sz})"/><rect x="34" y="100" width="52" height="10" rx="2" fill="#3a2a1a"/><text x="60" y="56" text-anchor="middle" font-size="22" fill="#fff8">♠</text><path d="M44 26 Q46 46 52 60" stroke="#fff" stroke-width="3" opacity=".5" fill="none"/></svg>`},
  /* mesa final */
  final(T){const g=T.g,ps=g.players.filter(p=>!p.out).sort((a,b)=>b.stack-a.stack);try{SFX.play('boom');SFX.play('cheer',{at:.6})}catch(e){}
    this.show(`<div class="cspot"></div><div class="ckick">${g.ev&&g.ev.nm?g.ev.nm:'Torneio'}</div><div class="cbig">MESA FINAL</div><div class="cgrid">${ps.map((p,i)=>`<div class="cpl" style="animation-delay:${.5+i*.12}s">${p.human?FACE.me('mesa',54):FACE.bot(p.name,54)}<b>${p.human?'Você':p.name}</b><span>${nf(p.stack)}</span></div>`).join('')}</div>`,5200,'cfin')},
  /* frente a frente */
  vs(a,b,title,sub){try{SFX.play('whoosh');SFX.play('boom',{at:.45})}catch(e){}
    this.show(`<div class="ckick">${sub||''}</div><div class="cvs"><div class="cva">${a.f}<b>${a.n}</b></div><div class="cvx">×</div><div class="cvb">${b.f}<b>${b.n}</b></div></div><div class="cbig sm">${title}</div>`,3600,'cvsw')},
  /* campeão */
  champ(T,pr){const g=T.g,ev=g.ev&&g.ev.nm?g.ev.nm:(T.tname?T.tname():'Torneio'),leg=g.ev&&g.ev.leg&&LEGS.find(x=>x.id===g.ev.leg);try{SFX.play('cheer');SFX.play('win',{at:.3});SFX.play('cheer',{at:1.6})}catch(e){}
    this.show(`<div class="cspot gold"></div><div class="ckick">${leg?'Heads-up de lenda':ev}</div>${this.trophy(150)}<div class="cbig">${leg?'LENDA DERRUBADA':'CAMPEÃO'}</div><div class="csub">${leg?`Você venceu ${leg.nm}.`:`Você venceu o ${ev}.`}${pr?`<br><b>Prêmio: R$ ${brl(pr)}</b>`:''}</div><div class="cme">${FACE.me('mesa',90)}</div>`,7000,'cchamp conf',()=>this.paper(T,pr,leg,ev))},
  podium(T,pl,pr){const ev=T.g.ev&&T.g.ev.nm?T.g.ev.nm:'Torneio';try{SFX.play('win')}catch(e){}
    this.show(`<div class="ckick">${ev}</div>${this.trophy(110,false)}<div class="cbig sm">${pl}º LUGAR</div><div class="csub">Pódio!${pr?` Prêmio: <b>R$ ${brl(pr)}</b>`:''}</div>`,4200,'cpod')},
  out(T,pl,pr){try{SFX.play('ooh')}catch(e){}this.show(`<div class="cstamp">ELIMINADO</div><div class="csub">${pl}º lugar${pr?` · prêmio R$ ${brl(pr)}`:''}</div>`,2600,'cout')},
  /* manchete do dia seguinte */
  paper(T,pr,leg,ev){const me=CIRC.me(),d=LIFE.s?CAL.fmt(CAL.today()):'';const h=leg?`${me} derruba ${leg.nm} no heads-up mais comentado do ano`:`${me} vence o ${ev}${pr?` e leva R$ ${brl(pr)}`:''}`;
    this.show(`<div class="cpaper"><div class="cpm">O FELTRO</div><div class="cpd">${d} · Edição especial · Circuito Gaúcho de Poker</div><h2>${h}</h2><div class="cpb"><div class="cpi">${FACE.me('mesa',96)}<span>${this.trophy(40)}</span></div><p>${leg?`Diante de uma plateia lotada, ${me} encarou ${leg.nm} e saiu da mesa com todas as fichas. Nos bastidores, já se fala no próximo desafio.`:`Depois de horas de disputa, ${me} fechou a mesa final e levantou o troféu. Rivais admitem: o nome está cada vez mais forte no circuito.`}</p></div></div>`,6500,'cnews')},
  /* mensagem chegando, estilo celular */
  notif(who,txt,face){if(document.hidden)return;const L=document.getElementById('cnot')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'cnot'}));if(L.childElementCount>=3)return;
    const n=document.createElement('div');n.className='cntf';n.innerHTML=`<span class="cnf">${face||'💬'}</span><div><b>${lx(who)}</b><span>${lx(String(txt).slice(0,90))}</span></div><small>agora</small>`;L.appendChild(n);try{SFX.play('ding')}catch(e){}
    n.onclick=()=>{n.remove();location.hash='#vida';LIFE.tab='cel';LIFE.open=who===(LIFE.s.love&&LIFE.s.love.nm)?'♥':who;setTimeout(()=>{try{renderLife();scrollTo(0,0)}catch(e){}},30)};
    setTimeout(()=>{n.classList.add('out');setTimeout(()=>n.remove(),400)},4200)},
  /* quando disparar */
  check(T){const g=T.g;if(!g||T.mode!=='tour')return;const me=g.players[0],pz=p=>{try{return g.ev&&g.ev.sat?0:g.mtt?T.prizeOf(p):T.sngPrize?T.sngPrize(p):0}catch(e){return 0}};
    if(g.finished&&!g._cC){g._cC=1;const pl=me.out?me.place:1;if(pl===1)this.champ(T,pz(1));else if(!g._cO&&pl<=3)this.podium(T,pl,pz(pl));return}
    if(me.out&&!g._cO&&!g.finished){g._cO=1;if(me.place<=3)this.podium(T,me.place,pz(me.place));else this.out(T,me.place,pz(me.place));return}
    if(me.out)return;
    if(g.mtt&&g.mtt.state&&g.mtt.state.final&&!g._cF){g._cF=1;this.final(T);return}
    const alive=g.players.filter(p=>!p.out);
    if(g.ev&&g.ev.leg&&!g._cV){g._cV=1;const L=LEGS.find(x=>x.id===g.ev.leg),o=alive.find(p=>!p.human);if(L&&o)this.vs({f:FACE.me('mesa',96),n:'Você'},{f:FACE.leg(L,96),n:L.nm},'HEADS-UP',`Desafio de lenda · R$ ${brl(L.buy)} cada lado`);return}
    if(!g.ev||!g.ev.leg)if(alive.length===2&&!g._cH&&(!g.mtt||T.aliveAll()===2)){g._cH=1;const o=alive.find(p=>!p.human);if(o)this.vs({f:FACE.me('mesa',96),n:'Você'},{f:FACE.bot(o.name,96,'confiante'),n:o.name},'HEADS-UP PELO TÍTULO',g.ev&&g.ev.nm?g.ev.nm:'')}}};
/* ganchos */
{const _rc=Table.prototype.renderControls;Table.prototype.renderControls=function(){const r=_rc.apply(this,arguments);try{CINE.check(this)}catch(e){console.warn(e)}return r}}
{const _tx=LIFE.text;LIFE.text=function(n,txt,o){const r=_tx.apply(this,arguments);try{const vis=location.hash==='#vida'&&LIFE.tab==='cel'&&LIFE.open===n;if(!vis&&!(o&&o.quiet))CINE.notif(n,txt,LIVES.s&&LIVES.s.bots[n]?FACE.bot(n,40):'')}catch(e){}return r}}
{const _ht=DATE.herText;DATE.herText=function(x){const r=_ht.apply(this,arguments);try{const L=LIFE.s.love,vis=location.hash==='#vida'&&LIFE.tab==='cel'&&LIFE.open==='♥';if(L&&!vis&&!document.getElementById('dOv'))CINE.notif(L.nm,x,FACE.person(L,40))}catch(e){}return r}}
