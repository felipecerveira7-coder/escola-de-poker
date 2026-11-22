// v57: avatares ilustrados em todo lugar e fichas animadas na mesa
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 await p.evaluate(()=>{try{ttlClose()}catch(e){};WALLET.s.bal=900000;LIFE.s.fame=80});
 // mesa
 await p.evaluate(()=>{location.hash='#jogar'});await p.waitForTimeout(400);await p.click('#cashRoot [data-r="bStart"]');await p.waitForTimeout(2500);
 console.log('rostos na mesa',await p.evaluate(()=>document.querySelectorAll('#cashRoot .pav svg').length),'jogadores',await p.evaluate(()=>CASH.g.players.length));
 await p.evaluate(()=>document.querySelector('#cashRoot .ptable').scrollIntoView({block:'start'}));await p.waitForTimeout(200);await p.screenshot({path:'v1.png'});
 // expressões variadas
 const ex=await p.evaluate(()=>{const n=CASH.g.players[1].name;return['feliz','neutro','triste','tilt','cansado','confiante'].map(m=>FACE.bot(n,60,m).length)});console.log('expressoes',ex.join(','));
 // ficha do bot
 const nm=await p.evaluate(()=>Object.keys(LIVES.s.bots)[0]);await p.evaluate(n=>BOTP.open(n),nm);await p.waitForTimeout(300);
 console.log('ficha com rosto',await p.evaluate(()=>!!document.querySelector('#bpOv .bpav svg')));await p.screenshot({path:'v2.png'});await p.evaluate(()=>BOTP.close());
 // família, lendas, contatos
 for(const [t,sel] of [['fam','.fav svg'],['legado','.lgav svg'],['cel','.rav svg']]){await p.evaluate(t=>{location.hash='#vida';LIFE.tab=t;LIFE.open=null;renderLife()},t);await p.waitForTimeout(250);console.log(t,await p.evaluate(s=>document.querySelectorAll(s).length,sel));await p.screenshot({path:'v_'+t+'.png'})}
 // app de namoro
 await p.evaluate(()=>{LIFE.s.love=null;LIFE.tab='namoro';MATCH.view='desc';renderLife()});await p.waitForTimeout(300);console.log('perfil desenhado',await p.evaluate(()=>!!document.querySelector('.mcard svg')));await p.screenshot({path:'v3.png'});
 // galeria pra conferir
 await p.evaluate(()=>{const w=document.createElement('div');w.style.cssText='position:fixed;inset:0;z-index:9999;background:#0d3528;display:flex;flex-wrap:wrap;gap:6px;padding:8px;overflow:auto';
   const ms=['feliz','neutro','triste','tilt','cansado','confiante'];w.innerHTML=Object.keys(LIVES.s.bots).slice(0,14).map((n,i)=>FACE.bot(n,84,ms[i%6])).join('')+LEGS.map(L=>FACE.leg(L,84)).join('')+FACE.me('mesa',84)+FACE.me('role',84);document.body.appendChild(w)});
 await p.waitForTimeout(300);await p.screenshot({path:'v4.png'});
 console.log('errors',errs);await b.close()})();
