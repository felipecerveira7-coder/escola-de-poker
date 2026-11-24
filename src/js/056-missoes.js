/* ----- missões ----- */
const MIS={view:'ag',
  st(){const s=LIFE.s;return s.mis=s.mis||{cl:{}}},
  wk(d){return d-((CAL.dow(d)+6)%7)},
  moRange(d){const t=CAL.date(d),c=LIVES.s.calStart,a=new Date(t.getFullYear(),t.getMonth(),1,12),b=new Date(t.getFullYear(),t.getMonth()+1,0,12);return[Math.round((a-c)/864e5)+1,Math.round((b-c)/864e5)+1]},
  played(a,b){return Object.entries(CAL.st().done).filter(([k,v])=>{const d=+k.split('@')[1];return d>=a&&d<=b&&v&&!v.noshow&&v.place})},
  items(kinds,a,b){return CAL.st().items.filter(x=>x.status==='done'&&kinds.includes(x.kind)&&x.day>=a&&x.day<=b).length},
  prizes(){return WALLET.s.log.filter(x=>/^Prêmio/.test(x.txt)&&x.v>0).reduce((s,x)=>s+x.v,0)},
  list(){const t=CAL.today(),s=LIFE.s;if(s.sp)s.spEver=1;const f=s.fame,A=CAL.st(),wa=this.wk(t),wb=wa+6,[ma,mb]=this.moRange(t),k=RK.key(t),O=[];
    const add=(g,id,per,tt,v,n,r,hint)=>O.push({g,id:id+(per!=null?'@'+per:''),t:tt,v:Math.min(v,n),n,r,hint,ok:v>=n});
    const tw=this.played(wa,wb),tg=f<20?2:f<50?3:4;let rest=0;for(let d=wa;d<=Math.min(wb,t);d++){const u=A.used[d];if(u==='rest'||u==='ferias'||(!u&&d<t))rest++}
    add('w','w_tour',wa,`Jogar ${tg} torneios`,tw.length,tg,.6,'Pros de torneio ao vivo jogam de 50 a 70 por ano. Aqui o calendário é mais apertado, então o ritmo é maior.');
    add('w','w_itm',wa,'Premiar em 1 torneio',tw.filter(([,v])=>v.prize>0).length,1,.8);
    add('w','w_rest',wa,'Ter 1 dia de folga',rest,1,.4,'Dia sem compromisso, descanso ou férias. Segura o desgaste mental.');
    add('w','w_fam',wa,'Um programa com família ou namoro',this.items(['fam','love'],wa,wb),1,.4);
    if(s.sp)add('w','w_mkt',wa,LIFE.sps().length>1?'Cumprir uma ação de patrocinador':`Cumprir uma ação da ${s.sp.nm}`,this.items(['mkt'],wa,wb),1,.5);
    if(f>=10){let lv=0;for(let d=wa;d<=wb;d++)if(A.used[d]==='live')lv++;add('w','w_media',wa,'Fazer uma live ou ir a um evento',lv+this.items(['gig'],wa,wb),1,.4)}
    const md=this.played(ma,mb),inM=k2=>{const d=+k2.split('@')[1];return d>=ma&&d<=mb};
    add('m','m_main',ma,'Jogar o Main Event do mês',md.some(([k2])=>k2.startsWith('main@'))?1:0,1,1.5);
    add('m','m_etapa',ma,'Ir à etapa do Circuito Nacional (ou ganhar o satélite)',md.some(([k2])=>k2.startsWith('etapa@'))||Object.entries(A.reg).some(([k2,r])=>k2.startsWith('etapa@')&&r.ticket&&inM(k2))?1:0,1,1.5,'Satélites às terças e quintas antes da etapa dão o pacote completo.');
    add('m','m_zone',ma,'3 resultados que pontuam no ranking',RK.log().filter(x=>x[0]==='Você'&&x[1]>=ma&&x[1]<=mb).length,3,1.5);
    const bk=EVTS.sabado.buy*50;add('m','m_brm',ma,`Banca de 50 buy-ins do Sábado (R$ ${brl(bk)})`,WALLET.s.bal>=bk?1:0,1,1,'Pros de torneio guardam de 50 a 100 buy-ins pra aguentar a variância.');
    const T=RK.season(k),pos=T.findIndex(x=>x.me)+1,me=T[pos-1];
    add('s','s_res',k,'10 resultados pontuados (o máximo que conta)',me.res,10,3);
    add('s','s_top10',k,'Entrar no top 10 da temporada',me.pts>0&&pos<=10?1:0,1,2);
    add('s','s_top3',k,'Entrar no top 3 da temporada',me.pts>0&&pos<=3?1:0,1,3,'O pódio leva premiação do ranking no fim do trimestre.');
    const done=Object.values(A.done).filter(v=>v&&v.place&&!v.noshow),G=RK.geral(),gp=G.findIndex(x=>x.me)+1,
      mainFT=Object.entries(A.done).some(([k2,v])=>k2.startsWith('main@')&&v&&v.place&&v.place<=9),etITM=Object.entries(A.done).some(([k2,v])=>k2.startsWith('etapa@')&&v&&v.prize>0);
    [['c_itm','Primeiro prêmio em torneio',done.some(v=>v.prize>0)?1:0,1],['c_win','Primeira vitória',done.some(v=>v.place===1)?1:0,1],['c_10k','R$ 10 mil em prêmios na carreira',this.prizes(),10000],
     ['c_ft','Mesa final (top 9) do Main Event',mainFT?1:0,1],['c_sp','Fechar um patrocínio',s.sp||s.spEver?1:0,1],['c_etapa','Premiar numa etapa do Circuito Nacional',etITM?1:0,1],
     ['c_pro','Viver de poker: sem emprego e com R$ 50 mil de banca',!s.job&&WALLET.s.bal>=50000?1:0,1],['c_g10','Top 10 do ranking geral',G[gp-1].pts>0&&gp<=10?1:0,1],
     ['c_champ','Campeão de uma temporada',(LIVES.s.champs||[]).some(x=>x.n==='Você')?1:0,1],['c_fame','Fama 70: estrela do circuito',Math.round(f),70]].forEach(([id,tt,v,n])=>add('c',id,null,tt,v,n,2.5));
    return O},
  cnt(){if(!CAL.on())return 0;try{const C=this.st().cl;return this.list().filter(x=>x.ok&&!C[x.id]).length}catch(e){return 0}},
  claim(id){const x=this.list().find(o=>o.id===id),C=this.st().cl;if(!x||!x.ok||C[id])return'';C[id]=CAL.today();LIFE.addFame(x.r);LIFE.addMood(1);LIFE.commit();return`🎯 Missão cumprida: ${x.t}. Mídia +${String(Math.round(x.r*15)/10).replace('.',',')}.`},
  seg(){const c=this.cnt();return`<div class="anaf" style="margin:0 0 10px"><button class="sm${this.view!=='mis'?' on':''}" data-ag="mv:ag">📅 Agenda</button> <button class="sm${this.view==='mis'?' on':''}" data-ag="mv:mis">🎯 Missões${c?` <span class="vbdg nbg" style="position:static;margin-left:4px">${c}</span>`:''}</button></div>`},
  html(){const L=this.list(),C=this.st().cl,t=CAL.today(),wa=this.wk(t),[,mb]=this.moRange(t),[,sb]=RK.range(RK.key(t));
    const row=x=>`<div class="agrow"><div style="min-width:0;flex:1"><b style="${C[x.id]?'opacity:.55':''}">${C[x.id]?'✅':x.ok?'🎯':'▫️'} ${x.t}</b><div class="mbar"><i style="width:${Math.round(x.v/x.n*100)}%"></i></div><div class="muted" style="font-size:12px">${x.n>=1000?`R$ ${brl(x.v)} de R$ ${brl(x.n)}`:`${nf(x.v)}/${nf(x.n)}`}${x.hint?` · ${x.hint}`:''}</div></div>
      <div class="agact">${C[x.id]?'<span class="muted">feita</span>':x.ok?`<button class="sm pri" data-ag="mc:${x.id}">Resgatar</button>`:`<span class="muted" style="font-size:12px">+${String(Math.round(x.r*15)/10).replace('.',',')}<br>mídia</span>`}</div></div>`;
    const sec=(g,title,sub)=>{const it=L.filter(x=>x.g===g);return`<div class="panel"><h3>${title}</h3><div class="muted" style="font-size:12px;margin:-4px 0 4px">${sub}</div>${it.map(row).join('')}</div>`};
    const car=L.filter(x=>x.g==='c'),nx=car.filter(x=>!C[x.id]);
    return RETRO.html()+sec('w','Semana',`Renova na segunda (${CAL.fmt(wa+7)}).`)+sec('m','Mês',`Até ${CAL.fmt(mb)}.`)+sec('s',`Temporada ${RK.label(RK.key(t))}`,`Até ${CAL.fmt(sb)}. Veja o ranking na aba Circuito.`)
      +`<div class="panel"><h3>Carreira</h3><div class="muted" style="font-size:12px;margin:-4px 0 4px">${car.length-nx.length} de ${car.length} marcos.</div>${nx.slice(0,4).map(row).join('')}${car.filter(x=>C[x.id]).map(row).join('')}</div>
      <div class="panel"><h3>📖 Como é a rotina de um pro de torneio</h3><div style="font-size:14px;line-height:1.5">
      • Quem vive de torneio ao vivo joga algo entre 50 e 70 torneios por ano, viajando de festival em festival, com buy-ins de centenas a milhares.<br>
      • A variância é brutal: mesmo um bom jogador pode passar 30 a 50 torneios sem um resultado grande. O ano costuma depender de uma ou duas campanhas fundas.<br>
      • A banca segura isso: de 50 a 100 buy-ins pra torneio, e descer de nível quando ela encolhe.<br>
      • Fora da mesa: viagem, hotel, patrocínio, aulas, venda de cotas e muita mídia.<br>
      • Aqui o calendário é comprimido: cada trimestre é uma temporada, e de 2 a 4 torneios por semana é um bom ritmo.</div></div>`}};
(()=>{const _sd=CAL.startDay;CAL.startDay=function(d){_sd.call(this,d);try{const a=RK.key(d-1),b=RK.key(d);if(a!==b)RK.close(a)}catch(e){}};
  const _sc=CIRC.score;CIRC.score=function(n,place,of,prize,buyin,tag){_sc.call(this,n,place,of,prize,buyin);try{RK.rec(n,place,of,buyin||LIVES.BUYIN,prize,tag)}catch(e){}};
  CIRC.table=function(){return RK.season()};
  CIRC.mine=function(){return RK.season().find(x=>x.me)||{pts:0,t:0,w:0,itm:0,profit:0}};
  const _fin=CAL.finish;CAL.finish=function(key,res){_fin.call(this,key,res);try{const ev=this.byKey(key);if(ev&&res&&!res.noshow&&res.place)RK.rec('Você',res.place,res.of||ev.E.N,ev.E.buy,res.prize||0,ev.E.sat?'sat':'',null,RK.EVC[ev.id]);CIRC.leaderCheck();LIVES.commit()}catch(e){}};
})();

function homeGrid(s,H){return`<div class="vgrid">${HOMES.filter(x=>x.id!==H.id&&x.id!=='pais').map(x=>`<div class="panel vcard"><div class="vemo">${x.emo}</div><b>${x.nm}</b>${s.own[x.id]?' <span class="vtag">sua · alugada pra terceiros</span>':''}<div class="muted" style="font-size:13px">${x.desc}</div>
        <div style="font-size:13px;margin:6px 0">Aluguel R$ ${brl(x.rent*30)}/mês · Compra R$ ${brl(x.price)} · Conforto ${'★'.repeat(x.comfort+1)} · Status +${x.status}</div>
        ${s.own[x.id]?`<button class="sm" data-buy="home:${x.id}:move">Morar aqui</button> <button class="sm" data-buy="home:${x.id}:sell">Vender (R$ ${brl(x.price*.9)})</button>`:`<button class="sm" data-buy="home:${x.id}:rent">Alugar (mudança R$ ${brl(600+x.rent*5)})</button> <button class="sm" data-buy="home:${x.id}:cash">Comprar à vista</button> <button class="sm" data-buy="home:${x.id}:fin">Financiar (entrada R$ ${brl(x.price*.2)})</button>`}</div>`).join('')}</div>
      <p class="muted" style="font-size:12px">Financiamento: entrada de 20% e o resto com 15% de juros, em 12 parcelas mensais. Casa que você comprou e não mora fica alugada pra terceiros e rende 70% do aluguel por mês, menos o condomínio. Venda por 90% do preço. Os dias passam quando você avança o calendário.</p>`}
function renderFam(){const s=LIFE.s,F=FAM.st(),L=s.love;let h=`<div class="panel"><h3>👨‍👩‍👧 Família</h3><p class="muted" style="font-size:13px;margin-top:0">O laço cai devagar quando você some. Ligar, visitar e não faltar aos compromissos de família mantém todo mundo perto. Família nunca vira inimiga, mas fica magoada.</p>
  ${F.map(p=>`<div class="fmc" style="padding:8px 0;border-top:1px solid var(--line)"><div class="vemo fav">${FACE.fam(p,46)}</div><div style="flex:1;min-width:0"><b>${lx(p.nm)}</b> <span class="muted" style="font-size:12px">${p.rel} · laço ${Math.round(p.b)}</span>${vbar(p.b,p.b<40?'var(--bad)':'var(--ok)')}
    <div class="vact" style="margin:4px 0 0"><button class="sm" data-fm="call:${p.id}">📞 Ligar</button><button class="sm" data-fm="visit:${p.id}">🏠 Visitar</button><button class="sm${FAM.gp===p.id?' pri':''}" data-fm="gift:${p.id}">🎁 Dar presente</button></div>${FAM.gp===p.id?GIFT.panel(p.id):''}</div></div>`).join('')}</div>`;
  h+=`<div class="panel"><h3>❤️ Relacionamento</h3>`;
  if(!L)h+=`<div style="font-size:14px">Solteiro(a). Interesse: <select data-r="loveIn" style="padding:4px 8px;border-radius:8px;background:rgba(0,0,0,.3);color:inherit;border:1px solid var(--line)">${[['f','mulheres'],['m','homens'],['x','tanto faz']].map(([k,t])=>`<option value="${k}"${(s.loveIn||'f')===k?' selected':''}>${t}</option>`).join('')}</select></div>
    <div class="vact"><button class="sm pri" data-go="tab:namoro">💘 Abrir o app de namoro</button>${LIVES.ALL().some(n=>LIVES.s.bots[n]&&LIFE.rel(n)>=1)?'<button class="sm" data-go="tab:namoro" onclick="MATCH.view=\'amg\'">🤝 Pedir pra um amigo apresentar</button>':''}</div>
    <p class="muted" style="font-size:12px;margin:4px 0 0">Uma tentativa por dia. Fama e status ajudam no app.</p>`;
  else h+=`<div class="fmc"><div class="vemo fav">${FACE.person(L,46)}</div><div style="flex:1"><b>${lx(L.nm)}</b> <span class="muted" style="font-size:12px">${L.job} · ${L.stage==='namoro'?`namorando há ${CAL.today()-L.since} dias${s.loveHome?' · moram juntos':''}`:`saindo (${L.dates||0} encontro${(L.dates||0)===1?'':'s'})`}</span>${vbar(L.b,L.b<30?'var(--bad)':'#e57399')}<div class="vsub">Relação ${Math.round(L.b)}/100. ${L.stage==='namoro'?'Esfria rápido se você só joga poker: marque programas e não falte.':'Precisa de 2 encontros e relação 40 pra pedir em namoro.'}</div></div></div>
    <div class="vsub" style="margin-top:2px">Perfil: ${LOVE.known(L)?`<b>${LOVE.tnm(L)}</b>`:'ainda descobrindo (saiam 2 vezes pra conhecer)'}</div>${L.req?`<div class="vsum" style="margin-top:6px">💸 ${lx(L.nm)} pediu <b>R$ ${brl(L.req.v)}</b> pra ${L.req.why}. <button class="sm pri" data-fm="pay">Mandar Pix</button> <button class="sm" data-fm="deny">Negar</button></div>`:''}
    <div class="vact" style="margin-top:8px"><button class="sm pri" data-fm="chat:">💬 Conversar no celular</button></div><div class="nsec" style="margin-top:8px">Chamar pra sair (manda a mensagem no celular)</div><div class="sxbtns">${Object.entries(LOVE.D).filter(([k])=>k!=='casa'||s.home!=='pais').map(([k,D])=>`<button class="sm" data-fm="date:${k}">${D.emo} ${D.nm} · R$ ${brl(LOVE.cost(k))}</button>`).join('')}</div>
    <div class="nsec" style="margin-top:8px">Presentear</div><div class="sxbtns">${Object.entries(LOVE.G).map(([k,G])=>`<button class="sm" data-fm="lgift:${k}">${G.emo} ${G.nm} · R$ ${brl(Math.round(G.cost*(1+LIFE.status()*.1)/10)*10)}</button>`).join('')}</div>
    <div class="vact" style="margin-top:8px">${L.stage==='crush'?'<button class="sm" data-fm="ask">💍 Pedir em namoro</button>':''}${L.stage==='namoro'&&!s.loveHome&&s.home!=='pais'?'<button class="sm" data-fm="move">🏠 Morar juntos</button>':''}<button class="sm" data-fm="end">${L.stage==='namoro'?'Terminar':'Desistir'}</button></div>
    <p class="muted" style="font-size:12px;margin:4px 0 0">Cada pessoa tem um perfil: romântico(a), aventureiro(a), caseiro(a) ou interesseiro(a), e gosta mais de certos programas. Quanto mais fama e dinheiro, mais interesseiros(as) aparecem: pedem Pix, torcem o nariz pra programa barato e somem quando a grana aperta. Namoro bom (relação 60+) melhora seu humor todo dia; morando juntos, as contas da casa são divididas.</p>`;
  return h+`</div>`}
function bindFam(el,say){el.querySelectorAll('[data-gc]').forEach(b=>b.onclick=()=>{FAM.gc=b.dataset.gc;say('')});
  el.querySelectorAll('[data-gg]').forEach(b=>b.onclick=()=>{const[p,g]=b.dataset.gg.split(':'),x=GIFT.find(g);if(x&&x.price>=1000&&!b.dataset.ok){b.dataset.ok=1;b.textContent=`Confirmar ${x.nm} (R$ ${brl(x.price)})?`;b.classList.add('pri');return}say(GIFT.give(p,g))});
  el.querySelectorAll('[data-fm]').forEach(b=>b.onclick=()=>{const[a,k]=b.dataset.fm.split(':');
  if(a==='chat'||(a==='date'&&k)){LIFE.tab='cel';LIFE.open='♥';if(a==='date')DATE.chat(DATE.inv(k),k);else renderLife();window.scrollTo(0,0);return}
  if(a==='end'&&!b.dataset.ok){b.dataset.ok=1;b.textContent='Tem certeza?';b.classList.add('pri');return}
  const m=a==='call'?FAM.call(k):a==='visit'?FAM.visit(k):a==='gift'?FAM.gift(k):a==='meet'?FAM.meet(k):a==='date'?(k?LOVE.sched(k):FAM.date()):a==='lgift'?LOVE.gift(k):a==='pay'?LOVE.pay():a==='deny'?LOVE.deny():a==='ask'?FAM.ask():a==='move'?FAM.moveIn():a==='end'?FAM.breakUp():'';say(m)});
  const li=el.querySelector('[data-r="loveIn"]');if(li)li.onchange=()=>{LIFE.s.loveIn=li.value;LIFE.commit()}}

function calBar(){if(!CAL.on())return'';const t=CAL.today(),A=CAL.st(),tod=CAL.items(t).length+CAL.events(t).filter(e=>A.reg[e.key]&&!A.done[e.key]).length;
  return`<div class="calbar"><div><b>📅 ${CAL.fmt(t,true)} · ${CLK.txt()}${HOL.tag(t)}</b><div class="muted" style="font-size:12px">Dia ${t} da carreira${tod?` · ${tod} compromisso${tod>1?'s':''} hoje`:' · dia livre'}</div></div>
    <div class="calbtns">${CAL.blockers()?`<span class="muted" style="font-size:12px">🔒 ${CAL.blockers()}</span> <button class="sm pri" data-cal="mesa">🃏 Voltar à mesa</button>`:`<button class="sm" data-cal="next1">Avançar dia ▶</button><button class="sm" data-cal="nextev">⏩ Próximo compromisso</button>`}</div></div>`}
function bindCalBar(el,after){el.querySelectorAll('[data-cal]').forEach(b=>b.onclick=()=>{if(b.dataset.cal==='mesa'){const sc=SAVES.data&&SAVES.data.cash;location.hash=(CASH.g&&CASH.g.home)||(sc&&sc.home&&!TOUR.g&&!(SAVES.data.tour&&SAVES.data.tour.ev))?'#jogar':'#torneio';return}const t=CAL.today(),A=CAL.st(),pend=CAL.items(t).length+CAL.events(t).filter(e=>A.reg[e.key]&&!A.done[e.key]&&!(TOUR.g&&TOUR.g.paused&&TOUR.g.ev&&TOUR.g.ev.key===e.key&&TOUR.g.ev.idx===t-e.first)).length;
    if(pend&&!b.dataset.ok){b.dataset.ok=1;b.textContent='Você tem compromisso hoje. Faltar?';b.classList.add('pri');return}
    const e=CAL.advance(b.dataset.cal==='next1'?1:14,b.dataset.cal==='nextev');after(e)})}

