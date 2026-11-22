/* ----- ranking no modelo BSOP (temporada, 10 melhores resultados) + GPI (geral, com envelhecimento) ----- */
const RK={
  key(d){const t=CAL.date(d);return t.getFullYear()*4+Math.floor(t.getMonth()/3)},
  label(k){const y=Math.floor(k/4),q=k%4;return`${['jan–mar','abr–jun','jul–set','out–dez'][q]} ${y}`},
  range(k){const y=Math.floor(k/4),q=k%4,c=LIVES.s.calStart,a=new Date(y,q*3,1,12),b=new Date(y,q*3+3,0,12);return[Math.round((a-c)/864e5)+1,Math.round((b-c)/864e5)+1]},
  zone(of){return CIRC.pays(of).length},
  AN:{sng:['Sit & Go de clube',0],turbo:['Turbo semanal de clube',0],deep:['Deep Stack de clube',0],fds:['Torneio principal do fim de semana',0],main:['Main Event de etapa regional',1],main0:['Main Event do Circuito (formato antigo)',1],etapa:['Etapa do circuito nacional',1]},
  EVC:{noite:'sng',turbo:'turbo',domingo:'deep',sabado:'fds',main:'main',etapa:'etapa'},
  analog(of,buy,hpl,mtt){if(!mtt||of<=12)return'sng';if(of>=40)return'main';if(buy>=2500)return'etapa';if(buy>=1000)return'fds';if(hpl>=15)return'deep';return'turbo'},
  B(buy){return Math.max(.4,1+Math.log10(buy/500)*.6)},
  F(of){return clamp(Math.sqrt(of/27),.6,1.5)},
  pts(place,of,buy,gold){if(place>this.zone(of))return 0;const pb=100*(Math.log(of/place)+1)/(Math.log(of)+1);return Math.round(pb*this.B(buy)*this.F(of)*(gold?1.25:1))},
  log(){const s=LIVES.s;if((s.rkv||0)<3&&!this._rb)this.rebuild();return s.rk=s.rk||[]},
  parseArt(x){if(x.res&&x.of)return{of:x.of,buy:x.buy,res:x.res};const m=(x.body||'').match(/^(\d+) jogadores, buy-in R\$ ([\d.]+)/);if(!m)return null;const of=+m[1],buy=+m[2].replace(/\./g,''),pi=x.body.indexOf('Pódio:');if(pi<0)return null;
    const seg=x.body.slice(pi+6).split(/\)\. /)[0],res=[];seg.replace(/(\d+)º ([^,(]+?) \(R\$/g,(a,p,n)=>{res.push([n.trim(),+p]);return a});return{of,buy,res}},
  rebuild(){const s=LIVES.s,me=CIRC.me();if(!s||!LIFE.s)return;const st=HIST.status;if(st==='carregando')return;if(st==='local'&&!(this._t0&&Date.now()-this._t0>15000)){this._t0=this._t0||Date.now();return}const T=HIST.sessions().filter(x=>x.mode==='tour'&&x.place);
    this._rb=1;s.rk=[];s.rks={};s.rkv=3;let nb=0,nm=0;
    (s.news||[]).filter(x=>x.k==='tour'&&x.day!=null).forEach(x=>{const a=this.parseArt(x);if(!a)return;const pay=CIRC.pays(a.of);
      a.res.forEach(([n,pl])=>{if(n===me||n==='Você'||!s.bots[n])return;this.rec(n,pl,a.of,a.buy,pl<=pay.length?Math.round(a.of*a.buy*pay[pl-1]):0,'',x.day);nb++})});
    const arts=(s.news||[]).filter(x=>x.k==='tour'&&x.mine),used=new Set(),doneE=Object.entries(CAL.st().done).filter(([k,v])=>v&&v.place&&!v.noshow);
    T.sort((a,b)=>(a.t||0)-(b.t||0)).forEach(x=>{const of=x.of||((x.cfg&&x.cfg.bots||0)+1),mtt=!!(x.cfg&&x.cfg.field);let buy=x.buyin||(x.cfg&&x.cfg.buyin)||LIVES.BUYIN,day=null,code=null;
      const end=Math.max(x.t||0,...x.hands.map(h=>h.t||0)),de=doneE.find(([k,v])=>!used.has(k)&&v.place===x.place&&v.of===of);
      if(de){used.add(de[0]);day=+de[0].split('@')[1];const id=de[0].split('@')[0];if(id==='sat')return;code=this.EVC[id];if(EVTS[id])buy=EVTS[id].buy}
      if(day==null){const a=arts.find(a=>!used.has(a)&&Math.abs((a.t||0)-end)<30*60e3);if(a){used.add(a);day=a.day}}
      if(day==null||day>s.day)day=s.day;if(!code&&mtt&&of>=27&&((x.cfg&&x.cfg.buyin)||x.buyin||0)>=1000){code='main0';buy=1000}code=code||this.analog(of,buy,x.cfg&&x.cfg.hpl,mtt);const pay=CIRC.pays(of);
      this.rec('Você',x.place,of,buy,x.prize!=null&&mtt?x.prize:(x.place<=pay.length?Math.round(of*buy*pay[x.place-1]):0),'',day,code);nm++});
    const R=this.season(),mi=R.findIndex(r=>r.me);
    try{CIRC.post({k:'rank',title:'Ranking refeito com premiação de verdade',body:`Agora os torneios pagam como na vida real (de 15% a 33% do campo, conforme o tamanho) e só pontua quem entra no dinheiro. Buy-in e número de inscritos multiplicam os pontos; Main Event e etapas valem 25% a mais; na temporada contam os 10 melhores resultados. Foram recontados ${nm} torneios de ${me} e ${nb} resultados dos outros jogadores do arquivo do jornal. ${me} aparece em ${mi+1}º, com ${nf(R[mi].pts)} pontos.`})}catch(e){}
    this._rb=0;try{LIVES.commit()}catch(e){}},
  stats(){const s=LIVES.s;return s.rks=s.rks||{}},
  rec(n,place,of,buy,prize,tag,day,code){if(tag==='sat'||!place||!of)return;const d=day!=null?day:LIVES.s.day,gold=code&&this.AN[code]?this.AN[code][1]:buy>=2500,p=this.pts(place,of,buy,gold),L=LIVES.s.rk=LIVES.s.rk||[];
    if(p)L.push(code&&n==='Você'?[n,d,p,place,of,buy,code]:[n,d,p,place,of,buy]);
    const k=this.key(d),S=this.stats();S[k]=S[k]||{};const r=S[k][n]=S[k][n]||[0,0,0,0,0];r[0]++;if(place===1)r[1]++;else if(place<=3)r[2]++;if(prize)r[3]++;r[4]+=Math.round((prize||0)-buy);
    if(L.length>2500)LIVES.s.rk=L.filter(x=>x[1]>=LIVES.s.day-200);const kc=this.key(LIVES.s.day);Object.keys(S).forEach(x=>{if(+x<kc-1)delete S[x]})},
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
    CIRC.post({k:'rank',title:`${T[0].name} leva o título da temporada ${this.label(k)}`,body:`Com ${nf(T[0].pts)} pontos nos 10 melhores resultados. Pódio do ranking: ${T.slice(0,3).map((x,i)=>`${i+1}º ${x.name} (${nf(x.pts)})`).join(', ')}. Começa uma temporada nova, todo mundo do zero.`});s.leader=null;LIVES.commit()},
  evTable(){return['noite','turbo','domingo','sabado','etapa','main'].map(id=>{const E=EVTS[id],z=this.zone(E.N),g=E.buy>=2500;return`<tr><td>${E.emo} ${id==='etapa'?'Circuito Nacional':E.nm}</td><td>${nf(this.pts(1,E.N,E.buy,g))}</td><td>${nf(this.pts(3,E.N,E.buy,g))}</td><td>${z}º · ${nf(this.pts(z,E.N,E.buy,g))}</td></tr>`}).join('')},
  html(){const v=renderCircuit.rv||'temp',d=LIVES.s.day,k=this.key(d),[a,b]=this.range(k),T=v==='temp'?this.season():this.geral(),mi=T.findIndex(x=>x.me),me=T[mi];
    const row=(x,i)=>`<tr${x.me?' class="me"':''}><td>${i+1}</td><td${x.me?'':` data-pf="${x.key}" class="pfl"`}>${x.me?'⭐ ':((LIVES.bio(x.key)||{}).emo||'')+' '}${x.name}</td><td><b>${nf(x.pts)}</b></td><td>${x.res}</td>${v==='temp'?`<td>${x.t}</td><td>${x.w}</td><td class="${x.profit>=0?'ok':'bad'}">${x.profit>=0?'+':''}${nf(x.profit)}</td>`:''}</tr>`;
    let h=`<div class="panel"><div class="anaf" style="margin-bottom:8px"><button class="sm${v==='temp'?' on':''}" data-rv="temp">🏅 Temporada</button> <button class="sm${v==='geral'?' on':''}" data-rv="geral">🌎 Ranking geral</button> <button class="sm${v==='como'?' on':''}" data-rv="como">❓ Como funciona</button></div>`;
    if(v==='como')return h+`<h3>Como o ranking funciona</h3><div style="font-size:14px;line-height:1.5">
      <p style="margin-top:0">É o mesmo jeito dos rankings de verdade. No BSOP cada resultado vale uma pontuação-base multiplicada por fatores de buy-in, número de inscritos e estrutura, e pro título de campeão brasileiro contam só os 10 melhores resultados do ano. O GPI, ranking mundial de torneios ao vivo, também multiplica buy-in e colocação e dá mais peso aos resultados recentes.</p>
      <p><b>Pontos de um resultado</b> = colocação × buy-in × inscritos × bônus.<br>• Só pontua quem <b>entra no dinheiro</b>. A premiação segue as tabelas reais: 9 jogadores pagam 3, 18 pagam 4, 27 pagam 5, 36 pagam 6 e 45 pagam 7. Cair cedo não tira ponto, só não soma.<br>• Buy-in: R$ 500 vale 1,0; cada vez que o buy-in multiplica por 10, o fator sobe 0,6.<br>• Inscritos: 27 jogadores vale 1,0; mais gente, mais pontos.<br>• Main Event e etapas do Circuito Nacional valem 25% a mais. Satélites não pontuam.</p>
      <p><b>Temporada</b> = um trimestre do calendário. Contam só os seus <b>10 melhores resultados</b>, então jogar muito não basta: o resultado novo só sobe sua pontuação se for melhor que o 10º. No fim da temporada o pódio leva R$ 15 mil, R$ 7 mil e R$ 3 mil, e o campeão ganha fama.</p>
      <p><b>Ranking geral</b> = últimos 180 dias, em 4 períodos de 45 dias. Contam os 5 melhores dos dois períodos recentes e os 4 melhores dos dois mais antigos, com peso 100%, 85%, 60% e 40%. Ficar parado faz você cair.</p></div>
      <h3>Quanto vale cada torneio</h3><div style="overflow-x:auto"><table class="small" style="font-size:13px"><tr><th>Torneio</th><th>1º</th><th>3º</th><th>Último que pontua</th></tr>${this.evTable()}</table></div></div>`;
    h+=v==='temp'?`<h3>Temporada ${this.label(k)}</h3><p class="muted" style="font-size:13px;margin-top:0">Faltam ${Math.max(0,b-d)} dias. Somam os 10 melhores resultados de cada jogador. "Res." = resultados que pontuaram.</p>`
      :`<h3>Ranking geral (últimos 180 dias)</h3><p class="muted" style="font-size:13px;margin-top:0">Estilo GPI: resultados recentes valem mais e os antigos vão perdendo peso.</p>`;
    h+=`<div style="overflow-x:auto"><table class="small" style="font-size:13px"><tr><th>#</th><th>Jogador</th><th>Pts</th><th>Res.</th>${v==='temp'?'<th>Torn.</th><th>Vit.</th><th>Saldo R$</th>':''}</tr>${T.slice(0,20).map(row).join('')}${mi>=20?row(me,mi):''}</table></div>
      ${T.length>20?`<details><summary class="muted" style="font-size:13px;margin-top:8px">Ver todos (${T.length})</summary><div style="overflow-x:auto"><table class="small" style="font-size:13px">${T.slice(20).map((x,i)=>row(x,i+20)).join('')}</table></div></details>`:''}</div>`;
    if(v==='temp'){const R=this.log().filter(x=>x[0]==='Você'&&x[1]>=a&&x[1]<=b).sort((p,q)=>q[2]-p[2]),cut=R[9]?R[9][2]:0;
      h+=`<div class="panel"><h3>Seus resultados na temporada</h3>${R.length?R.map((x,i)=>`<div class="vrow" style="font-size:14px;${i>=10?'opacity:.5':''}"><span>${CAL.fmt(x[1])} · ${x[6]&&this.AN[x[6]]?this.AN[x[6]][0]+' · ':''}${x[3]}º de ${x[4]} · R$ ${brl(x[5]||0)}</span><b>${nf(x[2])}${i>=10?' (fora)':''}</b></div>`).join(''):'<div class="muted" style="font-size:14px">Nenhum resultado pontuado ainda. Termine no terço de cima de um torneio.</div>'}
        <div class="muted" style="font-size:12px;margin-top:6px">${R.length>=10?`Você já tem 10 resultados: um novo só entra se valer mais que ${nf(cut)} pontos.`:`Ainda cabem ${10-R.length} resultado${10-R.length>1?'s':''} na sua conta da temporada.`}</div></div>`}
    const C=(LIVES.s.champs||[]).slice(0,6);if(C.length)h+=`<div class="panel"><h3>Campeões de temporada</h3>${C.map(x=>`<div style="font-size:14px">🏆 ${this.label(x.k)}: <b>${x.n==='Você'?CIRC.me():x.n}</b> (${nf(x.pts)})</div>`).join('')}</div>`;
    return h}};


