const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);await p.evaluate(()=>{try{ttlClose()}catch(e){}});
 const r=await p.evaluate(()=>{const out=[],s=LIFE.s;WALLET.s.bal=100000;
   const mk=id=>{const p=SPONS.find(x=>x.id===id);return{id:p.id,nm:p.nm,emo:p.emo,day:p.day,win:p.win,itm:p.itm,pct:p.pct||0,req:p.req,start:s.day,end:s.day+p.dur,done:{t:0,mtt:0,post:0,iv:0}}};
   s.sp=mk('tempo');s.spx=[mk('clube')];const t=CAL.today();
   const o=Math.random;Math.random=()=>0.01;SPX.daily(t);Math.random=o;out.push('reqs '+JSON.stringify(SPX.st().map(r=>[r.sp,r.key,r.kind,r.cut,r.bon])));
   const a=SPX.st().find(r=>r.kind==='pacote')||SPX.st()[0];out.push(SPX.accept(a.id));
   TOUR.g={ev:{key:a.key,nm:a.nm}};const b0=WALLET.s.bal;const v=SCOUT.prize(1,10000);out.push('prize '+v+' bonus '+(WALLET.s.bal-b0));
   const st=SPX.st().find(r=>r.kind==='stake');if(st){out.push(SPX.accept(st.id));TOUR.g={ev:{key:st.key,nm:st.nm}};out.push('stake prize '+SCOUT.prize(2,10000))}
   TOUR.g=null;const ev=CAL.byKey(a.key);CAL.st().done[a.key]={noshow:true};SPX.afterDay(ev.first);out.push('warn '+LIFE.spById(a.sp).warn);
   return out});console.log(r.join('\n'));
 await p.evaluate(()=>{location.hash='#agenda'});await p.waitForTimeout(600);
 console.log('hash',await p.evaluate(()=>location.hash),'regsp',await p.evaluate(()=>document.querySelectorAll('[data-ag^="regsp"]').length),'reg',await p.evaluate(()=>document.querySelectorAll('[data-ag^="reg:"]').length));
 await p.screenshot({path:'s2.png'});
 await p.evaluate(()=>{LIFE.tab='pat';location.hash='#vida'});await p.waitForTimeout(500);await p.screenshot({path:'s1.png'});
 console.log('errors',errs);await b.close()})();
