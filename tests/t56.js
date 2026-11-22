const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='warning'||m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);await p.evaluate(()=>{try{ttlClose()}catch(e){};WALLET.s.bal=500000;LIFE.s.fame=40;LIFE.s.love=null;LIFE.tab='namoro';renderLife()});
 await p.waitForTimeout(400);await p.screenshot({path:'m1.png'});
 console.log('deck',await p.evaluate(()=>MATCH.deck().list.map(x=>x.nm+'/'+x.job+'/'+x.age).join(', ')));
 // força matches
 await p.evaluate(()=>{const R=Math.random;Math.random=()=>0.01;window._R=R});
 await p.click('[data-mt="s|yes"]');await p.waitForTimeout(500);await p.screenshot({path:'m2.png'});
 console.log('dating',await p.evaluate(()=>LIFE.s.dating.length));
 await p.evaluate(()=>{Math.random=window._R});
 // swipe com arraste
 const box=await p.$('[data-mt="close"]');if(box)await box.click();await p.waitForTimeout(200);
 const c=await p.$('[data-mcard]');const bb=await c.boundingBox();await p.mouse.move(bb.x+150,bb.y+150);await p.mouse.down();await p.mouse.move(bb.x-80,bb.y+160,{steps:8});await p.mouse.up();await p.waitForTimeout(500);
 console.log('deck after drag',await p.evaluate(()=>MATCH.deck().list.length));
 await p.click('[data-mt="v|mat"]');await p.waitForTimeout(200);await p.screenshot({path:'m3.png'});
 const id=await p.evaluate(()=>LIFE.s.dating[0].id);await p.click(`[data-mt="o|${id}"]`);await p.waitForTimeout(300);
 console.log('focus',await p.evaluate(()=>LIFE.s.love&&LIFE.s.love.nm+' tab '+LIFE.tab+' open '+LIFE.open));await p.screenshot({path:'m4.png'});
 // apresentação
 const fr=await p.evaluate(()=>{const n=Object.keys(LIVES.s.bots)[0];LIVES.relAdd(n,'Você',2.5);LIFE.tab='namoro';MATCH.view='amg';renderLife();return n});
 await p.click(`[data-mt="i|${fr}"]`);await p.waitForTimeout(600);await p.screenshot({path:'m5.png'});
 console.log('intro',await p.evaluate(()=>JSON.stringify(LIFE.s.dnow&&{k:LIFE.s.dnow.k,n:LIFE.s.dnow.nm,log:LIFE.s.dnow.log[0].x.slice(0,160)})),'dating',await p.evaluate(()=>LIFE.s.dating.map(x=>x.nm).join(',')));
 await p.click('[data-d="end"]');await p.waitForTimeout(600);await p.screenshot({path:'m6.png'});
 console.log('dec buttons',await p.evaluate(()=>[...document.querySelectorAll('[data-dec]')].map(b=>b.textContent).join(' | ')));
 await p.click('[data-dec="stop"]');await p.waitForTimeout(300);console.log('after stop love',await p.evaluate(()=>String(LIFE.s.love&&LIFE.s.love.nm)));
 console.log('errors',errs);await b.close()})();
