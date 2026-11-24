/* ----- vida de jogador profissional: convites, circuito, apostas paralelas, mesa privada, live, desgaste ----- */
const CITIES=['Florianópolis','Foz do Iguaçu','Rio de Janeiro','Gramado','Recife','Brasília','Curitiba','Belo Horizonte','São Paulo','Salvador','Fortaleza','Balneário Camboriú'];
EVTS.etapa={nm:'Circuito Nacional',emo:'✈️',fmt:'mtt',buy:2500,N:36,st:'ps',hpl:12,reg:10,days:2,stops:[8],travel:1500,desc:'Etapa fora da cidade: 36 jogadores em 2 dias. Passagem e hotel por sua conta, a não ser que você ganhe um satélite.'};
EVTS.sat={nm:'Satélite do Circuito',emo:'🎫',fmt:'sng',buy:300,N:9,st:'turbo',hpl:8,reg:2,sat:true,desc:'Mesa única. O campeão ganha o pacote da etapa: inscrição, passagem e hotel. O 2º recebe a inscrição de volta.'};
const GIGS={
  festa:{emo:'🥂',f:5,w:3,fix:1,nm:['Festa de lançamento de uma marca de roupa','Aniversário de um empresário no clube de campo','Festa na cobertura de um jogador do circuito','Inauguração de um bar no centro'],desc:'Entrada VIP e open bar. Dá contatos, mas cansa e a ressaca pesa no dia seguinte.'},
  presenca:{emo:'🎟️',f:18,w:3,paid:1,nm:['Inauguração de um clube de poker na serra','Sessão de fotos e autógrafos numa feira de games','Ação de uma marca de energético num shopping','Lançamento de um app de poker'],desc:'Aparecer, tirar foto e dar autógrafo. Pagam cachê pela sua presença.'},
  clinica:{emo:'🧑‍🏫',f:25,w:2,paid:1,nm:['Workshop de torneios num clube','Clínica de poker para iniciantes','Aula aberta numa liga universitária'],desc:'Um dia ensinando. Pagam por aluno inscrito.'},
  camarote:{emo:'🏟️',f:35,w:2,paid:1,fix:1,nm:['Camarote de uma cervejaria no clássico de domingo','Camarote de uma marca no show do ano','Box de uma corretora no GP de Fórmula 1'],desc:'A marca paga pra você aparecer no camarote dela e postar. Festa garantida.'},
  tv:{emo:'📺',f:45,w:1,paid:1,fix:1,rep:45,nm:['Entrevista num programa de TV de domingo','Talk show na TV a cabo','Quadro sobre poker num programa esportivo'],desc:'Exposição nacional: cachê bom e muita fama. Só chamam quem tem boa reputação.'},
  gala:{emo:'🎗️',f:15,w:2,cost:1,fix:1,nm:['Jantar beneficente de um hospital infantil','Leilão beneficente da fundação do clube','Baile de gala de uma ONG'],desc:'Convite pago: o valor é doação. Gente rica e influente. Dá fama, reputação e contatos.'},
  charity:{emo:'🃏',f:10,w:2,cost:1,fix:1,nm:['Torneio beneficente com celebridades e ex-atletas','Charity poker de uma instituição de caridade'],desc:'O buy-in vai todo pra caridade. Você divide a mesa com atores e ex-jogadores de futebol.'},
  vip:{emo:'🍾',f:28,w:2,cost:1,fix:1,nm:['Mesa VIP na balada mais cara da cidade','Camarote pago numa festa de música eletrônica','Festa num iate em Balneário Camboriú'],desc:'Você paga pra estar lá. Visibilidade, gente rica e talvez um convite pra uma mesa privada.'}};
const PROPS=[{k:'peso',emo:'⚖️',nm:'perder 6 kg em 30 dias',need:8,days:30},{k:'corrida',emo:'🏃',nm:'correr 10 km em menos de 1 hora daqui a 3 semanas',need:6,days:21},
  {k:'flexao',emo:'💪',nm:'fazer 100 flexões seguidas daqui a 2 semanas',need:5,days:14},{k:'trilha',emo:'⛰️',nm:'subir o morro mais alto da serra a pé em 3 semanas',need:5,days:21}];
const SOC={ngOpen:null,NG:['mkt','gig','meet','lesson','life','fam','love'],
  st(){const s=LIFE.s;s.soc=s.soc||{rep:60,burn:10,inv:[],lies:[],alibi:{},subs:0,lives:0,dry:0,prop:null,hang:0,net:0,lead:0,bw:0,seq:1};return s.soc},
  city(d){const t=CAL.date(d);return CITIES[(t.getFullYear()*12+t.getMonth())%CITIES.length]},
  r50(v){return Math.round(v/50)*50},
  cache(){const f=LIFE.s.fame;return this.r50(400+f*f*1.6)},
  repTxt(){const r=this.st().rep;return r>=80?'impecável':r>=60?'boa':r>=40?'arranhada':r>=20?'ruim':'queimada'},
  burnAdd(v){const S=this.st();S.burn=clamp(S.burn+v,0,100);
    if(S.burn>=90&&S.bw<2){S.bw=2;LIFE.addMood(-1);LIFE.note('🔥','Burnout','Torneio atrás de torneio, evento atrás de evento. Você está jogando no automático: −2 cartões de tempo até descansar. Tire um dia livre ou umas férias.')}
    else if(S.burn>=70&&S.bw<1){S.bw=1;LIFE.note('🧠','Cabeça pesada','Muito tempo sem descanso. Você perde 1 cartão de tempo nas mesas até o desgaste cair abaixo de 70%.')}
    if(S.burn<60)S.bw=0},
  headTxt(){const b=Math.round(this.st().burn);return`<div class="vsub">🧠 Desgaste mental ${b}%: ${b>=90?'burnout, −2 cartões de tempo':b>=70?'cabeça pesada, −1 cartão de tempo':b>=40?'cansaço acumulando':'cabeça fresca'} · reputação ${this.repTxt()}</div>`},
  who(it){const R=it.ref||{},s=LIFE.s;if(it.kind==='mkt'){const p=LIFE.spById(R.sp)||s.sp;return p?p.nm:'A marca'}if(it.kind==='meet')return(SCOUTS[R.k]||{}).nm||'O olheiro';if(it.kind==='lesson')return'O professor';
    if(it.kind==='life')return R.n||'O organizador';if(it.kind==='fam'){const p=FAM.get(R.fam);return p?p.nm:'Sua família'}if(it.kind==='love')return s.love?s.love.nm:'Seu par';return'A produção'},
  /* ---------- convites ---------- */
  daily(d){const S=this.st(),s=LIFE.s;
    if(S.hang===d){s.energy=Math.max(0,s.energy-15);LIFE.note('🥴','Ressaca','A noite de ontem cobrou: −15 de energia.')}
    if(S.prop&&d>=S.prop.end)this.propEnd();
    S.inv=S.inv.filter(x=>x.exp>=d);
    if(S.inv.length<3)this.genGig(d);
    if(S.lead&&d-S.lead<=12&&Math.random()<.3||(s.fame>=55&&Math.random()<.02))this.genWhale(d);
    if(!S.prop&&!S.inv.some(x=>x.t==='prop')&&Math.random()<.04+(s.fame>=20?.03:0))this.genProp(d)},
  genGig(d){const S=this.st(),f=LIFE.s.fame;if(Math.random()>.07+f/300+S.net*.015)return;
    const el=Object.entries(GIGS).filter(([k,G])=>f>=G.f&&S.rep>=(G.rep||(G.paid?25:0))&&!S.inv.some(x=>x.t===k));if(!el.length)return;
    const pool=[];el.forEach(([k,G])=>{for(let i=0;i<G.w;i++)pool.push(k)});const t=pickA(pool),G=GIGS[t];
    const day=Math.random()<.6?CAL.free(d+2,d+9):d+2+(Math.random()*8|0);if(!day)return;const st=LIFE.status();
    let pay=0,cost=0;if(t==='presenca')pay=this.cache();if(t==='camarote')pay=this.r50(this.cache()*.6);if(t==='tv')pay=this.r50(this.cache()*1.4);
    if(t==='clinica'){const n=6+(Math.random()*14|0)+(f/5|0);pay=this.r50(n*(80+f*2))}
    if(t==='gala')cost=this.r50((800+f*40)*(1+st*.15));if(t==='charity')cost=f<40?500:f<70?1000:2500;if(t==='vip')cost=this.r50(1500*(1+st*.2));
    const x={id:S.seq++,t,day,exp:day-1,emo:G.emo,nm:pickA(G.nm),pay,cost};S.inv.push(x);
    LIFE.note(G.emo,`Convite: ${x.nm}`,`${CAL.fmt(day,true)} · ${pay?`cachê de R$ ${brl(pay)}`:cost?`convite de R$ ${brl(cost)}`:'entrada VIP'}. Responda na Agenda.`)},
  genWhale(d){const S=this.st();if(S.inv.some(x=>x.t==='whale')||CAL.st().items.some(x=>x.status==='pending'&&x.ref&&x.ref.whale))return;
    const all=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&LIVES.bio(n)).sort((a,b)=>LIVES.s.bots[b].bank-LIVES.s.bots[a].bank);if(all.length<4)return;
    const whale=all.find(n=>!/poker|jogador/i.test(LIVES.bio(n).job||''))||all[1],host=all.find(n=>n!==whale),others=all.filter(n=>n!==whale&&n!==host).slice(0,2+(Math.random()*2|0));
    const big=LIFE.s.fame>=50,sk=big?{nm:'Jogo privado',sb:25,bb:50,stack:5000}:{nm:'Jogo privado',sb:10,bb:20,stack:2000};
    const day=CAL.free(d+2,d+7);if(!day)return;S.lead=0;
    S.inv.push({id:S.seq++,t:'whale',day,exp:day-1,emo:'🐋',nm:`Jogo fechado na casa de ${host}`,host,whale,guests:[whale,...others],sk});
    LIFE.text(host,`Tô montando um jogo fechado ${WDL[CAL.dow(day)]} (${CAL.fmt(day)}). R$ ${sk.sb}/${sk.bb}, buy-in de R$ ${brl(sk.stack)}. Vem o ${whale}, que adora perder dinheiro na mesa. Discrição total, hein.`);
    LIFE.note('🐋',`${host} te chamou pra um jogo privado`,`R$ ${sk.sb}/${sk.bb} com um "baleia" na mesa. Só entra quem é convidado. Responda na Agenda.`)},
  genProp(d){const S=this.st(),bots=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&LIVES.bio(n)&&Math.abs(LIFE.rel(n))>=1&&LIVES.s.bots[n].bank>1500);if(!bots.length)return;
    const n=pickA(bots),P=pickA(PROPS),stake=Math.round(clamp(Math.min(LIVES.s.bots[n].bank*.08,Math.max(500,WALLET.s.bal*.05)),300,20000)/100)*100;
    S.inv.push({id:S.seq++,t:'prop',exp:d+2,day:d,emo:P.emo,nm:`Aposta com ${n}: ${P.nm}`,n,k:P.k,stake});
    LIFE.text(n,LIFE.rel(n)<=-1?`Aposto R$ ${brl(stake)} que tu não consegue ${P.nm}. Duvido.`:`Bora uma aposta? R$ ${brl(stake)} que você não consegue ${P.nm}. Topa?`);
    LIFE.note(P.emo,`${n} propôs uma aposta paralela`,`R$ ${brl(stake)}: ${P.nm}. Responda na Agenda até ${CAL.fmt(d+2)}.`)},
  accept(id){const S=this.st(),x=S.inv.find(v=>v.id===id),t=CAL.today();if(!x)return'';
    if(x.t==='prop'){const P=PROPS.find(p=>p.k===x.k);S.prop={k:x.k,n:x.n,stake:x.stake,start:t,end:t+P.days,need:P.need,prog:0,nm:P.nm,emo:P.emo};S.inv=S.inv.filter(v=>v!==x);
      LIFE.mine(x.n,'Fechado. Pode ir separando o dinheiro.');if(LIFE.s.fame>=15)CIRC.post({k:'bast',title:'',body:`Aposta paralela no clube: ${CIRC.me()} e ${x.n} apostaram R$ ${brl(x.stake)}. O desafio: ${P.nm}.`});LIFE.commit();
      return`${P.emo} Aposta fechada. Você precisa de ${P.need} dias de treino até ${CAL.fmt(S.prop.end,true)}. Treine nos dias livres da Agenda.`}
    if(x.day<t)return'Esse convite já passou.';
    if(x.cost){if(!WALLET.can(x.cost))return`Saldo insuficiente: o convite custa R$ ${brl(x.cost)}.`;WALLET.add(-x.cost,`Convite: ${x.nm}`)}
    const busy=CAL.busy(x.day);
    if(x.t==='whale')CAL.add({kind:'hgv',day:x.day,emo:'🐋',title:x.nm,desc:`R$ ${x.sk.sb}/${x.sk.bb}, buy-in R$ ${brl(x.sk.stack)}. ${x.whale} joga solto e chama tudo. Sem rake.`,ref:{host:x.host,stake:'vip',sk:x.sk,guests:x.guests,rake:false,styles:{[x.whale]:'station'},whale:1}});
    else CAL.add({kind:'gig',day:x.day,emo:x.emo,title:x.nm,desc:GIGS[x.t].desc,ref:{t:x.t,pay:x.pay,cost:x.cost}});
    S.inv=S.inv.filter(v=>v!==x);LIFE.commit();return`${x.emo} Confirmado para ${CAL.fmt(x.day,true)}.${busy?' ⚠️ Você já tem outra coisa nesse dia: vai ter que escolher (ou negociar).':''}`},
  decline(id){const S=this.st(),x=S.inv.find(v=>v.id===id);if(!x)return'';S.inv=S.inv.filter(v=>v!==x);
    if(x.t==='prop'||x.t==='whale')LIFE.mine(x.t==='prop'?x.n:x.host,x.t==='prop'?'Essa eu passo.':'Dessa vez não vou poder, valeu.');LIFE.commit();return'Convite recusado.'},
  /* ---------- fazendo o compromisso ---------- */
  doGig(it){const R=it.ref||{},S=this.st(),s=LIFE.s,me=CIRC.me();let m='';const fr=k=>LIVES.ALL().filter(n=>LIVES.s.bots[n]).sort(()=>Math.random()-.5).slice(0,k).forEach(n=>LIVES.relAdd(n,'Você',.3));
    if(R.t==='presenca'){WALLET.add(R.pay,`Cachê: ${it.title}`);LIFE.addFame(.6);s.energy-=10;this.burnAdd(4);m=`🎟️ Fotos, autógrafos e R$ ${brl(R.pay)} de cachê.`}
    if(R.t==='clinica'){WALLET.add(R.pay,`Workshop: ${it.title}`);LIFE.addFame(.4);s.energy-=15;S.rep=Math.min(100,S.rep+2);this.burnAdd(5);m=`🧑‍🏫 Turma cheia, perguntas boas e R$ ${brl(R.pay)} no bolso.`}
    if(R.t==='camarote'){WALLET.add(R.pay,`Cachê: ${it.title}`);LIFE.addFame(1);LIFE.addMood(1);s.energy-=12;S.hang=CAL.today()+1;this.burnAdd(-3);m=`🏟️ Camarote lotado, fotos postadas e R$ ${brl(R.pay)} de cachê.`}
    if(R.t==='tv'){WALLET.add(R.pay,`Cachê: ${it.title}`);LIFE.addFame(2.5);S.rep=Math.min(100,S.rep+3);s.energy-=10;this.burnAdd(4);
      CIRC.post({k:'vida',title:`${me} na TV`,body:`O jogador apareceu em rede nacional falando de poker, variância e da vida no circuito.`});m=`📺 No ar! R$ ${brl(R.pay)} de cachê e o celular não para de vibrar.`}
    if(R.t==='festa'){LIFE.addFame(.5);LIFE.addMood(1);s.energy-=15;S.hang=CAL.today()+1;S.net++;fr(3);this.burnAdd(-5);m='🥂 Festa boa: você conheceu gente e fez contatos.';
      if(s.fame>=25&&Math.random()<.25){S.lead=CAL.today();m+=' Um empresário pediu seu telefone pra "um jogo entre amigos".'}if(!s.love&&Math.random()<.2)m+=this.newLove()}
    if(R.t==='gala'){LIFE.addFame(1.5);S.rep=Math.min(100,S.rep+5);S.net+=2;fr(4);s.energy-=10;m='🎗️ Jantar de gala: doação feita, fotos com gente importante e contatos novos.';
      if(Math.random()<.35){S.lead=CAL.today();m+=' Um investidor comentou de um jogo privado que ele frequenta.'}}
    if(R.t==='charity'){const p=Math.random(),pl=p<.08+s.fame/800?1:p<.3?2+(Math.random()*2|0):4+(Math.random()*30|0);LIFE.addFame(1.2+(pl===1?1:0));S.rep=Math.min(100,S.rep+3);fr(5);s.energy-=15;this.burnAdd(3);
      m=pl===1?'🏆 Você ganhou o torneio beneficente! O troféu vai pra estante e o prêmio, pra caridade.':`🃏 Você ficou em ${pl}º no torneio beneficente. Fotos com as celebridades e muita gente nova.`;
      if(pl===1)CIRC.post({k:'vida',title:`${me} vence torneio beneficente`,body:'O jogador bateu atores e ex-atletas na mesa final. Toda a arrecadação foi doada.'})}
    if(R.t==='vip'){LIFE.addFame(.8);LIFE.addMood(1);s.energy-=20;S.hang=CAL.today()+1;S.net++;this.burnAdd(-5);m='🍾 Noite de ostentação: foto no camarote e gente com muito dinheiro em volta.';
      if(Math.random()<.3){S.lead=CAL.today();m+=' Um herdeiro te chamou pra "jogar umas fichas" com os amigos dele.'}if(!s.love&&Math.random()<.25)m+=this.newLove()}
    s.energy=clamp(s.energy,0,100);this.seen('gig');return{msg:m}},
  newLove(){const s=LIFE.s;if(s.love)return'';const pref=s.loveIn||'f',g=pref==='x'?pickA(['f','m']):pref,nm=pickA(LOVEN[g]);
    s.love={nm,g,emo:g==='f'?'👩':'👨',job:pickA(LOVEJ),stage:'crush',b:22,dates:0,since:CAL.today()};return` 💘 E você conheceu ${nm} (${s.love.job}). Trocaram telefone.`},
  missGig(it){const R=it.ref||{},S=this.st(),G=GIGS[R.t]||{emo:'📅'};
    if(R.pay){S.rep=Math.max(0,S.rep-12);LIFE.addFame(-.5);LIFE.note('😤',`Você deu bolo: ${it.title}`,'A produção ficou na mão. Sua reputação com marcas e eventos caiu.')}
    else if(R.cost){S.rep=Math.max(0,S.rep-3);LIFE.note(G.emo,`Você não foi: ${it.title}`,`O convite de R$ ${brl(R.cost)} foi pro lixo.`)}
    else LIFE.note(G.emo,`Você não foi: ${it.title}`,'Ninguém sentiu muita falta.')},
  afterItem(it){const k=it.kind;if(k==='fam'||k==='love')this.burnAdd(-8);if(k==='meet'||k==='lesson')this.burnAdd(2);if(k==='mkt'){this.burnAdd(3);this.seen('gig')}if(k==='hg'||k==='hgv')this.burnAdd(3)},
  /* ---------- negociação e desculpas ---------- */
  negOpts(it){const o=[],k=it.kind,R=it.ref||{},A=CAL.st(),fix=(k==='gig'&&(GIGS[R.t]||{}).fix)||(k==='life'&&(R.fx==='bday'||R.fx==='charity'));
    if(!fix&&!it.negRem)o.push(['rem','📆 Pedir pra remarcar']);
    if(['mkt','gig','meet','lesson','life'].includes(k)&&!it.negTour&&CAL.events(it.day).some(e=>A.reg[e.key]&&!A.done[e.key]))o.push(['tor','🏆 Explicar que tem torneio']);
    if(!it.negExc){const fam=k==='fam'||k==='love';o.push(['exc:doente','🤒 Dizer que está doente'],fam?['exc:trabalho','💼 Dizer que surgiu trabalho']:['exc:familia','👪 Problema de família'],['exc:carro','🚗 Imprevisto no caminho'])}
    if(k==='mkt'&&(LIFE.spById(R.sp)||LIFE.s.sp))o.push(['cmp',`💸 Pagar multa de R$ ${brl((LIFE.spById(R.sp)||LIFE.s.sp).day*7)}`]);
    if(k==='gig'&&R.pay)o.push(['cmp',`💸 Desistir pagando multa de R$ ${brl(Math.round(R.pay*.3))}`]);
    if(k==='gig'&&R.cost)o.push(['cmp','🎁 Dar o convite a um amigo']);
    return o},
  negRow(it){const S=this.st(),lies=S.lies.filter(x=>x.day>CAL.today()-30).length,o=this.negOpts(it);
    return`<div class="ngbox">${o.length?o.map(([c,l])=>`<button class="sm" data-ag="ngo:${it.id}:${c}">${l}</button>`).join(''):'<span class="muted">Você já tentou de tudo com esse compromisso.</span>'}
      <div class="muted">${this.who(it)} vai decidir. Remarcar é o caminho honesto; desculpa pode colar ou não${lies?` (você já deu ${lies} desculpa${lies>1?'s':''} este mês, fica menos crível)`:''}. Se usar desculpa, não seja visto jogando ou em evento nesse dia.</div></div>`},
  nego(id,opt){const A=CAL.st(),it=A.items.find(x=>x.id===id);if(!it||it.status!=='pending')return'';const S=this.st(),[op,why]=opt.split(':'),who=this.who(it),t=CAL.today();
    const lies=S.lies.filter(x=>x.day>t-30).length,repK=(S.rep-60)/250;
    if(op==='rem'||op==='tor'){it[op==='rem'?'negRem':'negTour']=1;const base={mkt:.7,gig:.5,meet:.45,lesson:.9,life:.6,fam:.85,love:.7}[it.kind]||.5,ch=(op==='tor'?.92:base)+repK-(it.moved||0)*.25;
      if(Math.random()<ch){const nd=CAL.free(Math.max(it.day,t)+1,Math.max(it.day,t)+8);if(!nd){LIFE.commit();return`${who} até topou, mas você não tem nenhum dia livre na semana seguinte.`}
        const od=it.day;it.day=nd;it.moved=(it.moved||0)+1;LIFE.commit();return`✅ ${who} topou${op==='tor'?': torneio é trabalho, eles entendem':''}. "${it.title}" saiu de ${CAL.fmt(od)} e foi para ${CAL.fmt(nd,true)}.`}
      if(it.kind==='mkt')S.rep=Math.max(0,S.rep-2);LIFE.commit();return`❌ ${who} não aceitou. ${op==='tor'?'Disseram que o contrato vem antes do torneio.':'É nesse dia ou é falta.'}`}
    if(op==='exc'){it.negExc=1;const ch=clamp(.78-lies*.18+repK,.1,.92),txt={doente:'doente',familia:'com um problema de família',trabalho:'enrolado com trabalho',carro:'com um imprevisto no caminho'}[why]||'impossibilitado';
      S.lies.push({day:t,why});S.lies=S.lies.filter(x=>x.day>t-60);
      if(Math.random()<ch){it.status='excused';S.alibi[it.day]={title:it.title,txt,kind:it.kind,ref:it.ref||{},who};LIFE.commit();
        return`🤞 ${who} acreditou que você estava ${txt}. "${it.title}" foi cancelado sem punição. Só não vá ser visto por aí em ${CAL.fmt(it.day)}.`}
      S.rep=Math.max(0,S.rep-8);it.status='missed';CAL.miss(it);LIFE.commit();return`🙄 ${who} não engoliu essa de estar ${txt}. Contou como falta e sua reputação caiu.`}
    if(op==='cmp'){const R=it.ref||{};
      if(it.kind==='mkt'){const sp=LIFE.spById(R.sp)||LIFE.s.sp;if(!sp)return'';const fee=sp.day*7;if(!WALLET.can(fee))return'Saldo insuficiente pra multa.';WALLET.add(-fee,`Multa contratual: ${sp.nm}`);it.status='excused';S.rep=Math.max(0,S.rep-1);LIFE.commit();return`💸 Multa paga. ${sp.nm} aceitou e não contou como falta.`}
      if(it.kind==='gig'&&R.pay){const fee=Math.round(R.pay*.3);if(!WALLET.can(fee))return'Saldo insuficiente pra multa.';WALLET.add(-fee,`Multa por desistir: ${it.title}`);it.status='excused';S.rep=Math.max(0,S.rep-3);LIFE.commit();return`💸 Você desistiu com aviso e pagou a multa. A produção arrumou outro nome.`}
      if(it.kind==='gig'&&R.cost){const fr=LIVES.ALL().filter(n=>LIVES.s.bots[n]).sort((a,b)=>LIFE.rel(b)-LIFE.rel(a))[0];it.status='excused';if(fr){LIVES.relAdd(fr,'Você',1);LIFE.text(fr,'Sério que vai me dar o convite? Valeu demais!')}LIFE.commit();return`🎁 Você deu o convite pro ${fr||'um amigo'}. Ele adorou.`}}
    return''},
  seen(kind){const S=this.st(),t=CAL.today(),a=S.alibi[t];if(!a||a.caught)return;const p=({tour:.55,live:.9,gig:.7,cash:.2})[kind]||.3;if(Math.random()>p+LIFE.s.fame/400)return;a.caught=1;
    const me=CIRC.me(),what={tour:'jogando torneio',live:'fazendo live',gig:'num evento',cash:'jogando cash no clube'}[kind]||'na rua';S.rep=Math.max(0,S.rep-15);LIFE.addFame(-1);
    CIRC.post({k:'bast',title:'',body:`Flagra: ${me} faltou a "${a.title}" dizendo que estava ${a.txt}, mas foi visto ${what} no mesmo dia.`});
    const R=a.ref||{},s=LIFE.s;let extra='';
    if(a.kind==='mkt'&&(LIFE.spById(R.sp)||s.sp)){const sp=LIFE.spById(R.sp)||s.sp;sp.miss=(sp.miss||0)+1;if(sp.miss>=2){LIFE.dropSp(sp.id);LIFE.relSp(sp.id);extra=` ${sp.nm} encerrou o contrato.`}else extra=` ${sp.nm} registrou como falta.`}
    if(a.kind==='fam'){const p=FAM.get(R.fam);if(p){FAM.bond(p,-15);extra=` ${p.nm} ficou sabendo e ficou muito chateado(a).`}}
    if(a.kind==='love'&&s.love){FAM.bond(s.love,-20);extra=` ${s.love.nm} viu e ficou furiosa(o).`}
    if(a.kind==='life'&&R.n&&LIVES.s.bots[R.n]){LIVES.relAdd(R.n,'Você',-1);LIFE.text(R.n,'Doente, né? Vi você por aí. Valeu pela consideração.')}
    LIFE.note('📸','Flagra!',`Você foi visto ${what} no dia em que disse estar ${a.txt}. Reputação −15.${extra}`)},
  /* ---------- ações do dia livre ---------- */
  act(k){const[op,arg]=k.split(':'),A=CAL.st(),t=CAL.today(),S=this.st(),s=LIFE.s;
    if(op==='acc')return this.accept(+arg);if(op==='dec')return this.decline(+arg);
    {const H={rest:4,train:3,live:3,trip:0}[op];if(H){const tc=CLK.can(H,{rest:'descansar',train:'o treino',live:'a live'}[op]);if(tc)return tc}if(op==='live'&&s.energy<12)return'Sem energia pra live (precisa de 12).';if(op==='train'&&s.energy<10)return'Sem energia pra treinar.';if(op==='trip'&&CLK.now()>13)return'Viagem de férias só saindo até as 13h. Amanhã cedo dá.'}
    if(op==='rest'){dayDid(t,'rest');CLK.add(4);s.energy=Math.min(100,s.energy+30);this.burnAdd(-20);if(s.mood<0)LIFE.addMood(1);LIFE.commit();return'😴 Quatro horas de descanso: celular no silencioso, série e cochilo. Energia +30, desgaste −20. Ainda dá pra sair à noite.'}
    if(op==='train'){const P=S.prop;if(!P)return'';dayDid(t,'train');CLK.add(3);P.prog++;s.energy=Math.max(0,s.energy-10);this.burnAdd(-10);LIFE.commit();
      return`${P.emo} Treino feito (${P.prog}/${P.need}). ${P.prog>=P.need?'Você está pronto pro desafio.':`Faltam ${P.need-P.prog} até ${CAL.fmt(P.end)}.`}`}
    if(op==='live'){dayDid(t,'live');CLK.add(3);const v=Math.round(s.fans*.008+S.subs*.35+3),rev=Math.round(v*2.5+S.subs*1.2+v*Math.random()*2),ns=Math.round(1+v*.06*(.5+Math.random()));
      S.subs+=ns;S.lives++;s.fans+=Math.round(v*.4);LIFE.addFame(.25);s.energy=Math.max(0,s.energy-12);this.burnAdd(4);let m=`🎥 Live de 3 horas: ${nf(v)} pessoas assistindo, +${ns} inscritos e R$ ${brl(rev)} em doações.`;
      if(Math.random()<.07){LIFE.addFame(1.5);s.fans+=v*5;m+=' Um corte seu viralizou!'}WALLET.add(rev,'Live: doações e inscritos');this.seen('live');LIFE.commit();return m}
    if(op==='trip'){const b=CAL.blockers();if(b)return b;if(CAL.busy(t+1)||CAL.busy(t+2))return'Pra viajar você precisa de 3 dias seguidos livres (hoje e os próximos 2).';
      const cost=this.r50(1200*(1+LIFE.status()*.25)*(s.love?1.6:1));if(!WALLET.can(cost))return`Saldo insuficiente: a viagem custa R$ ${brl(cost)}.`;
      WALLET.add(-cost,s.love?`Férias com ${s.love.nm}`:'Férias');A.used[t]=A.used[t+1]=A.used[t+2]='ferias';CAL.advance(3);
      s.energy=100;S.burn=0;S.bw=0;LIFE.addMood(2);if(s.love)FAM.bond(s.love,12);LIFE.commit();return`🏖️ Três dias de praia${s.love?` com ${s.love.nm}`:''}. Você voltou zerado: energia cheia e cabeça fresca.`}
    return''},
  propEnd(){const S=this.st(),P=S.prop;if(!P)return;S.prop=null;const ch=P.prog>=P.need?.85:P.prog/P.need*.5,win=Math.random()<ch,b=LIVES.s.bots[P.n],me=CIRC.me();
    if(win){WALLET.add(P.stake,`Aposta com ${P.n}: ganhou`);if(b)b.bank-=P.stake;LIFE.addFame(.8);LIFE.addMood(1);LIFE.text(P.n,'Tá bom, tá bom. Você conseguiu. Te mando o dinheiro.');LIFE.note(P.emo,'Você ganhou a aposta!',`Conseguiu ${P.nm}. +R$ ${brl(P.stake)}.`)}
    else{WALLET.add(-P.stake,`Aposta com ${P.n}: perdeu`);if(b)b.bank+=P.stake;LIFE.addMood(-1);LIFE.text(P.n,'Hahaha falei que não dava. Pode mandar o Pix.');LIFE.note(P.emo,'Você perdeu a aposta',`Não deu pra ${P.nm}. −R$ ${brl(P.stake)}.`)}
    if(LIFE.s.fame>=15)CIRC.post({k:'bast',title:'',body:`Aposta paralela: ${me} ${win?'ganhou':'perdeu'} R$ ${brl(P.stake)} de ${P.n}. O desafio era ${P.nm}.`})},
  /* ---------- torneios: variância e satélites ---------- */
  onTour(o){const S=this.st(),s=LIFE.s;if(!CAL.on())return;if(o.prize>0||(o.place===1))S.dry=0;else S.dry++;
    const fr=LIVES.ALL().filter(n=>LIVES.s.bots[n]).sort((a,b)=>LIFE.rel(b)-LIFE.rel(a))[0];
    if(S.dry===5&&fr)LIFE.text(fr,'Cinco torneios sem premiar? Normal, cara. Só uns 15% do campo entra no dinheiro. Joga o teu jogo e cuida da banca.');
    if(S.dry===9){LIFE.addMood(-1);this.burnAdd(8);LIFE.note('📉','Downswing','Nove torneios seguidos sem premiar. Faz parte da variância, mas pesa. Pros fazem uma pausa, revisam mãos e descem de nível se a banca encolheu.')}
    if(WALLET.s.bal<EVTS.sabado.buy*20&&S.dry>=3&&!LIFE.daily('brm')){LIFE.mark('brm');LIFE.note('🏦','Gestão de banca','Seu saldo está abaixo de 20 buy-ins do Torneio de Sábado. Pros de torneio costumam ter 50 a 100 buy-ins. Talvez seja hora de jogar os menores.')}},
  onFinish(key,res){const A=CAL.st(),ev=CAL.byKey(key);if(!ev||!res||res.noshow)return;
    if(ev.E.sat&&res.place===1){const tk=ev.E.target,te=CAL.byKey(tk),r=A.reg[tk];let back='';if(r&&r.paid){WALLET.add(r.paid+(r.tr||0),'Reembolso: inscrição e viagem da etapa (ganhou o satélite)');back=' O que você tinha pago foi devolvido.'}
      A.reg[tk]={paid:0,ticket:true,buy:EVTS.etapa.buy};LIFE.note('🎫','Pacote garantido!',`Você ganhou o satélite: inscrição, passagem e hotel pro ${te?te.E.nm:'Circuito Nacional'} (${CAL.fmt(te?te.first:CAL.today(),true)}).${back}`);
      CIRC.post({k:'bast',title:'',body:`${CIRC.me()} ganhou o satélite e vai pro ${te?te.E.nm:'Circuito Nacional'} com tudo pago.`})}
    if(ev.id==='etapa'){LIFE.addFame(.3);LIVES.ALL().filter(n=>LIVES.s.bots[n]).sort(()=>Math.random()-.5).slice(0,3).forEach(n=>LIVES.relAdd(n,'Você',.3));LIFE.s.energy=Math.max(0,LIFE.s.energy-10);
      LIFE.note('🥳',`Players' party em ${this.city(ev.first)}`,'Depois do último dia, a festa dos jogadores: DJ, histórias de bad beat e contatos novos.')}
    LIFE.commit()},
  brm(E){const bi=WALLET.s.bal/E.buy,mtt=E.fmt==='mtt',ok=mtt?50:30,warn=mtt?20:12;return bi>=ok?['ok','banca ok']:bi>=warn?['warn','banca apertada']:['bad','fora da banca']},
  /* ---------- painel na agenda ---------- */
  panel(){const S=this.st(),A=CAL.st(),t=CAL.today(),s=LIFE.s;let h='';
    S.inv.forEach(x=>{const busy=x.t!=='prop'&&CAL.busy(x.day);
      const info=x.t==='prop'?`Até ${CAL.fmt(x.exp)} pra responder · precisa de ${PROPS.find(p=>p.k===x.k).need} dias de treino`:x.t==='whale'?`${CAL.fmt(x.day,true)} · R$ ${x.sk.sb}/${x.sk.bb}, buy-in R$ ${brl(x.sk.stack)} · com ${x.whale}, o "baleia"`:
        `${CAL.fmt(x.day,true)} · ${x.pay?`<span class="ok">cachê R$ ${brl(x.pay)}</span>`:x.cost?`<span class="bad">você paga R$ ${brl(x.cost)}</span>`:'entrada VIP'} · ${GIGS[x.t].desc}`;
      h+=`<div class="agrow"><div><span class="agemo">${x.emo}</span> <b>${lx(x.nm)}</b>${x.t==='prop'?` <span class="vtag">R$ ${brl(x.stake)}</span>`:''}<div class="muted" style="font-size:12px">${info}${busy?' · <span class="bad">você já tem algo nesse dia</span>':''}</div></div>
        <div class="agact"><button class="sm pri" data-ag="sx:acc:${x.id}">Aceitar</button> <button class="sm" data-ag="sx:dec:${x.id}">Recusar</button></div></div>`});
    if(S.prop){const P=S.prop;h+=`<div class="agrow"><div><span class="agemo">${P.emo}</span> <b>Aposta com ${lx(P.n)}</b> <span class="vtag">R$ ${brl(P.stake)}</span><div class="muted" style="font-size:12px">${P.nm} · treinos ${P.prog}/${P.need} · decide em ${CAL.fmt(P.end,true)}</div></div></div>`}
    const free=CLK.left()>=3;
    h+=`<div class="nsec" style="margin-top:10px">Dia livre</div>${free?`<div class="sxbtns"><button class="sm" data-ag="sx:rest">😴 Descansar</button><button class="sm" data-ag="sx:live">🎥 Fazer live</button>${S.prop?'<button class="sm" data-ag="sx:train">🏋️ Treinar pra aposta</button>':''}<button class="sm" data-ag="sx:trip">🏖️ Férias (3 dias)</button></div>`:`<div class="muted" style="font-size:13px">Já são ${CLK.fmt()}: não sobra tempo pra isso hoje.</div>`}
      <div class="muted" style="font-size:12px;margin-top:6px">Reputação com marcas: <b>${Math.round(S.rep)}</b> (${this.repTxt()}) · desgaste mental ${Math.round(S.burn)}% · canal com ${nf(S.subs)} inscritos. Quanto mais fama, mais convites: alguns pagam cachê, outros você paga pra estar lá.</div>`;
    return`<div class="panel"><h3>📨 Convites e vida de jogador</h3>${S.inv.length||S.prop?'':'<div class="muted" style="font-size:14px">Nenhum convite no momento.</div>'}${h}</div>`}};
/* ganchos */
(()=>{
  CAL.etapaStart=function(d){const t=this.date(d),x=new Date(t.getFullYear(),t.getMonth(),1,12);while(x.getDay()!==5)x.setDate(x.getDate()+1);x.setDate(x.getDate()+7);return Math.round((x.getTime()-LIVES.s.calStart)/864e5)+1};
  const _ev=CAL.events;CAL.events=function(d){const es=this.etapaStart(d);
    if(d>=es&&d<=es+1)return[{id:'etapa',key:'etapa@'+es,first:es,part:d-es,E:Object.assign({},EVTS.etapa,{nm:`Circuito Nacional · ${SOC.city(es)}`})}];
    const out=_ev.call(this,d);if(out.length&&out[0].id==='main')return out;
    const w=this.dow(d);if(w===2||w===4){let ne=null;for(const k of[0,20,40]){const e=this.etapaStart(d+k);if(e>d){ne=e;break}}
      if(ne&&ne-d<=12)out.push({id:'sat',key:'sat@'+d,first:d,part:0,E:Object.assign({},EVTS.sat,{nm:`Satélite · ${SOC.city(ne)}`,target:'etapa@'+ne})})}
    return out};
  const _fin=CAL.finish;CAL.finish=function(key,res){_fin.call(this,key,res);try{SOC.onFinish(key,res)}catch(e){}};
  const _miss=CAL.miss;CAL.miss=function(it){if(it.kind==='gig')return SOC.missGig(it);return _miss.call(this,it)};
  const _do=CAL.doItem;CAL.doItem=function(id){const A=this.st(),it=A.items.find(x=>x.id===id),t=this.today();
    if(it&&it.kind==='gig'&&it.status==='pending'&&it.day===t){{const tc=CLK.can(3,it.title);if(tc)return tc}const r=SOC.doGig(it);it.status='done';dayDid(t,'item'+id);CLK.add(3);LIFE.commit();LIVES.commit();return r.msg}
    const m=_do.call(this,id);if(it&&it.status==='done')try{SOC.afterItem(it)}catch(e){}return m};
  const _sd=CAL.startDay;CAL.startDay=function(d){_sd.call(this,d);try{SOC.daily(d)}catch(e){}};
  const _ed=CAL.endDay;CAL.endDay=function(d){_ed.call(this,d);try{const u=this.st().used[d];SOC.burnAdd(!u?-10:/@/.test(u)?2:-2)}catch(e){}};
  const _ot=LIFE.onTour;LIFE.onTour=function(o){_ot.call(this,o);try{SOC.onTour(o);this.commit()}catch(e){}};
  const _os=LIFE.onStart;LIFE.onStart=function(kind,mtt){_os.call(this,kind,mtt);if(!this.s||!CAL.on())return;try{if(kind==='tour'&&this.has('protetor'))this.addMood(1);SOC.burnAdd(kind==='tour'?(mtt?10:6):3);SOC.seen(kind==='tour'?'tour':'cash');this.commit()}catch(e){}};
  const _ca=LIFE.cardAdj;LIFE.cardAdj=function(){let v=_ca.call(this);try{if(this.s&&this.s.soc&&CAL.on()){const b=this.s.soc.burn;v-=b>=90?2:b>=70?1:0}}catch(e){}return Math.max(-2,v)};
})();

