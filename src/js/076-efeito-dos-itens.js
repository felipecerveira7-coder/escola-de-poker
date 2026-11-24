/* =============== v65: itens rendem de verdade (sem desperdício escondido) =============== */
/* mesma função não soma duas vezes: só o melhor do grupo conta */
const IGRP=[['jbl','fone','airpods'],['watch','ultra'],['galaxya','iphone','fold'],['corrida','jordan']];
const ICAP={regen:25,tire:10,love:10,mood:.6,post:.8};
/* acima do limite cada ponto extra rende 1/4, até 1,5x o limite */
function softCap(k,v){const c=ICAP[k];if(c==null)return v;return v<=c?v:Math.min(c*1.5,c+(v-c)*.25)}
function itemRaw(k,items){const own=new Set(items);let v=0;const done=new Set();
  IGRP.forEach(g=>{const vals=g.filter(i=>own.has(i)).map(i=>((ITEMS.find(x=>x.id===i)||{})[k]||0));if(vals.length){v+=Math.max(...vals);g.forEach(i=>done.add(i))}});
  items.forEach(i=>{if(done.has(i))return;v+=((ITEMS.find(x=>x.id===i)||{})[k]||0)});return v}
LIFE.ifx=function(k){if(!this.s)return 0;const v=itemRaw(k,this.s.items);return softCap(k,v)};
/* óculos só valem se estiverem no look da mesa */
function wearsGlasses(){try{return typeof OUT!=='undefined'&&LIFE.s&&OUT.wear('mesa','oculos')}catch(e){return LIFE.has('oculos')}}
/* quanto cada item ainda acrescenta, pra loja mostrar */
function itemGain(x){if(!LIFE.s||LIFE.has(x.id))return null;const out={};['regen','tire','love','mood','post'].forEach(k=>{if(!x[k])return;const now=LIFE.ifx(k),then=softCap(k,itemRaw(k,LIFE.s.items.concat([x.id])));out[k]=Math.max(0,then-now)});return out}
{const _t=ifxTxt;ifxTxt=function(x){let t=_t(x);try{const g=itemGain(x);if(g){const low=Object.entries(g).filter(([k,v])=>x[k]&&v<x[k]*.6);if(low.length){const grp=IGRP.find(G=>G.includes(x.id)&&G.some(i=>i!==x.id&&LIFE.has(i)));
    t+=` · <span class="bad">${grp?'você já tem um parecido: só o melhor conta':(low.every(([k,v])=>v<=.001)?'você já está no máximo disso: não rende mais':'perto do limite: rende só '+low.map(([k,v])=>k==='post'?`+${Math.round(v*100)}%`:k==='mood'?'um pouco':`+${Math.round(v*10)/10}`).join(', '))}</span>`}}}catch(e){}return t}}
/* painel no perfil: o que seus itens estão fazendo agora */
function itemPanel(){if(!LIFE.s)return'';const r=k=>itemRaw(k,LIFE.s.items),e=k=>LIFE.ifx(k),row=(ic,nm,k,fmt)=>{const raw=r(k),ef=e(k);if(!raw)return'';const over=raw>ICAP[k];
    return`<div class="ifr"><span>${ic} ${nm}</span><b>${fmt(ef)}</b>${over?`<span class="muted">limite ${fmt(ICAP[k])}; acima disso rende 1/4 (máx. ${fmt(ICAP[k]*1.5)})</span>`:''}</div>`};
  const st=LIFE.status();
  return`<div class="ifx"><div class="muted" style="font-size:12px;margin-bottom:4px">🎒 O que seus itens fazem agora</div>
    ${row('😴','Energia por noite','regen',v=>'+'+Math.round(v))}${row('🎧','Torneio cansa menos','tire',v=>'−'+Math.round(v*10)/10)}${row('💘','Bônus nos encontros','love',v=>'+'+Math.round(v*10)/10)}${row('🙂','Humor por dia','mood',v=>'+'+(Math.round(v*100)/100))}${row('📸','Fãs por post','post',v=>'+'+Math.round(v*100)+'%')}
    <div class="ifr"><span>💎 Status</span><b>${st}</b><span class="muted">casa + carro + o que você ostenta</span></div>
    <div class="ifr"><span>🕶️ Óculos na mesa</span><b>${LIFE.has('oculos')?(wearsGlasses()?'em uso':'no closet, não vale'):'não tem'}</b></div></div>`}
{const _rl=renderLife;renderLife=function(){const r=_rl.apply(this,arguments);try{if(LIFE.hdrOpen&&location.hash==='#vida'){const v=document.querySelector('.vtop .vhead');if(v&&!document.querySelector('.vtop .ifx'))v.insertAdjacentHTML('afterend',itemPanel())}}catch(e){}return r}}
