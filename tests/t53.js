const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='warning'||m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);await p.evaluate(()=>{try{ttlClose()}catch(e){}});
 const r=await p.evaluate(()=>{const o=[],s=LIFE.s;WALLET.s.bal=5e6;s.fame=70;s.energy=90;
   const mk=(id,d)=>{const p=SPONS.find(x=>x.id===id);return{id,nm:p.nm,emo:p.emo,day:d,win:SP_OLD[id][1]*d/SP_OLD[id][0],itm:SP_OLD[id][2]*d/SP_OLD[id][0],pct:p.pct||0,req:p.req,start:s.day,end:s.day+30,done:{t:0,mtt:0,post:0,iv:0}}};
   s.sp=mk('tempo',750);s.spx=[mk('mundial',12000),mk('clube',375)];s.spRate=0;s.champN=1;LIFE.ready=true;LIFE.sync();o.push('sp '+LIFE.sps().map(c=>c.id+':'+c.day+'/'+c.win).join(' '));
   o.push('SPK500 '+SPK(500)+' hol22/11 '+JSON.stringify(HOL.of(CAL.today())));
   for(let d=CAL.today();d<CAL.today()+40;d++){const h=HOL.of(d);if(h)o.push(d+' '+CAL.fmt(d)+' '+h.nm)}
   const R=Math.random;Math.random=()=>0.01;FR.daily(CAL.today());Math.random=R;o.push('finv '+JSON.stringify(s.finv)+' bds '+JSON.stringify(s.bds));
   o.push('ans '+FR.answer(true));
   o.push(INV.buy('clube'),INV.tourney(),INV.cdb(100000));const it=[];INV.month((k,v)=>it.push(k+':'+v));o.push('month '+it.join(', '));
   o.push('live '+LIVEX.go('mao'));FEED.daily(CAL.today());o.push('feed '+FEED.st().length);
   o.push('mood '+MOODL.list().map(x=>x[1]).join('|'));
   return o});console.log(r.join('\n'));
 for(const t of ['casa','legado','midia','loja']){await p.evaluate(t=>{LIFE.tab=t;renderLife()},t);await p.waitForTimeout(250);await p.screenshot({path:`v53_${t}.png`,fullPage:t!=='loja'})}
 await p.evaluate(()=>{const n=LIFE.s.finv&&LIFE.s.finv.n||Object.keys(LIVES.s.bots)[0];LIFE.tab='cel';LIFE.open=n;renderLife()});await p.waitForTimeout(200);await p.screenshot({path:'v53_cel.png'});
 // lenda
 const lg=await p.evaluate(()=>{LEG.open=()=>true;LIFE.s.items.push('bone','rolex');LIFE.tab='legado';renderLife();return LEG.play('barao')});console.log('leg play',JSON.stringify(lg),await p.evaluate(()=>TOUR.g&&TOUR.g.players.map(x=>x.name+':'+x.style).join(',')),await p.evaluate(()=>location.hash));
 await p.evaluate(()=>{CAL.finish('leg@barao@'+CAL.today(),{place:1,of:2,prize:40000})});console.log('troph',await p.evaluate(()=>JSON.stringify(TROPH.st().slice(0,2))),'leg st',await p.evaluate(()=>JSON.stringify(LEG.st())));
 console.log('sngPrize',await p.evaluate(()=>TOUR.sngPrize(1)));
 await p.evaluate(()=>{TOUR.stop();TOUR.g=null;SAVES.del('tour');location.hash='#vida'});await p.waitForTimeout(300);
 // coletiva
 await p.evaluate(()=>PRESS.open('pre','main@6',{nm:'Main Event do Circuito'}));await p.waitForTimeout(300);await p.screenshot({path:'v53_press.png'});
 for(const k of ['c','p','h']){await p.click(`#prOv [data-pr="${k}"]`);await p.waitForTimeout(200)}
 await p.screenshot({path:'v53_press2.png'});await p.click('#prOv [data-pr="close"]');await p.waitForTimeout(300);
 console.log('press done; heads',await p.evaluate(()=>LIFE.s.heads[0].title),'flash',await p.evaluate(()=>document.querySelector('[data-r="vMsg"]')&&document.querySelector('[data-r="vMsg"]').textContent));
 // perfil
 await p.evaluate(()=>BOTP.open(Object.keys(LIVES.s.bots)[0]));await p.waitForTimeout(200);await p.screenshot({path:'v53_prof.png'});await p.evaluate(()=>BOTP.close());
 // chat da mesa
 await p.evaluate(()=>{TOUR.g=null;location.hash='#jogar'});await p.waitForTimeout(500);await p.click('#cashRoot [data-r="bStart"]');await p.waitForTimeout(1200);
 await p.evaluate(()=>{CASH.chatOpen=true;CASH.renderChat()});await p.waitForTimeout(200);
 await p.fill('#cashRoot [data-r="chIn"]','noite boa pessoal');await p.evaluate(()=>{CASH.renderChat();CASH.renderTable&&CASH.renderTable()});await p.waitForTimeout(100);
 console.log('kept input:',await p.evaluate(()=>CASH.$('chIn').value));
 await p.click('#cashRoot [data-r="chGo"]');await p.waitForTimeout(1500);console.log('msgs',await p.evaluate(()=>JSON.stringify(CASH.msgs.slice(0,3))));
 console.log('look',await p.evaluate(()=>document.querySelector('.pname .look')&&document.querySelector('.pname .look').textContent));
 console.log('errors',errs);await b.close()})();
