/* =============== v53: legado, lendas, amizades, datas, humor, mídia, investimentos =============== */
const SARC='Leia nas entrelinhas: o jogador pode ser sarcástico, irônico, debochado, fazer piada, duplo sentido ou falar sério com cara de brincadeira. Descubra o tom REAL (ex.: "parabéns pela sorte" depois de uma bad beat é alfinetada; "adorei perder pra você" é ironia; elogio exagerado pode ser deboche) e reaja como uma pessoa esperta reagiria: pode rir, devolver a ironia, se ofender ou entrar na brincadeira.';
const dayKey=d=>{const t=CAL.date(d);return`${t.getDate()}/${t.getMonth()+1}`};
const hashN=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)};

/* ----- datas comemorativas ----- */
const HOL={
  easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(y,mo-1,da,12)},
  nth(y,mo,wd,n){const x=new Date(y,mo,1,12);while(x.getDay()!==wd)x.setDate(x.getDate()+1);x.setDate(x.getDate()+7*(n-1));return x},
  of(d){if(!CAL.on()||!LIVES.s)return null;const t=CAL.date(d),y=t.getFullYear(),M=t.getMonth(),D=t.getDate(),same=x=>x.getMonth()===M&&x.getDate()===D;
    if(M===11&&(D===24||D===25))return{id:'natal',nm:'Natal',emo:'🎄',tip:'Presente pra família vale o dobro. Ceia em família deixa todo mundo feliz.'};
    if(M===11&&D===31)return{id:'reveillon',nm:'Réveillon',emo:'🎆',tip:'Sair com os amigos hoje rende o dobro de amizade.'};
    if(M===0&&D===1)return{id:'anonovo',nm:'Ano-novo',emo:'🥂',tip:'Ressaca coletiva: o circuito descansa.'};
    if(M===5&&D===12)return{id:'namorados',nm:'Dia dos Namorados',emo:'💘',tip:'Encontro hoje começa com clima melhor. Esquecer pega mal.'};
    const bf=this.nth(y,10,5,4),bfd=Math.round((t-bf)/864e5);if(bfd>=0&&bfd<=3)return{id:'bf',nm:'Black Friday',emo:'🛍️',tip:'Loja com 25% de desconto até domingo.'};
    if(same(this.nth(y,4,0,2)))return{id:'maes',nm:'Dia das Mães',emo:'💐',tip:'Presente pra mãe vale o dobro.'};
    if(same(this.nth(y,7,0,2)))return{id:'pais',nm:'Dia dos Pais',emo:'👔',tip:'Presente pro pai vale o dobro.'};
    const e=this.easter(y),cv=new Date(e);cv.setDate(e.getDate()-47);const cd=Math.round((t-cv)/864e5);if(cd>=-3&&cd<=0)return{id:'carnaval',nm:'Carnaval',emo:'🎭',tip:'Sair com os amigos hoje rende o dobro de amizade.'};
    return null},
  tag(d){const h=this.of(d);return h?` · <span class="gold">${h.emo} ${h.nm}</span>`:''},
  disc(){const h=this.of(CAL.today());return h&&h.id==='bf'?.75:1},
  famDay(p){const h=this.of(CAL.today());return!!h&&(h.id==='natal'||(h.id==='maes'&&p.id==='mae')||(h.id==='pais'&&p.id==='pai'))},
  party(){const h=this.of(CAL.today());return!!h&&['reveillon','carnaval'].includes(h.id)}};
const IP=I=>Math.round(I.price*HOL.disc());

/* ----- amizade: níveis, vantagens, convites, aniversários ----- */
const FR={
  LV:[[4.5,'Irmão','🫂'],[3.5,'Parceiro','🤜🤛'],[2,'Amigo','🤝'],[1,'Chegado','🙂']],
  lv(n){const r=LIFE.rel(n);const i=this.LV.findIndex(x=>r>=x[0]);return i<0?0:4-i},
  name(n){const r=LIFE.rel(n),x=this.LV.find(x=>r>=x[0]);return x?x[2]+' '+x[1]:''},
  perks(n){const l=this.lv(n);return[[2,'🤝 Amigo','Te manda dicas sobre o estado dos outros jogadores.'],[3,'🤜🤛 Parceiro','Troca 5% de action com você: se os dois jogarem o mesmo torneio, cada um leva 5% do prêmio do outro.'],[4,'🫂 Irmão','Te indica pras marcas: mais propostas de patrocínio.']].map(([k,t,d])=>`<div style="font-size:13px;padding:2px 0">${l>=k?'✅':'🔒'} <b>${t}</b>: ${d}</div>`).join('')},
  bd(n){const h=hashN(n+'bday'),m=h%12,d=1+((h>>4)%28);return{m,d,txt:`${String(d).padStart(2,'0')}/${String(m+1).padStart(2,'0')}`}},
  isBd(n,d){const t=CAL.date(d),b=this.bd(n);return t.getMonth()===b.m&&t.getDate()===b.d},
  seen(n){const s=LIFE.s;s.seen=s.seen||{};s.seen[n]=CAL.today()},
  daily(d){const s=LIFE.s;if(!s||!LIVES.s)return;s.seen=s.seen||{};const bots=Object.keys(LIVES.s.bots).filter(n=>LIVES.bio(n));
    /* aniversários */
    s.bds={d,l:bots.filter(n=>this.isBd(n,d)&&LIFE.rel(n)>=1),done:[]};s.bds.l.forEach(n=>LIFE.note('🎂',`Hoje é aniversário de ${n}`,`${FR.name(n)||'Conhecido'}. Mande parabéns pelo Celular${LIFE.rel(n)>=2?': amigo que esquece aniversário perde ponto':''}.`));
    /* convite dos amigos */
    s.finv=null;const cand=bots.filter(n=>LIFE.rel(n)>=1.5&&LIVES.s.bots[n].bank>300).sort(()=>Math.random()-.5);
    if(cand.length&&Math.random()<.35){const n=cand[0],k=OUTX.top(n),A=OUTA[k];s.finv={n,k,d};LIFE.text(n,pickA([`Bora ${A.nm.toLowerCase()} hoje? Cada um paga o seu 🍻`,`Tô a fim de ${A.nm.toLowerCase()} hoje. Cola?`,`E aí, sumido! ${A.nm} hoje, topa?`]),{k:'inv'})}
    /* dicas de amigo */
    bots.filter(n=>this.lv(n)>=2).forEach(n=>{if(Math.random()>=.12)return;const o=bots.filter(m=>m!==n&&LIVES.state(m)&&LIVES.state(m).tags.length);if(!o.length)return;const m=pickA(o),tg=LIVES.state(m).tags[0];
      LIFE.text(n,pickA([`Dica: ${m} tá ${tg[0]==='tilt'?'tiltado, joga solto':tg[0]==='press'?'apertado de grana, vai arriscar':tg[0]==='cans'?'morto de cansado':'numa fase estranha'}. Se pegar ele na mesa, aproveita.`,`Fica ligado no ${m}: ${tg[2].toLowerCase()}`]))});
    /* irmão indica marca */
    if(bots.some(n=>this.lv(n)>=4)&&Math.random()<.1){try{const b=s.offers.length;LIFE.genOffer();if(s.offers.length>b){const n=pickA(bots.filter(n=>this.lv(n)>=4));LIFE.text(n,'Falei bem de você pro pessoal de uma marca. Olha a aba Marcas 😉')}}catch(e){}}
    /* sumiço esfria amizade */
    bots.forEach(n=>{const r=LIFE.rel(n),last=s.seen[n];if(r>=2&&last!=null&&d-last>12)LIVES.relAdd(n,'Você',-.12);if(last==null)s.seen[n]=d})},
  endDay(d){const s=LIFE.s;if(!s)return;
    if(s.bds&&s.bds.d===d)s.bds.l.filter(n=>!s.bds.done.includes(n)&&LIFE.rel(n)>=2).forEach(n=>{LIVES.relAdd(n,'Você',-.3);LIVES.note(n,`${CIRC.me()} esqueceu o aniversário dele.`);LIFE.note('😕',`${n} reparou que você esqueceu o aniversário`,'Amizade −0,3.')});
    if(s.finv&&s.finv.d===d&&!s.finv.ans){const n=s.finv.n;LIVES.relAdd(n,'Você',-.3);LIFE.note('📵',`Você deixou ${n} no vácuo`,'Ele te chamou pra sair e você nem respondeu. Amizade −0,3.')}},
  bdSend(n){const s=LIFE.s;if(!s.bds||!s.bds.l.includes(n)||s.bds.done.includes(n))return'';s.bds.done.push(n);LIFE.mine(n,pickA(['Feliz aniversário!! Muita saúde e muito river a favor 🎂','Parabéns, parceiro! Que venha um ano de mesa final 🏆','Feliz aniversário! Hoje a primeira rodada é por minha conta 🍻']));
    LIVES.relAdd(n,'Você',LIFE.rel(n)>=2?.8:.4);this.seen(n);LIFE.text(n,pickA(['Valeu demais! 🙏','Que moral, obrigado!','Lembrou! Valeu, irmão 😄']));LIVES.commit();LIFE.commit();return'🎂 Parabéns enviado.'},
  answer(yes){const s=LIFE.s,v=s.finv;if(!v||v.ans)return'';v.ans=yes?'y':'n';const n=v.n;
    if(!yes){LIFE.mine(n,'Hoje não vai dar, foi mal!');LIVES.relAdd(n,'Você',-.1);LIFE.commit();return'Você recusou.'}
    const old=OUTX.mode;OUTX.mode='racha';const m=OUTX.go(n,v.k);OUTX.mode=old;if(/^Vocês já|duas vezes|Não dá|sem energia|Saldo/.test(m)){v.ans=null;return m}LIFE.mine(n,'Bora!');LIVES.relAdd(n,'Você',.2);LIFE.commit();return m},
  /* troca de action com parceiros */
  tour:{},swap(o){const s=LIFE.s;let txt=[];Object.entries(this.tour).forEach(([n,r])=>{if(this.lv(n)<3)return;const his=r.prize||0,mine=o.prize||0,v=Math.round(his*.05)-Math.round(mine*.05);if(!his&&!mine)return;
      if(v)WALLET.add(v,`Troca de 5% com ${n}`);LIVES.s.bots[n].bank-=v;txt.push(`${n} ${v>=0?`te passou R$ ${brl(v)}`:`recebeu R$ ${brl(-v)}`}`)});
    if(txt.length)LIFE.note('🤜🤛','Troca de action com os parceiros',txt.join(' · ')+'.');this.tour={}}};

/* ----- humor com causas ----- */
const MOODL={
  list(){const s=LIFE.s,t=CAL.today(),L=[],add=(e,x,v)=>L.push([e,x,v]);if(!s)return L;
    if(s.energy<30)add('😴','Cansado',-1);else if(s.energy>=80)add('⚡','Descansado',1);
    if(s.lateDay===t)add('🥱','Dormiu tarde',-1);
    if(s.lastRes&&t-s.lastRes.day<=1){const r=s.lastRes;if(r.place===1)add('🏆',`Campeão do ${r.nm}`,2);else if(r.itm)add('💰',`Premiou no ${r.nm}`,1);else add('💔',`Caiu do ${r.nm}`,-1)}
    if(WALLET.s.bal<0)add('💸','No vermelho',-1);
    if(s.lastDate&&t-s.lastDate.d<=1)add(s.lastDate.g>=6?'❤️':'💔',s.lastDate.g>=6?'Encontro ótimo':'Encontro ruim',s.lastDate.g>=6?1:-1);
    if(Object.keys(s.did||{}).some(k=>k.startsWith('out:')&&s.did[k]===t))add('🍻','Saiu com amigos',1);
    if(LIFE.has('cao')||LIFE.has('gato'))add('🐾','Pet te esperando em casa',1);
    if(LIFE.homeObj().comfort>=3)add('🏠','Casa confortável',1);
    if(LIFE.ifx('mood')>=.2)add('🎮','Hobbies em dia',1);
    const riv=Object.keys(LIVES.s.bots).filter(n=>LIFE.rel(n)<=-2).length;if(riv>=3)add('⚔️',`${riv} rivais no circuito`,-1);
    const fam=(s.fam||[]);if(fam.length&&fam.reduce((a,p)=>a+p.b,0)/fam.length<40)add('👪','Família distante',-1);
    if((s.loans||[]).some(l=>!l.paid&&l.due<t))add('🧾','Alguém te devendo e sumiu',-1);
    if(s.tauntDay===t)add('😤','Provocado na mesa',-1);
    if(LIFE.sps().some(c=>c.warn))add('⚠️','Advertência de patrocinador',-1);
    const h=HOL.of(t);if(h)add(h.emo,h.nm,1);return L},
  panel(){const s=LIFE.s,L=this.list(),m=s.mood;
    return`<div class="panel"><h3>${m>=2?'😁':m>=1?'🙂':m<=-2?'😞':m<=-1?'😕':'😐'} Seu humor: ${m>=2?'ótimo':m>=1?'bom':m<=-2?'péssimo':m<=-1?'pra baixo':'normal'}</h3>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${L.map(([e,x,v])=>`<span class="mdl ${v>0?'up':'dn'}">${e} ${x}</span>`).join('')||'<span class="muted">Nada fora do normal.</span>'}</div>
      <p class="muted" style="font-size:12px;margin:8px 0 0">${m>=2?'Humor ótimo: +1 cartão de tempo nas mesas e encontros começam melhores.':m<=-2?'Humor péssimo: −1 cartão de tempo nas mesas.':'Humor bom deixa os encontros melhores; ótimo dá +1 cartão de tempo, péssimo tira 1.'} A energia também conta: descansado +1, cansado −1.</p></div>`}};

/* ----- lendas do circuito ----- */
const LEGS=[
  {id:'barao',nm:'O Barão',emo:'🎩',st:'rock',buy:20000,fame:35,desc:'Joga desde os anos 80 no Clube do Comércio. Paciente como pedra: só entra com mão boa. Roube os blinds dele.'},
  {id:'neon',nm:'Kid Neon',emo:'🕶️',st:'lag',buy:50000,fame:45,desc:'Streamer de 23 anos que ficou rico no online. Aumenta tudo e não respeita ninguém. Pague mais leve.'},
  {id:'celeste',nm:'Dona Celeste',emo:'👵',st:'station',buy:120000,fame:55,desc:'Ex-crupiê de cassino no Uruguai. Paga até o fim pra ver suas cartas. Nunca blefe contra ela.'},
  {id:'prof',nm:'O Professor',emo:'🧮',st:'tag',buy:300000,fame:65,desc:'Matemático que joga com solver na cabeça. Zero tilt, faixas perfeitas.'},
  {id:'rei',nm:'O Rei do Feltro',emo:'👑',st:'tag',buy:1000000,fame:75,desc:'A lenda viva do poker brasileiro. Heads-up de R$ 1 milhão cada lado. Quem vence vira o novo rei.'}];
const LEG={
  st(){const s=LIFE.s;s.leg=s.leg||{};return s.leg},
  open(i){const L=LEGS[i],S=this.st();if(i>0&&!(S[LEGS[i-1].id]||{}).w)return false;return LIFE.s.fame>=L.fame},
  play(id){const i=LEGS.findIndex(x=>x.id===id),L=LEGS[i],S=this.st(),r=S[id]||{},t=CAL.today();if(!L)return'';
    if(!this.open(i))return i>0&&!(S[LEGS[i-1].id]||{}).w?`Vença ${LEGS[i-1].nm} primeiro.`:`Precisa de fama ${L.fame}.`;
    if(r.last!=null&&t-r.last<3)return`${L.nm} só aceita revanche daqui a ${3-(t-r.last)} dia(s).`;
    if(TOUR.g&&!TOUR.g.finished&&!(TOUR.g.players[0]&&TOUR.g.players[0].out))return'Termine o torneio em andamento primeiro.';
    const tc=CLK.can(3,'um heads-up');if(tc)return tc;if(!WALLET.can(L.buy))return`Precisa de R$ ${brl(L.buy)} pra sentar.`;
    S[id]=Object.assign(r,{last:t});WALLET.add(-L.buy,`Heads-up contra ${L.nm}`);try{if(SAVES.data.tour&&!(TOUR.g&&TOUR.g.finished))SAVES.del('tour')}catch(e){}
    const x=STRUCTS.ps,st=STY[L.st]?L.st:'tag';TOUR.stop();TOUR.lastMsg='';try{LIFE.onStart('tour',false)}catch(e){}TOUR.paidNow=L.buy;
    TOUR.startGame({stack:x.stack,hpl:10,sb:x.levels[0][0],bb:x.levels[0][1],levels:x.levels,anteType:x.anteType,structNm:x.nm,ev:{key:`leg@${id}@${t}`,nm:`Heads-up: ${L.nm}`,idx:0,stops:[],days:1,sat:0,buy:L.buy,leg:id},bots:1,names:[L.nm],styles:{[L.nm]:st}});
    TOUR.log(`<div class="lh lvl">${L.emo} Heads-up contra ${L.nm} · R$ ${brl(L.buy)} cada lado. Quem ficar com todas as fichas leva R$ ${brl(L.buy*2)}.</div>`);location.hash='#torneio';LIFE.commit();return''},
  done(id,res){const L=LEGS.find(x=>x.id===id),S=this.st(),r=S[id]=S[id]||{};if(!L)return;const me=CIRC.me();
    if(res.place===1){r.w=(r.w||0)+1;LIFE.addFame(3);TROPH.add({k:'lenda',nm:`Heads-up contra ${L.nm}`,emo:L.emo,prize:L.buy*2});
      CIRC.post({k:'vida',title:`${me} derruba ${L.nm} no heads-up`,body:`Levou R$ ${brl(L.buy*2)} e ${id==='rei'?'agora é o novo Rei do Feltro':'segue na trilha das lendas'}.`});LIFE.note(L.emo,`Você venceu ${L.nm}!`,id==='rei'?'Você é o novo Rei do Feltro. A coroa é sua.':`Próxima lenda liberada${LEGS[LEGS.indexOf(L)+1]?': '+LEGS[LEGS.indexOf(L)+1].nm:''}.`)}
    else{r.l=(r.l||0)+1;LIFE.note(L.emo,`${L.nm} venceu o heads-up`,'Revanche liberada em 3 dias.')}LIFE.commit()},
  panel(){const S=this.st();return`<div class="panel"><h3>⚔️ Lendas do circuito</h3><p class="muted" style="margin-top:0;font-size:13px">Cinco lendas, um heads-up cada. Vença uma pra liberar a próxima. Cada uma joga de um jeito: leia a dica.</p>
    ${LEGS.map((L,i)=>{const r=S[L.id]||{},op=this.open(i),lock=i>0&&!(S[LEGS[i-1].id]||{}).w;return`<div class="vrow" style="display:block;padding:8px 0;${!op?'opacity:.55':''}"><b>${L.emo} ${L.nm}</b>${r.w?' <span class="vtag">👑 vencida</span>':''}<div style="font-size:13px" class="muted">${L.desc}</div>
      <div style="font-size:13px;margin:4px 0">R$ ${brl(L.buy)} cada lado · prêmio R$ ${brl(L.buy*2)}${r.w||r.l?` · ${r.w||0}V ${r.l||0}D`:''}</div>
      ${lock?`<span class="muted" style="font-size:12px">🔒 Vença ${LEGS[i-1].nm} primeiro</span>`:LIFE.s.fame<L.fame?`<span class="muted" style="font-size:12px">🔒 Fama ${L.fame} (você tem ${Math.round(LIFE.s.fame)})</span>`:`<button class="sm pri" data-leg="${L.id}">Desafiar</button>`}</div>`}).join('')}</div>`}};

/* ----- troféus, hall da fama e selos ----- */
const TROPH={
  st(){const s=LIFE.s;s.troph=s.troph||[];return s.troph},
  add(o){this.st().unshift(Object.assign({d:CAL.on()?CAL.today():LIVES.s.day},o));LIFE.commit()},
  backfill(){const s=LIFE.s;if(!s||s.trophBF||!LIVES.ready)return;s.trophBF=1;const A=CAL.st();
    Object.entries(A.done||{}).forEach(([k,r])=>{if(r&&r.place===1&&!/^leg@/.test(k)){const ev=CAL.byKey(k);this.st().push({k:'titulo',nm:ev?ev.E.nm:k.split('@')[0],emo:ev?ev.E.emo:'🏆',prize:r.prize,d:+k.split('@')[1]||0})}});
    try{if(s.retro&&s.retro.mode==='elite'){const R=RETRO.run('elite');s.champN=R.champ||0;for(let i=0;i<(R.champ||0);i++)this.st().push({k:'mundial',nm:'Main Event do Mundial (bracelete)',emo:'🥇',d:0});if(R.ft)this.st().push({k:'ft',nm:`${R.ft} mesa(s) final(is) no Mundial`,emo:'🎖️',d:0})}}catch(e){}
    this.st().sort((a,b)=>b.d-a.d);LIFE.commit()},
  counts(){const T=this.st();return{tit:T.filter(x=>x.k==='titulo').length+((LIFE.s.fp&&LIFE.s.fp.W)>T.filter(x=>x.k==='titulo').length?(LIFE.s.fp.W-T.filter(x=>x.k==='titulo').length):0),main:T.filter(x=>x.k==='titulo'&&/Main|Circuito Nacional/.test(x.nm)).length,mund:T.filter(x=>x.k==='mundial').length,leg:T.filter(x=>x.k==='lenda').length}},
  hof(){const s=LIFE.s,c=this.counts();let top=false;try{const r=PUB.rankOf('Você');top=!!(r&&r.pos===1)}catch(e){}
    return[['10 títulos',c.tit>=10,`${c.tit}/10`],['Campeão de um Main Event ou do Mundial',c.main+c.mund>=1,c.main+c.mund?'✓':'0'],['1º no ranking da temporada',top||!!s.wasTop,top||s.wasTop?'✓':'—'],['Fama 80',s.fame>=80,Math.round(s.fame)+'/80'],['Vencer 3 lendas',c.leg>=3,`${new Set(this.st().filter(x=>x.k==='lenda').map(x=>x.nm)).size}/3`]]},
  checkHof(){const s=LIFE.s;if(!s||s.hof)return;try{const r=PUB.rankOf('Você');if(r&&r.pos===1)s.wasTop=1}catch(e){}if(this.hof().every(x=>x[1])){s.hof=CAL.today();LIFE.addFame(5);CIRC.post({k:'vida',title:`${CIRC.me()} entra para o Hall da Fama do poker brasileiro`,body:'Títulos, coroa das lendas e o topo do ranking. Uma carreira para os livros.'});LIFE.note('🏛️','Você entrou para o Hall da Fama!','Seu nome está na parede, ao lado das lendas.');LIFE.commit()}},
  RIB:[['🦈','Tubarão','10 títulos',()=>TROPH.counts().tit>=10],['🥇','Campeão Mundial','Venceu o Main Event do Mundial',()=>TROPH.counts().mund>=1],['👑','Rei do Feltro','Venceu O Rei do Feltro',()=>!!(LEG.st().rei||{}).w],
    ['💰','Magnata','Patrimônio de R$ 50 milhões',()=>WALLET.s.bal>=5e7],['🌟','Celebridade','100 mil seguidores',()=>LIFE.s.fans>=1e5],['👪','Família unida','Laço médio de 80 com a família',()=>{const f=LIFE.s.fam||[];return f.length&&f.reduce((a,p)=>a+p.b,0)/f.length>=80}],
    ['💘','Romântico','10 encontros com o mesmo par',()=>!!(LIFE.s.love&&(LIFE.s.love.dates||0)>=10)],['🤝','Bom de grupo','5 amigos no circuito',()=>Object.keys(LIVES.s.bots).filter(n=>LIFE.rel(n)>=2).length>=5],['⚔️','Encrenqueiro','4 rivais declarados',()=>Object.keys(LIVES.s.bots).filter(n=>LIFE.rel(n)<=-2).length>=4],
    ['🎁','Generoso','15 presentes ou empréstimos',()=>(LIFE.s.giftN||0)+(LIFE.s.loans||[]).length>=15],['📉','Quebrou e voltou','Ficou no vermelho e hoje tem R$ 100 mil',()=>!!LIFE.s.wasNeg&&WALLET.s.bal>=1e5],['🏷️','Garoto-propaganda','3 patrocinadores ao mesmo tempo',()=>LIFE.sps().length>=3],
    ['🔴','Streamer','20 lives',()=>(LIFE.s.liveN||0)>=20],['🎙️','Boca de ouro','10 coletivas ou entrevistas',()=>(LIFE.s.pressN||0)>=10],['🏛️','Imortal','Entrou no Hall da Fama',()=>!!LIFE.s.hof]],
  panel(){const s=LIFE.s,T=this.st(),c=this.counts(),H=this.hof();
    return`<div class="panel"><h3>🏆 Estante de troféus</h3><div style="font-size:14px;margin-bottom:6px">${c.tit} títulos · ${c.mund} bracelete${c.mund===1?'':'s'} do Mundial · ${c.leg} lenda${c.leg===1?'':'s'} vencida${c.leg===1?'':'s'}</div>
      <div class="tshelf">${T.slice(0,30).map(x=>`<div class="tcup" title="${lx(x.nm)}"><div class="te">${x.emo||'🏆'}</div><div class="tn">${lx(x.nm)}</div><div class="muted" style="font-size:11px">${x.d?'dia '+x.d:'antes'}${x.prize?' · R$ '+brl(x.prize):''}</div></div>`).join('')||'<p class="muted">Nenhum troféu ainda. O primeiro título vai aqui.</p>'}</div></div>
    <div class="panel"><h3>🏛️ Hall da Fama ${s.hof?'<span class="vtag">✨ membro desde o dia '+s.hof+'</span>':''}</h3>${H.map(([t,ok,v])=>`<div class="vrow" style="font-size:14px"><span>${ok?'✅':'⬜'} ${t}</span><b>${v}</b></div>`).join('')}<p class="muted" style="font-size:12px;margin:6px 0 0">Cumpra tudo pra entrar. A entrada vira notícia e dá +5 de fama.</p></div>
    <div class="panel"><h3>🎗️ Selos da carreira</h3><div class="ribs">${this.RIB.map(([e,n,d,f])=>{let ok=false;try{ok=f()}catch(x){}return`<div class="rib ${ok?'on':''}"><div style="font-size:24px">${e}</div><b>${n}</b><div class="muted" style="font-size:11px">${d}</div></div>`}).join('')}</div><p class="muted" style="font-size:12px;margin:6px 0 0">No fim de cada temporada do ranking chega o resumo com os selos conquistados.</p></div>`}};

/* ----- coletivas de imprensa (Main Event e etapas) ----- */
const PRESS={busy:false,
  need(key){const id=key.split('@')[0];return['main','etapa'].includes(id)},
  qs(kind,ctx){const R=Object.keys(LIVES.s.bots).filter(n=>LIFE.rel(n)<=-1),tg=R.length?pickA(R):pickA(Object.keys(LIVES.s.bots)),me=CIRC.me();
    return kind==='pre'?[{q:`${me}, você chega ao ${ctx.nm} como um dos favoritos. Sente a pressão?`,a:{h:'Pressão tem, mas cada mão é uma mão. Vim pra aprender também.',c:'Pressão é privilégio. Vim pra ganhar.',p:'Pressão quem sente é quem vai ter que sentar na minha mesa.'}},
      {q:`${tg} disse que você anda com sorte demais. Responde?`,tg,a:{h:`Respeito o ${tg}. Sorte todo mundo precisa um pouco.`,c:'Sorte não ganha título atrás de título.',p:`Quando ${tg} ganhar alguma coisa, eu respondo.`}},
      {q:'Qual sua estratégia pro Dia 1?',a:{h:'Paciência e sobreviver. O torneio é longo.',c:'Acumular cedo e pressionar a bolha.',p:'Vou atropelar quem estiver tremendo.'}}]
    :[{q:`${ctx.place===1?'Campeão!':`${ctx.place}º lugar.`} O que passa na cabeça agora?`,a:{h:ctx.place===1?'Gratidão. A mesa estava muito forte.':'Faz parte. Joguei meu melhor.',c:ctx.place===1?'Era o que eu tinha vindo buscar.':'Bati na trave, mas o nível tá aí.',p:ctx.place===1?'Avisei que ia ganhar. Ninguém acreditou.':'Perdi pra sorte, não pra jogador.'}},
      {q:'Qual foi a mão decisiva?',a:{h:'Um call difícil no river que deu certo.',c:'Li o blefe dele de longe.',p:'A mão em que meu adversário percebeu que não tinha chance.'}},
      {q:'Recado pros rivais?',tg,a:{h:'Nos vemos na próxima, todo mundo joga muito.',c:'Me encontrem na mesa final.',p:`${tg}, guarda o lenço pra próxima.`}}]},
  open(kind,key,ctx){const s=LIFE.s;s.press={kind,key,ctx,qs:this.qs(kind,ctx),k:0,ans:[]};LIFE.commit();this.render()},
  async answer(tone,txt){const s=LIFE.s,P=s.press;if(!P||this.busy)return;const Q=P.qs[P.k];let quote=Q.a[tone]||'',fol='';
    if(txt){this.busy=true;this.render();const v=AIX.fn?await AIX.ask(`${SARC}\nContexto público do jogador: ${(()=>{try{return PUB.me().slice(0,600)}catch(e){return''}})()}\nColetiva de imprensa ${P.kind==='pre'?'antes':'depois'} do ${P.ctx.nm}. Pergunta: "${Q.q}". ${CIRC.me()} respondeu: "${txt.replace(/"/g,"'")}".\nClassifique o tom REAL: "h" humilde, "c" confiante, "p" provocador (deboche, ironia ácida e alfinetada contam como provocador; auto-ironia leve pode ser humilde ou confiante). Diga se foi sarcástico. Reescreva como citação curta de jornal (até 25 palavras) mantendo a voz e a ironia dele. Escreva também uma reação curta da sala de imprensa.\nResponda só com JSON: {"tom":"h","sarcasmo":false,"citacao":"...","reacao":"..."}`):null;this.busy=false;
      tone=v&&['h','c','p'].includes(v.tom)?v.tom:/(sorte|lixo|fraco|pato|chorar|lenço|aposent)/i.test(txt)?'p':/(vou|vim|ganhar|campe)/i.test(txt)?'c':'h';quote=(v&&v.citacao?String(v.citacao):txt).slice(0,220);fol=v&&v.reacao?String(v.reacao).slice(0,160):'';if(v&&v.sarcasmo){s.fans+=Math.round(80+s.fame*6);fol=(fol?fol+' ':'')+'(o sarcasmo viralizou)'}}
    P.ans.push({q:Q.q,tone,x:quote,fol});LIFE.addFame({h:.3,c:.6,p:1.1}[tone]);LIFE.addMood({h:.2,c:.4,p:.3}[tone]);if(tone==='p')s.fans+=Math.round(50+s.fame*6);
    if(Q.tg&&LIVES.s.bots[Q.tg]){if(tone==='p'){LIVES.relAdd(Q.tg,'Você',-1.5);LIVES.s.bots[Q.tg].tilt=Math.min(3,LIVES.s.bots[Q.tg].tilt+1);LIVES.note(Q.tg,`Leu a coletiva de ${CIRC.me()} e ficou irritado.`)}else if(tone==='h')LIVES.relAdd(Q.tg,'Você',.6)}
    if(tone==='p')LIFE.sps().forEach(c=>{if(c.clean){LIFE.s.strikes++;LIFE.note(c.emo,`${c.nm} não gostou da provocação`,`Cláusula de imagem: ${LIFE.s.strikes} de 2 avisos.`)}});
    P.k++;if(P.k>=P.qs.length){s.pressN=(s.pressN||0)+1;const best=P.ans.find(a=>a.tone==='p')||P.ans[0];s.heads=s.heads||[];s.heads.unshift({day:CAL.today(),j:'Coletiva',title:`"${best.x}", diz ${CIRC.me()}`});if(s.heads.length>20)s.heads.length=20;
      CIRC.post({k:'vida',title:`Coletiva: "${best.x}"`,body:`${CIRC.me()} ${P.kind==='pre'?'antes':'depois'} do ${P.ctx.nm}.`});P.over=true}
    LIVES.commit();LIFE.commit();this.render()},
  close(){const s=LIFE.s,P=s.press;s.press=null;LIFE.commit();this.render();if(P&&P.kind==='pre'&&P.over){const m=CAL.play(P.key);if(m){LIFE.flash=m;try{renderLife()}catch(e){}}}else if(location.hash==='#vida')try{renderLife()}catch(e){}},
  skip(){const s=LIFE.s,P=s.press;if(!P)return;LIFE.addFame(-.3);LIFE.note('🎤','Você faltou à coletiva','Os jornalistas não gostaram. −0,3 de fama.');P.over=true;P.k=P.qs.length;this.close()},
  render(){let ov=document.getElementById('prOv');const P=LIFE.s&&LIFE.s.press;if(!P||location.hash==='#torneio'&&P.kind==='post'){if(ov)ov.remove();return}
    if(!ov){ov=document.createElement('div');ov.id='prOv';document.body.appendChild(ov)}ov.className='dov';const Q=P.qs[Math.min(P.k,P.qs.length-1)];
    ov.innerHTML=`<div class="dbox bpbox"><div class="dhead"><span style="font-size:34px">🎤</span><div style="flex:1"><b>Coletiva de imprensa</b><div class="muted" style="font-size:13px">${P.kind==='pre'?'Antes':'Depois'} do ${lx(P.ctx.nm)}${P.over?'':` · pergunta ${P.k+1} de ${P.qs.length}`}</div></div></div>
      <div class="bpscroll">${P.ans.map(a=>`<div class="dn">❓ ${lx(a.q)}</div><div class="vm me">${lx(a.x)}</div>${a.fol?`<div class="dn">📸 ${lx(a.fol)}</div>`:''}`).join('')}
      ${P.over?`<div class="vsum">📰 A coletiva saiu nos jornais. ${P.ans.some(a=>a.tone==='p')?'A provocação deu o que falar.':'Imagem de profissional.'}</div>`:`<h3 style="margin:10px 0 8px">"${lx(Q.q)}"</h3>${[['h','🙏 Humilde'],['c','💪 Confiante'],['p','🔥 Provocador']].map(([k,t])=>`<button class="vans" data-pr="${k}"${this.busy?' disabled':''}><b>${t}</b><br>${lx(Q.a[k])}</button>`).join('')}
      <div style="margin-top:8px;display:flex;gap:6px"><input data-pr="txt" maxlength="220" placeholder="Ou responda do seu jeito (ironia vale)" style="flex:1;min-width:0;padding:8px 10px;border-radius:9px;border:1px solid var(--line);background:rgba(0,0,0,.25);color:inherit"><button class="sm pri" data-pr="send"${this.busy?' disabled':''}>${this.busy?'…':'Responder'}</button></div>`}</div>
      <div class="dacts" style="margin-top:8px">${P.over?`<button class="sm pri" data-pr="close" style="flex:1">${P.kind==='pre'?'Ir pra mesa':'Fechar'}</button>`:'<button class="sm" data-pr="skip">Sair da coletiva</button>'}</div></div>`;
    ov.querySelectorAll('[data-pr]').forEach(b=>{const a=b.dataset.pr;if(a==='txt')return;b.onclick=()=>{if(a==='close')this.close();else if(a==='skip')this.skip();else if(a==='send'){const v=ov.querySelector('[data-pr="txt"]').value.trim();if(v)this.answer('h',v)}else this.answer(a)}})}};

/* ----- feed das redes ----- */
const FEED={
  st(){const s=LIFE.s;s.feed=s.feed||[];return s.feed},
  push(who,emo,txt,tag){this.st().unshift({d:CAL.today(),who,emo,txt,tag});if(this.st().length>40)this.st().length=40},
  daily(d){const s=LIFE.s;if(!s||!LIVES.s)return;const me=CIRC.me(),bots=Object.keys(LIVES.s.bots).filter(n=>LIVES.bio(n)),r=s.lastRes,fr=bots.filter(n=>LIFE.rel(n)>=1),rv=bots.filter(n=>LIFE.rel(n)<=-1),J=['Lorena (Feltro)','@pokerbrasil','Rádio All-in'];
    if(r&&d-r.day<=1){if(r.place===1){this.push(pickA(J),'📰',`${me} crava o ${r.nm}. Já é o nome da temporada?`,'#'+me.split(' ')[0]+'Campeão');if(rv.length)this.push(pickA(rv),'😒',pickA(['Sorte grande dura pouco. Quero ver repetir.','Ganhou de mesa fraca. Próxima.']));if(fr.length)this.push(pickA(fr),'🔥',pickA(['MONSTRO! 🏆','Eu avisei que ele ia ganhar!']))}
      else if(r.itm)this.push(pickA(J),'📰',`${me} premia no ${r.nm} (${r.place}º).`);else if(Math.random()<.5&&rv.length)this.push(pickA(rv),'😏',`Vi que ${me} caiu cedo no ${r.nm}. Acontece com os melhores… e com ele também.`)}
    const L=(LIVES.s.news||[]).slice(0,2);L.forEach(x=>{if(x.title&&Math.random()<.5)this.push('Jornal do Circuito','🗞️',x.title)});
    if(s.fame>=25&&Math.random()<.5)this.push(pickA(['@hater_do_river','@foldequity','@zé_do_flop']),'👎',pickA([`${me} é marketing puro. Quero ver sem patrocínio.`,`Mais um que posa de rico. Joga nada.`,`Superestimado. Muda minha cabeça.`]));
    if(s.fame>=10&&Math.random()<.6)this.push(pickA(['@fã_do_feltro','@marina.poker','@grinder_rs']),'💚',pickA([`Aprendi muito vendo ${me} jogar. Referência!`,`Alguém mais acha que ${me} vai pro Hall da Fama?`,`Quero um autógrafo do ${me} no próximo festival!`]));
    if((s.items||[]).includes('patek')&&Math.random()<.2)this.push('@luxo_br','⌚',`${me} foi visto com um Patek Nautilus. Quanto custa um desses mesmo?`,'#Nautilus');
    if(s.love&&s.love.stage==='namoro'&&Math.random()<.15)this.push('@fofoca.poker','💘',`${me} e ${s.love.nm} apareceram juntos de novo. Tá sério!`,'#Casal');
    const sp=LIFE.sps();if(sp.length&&Math.random()<.2)this.push(sp[0].nm,sp[0].emo,`Orgulho de ter ${me} no nosso time! 🙌`)},
  trend(){const T={};this.st().forEach(x=>{if(x.tag)T[x.tag]=(T[x.tag]||0)+1});return Object.entries(T).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0])},
  panel(){const F=this.st().slice(0,12),tr=this.trend();return`<div class="panel"><h3>📰 O que estão falando</h3>${tr.length?`<div style="margin-bottom:6px">${tr.map(t=>`<span class="vtag">🔥 ${lx(t)}</span>`).join(' ')}</div>`:''}
    ${F.map(x=>`<div class="vpost"><b>${x.emo} ${lx(x.who)}</b> <span class="muted" style="font-size:12px">dia ${x.d}</span><div style="font-size:14px">${lx(x.txt)}</div></div>`).join('')||'<p class="muted" style="margin:0">O feed enche conforme você joga, ganha, compra e aparece.</p>'}</div>`}};

/* ----- lives ----- */
const LIVEX={K:{qa:{nm:'Perguntas e respostas',emo:'💬',h:1,en:5,m:.7},mao:{nm:'Análise de mãos',emo:'🧠',h:2,en:8,m:1},cash:{nm:'Live jogando online',emo:'🃏',h:3,en:15,m:1.4}},
  go(k){const s=LIFE.s,K=this.K[k];if(!K)return'';if(LIFE.daily('live'))return'Você já fez live hoje.';const tc=CLK.can(K.h,'a live');if(tc)return tc;if(s.energy<K.en)return'Sem energia pra live.';
    LIFE.mark('live');CLK.add(K.h);s.energy-=K.en;const view=Math.round((20+s.fans*.004+s.fame*3)*K.m*(.6+Math.random()*.8)),gain=Math.round(view*(.5+Math.random())*(1+LIFE.ifx('post'))),don=Math.round(view*(.3+Math.random()*.7)*2);
    s.fans+=gain;WALLET.add(don,`Doações da live (${K.nm.toLowerCase()})`);LIFE.addFame(.2*K.m);s.liveN=(s.liveN||0)+1;LIFE.sps().forEach(c=>{if(c.req&&c.req.post)c.done.post=(c.done.post||0)+1});
    let extra='';if(k==='cash'){const v=Math.round((Math.random()*2-.8)*(800+s.fame*40)/10)*10;WALLET.add(v,'Resultado da sessão online na live');extra=v>=0?` Ganhou R$ ${brl(v)} na sessão.`:` Perdeu R$ ${brl(-v)} na sessão, ao vivo.`}
    FEED.push('Twitch','🔴',`${CIRC.me()} fez live: ${K.nm.toLowerCase()} com ${nf(view)} pessoas assistindo.`,'#AoVivo');LIFE.commit();
    return`🔴 ${nf(view)} pessoas assistiram. +${nf(gain)} seguidores e R$ ${brl(don)} em doações.${extra} Conta como post pros patrocinadores.`},
  panel(){const d=LIFE.daily('live');return`<div class="panel"><h3>🔴 Lives</h3><p class="muted" style="margin-top:0;font-size:13px">Marcas querem quem transmite. Live rende seguidores, doações e conta como post nos contratos. Uma por dia.</p>
    ${d?'<p class="muted" style="margin:0">Você já fez live hoje.</p>':`<div class="dacts">${Object.entries(this.K).map(([k,K])=>`<button class="sm" data-live="${k}">${K.emo} ${K.nm} · ${K.h}h</button>`).join('')}</div>`}</div>`}};

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

/* ----- visual na mesa ----- */
const LOOK={
  icons(){const h=i=>LIFE.has(i),a=[];if(h('bone'))a.push('🧢');if(h('oculos'))a.push('🕶️');if(h('patek')||h('rolex')||h('relogio')||h('ultra'))a.push('⌚');if(h('corrente'))a.push('📿');if(h('terno'))a.push('🤵');else if(h('jaqueta'))a.push('🧥');else if(h('moletom'))a.push('🧥');return a.slice(0,4).join('')},
  best(){const vis=['patek','rolex','relogio','corrente','terno','jordan','oculos','bone','ultra','iphone'];return vis.map(i=>ITEMS.find(x=>x.id===i)).filter(x=>x&&LIFE.has(x.id)).sort((a,b)=>b.price-a.price)[0]||null},
  comment(T){try{if(!LIFE.s||!T.g)return;const it=this.best();if(!it||Math.random()>.35)return;const bots=T.g.players.filter(p=>!p.human&&LIVES.s.bots[p.name]);if(!bots.length)return;const p=pickA(bots),r=LIFE.rel(p.name),nm=it.nm.toLowerCase();
    setTimeout(()=>{if(T.g)T.chatMsg(p.name,r<=-1?pickA([`Belo ${nm}. Pena que não joga por você.`,`Esse ${nm} aí foi com o dinheiro de quem?`]):r>=1?pickA([`Que ${nm} é esse, rapaz! 😮`,`Tá podendo, hein! Esse ${nm} é lindo.`]):pickA([`Bonito o ${nm}.`,`É verdade que esse ${nm} custou o que dizem?`]),'re')},2500)}catch(e){}}};
