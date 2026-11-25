/* =============== v67: o 📱 leva direto pro que falta ver =============== */
const PEND={
  list(){const s=LIFE.s;if(!s)return[];const o=[];
    if(s.notes.some(x=>!x.read))o.push({k:'tab:cel',n:s.notes.filter(x=>!x.read).length,t:'notificações'});
    if(s.love&&s.love.tu)o.push({k:'cel:♥',n:s.love.tu,t:s.love.nm});
    Object.entries(s.th||{}).filter(([,T])=>T.u).sort((a,b)=>(b[1].t||0)-(a[1].t||0)).forEach(([n,T])=>o.push({k:'cel:'+n,n:T.u,t:n}));
    if(s.ivs&&s.ivs.length)o.push({k:'tab:midia',n:1,t:'entrevista'});return o},
  go(){const L=this.list();HOJE.go(L.length?L[0].k:'tab:cel')}};
/* dentro de uma conversa ou da tela do celular: atalho pro próximo que falta ver */
{const _rl=renderLife;renderLife=function(){const r=_rl.apply(this,arguments);try{if(location.hash==='#vida'&&LIFE.tab==='cel'){const cur=LIFE.open?'cel:'+LIFE.open:'tab:cel',L=PEND.list().filter(x=>x.k!==cur);
  if(L.length&&!document.querySelector('.pnext')){const n=L.reduce((a,x)=>a+x.n,0),f=L[0];const h=`<button class="pnext" data-pnext="${lx(f.k)}">📱 Ainda falta ver: <b>${lx(f.t)}</b>${L.length>1?` e mais ${L.length-1}`:''} <span class="pnb">${n>9?'9+':n}</span> ›</button>`;
    const anchor=document.querySelector('.vtop .cityhd')||document.querySelector('.vtop');if(anchor)anchor.insertAdjacentHTML(anchor.classList.contains('cityhd')?'afterend':'afterbegin',h)}}}catch(e){console.warn(e)}return r}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-pnext]');if(!b)return;e.preventDefault();e.stopPropagation();HOJE.go(b.dataset.pnext)},true);
