/* ===================== CALENDÁRIO E AGENDA ===================== */
const WD=['dom','seg','ter','qua','qui','sex','sáb'],WDL=['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
const EVTS={
  noite:{nm:'Sit & Go da Noite',emo:'🌙',fmt:'sng',buy:50,N:9,st:'turbo',hpl:8,reg:1,dows:[1,2,4,5],desc:'Mesa única de 9 no clube, rápido. Paga os 3 primeiros.'},
  turbo:{nm:'Turbo de Quarta',emo:'⚡',fmt:'mtt',buy:200,N:18,st:'turbo',hpl:8,reg:3,dows:[3],desc:'Duas mesas, blinds rápidos.'},
  sabado:{nm:'Torneio de Sábado',emo:'🏆',fmt:'mtt',buy:1000,N:27,st:'ps',hpl:12,reg:5,dows:[6],desc:'O torneio grande da semana: três mesas, estrutura padrão.'},
  domingo:{nm:'Deep Stack de Domingo',emo:'🌊',fmt:'mtt',buy:500,N:27,st:'ps',hpl:15,reg:4,dows:[0],desc:'Muitas fichas e blinds lentos: jogo técnico.'},
  main:{nm:'Main Event do Circuito',emo:'👑',fmt:'mtt',buy:3000,N:45,st:'ps',hpl:15,reg:14,days:3,stops:[6,12],desc:'O maior do mês: 45 jogadores em 3 dias (Dia 1, Dia 2 e Mesa Final), na última sexta, sábado e domingo do mês.'}};
const FAMN={m:['Ana','Cláudia','Rosa','Márcia','Lúcia','Vera','Sandra'],p:['Carlos','Jorge','Luiz','Paulo','Sérgio','Roberto','Antônio'],irmao:['Bruno','Lucas','Rafael','Matheus','Gabriel'],irma:['Júlia','Camila','Bianca','Carol','Letícia']};
const LOVEN={f:['Marina','Bruna','Luiza','Paula','Isadora','Carolina','Renata','Aline','Beatriz','Larissa','Manuela'],m:['Pedro','Thiago','Rodrigo','Felipe','André','Gustavo','Vinícius','Henrique','Eduardo','Leonardo']};
const LOVEJ=['designer','enfermeira(o)','professora(o)','advogada(o)','dentista','jornalista','engenheira(o)','fotógrafa(o)','veterinária(o)','chef de cozinha'];
const CAL={
  on(){return CAR.id!=='qp'},
  st(){const s=LIFE.s;s.ag=s.ag||{items:[],reg:{},done:{},used:{},ann:{},seq:1};
    if(!LIVES.s.calStart){const t=new Date();t.setHours(12,0,0,0);LIVES.s.calStart=t.getTime()-((LIVES.s.day||1)-1)*864e5}return s.ag},
  today(){return LIVES.s.day},
  date(d){this.st();return new Date(LIVES.s.calStart+(d-1)*864e5)},
  dow(d){return this.date(d).getDay()},
  fmt(d,long){const t=this.date(d);return`${(long?WDL:WD)[t.getDay()]}, ${String(t.getDate()).padStart(2,'0')}/${String(t.getMonth()+1).padStart(2,'0')}`},
  rel(d){const k=d-this.today();return k===0?'hoje':k===1?'amanhã':k===-1?'ontem':''},
  /* Main Event: última sexta, sábado e domingo do mês */
  mainStart(d){const t=this.date(d),y=t.getFullYear(),m=t.getMonth(),last=new Date(y,m+1,0,12);while(last.getDay()!==0)last.setDate(last.getDate()-1);
    const fri=new Date(last);fri.setDate(last.getDate()-2);if(fri.getMonth()!==m)return null;return Math.round((fri.getTime()-LIVES.s.calStart)/864e5)+1},
  events(d){const out=[],ms=this.mainStart(d);
    if(ms&&d>=ms&&d<=ms+2){out.push({id:'main',key:'main@'+ms,first:ms,part:d-ms,E:EVTS.main});return out}
    const w=this.dow(d);['noite','turbo','sabado','domingo'].forEach(id=>{if(EVTS[id].dows.includes(w))out.push({id,key:id+'@'+d,first:d,part:0,E:EVTS[id]})});return out},
  regOpen(ev){const t=this.today();return t>=ev.first-ev.E.reg&&t<=ev.first},
  items(d){return this.st().items.filter(x=>x.day===d&&x.status==='pending')},
  busy(d){const A=this.st();if(A.used[d])return true;if(this.items(d).length)return true;return this.events(d).some(e=>A.reg[e.key]&&!A.done[e.key])},
  free(from,to){for(let d=from;d<=(to||from+10);d++)if(!this.busy(d))return d;return null},
  add(it){const A=this.st();it.id=A.seq++;it.status='pending';A.items.push(it);if(A.items.length>120)A.items=A.items.filter(x=>x.status==='pending'||x.day>=this.today()-7);return it},
  /* inscrição e torneio */
  register(key){const A=this.st(),ev=this.byKey(key);if(!ev||A.reg[key])return'';if(!this.regOpen(ev))return'Inscrições fechadas.';
    if(A.tick&&A.tick[key]){delete A.tick[key];A.reg[key]={paid:0,ticket:true,buy:ev.E.buy};LIFE.commit();return`Inscrito no ${ev.E.nm} com o pacote do satélite.`}
    const buy=ev.E.buy,stk=SCOUT.staked(buy),tr=ev.E.travel||0;if(!WALLET.can((stk?0:buy)+tr))return tr?`Saldo insuficiente: inscrição + viagem e hotel = R$ ${brl((stk?0:buy)+tr)}.`:`Saldo insuficiente: o buy-in é R$ ${brl(buy)}.`;const bw=SOC.brm(ev.E);
    if(tr)WALLET.add(-tr,`Passagem e hotel: ${ev.E.nm}`);
    if(stk)WALLET.add(0,`Inscrição: ${ev.E.nm} (buy-in de R$ ${brl(buy)} pago pela ${SCOUTS.stake.org})`);else WALLET.add(-buy,`Inscrição: ${ev.E.nm} (${this.fmt(ev.first)})`);
    A.reg[key]={paid:stk?0:buy,staked:stk,buy,tr};const clash=this.items(ev.first);LIFE.commit();
    return`Inscrito no ${ev.E.nm}.${clash.length?` Atenção: nesse dia você também tem "${clash[0].title}". Só dá pra fazer uma coisa por dia.`:''}${!stk&&bw[0]!=='ok'?` ⚠️ Gestão de banca: esse buy-in é ${bw[0]==='bad'?'grande demais':'pesado'} pro seu saldo. Pros de torneio costumam ter de 50 a 100 buy-ins guardados.`:''}`},
  unregister(key){const A=this.st(),r=A.reg[key],ev=this.byKey(key);if(!r||A.done[key]||!ev||this.today()>=ev.first)return;if(r.paid)WALLET.add(r.paid,`Inscrição cancelada: ${ev.E.nm}`);delete A.reg[key];LIFE.commit()},
  byKey(key){const[id,f]=key.split('@'),d=+f;return this.events(d).find(e=>e.key===key)||null},
  play(key){const A=this.st(),ev=this.byKey(key),t=this.today();if(!ev)return'Evento não encontrado.';
    const part=t-ev.first;if(part<0||part>=(ev.E.days||1))return'Não é o dia desse torneio.';
    if(A.used[t]&&A.used[t]!==key)return'Você já usou o dia de hoje com outra coisa. Avance o calendário.';
    if(!A.reg[key]){if(!this.regOpen(ev))return'Inscrições fechadas.';const m=this.register(key);if(!A.reg[key])return m}
    if(A.done[key])return'Você já jogou esse torneio.';
    if(part>0){if(TOUR.g&&TOUR.g.ev&&TOUR.g.ev.key===key){A.used[t]=key;TOUR.g.ev.idx=part;TOUR.g.paused=false;location.hash='#torneio';TOUR.log(`<div class="lh lvl">☀️ Dia ${part+1} do ${ev.E.nm}. Fichas desensacadas: ${nf(TOUR.g.players[0].stack)}.</div>`);TOUR.save();TOUR.startHand();return''}
      const sv=SAVES.data.tour;if(sv&&sv.ev&&sv.ev.key===key){A.used[t]=key;location.hash='#torneio';TOUR.resume(sv);TOUR.g.ev.idx=part;TOUR.g.paused=false;TOUR.startHand();return''}
      return'Você não está mais nesse torneio.'}
    if(TOUR.g&&!TOUR.g.finished&&!(TOUR.g.players[0]&&TOUR.g.players[0].out))return'Termine o torneio em andamento primeiro.';
    if(SAVES.data.tour&&!(TOUR.g&&TOUR.g.finished))SAVES.del('tour');
    A.used[t]=key;LIFE.commit();location.hash='#torneio';TOUR.startEvent(ev,A.reg[key]);return''},
  finish(key,res){const A=this.st();A.done[key]=res;LIFE.commit()},
  /* passagem do tempo */
  blockers(){try{return this._blk()}catch(e){return''}},
  _blk(){if(TOUR.g&&!TOUR.g.finished&&!TOUR.g.paused&&!(TOUR.g.players[0]&&TOUR.g.players[0].out))return'Termine o torneio de hoje antes de avançar o dia.';
    const sv=SAVES.data&&SAVES.data.tour;if(!TOUR.g&&sv&&sv.ev&&!sv.paused&&!sv.prizePaid&&!(sv.players&&sv.players[0]&&sv.players[0].out))return`Você está no meio do ${sv.ev.nm}. Volte à mesa e termine antes de avançar o dia.`;
    if(CASH.g&&CASH.g.home)return'Termine o home game antes de avançar o dia.';const sc=SAVES.data&&SAVES.data.cash;if(!CASH.g&&sc&&sc.home)return'Você tem um home game em andamento. Volte à mesa e termine antes de avançar o dia.';return''},
  advance(n,untilNext){if(!this.on())return'';const b=this.blockers();if(b)return b;let k=0;LIFE.sync();
    for(;k<(n||1);k++){this.endDay(this.today());LIVES.day();LIVES.s.lastTick=Date.now();this.startDay(this.today());
      if(untilNext&&(this.items(this.today()).length||this.events(this.today()).some(e=>this.st().reg[e.key]&&!this.st().done[e.key])))break}
    LIVES.commit();LIFE.sync();LIFE.commit();try{CAR.touch()}catch(e){}
    if(TOUR.g&&TOUR.g.finished){TOUR.g=null;TOUR.resetUI()}TOUR.render();return''},
  endDay(d){const A=this.st(),me=CIRC.me();
    this.events(d).forEach(ev=>{const r=A.reg[ev.key];
      if(r&&!A.done[ev.key]){const lastDay=ev.first+(ev.E.days||1)-1,inGame=TOUR.g&&TOUR.g.ev&&TOUR.g.ev.key===ev.key;
        if(inGame&&TOUR.g.paused&&d<lastDay&&TOUR.g.ev.idx===d-ev.first){}/* ensacado: segue amanhã */
        else if(inGame&&TOUR.g.paused){const alive=TOUR.aliveAll?TOUR.aliveAll():9;A.done[ev.key]={place:alive,of:ev.E.N,prize:0,noshow:true};TOUR.stop();TOUR.g=null;SAVES.del('tour');LIFE.note('🚫',`Você não voltou para o ${ev.E.nm}`,'Suas fichas foram retiradas da mesa e você foi eliminado.')}
        else if(!inGame&&d===ev.first){const sv=SAVES.data.tour;if(!(sv&&sv.ev&&sv.ev.key===ev.key)){A.done[ev.key]={noshow:true};LIFE.note('🚫',`Você faltou ao ${ev.E.nm}`,r.paid?`Perdeu a inscrição de R$ ${brl(r.paid)}.`:'A banca não gostou.')}}}
      if(d===ev.first+(ev.E.days||1)-1&&!(A.done[ev.key]&&!A.done[ev.key].noshow)&&(ev.id!=='noite'||Math.random()<.25))try{CIRC.community({nm:ev.E.nm,buy:ev.E.buy,f:[ev.E.N]})}catch(e){}});
    this.items(d).forEach(it=>{it.status='missed';this.miss(it)})},
  startDay(d){const A=this.st();
    [...Array(15).keys()].forEach(k=>this.events(d+k).forEach(ev=>{if(ev.part)return;const open=ev.first-ev.E.reg;if(open===d&&ev.E.buy>=200&&!ev.E.sat&&!A.ann[ev.key]){A.ann[ev.key]=1;
      LIFE.note(ev.E.emo,`Inscrições abertas: ${ev.E.nm}`,`${this.fmt(ev.first,true)}${ev.E.days?` a ${this.fmt(ev.first+ev.E.days-1)}`:''} · buy-in R$ ${brl(ev.E.buy)} · ${ev.E.N} jogadores · prêmio total R$ ${brl(ev.E.buy*ev.E.N)}. Inscreva-se na Agenda.`)}}));
    this.events(d).forEach(ev=>{if(A.reg[ev.key]&&!A.done[ev.key])LIFE.note('📅',`Hoje: ${ev.E.nm}${ev.E.days?` (Dia ${ev.part+1})`:''}`,'Boa sorte. O torneio está na Agenda.')});
    this.items(d).forEach(it=>LIFE.note(it.emo,`Hoje: ${it.title}`,it.desc||''));
    this.genLife(d);this.genSponsor(d);FAM.daily(d)},
  /* compromissos: o que acontece quando você faz ou falta */
  doItem(id){const A=this.st(),it=A.items.find(x=>x.id===id),t=this.today();if(!it||it.status!=='pending'||it.day!==t)return'';
    if(A.used[t])return'Você já usou o dia de hoje. Só dá pra fazer uma coisa por dia.';
    let msg='';const R=it.ref||{};
    if(it.kind==='hg'){const e=HG.start(R);if(e)return e}
    if(it.kind==='hgv'){const e=HG.start(R);if(e)return e}
    if(it.kind==='meet'){msg=SCOUT.meet(R)}
    if(it.kind==='lesson'){SCOUT.lessonRun().then(m=>{LIFE.flash=m;if(location.hash==='#vida')renderLife()});msg='📘 Aula em andamento…'}
    if(it.kind==='mkt'){const sp=LIFE.spById((it.ref||{}).sp)||LIFE.s.sp;LIFE.addFame(1);if(sp){sp.done.post=(sp.done.post||0)+1;sp.mkt=(sp.mkt||0)+1}msg=`📸 ${it.title}: fotos feitas, marca feliz. Conta como post do contrato.`}
    if(it.kind==='fam'||it.kind==='love'||it.kind==='life'){msg=FAM.doItem(it)}
    it.status='done';A.used[t]='item'+id;LIFE.commit();LIVES.commit();return msg},
  miss(it){const R=it.ref||{};
    if(it.kind==='meet')LIFE.note(SCOUTS[R.k].emo,`Você faltou à reunião com ${SCOUTS[R.k].nm}`,'A proposta foi embora junto.');
    if(it.kind==='mkt'){const sp=LIFE.spById((it.ref||{}).sp)||LIFE.s.sp;LIFE.addFame(-1);if(sp){sp.miss=(sp.miss||0)+1;if(sp.miss>=2){LIFE.dropSp(sp.id);LIFE.relSp(sp.id);LIFE.note(sp.emo,`${sp.nm} encerrou o contrato`,'Duas ações de marketing perdidas.')}else LIFE.note(sp.emo,`Você faltou à ação da ${sp.nm}`,'Mais uma falta e o contrato cai.')}}
    if(it.kind==='hgv'&&LIVES.s.bots[R.host]){LIVES.relAdd(R.host,'Você',-.8);LIFE.text(R.host,'Ué, não veio? Ficou todo mundo te esperando.')}
    if(it.kind==='hg')(R.guests||[]).forEach(n=>{LIVES.relAdd(n,'Você',-.6);LIFE.text(n,'Cancelou o home game em cima da hora? Poxa.')});
    if(it.kind==='lesson')LIFE.note('📘','Você faltou à aula','O professor cobrou mesmo assim.');
    if(it.kind==='fam'||it.kind==='love'||it.kind==='life')FAM.miss(it)},
  cancel(id){const it=this.st().items.find(x=>x.id===id);if(!it||it.status!=='pending')return;it.status='missed';this.miss(it);LIFE.commit()},
  genSponsor(d){LIFE.sps().forEach(sp=>{if(this.st().items.some(x=>x.kind==='mkt'&&x.status==='pending'&&((x.ref&&x.ref.sp)||(LIFE.s.sp&&LIFE.s.sp.id))===sp.id))return;if(sp.nextMkt&&d<sp.nextMkt)return;
    const day=this.free(d+2,d+8);if(!day)return;sp.nextMkt=day+6+LIFE.sps().length;this.add({kind:'mkt',day,emo:sp.emo,title:`Ação de marketing da ${sp.nm}`,desc:'Fotos e vídeo com o patch. Faltar duas vezes derruba o contrato.',ref:{sp:sp.id}});
    LIFE.note(sp.emo,`Compromisso marcado: ação da ${sp.nm}`,`${this.fmt(day,true)}. Está na Agenda.`)})},
  genLife(d){if(Math.random()>.22||this.st().items.some(x=>x.kind==='life'&&x.status==='pending'))return;const day=this.free(d+2,d+6);if(!day)return;const fr=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&LIFE.rel(n)>=1);
    const T=[{title:'Evento beneficente do clube',emo:'🎗️',ref:{fx:'charity'},desc:'Torneio de caridade com a comunidade. Custa R$ 200 e dá boa imagem.'}];
    if(fr.length){const n=pickA(fr);T.push({title:`Aniversário de ${n}`,emo:'🎂',ref:{fx:'bday',n},desc:`Churrasco na casa de ${n}. Faltar pega mal.`})}
    if(LIFE.s.fame>=15)T.push({title:'Gravação de podcast de poker',emo:'🎙️',ref:{fx:'pod'},desc:'Um podcast quer você como convidado. Bom pra fama.'});
    if(LIFE.s.cars.length)T.push({title:'Revisão do carro',emo:'🔧',ref:{fx:'car'},desc:'Se faltar, o conserto sai mais caro depois.'});
    const x=pickA(T);this.add(Object.assign({kind:'life',day},x));LIFE.note(x.emo,`Compromisso: ${x.title}`,`${this.fmt(day,true)}. Está na Agenda.`)}};

