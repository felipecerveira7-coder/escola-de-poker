/* ----- patrocinador paga torneio: verba de buy-ins e convocações para eventos ----- */
const SPBI={raio:{bud:600,req:.05},clube:{bud:0,req:.10,stake:.4},tempo:{bud:4000,req:.06},cofre:{bud:10000,req:.07},liga:{bud:25000,trv:1,req:.10},mundial:{bud:60000,trv:1,req:.14,promo:1},asdeouro:{bud:8000,req:.10,promo:1,stake:.3}};
const SPX={
  conf(id){return SPBI[id]||{bud:0,req:0}},
  c(id){const c=LIFE.spById(id);if(c&&c.bud==null){c.budT=this.conf(id).bud;c.bud=c.budT}return c},
  need(c,E){return E.buy+(this.conf(c.id).trv?(E.travel||0):0)},
  payer(E){return LIFE.sps().map(x=>this.c(x.id)).filter(c=>c&&c.bud>=this.need(c,E)).sort((a,b)=>b.bud-a.bud)[0]||null},
  reg(key){const A=CAL.st(),ev=CAL.byKey(key);if(!ev||A.reg[key])return'';if(!CAL.regOpen(ev))return'Inscrições fechadas.';const E=ev.E,c=this.payer(E);if(!c)return'Nenhum patrocinador com verba pra esse buy-in.';
    const cf=this.conf(c.id),tr=cf.trv?0:(E.travel||0);if(tr&&!WALLET.can(tr))return`A ${c.nm} paga a inscrição, mas passagem e hotel (R$ ${brl(tr)}) são por sua conta e falta saldo.`;
    const n=this.need(c,E);c.bud-=n;if(tr)WALLET.add(-tr,`Passagem e hotel: ${E.nm}`);WALLET.add(0,`Inscrição: ${E.nm} (R$ ${brl(E.buy)} pagos pela verba da ${c.nm})`);
    A.reg[key]={paid:0,sp:c.id,spNm:c.nm,buy:E.buy,tr,bud:n,cut:0,bon:0};LIFE.commit();return`🤝 Inscrito no ${E.nm} com a verba da ${c.nm}${cf.trv&&E.travel?' (viagem e hotel inclusos)':''}. Sobra R$ ${brl(c.bud)} na verba.`},
  st(){const s=LIFE.s;s.spReq=s.spReq||[];return s.spReq},
  daily(d){if(!LIFE.s||!CAL.on())return;const R=this.st(),A=CAL.st();
    for(let i=R.length-1;i>=0;i--){const r=R[i],ev=CAL.byKey(r.key);if(!ev||r.exp<d||ev.first<=d||A.reg[r.key]&&A.reg[r.key].sp===r.sp||!LIFE.spById(r.sp))R.splice(i,1)}
    LIFE.sps().forEach(c=>{const cf=this.conf(c.id);if(!cf.req||R.some(r=>r.sp===c.id)||Math.random()>=cf.req)return;
      const cand=[];for(let k=2;k<=12;k++)CAL.events(d+k).forEach(e=>{if(!e.part&&!A.reg[e.key]&&!A.done[e.key]&&e.E.buy>=(c.id==='raio'?50:200)&&!cand.some(x=>x.key===e.key))cand.push(e)});if(!cand.length)return;
      cand.sort((a,b)=>b.E.buy-a.E.buy);const ev=Math.random()<.65?cand[0]:pickA(cand),E=ev.E;
      let kind=cf.promo&&(E.sat||Math.random()<.35)?'promo':cf.stake&&(E.buy>=1000||Math.random()<.5)?'stake':'pacote';
      const cut=kind==='stake'?cf.stake:0,bon=kind==='pacote'?Math.round(E.buy*(E.buy>=2500?.6:.4)/50)*50:0;
      const r={id:(LIFE.s.spSeq=(LIFE.s.spSeq||0)+1),sp:c.id,key:ev.key,kind,cut,bon,exp:d+2,nm:E.nm,buy:E.buy,tr:E.travel||0,first:ev.first};R.push(r);
      const why={pacote:`A marca paga a inscrição${E.travel?', a passagem e o hotel':''} (R$ ${brl(E.buy+(E.travel||0))}) e quer o logo na transmissão. Fica com 100% do prêmio${bon?` e ganha bônus de R$ ${brl(bon)} se for premiado`:''}. Se aceitar e faltar, leva advertência.`,
        stake:`Proposta de investimento: a marca banca tudo (R$ ${brl(E.buy+(E.travel||0))}) e fica com ${Math.round(cut*100)}% do que você ganhar. Se não premiar, você não deve nada.`,
        promo:`Promoção da sala: ticket grátis pro ${E.nm}${E.travel?' com viagem':''}, em troca de você divulgar a campanha.`}[kind];
      LIFE.note(c.emo,`${c.nm} quer você no ${E.nm} (${CAL.fmt(ev.first)})`,why+' Responda em até 2 dias na aba Patrocínio.')});LIFE.commit()},
  accept(id){const R=this.st(),i=R.findIndex(x=>x.id===id);if(i<0)return'';const r=R[i],ev=CAL.byKey(r.key),A=CAL.st(),c=LIFE.spById(r.sp);if(!ev||!c||ev.first<CAL.today()){R.splice(i,1);LIFE.commit();return'Esse convite expirou.'}
    if(CAL.items(ev.first).length&&!A.reg[r.key]){}let m='';const old=A.reg[r.key];
    if(old){if(old.sp)return'Você já está inscrito com patrocínio nesse torneio.';if(old.paid)WALLET.add(old.paid,`Inscrição reembolsada: ${r.nm} (agora paga pela ${c.nm})`);m=' Sua inscrição foi reembolsada.'}
    A.reg[r.key]={paid:0,sp:r.sp,spNm:c.nm,buy:r.buy,tr:0,cut:r.cut,bon:r.bon,req:r.kind!=='stake',kind:r.kind};
    WALLET.add(0,`Inscrição: ${r.nm} (R$ ${brl(r.buy+r.tr)} pagos pela ${c.nm})`);R.splice(i,1);if(r.kind==='promo')LIFE.addFame(.3);
    const clash=CAL.items(ev.first);LIFE.commit();return`${c.emo} Fechado: você joga o ${r.nm} em ${CAL.fmt(ev.first)} pela ${c.nm}.${m}${clash.length?` ⚠️ Nesse dia você também tem "${clash[0].title}".`:''}`},
  decline(id){const R=this.st(),i=R.findIndex(x=>x.id===id);if(i<0)return'';const r=R[i],c=LIFE.spById(r.sp);R.splice(i,1);LIFE.commit();return`Você recusou. ${c?c.nm+' entendeu':'Tudo bem'}, mas marca gosta de quem aparece.`},
  /* faltou torneio pago pela marca */
  afterDay(d){const A=CAL.st();CAL.events(d).forEach(ev=>{const r=A.reg[ev.key],dn=A.done[ev.key];if(!r||!r.sp||!dn||!dn.noshow||r.pen)return;r.pen=1;const c=LIFE.spById(r.sp);if(!c)return;
    c.warn=(c.warn||0)+1;if(c.warn>=2){LIFE.dropSp(c.id);LIFE.relSp&&LIFE.relSp(c.id);LIFE.addFame(-2);LIFE.note(c.emo,`${c.nm} rompeu o contrato`,`Você faltou a dois torneios que a marca pagou.`)}
    else{LIFE.addFame(-.5);LIFE.note(c.emo,`Advertência da ${c.nm}`,`Você faltou ao ${ev.E.nm}, que a marca pagou (R$ ${brl(r.buy)}). Mais uma falta e o contrato acaba.`)}});LIFE.commit()},
  regOf(){try{const k=TOUR.g&&TOUR.g.ev&&TOUR.g.ev.key;return k?CAL.st().reg[k]:null}catch(e){return null}},
  panel(){const R=this.st().filter(r=>LIFE.spById(r.sp));let h='';
    if(R.length)h+=`<div class="panel"><h3>📨 Pedidos dos patrocinadores</h3>${R.map(r=>{const c=LIFE.spById(r.sp),tot=r.buy+r.tr;return`<div class="vrow" style="display:block;padding:8px 0"><b>${c.emo} ${c.nm}</b> quer você no <b>${r.nm}</b> · ${CAL.fmt(r.first)}${CAL.rel(r.first)?' ('+CAL.rel(r.first)+')':''}
      <div style="font-size:13px;margin:4px 0">${r.kind==='stake'?`💼 Investimento: paga R$ ${brl(tot)} e fica com <b>${Math.round(r.cut*100)}%</b> do seu prêmio.`:r.kind==='promo'?`🎟️ Promoção: ticket grátis (R$ ${brl(tot)}), você divulga a campanha.`:`🎁 Pacote: paga R$ ${brl(tot)}${r.tr?' (inscrição, passagem e hotel)':''}, prêmio 100% seu${r.bon?`, bônus de R$ ${brl(r.bon)} se premiar`:''}.`} <span class="muted">Responda até ${CAL.fmt(r.exp)}.${r.kind!=='stake'?' Faltar depois de aceitar = advertência.':''}</span></div>
      <button class="sm pri" data-spx="acc:${r.id}">Aceitar</button> <button class="sm" data-spx="no:${r.id}">Recusar</button></div>`}).join('')}</div>`;
    return h},
  budTxt(sp){const c=this.c(sp.id),cf=this.conf(sp.id);if(!c||!c.budT)return cf.req?'<div style="font-size:13px;margin-top:4px">🎟️ Sem verba fixa de buy-in, mas convida pra torneios específicos e paga a entrada.</div>':'';
    return`<div style="font-size:13px;margin-top:4px">🎟️ Verba de buy-ins: <b>R$ ${brl(c.bud)}</b> de R$ ${brl(c.budT)}${cf.trv?' (cobre viagem e hotel)':''}. Use na Agenda: "Pela verba". ${cf.req?'Também convida pra torneios específicos.':''}${c.warn?` <span class="bad">Advertências: ${c.warn} de 2.</span>`:''}</div>`}};
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-spx]');if(!t)return;e.stopPropagation();e.preventDefault();const[a,id]=t.dataset.spx.split(':');
  const m=a==='acc'?SPX.accept(+id):SPX.decline(+id);LIFE.flash=m;if(location.hash==='#vida'){renderLife();window.scrollTo(0,0)}},true);
