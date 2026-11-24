/* ----- vida dos bots ----- */
const BIOS={
  'Bruno':{age:34,job:'Motorista de aplicativo',fam:'Casado, um filho de 6 anos',rent:1400,inc:110,live:45,bank:900,trait:'cabeça quente',tiltK:1.6,emo:'🚗'},
  'Carla':{age:29,job:'Enfermeira plantonista',fam:'Solteira, mora sozinha',rent:1100,inc:150,live:40,bank:3200,trait:'fria',tiltK:.5,emo:'🩺'},
  'Diego':{age:52,job:'Dono de oficina mecânica',fam:'Casado, três filhos',rent:0,inc:260,live:120,bank:8000,trait:'conservador',tiltK:.7,emo:'🔧'},
  'Elisa':{age:41,job:'Professora de matemática',fam:'Divorciada, uma filha adolescente',rent:1300,inc:140,live:50,bank:1800,trait:'calculista',tiltK:.6,emo:'📐'},
  'Fábio':{age:25,job:'Estudante e streamer de poker',fam:'Mora com os pais',rent:0,inc:35,live:20,bank:600,trait:'impulsivo',tiltK:1.4,emo:'🎮'},
  'Gabi':{age:37,job:'Advogada',fam:'Casada, sem filhos',rent:2500,inc:420,live:110,bank:15000,trait:'confiante',tiltK:.8,emo:'⚖️'},
  'Hugo':{age:46,job:'Vendedor (desempregado)',fam:'Separado, paga pensão',rent:1500,inc:0,live:55,bank:400,trait:'desesperado',tiltK:1.3,emo:'🧾'},
  'Íris':{age:63,job:'Aposentada',fam:'Viúva, quatro netos',rent:0,inc:110,live:70,bank:6000,trait:'paciente',tiltK:.4,emo:'🧶'}};
/* bios geradas para os jogadores do circuito (persistem no banco) */
const FEM=new Set(['Ana','Mariana','Juliana','Camila','Patrícia','Fernanda','Letícia','Beatriz','Renata','Sabrina','Débora','Larissa','Priscila','Tânia','Vanessa','Aline','Natália','Bianca','Lorena','Simone']);
function genBio(n){let s=0;for(const c of n)s=(s*31+c.charCodeAt(0))>>>0;const R=()=>{s=(s*1103515245+12345)>>>0;return(s>>>8)/16777216},P=a=>a[R()*a.length|0],F=FEM.has(n);
  const JOBS=[['Engenheiro civil','Engenheira civil',300,'🏗️'],['Garçom','Garçonete',90,'🍽️'],['Professor de história','Professora de história',140,'📚'],['Dentista','Dentista',350,'🦷'],['Vendedor de loja','Vendedora de loja',100,'🛍️'],
    ['Programador','Programadora',320,'💻'],['Pedreiro','Mestre de obras',140,'🧱'],['Contador','Contadora',220,'🧮'],['Policial militar','Policial militar',200,'🚓'],['Estudante de medicina','Estudante de medicina',25,'🎓'],
    ['Corretor de imóveis','Corretora de imóveis',200,'🏠'],['Barbeiro','Cabeleireira',120,'✂️'],['Empresário','Empresária',450,'💼'],['Bancário','Bancária',230,'🏦'],['Entregador de app','Entregadora de app',90,'🛵'],
    ['Médico','Médica',500,'🩺'],['Farmacêutico','Farmacêutica',200,'💊'],['Mecânico','Mecânica',150,'🔧'],['Jornalista','Jornalista',160,'📰'],['Arquiteto','Arquiteta',260,'📏'],
    ['Aposentado','Aposentada',110,'🧓'],['Desempregado','Desempregada',0,'🧾'],['Criador de conteúdo','Influenciadora digital',180,'📱'],['Caminhoneiro','Caminhoneira',190,'🚚'],['Personal trainer','Personal trainer',150,'🏋️'],
    ['Advogado','Advogada',380,'⚖️'],['Chef de cozinha','Chef de cozinha',210,'👨‍🍳'],['Funcionário público','Funcionária pública',260,'🏛️'],['Agricultor','Agricultora',170,'🌾'],['Jogador de poker','Jogadora de poker',120,'♠️']];
  const j=P(JOBS),ret=j[0].startsWith('Aposent'),age=ret?60+(R()*12|0):j[0].startsWith('Estudante')?20+(R()*6|0):23+(R()*38|0);
  const FAM=F?['Solteira, mora sozinha','Casada, dois filhos','Mora com os pais','Divorciada, um filho','Casada, sem filhos','Namora há anos, mora com o namorado','Mãe solo de duas crianças','Viúva, mora com a irmã']
             :['Solteiro, mora sozinho','Casado, dois filhos','Mora com os pais','Divorciado, um filho','Casado, sem filhos','Namora há anos, mora com a namorada','Pai solo de duas crianças','Viúvo, mora com o irmão'];
  const fam=age<27&&R()<.5?FAM[2]:P(FAM),own=fam.startsWith('Mora com os pais')||R()<.22;
  const TR=[['frio',.5],['cabeça quente',1.6],['impulsivo',1.4],['paciente',.4],['calculista',.6],['confiante',.8],['conservador',.7],['supersticioso',1.1],['desesperado',1.3]];
  const t=j[2]===0?TR[8]:P(TR.slice(0,8)),inc=j[2]?Math.round(j[2]*(.75+R()*.5)):0,rent=own?0:Math.round((700+inc*6*(.6+R()*.6))/50)*50;
  return{age,job:F?j[1]:j[0],fam,rent,inc,live:Math.round(25+inc*.3+(fam.match(/filh|crian/)?25:0)),bank:Math.round((inc*(4+R()*35)+200+R()*2500)/10)*10,trait:t[0],tiltK:t[1],emo:j[3],gen:true}}
const LIVES={LS:CAR.ls('escolaPoker.lives.v1'),s:null,db:null,BUYIN:50,CHIP:1,
  ALL(){return[...Object.keys(BIOS),...EXTRAS]},
  bio(n){if(BIOS[n])return BIOS[n];if(!this.s)return null;this.s.bios=this.s.bios||{};if(!this.s.bios[n]&&EXTRAS.includes(n))this.s.bios[n]=genBio(n);return this.s.bios[n]||null},
  newBot(b){return{bank:b.bank,mood:0,tilt:0,cond:{},diary:[],res:{tours:0,wins:0,itm:0,profit:0},rentDay:3+Math.random()*25|0,jobless:b.inc===0}},
  fresh(){const bots={};Object.entries(BIOS).forEach(([n,b])=>bots[n]={bank:b.bank,mood:0,tilt:0,cond:{},diary:[],res:{tours:0,wins:0,itm:0,profit:0},rentDay:3+Math.random()*25|0,jobless:b.inc===0});
    return{v:1,day:1,lastTick:Date.now(),updatedAt:Date.now(),bots}},
  load(){try{const x=JSON.parse(localStorage.getItem(this.LS)||'null');this.s=x&&x.bots?x:Object.assign(this.fresh(),{updatedAt:0})}catch(e){this.s=Object.assign(this.fresh(),{updatedAt:0})}
    this.ensure()},
  ensure(){this.ALL().forEach(n=>{const B=this.bio(n);if(B&&!this.s.bots[n])this.s.bots[n]=this.newBot(B)})},
  saveLocal(){try{localStorage.setItem(this.LS,JSON.stringify(this.s))}catch(e){}},
  async remote(db){this.db=db;try{const d=await db.collection('lives').doc('bots'+CAR.sfx()).get();const x=d&&d.exists?d.data():null;
      if(x&&x.bots&&(x.updatedAt||0)>(this.s.updatedAt||0)){const ks=this.s&&this.s.season;this.s=JSON.parse(JSON.stringify(x));if(ks&&(!this.s.season||(ks.n||1)>(this.s.season.n||1)))this.s.season=ks;this.ensure();this.saveLocal()}else{this.ensure();if(this.s.updatedAt>0)this.push()}}catch(e){}
    this.ready=true;try{syncFix()}catch(e){}
    if(typeof renderLives==='function'&&location.hash==='#jogadores')renderLives();if(typeof renderCircuit==='function'&&location.hash==='#circuito')renderCircuit()},
  push(){if(!this.db)return;const body=JSON.parse(JSON.stringify(this.s)),ref=this.db.collection('lives').doc('bots'+CAR.sfx());HIST.q=HIST.q.then(()=>ref.set(body)).catch(()=>{})},
  commit(){if(!this.ready&&!(this.s.updatedAt>0)){this.saveLocal();return}this.s.updatedAt=Date.now();this.saveLocal();clearTimeout(this._t);this._t=setTimeout(()=>this.push(),1500)},
  on(){const c=document.querySelector('[data-r="oLife"]');return !c||c.checked},
  note(n,t){const b=this.s.bots[n];if(!b)return;b.diary.unshift({d:this.s.day,t});if(b.diary.length>12)b.diary.length=12;
    if(typeof CIRC!=='undefined'&&/aluguel|emprego|Desempregado|emprestado|Não vai esquecer|irritado|pote enorme|pote grande|Brigou|dinheiro extra|Conta inesperada/.test(t)&&Math.random()<(/Não vai esquecer|emprestado|emprego|Desempregado/.test(t)?.6:.3))CIRC.post({k:'bast',title:'',body:`${n}: ${t.charAt(0).toLowerCase()+t.slice(1)}`})},
  styleOf(n){const b=this.s.bots[n],B=this.bio(n);if(!b||!B)return null;
    if(!b.style||!STY[b.style]){const map={'cabeça quente':['lag','lag','bal'],'impulsivo':['lag','station','bal'],'paciente':['rock','tag'],'conservador':['rock','rock','bal'],'frio':['tag','tag','bal'],'calculista':['tag','bal'],'confiante':['tag','lag','bal'],'desesperado':['lag','station'],'supersticioso':['station','bal','rock']};
      const a=map[B.trait]||Object.keys(STY);b.style=a[Math.random()*a.length|0];this.commit()}return b.style},
  drift(n,win){const b=this.s.bots[n];if(!b)return;b.dr=b.dr||{W:0,A:0,B:0};b.form=b.form||[];b.form.unshift(win?1:-1);if(b.form.length>10)b.form.length=10;
    const f=b.form.reduce((a,x)=>a+x,0);
    if(f<=-4){b.dr.W=Math.max(-.3,b.dr.W-.03);b.dr.B=Math.max(-.3,b.dr.B-.03);b.dr.A=Math.max(-.2,b.dr.A-.01);if(Math.random()<.35)this.note(n,'Anda perdendo muito. Decidiu jogar mais fechado e blefar menos.')}
    else if(f>=3){b.dr.W=Math.min(.3,b.dr.W+.02);b.dr.A=Math.min(.2,b.dr.A+.02);b.dr.B=Math.min(.3,b.dr.B+.03);if(Math.random()<.35)this.note(n,'Fase boa: está se soltando e blefando mais.')}},
  relAdd(n,o,v){const b=this.s.bots[n];if(!b||!o||n===o)return;b.rel=b.rel||{};const x=Math.max(-5,Math.min(5,(b.rel[o]||0)+v));if(Math.abs(x)<.2)delete b.rel[o];else b.rel[o]=x},
  rel(n,o){const b=this.s.bots[n];return b&&b.rel?b.rel[o]||0:0},
  hot(n){const B=this.bio(n);return!!B&&['cabeça quente','impulsivo','desesperado'].includes(B.trait)},
  cold(n){const B=this.bio(n);return!!B&&['frio','calculista','paciente','conservador'].includes(B.trait)},
  intent(t){t=t.toLowerCase();
    if(/(sorte|peixe|fraco|ruim|chor|patinho|burr|amador|tilt|lixo|vergonha|aprende|noob|kkk|hahah|mané|otário|pato|zica|bobo)/.test(t))return'prov';
    if(/(aluguel|trabalh|emprego|famíli|familia|filh|esposa|marido|neto|tudo bem|como (vai|est|tá|ta)|dinheiro|conta)/.test(t))return'life';
    if(/(blef|tinha|mostra|que mão|qual mão)/.test(t))return'bluff';
    if(/(boa|parab|valeu|obrigad|bem jogad|gg|nice|show|top|massa|tranquil|desculp|foi mal|abraço|respeito)/.test(t))return'nice';
    return t.includes('?')?'ask':'neutral'},
  /* efeito da sua fala e resposta do bot */
  hear(n,it){const b=this.s.bots[n],B=this.bio(n);if(!b||!B)return'…';const pick=a=>a[Math.random()*a.length|0],r=this.rel(n,'Você'),st=this.state(n),press=st&&st.tags.some(x=>x[0]==='press');
    if(it==='prov'){this.relAdd(n,'Você',-1);let tilted=false;if(Math.random()<.3*B.tiltK){b.tilt=Math.min(3,b.tilt+1);tilted=true;this.note(n,'Ficou irritado com as provocações de Você na mesa.')}this.commit();
      if(this.hot(n))return pick(tilted?['Vem pra cima então, vamos ver quem chora no final.','Repete isso quando eu pegar tuas fichas.','Tá rindo agora, mas a noite é longa.']:['Fala muito pra quem joga pouco.','Vou lembrar disso.']);
      if(this.cold(n))return pick(['Fala menos e joga mais.','Tá bom.','Interessante. Continua falando.']);
      if(B.trait==='confiante')return pick(['Daqui a pouco você vai estar me pedindo dica.','Relaxa, já vi muito iniciante assim.']);
      return pick(['Hmm. Ok.','Tá certo então.','Cada um com seu jeito.'])}
    if(it==='nice'){this.relAdd(n,'Você',1);if(b.tilt>0&&Math.random()<.5)b.tilt--;this.commit();
      if(r<=-3)return pick(['Não adianta puxar papo, ainda tô bravo contigo.','Guarda a gentileza, não esqueci aquela mão.']);
      return pick(['Valeu! Boa mesa hoje.','Obrigado, você também tá jogando bem.','Tranquilo, faz parte do jogo.','Haha, valeu.'])}
    if(it==='life'){this.relAdd(n,'Você',.5);this.commit();
      if(press)return pick([`Tá puxado… ${b.cond.aluguel?'o aluguel atrasou e o dono não para de ligar.':'o dinheiro tá curto esse mês.'}`,'Sinceramente? Preciso muito de um bom resultado hoje.']);
      if(b.tilt>=2)return pick(['Não me pergunta, hoje tá tudo dando errado.','Péssimo dia. Péssima semana.']);
      if(b.mood>=2)return pick(['Tô numa fase ótima!','Tudo em paz, graças a Deus.']);
      return pick([`Vou levando. ${B.job} cansa, mas é o que paga as contas.`,`${B.fam}… vida corrida, mas tudo bem.`,'Normal, sabe como é. E você?'])}
    if(it==='bluff')return pick(this.styleOf(n)==='lag'?['Eu sempre tenho, né? Haha.','Paga pra ver da próxima vez.']:['Nunca conto o que eu tinha.','Segredo profissional.','Só mostrando no showdown.']);
    if(it==='ask')return pick(['Hmm, sei lá.','Boa pergunta.','Depois eu te conto.']);
    return pick(['Haha.','Pode ser.','Bora jogar.','Hm.'])},
  /* falas dirigidas a você */
  atYou(n,kind){const B=this.bio(n);if(!B)return null;const pick=a=>a[Math.random()*a.length|0];
    if(kind==='grudge')return pick(['Você de novo? Ainda lembro daquele river.','Olha quem chegou… hoje eu desconto.','Lembro de você. Hoje é diferente.']);
    if(kind==='lostTo')return this.hot(n)?pick(['Que sorte, hein.','Só ganha no river, impressionante.','Isso não vai ficar assim.']):this.cold(n)?pick(['Bem jogado.','Justo.']):pick(['Boa mão.','Ah, não acredito.','Era sua, parabéns.']);
    if(kind==='beat')return pick(['Obrigado pelas fichas.','Foi mal, era minha.','Essa eu já sabia.','Hoje não, amigo.']);
    return null},
  addCond(n,k,days){const b=this.s.bots[n];b.cond[k]=Math.max(b.cond[k]||0,days)},
  /* o tempo passa: a cada partida nova, e a cada 4 horas reais, passa 1 dia na vida deles */
  tick(newGame){if(typeof CAL!=='undefined'&&CAL.on())return;const s=this.s,now=Date.now();let days=Math.floor((now-(s.lastTick||now))/(4*3600e3));if(newGame)days=Math.max(1,days);days=Math.min(days,10);
    if(!days)return;s.lastTick=now;for(let i=0;i<days;i++)this.day();this.commit();if(typeof LIFE!=='undefined'&&LIFE.s)LIFE.sync()},
  day(){const s=this.s;s.day++;
    Object.entries(s.bots).forEach(([n,b])=>{const B=this.bio(n),r=Math.random;if(!B)return;
      if(b.rel)Object.keys(b.rel).forEach(o=>{b.rel[o]*=.93;if(Math.abs(b.rel[o])<.2)delete b.rel[o]});
      Object.keys(b.cond).forEach(k=>{if(k==='aluguel')return;if(--b.cond[k]<=0)delete b.cond[k]});
      b.tilt=Math.max(0,b.tilt-1);b.mood+=b.mood>0?-.5:b.mood<0?.5:0;
      b.bank+=b.jobless?0:(B.inc||70);b.bank-=B.live;
      if(B.rent&&s.day%30===b.rentDay%30){if(b.bank>=B.rent){b.bank-=B.rent;this.note(n,`Pagou o aluguel (R$ ${nf(B.rent)}).`)}else{b.cond.aluguel=1;this.note(n,`Não conseguiu pagar o aluguel. O dono do apartamento já ligou duas vezes.`)}}
      if(b.cond.aluguel&&b.bank>=B.rent*1.2){b.bank-=B.rent;delete b.cond.aluguel;b.mood+=1;this.note(n,'Finalmente quitou o aluguel atrasado. Alívio.')}
      if(b.bank<0){b.bank=Math.max(b.bank,-3000)}
      const ev=r();
      if(ev<.04){const v=200+r()*800|0;b.bank+=v;b.mood+=1;this.note(n,`Entrou um dinheiro extra: R$ ${nf(v)}.`)}
      else if(ev<.08){const v=150+r()*900|0;b.bank-=v;b.mood-=1;this.note(n,`Conta inesperada de R$ ${nf(v)}.`)}
      else if(ev<.11){this.addCond(n,'briga',2);b.tilt=Math.min(3,b.tilt+1);this.note(n,'Brigou em casa. Chegou à mesa de cabeça quente.')}
      else if(ev<.14){this.addCond(n,'cansado',1);this.note(n,'Noite mal dormida. Está jogando no automático.')}
      else if(ev<.16&&B.fam.match(/filh|neto/)){this.addCond(n,'familia',2);this.note(n,'Compromisso de família pesando no bolso. Joga com mais cuidado.')}
      else if(ev<.18&&B.inc===0&&b.jobless){if(r()<.5){b.jobless=false;b.mood+=2;this.note(n,'Conseguiu um emprego temporário!')}}
      else if(ev<.19&&B.inc===0&&!b.jobless){b.jobless=true;b.mood-=2;this.note(n,'O contrato temporário acabou. Desempregado de novo.')}
      b.mood=Math.max(-3,Math.min(3,b.mood))});
    if(typeof CIRC!=='undefined'&&!(typeof CAL!=='undefined'&&CAL.on())&&Math.random()<.5)CIRC.community()},
  /* como a vida mexe no jogo */
  state(n){const b=this.s.bots[n],B=this.bio(n);if(!b||!B)return null;const tags=[];
    if(b.tilt>=2)tags.push(['tilt','😤','Em tilt: joga solto, blefa demais e paga leve.']);
    if(b.cond.aluguel||b.bank<(B.rent||800)*.5)tags.push(['press','😰','Pressionado por dinheiro: arrisca mais, quer dobrar o stack logo.']);
    if(b.cond.cansado)tags.push(['cans','😴','Cansado: comete erros e joga mais passivo.']);
    if(b.cond.familia)tags.push(['caut','🧐','Cauteloso: compromissos em casa, evita riscos.']);
    if(b.mood>=2&&b.tilt<2)tags.push(['conf','😎','Confiante: mais agressivo e com mais blefes.']);
    if(b.cond.briga&&b.tilt<2)tags.push(['irrit','😠','Irritado: um pouco mais agressivo que o normal.']);
    return{b,B,tags}},
  mods(n,X){if(!this.on())return X;const st=this.state(n);if(!st)return X;const d=st.b.dr;if(d){X.W*=1+d.W;X.A=Math.max(0,Math.min(1,X.A+d.A));X.B*=1+d.B}const t=new Set(st.tags.map(x=>x[0])),tl=st.b.tilt;
    if(t.has('tilt')){X.W*=1+.12*tl;X.B*=1+.4*tl;X.A=Math.min(1,X.A+.06*tl);X.M-=.02*tl}
    if(t.has('press')){X.W*=1.12;X.A=Math.min(1,X.A+.12);X.B*=1.4;X.M-=.03}
    if(t.has('cans')){X.A=Math.max(0,X.A-.08);X.M+=(Math.random()-.5)*.12}
    if(t.has('caut')){X.W*=.85;X.B*=.6;X.M+=.03}
    if(t.has('conf')){X.A=Math.min(1,X.A+.06);X.B*=1.2}
    if(t.has('irrit')){X.A=Math.min(1,X.A+.05);X.B*=1.15}
    return X},
  mood(n){if(!this.on())return null;const st=this.state(n);if(!st)return null;if(st.tags.length)return[st.tags[0][1],st.tags[0][2]];const m=st.b.mood;
    return m>=1?['🙂','De bom humor: joga o próprio estilo, um pouco mais solto.']:m<=-1?['😕','Meio pra baixo: joga o próprio estilo, um pouco mais travado.']:['😐','Normal: joga o próprio estilo.']},
  emoji(n){if(!this.on())return'';const st=this.state(n);return st&&st.tags.length?st.tags[0][1]:''},
  /* falas na mesa */
  talk(n,kind){if(!this.on())return null;const st=this.state(n);if(!st)return null;const t=new Set(st.tags.map(x=>x[0])),pick=a=>a[Math.random()*a.length|0];
    if(kind==='win'){if(t.has('press'))return pick(['Ufa… isso paga uns dias de aluguel.','Era disso que eu precisava hoje.','Agora sim, respira.']);
      if(t.has('tilt'))return pick(['Agora vocês vão ver.','Finalmente, né?','Tava devendo essa.']);return pick(['Boa mão, pessoal.','Obrigado, obrigado.','Hoje tá rendendo.'])}
    if(kind==='lose'){if(st.B.tiltK>=1.2)return pick(['Não acredito nisso…','Essa mesa tá de sacanagem.','Sempre o river, sempre.']);return pick(['Faz parte.','Bem jogado.','Paciência.'])}
    if(t.has('press'))return pick(['Preciso fazer essa grana hoje, o aluguel venceu.','Hoje eu não posso sair zerado.','O dono do apê não para de ligar…']);
    if(t.has('tilt'))return pick(['Que dia… nada entra.','Vou recuperar tudo hoje.','Alguém mais acha que esse baralho tá viciado?']);
    if(t.has('cans'))return pick(['*boceja*','Dormi duas horas…','Só mais umas mãos e vou dormir.']);
    if(t.has('caut'))return pick(['Hoje vou com calma, semana apertada em casa.','Sem loucura hoje.']);
    if(t.has('conf'))return pick(['Hoje é meu dia.','Tô lendo todo mundo.','Podem vir.']);
    return pick(['Boa noite, mesa.','Bora.','Alguém quer café?','Essa semana foi longa.'])},
  /* resultados mudam a vida */
  tourEnd(n,place,of,buyin,pays,quiet,tag){const b=this.s.bots[n],B=this.bio(n);if(!b||!B)return;buyin=buyin||this.BUYIN;const pool=of*buyin,pay=pays||(typeof CIRC!=='undefined'?CIRC.pays(of):[.5,.3,.2]),prize=place<=pay.length?Math.round(pool*pay[place-1]):0;
    if(quiet&&b.bank<buyin)this.note(n,`Pegou R$ ${nf(buyin)} emprestado para jogar um torneio.`);
    if(buyin>=500&&!quiet)this.note(n,b.bank<buyin?`Pegou R$ ${nf(buyin)} emprestado para jogar o torneio grande.`:`Pagou R$ ${nf(buyin)} de entrada no torneio grande.`);
    b.bank+=prize-buyin;b.res.tours++;b.res.profit+=prize-buyin;if(place===1)b.res.wins++;if(prize)b.res.itm++;
    if(place===1){b.mood+=2;b.tilt=0;this.note(n,`Ganhou um torneio e levou R$ ${nf(prize)}.`)}
    else if(prize){b.mood+=1;this.note(n,`Terminou em ${place}º e recebeu R$ ${nf(prize)}.`)}
    else if(place>=of-1){b.mood-=1;if(Math.random()<.4*B.tiltK)b.tilt=Math.min(3,b.tilt+1);this.note(n,`Caiu cedo no torneio (${place}º de ${of}). Perdeu R$ ${nf(buyin)}.`)}
    else this.note(n,`Terminou em ${place}º de ${of}, fora do dinheiro.`);
    this.drift(n,prize>0||place<=Math.max(2,of/3));b.mood=Math.max(-3,Math.min(3,b.mood));if(typeof CIRC!=='undefined')CIRC.score(n,place,of,prize,buyin,tag);this.commit()},
  cashHand(n,net,startStack){const b=this.s.bots[n],B=this.bio(n);if(!b||!B||!net)return;b.bank+=net*this.CHIP;b.res.profit+=net*this.CHIP;
    if(Math.abs(net)>=startStack*.4)this.drift(n,net>0);
    if(net<0&&-net>=startStack*.5&&Math.random()<.35*B.tiltK){b.tilt=Math.min(3,b.tilt+1);this.note(n,`Perdeu um pote enorme no cash (R$ ${nf(-net*this.CHIP)}).`)}
    if(net>0&&net>=startStack*.6){b.mood=Math.min(3,b.mood+1);this.note(n,`Ganhou um pote grande no cash (R$ ${nf(net*this.CHIP)}).`)}}};
LIVES.load();
function dealersHtml(){return`<div class="panel"><h3>🃏 Os dealers</h3><p class="muted" style="font-size:13px;margin-top:0">Eles se revezam nas mesas (troca a cada 25 mãos, mais ou menos), anunciam all-ins, potes grandes e subida de blinds, e também conversam. Toque no nome do dealer na mesa para ver quem é.</p>${DEALERS.map(D=>`<div style="padding:7px 0;border-top:1px solid var(--line);font-size:14px"><b>${D.emo} ${D.name}</b>, ${D.age} anos · <span class="muted">${D.tipo}</span><br>${D.story}</div>`).join('')}</div>`}
function renderLives(){const el=document.getElementById('livRoot');if(!el)return;const s=LIVES.s;
  el.innerHTML=`<div class="panel"><h2>Os jogadores</h2><p class="muted" style="margin:0">Todos os jogadores, inclusive os das outras mesas do torneio multimesas, têm uma vida que continua entre as partidas: dinheiro, contas, família e humor. A cada partida nova (e a cada 4 horas reais) passa um dia na vida deles, e o que acontece muda como jogam. O dinheiro é fictício: torneio custa R$ ${LIVES.BUYIN} e no cash cada ficha vale R$ 1.</p>
    <p class="muted" style="font-size:13px;margin:8px 0 0">Hoje é ${DT(s.day)}.</p></div>
    ${(()=>{const card=n=>{const st=LIVES.state(n),b=st.b,B=st.B,mood=b.tilt>=2?'Em tilt':b.mood>=2?'Muito bem':b.mood>=1?'Bem':b.mood<=-2?'Muito mal':b.mood<=-1?'Pra baixo':'Normal';
      return`<div class="panel life"><div class="lh2"><span class="lemo lav">${FACE.bot(n,46)}</span><div><b>${n}</b>, ${B.age} anos<div class="muted" style="font-size:13px">${B.job} · ${B.fam}</div></div></div>
        <div class="lrow"><span>Dinheiro</span><b class="${b.bank<(B.rent||800)?'bad':'ok'}">R$ ${nf(Math.round(b.bank))}</b></div>
        <div class="lrow"><span>Aluguel</span><b>${B.rent?`R$ ${nf(B.rent)}${b.cond.aluguel?' · <span class="bad">atrasado</span>':''}`:'não paga'}</b></div>
        <div class="lrow"><span>Humor</span><b>${mood}</b></div>
        <div class="lrow"><span>Jeito</span><b>${B.trait}</b></div>
        <div class="lrow"><span>Estilo de jogo</span><b>${(STY[LIVES.styleOf(n)]||{}).nm||'–'}${b.dr&&(Math.abs(b.dr.W)>=.05||Math.abs(b.dr.B)>=.05)?` · <span class="${b.dr.W<0?'muted':'gold'}">${b.dr.W<0?'mais fechado que antes':'mais solto que antes'}</span>`:''}</b></div>
        ${b.rel&&Object.keys(b.rel).length?`<div class="lrow"><span>Relações</span><b style="text-align:right">${Object.entries(b.rel).sort((x,y)=>x[1]-y[1]).slice(0,4).map(([o,v])=>`<span class="${v<0?'bad':'ok'}">${v<=-2?'😠':v<0?'😒':'🤝'} ${o}</span>`).join(' · ')}</b></div>`:''}
        <div class="lrow"><span>No poker</span><b>${b.res.tours} torneios · ${b.res.wins} vitórias · saldo ${b.res.profit>=0?'+':''}R$ ${nf(Math.round(b.res.profit))}</b></div>
        ${st.tags.length?st.tags.map(t=>`<div class="tip" style="font-size:14px">${t[1]} ${t[2]}</div>`).join(''):'<div class="tip" style="font-size:14px">🙂 Sem nada pesando: joga o próprio estilo.</div>'}
        ${b.diary.length?`<details><summary class="muted" style="font-size:13px;margin-top:6px">Diário</summary>${b.diary.map(x=>`<div style="font-size:13px;padding:3px 0"><span class="muted">${DT(x.d)}</span> · ${x.t}</div>`).join('')}</details>`:''}</div>`};
      const ex=EXTRAS.filter(n=>LIVES.state(n)).sort((a,b)=>a.localeCompare(b));
      return`<h3 style="margin:16px 4px 8px">Seus adversários frequentes</h3><div class="lives">${Object.keys(BIOS).map(card).join('')}</div>
        <details style="margin-top:16px"><summary class="panel" style="cursor:pointer;margin:0"><b>Outros jogadores do circuito (${ex.length})</b> <span class="muted" style="font-size:13px">· aparecem nos torneios multimesas</span></summary>
        <div class="lives" style="margin-top:12px">${ex.map(card).join('')}</div></details>`})()}`}
