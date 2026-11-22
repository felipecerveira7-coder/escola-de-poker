// v58: mapa da cidade
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 await p.evaluate(()=>{try{ttlClose()}catch(e){};LIFE.tab='hoje';renderLife()});await p.waitForTimeout(300);
 console.log('mapa',await p.evaluate(()=>document.querySelectorAll('.city .cb').length));
 await p.evaluate(()=>document.querySelector('.city').scrollIntoView({block:'center'}));await p.screenshot({path:'c1.png'});
 for(const h of [18,19,23]){await p.evaluate(h=>{CLK.to(h);renderLife();document.querySelector('.city').scrollIntoView({block:'center'})},h);await p.waitForTimeout(200);await p.screenshot({path:'c'+h+'.png'})}
 await p.tap('[data-city="p:shop"]');await p.waitForTimeout(400);console.log('shopping ->',await p.evaluate(()=>LIFE.tab),await p.evaluate(()=>!!document.querySelector('.cityhd')));await p.screenshot({path:'c2.png'});
 await p.tap('[data-city="map"]');await p.waitForTimeout(400);console.log('volta mapa',await p.evaluate(()=>LIFE.tab));
 await p.tap('[data-city="p:bar"]');await p.waitForTimeout(400);console.log('bar',await p.evaluate(()=>LIFE.tab),await p.evaluate(()=>document.querySelectorAll('.vsubs [data-vt]').length));
 await p.tap('[data-city="map"]');await p.waitForTimeout(300);await p.tap('[data-city="p:clube"]');await p.waitForTimeout(400);console.log('clube',await p.evaluate(()=>location.hash));
 await p.evaluate(()=>{location.hash='#vida'});await p.waitForTimeout(300);await p.tap('[data-city="classic"]');await p.waitForTimeout(300);console.log('abas',await p.evaluate(()=>!!document.querySelector('.vgroups')));
 await p.tap('[data-city="city"]');await p.waitForTimeout(300);console.log('cidade de novo',await p.evaluate(()=>!!document.querySelector('.city')));
 for(const t of ['casa','fam','namoro','legado','midia','pat','loja','garagem','cel','hg']){await p.evaluate(t=>{LIFE.tab=t;renderLife()},t);await p.waitForTimeout(80)}
 console.log('errors',errs);await b.close()})();
