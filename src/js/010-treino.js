/* ---------- treino ---------- */
const S={who:{ok:0,n:0},what:{ok:0,n:0},outs:{ok:0,n:0}};let mode='who';
const T=document.getElementById('trainer');
function scoreLine(){const s=S[mode];document.getElementById('score').innerHTML=`Acertos: <b>${s.ok}/${s.n}</b>${s.n?` · <b>${Math.round(s.ok/s.n*100)}%</b>`:''}`}
function setMode(m){mode=m;['Who','What','Outs'].forEach(x=>document.getElementById('m'+x).classList.toggle('on',x.toLowerCase()===m));scoreLine();({who:dealWho,what:dealWhat,outs:dealOuts})[m]()}
mWho.onclick=()=>setMode('who');mWhat.onclick=()=>setMode('what');mOuts.onclick=()=>setMode('outs');
function mark(scope,hand){const ids=new Set(hand.map(c=>c.id));scope.querySelectorAll('.card').forEach(el=>{el.classList.toggle('hl',ids.has(el.dataset.id));el.classList.toggle('dim',!ids.has(el.dataset.id))})}

function dealWho(){
  const d=newDeck();const hero=[d.pop(),d.pop()],vil=[d.pop(),d.pop()],board=[d.pop(),d.pop(),d.pop(),d.pop(),d.pop()];
  const H=best7([...hero,...board]),V=best7([...vil,...board]);const c=cmp(H.score,V.score);const ans=c>0?'hero':c<0?'vil':'tie';
  T.innerHTML=`<div class="felt"><div class="lbl">Mesa</div><div id="wb">${cardsHTML(board,'lg')}</div>
    <div class="seats"><div class="seat" id="wh"><div class="lbl">Você</div>${cardsHTML(hero,'lg')}<div class="nm"></div></div>
    <div class="seat" id="wv"><div class="lbl">Adversário</div>${cardsHTML(vil,'lg')}<div class="nm"></div></div></div></div>
    <div class="answers"><button data-a="hero">Você vence</button><button data-a="vil">Adversário vence</button><button data-a="tie">Empate</button></div>
    <div class="fb" id="fb"></div>`;
  T.querySelectorAll('.answers button').forEach(b=>b.onclick=()=>{
    const right=b.dataset.a===ans;S.who.n++;if(right)S.who.ok++;scoreLine();
    T.querySelectorAll('.answers button').forEach(x=>{x.disabled=true;if(x.dataset.a===ans)x.classList.add('right');else if(x===b)x.classList.add('wrong')});
    document.querySelector('#wh .nm').innerHTML=`<b class="gold">${describe(H.score)}</b>`;
    document.querySelector('#wv .nm').innerHTML=`<b class="gold">${describe(V.score)}</b>`;
    const win=ans==='vil'?V:H;
    if(ans!=='tie'){const loseSeat=ans==='hero'?'#wv':'#wh';document.querySelectorAll(loseSeat+' .card').forEach(e=>e.classList.add('dim'));
      mark(document.querySelector(ans==='hero'?'#wh':'#wv'),win.hand);mark(document.getElementById('wb'),win.hand)}
    else{mark(document.getElementById('wb'),H.hand)}
    let why='';
    if(ans==='tie')why='Mesmas 5 melhores cartas: o pote é dividido.';
    else if(H.score[0]===V.score[0])why='Mesma categoria de mão — desempata pelas cartas mais altas (inclusive o kicker).';
    else why=`${CAT[win.score[0]]} vence ${CAT[(ans==='hero'?V:H).score[0]].toLowerCase()}.`;
    document.getElementById('fb').innerHTML=`<div class="res ${right?'ok':'no'}">${right?'Certo!':'Não foi dessa vez.'}</div><div>${why}</div><div style="margin-top:10px"><button class="pri" id="nx">Próxima mão →</button></div>`;
    nx.onclick=dealWho});
}

function genCat(target){
  for(let k=0;k<3000;k++){const d=newDeck();let cs;
    if(target===7){const r=2+(Math.random()*13|0);cs=SUITS.map(s=>d.find(c=>c.r===r&&c.s===s));const rest=d.filter(c=>c.r!==r);cs.push(rest[0],rest[1],rest[2])}
    else if(target===8){const s=SUITS[Math.random()*4|0],hi=5+(Math.random()*9|0);const rs=[hi,hi-1,hi-2,hi-3,hi-4].map(r=>r===1?14:r);cs=rs.map(r=>d.find(c=>c.r===r&&c.s===s));const rest=d.filter(c=>!cs.includes(c));cs.push(rest[0],rest[1])}
    else cs=d.slice(0,7);
    const b=best7(cs);if(b.score[0]===target||(target>=7&&b.score[0]>=7)){for(let i=cs.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[cs[i],cs[j]]=[cs[j],cs[i]]}return cs}}
  return newDeck().slice(0,7)}
function dealWhat(){
  const target=[0,1,1,2,2,3,3,4,4,5,5,6,6,7,8][Math.random()*15|0];
  const cs=genCat(target);const hole=cs.slice(0,2),board=cs.slice(2);const B=best7(cs);const ans=B.score[0];
  T.innerHTML=`<div class="felt" id="wf"><div class="lbl">Mesa</div>${cardsHTML(board,'lg')}<div class="lbl" style="margin-top:14px">Suas cartas</div>${cardsHTML(hole,'lg')}</div>
    <p style="text-align:center;margin:14px 0 0">Qual é a sua melhor mão de 5 cartas?</p>
    <div class="answers">${CAT.map((n,i)=>`<button data-a="${i}">${n}</button>`).join('')}</div><div class="fb" id="fb"></div>`;
  T.querySelectorAll('.answers button').forEach(b=>b.onclick=()=>{
    const right=+b.dataset.a===ans;S.what.n++;if(right)S.what.ok++;scoreLine();
    T.querySelectorAll('.answers button').forEach(x=>{x.disabled=true;if(+x.dataset.a===ans)x.classList.add('right');else if(x===b)x.classList.add('wrong')});
    mark(document.getElementById('wf'),B.hand);
    document.getElementById('fb').innerHTML=`<div class="res ${right?'ok':'no'}">${right?'Certo!':'Errou.'}</div><div><b class="gold">${describe(B.score)}</b> — as 5 cartas destacadas.</div><div style="margin-top:10px"><button class="pri" id="nx">Próxima →</button></div>`;
    nx.onclick=dealWhat});
}

/* conte os outs: cenários no flop com draw definido */
function countOuts(hole,board){
  const used=new Set([...hole,...board].map(c=>c.id));const cur=best7([...hole,...board]).score[0];
  const goal=cur<4?4:cur+1;let n=0;const list=[];
  for(let r=2;r<=14;r++)for(const s of SUITS){const id=(r===10?'T':lbl(r))+s;if(used.has(id))continue;
    const c={r,s,id};const sc=best7([...hole,...board,c]).score[0];
    if(sc>=goal&&sc>=4){n++;list.push(c)}}
  return{n,list,cur}}
function dealOuts(){
  let hole,board,res;
  for(let k=0;k<4000;k++){const d=newDeck();hole=[d.pop(),d.pop()];board=[d.pop(),d.pop(),d.pop()];
    const cur=best7([...hole,...board]).score[0];if(cur>=4||cur>=2)continue;
    const suits={};[...hole,...board].forEach(c=>suits[c.s]=(suits[c.s]||0)+1);
    const fd=Math.max(...Object.values(suits))===4;
    res=countOuts(hole,board);
    if((fd||res.n===4||res.n===8)&&res.n>=4&&res.n<=15)break}
  const ans=res.n;
  const opts=[...new Set([ans,ans-1,ans+1,ans+3,ans-4,ans+6].filter(x=>x>0&&x<=20))].slice(0,5).sort((a,b)=>a-b);
  T.innerHTML=`<div class="felt" id="wf"><div class="lbl">Flop</div>${cardsHTML(board,'lg')}<div class="lbl" style="margin-top:14px">Suas cartas</div>${cardsHTML(hole,'lg')}</div>
    <p style="text-align:center;margin:14px 0 0">Quantos outs você tem para fazer <b>sequência ou melhor</b> na próxima carta?</p>
    <div class="answers">${opts.map(o=>`<button data-a="${o}">${o} outs</button>`).join('')}</div><div class="fb" id="fb"></div>`;
  T.querySelectorAll('.answers button').forEach(b=>b.onclick=()=>{
    const right=+b.dataset.a===ans;S.outs.n++;if(right)S.outs.ok++;scoreLine();
    T.querySelectorAll('.answers button').forEach(x=>{x.disabled=true;if(+x.dataset.a===ans)x.classList.add('right');else if(x===b)x.classList.add('wrong')});
    document.getElementById('fb').innerHTML=`<div class="res ${right?'ok':'no'}">${right?'Certo!':'Errou.'}</div>
      <div>São <b class="gold">${ans} outs</b>: ${(pFlop(ans)*100).toFixed(0)}% de acertar até o river, ${(pOne(ans,47)*100).toFixed(0)}% só no turn.</div>
      <div style="margin-top:8px">${cardsHTML(res.list,'sm')}</div><div style="margin-top:10px"><button class="pri" id="nx">Próxima →</button></div>`;
    nx.onclick=dealOuts});
}

