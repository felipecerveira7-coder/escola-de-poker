/* ----- revisão de torneio ----- */
const RST={sid:null};
function goReview(sid){RST.sid=sid;if(location.hash==='#revisao')renderReview();else location.hash='revisao'}
function rvVerdict(h){const errs=(h.d||[]).filter(d=>d.cat!=='ok');
  if(errs.length)return h.net>0?{c:'luck',t:'Ganhou, mas fora do plano'}:{c:'err',t:'Erro seu'};
  if(h.net<0)return h.sd?{c:'luck',t:'Azar: você jogou como o treinador'}:{c:'good',t:'Jogada correta, não deu'};
  return{c:'good',t:'Bem jogada'}}
function rvHand(h,label,open){
  const v=rvVerdict(h),bbv=h.net/h.bb;
  const errs=[...new Set((h.d||[]).filter(d=>d.cat!=='ok').map(d=>CATS[d.cat].nm))];
  const steps=(h.d||[]).map(d=>`<div class="rvstep"><div><b>${STN[d.s]}</b></div><div>${d.b?`<div class="ec">${cardsSm(d.b)}</div>`:''}
    <span class="muted">Pote ${nf(d.pot)}${d.tc?` · para pagar ${nf(d.tc)}`:''} · seu stack ${d.stk} BB${d.e!=null?` · sua chance ~${pct(d.e)}`:''}${d.nd!=null?` (precisava de ${pct(d.nd)})`:''}</span><br>
    <span class="${d.cat==='ok'?'ok':'bad'}">${d.cat==='ok'?'✔':'✖'} Você: ${actName(d.a,d.to)}</span>${d.cat!=='ok'?` · <span class="ok">Treinador: ${actName(d.ra,d.rto)}</span>`:''}
    <div class="muted" style="font-size:13px">${d.why}</div></div></div>`).join('');
  return`<div class="rvhand ${h.net<0?'loss':'win'}">
    <div class="eh">${label?`<b class="gold">${label}</b> · `:''}Mão #${h.n} · nível ${h.lv||'–'} · ${h.pos} · BB ${nf(h.bb)} <span class="rvtag ${v.c}">${v.t}</span></div>
    <div class="ec" style="margin:6px 0">${cardsSm(h.h)}${h.b?`<span class="muted" style="margin:0 6px">mesa</span>${cardsSm(h.b)}`:''}</div>
    <div><b class="${h.net<0?'bad':'ok'}">${h.net>=0?'+':''}${nf(h.net)} fichas</b> <span class="muted">(${bbv>=0?'+':''}${bbv.toFixed(1)} BB)</span>${errs.length?`<div class="bad" style="font-size:14px">${errs.join(' · ')}</div>`:''}</div>
    ${steps?`<details${open?' open':''}><summary class="muted" style="margin-top:6px">Ver jogada a jogada</summary>${steps}</details>`:''}</div>`}
function rvChart(pts,st,marks){
  const W=600,Hh=240,pl=10,pr=10,pt=26,pb=26,maxX=Math.max(1,pts[pts.length-1][0]),maxY=Math.max(st,...pts.map(p=>p[1]))*1.1;
  const X=x=>pl+(W-pl-pr)*x/maxX,Y=y=>pt+(Hh-pt-pb)*(1-y/maxY),cl=x=>Math.min(W-22,Math.max(22,x));
  const line=pts.map(p=>`${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ');
  return`<svg class="rvchart" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Evolução do seu stack ao longo do torneio">
    <polygon points="${X(0)},${Y(0)} ${line} ${X(maxX)},${Y(0)}" fill="rgba(214,167,75,.12)"/>
    <line x1="${pl}" x2="${W-pr}" y1="${Y(st)}" y2="${Y(st)}" stroke="#a8c1b4" stroke-dasharray="4 4" stroke-width="1"/>
    <text x="${pl}" y="${Y(st)-7}" fill="#a8c1b4" font-size="17">stack inicial ${nf(st)}</text>
    <polyline points="${line}" fill="none" stroke="#f0c96e" stroke-width="2" stroke-linejoin="round"/>
    ${marks.map(m=>{const p=pts.find(q=>q[0]===m.n);if(!p)return'';return`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="7" fill="${m.c}" stroke="#0d3528" stroke-width="1.5"/><text x="${cl(X(p[0]))}" y="${Math.max(17,Y(p[1])-12)}" fill="${m.c}" font-size="17" text-anchor="middle">#${m.n}</text>`}).join('')}
    <text x="${pl}" y="${Hh-6}" fill="#a8c1b4" font-size="17">mão 1</text><text x="${W-pr}" y="${Hh-6}" fill="#a8c1b4" font-size="17" text-anchor="end">mão ${maxX}</text></svg>`}
function renderReview(){
  const el=document.getElementById('revRoot');if(!el)return;
  const tours=HIST.sessions().filter(s=>s.mode==='tour');
  if(!tours.length){el.innerHTML=`<div class="panel"><h2>Revisão do torneio</h2><p>${HIST.status==='carregando'?'Carregando histórico…':'Nenhum torneio registrado ainda. Jogue um na aba <a href="#torneio" class="gold">Torneio</a> e volte aqui.'}</p></div>`;return}
  let s=tours.find(x=>x.sid===RST.sid);
  if(!s){s=[...tours].reverse().find(x=>x.place)||tours[tours.length-1];RST.sid=s.sid}
  const H=s.hands.slice().sort((a,b)=>a.n-b.n),st=(s.cfg&&s.cfg.stack)||1500,n=H.length;
  let cur=st,peak=st,peakN=0;const pts=[[0,st]];
  H.forEach(h=>{cur+=h.net;if(cur>peak){peak=cur;peakN=h.n}pts.push([h.n,Math.max(0,cur)])});
  const elim=s.place&&s.place>1?H[n-1]:null;
  const losses=H.filter(h=>h.net<0&&h!==elim).sort((a,b)=>a.net-b.net).slice(0,3);
  const wins=H.filter(h=>h.net>0).sort((a,b)=>b.net-a.net).slice(0,2);
  const D=[];H.forEach(h=>(h.d||[]).forEach(d=>D.push(Object.assign({h},d))));
  const vp=H.filter(h=>h.vp).length/n,pr=H.filter(h=>h.pr).length/n,okR=D.length?D.filter(d=>d.cat==='ok').length/D.length:0;
  const byCat={};D.forEach(d=>{if(d.cat!=='ok')byCat[d.cat]=(byCat[d.cat]||0)+1});
  const loose=H.filter(h=>(h.d||[]).some(d=>d.cat==='pf_loose')),looseNet=loose.reduce((a,h)=>a+h.net,0),looseWon=loose.filter(h=>h.net>0).length;
  const blinds=H.filter(h=>(h.pos==='SB'||h.pos==='BB')&&h.vp),blindsNet=blinds.reduce((a,h)=>a+h.net,0);
  const topC=Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  /* lições */
  const L=[];
  if(elim){const ee=[...new Set((elim.d||[]).filter(d=>d.cat!=='ok').map(d=>CATS[d.cat].nm.toLowerCase()))];
    L.push(ee.length?`<b>Eliminação (mão #${elim.n}):</b> você saiu do plano do treinador (${ee.join('; ')}). Veja a mão abaixo, jogada a jogada.`
      :`<b>Eliminação (mão #${elim.n}):</b> jogada como o treinador faria. Ali foi carta, não decisão.`)}
  if(peak>=st*1.6&&s.place!==1)L.push(`Você chegou a <b>${nf(peak)} fichas</b> na mão #${peakN} (${(peak/st).toFixed(1).replace('.',',')}x o stack inicial). Com stack grande, não coloque o torneio inteiro em risco com um par só: deixe os stacks curtos brigarem entre si.`);
  if(n>=15&&vp>.30)L.push(`Você entrou em <b>${pct(vp)}</b> das mãos (o saudável é 18–28%).`);
  if(loose.length>=3)L.push(`<b>${loose.length} mãos</b> estavam fora da faixa do treinador e deram saldo de <b class="${looseNet>=0?'ok':'bad'}">${looseNet>=0?'+':''}${nf(looseNet)} fichas</b>.${looseNet>0&&looseWon?` ${looseWon} deram certo, mas isso é sorte de curto prazo: no longo prazo essas mãos custam fichas.`:''} ${CATS.pf_loose.tip}`);
  if(blinds.length>=3&&blindsNet<0)L.push(`Entrando por conta própria nos blinds (SB/BB) você jogou ${blinds.length} mãos e saiu com <b class="bad">${nf(blindsNet)} fichas</b>. Fora de posição, seja mais seletivo, principalmente no small blind.`);
  if(topC&&topC[0]!=='pf_loose')L.push(`Erro mais frequente: <b>${CATS[topC[0]].nm}</b> (${topC[1]}x). ${CATS[topC[0]].tip}`);
  if(!L.length)L.push('Torneio sem vazamentos claros. Continue assim!');
  const marks=[];if(peakN)marks.push({n:peakN,c:'#f0c96e'});wins.forEach(h=>marks.push({n:h.n,c:'#5fcf8a'}));losses.forEach(h=>marks.push({n:h.n,c:'#ef6f5e'}));if(elim)marks.push({n:elim.n,c:'#ef6f5e'});
  const kp=(k,v,x='')=>`<div class="stat"><div class="k">${k}</div><div class="v">${v}</div>${x?`<div class="k">${x}</div>`:''}</div>`;
  const opt=tours.slice().reverse().map(t=>`<option value="${t.sid}"${t.sid===s.sid?' selected':''}>${new Date(t.t).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})} · ${t.place?t.place+'º de '+(t.of||'?'):'em andamento'} · ${t.hands.length} mãos</option>`).join('');
  let h=`<div class="panel"><div class="anahead"><div><h2 style="margin:0">Revisão do torneio</h2><div class="muted" style="font-size:13px">${s.cfg&&s.cfg.st?s.cfg.st:'Turbo'} · ${s.cfg&&s.cfg.field?s.cfg.field+' jogadores · multimesas':((s.cfg&&s.cfg.bots||0)+1)+' jogadores'}</div></div>
    <div class="anaf"><select id="rvSel">${opt}</select></div></div></div>
    <div class="kpis">${kp('Colocação',s.place?`${s.place}º de ${s.of||'?'}`:'em andamento')}${kp('Mãos jogadas',n)}${kp('Pico de fichas',nf(peak),peakN?`mão #${peakN}`:'')}
    ${kp('VPIP / PFR',`${pct(vp)} / ${pct(pr)}`,'bom: 18–28 / 14–22')}${kp('Decisões certas',pct(okR),`${D.length} decisões`)}</div>
    <div class="panel"><h3>Seu stack ao longo do torneio</h3>${rvChart(pts,st,marks)}
    <div class="muted" style="font-size:13px;margin-top:6px"><span class="gold">●</span> pico &nbsp; <span class="ok">●</span> maiores ganhos &nbsp; <span class="bad">●</span> maiores perdas</div></div>
    <div class="panel"><h3>O que tirar deste torneio</h3>${L.map((t,k)=>`<div class="tip"><b class="gold">${k+1}.</b> ${t}</div>`).join('')}</div>
    <div class="panel"><h3>Mãos-chave</h3>
    ${elim?rvHand(elim,'Eliminação',true):''}
    ${losses.map(x=>rvHand(x,'Perda')).join('')}
    ${wins.map(x=>rvHand(x,'Ganho')).join('')}</div>`;
  if(loose.length)h+=`<div class="panel"><h3>Mãos que você não devia ter jogado</h3><p class="muted" style="font-size:13px;margin-top:0">Fora da faixa do treinador para a posição. Mesmo as que ganharam: o resultado não muda a decisão.</p>
    ${loose.map(x=>`<div class="mini">${cardsSm(x.h)} <span class="muted">${x.pos} · mão #${x.n}</span> <b class="${x.net<0?'bad':x.net>0?'ok':'muted'}">${x.net>0?'+':''}${nf(x.net)}</b></div>`).join('')}</div>`;
  el.innerHTML=h;
  el.querySelector('#rvSel').onchange=e=>{RST.sid=e.target.value;renderReview()}}
HIST.init();try{CAR.touch(true)}catch(e){}
if(CAR.id==='qp'){WALLET.s.bal=1e6;['vida','circuito'].forEach(k=>{const a=document.querySelector(`nav a[href="#${k}"]`);if(a)a.style.display='none'});document.querySelector('nav .in').classList.add('qp')}
else{const a=document.querySelector('nav a[href="#torneio"]');if(a)a.innerHTML='<span class="ni">📅</span><span class="nl">Agenda</span>'}
document.querySelector('[data-menu]').onclick=()=>{document.getElementById('moreSheet').classList.remove('open');ttlOpen('menu')};
(()=>{let skip=false;try{skip=sessionStorage.getItem('escolaPoker.skipMenu')==='1';sessionStorage.removeItem('escolaPoker.skipMenu')}catch(e){}if(!skip)ttlOpen('menu')})();

route();setMode('who');

