// v68: fichas de torneio realistas
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{try{ttlClose()}catch(e){};WALLET.s.bal=500000;const o=[];
  ['noite','turbo','sabado','domingo','main','etapa','nac','latam','mundial'].forEach(k=>{const E=EVTS[k];o.push(k+': '+E.st+' · '+stTxt(E)+' · R$ '+E.buy)});
  o.push('kf: '+[45300,152400,999999,1250000,40000000].map(kf).join(' | '));
  const t=CAL.today();let ev=null;for(let d=t;d<t+40&&!ev;d++)ev=CAL.events(d).find(e=>e.id==='main'&&!e.part);LIVES.s.day=ev.first;LIFE.s.hrDay=null;CLK.now();CAL.register(ev.key);LIFE.s.hr=13;PRESS.need=()=>false;
  const m=CAL.play(ev.key);const g=TOUR.g;o.push('main: '+(m||'ok')+' stack '+g.players[0].stack+' blinds '+g.sb+'/'+g.bb+' ante '+(g.levels[0][2])+' '+g.anteType+' outras mesas '+g.mtt.tables[0].ps[0].stack);
  return o});console.log(r.join('\n'));
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#torneio');await p.waitForTimeout(1500);
 for(let i=0;i<20;i++){const done=await p.evaluate(()=>{const g=TOUR.g;if(!g)return 'sem jogo';if(g.toAct===0&&!g.over){TOUR.act&&TOUR.act('fold');}return g.hands});await p.waitForTimeout(600)}
 console.log('mesa', await p.evaluate(()=>[...document.querySelectorAll('.pstack')].slice(0,3).map(x=>x.textContent).join(' | ')+' · '+((document.querySelector('.ppot')||{}).textContent||'')));
 await p.screenshot({path:'fichas.png'});console.log('errors',errs);await b.close()})();
