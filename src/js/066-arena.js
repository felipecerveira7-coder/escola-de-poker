/* =============== v58: arena — mesa em tela cheia, perspectiva 3D, cartas voando do dealer, anel de tempo, chance no all-in =============== */
const ARENA={
  on(T){const g=T.g;if(!g||T.arenaOff||g.finished||g.paused)return false;if(T.mode==='tour'&&g.players[0].out&&!T.watch)return false;return true},
  venue(T){const g=T.g;return g.ev&&g.ev.leg?'v-leg':T.mode==='tour'?(g.mtt&&g.mtt.state&&g.mtt.state.final?'v-final':'v-tour'):g.online?'v-on':'v-club'},
  AMB:{'v-on':'room','v-club':'club','v-tour':'casino','v-final':'casino','v-leg':'casino'},
  vis(T){return!!(T&&T.root&&T.root.offsetParent!==null)},
  sync(T){const r=T.root,tw=r&&r.querySelector('.twrap');if(!tw)return;const on=this.on(T);r.classList.toggle('arena',on);
    ['v-on','v-club','v-tour','v-final','v-leg'].forEach(c=>tw.classList.remove(c));if(on){tw.classList.add(this.venue(T));this.bar(T,tw);this.ctlH(T,tw)}
    this.back(T);this.body()},
  body(){const L=[typeof CASH!=='undefined'?CASH:null,typeof TOUR!=='undefined'?TOUR:null].filter(T=>T&&this.vis(T)&&T.root.classList.contains('arena'));
    document.body.classList.toggle('arena-on',L.length>0);if(typeof SFX!=='undefined')SFX.amb(L.length?this.AMB[this.venue(L[0])]:null)},
  ctlH(T,tw){const c=T.$('ctl');if(!c)return;const set=()=>tw.style.setProperty('--ctlh',c.offsetHeight+'px');set();if(!c._ro&&window.ResizeObserver){c._ro=new ResizeObserver(set);c._ro.observe(c)}},
  bar(T,tw){let b=tw.querySelector('.abar');if(!b){b=document.createElement('div');b.className='abar';tw.prepend(b);b.addEventListener('click',e=>{const k=e.target.closest('[data-ab]');if(!k)return;e.stopPropagation();this.cmd(T,k.dataset.ab)})}
    const g=T.g,lv=T.mode==='tour'?`${g.ev&&g.ev.nm?g.ev.nm:g.mtt?'Torneio multimesas':'Sit & Go'}`:`${g.online?'🖥️ Sala online':'♣️ Clube'} · R$ ${g.sb}/${g.bb}`;
    const sub=`Mão ${g.hands}${T.mode==='tour'?` · blinds ${nf(g.sb)}/${nf(g.bb)}${g.ante?' · ante '+nf(g.ante):''}${g.mtt&&T.aliveAll?` · ${T.aliveAll()} vivos`:''}`:''}`;
    const h=`<button data-ab="min" aria-label="Sair da tela cheia">⤓</button><div class="abi"><b>${lv}</b><span>${sub}</span></div><button data-ab="snd" aria-label="Som">${typeof SFX!=='undefined'&&SFX.muted()?'🔇':'🔊'}</button><button data-ab="coach" aria-label="Treinador">🎓</button><button data-ab="log" aria-label="Histórico">📜</button>`;
    if(b._h!==h){b.innerHTML=h;b._h=h}},
  cmd(T,k){if(k==='min'){T.arenaOff=true;this.sync(T);window.scrollTo(0,0);return}
    if(k==='snd'){SFX.toggle();this.sync(T);return}
    this.sheet(T,k)},
  sheet(T,k){const src=T.$(k==='coach'?'coach':'log');let s=document.getElementById('aSheet');if(!s){s=document.createElement('div');s.id='aSheet';document.body.appendChild(s)}
    s.className='asheet';s.innerHTML=`<div class="asin"><div class="ash"><b>${k==='coach'?'🎓 Treinador':'📜 Histórico da mesa'}</b><button class="sm" data-x>✕</button></div><div class="asb">${src?src.innerHTML:''}</div></div>`;
    s.onclick=e=>{if(e.target===s||e.target.closest('[data-x]'))s.remove()};const bb=s.querySelector('.asb');if(k==='log')bb.scrollTop=bb.scrollHeight},
  back(T){const show=!!(T.g&&T.arenaOff&&!T.g.finished&&!T.g.paused);let b=T.root.querySelector(':scope>.aback');
    if(show&&!b){b=document.createElement('button');b.className='aback pri';b.textContent='🎮 Voltar pra mesa';b.onclick=()=>{T.arenaOff=false;T.render()};T.root.appendChild(b)}
    if(!show&&b)b.remove()},
  strip(T,tb){const tw=tb.closest('.twrap');if(!tw)return;let st=tw.querySelector(':scope>.astrip');if(!st){st=document.createElement('div');st.className='astrip';const ab=tw.querySelector('.abar');ab?ab.after(st):tw.prepend(st)}
    st.innerHTML='';tb.querySelectorAll('.pcenter>.dtag,.pcenter>.sctag').forEach(e=>st.appendChild(e))},
  /* lugares acompanham a mesa inclinada */
  persp(tb){tb.querySelectorAll('.pseat,.pchip,.pdealer').forEach(e=>{const x=parseFloat(e.style.left),y=parseFloat(e.style.top);if(isNaN(x)||isNaN(y))return;const f=.86+.14*y/100;e.style.left=(50+(x-50)*f).toFixed(2)+'%';e.style.top=(y<50?y+(50-y)*.12:y).toFixed(2)+'%'})},
  /* cartas: saem do dealer, viram na frente; cartas fechadas viram no showdown */
  cards(T,tb){const g=T.g,now=Date.now(),R=tb.getBoundingClientRect(),ox=R.width/2,oy=R.height*.16;if(T._dkH!==g.hands){T._dkH=g.hands;T._dk=new Map();T._dkN=0}
    const seats=[...tb.querySelectorAll('.pseat')];let k=0,snd=[];
    tb.querySelectorAll('.card').forEach(c=>{c.classList.remove('deal');const s=c.closest('.pseat'),face=!c.classList.contains('back');
      const key=s?'s'+seats.indexOf(s)+'_'+[...c.parentNode.children].indexOf(c):'b'+(c.dataset.id||'');let e=T._dk.get(key);
      if(!e){const first=!T._dkN;e={t0:now+k*(first?95:120),kind:'fly',face};k++;T._dk.set(key,e);snd.push(['card',e.t0-now])}
      else if(face&&!e.face){e.face=true;e.t0=now+k*90;e.kind='flip';k++;snd.push(['flip',e.t0-now])}
      const el=now-e.t0,D=e.kind==='flip'?460:640;if(el>=D)return;
      if(e.kind==='fly'){const r=c.getBoundingClientRect();c.style.setProperty('--dx',(ox-(r.left-R.left+r.width/2)).toFixed(0)+'px');c.style.setProperty('--dy',(oy-(r.top-R.top+r.height/2)).toFixed(0)+'px')}
      c.classList.add(e.kind==='flip'?'aflip':face?'adeal':'adealb');c.style.animationDelay=(-el)+'ms'});
    if(snd.length){T._dkN=(T._dkN||0)+snd.length;if(typeof SFX!=='undefined')snd.slice(0,10).forEach(([t,d])=>SFX.play(t,{at:Math.max(0,d)/1000}))}},
  /* anel de tempo em volta do rosto de quem está na vez */
  pct(T){const g=T.g;if(g.toAct===0&&T.clk&&T.clk.tot)return T.clk.left/T.clk.tot;const b=T.botClk;if(b&&b.j===g.toAct&&b.base){const tot=b.base+b.used*30,left=tot-(Date.now()-b.t0)/1000;return tot>0?left/tot:null}return null},
  ring(T,tb){const g=T.g;if(g.over||g.toAct<0)return;const s=tb.querySelectorAll('.pseat')[g.toAct],av=s&&s.querySelector('.pav');if(!av)return;const i=document.createElement('i');av.parentNode.insertBefore(i,av);this.ringSet(T,i)},
  ringSet(T,i){const p=this.pct(T);i.className='pring'+(p==null?' spin':p<.25?' low':'');if(p!=null)i.style.setProperty('--p',(Math.max(0,Math.min(1,p))*360).toFixed(0)+'deg')},
  /* chance de vitória com as cartas na mesa */
  eq(H,board){const used=new Set([...H.flat(),...board].map(c=>c.id)),rest=FULL_DECK.filter(c=>!used.has(c.id)),W=H.map(()=>0);let n=0;
    const sc=b=>{const s=H.map(h=>best7(h.concat(b)).score);let best=s[0],w=[0];for(let i=1;i<s.length;i++){const c=cmp(s[i],best);if(c>0){best=s[i];w=[i]}else if(c===0)w.push(i)}w.forEach(i=>W[i]+=1/w.length);n++};
    const need=5-board.length;if(need===0)sc(board);else if(need===1)rest.forEach(a=>sc(board.concat([a])));else if(need===2){for(let i=0;i<rest.length;i++)for(let j=i+1;j<rest.length;j++)sc(board.concat([rest[i],rest[j]]))}
    else for(let it=0;it<1500;it++){const b=board.slice(),u=new Set();while(b.length<5){const x=rest[Math.random()*rest.length|0];if(!u.has(x.id)){u.add(x.id);b.push(x)}}sc(b)}
    return W.map(w=>w/n)},
  runout(g){const L=g.players.filter(p=>p.inHand&&!p.folded);return L.length>1&&L.some(p=>p.allIn)&&g.players.filter(canAct).length<=1?L:null},
  table(T){const g=T.g,L=this.runout(g);if(!L||g.over)return;L.forEach(p=>p.show=true);const ix=L.map(p=>g.players.indexOf(p)),e=this.eq(L.map(p=>p.hole),g.board);
    g.eqs={h:g.hands,b:g.board.length,v:{}};ix.forEach((i,k)=>g.eqs.v[i]=e[k]);if(g.board.length===4){g.eqT={h:g.hands,v:Object.assign({},g.eqs.v)}}},
  badges(T,tb){const g=T.g,E=g.eqs;if(!E||E.h!==g.hands||g.over)return;const seats=tb.querySelectorAll('.pseat'),mx=Math.max(...Object.values(E.v));
    Object.entries(E.v).forEach(([i,v])=>{const s=seats[i],inf=s&&s.querySelector('.pinfo');if(inf)inf.insertAdjacentHTML('beforeend',`<span class="peq${v===mx?' lead':''}">${Math.round(v*100)}%</span>`)})},
  /* chamado depois de cada desenho da mesa */
  post(T,tb){const g=T.g;this.sync(T);if(T.root.classList.contains('arena')){this.persp(tb);this.strip(T,tb)}this.cards(T,tb);this.ring(T,tb);this.badges(T,tb);
    tb.classList.toggle('sus',!!(g.sus&&g.sus===g.hands&&!g.over));if(g.sus===g.hands&&!g.over)tb.insertAdjacentHTML('beforeend','<div class="psus">RIVER…</div>');
    if(typeof SFX!=='undefined'){if(g.toAct===0&&!g.over&&T._sT!==g.hands+':'+g.street){T._sT=g.hands+':'+g.street;SFX.play('turn')}
      if(g.over&&T._sO!==g.hands){T._sO=g.hands;const t=g.eqT;if(t&&t.h===g.hands){const w=g.players.findIndex(p=>p.won>0);if(w>=0&&t.v[w]!=null&&t.v[w]<.3)setTimeout(()=>SFX.play('ooh'),250)}}}}};
/* ganchos no motor */
{const P=Table.prototype;
  const _sg=P.startGame;P.startGame=function(){this.arenaOff=false;return _sg.apply(this,arguments)};
  const _rc=P.renderControls;P.renderControls=function(){const r=_rc.apply(this,arguments);try{ARENA.sync(this)}catch(e){}return r};
  const _es=P.endStreet;P.endStreet=function(){const r=_es.apply(this,arguments);try{const g=this.g;if(g&&!g.over&&ARENA.runout(g)){ARENA.table(this);
      if(g.street==='turn'&&!this.watch&&!this.fwd){clearTimeout(this.timer);const tok=this.tok;g.sus=g.hands;if(typeof SFX!=='undefined')SFX.play('beat');
        this.timer=setTimeout(()=>{if(tok===this.tok){g.sus=0;this.endStreet()}},2700)}else g.sus=0;this.renderTable()}}catch(e){console.warn(e)}return r};
  const _ac=P.act;P.act=function(i,type,to){const g=this.g,p=g&&g.players[i],ok=g&&!g.over&&g.toAct===i,b0=p?p.bet:0;const r=_ac.apply(this,arguments);
    try{if(ok&&typeof SFX!=='undefined'){if(p.folded)SFX.play('fold');else if(p.bet===b0)SFX.play('knock');else{SFX.play('chip',{n:p.allIn?6:type==='raise'?4:2});if(p.allIn)SFX.play('allin')}}}catch(e){}return r};
  const _ct=P.clkTick;P.clkTick=function(){const r=_ct.apply(this,arguments);try{const i=this.root.querySelector('.pring');if(i)ARENA.ringSet(this,i);const c=this.clk;if(c&&c.left<5500&&c.left>0){const s=Math.ceil(c.left/1000);if(this._tk!==s){this._tk=s;SFX.play('tick')}}}catch(e){}return r}}
addEventListener('hashchange',()=>setTimeout(()=>{try{[CASH,TOUR].forEach(T=>ARENA.sync(T))}catch(e){}},60));
