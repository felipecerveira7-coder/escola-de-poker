/* ----- ficha pública de cada jogador (o que o circuito sabe) ----- */
const BOTP={
  money(v){v=Math.max(0,v||0);return v>=1e6?`na casa dos R$ ${(v/1e6).toFixed(v>=1e7?0:1).replace('.',',')} milhões`:v>=1e5?`na casa dos R$ ${Math.round(v/1e4)*10} mil`:v>=1e4?`uns R$ ${Math.round(v/1e3)} mil`:v>=2000?'poucos milhares':'quase nada, vive no aperto'},
  geral(n){try{const G=RK.geral(),i=G.findIndex(x=>x.key===n);return i<0||!G[i].pts?null:{pos:i+1,pts:G[i].pts}}catch(e){return null}},
  news(n){const re=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));return(LIVES.s.news||[]).filter(x=>re.test((x.title||'')+' '+(x.body||''))).slice(0,5)},
  html(n,o){const b=LIVES.s.bots[n],B=LIVES.bio(n);if(!b||!B)return'';const res=b.res||{},r=PUB.rankOf(n),g=this.geral(n),sty=LIVES.styleOf(n),S=sty&&STY[sty],md=LIVES.mood(n),rel=LIFE.s?LIFE.rel(n):0;
    const fr=Object.entries(b.rel||{}).filter(([k,v])=>k!=='Você'&&LIVES.s.bots[k]).sort((a,c)=>c[1]-a[1]),ami=fr.filter(x=>x[1]>=1.5).slice(0,4),riv=fr.filter(x=>x[1]<=-1.5).slice(-4).reverse();
    const ln=LIFE.s&&(LIFE.s.loans||[]).find(l=>l.n===n&&!l.paid),N=this.news(n),T=(LIFE.s&&LIFE.s.th[n])||{m:[]},sea=b.sea||{};
    const row=(a,c)=>`<div class="vrow" style="font-size:14px"><span class="muted">${a}</span><b style="text-align:right">${c}</b></div>`;
    const who=x=>`<span class="pfl" data-pf="${x[0]}">${(LIVES.bio(x[0])||{}).emo||''} ${x[0]}</span>`;
    return`<div class="dhead"><span class="bpav">${FACE.bot(n,68)}<span class="bpemo">${B.emo||''}</span></span><div style="flex:1;min-width:0"><b style="font-size:18px">${n}</b><div class="muted" style="font-size:13px">${B.age} anos · ${B.job}</div><div class="muted" style="font-size:13px">${B.fam}</div></div><button class="sm" data-bp="x">✕</button></div>
      <div class="bpscroll">${o?OUTX.panel(n):''}
      <div class="nsec">Com você</div>${row('Nível',FR.name(n)||'Conhecido')}${row('Aniversário',FR.bd(n).txt)}<div style="padding:4px 0">${FR.perks(n)}</div>${row('Relação',`${LIFE.relTxt?LIFE.relTxt(n):''} (${rel>0?'+':''}${rel.toFixed(1)})`)}${ln?row('Te deve',`R$ ${brl(ln.v)}`):''}${row('Mensagens trocadas',T.m.length)}${(()=>{const K=OUTX.known(n),lk=Object.keys(K).filter(k=>K[k]>=3).map(k=>OUTA[k].emo+' '+OUTA[k].nm.toLowerCase()),dk=Object.keys(K).filter(k=>K[k]<=1).map(k=>OUTA[k].emo+' '+OUTA[k].nm.toLowerCase());return`<div style="font-size:13px;padding:4px 0">${OUTX.hint(n)}${lk.length?`<br>😍 Curte sair pra: ${lk.join(', ')}`:''}${dk.length?`<br>😕 Não curte: ${dk.join(', ')}`:''}</div>`})()}
      <div class="nsec">Agora</div><div style="font-size:14px">${md?`${md[0]} ${md[1]}`:'—'}</div>
      <div class="nsec">Circuito</div>${row('Ranking da temporada',r?`${r.pos}º · ${nf(r.pts)} pts`:'não pontuou')}${row('Ranking geral',g?`${g.pos}º · ${nf(g.pts)} pts`:'—')}
      ${row('Títulos',res.wins||0)}${row('Pódios',b.pod||0)}${row('Premiações (ITM)',res.itm||0)}${row('Torneios jogados',res.tours||0)}${sea.t?row('Nesta temporada',`${sea.t} torneios · ${sea.w||0} título${sea.w===1?'':'s'}`):''}
      ${row('Lucro em torneios',`${(res.profit||0)>=0?'+':'−'}R$ ${brl(Math.abs(Math.round(res.profit||0)))}`)}${row('Dinheiro (estimativa do circuito)',this.money(b.bank))}
      <div class="nsec">Como joga</div><div style="font-size:14px">${S?`<b>${S.nm}</b>: ${S.ds}`:'Ninguém sabe ainda.'}</div><div class="muted" style="font-size:13px;margin-top:2px">Temperamento: ${B.trait}.</div>
      ${ami.length||riv.length?`<div class="nsec">No circuito</div>${ami.length?`<div style="font-size:14px">🤝 Amigos: ${ami.map(who).join(', ')}</div>`:''}${riv.length?`<div style="font-size:14px">⚔️ Rivais: ${riv.map(who).join(', ')}</div>`:''}`:''}
      ${N.length?`<div class="nsec">No jornal</div>${N.map(x=>`<div style="font-size:13px;padding:2px 0">📰 ${x.title?`<b>${x.title}</b> `:''}${x.body?String(x.body).slice(0,140):''} <span class="muted">${DT(x.day)}</span></div>`).join('')}`:''}
      ${(b.diary||[]).length?`<div class="nsec">O que circula sobre ${n}</div>${b.diary.slice(0,4).map(x=>`<div style="font-size:13px;padding:2px 0">• ${x.t} <span class="muted">${DT(x.d)}</span></div>`).join('')}`:''}
      </div>
      <div class="dacts" style="margin-top:8px"><button class="sm pri" data-bp="msg">💬 Mensagem</button>${LIFE.s?`<button class="sm${o?' pri':''}" data-bp="out">🍻 Chamar pra sair</button>`:''}</div>`},
  open(n,o){if(!LIVES.s||!LIVES.s.bots[n]||!LIVES.bio(n))return;let ov=document.getElementById('bpOv');if(!ov){ov=document.createElement('div');ov.id='bpOv';document.body.appendChild(ov)}
    ov.className='dov';ov.innerHTML=`<div class="dbox bpbox">${this.html(n,o)}<div class="vmsg" data-bp="m"></div></div>`;
    ov.onclick=e=>{if(e.target===ov)this.close()};
    ov.querySelectorAll('[data-bp]').forEach(b=>b.onclick=()=>{const a=b.dataset.bp;if(a==='x')this.close();
      if(a==='msg'){this.close();location.hash='#vida';LIFE.tab='cel';LIFE.open=n;setTimeout(()=>{try{renderLife();window.scrollTo(0,0)}catch(e){}},30)}
      if(a==='out'){OUTX.last=null;this.open(n,!o)}})},
  close(){const ov=document.getElementById('bpOv');if(ov)ov.remove()}};
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-pf]');if(!t)return;e.stopPropagation();e.preventDefault();BOTP.open(t.dataset.pf)},true);

