/* ----- quadro por posição ----- */
(function(){
  const el=document.getElementById('posBoard');if(!el)return;
  const POS=[['UTG',7,'Primeira a falar: 7 jogadores ainda falam depois de você. Só mãos fortes.'],
    ['UTG+1',6,'Ainda muito cedo: 6 jogadores falam depois. Quase tão apertado quanto o UTG.'],
    ['MP',5,'Meio da mesa. Começam a entrar pares médios e suited conectadas melhores.'],
    ['HJ',4,'Duas antes do botão. A faixa abre bastante a partir daqui.'],
    ['CO',3,'Cutoff: só botão e blinds falam depois. Posição boa para roubar os blinds.'],
    ['BTN',2,'Botão: a melhor posição da mesa. Você fala por último em todas as rodadas depois do flop.'],
    ['SB',1,'Small blind: só o BB fala depois, mas você joga fora de posição a mão inteira.'],
    ['BB',0,'Big blind: você não abre, você defende. Sem aumento, veja o flop de graça; contra aumento pequeno, pague com uma faixa larga (você já tem fichas no pote).']];
  const pctOf=nb=>nb?RFI[nb]:0,inR=(k,nb)=>nb>0&&HPCT[k]<=pctOf(nb)+1e-9;
  const rng=nb=>ORDER169.filter(k=>inR(k,nb));
  const top10=ORDER169.slice(0,10),RK='AKQJT98765432';
  const chip=k=>`<span class="hchip">${k}</span>`;
  let sel='CO';
  function render(){
    const i=POS.findIndex(p=>p[0]===sel),[nm,nb,ds]=POS[i],R=rng(nb);
    const prev=i>0&&POS[i-1][1]>0&&nb>0?new Set(rng(POS[i-1][1])):null,news=prev?R.filter(k=>!prev.has(k)):[];
    let g='';RK.split('').forEach((a,x)=>RK.split('').forEach((b,y)=>{const k=x===y?a+b:x<y?a+b+'s':b+a+'o';g+=`<div class="${inR(k,nb)?(top10.includes(k)?'pt':'pin'):'pout'}">${k}</div>`}));
    el.innerHTML=`<div class="ptabs">${POS.map(p=>`<button class="sm${p[0]===sel?' on':''}" data-p="${p[0]}">${p[0]}</button>`).join('')}</div>
      <div class="grid2" style="align-items:start;margin-top:14px">
      <div><div class="pg">${g}</div><div class="muted" style="font-size:12px;margin-top:6px"><span class="psw pt"></span> top 10 &nbsp; <span class="psw pin"></span> abre daqui &nbsp; <span class="psw pout"></span> desista</div></div>
      <div><h3 style="margin-bottom:4px">${nm}</h3><p style="margin-top:0">${ds}</p>
      ${nb?`<div class="kpis" style="margin-bottom:12px"><div class="stat"><div class="k">Abra</div><div class="v">${pct(pctOf(nb))}</div><div class="k">das mãos</div></div><div class="stat"><div class="k">Tipos de mão</div><div class="v">${R.length}</div><div class="k">de 169</div></div></div>
      <div class="tip"><b class="gold">Top 10 (aumente sempre):</b><br>${top10.map(chip).join('')}</div>
      <div class="tip"><b class="gold">As 10 mais fracas que ainda entram aqui:</b><br>${R.slice(-10).map(chip).join('')}<br><span class="muted" style="font-size:13px">É a borda da faixa: com mão pior que essas, desista.</span></div>
      ${news.length?`<div class="tip"><b class="gold">Novas em relação ao ${POS[i-1][0]} (${news.length}):</b><br>${news.map(chip).join('')}</div>`:''}`
      :`<div class="tip">Contra um aumento pequeno, mãos como ${['KTo','QJo','A5o','98s','76s','55'].map(chip).join('')} já valem o call no BB. Com mãos do top 10, re-aumente (3-bet).</div>`}
      </div></div>
      <h3 style="margin-top:18px">Resumo da mesa (8 jogadores, ninguém aumentou antes)</h3>
      <table class="small"><tr><th>Posição</th><th>Abra</th><th>Tipos</th><th>As mais fracas que entram</th></tr>
      ${POS.filter(p=>p[1]).map(([n2,b2])=>{const r=rng(b2);return`<tr${n2===sel?' class="me"':''}><td>${n2}</td><td>${pct(pctOf(b2))}</td><td>${r.length}</td><td>${r.slice(-3).join(', ')}</td></tr>`}).join('')}</table>
      <p class="muted" style="font-size:13px">As 10 melhores mãos são as mesmas em qualquer posição. O que muda é até onde você desce na lista: do UTG você para cedo, do botão vai bem mais fundo. Com menos jogadores na mesa, cada posição joga como as últimas desta tabela.</p>`;
    el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{sel=b.dataset.p;render()})}
  render()})();
