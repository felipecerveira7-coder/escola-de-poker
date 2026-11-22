// v58: momentos de cinema
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 await p.evaluate(()=>{try{ttlClose()}catch(e){};WALLET.s.bal=900000});
 // mensagem chegando
 await p.evaluate(()=>{const n=Object.keys(LIVES.s.bots)[0];LIFE.text(n,'E aí, bora num cash hoje à noite?')});await p.waitForTimeout(600);
 console.log('notificacao',await p.evaluate(()=>document.querySelectorAll('.cntf').length));await p.screenshot({path:'k0.png'});
 // torneio heads-up
 await p.evaluate(()=>{location.hash='#torneio'});await p.waitForTimeout(500);
 const ok=await p.evaluate(()=>{try{TOUR.startGame({bots:1,stack:1500,hpl:10,sb:10,bb:20,levels:[[10,20,0]],structNm:'teste'});return true}catch(e){return e.message}});console.log('start',ok);
 await p.waitForTimeout(900);console.log('vs',await p.evaluate(()=>!!document.querySelector('#cine .cvs')));await p.screenshot({path:'k1.png'});
 await p.evaluate(()=>document.getElementById('cine')&&document.getElementById('cine').click());await p.waitForTimeout(500);
 await p.evaluate(()=>{const g=TOUR.g;g.mtt={state:{final:true},pays:[.5,.3,.2],N:9,buyin:100};g._cF=1;CINE.final(TOUR);g.mtt=null});await p.waitForTimeout(1600);await p.screenshot({path:'k2.png'});
 await p.evaluate(()=>document.getElementById('cine').click());await p.waitForTimeout(500);
 await p.evaluate(()=>CINE.champ(TOUR,12500));await p.waitForTimeout(1800);await p.screenshot({path:'k3.png'});
 await p.evaluate(()=>document.getElementById('cine').click());await p.waitForTimeout(900);console.log('jornal',await p.evaluate(()=>!!document.querySelector('#cine .cpaper')));await p.waitForTimeout(900);await p.screenshot({path:'k4.png'});
 await p.evaluate(()=>document.getElementById('cine').click());await p.waitForTimeout(500);
 await p.evaluate(()=>CINE.out(TOUR,7,0));await p.waitForTimeout(900);await p.screenshot({path:'k5.png'});
 console.log('errors',errs);await b.close()})();
