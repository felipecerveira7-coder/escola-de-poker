/* ===================== HOME GAME ===================== */
const HG_CAP={pais:2,kit:3,ap2:4,casa:5,cob:7,man:8};
const HG={
  st(){const s=LIFE.s,d=LIVES.s.day;if(!s.hg||s.hg.day!==d)s.hg={day:d,stake:(s.hg&&s.hg.stake)||'baixa',rake:s.hg?!!s.hg.rake:true,guests:[],asked:{}};s.hgInv=(s.hgInv||[]).filter(x=>CAL.on()?x.day>=d&&!x.acc:d-x.day<=2);return s.hg},
  cap(){return HG_CAP[LIFE.s.home]||3},
  snack(){return Math.round(30*(1+LIFE.status()*.1))},
  ask(n){const hg=this.st(),b=LIVES.s.bots[n],B=LIVES.bio(n);if(!b||!B||hg.asked[n])return;const SK=STAKES[hg.stake],r=LIFE.rel(n),st=LIVES.state(n),tags=new Set((st?st.tags:[]).map(x=>x[0])),pk=pickA;
    const no=t=>{hg.asked[n]={ok:false,t};LIFE.mine(n,`Bora um home game hoje lá em casa? R$ ${SK.sb}/${SK.bb}.`);LIFE.text(n,t);LIFE.s.th[n].u=0},
      yes=t=>{hg.asked[n]={ok:true,t};hg.guests.push(n);LIFE.mine(n,`Bora um home game hoje lá em casa? R$ ${SK.sb}/${SK.bb}.`);LIFE.text(n,t);LIFE.s.th[n].u=0};
    if(hg.guests.length>=this.cap())return;
    if(b.bank<SK.stack*1.5)return no(pk(['Tô sem grana pra essa mesa, fica pra próxima.','Essa mesa tá cara pra mim agora. Numa menor eu topo.']));
    if(tags.has('cans'))return no(pk(['Hoje não dá, tô morto de cansado.','Tô só o pó. Próxima eu vou.']));
    if(tags.has('caut'))return no('Compromisso de família hoje. Me chama na próxima!');
    let p,greedy=false;
    if(r<=-1){greedy=true;p=.3+((LIVES.hot(n)||['lag','station'].includes(b.style))?.3:0)+(tags.has('tilt')?.2:0)}
    else p=r>=2?.85:r>=1?.7:.28+LIFE.s.fame/250;
    if(hg.rake&&!greedy){p-=.1;if(B.trait==='calculista')p-=.15}
    if(tags.has('tilt')&&!greedy)p+=.1;if(tags.has('press')&&!greedy)p-=.1;
    if(Math.random()<p){if(greedy)return yes(pk(['Vou sim. Vou levar teu dinheiro pra casa 😈','Tô dentro. Separa as fichas que eu vou buscar.','Na tua casa? Melhor ainda, jogo em casa de pato.']));
      return yes(r>=1?pk(['Bora! Levo a cerveja.','Opa, tô dentro! Que horas?','Fechou, chego às 20h.']):pk(['Pode ser. Me manda o endereço.','Topo. Nunca joguei contigo, vai ser bom.']))}
    if(greedy)return no(pk(['Na tua casa? Passo.','Não piso na tua casa nem pago.']));
    no(hg.rake&&Math.random()<.4?'Home game com rake? Aí não, né.':pk(['Hoje não vai dar, foi mal.','Fica pra próxima, valeu o convite!','Já marquei outra coisa hoje.']))},
  drop(n){const hg=this.st();hg.guests=hg.guests.filter(x=>x!==n)},
  /* bots também fazem home game e te chamam */
  gen(){const s=LIFE.s,d=LIVES.s.day;s.hgInv=(s.hgInv||[]).filter(x=>CAL.on()?x.day>=d&&!x.acc:d-x.day<=2);if(s.hgInv.length||Math.random()>.3)return;
    const all=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&LIVES.bio(n));let hosts=all.filter(n=>LIFE.rel(n)>=1);if(Math.random()<.25)hosts=hosts.concat(all.filter(n=>LIFE.rel(n)<=-2));
    if(!hosts.length)return;const host=pickA(hosts),hb=LIVES.s.bots[host].bank,stake=hb>20000?'alta':hb>6000?'media':'baixa',SK=STAKES[stake];
    const others=all.filter(n=>n!==host&&LIVES.s.bots[n].bank>=SK.stack).sort(()=>Math.random()-.5).slice(0,2+(Math.random()*4|0));
    const day=CAL.on()?CAL.free(d+1,d+4):d;if(!day)return;const rake=Math.random()<.45,inv={host,stake,rake,guests:others,day};s.hgInv.push(inv);
    LIFE.text(host,LIFE.rel(host)<=-2?`Vai ter home game aqui em casa ${WDL[CAL.dow(day)]}, R$ ${SK.sb}/${SK.bb}. Já que tu é o famosinho, aparece. Quero ver tu perder na minha mesa.`
      :`${WDL[CAL.dow(day)].charAt(0).toUpperCase()+WDL[CAL.dow(day)].slice(1)} (${CAL.fmt(day)}) tem home game aqui em casa, R$ ${SK.sb}/${SK.bb}${rake?' (com rake pra pagar a pizza)':''}. ${others.length} já confirmaram. Vem?`);
    LIFE.note('🍻',`${host} te chamou pra um home game`,`R$ ${SK.sb}/${SK.bb} com ${others.length+1} jogadores. É ${CAL.fmt(day,true)}. Responda na aba Home game.`)},
  start(o){if(CASH.g)return'Você já está numa mesa de cash. Saia dela primeiro.';const SK=o.sk||STAKES[o.stake],cost=o.host?0:this.snack()*o.guests.length;
    if(!WALLET.can(SK.stack+cost))return`Saldo insuficiente: precisa de R$ ${brl(SK.stack+cost)}.`;
    CASH.cashSaveOut();if(cost)WALLET.add(-cost,`Petiscos e bebida do home game (${o.guests.length} convidados)`);
    WALLET.add(-SK.stack,o.host?`Home game na casa de ${o.host}: buy-in`:`Home game em casa: buy-in`);CASH.paidNow=SK.stack;try{LIFE.onStart('cash')}catch(e){}
    const names=o.host?[o.host,...o.guests]:o.guests;
    location.hash='#jogar';CASH.startGame({bots:names.length,names,styles:o.styles,stack:SK.stack,sb:SK.sb,bb:SK.bb,home:{host:o.host||null,rake:o.rake?{pct:.05,cap:3}:null,earn:0,guests:names.slice()}});
    CASH.log(`<div class="lh lvl">🍻 Home game ${o.host?`na casa de ${o.host}`:'na sua casa'} · R$ ${SK.sb}/${SK.bb} · ${o.rake?`rake de 5% até 3 big blinds, só com flop (vai ${o.host?`pro ${o.host}`:'pra você'})`:'sem rake'}.</div>`);return null},
  end(g,res){const H=g.home,me=CIRC.me();if(!H)return;LIFE.addFame(.3);
    H.guests.forEach(n=>{if(!LIVES.s.bots[n])return;LIVES.relAdd(n,'Você',H.host?(n===H.host?.6:.2):(H.rake?.15:.5));LIVES.note(n,H.host===n?`Fez um home game em casa e ${me} apareceu.`:`Jogou o home game ${H.host?`na casa de ${H.host}`:`na casa de ${me}`}.`)});
    if(!H.host&&H.earn>0)WALLET.add(H.earn*LIVES.CHIP,`Rake do home game (${g.hands} mãos)`);
    if(LIFE.s.fame>=20&&!H.host)CIRC.post({k:'bast',title:'',body:`Home game na casa de ${me}: ${H.guests.join(', ')} na mesa${H.earn?`, e o anfitrião ainda levou R$ ${brl(H.earn*LIVES.CHIP)} de rake`:''}.`});
    LIVES.commit();LIFE.commit()}};

function renderHG(){const s=LIFE.s,hg=HG.st(),H=LIFE.homeObj(),cap=HG.cap(),SK=STAKES[hg.stake];let h='';
  (s.hgInv||[]).forEach((v,k)=>{const S=STAKES[v.stake];h+=`<div class="panel"><h3>🍻 Convite de ${lx(v.host)}</h3><div style="font-size:14px">Home game na casa de ${lx(v.host)} · R$ ${S.sb}/${S.bb} (buy-in R$ ${brl(S.stack)}) · ${v.rake?'com rake pro anfitrião':'sem rake'}<br>Na mesa: ${[v.host,...v.guests].map(lx).join(', ')}</div>
    <div class="muted" style="font-size:12px;margin:4px 0 8px">${LIFE.rel(v.host)<=-2?'Esse aí não gosta de você. Cuidado: chamou pra tirar seu dinheiro.':'Ir fortalece a amizade com todo mundo da mesa.'} É ${CAL.fmt(v.day,true)}.</div>
    <button class="sm pri" data-hgi="go:${k}">${CAL.on()?(v.day===CAL.today()?'Ir agora':'Aceitar e marcar na agenda'):'Ir ao home game'}</button> <button class="sm" data-hgi="no:${k}">Recusar</button></div>`});
  h+=`<div class="panel"><h3>🏠 Home game na sua casa</h3><div style="font-size:14px">${H.emo} ${H.nm}: cabem <b>${cap} convidados</b> (mesa de ${cap+1}). Casa maior, mesa maior.</div>
    <div class="vact">${Object.entries(STAKES).map(([k,x])=>`<button class="sm${hg.stake===k?' pri':''}" data-hgs="${k}">R$ ${x.sb}/${x.bb}</button>`).join('')}</div>
    <label class="chk" style="font-size:14px"><input type="checkbox" data-r="hgRake" ${hg.rake?'checked':''}> Cobrar rake: 5% do pote até 3 big blinds, só quando sai o flop. O rake é seu.</label>
    <div class="muted" style="font-size:12px;margin-top:4px">Com rake você ganha o que a casa ganharia num clube, mas tem amigo que não gosta. Sem rake, todo mundo sai mais seu amigo. Petiscos e bebida: R$ ${brl(HG.snack())} por convidado. Buy-in de todos: R$ ${brl(SK.stack)}.</div>
    <div class="nsec" style="margin-top:10px">Confirmados (${hg.guests.length}/${cap})</div>
    ${hg.guests.length?hg.guests.map(n=>`<span class="hgchip">${(LIVES.bio(n)||{}).emo||'👤'} ${lx(n)} <button data-hgd="${n}" aria-label="tirar">×</button></span>`).join(''):'<div class="muted" style="font-size:13px">Ninguém ainda. Chame abaixo.</div>'}
    ${CAL.on()?`<div style="margin-top:12px;font-size:14px">Dia: <select data-r="hgDay" style="padding:6px 8px;border-radius:8px;background:rgba(0,0,0,.3);color:inherit;border:1px solid var(--line)">${[...Array(8).keys()].map(k=>CAL.today()+k).filter(d=>!CAL.busy(d)).map(d=>`<option value="${d}">${CAL.fmt(d)}${CAL.rel(d)?' · '+CAL.rel(d):''}</option>`).join('')||'<option value="">sem dia livre</option>'}</select></div>`:''}
    <button class="tbtn pri" data-r="hgGo" style="margin-top:12px;text-align:center" ${hg.guests.length?'':'disabled'}>🃏 ${CAL.on()?'Marcar o home game':'Começar o home game'}</button></div>`;
  const all=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&LIVES.bio(n)).sort((a,b)=>LIFE.rel(b)-LIFE.rel(a));
  const row=n=>{const a=hg.asked[n],B=LIVES.bio(n);return`<div class="vrow"><span><span class="rav">${FACE.bot(n,30)}</span> <b>${lx(n)}</b> <span class="muted" style="font-size:12px">${LIFE.relTxt(n)} · R$ ${nf(Math.round(LIVES.s.bots[n].bank))}</span>${a?`<div style="font-size:12px" class="${a.ok?'ok':'bad'}">“${lx(a.t)}”</div>`:''}</span>${a?(a.ok?'<span class="ok">✓</span>':'<span class="muted">✗</span>'):`<button class="sm" data-hga="${n}" ${hg.guests.length>=cap?'disabled':''}>Convidar</button>`}</div>`};
  const fr=all.filter(n=>LIFE.rel(n)>=1),rv=all.filter(n=>LIFE.rel(n)<=-1),ot=all.filter(n=>LIFE.rel(n)>-1&&LIFE.rel(n)<1);
  h+=`<div class="panel"><h3>Quem chamar</h3><p class="muted" style="font-size:12px;margin-top:0">Amigo quase sempre vem. Conhecido vem mais se você for famoso. Rival às vezes vem só pra tirar seu dinheiro, e joga com raiva. Quem está sem grana, cansado ou com compromisso de família recusa.</p>
    ${fr.length?`<div class="nsec">Amigos</div>${fr.map(row).join('')}`:''}${rv.length?`<div class="nsec">Rivais</div>${rv.map(row).join('')}`:''}
    <div class="nsec">Conhecidos</div>${ot.slice(0,LIFE.allHG?99:10).map(row).join('')}${ot.length>10&&!LIFE.allHG?`<button class="sm" data-r="hgAll" style="margin-top:6px">Ver todos (${ot.length})</button>`:''}</div>`;
  return h}
function bindHG(el,say){const hg=HG.st(),q=a=>el.querySelector(`[data-r="${a}"]`);
  el.querySelectorAll('[data-hgs]').forEach(b=>b.onclick=()=>{hg.stake=b.dataset.hgs;LIFE.commit();renderLife()});
  if(q('hgRake'))q('hgRake').onchange=e=>{hg.rake=e.target.checked;LIFE.commit()};
  el.querySelectorAll('[data-hga]').forEach(b=>b.onclick=()=>{HG.ask(b.dataset.hga);LIVES.commit();LIFE.commit();renderLife()});
  el.querySelectorAll('[data-hgd]').forEach(b=>b.onclick=()=>{HG.drop(b.dataset.hgd);LIFE.commit();renderLife()});
  if(q('hgAll'))q('hgAll').onclick=()=>{LIFE.allHG=true;renderLife()};
  if(q('hgGo'))q('hgGo').onclick=()=>{const R={guests:hg.guests.slice(),stake:hg.stake,rake:hg.rake};
    if(CAL.on()){const d=+(q('hgDay')||{}).value;if(!d){say('Sem dia livre na próxima semana.');return}
      if(d!==CAL.today()){CAL.add({kind:'hg',day:d,emo:'🍻',title:`Home game na sua casa (R$ ${STAKES[R.stake].sb}/${STAKES[R.stake].bb})`,desc:`Convidados: ${R.guests.join(', ')}. Se cancelar, eles ficam chateados.`,ref:R});
        R.guests.forEach(n=>LIFE.text(n,`Combinado: ${CAL.fmt(d)} lá em casa.`));hg.guests=[];hg.asked={};LIFE.commit();say(`Home game marcado para ${CAL.fmt(d,true)}.`);return}
      CAL.st().used[d]='hg'}
    const e=HG.start(R);if(e)say(e);else{hg.guests=[];hg.asked={};LIFE.commit()}};
  el.querySelectorAll('[data-hgi]').forEach(b=>b.onclick=()=>{const[a,k]=b.dataset.hgi.split(':'),v=LIFE.s.hgInv[+k];if(!v)return;
    if(a==='no'){LIFE.s.hgInv.splice(+k,1);LIVES.relAdd(v.host,'Você',-.2);LIFE.mine(v.host,'Não vou conseguir ir, foi mal!');LIFE.commit();renderLife();return}
    const R={host:v.host,guests:v.guests,stake:v.stake,rake:v.rake},t=CAL.today();
    if(CAL.on()&&v.day!==t){if(CAL.busy(v.day)){say('Você já tem compromisso nesse dia.');return}CAL.add({kind:'hgv',day:v.day,emo:'🍻',title:`Home game na casa de ${v.host}`,desc:`R$ ${STAKES[v.stake].sb}/${STAKES[v.stake].bb}. Se faltar, ${v.host} fica chateado.`,ref:R});v.acc=true;LIFE.mine(v.host,'Fechado, tô dentro!');LIFE.commit();say('Marcado na agenda.');return}
    if(CAL.on()&&CAL.st().used[t]){say('Hoje você já usou o dia com outra coisa.');return}
    const e=HG.start(R);if(e)say(e);else{if(CAL.on())CAL.st().used[t]='hg';LIFE.s.hgInv.splice(+k,1);LIFE.mine(v.host,'Tô chegando!');LIFE.commit()}})}

