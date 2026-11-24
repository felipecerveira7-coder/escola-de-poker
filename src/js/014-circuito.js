/* ----- circuito: ranking da temporada e jornal ----- */
const CIRC={
  me(){return(LIVES.s.me||'Felipe').trim()||'Felipe'},
  nm(n){return n==='Você'?this.me():n},
  season(){const s=LIVES.s;if(!s.season)s.season={n:1,start:0};if(s.season.n===1&&!s.season.reset&&s.season.start)s.season.start=0;return s.season},
  newSeason(){const s=LIVES.s,old=this.season(),T=this.table(),L=T[0];s.season={n:old.n+1,start:Date.now(),reset:true};s.leader=null;
    this.post({k:'rank',title:`Começa a Temporada ${s.season.n}`,body:L&&L.pts?`O ranking foi zerado. ${L.name} terminou a Temporada ${old.n} na liderança, com ${nf(L.pts)} pontos.`:'O ranking foi zerado. Todos começam do zero.'});LIVES.commit()},
  pts(place,of){return Math.round((of-place+1)/of*100*Math.sqrt(of/9))+(place===1?50:place===2?25:place===3?10:0)},
  pays(of){if(of<=4)return[.7,.3];if(of<=6)return[.65,.35];if(of<=12)return[.5,.3,.2];if(of<=18)return[.4,.3,.2,.1];if(of<=27)return[.37,.27,.18,.1,.08];if(of<=36)return[.33,.22,.16,.12,.09,.08];return[.31,.21,.17,.12,.09,.06,.04]},
  post(o){const s=LIVES.s;s.news=s.news||[];o.day=s.day;o.t=Date.now();s.news.unshift(o);if(s.news.length>160)s.news.length=160},
  /* soma pontos de temporada de um bot (chamado em LIVES.tourEnd) */
  score(n,place,of,prize,buyin){const b=LIVES.s.bots[n];if(!b)return;const S=this.season();if(!b.sea||b.sea.n!==S.n)b.sea={n:S.n,pts:0,t:0,w:0,itm:0,profit:0};
    if(b.cpts==null)b.cpts=b.sea.pts;b.cpts+=this.pts(place,of);if(place>1&&place<=3)b.pod=(b.pod||0)+1;b.sea.pts+=this.pts(place,of);b.sea.t++;if(place===1)b.sea.w++;if(prize)b.sea.itm++;b.sea.profit+=prize-buyin},
  /* seus números vêm do histórico de torneios */
  mine(){const S=this.season(),r={pts:0,t:0,w:0,itm:0,profit:0};
    HIST.sessions().filter(x=>x.mode==='tour'&&x.place&&Math.max(x.t||0,...x.hands.map(h=>h.t||0))>=(S.start||0)).forEach(x=>{const of=x.of||((x.cfg&&x.cfg.bots||0)+1),buy=x.buyin||(x.cfg&&x.cfg.buyin)||LIVES.BUYIN,pay=x.cfg&&x.cfg.field?[.5,.3,.2]:this.pays(of),
      prize=x.prize!=null&&x.cfg&&x.cfg.field?x.prize:(x.place<=pay.length?Math.round(of*buy*pay[x.place-1]):0);
      r.pts+=this.pts(x.place,of);r.t++;if(x.place===1)r.w++;if(prize)r.itm++;r.profit+=prize-buy});return r},
  table(){const S=this.season(),rows=LIVES.ALL().filter(n=>LIVES.bio(n)).map(n=>{const b=LIVES.s.bots[n],z=b&&b.sea&&b.sea.n===S.n?b.sea:{pts:0,t:0,w:0,itm:0,profit:0};return Object.assign({name:n},z)});
    rows.push(Object.assign({name:this.me(),me:true},this.mine()));
    return rows.sort((a,b)=>b.pts-a.pts||b.profit-a.profit||a.name.localeCompare(b.name))},
  leaderCheck(){const T=this.table(),L=T[0];if(!L||!L.pts)return;const s=LIVES.s;if(s.leader!==L.name){const old=s.leader;s.leader=L.name;
    this.post({k:'rank',title:`${L.name} assume a liderança do ranking`,body:`Com ${nf(L.pts)} pontos em ${L.t} torneio${L.t>1?'s':''} na temporada${old?`, ${L.name} passa ${old}`:''}.`})}},
  /* matéria de um torneio */
  article(o){const pick=a=>a[Math.random()*a.length|0],R=o.res.slice().sort((a,b)=>a.place-b.place),W=R[0],pay=o.pays,pool=o.of*o.buy,pz=p=>p<=pay.length?Math.round(pool*pay[p-1]):0;
    const wn=this.nm(W.name),bub=R.find(x=>x.place===pay.length+1);
    const title=pick([`${wn} vence o ${o.nm} e leva R$ ${nf(pz(1))}`,`${wn} crava o ${o.nm}`,`${o.nm}: título e R$ ${nf(pz(1))} para ${wn}`,`${wn} fatura o ${o.nm}`]);
    let body=`${o.of} jogadores, buy-in R$ ${nf(o.buy)}, prêmio total R$ ${nf(pool)}. Pódio: ${R.slice(0,pay.length).map(x=>`${x.place}º ${this.nm(x.name)} (R$ ${nf(pz(x.place))})`).join(', ')}.`;
    if(bub)body+=` ${this.nm(bub.name)} caiu na bolha, em ${bub.place}º.`;
    const st=n=>LIVES.state(n),stories=[];
    if(W.name!=='Você'&&st(W.name)&&LIVES.s.bots[W.name].cond.aluguel)stories.push(`O prêmio chega em boa hora: ${wn} estava com o aluguel atrasado.`);
    if(W.name!=='Você'&&LIVES.bio(W.name)&&LIVES.bio(W.name).inc===0)stories.push(`Desempregado, ${wn} ganha um fôlego importante.`);
    const brk=R.filter(x=>x.borrowed&&x.place>pay.length);if(brk.length)stories.push(`${brk.map(x=>this.nm(x.name)).slice(0,2).join(' e ')} pegou dinheiro emprestado para jogar e saiu sem nada.`);
    const me=R.find(x=>x.name==='Você');if(me&&me.place!==1)stories.push(me.place<=pay.length?`${this.me()} também premiou, em ${me.place}º.`:`${this.me()} terminou em ${me.place}º.`);
    if(o.rival)stories.push(o.rival);
    if(stories.length)body+=' '+stories.slice(0,2).join(' ');
    this.post({k:'tour',title,body,top:R.slice(0,3).map(x=>this.nm(x.name)),mine:!!me,of:o.of,buy:o.buy,res:R.slice(0,pay.length).map(x=>[this.nm(x.name),x.place])});this.leaderCheck()},
  /* torneios da comunidade, que acontecem sem você */
  community(kk){const KS=[{nm:'Turbo da Madrugada',buy:50,f:[9,18]},{nm:'Torneio das Quintas',buy:100,f:[18,27]},{nm:'Deep Stack de Sábado',buy:300,f:[18,27]},{nm:'Main Event do Circuito',buy:1000,f:[27,36]}];
    const k=kk||(Math.random()<.1?KS[3]:KS[Math.random()*3|0]),N=k.f[Math.random()*k.f.length|0];
    const all=LIVES.ALL().filter(n=>LIVES.bio(n)).sort(()=>Math.random()-.5),ent=[];
    for(const n of all){if(ent.length>=N)break;const b=LIVES.s.bots[n],B=LIVES.bio(n);if(b.bank>=k.buy)ent.push({name:n});else if(['desesperado','impulsivo','cabeça quente'].includes(B.trait)&&Math.random()<.45)ent.push({name:n,borrowed:true})}
    if(ent.length<9)return;const of=ent.length,pays=this.pays(of);
    const base={tag:1.25,bal:1.1,rock:.97,lag:.95,station:.8},str=n=>{const s=LIVES.state(n),b=LIVES.s.bots[n],t=new Set((s?s.tags:[]).map(x=>x[0]));
      return Math.max(.3,(base[LIVES.styleOf(n)]||1)+((b.dr&&b.dr.A)||0)*.5-(t.has('tilt')?.15*b.tilt:0)-(t.has('press')?.1:0)-(t.has('cans')?.1:0)+(t.has('conf')?.1:0)+(Math.random()-.5)*.5)};
    const S=new Map(ent.map(e=>[e.name,str(e.name)])),alive=ent.slice(),pw=(arr,w)=>{const tot=arr.reduce((a,x)=>a+w(x),0);let r=Math.random()*tot;for(const x of arr){r-=w(x);if(r<=0)return x}return arr[arr.length-1]};
    let rival=null;
    while(alive.length>1){const lo=pw(alive,x=>1/Math.pow(S.get(x.name),2)),rest=alive.filter(x=>x!==lo),ki=pw(rest,x=>S.get(x.name));lo.place=alive.length;
      if(LIVES.rel(lo.name,ki.name)<=-2&&!rival)rival=`Mais um capítulo da rivalidade: ${ki.name} eliminou ${lo.name} de novo.`;
      LIVES.relAdd(lo.name,ki.name,-1.5);alive.splice(alive.indexOf(lo),1)}
    alive[0].place=1;
    ent.forEach(e=>LIVES.tourEnd(e.name,e.place,of,k.buy,pays,true));
    this.article({nm:k.nm,of,buy:k.buy,pays,res:ent,rival})}};
/* jornal + ranking */
{const _rl=renderLives;renderLives=function(){_rl();const el=document.getElementById('livRoot');if(el&&!el.querySelector('[data-dls]'))el.insertAdjacentHTML('beforeend','<div data-dls>'+dealersHtml()+'</div>')}}
function renderCircuit(){const el=document.getElementById('cirRoot');if(!el)return;LIVES.tick(false);const s=LIVES.s,S=CIRC.season(),tab=renderCircuit.tab||'jornal';
  let h=`<div class="panel"><div class="anahead"><div><h2 style="margin:0">O Feltro</h2><div class="muted" style="font-size:13px">o jornal do circuito · temporada ${RK.label(RK.key(s.day))} · ${DT(s.day)}</div></div>
    <div class="anaf"><button class="sm${tab==='jornal'?' on':''}" data-t="jornal">📰 Jornal</button> <button class="sm${tab==='rank'?' on':''}" data-t="rank">🏅 Ranking</button> <button class="sm${tab==='cart'?' on':''}" data-t="cart">💰 Carteira</button></div></div>
    <div style="margin-top:8px;font-size:13px" class="muted">Seu nome no circuito: <input data-r="meName" value="${CIRC.me().replace(/"/g,'')}" maxlength="24" style="width:130px;padding:3px 6px;border-radius:7px;border:1px solid var(--line);background:rgba(0,0,0,.25);color:inherit"></div></div>`;
  if(tab==='cart'){const W=WALLET.s,g=CASH.g,mesa=g?g.players[0].stack*LIVES.CHIP:((SAVES.data.cash&&SAVES.data.cash.players&&SAVES.data.cash.players[0].stack)||0)*(g?1:LIVES.CHIP);
    const L=W.log.slice(0,60),tot=k=>W.log.filter(x=>k(x)).reduce((a,x)=>a+x.v,0);
    h+=`<div class="panel"><div class="muted" style="font-size:13px">Saldo disponível</div><div style="font-size:34px;font-weight:700;margin:2px 0 4px" data-wallet>R$ ${brl(W.bal)}</div>
      ${mesa>0?`<div class="muted" style="font-size:14px">Na mesa de cash agora: <b>R$ ${brl(mesa)}</b> (volta para a carteira quando você sair da mesa)</div>`:''}
      <div style="font-size:14px;margin-top:8px">Torneios: <b class="${tot(x=>/Buy-in|Prêmio/.test(x.txt))>=0?'ok':'bad'}">${tot(x=>/Buy-in|Prêmio/.test(x.txt))>=0?'+':'−'}R$ ${brl(Math.abs(tot(x=>/Buy-in|Prêmio/.test(x.txt))))}</b> · Cash: <b class="${tot(x=>/cash/i.test(x.txt))>=0?'ok':'bad'}">${tot(x=>/cash/i.test(x.txt))>=0?'+':'−'}R$ ${brl(Math.abs(tot(x=>/cash/i.test(x.txt))))}</b></div>
      ${CAR.cfg().dep?`<div style="margin-top:10px;font-size:14px" data-r="wForm"><button class="sm" data-r="wDep">+ Depositar</button> <button class="sm" data-r="wSaq">− Sacar</button></div>`:`<div class="muted" style="margin-top:10px;font-size:13px">Nesta carreira não existe depósito: o dinheiro vem de prêmios, salário e patrocínio.</div>`}${CAL.on()&&LIFE.s&&!LIFE.s.retro?`<div class="vsum" style="margin-top:10px">📜 Sua carreira simulada ainda não foi aplicada: o dinheiro, os patrocínios e a fama que seus torneios antigos teriam dado. <button class="sm pri" data-r="goRetro">Ver e assumir</button></div>`:''}
      <p class="muted" style="font-size:12px;margin:8px 0 0">Dinheiro fictício. O buy-in sai daqui quando você começa um torneio ou senta no cash, e o prêmio ou as fichas com que você sai da mesa voltam para cá. No cash cada ficha vale R$ 1: escolha a mesa (baixa R$ 1/2, média R$ 2/5 ou alta R$ 5/10) antes de sentar.</p></div>
      <div class="panel"><h3>Extrato</h3>${L.map(x=>`<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-top:1px solid var(--line);font-size:14px"><div><div>${x.txt}</div><div class="muted" style="font-size:12px">${new Date(x.t).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})} · saldo R$ ${brl(x.bal)}</div></div><div class="${x.v>0?'ok':x.v<0?'bad':'muted'}" style="white-space:nowrap;font-weight:600">${x.v>0?'+':x.v<0?'−':''}R$ ${brl(Math.abs(x.v))}</div></div>`).join('')}</div>`}
  else if(tab==='rank'){h+=RK.html()}
  else{const N=s.news||[];
    if(!N.length)h+=`<div class="panel"><p style="margin:0">Ainda sem notícias. Elas aparecem conforme o tempo passa na vida dos jogadores (a cada partida nova e a cada 4 horas reais): torneios da comunidade, os seus resultados e os bastidores do circuito.</p></div>`;
    const days=[...new Set(N.map(x=>x.day))].sort((a,b)=>b-a),T=CIRC.table().slice(0,5);
    days.slice(0,8).forEach((d,k)=>{const it=N.filter(x=>x.day===d),tours=it.filter(x=>x.k==='tour'),mainN=tours.find(x=>x.mine)||tours[0]||it.find(x=>x.k==='vida')||it.find(x=>x.k==='rank')||null,rest=it.filter(x=>x!==mainN);
      h+=`<div class="panel news"><div class="muted" style="font-size:12px;letter-spacing:.08em;text-transform:uppercase">Edição de ${CAL.on()?CAL.fmt(d):DT(d)}</div>
        ${mainN?`<h3 class="nh">${mainN.title}</h3><p style="margin-top:0">${mainN.body}</p>`:''}
        ${rest.filter(x=>x.k==='tour'||x.k==='rank'||x.k==='vida').map(x=>`<div class="nb"><b>${x.title}</b><br><span style="font-size:14px">${x.body}</span></div>`).join('')}
        ${rest.filter(x=>x.k==='bast').length?`<div class="nsec"${mainN?'':' style="margin-top:4px"'}>Bastidores</div>${rest.filter(x=>x.k==='bast').slice(0,6).map(x=>`<div style="font-size:14px;padding:3px 0">• ${x.body}</div>`).join('')}`:''}
        ${k===0&&T.some(x=>x.pts)?`<div class="nsec">Ranking</div><div style="font-size:14px">${T.map((x,j)=>`${j+1}º ${x.name} (${nf(x.pts)})`).join(' · ')}</div>`:''}</div>`})}
  el.innerHTML=h;
  el.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{renderCircuit.tab=b.dataset.t;renderCircuit()});
  el.querySelectorAll('[data-rv]').forEach(b=>b.onclick=()=>{renderCircuit.rv=b.dataset.rv;renderCircuit()});
  const wf=el.querySelector('[data-r="wForm"]');if(wf){const form=sign=>{wf.innerHTML=`${sign>0?'Depositar':'Sacar'} R$ <input type="number" min="1" step="1" data-r="wVal" style="width:110px;padding:4px 6px;border-radius:7px;border:1px solid var(--line);background:rgba(0,0,0,.25);color:inherit"> <button class="sm pri" data-r="wOk">OK</button> <button class="sm" data-r="wNo">Cancelar</button>`;
      const i=wf.querySelector('[data-r="wVal"]');i.focus();wf.querySelector('[data-r="wNo"]').onclick=()=>renderCircuit();
      wf.querySelector('[data-r="wOk"]').onclick=()=>{const v=Math.round(+i.value*100)/100;if(!(v>0))return;if(sign<0&&v>WALLET.s.bal){i.style.borderColor='var(--bad)';return}WALLET.add(sign*v,sign>0?'Depósito':'Saque');renderCircuit()}};
    wf.querySelector('[data-r="wDep"]').onclick=()=>form(1);wf.querySelector('[data-r="wSaq"]').onclick=()=>form(-1)}
  const gr=el.querySelector('[data-r="goRetro"]');if(gr)gr.onclick=()=>{MIS.view='mis';RETRO.open=true;location.hash='#torneio';setTimeout(()=>{try{TOUR.render();window.scrollTo(0,0)}catch(e){}},50)};
  const rb=el.querySelector('[data-r="rstRank"]');if(rb)rb.onclick=()=>{const w=el.querySelector('[data-r="rstWrap"]');
    w.innerHTML='Zerar o ranking e começar a Temporada '+(S.n+1)+'? Os pontos de todos voltam a zero (o histórico de jogos e o jornal continuam). <button class="sm pri" data-r="rstY">Zerar</button> <button class="sm" data-r="rstN">Cancelar</button>';
    w.querySelector('[data-r="rstN"]').onclick=()=>renderCircuit();
    w.querySelector('[data-r="rstY"]').onclick=()=>{CIRC.newSeason();renderCircuit()}};
  const mi=el.querySelector('[data-r="meName"]');mi.onchange=()=>{LIVES.s.me=mi.value.trim()||'Felipe';LIVES.commit();renderCircuit()}}

