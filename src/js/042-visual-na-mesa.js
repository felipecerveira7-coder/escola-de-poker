/* ----- visual na mesa ----- */
const LOOK={
  icons(){const h=i=>LIFE.has(i),a=[];if(h('bone'))a.push('🧢');if(h('oculos'))a.push('🕶️');if(h('patek')||h('rolex')||h('relogio')||h('ultra'))a.push('⌚');if(h('corrente'))a.push('📿');if(h('terno'))a.push('🤵');else if(h('jaqueta'))a.push('🧥');else if(h('moletom'))a.push('🧥');return a.slice(0,4).join('')},
  best(){const vis=['patek','rolex','relogio','corrente','terno','jordan','oculos','bone','ultra','iphone'];return vis.map(i=>ITEMS.find(x=>x.id===i)).filter(x=>x&&LIFE.has(x.id)).sort((a,b)=>b.price-a.price)[0]||null},
  comment(T){try{if(!LIFE.s||!T.g)return;const it=this.best();if(!it||Math.random()>.35)return;const bots=T.g.players.filter(p=>!p.human&&LIVES.s.bots[p.name]);if(!bots.length)return;const p=pickA(bots),r=LIFE.rel(p.name),nm=it.nm.toLowerCase();
    setTimeout(()=>{if(T.g)T.chatMsg(p.name,r<=-1?pickA([`Belo ${nm}. Pena que não joga por você.`,`Esse ${nm} aí foi com o dinheiro de quem?`]):r>=1?pickA([`Que ${nm} é esse, rapaz! 😮`,`Tá podendo, hein! Esse ${nm} é lindo.`]):pickA([`Bonito o ${nm}.`,`É verdade que esse ${nm} custou o que dizem?`]),'re')},2500)}catch(e){}}};

