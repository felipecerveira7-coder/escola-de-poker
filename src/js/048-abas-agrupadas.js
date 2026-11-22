/* ----- abas agrupadas ----- */
const VG={G:[['inicio','🏠','Início',['hoje','casa']],['pessoas','👥','Pessoas',['fam','cel','hg']],['carreira','🏆','Carreira',['pat','midia','legado']],['compras','🛍️','Compras',['loja','garagem']]],
  NM:{hoje:'📋 Hoje',casa:'🏡 Casa',fam:'❤️ Família',cel:'📱 Celular',hg:'🍻 Home game',pat:'🤝 Marcas',midia:'🎤 Mídia',legado:'🏆 Legado',loja:'🛍️ Loja',garagem:'🚗 Carros'},last:{},
  of(t){return(this.G.find(g=>g[3].includes(t))||this.G[0])[0]},
  bar(tab,cnt){const cur=this.of(tab);this.last[cur]=tab;const c=k=>cnt[k]||0;
    return`<div class="vgroups">${this.G.map(([k,i,t,subs])=>{const n=subs.reduce((a,x)=>a+c(x),0);return`<button class="${cur===k?'on':''}" data-vg="${k}"><span class="vti">${i}</span><span class="vtl">${t}</span>${n?`<span class="vbdg nbg">${n>9?'9+':n}</span>`:''}</button>`}).join('')}</div>
      <div class="lcats vsubs">${this.G.find(g=>g[0]===cur)[3].map(k=>`<button class="${tab===k?'on':''}" data-vt="${k}">${this.NM[k]}${c(k)?` <b class="sbdg">${c(k)}</b>`:''}</button>`).join('')}</div>`}};

