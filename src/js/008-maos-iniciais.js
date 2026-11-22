/* ---------- mãos iniciais ---------- */
(function(){
  const tier=TIER;
  const INFO={1:['Premium','Aumente de qualquer posição. Se alguém já aumentou, re-aumente (3-bet).'],
    2:['Forte','Aumente de qualquer posição. Contra um re-aumento forte, muitas vezes é melhor só pagar ou desistir.'],
    3:['Jogável','Aumente das posições do meio e do final (MP, CO, BTN). Nas primeiras posições, desista.'],
    4:['Especulativa','Só do cutoff ou do botão, ou pagando barato para tentar acertar trinca, sequência ou flush.'],
    5:['Desista','Fold. Exceção: no big blind, quando ninguém aumentou, você vê o flop de graça.']};
  const RK='AKQJT98765432'.split('');const g=document.getElementById('hgrid');const pct={1:0,2:0,3:0,4:0,5:0};
  RK.forEach((a,i)=>RK.forEach((b,j)=>{
    const h=i===j?a+b:i<j?a+b+'s':b+a+'o';const t=tier[h]||5;
    pct[t]+=i===j?6:i<j?4:12;
    const d=document.createElement('div');d.className='t'+t;d.textContent=h;
    d.onclick=()=>{g.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));d.classList.add('sel');
      const nm=h.length===2?`Par de ${PLUR[{A:14,K:13,Q:12,J:11,T:10}[h[0]]||+h[0]]}`:`${h.slice(0,2).replace('T','10')} ${h[2]==='s'?'do mesmo naipe':'de naipes diferentes'}`;
      const combos=i===j?6:i<j?4:12;
      document.getElementById('hinfo').innerHTML=`<h3 style="margin:0 0 4px">${h} <span class="muted" style="font-size:14px;font-family:IBM Plex Sans">— ${nm}</span></h3>
        <div><b class="gold">${INFO[t][0]}.</b> ${INFO[t][1]}</div><div class="muted" style="font-size:13px;margin-top:6px">${combos} combinações possíveis desta mão.</div>`};
    g.appendChild(d)}));
  document.getElementById('legend').innerHTML=[1,2,3,4,5].map(t=>`<div class="it"><div class="sw t${t}"></div><div><b>${INFO[t][0]}</b> <span class="muted">(${(pct[t]/1326*100).toFixed(1)}% das mãos)</span><br><span style="font-size:14px">${INFO[t][1]}</span></div></div>`).join('');
})();

