const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='warning'||m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);await p.evaluate(()=>{try{ttlClose()}catch(e){};WALLET.s.bal=65400000;LIFE.s.items.push('bone','oculos','terno','jaqueta','moletom','rolex','patek','corrente','nicho','jordan');LIFE.s.look=null;HUD.last='';renderLife()});
 await p.waitForTimeout(500);await p.screenshot({path:'u1.png'});
 console.log('tab',await p.evaluate(()=>LIFE.tab),'hud',await p.evaluate(()=>!!document.getElementById('hud')&&getComputedStyle(document.getElementById('hud')).display));
 await p.evaluate(()=>{CITY.set(false);renderLife()});await p.click('[data-vg="pessoas"]');await p.waitForTimeout(300);console.log('tab after group',await p.evaluate(()=>LIFE.tab));await p.screenshot({path:'u2.png'});
 await p.click('[data-vt="cel"]');await p.waitForTimeout(200);
 await p.evaluate(()=>OUT.open());await p.waitForTimeout(300);await p.screenshot({path:'u3.png'});
 await p.click('#clOv [data-cl="tab|role"]');await p.waitForTimeout(200);await p.click('#clOv [data-cl^="role|tronco|terno"]');await p.waitForTimeout(200);await p.screenshot({path:'u4.png'});
 await p.click('#clOv [data-cl="tab|av"]');await p.waitForTimeout(200);await p.click('#clOv [data-cl="av|cab|cacheado"]');await p.click('#clOv [data-cl="av|barba|cheia"]');await p.waitForTimeout(200);await p.screenshot({path:'u5.png'});
 console.log('look',await p.evaluate(()=>JSON.stringify(LIFE.s.look)));
 await p.click('#clOv [data-cl="x"]');await p.waitForTimeout(200);
 await p.evaluate(()=>{LIFE.flash='Teste de aviso flutuante funcionando.';renderLife()});await p.waitForTimeout(300);await p.screenshot({path:'u6.png'});
 console.log('toast',await p.evaluate(()=>document.getElementById('toast')&&document.getElementById('toast').className));
 await p.evaluate(()=>{LIFE.tab='hoje';renderLife()});await p.click('#hud .hu-av');await p.waitForTimeout(200);console.log('hdr open',await p.evaluate(()=>LIFE.hdrOpen));
 // mesa
 await p.evaluate(()=>{location.hash='#jogar'});await p.waitForTimeout(400);await p.click('#cashRoot [data-r="bStart"]');await p.waitForTimeout(1500);await p.screenshot({path:'u7.png'});
 console.log('deal cards',await p.evaluate(()=>document.querySelectorAll('#cashRoot .card.deal').length));
 for(const t of ['casa','legado','loja','pat','midia','fam']){await p.evaluate(t=>{location.hash='#vida';LIFE.tab=t;renderLife()},t);await p.waitForTimeout(120)}
 console.log('errors',errs);await b.close()})();
