/* ---------- matemática ---------- */
const pFlop=n=>1-((47-n)*(46-n))/(47*46), pOne=(n,unseen)=>n/unseen;
(function(){
  const rows=[['Flush draw (4 do mesmo naipe)',9],['Sequência aberta (ex.: 8-9-10-J)',8],['Duas cartas acima do board (overcards)',6],['Gutshot (falta a do meio: 8-9-_-J-Q)',4],
    ['Dois pares → full house',4],['Pocket pair → trinca (set)',2],['Trinca → full house ou quadra',7],['Flush draw + sequência aberta',15]];
  document.getElementById('outsTable').innerHTML=rows.map(([n,o])=>`<tr><td>${n}</td><td><b>${o}</b></td><td>${(pFlop(o)*100).toFixed(1)}% <span class="muted">(regra: ${Math.min(o*4,100)}%)</span></td><td>${(pOne(o,47)*100).toFixed(1)}% <span class="muted">(regra: ${o*2}%)</span></td></tr>`).join('');
  const ids=['cOuts','cStreet','cPot','cCall'];
  function calc(){const o=Math.max(0,Math.min(47,+cOuts.value||0)),st=cStreet.value,pot=+cPot.value||0,call=+cCall.value||0;
    const eq=st==='flop'?pFlop(o):st==='flop1'?pOne(o,47):pOne(o,46);
    const need=call>0?call/(pot+call):0;
    oEq.textContent=(eq*100).toFixed(1)+'%';oNeed.textContent=(need*100).toFixed(1)+'%';
    oOdds.textContent=call>0?(pot/call).toFixed(1).replace('.',',')+' : 1':'–';
    const v=document.getElementById('oVerdict');
    if(call<=0){v.className='verdict go';v.textContent='Nada a pagar: siga na mão.';return}
    if(eq>=need){v.className='verdict go';v.textContent=`Pagar é lucrativo: você acerta ${(eq*100).toFixed(0)}% das vezes e precisa de só ${(need*100).toFixed(0)}%.`}
    else{v.className='verdict no';v.textContent=`Desistir: você acerta ${(eq*100).toFixed(0)}% e precisaria de ${(need*100).toFixed(0)}%. Só pague se as odds implícitas compensarem a diferença.`}}
  ids.forEach(i=>document.getElementById(i).addEventListener('input',calc));calc();
})();

