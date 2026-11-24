// v62c: atraso em torneio inscrito, aviso antes do encontro, conserto do relógio
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{try{ttlClose()}catch(e){};WALLET.s.bal=90000;const t=CAL.today();let ev=null;for(let d=t;d<t+20&&!ev;d++)ev=CAL.events(d).find(e=>e.id==='main'&&!e.part);LIVES.s.day=ev.first;LIFE.s.hrDay=null;CLK.now();CAL.register(ev.key);
  const o=[];o.push('agora '+CLK.fmt()+' main às '+CLK.fmt(tStartH(ev)));
  LIFE.s.love={nm:'Paula',g:'f',age:30,b:50,id:'x1',emo:'👩',th:[],stage:'crush'};
  o.push('encontro 1: '+DATE.go('jantar').slice(0,60));
  o.push('encontro 2: '+(DATE.go('jantar')||'foi').slice(0,40)+' → '+CLK.fmt());
  try{DATE.finish&&DATE.finish()}catch(e){}
  o.push('aviso: '+LIFE.s.notes.slice(0,3).map(x=>x.title).join(' | '));
  // conserto único
  LIFE.s.fixDC1=0;LIFE.s.lastDate={d:CAL.today(),g:20};LIFE.s.hr=22;renderLife();o.push('relógio depois do conserto '+CLK.fmt());
  // atraso de 4h
  LIFE.s.hr=17;PRESS.need=()=>false;const m=CAL.play(ev.key);o.push('jogar atrasado: '+(m||'ok')+' fichas '+(TOUR.g&&TOUR.g.players[0].stack));
  return o});console.log(r.join('\n'));
 const r2=await p.evaluate(()=>{TOUR.stop&&TOUR.stop();TOUR.g=null;const t=CAL.today(),ev=CAL.events(t).find(e=>e.id==='main');delete CAL.st().done[ev.key];return['meia-noite e meia: '+(LIFE.s.hr=25,tLate(ev)||'ainda dá')]});console.log(r2.join('\n'));
 console.log('errors',errs);await b.close()})();
