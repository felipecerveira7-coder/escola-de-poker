/* ----- interface da análise ----- */
const AST={mode:'all',last:'all',confirm:false,copied:''};
const REFV={UTG:[8,16],'UTG+1':[9,17],MP:[11,20],LJ:[13,22],HJ:[15,25],CO:[20,32],BTN:[28,50],SB:[20,40],BB:[25,50]};
const STN={p:'Pré-flop',f:'Flop',t:'Turn',r:'River'};
const idCards=s=>(s||'').match(/.{2}/g)||[];
const cardsSm=s=>idCards(s).map(id=>cardHTML(CARD[id],'sm')).join('');
const cardsTxt=s=>idCards(s).map(id=>(id[0]==='T'?'10':id[0])+SYM[id[1]]).join(' ');
const actName=(a,to)=>a==='f'?'desistir':a==='x'?'check':a==='c'?'pagar':`apostar/aumentar${to?' para '+nf(to):''}`;
function refreshAnalysis(){if(location.hash==='#analise')renderAnalysis();else if(location.hash==='#revisao'&&typeof renderReview==='function')renderReview()}

function analyze(H){
  const n=H.length,D=[];H.forEach(h=>(h.d||[]).forEach(d=>D.push(Object.assign({h},d))));
  const sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);
  const netBB=sum(H,h=>h.net/h.bb),vp=sum(H,h=>h.vp)/n,pr=sum(H,h=>h.pr)/n;
  const post=D.filter(d=>d.s!=='p'),af=post.filter(d=>d.a==='r').length/Math.max(1,post.filter(d=>d.a==='c').length);
  const aligned=D.length?D.filter(d=>d.cat==='ok').length/D.length:0,evLost=sum(D,d=>d.ev||0);
  const cash=H.filter(h=>h.mode==='cash'),bb100=cash.length?sum(cash,h=>h.net/h.bb)/cash.length*100:null;
  const sd=H.filter(h=>h.sd),wsd=sd.length?sd.filter(h=>h.w).length/sd.length:null;
  const byCat={};D.forEach(d=>{if(d.cat==='ok')return;const c=byCat[d.cat]||(byCat[d.cat]={n:0,ev:0});c.n++;c.ev+=d.ev||0});
  const byPos={};H.forEach(h=>{const p=byPos[h.pos]||(byPos[h.pos]={n:0,vp:0,pr:0,net:0});p.n++;p.vp+=h.vp;p.pr+=h.pr;p.net+=h.net/h.bb});
  const byStreet={};D.forEach(d=>{const s=byStreet[d.s]||(byStreet[d.s]={n:0,ok:0});s.n++;if(d.cat==='ok')s.ok++});
  /* o que melhorar */
  const tips=[];
  if(n>=20&&vp>.32)tips.push({sev:3,t:'Você entra em mãos demais',d:`Seu VPIP é ${pct(vp)}; numa mesa de 6 a 9 jogadores o saudável é 18–28%. Corte as mãos marginais nas primeiras posições.`});
  if(n>=20&&vp<.12)tips.push({sev:2,t:'Você está apertado demais',d:`VPIP de ${pct(vp)}: os adversários percebem e param de pagar suas apostas. Abra mais do cutoff e do botão.`});
  if(n>=20&&vp>.08&&pr/vp<.55)tips.push({sev:2.5,t:'Pague menos, aumente mais pré-flop',d:`PFR de ${pct(pr)} para VPIP de ${pct(vp)}: você entra pagando em vez de aumentar. Quem joga bem aumenta em ~70% das mãos que joga.`});
  if(post.length>=15&&af<1.3)tips.push({sev:2,t:'Jogo passivo depois do flop',d:`Seu AF é ${af.toFixed(1)} (bom: 2–3). Você paga mais do que aposta: com mão boa, aposte; com mão ruim, desista.`});
  Object.entries(byCat).sort((a,b)=>(b[1].ev+b[1].n*CATS[b[0]].w*.3)-(a[1].ev+a[1].n*CATS[a[0]].w*.3)).slice(0,2).forEach(([k,c])=>
    tips.push({sev:1.5+c.ev/10+c.n*CATS[k].w*.1,t:CATS[k].nm+` (${c.n}x${c.ev?`, ~${c.ev.toFixed(1)} BB`:''})`,d:CATS[k].tip}));
  const shortErr=D.filter(d=>d.s==='p'&&d.stk<=13&&d.cat!=='ok').length;
  if(shortErr>=3)tips.push({sev:2.2,t:'Stack curto: all-in ou desistir',d:`${shortErr} decisões com 13 BB ou menos fugiram da faixa de push/fold. Com stack curto, aumentos pequenos e calls te deixam sem fichas e sem fold equity.`});
  Object.entries(byPos).forEach(([p,s])=>{if(s.n>=10&&s.net<-15)tips.push({sev:1.2,t:`Vazamento no ${p}`,d:`Você perdeu ${Math.abs(s.net).toFixed(0)} BB em ${s.n} mãos nessa posição (VPIP ${pct(s.vp/s.n)}; referência ${REFV[p]?REFV[p].join('–')+'%':'–'}).`})});
  tips.sort((a,b)=>b.sev-a.sev);
  /* acertos */
  const good=[];
  if(D.length>=10)good.push(`<b>${pct(aligned)}</b> das suas decisões bateram com o treinador${aligned>=.7?' — ótimo nível':aligned>=.55?' — bom caminho':''}.`);
  const gf=D.filter(d=>d.a==='f'&&d.ra==='f'&&d.tc>0);if(gf.length)good.push(`<b>${gf.length}</b> desistências corretas: você deixou de colocar <b>${sum(gf,d=>d.tc/d.h.bb).toFixed(0)} BB</b> em situações sem odds.`);
  const vb=post.filter(d=>d.a==='r'&&d.ra==='r');if(vb.length)good.push(`<b>${vb.length}</b> apostas/aumentos por valor no momento certo.`);
  const gc=D.filter(d=>d.a==='c'&&d.ra==='c'&&d.s!=='p');if(gc.length)good.push(`<b>${gc.length}</b> calls corretos pelas pot odds depois do flop.`);
  if(wsd!=null&&sd.length>=5&&wsd>=.5)good.push(`Quando vai ao showdown você vence <b>${pct(wsd)}</b> — boa seleção de mãos para ir até o fim.`);
  if(n>=20&&vp>=.15&&vp<=.30)good.push(`VPIP de <b>${pct(vp)}</b>, dentro da faixa saudável.`);
  Object.entries(byPos).filter(([p,s])=>s.n>=8&&s.net>10).forEach(([p,s])=>good.push(`Lucro de <b>${s.net.toFixed(0)} BB</b> jogando no ${p}.`));
  const best=[...H].sort((a,b)=>b.net/b.bb-a.net/a.bb).filter(h=>h.net>0).slice(0,3);
  const errs=D.filter(d=>d.cat!=='ok').sort((a,b)=>((b.ev||0)+CATS[b.cat].w*.4)-((a.ev||0)+CATS[a.cat].w*.4)).slice(0,8);
  return{n,D,netBB,vp,pr,af,aligned,evLost,bb100,wsd,sdN:sd.length,byCat,byPos,byStreet,tips:tips.slice(0,5),good,best,errs,cashN:cash.length}}

function summaryText(H,A){
  const L=[];L.push(`ANÁLISE — Escola de Poker (${A.n} mãos)`);
  L.push(`Resultado: ${A.netBB>=0?'+':''}${A.netBB.toFixed(1)} BB${A.bb100!=null?` · ${A.bb100.toFixed(1)} BB/100 no cash`:''}`);
  L.push(`VPIP ${pct(A.vp)} · PFR ${pct(A.pr)} · AF ${A.af.toFixed(1)} · alinhado ao treinador ${pct(A.aligned)} · EV perdido estimado ${A.evLost.toFixed(1)} BB`);
  L.push('','Por posição:');Object.entries(A.byPos).forEach(([p,s])=>L.push(`- ${p}: ${s.n} mãos, VPIP ${pct(s.vp/s.n)}, PFR ${pct(s.pr/s.n)}, ${s.net>=0?'+':''}${s.net.toFixed(1)} BB`));
  L.push('','Erros por tipo:');Object.entries(A.byCat).forEach(([k,c])=>L.push(`- ${CATS[k].nm}: ${c.n}x${c.ev?`, ~${c.ev.toFixed(1)} BB`:''}`));
  L.push('','Maiores erros:');A.errs.forEach(d=>L.push(`- Mão #${d.h.n} (${d.h.mode==='tour'?'torneio':'cash'}, ${d.h.pos}, ${STN[d.s]}): ${cardsTxt(d.h.h)}${d.b?' | mesa '+cardsTxt(d.b):''} · pote ${d.pot}, pagar ${d.tc}, stack ${d.stk} BB${d.e!=null?`, chance ~${pct(d.e)}`:''}${d.nd!=null?` vs ${pct(d.nd)} necessários`:''} · você: ${actName(d.a,d.to)} · treinador: ${actName(d.ra,d.rto)}${d.ev?` · ~${d.ev.toFixed(1)} BB`:''}`));
  return L.join('\n')}

function renderAnalysis(){
  const el=document.getElementById('anaRoot');if(!el)return;
  let H=HIST.hands().filter(h=>AST.mode==='all'||h.mode===AST.mode);
  if(AST.last!=='all')H=H.slice(-(+AST.last));
  const stt={carregando:'Carregando histórico…',local:'Salvo só neste navegador',nuvem:'Salvo na sua conta',erro:'Sem acesso ao banco agora — salvando neste navegador',cheio:'Banco cheio: apague o histórico antigo'}[HIST.status]||'';
  const sel=(k,arr)=>`<select data-k="${k}">${arr.map(([v,l])=>`<option value="${v}"${AST[k]===v?' selected':''}>${l}</option>`).join('')}</select>`;
  let h=`<div class="panel"><div class="anahead"><div><h2 style="margin:0">Análise do seu jogo</h2><div class="muted" style="font-size:13px">${stt} · ${HIST.hands().length} mãos registradas</div></div>
    <div class="anaf">${sel('mode',[['all','Cash + torneio'],['cash','Só cash'],['tour','Só torneio']])}${sel('last',[['all','Todas as mãos'],['50','Últimas 50'],['200','Últimas 200']])}
    <button class="sm" data-b="copy">Copiar resumo</button>${AST.confirm?'<span class="muted">Apagar tudo?</span> <button class="sm pfold" data-b="del2">Sim, apagar</button> <button class="sm" data-b="del0">Cancelar</button>':'<button class="sm" data-b="del">Apagar histórico</button>'}</div></div>
    ${AST.copied?`<div class="muted" style="margin-top:8px;font-size:13px">${AST.copied}</div>`:''}
    <p class="muted" style="font-size:13px;margin:10px 0 0">Cada decisão sua é comparada com o que o treinador (lógica do Tubarão) faria naquele momento. "Custo estimado" = fichas de valor esperado perdidas em calls/folds contra as pot odds, em big blinds. É uma referência heurística, não um solver.</p></div>`;
  if(!H.length){el.innerHTML=h+`<div class="panel"><h3>Nenhuma mão registrada ainda</h3><p>Jogue nas abas <a href="#jogar" class="gold">Jogar</a> ou <a href="#torneio" class="gold">Torneio</a>. A partir de agora toda mão que você jogar fica salva, e esta página mostra onde você errou, o que acertou e o que melhorar.</p></div>`;wire(el);return}
  const A=analyze(H);
  const kp=(k,v,s='')=>`<div class="stat"><div class="k">${k}</div><div class="v">${v}</div>${s?`<div class="k">${s}</div>`:''}</div>`;
  h+=`<div class="kpis">${kp('Mãos',A.n)}${kp('Resultado',`${A.netBB>=0?'+':''}${A.netBB.toFixed(0)} BB`,A.bb100!=null?`${A.bb100.toFixed(1)} BB/100 no cash`:'')}
    ${kp('VPIP / PFR',`${pct(A.vp)} / ${pct(A.pr)}`,'bom: 18–28 / 14–22')}${kp('AF pós-flop',A.af.toFixed(1),'bom: 2–3')}
    ${kp('Decisões certas',pct(A.aligned),`${A.D.length} decisões`)}${kp('Custo estimado',`${A.evLost.toFixed(1)} BB`,'em calls/folds errados')}</div>`;
  h+=stylePanel(H);
  h+=`<div class="grid2"><div class="panel"><h3>O que melhorar</h3>${A.tips.length?A.tips.map((t,k)=>`<div class="tip"><b class="gold">${k+1}. ${t.t}</b><br><span style="font-size:14px">${t.d}</span></div>`).join(''):'<p class="muted">Sem vazamentos claros nesta amostra. Jogue mais mãos para a análise ficar confiável (ideal: 200+).</p>'}</div>
    <div class="panel"><h3>O que você fez bem</h3>${A.good.length?A.good.map(g=>`<div class="tip">${g}</div>`).join(''):'<p class="muted">Ainda poucas decisões para destacar acertos.</p>'}
    ${A.best.length?`<h3 style="margin-top:14px">Maiores potes ganhos</h3>${A.best.map(b=>`<div class="mini">${cardsSm(b.h)} <span class="muted">${b.pos} · ${b.mode==='tour'?'torneio':'cash'} · mão #${b.n}</span> <b class="ok">+${(b.net/b.bb).toFixed(0)} BB</b></div>`).join('')}`:''}</div></div>`;
  const cats=Object.entries(A.byCat).sort((a,b)=>b[1].n-a[1].n),maxN=Math.max(1,...cats.map(c=>c[1].n));
  h+=`<div class="grid2"><div class="panel"><h3>Onde você mais erra</h3>${cats.length?`<table class="small"><tr><th>Tipo de erro</th><th>Vezes</th><th>Custo</th></tr>${cats.map(([k,c])=>`<tr><td>${CATS[k].nm}<div class="bar"><span style="width:${c.n/maxN*100}%"></span></div></td><td>${c.n}</td><td>${c.ev?c.ev.toFixed(1)+' BB':'–'}</td></tr>`).join('')}</table>`:'<p class="ok">Nenhum desvio do treinador nesta amostra.</p>'}
    <h3 style="margin-top:14px">Acerto por rodada</h3><table class="small"><tr><th>Rodada</th><th>Decisões</th><th>Certas</th></tr>${['p','f','t','r'].filter(s=>A.byStreet[s]).map(s=>`<tr><td>${STN[s]}</td><td>${A.byStreet[s].n}</td><td>${pct(A.byStreet[s].ok/A.byStreet[s].n)}</td></tr>`).join('')}</table></div>
    <div class="panel"><h3>Por posição</h3><table class="small"><tr><th>Pos.</th><th>Mãos</th><th>VPIP</th><th>Ref.</th><th>PFR</th><th>Resultado</th></tr>
    ${Object.entries(A.byPos).sort((a,b)=>Object.keys(REFV).indexOf(a[0])-Object.keys(REFV).indexOf(b[0])).map(([p,s])=>{const v=s.vp/s.n*100,r=REFV[p],flag=r&&s.n>=5?(v>r[1]?'bad':v<r[0]?'warn':'ok'):'';
      return`<tr><td>${p}</td><td>${s.n}</td><td class="${flag}">${v.toFixed(0)}%</td><td class="muted">${r?r.join('–')+'%':'–'}</td><td>${(s.pr/s.n*100).toFixed(0)}%</td><td class="${s.net>=0?'ok':'bad'}">${s.net>=0?'+':''}${s.net.toFixed(0)} BB</td></tr>`}).join('')}</table>
    <p class="muted" style="font-size:12px">VPIP em vermelho: acima da referência; em laranja: abaixo. Com poucas mãos por posição, os números oscilam muito.</p></div></div>`;
  h+=`<div class="panel"><h3>Seus maiores erros, mão a mão</h3>${A.errs.length?A.errs.map(d=>`<div class="err">
    <div class="eh">Mão #${d.h.n} · ${d.h.mode==='tour'?'Torneio':'Cash'} · ${d.h.pos} · ${STN[d.s]}${d.ev?` · <b class="bad">custo ~${d.ev.toFixed(1)} BB</b>`:''}</div>
    <div class="ec">${cardsSm(d.h.h)}${d.b?`<span class="muted" style="margin:0 6px">mesa</span>${cardsSm(d.b)}`:''}</div>
    <div style="font-size:14px">Pote ${nf(d.pot)} · para pagar ${nf(d.tc)} · seu stack ${d.stk} BB${d.e!=null?` · sua chance ~${pct(d.e)}`:''}${d.nd!=null?` (precisava de ${pct(d.nd)})`:''}</div>
    <div style="margin-top:4px"><span class="bad">Você: ${actName(d.a,d.to)}</span> · <span class="ok">Treinador: ${actName(d.ra,d.rto)}</span> <span class="muted">— ${CATS[d.cat].nm}</span></div>
    <div class="muted" style="font-size:14px;margin-top:2px">${d.why}</div></div>`).join(''):'<p class="ok">Nenhum erro registrado nesta amostra.</p>'}</div>`;
  const tours=HIST.sessions().filter(s=>s.mode==='tour'&&(AST.mode!=='cash'));
  if(tours.length)h+=`<div class="panel"><h3>Seus torneios</h3><table class="small"><tr><th>Data</th><th>Estrutura</th><th>Jogadores</th><th>Mãos jogadas</th><th>Colocação</th><th></th></tr>${tours.slice(-15).reverse().map(s=>`<tr><td>${new Date(s.t).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</td><td>${s.cfg&&s.cfg.st?s.cfg.st.split(' (')[0]:'Turbo'}</td><td>${s.cfg&&s.cfg.field?s.cfg.field+' (MTT)':(s.cfg&&s.cfg.bots||0)+1}</td><td>${s.hands.length}</td><td class="${s.place===1?'ok':''}">${s.place?s.place+'º'+(s.of?' de '+s.of:''):'em andamento'}</td><td><a href="#revisao" class="gold" data-rv="${s.sid}">Revisar</a></td></tr>`).join('')}</table></div>`;
  el.innerHTML=h;wire(el,H,A)}
function wire(el,H,A){
  el.querySelectorAll('a[data-rv]').forEach(a=>a.onclick=e=>{e.preventDefault();goReview(a.dataset.rv)});
  el.querySelectorAll('select[data-k]').forEach(s=>s.onchange=()=>{AST[s.dataset.k]=s.value;AST.copied='';renderAnalysis()});
  const b=k=>el.querySelector(`[data-b="${k}"]`);
  if(b('copy'))b('copy').onclick=()=>{if(!H||!H.length){AST.copied='Nada para copiar ainda.';return renderAnalysis()}
    const txt=summaryText(H,A);
    const show=()=>{AST.copied='Não consegui copiar automaticamente; selecione o texto abaixo.';renderAnalysis();const ta=document.createElement('textarea');ta.value=txt;ta.rows=10;ta.style.width='100%';ta.style.marginTop='8px';el.querySelector('.panel').appendChild(ta);ta.select()};
    try{navigator.clipboard.writeText(txt).then(()=>{AST.copied='Resumo copiado — cole no chat para uma análise mais detalhada.';renderAnalysis()},show)}catch(e){show()}};
  if(b('del'))b('del').onclick=()=>{AST.confirm=true;renderAnalysis()};
  if(b('del0'))b('del0').onclick=()=>{AST.confirm=false;renderAnalysis()};
  if(b('del2'))b('del2').onclick=async()=>{AST.confirm=false;await HIST.clear();renderAnalysis()}}
