// v61: voltar e inscrição com dia ocupado
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 await p.evaluate(()=>{try{ttlClose()}catch(e){};LIFE.note('🤝','Proposta de patrocínio','Uma marca quer você.');LIFE.tab='hoje';renderLife()});await p.waitForTimeout(300);
 console.log('sem voltar no inicio',await p.evaluate(()=>!document.querySelector('.hu-bk')));
 await p.tap('.hu-ph');await p.waitForTimeout(300);await p.tap('[data-note="0"]');await p.waitForTimeout(400);console.log('foi pra',await p.evaluate(()=>LIFE.tab),'voltar visivel',await p.evaluate(()=>!!document.querySelector('.hu-bk')));
 await p.screenshot({path:'n1.png'});
 await p.tap('.hu-bk');await p.waitForTimeout(400);console.log('voltou pra',await p.evaluate(()=>LIFE.tab));
 await p.tap('.hu-bk');await p.waitForTimeout(400);console.log('voltou pra',await p.evaluate(()=>LIFE.tab));
 await p.evaluate(()=>{location.hash='#torneio'});await p.waitForTimeout(400);await p.tap('.hu-bk');await p.waitForTimeout(400);console.log('de volta da agenda',await p.evaluate(()=>location.hash+' '+LIFE.tab));
 // inscrição com dia usado
 const r=await p.evaluate(()=>{WALLET.s.bal=10000;const A=CAL.st(),t=CAL.today(),ev=CAL.events(t)[0];A.used[t]='rest';const m=CAL.register(ev.key);return[m,!!A.reg[ev.key]]});console.log('bloqueio',JSON.stringify(r));
 // inscrito e depois usou o dia: estorno no fim do dia
 const r2=await p.evaluate(()=>{const A=CAL.st(),t=CAL.today(),ev=CAL.events(t)[0];delete A.used[t];CAL.register(ev.key);const b0=WALLET.s.bal;A.used[t]='rest';CAL.advance(1);return[WALLET.s.bal-b0,!!A.reg[ev.key],!!A.done[ev.key],LIFE.s.notes[0].title]});console.log('estorno',JSON.stringify(r2));
 // save antigo com falta indevida
 const r3=await p.evaluate(()=>{const A=CAL.st(),t=CAL.today(),ev=CAL.events(t)[0];A.reg[ev.key]={paid:50,buy:50};A.done[ev.key]={noshow:true};A.used[t]='item3';LIFE.s.fixNS1=0;const b0=WALLET.s.bal;renderLife();return[WALLET.s.bal-b0,!!A.done[ev.key],LIFE.s.notes[0].title]});console.log('conserto',JSON.stringify(r3));
 console.log('errors',errs);await b.close()})();
