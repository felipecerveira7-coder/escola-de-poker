
/* ----- ranking no modelo BSOP (temporada, 10 melhores resultados) + GPI (geral, com envelhecimento) ----- */
const RK={
  key(d){const t=CAL.date(d);return t.getFullYear()*4+Math.floor(t.getMonth()/3)},
  label(k){const y=Math.floor(k/4),q=k%4;return`${['jan–mar','abr–jun','jul–set','out–dez'][q]} ${y}`},
  range(k){const y=Math.floor(k/4),q=k%4,c=LIVES.s.calStart,a=new Date(y,q*3,1,12),b=new Date(y,q*3+3,0,12);return[Math.round((a-c)/864e5)+1,Math.round((b-c)/864e5)+1]},
  zone(of){return Math.max(3,Math.ceil(of/3))},
  B(buy){return Math.max(.4,1+Math.log10(buy/500)*.6)},
  F(of){return clamp(Math.sqrt(of/27),.6,1.5)},
  pts(place,of,buy,gold){if(place>this.zone(of))return 0;const pb=100*(Math.log(of/place)+1)/(Math.log(of)+1);return Math.round(pb*this.B(buy)*this.F(of)*(gold?1.25:1))},
  log(){const s=LIVES.s;if(!s.rkv){s.rkv=1;s.rk=[];s.rks={};try{CIRC.post({k:'rank',title:'Ranking reformulado',body:'O circuito adotou o modelo dos grandes rankings: só pontua quem termina no terço de cima do torneio, buy-in e número de inscritos multiplicam os pontos, Main Event e etapas valem 25% a mais, e na temporada contam só os 10 melhores resultados de cada um. Cada trimestre é uma temporada.'})}catch(e){}}return s.rk=s.rk||[]},
  stats(){const s=LIVES.s;this.log();return s.rks=s.rks||{}},
  rec(n,place,of,buy,prize,tag){if(tag==='sat'||!place||!of)return;const d=LIVES.s.day,gold=buy>=2500,p=this.pts(place,of,buy,gold),L=this.log();
    if(p)L.push([n,d,p,place,of,buy]);
    const k=this.key(d),S=this.stats();S[k]=S[k]||{};const r=S[k][n]=S[k][n]||[0,0,0,0,0];r[0]++;if(place===1)r[1]++;else if(place<=3)r[2]++;if(prize)r[3]++;r[4]+=Math.round((prize||0)-buy);
    if(L.length>2500)LIVES.s.rk=L.filter(x=>x[1]>=d-200);Object.keys(S).forEach(x=>{if(+x<k-1)delete S[x]})},
  names(){return LIVES.ALL().filter(n=>LIVES.bio(n)).concat(['Você'])},
  row(n,o){return Object.assign({name:n==='Você'?CIRC.me():n,key:n,me:n==='Você'},o)},
  season(k){k=k==null?this.key(LIVES.s.day):k;const[a,b]=this.range(k),by={};this.log().forEach(x=>{if(x[1]>=a&&x[1]<=b)(by[x[0]]=by[x[0]]||[]).push(x[2])});const S=this.stats()[k]||{};
    return this.names().map(n=>{const r=(by[n]||[]).sort((p,q)=>q-p),st=S[n]||[0,0,0,0,0];return this.row(n,{pts:r.slice(0,10).reduce((s,v)=>s+v,0),res:r.length,t:st[0],w:st[1],pod:st[2],itm:st[3],profit:st[4]})})
      .sort((a,b)=>b.pts-a.pts||b.res-a.res||b.profit-a.profit||a.name.localeCompare(b.name))},
  AG:[1,.85,.6,.4],TOP:[5,5,4,4],
  geral(){const d=LIVES.s.day,by={};this.log().forEach(x=>{const per=Math.floor((d-x[1])/45);if(per<0||per>3)return;const o=by[x[0]]=by[x[0]]||[[],[],[],[]];o[per].push(x[2])});
    return this.names().map(n=>{const o=by[n]||[[],[],[],[]];let tot=0,cnt=0;o.forEach((arr,i)=>arr.sort((p,q)=>q-p).slice(0,this.TOP[i]).forEach(v=>{tot+=v*this.AG[i];cnt++}));return this.row(n,{pts:Math.round(tot),res:cnt})})
      .sort((a,b)=>b.pts-a.pts||b.res-a.res||a.name.localeCompare(b.name))},
  close(k){const T=this.season(k).filter(x=>x.pts>0),PR=[15000,7000,3000],s=LIVES.s;if(!T.length)return;s.champs=s.champs||[];if(s.champs.some(x=>x.k===k))return;s.champs.unshift({k,n:T[0].key,pts:T[0].pts});
    T.slice(0,3).forEach((x,i)=>{if(x.me){WALLET.add(PR[i],`Premiação do ranking: ${i+1}º na temporada ${this.label(k)}`);LIFE.addFame(i===0?4:i===1?2:1);LIFE.note(['🏆','🥈','🥉'][i],`${i+1}º lugar na temporada ${this.label(k)}`,`${nf(x.pts)} pontos. A premiação do ranking (R$ ${brl(PR[i])}) caiu na sua conta.`)}else if(s.bots[x.key])s.bots[x.key].bank+=PR[i]});
    CIRC.post({k:'rank',title:`${T[0].name} é campeão da temporada ${this.label(k)}`,body:`Com ${nf(T[0].pts)} pontos nos 10 melhores resultados. Pódio do ranking: ${T.slice(0,3).map((x,i)=>`${i+1}º ${x.name} (${nf(x.pts)})`).join(', ')}. Começa uma temporada nova, todo mundo do zero.`});s.leader=null;LIVES.commit()},
  evTable(){return['noite','turbo','domingo','sabado','etapa','main'].map(id=>{const E=EVTS[id],z=this.zone(E.N),g=E.buy>=2500;return`<tr><td>${E.emo} ${id==='etapa'?'Circuito Nacional':E.nm}</td><td>${nf(this.pts(1,E.N,E.buy,g))}</td><td>${nf(this.pts(3,E.N,E.buy,g))}</td><td>${z}º · ${nf(this.pts(z,E.N,E.buy,g))}</td></tr>`}).join('')},
  html(){const v=renderCircuit.rv||'temp',d=LIVES.s.day,k=this.key(d),[a,b]=this.range(k),T=v==='temp'?this.season():this.geral(),mi=T.findIndex(x=>x.me),me=T[mi];
    const row=(x,i)=>`<tr${x.me?' class="me"':''}><td>${i+1}</td><td>${x.me?'⭐ ':((LIVES.bio(x.key)||{}).emo||'')+' '}${x.name}</td><td><b>${nf(x.pts)}</b></td><td>${x.res}</td>${v==='temp'?`<td>${x.t}</td><td>${x.w}</td><td class="${x.profit>=0?'ok':'bad'}">${x.profit>=0?'+':''}${nf(x.profit)}</td>`:''}</tr>`;
    let h=`<div class="panel"><div class="anaf" style="margin-bottom:8px"><button class="sm${v==='temp'?' on':''}" data-rv="temp">🏅 Temporada</button> <button class="sm${v==='geral'?' on':''}" data-rv="geral">🌎 Ranking geral</button> <button class="sm${v==='como'?' on':''}" data-rv="como">❓ Como funciona</button></div>`;
    if(v==='como')return h+`<h3>Como o ranking funciona</h3><div style="font-size:14px;line-height:1.5">
      <p style="margin-top:0">É o mesmo jeito dos rankings de verdade. No BSOP cada resultado vale uma pontuação-base multiplicada por fatores de buy-in, número de inscritos e estrutura, e pro título de campeão brasileiro contam só os 10 melhores resultados do ano. O GPI, ranking mundial de torneios ao vivo, também multiplica buy-in e colocação e dá mais peso aos resultados recentes.</p>
      <p><b>Pontos de um resultado</b> = colocação × buy-in × inscritos × bônus.<br>• Só pontua quem termina no <b>terço de cima</b> do torneio (mínimo top 3). Cair cedo não tira ponto, só não soma.<br>• Buy-in: R$ 500 vale 1,0; cada vez que o buy-in multiplica por 10, o fator sobe 0,6.<br>• Inscritos: 27 jogadores vale 1,0; mais gente, mais pontos.<br>• Main Event e etapas do Circuito Nacional valem 25% a mais. Satélites não pontuam.</p>
      <p><b>Temporada</b> = um trimestre do calendário. Contam só os seus <b>10 melhores resultados</b>, então jogar muito não basta: o resultado novo só sobe sua pontuação se for melhor que o 10º. No fim da temporada o pódio leva R$ 15 mil, R$ 7 mil e R$ 3 mil, e o campeão ganha fama.</p>
      <p><b>Ranking geral</b> = últimos 180 dias, em 4 períodos de 45 dias. Contam os 5 melhores dos dois períodos recentes e os 4 melhores dos dois mais antigos, com peso 100%, 85%, 60% e 40%. Ficar parado faz você cair.</p></div>
      <h3>Quanto vale cada torneio</h3><div style="overflow-x:auto"><table class="small" style="font-size:13px"><tr><th>Torneio</th><th>1º</th><th>3º</th><th>Último que pontua</th></tr>${this.evTable()}</table></div></div>`;
    h+=v==='temp'?`<h3>Temporada ${this.label(k)}</h3><p class="muted" style="font-size:13px;margin-top:0">Faltam ${Math.max(0,b-d)} dias. Somam os 10 melhores resultados de cada jogador. "Res." = resultados que pontuaram.</p>`
      :`<h3>Ranking geral (últimos 180 dias)</h3><p class="muted" style="font-size:13px;margin-top:0">Estilo GPI: resultados recentes valem mais e os antigos vão perdendo peso.</p>`;
    h+=`<div style="overflow-x:auto"><table class="small" style="font-size:13px"><tr><th>#</th><th>Jogador</th><th>Pts</th><th>Res.</th>${v==='temp'?'<th>Torn.</th><th>Vit.</th><th>Saldo R$</th>':''}</tr>${T.slice(0,20).map(row).join('')}${mi>=20?row(me,mi):''}</table></div>
      ${T.length>20?`<details><summary class="muted" style="font-size:13px;margin-top:8px">Ver todos (${T.length})</summary><div style="overflow-x:auto"><table class="small" style="font-size:13px">${T.slice(20).map((x,i)=>row(x,i+20)).join('')}</table></div></details>`:''}</div>`;
    if(v==='temp'){const R=this.log().filter(x=>x[0]==='Você'&&x[1]>=a&&x[1]<=b).sort((p,q)=>q[2]-p[2]),cut=R[9]?R[9][2]:0;
      h+=`<div class="panel"><h3>Seus resultados na temporada</h3>${R.length?R.map((x,i)=>`<div class="vrow" style="font-size:14px;${i>=10?'opacity:.5':''}"><span>${CAL.fmt(x[1])} · ${x[3]}º de ${x[4]} · buy-in R$ ${brl(x[5]||0)}</span><b>${nf(x[2])}${i>=10?' (fora)':''}</b></div>`).join(''):'<div class="muted" style="font-size:14px">Nenhum resultado pontuado ainda. Termine no terço de cima de um torneio.</div>'}
        <div class="muted" style="font-size:12px;margin-top:6px">${R.length>=10?`Você já tem 10 resultados: um novo só entra se valer mais que ${nf(cut)} pontos.`:`Ainda cabem ${10-R.length} resultado${10-R.length>1?'s':''} na sua conta da temporada.`}</div></div>`}
    const C=(LIVES.s.champs||[]).slice(0,6);if(C.length)h+=`<div class="panel"><h3>Campeões de temporada</h3>${C.map(x=>`<div style="font-size:14px">🏆 ${this.label(x.k)}: <b>${x.n==='Você'?CIRC.me():x.n}</b> (${nf(x.pts)})</div>`).join('')}</div>`;
    return h}};

/* ----- missões ----- */
const MIS={view:'ag',
  st(){const s=LIFE.s;return s.mis=s.mis||{cl:{}}},
  wk(d){return d-((CAL.dow(d)+6)%7)},
  moRange(d){const t=CAL.date(d),c=LIVES.s.calStart,a=new Date(t.getFullYear(),t.getMonth(),1,12),b=new Date(t.getFullYear(),t.getMonth()+1,0,12);return[Math.round((a-c)/864e5)+1,Math.round((b-c)/864e5)+1]},
  played(a,b){return Object.entries(CAL.st().done).filter(([k,v])=>{const d=+k.split('@')[1];return d>=a&&d<=b&&v&&!v.noshow&&v.place})},
  items(kinds,a,b){return CAL.st().items.filter(x=>x.status==='done'&&kinds.includes(x.kind)&&x.day>=a&&x.day<=b).length},
  prizes(){return WALLET.s.log.filter(x=>/^Prêmio/.test(x.txt)&&x.v>0).reduce((s,x)=>s+x.v,0)},
  list(){const t=CAL.today(),s=LIFE.s,f=s.fame,A=CAL.st(),wa=this.wk(t),wb=wa+6,[ma,mb]=this.moRange(t),k=RK.key(t),O=[];
    const add=(g,id,per,tt,v,n,r,hint)=>O.push({g,id:id+(per!=null?'@'+per:''),t:tt,v:Math.min(v,n),n,r,hint,ok:v>=n});
    const tw=this.played(wa,wb),tg=f<20?2:f<50?3:4;let rest=0;for(let d=wa;d<=Math.min(wb,t);d++){const u=A.used[d];if(u==='rest'||u==='ferias'||(!u&&d<t))rest++}
    add('w','w_tour',wa,`Jogar ${tg} torneios`,tw.length,tg,.6,'Pros de torneio ao vivo jogam de 50 a 70 por ano. Aqui o calendário é mais apertado, então o ritmo é maior.');
    add('w','w_itm',wa,'Premiar em 1 torneio',tw.filter(([,v])=>v.prize>0).length,1,.8);
    add('w','w_rest',wa,'Ter 1 dia de folga',rest,1,.4,'Dia sem compromisso, descanso ou férias. Segura o desgaste mental.');
    add('w','w_fam',wa,'Um programa com família ou namoro',this.items(['fam','love'],wa,wb),1,.4);
    if(s.sp)add('w','w_mkt',wa,`Cumprir uma ação da ${s.sp.nm}`,this.items(['mkt'],wa,wb),1,.5);
    if(f>=10){let lv=0;for(let d=wa;d<=wb;d++)if(A.used[d]==='live')lv++;add('w','w_media',wa,'Fazer uma live ou ir a um evento',lv+this.items(['gig'],wa,wb),1,.4)}
    const md=this.played(ma,mb),inM=k2=>{const d=+k2.split('@')[1];return d>=ma&&d<=mb};
    add('m','m_main',ma,'Jogar o Main Event do mês',md.some(([k2])=>k2.startsWith('main@'))?1:0,1,1.5);
    add('m','m_etapa',ma,'Ir à etapa do Circuito Nacional (ou ganhar o satélite)',md.some(([k2])=>k2.startsWith('etapa@'))||Object.entries(A.reg).some(([k2,r])=>k2.startsWith('etapa@')&&r.ticket&&inM(k2))?1:0,1,1.5,'Satélites às terças e quintas antes da etapa dão o pacote completo.');
    add('m','m_zone',ma,'3 resultados que pontuam no ranking',RK.log().filter(x=>x[0]==='Você'&&x[1]>=ma&&x[1]<=mb).length,3,1.5);
    const bk=EVTS.sabado.buy*50;add('m','m_brm',ma,`Banca de 50 buy-ins do Sábado (R$ ${brl(bk)})`,WALLET.s.bal>=bk?1:0,1,1,'Pros de torneio guardam de 50 a 100 buy-ins pra aguentar a variância.');
    const T=RK.season(k),pos=T.findIndex(x=>x.me)+1,me=T[pos-1];
    add('s','s_res',k,'10 resultados pontuados (o máximo que conta)',me.res,10,3);
    add('s','s_top10',k,'Entrar no top 10 da temporada',me.pts>0&&pos<=10?1:0,1,2);
    add('s','s_top3',k,'Entrar no top 3 da temporada',me.pts>0&&pos<=3?1:0,1,3,'O pódio leva premiação do ranking no fim do trimestre.');
    const done=Object.values(A.done).filter(v=>v&&v.place&&!v.noshow),G=RK.geral(),gp=G.findIndex(x=>x.me)+1,
      mainFT=Object.entries(A.done).some(([k2,v])=>k2.startsWith('main@')&&v&&v.place&&v.place<=9),etITM=Object.entries(A.done).some(([k2,v])=>k2.startsWith('etapa@')&&v&&v.prize>0);
    [['c_itm','Primeiro prêmio em torneio',done.some(v=>v.prize>0)?1:0,1],['c_win','Primeira vitória',done.some(v=>v.place===1)?1:0,1],['c_10k','R$ 10 mil em prêmios na carreira',this.prizes(),10000],
     ['c_ft','Mesa final (top 9) do Main Event',mainFT?1:0,1],['c_sp','Fechar um patrocínio',s.sp||s.spEver?1:0,1],['c_etapa','Premiar numa etapa do Circuito Nacional',etITM?1:0,1],
     ['c_pro','Viver de poker: sem emprego e com R$ 50 mil de banca',!s.job&&WALLET.s.bal>=50000?1:0,1],['c_g10','Top 10 do ranking geral',G[gp-1].pts>0&&gp<=10?1:0,1],
     ['c_champ','Campeão de uma temporada',(LIVES.s.champs||[]).some(x=>x.n==='Você')?1:0,1],['c_fame','Fama 70: estrela do circuito',Math.round(f),70]].forEach(([id,tt,v,n])=>add('c',id,null,tt,v,n,2.5));
    return O},
  cnt(){if(!CAL.on())return 0;try{const C=this.st().cl;return this.list().filter(x=>x.ok&&!C[x.id]).length}catch(e){return 0}},
  claim(id){const x=this.list().find(o=>o.id===id),C=this.st().cl;if(!x||!x.ok||C[id])return'';C[id]=CAL.today();LIFE.addFame(x.r);LIFE.addMood(1);LIFE.commit();return`🎯 Missão cumprida: ${x.t}. Mídia +${x.r*1.5}.`},
  seg(){const c=this.cnt();return`<div class="anaf" style="margin:0 0 10px"><button class="sm${this.view!=='mis'?' on':''}" data-ag="mv:ag">📅 Agenda</button> <button class="sm${this.view==='mis'?' on':''}" data-ag="mv:mis">🎯 Missões${c?` <span class="vbdg nbg" style="position:static;margin-left:4px">${c}</span>`:''}</button></div>`},
  html(){const L=this.list(),C=this.st().cl,t=CAL.today(),wa=this.wk(t),[,mb]=this.moRange(t),[,sb]=RK.range(RK.key(t));
    const row=x=>`<div class="agrow"><div style="min-width:0"><b style="${C[x.id]?'opacity:.55':''}">${C[x.id]?'✅':x.ok?'🎯':'▫️'} ${x.t}</b><div class="mbar"><i style="width:${Math.round(x.v/x.n*100)}%"></i></div><div class="muted" style="font-size:12px">${x.n>=1000?`R$ ${brl(x.v)} de R$ ${brl(x.n)}`:`${nf(x.v)}/${nf(x.n)}`}${x.hint?` · ${x.hint}`:''}</div></div>
      <div class="agact">${C[x.id]?'<span class="muted">feita</span>':x.ok?`<button class="sm pri" data-ag="mc:${x.id}">Resgatar</button>`:`<span class="muted">+${x.r*1.5} mídia</span>`}</div></div>`;
    const sec=(g,title,sub)=>{const it=L.filter(x=>x.g===g);return`<div class="panel"><h3>${title}</h3><div class="muted" style="font-size:12px;margin:-4px 0 4px">${sub}</div>${it.map(row).join('')}</div>`};
    const car=L.filter(x=>x.g==='c'),nx=car.filter(x=>!C[x.id]);
    return sec('w','Semana',`Renova na segunda (${CAL.fmt(wa+7)}).`)+sec('m','Mês',`Até ${CAL.fmt(mb)}.`)+sec('s',`Temporada ${RK.label(RK.key(t))}`,`Até ${CAL.fmt(sb)}. Veja o ranking na aba Circuito.`)
      +`<div class="panel"><h3>Carreira</h3><div class="muted" style="font-size:12px;margin:-4px 0 4px">${car.length-nx.length} de ${car.length} marcos.</div>${nx.slice(0,4).map(row).join('')}${car.filter(x=>C[x.id]).map(row).join('')}</div>
      <div class="panel"><h3>📖 Como é a rotina de um pro de torneio</h3><div style="font-size:14px;line-height:1.5">
      • Quem vive de torneio ao vivo joga algo entre 50 e 70 torneios por ano, viajando de festival em festival, com buy-ins de centenas a milhares.<br>
      • A variância é brutal: mesmo um bom jogador pode passar 30 a 50 torneios sem um resultado grande. O ano costuma depender de uma ou duas campanhas fundas.<br>
      • A banca segura isso: de 50 a 100 buy-ins pra torneio, e descer de nível quando ela encolhe.<br>
      • Fora da mesa: viagem, hotel, patrocínio, aulas, venda de cotas e muita mídia.<br>
      • Aqui o calendário é comprimido: cada trimestre é uma temporada, e de 2 a 4 torneios por semana é um bom ritmo.</div></div>`}};
(()=>{const _sd=CAL.startDay;CAL.startDay=function(d){_sd.call(this,d);try{const a=RK.key(d-1),b=RK.key(d);if(a!==b)RK.close(a)}catch(e){}};
  const _sc=CIRC.score;CIRC.score=function(n,place,of,prize,buyin,tag){_sc.call(this,n,place,of,prize,buyin);try{RK.rec(n,place,of,buyin||LIVES.BUYIN,prize,tag)}catch(e){}};
  CIRC.table=function(){return RK.season()};
  CIRC.mine=function(){return RK.season().find(x=>x.me)||{pts:0,t:0,w:0,itm:0,profit:0}};
  const _fin=CAL.finish;CAL.finish=function(key,res){_fin.call(this,key,res);try{const ev=this.byKey(key);if(ev&&res&&!res.noshow&&res.place)RK.rec('Você',res.place,res.of||ev.E.N,ev.E.buy,res.prize||0,ev.E.sat?'sat':'');CIRC.leaderCheck();LIVES.commit()}catch(e){}};
})();
