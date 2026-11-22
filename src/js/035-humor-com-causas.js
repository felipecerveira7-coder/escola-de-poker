/* ----- humor com causas ----- */
const MOODL={
  list(){const s=LIFE.s,t=CAL.today(),L=[],add=(e,x,v)=>L.push([e,x,v]);if(!s)return L;
    if(s.energy<30)add('😴','Cansado',-1);else if(s.energy>=80)add('⚡','Descansado',1);
    if(s.lateDay===t)add('🥱','Dormiu tarde',-1);
    if(s.lastRes&&t-s.lastRes.day<=1){const r=s.lastRes;if(r.place===1)add('🏆',`Campeão do ${r.nm}`,2);else if(r.itm)add('💰',`Premiou no ${r.nm}`,1);else add('💔',`Caiu do ${r.nm}`,-1)}
    if(WALLET.s.bal<0)add('💸','No vermelho',-1);
    if(s.lastDate&&t-s.lastDate.d<=1)add(s.lastDate.g>=6?'❤️':'💔',s.lastDate.g>=6?'Encontro ótimo':'Encontro ruim',s.lastDate.g>=6?1:-1);
    if(Object.keys(s.did||{}).some(k=>k.startsWith('out:')&&s.did[k]===t))add('🍻','Saiu com amigos',1);
    if(LIFE.has('cao')||LIFE.has('gato'))add('🐾','Pet te esperando em casa',1);
    if(LIFE.homeObj().comfort>=3)add('🏠','Casa confortável',1);
    if(LIFE.ifx('mood')>=.2)add('🎮','Hobbies em dia',1);
    const riv=Object.keys(LIVES.s.bots).filter(n=>LIFE.rel(n)<=-2).length;if(riv>=3)add('⚔️',`${riv} rivais no circuito`,-1);
    const fam=(s.fam||[]);if(fam.length&&fam.reduce((a,p)=>a+p.b,0)/fam.length<40)add('👪','Família distante',-1);
    if((s.loans||[]).some(l=>!l.paid&&l.due<t))add('🧾','Alguém te devendo e sumiu',-1);
    if(s.tauntDay===t)add('😤','Provocado na mesa',-1);
    if(LIFE.sps().some(c=>c.warn))add('⚠️','Advertência de patrocinador',-1);
    const h=HOL.of(t);if(h)add(h.emo,h.nm,1);return L},
  panel(){const s=LIFE.s,L=this.list(),m=s.mood;
    return`<div class="panel"><h3>${m>=2?'😁':m>=1?'🙂':m<=-2?'😞':m<=-1?'😕':'😐'} Seu humor: ${m>=2?'ótimo':m>=1?'bom':m<=-2?'péssimo':m<=-1?'pra baixo':'normal'}</h3>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${L.map(([e,x,v])=>`<span class="mdl ${v>0?'up':'dn'}">${e} ${x}</span>`).join('')||'<span class="muted">Nada fora do normal.</span>'}</div>
      <p class="muted" style="font-size:12px;margin:8px 0 0">${m>=2?'Humor ótimo: +1 cartão de tempo nas mesas e encontros começam melhores.':m<=-2?'Humor péssimo: −1 cartão de tempo nas mesas.':'Humor bom deixa os encontros melhores; ótimo dá +1 cartão de tempo, péssimo tira 1.'} A energia também conta: descansado +1, cansado −1.</p></div>`}};

