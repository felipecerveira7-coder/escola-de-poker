/* ---------- ranking ---------- */
(function(){
  const R=[
    ['Royal flush','10, J, Q, K, A do mesmo naipe. A mão máxima.','As Ks Qs Js Ts','0,003%'],
    ['Straight flush','Cinco cartas em sequência do mesmo naipe.','9h 8h 7h 6h 5h','0,03%'],
    ['Quadra','Quatro cartas do mesmo valor.','Qs Qh Qd Qc 4s','0,17%'],
    ['Full house','Uma trinca + um par.','Kd Kc Ks 7h 7d','2,6%'],
    ['Flush','Cinco cartas do mesmo naipe, fora de sequência.','Ad Jd 8d 5d 2d','3,0%'],
    ['Sequência (straight)','Cinco cartas em sequência, naipes variados.','Tc 9h 8s 7d 6c','4,6%'],
    ['Trinca','Três cartas do mesmo valor.','8s 8h 8c Kd 3s','4,8%'],
    ['Dois pares','Dois pares diferentes.','Jh Jc 4s 4d As','23,5%'],
    ['Par','Duas cartas do mesmo valor.','Ah Ad Ks 9c 3h','43,8%'],
    ['Carta alta','Nada formado: vale a carta mais alta.','Ks Jd 8h 5c 2s','17,4%']];
  document.getElementById('ranklist').innerHTML=R.map((x,i)=>`<div class="rank"><div class="pos">${i+1}</div>
    <div><div class="nm">${x[0]}</div><div class="ds">${x[1]}</div><div class="cards" style="margin-top:6px">${cardsHTML(parse(x[2]),'sm')}</div></div>
    <div class="pr"><b>${x[3]}</b>de chance</div></div>`).join('');
})();

const TIER_DEF={1:'AA KK QQ JJ AKs AKo',2:'TT 99 AQs AQo AJs KQs ATs',3:'88 77 AJo KQo KJs QJs JTs KTs QTs ATo',
  4:'66 55 44 33 22 A9s A8s A7s A6s A5s A4s A3s A2s KJo QJo KTo K9s Q9s J9s T9s T8s 98s 87s 76s 65s 54s'};
const TIER={};for(const k in TIER_DEF)TIER_DEF[k].split(' ').forEach(h=>TIER[h]=+k);
