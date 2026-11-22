/* ----- tela principal ----- */
const TTL={open:false,view:'menu',step:0,f:{name:'',origin:'clt',dif:'normal'}};
function ttlOpen(v){TTL.open=true;TTL.view=v||'menu';document.getElementById('title').classList.add('on');document.body.classList.add('ttlon');renderTitle()}
function ttlClose(){TTL.open=false;document.getElementById('title').classList.remove('on');document.body.classList.remove('ttlon')}
function renderTitle(){const el=document.getElementById('title');if(!el)return;const R=CAR.reg,list=[...R.list].sort((a,b)=>(b.t||0)-(a.t||0)),cur=CAR.cur(),last=list.find(c=>c.id===R.last)||cur||list[0];
  const O=id=>ORIGINS.find(x=>x.id===id)||{emo:'🃏',nm:id==='legado'?'Carreira original':'Carreira livre'};
  const card=c=>`<div class="tcar${c.id===CAR.id?' cur':''}"><div class="tce">${O(c.origin).emo}</div><div style="flex:1;min-width:0"><b>${lx(c.name||'Jogador')}</b>${c.id===CAR.id?' <span class="vtag">aberta</span>':''}<div class="muted" style="font-size:12px">${O(c.origin).nm} · ${(DIFS[c.dif]||DIFS.normal).nm}</div>
    <div style="font-size:12px">Dia ${c.day||1} · R$ ${brl(c.bal||0)} · fama ${c.fame||0}${c.t?` · ${new Date(c.t).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}`:''}</div></div></div>`;
  let h=`<div class="tbox"><div class="tlogo">♠♥♦♣</div><h1 style="margin:0">Escola de Poker</h1><div class="muted" style="margin-bottom:18px">Texas Hold'em · modo carreira</div>`;
  if(TTL.view==='menu'){
    h+=last?`<button class="tbtn pri" data-t="cont"><span>▶ Continuar</span>${card(last)}</button>`:'';
    h+=`<button class="tbtn" data-t="new">✨ Novo jogo</button>`;
    if(list.length)h+=`<button class="tbtn" data-t="load">📂 Carregar jogo <span class="muted">(${list.length})</span></button>`;
    h+=`<button class="tbtn" data-t="qp">⚡ Jogo rápido <div class="muted" style="font-size:13px;font-weight:400">Mesa ou torneio na hora, sem carreira e sem dinheiro de verdade em jogo.</div></button>`;
    h+=`<button class="tbtn ghost" data-t="learn">📚 Só aprender as regras</button>`}
  if(TTL.view==='load'){h+=`<div class="tsub">Carregar jogo</div>`+list.map(c=>`<div class="trow">${card(c)}<div class="tact"><button class="sm pri" data-load="${c.id}">${c.id===CAR.id?'Voltar':'Jogar'}</button>${c.id===CAR.id?'':` <button class="sm" data-del="${c.id}">Apagar</button>`}</div></div>`).join('')+`<button class="tbtn ghost" data-t="menu">‹ Voltar</button>`}
  if(TTL.view==='new'){const f=TTL.f,st=TTL.step;
    h+=`<div class="tsub">Nova carreira · passo ${st+1} de 4</div>`;
    if(st===0)h+=`<p class="muted" style="margin-top:0">Como vão te chamar no circuito? Os bots não te conhecem: você começa do zero, sem histórico, sem fama e sem amigos no clube (fora quem te levou lá).</p>
      <input data-r="tName" value="${lx(f.name)}" maxlength="24" placeholder="Seu nome no circuito" class="tin"><button class="tbtn pri" data-t="n1">Continuar ›</button>`;
    if(st===1)h+=`<p class="muted" style="margin-top:0">De onde você vem? Isso define o dinheiro inicial, onde mora e se tem emprego.</p>`+ORIGINS.map(o=>`<button class="topt${f.origin===o.id?' on':''}" data-o="${o.id}"><div style="display:flex;gap:10px;align-items:center"><span style="font-size:28px">${o.emo}</span><div><b>${o.nm}</b><div style="font-size:12px" class="muted">R$ ${brl(o.bal)} · ${HOMES.find(x=>x.id===o.home).nm}${o.job?` · ${o.job.nm} (R$ ${brl(o.job.pay*20)}/mês)`:' · sem emprego'}</div></div></div><div style="font-size:13px;margin-top:6px">${o.desc}</div></button>`).join('')+`<button class="tbtn pri" data-t="n2">Continuar ›</button>`;
    if(st===2)h+=`<p class="muted" style="margin-top:0">Dificuldade da vida fora da mesa. As mesas são iguais em todas.</p>`+Object.entries(DIFS).map(([k,d])=>`<button class="topt${f.dif===k?' on':''}" data-d="${k}"><b>${d.emo} ${d.nm}</b><div style="font-size:13px;margin-top:4px">${d.desc}</div></button>`).join('')+`<button class="tbtn pri" data-t="n3">Continuar ›</button>`;
    if(st===3){const o=ORIGINS.find(x=>x.id===f.origin),d=DIFS[f.dif];h+=`<div class="tcar" style="margin-bottom:12px"><div class="tce">${o.emo}</div><div><b>${lx(f.name||'Jogador')}</b><div style="font-size:13px">${o.nm} · ${d.nm}</div><div style="font-size:13px">Começa com R$ ${brl(o.bal)}, ${HOMES.find(x=>x.id===o.home).nm.toLowerCase()}${o.own?' (própria)':''}${o.job?`, ${o.job.nm.toLowerCase()} de R$ ${brl(o.job.pay*20)}/mês`:''}.</div><div class="muted" style="font-size:12px;margin-top:4px">Circuito novo: temporada 1, dia 1, ranking zerado, ninguém te conhece. Quem te levou ao clube vai te mandar mensagem.</div></div></div>
      <p class="muted" style="font-size:12px">A carreira atual fica salva e você pode voltar a ela em "Carregar jogo".</p><button class="tbtn pri" data-t="go">🃏 Começar carreira</button>`}
    h+=`<button class="tbtn ghost" data-t="back">‹ Voltar</button>`}
  h+=`</div>`;el.innerHTML=h;
  const q=s=>el.querySelector(s);
  el.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const t=b.dataset.t;
    if(t==='cont'){if(last&&last.id!==CAR.id)CAR.select(last.id);else if(CAR.id==='qp'&&last)CAR.select(last.id);else{ttlClose();if(!location.hash||location.hash==='#')location.hash='#vida';route()}}
    if(t==='new'){TTL.view='new';TTL.step=0;TTL.f={name:'',origin:'clt',dif:'normal'};renderTitle()}
    if(t==='load'){TTL.view='load';renderTitle()}
    if(t==='menu'){TTL.view='menu';renderTitle()}
    if(t==='learn'){ttlClose();location.hash='#basico'}
    if(t==='qp'){if(CAR.id==='qp'){ttlClose();location.hash='#torneio';route()}else CAR.select('qp')}
    if(t==='n1'){const v=q('[data-r="tName"]').value.trim();if(!v){q('[data-r="tName"]').style.borderColor='var(--bad)';return}TTL.f.name=v;TTL.step=1;renderTitle()}
    if(t==='n2'){TTL.step=2;renderTitle()}
    if(t==='n3'){TTL.step=3;renderTitle()}
    if(t==='back'){if(TTL.step>0){TTL.step--;}else TTL.view='menu';renderTitle()}
    if(t==='go'){b.disabled=true;b.textContent='Criando…';CAR.create(TTL.f)}});
  el.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{TTL.f.origin=b.dataset.o;renderTitle()});
  el.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{TTL.f.dif=b.dataset.d;renderTitle()});
  el.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>{const id=b.dataset.load;if(id===CAR.id){ttlClose();route()}else CAR.select(id)});
  el.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{if(!b.dataset.ok){b.dataset.ok=1;b.textContent='Apagar mesmo? Não tem volta';b.classList.add('pri');return}CAR.remove(b.dataset.del);renderTitle()});
  const ni=q('[data-r="tName"]');if(ni){ni.onkeydown=e=>{if(e.key==='Enter')q('[data-t="n1"]').click()};setTimeout(()=>ni.focus(),50)}}

