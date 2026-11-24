/* ----- tela da agenda (aba Torneio na carreira) ----- */
function renderAgenda(){const t=CAL.today(),A=CAL.st();let h=calBar()+MIS.seg();if(MIS.view==='mis')return h+MIS.html();
  const evRow=(ev,d)=>{const r=A.reg[ev.key],dn=A.done[ev.key],E=ev.E,open=CAL.regOpen(ev),isToday=d===t,TO=(()=>{try{return TOUR}catch(e){return null}})(),inProg=!!(TO&&TO.g&&TO.g.ev&&TO.g.ev.key===ev.key);let act='';
    if(dn)act=dn.noshow?'<span class="bad">não foi</span>':`<span class="${dn.prize?'ok':'muted'}">${dn.place}º de ${dn.of}${dn.prize?` · R$ ${brl(dn.prize)}`:''}</span>`;
    else if(isToday&&!(TO&&TO.g&&TO.g.ev&&TO.g.ev.key===ev.key)&&tLate(ev))act=`<span class="muted">${r?'começou às '+CLK.fmt(tStartH(ev))+', não dá mais':'inscrições encerradas'}</span>`;else if(isToday&&(r||open))act=`<button class="sm pri" data-ag="play:${ev.key}">${inProg&&TO.g.paused?`Jogar o Dia ${ev.part+1}`:r?(ev.part?`Jogar o Dia ${ev.part+1}`:'Jogar agora'):`Inscrever e jogar (R$ ${brl(E.buy)})`}</button>${!r&&open?(()=>{const c=SPX.payer(E);return c?` <button class="sm" data-ag="regsp:${ev.key}">🤝 Pela verba ${c.emo}</button>`:''})():''}`;
    else if(r)act=`<span class="ok">✓ inscrito</span>${d===ev.first&&t<ev.first?` <button class="sm" data-ag="unreg:${ev.key}">cancelar</button>`:''}`;
    else if(ev.part)act='';
    else if(open)act=`<button class="sm" data-ag="reg:${ev.key}">Inscrever · R$ ${brl(E.buy)}</button>${(()=>{const c=SPX.payer(E);return c?` <button class="sm" data-ag="regsp:${ev.key}">🤝 Pela verba ${c.emo}</button>`:''})()}`;
    else if(t<ev.first-E.reg)act=`<span class="muted">inscrições ${CAL.fmt(ev.first-E.reg)}</span>`;else act='<span class="muted">encerrado</span>';
    return`<div class="agrow"><div><span class="agemo">${E.emo}</span> <b>${E.nm}</b>${E.days?` <span class="vtag">Dia ${ev.part+1}${ev.part===E.days-1?(E.days===3?' · mesa final':' · dia final'):''}</span>`:''}${r&&r.ticket?' <span class="vtag">🎫 pacote</span>':''}${r&&r.sp?` <span class="vtag">🤝 ${r.spNm}${r.cut?` · ${Math.round(r.cut*100)}%`:''}</span>`:''}<div class="muted" style="font-size:12px">${E.fmt==='sng'?'Mesa única':'Multimesas'} · ${ev.part>0?'retoma':'começa'} às ${CLK.fmt(ev.part>0?13:tStartH(ev))} · ${E.N} jogadores · buy-in R$ ${brl(E.buy)}${E.travel?` + viagem R$ ${brl(E.travel)}`:''} · ${E.sat?`1º ganha o pacote da etapa (R$ ${brl((()=>{const X=EVTS[(E.target||'etapa@').split('@')[0]]||EVTS.etapa;return X.buy+(X.travel||0)})())})`:`1º leva R$ ${brl(E.abs?E.abs[0]:E.buy*E.N*CIRC.pays(E.N)[0])}${E.minFame&&LIFE.s.fame<E.minFame?` · <span class="bad">fama ${E.minFame} ou satélite</span>`:''}`}${!r&&!dn&&!ev.part&&d>=t?(()=>{const b=SOC.brm(E);return` · <span class="brm ${b[0]}">${b[1]}</span>`})():''}</div></div><div class="agact">${act}</div></div>`};
  const itRow=it=>`<div class="agrow"><div><span class="agemo">${it.emo}</span> <b>${lx(it.title)}</b><div class="muted" style="font-size:12px">${lx(it.desc||'')}</div></div><div class="agact">${it.day===t?`<button class="sm pri" data-ag="do:${it.id}">Fazer</button>`:''}${['hg','lesson','fam','love'].includes(it.kind)?` <button class="sm" data-ag="cx:${it.id}">desmarcar</button>`:''}${SOC.NG.includes(it.kind)?` <button class="sm" data-ag="ng:${it.id}">${SOC.ngOpen===it.id?'fechar':'🗣️ negociar'}</button>`:''}</div></div>${SOC.ngOpen===it.id?SOC.negRow(it):''}`;
  const today=CAL.events(t),its=CAL.items(t);
  h+=`<div class="panel"><h3>Hoje · ${CAL.fmt(t)}</h3>
    ${today.map(e=>evRow(e,t)).join('')}${its.map(itRow).join('')}${!today.length&&!its.length?'<div class="muted" style="font-size:14px">Sem torneio nem compromisso hoje. Dia livre: cash no clube, home game, família ou descanso.</div>':''}
    <div class="muted" style="font-size:12px;margin-top:8px">Só dá pra fazer <b>uma</b> coisa por dia (um torneio ou um compromisso). O cash do clube fica aberto todo dia.</div></div>`;
  let up='';for(let d=t+1;d<=t+14;d++){const ev=CAL.events(d),it=CAL.items(d);if(!ev.length&&!it.length)continue;
    up+=`<div class="agday${CAL.dow(d)===0||CAL.dow(d)===6?' we':''}"><div class="agd">${CAL.fmt(d)}${CAL.rel(d)?` · ${CAL.rel(d)}`:''}</div>${ev.map(e=>evRow(e,d)).join('')}${it.map(itRow).join('')}</div>`}
  h+=bigPanel();h+=SOC.panel();
  h+=`<div class="panel"><h3>Próximos 14 dias</h3>${up}<p class="muted" style="font-size:12px">Torneios grandes avisam no Celular quando abrem as inscrições. A inscrição é paga na hora e se você faltar perde o buy-in. O Main Event dura 3 dias: no fim do Dia 1 e do Dia 2 as fichas ficam guardadas até o dia seguinte. No segundo fim de semana do mês tem etapa do Circuito Nacional em outra cidade (2 dias, com viagem). Os satélites de terça e quinta antes dela dão o pacote completo.</p></div>`;
  return h}
function bindAgenda(el,after){bindCalBar(el,after);el.querySelectorAll('[data-ag]').forEach(b=>b.onclick=()=>{const[a,...r]=b.dataset.ag.split(':'),k=r.join(':');let m='';
  if(a==='mv'){MIS.view=k;after('');return}if(a==='rt'){const[x,y,z]=k.split(':');if(x==='apply')m=RETRO.apply(y,z);else if(x==='mode'){RETRO.mode=y;after('');return}else{RETRO.open=x==='open';after('');return}}if(a==='mc')m=MIS.claim(k);if(a==='ng'){SOC.ngOpen=SOC.ngOpen===+k?null:+k;after('');return}if(a==='ngo'){const[i,...o]=k.split(':');m=SOC.nego(+i,o.join(':'));SOC.ngOpen=null}if(a==='sx')m=SOC.act(k);
  if(a==='reg')m=CAL.register(k);if(a==='regsp')m=SPX.reg(k);if(a==='unreg'){const r0=CAL.st().reg[k];CAL.unregister(k);m=r0&&r0.tr?'Inscrição devolvida. Passagem e hotel não são reembolsáveis.':'Inscrição cancelada e devolvida.'}if(a==='play')m=CAL.play(k);
  if(a==='do')m=CAL.doItem(+k);if(a==='cx'){if(!b.dataset.ok){b.dataset.ok=1;b.textContent='desmarcar mesmo?';return}CAL.cancel(+k);m='Desmarcado.'}after(m)})}

function vbar(v,c){return`<div class="vbar"><span style="width:${clamp(v,0,100)}%;background:${c}"></span></div>`}
function renderLife(){const el=document.getElementById('vidaRoot');if(!el||!LIFE.s)return;LIVES.tick(false);LIFE.sync();const s=LIFE.s,L=LIFE.level(),nx=FAMEL.find(x=>x[0]>s.fame),H=LIFE.homeObj(),st=LIFE.status(),tab=LIFE.tab;
  const moodE=s.mood>=2?'😁':s.mood>=1?'🙂':s.mood<=-2?'😞':s.mood<=-1?'😕':'😐';
  const cnt={hg:(s.hgInv||[]).length,pat:s.offers.length+((s.sc&&s.sc.offers.length)||0),cel:Object.values(s.th).reduce((a,t)=>a+(t.u||0),0)+s.notes.filter(x=>!x.read).length,midia:s.ivs.length+(LIFE.daily('post')?0:0)};
  let h=`<div class="panel vtop${LIFE.hdrOpen?' open':''}"><button class="vtopt" data-r="hdrT">✕ Fechar perfil</button><div class="vhead"><div class="vava fav" data-go="look" title="Closet">${(()=>{try{return FACE.me('role',58)}catch(e){return L[2]}})()}</div><div style="flex:1;min-width:0"><h2 style="margin:0">${lx(CIRC.me())}</h2><div class="muted" style="font-size:13px">${L[1]} · ${H.emo} ${H.nm}${s.cars.length?` · ${CARS.find(c=>c.id===s.cars[s.cars.length-1]).emo}`:''}${LIFE.sps().length?` · ${LIFE.sps().map(p=>p.emo).join('')} ${LIFE.sps().length>1?LIFE.sps().length+' patrocinadores':s.sp.nm}`:''}</div></div><button class="sm" data-go="look">👔 Closet</button></div>
    <div class="vstats"><div><div class="muted">Fama ${Math.round(s.fame)}/100 <button class="vwhy" data-r="fWhy">${LIFE.why?'fechar':'de onde vem?'}</button></div>${vbar(s.fame,'var(--gold)')}<div class="vsub">${nf(s.fans)} seguidores${nx?` · ${Math.ceil(nx[0]-s.fame)} pra "${nx[1]}"`:''} · ${(()=>{const F=LIFE.famous(),k=F.findIndex(x=>x.me)+1;return`${k}º mais famoso do circuito`})()}</div></div>
      <div><div class="muted">Energia ${Math.round(s.energy)}%</div>${vbar(s.energy,s.energy<35?'var(--bad)':'var(--ok)')}<div class="vsub">${LIFE.energyTxt()}. Multimesas gasta 25, Sit & Go 15, cash 8.</div>${CAL.on()?SOC.headTxt():''}</div>
      <div><div class="muted">Saldo</div><div style="font-size:20px;font-weight:700" class="${WALLET.s.bal<0?'bad':''}" data-wallet>R$ ${brl(WALLET.s.bal)}</div><div class="vsub">Humor ${moodE} · status ${st} · dia ${LIVES.s.day}</div></div></div>
    ${LIFE.why&&s.fp?(()=>{const p=s.fp,row=(ic,nm,v,mx,t)=>`<div class="fprow"><div style="display:flex;justify-content:space-between;gap:8px"><span>${ic} <b>${nm}</b></span><span>${v.toFixed(1)} / ${mx}</span></div>${vbar(v/mx*100,'var(--gold)')}<div class="vsub">${t}</div></div>`,F=LIFE.famous().slice(0,6);
      return`<div class="vsum fpbox">${row('🏆','Carreira',p.car,40,`${p.T} torneios, ${nf(p.C)} pontos de carreira (a mesma conta do ranking, somando todas as temporadas)`)}${row('🥇','Troféus',p.tro,15,`${p.W} título${p.W===1?'':'s'} (3 cada) e ${p.P} pódio${p.P===1?'':'s'} em 2º ou 3º (1,5 cada)`)}${row('📊','Ranking',p.rk,10,p.pos?`${p.pos}º na temporada atual (líder vale 10)`:'Sem pontos na temporada')}${row('🧠','Técnica',p.tec,10,p.dn>=30?`${Math.round(p.okp*100)}% das suas últimas ${nf(p.dn)} decisões aprovadas pelo treinador`:'Precisa de pelo menos 30 decisões registradas')}${row('📣','Mídia',p.hype,15,'Entrevistas, posts, vitórias recentes, compras e patrocínio. Cai um pouco a cada dia')}
        <div class="nsec" style="margin-top:10px">Mais famosos do circuito</div>${F.map((x,k)=>`<div style="font-size:13px;${x.me?'color:var(--gold2);font-weight:600':''}">${k+1}º ${lx(x.n)} · ${Math.round(x.f)}</div>`).join('')}
        <div class="vsub" style="margin-top:6px">Jogar nunca tira fama: perder também soma pontos de carreira. O que cai é a mídia, se você some, e o ranking, se alguém te passa.</div></div>`})():''}
    ${s.sum&&Object.keys(s.sum.it||{}).length&&Date.now()-s.sum.t<6*3600e3?`<div class="vsum">🗓️ ${s.sum.days} dia${s.sum.days>1?'s':''} passaram: ${Object.entries(s.sum.it).map(([k,v])=>`${k} <b class="${v>=0?'ok':'bad'}">${v>=0?'+':'−'}R$ ${brl(Math.abs(v))}</b>`).join(' · ')}</div>`:''}
    ${WALLET.s.bal<0?'<div class="vsum bad">⚠️ Conta no vermelho. Sem saldo você não entra em torneio. Venda algo, mude pra um lugar mais barato ou deposite na carteira.</div>':''}
    ${calBar()}${VG.bar(tab,cnt)}
    <div class="vmsg" data-r="vMsg" style="display:none">${LIFE.flash||''}</div></div>`;
  if(LIFE.flash)TOAST.show(LIFE.flash);LIFE.flash='';
  if(tab==='hoje')h+=HOJE.html();
  if(tab==='namoro')h+=MATCH.html();
  if(tab==='legado'){TROPH.backfill();TROPH.checkHof();h+=LEG.panel()+TROPH.panel()}
  if(tab==='casa'){h+=MOODL.panel();h+=`<div class="panel"><h3>${H.emo} ${H.nm}${H.id==='pais'?' <span class="vtag">com a família</span>':s.own[H.id]?' <span class="vtag">sua</span>':' <span class="vtag">alugada</span>'}</h3><p class="muted" style="margin-top:0">${H.desc}</p>
      <div style="font-size:14px">Conforto ${'★'.repeat(H.comfort+1)}: você recupera <b>${LIFE.regenRate()}</b> de energia por noite de sono.${s.love&&s.loveHome?` Mora com ${lx(s.love.nm)}: aluguel e contas divididos.`:''}</div>
      <div class="bills"><div class="nsec" style="margin-top:8px">Contas</div>${(()=>{const half=s.loveHome?.5:1,cm=CAR.cfg().cost,R=[],m=v=>Math.round(v*cm);
        if(H.rent&&!s.own[H.id])R.push(['🏠 Aluguel','todo dia 5',-m(H.rent*30*half)]);if(s.own[H.id])R.push(['🏠 Condomínio e IPTU','todo dia 5',-m(H.rent*.25*30)]);
        if(s.fin)R.push(['🏦 Parcela do financiamento','todo dia 5',-Math.min(s.fin.rem,s.fin.daily*30)]);
        if(H.id!=='pais')R.push(['💡 Luz, água e internet','todo dia 10',-m((150+H.comfort*90)*half)]);
        R.push(['🛒 Mercado e despesas','toda segunda',-m(280)]);if(!s.cars.length)R.push(['🚌 Transporte','toda segunda',-m(105)]);
        if(s.cars.length)R.push(['🚗 Carros: seguro e manutenção','todo dia 15',-m(s.cars.reduce((a,c)=>a+((CARS.find(x=>x.id===c)||{}).upk||0)*30,0))]);
        if(s.job)R.push([`💼 ${s.job.nm}`,s.job.week?'toda segunda':'todo dia 5',LIFE.jobPay()]);LIFE.sps().forEach(p=>R.push([`${p.emo} ${p.nm}`,'toda segunda',p.day*7]));
        const sc=s.sc&&s.sc.teach;if(sc)R.push(['📘 Aulas na academia','toda sexta',sc.pay*5]);
        Object.keys(s.own).filter(id=>id!==H.id).forEach(id=>{const X=LIFE.homeObj(id);R.push([`🔑 Aluguel recebido: ${X.nm}`,'todo dia 5',Math.round((X.rent*.7-X.rent*.25)*30)])});
        return R.map(r=>`<div class="vrow" style="font-size:14px"><span>${r[0]} <span class="muted" style="font-size:12px">${r[1]}</span></span><b class="${r[2]>=0?'ok':'bad'}">${r[2]>=0?'+':'−'}R$ ${brl(Math.abs(r[2]))}</b></span></div>`).join('')})()}</div>
      <div class="vjob">${s.job?`💼 <b>${s.job.nm}</b>: R$ ${brl(LIFE.jobPay())} ${s.job.week?'por semana':'por mês'}, mas cansa ${s.job.tire} de energia por dia útil. <button class="sm" data-job="quit">Pedir demissão e viver de poker</button>`:`🃏 <b>Profissional de poker</b>: sem emprego, você vive dos prêmios e do patrocínio. <button class="sm" data-job="bico">Arrumar um bico (R$ 450/semana)</button>`}</div>
      ${s.fin?`<div style="font-size:14px;margin-top:8px">🏦 Financiamento da ${LIFE.homeObj(s.fin.home).nm}: parcela de R$ ${brl(s.fin.daily*30)} por mês, faltam R$ ${brl(s.fin.rem)}. <button class="sm" data-buy="fin::">Quitar agora</button></div>`:''}</div>
      <div class="vgrid">${HOMES.filter(x=>x.id!==H.id&&x.id!=='pais'&&s.own[x.id]).map(x=>`<div class="panel vcard"><div class="vemo">${x.emo}</div><b>${x.nm}</b>${s.own[x.id]?' <span class="vtag">sua · alugada pra terceiros</span>':''}<div class="muted" style="font-size:13px">${x.desc}</div>
        <div style="font-size:13px;margin:6px 0">Aluguel R$ ${brl(x.rent*30)}/mês · Compra R$ ${brl(x.price)} · Conforto ${'★'.repeat(x.comfort+1)} · Status +${x.status}</div>
        ${s.own[x.id]?`<button class="sm" data-buy="home:${x.id}:move">Morar aqui</button> <button class="sm" data-buy="home:${x.id}:sell">Vender (R$ ${brl(x.price*.9)})</button>`:`<button class="sm" data-buy="home:${x.id}:rent">Alugar (mudança R$ ${brl(600+x.rent*5)})</button> <button class="sm" data-buy="home:${x.id}:cash">Comprar à vista</button> <button class="sm" data-buy="home:${x.id}:fin">Financiar (entrada R$ ${brl(x.price*.2)})</button>`}</div>`).join('')}</div>
      <div class="vsum">${H.id==='man'?'🏰 Você já mora no melhor imóvel. ':''}🏠 Imóveis pra comprar ou alugar ficam na Loja. <button class="sm" data-lgo="imoveis">Ver imóveis</button></div>`}
  if(tab==='casa')h+=INV.panel();
  if(tab==='garagem'){h+=`<div class="vgrid">${CARS.map(x=>{const n=s.cars.filter(c=>c===x.id).length;return`<div class="panel vcard"><div class="vemo">${x.emo}</div><b>${x.nm}</b>${n?` <span class="vtag">na garagem${n>1?' ×'+n:''}</span>`:''}<div class="muted" style="font-size:13px">${x.desc}</div>
      <div style="font-size:13px;margin:6px 0">R$ ${brl(x.price)} · seguro e manutenção R$ ${brl(x.upk*30)}/mês · Status +${x.status}</div>
      <button class="sm" data-buy="car:${x.id}:buy">Comprar</button>${n?` <button class="sm" data-buy="car:${x.id}:sell">Vender (R$ ${brl(x.price*.7)})</button>`:''}</div>`}).join('')}</div>
      <p class="muted" style="font-size:12px">Sem carro você gasta R$ 105 por semana em transporte. Com carro você chega mais inteiro (+3 de energia por noite). Conta o status do melhor carro da garagem. Carro vende por 70%.</p>`}
  if(tab==='hg')h+=renderHG();
  if(tab==='fam')h+=renderFam();
  if(tab==='loja'){const lc=LIFE.lcat||'poker',mine=s.items.map(i=>ITEMS.find(x=>x.id===i)).filter(Boolean),tot=mine.reduce((a,x)=>a+x.price,0),FX=[['regen','⚡',v=>`+${v} energia/noite`],['tire','🎧',v=>`torneio −${v} energia`],['love','❤️',v=>`+${v} nos encontros`],['mood','🙂',v=>`+${v.toFixed(2)} humor/dia`],['post','📈',v=>`+${Math.round(v*100)}% fãs/post`],['upk','💸',v=>`R$ ${brl(v)}/mês`]].map(([k,e,f])=>{const v=LIFE.ifx(k);return v?`${e} ${f(v)}`:''}).filter(Boolean);
    h+=`<div class="vsum">🛍️ ${mine.length} ${mine.length===1?'item':'itens'} (R$ ${brl(tot)} gastos)${FX.length?' · '+FX.join(' · '):''}</div>
    <div class="lcats"><button class="${lc==='meus'?'on':''}" data-lcat="meus">📦 Meus</button><button class="${lc==='imoveis'?'on':''}" data-lcat="imoveis">🏠 Imóveis</button>${LCATS.map(([k,e,t])=>`<button class="${lc===k?'on':''}" data-lcat="${k}">${e} ${t}</button>`).join('')}</div>
    ${lc==='imoveis'?homeGrid(s,H):`<div class="vgrid">${(lc==='meus'?mine:ITEMS.filter(x=>x.cat===lc)).map(x=>{const own=LIFE.has(x.id);return`<div class="panel vcard"><div class="vemo">${x.emo}</div><b>${x.nm}</b><div class="muted" style="font-size:13px">${x.desc}</div><div style="font-size:13px;margin:6px 0">${HOL.disc()<1?`<s class="muted">R$ ${brl(x.price)}</s> <b class="gold">`:''}R$ ${brl(IP(x))}${HOL.disc()<1?'</b>':''} · <span class="ok">${ifxTxt(x)}</span></div>
      ${x.cons?`<button class="sm" data-buy="item:${x.id}:use">Comprar e usar</button>`:own&&x.cat==='pet'?'<span class="vtag">faz parte da família</span>':own?`<span class="vtag">você tem</span> <button class="sm" data-buy="item:${x.id}:sell">Vender usado (R$ ${brl(Math.round(x.price*(x.cat==='joia'?.8:.5)))})</button>`:x.car&&!s.cars.length?'<span class="muted" style="font-size:12px">Precisa de carro</span>':`<button class="sm" data-buy="item:${x.id}:buy">Comprar</button>`}</div>`}).join('')||'<p class="muted">Nada ainda. Escolha uma categoria.</p>'}</div>`}
    <p class="muted" style="font-size:12px">Catálogo inspirado nas categorias e nos mais vendidos do Mercado Livre, com preços de referência de 2026. Usado vende por 50% (joia e relógio por 80%). Os bônus somam, com teto: +25 de energia por noite, −10 por torneio, +10 nos encontros.</p>`}
  if(tab==='pat'){h+=SPX.panel();h+=LIFE.sps().length>1?`<div class="vsum">🤝 ${LIFE.sps().length} contratos ao mesmo tempo. Só marcas concorrentes (do mesmo ramo) não dividem o mesmo jogador.</div>`:'';LIFE.sps().forEach(sp=>{
    h+=`<div class="panel"><h3>${sp.emo} ${sp.nm}</h3><div style="font-size:14px">R$ ${brl(sp.day)} por dia${sp.win?` · bônus R$ ${brl(sp.win)} por título`:''}${sp.itm?` · R$ ${brl(sp.itm)} por premiação`:''}${sp.pct?` · ${Math.round(sp.pct*100)}% dos prêmios`:''}</div><div class="muted" style="font-size:12px">Bônus cheio no Main Event, nas etapas e nas lendas; proporcional em torneio menor (30% num buy-in de R$ 500).</div>${SPX.budTxt(sp)}
      <div style="font-size:14px;margin-top:6px">Contrato até o dia ${sp.end} (faltam ${Math.max(0,sp.end-LIVES.s.day)} dias).${sp.clean?` Cláusula de imagem: ${s.strikes} de 2 avisos.`:''}</div>
      <div class="vreq">${Object.entries(sp.req).map(([k,v])=>{const d=sp.done[k]||0,nm={t:'Torneios',mtt:'Multimesas',post:'Posts',iv:'Entrevistas'}[k];return`<div>${d>=v?'✅':'⬜'} ${nm}: ${Math.min(d,v)}/${v}</div>`}).join('')}</div>
      <p class="muted" style="font-size:12px;margin:6px 0 0">Cumpriu tudo até o fim do contrato, a marca oferece renovação com aumento. Não cumpriu, ela vai embora e você perde fama. O logo aparece do lado do seu nome na mesa.</p></div>`});
    if(!LIFE.sps().length)h+=`<div class="panel"><h3>Sem patrocinador</h3><p class="muted" style="margin:0">As marcas aparecem conforme sua fama e seu status crescem. Ganhe torneios, dê entrevistas, poste nas redes.</p></div>`;
    s.offers.forEach(o=>{const T=LIFE.spTerms(o);h+=`<div class="panel vcard"><div class="vemo">${T.emo}</div><b>${o.renew?'Renovação: ':'Proposta: '}${T.nm}</b><div class="muted" style="font-size:13px">${T.desc}</div>
      <div style="font-size:14px;margin:6px 0">R$ ${brl(T.day)}/dia por ${T.dur} dias${T.win?` · R$ ${brl(T.win)} por título`:''}${T.itm?` · R$ ${brl(T.itm)} por premiação`:''}${T.pct?` · ${Math.round(T.pct*100)}% dos prêmios`:''}<br>Exige: ${LIFE.reqTxt(T.req)}${T.clean?' · sem provocação na imprensa':''}${SPBI[o.id]?`<div style="font-size:13px;margin-top:4px">🎟️ ${SPBI[o.id].bud?`Verba de R$ ${brl(SPBI[o.id].bud)} em buy-ins${SPBI[o.id].trv?' (com viagem e hotel)':''}`:'Sem verba fixa'}${SPBI[o.id].req?' · convida pra torneios específicos e paga a entrada':''}.</div>`:''}${LIFE.spRivals(o.id).length?`<div class="bad" style="font-size:13px;margin-top:4px">⚠️ Concorre com ${LIFE.spRivals(o.id).map(x=>x.emo+' '+x.nm).join(', ')}: assinar encerra esse contrato.</div>`:`<div class="ok" style="font-size:12px;margin-top:4px">✓ Não concorre com nenhuma marca sua: soma aos contratos atuais.</div>`}${o.neg&&o.mult>1?' <span class="ok">(negociado +25%)</span>':o.scout&&o.mult>1?' <span class="ok">(+20%: o olheiro gostou muito)</span>':''}</div>
      <div class="muted" style="font-size:12px">Expira no dia ${o.day+3}.</div><button class="sm pri" data-sp="acc:${o.id}">Assinar</button> ${o.neg||o.renew?'':`<button class="sm" data-sp="neg:${o.id}">Negociar</button>`} <button class="sm" data-sp="ref:${o.id}">Recusar</button></div>`});
    h+=`<div class="panel"><h3>Marcas do circuito</h3>${SPONS.filter(p=>p.fame<999).map(p=>`<div class="vrow"><span>${p.emo} ${p.nm}</span><span class="muted" style="font-size:13px">fama ${p.fame}${p.status?` · status ${p.status}`:''} ${s.fame>=p.fame&&st>=p.status?'<span class="ok">✓</span>':''}</span></div>`).join('')}
      <p class="muted" style="font-size:12px;margin:6px 0 0">Como no poker de verdade: antes era só o patch no boné, hoje as marcas querem presença, conteúdo e imagem. Negociar pode render 25% a mais, ou a marca desiste.</p></div>`}
  if(tab==='midia'){const R=s.ivRun;
    if(R){const Q=R.qs[R.k];h+=`<div class="panel"><div class="muted" style="font-size:13px">🎤 Entrevista com ${lx(R.iv.j)} · pergunta ${R.k+1} de ${R.qs.length}</div><h3 style="margin-top:6px">"${lx(Q.q)}"</h3>
      ${[['h','🙏 Humilde'],['c','💪 Confiante'],['p','🔥 Provocador']].map(([k,t])=>`<button class="vans" data-iv="${k}"><b>${t}</b><br>${lx(Q.a[k])}</button>`).join('')}
      <div style="margin-top:10px;display:flex;gap:6px"><input data-r="ivTxt" placeholder="Ou responda com suas palavras" maxlength="200" style="flex:1;padding:7px 9px;border-radius:9px;border:1px solid var(--line);background:rgba(0,0,0,.25);color:inherit"><button class="sm" data-r="ivSend">Responder</button></div>
      <p class="muted" style="font-size:12px;margin:8px 0 0">Humilde: pouca fama, ganha simpatia. Confiante: fama média. Provocador: muita fama e seguidores, mas cria rival (e ele entra em tilt contra você). Marcas de imagem limpa não gostam.</p></div>`}
    else if(s.ivs.length){const iv=s.ivs[0];h+=`<div class="panel"><h3>🎤 ${lx(iv.j)} quer falar com você</h3><p style="margin-top:0">Sobre o ${iv.ctx.nm} (${iv.ctx.place}º de ${iv.ctx.of}). A matéria sai no Feltro.</p><button class="pri" data-r="ivGo">Dar a entrevista</button> <button class="sm" data-r="ivNo">Recusar</button></div>`}
    else h+=`<div class="panel"><h3>🎤 Entrevistas</h3><p class="muted" style="margin:0">Os jornalistas procuram você depois de vitórias, mesas finais, bolhas e quando sua fama cresce.</p></div>`;
    h+=LIVEX.panel();const pd=LIFE.daily('post');h+=`<div class="panel"><h3>📲 Redes sociais <span class="muted" style="font-size:14px;font-weight:400">${nf(s.fans)} seguidores</span></h3>
      ${pd?'<p class="muted" style="margin:0 0 8px">Você já postou hoje. Amanhã tem mais.</p>':`<div style="display:flex;flex-wrap:wrap;gap:6px">${LIFE.POSTS.map(P=>{const ok=P.need==='res'?(s.lastRes&&s.day-s.lastRes.day<=1&&s.lastRes.itm):P.need==='sp'?!!s.sp:true;return ok?`<button class="sm" data-post="${P.id}">${P.nm}</button>`:''}).join('')}</div>`}
      ${s.posts.slice(0,4).map(p=>`<div class="vpost"><b>${p.nm}</b> <span class="muted" style="font-size:12px">dia ${p.day} · +${nf(p.gain)} seguidores</span>${p.com.map(c=>`<div style="font-size:13px"><b>${lx(c[0])}</b> ${lx(c[1])}</div>`).join('')}</div>`).join('')}</div>`;
    h+=FEED.panel();if(s.heads.length)h+=`<div class="panel"><h3>📰 Suas manchetes</h3>${s.heads.slice(0,8).map(x=>`<div style="font-size:14px;padding:4px 0;border-top:1px solid var(--line)">${lx(x.title)} <span class="muted" style="font-size:12px">dia ${x.day}</span></div>`).join('')}</div>`}
  if(tab==='cel'||tab==='amigos'){const op=tab==='amigos'?null:LIFE.open;
    if(op==='♥'&&s.love){h+=DATE.thread()}else if(op&&op!=='♥'&&LIVES.s.bots[op]){const T=s.th[op]||{m:[],u:0};T.u=0;const B=LIVES.bio(op)||{},q=s.req[op],ln=s.loans.find(l=>l.n===op&&!l.paid&&s.day>=l.due);
      h+=`<div class="panel"><div class="vhead"><button class="sm" data-r="cBack">‹</button><div class="vava fav">${FACE.bot(op,42)}</div><div data-pf="${op}" style="cursor:pointer"><b>${op}</b> <span class="pfi">ⓘ</span><div class="muted" style="font-size:12px">${B.job||''} · ${LIFE.relTxt(op)} · toque pra ver a ficha</div></div></div>
        <div class="vact"><button class="sm" data-c="call">📞 Ligar</button> <button class="sm${LIFE.outPick===op?' pri':''}" data-c="out">🍻 Chamar pra sair</button>${ln?` <button class="sm" data-c="cob">💸 Cobrar R$ ${brl(ln.v)}</button>`:''}</div>
        ${FR.box(op)}${LIFE.outPick===op?OUTX.panel(op):''}<div class="vthread">${T.m.slice(-30).map(m=>`<div class="vm ${m.f}">${lx(m.x)}</div>`).join('')||'<div class="muted" style="font-size:13px;text-align:center">Nenhuma mensagem ainda.</div>'}${LIFE.typing===op?'<div class="vm them muted">digitando…</div>':''}</div>
        ${q?`<div class="vsum">💸 ${op} pediu R$ ${brl(q.v)} emprestado. <button class="sm pri" data-c="lend">Emprestar</button> <button class="sm" data-c="deny">Recusar</button></div>`:''}
        <div style="display:flex;gap:6px;margin-top:8px"><input data-r="cTxt" placeholder="Mensagem para ${op}" maxlength="240" style="flex:1;padding:8px 10px;border-radius:9px;border:1px solid var(--line);background:rgba(0,0,0,.25);color:inherit"><button class="sm pri" data-r="cSend">Enviar</button></div>
        ${AIX.fn?'':'<p class="muted" style="font-size:12px;margin:6px 0 0">Respostas simples: a conversa com IA liga quando a permissão de IA do app estiver ativa.</p>'}</div>`}
    else{const N=s.notes.slice(0,12);
      if(tab==='cel'&&N.length)h+=`<div class="panel"><h3>🔔 Notificações</h3>${N.map((x,i)=>{const g=NOTEGO(x);return`<button class="vnote${x.read?'':' new'}${g?' go':''}" data-note="${i}"><span class="vnt"><b>${x.emo} ${lx(x.title)}</b><span>${lx(x.body)}</span></span>${g?'<span class="ha">›</span>':''}</button>`}).join('')}</div>`;
      const all=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&LIVES.bio(n)),th=all.filter(n=>s.th[n]&&s.th[n].m.length).sort((a,b)=>(s.th[b].t||0)-(s.th[a].t||0));
      const row=n=>{const B=LIVES.bio(n),T=s.th[n],last=T&&T.m.length?T.m[T.m.length-1]:null,r=LIFE.rel(n);return`<div class="vrow vct" data-open="${n}"><span><span class="rav">${FACE.bot(n,34)}</span> <b>${n}</b> <span class="muted" style="font-size:12px">${LIFE.relTxt(n)}</span>${last?`<div class="muted vlast">${last.f==='me'?'Você: ':''}${lx(last.x)}</div>`:''}</span><span style="display:flex;align-items:center;gap:8px">${T&&T.u?`<span class="vbdg">${T.u}</span>`:`<span class="muted" style="font-size:12px">${r>0?'+':''}${r.toFixed(1)}</span>`}<span class="pfi" data-pf="${n}" title="Ver ficha">ⓘ</span></span></div>`};
      if(tab==='cel'){if(s.love)h+=DATE.row();h+=th.length?`<div class="panel"><h3>💬 Conversas</h3>${th.map(row).join('')}</div>`:'';h+=`<button class="hrow" data-vt="amigos"><span class="he">🍻</span><span class="hx"><b>Amigos e contatos</b> · mandar mensagem, ligar, chamar pra sair</span><span class="ha">›</span></button>`}
      const fr=all.filter(n=>tab==='amigos'||!th.includes(n)).sort((a,b)=>LIFE.rel(b)-LIFE.rel(a));
      if(tab==='amigos')h+=`<div class="panel"><h3>🍻 Amigos e contatos</h3>${fr.slice(0,LIFE.allC?99:12).map(row).join('')}${fr.length>12&&!LIFE.allC?`<button class="sm" data-r="cAll" style="margin-top:6px">Ver todos (${fr.length})</button>`:''}
        <p class="muted" style="font-size:12px;margin:6px 0 0">Ligar e sair melhoram a amizade. Amigo te manda mensagem, comemora suas vitórias e às vezes pede dinheiro emprestado. Rival provoca e joga com raiva contra você.</p></div>`}}
  if(tab==='pat')h+=renderScouts();
  el.innerHTML=h;
  const say=t=>{LIFE.flash=t;renderLife()};
  if(tab==='hg')bindHG(el,say);
  if(tab==='fam')bindFam(el,say);
  if(tab==='cel'&&LIFE.open==='♥')DATE.bind(el,say);
  el.querySelectorAll('[data-lgo]').forEach(b=>b.onclick=()=>{LIFE.tab='loja';LIFE.lcat=b.dataset.lgo;renderLife();window.scrollTo(0,0)});
  bindCalBar(el,m=>{LIFE.flash=m||'';renderLife()});
  if(tab==='pat')bindScouts(el,say);
  {const fw=el.querySelector('[data-r="fWhy"]');if(fw)fw.onclick=()=>{LIFE.why=!LIFE.why;renderLife()}}
  el.querySelectorAll('[data-vt]').forEach(b=>b.onclick=()=>{LIFE.tab=b.dataset.vt;LIFE.open=null;renderLife()});
  el.querySelectorAll('[data-lcat]').forEach(b=>b.onclick=()=>{LIFE.lcat=b.dataset.lcat;renderLife()});
  el.querySelectorAll('[data-vgo]').forEach(b=>b.onclick=()=>{MIS.view='mis';RETRO.open=true;location.hash='#torneio';setTimeout(()=>{try{TOUR.render();window.scrollTo(0,0)}catch(e){}},50)});
  el.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const[k,id,m]=b.dataset.buy.split(':');
    if(!b.dataset.ok&&(m==='cash'||m==='fin'||m==='buy'||m==='sell'||k==='fin')){b.dataset.ok=1;b.textContent='Confirmar?';b.classList.add('pri');return}
    say(LIFE.buy(k,id,m)||'')});
  el.querySelectorAll('[data-job]').forEach(b=>b.onclick=()=>{if(!b.dataset.ok){b.dataset.ok=1;b.textContent='Confirmar?';b.classList.add('pri');return}
    if(b.dataset.job==='quit'){const j=s.job;s.job=null;LIFE.addFame(.8);CIRC.post({k:'bast',title:'',body:`${CIRC.me()} largou o emprego de ${j.nm.toLowerCase()} pra viver de poker.`});LIVES.commit();LIFE.commit();say('Agora é só poker. Sem salário: cuide da banca.')}
    else{s.job={nm:'Bico de entregador',pay:90,tire:10,week:true};LIFE.commit();say('Bico arrumado: R$ 450 por semana.')}});
  el.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>{const[a,id]=b.dataset.sp.split(':');
    if(a==='acc'){const rv=LIFE.spRivals(id);if(rv.length&&!b.dataset.ok){b.dataset.ok=1;b.textContent=`⚠️ Vai perder ${rv.map(x=>x.nm).join(', ')} (R$ ${brl(rv.reduce((a,x)=>a+x.day,0))}/dia). Confirmar?`;b.classList.add('bad');return}LIFE.spAccept(id);say(rv.length?`Contrato assinado. ${rv.map(x=>x.nm).join(', ')} saiu por ser concorrente.`:'Contrato assinado. Soma aos seus outros patrocínios.')}
    if(a==='neg'){const r=LIFE.spNego(id);say(r?'A marca topou: +25% em tudo.':'A marca não gostou da contraproposta e retirou a oferta.')}
    if(a==='ref'){LIFE.spRefuse(id);say('Proposta recusada.')}});
  el.querySelectorAll('[data-iv]').forEach(b=>b.onclick=()=>{LIFE.ivAnswer(b.dataset.iv);if(!LIFE.s.ivRun)LIFE.flash='📰 Entrevista publicada no Feltro.';renderLife()});
  const q=a=>el.querySelector(`[data-r="${a}"]`);
  if(q('ivGo'))q('ivGo').onclick=()=>{LIFE.ivStart();renderLife()};
  if(q('ivNo'))q('ivNo').onclick=()=>{s.ivs.shift();LIFE.commit();say('Você recusou a entrevista.')};
  if(q('ivSend'))q('ivSend').onclick=async()=>{const t=q('ivTxt').value.trim();if(!t)return;q('ivSend').disabled=true;q('ivSend').textContent='…';await LIFE.ivFree(t);if(!LIFE.s.ivRun)LIFE.flash='📰 Entrevista publicada no Feltro.';renderLife()};
  el.querySelectorAll('[data-post]').forEach(b=>b.onclick=()=>{const r=LIFE.post(b.dataset.post);say(r?`Postado: +${nf(r.gain)} seguidores.`:'')});
  el.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{LIFE.open=b.dataset.open;LIFE.tab='cel';window.scrollTo(0,0);renderLife();const t=el.querySelector('.vthread');if(t)t.scrollTop=1e6});
  if(q('cAll'))q('cAll').onclick=()=>{LIFE.allC=true;renderLife()};
  if(q('nRead'))q('nRead').onclick=()=>{s.notes.forEach(x=>x.read=true);LIFE.commit();renderLife()};
  if(q('cBack'))q('cBack').onclick=()=>{LIFE.open=null;LIFE.commit();renderLife()};
  const op=LIFE.open;if(op&&op!=='♥'&&q('cSend')){const t=el.querySelector('.vthread');if(t)t.scrollTop=1e6;LIFE.badge();
    el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const a=b.dataset.c;
      if(a==='call')say('📞 '+(LIFE.call(op)||'Vocês já se falaram hoje.'));
      if(a==='out'){LIFE.outPick=LIFE.outPick===op?null:op;OUTX.last=null;renderLife()}
      if(a==='lend')say(LIFE.lend(op)||`Você emprestou para ${op}.`);
      if(a==='deny'){LIFE.deny(op);renderLife()}
      if(a==='cob'){const l=s.loans.find(x=>x.n===op&&!x.paid);if(l)LIFE.collect(l);renderLife()}});
    const send=()=>{const i=q('cTxt'),t=i.value.trim();if(!t||LIFE.typing)return;i.value='';LIFE.chat(op,t)};
    q('cSend').onclick=send;q('cTxt').onkeydown=e=>{if(e.key==='Enter')send()}}}

const SAVES={LS:CAR.ls('escolaPoker.saves.v1'),data:{},db:null,
  load(){try{const x=JSON.parse(localStorage.getItem(this.LS)||'{}');this.data=x&&typeof x==='object'?x:{}}catch(e){this.data={}}},
  saveLocal(){try{localStorage.setItem(this.LS,JSON.stringify(this.data))}catch(e){}},
  async remote(db){this.db=db;
    try{const snap=await db.collection('saves').get();const seen={};
      const sf=CAR.sfx();snap.docs.forEach(d=>{const m=d.id.match(/^(cash|tour)(_.+)?$/);if(!m||(m[2]||'')!==sf)return;const k=m[1],x=d.data();seen[k]=1;if(x&&x.players){const l=this.data[k];if(!l||(l.savedAt||0)<(x.savedAt||0))this.data[k]=JSON.parse(JSON.stringify(x))}});
      Object.keys(this.data).forEach(k=>{if(!seen[k])this.push(k)});this.saveLocal()}catch(e){}
    [CASH,TOUR].forEach(t=>{if(!t.g)t.render()})},
  push(k){if(!this.db||!this.data[k])return;const body=JSON.parse(JSON.stringify(this.data[k])),ref=this.db.collection('saves').doc(k+CAR.sfx());HIST.q=HIST.q.then(()=>ref.set(body)).catch(()=>{})},
  put(k,o){this.data[k]=o;this.saveLocal();this.push(k)},
  del(k){if(!this.data[k])return;delete this.data[k];this.saveLocal();if(this.db){const ref=this.db.collection('saves').doc(k+CAR.sfx());HIST.q=HIST.q.then(()=>ref.delete()).catch(()=>{})}}};
SAVES.load();
const CASH=new Table(document.getElementById('cashRoot'),'cash');
const TOUR=new Table(document.getElementById('tourRoot'),'tour');
AIX.init();
