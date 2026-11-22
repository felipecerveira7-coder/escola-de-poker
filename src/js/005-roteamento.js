/* ---------- roteamento ---------- */
const VIEWS=['basico','ranking','iniciais','matematica','treino','jogar','torneio','analise','revisao','jogadores','circuito','vida'];
function route(){const h=location.hash.slice(1);let v=VIEWS.includes(h)?h:(CAR.id==='qp'?'torneio':'vida');if(CAR.id==='qp'&&(v==='vida'||v==='circuito'))v='torneio';
  VIEWS.forEach(x=>document.getElementById('v-'+x).classList.toggle('on',x===v));
  document.querySelectorAll('nav a[href^="#"]:not([data-more]),#moreSheet a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+v));{const mo=document.querySelector('[data-more]');if(mo)mo.classList.toggle('on',!['vida','jogar','torneio','circuito'].includes(v));const ms=document.getElementById('moreSheet');if(ms)ms.classList.remove('open')}
  window.scrollTo(0,0);if(v==='analise'&&typeof renderAnalysis==='function')renderAnalysis();if(v==='revisao'&&typeof renderReview==='function')renderReview();if(v==='jogadores'&&typeof renderLives==='function')renderLives();if(v==='circuito'&&typeof renderCircuit==='function')renderCircuit();if(v==='vida'&&typeof renderLife==='function')renderLife()}
addEventListener('hashchange',route);
document.querySelector('[data-more]').onclick=e=>{e.preventDefault();document.getElementById('moreSheet').classList.toggle('open')};
document.getElementById('moreSheet').onclick=e=>{if(e.target.id==='moreSheet'||e.target.hasAttribute('data-mclose'))e.currentTarget.classList.remove('open')};
document.querySelectorAll('#moreSheet a').forEach(a=>a.addEventListener('click',()=>{document.getElementById('moreSheet').classList.remove('open')}));

