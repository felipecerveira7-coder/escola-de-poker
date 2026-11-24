/* =============== v60: torneios grandes — Main Event Nacional, Campeonato Latino-Americano e Mundial em Las Vegas =============== */
/* premiação de campo grande: paga ~14% (15 lugares) */
const PAY108=[.264,.16,.115,.09,.07,.055,.045,.037,.03,.025,.025,.022,.022,.02,.02];
{const _p=CIRC.pays;CIRC.pays=function(of){return of>=60?PAY108.slice():_p.call(this,of)}}
/* Mundial: a sua chave tem 108 jogadores, mas a premiação é a de um campo de 8 mil (valores em R$) */
const MUNDIAL_R=[20e6,12e6,8e6,6e6,4.8e6,3.8e6,3e6,2.5e6,2e6,1.4e6,1.1e6,9e5,7.5e5,6e5,5e5,4.2e5,3.6e5,3e5];
EVTS.nac={nm:'Main Event Nacional',emo:'💎',fmt:'mtt',buy:10000,N:108,st:'ps',hpl:15,reg:21,days:3,stops:[7,13],travel:2500,
  desc:'O maior torneio do país, 4 vezes por ano em São Paulo: 108 jogadores em 3 dias e cerca de R$ 1 milhão de prêmio. Satélites de R$ 1 mil às quartas.'};
EVTS.latam={nm:'Campeonato Latino-Americano',emo:'🌎',fmt:'mtt',buy:29000,N:108,st:'ps',hpl:15,reg:30,days:3,stops:[7,13],travel:6000,minFame:35,
  desc:'Uma vez por ano em Punta del Este: US$ 5 mil de entrada (R$ 29 mil), 108 jogadores e mais de R$ 3 milhões de prêmio. Precisa de fama 35, ou entre pelo satélite.'};
EVTS.mundial={nm:'Mundial de Poker · Las Vegas',emo:'🥇',fmt:'mtt',buy:58000,N:108,st:'ps',hpl:15,reg:45,days:3,stops:[7,13],travel:15000,minFame:50,abs:MUNDIAL_R,
  desc:'O Main Event do Mundial, em julho: US$ 10 mil de entrada (R$ 58 mil). Você joga uma chave de 108, com a premiação de um campo de 8 mil: o campeão leva R$ 20 milhões e o bracelete. Fuso de 6 horas: chega cansado. Precisa de fama 50, ou entre pelo satélite.'};
EVTS.mundial.pays=MUNDIAL_R.map(v=>v/(EVTS.mundial.N*EVTS.mundial.buy));
const BIG={
  L:[{id:'nac',months:[2,5,8,11],wd:4,nth:3,city:'São Paulo',sat:{dow:3,buy:1000,nm:'Satélite Nacional'}},
     {id:'latam',months:[3],wd:1,nth:1,city:'Punta del Este',sat:{dow:1,buy:3000,nm:'Satélite Latino'}},
     {id:'mundial',months:[6],wd:1,nth:1,city:'Las Vegas',sat:{dow:0,buy:5000,nm:'Satélite online pro Mundial'}}],
  ids:['main','etapa','nac','latam','mundial'],
  /* dia do jogo em que começa o evento B no mês de d (ou null) */
  start(B,d){if(!isFinite(d))return null;const t=CAL.date(d),y=t.getFullYear(),m=t.getMonth();if(!B.months.includes(m))return null;const x=new Date(y,m,1,12);while(x.getDay()!==B.wd)x.setDate(x.getDate()+1);x.setDate(x.getDate()+7*(B.nth-1));let s=Math.round((x.getTime()-LIVES.s.calStart)/864e5)+1;const ms=CAL.mainStart(s);if(ms&&s+2>=ms&&s<=ms+2)s-=7;return s},
  next(B,d){for(let k=0;k<400;k+=20){const s=this.start(B,d+k);if(s&&s>d)return s}return null},
  ev(B,s,d){const E=EVTS[B.id];return{id:B.id,key:B.id+'@'+s,first:s,part:d-s,E:Object.assign({},E,{nm:B.id==='nac'?`${E.nm} · ${B.city}`:E.nm})}}};
{const _ev=CAL.events;CAL.events=function(d){for(const B of BIG.L){const s=BIG.start(B,d);if(s!=null&&d>=s&&d<s+EVTS[B.id].days)return[BIG.ev(B,s,d)]}
  const out=_ev.call(this,d);if(out.length&&out[0].id==='main')return out;const w=this.dow(d);
  BIG.L.forEach(B=>{if(w!==B.sat.dow)return;const ns=BIG.next(B,d);if(ns&&ns-d<=21)out.push({id:'sat',key:`sat@${d}@${B.id}`,first:d,part:0,E:Object.assign({},EVTS.sat,{nm:`${B.sat.nm} · ${CAL.fmt(ns)}`,emo:'🎫',buy:B.sat.buy,target:B.id+'@'+ns,desc:`Mesa única de 9. O campeão ganha o pacote do ${EVTS[B.id].nm}: inscrição, passagem e hotel (R$ ${brl(EVTS[B.id].buy+EVTS[B.id].travel)}). O 2º recebe a inscrição de volta.`})})});
  return out}}
/* fama mínima pros internacionais (o satélite dá o pacote sem exigir fama) */
{const _rg=CAL.register;CAL.register=function(key){const A=this.st(),ev=this.byKey(key);if(ev&&ev.E.minFame&&LIFE.s.fame<ev.E.minFame&&!(A.tick&&A.tick[key])&&!A.reg[key])return`O ${ev.E.nm} é por convite: precisa de fama ${ev.E.minFame} (você tem ${Math.round(LIFE.s.fame)}). Dá pra entrar ganhando um satélite.`;return _rg.apply(this,arguments)}}
/* chegada a Las Vegas: fuso pesa */
{const _pl=CAL.play;CAL.play=function(key){const ev=this.byKey(key),t=this.today();if(ev&&ev.id==='mundial'&&t===ev.first&&!(LIFE.s.jet===key)){LIFE.s.jet=key;LIFE.s.energy=Math.max(0,LIFE.s.energy-15);LIFE.note('✈️','Fuso horário em Las Vegas','Seis horas de diferença: você chegou cansado. −15 de energia.')}return _pl.apply(this,arguments)}}
/* título no Mundial vira bracelete na estante */
{const _fn=CAL.finish;CAL.finish=function(key,res){_fn.apply(this,arguments);try{const id=key.split('@')[0];if(BIG.ids.includes(id)&&id!=='main'&&id!=='etapa'&&res&&res.place){LIFE.addFame(res.place===1?(id==='mundial'?12:id==='latam'?7:4):res.prize?1.5:.5);
    if(res.place===1&&id==='mundial'){TROPH.st().push({k:'mundial',nm:'Main Event do Mundial (bracelete)',emo:'🥇',d:CAL.today()});CIRC.post({k:'vida',title:`${CIRC.me()} é campeão mundial!`,body:'Bracelete e R$ 20 milhões em Las Vegas. O poker brasileiro para pra comemorar.'})}
    else if(res.prize)CIRC.post({k:'vida',title:`${CIRC.me()} premia no ${EVTS[id].nm}`,body:`${res.place}º lugar e R$ ${brl(res.prize)}.`});LIFE.commit()}}catch(e){console.warn(e)}}}
/* ranking, imprensa e a tela inicial tratam os novos como grandes */
RK.EVC.nac='nac';RK.EVC.latam='latam';RK.EVC.mundial='mundial';RK.AN.nac=['Main Event Nacional',1];RK.AN.latam=['Campeonato Latino-Americano',1];RK.AN.mundial=['Main Event do Mundial',1];
{const _nd=PRESS.need;PRESS.need=function(key){return _nd.call(this,key)||['nac','latam','mundial'].includes(key.split('@')[0])}}
function bigIds(){return['main','etapa','nac','latam','mundial']}
/* completa o campo com jogadores de fora do circuito (cada evento grande tem gente de outras cidades e países) */
function fieldFill(pool,E){const need=E.N-1-pool.length;if(need<=0)return;const intl=E.buy>=20000,used=new Set(pool);
  const BR=['Marcos','Henrique','Vitor','Alan','Fernando','Ricardo','Diego','Murilo','Thiago','Bruna','Juliana','Daniela','Rafael','Leonardo','Gabriela','Kauã','Pietro','Otávio','Renan','Isabela','Caio','Heitor','Lívia','Arthur','Nicolas','Sofia','Enzo','Rodrigo','Hugo','Valéria'];
  const UF=['SP','RJ','MG','PR','SC','BA','PE','CE','DF','GO','ES','RS'];
  const IN=['Daniel','Erik','Phil','Justin','Fedor','Adrian','Stephen','Bryn','Isaac','Mikita','Jason','Alex','Maria','Liv','Vanessa','Kristen','Sam','Ole','Timo','Jonathan','Paul','Nick','Igor','Elky','Chris','Mike','Joao','Santiago','Mateo','Lucas'];
  const CO=['EUA','Canadá','Alemanha','Reino Unido','Argentina','Uruguai','Chile','México','Espanha','França','Rússia','Japão','Coreia','Bulgária','Suécia','Holanda','Portugal','Colômbia','Peru','Austrália'];
  for(let i=0;pool.length<E.N-1&&i<4000;i++){const a=intl&&Math.random()<.75?pickA(IN):pickA(BR),b=intl&&Math.random()<.75?pickA(CO):pickA(UF),n=`${a} (${b})`;if(!used.has(n)){used.add(n);pool.push(n)}}
  pool.sort(()=>Math.random()-.5)}
['Bruna','Juliana','Daniela','Gabriela','Isabela','Sofia','Lívia','Valéria','Maria','Vanessa','Kristen','Liv'].forEach(n=>FEM.add(n));{const _f=FACE.isF;FACE.isF=function(n){return _f.call(this,String(n).split(' (')[0])}}
/* painel na Agenda: a escada dos grandes do ano */
function bigPanel(){if(!window.__bigOk)return'';try{const t=CAL.today(),A=CAL.st();const L=[{id:'main',next:()=>{for(let d=t;d<t+40;d++){const ms=CAL.mainStart(d);if(ms&&ms>=t)return ms}return null}},{id:'etapa',next:()=>{for(const k of[0,20,40]){const e=CAL.etapaStart(t+k);if(e>=t)return e}return null}},...BIG.L.map(B=>({id:B.id,next:()=>{const s=BIG.start(B,t);return s&&s+EVTS[B.id].days>t?s:BIG.next(B,t)}}))];
    const rows=L.map(x=>{const s=x.next();if(!s)return'';const ev=CAL.events(s).find(e=>e.id===x.id);if(!ev)return'';const E=ev.E,r=A.reg[ev.key],open=CAL.regOpen(ev),pool=E.abs?E.abs.reduce((a,v)=>a+v,0):E.buy*E.N,first=E.abs?E.abs[0]:Math.round(E.buy*E.N*CIRC.pays(E.N)[0]),lock=E.minFame&&LIFE.s.fame<E.minFame&&!r;
      const st=r?'<span class="ok">✓ inscrito</span>':open?(lock?`<span class="bad">fama ${E.minFame} ou satélite</span>`:`<button class="sm pri" data-ag="reg:${ev.key}">Inscrever · R$ ${brl(E.buy+(E.travel||0))}</button>`):`<span class="muted">inscrições a partir de ${CAL.fmt(ev.first-E.reg)}</span>`;
      return`<div class="agrow bigrow"><div><span class="agemo">${E.emo}</span> <b>${E.nm}</b> <span class="vtag">${CAL.fmt(s)}${s-t>0?` · em ${s-t} dias`:' · hoje'}</span><div class="muted" style="font-size:12px">Entrada R$ ${brl(E.buy)}${E.travel?` + viagem R$ ${brl(E.travel)}`:''} · ${E.abs?'campo de 8 mil jogadores':`prêmio total R$ ${pool>=1e6?(pool/1e6).toFixed(1).replace('.',',')+' milhões':brl(pool)}`} · 1º leva R$ ${first>=1e6?(first/1e6).toFixed(1).replace('.',',')+' mi':brl(first)}</div></div><div class="agact">${st}</div></div>`}).join('');
    return`<div class="panel"><h3>💎 Os grandes do ano</h3>${rows}<p class="muted" style="font-size:12px;margin:6px 0 0">Os satélites aparecem na agenda nas semanas antes de cada um: o campeão ganha inscrição, passagem e hotel.</p></div>`}catch(e){console.warn(e);return''}}
window.__bigOk=true;try{if(!TOUR.g&&CAL.on())TOUR.render()}catch(e){}
