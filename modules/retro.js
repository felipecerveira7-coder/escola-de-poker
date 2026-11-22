
/* ----- retrospectiva: sua carreira simulada como profissional desde o primeiro torneio ----- */
const RETRO={open:false,mode:'elite',FX:5.8,
  /* torneios de elite com campo parecido com os seus (valores reais de 2025-2026) */
  ELITE:[{max:12,nm:'Super High Roller Series: mesa de segunda chance',usd:15000,ref:'Torneios paralelos de US$ 15 mil da Super High Roller Bowl, com 13 entradas'},
    {max:20,nm:'PokerGO Tour: High Roller',usd:25000,ref:'High rollers de US$ 25 mil em Las Vegas, com uns 20 jogadores'},
    {max:30,nm:'Super High Roller Bowl',usd:100000,ref:'US$ 103 mil de buy-in, de 21 a 43 jogadores'},
    {max:999,nm:'WSOP Super High Roller',usd:250000,ref:'US$ 250 mil de buy-in, de 56 a 75 entradas'}],
  BR:[['João Simão',31000000],['Yuri Dzivielevski',14860000],['Pedro Padilha',7900000],['Bruno Volkmann',5460000],['Belarmino de Souza',4400000],['Felipe Ramos',3920000]],
  list(){const doneE=Object.entries(CAL.st().done).filter(([k,v])=>v&&v.place&&!v.noshow),used=new Set();
    const T=HIST.sessions().filter(x=>x.mode==='tour'&&x.place).map(x=>{const of=x.of||((x.cfg&&x.cfg.bots||0)+1),mtt=!!(x.cfg&&x.cfg.field),ob=(x.cfg&&x.cfg.buyin)||x.buyin||0;
      return{t:Math.max(x.t||0,...(x.hands||[]).map(h=>h.t||0)),place:x.place,of,mtt,ob,hpl:(x.cfg&&x.cfg.hpl)||0}}).sort((a,b)=>a.t-b.t);
    T.forEach(x=>{const de=doneE.find(([k,v])=>!used.has(k)&&v.place===x.place&&v.of===x.of);if(de){used.add(de[0]);const id=de[0].split('@')[0];x.cal=1;x.fix=id==='sat'?'sat':RK.EVC[id];x.fb=EVTS[id]?EVTS[id].buy:0}
      else if(x.mtt&&x.of>=27&&x.ob>=1000){x.fix='main0';x.fb=1000}});
    return T.filter(x=>x.fix!=='sat')},
  run(mode){mode=mode||this.mode;const T=this.list(),SNG=[50,100,200,500,1000,2500],MT=[200,500,1000,2500,3000],FX=this.FX;
    let bank=5000,C=0,W=0,P=0,sp=null,spList=[],prizes=0,buys=0,spPay=0,gigs=0,living=0,peak=bank,rows=[],eP=0,eB=0,usd=0;
    T.forEach((x,i)=>{let buy,code,name,elite=mode==='elite'&&!x.cal;
      if(elite){const E=this.ELITE.find(e=>x.of<=e.max&&(x.mtt||e.max===12))||this.ELITE[0];buy=Math.round(E.usd*FX);name=E.nm;code=null}
      else{const tiers=x.mtt?MT:SNG,need=x.mtt?50:30;buy=tiers[0];tiers.forEach(b=>{if(bank>=b*need)buy=b});
        code=RK.analog(x.of,buy,x.hpl,x.mtt);if((code==='main'||code==='etapa')&&buy<2500)code=buy>=1000?'fds':'deep';if(x.fix){code=x.fix;buy=x.fb||buy}name=RK.AN[code][0]}
      const pay=CIRC.pays(x.of),prize=x.place<=pay.length?Math.round(x.of*buy*pay[x.place-1]):0;
      bank+=prize-buy;prizes+=prize;buys+=buy;if(elite){eP+=prize;eB+=buy;usd+=prize/FX}
      C+=CIRC.pts(x.place,x.of)*(elite?3:1);if(x.place===1)W++;else if(x.place<=3)P++;
      const fame=clamp(40*(1-Math.exp(-C/1500))+Math.min(15,W*3+P*1.5)+(x.place===1?3:prize?1:0)+Math.min(30,usd/100000),0,100);
      const best=SPONS.filter(p=>fame>=p.fame).pop();if(best&&(!sp||best.fame>sp.p.fame)){if(sp)spList.push(sp);sp={p:best,from:i+1,to:i+1,earn:0}}
      let ev='';if(sp){const g=Math.round(sp.p.day*3.5)+(x.place===1?sp.p.win:prize?sp.p.itm:0)+Math.round(prize*(sp.p.pct||0));sp.earn+=g;sp.to=i+1;spPay+=g;bank+=g;if(sp.from===i+1)ev=`${sp.p.emo} fechou com ${sp.p.nm}`}
      if(fame>=18&&i%4===3){const c=Math.round((400+fame*fame*1.6)/50)*50;gigs+=c;bank+=c;ev=ev||`🎟️ presença paga (R$ ${brl(c)})`}
      const lv=elite?6000:300;living+=lv;bank-=lv;peak=Math.max(peak,bank);
      rows.push({i:i+1,name,elite,buy,place:x.place,of:x.of,prize,bank,fame:Math.round(fame),ev})});
    if(sp)spList.push(sp);
    const eNet=eP-eB,stake=Math.max(0,eNet)*.5,bankStake=bank-eNet+stake;
    return{mode,rows,n:rows.length,prizes,buys,spPay,gigs,living,bank,peak,spList,W,P,itm:rows.filter(r=>r.prize).length,start:5000,eP,eB,eNet,stake,bankStake,usd,ne:rows.filter(r=>r.elite).length}},
  brPos(usd){const L=this.BR.filter(x=>x[1]>usd).length;return L+1},
  html(){const s=LIFE.s;if(!this.open)return`<div class="panel"><h3>📜 E se você vivesse de poker desde o começo?</h3><div style="font-size:14px">Pega todos os torneios que você já jogou, na ordem, e simula a sua vida de profissional: premiação real, patrocínios que a fama teria atraído, presenças pagas e custo de vida. Dá pra ver no circuito local ou como se fossem os torneios de elite do mundo com campo parecido.</div>
      <div style="margin-top:8px"><button class="sm pri" data-ag="rt:open">Simular minha carreira</button></div></div>`;
    const R=this.run(),cur=WALLET.s.bal,done=s.retro,el=R.mode==='elite';if(!R.n)return`<div class="panel"><h3>📜 Retrospectiva</h3><div class="muted">Nenhum torneio no histórico ainda.</div></div>`;
    const v=(t,x,c)=>`<div class="vrow" style="font-size:14px"><span>${t}</span><b class="${c||''}" style="white-space:nowrap">${x}</b></div>`,usd=x=>`US$ ${brl(Math.round(x/this.FX))}`;
    let h=`<div class="panel"><div class="anaf" style="margin-bottom:8px"><button class="sm${el?' on':''}" data-ag="rt:mode:elite">🌎 Elite mundial</button> <button class="sm${!el?' on':''}" data-ag="rt:mode:local">🏠 Circuito local</button></div>
      <h3>📜 ${el?'Seus torneios como se fossem a elite mundial':'Sua carreira no circuito local'} (${R.n})</h3>
      ${el?`<div class="muted" style="font-size:12px;margin:-4px 0 6px">Cada torneio antigo virou o evento de elite com campo do mesmo tamanho, na mesma colocação. Os torneios da Agenda ficam como estão. Dólar a R$ ${String(this.FX).replace('.',',')}.</div>`:''}
      ${v('Banca inicial',`R$ ${brl(R.start)}`)}${v('Prêmios',`+R$ ${brl(R.prizes)}`,'ok')}${v('Buy-ins',`−R$ ${brl(R.buys)}`,'bad')}${v('Patrocínios',`+R$ ${brl(R.spPay)}`,'ok')}${v('Presenças pagas',`+R$ ${brl(R.gigs)}`,'ok')}${v(el?'Viagens, hotel e custo de vida':'Custo de vida (≈ R$ 2.550/mês)',`−R$ ${brl(R.living)}`,'bad')}
      ${v('<b>Bancando tudo sozinho</b>',`R$ ${brl(R.bank)}`,R.bank>=R.start?'ok':'bad')}
      ${el?`${v('<b>Vendendo 50% da ação</b> (o fundo paga os buy-ins de elite e leva metade do lucro)',`R$ ${brl(R.bankStake)}`,R.bankStake>=R.start?'ok':'bad')}
        <div class="muted" style="font-size:12px;margin-top:6px">Nos eventos de elite: ${usd(R.eP)} em prêmios e ${usd(R.eB)} em buy-ins, saldo de ${R.eNet>=0?'+':'−'}${usd(Math.abs(R.eNet))}. Com ${usd(R.eP)} em prêmios ao vivo você seria o ${this.brPos(R.eP/this.FX)}º maior ganhador brasileiro de todos os tempos (referências: ${this.BR.slice(0,4).map(x=>`${x[0]} US$ ${(x[1]/1e6).toFixed(1).replace('.',',')} mi`).join(', ')}).</div>`
        :`<div class="muted" style="font-size:12px;margin-top:6px">${R.W} título${R.W===1?'':'s'}, ${R.P} pódio${R.P===1?'':'s'} e ${R.itm} premiações em ${R.n} torneios.</div>`}
      ${v('Sua banca real agora',`R$ ${brl(cur)}`)}
      ${done?`<div class="muted" style="margin-top:8px">✅ Você já assumiu uma carreira simulada.</div>`:`<div class="sxbtns" style="margin-top:10px">${R.bank>cur?`<button class="sm pri" data-ag="rt:apply:${R.mode}:self">Assumir${el?' bancando sozinho':''} (+R$ ${brl(R.bank-cur)})</button>`:''}${el&&R.bankStake>cur?`<button class="sm" data-ag="rt:apply:elite:stake">Assumir vendendo ação (+R$ ${brl(R.bankStake-cur)})</button>`:''}${R.bank<=cur&&!(el&&R.bankStake>cur)?'<span class="muted">A simulação não supera sua banca atual.</span>':''}</div>`}</div>`;
    h+=`<div class="panel"><h3>🤝 Patrocínios que você teria</h3>${R.spList.length?R.spList.map(x=>`<div class="vrow" style="font-size:14px"><span>${x.p.emo} ${x.p.nm} <span class="muted" style="font-size:12px">torneios ${x.from} a ${x.to}</span></span><b class="ok">R$ ${brl(x.earn)}</b></div>`).join(''):'<div class="muted" style="font-size:14px">Nenhum: a fama não chegou ao mínimo de uma marca.</div>'}</div>`;
    if(el)h+=`<div class="panel"><h3>🌎 Equivalências</h3>${this.ELITE.map(e=>`<div style="font-size:13px;padding:3px 0">• Até ${e.max>100?'45+':e.max} jogadores${e.max===12?' (mesa única)':''}: <b>${e.nm}</b>, US$ ${brl(e.usd)}. <span class="muted">${e.ref}.</span></div>`).join('')}</div>`;
    h+=`<div class="panel"><h3>Torneio a torneio</h3><div style="overflow-x:auto"><table class="small" style="font-size:12px"><tr><th>#</th><th>Equivale a</th><th>Buy-in R$</th><th>Lugar</th><th>Prêmio R$</th><th>Banca</th><th>Fama</th></tr>
      ${R.rows.map(r=>`<tr><td>${r.i}</td><td>${r.name}${r.ev?`<div class="muted">${r.ev}</div>`:''}</td><td>${brl(r.buy)}</td><td>${r.place}º/${r.of}</td><td class="${r.prize?'ok':''}">${r.prize?brl(r.prize):'—'}</td><td class="${r.bank<0?'bad':''}">${brl(r.bank)}</td><td>${r.fame}</td></tr>`).join('')}</table></div>
      <div style="margin-top:8px"><button class="sm" data-ag="rt:close">Fechar retrospectiva</button></div></div>`;
    return h},
  apply(mode,how){const s=LIFE.s;if(s.retro)return'Você já assumiu uma carreira simulada.';const R=this.run(mode),cur=WALLET.s.bal,target=how==='stake'?R.bankStake:R.bank;if(target<=cur)return'A simulação não supera sua banca atual.';
    WALLET.add(target-cur,`Retrospectiva: carreira simulada (${mode==='elite'?'elite mundial':'circuito local'}${how==='stake'?', vendendo ação':''})`);let m=`Banca ajustada para R$ ${brl(target)}.`;
    const last=R.spList[R.spList.length-1];if(last&&!s.sp){const p=last.p;s.sp={id:p.id,nm:p.nm,emo:p.emo,day:p.day,win:p.win,itm:p.itm,pct:p.pct||0,req:p.req,clean:!!p.clean,start:s.day,end:s.day+p.dur,done:{t:0,mtt:0,post:0,iv:0}};s.spEver=1;m+=` Contrato com ${p.nm} ativo.`;
      CIRC.post({k:'vida',title:`${CIRC.me()} renova com ${p.nm}`,body:'A marca acompanha o jogador desde os primeiros resultados.'})}
    if(mode==='elite'&&R.eP>0)CIRC.post({k:'vida',title:`${CIRC.me()} soma US$ ${brl(Math.round(R.eP/this.FX))} em prêmios de elite`,body:`Com resultados em Super High Roller Bowl e eventos de high roller, o jogador entra na lista dos maiores ganhadores do Brasil.`});
    s.retro={day:s.day,bal:target,mode};LIFE.commit();LIVES.commit();return'📜 '+m}};
