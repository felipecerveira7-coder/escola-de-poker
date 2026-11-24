// v66: itens novos e closet com efeitos
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{try{ttlClose()}catch(e){};WALLET.s.bal=1e6;['moletom','oculos','terno','hoodie','azul','perfume','meditacao','psico','ranges','xadrez','vip','milhas','solver','blazer'].forEach(i=>{if(!LIFE.has(i))LIFE.s.items.push(i)});
  const o=[];o.push('calm '+LIFE.ifx('calm')+' tcard '+LIFE.ifx('tcard')+' trav '+LIFE.ifx('trav')+' rbk '+LIFE.ifx('rbk')+' study '+LIFE.ifx('study'));
  const S=SOC.st();const b0=S.burn;SOC.burnAdd(10);o.push('desgaste +10 virou +'+(SOC.st().burn-b0).toFixed(1));
  o.push('rakeback '+Math.round(ONL.rb()*100)+'%');o.push('loja: '+ifxTxt(ITEMS.find(x=>x.id==='coach')));o.push('formal com blazer '+(LIFE.s.look=null,OUT.st(),OUT.st().role.tronco='blazer',OUT.formal('role')));
  return o});console.log(r.join('\n'));
 await p.evaluate(()=>{OUT.open()});await p.waitForTimeout(400);console.log('efeitos no closet',await p.evaluate(()=>document.querySelectorAll('#clOv .clfx').length));await p.screenshot({path:'cl1.png'});
 await p.evaluate(()=>{const b=document.querySelector('#clOv [data-cl="tab|role"]');b&&b.click()});await p.waitForTimeout(300);await p.screenshot({path:'cl2.png'});
 // mesa: cartões extras
 await p.evaluate(()=>{document.getElementById('clOv')&&document.getElementById('clOv').remove();location.hash='#jogar'});await p.waitForTimeout(300);await p.tap('#cashRoot [data-r="bStart"]');await p.waitForTimeout(1500);
 console.log('cartões',await p.evaluate(()=>CASH.g&&CASH.g.tb&&CASH.g.tb.n));
 console.log('errors',errs);await b.close()})();
