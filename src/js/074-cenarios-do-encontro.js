/* =============== v63: cada encontro tem cenário, clima e ações próprias =============== */
const DSC={
  /* cenário desenhado de cada lugar (faixa no topo do encontro) */
  bg:{lanche:['#3a1f10','#8a3a1a'],cinema:['#05060c','#1a1430'],casa:['#2a1c12','#6a4a2a'],jantar:['#1c0f14','#5a2030'],show:['#0a0420','#3a0a5a'],chique:['#0f0d08','#4a3a1a'],motel:['#12020c','#5a0a3a'],viagem:['#ff9a5a','#2a6a9a'],bar:['#1a120a','#5a3a1a'],festa:['#080318','#4a0a6a']},
  art(k,h){const H=h>=18||h<6;const S={
    lanche:`<rect x="0" y="62" width="400" height="28" fill="#c9a06a"/><rect x="30" y="20" width="120" height="34" rx="6" fill="#e04a3a"/><text x="90" y="43" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">BURGER</text><text x="250" y="72" font-size="26">🍔🍟🥤</text>`,
    cinema:`<rect x="40" y="8" width="320" height="50" rx="4" fill="#dfe8ff" opacity=".85" class="dflk"/><g fill="#3a1020">${[...Array(9)].map((_,i)=>`<rect x="${20+i*42}" y="66" width="34" height="24" rx="8"/>`).join('')}</g><text x="320" y="88" font-size="18">🍿</text>`,
    casa:`<rect x="0" y="64" width="400" height="26" fill="#5a3a22"/><rect x="40" y="20" width="70" height="44" fill="#2a1a10"/><rect x="48" y="26" width="54" height="30" fill="#ffcf7a" opacity=".6"/><text x="230" y="60" font-size="26">🛋️</text><text x="300" y="60" font-size="22">🕯️🍝</text>`,
    jantar:`<rect x="0" y="66" width="400" height="24" fill="#2a1010"/><ellipse cx="200" cy="70" rx="90" ry="12" fill="#f4ecdc"/><text x="160" y="66" font-size="22">🕯️🍷🕯️</text><g fill="#ffcf7a" opacity=".5">${[...Array(12)].map((_,i)=>`<circle cx="${20+i*33}" cy="12" r="3" class="dtw" style="animation-delay:${i*.2}s"/>`).join('')}</g>`,
    show:`<g opacity=".7"><path d="M60 0 L20 90 L100 90Z" fill="#ff3cac" class="dbeam"/><path d="M200 0 L150 90 L250 90Z" fill="#2de2e6" class="dbeam d2"/><path d="M340 0 L300 90 L380 90Z" fill="#ffd34a" class="dbeam d3"/></g><text x="180" y="84" font-size="22">🎤🎶</text>`,
    chique:`<rect x="0" y="64" width="400" height="26" fill="#1a140a"/><g fill="#f0c96e">${[...Array(8)].map((_,i)=>`<circle cx="${40+i*46}" cy="18" r="6" opacity=".6" class="dtw" style="animation-delay:${i*.3}s"/>`).join('')}</g><text x="150" y="62" font-size="24">🥂🍽️🥂</text>`,
    motel:`<rect x="0" y="0" width="400" height="90" fill="url(#mgl)"/><g class="dneon"><text x="200" y="36" text-anchor="middle" font-size="22" font-weight="900" fill="#ff5ec8" font-family="Georgia">Lua Azul</text><text x="200" y="54" text-anchor="middle" font-size="9" letter-spacing="3" fill="#ffb3e6">SUÍTES</text></g><rect x="60" y="62" width="280" height="22" rx="10" fill="#6a1040"/><rect x="70" y="56" width="70" height="12" rx="5" fill="#f4dbe8"/><rect x="260" y="56" width="70" height="12" rx="5" fill="#f4dbe8"/><text x="350" y="40" font-size="20">🛁</text><text x="22" y="40" font-size="18">🕯️</text>`,
    viagem:`<rect x="0" y="58" width="400" height="32" fill="#e8d2a0"/><rect x="0" y="50" width="400" height="10" fill="#3a8ab8" opacity=".8" class="dwave"/><circle cx="300" cy="44" r="18" fill="#ffd36a"/><text x="40" y="56" font-size="28">🌴</text><text x="200" y="84" font-size="18">🏖️🍹</text>`,
    bar:`<rect x="0" y="60" width="400" height="30" fill="#4a2a14"/><g>${[...Array(10)].map((_,i)=>`<circle cx="${20+i*40}" cy="${10+(i%2)*4}" r="3" fill="#ffe08a" class="dtw" style="animation-delay:${i*.15}s"/>`).join('')}</g><text x="60" y="56" font-size="22">🍻</text><text x="250" y="56" font-size="22">🎯🎱</text>`,
    festa:`<circle cx="200" cy="18" r="14" fill="#cfd6ff" class="dball"/><g opacity=".55">${[...Array(14)].map((_,i)=>`<circle cx="${(i*53)%400}" cy="${30+(i*17)%55}" r="3" fill="${['#ff3cac','#2de2e6','#ffd34a'][i%3]}" class="dtw" style="animation-delay:${i*.12}s"/>`).join('')}</g><text x="160" y="86" font-size="22">💃🕺🎉</text>`}[k]||'';
    const [a,b]=this.bg[k]||['#1d2b55','#5a3b6b'];
    return`<svg class="dart" viewBox="0 0 400 90" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="dgr${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><radialGradient id="mgl" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#ff4aa8" stop-opacity=".35"/><stop offset="1" stop-color="#12020c" stop-opacity="0"/></radialGradient></defs><rect width="400" height="90" fill="url(#dgr${k})"/>${H&&k!=='viagem'&&k!=='cinema'?'':''}${S}</svg>`},
  /* ações de cada lugar: [rótulo, chance base, delta se der certo, delta se não, o que acontece] */
  A:{lanche:[['🍟 Roubar uma batata dela',.8,2,-1,'roubou uma batata do prato']],
     cinema:[['🍿 Dividir a pipoca',.9,2,0,'dividiu o balde de pipoca'],['🤫 Comentar o filme baixinho',.7,2,-1,'cochichou um comentário engraçado sobre o filme']],
     casa:[['🍝 Cozinhar junto',.85,3,0,'chamou pra cozinhar junto'],['🛋️ Série no sofá, abraçados',.75,3,-1,'puxou pra ver série no sofá, abraçados']],
     jantar:[['🥂 Propor um brinde',.85,2,0,'propôs um brinde aos dois']],
     show:[['💃 Chamar pra dançar',.7,4,-2,'chamou pra dançar perto do palco']],
     chique:[['📸 Foto juntos pro story',.75,3,-1,'pediu pro garçom tirar uma foto dos dois']],
     motel:[['🛁 Encher a hidromassagem',.85,3,-1,'encheu a hidromassagem com espuma e luz baixa'],['💆 Fazer uma massagem',.7,4,-2,'ofereceu uma massagem nos ombros'],['🎶 Colocar uma música',.9,2,0,'colocou uma playlist lenta']],
     viagem:[['🌅 Ver o pôr do sol na areia',.9,3,0,'chamou pra ver o pôr do sol na areia'],['🌊 Mergulho no mar',.75,3,-1,'puxou pra um mergulho no mar']],
     bar:[['🎱 Desafiar na sinuca',.8,2,-1,'desafiou pra uma partida de sinuca']],
     festa:[['💃 Chamar pra dançar',.75,4,-2,'chamou pra dançar no meio da pista'],['🍹 Buscar um drink',.9,2,0,'foi buscar um drink pros dois']]},
  /* clima por lugar pra IA */
  vibe:{motel:'Vocês estão numa suíte de motel, a dois. Clima íntimo e sedutor é bem-vindo: provocação, beijos, carícias, cumplicidade e humor. Nada de descrição sexual explícita: quando a intimidade chegar, a câmera corta (fade) e a narração retoma depois, com os dois rindo, abraçados ou conversando na cama.',
    viagem:'Fim de semana numa pousada pé na areia: mar, pôr do sol, drinks, preguiça boa.',show:'Show/balada: música alta, dança, gritar no ouvido pra conversar.',festa:'Festa cheia: música, gente, um canto mais calmo pra conversar.',
    cinema:'Cinema: conversa baixinha, pipoca, comentários sobre o filme; depois papo no carro.',casa:'Jantar na sua casa: você cozinhou, clima caseiro e íntimo, sofá, vinho.',
    bar:'Bar com amigos: mesa cheia, cerveja, sinuca, zoeira.',chique:'Restaurante chique: menu degustação, sommelier, garçom atento, ambiente sofisticado.',jantar:'Jantar com vinho, luz baixa, conversa longa.',lanche:'Lanchonete: descontraído, hambúrguer, batata, milk-shake.'}};
/* o prompt do encontro ganha o clima do lugar */
{const _p=DATE.prompt;DATE.prompt=function(kind,me,out){let p=_p.apply(this,arguments);const d=this.st();const v=d&&DSC.vibe[d.k];
  if(v)p=p.replace('Nada de conteúdo sexual explícito: se o clima esquentar, corte a cena com elegância.',`Nada de conteúdo sexual explícito. ${v}`).replace(/Local: ([^.]*)\./,`Local: $1. ${v}`);
  if(kind==='fade')p=p.replace(/Agora: [^\n]*/,`Agora: o clima esquentou e ${CIRC.me()} e ${LIFE.s.love.nm} ficaram a sós de verdade. NÃO descreva o que aconteceu: narre só o depois (fade), com carinho e humor, e a fala dela${LIFE.s.love.g==='f'?'':'e'} depois.`);
  return p}}
/* ações do lugar e o "fechar a porta" */
DATE.place=function(i){const d=this.st(),L=LIFE.s.love;if(!d||d.over||this.busy||!L)return;const a=(DSC.A[d.k]||[])[i];if(!a)return;d.pl=d.pl||{};if(d.pl[i])return;d.pl[i]=1;
  const ok=Math.random()<clamp(a[1]+L.b/400+d.g/80,.1,.97),me=`*${a[4]}*`;d.log.push({f:'me',x:me,k:'place'});d.turns++;CLK.to(d.h0+Math.min(this.HRS[d.k]||3,d.turns*.25));
  this.apply(ok?a[2]:a[3]);LIFE.commit();this.render();this.ai('place',me,ok?`ACEITOU e curtiu (${a[4]}).`:`NÃO CURTIU muito (${a[4]}): reagiu sem empolgação.`,false)};
DATE.fade=function(){const d=this.st(),L=LIFE.s.love;if(!d||d.over||this.busy||!L||d.faded)return;
  const p=clamp(.35+L.b/150+d.g/30+(d.kiss?.2:0)+(L.stage==='namoro'?.3:0),.05,.97),ok=Math.random()<p;
  if(!ok){d.log.push({f:'me',x:'*puxa pra mais perto, com outras intenções*',k:'fade'});d.turns++;this.apply(-3);LIFE.commit();this.render();this.ai('fade',null,'NÃO QUIS AINDA: pediu pra ir com calma, sem drama.',false);return}
  d.faded=true;d.log.push({f:'me',x:'*apaga a luz*',k:'fade'});d.log.push({f:'n',x:'🌙 A luz apagou. O resto fica só entre vocês dois.',fade:1});d.turns+=3;this.apply(6);L.kissed=true;d.kiss=true;
  LIFE.s.energy=Math.max(0,LIFE.s.energy-8);LIFE.addMood(1);CLK.to(d.h0+Math.min(this.HRS[d.k]||3,d.turns*.4));LIFE.commit();this.render();this.ai('fade',null,'ACONTECEU (fora de cena).',false)};
/* desenha o cenário e os botões do lugar dentro da tela do encontro */
{const _r=DATE.render;DATE.render=function(){_r.apply(this,arguments);try{const ov=document.getElementById('dOv'),d=LIFE.s&&this.st();if(!ov||!d||this.min)return;const box=ov.querySelector('.dbox');if(!box)return;
  box.dataset.k=d.k;const sc=box.querySelector('.dscene');const art=`<div class="dscene2">${DSC.art(d.k,CLK.now())}</div>`;if(sc)sc.outerHTML=art;else{const hd=box.querySelector('.dhead');if(hd)hd.insertAdjacentHTML('afterend',art)}
  const acts=box.querySelector('.dacts');if(acts&&!d.over){const A=DSC.A[d.k]||[],pl=d.pl||{};
    const ex=A.map((a,i)=>pl[i]?'':`<button class="sm dpl" data-dp="${i}">${a[0]}</button>`).join('')+((d.k==='motel'||d.k==='viagem'||(d.k==='casa'&&LIFE.s.love.stage==='namoro'))&&d.kiss&&!d.faded?'<button class="sm dpl hot" data-dp="fade">🌙 Apagar a luz</button>':'');
    if(ex)acts.insertAdjacentHTML('afterbegin',ex);acts.querySelectorAll('[data-dp]').forEach(b=>b.onclick=()=>{const v=b.dataset.dp;v==='fade'?DATE.fade():DATE.place(+v)})}
  box.querySelectorAll('.dn').forEach(n=>{if(/^🌙 A luz apagou/.test(n.textContent))n.classList.add('dfade')})}catch(e){console.warn(e)}}}
/* respostas sem IA pras ações novas */
{const _fb=DATE.fb;DATE.fb=function(kind,out){const L=LIFE.s.love,f=this.f(L);
  if(kind==='place')return/ACEITOU/.test(out||'')?[pickA(['Os dois riram juntos.','O clima ficou mais leve.','Ela chegou mais perto.'.replace('Ela',f?'Ela':'Ele')]),pickA(['Adorei essa ideia.','Você pensa em tudo, hein?','Isso foi muito bom 😊'])]:['Um sorriso meio sem graça.','Hm… talvez depois.'];
  if(kind==='fade')return/ACONTECEU/.test(out||'')?['Mais tarde, deitados, vocês riam de qualquer bobagem.',pickA(['Não esperava essa noite assim 🥰','Fica mais um pouco?','Você é um perigo, sabia?'])]:['Ela segurou sua mão e sorriu.'.replace('Ela',f?'Ela':'Ele'),'Vamos com calma, tá? Tô gostando do nosso ritmo.'];
  return _fb.apply(this,arguments)}}
/* sugestões de fala de acordo com o lugar */
DSC.S={motel:['Essa suíte tá à sua altura, hein?','Vem cá, deixa eu te olhar direito.','Tava com saudade de você.'],cinema:['Esse filme tá meio parado, né? 😂','Tu chora em filme?','Divide a pipoca ou é só minha?'],
  show:['Essa música é muito boa!','Bora mais pra frente do palco?','Tu dança bem, hein!'],festa:['Bora pra um canto mais calmo?','Quem você conhece aqui?','Essa festa tá boa demais!'],
  viagem:['Que lugar lindo, né?','Fica aqui pra sempre comigo?','Bora ver o pôr do sol?'],casa:['Gostou da comida?','Tu cozinha também?','Fica à vontade, a casa é tua.'],
  bar:['Sabe jogar sinuca?','Mais uma rodada?','Gostou da galera?'],chique:['Já tinha vindo num lugar assim?','Escolhe o vinho, confio em ti.','Tá linda hoje, sério.'],
  jantar:['Que vinho bom, né?','Me conta um segredo teu.','Tô gostando muito de hoje.'],lanche:['Batata com cheddar ou sem?','Tu é de doce ou salgado?','Milk-shake dividido?']};
{const _fs=DATE.fsug;DATE.fsug=function(){const d=this.st&&this.st(),S=d&&DSC.S[d.k];if(S&&Math.random()<.6)return S.slice().sort(()=>Math.random()-.5);return _fs.apply(this,arguments)}}
/* pedido do Felipe (uma vez só): voltar o dia do encontro pra sair de novo com quem ele está namorando */
function redoDateOnce(){const s=LIFE.s;if(!s||s.fixRedo1||!CAL.on()||!s.love)return;s.fixRedo1=1;if(!(s.lastDate&&s.lastDate.d===CAL.today()))return;
  if(s.did)delete s.did.date;s.dnow=null;s.hr=Math.min(CLK.now(),18);s.lastDate=null;LIFE.note('↩️',`Dá pra sair de novo com ${s.love.nm}`,`O relógio voltou pras ${CLK.fmt(s.hr)} e o encontro de hoje foi liberado de novo. Chama no celular ou no café do mapa.`);LIFE.commit()}
{const _rl=renderLife;renderLife=function(){try{redoDateOnce()}catch(e){}return _rl.apply(this,arguments)}}
