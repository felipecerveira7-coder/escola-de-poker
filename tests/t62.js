// v60: torneios grandes (Nacional, Latino, Mundial)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 const sch=await p.evaluate(()=>{try{ttlClose()}catch(e){};const t=CAL.today(),o={};for(let d=t;d<t+420;d++)CAL.events(d).forEach(e=>{if(['nac','latam','mundial'].includes(e.id)&&!e.part)(o[e.id]=o[e.id]||[]).push(CAL.fmt(e.first,true)+' '+CAL.date(e.first).getFullYear());if(e.id==='sat'&&e.key.split('@')[2])o['sat_'+e.key.split('@')[2]]=(o['sat_'+e.key.split('@')[2]]||0)+1});return o});
 console.log(JSON.stringify(sch));
 // conflitos com main/etapa
 console.log('conflitos',await p.evaluate(()=>{const t=CAL.today();let c='';for(let d=t;d<t+800;d++){const ids=CAL.events(d).map(e=>e.id);for(const B of BIG.L){const s=BIG.start(B,d);if(s&&d>=s&&d<s+3){if(CAL.mainStart(d)&&d>=CAL.mainStart(d)&&d<=CAL.mainStart(d)+2)c+=' M'+CAL.fmt(d)+B.id;const es=CAL.etapaStart(d);if(d>=es&&d<=es+1)c+=' E'+CAL.fmt(d)+B.id}}}return c}));
 // Nacional: ir até 5 dias antes, inscrever, jogar
 const r=await p.evaluate(()=>{WALLET.s.bal=2e6;const t=CAL.today();let s=null;for(let d=t;d<t+200&&!s;d++){const e=CAL.events(d).find(x=>x.id==='nac'&&!x.part);if(e)s=e}LIVES.s.day=s.first;const m=CAL.register(s.key);return [s.key,m,CAL.events(s.first)[0].E.nm]});console.log('nac',JSON.stringify(r));
 const t0=Date.now();const st=await p.evaluate(k=>{const _n=PRESS.need;PRESS.need=()=>false;const m=CAL.play(k);PRESS.need=_n;return[m,TOUR.g&&TOUR.g.mtt.N,TOUR.g&&TOUR.g.mtt.tables.length,TOUR.g&&TOUR.g.mtt.pays.length,TOUR.prizeOf(1)]},r[0]);console.log('mesa',JSON.stringify(st),Date.now()-t0+'ms');
 await p.waitForTimeout(1500);await p.evaluate(()=>{const c=document.getElementById('cine');if(c)c.click()});
 // assistir rápido algumas mãos
 const t1=Date.now();await p.evaluate(()=>{TOUR.watch=true;const me=TOUR.g.players[0];me.out=true;me.stack=0;});
 for(let i=0;i<20;i++){await p.waitForTimeout(500);const a=await p.evaluate(()=>TOUR.g&&TOUR.aliveAll());if(i%5===0)console.log('vivos',a)}
 await p.screenshot({path:'g1.png'});
 // Mundial exige fama
 const mu=await p.evaluate(()=>{const t=CAL.today();let s=null;for(let d=t;d<t+300&&!s;d++){const e=CAL.events(d).find(x=>x.id==='mundial'&&!x.part);if(e)s=e}LIFE.s.fame=10;const save=LIVES.s.day;LIVES.s.day=s.first-3;const m=CAL.register(s.key);LIVES.s.day=save;return[m,s.E.nm,TOUR.prizeOf?1:0,Math.round(s.E.pays[0]*s.E.N*s.E.buy)]});console.log('mundial',JSON.stringify(mu));
 console.log('errors',errs);await b.close()})();
