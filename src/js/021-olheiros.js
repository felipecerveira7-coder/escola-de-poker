/* ===================== OLHEIROS ===================== */
const SCOUTS={
  team:{nm:'Rafa Montes',emo:'🕶️',org:'Ás de Ouro Poker',role:'olheiro do time de profissionais do Ás de Ouro, um site de poker',min:.7},
  stake:{nm:'Cida Ventura',emo:'💼',org:'Ventura Staking',role:'investidora que banca jogadores em troca de parte do lucro',min:.66},
  coach:{nm:'Prof. Kleber Nunes',emo:'📘',org:'Academia Royal Flush',role:'coach e dono de uma escola de poker',min:0}};
SPONS.push({id:'asdeouro',nm:'Ás de Ouro Poker (Team Pro)',emo:'🕶️',fame:999,status:0,day:180,win:2500,itm:500,pct:.05,dur:21,req:{t:6,post:3},desc:'Time de profissionais do site: fixo diário, bônus e 5% dos prêmios. Quer você postando e jogando bastante.'});
const CATTIP={pf_loose:['Entrando com mão fraca','Você entra em potes com mãos fora da faixa da posição. Corte as mãos marginais nas primeiras posições e abra mais só no botão e no cutoff.'],
  pf_tight:['Largando mão boa','Você desiste com mãos que dão lucro para jogar. No botão, no small blind e com stack curto a faixa abre bastante.'],
  pf_passive:['Pagando em vez de aumentar','Com mão forte, aumente: limp e call deixam todo mundo ver flop barato e você perde valor.'],
  pf_aggr:['Aumentando demais','Você aumenta com mãos que não aguentam um 3-bet. Escolha mãos que jogam bem quando alguém reage.'],
  passive:['Deixando de apostar valor','Quando você tem a melhor mão, aposte. Check com mão boa dá carta grátis e ganha potes pequenos.'],
  aggr:['Apostando e blefando demais','Seus blefes estão saindo em mesas ruins pra blefe. Blefe com projeto ou quando a mesa favorece a sua faixa.'],
  call_bad:['Pagando sem odds','Compare a chance de vencer com o preço do call. Se a conta não fecha, largue, mesmo com par.'],
  fold_bad:['Largando com o preço certo','Você desiste quando o pote paga o call. Faça a conta do preço antes de largar.']};
const SCOUT={
  st(){const s=LIFE.s;s.sc=s.sc||{seen:{},offers:[],stake:null,lessons:[],teach:null};return s.sc},
  maybe(T){const g=T.g;if(!g||!LIFE.s||CAR.id==='qp')return;const sc=this.st(),d=LIVES.s.day;
    if(Object.values(sc.seen).some(x=>d-x<2)||sc.offers.length>=2)return;
    const p=.07+LIFE.s.fame/400+(g.mtt?.08:0)+(g.home&&!g.home.host?.04:0);if(Math.random()>=p)return;
    const pool=['coach','coach','stake'];if(LIFE.s.fame>=8&&(!LIFE.s.sp||LIFE.s.sp.id!=='asdeouro'))pool.push('team','team');if(sc.stake)pool.splice(pool.indexOf('stake'),1);
    const k=pickA(pool),S=SCOUTS[k];sc.seen[k]=d;g.scout={k,sid:T.sid,h0:g.hands};LIFE.commit();
    T.log(`<span class="gold">👀 ${S.nm} (${S.org}) está assistindo a mesa. ${S.role.charAt(0).toUpperCase()+S.role.slice(1)}.</span>`);
    setTimeout(()=>{if(T.g===g)T.dealerSay(pickA([`Viu quem chegou? ${S.nm}, da ${S.org}. Joga direitinho.`,`Tem olheiro na sala hoje: ${S.nm}. Vale caprichar.`]))},2500)},
  judge(T,res){const g=T.g;if(!g||!g.scout||g.scout.done)return;g.scout.done=true;const sc=this.st(),k=g.scout.k,S=SCOUTS[k];
    let ok=0,n=0;Object.values(HIST.docs).filter(d=>d.sid===g.scout.sid).forEach(d=>(d.hands||[]).forEach(h=>(h.d||[]).forEach(x=>{if(x&&x.cat){n++;if(x.cat==='ok')ok++}})));
    const okr=n?ok/n:.7,rs=res.place?(res.of-res.place+1)/res.of:clamp(.5+(res.net||0)/(2*(res.stack||1)),0,1),sc0=okr*.65+rs*.35;
    if(n<6&&k!=='coach'){LIFE.note(S.emo,`${S.nm} foi embora cedo`,'Não deu tempo de ver você jogar o suficiente.');LIFE.commit();return}
    const o={k,day:LIVES.s.day,score:sc0,okr,n};
    if(sc0<S.min&&k!=='coach'){LIFE.note(S.emo,k==='team'?`${S.nm} assistiu e não ligou`:`${S.nm} passou reto`,k==='team'?`Viu ${Math.round(okr*100)}% de boas decisões. Ainda não é o perfil do time.`:'Investidora quer consistência. Jogue mais limpo e ela volta.');LIFE.commit();return}
    if(k==='team')o.mult=sc0>.82?1.2:1;if(k==='stake'){o.cap=LIFE.s.fame>=15?1000:50;o.split=sc0>.8?.6:.5}
    if(k==='coach'){o.price=Math.round((250+LIFE.s.fame*12)/50)*50;o.teach=LIFE.s.fame>=25&&okr>=.8}
    this.schedule(k,o);LIFE.commit()},
  schedule(k,o){const S=SCOUTS[k],day=CAL.on()?CAL.free(CAL.today()+1,CAL.today()+5):null;
    if(!day){LIFE.note(S.emo,`${S.nm} deixou um recado`,'A proposta está na aba Marcas.','offer');this.meet({k,offer:o});return}
    CAL.add({kind:'meet',day,emo:S.emo,title:`Reunião com ${S.nm} (${S.org})`,desc:k==='team'?'Quer conversar sobre o time de profissionais.':k==='stake'?'Quer conversar sobre bancar seus torneios.':'Quer conversar sobre aulas.',ref:{k,offer:o}});
    LIFE.note(S.emo,`${S.nm} quer uma reunião`,`Gostou do que viu (${Math.round(o.okr*100)}% de boas decisões). Marcou ${CAL.fmt(day,true)}. Está na Agenda: se faltar, perde a proposta.`)},
  meet(R){const sc=this.st(),o=Object.assign({},R.offer,{day:LIVES.s.day}),S=SCOUTS[R.k];
    if(R.k==='team'){LIFE.s.offers=LIFE.s.offers.filter(x=>x.id!=='asdeouro');LIFE.s.offers.push({id:'asdeouro',day:LIVES.s.day,mult:o.mult||1,scout:true})}else sc.offers.push(o);
    LIFE.commit();return`🤝 Reunião com ${S.nm}: a proposta está na aba Marcas.`},
  /* staking: banca paga buy-in, prêmio cobre a makeup e o lucro é dividido */
  staked(buy){const st=this.st().stake;return!!(st&&LIVES.s.day<=st.end&&buy<=st.cap)},
  mark(sid,buy){const st=this.st().stake;if(!st)return;st.sids=st.sids||[];st.sids.push(sid);st.makeup+=buy;st.inv+=buy;LIFE.commit()},
  prize(sid,pr){const st=this.st().stake;if(!st||!(st.sids||[]).includes(sid)||!pr)return pr;const cover=Math.min(pr,st.makeup);st.makeup-=cover;const rest=pr-cover,mine=Math.round(rest*st.split);
    st.paid+=pr-mine;LIFE.note('💼',`Prêmio dividido com a ${SCOUTS.stake.org}`,`Prêmio R$ ${brl(pr)}: R$ ${brl(cover)} cobriram a makeup${rest?`, e do lucro de R$ ${brl(rest)} você ficou com ${Math.round(st.split*100)}% (R$ ${brl(mine)})`:''}. Makeup agora: R$ ${brl(st.makeup)}.`);LIFE.commit();return mine},
  accept(i){const sc=this.st(),o=sc.offers[i];if(!o)return'';sc.offers.splice(i,1);
    if(o.k==='stake'){sc.stake={by:SCOUTS.stake.nm,split:o.split,cap:o.cap,makeup:0,inv:0,paid:0,start:LIVES.s.day,end:LIVES.s.day+14,sids:[]};LIFE.addFame(.6);
      CIRC.post({k:'bast',title:'',body:`${CIRC.me()} agora joga bancado pela ${SCOUTS.stake.org}.`});LIVES.commit();LIFE.commit();return'Acordo fechado: seus torneios agora são bancados.'}
    if(o.k==='coach'&&o.teach){sc.teach={pay:Math.round((120+LIFE.s.fame*4)/10)*10,tire:6,since:LIVES.s.day};LIFE.addFame(.8);LIFE.commit();return'Agora você dá aula na Academia Royal Flush.'}
    return''},
  refuse(i){this.st().offers.splice(i,1);LIFE.commit()},
  daily(add){const sc=this.st();if(sc.teach){const wd=CAL.date(LIFE.s.day).getDay();if(wd===5)add('aulas na academia (semana)',sc.teach.pay*5);if(wd>=1&&wd<=5)LIFE.s.energy=Math.max(0,LIFE.s.energy-sc.teach.tire)}
    const st=sc.stake;if(st&&LIVES.s.day>st.end){LIFE.note('💼','Fim do acordo com a Ventura Staking',st.makeup>0?`Terminou com R$ ${brl(st.makeup)} de makeup, que foi perdoada no fim do acordo.`:`Terminou sem makeup. A ${SCOUTS.stake.org} recebeu R$ ${brl(st.paid)} no total.`);sc.stake=null}
    sc.offers=sc.offers.filter(o=>LIVES.s.day-o.day<=4)},
  stats(){const H=HIST.hands(),c={};let n=0,vp=0,pr=0,dn=0;H.slice(-400).forEach(h=>{n++;if(h.vp)vp++;if(h.pr)pr++;(h.d||[]).forEach(x=>{if(x&&x.cat){dn++;c[x.cat]=(c[x.cat]||0)+1}})});
    return{n,vpip:n?vp/n:0,pfr:n?pr/n:0,dn,c,ok:dn?(c.ok||0)/dn:0,leaks:Object.entries(c).filter(([k])=>k!=='ok').sort((a,b)=>b[1]-a[1])}},
  async lesson(i){const sc=this.st(),o=sc.offers[i];if(!o)return'Oferta expirou.';if(!WALLET.can(o.price))return'Saldo insuficiente.';
    WALLET.add(-o.price,`Aula particular com ${SCOUTS.coach.nm}`);if(!o.teach)sc.offers.splice(i,1);else o.lessonDone=true;
    if(CAL.on()){const day=CAL.free(CAL.today(),CAL.today()+6);if(day){CAL.add({kind:'lesson',day,emo:'📘',title:`Aula com ${SCOUTS.coach.nm}`,desc:'Ele vai analisar suas mãos e montar um plano.'});LIFE.commit();return`📘 Aula marcada para ${CAL.fmt(day,true)}. Está na Agenda.`}}
    return this.lessonRun()},
  async lessonRun(){const sc=this.st(),S=this.stats(),me=CIRC.me();
    const leakTxt=S.leaks.slice(0,4).map(([k,v])=>`${(CATTIP[k]||[k])[0]}: ${v} vezes`).join('; ');
    const v=await AIX.ask(`Você é o ${SCOUTS.coach.nm}, coach brasileiro de poker (Texas Hold'em), dando uma aula particular para ${me}, que está aprendendo.
Números das últimas ${S.n} mãos: VPIP ${Math.round(S.vpip*100)}%, PFR ${Math.round(S.pfr*100)}%, ${Math.round(S.ok*100)}% das ${S.dn} decisões aprovadas pelo treinador do app. Erros mais comuns: ${leakTxt||'poucos dados'}.
Escreva uma aula curta, direta e prática em português do Brasil: 3 pontos para melhorar (cada um com título curto e 2 ou 3 frases, citando os números) e 1 exercício para as próximas sessões. Sem enrolação.
Responda só com JSON: {"titulo":"...","pontos":[{"t":"...","x":"..."}],"exercicio":"..."}`);
    let L;if(v&&Array.isArray(v.pontos)&&v.pontos.length)L={title:String(v.titulo||'Aula particular').slice(0,90),pts:v.pontos.slice(0,4).map(p=>({t:String(p.t||'').slice(0,80),x:String(p.x||'').slice(0,500)})),ex:String(v.exercicio||'').slice(0,400)};
    else{const pts=S.leaks.slice(0,3).map(([k,c])=>({t:(CATTIP[k]||[k,''])[0],x:`${(CATTIP[k]||['',''])[1]} Aconteceu ${c} vezes nas suas últimas ${S.dn} decisões.`}));
      if(!pts.length)pts.push({t:'Volume',x:'Ainda tenho poucas mãos suas. Jogue mais umas sessões com o treinador ligado e me chame de novo.'});
      L={title:`Seu jogo em números: VPIP ${Math.round(S.vpip*100)}%, PFR ${Math.round(S.pfr*100)}%`,pts,ex:'Nas próximas 3 sessões, antes de cada ação, diga em voz alta a sua posição e a faixa que ela pede. Depois compare na aba Revisão.'}}
    sc.lessons.unshift(Object.assign({day:LIVES.s.day,stats:`VPIP ${Math.round(S.vpip*100)}% · PFR ${Math.round(S.pfr*100)}% · ${Math.round(S.ok*100)}% de boas decisões`},L));if(sc.lessons.length>10)sc.lessons.length=10;
    LIFE.addFame(.2);LIFE.commit();return'📘 Aula pronta: veja abaixo.'}};

function renderScouts(){const sc=SCOUT.st();let h=`<div class="panel"><h3>👀 Olheiros</h3><p class="muted" style="font-size:13px;margin-top:0">Às vezes aparece alguém assistindo a mesa: olheiro de time de site, investidor que banca jogador, coach de escola. Eles avaliam suas decisões e o resultado daquela sessão. Quanto mais fama e quanto maior o torneio, mais eles aparecem.</p>
  ${Object.values(SCOUTS).map(S=>`<div class="vrow"><span>${S.emo} <b>${S.nm}</b><div class="muted" style="font-size:12px">${S.org} · ${S.role}</div></span></div>`).join('')}</div>`;
  if(sc.stake){const st=sc.stake;h+=`<div class="panel"><h3>💼 Bancado pela ${SCOUTS.stake.org}</h3><div style="font-size:14px">Ela paga seus torneios de até R$ ${brl(st.cap)} até ${DT(st.end)}. Prêmio primeiro cobre a makeup, o resto é ${Math.round(st.split*100)}% seu.<br>Investido: R$ ${brl(st.inv)} · makeup: <b class="${st.makeup?'bad':'ok'}">R$ ${brl(st.makeup)}</b> · ${st.sids.length} torneios</div></div>`}
  if(sc.teach)h+=`<div class="panel"><h3>📘 Professor na Academia Royal Flush</h3><div style="font-size:14px">R$ ${brl(sc.teach.pay*5)} por semana dando aula (pago na sexta), cansa ${sc.teach.tire} de energia por dia útil. <button class="sm" data-sc="stopteach">Parar de dar aula</button></div></div>`;
  sc.offers.forEach((o,i)=>{const S=SCOUTS[o.k];h+=`<div class="panel vcard"><div class="vemo">${S.emo}</div><b>${S.nm}</b> <span class="muted" style="font-size:12px">${S.org}</span>
    <div class="muted" style="font-size:12px">Viu ${o.n} decisões suas, ${Math.round(o.okr*100)}% aprovadas. Vale até ${DT(o.day+4)}.</div>
    ${o.k==='stake'?`<div style="font-size:14px;margin:6px 0">Proposta: ela paga seus buy-ins de torneio (até R$ ${brl(o.cap)}) por 14 dias. Seus prêmios primeiro devolvem o que ela investiu e não recuperou (makeup). O que sobrar é dividido: ${Math.round(o.split*100)}% seu. Se o acordo acabar no prejuízo, a makeup é perdoada.</div><button class="sm pri" data-sc="acc:${i}">Fechar acordo</button> <button class="sm" data-sc="ref:${i}">Recusar</button>`:''}
    ${o.k==='coach'?`<div style="font-size:14px;margin:6px 0">${o.teach?`Convite pra dar aula na academia: cerca de R$ ${brl(Math.round((120+LIFE.s.fame*4)/10)*10)} por dia. `:''}Aula particular: ele analisa os seus números e os seus erros e monta um plano. R$ ${brl(o.price)}.</div>${o.lessonDone?'':`<button class="sm pri" data-sc="les:${i}">Marcar aula (R$ ${brl(o.price)})</button> `}${o.teach?`<button class="sm" data-sc="acc:${i}">Aceitar dar aulas</button> `:''}<button class="sm" data-sc="ref:${i}">Dispensar</button>`:''}</div>`});
  if(sc.lessons.length)h+=`<div class="panel"><h3>📘 Suas aulas</h3>${sc.lessons.map((L,k)=>`<details class="lesson"${k===0?' open':''}><summary><b>${lx(L.title)}</b> <span class="muted" style="font-size:12px">${DT(L.day)} · ${lx(L.stats)}</span></summary>${L.pts.map(p=>`<div style="margin:8px 0"><b>${lx(p.t)}</b><div style="font-size:14px">${lx(p.x)}</div></div>`).join('')}${L.ex?`<div class="vsum">🏋️ <b>Exercício:</b> ${lx(L.ex)}</div>`:''}</details>`).join('')}</div>`;
  return h}
function bindScouts(el,say){el.querySelectorAll('[data-sc]').forEach(b=>b.onclick=async()=>{const[a,i]=b.dataset.sc.split(':');
  if(a==='acc')say(SCOUT.accept(+i)||'');
  if(a==='ref'){SCOUT.refuse(+i);renderLife()}
  if(a==='stopteach'){SCOUT.st().teach=null;LIFE.commit();say('Você parou de dar aula.')}
  if(a==='les'){b.disabled=true;b.textContent='O professor está analisando suas mãos…';say(await SCOUT.lesson(+i))}})}

