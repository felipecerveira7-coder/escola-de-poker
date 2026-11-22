/* ----- barra fixa do topo ----- */
const HUD={last:'',
  render(){let el=document.getElementById('hud');const on=!!(LIFE.s&&LIVES.s&&CAL.on()&&!document.body.classList.contains('ttlon'));
    document.body.classList.toggle('hudOn',!!on);if(!on){if(el)el.style.display='none';return}
    if(!el){el=document.createElement('div');el.id='hud';document.body.prepend(el);el.onclick=e=>{if(e.target.closest('[data-hud="look"]')){OUT.open();return}LIFE.tab='hoje';location.hash='#vida';try{renderLife()}catch(x){}window.scrollTo({top:0,behavior:'smooth'})}}
    el.style.display='';const s=LIFE.s,e=Math.round(s.energy),m=s.mood,key=[WALLET.s.bal,e,m,CLK.fmt(),CAL.today(),JSON.stringify(s.look||{}),LIFE.unread()].join('|');if(key===this.last)return;this.last=key;
    el.innerHTML=`<button class="hu-av" data-hud="look" title="Closet">${AV.svg('mesa',34)}</button><div class="hu-c"><div class="hu-r"><b class="${WALLET.s.bal<0?'bad':''}">${brlc(WALLET.s.bal)}</b><span class="hu-e" title="Energia"><i style="width:${e}%;background:${e<35?'var(--bad)':'var(--ok)'}"></i></span><span>${m>=2?'😁':m>=1?'🙂':m<=-2?'😞':m<=-1?'😕':'😐'}</span></div><div class="hu-s">${CLK.txt()} · ${CAL.fmt(CAL.today())}${(HOL.of(CAL.today())||{}).emo||''}</div></div>${LIFE.unread()?`<span class="hu-n">${LIFE.unread()>9?'9+':LIFE.unread()}</span>`:''}`}};

