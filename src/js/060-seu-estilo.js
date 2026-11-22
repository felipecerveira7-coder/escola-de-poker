/* ----- seu estilo ----- */
function styleOf(H){
  const n=H.length;if(!n)return null;
  const vp=H.filter(h=>h.vp).length/n,pr=H.filter(h=>h.pr).length/n;
  const short=h=>{const d=(h.d||[])[0];return (h.np||9)<=3||(d&&d.stk<=15)};
  const has=(h,c)=>(h.d||[]).some(d=>d.cat===c);
  const ctx=(f)=>{const X=H.filter(f),m=X.length||1;return{n:X.length,vp:X.filter(h=>h.vp).length/m,loose:X.filter(h=>has(h,'pf_loose')).length,tight:X.filter(h=>has(h,'pf_tight')).length}};
  const full=ctx(h=>!short(h)),sh=ctx(short);
  const D=[];H.forEach(h=>(h.d||[]).forEach(d=>{if(d.s!=='p')D.push(d)}));
  const pc=c=>D.filter(d=>d.cat===c).length;
  const post={aggr:pc('aggr'),passive:pc('passive'),callBad:pc('call_bad'),foldBad:pc('fold_bad'),n:D.length};
  const ratio=vp?pr/vp:0,bv=full.n>=20?full.vp:vp,loose=bv>.28,tight=bv<.18,agg=ratio>=.55;
  const nm=loose?(agg?'LAG — solto e agressivo':'Solto e passivo (estação)'):tight?(agg?'Tight demais (pedra agressiva)':'Pedra — fechado e passivo'):(agg?'TAG — seletivo e agressivo':'Seletivo, mas passivo');
  const ds=loose?(agg?'Entra em muitos potes e costuma tomar a iniciativa. Funciona quando a seleção de mãos e a posição acompanham; sem isso, vaza fichas.':'Entra em muitos potes só pagando. É o perfil que mais perde no longo prazo: aumente mais ou entre menos.')
    :tight?'Joga poucas mãos. Seguro, mas previsível: os bots roubam seus blinds e você deixa valor na mesa.'
    :(agg?'O estilo recomendado: poucas mãos boas, jogadas com agressividade.':'Escolhe bem as mãos, mas paga mais do que aumenta. Tome a iniciativa com as mãos que entra.');
  const flags=[];
  if(full.n>=20&&sh.n>=15&&full.loose/full.n>=.07&&sh.tight/sh.n>=.07)flags.push({t:'Solto na mesa cheia, travado na mesa curta',d:`Com mesa cheia você entrou com mão fraca demais em ${full.loose} mãos (${pct(full.loose/full.n)}); com 2–3 jogadores ou menos de 15 BB, largou mão jogável em ${sh.tight} (${pct(sh.tight/sh.n)}). Um bom jogador faz o contrário: aperta na mesa cheia e abre o jogo quando ela encurta.`});
  else{
    if(full.n>=20&&full.loose/full.n>=.07)flags.push({t:'Entra em pote demais com a mesa cheia',d:`${full.loose} mãos (${pct(full.loose/full.n)}) fora da faixa, quase sempre pagando aumento ou abrindo marginal no meio da mesa. Contra aumento: re-aumente ou largue.`});
    if(sh.n>=15&&sh.tight/sh.n>=.07)flags.push({t:'Travado com mesa curta ou stack curto',d:`Largou mão jogável em ${sh.tight} mãos (${pct(sh.tight/sh.n)}). No heads-up o botão abre ~80% das mãos; com menos de 15 BB é all-in ou fold.`});}
  if(post.n>=20&&post.aggr/post.n>=.06)flags.push({t:'Aposta mão média quando era hora de controlar o pote',d:`${post.aggr} vezes você apostou ou aumentou onde o treinador daria check com mão média. É onde saem os potes grandes perdidos.`});
  if(post.n>=20&&post.passive/post.n>=.06)flags.push({t:'Deixa de apostar mão forte e c-bet',d:`${post.passive} vezes você deu check onde valia apostar por valor ou continuar a agressão do pré-flop.`});
  if(post.callBad>=3)flags.push({t:'Paga até o fim sem odds',d:`${post.callBad} calls pós-flop sem a chance que o preço exigia.`});
  return{n,vp,pr,ratio,af:null,nm,ds,full,sh,post,flags:flags.slice(0,3)}}
function styleTrend(){
  const S=HIST.sessions().filter(s=>(AST.mode==='all'||s.mode===AST.mode)&&s.hands.length>=10).slice(-8);
  return S.map(s=>{const H=s.hands,n=H.length,has=(h,c)=>(h.d||[]).some(d=>d.cat===c);
    const post=H.reduce((a,h)=>a+(h.d||[]).filter(d=>d.s!=='p'&&(d.cat==='aggr'||d.cat==='passive'||d.cat==='call_bad'||d.cat==='fold_bad')).length,0);
    return{s,n,vp:H.filter(h=>h.vp).length/n,loose:H.filter(h=>has(h,'pf_loose')).length/n,tight:H.filter(h=>has(h,'pf_tight')).length/n,post:post/n}})}
function stylePanel(H){
  const S=styleOf(H);if(!S||S.n<20)return`<div class="panel"><h3>Seu estilo</h3><p class="muted">Jogue pelo menos 20 mãos para o app identificar seu estilo.</p></div>`;
  const T=styleTrend(),f=x=>pct(x);
  let tr='';
  if(T.length>=2){const last=T[T.length-1],prev=T.slice(0,-1),avg=k=>prev.reduce((a,t)=>a+t[k],0)/prev.length;
    const cmp=(k,nm)=>{const a=avg(k),b=last[k];if(Math.abs(b-a)<.02)return`${nm}: estável`;return b<a?`<span class="ok">${nm}: melhorou</span>`:`<span class="bad">${nm}: piorou</span>`};
    tr=`<h3 style="margin-top:16px">Evolução por sessão</h3><div style="overflow-x:auto"><table class="small" style="font-size:13px"><tr><th>Sessão</th><th>VPIP</th><th>Solto</th><th>Travado</th><th>Pós-flop</th></tr>
      ${T.map(t=>`<tr><td>${new Date(t.s.t).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit'})}<div class="muted" style="font-size:12px">${t.s.mode==='tour'?(t.s.place?`torneio · ${t.s.place}º`:'torneio'):'cash'} · ${t.n} mãos</div></td><td>${f(t.vp)}</td><td class="${t.loose>=.1?'bad':''}">${f(t.loose)}</td><td class="${t.tight>=.1?'bad':''}">${f(t.tight)}</td><td class="${t.post>=.08?'bad':''}">${f(t.post)}</td></tr>`).join('')}</table></div>
      <p style="font-size:14px;margin:8px 0 0">Última sessão contra a média das anteriores: ${cmp('loose','entrar demais')} · ${cmp('tight','largar demais')} · ${cmp('post','pós-flop')}</p>
      <p class="muted" style="font-size:12px;margin-top:4px">Solto = entrou com mão fraca demais; Travado = largou mão que devia jogar; Pós-flop = apostou, deu check, pagou ou largou fora do plano. Em % das mãos da sessão: quanto menor, melhor.</p>`}
  return`<div class="panel"><h3>Seu estilo</h3>
    <div class="grid2" style="align-items:start"><div>
      <div class="gold" style="font-size:22px;font-family:Fraunces,Georgia,serif;margin-bottom:4px">${S.nm}</div>
      <p style="margin-top:0">${S.ds}</p>
      <div class="kpis" style="margin:0"><div class="stat"><div class="k">Mesa cheia</div><div class="v">${f(S.full.vp)}</div><div class="k">VPIP · ${S.full.n} mãos</div></div>
      <div class="stat"><div class="k">Mesa curta / stack curto</div><div class="v">${f(S.sh.vp)}</div><div class="k">VPIP · ${S.sh.n} mãos</div></div></div>
      <p class="muted" style="font-size:12px;margin-top:6px">Mesa curta = 2–3 jogadores ou até 15 BB. Nela o VPIP certo é bem maior que na mesa cheia.</p></div>
    <div><b>Seus vazamentos de estilo</b>${S.flags.length?S.flags.map((x,k)=>`<div class="tip"><b class="gold">${k+1}. ${x.t}</b><br><span style="font-size:14px">${x.d}</span></div>`).join(''):'<p class="ok">Nenhum vazamento de estilo claro nesta amostra.</p>'}</div></div>
    ${tr}</div>`}
