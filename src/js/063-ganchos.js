/* ----- ganchos: relógio, encontro, presentes ----- */
(function(){try{
  const _b=CAL._blk;CAL._blk=function(){const d=LIFE.s&&LIFE.s.dnow;if(d&&!d.over)return'Você está num encontro. Termine antes de avançar o dia.';return _b.call(this)};
  FAM.gift=function(id){FAM.gp=FAM.gp===id?null:id;return''};
  const _c=FAM.call;FAM.call=function(id){const tc=CLK.can(.5,'uma ligação');if(tc)return tc;const r=_c.call(this,id);if(/^📞/.test(r)){CLK.add(.5);LIFE.commit();const p=this.get(id);if(p&&Math.random()<.45)return r+' '+GIFT.hint(p)}return r};
  const _o=LIFE.out;LIFE.out=function(n){const tc=CLK.can(3,'sair com os amigos');if(tc)return tc;const r=_o.call(this,n);if(r&&/\(−R\$/.test(r)){CLK.add(3);this.commit()}return r};
  const _p=LIFE.post;LIFE.post=function(id){const r=_p.call(this,id);if(r){CLK.add(.25);this.commit()}return r};
  const _os=LIFE.onStart;LIFE.onStart=function(kind,mtt){_os.call(this,kind,mtt);try{if(!this.s||!CAL.on())return;if(kind==='tour'){const ev=TOUR.g&&TOUR.g.ev;CLK.to(ev?tStartH(ev):19)}this.commit()}catch(e){}};
  const _ot=LIFE.onTour;LIFE.onTour=function(o){_ot.call(this,o);try{if(!this.s||!CAL.on())return;const of=Math.max(1,o.of||9);CLK.add((o.mtt?3:1.5)+(o.mtt?8:3)*(1-(o.place-1)/of));this.commit()}catch(e){}};
  
}catch(e){console.warn('hooks',e)}})();

(function(){try{
  const _sd=CAL.startDay;CAL.startDay=function(d){_sd.call(this,d);try{SPX.daily(d)}catch(e){console.warn(e)}};
  const _ed=CAL.endDay;CAL.endDay=function(d){_ed.call(this,d);try{SPX.afterDay(d)}catch(e){console.warn(e)}};
  const _pz=SCOUT.prize;SCOUT.prize=function(sid,pr){let v=_pz.call(this,sid,pr);try{const r=SPX.regOf();if(r&&r.sp&&!r.paidOut&&v>0){r.paidOut=1;if(r.cut){const c=Math.round(v*r.cut);v-=c;LIFE.note('💼',`${r.spNm} ficou com ${Math.round(r.cut*100)}% do prêmio`,`R$ ${brl(c)}, como combinado no investimento.`)}if(r.bon)WALLET.add(r.bon,`Bônus da ${r.spNm}: premiação no ${TOUR.g.ev.nm}`);LIFE.commit()}}catch(e){}return v};
  const _ur=CAL.unregister;CAL.unregister=function(key){const r=this.st().reg[key];_ur.call(this,key);try{if(r&&r.sp&&!this.st().reg[key]){const c=LIFE.spById(r.sp);if(c&&r.bud)c.bud+=r.bud;LIFE.commit()}}catch(e){}};
}catch(e){console.warn('spx hooks',e)}})();

(function(){try{
  FR.box=function(op){const s=LIFE.s;let h='';if(s.bds&&s.bds.d===CAL.today()&&s.bds.l.includes(op)&&!s.bds.done.includes(op))h+=`<div class="vsum">🎂 Hoje é aniversário de ${op}. <button class="sm pri" data-fb="${op}">Mandar parabéns</button></div>`;
    if(s.finv&&s.finv.n===op&&s.finv.d===CAL.today()&&!s.finv.ans){const A=OUTA[s.finv.k];h+=`<div class="vsum">${A.emo} ${op} te chamou pra ${A.nm.toLowerCase()} hoje (cada um paga o seu, R$ ${brl(OUTX.share(s.finv.k))}). <button class="sm pri" data-fi="y">Topar</button> <button class="sm" data-fi="n">Não dá</button><div class="muted" style="font-size:12px">Se não responder até o fim do dia, ele fica chateado.</div></div>`}return h};
  const _sd=CAL.startDay;CAL.startDay=function(d){_sd.call(this,d);try{const s=LIFE.s;FR.daily(d);FEED.daily(d);if(WALLET.s.bal<0)s.wasNeg=1;TROPH.backfill();TROPH.checkHof();
    const k=RK.key(d);if(s.rkSeen&&s.rkSeen!==k){const got=TROPH.RIB.filter(r=>{try{return r[3]()}catch(e){return false}});LIFE.note('🎗️',`Fim da temporada ${RK.label(s.rkSeen)}`,got.length?`Selos da carreira até aqui: ${got.map(r=>r[0]+' '+r[1]).join(', ')}. Veja tudo na aba Legado.`:'Nenhum selo ainda. Veja as metas na aba Legado.')}s.rkSeen=k;LIFE.commit()}catch(e){console.warn(e)}};
  const _ed=CAL.endDay;CAL.endDay=function(d){try{FR.endDay(d)}catch(e){}_ed.call(this,d)};
  const _fin=CAL.finish;CAL.finish=function(key,res){if(/^leg@/.test(key)){try{LEG.done(key.split('@')[1],res)}catch(e){}this.st().done[key]=res;LIFE.commit();return}_fin.call(this,key,res);
    try{if(PRESS.need(key)&&res&&res.place&&(res.place<=9)){const ev=this.byKey(key);PRESS.open('post',key,{nm:ev?ev.E.nm:'torneio',place:res.place})}}catch(e){}};
  const _pl=CAL.play;CAL.play=function(key){try{const s=LIFE.s,ev=this.byKey(key),A=this.st();s.pressDone=s.pressDone||{};
    if(ev&&PRESS.need(key)&&this.today()===ev.first&&!A.done[key]&&!s.pressDone[key]&&!(TOUR.g&&TOUR.g.ev&&TOUR.g.ev.key===key)){s.pressDone[key]=1;PRESS.open('pre',key,{nm:ev.E.nm});return'🎤 Antes de sentar, a imprensa quer falar com você.'}}catch(e){}return _pl.call(this,key)};
  const _ot=LIFE.onTour;LIFE.onTour=function(o){_ot.call(this,o);try{if(o.place===1&&!o.leg){let emo='🏆';try{const k=TOUR.g&&TOUR.g.ev&&TOUR.g.ev.key,ev=k&&CAL.byKey(k);if(ev)emo=ev.E.emo}catch(e){}TROPH.add({k:'titulo',nm:o.nm,emo,prize:o.prize})}FR.swap(o);TROPH.checkHof()}catch(e){}};
  const _os=LIFE.onStart;LIFE.onStart=function(kind,mtt){if(kind==='tour')FR.tour={};_os.call(this,kind,mtt)};
  const _te=LIVES.tourEnd;LIVES.tourEnd=function(n,place,N,buy,pays){const r=_te.apply(this,arguments);try{FR.tour[n]={place,prize:place<=(pays||[]).length?Math.round(N*buy*pays[place-1]):0}}catch(e){}return r};
  const _ca=LIFE.cardAdj;LIFE.cardAdj=function(){const v=_ca.call(this),m=this.s?this.s.mood:0;return clamp(v+(m>=2?1:m<=-2?-1:0),-3,2)};
  const _lc=LIFE.chat;LIFE.chat=function(n,t){try{FR.seen(n)}catch(e){}return _lc.call(this,n,t)};
  const _cl=LIFE.call;LIFE.call=function(n){const r=_cl.call(this,n);try{if(r)FR.seen(n)}catch(e){}return r};
  TOUR.sngPrize=function(p){const g=this.g;if(!g)return 0;if(g&&g.ev&&g.ev.leg)return p===1?g.ev.buy*2:0;return Table.prototype.sngPrize.call(this,p)};
  const _pr=Table.prototype.postResult;Table.prototype.postResult=function(){if(this.g&&this.g.ev&&this.g.ev.leg){this.g.posted=true;return}return _pr.call(this)};
  const _sg=Table.prototype.startGame;Table.prototype.startGame=function(cfg){_sg.call(this,cfg);try{if(LIVES.on()&&!(cfg.ev&&cfg.ev.leg))LOOK.comment(this)}catch(e){}};
  const _sh=Table.prototype.startHand;Table.prototype.startHand=function(){_sh.apply(this,arguments);try{const g=this.g;if(!g||g.finished||!LIVES.on()||!LIFE.s||this.chat||Math.random()>.03)return;const c=g.players.filter(p=>!p.human&&!p.out&&LIVES.s.bots[p.name]&&(LIFE.rel(p.name)<=-1||LIVES.hot(p.name)));if(!c.length)return;const p=pickA(c);
    this.botAsk(p.name,pickA(['Vai foldar de novo, campeão?','Cadê aquela sorte de ontem?','Patrocinado joga com medo de perder contrato?','Hoje eu te mando pro trilho.','Vi tua coletiva. Muito papo pra pouca ficha.']));LIFE.s.tauntDay=CAL.today()}catch(e){}};
  const _hr=LIVES.hear;LIVES.hear=function(n,it){const b=this.s.bots[n],t0=b?b.tilt:0,r=_hr.call(this,n,it);try{if(it==='prov'&&b&&b.tilt>t0)[TOUR,CASH].forEach(T=>{if(T.g&&T.g.players.some(p=>p.name===n))T.log(`<span class="gold">🔥 ${n} entrou em tilt com a provocação: vai jogar mais solto.</span>`)})}catch(e){}return r};
  const _sy=LIFE.sync;LIFE.sync=function(){_sy.apply(this,arguments);try{const s=this.s;if(this.ready&&s&&!s.spRate){s.spRate=1;try{TROPH.backfill()}catch(e){}let ch=[];this.sps().forEach(c=>{const o=SP_OLD[c.id],p=SPONS.find(x=>x.id===c.id);if(!o||!p)return;const m=(c.day/o[0])||1,k=SPCH(c.id);const old=c.day;c.day=Math.round(p.day*m*k);c.win=Math.round(p.win*m*k);c.itm=Math.round(p.itm*m*k);ch.push(`${c.nm}: R$ ${brl(old)} → R$ ${brl(c.day)}/dia`)});
      if(ch.length)this.note('🤝','Patrocínios recalibrados',ch.join(' · ')+'. Bônus por título agora é cheio em Main Event, etapas e lendas, e proporcional em torneios menores.');this.commit()}}catch(e){}};
  const _oneD=LIFE.oneDay;LIFE.oneDay=function(add){_oneD.call(this,add);try{const dm=CAL.date(this.s.day).getDate();if(dm===5)INV.month(add)}catch(e){}};
  const go=(m)=>{LIFE.flash=m||'';if(location.hash==='#vida'){renderLife()}};
  document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-leg],[data-live],[data-inv],[data-fb],[data-fi]');if(!t)return;e.stopPropagation();e.preventDefault();const d=t.dataset;
    if(d.leg){const m=LEG.play(d.leg);if(m)go(m);return}
    if(d.live){go(LIVEX.go(d.live));return}
    if(d.fb){go(FR.bdSend(d.fb));return}
    if(d.fi){go(FR.answer(d.fi==='y'));return}
    if(d.inv){const[a,k]=d.inv.split(':');go(a==='rent'?INV.toggle(k):a==='buy'?INV.buy(k):a==='sell'?INV.sell(k):a==='tour'?INV.tourney():a==='cdb'?INV.cdb(+k):'')}},true);
  setInterval(()=>{try{if(LIFE.s&&LIFE.s.press)PRESS.render()}catch(e){}},1200);
}catch(e){console.warn('v53 hooks',e)}})();

