/* ----- encontros, presentes e perfis de par (inclui interesseiro/a) ----- */
const LOVE={
  D:{lanche:{emo:'🍔',nm:'Lanchonete',cost:80,g:[6,10],tire:5,txt:'Hambúrguer, batata e conversa solta.'},
    cinema:{emo:'🎬',nm:'Cinema com pipoca',cost:120,g:[8,12],tire:5,txt:'Filme, pipoca dividida e comentário no carro depois.'},
    casa:{emo:'🍝',nm:'Jantar feito em casa',cost:60,g:[6,12],tire:5,txt:'Você cozinhou. Deu pra conversar sem pressa.'},
    jantar:{emo:'🍷',nm:'Jantar com vinho',cost:350,g:[12,18],tire:8,txt:'Restaurante bom, vinho e conversa até tarde.'},
    show:{emo:'🎤',nm:'Show ou balada',cost:400,g:[10,16],tire:15,txt:'Música alta, dança e voltaram de madrugada.'},
    chique:{emo:'🥂',nm:'Restaurante chique',cost:1200,g:[15,22],tire:8,txt:'Menu degustação, sommelier e foto pro story.'},
    motel:{emo:'🌙',nm:'Noite no motel',cost:250,g:[12,20],tire:10,txt:'Noite a dois, só vocês. Saíram de lá rindo e grudados.'},
    viagem:{emo:'🏖️',nm:'Fim de semana na praia',cost:4000,g:[22,30],tire:0,txt:'Pousada pé na areia, pôr do sol e celular esquecido na mochila.'}},
  T:{romantica:{f:'romântica',m:'romântico',like:{jantar:1.4,cinema:1.2,chique:1.2,viagem:1.3,lanche:.8,motel:.9}},
    aventureira:{f:'aventureira',m:'aventureiro',like:{show:1.5,viagem:1.4,motel:1.2,casa:.7,cinema:.8}},
    caseira:{f:'caseira',m:'caseiro',like:{casa:1.5,cinema:1.3,lanche:1.1,show:.6,chique:.8}},
    interesseira:{f:'interesseira',m:'interesseiro',like:{chique:1.6,viagem:1.7,show:1.1,jantar:.9,motel:.8,cinema:.35,lanche:.1,casa:.2}}},
  G:{flores:{emo:'💐',nm:'Flores',cost:200,v:5,like:{romantica:1.4,interesseira:.6}},perfume:{emo:'🧴',nm:'Perfume importado',cost:800,v:9,like:{interesseira:1.3}},
    joia:{emo:'💎',nm:'Joia',cost:5000,v:16,like:{interesseira:2,caseira:.8}},bolsa:{emo:'👜',nm:'Bolsa de grife',cost:12000,v:20,like:{interesseira:2.2,caseira:.6,aventureira:.7}}},
  ela(L){return L.g==='f'?'ela':'ele'},
  tipo(L){if(!L.tipo){const s=LIFE.s,p=clamp(.12+(s.fame||0)/250+(WALLET.s.bal>1e6?.15:0),.12,.5);L.tipo=Math.random()<p?'interesseira':pickA(['romantica','aventureira','caseira'])}return L.tipo},
  tnm(L){const T=this.T[this.tipo(L)];return L.g==='f'?T.f:T.m},
  known(L){return(L.dates||0)>=2||L.stage==='namoro'},
  cost(k){const D=this.D[k];return Math.round(D.cost*(1+LIFE.status()*(k==='motel'?.25:.1))/10)*10},
  sched(k){const s=LIFE.s,L=s.love;if(!L)return'';const D=this.D[k];if(!D)return'';this.tipo(L);
    if(CAL.st().items.some(x=>x.kind==='love'&&x.status==='pending'&&x.ref&&x.ref.date))return'Já tem um encontro marcado.';
    if(k==='motel'&&L.stage!=='namoro'&&((L.dates||0)<2||L.b<45)){FAM.bond(L,-3);LIFE.commit();return`${L.nm} riu: "Calma, a gente mal se conhece." Relação −3.`}
    const like=this.T[L.tipo].like[k]||1;if(L.tipo==='interesseira'&&like<.4){FAM.bond(L,-3);LIFE.commit();return`${L.nm} visualizou e respondeu: "${D.nm}? Sério? Me chama quando for algo à minha altura." Relação −3.`}
    if(!WALLET.can(this.cost(k)))return`Saldo insuficiente: ${D.nm} custa R$ ${brl(this.cost(k))}.`;
    const day=CAL.free(CAL.today(),CAL.today()+7);if(!day)return'Sem dia livre na próxima semana.';
    if(L.tipo==='interesseira'&&Math.random()<.4&&!L.req){const v=this.reqV(.4);L.req={v,why:'o Uber e o look do encontro',k,day};LIFE.commit();
      return`${L.nm} topou, mas mandou: "Só consigo ir se você me mandar R$ ${brl(v)} pro Uber e pro look 😘". Responda aqui embaixo.`}
    return this.book(k,day)},
  book(k,day){const L=LIFE.s.love,D=this.D[k];CAL.add({kind:'love',day,emo:D.emo,title:`${D.nm} com ${L.nm}`,desc:`${D.txt.split('.')[0]}. Ir cansado ou de mau humor atrapalha.`,ref:{date:1,t:k}});LIFE.commit();return`${D.emo} Marcado: ${D.nm.toLowerCase()} com ${L.nm}, ${CAL.fmt(day,true)}.`},
  reqV(f){const b=WALLET.s.bal;return Math.round(clamp(b*.0004*(f||1),200,20000)/50)*50},
  doDate(it){const s=LIFE.s,L=s.love,k=(it.ref&&it.ref.t)||'jantar',D=this.D[k]||this.D.jantar;this.tipo(L);const c=this.cost(k);WALLET.add(-c,`${D.nm} com ${L.nm}`);
    const like=this.T[L.tipo].like[k]||1,base=D.g[0]+Math.random()*(D.g[1]-D.g[0]);let g=Math.round(base*like+(s.mood>=1?3:0)-(s.energy<30?6:0)+LIFE.ifx('love'));
    if(L.tipo==='interesseira'&&(s.cars||[]).includes('super'))g+=3;s.energy=Math.max(0,s.energy-D.tire);FAM.bond(L,g);L.dates=(L.dates||0)+1;LIFE.addMood(k==='motel'||k==='viagem'?2:1);
    let m=`${D.emo} ${D.txt} Relação ${g>=0?'+':''}${g}.`;if(!this.known(L)||L.dates===2)m+=L.dates===2?` Agora você conhece ${L.nm} melhor: perfil ${this.tnm(L)}.`:'';
    if(like>=1.3)m+=` ${L.nm} adorou o programa.`;else if(like<.8)m+=` Deu pra ver que não é o tipo de programa d${L.g==='f'?'ela':'ele'}.`;return m},
  gift(k){const s=LIFE.s,L=s.love,G=this.G[k];if(!L||!G)return'';this.tipo(L);if(LIFE.daily('lovegift'))return'Um presente por dia já está bom.';const c=Math.round(G.cost*(1+LIFE.status()*.1)/10)*10;
    if(!WALLET.can(c))return'Saldo insuficiente.';LIFE.mark('lovegift');WALLET.add(-c,`Presente pra ${L.nm}: ${G.nm}`);const g=Math.round(G.v*((G.like||{})[L.tipo]||1));FAM.bond(L,g);LIFE.commit();
    return`${G.emo} ${L.nm} ${g>=15?'amou o':'gostou do'} presente. Relação +${g}.`},
  pay(){const L=LIFE.s.love;if(!L||!L.req)return'';const R=L.req;if(!WALLET.can(R.v))return'Saldo insuficiente.';WALLET.add(-R.v,`Pix pra ${L.nm}: ${R.why}`);L.req=null;FAM.bond(L,8);let m=`💸 Pix enviado. ${L.nm} mandou um coração. Relação +8.`;
    if(R.k){m+=' '+DATE.go(R.k)}LIFE.commit();return m},
  deny(){const L=LIFE.s.love;if(!L||!L.req)return'';const R=L.req;L.req=null;FAM.bond(L,L.tipo==='interesseira'?-12:-4);let m=`${L.nm} ficou de cara feia${R.k?' e desmarcou o encontro':''}. Relação ${L.tipo==='interesseira'?-12:-4}.`;
    if(L.b<10){LIFE.s.love=null;LIFE.s.loveHome=false;m+=` Pouco depois, ${this.ela(L)} sumiu das redes. Era interesse.`}LIFE.commit();return m},
  daily(d){const s=LIFE.s,L=s.love;if(!L)return;this.tipo(L);
    if(L.tipo==='interesseira'){if(!L.req&&Math.random()<.18){const why=pickA(L.g==='f'?['o aluguel atrasado','um vestido pra uma festa','o salão e a unha','uma bolsa que ela viu na vitrine','o conserto do celular','a passagem pra visitar a mãe']:['o aluguel atrasado','um tênis novo','a academia e o suplemento','o conserto do carro','um relógio que ele viu','a passagem pra visitar a mãe']);
        L.req={v:this.reqV(1),why};LIFE.note('💸',`${L.nm} pediu dinheiro`,`R$ ${brl(L.req.v)} pra ${why}. Responda no Relacionamento.`)}
      if(WALLET.s.bal<20000&&Math.random()<.4){LIFE.note('💔',`${L.nm} sumiu`,`Foi só a grana apertar. ${this.ela(L).charAt(0).toUpperCase()+this.ela(L).slice(1)} disse que "precisa de alguém com mais estabilidade".`);s.love=null;s.loveHome=false}}}};

