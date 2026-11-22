/* ----- família e relacionamento ----- */
const FAM={
  st(){const s=LIFE.s;if(!s.fam){const pk=pickA,sib=Math.random()<.5?'irmao':'irma';
      s.fam=[{id:'mae',rel:'Mãe',nm:pk(FAMN.m),emo:'👩',b:70},{id:'pai',rel:'Pai',nm:pk(FAMN.p),emo:'👨',b:62},{id:sib,rel:sib==='irmao'?'Irmão':'Irmã',nm:pk(FAMN[sib]),emo:sib==='irmao'?'🧑':'👧',b:58}]}
    return s.fam},
  get(id){return this.st().find(x=>x.id===id)},
  bond(p,v){p.b=clamp(p.b+v,0,100)},
  daily(d){const s=LIFE.s;this.st().forEach(p=>{if(p.b>35)p.b=Math.max(35,p.b-.6)});try{LOVE.daily(d)}catch(e){}const L=s.love;
    if(L){L.b=Math.max(0,L.b-(L.stage==='namoro'?1.8:2.5));if(L.stage==='namoro'&&L.b>=60)LIFE.addMood(.3);
      if(L.b<=8){LIFE.note('💔',L.stage==='namoro'?`${L.nm} terminou com você`:`${L.nm} parou de responder`,L.stage==='namoro'?'Disse que você só tem tempo pro poker.':'Acho que não rolou.');if(L.stage==='namoro')LIFE.addMood(-2);s.love=null;s.loveHome=false}}
    if(Math.random()<.16){const day=CAL.free(d+2,d+6);if(day){const p=pickA(this.st()),T=[];
      if(p.id==='mae'||p.id==='pai')T.push({title:`Almoço na casa dos seus pais`,emo:'🍝',desc:`${p.rel} fez questão. Faltar deixa ${p.id==='mae'?'ela':'ele'} chateado.`,ref:{fam:p.id,v:12}});
      if(p.id!=='mae'&&p.id!=='pai')T.push({title:`${p.rel} pediu ajuda na mudança`,emo:'📦',desc:`${p.nm} vai mudar de apartamento e conta com você. Cansa.`,ref:{fam:p.id,v:15,tire:20}});
      if(Math.random()<.25)T.push({title:`Aniversário ${p.id==='mae'?'da sua mãe':p.id==='pai'?'do seu pai':(p.id==='irma'?'da sua irmã':'do seu irmão')}`,emo:'🎂',desc:'Esse não dá pra faltar.',ref:{fam:p.id,v:20,cost:150,big:true}});
      const x=pickA(T);CAL.add(Object.assign({kind:'fam',day},x));LIFE.note(x.emo,`${p.rel}: ${x.title}`,`${CAL.fmt(day,true)}. Está na Agenda.`)}}
    if(L&&L.stage==='namoro'&&Math.random()<.14){const day=CAL.free(d+2,d+6);if(day){const x=pickA([{title:`Jantar com ${L.nm}`,emo:'🍷',ref:{love:1,v:12,cost:180}},{title:`Cinema com ${L.nm}`,emo:'🎬',ref:{love:1,v:9,cost:90}},{title:`Almoço com a família de ${L.nm}`,emo:'🍽️',ref:{love:1,v:16,big:true}},{title:`Aniversário de ${L.nm}`,emo:'🎁',ref:{love:1,v:22,cost:300,big:true}}]);
      CAL.add(Object.assign({kind:'love',day,desc:`${L.nm} está contando com isso.`},x));LIFE.note('❤️',`${L.nm}: ${x.title}`,`${CAL.fmt(day,true)}. Está na Agenda.`)}}},
  doItem(it){const R=it.ref,s=LIFE.s;let m='';if(R.cost){WALLET.add(-Math.round(R.cost*(1+LIFE.status()*.1)),it.title)}
    if(R.tire)s.energy=Math.max(0,s.energy-R.tire);
    if(R.fam){const p=this.get(R.fam);if(p){this.bond(p,R.v);m=`${p.emo} ${it.title}: ${p.nm} ficou feliz. Laço +${R.v}.`}LIFE.addMood(1)}
    if(R.love&&s.love){this.bond(s.love,R.v+(s.mood>=1?3:0));m=`❤️ ${it.title}: noite boa. Relação +${R.v}.`;LIFE.addMood(1)}
    if(R.date&&s.love){m=DATE.start((it.ref&&it.ref.t)||'jantar')}else{try{CLK.to(18);CLK.add(R.big?4:3)}catch(e){}}
    if(R.fx==='charity'){WALLET.add(-200,'Evento beneficente do clube');LIFE.addFame(.8);LIVES.ALL().slice().sort(()=>Math.random()-.5).slice(0,5).forEach(n=>LIVES.s.bots[n]&&LIVES.relAdd(n,'Você',.4));m='🎗️ Você ajudou no evento beneficente e fez amigos.'}
    if(R.fx==='bday'&&LIVES.s.bots[R.n]){LIVES.relAdd(R.n,'Você',1.5);LIFE.text(R.n,'Valeu por ter vindo! Foi demais.');m=`🎂 Festa boa: ${R.n} ficou muito feliz.`}
    if(R.fx==='pod'){LIFE.addFame(2);m='🎙️ Episódio gravado. Vai sair essa semana.'}
    if(R.fx==='car'){m='🔧 Carro revisado.'}
    return m},
  miss(it){const R=it.ref||{},s=LIFE.s;
    if(R.fam){const p=this.get(R.fam);if(p){this.bond(p,-(R.big?18:8));LIFE.note(p.emo,`${p.rel} ficou ${R.big?'magoad'+(p.id==='pai'||p.id==='irmao'?'o':'a'):'chatead'+(p.id==='pai'||p.id==='irmao'?'o':'a')}`,`Você faltou: ${it.title}.`)}LIFE.addMood(R.big?-1:0)}
    if((R.love||R.date)&&s.love){this.bond(s.love,-(R.big?22:12));LIFE.note('💢',`${s.love.nm} ficou chateada(o)`,`Você faltou: ${it.title}.`)}
    if(R.fx==='bday'&&LIVES.s.bots[R.n]){LIVES.relAdd(R.n,'Você',-.8);LIFE.text(R.n,'Nem apareceu no meu aniversário, hein.')}
    if(R.fx==='car')WALLET.add(-600,'Conserto do carro (faltou na revisão)')},
  call(id){const p=this.get(id);if(!p||LIFE.daily('fcall:'+id))return'Vocês já se falaram hoje.';LIFE.mark('fcall:'+id);this.bond(p,3);LIFE.commit();
    return`📞 ${p.nm}: ${pickA(p.id==='mae'?['Tá se alimentando direito, filho?','Quando você vem almoçar aqui?','Vi seu nome no jornal do clube! Fiquei orgulhosa.']:p.id==='pai'?['E aí, ganhou alguma coisa?','Cuidado com esse dinheiro, hein.','Me ensina esse tal de poker qualquer dia.']:['Me arruma uma vaga nesse home game aí!','Tô devendo uma visita, né?','Mãe tá reclamando que você sumiu.'])}`},
  visit(id){const p=this.get(id),day=CAL.free(CAL.today(),CAL.today()+7);if(!p||!day)return'Sem dia livre na próxima semana.';
    CAL.add({kind:'fam',day,emo:p.emo,title:`Visitar ${p.rel.toLowerCase()==='mãe'?'sua mãe':p.rel.toLowerCase()==='pai'?'seu pai':p.nm}`,desc:'Um dia em família.',ref:{fam:id,v:12}});LIFE.commit();return`Visita marcada para ${CAL.fmt(day,true)}.`},
  gift(id){const p=this.get(id),c=150;if(!p)return'';if(!WALLET.can(c))return'Saldo insuficiente.';WALLET.add(-c,`Presente para ${p.nm}`);this.bond(p,7);LIFE.commit();return`🎁 ${p.nm} amou o presente.`},
  /* relacionamento */
  meet(how){const s=LIFE.s;if(s.love)return'';if(LIFE.daily('meet'))return'Já tentou hoje. Amanhã tem mais.';LIFE.mark('meet');const pref=s.loveIn||'f';
    const ch=how==='app'?.35+LIFE.status()*.03+s.fame/300:.55;if(Math.random()>ch){LIFE.commit();return how==='app'?'Nenhum match interessante hoje.':'O amigo tentou, mas não rolou clima.'}
    const g=pref==='x'?pickA(['f','m']):pref,nm=pickA(LOVEN[g]);s.love={nm,g,emo:g==='f'?'👩':'👨',job:pickA(LOVEJ),stage:'crush',b:22,dates:0,since:CAL.today()};LIFE.commit();
    return how==='app'?`💘 Deu match com ${nm} (${s.love.job}). Chame pra sair!`:`💘 Seu amigo te apresentou ${nm} (${s.love.job}). Rolou conversa boa.`},
  date(){const L=LIFE.s.love;if(!L)return'';const day=CAL.free(CAL.today(),CAL.today()+7);if(!day)return'Sem dia livre na próxima semana.';
    if(CAL.st().items.some(x=>x.kind==='love'&&x.status==='pending'&&x.ref&&x.ref.date))return'Já tem um encontro marcado.';
    CAL.add({kind:'love',day,emo:'💘',title:`Encontro com ${L.nm}`,desc:'Jantar e conversa. Ir cansado ou de mau humor atrapalha.',ref:{date:1}});LIFE.commit();return`Encontro marcado: ${CAL.fmt(day,true)}.`},
  ask(){const L=LIFE.s.love;if(!L||L.stage!=='crush')return'';if((L.dates||0)<2||L.b<40)return`Ainda é cedo: saiam mais algumas vezes (relação ${Math.round(L.b)}/100, precisa de 40 e 2 encontros).`;
    if(Math.random()<.4+L.b/150){L.stage='namoro';L.since=CAL.today();LIFE.addMood(2);LIFE.addFame(.3);LIFE.commit();return`❤️ ${L.nm} aceitou! Vocês estão namorando.`}
    this.bond(L,-10);LIFE.commit();return`${L.nm} pediu mais tempo. Relação −10.`},
  moveIn(){const L=LIFE.s.love;if(!L||L.stage!=='namoro'||LIFE.s.home==='pais')return'';if(L.b<80||CAL.today()-L.since<20)return'Ainda não: precisa de relação 80 e 20 dias de namoro.';
    LIFE.s.loveHome=true;this.bond(L,5);LIFE.commit();return`🏠 ${L.nm} mudou pra sua casa. O aluguel agora é dividido.`},
  breakUp(){const L=LIFE.s.love;if(!L)return'';LIFE.s.love=null;LIFE.s.loveHome=false;LIFE.addMood(-1);LIFE.commit();return`Você terminou com ${L.nm}.`}};

