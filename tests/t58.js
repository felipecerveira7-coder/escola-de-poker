// v58: arena em tela cheia, cartas 3D, anel de tempo, chance no all-in, sons
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 await p.evaluate(()=>{try{ttlClose()}catch(e){};WALLET.s.bal=900000});
 await p.evaluate(()=>{location.hash='#jogar'});await p.waitForTimeout(400);await p.tap('#cashRoot [data-r="bStart"]');await p.waitForTimeout(350);
 console.log('arena',await p.evaluate(()=>CASH.root.classList.contains('arena')),'body',await p.evaluate(()=>document.body.classList.contains('arena-on')),'cartas animando',await p.evaluate(()=>document.querySelectorAll('#cashRoot .adeal,#cashRoot .adealb').length));
 await p.screenshot({path:'a0.png'});await p.waitForTimeout(2500);await p.screenshot({path:'a1.png'});
 console.log('anel',await p.evaluate(()=>document.querySelectorAll('#cashRoot .pring').length),'controles fixos',await p.evaluate(()=>getComputedStyle(CASH.$('ctl')).position));
 // chance: AA x KK antes do flop ~82%
 console.log('AAxKK',await p.evaluate(()=>{const c=id=>FULL_DECK.find(x=>x.id===id);const ids=FULL_DECK.map(x=>x.id);const A=FULL_DECK.filter(x=>x.r===14).slice(0,2),K=FULL_DECK.filter(x=>x.r===13).slice(0,2);return ARENA.eq([A,K],[]).map(v=>Math.round(v*100)).join('/')}));
 console.log('flop exato',await p.evaluate(()=>{const A=FULL_DECK.filter(x=>x.r===14).slice(0,2),K=FULL_DECK.filter(x=>x.r===13).slice(0,2),bd=FULL_DECK.filter(x=>x.r===2||x.r===7).slice(0,3);const t0=performance.now();const e=ARENA.eq([A,K],bd);return e.map(v=>Math.round(v*100)).join('/')+' em '+Math.round(performance.now()-t0)+'ms'}));
 // suspense desenhado
 await p.evaluate(()=>{const g=CASH.g;g.sus=g.hands;g.eqs={h:g.hands,b:4,v:{0:.82,1:.18}};CASH.renderTable()});await p.waitForTimeout(150);
 console.log('suspense',await p.evaluate(()=>!!document.querySelector('#cashRoot .psus')),'badges',await p.evaluate(()=>document.querySelectorAll('#cashRoot .peq').length));await p.screenshot({path:'a2.png'});
 await p.evaluate(()=>{const g=CASH.g;g.sus=0;g.eqs=null;CASH.renderTable()});
 // som liga/desliga e sheet
 await p.tap('[data-ab="snd"]');console.log('mudo',await p.evaluate(()=>SFX.muted()));await p.tap('[data-ab="snd"]');
 await p.tap('[data-ab="log"]');await p.waitForTimeout(200);console.log('historico',await p.evaluate(()=>!!document.querySelector('#aSheet .asb')));await p.screenshot({path:'a3.png'});await p.tap('#aSheet [data-x]');
 // sair da tela cheia e voltar
 await p.tap('[data-ab="min"]');await p.waitForTimeout(200);console.log('min',await p.evaluate(()=>CASH.root.classList.contains('arena')),'voltar',await p.evaluate(()=>!!document.querySelector('#cashRoot .aback')));
 await p.tap('#cashRoot .aback');await p.waitForTimeout(300);console.log('de volta',await p.evaluate(()=>CASH.root.classList.contains('arena')));
 // jogar umas mãos com todos os sons
 for(let i=0;i<14;i++){await p.evaluate(()=>{const g=CASH.g;if(!g)return;if(g.over)CASH.startHand();else if(g.toAct===0){const me=g.players[0],tc=g.currentBet-me.bet;CASH.act(0,tc>0?(Math.random()<.3?'fold':'call'):'check')}});await p.waitForTimeout(700)}
 await p.screenshot({path:'a4.png'});
 // ir pra vida tira a arena do corpo
 await p.evaluate(()=>{location.hash='#vida'});await p.waitForTimeout(300);console.log('corpo livre na vida',await p.evaluate(()=>!document.body.classList.contains('arena-on')));
 console.log('errors',errs);await b.close()})();
