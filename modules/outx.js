/* ----- sair com os amigos: cada um curte um programa (estilo GTA IV) ----- */
const OUTA={
  cafe:{nm:'Café e conversa',emo:'☕',c:45,h:1.5,en:3,from:8,md:.3},
  academia:{nm:'Treino na academia',emo:'🏋️',c:30,h:1.5,en:15,from:6,md:.5},
  futebol:{nm:'Pelada no society',emo:'⚽',c:40,h:2,en:18,from:8,md:1},
  boteco:{nm:'Boteco e cerveja',emo:'🍺',c:90,h:3,en:10,from:17,md:1},
  sinuca:{nm:'Sinuca e dardos',emo:'🎱',c:90,h:3,en:8,from:15,md:.8},
  boliche:{nm:'Boliche',emo:'🎳',c:160,h:2.5,en:8,from:14,md:.8},
  cinema:{nm:'Cinema',emo:'🎬',c:90,h:3,en:5,from:13,md:.6},
  churras:{nm:'Churrasco em casa',emo:'🥩',c:250,h:4,en:8,from:11,md:1.2},
  jantar:{nm:'Jantar num restaurante',emo:'🍽️',c:300,h:3,en:6,from:19,md:1},
  karaoke:{nm:'Karaokê',emo:'🎤',c:150,h:3,en:12,from:20,md:1.2},
  standup:{nm:'Show de stand-up',emo:'😂',c:220,h:3,en:6,from:20,md:1.2},
  estadio:{nm:'Jogo no estádio',emo:'🏟️',c:350,h:4,en:14,from:15,md:1.5},
  homegame:{nm:'Home game de poker',emo:'🃏',c:150,h:5,en:14,from:19,md:1},
  balada:{nm:'Balada',emo:'🪩',c:400,h:5,en:25,from:23,md:1.5},
  pesca:{nm:'Pescaria',emo:'🎣',c:200,h:6,en:15,from:5,md:1},
  praia:{nm:'Bate-volta na praia',emo:'🏖️',c:500,h:10,en:20,from:6,md:1.8}};
const OUTX={last:null,
  hash(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)},
  pref(n){const B=LIVES.bio(n)||{},j=(B.job||'').toLowerCase(),f=(B.fam||'').toLowerCase(),t=B.trait||'',a=B.age||30,P={};Object.keys(OUTA).forEach(k=>P[k]=2);const up=(ks,v)=>ks.forEach(k=>P[k]+=v);
    up(['homegame'],1);
    if(a<28)up(['balada','karaoke','futebol'],1);if(a>=45)up(['pesca','churras','cafe','jantar'],1),up(['balada','karaoke'],-2);
    if(/cabeça quente|impulsivo/.test(t))up(['estadio','boteco','balada'],1),up(['cafe','cinema'],-1);
    if(/frio|paciente|calculista/.test(t))up(['cafe','pesca','sinuca'],1),up(['balada','karaoke'],-1);
    if(/desesperado/.test(t))up(['boteco','homegame'],1),up(['jantar','praia'],-1);
    if(/casad|filh/.test(f))up(['churras','cafe'],1),up(['balada'],-1);if(/solteir/.test(f))up(['balada','praia'],1);
    if(/motorista|mecânic|pedreir|entregador/.test(j))up(['futebol','boteco','estadio'],1);
    if(/enferm|médic|medicina/.test(j))up(['cafe','cinema','praia'],1);if(/estudante/.test(j))up(['balada','karaoke','cinema'],1),up(['jantar'],-1);
    if(/empres|advog|engenh|corretor|dentist/.test(j))up(['jantar','standup'],1),up(['boteco'],-1);
    if(/programad|analista|designer/.test(j))up(['homegame','cinema','boliche'],1);if(/professor/.test(j))up(['cafe','standup','cinema'],1);
    const K=Object.keys(OUTA),h=this.hash(n);P[K[h%K.length]]+=2;P[K[(h>>3)%K.length]]-=2;P[K[(h>>7)%K.length]]+=1;
    Object.keys(P).forEach(k=>P[k]=clamp(P[k],0,4));return P},
  top(n){const P=this.pref(n);return Object.keys(P).sort((a,b)=>P[b]-P[a])[0]},
  known(n){const s=LIFE.s;s.outk=s.outk||{};return s.outk[n]=s.outk[n]||{}},
  cost(k){return Math.round(OUTA[k].c*2*(1+LIFE.status()*.15)/10)*10},
  TE:['😖','😕','😐','🙂','😍'],TN:['detestou','não curtiu','achou ok','curtiu','amou'],RV:[-.8,-.2,.6,1.2,1.9],
  go(n,k){const s=LIFE.s,b=LIVES.s.bots[n],A=OUTA[k];if(!b||!A)return'';
    if(LIFE.daily('out:'+n))return`Vocês já saíram hoje.`;if(Object.keys(s.did).filter(x=>x.startsWith('out:')&&s.did[x]===LIVES.s.day).length>=2)return'Você já saiu duas vezes hoje. Descansa.';
    if(LIFE.rel(n)<=-2){LIFE.mark('out:'+n);LIFE.commit();return`${n} respondeu: "Sair contigo? Nem pensar."`}
    const now=CLK.now(),st=Math.max(now,A.from);if(st+A.h>26.01)return`Não dá mais tempo hoje pra ${A.nm.toLowerCase()} (${CLK.fmt()}). Tente amanhã ou escolha algo mais curto.`;
    if(s.energy<A.en)return'Você está sem energia pra isso.';const c=this.cost(k);if(!WALLET.can(c))return'Saldo insuficiente.';
    const P=this.pref(n),K=this.known(n);let t=P[k];
    if(t===0&&!K[k]&&Math.random()<.6){K[k]=0;LIFE.commit();return`😖 ${n} respondeu: "${A.nm}? Não é minha praia… bora outra coisa?" (não custou nada; escolha outro programa)`}
    if(s.outLast&&s.outLast[n]===k&&t>1)t--;s.outLast=s.outLast||{};s.outLast[n]=k;
    LIFE.mark('out:'+n);WALLET.add(-c,`${A.nm} com ${n}`);CLK.to(st);CLK.add(A.h);s.energy=Math.max(0,s.energy-A.en);
    LIFE.addMood(t>=2?A.md:-.5);LIVES.relAdd(n,'Você',this.RV[t]);b.mood=clamp(b.mood+(t>=3?1:t<=1?-1:0),-3,3);K[k]=t;
    let x=pickA(({cafe:[`Duas horas de papo numa cafeteria. ${n} falou da vida e de poker.`],academia:[`Treinaram juntos. ${n} reclamou da perna o caminho todo.`],futebol:[`Pelada de society. ${n} ${t>=3?'fez gol e comemorou como final de Copa':'passou mais tempo no banco'}.`],
      boteco:[`Boteco perto do clube, mesa na calçada. ${n} pagou a primeira rodada.`],sinuca:[`Sinuca valendo a cerveja. ${Math.random()<.5?'Você':n} ganhou a melhor de cinco.`],boliche:[`Boliche com batata frita. ${n} ${t>=3?'fez um strike e não parou de falar nisso':'jogou mais na canaleta do que nos pinos'}.`],
      cinema:[`Filme de ação e pipoca. ${n} ${t>=3?'curtiu e já quer ver a sequência':'cochilou na metade'}.`],churras:[`Churrasco na sua casa. ${n} chegou com farofa e opinião sobre o ponto da carne.`],jantar:[`Jantar caprichado. ${n} ${t>=3?'elogiou cada prato':'achou tudo meio fresco demais'}.`],
      karaoke:[`Karaokê. ${n} ${t>=3?'cantou Legião Urbana de olho fechado':'não quis pegar o microfone'}.`],standup:[`Stand-up. ${n} ${t>=3?'chorou de rir':'riu de educação'}.`],estadio:[`Arquibancada lotada. ${n} ${t>=3?'gritou o jogo inteiro e saiu sem voz':'achou o jogo arrastado'}.`],
      homegame:[`Home game na sua casa com mais uns amigos.`],balada:[`Balada até de madrugada. ${n} ${t>=3?'dançou até a luz acender':'foi embora cedo'}.`],pesca:[`Pescaria na represa desde cedo. ${t>=3?`${n} tirou uma traíra enorme`:'Ninguém pegou nada'}.`],praia:[`Bate-volta no litoral. ${n} ${t>=3?'disse que precisava disso faz tempo':'reclamou do trânsito na volta'}.`]})[k]);
    if(k==='homegame'){const v=Math.round((Math.random()*2-.9)*Math.max(80,c))/10*10;WALLET.add(v,`Home game com ${n}`);x+=v>=0?` Você levou R$ ${brl(v)} das fichas.`:` Você deixou R$ ${brl(-v)} na mesa.`}
    if(k==='balada'||k==='estadio')LIFE.addFame(.15);
    if(t>=3&&Math.random()<.5){const o=Object.keys(LIVES.s.bots).filter(m=>m!==n&&LIVES.s.bots[m].diary&&LIVES.s.bots[m].diary.length);if(o.length){const m=pickA(o),d=LIVES.s.bots[m].diary[0];x+=` No fim da noite ${n} soltou uma fofoca: ${m} — ${d.t.charAt(0).toLowerCase()+d.t.slice(1)}`}}
    LIVES.note(n,`Saiu com ${CIRC.me()}: ${A.nm.toLowerCase()}. ${['Detestou.','Não curtiu muito.','Foi ok.','Curtiu.','Amou o programa.'][t]}`);
    if(t>=3){const T=s.th[n]=s.th[n]||{m:[],u:0};T.m.push({f:'them',x:pickA(['Valeu pela de hoje! Repetimos 🤝','Que noite! Bora de novo semana que vem?','Precisava disso. Valeu, parceiro.']),t:Date.now()});T.u=(T.u||0)+1}
    LIVES.commit();LIFE.commit();return`${A.emo} ${x} ${this.TE[t]} ${n} ${this.TN[t]}. Amizade ${this.RV[t]>0?'+':''}${this.RV[t].toFixed(1)}. (−R$ ${brl(c)}, ${A.h>=1?A.h+'h':'1h'})`},
  hint(n){const k=this.top(n),A=OUTA[k];return`Nas redes, vive postando ${({cafe:'foto de café',academia:'treino',futebol:'pelada de fim de semana',boteco:'mesa de bar',sinuca:'mesa de sinuca',boliche:'boliche',cinema:'crítica de filme',churras:'churrasco',jantar:'restaurante',karaoke:'vídeo cantando',standup:'show de comédia',estadio:'jogo no estádio',homegame:'home game',balada:'balada',pesca:'peixe na mão',praia:'praia'})[k]} ${A.emo}.`},
  panel(n){const K=this.known(n),now=CLK.now(),L=this.last&&this.last.n===n?this.last.m:'';
    return`<div class="gpick" style="margin-top:8px"><div style="font-size:13px;margin-bottom:6px">Chamar ${n} pra quê? Você convida, você paga. <span class="muted">${this.hint(n)}</span></div>
      <div class="gl">${Object.entries(OUTA).map(([k,A])=>{const st=Math.max(now,A.from),late=st+A.h>26.01,kn=K[k];return`<button class="sm" data-ox="${n}|${k}"${late?' disabled':''}>${A.emo} ${A.nm} · R$ ${brl(this.cost(k))}${kn!=null?' '+this.TE[kn]:''}<span class="muted" style="font-size:11px"> · ${late?'não dá hoje':st>now+.01?'às '+CLK.fmt(st):'agora'} · ${A.h}h</span></button>`}).join('')}</div>
      ${L?`<div class="vsum" style="margin-top:8px">${lx(L)}</div>`:''}
      <p class="muted" style="font-size:11px;margin:6px 0 0">Cada um curte coisas diferentes: idade, trabalho, família e temperamento pesam. Programa que ele ama vale muito mais amizade; repetir o mesmo seguido perde a graça. Os rostos mostram o que você já descobriu.</p></div>`}};
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-ox]');if(!t||t.disabled)return;e.stopPropagation();e.preventDefault();const[n,k]=t.dataset.ox.split('|');
  const m=OUTX.go(n,k);OUTX.last={n,m};const ov=document.getElementById('bpOv');if(ov&&ov.querySelector('[data-ox]'))BOTP.open(n,true);else if(location.hash==='#vida')renderLife()},true);
