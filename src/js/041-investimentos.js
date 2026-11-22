/* ----- investimentos ----- */
const BIZ={bar:{nm:'Bar temático de poker',emo:'🍺',price:450000,mu:18000,sd:16000,fame:.5,desc:'Rende por mês, mas depende do movimento: tem mês no prejuízo.'},
  clube:{nm:'Clube de poker próprio',emo:'♠️',price:2500000,mu:95000,sd:45000,fame:2,desc:'Rake das mesas todo mês e você pode organizar torneios toda semana.'},
  acad:{nm:'Franquia de academia',emo:'🏋️',price:900000,mu:32000,sd:12000,fame:.2,desc:'Renda mais estável. E treino de graça.'}};
const INV={
  st(){const s=LIFE.s;s.inv=s.inv||{rent:{},biz:{},cdb:0};return s.inv},
  rentInc(id){const H=HOMES.find(x=>x.id===id);return H?Math.round(H.rent*30*.85):0},
  toggle(id){const I=this.st();if(id===LIFE.s.home||!LIFE.s.own[id])return'';I.rent[id]=!I.rent[id];LIFE.commit();return I.rent[id]?`Imóvel anunciado: R$ ${brl(this.rentInc(id))} por mês de aluguel (já descontada a imobiliária).`:'Imóvel tirado do aluguel.'},
  buy(k){const B=BIZ[k],I=this.st();if(!B||I.biz[k])return'';if(!WALLET.can(B.price))return'Saldo insuficiente.';WALLET.add(-B.price,`Investimento: ${B.nm}`);I.biz[k]={d:CAL.today(),tot:0};LIFE.addFame(B.fame);CIRC.post({k:'vida',title:`${CIRC.me()} investe em ${B.nm.toLowerCase()}`,body:'O jogador agora também é empresário.'});LIFE.commit();return`${B.emo} Agora você é dono de ${B.nm.toLowerCase()}.`},
  sell(k){const B=BIZ[k],I=this.st();if(!I.biz[k])return'';const v=Math.round(B.price*.8);WALLET.add(v,`Venda: ${B.nm}`);delete I.biz[k];LIFE.commit();return`Vendeu por R$ ${brl(v)} (80% do valor).`},
  cdb(v){const I=this.st();if(v>0){if(!WALLET.can(v))return'Saldo insuficiente.';WALLET.add(-v,'Aplicação em renda fixa');I.cdb+=v}else{const x=I.cdb;if(!x)return'';WALLET.add(x,'Resgate da renda fixa');I.cdb=0}LIFE.commit();return v>0?`Aplicado. Total: R$ ${brl(I.cdb)}.`:'Resgatado.'},
  month(add){const I=this.st();Object.keys(I.rent).forEach(id=>{if(I.rent[id]&&LIFE.s.own[id]&&id!==LIFE.s.home)add(`aluguel recebido: ${HOMES.find(x=>x.id===id).nm.toLowerCase()}`,this.rentInc(id))});
    Object.entries(I.biz).forEach(([k,b])=>{const B=BIZ[k],v=Math.round((B.mu+(Math.random()*2-1)*B.sd*1.4)/100)*100;b.tot+=v;b.last=v;add(`${B.nm.toLowerCase()} (mês)`,v)});
    if(I.cdb>0){const y=Math.round(I.cdb*.011);I.cdb+=y;LIFE.note('🏦','Renda fixa rendeu',`+R$ ${brl(y)} (cerca de 1,1% no mês), reaplicado.`)}},
  tourney(){const I=this.st();if(!I.biz.clube)return'';const s=LIFE.s;if(s.clubT!=null&&CAL.today()-s.clubT<7)return`Próximo torneio do clube em ${7-(CAL.today()-s.clubT)} dia(s).`;const tc=CLK.can(5,'organizar o torneio');if(tc)return tc;
    s.clubT=CAL.today();CLK.add(5);s.energy=Math.max(0,s.energy-10);const N=30+Math.round(s.fame*.8+Math.random()*30),gtd=50000,buy=1000,pool=N*buy,ov=Math.max(0,gtd-pool),fee=Math.round(N*buy*.12),v=fee-ov;
    WALLET.add(v,`Torneio no seu clube (${N} inscritos)`);LIFE.addFame(.6);Object.keys(LIVES.s.bots).filter(n=>LIFE.rel(n)>=1).slice(0,3).forEach(n=>LIVES.relAdd(n,'Você',.2));FEED.push('Seu clube','♠️',`Torneio de R$ 50 mil garantidos no clube de ${CIRC.me()}: ${N} inscritos.`,'#TorneioDo'+CIRC.me().split(' ')[0]);LIFE.commit();
    return`♠️ ${N} inscritos, garantido de R$ 50 mil${ov?` (overlay de R$ ${brl(ov)})`:''}. ${v>=0?`Lucro de R$ ${brl(v)}`:`Prejuízo de R$ ${brl(-v)}`} com a taxa. Os amigos que jogaram adoraram.`},
  panel(){const s=LIFE.s,I=this.st(),own=HOMES.filter(H=>s.own[H.id]&&H.id!==s.home);
    return`<div class="panel"><h3>💼 Investimentos</h3>
      ${own.length?`<div class="nsec">Imóveis seus pra alugar</div>${own.map(H=>`<div class="vrow"><span>${H.emo} ${H.nm}${I.rent[H.id]?' <span class="vtag">alugado</span>':''}</span><button class="sm" data-inv="rent:${H.id}">${I.rent[H.id]?'Parar de alugar':`Alugar · R$ ${brl(this.rentInc(H.id))}/mês`}</button></div>`).join('')}`:''}
      <div class="nsec">Negócios</div>${Object.entries(BIZ).map(([k,B])=>{const b=I.biz[k];return`<div class="vrow" style="display:block;padding:8px 0"><b>${B.emo} ${B.nm}</b>${b?` <span class="vtag">seu</span>`:''}<div class="muted" style="font-size:13px">${B.desc}</div>
        <div style="font-size:13px;margin:4px 0">${b?`Último mês: ${b.last!=null?(b.last>=0?'+':'−')+'R$ '+brl(Math.abs(b.last)):'ainda não fechou'} · acumulado ${(b.tot>=0?'+':'−')+'R$ '+brl(Math.abs(b.tot))}`:`R$ ${brl(B.price)} · rende em média R$ ${brl(B.mu)}/mês`}</div>
        ${b?`${k==='clube'?`<button class="sm pri" data-inv="tour">♠️ Organizar torneio (5h)</button> `:''}<button class="sm" data-inv="sell:${k}">Vender (80%)</button>`:`<button class="sm" data-inv="buy:${k}">Investir</button>`}</div>`}).join('')}
      <div class="nsec">🏦 Renda fixa</div><div style="font-size:14px">Aplicado: <b>R$ ${brl(I.cdb)}</b> · rende cerca de 1,1% ao mês, todo dia 5.</div>
      <div class="dacts" style="margin-top:6px"><button class="sm" data-inv="cdb:100000">+ R$ 100 mil</button><button class="sm" data-inv="cdb:1000000">+ R$ 1 milhão</button>${I.cdb?'<button class="sm" data-inv="cdb:0">Resgatar tudo</button>':''}</div>
      <p class="muted" style="font-size:12px;margin:6px 0 0">Aluguel e negócios caem todo dia 5. É simulação do jogo: negócio pode dar prejuízo num mês ruim.</p></div>`}};

