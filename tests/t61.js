// v59: interface limpa
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:860},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'#vida');await p.waitForTimeout(1500);
 await p.evaluate(()=>{try{ttlClose()}catch(e){};LIFE.note('🎗️','Compromisso: Evento beneficente','quinta, 26/11. Está na Agenda.');LIFE.note('🔥','Burnout','Você jogou demais.');LIFE.note('🙂','Coisa qualquer','sem destino');LIFE.text(Object.keys(LIVES.s.bots)[0],'Fala!');LIFE.tab='hoje';renderLife();HUD.last='';HUD.render()});
 await p.waitForTimeout(500);
 console.log('atalhos repetidos',await p.evaluate(()=>document.querySelectorAll('.hquick,.hhead,.cclock,.cphone').length),'perfil escondido',await p.evaluate(()=>getComputedStyle(document.querySelector('.vtop .vhead')).display),'badge',await p.evaluate(()=>document.querySelector('.hu-ph b')&&document.querySelector('.hu-ph b').textContent));
 await p.screenshot({path:'x1.png'});
 await p.tap('.hu-av');await p.waitForTimeout(400);console.log('perfil aberto',await p.evaluate(()=>LIFE.hdrOpen&&getComputedStyle(document.querySelector('.vtop .vhead')).display));await p.screenshot({path:'x2.png'});
 await p.tap('[data-r="hdrT"]');await p.waitForTimeout(200);
 await p.tap('.hu-ph');await p.waitForTimeout(400);console.log('celular',await p.evaluate(()=>LIFE.tab),'notas',await p.evaluate(()=>document.querySelectorAll('[data-note]').length),'nao lidas depois de abrir',await p.evaluate(()=>LIFE.s.notes.filter(x=>!x.read).length));await p.screenshot({path:'x3.png'});
 await p.tap('[data-note="1"]');await p.waitForTimeout(300);console.log('burnout leva pra',await p.evaluate(()=>LIFE.tab));
 await p.tap('.hu-ph');await p.waitForTimeout(300);await p.tap('[data-note="2"]');await p.waitForTimeout(300);console.log('agenda',await p.evaluate(()=>location.hash));
 await p.evaluate(()=>{location.hash='#vida';LIFE.tab='cel';renderLife()});await p.waitForTimeout(300);await p.tap('[data-vt="amigos"]');await p.waitForTimeout(300);console.log('amigos',await p.evaluate(()=>LIFE.tab),await p.evaluate(()=>document.querySelectorAll('[data-open]').length));
 await p.tap('[data-open]');await p.waitForTimeout(300);console.log('conversa',await p.evaluate(()=>LIFE.tab+' '+LIFE.open));
 await p.evaluate(()=>{LIFE.tab='hoje';renderLife()});await p.waitForTimeout(200);await p.tap('[data-city="p:bar"]');await p.waitForTimeout(400);console.log('mapa amigos',await p.evaluate(()=>LIFE.tab));
 await p.tap('[data-city="map"]');await p.waitForTimeout(300);await p.tap('[data-city="p:casa"]');await p.waitForTimeout(400);console.log('casa subabas',await p.evaluate(()=>[...document.querySelectorAll('.vsubs [data-vt]')].map(x=>x.dataset.vt).join(',')));
 console.log('errors',errs);await b.close()})();
