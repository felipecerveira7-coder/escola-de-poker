const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);await p.evaluate(()=>{try{ttlClose()}catch(e){}});
 await p.evaluate(()=>{const A=LIVES.ALL().filter(n=>LIVES.s.bots[n]);const n=A[1],b=LIVES.s.bots[n];b.res={tours:23,wins:3,itm:9,profit:18450};b.pod=5;b.bank=184000;LIVES.relAdd(n,A[2],3);LIVES.relAdd(n,A[3],-3);LIVES.relAdd(n,'Você',2.2);LIVES.note(n,'Brigou com o dono do bar.');
   CIRC.post({k:'vida',title:`${n} crava o Turbo de sábado`,body:'Venceu com um full house no river.'});LIFE.tab='cel';LIFE.open=null;renderLife();window.__n=n});
 await p.waitForTimeout(300);
 const n=await p.evaluate(()=>window.__n);
 await p.click(`.pfi[data-pf="${n}"]`);await p.waitForTimeout(300);await p.screenshot({path:'bp1.png'});
 console.log('opened',await p.evaluate(()=>!!document.getElementById('bpOv')),'chat opened?',await p.evaluate(()=>LIFE.open));
 const fr=await p.$('#bpOv .pfl');if(fr){await fr.click();await p.waitForTimeout(200);console.log('friend ->',await p.evaluate(()=>document.querySelector('#bpOv b').textContent))}
 await p.click('#bpOv [data-bp="msg"]');await p.waitForTimeout(300);console.log('msg ->',await p.evaluate(()=>LIFE.open),!!(await p.$('#bpOv')));
 await p.click('[data-pf]');await p.waitForTimeout(200);console.log('header opens',!!(await p.$('#bpOv')));
 await p.evaluate(()=>BOTP.close());
 await p.evaluate(()=>{location.hash='#jogar'});await p.waitForTimeout(500);
 console.log('table pf',await p.evaluate(()=>document.querySelectorAll('.pname[data-pf]').length));
 console.log('errors',errs);await b.close()})();
