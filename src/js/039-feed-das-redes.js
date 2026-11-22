/* ----- feed das redes ----- */
const FEED={
  st(){const s=LIFE.s;s.feed=s.feed||[];return s.feed},
  push(who,emo,txt,tag){this.st().unshift({d:CAL.today(),who,emo,txt,tag});if(this.st().length>40)this.st().length=40},
  daily(d){const s=LIFE.s;if(!s||!LIVES.s)return;const me=CIRC.me(),bots=Object.keys(LIVES.s.bots).filter(n=>LIVES.bio(n)),r=s.lastRes,fr=bots.filter(n=>LIFE.rel(n)>=1),rv=bots.filter(n=>LIFE.rel(n)<=-1),J=['Lorena (Feltro)','@pokerbrasil','Rádio All-in'];
    if(r&&d-r.day<=1){if(r.place===1){this.push(pickA(J),'📰',`${me} crava o ${r.nm}. Já é o nome da temporada?`,'#'+me.split(' ')[0]+'Campeão');if(rv.length)this.push(pickA(rv),'😒',pickA(['Sorte grande dura pouco. Quero ver repetir.','Ganhou de mesa fraca. Próxima.']));if(fr.length)this.push(pickA(fr),'🔥',pickA(['MONSTRO! 🏆','Eu avisei que ele ia ganhar!']))}
      else if(r.itm)this.push(pickA(J),'📰',`${me} premia no ${r.nm} (${r.place}º).`);else if(Math.random()<.5&&rv.length)this.push(pickA(rv),'😏',`Vi que ${me} caiu cedo no ${r.nm}. Acontece com os melhores… e com ele também.`)}
    const L=(LIVES.s.news||[]).slice(0,2);L.forEach(x=>{if(x.title&&Math.random()<.5)this.push('Jornal do Circuito','🗞️',x.title)});
    if(s.fame>=25&&Math.random()<.5)this.push(pickA(['@hater_do_river','@foldequity','@zé_do_flop']),'👎',pickA([`${me} é marketing puro. Quero ver sem patrocínio.`,`Mais um que posa de rico. Joga nada.`,`Superestimado. Muda minha cabeça.`]));
    if(s.fame>=10&&Math.random()<.6)this.push(pickA(['@fã_do_feltro','@marina.poker','@grinder_rs']),'💚',pickA([`Aprendi muito vendo ${me} jogar. Referência!`,`Alguém mais acha que ${me} vai pro Hall da Fama?`,`Quero um autógrafo do ${me} no próximo festival!`]));
    if((s.items||[]).includes('patek')&&Math.random()<.2)this.push('@luxo_br','⌚',`${me} foi visto com um Patek Nautilus. Quanto custa um desses mesmo?`,'#Nautilus');
    if(s.love&&s.love.stage==='namoro'&&Math.random()<.15)this.push('@fofoca.poker','💘',`${me} e ${s.love.nm} apareceram juntos de novo. Tá sério!`,'#Casal');
    const sp=LIFE.sps();if(sp.length&&Math.random()<.2)this.push(sp[0].nm,sp[0].emo,`Orgulho de ter ${me} no nosso time! 🙌`)},
  trend(){const T={};this.st().forEach(x=>{if(x.tag)T[x.tag]=(T[x.tag]||0)+1});return Object.entries(T).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0])},
  panel(){const F=this.st().slice(0,12),tr=this.trend();return`<div class="panel"><h3>📰 O que estão falando</h3>${tr.length?`<div style="margin-bottom:6px">${tr.map(t=>`<span class="vtag">🔥 ${lx(t)}</span>`).join(' ')}</div>`:''}
    ${F.map(x=>`<div class="vpost"><b>${x.emo} ${lx(x.who)}</b> <span class="muted" style="font-size:12px">dia ${x.d}</span><div style="font-size:14px">${lx(x.txt)}</div></div>`).join('')||'<p class="muted" style="margin:0">O feed enche conforme você joga, ganha, compra e aparece.</p>'}</div>`}};

