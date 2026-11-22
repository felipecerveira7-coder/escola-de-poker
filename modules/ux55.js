/* =============== v55: avatar, closet, HUD, grupos de abas, Hoje, avisos, animações =============== */
const brlc=v=>{const a=Math.abs(v),sg=v<0?'−':'';return a>=1e6?`${sg}R$ ${(a/1e6).toFixed(a>=1e8?0:1).replace('.',',')} mi`:a>=1e4?`${sg}R$ ${Math.round(a/1e3)} mil`:`${sg}R$ ${brl(a)}`};

/* ----- guarda-roupa: dois looks (mesa e rolê) e aparência ----- */
const OUT={
  SLOTS:[['cab','🧢','Cabeça',['bone']],['olhos','🕶️','Olhos',['oculos']],['tronco','👕','Roupa',['moletom','camisa','jaqueta','terno']],['pesc','📿','Pescoço',['corrente']],['pulso','⌚','Pulso',['patek','rolex','relogio','ultra','gshock']],['mao','💍','Mão',['anel','pulseira']],['pes','👟','Pés',['jordan','corrida']],['cheiro','🌫️','Perfume',['nicho','perfume']]],
  st(){const s=LIFE.s;if(!s.look)s.look={mesa:{},role:{},av:{pele:2,cab:'curto',cor:'#2b1d14',barba:'curta'}};const L=s.look;['mesa','role'].forEach(k=>{L[k]=L[k]||{};this.SLOTS.forEach(([sl,,,ids])=>{if(L[k][sl]===undefined){const own=ids.filter(i=>LIFE.has(i));L[k][sl]=k==='mesa'&&sl==='tronco'?(own.includes('moletom')?'moletom':own[0]||''):k==='role'&&sl==='tronco'?(['terno','jaqueta','camisa'].find(i=>own.includes(i))||own[0]||''):(own[0]||'')}else if(L[k][sl]&&!LIFE.has(L[k][sl]))L[k][sl]=''})});return L},
  wear(ctx,id){if(!LIFE.s)return false;const L=this.st()[ctx];return Object.values(L).includes(id)},
  items(ctx){const L=this.st()[ctx];return Object.values(L).filter(Boolean).map(i=>ITEMS.find(x=>x.id===i)).filter(Boolean)},
  set(ctx,sl,id){const L=this.st();if(ctx==='av'){L.av[sl]=id}else{L[ctx][sl]=L[ctx][sl]===id?'':id}LIFE.commit()},
  formal(ctx){return this.wear(ctx,'terno')||this.wear(ctx,'camisa')},
  desc(ctx){const it=this.items(ctx);return it.length?it.map(x=>x.nm.toLowerCase()).join(', '):'roupa do dia a dia'},
  tab:'mesa',
  open(){let ov=document.getElementById('clOv');if(!ov){ov=document.createElement('div');ov.id='clOv';document.body.appendChild(ov)}ov.className='dov';ov.__close=()=>this.close();this.render()},
  close(){const ov=document.getElementById('clOv');if(ov)ov.remove();if(location.hash==='#vida')try{renderLife()}catch(e){}},
  render(){const ov=document.getElementById('clOv');if(!ov)return;const L=this.st(),t=this.tab,A=L.av;
    const slot=([sl,e,nm,ids])=>{const own=ids.filter(i=>LIFE.has(i)).map(i=>ITEMS.find(x=>x.id===i)).filter(Boolean);return`<div class="clrow"><div class="muted" style="font-size:12px">${e} ${nm}</div><div class="gl">${own.length?own.map(x=>`<button class="sm${L[t][sl]===x.id?' pri':''}" data-cl="${t}|${sl}|${x.id}">${x.emo} ${x.nm}</button>`).join('')+(L[t][sl]?`<button class="sm" data-cl="${t}|${sl}|${L[t][sl]}">✖ tirar</button>`:''):`<span class="muted" style="font-size:12px">Nada disso no armário. <a href="#vida" data-lgo="${({cab:'moda',olhos:'poker',tronco:'moda',pesc:'joia',pulso:'joia',mao:'joia',pes:'moda',cheiro:'bel'})[sl]}">Ver na loja</a></span>`}</div></div>`};
    const av=()=>{const P=['#f1d3b6','#e3b48f','#c68b5e','#8d5a3b','#5a3a26'];return`<div class="clrow"><div class="muted" style="font-size:12px">Tom de pele</div><div class="gl">${P.map((c,i)=>`<button class="swatch${A.pele===i?' on':''}" style="background:${c}" data-cl="av|pele|${i}"></button>`).join('')}</div></div>
      <div class="clrow"><div class="muted" style="font-size:12px">Cabelo</div><div class="gl">${[['curto','Curto'],['raspado','Raspado'],['cacheado','Cacheado'],['longo','Comprido'],['careca','Careca']].map(([k,n])=>`<button class="sm${A.cab===k?' pri':''}" data-cl="av|cab|${k}">${n}</button>`).join('')}</div></div>
      <div class="clrow"><div class="muted" style="font-size:12px">Cor do cabelo</div><div class="gl">${['#1b1410','#2b1d14','#5b3a1e','#9a6b3a','#c9a063','#8a8a8a'].map(c=>`<button class="swatch${A.cor===c?' on':''}" style="background:${c}" data-cl="av|cor|${c}"></button>`).join('')}</div></div>
      <div class="clrow"><div class="muted" style="font-size:12px">Barba</div><div class="gl">${[['sem','Sem'],['curta','Por fazer'],['cheia','Cheia'],['cavanhaque','Cavanhaque']].map(([k,n])=>`<button class="sm${A.barba===k?' pri':''}" data-cl="av|barba|${k}">${n}</button>`).join('')}</div></div>`};
    const fx=t==='mesa'?`${this.wear('mesa','moletom')||this.wear('mesa','corrida')?'🛋️ Confortável: torneio cansa menos (−3). ':''}${this.formal('mesa')?'📸 Elegante: rende mais na coletiva e nas fotos. ':''}${this.wear('mesa','oculos')?'🕶️ Óculos: os bots leem menos o seu tempo. ':''}${this.items('mesa').some(x=>x.price>=40000)?'💎 Joia cara à mostra: os bots comentam (e os rivais provocam).':''}`:t==='role'?`${this.formal('role')?'🍷 Arrumado: encontro em jantar ou restaurante chique começa melhor (+2). ':''}${this.wear('role','nicho')||this.wear('role','perfume')?'🌫️ Perfume: +1 no clima do encontro. ':''}${this.wear('role','terno')?'🎩 De terno no lanche ou no cinema fica exagerado (−1). ':''}`:'';
    ov.innerHTML=`<div class="dbox bpbox"><div class="dhead"><div class="clprev">${AV.svg(t==='av'?'role':t,92)}</div><div style="flex:1;min-width:0"><b style="font-size:18px">👔 Closet</b><div class="muted" style="font-size:13px">Escolha o que vestir. O look da mesa vale nos torneios e no cash; o do rolê, em encontros, saídas e eventos.</div></div><button class="sm" data-cl="x">✕</button></div>
      <div class="lcats"><button class="${t==='mesa'?'on':''}" data-cl="tab|mesa">🃏 Look da mesa</button><button class="${t==='role'?'on':''}" data-cl="tab|role">🌃 Look do rolê</button><button class="${t==='av'?'on':''}" data-cl="tab|av">🙂 Aparência</button></div>
      <div class="bpscroll">${t==='av'?av():this.SLOTS.map(slot).join('')}${fx?`<div class="vsum" style="margin-top:8px">${fx}</div>`:''}</div></div>`}};

/* ----- avatar desenhado com o que você veste ----- */
const AV={
  svg(ctx,sz){if(!LIFE.s)return'';const L=OUT.st(),A=L.av,W=c=>L[ctx]&&Object.values(L[ctx]).includes(c),P=['#f1d3b6','#e3b48f','#c68b5e','#8d5a3b','#5a3a26'][A.pele||0],H=A.cor||'#2b1d14',id='a'+Math.random().toString(36).slice(2,7);
    const top=W('terno')?'terno':W('jaqueta')?'jaqueta':W('camisa')?'camisa':W('moletom')?'moletom':'camiseta';
    const body={camiseta:`<path d="M14 120 C16 92 34 84 60 84 C86 84 104 92 106 120Z" fill="#3f7d64"/>`,
      moletom:`<path d="M12 120 C14 90 32 80 60 80 C88 80 106 90 108 120Z" fill="#6b7380"/><path d="M38 84 C42 98 78 98 82 84" fill="none" stroke="#4c535e" stroke-width="5"/><line x1="54" y1="94" x2="52" y2="108" stroke="#d9d9d9" stroke-width="2"/><line x1="66" y1="94" x2="68" y2="108" stroke="#d9d9d9" stroke-width="2"/>`,
      camisa:`<path d="M14 120 C16 92 34 84 60 84 C86 84 104 92 106 120Z" fill="#f2f2f2"/><path d="M48 84 L60 98 L72 84" fill="#fff" stroke="#cfcfcf" stroke-width="1.5"/><circle cx="60" cy="104" r="1.6" fill="#bbb"/><circle cx="60" cy="113" r="1.6" fill="#bbb"/>`,
      jaqueta:`<path d="M14 120 C16 92 34 84 60 84 C86 84 104 92 106 120Z" fill="#1d1d1f"/><path d="M50 86 L60 120 L70 86 Z" fill="#3f7d64"/><path d="M44 86 L54 106 L50 86Z M76 86 L66 106 L70 86Z" fill="#333"/>`,
      terno:`<path d="M14 120 C16 92 34 84 60 84 C86 84 104 92 106 120Z" fill="#1f2a44"/><path d="M50 86 L60 120 L70 86 Z" fill="#fff"/><path d="M57 90 L63 90 L61 110 L60 113 L59 110Z" fill="#a51f2d"/><path d="M46 86 L56 108 L50 86Z M74 86 L64 108 L70 86Z" fill="#2c3a5c"/>`}[top];
    const hair={curto:`<path d="M37 47 C36 27 50 20 60 20 C72 20 85 27 83 47 C80 38 72 33 60 33 C48 33 40 38 37 47Z" fill="${H}"/>`,raspado:`<path d="M39 44 C40 29 50 24 60 24 C70 24 80 29 81 44 C76 37 69 34 60 34 C51 34 44 37 39 44Z" fill="${H}" opacity=".55"/>`,
      cacheado:`<g fill="${H}"><circle cx="42" cy="38" r="8"/><circle cx="50" cy="29" r="8"/><circle cx="60" cy="26" r="9"/><circle cx="70" cy="29" r="8"/><circle cx="78" cy="38" r="8"/></g>`,longo:`<path d="M35 70 C30 40 42 20 60 20 C78 20 90 40 85 70 C82 52 80 40 60 34 C40 40 38 52 35 70Z" fill="${H}"/>`,careca:''}[A.cab||'curto'];
    const beard={sem:'',curta:`<path d="M42 58 C44 74 52 80 60 80 C68 80 76 74 78 58 C74 70 68 74 60 74 C52 74 46 70 42 58Z" fill="${H}" opacity=".45"/>`,cheia:`<path d="M40 54 C40 76 50 84 60 84 C70 84 80 76 80 54 C76 70 70 74 60 74 C50 74 44 70 40 54Z" fill="${H}"/>`,cavanhaque:`<path d="M54 70 C54 78 57 80 60 80 C63 80 66 78 66 70 C63 73 57 73 54 70Z" fill="${H}"/>`}[A.barba||'sem'];
    return`<svg class="avsvg" width="${sz}" height="${sz}" viewBox="0 0 120 120" aria-label="Seu avatar"><defs><clipPath id="${id}"><circle cx="60" cy="60" r="58"/></clipPath><radialGradient id="${id}g" cx=".5" cy=".3"><stop offset="0" stop-color="#1f6a50"/><stop offset="1" stop-color="#0c2f23"/></radialGradient></defs>
      <g clip-path="url(#${id})"><rect width="120" height="120" fill="url(#${id}g)"/>${body}<rect x="53" y="70" width="14" height="16" rx="4" fill="${P}"/>
      ${W('corrente')?'<path d="M47 86 C52 98 68 98 73 86" fill="none" stroke="#e9c35a" stroke-width="2.6"/>':''}
      <ellipse cx="60" cy="52" rx="22" ry="25" fill="${P}"/><ellipse cx="38" cy="54" rx="3.5" ry="5" fill="${P}"/><ellipse cx="82" cy="54" rx="3.5" ry="5" fill="${P}"/>${hair}${beard}
      ${W('oculos')?'<g><rect x="42" y="45" width="15" height="9" rx="3" fill="#111"/><rect x="63" y="45" width="15" height="9" rx="3" fill="#111"/><line x1="57" y1="49" x2="63" y2="49" stroke="#111" stroke-width="2"/></g>':'<circle cx="51" cy="50" r="2.4" fill="#2a2a2a"/><circle cx="69" cy="50" r="2.4" fill="#2a2a2a"/>'}
      <path d="M53 63 Q60 ${LIFE.s.mood>=1?69:LIFE.s.mood<=-1?59:64} 67 63" fill="none" stroke="#7a3b2e" stroke-width="2" stroke-linecap="round"/>
      ${W('bone')?`<path d="M36 40 C36 22 84 22 84 40 Z" fill="#c9302c"/><path d="M80 38 C92 38 98 41 98 43 L80 43Z" fill="#a32522"/><circle cx="60" cy="24" r="2" fill="#a32522"/>${LIFE.sps()[0]?`<text x="60" y="37" font-size="10" text-anchor="middle">${LIFE.sps()[0].emo}</text>`:''}`:''}
      ${W('patek')||W('rolex')||W('relogio')||W('ultra')||W('gshock')?`<g><rect x="8" y="98" width="20" height="9" rx="3" fill="${P}"/><rect x="15" y="95" width="8" height="15" rx="2" fill="${W('patek')||W('rolex')||W('relogio')?'#e9c35a':'#333'}"/><circle cx="19" cy="102.5" r="3" fill="${W('patek')?'#2b4a7a':W('rolex')?'#1c5a3a':'#ddd'}"/></g>`:''}
      ${W('anel')?'<circle cx="104" cy="104" r="4" fill="none" stroke="#e9c35a" stroke-width="2.4"/>':''}</g>
      <circle cx="60" cy="60" r="58" fill="none" stroke="${LIFE.s.hof?'#f0c96e':'rgba(255,255,255,.18)'}" stroke-width="${LIFE.s.hof?3:2}"/></svg>`}};

/* ----- barra fixa do topo ----- */
const HUD={last:'',
  render(){let el=document.getElementById('hud');const on=!!(LIFE.s&&LIVES.s&&CAL.on()&&!document.body.classList.contains('ttlon'));
    document.body.classList.toggle('hudOn',!!on);if(!on){if(el)el.style.display='none';return}
    if(!el){el=document.createElement('div');el.id='hud';document.body.prepend(el);el.onclick=e=>{if(e.target.closest('[data-hud="look"]')){OUT.open();return}LIFE.tab='hoje';location.hash='#vida';try{renderLife()}catch(x){}window.scrollTo({top:0,behavior:'smooth'})}}
    el.style.display='';const s=LIFE.s,e=Math.round(s.energy),m=s.mood,key=[WALLET.s.bal,e,m,CLK.fmt(),CAL.today(),JSON.stringify(s.look||{}),LIFE.unread()].join('|');if(key===this.last)return;this.last=key;
    el.innerHTML=`<button class="hu-av" data-hud="look" title="Closet">${AV.svg('mesa',34)}</button><div class="hu-c"><div class="hu-r"><b class="${WALLET.s.bal<0?'bad':''}">${brlc(WALLET.s.bal)}</b><span class="hu-e" title="Energia"><i style="width:${e}%;background:${e<35?'var(--bad)':'var(--ok)'}"></i></span><span>${m>=2?'😁':m>=1?'🙂':m<=-2?'😞':m<=-1?'😕':'😐'}</span></div><div class="hu-s">${CLK.txt()} · ${CAL.fmt(CAL.today())}${(HOL.of(CAL.today())||{}).emo||''}</div></div>${LIFE.unread()?`<span class="hu-n">${LIFE.unread()>9?'9+':LIFE.unread()}</span>`:''}`}};

/* ----- avisos que aparecem perto do polegar ----- */
const TOAST={t:null,
  show(m){if(!m)return;const txt=String(m).replace(/<[^>]+>/g,'').trim();if(!txt)return;let el=document.getElementById('toast');if(!el){el=document.createElement('div');el.id='toast';document.body.appendChild(el);el.onclick=()=>el.classList.remove('on')}
    el.textContent=txt;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');clearTimeout(this.t);this.t=setTimeout(()=>el.classList.remove('on'),Math.min(9000,2600+txt.length*45));try{if(navigator.vibrate)navigator.vibrate(12)}catch(e){}}};

/* ----- abas agrupadas ----- */
const VG={G:[['inicio','🏠','Início',['hoje','casa']],['pessoas','👥','Pessoas',['fam','cel','hg']],['carreira','🏆','Carreira',['pat','midia','legado']],['compras','🛍️','Compras',['loja','garagem']]],
  NM:{hoje:'📋 Hoje',casa:'🏡 Casa',fam:'❤️ Família',cel:'📱 Celular',hg:'🍻 Home game',pat:'🤝 Marcas',midia:'🎤 Mídia',legado:'🏆 Legado',loja:'🛍️ Loja',garagem:'🚗 Carros'},last:{},
  of(t){return(this.G.find(g=>g[3].includes(t))||this.G[0])[0]},
  bar(tab,cnt){const cur=this.of(tab);this.last[cur]=tab;const c=k=>cnt[k]||0;
    return`<div class="vgroups">${this.G.map(([k,i,t,subs])=>{const n=subs.reduce((a,x)=>a+c(x),0);return`<button class="${cur===k?'on':''}" data-vg="${k}"><span class="vti">${i}</span><span class="vtl">${t}</span>${n?`<span class="vbdg nbg">${n>9?'9+':n}</span>`:''}</button>`}).join('')}</div>
      <div class="lcats vsubs">${this.G.find(g=>g[0]===cur)[3].map(k=>`<button class="${tab===k?'on':''}" data-vt="${k}">${this.NM[k]}${c(k)?` <b class="sbdg">${c(k)}</b>`:''}</button>`).join('')}</div>`}};

/* ----- painel Hoje ----- */
const HOJE={
  html(){const s=LIFE.s,t=CAL.today(),A=CAL.st(),me=CIRC.me(),L=LIFE.level(),rows=[];const add=(e,x,go,cls)=>rows.push(`<button class="hrow ${cls||''}" data-go="${go}"><span class="he">${e}</span><span class="hx">${x}</span><span class="ha">›</span></button>`);
    CAL.events(t).forEach(ev=>{const r=A.reg[ev.key],dn=A.done[ev.key];if(dn)return;if(r||CAL.regOpen(ev))add(ev.E.emo,`<b>${ev.E.nm}</b> hoje${r?' · você está inscrito':` · inscrição R$ ${brl(ev.E.buy)}`}`,'hash:#torneio',r?'hot':'')});
    CAL.items(t).forEach(it=>add(it.emo||'📌',`<b>${lx(it.title)}</b> hoje`,'hash:#torneio','hot'));
    if(s.dnow&&!s.dnow.over)add('💞',`Você está num encontro com ${lx(s.dnow.nm)}`,'date','hot');
    if(s.press&&!s.press.over)add('🎤','A imprensa está te esperando','press','hot');
    if(s.finv&&s.finv.d===t&&!s.finv.ans)add(OUTA[s.finv.k].emo,`${s.finv.n} te chamou pra ${OUTA[s.finv.k].nm.toLowerCase()}`,'cel:'+s.finv.n,'hot');
    if(s.bds&&s.bds.d===t)s.bds.l.filter(n=>!s.bds.done.includes(n)).forEach(n=>add('🎂',`Aniversário de ${n}`,'cel:'+n));
    (s.spReq||[]).forEach(r=>{const c=LIFE.spById(r.sp);if(c)add(c.emo,`${c.nm.split(' (')[0]} quer você no ${r.nm}`,'tab:pat','hot')});
    (s.offers||[]).forEach(o=>{const p=SPONS.find(x=>x.id===o.id);if(p)add(p.emo,`Proposta de patrocínio: ${p.nm.split(' (')[0]}`,'tab:pat')});
    if((s.ivs||[]).length)add('🎤',`${s.ivs[0].j} quer te entrevistar`,'tab:midia');
    const un=Object.entries(s.th||{}).filter(([n,T])=>T.u).map(([n])=>n);if(un.length)add('💬',`Mensagem de ${un.slice(0,3).join(', ')}${un.length>3?'…':''}`,'tab:cel');
    if(s.love&&s.love.tu)add('❤️',`${s.love.nm} te mandou mensagem`,'cel:♥');
    (s.loans||[]).filter(l=>!l.paid&&l.due<=t).forEach(l=>add('🧾',`${l.n} te deve R$ ${brl(l.v)} (venceu)`,'cel:'+l.n));
    if(!LIFE.daily('post'))add('📲','Você ainda não postou hoje','tab:midia');
    if((HOL.of(t)||{}).id)add(HOL.of(t).emo,`${HOL.of(t).nm}: ${HOL.of(t).tip}`,HOL.of(t).id==='bf'?'tab:loja':'tab:fam');
    let nx=null;for(let d=t+1;d<=t+30&&!nx;d++)CAL.events(d).forEach(e=>{if(!nx&&!e.part&&['main','etapa'].includes(e.id))nx={e,d}});
    const sp=LIFE.sps().map(c=>{const left=Math.max(0,c.end-t),req=Object.entries(c.req||{}),done=req.filter(([k,v])=>(c.done[k]||0)>=v).length;return`<div class="hsp"><span>${c.emo} ${c.nm.split(' (')[0]}</span><span class="${done===req.length?'ok':left<5?'bad':'muted'}">${done}/${req.length} metas · ${left}d</span></div>`}).join('');
    const ml=MOODL.list().slice(0,4);
    return`<div class="panel hoje"><div class="hhead"><div class="hav" data-go="look">${AV.svg('role',76)}<span class="hedit">👔</span></div><div style="flex:1;min-width:0"><h2 style="margin:0">${lx(me)}</h2><div class="muted" style="font-size:13px">${L[1]} · fama ${Math.round(s.fame)} · ${nf(s.fans)} seguidores${(()=>{try{const r=PUB.rankOf('Você');return r?` · ${r.pos}º no ranking`:''}catch(e){return''}})()}</div>
        <div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:4px">${ml.map(([e,x,v])=>`<span class="mdl ${v>0?'up':'dn'}">${e} ${x}</span>`).join('')}</div></div></div>
      <div class="hquick"><button data-go="hash:#jogar">🖥️<span>Jogar online</span></button><button data-go="hash:#torneio">🏆<span>Agenda</span></button><button data-go="tab:cel">📱<span>Celular</span></button><button data-go="look">👔<span>Closet</span></button></div></div>
      <div class="panel"><h3>📋 Pra fazer agora</h3>${rows.join('')||'<p class="muted" style="margin:0">Nada pendente. Que tal uma live, uma sessão online ou chamar alguém pra sair?</p>'}
      ${nx?`<div class="vsum" style="margin-top:8px">${nx.e.E.emo} Próximo grande: <b>${nx.e.E.nm}</b> em ${CAL.fmt(nx.d)} (${nx.d-t} dia${nx.d-t>1?'s':''}).</div>`:''}</div>
      ${sp?`<div class="panel"><h3>🤝 Contratos</h3>${sp}</div>`:''}`},
  go(g){const[a,...r]=g.split(':'),v=r.join(':');if(a==='hash'){location.hash=v;return}if(a==='tab'){LIFE.tab=v;LIFE.open=null;renderLife();window.scrollTo({top:0,behavior:'smooth'});return}
    if(a==='cel'){LIFE.tab='cel';LIFE.open=v;renderLife();window.scrollTo({top:0,behavior:'smooth'});return}if(a==='look'){OUT.open();return}if(a==='date'){DATE.min=false;DATE.render();return}if(a==='press'){PRESS.render();return}}};

/* ----- ganchos da interface ----- */
(function(){try{
  LIFE.tab='hoje';
  /* renderLife: guarda o que você digitava, a rolagem e anima troca de aba */
  const _rl=renderLife;let lastTab=null;
  renderLife=function(){const el=document.getElementById('vidaRoot');const vals={};let foc=null,sel=0;const sy=window.scrollY;
    if(el){el.querySelectorAll('input[data-r],textarea[data-r]').forEach(i=>{vals[i.dataset.r]=i.value});const a=document.activeElement;if(a&&el.contains(a)&&a.dataset&&a.dataset.r){foc=a.dataset.r;sel=a.selectionStart||0}}
    _rl.apply(this,arguments);if(!el)return;const tab=LIFE.tab;
    Object.entries(vals).forEach(([k,v])=>{const i=el.querySelector(`[data-r="${k}"]`);if(i&&v&&!i.value)i.value=v});if(foc){const i=el.querySelector(`[data-r="${foc}"]`);if(i){i.focus({preventScroll:true});try{i.setSelectionRange(sel,sel)}catch(e){}}}
    if(lastTab!==null&&lastTab!==tab){el.classList.remove('tabin');void el.offsetWidth;el.classList.add('tabin');const top=el.querySelector('.vsubs');if(top&&window.scrollY>200)window.scrollTo({top:Math.max(0,top.getBoundingClientRect().top+window.scrollY-120)})}else window.scrollTo(0,sy);
    lastTab=tab;HUD.render()};
  /* bottom sheets: arrastar pra baixo fecha */
  let drag=null;document.addEventListener('touchstart',e=>{const h=e.target.closest&&e.target.closest('.dbox');if(!h)return;const ov=h.parentElement;if(!ov||!ov.__close)return;const sc=e.target.closest('.bpscroll,.dlog');if(sc&&sc.scrollTop>0)return;if(e.target.closest('input,textarea,button,a'))return;drag={y:e.touches[0].clientY,box:h,ov,dy:0}},{passive:true});
  document.addEventListener('touchmove',e=>{if(!drag)return;drag.dy=Math.max(0,e.touches[0].clientY-drag.y);drag.box.style.transform=`translateY(${drag.dy}px)`},{passive:true});
  document.addEventListener('touchend',()=>{if(!drag)return;const d=drag;drag=null;if(d.dy>110){d.box.style.transition='transform .18s';d.box.style.transform='translateY(100%)';setTimeout(()=>d.ov.__close&&d.ov.__close(),170)}else{d.box.style.transition='transform .18s';d.box.style.transform='';setTimeout(()=>d.box.style.transition='',200)}});
  const _dr=DATE.render;DATE.render=function(){_dr.apply(this,arguments);const ov=document.getElementById('dOv');if(ov&&ov.className==='dov')ov.__close=()=>{if(DATE.st()&&DATE.st().over)DATE.close();else{DATE.min=true;DATE.render()}}};
  const _bo=BOTP.open;BOTP.open=function(){_bo.apply(this,arguments);const ov=document.getElementById('bpOv');if(ov)ov.__close=()=>BOTP.close()};
  const _pr=PRESS.render;PRESS.render=function(){_pr.apply(this,arguments);const ov=document.getElementById('prOv');if(ov)ov.__close=()=>{const P=LIFE.s.press;if(P&&P.over)PRESS.close()}};
  /* cartas entrando com animação, só as novas */
  const _rt=Table.prototype.renderTable;Table.prototype.renderTable=function(){_rt.apply(this,arguments);try{const g=this.g;if(!g)return;if(this._dh!==g.hands){this._dh=g.hands;this._seen=new Set()}const tb=this.$('table');if(!tb)return;
    tb.querySelectorAll('.card[data-id]').forEach(c=>{const k=c.closest('.pseat')?'p'+c.dataset.id:'b'+c.dataset.id;if(!this._seen.has(k)){this._seen.add(k);c.classList.add('deal')}})}catch(e){}};
  /* look: efeitos */
  DATE.look=function(){const it=OUT.items('role').filter(x=>x.cat!=='bel');const a=it.length?it.map(x=>x.nm.toLowerCase()):['a melhor roupa do armário'];if(OUT.wear('role','nicho'))a.push('perfume de nicho');else if(OUT.wear('role','perfume'))a.push('perfume importado');else a.push('um banho caprichado');return a};
  const _ds=DATE.start;DATE.start=function(k,via){const r=_ds.apply(this,arguments);try{const d=this.st();if(d&&d.turns===0&&!d.lookB){d.lookB=1;let v=0;if(['jantar','chique'].includes(k)&&OUT.formal('role'))v+=2;if(OUT.wear('role','nicho')||OUT.wear('role','perfume'))v+=1;if(['lanche','cinema'].includes(k)&&OUT.wear('role','terno'))v-=1;if(v){this.apply(v);LIFE.commit();this.render()}}}catch(e){}return r};
  LOOK.icons=function(){return''};LOOK.best=function(){return OUT.items('mesa').sort((a,b)=>b.price-a.price)[0]||null};
  const _os=LIFE.onStart;LIFE.onStart=function(kind,mtt){_os.call(this,kind,mtt);try{if(kind==='tour'&&this.s&&(OUT.wear('mesa','moletom')||OUT.wear('mesa','corrida'))){this.s.energy=Math.min(100,this.s.energy+3);this.commit()}}catch(e){}};
  const _pa=PRESS.answer;PRESS.answer=async function(tone,txt){if(OUT.formal('mesa'))LIFE.addFame(.15);return _pa.call(this,tone,txt)};
  /* botões globais */
  document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-vg],[data-go],[data-cl],[data-hud]');if(!t)return;const d=t.dataset;
    if(d.vg){e.preventDefault();e.stopPropagation();const G=VG.G.find(g=>g[0]===d.vg);LIFE.tab=VG.last[d.vg]||G[3][0];LIFE.open=null;renderLife();return}
    if(d.go){e.preventDefault();e.stopPropagation();HOJE.go(d.go);return}
    if(d.cl){e.preventDefault();e.stopPropagation();const[a,b,c]=d.cl.split('|');if(a==='x'){OUT.close();return}if(a==='tab'){OUT.tab=b;OUT.render();return}OUT.set(a,b,a==='av'&&b==='pele'?+c:c);OUT.render();HUD.last='';HUD.render();return}},true);
  document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.pact button,.acts button,[data-a]');if(b)try{if(navigator.vibrate)navigator.vibrate(8)}catch(x){}},{passive:true});
  window.addEventListener('hashchange',()=>{HUD.last='';HUD.render()});setInterval(()=>{try{HUD.render()}catch(e){}},1000);setTimeout(()=>{try{HUD.render()}catch(e){}},400);
}catch(e){console.warn('ux55',e)}})();
