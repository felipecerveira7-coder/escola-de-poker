// v65: efeito dos itens
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{try{ttlClose()}catch(e){};LIFE.s.items=["protetor","moletom","fone","oculos","cadeira","corrente","relogio","baralho","maleta","mesapk","livros","gopro","ring","ultra","iphone","notebook","ps5","print3d","alexa","vinil","kitbasico","bone","corrida","jordan","camisa","jaqueta","terno","rolex","patek","aparador","perfume","nicho","massag","colchao","sofa","tv","arcond","robo","ripado","airfryer","espresso","capsula","lavadora","geladeira","adega","creatina","halteres","ergo","esteira","padel","speed","prancha","multimidia","som","dashcam","rodas","mala","pescoco","mochila","powerbank","violao","guitarra","cao","blue"];
  const o={};['regen','tire','love','mood','post'].forEach(k=>o[k]=Math.round(LIFE.ifx(k)*100)/100);
  return [JSON.stringify(o),ifxTxt(ITEMS.find(x=>x.id==='airpods')),ifxTxt(ITEMS.find(x=>x.id==='watch')),ifxTxt(ITEMS.find(x=>x.id==='skincare'))]});console.log(r.join('\n'));
 await p.tap('.hu-av');await p.waitForTimeout(400);await p.evaluate(()=>document.querySelector('.ifx')&&document.querySelector('.ifx').scrollIntoView({block:'center'}));await p.screenshot({path:'i1.png'});
 console.log('painel',await p.evaluate(()=>!!document.querySelector('.ifx')));console.log('errors',errs);await b.close()})();
