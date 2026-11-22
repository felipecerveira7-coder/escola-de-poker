/* ----- o que o circuito sabe: contexto público para conversas com IA ----- */
const PUB={
  rankOf(n){try{const T=RK.season(),i=T.findIndex(x=>n==='Você'?x.me:x.key===n);return i<0||!T[i].pts?null:{pos:i+1,pts:T[i].pts,of:T.filter(x=>x.pts>0).length}}catch(e){return null}},
  me(){const s=LIFE.s,me=CIRC.me(),L=[];if(!s)return'';
    try{const r=this.rankOf('Você'),G=RK.geral(),gi=G.findIndex(x=>x.me)+1,T=RK.season();
      L.push(`Ranking da temporada ${RK.label(RK.key(LIVES.s.day))}: ${r?`${me} é o ${r.pos}º (${nf(r.pts)} pts)${r.pos===1?', o LÍDER':''}`:`${me} ainda não pontuou`}${G[gi-1]&&G[gi-1].pts?`; ranking geral: ${gi}º`:''}. Top 5 da temporada: ${T.filter(x=>x.pts>0).slice(0,5).map((x,i)=>`${i+1}º ${x.name} (${nf(x.pts)})`).join(', ')}.`)}catch(e){}
    try{const p=s.fp||{};L.push(`Fama: "${LIFE.level()[1]}" (${Math.round(s.fame)}/100), ${nf(Math.round(s.fans||0))} seguidores. Carreira: ${p.W||0} títulos, ${p.P||0} pódios em ${p.T||0} torneios.`)}catch(e){}
    try{if(s.retro&&s.retro.mode==='elite'){const R=RETRO.run('elite');L.push(`Histórico internacional: ${R.champ?`campeão do WSOP Main Event (o Campeonato Mundial)${R.champ>1?` ${R.champ} vezes`:''}, `:''}${R.ft?`${R.ft} mesa(s) final(is) no Main Event, `:''}cerca de US$ ${brl(Math.round(R.eP/RETRO.FX))} em prêmios de elite (Super High Roller Bowl, high rollers). É um dos maiores ganhadores do Brasil.`)}}catch(e){}
    try{const H=LIFE.homeObj(),cars=(s.cars||[]).map(c=>(CARS.find(x=>x.id===c)||{}).nm).filter(Boolean),bal=WALLET.s.bal;
      L.push(`Vida: mora em ${H.nm.toLowerCase()}${cars.length?`, anda de ${cars.join(' e ').toLowerCase()}`:''}; patrimônio ${bal>=1e6?`na casa dos R$ ${Math.round(bal/1e6)} milhões`:bal>=1e5?'de algumas centenas de mil':'modesto'}${(s.items||[]).includes('relogio')?'; usa relógio suíço':''}.`)}catch(e){}
    try{const sp=LIFE.sps();if(sp.length)L.push(`Patrocinadores: ${sp.map(p=>p.nm).join(', ')}.`)}catch(e){}
    try{if(s.love&&s.love.stage!=='crush')L.push(`Vida amorosa: ${s.love.stage==='namoro'||s.loveHome?'namora':'saindo com'} ${s.love.nm}.`)}catch(e){}
    try{const P=(s.posts||[]).slice(0,3);if(P.length)L.push(`Últimas postagens de ${me}: ${P.map(p=>`"${p.nm.replace(/^\S+\s/,'')}" (dia ${p.day}${p.com&&p.com.length?`, comentários: ${p.com.slice(0,2).map(c=>`${c[0]}: ${c[1]}`).join(' / ')}`:''})`).join('; ')}.`)}catch(e){}
    try{const N=(LIVES.s.news||[]).slice(0,6).map(x=>x.title||String(x.body||'').slice(0,90)).filter(Boolean);if(N.length)L.push(`Manchetes recentes do jornal do circuito: ${N.join(' | ')}.`)}catch(e){}
    try{const R=[];if(s.retro&&s.retro.mode==='elite')R.push(`gente comenta quanto ${me} realmente ganhou lá fora e se vendeu ação`);if((s.cars||[]).length)R.push('o carro dele virou assunto no estacionamento do clube');if(LIFE.sps().length>1)R.push('dizem que as marcas estão disputando o passe dele');
      const S=SOC.st();if(S.lies&&S.lies.length)R.push('já faltou compromisso com desculpa esfarrapada');if(S.prop)R.push(`tem uma aposta paralela com ${S.prop.n}`);if(R.length)L.push(`Fofocas e especulação no circuito: ${R.join('; ')}.`)}catch(e){}
    return L.join('\n')},
  bot(n){const b=LIVES.s.bots[n];if(!b)return'';const r=this.rankOf(n),res=b.res||{};const L=[];
    L.push(`${n}: ${r?`${r.pos}º no ranking da temporada (${nf(r.pts)} pts)`:'fora do ranking'}, ${res.wins||0} títulos e ${b.pod||0} pódios na carreira, dinheiro R$ ${nf(Math.round(b.bank||0))}.`);
    try{const ln=(LIFE.s.loans||[]).find(l=>l.n===n);if(ln)L.push(`${n} deve R$ ${brl(ln.v)} a ${CIRC.me()}.`)}catch(e){}
    return L.join(' ')},
  table(g,t){try{if(t.mode!=='tour')return'';const left=t.aliveAll(),N=t.field(),pay=g.mtt?g.mtt.pays:CIRC.pays(N),ft=g.mtt?left<=9:true;
      return`Torneio: ${(g.ev&&g.ev.nm)||'torneio'}, restam ${left} de ${N} jogadores${ft&&left<=9?' (MESA FINAL)':''}${left<=pay.length?' (todos já estão no dinheiro)':left===pay.length+1?' (BOLHA: o próximo a cair sai sem nada)':''}. Premiação: ${pay.map((p,i)=>`${i+1}º ${Math.round(p*100)}%`).join(', ')}.`}catch(e){return''}}};

