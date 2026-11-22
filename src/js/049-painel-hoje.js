/* ----- painel Hoje ----- */
const HOJE={
  html(){const s=LIFE.s,t=CAL.today(),A=CAL.st(),me=CIRC.me(),L=LIFE.level(),rows=[];const add=(e,x,go,cls)=>rows.push(`<button class="hrow ${cls||''}" data-go="${go}"><span class="he">${e}</span><span class="hx">${x}</span><span class="ha">›</span></button>`);
    CAL.events(t).forEach(ev=>{const r=A.reg[ev.key],dn=A.done[ev.key];if(dn)return;if(!r&&A.used[t]&&A.used[t]!==ev.key)return;if(r||CAL.regOpen(ev))add(ev.E.emo,`<b>${ev.E.nm}</b> hoje${r?' · você está inscrito':` · inscrição R$ ${brl(ev.E.buy)}`}`,'hash:#torneio',r?'hot':'')});
    CAL.items(t).forEach(it=>add(it.emo||'📌',`<b>${lx(it.title)}</b> hoje`,'hash:#torneio','hot'));
    if(s.dnow&&!s.dnow.over)add('💞',`Você está num encontro com ${lx(s.dnow.nm)}`,'date','hot');
    if(s.press&&!s.press.over)add('🎤','A imprensa está te esperando','press','hot');
    if(s.finv&&s.finv.d===t&&!s.finv.ans)add(OUTA[s.finv.k].emo,`${s.finv.n} te chamou pra ${OUTA[s.finv.k].nm.toLowerCase()}`,'cel:'+s.finv.n,'hot');
    if(s.bds&&s.bds.d===t)s.bds.l.filter(n=>!s.bds.done.includes(n)).forEach(n=>add('🎂',`Aniversário de ${n}`,'cel:'+n));
    (s.spReq||[]).forEach(r=>{const c=LIFE.spById(r.sp);if(c)add(c.emo,`${c.nm.split(' (')[0]} quer você no ${r.nm}`,'tab:pat','hot')});
    (s.offers||[]).forEach(o=>{const p=SPONS.find(x=>x.id===o.id);if(p)add(p.emo,`Proposta de patrocínio: ${p.nm.split(' (')[0]}`,'tab:pat')});
    if((s.ivs||[]).length)add('🎤',`${s.ivs[0].j} quer te entrevistar`,'tab:midia');
    const un=Object.entries(s.th||{}).filter(([n,T])=>T.u).map(([n])=>n);if(un.length)add('💬',`Mensagem de ${un.slice(0,3).join(', ')}${un.length>3?'…':''}`,un.length===1?'cel:'+un[0]:'tab:cel','hot');
    if(CAL.on()&&!s.retro)add('📜','Sua carreira simulada está esperando','vgo:retro');
    if(s.love&&s.love.tu)add('❤️',`${s.love.nm} te mandou mensagem`,'cel:♥');
    (s.loans||[]).filter(l=>!l.paid&&l.due<=t).forEach(l=>add('🧾',`${l.n} te deve R$ ${brl(l.v)} (venceu)`,'cel:'+l.n));
    if(!LIFE.daily('post'))add('📲','Você ainda não postou hoje','tab:midia');
    if((HOL.of(t)||{}).id)add(HOL.of(t).emo,`${HOL.of(t).nm}: ${HOL.of(t).tip}`,HOL.of(t).id==='bf'?'tab:loja':'tab:fam');
    let nx=null;for(let d=t+1;d<=t+30&&!nx;d++)CAL.events(d).forEach(e=>{if(!nx&&!e.part&&bigIds().includes(e.id))nx={e,d}});
    const sp=LIFE.sps().map(c=>{const left=Math.max(0,c.end-t),req=Object.entries(c.req||{}),done=req.filter(([k,v])=>(c.done[k]||0)>=v).length;return`<div class="hsp"><span>${c.emo} ${c.nm.split(' (')[0]}</span><span class="${done===req.length?'ok':left<5?'bad':'muted'}">${done}/${req.length} metas · ${left}d</span></div>`}).join('');
    const ml=MOODL.list().slice(0,4);
    return`<div class="panel"><h3>📋 Pra fazer agora</h3>${rows.join('')||'<p class="muted" style="margin:0">Nada pendente. Que tal uma live, uma sessão online ou chamar alguém pra sair?</p>'}
      ${nx?`<div class="vsum" style="margin-top:8px">${nx.e.E.emo} Próximo grande: <b>${nx.e.E.nm}</b> em ${CAL.fmt(nx.d)} (${nx.d-t} dia${nx.d-t>1?'s':''}).</div>`:''}</div>
      ${sp?`<div class="panel"><h3>🤝 Contratos</h3>${sp}</div>`:''}`},
  go(g){const[a,...r]=g.split(':'),v=r.join(':');if(a==='hash'){location.hash=v;return}if(a==='tab'){LIFE.tab=v;LIFE.open=null;renderLife();window.scrollTo({top:0,behavior:'smooth'});return}
    if(a==='cel'){LIFE.tab='cel';LIFE.open=v;renderLife();window.scrollTo({top:0,behavior:'smooth'});return}if(a==='look'){OUT.open();return}if(a==='vgo'){MIS.view='mis';RETRO.open=true;location.hash='#torneio';setTimeout(()=>{try{TOUR.render();window.scrollTo(0,0)}catch(e){}},50);return}if(a==='perfil'){LIFE.tab='hoje';LIFE.hdrOpen=true;location.hash='#vida';setTimeout(()=>{try{renderLife();window.scrollTo({top:0,behavior:'smooth'})}catch(e){}},30);return}if(a==='date'){DATE.min=false;DATE.render();return}if(a==='press'){PRESS.render();return}}};

