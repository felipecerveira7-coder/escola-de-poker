/* ===================== CARREIRAS (saves) ===================== */
const ORIGINS=[
  {id:'estudante',emo:'🎓',nm:'Estudante universitário',bal:1500,home:'pais',job:{nm:'Estágio',pay:60,tire:6},mentor:'um colega de faculdade',
    desc:'Mora com os pais e faz estágio de meio período. Pouco dinheiro, mas sem aluguel. Começa jogando os torneios pequenos.'},
  {id:'clt',emo:'💼',nm:'Trabalhador CLT',bal:5000,home:'kit',job:{nm:'Auxiliar administrativo',pay:140,tire:10},mentor:'um colega do trabalho',
    desc:'Emprego fixo de dia, poker à noite. O salário cai todo dia 5, mas o trabalho cansa. Dá pra pedir demissão e virar profissional quando quiser.'},
  {id:'online',emo:'💻',nm:'Grinder do online',bal:15000,home:'kit',job:null,hype:2,mentor:'um amigo do fórum de poker',
    desc:'Anos jogando online, agora quer o circuito ao vivo. Boa banca e nenhum emprego. No clube ninguém conhece seu rosto.'},
  {id:'herdeiro',emo:'💰',nm:'Herdeiro',bal:60000,home:'ap2',own:true,job:null,rel:-.8,mentor:'o primo que joga no clube',
    desc:'Dinheiro de família e apartamento próprio. O pessoal do clube torce o nariz e vai querer suas fichas.'}];
const DIFS={facil:{nm:'Tranquila',emo:'🌤️',cost:.6,dep:true,desc:'Custos de vida 40% menores e depósito livre na carteira.'},
  normal:{nm:'Normal',emo:'⚖️',cost:1,dep:false,desc:'Custos normais e sem depósito: o dinheiro vem de prêmios, salário e patrocínio.'},
  real:{nm:'Realista',emo:'🔥',cost:1.4,dep:false,desc:'Custos 40% maiores e sem depósito. Quebrou, tem que se virar.'}};
const CAR={LSI:'escolaPoker.careers.v1',LSC:'escolaPoker.car',reg:null,db:null,
  id:(()=>{try{return localStorage.getItem('escolaPoker.car')||'c1'}catch(e){return'c1'}})(),
  ls(k,id){id=id||this.id;return id==='c1'?k:k+'.'+id},
  sfx(id){id=id||this.id;return id==='c1'?'':'_'+id},
  loadReg(){try{this.reg=JSON.parse(localStorage.getItem(this.LSI)||'null')}catch(e){}if(!this.reg||!Array.isArray(this.reg.list))this.reg={list:[],last:null,updatedAt:0}},
  saveReg(){this.reg.updatedAt=Date.now();try{localStorage.setItem(this.LSI,JSON.stringify(this.reg))}catch(e){}clearTimeout(this._t);this._t=setTimeout(()=>this.push(),2500)},
  push(){if(!this.db)return;const body=JSON.parse(JSON.stringify(this.reg)),ref=this.db.collection('careers').doc('index');HIST.q=HIST.q.then(()=>ref.set(body)).catch(()=>{})},
  async remote(db){this.db=db;try{const d=await db.collection('careers').doc('index').get();const x=d&&d.exists?d.data():null;
      if(x&&Array.isArray(x.list)&&(x.updatedAt||0)>(this.reg.updatedAt||0)){this.reg=JSON.parse(JSON.stringify(x));try{localStorage.setItem(this.LSI,JSON.stringify(this.reg))}catch(e){}this.touch(true)}
      else this.push()}catch(e){}if(TTL.open)renderTitle()},
  cur(){return this.reg.list.find(c=>c.id===this.id)},
  cfg(){const c=this.cur()||{},D=DIFS[c.dif||'normal']||DIFS.normal;return{cost:D.cost,dep:D.dep,dif:c.dif||'normal'}},
  /* atualiza o cartão da carreira atual (dia, saldo, fama) */
  touch(quiet){if(!LIVES.s||!WALLET.s||this.id==='qp')return;let c=this.cur();
    if(!c){if(this.id==='c1'&&!this.hasData())return;c={id:this.id,name:CIRC.me(),origin:this.id==='c1'?'legado':'livre',dif:'normal',created:Date.now()};this.reg.list.push(c)}
    Object.assign(c,{name:CIRC.me(),day:LIVES.s.day,bal:WALLET.s.bal,fame:LIFE.s?Math.round(LIFE.s.fame||0):0,t:Date.now()});this.reg.last=this.id;
    if(!quiet||!this._tt||Date.now()-this._tt>5000){this._tt=Date.now();this.saveReg()}},
  hasData(){try{return Object.values(HIST.docs).some(d=>(d.car||'c1')==='c1')||(WALLET.s&&WALLET.s.log.length>1)}catch(e){return false}},
  select(id){try{localStorage.setItem(this.LSC,id);sessionStorage.setItem('escolaPoker.skipMenu','1')}catch(e){}if(id!=='qp'){this.reg.last=id;this.saveReg();this.push()}
    location.hash=id==='qp'?'#torneio':'#vida';setTimeout(()=>location.reload(),150)},
  create(o){const id='c'+Date.now().toString(36),now=Date.now(),O=ORIGINS.find(x=>x.id===o.origin)||ORIGINS[1],nm=(o.name||'Jogador').trim().slice(0,24)||'Jogador';
    const W={bal:O.bal,log:[{t:now,v:O.bal,txt:`Início da carreira: ${O.nm}`,bal:O.bal}],updatedAt:now};
    const L=LIVES.fresh();L.me=nm;L.season={n:1,start:now};{const t=new Date();t.setHours(12,0,0,0);L.calStart=t.getTime()}L.updatedAt=now;L.news=[];
    const names=Object.keys(L.bots);if(O.rel)names.forEach(n=>{L.bots[n].rel={'Você':O.rel}});
    const mentor=names[Math.random()*names.length|0];L.bots[mentor].rel=Object.assign(L.bots[mentor].rel||{},{'Você':2.5});
    L.news.push({k:'vida',title:`Rosto novo no clube: ${nm}`,body:`${O.nm}, chegou ao circuito pelas mãos de ${mentor}. Ninguém sabe ainda do que é capaz.`,day:1,t:now});
    const F=LIFE.fresh();Object.assign(F,{home:O.home,own:O.own?{[O.home]:true}:{},job:O.job?Object.assign({},O.job):null,hype:O.hype||0,day:1,seeded:true,eT:now,updatedAt:now,origin:O.id});
    F.th={[mentor]:{m:[{f:'them',x:`E aí, ${nm}! Bem-vindo ao clube. Qualquer coisa me chama aqui. Primeira dica: começa pelos torneios pequenos e não se apavora com a bolha.`,t:now}],u:1,t:now}};
    try{localStorage.setItem(this.ls('escolaPoker.wallet.v1',id),JSON.stringify(W));localStorage.setItem(this.ls('escolaPoker.lives.v1',id),JSON.stringify(L));
      localStorage.setItem(this.ls('escolaPoker.life.v1',id),JSON.stringify(F));localStorage.setItem(this.ls('escolaPoker.saves.v1',id),'{}')}catch(e){}
    if(this.db){const put=(c,d,b)=>{const ref=this.db.collection(c).doc(d+this.sfx(id));HIST.q=HIST.q.then(()=>ref.set(b)).catch(()=>{})};put('wallet','me',W);put('lives','bots',L);put('life','me',F)}
    this.reg.list.push({id,name:nm,origin:O.id,dif:o.dif||'normal',created:now,day:1,bal:O.bal,fame:0,t:now});this.select(id)},
  async remove(id){if(id===this.id)return;this.reg.list=this.reg.list.filter(c=>c.id!==id);if(this.reg.last===id)this.reg.last=this.id;this.saveReg();this.push();
    ['escolaPoker.wallet.v1','escolaPoker.lives.v1','escolaPoker.life.v1','escolaPoker.saves.v1'].forEach(k=>{try{localStorage.removeItem(this.ls(k,id))}catch(e){}});
    const ids=Object.keys(HIST.docs).filter(k=>(HIST.docs[k].car||'c1')===id);ids.forEach(k=>delete HIST.docs[k]);HIST.saveLocal();
    if(this.db){const del=(c,d)=>{const ref=this.db.collection(c).doc(d);HIST.q=HIST.q.then(()=>ref.delete()).catch(()=>{})};
      del('wallet','me'+this.sfx(id));del('lives','bots'+this.sfx(id));del('life','me'+this.sfx(id));del('saves','cash'+this.sfx(id));del('saves','tour'+this.sfx(id));ids.forEach(k=>del('sessions',k))}}};
CAR.loadReg();

