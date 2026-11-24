// v63: cenários do encontro
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 for(const k of ['motel','cinema','show','viagem','casa','festa']){
  const r=await p.evaluate(k=>{try{ttlClose()}catch(e){};WALLET.s.bal=90000;LIFE.s.dnow=null;LIFE.s.love={nm:'Paula',g:'f',age:30,b:70,id:'x1',emo:'👩',th:[],stage:'namoro',job:'professora',dates:3,kissed:true};CLK.to(10);
   DATE.start(k);return [!!document.querySelector('#dOv .dscene2 svg'),document.querySelectorAll('#dOv [data-dp]').length]},k);
  await p.waitForTimeout(400);
  if(k==='motel'){await p.evaluate(()=>{const d=DATE.st();d.kiss=true;DATE.render()});await p.waitForTimeout(100);console.log('motel botões',await p.evaluate(()=>[...document.querySelectorAll('#dOv [data-dp]')].map(b=>b.textContent).join(' | ')));
    await p.evaluate(()=>DATE.place(0));await p.waitForTimeout(400);await p.evaluate(()=>{Math.random=()=>0;DATE.fade()});await p.waitForTimeout(600);await p.screenshot({path:'d_motel.png'});console.log('fade',await p.evaluate(()=>!!document.querySelector('.dfade')))}
  else{await p.screenshot({path:'d_'+k+'.png'})}
  console.log(k,JSON.stringify(r));await p.evaluate(()=>{LIFE.s.dnow=null;DATE.render()})}
 console.log('errors',errs);await b.close()})();
