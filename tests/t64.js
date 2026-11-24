// v62: dia por horas e energia
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{try{ttlClose()}catch(e){};WALLET.s.bal=50000;LIFE.s.energy=90;const o=[];const t=CAL.today();
  o.push('inicio '+CLK.fmt());o.push(SOC.act('live').slice(0,30)+' → '+CLK.fmt());o.push(SOC.act('rest').slice(0,30)+' → '+CLK.fmt());
  const ev=CAL.events(t)[0];o.push('torneio de hoje '+ev.E.nm+' às '+CLK.fmt(tStartH(ev)));const m=CAL.register(ev.key);o.push('inscrição: '+(CAL.st().reg[ev.key]?'ok':m));
  o.push('play: '+(CAL.play(ev.key)||'ok')+' → '+CLK.fmt());return o});console.log(r.join('\n'));
 await p.waitForTimeout(500);
 const r2=await p.evaluate(()=>{TOUR.stop&&TOUR.stop();TOUR.g=null;CAL.advance(1);const t=CAL.today(),o=[];CLK.to(23.5);const ev=CAL.events(t)[0];o.push(ev.E.nm+' às '+CLK.fmt(tStartH(ev))+' · agora '+CLK.fmt());o.push('tarde: '+CAL.register(ev.key));o.push('live tarde: '+SOC.act('live'));return o});console.log(r2.join('\n'));
 await p.evaluate(()=>{location.hash='#torneio'});await p.waitForTimeout(500);await p.screenshot({path:'h1.png'});
 console.log('errors',errs);await b.close()})();
