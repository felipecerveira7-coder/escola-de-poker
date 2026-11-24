// v62e: torneio de vários dias sem spoiler e agenda depois de cair
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{try{ttlClose()}catch(e){};const t=CAL.today();let ev=null;for(let d=t;d<t+20&&!ev;d++)ev=CAL.events(d).find(e=>e.id==='main'&&!e.part);LIVES.s.day=ev.first;
  const A=CAL.st();A.reg[ev.key]={paid:3000,buy:3000};const save=TOUR.g;TOUR.g={ev:{key:ev.key}};
  CIRC.article({nm:ev.E.nm,of:45,buy:3000,pays:CIRC.pays(45),res:[{name:'Simone',place:1},{name:'Bruno',place:2},{name:'Você',place:41}]});CAL.finish(ev.key,{place:41,of:45,prize:0});TOUR.g=save;
  const o=[];o.push('hoje: '+LIVES.s.news[0].title);o.push('fila '+LIVES.s.newsQ.length);
  CAL.advance(1);o.push('dia 2: '+LIVES.s.news.filter(x=>x.k==='tour').length+' resultado(s) · fila '+LIVES.s.newsQ.length);
  CAL.advance(1);o.push('dia 3: '+(LIVES.s.news.find(x=>x.k==='tour')||{}).title+' · fila '+LIVES.s.newsQ.length);
  return o});console.log(r.join('\n'));
 const r2=await p.evaluate(()=>{LIVES.s.day-=1;location.hash='#torneio';return 1});await p.waitForTimeout(600);
 console.log(await p.evaluate(()=>(document.body.innerText.match(/você caiu[^\n]*/)||['sem'])[0]));
 console.log('errors',errs);await b.close()})();
