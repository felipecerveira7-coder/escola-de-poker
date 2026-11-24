// v64: a mesa aprende o seu tempo
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{try{ttlClose()}catch(e){};const o=[];const sharp=Object.keys(LIVES.s.bots).find(n=>TELL.SHARP.includes((LIVES.bio(n)||{}).trait)),fish=Object.keys(LIVES.s.bots).find(n=>!TELL.SHARP.includes((LIVES.bio(n)||{}).trait));
  LIVES.s.htell={ss:0,sw:0,fs:0,fw:0};o.push('sem histórico: atento '+TELL.belief(CASH,sharp,'slow').p.toFixed(2)+' · casual '+TELL.belief(CASH,fish,'slow').p.toFixed(2));
  LIVES.s.htell={ss:6,sw:1,fs:0,fw:0};o.push('você demora e tá forte (6x): atento '+TELL.belief(CASH,sharp,'slow').p.toFixed(2)+' · casual '+TELL.belief(CASH,fish,'slow').p.toFixed(2));
  // efeito: check demorado com histórico de armadilha → bot atento blefa menos
  CASH.g={hands:5,players:[{human:true,inHand:true,folded:false,bet:0},{name:sharp}],hTell:{secs:14,type:'check',street:'turn',hand:5}};const X=CASH.tellAdj(1,{M:.5,B:1,A:.5,W:1});o.push('check demorado → blefe do atento x'+X.B.toFixed(2)+' agressão '+X.A.toFixed(2));
  CASH.g.hTell.type='raise';CASH.g.players[0].bet=100;const Y=CASH.tellAdj(1,{M:.5,B:1,A:.5,W:1});o.push('aposta demorada → limiar de fold '+Y.M.toFixed(3));
  LIVES.s.htell={ss:0,sw:6,fs:0,fw:0};const Z=CASH.tellAdj(1,{M:.5,B:1,A:.5,W:1});o.push('se você demora fraco: limiar '+Z.M.toFixed(3)+' · fala: '+TELL.say(CASH,sharp)[0]);
  // aprendizado no showdown
  LIVES.s.htell={ss:0,sw:0,fs:0,fw:0};const C=id=>FULL_DECK.find(x=>x.id===id);const ids=FULL_DECK.map(x=>x.id);
  const A=FULL_DECK.filter(x=>x.r===14);const bd=FULL_DECK.filter(x=>x.r!==14&&x.r!==13).slice(0,5);
  CASH.g={hands:6,board:bd,players:[{human:true,inHand:true,folded:false,hole:A.slice(0,2)}],hTells:[{secs:15,type:'check',street:'river',hand:6}]};CASH.log=()=>{};TELL.learnFrom(CASH);o.push('depois do showdown com AA: '+JSON.stringify(LIVES.s.htell));CASH.g=null;
  return o});console.log(r.join('\n'));console.log('errors',errs);await b.close()})();
