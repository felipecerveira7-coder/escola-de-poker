/* ----- conversa com o par no celular e encontro interativo ----- */
const DATE={busy:false,min:false,key:'',
  HRS:{lanche:2,cinema:3,casa:3,jantar:3,show:5,chique:3,motel:4,viagem:0},
  st(){return LIFE.s&&LIFE.s.dnow},
  f(L){return L.g==='f'},
  ela(L){return L.g==='f'?'ela':'ele'},
  car(){const c=((LIFE.s.cars)||[]).map(id=>CARS.find(x=>x.id===id)).filter(Boolean).sort((a,b)=>b.price-a.price)[0];return c||null},
  look(){const h=i=>LIFE.has(i),a=[];a.push(h('terno')?'terno sob medida':h('jaqueta')?'jaqueta de couro':h('camisa')?'camisa social passada':'a melhor roupa do armário');
    if(h('jordan'))a.push('Air Jordan no pé');const w=h('patek')?'o Patek no pulso':h('rolex')?'o Rolex no pulso':h('relogio')?'o relógio suíço':h('corrente')?'a corrente de ouro':'';if(w)a.push(w);
    a.push(h('nicho')?'perfume de nicho':h('perfume')?'perfume importado':'um banho caprichado');return a},
  herLook(L){const f=this.f(L),t=LOVE.tipo(L);
    return pickA(f?({romantica:['vestido leve e cabelo solto','vestido florido e um batom que você nunca tinha visto'],aventureira:['jaqueta jeans, tênis e um sorriso de quem topa tudo','cropped, calça de couro e brinco grande'],caseira:['calça jeans, blusa simples e aquele perfume suave','moletom bonito e cabelo preso de qualquer jeito, e mesmo assim linda'],interesseira:['vestido justo de grife, salto alto e unha feita','bolsa de marca, salto fino e maquiagem de festa']})[t]
      :({romantica:['camisa de linho e cabelo arrumado'],aventureira:['jaqueta, tênis e barba por fazer'],caseira:['camiseta lisa e jeans, simples e bonito'],interesseira:['camisa de marca, relógio grande e perfume forte']})[t])},
  pickup(L,k){const D=LOVE.D[k],c=this.car(),lk=this.look(),f=this.f(L),E=f?'Ela':'Ele',lind=f?'linda':'lindo';
    if(k==='casa')return`Você arrumou a casa, acendeu uma vela e se vestiu: ${lk.join(', ')}. A campainha tocou. ${L.nm} chegou ${lind}, ${this.herLook(L)}, com uma garrafa de vinho na mão.`;
    if(k==='viagem')return`Mala no porta-malas${c?` do ${c.nm}`:' do carro alugado'} às 7h. ${L.nm} desceu ${lind}, ${this.herLook(L)}, óculos escuros na cabeça. Pé na estrada rumo à praia.`;
    const ride=c?(c.price>=200000?`Pegou o ${c.nm}, encostou na frente do prédio d${f?'ela':'ele'} e o motor ainda roncando chamou a atenção da rua inteira`:`Pegou o ${c.nm}, lavado à tarde, e estacionou na frente da casa d${f?'ela':'ele'}`):`Chamou um carro de aplicativo e foi buscar ${L.nm}`;
    return`Você caprichou: ${lk.join(', ')}. ${ride}. ${L.nm} desceu ${lind}: ${this.herLook(L)}. ${E} olhou pra você de cima a baixo e sorriu. Destino: ${D.nm.toLowerCase()}.`},
  treat(k){return({lanche:['🥤 Pedir o milk-shake grande pra dividir',40],cinema:['🍿 Pipoca grande e chocolate',60],casa:['🍷 Abrir o vinho bom da adega',180],jantar:['🍷 Pedir um vinho melhor',300],show:['🍹 Pagar uma rodada de drinks',250],chique:['🍾 Pedir um champagne',900],motel:['🍾 Pedir espumante na suíte',220],viagem:['🦞 Jantar de frutos do mar',700]})[k]||['🍷 Pedir um vinho',200]},
  /* o que ela aceita (código decide, IA só escreve) */
  allowed(){const s=LIFE.s,L=s.love,out={ok:[],no:[]};if(!L)return out;LOVE.tipo(L);
    Object.entries(LOVE.D).forEach(([k,D])=>{if(k==='casa'&&s.home==='pais'){out.no.push([k,'você mora com seus pais']);return}
      if(k==='motel'&&L.stage!=='namoro'&&((L.dates||0)<2||L.b<45)){out.no.push([k,'ainda é cedo, vocês mal se conhecem']);return}
      const like=LOVE.T[L.tipo].like[k]||1;if(L.tipo==='interesseira'&&like<.4){out.no.push([k,'acha programa barato demais']);return}
      if(!WALLET.can(LOVE.cost(k))){out.no.push([k,'ele não tem dinheiro pra isso']);return}out.ok.push(k)});return out},
  whenTxt(k){const n=CLK.now(),st=Math.max(n,k==='viagem'?7:19),d=k==='viagem'?0:this.HRS[k];if(LIFE.daily('date'))return'amanhã';if(k==='viagem'?n>10:st+d>26.01)return'amanhã';return k==='viagem'?'hoje (fim de semana)':`hoje às ${CLK.fmt(st)}`},
  /* abre agora (hoje) ou marca no próximo dia livre */
  go(k,via){const s=LIFE.s,L=s.love;if(!L)return'';const D=LOVE.D[k];if(!D)return'';
    if(this.st())return'Você já está num encontro.';
    if(CAL.st().items.some(x=>x.kind==='love'&&x.status==='pending'&&x.ref&&x.ref.date&&x.day===CAL.today()))return'Já tem um encontro marcado pra hoje na Agenda.';
    const today=this.whenTxt(k)!=='amanhã'&&!CAL.blockers();
    if(!today){const day=CAL.free(CAL.today()+1,CAL.today()+8);if(!day)return'Sem dia livre na próxima semana.';return LOVE.book(k,day)}
    return this.start(k,via)},
  start(k,via){const s=LIFE.s,L=s.love;if(!L)return'';LOVE.tipo(L);const D=LOVE.D[k]||LOVE.D.jantar;const c=LOVE.cost(k);
    if(!WALLET.can(c))return`Saldo insuficiente: ${D.nm} custa R$ ${brl(c)}.`;WALLET.add(-c,`${D.nm} com ${L.nm}`);LIFE.mark('date');
    CLK.to(k==='viagem'?7:19);s.energy=Math.max(0,s.energy-D.tire);
    const like=LOVE.T[L.tipo].like[k]||1,gmax=Math.round(D.g[1]*like)+8;
    let g=((HOL.of(CAL.today())||{}).id==='namorados'?4:0)+(s.mood>=1?3:0)-(s.energy<30?6:0)+LIFE.ifx('love')+(L.tipo==='interesseira'&&this.car()&&this.car().price>=200000?3:0)+(like>=1.3?3:like<.8?-3:0);
    s.dnow={k,nm:L.nm,g,gmax,turns:0,h0:CLK.now(),hand:false,kiss:false,kissNo:0,praise:0,treat:false,log:[{f:'n',x:this.pickup(L,k)}],sug:[],q:''};
    const first=this.f(L)?pickA(['Uau. Caprichou, hein?','Oi! Tava ansiosa pra hoje.','Gostei do perfume.','Pensei que você ia se atrasar, jogador.']):pickA(['E aí! Bonito, hein?','Oi! Que bom te ver.','Caprichou, ein.']);
    s.dnow.log.push({f:'her',x:first});s.dnow.sug=this.fsug();this.min=false;LIFE.commit();this.render();this.ai('abertura');
    return`${D.emo} O encontro com ${L.nm} começou.`},
  /* interações */
  act(kind,txt){const d=this.st(),s=LIFE.s,L=s.love;if(!d||d.over||this.busy)return;if(!L){this.close();return}
    txt=(txt||'').trim().slice(0,240);let me='',delta=null,out='';const tipo=LOVE.tipo(L),nam=L.stage==='namoro';
    if(kind==='say'||kind==='ask'){if(!txt)return;me=txt}
    if(kind==='praise'){me=txt||pickA(['Você tá muito linda hoje, sério.','Adoro o jeito que você ri.','Esse sorriso devia ser proibido.','Gostei muito de você ter vindo.']).replace('linda',this.f(L)?'linda':'lindo');d.praise++}
    if(kind==='hand'){me=`*pega na mão d${this.f(L)?'ela':'ele'}*`;const p=clamp(.3+L.b/120+(L.dates||0)*.08+d.g/30+(nam?1:0),.05,.98),ok=Math.random()<p;if(ok)d.hand=true;delta=ok?3:-2;out=ok?'ACEITOU: segurou a mão dele e entrelaçou os dedos.':'RECUSOU: puxou a mão com delicadeza, ainda não se sente à vontade.'}
    if(kind==='kiss'){me=`*se aproxima pra beijar ${L.nm}*`;const p=nam?.97:clamp(-.15+L.b/110+(L.dates||0)*.1+d.g/25+(d.hand?.15:0)-(d.turns<2?.3:0)-d.kissNo*.25+(tipo==='interesseira'?LIFE.status()*.02:0),.03,.95),ok=Math.random()<p;
      if(ok){d.kiss=true;L.kissed=true}else d.kissNo++;delta=ok?(nam?3:6):-4-d.kissNo;out=ok?'ACEITOU o beijo e correspondeu.':(d.kissNo>1?'RECUSOU de novo, já incomodada com a insistência.':'RECUSOU: virou o rosto com um sorriso sem graça, achou cedo.')}
    if(kind==='treat'){const[t,v]=this.treat(d.k),c=Math.round(v*(1+LIFE.status()*.1)/10)*10;if(d.treat)return;if(!WALLET.can(c)){this.flash='Saldo insuficiente.';this.render();return}
      WALLET.add(-c,`Encontro: ${t.replace(/^\S+\s/,'')}`);d.treat=true;me=`*${t.replace(/^\S+\s/,'').toLowerCase().replace(/^pedir/,'pede').replace(/^pagar/,'paga').replace(/^abrir/,'abre')}*`;delta=tipo==='interesseira'?6:tipo==='romantica'?3:2;out=`Ele gastou R$ ${brl(c)} pra agradar.`}
    d.log.push({f:'me',x:me,k:kind});d.turns++;d.q='';CLK.to(d.h0+Math.min(this.HRS[d.k]||3,d.turns*.25));
    if(delta!=null)this.apply(delta);LIFE.commit();this.render();this.ai(kind,me,out,delta==null)},
  apply(v){const d=this.st();d.g=clamp(d.g+v,-15,d.gmax)},
  fsug(){return pickA([['O que você mais gosta de fazer no fim de semana?','Qual foi a melhor viagem da sua vida?','Me conta do seu trabalho.'],['Você já me viu jogando?','Qual seu prato preferido?','Tem irmãos?'],['O que te fez topar sair comigo?','Qual música não sai da sua cabeça?','Onde você se vê daqui a uns anos?']])},
  fb(kind,out){const d=this.st(),L=LIFE.s.love,f=this.f(L);if(kind==='hand')return d.hand?['Ela apertou sua mão de volta.'.replace('Ela',f?'Ela':'Ele'),'Gostei disso.']:['Um silêncio meio sem graça.','Calma… vamos devagar.'];
    if(kind==='kiss')return d.kiss&&/ACEITOU/.test(out)?['O beijo foi demorado. Quando se afastaram, os dois riram.','Eu tava esperando por isso.']:['Ficou um clima estranho por um segundo.','Ei… ainda é cedo, né?'];
    if(kind==='treat')return['O garçom trouxe tudo caprichado.','Ah, você sabe agradar.'];
    if(kind==='praise')return['Ficou vermelh'+(f?'a':'o')+' e sorriu.',d.praise>2?'Tá exagerando, hein 😂':'Para… mas obrigad'+(f?'a':'o') +' 😊'];
    if(kind==='abertura')return[null,null];
    if(kind==='fim')return[`Você deixou ${L.nm} em casa.`,d.g>=8?'Amei hoje. Me chama de novo?':d.g>=0?'Foi legal. Boa noite!':'Tá. Boa noite.'];
    return[null,pickA(['Hm, interessante. E você?','Sério? Me conta mais.','Haha, gostei.','Nunca tinha pensado nisso.'])]},
  prompt(kind,me,out){const s=LIFE.s,L=s.love,d=this.st(),D=LOVE.D[d.k],eu=CIRC.me(),f=this.f(L),T=LOVE.tipo(L);
    const TD={romantica:'romântica, gosta de gentileza, conversa profunda e programas a dois',aventureira:'aventureira, gosta de agito, humor e novidade',caseira:'caseira, gosta de simplicidade, sinceridade e papo tranquilo',interesseira:'interesseira: se encanta com dinheiro, luxo e status; papo simples e programa barato te entediam'}[T];
    const hist=d.log.slice(-14).map(x=>x.f==='n'?`(narração) ${x.x}`:x.f==='her'?`${L.nm}: ${x.x}`:`${eu}: ${x.x}`).join('\n');
    const act=kind==='abertura'?`O encontro acabou de começar (a cena de chegada já foi narrada). Puxe o primeiro assunto.`:kind==='fim'?`${eu} decidiu encerrar o encontro e levar ${L.nm} pra casa. Narre a despedida coerente com o clima${d.kiss?' (vocês se beijaram hoje)':''}.`:kind==='say'||kind==='ask'?`${eu} disse: "${me}"`:kind==='praise'?`${eu} fez um elogio: "${me}"`:`${eu}: ${me}. Resultado (já decidido pelo jogo, respeite): ${out}`;
    return`Você narra e interpreta um encontro romântico num jogo brasileiro de simulação de vida de um jogador de poker. Tom leve, charmoso e realista. ${SARC} Nada de conteúdo sexual explícito: se o clima esquentar, corte a cena com elegância.
Você é ${L.nm} (${f?'mulher':'homem'}), ${L.job}. Personalidade (secreta, não diga o rótulo): ${TD}. Relação com ${eu}: ${Math.round(L.b)}/100, ${L.stage==='namoro'?'namorando':'ainda se conhecendo'}, ${L.dates||0} encontros antes.${L.kissed?' Vocês já se beijaram em outro encontro.':''}${(L.mem||[]).length?` Lembranças de antes: ${L.mem.join(' / ')}.`:''}
O que você sabe sobre ${eu} (lê notícias e redes; use pouco): ${(()=>{try{return PUB.me().slice(0,700)}catch(e){return''}})()}
Local: ${D.nm}. ${D.txt} Horário: ${CLK.fmt()}. Clima do encontro: ${d.g} (de -15 a ${d.gmax}). ${d.turns>=12?'O encontro está perto do fim.':''}
Até agora:
${hist}
Agora: ${act}
Responda só com JSON: {"narr":"1 ou 2 frases de narração curta em 2ª pessoa (você...), com detalhes do lugar","fala":"o que ${L.nm} fala, 1 a 2 frases, português informal","pergunta":"uma pergunta pessoal que ${L.nm} faz a ${eu}, ou vazio","delta":0,"sug":["3 falas curtas e diferentes que ${eu} poderia dizer agora, incluindo responder a sua pergunta"]}
delta de -3 a 4: quanto a fala de ${eu} te agradou (grosseria, gabar-se demais ou ignorar sua pergunta: negativo; interesse genuíno, humor, responder o que você perguntou: positivo).`},
  async ai(kind,me,out,useDelta){const d=this.st(),L=LIFE.s.love;if(!d||!L)return;let v=null;
    if(AIX.fn){this.busy=true;this.render();v=await AIX.ask(this.prompt(kind,me,out));this.busy=false}
    const D2=this.st();if(!D2||D2!==d)return;
    if(v&&(v.fala||v.narr)){if(v.narr)d.log.push({f:'n',x:String(v.narr).slice(0,400)});if(v.fala)d.log.push({f:'her',x:String(v.fala).slice(0,300)});d.q=v.pergunta?String(v.pergunta).slice(0,200):'';if(d.q)d.log.push({f:'her',x:d.q,q:1});
      if(Array.isArray(v.sug))d.sug=v.sug.filter(x=>typeof x==='string').slice(0,3).map(x=>x.slice(0,90));if(useDelta)this.apply(clamp(Math.round(+v.delta||0),-3,4))}
    else{const[n,h]=this.fb(kind,out||'');if(n)d.log.push({f:'n',x:n});if(h)d.log.push({f:'her',x:h});if(kind!=='fim'&&Math.random()<.5){const q=pickA(['E você, sempre quis ser jogador?','Qual foi a maior mão que você já ganhou?','Você é de família grande?','O que você faz quando não tá jogando?','Já se apaixonou de verdade?']);d.q=q;d.log.push({f:'her',x:q,q:1})}
      d.sug=this.fsug();if(useDelta)this.apply(kind==='praise'?(d.praise<=2?2:-1):kind==='ask'||(me||'').includes('?')?2:1)}
    if(kind==='fim'){this.finish();return}
    if(d.g<=-10&&!d.over){d.log.push({f:'n',x:`${L.nm} olhou o celular, disse que precisava acordar cedo e pediu pra ir embora.`});this.finish(true);return}
    if(d.turns>=16&&!d.over){d.log.push({f:'n',x:'Ficou tarde. Hora de ir.'});this.finish();return}
    LIFE.commit();this.render()},
  end(){const d=this.st();if(!d||d.over||this.busy)return;d.log.push({f:'me',x:'*chama a conta e oferece carona*'});d.turns++;LIFE.commit();this.render();this.ai('fim')},
  finish(cut){const s=LIFE.s,L=s.love,d=this.st();if(!d||d.over)return;d.over=true;const D=LOVE.D[d.k];
    if(L){const g=Math.round(d.g);s.lastDate={d:CAL.today(),g};FAM.bond(L,g);L.dates=(L.dates||0)+1;LIFE.addMood(g>=8?(d.k==='motel'||d.k==='viagem'?2:1):g<0?-1:0);
      const mm=d.log.filter(x=>x.f==='me'&&x.k!=='hand'&&x.k!=='kiss'&&!/^\*/.test(x.x)).slice(0,2).map(x=>`ele contou/perguntou "${x.x.slice(0,60)}"`);
      L.mem=(L.mem||[]).concat([`${D.nm}${d.kiss?', rolou beijo':''}${d.hand?', de mãos dadas':''}${mm.length?', '+mm.join('; '):''}, clima ${g>=8?'ótimo':g>=0?'bom':'ruim'}`]).slice(-4);
      let r=`${D.emo} Fim do encontro: clima ${g>=12?'incrível':g>=6?'muito bom':g>=0?'ok':'ruim'}. Relação ${g>=0?'+':''}${g}.${d.kiss?' 💋 Rolou beijo.':''}`;
      if(L.dates===2)r+=` Agora você conhece ${L.nm} melhor: perfil ${LOVE.tnm(L)}.`;if(cut)r+=` ${L.nm} foi embora antes.`;
      if(g>=6)setTimeout(()=>{try{this.herText(pickA(['Cheguei em casa. Amei hoje 🥰','Ainda tô sorrindo aqui. Obrigada pela noite.'.replace('Obrigada',this.f(L)?'Obrigada':'Obrigado'),'Quando a gente repete?']));LIFE.commit()}catch(e){}},50);
      d.res=r;LIFE.note('❤️',`Encontro com ${L.nm}`,r)}
    CLK.to(d.k==='viagem'?26:d.h0+(this.HRS[d.k]||3));LIFE.commit();this.render()},
  close(){LIFE.s.dnow=null;LIFE.commit();this.render();if(location.hash==='#vida')try{renderLife()}catch(e){}},
  /* tela do encontro */
  render(){let ov=document.getElementById('dOv');const d=LIFE.s&&this.st();
    if(!d){if(ov)ov.remove();return}
    if(!ov){ov=document.createElement('div');ov.id='dOv';document.body.appendChild(ov)}
    const L=LIFE.s.love||{nm:d.nm,emo:'💞',b:0},D=LOVE.D[d.k],f=L.g==='f';
    if(this.min){ov.className='dpill';ov.innerHTML=`<button data-d="max">💞 Encontro com ${lx(L.nm)} · ${CLK.fmt()}</button>`;ov.querySelector('button').onclick=()=>{this.min=false;this.render()};return}
    ov.className='dov';const pct=Math.round(clamp((d.g+15)/(d.gmax+15),0,1)*100);
    const scene=d.turns<2?`<div class="dscene">${d.k==='casa'?'<span class="dh">🏠</span><span class="dcar dwalk">🚶</span>':`<span class="dcar">${(this.car()||{emo:'🚕'}).emo}</span><span class="dh">${d.k==='viagem'?'🏖️':'🏢'}</span>`}<span class="dsky">${D.emo}</span></div>`:'';
    const log=d.log.map(x=>x.f==='n'?`<div class="dn">${lx(x.x)}</div>`:x.f==='her'?`<div class="vm them${x.q?' dq':''}">${lx(x.x)}</div>`:`<div class="vm me">${lx(x.x)}</div>`).join('');
    const tr=this.treat(d.k),trc=Math.round(tr[1]*(1+LIFE.status()*.1)/10)*10;
    ov.innerHTML=`<div class="dbox"><div class="dhead"><span class="dav">${FACE.person(L,46,pct>=60?'feliz':pct<25?'triste':'neutro')}</span><div style="flex:1;min-width:0"><b>${D.emo} ${D.nm} com ${lx(L.nm)}</b><div class="muted" style="font-size:12px">${CLK.txt()} · clima ${d.g>=12?'🔥':d.g>=6?'😊':d.g>=0?'🙂':'😬'}</div><div class="dbar"><i style="width:${pct}%"></i></div></div>${d.over?'':'<button class="sm" data-d="min" title="Minimizar">—</button>'}</div>
      ${scene}<div class="dlog">${log}${this.busy?`<div class="vm them muted">${lx(L.nm)} está ${f?'pensando':'pensando'}…</div>`:''}</div>
      ${d.over?`<div class="vsum">${lx(d.res||'')}</div><button class="sm pri" data-d="close" style="width:100%">Fechar</button>`:`
      ${this.flash?`<div class="muted" style="font-size:12px">${lx(this.flash)}</div>`:''}
      <div class="dsug">${(d.sug||[]).map((x,i)=>`<button class="sm" data-ds="${i}">${lx(x)}</button>`).join('')}</div>
      <div style="display:flex;gap:6px"><input data-d="txt" maxlength="240" placeholder="${d.q?'Responda ou fale algo…':'Fale ou pergunte algo…'}" style="flex:1;min-width:0;padding:9px 10px;border-radius:9px;border:1px solid var(--line);background:rgba(0,0,0,.25);color:inherit;font:inherit"><button class="sm pri" data-d="send"${this.busy?' disabled':''}>Enviar</button></div>
      <div class="dacts">${d.hand?'':`<button class="sm" data-d="hand">🤝 Pegar na mão</button>`}<button class="sm" data-d="kiss">💋 Beijar</button><button class="sm" data-d="praise">🌹 Elogiar</button>${d.treat?'':`<button class="sm" data-d="treat">${tr[0]} · R$ ${brl(trc)}</button>`}<button class="sm" data-d="end">🏁 Encerrar</button></div>
      ${AIX.fn?'':'<p class="muted" style="font-size:11px;margin:4px 0 0">Respostas simples: a conversa com IA liga quando a permissão de IA do app estiver ativa.</p>'}`}</div>`;
    this.flash='';const lg=ov.querySelector('.dlog');if(lg)lg.scrollTop=1e6;const inp=ov.querySelector('[data-d="txt"]');
    const send=k=>{if(this.busy)return;const v=inp?inp.value:'';if((k==='say')&&!v.trim())return;this.act(k,v)};
    ov.querySelectorAll('[data-d]').forEach(b=>{const a=b.dataset.d;if(a==='txt'){b.onkeydown=e=>{if(e.key==='Enter')send(/\?\s*$/.test(b.value)?'ask':'say')};return}
      b.onclick=()=>{if(a==='min'){this.min=true;this.render();return}if(a==='close'){this.close();return}if(this.busy)return;
        if(a==='send')send(/\?\s*$/.test(inp.value)?'ask':'say');else if(a==='praise')this.act('praise',inp.value);else if(a==='end')this.end();else this.act(a)}});
    ov.querySelectorAll('[data-ds]').forEach(b=>b.onclick=()=>{if(this.busy)return;const x=(d.sug||[])[+b.dataset.ds];if(x)this.act(/\?\s*$/.test(x)?'ask':'say',x)})},
  /* conversa no celular */
  th(){const L=LIFE.s.love;if(!L)return[];L.th=L.th||[];return L.th},
  herText(x){const L=LIFE.s.love;if(!L)return;this.th().push({f:'them',x,t:Date.now()});if(L.th.length>40)L.th.splice(0,L.th.length-40);L.tu=(L.tu||0)+1},
  row(){const L=LIFE.s.love;if(!L)return'';const T=this.th(),last=T[T.length-1];return`<div class="panel" style="padding:8px 12px"><div class="vrow vct" data-open="♥" style="border:0"><span><span style="font-size:20px">${L.emo}</span> <b>${lx(L.nm)}</b> <span class="muted" style="font-size:12px">❤️ ${L.stage==='namoro'?'namoro':'crush'}</span>${last?`<div class="muted vlast">${last.f==='me'?'Você: ':''}${lx(last.x)}</div>`:'<div class="muted vlast">Mande uma mensagem ou chame pra sair</div>'}</span>${L.tu?`<span class="vbdg">${L.tu}</span>`:''}</div></div>`},
  thread(){const s=LIFE.s,L=s.love,T=this.th();L.tu=0;const A=this.allowed();
    return`<div class="panel"><div class="vhead"><button class="sm" data-r="cBack">‹</button><div class="vava fav">${FACE.person(L,42)}</div><div><b>${lx(L.nm)}</b><div class="muted" style="font-size:12px">${L.job} · relação ${Math.round(L.b)}/100 · ${CLK.txt()}</div></div></div>
      <div class="nsec" style="margin-top:6px">Chamar pra sair</div><div class="sxbtns">${Object.entries(LOVE.D).filter(([k])=>k!=='casa'||s.home!=='pais').map(([k,D])=>`<button class="sm" data-li="${k}">${D.emo} ${D.nm} · R$ ${brl(LOVE.cost(k))} · ${this.whenTxt(k)}</button>`).join('')}</div>
      <div class="vthread">${T.slice(-30).map(m=>`<div class="vm ${m.f}">${lx(m.x)}</div>`).join('')||'<div class="muted" style="font-size:13px;text-align:center">Nenhuma mensagem ainda. Puxe assunto ou chame pra sair.</div>'}${this.ltyp?'<div class="vm them muted">digitando…</div>':''}</div>
      ${L.req?`<div class="vsum">💸 Pediu R$ ${brl(L.req.v)} pra ${L.req.why}. <button class="sm pri" data-lp="pay">Mandar Pix</button> <button class="sm" data-lp="deny">Negar</button></div>`:''}
      <div style="display:flex;gap:6px;margin-top:8px"><input data-r="lTxt" placeholder="Mensagem para ${lx(L.nm)}" maxlength="240" style="flex:1;padding:8px 10px;border-radius:9px;border:1px solid var(--line);background:rgba(0,0,0,.25);color:inherit"><button class="sm pri" data-r="lSend">Enviar</button></div>
      <p class="muted" style="font-size:12px;margin:6px 0 0">Se ${this.ela(L)} topar e ainda der tempo hoje, o encontro começa na hora. Se não, vai pra Agenda.</p></div>`},
  bind(el,say){const L=LIFE.s.love;if(!L)return;const t=el.querySelector('.vthread');if(t)t.scrollTop=1e6;
    const inp=el.querySelector('[data-r="lTxt"]'),go=()=>{const v=(inp.value||'').trim();if(!v||this.ltyp)return;this.chat(v)};
    const sb=el.querySelector('[data-r="lSend"]');if(sb)sb.onclick=go;if(inp)inp.onkeydown=e=>{if(e.key==='Enter')go()};
    el.querySelectorAll('[data-li]').forEach(b=>b.onclick=()=>this.chat(this.inv(b.dataset.li),b.dataset.li));
    el.querySelectorAll('[data-lp]').forEach(b=>b.onclick=()=>say(b.dataset.lp==='pay'?LOVE.pay():LOVE.deny()))},
  inv(k){const D=LOVE.D[k];return`Bora ${({lanche:'comer um lanche',cinema:'pegar um cinema',casa:'jantar aqui em casa? Eu cozinho',jantar:'jantar fora',show:'num show',chique:'jantar num restaurante chique',motel:'ficar só nós dois',viagem:'passar o fim de semana na praia'})[k]||D.nm}${k==='casa'?'':' '+(this.whenTxt(k)==='amanhã'?'amanhã':'hoje')}?`},
  async chat(txt,inv){const s=LIFE.s,L=s.love;if(!L)return;this.th().push({f:'me',x:txt,t:Date.now()});LIFE.commit();this.ltyp=true;if(location.hash==='#vida')renderLife();
    const A=this.allowed(),eu=CIRC.me(),T=LOVE.tipo(L);let v=null,acc=null,msg='';
    /* convite por botão: o jogo decide */
    if(inv){if(!A.ok.includes(inv)){const r=(A.no.find(x=>x[0]===inv)||[])[1]||'';acc=false;msg=r}
      else if(T==='interesseira'&&Math.random()<.4&&!L.req){const vv=LOVE.reqV(.4);L.req={v:vv,why:'o Uber e o look do encontro',k:inv};acc=false;msg='pix'}
      else acc=Math.random()<clamp(.55+L.b/140+(LOVE.T[T].like[inv]||1)*.15-(L.b<15?.4:0),.15,.97)}
    if(AIX.fn){const hist=this.th().slice(-12).map(m=>`${m.f==='me'?eu:L.nm}: ${m.x}`).join('\n');
      const p=`Você está simulando uma conversa de WhatsApp num jogo brasileiro. Responda como ${L.nm} (${this.f(L)?'mulher':'homem'}), ${L.job}, que está ${L.stage==='namoro'?'namorando':'saindo/se conhecendo'} com ${eu} (relação ${Math.round(L.b)}/100, ${L.dates||0} encontros). Personalidade secreta: ${T}. ${(L.mem||[]).length?'Lembranças: '+L.mem.join(' / ')+'.':''}
Sobre ${eu} (jogador de poker; use pouco): ${(()=>{try{return PUB.me().slice(0,500)}catch(e){return''}})()}
Agora são ${CLK.fmt()} de ${CAL.fmt(CAL.today(),true)}.
${inv?`${eu} te chamou pra: ${LOVE.D[inv].nm} (${this.whenTxt(inv)}). DECISÃO JÁ TOMADA PELO JOGO: ${acc?'você ACEITA, animad'+(this.f(L)?'a':'o'):msg==='pix'?`você topa, mas pede R$ ${brl(L.req.v)} de Pix pro Uber e pro look antes`:`você RECUSA (${msg||'não está a fim hoje'})`}.`:`Se ${eu} te chamar pra sair nesta mensagem, você só pode aceitar estes programas: ${A.ok.map(k=>`${k} = ${LOVE.D[k].nm}`).join(', ')||'nenhum'}; recuse outros com a desculpa coerente.`}
Conversa:
${hist}
${SARC} Escreva 1 ou 2 mensagens curtas de WhatsApp, informais, coerentes com a personalidade. Responda só com JSON: {"msgs":["..."],"rel":0,"encontro":null} — rel de -3 a 3 (como a mensagem dele mexeu com você); "encontro": a chave do programa se você ACEITOU um convite nesta mensagem, senão null.`;
      v=await AIX.ask(p)}
    this.ltyp=false;const ms=v&&Array.isArray(v.msgs)?v.msgs.filter(x=>typeof x==='string'&&x.trim()).slice(0,2):[];
    if(ms.length)ms.forEach(x=>this.herText(x.slice(0,280)));
    else this.herText(inv?(acc?pickA(['Bora! Me pega aqui?','Topo! Tô me arrumando.','Simmm 😍']):msg==='pix'?`Topo, mas me manda R$ ${brl(L.req.v)} pro Uber e pro look? 😘`:`Ah, hoje não… ${msg||'tô cansada'}.`):pickA(['Haha, e aí?','😊','Tava pensando em você.','Me conta mais.']));
    L.tu=0;if(v&&v.rel)FAM.bond(L,clamp(Math.round(+v.rel||0),-3,3));
    if(!inv&&v&&v.encontro&&A.ok.includes(v.encontro))acc=true,inv=v.encontro;
    let m='';if(inv&&acc)m=this.go(inv,'chat');LIFE.commit();if(location.hash==='#vida'){LIFE.flash=m&&!this.st()?m:'';renderLife()}}};
setInterval(()=>{try{if(LIFE.s&&LIFE.s.dnow&&!document.getElementById('dOv'))DATE.render()}catch(e){}},1500);

