// v67: celular leva ao próximo pendente
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 await p.evaluate(()=>{try{ttlClose()}catch(e){};const n=Object.keys(LIVES.s.bots);LIFE.note('🔔','Aviso 1','x');LIFE.note('🔔','Aviso 2','y');LIFE.text(n[0],'Fala aí!');LIFE.text(n[1],'Bora jogar?');LIFE.tab='hoje';renderLife();HUD.last='';HUD.render();document.querySelectorAll('.cntf').forEach(x=>x.remove())});
 const step=async()=>{await p.tap('.hu-ph');await p.waitForTimeout(400);return p.evaluate(()=>[LIFE.tab,LIFE.open||'-',LIFE.unread(),(document.querySelector('.pnext')||{}).textContent||''])};
 for(let i=0;i<4;i++)console.log('toque',i+1,JSON.stringify(await step()));
 await p.screenshot({path:'pn.png'});console.log('errors',errs);await b.close()})();
