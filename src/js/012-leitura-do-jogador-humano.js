/* ----- leitura do jogador humano (bots que aprendem) ----- */
function readHuman(){
  const H=HIST.hands().slice(-500),n=H.length,R={n,reads:[]};
  if(n<30)return R;
  let fr=0,frN=0,bl=0,blN=0,pf=0,pc=0,pN=0;
  H.forEach(h=>(h.d||[]).forEach(d=>{
    if(d.s==='p'){if(d.tc>h.bb*1.01&&!(d.nd!=null&&d.e!=null)){frN++;if(d.a==='f')fr++;if(h.pos==='SB'||h.pos==='BB'){blN++;if(d.a==='f')bl++}}}
    else if(d.tc>0){pN++;if(d.a==='f')pf++;else if(d.a==='c')pc++}}));
  const S=styleOf(H);
  R.foldPre=frN>=10?fr/frN:null;R.foldBlind=blN>=8?bl/blN:null;
  R.foldBet=pN>=12?pf/pN:null;R.callBet=pN>=12?pc/pN:null;
  R.vpFull=S&&S.full.n>=20?S.full.vp:null;R.shTight=S&&S.sh.n>=15?S.sh.tight/S.sh.n:null;
  R.overbet=S&&S.post.n>=20?S.post.aggr/S.post.n:null;
  R.station=R.foldBet!=null&&R.foldBet<=.3&&R.callBet>=.5;
  const P=x=>pct(x);
  if(R.foldBlind!=null&&R.foldBlind>=.6)R.reads.push(`Nos blinds você larga ${P(R.foldBlind)} contra aumento → eles roubam seus blinds com mais frequência.`);
  if(R.shTight!=null&&R.shTight>=.07)R.reads.push(`Com mesa curta ou stack curto você trava → no heads-up e no push/fold eles atacam com mais mãos.`);
  if(R.foldBet!=null&&R.foldBet>=.55)R.reads.push(`Você larga ${P(R.foldBet)} das vezes contra aposta pós-flop → mais c-bets e blefes contra você.`);
  if(R.station)R.reads.push(`Você paga ${P(R.callBet)} das apostas pós-flop → param de blefar e apostam valor com mãos mais fracas.`);
  if(R.vpFull!=null&&R.vpFull>.3)R.reads.push(`Com mesa cheia você entra em ${P(R.vpFull)} dos potes → re-aumentam suas aberturas com mais mãos de valor.`);
  if(R.foldPre!=null&&R.foldPre>=.7)R.reads.push(`Contra aumento pré-flop você larga ${P(R.foldPre)} → mais 3-bets de blefe em cima de você.`);
  if(R.overbet!=null&&R.overbet>=.06)R.reads.push(`Você aposta mão média com frequência → pagam suas apostas mais leve.`);
  return R}
class Table{
  constructor(root,mode){this.root=root;this.mode=mode;this.g=null;this.timer=null;this.tok=0;this.watch=false;this.build()}
  $(r){return this.root.querySelector(`[data-r="${r}"]`)}
  build(){
    const T=this.mode==='tour';
    this.root.innerHTML=`<div class="pbar"><div class="pstats" data-r="stats"></div>
      <div class="popts"><details class="pod"><summary>⚙️ Opções da mesa</summary><div class="podb">
        <label class="chk"><input type="checkbox" data-r="oCoach" checked> Treinador</label>
        <label class="chk"><input type="checkbox" data-r="oHud"> HUD</label>
        <label class="chk"><input type="checkbox" data-r="oSty"> Ver estilo</label>
        <label class="chk"><input type="checkbox" data-r="oLearn" checked> Bots aprendem</label>
        <label class="chk"><input type="checkbox" data-r="oLife" checked> Vida dos bots</label>
        <label class="chk"><input type="checkbox" data-r="oAI" checked> Conversas com IA</label>
        <label class="chk"><input type="checkbox" data-r="oSkip" checked> Pular mão ao desistir</label>
        <label class="chk"><input type="checkbox" data-r="oOpen"> Cartas abertas</label>
        <label class="chk"><input type="checkbox" data-r="oAuto"> Mão seguinte automática</label>
        <select data-r="oClock" aria-label="Relógio"><option value="off">Sem relógio</option><option value="calmo">Relógio calmo (30s / 45s)</option><option value="live">Relógio ao vivo (20s / 30s)</option><option value="turbo">Relógio turbo (15s / 20s)</option></select>
        <select data-r="oSpeed" aria-label="Velocidade"><option value="1300">Lento</option><option value="750" selected>Normal</option><option value="300">Rápido</option></select></div></details>
        <span data-r="rst"></span></div></div>
      <div class="twrap"><div class="ptable" data-r="table"></div><button class="cbtn" data-r="cOpen" style="display:none" aria-label="Conversa da mesa">💬</button></div>
      <div class="pcontrols" data-r="ctl"></div>
      <div class="panel readp" data-r="readp" style="display:none"></div>
      <div data-r="chat"></div>
      ${T?'<div class="grid2"><div class="panel" data-r="tinfo"></div><div class="panel" data-r="stand"></div></div>':''}
      <div class="grid2"><div class="panel coach" data-r="coach"></div><div class="panel"><h3>Histórico</h3><div class="plog" data-r="log"><span class="muted">As jogadas aparecem aqui.</span></div></div></div>`;
    {const os=this.$('oSkip');try{os.checked=localStorage.getItem('escolaPoker.skip')!=='0'}catch(e){}os.addEventListener('change',()=>{try{localStorage.setItem('escolaPoker.skip',os.checked?'1':'0')}catch(e){}})}
    ['oSty','oOpen','oHud'].forEach(k=>this.$(k).addEventListener('change',()=>this.renderTable()));
    this.$('oLife').addEventListener('change',()=>this.renderTable());
    {const oc=this.$('oClock');let v='live';try{v=localStorage.getItem('escolaPoker.clock')||'live'}catch(e){}oc.value=v;
      oc.addEventListener('change',()=>{try{localStorage.setItem('escolaPoker.clock',oc.value)}catch(e){}const g=this.g;if(oc.value==='off')this.clkStop();else if(g&&g.toAct===0&&!g.over&&!this.clk)this.clkStart();this.renderControls()})}
    this.$('oLearn').addEventListener('change',()=>{this.read=this.learn()?readHuman():null;this.renderRead()});
    this.$('oCoach').addEventListener('change',()=>this.g&&this.g.toAct===0&&!this.g.over?this.coachSoon():this.renderCoach());
    this.$('oAuto').addEventListener('change',()=>{const g=this.g;if(g&&g.over&&this.$('oAuto').checked)this.autoNext()});
    addEventListener('resize',()=>this.renderTable());
    this.resetUI();this.render()}
  resetUI(){const b=this.$('rst'),lab=this.mode==='tour'?'↺ Novo torneio':'↺ Reiniciar partida';
    if(this.mode==='cash'){if(!this.g){b.innerHTML='';return}
      b.innerHTML=this.leaveAfter?`<span class="muted" style="font-size:13px">Saindo ao fim da mão…</span> <button data-r="bStay" class="sm">Ficar</button>`:`<button data-r="bLeave" class="sm">🚪 Sair da mesa</button>`;
      if(this.leaveAfter){this.$('bStay').onclick=()=>{this.leaveAfter=false;this.resetUI()};return}
      this.$('bLeave').onclick=()=>{const g=this.g;if(!g)return;const me=g.players[0],busy=!g.over&&me.inHand&&!me.folded;
        if(!busy){this.cashOut();return}
        b.innerHTML='<span class="muted" style="font-size:13px">Você está numa mão.</span> <button data-r="bLv1" class="pri sm">Sair ao fim da mão</button> <button data-r="bLv2" class="sm">Desistir e sair agora</button> <button data-r="bLv0" class="sm">Cancelar</button>';
        this.$('bLv1').onclick=()=>{this.leaveAfter=true;this.resetUI()};
        this.$('bLv0').onclick=()=>this.resetUI();
        this.$('bLv2').onclick=()=>{this.leaveAfter=true;this.resetUI();if(g.toAct===0)this.act(0,'fold');else{me.folded=true;me.last='Desiste'}}};
      return}
    if(this.mode==='tour'&&this.g&&this.g.ev&&!this.g.finished){b.innerHTML=`<span class="muted" style="font-size:12px">🔒 Torneio valendo: não dá pra recomeçar. Vai até você cair ou ser campeão.</span>`;return}
    b.innerHTML=`<button data-r="bReset" class="sm">${lab}</button>`;
    this.$('bReset').onclick=()=>{if(!this.g){return}
      b.innerHTML='<span class="muted">Recomeçar do zero?</span> <button data-r="bRy" class="pri sm">Sim</button> <button data-r="bRn" class="sm">Cancelar</button>';
      this.$('bRy').onclick=()=>{this.stop();SAVES.del(this.mode);this.g=null;this.watch=false;this.resetUI();this.render()};
      this.$('bRn').onclick=()=>this.resetUI()}}
  stop(){clearTimeout(this.timer);clearInterval(this._bti);this.botClk=null;this._pendAct=null;this.tok++;this.clkStop()}
  /* ----- relógio de ação e cartões de tempo ----- */
  get CLK(){return{calmo:[30,45],live:[20,30],turbo:[15,20]}}
  tbInit(){const g=this.g;if(!g.tb){const a=typeof LIFE!=='undefined'?LIFE.cardAdj():0;g.tb={n:Math.max(1,(this.mode==='tour'?6:3)+a),lv:g.level||0,h:g.hands||0,bought:-1};if(a)setTimeout(()=>this.g===g&&this.log(`<span class="${a>0?'ok':'warn'}">⏱ ${a>0?'Você chegou descansado: +1 cartão de tempo.':`Você chegou cansado: ${a} cartão${a<-1?'ões':''} de tempo. Descanse na aba Vida.`}</span>`),50)}return g.tb}
  tbRefill(){const g=this.g,tb=this.tbInit();
    if(this.mode==='tour'){if((g.level||0)>=tb.lv+3&&tb.n<8){tb.lv+=3;tb.n++;Object.values(g.tbB||{}).forEach(x=>x.n=Math.min(8,x.n+1));this.log('<span class="gold">⏱ Você ganhou mais um cartão de tempo (a cada 3 níveis).</span>')}else if((g.level||0)>=tb.lv+3){tb.lv+=3;Object.values(g.tbB||{}).forEach(x=>x.n=Math.min(8,x.n+1))}}
    else if(g.hands-tb.h>=25){tb.h=g.hands;Object.values(g.tbB||{}).forEach(x=>x.n=Math.min(5,x.n+1));if(tb.n<5){tb.n++;this.log('<span class="gold">⏱ Você ganhou mais um cartão de tempo (a cada 25 mãos).</span>')}}}
  clkStart(){const g=this.g,m=this.$('oClock').value;this.clkStop();if(m==='off'||!this.CLK[m]||this.watch)return;this.tbInit();
    const sec=this.CLK[m][g.street==='preflop'?0:1];this.clk={left:sec*1000,tot:sec*1000,ext:false,last:Date.now(),buzz:false};
    this._ci=setInterval(()=>this.clkTick(),200);this.renderControls();this.renderTable()}
  clkStop(){clearInterval(this._ci);this._ci=null;this.clk=null}
  clkTick(){const c=this.clk,g=this.g;if(!c||!g)return this.clkStop();const now=Date.now(),dt=now-c.last;c.last=now;
    if(document.hidden||this.root.offsetParent===null)return; /* fora da tela: pausa */
    if(g.toAct!==0||g.over)return this.clkStop();
    c.left-=dt;if(c.left<=5000&&!c.buzz){c.buzz=true;try{navigator.vibrate&&navigator.vibrate(120)}catch(e){}}
    if(c.left<=0){const tb=g.tb;if(tb&&tb.n>0){this.clkExt('auto');return}
      const toCall=Math.max(0,g.currentBet-g.players[0].bet);this.clkStop();
      this.log(`<span class="bad">⏰ Tempo esgotado: ${toCall>0?'sua mão foi desistida':'check automático'}.</span>`);this.act(0,toCall>0?'fold':'check');return}
    this.clkDraw()}
  clkExt(how){const c=this.clk,g=this.g,tb=g&&g.tb;if(!c||!tb)return;
    if(how==='buy'){const me=g.players[0];if(this.mode==='tour'||tb.bought===g.hands||me.stack<g.bb)return;
      const others=g.players.filter(p=>!p.human&&!p.out&&!p.empty);me.stack-=g.bb;const each=Math.floor(g.bb/others.length);let rest=g.bb-each*others.length;
      others.forEach(p=>{p.stack+=each+(rest-->0?1:0)});tb.bought=g.hands;
      this.log(`<span class="gold">⏱ Você comprou +30s por ${nf(g.bb)} fichas (1 BB), divididas entre os outros jogadores.</span>`)}
    else{if(tb.n<=0)return;tb.n--;this.log(`<span class="gold">⏱ ${how==='auto'?'Seu tempo acabou e um cartão de tempo entrou automaticamente':'Você usou um cartão de tempo'} (+30s). Restam ${tb.n}.</span>`)}
    c.left=Math.max(0,c.left)+30000;c.tot=c.left;c.ext=true;c.buzz=false;this.renderLog();this.renderControls();this.renderTable()}
  clkDraw(){const c=this.clk,el=this.$('clk');if(!c||!el)return;const s=Math.max(0,Math.ceil(c.left/1000));
    el.classList.toggle('warn',c.left<=10000&&c.left>5000);el.classList.toggle('crit',c.left<=5000);el.classList.toggle('ext',c.ext&&c.left>10000);
    const bar=el.querySelector('i');if(bar)bar.style.width=Math.max(0,c.left/c.tot*100)+'%';const t=this.$('clkT');if(t)t.textContent=s+'s';
    const st=this.root.querySelector('.ptime');if(st)st.textContent='⏱ '+s}

  /* ----- utilidades ----- */
  get N(){return this.g.players.length}
  pot(){return this.g.players.reduce((s,p)=>s+p.total,0)}
  next(from,pred){const N=this.N;for(let k=1;k<=N;k++){const j=(from+k)%N;if(pred(this.g.players[j]))return j}return -1}
  put(p,a){a=Math.min(a,p.stack);p.stack-=a;p.bet+=a;p.total+=a;if(p.stack===0)p.allIn=true}
  log(h){const g=this.g;g.log.push(h);if(g.log.length>200)g.log.shift()}
  delay(){const g=this.g,me=g.players[0];if(this.watch||this.fwd)return 110;const d=+this.$('oSpeed').value;return(me.out||me.folded||!me.inHand)?d*.45:d}
  posMap(){const g=this.g,N=this.N,order=[];for(let k=0;k<N;k++){const j=(g.button+k)%N;if(g.players[j].inHand)order.push(j)}
    const names=POSN[order.length]||[];const m={};order.forEach((j,k)=>m[j]=names[k]);return m}
  behind(i){const g=this.g,N=this.N;let c=0,j=i;for(let k=0;k<N&&j!==g.bbI;k++){j=(j+1)%N;if(live(g.players[j]))c++}return c}
  ip(i,a){const g=this.g,N=this.N,d=x=>{const k=(x-g.button+N)%N;return k===0?N:k};return d(i)>d(a)}
  ff(p){const s=p.st;return s.hands>=15?clamp(s.pfr/s.hands/.18,.4,3):1}
  fv(p){const s=p.st;return s.hands>=15?clamp(s.vpip/s.hands/.25,.5,2.5):1}
  bluffP(p){const s=p.st;return s.hands>=10?clamp(.08+.07*s.agg/Math.max(1,s.calls),.06,.4):.2}
  ftb(p){const s=p.st;return s.facedBet>=6?s.fbet/s.facedBet:.45}
  od(q){return{range:q.range,pressure:q.pressure,calls:q.calledPost,bluffP:this.bluffP(q)}}

  save(){const g=this.g;if(!g||!this.sid)return;const me=g.players[0];
    if(g.finished||(this.mode==='tour'&&me.out)){SAVES.del(this.mode);return}
    const c=HIST.cur[this.sid]||{};
    SAVES.put(this.mode,{v:1,sid:this.sid,mode:this.mode,savedAt:Date.now(),button:g.button,sb:g.sb,bb:g.bb,ante:g.ante||0,hands:g.hands,wins:g.wins||0,buyins:g.buyins||1,
      level:g.level||0,hpl:g.hpl||0,startStack:g.startStack,levels:g.levels,anteType:g.anteType,structNm:g.structNm||'',cfg:c.cfg||null,t0:c.t||Date.now(),mtt:g.mtt?JSON.parse(JSON.stringify(g.mtt)):null,tb:g.tb||null,tbB:g.tbB||null,dealer:g.dealer==null?null:g.dealer,dealerSince:g.dealerSince||0,cashIn:g.cashIn||0,prizePaid:!!g.prizePaid,home:g.home||null,scout:g.scout||null,ev:g.ev||null,paused:!!g.paused,
      players:g.players.map(p=>({name:p.name,human:!!p.human,style:p.style||null,stack:p.stack,out:!!p.out,empty:!!p.empty,place:p.place||null,outHand:p.outHand||null,gear:p.gear||'n',gearLeft:p.gearLeft||0,st:p.st}))})}
  resume(s){
    this.stop();LIVES.tick(false);const st=()=>({hands:0,vpip:0,pfr:0,agg:0,calls:0,fbet:0,facedBet:0});
    const players=s.players.map(p=>Object.assign({},p,{style:p.human?undefined:(STY[p.style]?p.style:'bal'),hole:[],bet:0,total:0,folded:false,allIn:false,inHand:false,last:'',st:Object.assign(st(),p.st||{})}));
    if(!players[0].human)return;
    const levels=s.levels&&s.levels.length?s.levels:((Object.values(STRUCTS).find(x=>x.nm===s.structNm)||{}).levels||LEVELS);
    this.g={players,button:s.button||0,sb:s.sb,bb:s.bb,ante:s.ante||0,deck:[],board:[],street:'',currentBet:0,minRaise:s.bb,raises:0,pfRaises:0,pfAgg:-1,
      toAct:-1,over:true,log:[],msg:`Partida retomada na mão ${s.hands}.`,hl:new Set(),hands:s.hands,wins:s.wins||0,buyins:s.buyins||1,level:s.level||0,hpl:s.hpl||0,startStack:s.startStack,finished:false,levels,anteType:s.anteType||'each',structNm:s.structNm||''};
    if(s.mtt)this.g.mtt=s.mtt;if(s.tb)this.g.tb=s.tb;if(s.tbB)this.g.tbB=s.tbB;if(s.dealer!=null){this.g.dealer=s.dealer;this.g.dealerSince=s.dealerSince||0}this.g.cashIn=s.cashIn||(s.startStack*(s.buyins||1)*LIVES.CHIP);this.g.prizePaid=!!s.prizePaid;if(s.home)this.g.home=s.home;if(s.scout)this.g.scout=s.scout;if(s.ev)this.g.ev=s.ev;if(s.paused)this.g.paused=true;this.leaveAfter=false;
    this.sid=s.sid;
    const chunks=Object.values(HIST.docs).filter(d=>d.sid===s.sid).map(d=>d.chunk||1);
    HIST.cur[s.sid]={chunk:chunks.length?Math.max(...chunks):1,mode:this.mode,cfg:s.cfg||{bots:players.length-1,stack:s.startStack,hpl:s.hpl||0,st:s.structNm||''},t:s.t0||Date.now()};
    this.log(`<span class="gold">↻ Partida retomada: mão ${s.hands}${this.mode==='tour'?`, nível ${(s.level||0)+1}`:''}.</span>`);
    this.watch=false;this.resetUI();this.render()}
  /* ----- torneio multimesas (MTT) ----- */
  field(){const g=this.g;return g&&g.mtt?g.mtt.N:this.N}
  aliveHere(){return this.g.players.filter(p=>!p.out&&p.stack>0).length}
  aliveOthers(){const m=this.g&&this.g.mtt;return m?m.tables.reduce((s,t)=>s+t.ps.length,0):0}
  aliveAll(){return this.aliveHere()+this.aliveOthers()}
  sngBuy(){const g=this.g;return(g&&g.ev&&g.ev.buy)||LIVES.BUYIN}
  rkTag(){const g=this.g;return g&&g.ev&&g.ev.sat?'sat':''}
  sngPrize(place){const N=this.N,pay=CIRC.pays(N);return place<=pay.length?Math.round(N*LIVES.BUYIN*pay[place-1]):0}
  prizeOf(place){const m=this.g&&this.g.mtt;if(!m||place>m.pays.length)return 0;return Math.round(m.N*m.buyin*m.pays[place-1])}
  postResult(){const g=this.g;if(!g||g.posted||this.mode!=='tour'||!LIVES.on()||typeof CIRC==='undefined')return;g.posted=true;
    const res=g.mtt?g.mtt.busted.map(x=>({name:x.name,place:x.place})):g.players.filter(p=>!p.empty&&p.place).map(p=>({name:p.human?'Você':p.name,place:p.place}));
    if(!res.length)return;CIRC.article({nm:this.tname(),of:this.field(),buy:g.mtt?g.mtt.buyin:this.sngBuy(),pays:g.mtt?g.mtt.pays:CIRC.pays(this.N),res});LIVES.commit()}
  /* ===== dealer ===== */
  dealerObj(){const g=this.g;if(!g)return DEALERS[0];if(g.dealer==null){g.dealer=Math.random()*DEALERS.length|0;g.dealerSince=g.hands}return DEALERS[g.dealer]}
  dealerSay(t,quiet){if(!t||!this.g)return;const D=this.dealerObj();this.dbub={t,until:Date.now()+4200};this.msgs=this.msgs||[];this.msgs.push({from:D.name,text:t,kind:'dealer'});if(this.msgs.length>60)this.msgs.shift();
    if(!quiet&&!this.chatOpen)this.unread=(this.unread||0)+1;clearTimeout(this._db);this._db=setTimeout(()=>this.renderTable(),4300);this.renderTable();this.renderChat()}
  dl(k,x){const D=this.dealerObj(),a=D.L[k]||[];let t=a[Math.random()*a.length|0]||'';Object.entries(x||{}).forEach(([a,b])=>t=t.split('{'+a+'}').join(b));return t}
  dealerTick(){const g=this.g;if(!g)return;const first=g.dealer==null;this.dealerObj();
    if(first){if(g.hands===0)setTimeout(()=>this.dealerSay(this.dl('hi'),true),500);return}
    if(g.hands-g.dealerSince>=25&&Math.random()<.5){this.dealerSay(this.dl('bye'),true);let n;do{n=Math.random()*DEALERS.length|0}while(n===g.dealer);
      setTimeout(()=>{if(!this.g)return;g.dealer=n;g.dealerSince=g.hands;this.log(`<span class="muted">🃏 Troca de dealer: entra ${DEALERS[n].name}.</span>`);this.dealerSay(this.dl('hi'),true)},1600);return}
    if(this.mode==='tour'&&g.mtt&&!g._bubSaid&&this.aliveAll()===g.mtt.pays.length+1){g._bubSaid=true;this.dealerSay(this.dl('bubble'));return}
    if(Math.random()<.06)this.dealerSay(this.dl('idle'),true)}
  dealerAfter(){const g=this.g;const ws=g.players.filter(p=>p.won>0).sort((a,b)=>b.won-a.won),w=ws[0];if(!w)return;
    const allin=g.players.some(p=>p.inHand&&!p.folded&&p.allIn)&&g.players.filter(p=>p.inHand&&!p.folded).length>1;
    if(allin&&Math.random()<.6)this.dealerSay(this.dl('allin'),true);
    else if(w.won>=40*g.bb&&Math.random()<.6)this.dealerSay(this.dl('big',{w:w.human?CIRC.me():w.name}),true)}
  /* ===== tempo dos bots: pensar, cartões e qualidade da decisão ===== */
  tbBot(n){const g=this.g;g.tbB=g.tbB||{};if(!g.tbB[n])g.tbB[n]={n:this.mode==='tour'?6:3};return g.tbB[n]}
  botThink(j){const g=this.g,p=g.players[j],B=LIVES.bio(p.name)||{},st=LIVES.state(p.name),tg=new Set((st?st.tags:[]).map(x=>x[0]));
    const toCall=Math.max(0,g.currentBet-p.bet),pre=g.street==='preflop',pot=this.pot();
    let d=pre?(toCall<=g.bb?.04:.22):.28;if(toCall>0)d+=Math.min(.6,toCall/Math.max(1,p.stack)*1.2);if(toCall>=p.stack)d+=.25;if(g.street==='river')d+=.12;if(toCall>0&&toCall>=pot*.6)d+=.1;d=Math.min(1,d);
    const tr=B.trait||'',slow={'calculista':1.45,'frio':1.3,'fria':1.3,'paciente':1.35,'conservador':1.25,'supersticioso':1.15}[tr]||(['impulsivo','cabeça quente','desesperado'].includes(tr)?.6:1);
    const k=slow*(tg.has('tilt')?.6:1)*(tg.has('cans')?.85:1),want=(1+d*d*32+Math.random()*3)*k;
    const m=this.$('oClock').value,on=m!=='off'&&!!this.CLK[m],base=on?this.CLK[m][pre?0:1]:999,tb=this.tbBot(p.name);
    let secs=want,cards=0,rush=false;
    if(on&&want>base){if(tb.n>0&&d>=.45&&!tg.has('tilt')){cards=Math.min(tb.n,Math.ceil((want-base)/30));tb.n-=cards;secs=Math.min(want,base+cards*30)}else{secs=base*(.86+Math.random()*.12);rush=true}}
    let q=.55+.45*Math.min(1,secs/Math.max(1,want));
    if(['calculista','frio','fria','paciente'].includes(tr))q+=.1;if(['impulsivo','cabeça quente','desesperado'].includes(tr))q-=.05;
    if(tg.has('tilt'))q-=.15;if(tg.has('cans'))q-=.1;if(rush)q-=.08;
    return{secs,q:Math.max(.35,Math.min(1.2,q)),cards,rush,budget:on?base+cards*30:999,hw:['confiante','calculista','frio','fria'].includes(tr)&&Math.random()<.35}}
  /* ações antecipadas (como no PokerStars) */
  preTry(){const g=this.g,me=g.players[0],P=this.pre;this.pre=null;if(!P||P.hand!==g.hands||P.street!==g.street)return false;
    const tc=Math.max(0,g.currentBet-me.bet);let a=null;
    if(P.k==='cf')a=tc?'fold':'check';else if(P.k==='fold')a=tc?'fold':null;else if(P.k==='check')a=tc?null:'check';
    else if(P.k==='call')a=tc===P.v?(tc?'call':'check'):null;else if(P.k==='any')a=tc?'call':'check';
    if(!a){this.renderControls();return false}
    if(a!=='fold')this.fwd=false;
    if(a==='fold'&&this.fwd){this._hT0=Date.now()-300;this.pendRec=this.recFor();this.act(0,'fold');return true}
    this._hT0=Date.now()-300;const tok=this.tok,lab={fold:'Desistir',check:'Check',call:'Pagar'}[a];
    this.$('ctl').innerHTML=`<div class="pwait">Ação antecipada: <b>${lab}</b></div>`;
    setTimeout(()=>{if(tok!==this.tok||g.toAct!==0||g.over)return;this.pendRec=this.recFor();this.act(0,a)},380);return true}
  preRow(){const g=this.g,me=g.players[0];if(!me.inHand||me.folded||me.allIn||g.over||me.out)return'';
    const tc=Math.max(0,g.currentBet-me.bet),P=this.pre;
    if(P&&(P.hand!==g.hands||P.street!==g.street||(P.k==='call'&&P.v!==tc)||(P.k==='check'&&tc>0)||(P.k==='fold'&&tc===0)))this.pre=null;
    const opts=tc>0?[['fold','Desistir'],['call','Pagar '+nf(Math.min(tc,me.stack))],['any','Pagar qualquer']]:[['cf','Check/Desistir'],['check','Check'],['any','Pagar qualquer']];
    return`<div class="prea">${opts.map(([k,l])=>`<button class="sm${this.pre&&this.pre.k===k?' on':''}" data-pre="${k}">${this.pre&&this.pre.k===k?'☑':'☐'} ${l}</button>`).join('')}</div>`}
  botTime(j,d,e,need){const g=this.g,p=g.players[j],B=LIVES.bio(p.name)||{},tr=B.trait||'',st=LIVES.state(p.name),tg=new Set((st?st.tags:[]).map(x=>x[0]));
    const pre=g.street==='preflop',toCall=Math.max(0,g.currentBet-p.bet),R=(a,b)=>a+Math.random()*(b-a);
    const allin=(d.type==='raise'&&d.to>=p.stack+p.bet)||(d.type==='call'&&toCall>=p.stack),close=(need!=null&&e!=null)?Math.abs(e-need):.3,big=toCall/Math.max(1,p.stack+p.bet);
    let t;
    if(pre){if(d.type==='fold')t=(toCall>g.bb*2&&close<.08)?R(4,12):R(.8,3);
      else if(d.type==='check')t=R(.8,2.5);
      else if(d.type==='call')t=toCall>=p.stack*.3?R(8,26):g.pfRaises>=2?R(5,14):R(2,7);
      else t=allin?R(6,20):g.pfRaises>=1?R(4,12):R(1.5,5)}
    else{if(d.type==='check')t=(e!=null&&e<.3)?R(.8,2.5):R(2.5,8);
      else if(d.type==='fold')t=(close<.08||big>.3)?R(8,25):R(1.5,5);
      else if(d.type==='call')t=close<.06?R(10,28):(e!=null&&e>.7)?R(3,9):R(1.5,6);
      else{const strong=e!=null&&e>.7;t=toCall>0?(strong?R(5,14):R(9,24)):(strong?R(2.5,8):R(4,12));if(allin)t+=R(3,10)}
      if(g.street==='river')t*=1.25}
    const slow={'calculista':1.4,'frio':1.2,'fria':1.2,'paciente':1.3,'conservador':1.2,'supersticioso':1.1}[tr]||(['impulsivo','cabeça quente','desesperado'].includes(tr)?.6:1);
    t*=slow*(tg.has('tilt')?.6:1)*(tg.has('cans')?.9:1);
    if(['frio','fria','calculista'].includes(tr))t=t*.5+R(4,7)*.5;
    if(['confiante','calculista','frio','fria'].includes(tr)&&e!=null&&e>.8&&Math.random()<.35){if(d.type==='raise')t=R(15,35);else if(d.type==='call')t=R(.8,2)}
    return Math.max(.7,t)}
  botPlay(j,tok){const g=this.g,p=g.players[j];
    if(this.watch||this.fwd){this.timer=setTimeout(()=>{if(tok!==this.tok)return;const d=this.decide(j,STY[p.style]);this.act(j,d.type,d.to)},this.watch?this.delay():260);return}
    const B=LIVES.bio(p.name)||{},tr=B.trait||'',st=LIVES.state(p.name),tg=new Set((st?st.tags:[]).map(x=>x[0]));
    this._tq=1;let d=this.decide(j,STY[p.style]);this._tq=null;const e=this._e,need=this._need;
    let want=this.botTime(j,d,e,need);
    const m=this.$('oClock').value,on=m!=='off'&&!!this.CLK[m],base=on?this.CLK[m][g.street==='preflop'?0:1]:90,tb=this.tbBot(p.name);
    let cards=0,rush=false,secs=want;
    if(on&&want>base){const big=(Math.max(0,g.currentBet-p.bet)>=p.stack*.25)||g.street==='river'||want>base+5;
      cards=big&&!tg.has('tilt')?Math.min(tb.n,Math.ceil((want-base)/30)):0;tb.n-=cards;const budget=base+cards*30;if(want>budget){secs=budget-.4-Math.random()*.8;rush=true}}
    else if(!on)secs=Math.min(want,90);
    let q=1;if(['calculista','frio','fria','paciente'].includes(tr))q+=.08;if(tg.has('tilt'))q-=.15;if(tg.has('cans'))q-=.1;if(rush)q-=.3;
    if(q<.95){this._tq=Math.max(.35,q);d=this.decide(j,STY[p.style]);this._tq=null}
    secs=Math.max(.7,secs);
    const doAct=()=>{clearInterval(this._bti);const c=this.botClk;this.botClk=null;this._pendAct=null;if(tok!==this.tok)return;
      if(c&&c.used<cards){const k=cards-c.used;if(k>0)this.log(`<span class="muted">⏱ ${p.name} usou ${k>1?k+' cartões':'um cartão'} de tempo.</span>`)}
      if(secs>=15&&d.type!=='fold'&&d.type!=='check')this.log(`<span class="muted">🤔 ${p.name} pensou ${Math.round(secs)}s antes de ${d.type==='raise'?(d.to>=p.stack+p.bet?'ir all-in':'aumentar'):'pagar'}.</span>`);
      else if(rush)this.log(`<span class="muted">⏰ ${p.name} decidiu no último segundo.</span>`);
      const ht=g.hTell;if(ht&&ht.hand===g.hands&&ht.secs>=12&&(d.type==='call'||d.type==='raise')&&LIVES.on()&&Math.random()<.25){const t=(typeof TELL!=='undefined'&&TELL.say(this,p.name))||['Pensou bastante, hein.'];this.chatMsg(p.name,t[Math.random()*t.length|0],'talk')}
      this.act(j,d.type,d.to)};
    this.botClk={j,base:on?base:0,t0:Date.now(),used:0,cards};this._pendAct=doAct;
    const tick=()=>{const c=this.botClk;if(!c){clearInterval(this._bti);return}const el=(Date.now()-c.t0)/1000;
      if(c.base){while(c.used<c.cards&&el>c.base+c.used*30){c.used++;p.last='⏱ cartão de tempo';this.log(`<span class="muted">⏱ ${p.name} usou um cartão de tempo (+30s).</span>`);this.renderTable();this.renderLog()}}
      if(el>=6&&p.last!=='🤔 pensando…'&&p.last!=='⏱ cartão de tempo'){p.last='🤔 pensando…';this.renderTable()}
      const b=this.root.querySelector('[data-bt]');if(b)b.textContent='⏱ '+(c.base?Math.max(0,Math.ceil(c.base+c.used*30-el)):Math.floor(el));};
    this.renderTable();clearInterval(this._bti);this._bti=setInterval(tick,250);
    this.timer=setTimeout(()=>{const c=this.botClk;if(c)c.used=cards;doAct()},secs*1000)}
  /* ===== conversas com IA ===== */
  aiOn(){const c=this.$('oAI');return AIX.ready()&&(!c||c.checked)}
  aiCtx(){const g=this.g,D=this.dealerObj(),me=CIRC.me(),seat=g.players.filter(p=>!p.human&&!p.out&&!p.empty);
    const bots=seat.map(p=>{const B=LIVES.bio(p.name)||{},st=LIVES.state(p.name),b=LIVES.s.bots[p.name]||{},r=LIVES.rel(p.name,'Você');
      return`- ${p.name}: ${B.age||'?'} anos, ${B.job||''}; ${B.fam||''}; temperamento ${B.trait||'?'}; estilo de jogo ${(STY[p.style]||{}).nm||p.style}; fichas ${nf(p.stack)}${p.folded?', já desistiu desta mão':p.inHand?', está na mão':''}; estado: ${st&&st.tags.length?st.tags.map(x=>x[2]).join(', '):'normal'}; dinheiro fora da mesa R$ ${nf(Math.round(b.bank||0))}; ${(()=>{try{const r=PUB.rankOf(p.name);return r?`${r.pos}º no ranking`:''}catch(e){return''}})()}; com ${me}: ${r>=2?'simpatiza':r<=-2?'tem rixa':'neutro'}${(b.diary||[]).length?'; lembranças: '+b.diary.slice(0,3).map(x=>x.t).join(' / '):''}`}).join('\n');
    const hand=g.over?'Entre mãos.':`Mão em andamento: ${g.street||'pré-flop'}, mesa ${g.board.length?fmtCards(g.board):'(sem cartas)'}, pote ${nf(this.pot())}.`;
    const log=g.log.slice(-6).map(x=>x.replace(/<[^>]+>/g,'')).join(' | '),chat=(this.msgs||[]).slice(-10).map(m=>`${m.from==='Você'?me:m.from}: ${m.text}`).join('\n');
    return`Jogo: ${this.mode==='tour'?(g.mtt?'torneio multimesas':'torneio'):'cash game'}, blinds ${nf(g.sb)}/${nf(g.bb)}, mão nº ${g.hands}. ${hand}
Últimos acontecimentos: ${log}
Dealer: ${D.name}, ${D.age} anos, ${D.tipo}. ${D.story}
Jogadores (bots):
${bots}
${me} (o humano) tem ${nf(g.players[0].stack)} fichas.
${(()=>{try{return PUB.table(g,this)}catch(e){return''}})()}
O que todo mundo do circuito sabe sobre ${me} (os bots leem o jornal, o ranking e as redes; use quando fizer sentido, sem despejar tudo):
${(()=>{try{return PUB.me()}catch(e){return''}})()}
Conversa recente:
${chat||'(ninguém falou ainda)'}`}
  aiRules(){const me=CIRC.me();return`Você dá voz aos personagens de uma mesa de poker Texas Hold'em de um app de treino (dinheiro fictício). O jogador humano se chama ${me}. Escreva como gente de verdade numa mesa de poker no Brasil: português brasileiro coloquial, frases curtas (até 25 palavras), com a personalidade, a vida, o humor e a memória de cada um. Os personagens conhecem ${me}: sabem a posição dele no ranking, os títulos, a fama, o dinheiro, os patrocinadores, as postagens e as fofocas, e reagem a isso (admiração, inveja, provocação, pedido de foto). Ninguém sabe as cartas fechadas dos outros e você também não sabe: um personagem pode blefar, provocar ou desconversar sobre a própria mão, mas nunca diga cartas exatas. O dealer é profissional: não dá dica de jogada e só fala quando falam com ele ou sobre o andamento da mesa. Provocação leve é ok, nada ofensivo de verdade. ${SARC} No máximo um emoji. Use só nomes da lista.`}
  async aiChat(text,to){const g=this.g,me=CIRC.me(),D=this.dealerObj();
    const prompt=`${this.aiRules()}

${this.aiCtx()}

${me} acabou de dizer: "${text.replace(/"/g,"'")}"${to?` (falando com ${to})`:' (falando com a mesa toda, sem chamar ninguém: responda quem da mesa tiver algo a dizer, pode ser um só)'}.
Responda com 1 ou 2 falas (3 só se virar discussão). Quem foi chamado responde primeiro.
Responda só com JSON: {"replies":[{"from":"Nome","text":"..."}],"effects":[{"name":"Nome","rel":0,"mood":0,"tilt":0}]}
Em effects, diga como a fala de ${me} mexeu com cada bot afetado: rel de -2 a 2 (simpatia por ${me}), mood de -1 a 1, tilt 1 se ficou irritado a ponto de jogar pior.`;
    const tgt=to||(this.chat&&this.chat.from);if(tgt&&tgt!==D.name){this.bub=this.bub||{};this.bub[tgt]={t:'…',kind:'talk',until:Date.now()+15000};this.renderTable()}
    const v=await AIX.ask(prompt);if(this.g!==g)return;
    if(tgt&&this.bub&&this.bub[tgt]&&this.bub[tgt].t==='…')delete this.bub[tgt];
    const names=new Set(g.players.filter(p=>!p.human).map(p=>p.name));
    const rs=v&&Array.isArray(v.replies)?v.replies.filter(r=>r&&r.text&&(names.has(r.from)||r.from===D.name)).slice(0,3):[];
    if(!rs.length){const n=tgt&&names.has(tgt)?tgt:[...names][0];if(n)this.chatMsg(n,LIVES.hear(n,LIVES.intent(text)),'re');return}
    (v.effects||[]).forEach(e=>{if(!e||!names.has(e.name))return;const b=LIVES.s.bots[e.name];if(!b)return;
      if(e.rel)LIVES.relAdd(e.name,'Você',Math.max(-2,Math.min(2,+e.rel||0)));if(e.mood)b.mood=Math.max(-3,Math.min(3,b.mood+Math.max(-1,Math.min(1,+e.mood||0))));
      if(e.tilt>0){b.tilt=Math.min(3,b.tilt+1);LIVES.note(e.name,`Ficou irritado com o que ${me} falou na mesa.`)}});LIVES.commit();
    rs.forEach((r,k)=>setTimeout(()=>{if(this.g!==g)return;const t=String(r.text).slice(0,220).replace(/[<>]/g,'');if(r.from===D.name)this.dealerSay(t);else this.chatMsg(r.from,t,'re')},k*1600))}
  async aiBanter(){const g=this.g;if(!g||!this.aiOn()||!AIX.used)return;const me=CIRC.me();
    const prompt=`${this.aiRules()}

${this.aiCtx()}

A mesa está entre uma mão e outra. Gere de 1 a 3 falas curtas e naturais entre os bots (e talvez o dealer): papo da vida deles, provocação entre rivais, comentário da última mão. Não precisam falar com ${me}, mas podem.
Responda só com JSON: {"replies":[{"from":"Nome","text":"..."}]}`;
    const v=await AIX.ask(prompt);if(this.g!==g||!v||!Array.isArray(v.replies))return;const D=this.dealerObj(),names=new Set(g.players.filter(p=>!p.human).map(p=>p.name));
    v.replies.filter(r=>r&&r.text&&(names.has(r.from)||r.from===D.name)).slice(0,3).forEach((r,k)=>setTimeout(()=>{if(this.g!==g)return;const t=String(r.text).slice(0,220).replace(/[<>]/g,'');if(r.from===D.name)this.dealerSay(t,true);else this.chatMsg(r.from,t,'talk')},k*1800))}
  homeSeats(){const g=this.g,buy=g.startStack*LIVES.CHIP;
    g.players.forEach(p=>{if(p.human||p.out)return;const b=LIVES.s.bots[p.name],r=p.stack/g.startStack,host=g.home.host===p.name;let leave=false,why='';
      if(p.stack===0){if(b&&b.bank>=buy&&Math.random()<(LIVES.rel(p.name,'Você')<=-1?.85:.6)){p.stack=g.startStack;this.log(`<span class="muted">💸 ${p.name} recomprou ${nf(g.startStack)} fichas.</span>`);return}leave=!host;why='quebrou e foi pra casa'}
      else if(!host&&r>=2&&Math.random()<.08){leave=true;why=`foi embora no lucro com ${nf(p.stack)} fichas`}
      else if(!host&&Math.random()<.008){leave=true;why=`precisou ir embora com ${nf(p.stack)} fichas`}
      if(host&&p.stack===0){p.stack=g.startStack;this.log(`<span class="muted">💸 ${p.name}, o dono da casa, recomprou.</span>`);return}
      if(leave){p.out=true;p.empty=true;p.inHand=false;this.log(`<span class="muted">🚪 ${p.name} ${why}.</span>`)}})}
  tname(){const g=this.g;return g&&g.ev?g.ev.nm:g&&g.mtt?`Torneio Multimesas R$ ${nf(g.mtt.buyin)}`:'Sit & Go da Escola'}
  startEvent(ev,reg){const E=ev.E,x=STRUCTS[E.st],keys=Object.keys(STY);this.lastMsg='';this.stop();
    if(reg.staked)this.stakedNow=E.buy;this.paidNow=reg.paid||0;try{LIFE.onStart('tour',E.fmt==='mtt')}catch(e){}
    const base={stack:x.stack,hpl:E.hpl,sb:x.levels[0][0],bb:x.levels[0][1],levels:x.levels,anteType:x.anteType,structNm:x.nm,ev:{key:ev.key,nm:E.nm,idx:0,stops:E.stops||[],days:E.days||1,sat:E.sat?E.buy:0,buy:E.buy}};
    const all=LIVES.ALL().filter(n=>LIVES.bio(n)&&LIVES.s.bots[n]),rich=all.filter(n=>LIVES.s.bots[n].bank>=E.buy*.8).sort(()=>Math.random()-.5),poor=all.filter(n=>!rich.includes(n)).sort(()=>Math.random()-.5),pool=[...rich,...poor].slice(0,E.N-1).sort(()=>Math.random()-.5);fieldFill(pool,E);
    if(E.fmt==='mtt'){const N=E.N,seat=pool.slice(0,8),others=pool.slice(8),tables=[];for(let k=0;k<others.length;k+=9)tables.push({id:tables.length+2,btn:Math.random()*9|0,ps:others.slice(k,k+9).map(n=>({name:n,style:LIVES.styleOf(n)||keys[Math.random()*keys.length|0],stack:x.stack}))});
      this.startGame(Object.assign(base,{bots:8,field:N,buyin:E.buy,mtt:{seat,state:{N,buyin:E.buy,pays:E.pays||CIRC.pays(N),tables,busted:[],news:[],bubble:false,itm:false,final:false}}}))}
    else this.startGame(Object.assign(base,{bots:E.N-1,names:pool}));
    this.log(`<div class="lh lvl">${E.emo} ${E.nm} · buy-in R$ ${brl(E.buy)}${E.days?` · Dia 1 de ${E.days}`:''}</div>`)}
  rakeCut(amt){const g=this.g,H=g&&g.home;if(!H||!H.rake||g.board.length<3||amt<=0)return 0;const r=Math.min(Math.round(amt*H.rake.pct),H.rake.cap*g.bb);if(r<=0)return 0;
    H.earn=(H.earn||0)+r;if(H.host&&LIVES.s.bots[H.host])LIVES.s.bots[H.host].bank+=r*LIVES.CHIP;this.log(`<span class="muted">🏠 Rake ${H.host?`do ${H.host}`:'da sua casa'}: ${nf(r)}</span>`);return r}
  cashSeats(){const g=this.g;if(g.home){this.homeSeats();return}if(!LIVES.on()||g.hands<1)return;const seated=new Set(g.players.map(p=>p.name)),buy=g.startStack*LIVES.CHIP;
    g.players.forEach((p,k)=>{if(p.human)return;const s=LIVES.state(p.name),tg=new Set((s?s.tags:[]).map(x=>x[0])),r=p.stack/g.startStack,b=LIVES.s.bots[p.name];let q=.015,why='levantou da mesa';
      if(p.stack===0){q=b&&b.bank<buy?1:.3;why='quebrou e foi embora'}
      else if(r>=1.8){q=.12+(tg.has('press')?.25:0);why='bateu a meta e levantou'}
      else if(r>=1.3&&tg.has('press')){q=.2;why='garantiu o dinheiro das contas e foi embora'}
      else if(r<=.45&&tg.has('tilt')){q=.1;why='saiu irritado'}
      else if(tg.has('cans')){q=.06;why='foi dormir'}
      if(Math.random()>=q)return;
      const nn=LIVES.ALL().filter(n=>!seated.has(n)&&LIVES.bio(n)&&LIVES.s.bots[n]&&LIVES.s.bots[n].bank>=buy).sort(()=>Math.random()-.5)[0];if(!nn)return;
      this.log(`<span class="muted">🚪 ${p.name} ${why}${p.stack?` com ${nf(p.stack)} fichas`:''}.</span>`);
      if(p.stack>0&&r>=1.3&&LIVES.bio(p.name))LIVES.note(p.name,`Saiu do cash no lucro (+R$ ${brl((p.stack-g.startStack)*LIVES.CHIP)}).`);
      seated.delete(p.name);seated.add(nn);
      g.players[k]={name:nn,style:LIVES.styleOf(nn)||'bal',stack:g.startStack,hole:[],bet:0,total:0,folded:false,allIn:false,inHand:false,out:false,last:'chegou',gear:'n',gearLeft:0,st:{hands:0,vpip:0,pfr:0,agg:0,calls:0,fbet:0,facedBet:0}};
      this.log(`<span class="gold">🪑 ${nn} sentou com ${nf(g.startStack)} fichas.</span>`);
      if(Math.random()<.4){const t=LIVES.talk(nn);if(t)this.chatMsg(nn,t,'talk')}})}
  cashOut(){const g=this.g;if(!g||this.mode!=='cash')return;const me=g.players[0],v=me.stack*LIVES.CHIP,res=v-(g.cashIn||0);
    this.stop();try{LIFE.onCash(res,g.cashIn||0)}catch(e){}try{if(g.home)HG.end(g,res)}catch(e){}try{SCOUT.judge(this,{net:res,stack:g.cashIn||1})}catch(e){}if(v>0)WALLET.add(v,`Saiu do cash: ${stakeOf(g).nm} (sessão ${res>=0?'+':'−'}R$ ${brl(Math.abs(res))})`);
    else WALLET.add(0,`Saiu do cash sem fichas (sessão −R$ ${brl(Math.abs(res))})`);
    this.lastMsg=`${this.lastHomeMsg?this.lastHomeMsg+'<br>':''}🚪 Você saiu da mesa com <b>R$ ${brl(v)}</b>. Resultado da sessão: <b class="${res>=0?'ok':'bad'}">${res>=0?'+':'−'}R$ ${brl(Math.abs(res))}</b> em ${g.hands} mãos.${g.home&&!g.home.host&&g.home.earn?` Rake da casa: <b class="ok">+R$ ${brl(g.home.earn*LIVES.CHIP)}</b>.`:''}`;this.lastHomeMsg='';
    SAVES.del('cash');this.g=null;this.leaveAfter=false;this.watch=false;this.resetUI();this.render()}
  cashSaveOut(){const sv=SAVES.data.cash;if(!sv||!sv.players||!sv.players[0])return;const st=sv.players[0].stack||0;
    if(st>0)WALLET.add(st*LIVES.CHIP,`Saiu do cash com ${nf(st)} fichas (partida salva encerrada)`);SAVES.del('cash')}
  tourLife(p){if(p.human||!LIVES.on())return;const m=this.g.mtt;if(m)LIVES.tourEnd(p.name,p.place,m.N,m.buyin,m.pays);else LIVES.tourEnd(p.name,p.place,this.N,this.sngBuy(),null,false,this.rkTag())}
  mttNews(t){const m=this.g.mtt;m.news.unshift(t);if(m.news.length>12)m.news.length=12}
  mttBust(p,place,mesa){const m=this.g.mtt;p.place=place;m.busted.push({name:p.name,place,mesa,hand:this.g.hands});
    if(LIVES.bio(p.name)&&LIVES.on())LIVES.tourEnd(p.name,place,m.N,m.buyin,m.pays);
    const pr=this.prizeOf(place);this.mttNews(`${p.name} caiu na Mesa ${mesa} em ${place}º${pr?` (R$ ${nf(pr)})`:''}.`);
    if(mesa!==1)this.log(`<span class="muted">✖ Mesa ${mesa}: ${p.name} eliminado em ${place}º${pr?` · leva R$ ${nf(pr)}`:''}</span>`)}
  mttCheck(){const m=this.g.mtt;if(!m)return;const A=this.aliveAll(),P=m.pays.length;
    if(A===P+1&&!m.bubble){m.bubble=true;this.log(`<div class="lh lvl">💥 BOLHA! Restam ${A}. O próximo eliminado sai sem nada; os ${P} seguintes estão no dinheiro.</div>`)}
    if(A<=P&&!m.itm){m.itm=true;const bb=m.busted.find(x=>x.place===P+1);this.log(`<div class="lh lvl">💰 ${bb?bb.name+' estourou a bolha. ':''}Todos os ${A} restantes estão no dinheiro!</div>`)}}
  /* simula uma mão numa mesa que você não vê */
  simHand(t){const g=this.g,ps=t.ps,n=ps.length;if(n<2)return;
    const bb=g.bb,sb=g.sb,an=g.ante||0,pot={v:0},put=(p,x)=>{x=Math.max(0,Math.min(Math.round(x),p.stack));p.stack-=x;pot.v+=x;return x};
    t.btn=(t.btn+1)%n;const sbP=ps[(t.btn+1)%n],bbP=ps[(t.btn+2)%n];
    if(an){if(g.anteType==='bb')put(bbP,an);else ps.forEach(p=>put(p,an))}
    put(sbP,sb);put(bbP,bb);
    const agg=p=>{const s=LIVES.mods(p.name,Object.assign({},STY[p.style]||STY.bal));return .3+s.A+s.W*.3+s.B*.3},pickW=(arr,w)=>{const tot=arr.reduce((a,p)=>a+w(p),0);let r=Math.random()*tot;for(const p of arr){r-=w(p);if(r<=0)return p}return arr[arr.length-1]};
    /* calibrado para eliminar no mesmo ritmo da sua mesa (bots de verdade): ~1 queda a cada 9-10 mãos por mesa no começo */
    const live=ps.filter(p=>p.stack>0),short=live.filter(p=>p.stack/bb<15),hu=n<=3?1.6:n<=5?1.25:1;let win;
    const hot=p=>{const t=(LIVES.state(p.name)||{tags:[]}).tags;return t.some(x=>x[0]==='tilt'||x[0]==='press')?.12:0};
    if(short.length&&Math.random()<.42){const sh=short[Math.random()*short.length|0],others=live.filter(p=>p!==sh);
      if(!others.length)win=sh;else if(Math.random()<.5+hot(sh)){const c=pickW(others,p=>p.stack+1);const x=Math.min(sh.stack,c.stack);put(sh,x);put(c,x);win=Math.random()<.42?sh:c}else win=sh}
    else if(Math.random()<(.3+hot({name:''}))*hu){const a=pickW(live,p=>agg(p)+hot(p)),rest=live.filter(p=>p!==a);
      if(!rest.length)win=a;else{const b=pickW(rest,p=>agg(p)*.6+.4),x=Math.min(a.stack,b.stack)*(Math.random()<.6?1:.2+Math.random()*.5);put(a,x);put(b,x);win=Math.random()<.5+(agg(b)-agg(a))*.08-hot(a)*.5?a:b}}
    else{const a=live.length?pickW(live,agg):sbP;put(a,bb*2.5);const rest=live.filter(p=>p!==a);
      if(rest.length&&Math.random()<.55){const b=rest[Math.random()*rest.length|0];put(b,bb*(2.5+Math.random()*3));win=Math.random()<.55?a:b}else win=a}
    win.stack+=pot.v;t.lastWin=win.name}
  mttSeatHere(p,from){const g=this.g,k=g.players.findIndex((q,k)=>k>0&&q.out);if(k<0)return false;
    g.players[k]={name:p.name,style:STY[p.style]?p.style:'bal',stack:p.stack,hole:[],bet:0,total:0,folded:false,allIn:false,inHand:false,out:false,last:'',gear:'n',gearLeft:0,st:{hands:0,vpip:0,pfr:0,agg:0,calls:0,fbet:0,facedBet:0}};
    this.log(`<span class="gold">➡ ${p.name} chegou da Mesa ${from} com ${nf(p.stack)} fichas.</span>`);return true}
  mttSeat(p,from){const m=this.g.mtt,cands=[{id:1,n:this.aliveHere()},...m.tables.map(t=>({id:t.id,n:t.ps.length,t}))].filter(x=>x.n<9).sort((a,b)=>a.n-b.n);
    const d=cands[0];if(!d)return;if(d.id===1){if(!this.mttSeatHere(p,from))m.tables[0].ps.push(p)}else d.t.ps.push(p)}
  mttBalance(){const g=this.g,m=g.mtt;if(!m||g.players[0].out)return;
    m.tables=m.tables.filter(t=>t.ps.length>0);
    const A=this.aliveAll(),need=Math.ceil(A/9);
    while(1+m.tables.length>need){const t=m.tables.pop();this.log(`<span class="muted">Mesa ${t.id} foi desfeita: ${t.ps.length} jogador${t.ps.length>1?'es':''} redistribuído${t.ps.length>1?'s':''}.</span>`);t.ps.forEach(p=>this.mttSeat(p,t.id))}
    if(!m.tables.length&&!m.final){m.final=true;this.log(`<div class="lh lvl">🏁 MESA FINAL! Restam ${A} jogadores.</div>`)}
    for(let guard=0;guard<40;guard++){
      const cs=[{id:1,n:this.aliveHere()},...m.tables.map(t=>({id:t.id,n:t.ps.length,t}))].sort((a,b)=>b.n-a.n),big=cs[0],small=cs[cs.length-1];
      if(cs.length<2||big.n-small.n<=1)break;let p;
      if(big.id===1){const ks=g.players.map((q,k)=>k).filter(k=>k>0&&!g.players[k].out&&g.players[k].stack>0);const k=ks[Math.random()*ks.length|0],q=g.players[k];
        p={name:q.name,style:q.style,stack:q.stack};g.players[k]={name:q.name,out:true,empty:true,stack:0,place:null,hole:[],bet:0,total:0,inHand:false,st:q.st};
        this.log(`<span class="muted">⬅ ${q.name} foi transferido para a Mesa ${small.id} (balanceamento).</span>`)}
      else p=big.t.ps.splice(Math.random()*big.t.ps.length|0,1)[0];
      if(small.id===1){if(!this.mttSeatHere(p,big.id))break}else small.t.ps.push(p)}}
  mttTick(){const g=this.g,m=g.mtt;if(!m||g.finished||g.players[0].out)return;
    m.tables.forEach(t=>{const before=new Map(t.ps.map(p=>[p,p.stack]));this.simHand(t);
      const bust=t.ps.filter(p=>p.stack<=0).sort((a,b)=>before.get(a)-before.get(b));
      bust.forEach(p=>{if(t.lastWin&&LIVES.on()&&LIVES.bio(p.name)){LIVES.relAdd(p.name,t.lastWin,-2);LIVES.note(p.name,`Foi eliminado por ${t.lastWin}. Não vai esquecer.`)}const place=this.aliveAll();t.ps.splice(t.ps.indexOf(p),1);this.mttBust(p,place,t.id);this.mttCheck()})});
    this.mttBalance();this.mttCheck()}
  /* você caiu: simula o resto do torneio até o campeão */
  mttFinish(){const g=this.g,m=g.mtt;if(!m||g.finished)return;
    let pool=[...g.players.filter(p=>!p.out&&p.stack>0).map(p=>({name:p.name,style:p.style,stack:p.stack,mesa:1})),...m.tables.flatMap(t=>t.ps.map(p=>Object.assign(p,{mesa:t.id})))];
    g.players.forEach(p=>{if(!p.out&&p.stack>0){p.out=true;p.empty=true}});m.tables=[];
    let hands=g.hands,lvl=g.level;
    for(let it=0;it<5000&&pool.length>1;it++){hands++;if(g.hpl&&hands%g.hpl===0&&lvl<g.levels.length-1){lvl++;[g.sb,g.bb,g.ante]=g.levels[lvl]}
      const nt=Math.ceil(pool.length/9),tbls=Array.from({length:nt},()=>({ps:[],btn:Math.random()*9|0}));pool.sort(()=>Math.random()-.5).forEach((p,k)=>tbls[k%nt].ps.push(p));
      for(const t of tbls){const before=new Map(t.ps.map(p=>[p,p.stack]));this.simHand(t);
        t.ps.filter(p=>p.stack<=0).sort((a,b)=>before.get(a)-before.get(b)).forEach(p=>{const place=pool.length;pool.splice(pool.indexOf(p),1);this.mttBust(p,place,p.mesa||1)})}}
    g.level=lvl;g.hands=hands;[g.sb,g.bb,g.ante]=g.levels[lvl];
    const w=pool[0];if(w){m.busted.push({name:w.name,place:1,mesa:w.mesa||1,hand:hands});if(LIVES.bio(w.name)&&LIVES.on())LIVES.tourEnd(w.name,1,m.N,m.buyin,m.pays)}
    g.finished=true;g.over=true;g.msg=`🏆 <b>${w?w.name:'?'} venceu o torneio</b> e levou R$ ${nf(this.prizeOf(1))}.`;this.log(`<span class="gold">${g.msg}</span>`);
    this.postResult();SAVES.del(this.mode);this.render()}
  learn(){const c=this.$('oLearn');return !!(c&&c.checked)}
  adapt(i,S){
    const g=this.g,p=g.players[i],me=g.players[0];let X=Object.assign({},S);X=LIVES.mods(p.name,X);
    X=this.tellAdj(i,X);
    if(LIVES.on()){const foes=g.players.filter((q,k)=>k!==i&&live(q)&&LIVES.rel(p.name,q.human?'Você':q.name)<=-2);if(foes.length){X.A=Math.min(1,X.A+.1);X.B*=1.3;X.M-=.03}}
    if(g.mtt){const A=this.aliveAll(),P=g.mtt.pays.length;if(A>P&&A<=P+3){const tot=g.players.reduce((s,q)=>s+(q.out?0:q.stack+q.total),0)+g.mtt.tables.reduce((s,t)=>s+t.ps.reduce((a,q)=>a+q.stack,0),0),avg=tot/A,mine=p.stack+p.total;
      if(mine<avg*.75&&mine/g.bb>8){X.W*=.75;X.M+=.05;X.B*=.6}else if(mine>avg*1.4){X.W*=1.2;X.B*=1.4;X.A=Math.min(1,X.A+.08)}}}if(!this.learn())return X;
    if(p.gear==='a'){X.W*=1.25;X.A=Math.min(1,X.A+.12);X.B*=1.6}else if(p.gear==='t'){X.W*=.8;X.B*=.5}
    X.R=this.read&&this.read.reads?this.read:null;X.vsMe=!!(X.R&&me.inHand&&!me.folded&&!me.out);
    if(X.vsMe&&X.R.station)X.B*=.3;
    return X}
  tellAdj(i,X){const g=this.g,ht=g.hTell,me=g.players[0],B=LIVES.bio(g.players[i].name)||{};if(!ht||ht.hand!==g.hands||!me.inHand||me.folded)return X;
    if(!(ht.type==='raise'&&me.bet>=g.currentBet&&me.bet>0))return X;const sharp=(['calculista','frio','fria','paciente','confiante'].includes(B.trait)?1:.5)*(typeof LIFE!=='undefined'&&LIFE.has('oculos')?.5:1);
    if(ht.secs>=12){X.M-=.04*sharp;X.B*=1+.2*sharp}else if(ht.secs<=2.5&&ht.street!=='preflop'){X.M+=.04*sharp;X.B*=1-.3*sharp}return X}
  /* conversa: balão na mesa + folha de conversa */
  chatMsg(from,text,kind){if(!text)return;this.msgs=this.msgs||[];this.msgs.push({from,text,kind});if(this.msgs.length>60)this.msgs.shift();
    if(from!=='Você'){this.bub=this.bub||{};this.bub[from]={t:text,kind,until:Date.now()+(kind==='ask'?9000:4500)};if(!this.chatOpen)this.unread=(this.unread||0)+1;
      clearTimeout(this._bt);this._bt=setTimeout(()=>this.renderTable(),kind==='ask'?9100:4600)}
    this.renderTable();this.renderChat()}
  botAsk(n,text){if(!text)return;this.chat={from:n,text};this.chatMsg(n,text,'ask')}
  renderChat(){const btn=this.$('cOpen'),el=this.$('chat');if(!btn)return;const _pi=this.$('chIn'),_pv=_pi?_pi.value:'',_pf=!!_pi&&document.activeElement===_pi,_ps=_pi?_pi.selectionStart:0;const g=this.g,on=g&&LIVES.on()&&!g.finished;
    btn.style.display=on?'':'none';btn.classList.toggle('hot',!!this.chat);btn.innerHTML=`💬${this.unread&&!this.chatOpen?`<b>${this.unread>9?'9+':this.unread}</b>`:''}`;
    btn.onclick=()=>{this.chatOpen=true;this.unread=0;this.renderChat()};
    if(!on||!this.chatOpen){el.innerHTML='';return}
    const c=this.chat,P=a=>a[Math.random()*a.length|0],M=(this.msgs||[]).slice(-40);
    const q=c?[['nice','🙂 Gentil'],['prov','😏 Provocar'],['ign','🤐 Ignorar']]:[['t:Boa mão.','👏 Boa mão'],['t:Bem jogado.','🤝 Bem jogado'],['prov','😏 Provocar'],['t:Mesa boa hoje.','🙂 Mesa boa'],['t:Como vai a vida?','💬 Como vai?']];
    el.innerHTML=`<div class="csheet" data-r="cBack"><div class="cin"><div class="chead"><span>Conversa da mesa${this.aiOn()?' <span class="muted" style="font-size:11px;font-weight:400">· com IA</span>':''}</span><button class="sm" data-r="cClose">✕</button></div>
      <div class="cthread" data-r="cThr">${M.length?M.map(m=>`<div class="cm${m.from==='Você'?' me':''}${m.kind==='ask'?' ask':''}${m.kind==='dealer'?' dl':''}">${m.kind==='dealer'?'<small>🃏 dealer</small>':''}${m.from==='Você'?'':`<small>${typeof FACE!=='undefined'&&m.kind!=='dealer'?`<span class="cmav">${FACE.bot(m.from,22)}</span>`:''}${m.from}${m.kind==='ask'?' → você':''}</small>`}${m.from==='Você'?`<small style="color:#bfe3d4">${m.to?'para '+m.to:'para a mesa'}</small>`:''}${m.text}</div>`).join(''):'<div class="muted" style="font-size:14px">Ninguém falou nada ainda. Cite o nome de alguém para falar direto com ele.</div>'}</div>
      ${c?`<div style="font-size:13px;margin-bottom:5px" class="gold">${c.from} está falando com você:</div>`:''}
      <div class="cquick">${q.map(([k,l])=>`<button class="sm" data-c="${k}">${l}</button>`).join('')}</div>
      <div class="chin"><input data-r="chIn" maxlength="120" placeholder="${c?'Responda '+c.from+'…':'Fale com a mesa (cite um nome pra falar direto)'}"><button class="sm pri" data-r="chGo">Enviar</button></div></div></div>`;
    const th=this.$('cThr');th.scrollTop=th.scrollHeight;{const ni=this.$('chIn');if(ni&&_pv)ni.value=_pv;if(ni&&_pf){ni.focus();try{ni.setSelectionRange(_ps,_ps)}catch(e){}}}
    const close=()=>{this.chatOpen=false;this.renderChat()};
    this.$('cClose').onclick=close;this.$('cBack').onclick=e=>{if(e.target===e.currentTarget)close()};
    const go=()=>{const i=this.$('chIn'),t=i.value.trim();if(t){i.value='';this.say(t)}};
    this.$('chGo').onclick=go;this.$('chIn').onkeydown=e=>{if(e.key==='Enter')go()};
    el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const k=b.dataset.c;
      if(k==='ign'){this.chat=null;this.renderChat();return}
      if(k.startsWith('t:')){this.say(k.slice(2));return}
      this.say(k==='nice'?P(['Boa mão.','Tranquilo, faz parte.','Valeu, mesa boa hoje.','Bem jogado.']):P(['Sorte de principiante.','Tá chorando?','Vou pegar essas fichas de volta.','Só ganha no river, hein?']),k)})}
  say(text,forced){const g=this.g;if(!g)return;const seat=g.players.filter(p=>!p.human&&!p.out&&p.stack>0).map(p=>p.name);if(!seat.length)return;
    const low=text.toLowerCase();let to=seat.find(n=>low.includes(n.toLowerCase()));this.msgs=this.msgs||[];if(!to&&this.chat&&seat.includes(this.chat.from))to=this.chat.from;
    let geral=false;if(!to){geral=true;const w=seat.map(n=>[n,1+Math.abs(LIVES.rel(n,'Você'))+(LIVES.hot(n)?1:0)]),tot=w.reduce((a,x)=>a+x[1],0);let r=Math.random()*tot;to=w.find(x=>(r-=x[1])<=0)[0]}
    this.msgs=this.msgs||[];this.msgs.push({from:'Você',to:geral?null:to,text:text.replace(/[<>]/g,''),kind:'me'});this.chat=null;this.renderChat();
    const D=this.dealerObj();if(/dealer/i.test(low)||low.includes(D.name.toLowerCase()))to=D.name;
    if(this.aiOn()&&!forced){this.aiChat(text.replace(/[<>]/g,''),geral&&to!==D.name?null:to);return}
    if(to===D.name){setTimeout(()=>this.dealerSay(['Aqui eu só dou as cartas, meu caro.','Sem dica de jogada, mas boa sorte.','Pode deixar, tô de olho na mesa.'][Math.random()*3|0]),700);return}
    const it=forced||LIVES.intent(text);setTimeout(()=>{if(this.g!==g)return;const ans=LIVES.hear(to,it);this.chatMsg(to,ans,'re')},700+Math.random()*900)}
  renderRead(){const el=this.$('readp');if(!el)return;
    if(!this.learn()){el.style.display='none';return}el.style.display='';
    const R=this.read;
    if(!R||R.n<30){el.innerHTML=`<h3>O que os bots sabem sobre você</h3><p class="muted" style="margin:0">Eles ainda estão te observando: precisam de 30 mãos suas no histórico (você tem ${R?R.n:0}). Também mudam de ritmo de tempos em tempos, como gente de verdade.</p>`;return}
    el.innerHTML=`<h3>O que os bots sabem sobre você</h3><p class="muted" style="margin:0 0 6px;font-size:13px">Leitura das suas últimas ${Math.min(500,R.n)} mãos. Eles usam isso contra você e também mudam de ritmo (apertam ou aceleram) sem avisar.</p>
      ${R.reads.length?R.reads.map(t=>`<div class="tip" style="font-size:14px">${t}</div>`).join(''):'<p class="ok" style="margin:0">Nenhuma tendência forte para explorar. Eles jogam o padrão contra você.</p>'}`}
  /* ----- fluxo ----- */
  startGame(cfg){
    LIVES.tick(true);
    const keys=Object.keys(STY).sort(()=>Math.random()-.5);
    const nb=cfg.bots,names=cfg.mtt?cfg.mtt.seat:cfg.names||BOTNAMES.slice(0,nb);
    const st=()=>({hands:0,vpip:0,pfr:0,agg:0,calls:0,fbet:0,facedBet:0});
    const players=[{name:'Você',human:true},...names.map((n,k)=>({name:n,style:(cfg.styles&&cfg.styles[n])||(LIVES.on()&&LIVES.styleOf(n))||(k<keys.length?keys[k]:keys[Math.random()*keys.length|0])}))];
    players.forEach(p=>Object.assign(p,{gear:'n',gearLeft:0,stack:cfg.stack,hole:[],bet:0,total:0,folded:false,allIn:false,inHand:false,out:false,last:'',st:st()}));
    this.g={players,button:Math.random()*players.length|0,sb:cfg.sb,bb:cfg.bb,ante:0,deck:[],board:[],street:'',currentBet:0,minRaise:cfg.bb,raises:0,pfRaises:0,pfAgg:-1,
      toAct:-1,over:true,log:[],msg:'',hl:new Set(),hands:0,wins:0,buyins:1,level:0,hpl:cfg.hpl||0,startStack:cfg.stack,finished:false,levels:cfg.levels||LEVELS,anteType:cfg.anteType||'each',structNm:cfg.structNm||''};
    if(cfg.home)this.g.home=cfg.home;if(cfg.ev)this.g.ev=cfg.ev;
    if(cfg.mtt){this.g.mtt=cfg.mtt.state;this.log(`<div class="lh lvl">Torneio multimesas: ${cfg.mtt.state.N} jogadores em ${cfg.mtt.state.tables.length+1} mesas · buy-in R$ ${nf(cfg.mtt.state.buyin)} · prêmio total R$ ${nf(cfg.mtt.state.N*cfg.mtt.state.buyin)}. Você está na Mesa 1.</div>`)}
    this.g.cashIn=this.mode==='cash'?(this.paidNow||cfg.stack*LIVES.CHIP):0;this.g.paid=this.paidNow||0;this.paidNow=0;this.leaveAfter=false;
    this.chat=null;this.msgs=[];this.bub={};this.unread=0;this.chatOpen=false;this.watch=false;this.resetUI();this.sid=HIST.newSession(this.mode,cfg);if(this.stakedNow){SCOUT.mark(this.sid,this.stakedNow);this.stakedNow=0}try{SCOUT.maybe(this)}catch(e){}this.save();this.startHand()}

  startHand(){
    this.stop();const g=this.g;if(!g||g.finished)return;
    const T=this.mode==='tour',me=g.players[0];
    if(this.learn()){g.players.forEach(p=>{if(p.human)return;if(--p.gearLeft<=0){const r=Math.random();p.gear=r<.6?'n':r<.8?'a':'t';p.gearLeft=8+(Math.random()*10|0)}});this.read=readHuman()}else this.read=null;
    this.renderRead();
    if(!T&&this.leaveAfter){this.cashOut();return}
    if(!T)this.cashSeats();
    if(!T&&g.home&&!g.players.some(p=>!p.human&&!p.out)){this.lastHomeMsg='🍻 Todo mundo foi embora: fim do home game.';this.cashOut();return}
    if(!T){g.players.forEach(p=>{if(!p.human&&p.stack===0&&!p.out){p.stack=g.startStack;this.log(`<span class="muted">${p.name} recomprou ${nf(g.startStack)} fichas</span>`)}});
      if(me.stack===0){g.needRebuy=true;g.over=true;this.render();return}g.needRebuy=false}
    else{
      if(g.hands>0&&g.hands%g.hpl===0&&g.level<g.levels.length-1){g.level++;const L=g.levels[g.level];
        this.log(`<div class="lh lvl">▲ Nível ${g.level+1}: blinds ${nf(L[0])}/${nf(L[1])}${anteTxt(L[2],g.anteType)}</div>`);setTimeout(()=>this.dealerSay(this.dl('lvl',{b:nf(L[0])+'/'+nf(L[1])})),300)}
      [g.sb,g.bb,g.ante]=g.levels[g.level]}
    if(T&&g.ev&&!g.paused&&!me.out&&g.ev.idx<g.ev.days-1&&g.ev.stops[g.ev.idx]!=null&&g.level>=g.ev.stops[g.ev.idx]){g.paused=true;g.over=true;
      this.log(`<div class="lh lvl">🌙 Fim do Dia ${g.ev.idx+1}. Fichas ensacadas: ${nf(me.stack)}. Volta amanhã.</div>`);this.save();this.render();return}
    if(g.paused){this.render();return}
    this.fwd=false;this.dealerTick();
    if(g.hands>3&&g.hands%9===0&&Math.random()<.45)this.aiBanter();
    g.hands++;g.hl=new Set();g.msg='';g.board=[];g.deck=newDeck();g.street='preflop';g.raises=0;g.pfRaises=0;g.pfAgg=-1;
    g.players.forEach(p=>Object.assign(p,{hole:[],bet:0,total:0,folded:false,allIn:false,inHand:!p.out&&p.stack>0,last:'',needs:false,show:false,won:0,res:null,
      range:1,pressure:0,calledPost:0,vf:false,pf:false,startStack:p.stack}));
    g.button=this.next(g.button,p=>p.inHand);
    const n=g.players.filter(p=>p.inHand).length;
    g.sbI=n===2?g.button:this.next(g.button,p=>p.inHand);g.bbI=this.next(g.sbI,p=>p.inHand);
    this.log(`<div class="lh">Mão #${g.hands} · botão: ${g.players[g.button].name}${T?` · blinds ${nf(g.sb)}/${nf(g.bb)}${g.ante?` (ante ${nf(g.ante)})`:''}`:''}</div>`);
    if(LIVES.on()&&!this.chat){g.greeted=g.greeted||{};const foe=g.players.find(p=>!p.human&&p.inHand&&!g.greeted[p.name]&&LIVES.rel(p.name,'Você')<=-2);if(foe){g.greeted[foe.name]=1;if(Math.random()<.6)this.botAsk(foe.name,LIVES.atYou(foe.name,'grudge'))}}
    if(Math.random()<.12){const L=g.players.filter(p=>!p.human&&p.inHand);if(L.length){const q=L[Math.random()*L.length|0],t=LIVES.talk(q.name);if(t)this.chatMsg(q.name,t,'talk')}}
    if(g.ante&&g.anteType!=='bb')g.players.forEach(p=>{if(p.inHand){const a=Math.min(g.ante,p.stack);p.stack-=a;p.total+=a;if(p.stack===0)p.allIn=true}});
    const sP=g.players[g.sbI],bP=g.players[g.bbI];
    this.put(sP,g.sb);sP.last=`SB ${nf(sP.bet)}`;this.put(bP,g.bb);bP.last=`BB ${nf(bP.bet)}`;
    if(g.ante&&g.anteType==='bb'){const a=Math.min(g.ante,bP.stack);bP.stack-=a;bP.total+=a;if(bP.stack===0)bP.allIn=true}
    g.players.forEach(p=>{if(p.inHand)p.hole=[g.deck.pop(),g.deck.pop()]});
    if(me.inHand)this.log(`Suas cartas: ${fmtCards(me.hole)}`);
    this.tbRefill();
    this.cur=me.inHand?{n:g.hands,np:n,pos:this.posMap()[0],h:me.hole.map(c=>c.id).join(''),bb:g.bb,lv:g.level+1,d:[]}:null;this.pendRec=null;
    g.currentBet=g.bb;g.minRaise=g.bb;g.over=false;g.toAct=-1;
    g.players.forEach(p=>p.needs=canAct(p));
    this.render();this.timer=setTimeout(()=>this.advance(g.bbI),this.watch?150:550)}

  advance(from){
    const g=this.g;
    if(g.players.filter(live).length===1)return this.winByFold();
    const j=this.next(from,q=>canAct(q)&&(q.needs||q.bet<g.currentBet));
    if(j<0)return this.endStreet();
    g.toAct=j;this.render();
    if(g.players[j].human){if(this.preTry())return;this._hT0=Date.now();this.pendRec=null;this.coachSoon();this.clkStart();const tk=this.tok;setTimeout(()=>{if(tk===this.tok&&g.toAct===0&&!g.over&&!this.pendRec)this.pendRec=this.recFor()},80);return}
    const tok=this.tok;this.botPlay(j,tok)}

  act(i,type,to){
    const g=this.g,p=g.players[i];if(!g||g.over||g.toAct!==i)return;if(p.human){this.clkStop();g.hTell={secs:(Date.now()-(this._hT0||Date.now()))/1000,type,street:g.street,hand:g.hands}}
    const toCall=Math.max(0,g.currentBet-p.bet),pre=g.street==='preflop',facing=toCall>0;
    if(type==='check'&&toCall>0)type='call';
    if(type==='raise'&&p.bet+p.stack<=g.currentBet)type='call';
    const nb=pre?this.behind(i):0,hu=g.players.filter(q=>q.inHand).length===2,bbs=(p.stack+p.bet)/g.bb;
    if(p.human&&this.cur)this.record(type,to);
    if(type==='fold'){p.folded=true;p.last='Desiste';if(p.human&&this.$('oSkip').checked)this.fwd=true;if(!pre&&facing){p.st.fbet++;p.st.facedBet++}}
    else if(type==='check'){p.last='Check'}
    else if(type==='call'){
      const a=Math.min(toCall,p.stack);this.put(p,a);p.last=p.allIn?`All-in ${nf(p.bet)}`:`Paga ${nf(a)}`;
      if(pre){p.vf=true;
        if(g.pfRaises===0)p.range=i===g.sbI?.65:clamp(.5*this.fv(p),.2,1);
        else if(g.pfRaises===1)p.range=clamp(g.players[g.pfAgg].range*1.4*this.fv(p),.05,.6);
        else p.range=clamp(.06*this.fv(p),.03,.2)}
      else{p.calledPost++;p.st.calls++;if(facing)p.st.facedBet++}}
    else{
      const maxTo=p.bet+p.stack;to=Math.round(to);
      to=Math.min(Math.max(to,g.currentBet===0?g.bb:g.currentBet+g.minRaise),maxTo);
      const was=g.currentBet;this.put(p,to-p.bet);const inc=to-was;
      if(inc>=g.minRaise){g.minRaise=inc;g.players.forEach((q,k)=>{if(k!==i&&canAct(q))q.needs=true})}
      g.currentBet=Math.max(g.currentBet,to);g.raises++;
      if(pre){p.vf=true;p.pf=true;const f=this.ff(p);
        if(g.pfRaises===0)p.range=(p.allIn&&bbs<=15)?pushPct(nb,hu,bbs)*f:rfiPct(nb,hu)*f;
        else if(g.pfRaises===1)p.range=(p.allIn&&bbs<=25)?.12*f:.065*f;else p.range=.03;
        p.range=clamp(p.range,.02,1);g.pfRaises++;g.pfAgg=i}
      else{p.pressure++;p.st.agg++;if(facing)p.st.facedBet++}
      p.last=p.allIn?`All-in ${nf(to)}`:(was===0?`Aposta ${nf(to)}`:`Aumenta p/ ${nf(to)}`)}
    p.needs=false;this.log(`${p.human?'<b>Você</b>':p.name}: ${p.last}`);
    g.toAct=-1;this.tok++;this.render();const tok=this.tok;
    this.timer=setTimeout(()=>{if(tok===this.tok)this.advance(i)},this.watch?60:220)}

  endStreet(){
    const g=this.g;g.players.forEach(p=>p.bet=0);
    if(g.street==='river')return this.showdown();
    const d=g.deck;let nm;
    if(g.street==='preflop'){g.board.push(d.pop(),d.pop(),d.pop());g.street='flop';nm='Flop'}
    else if(g.street==='flop'){g.board.push(d.pop());g.street='turn';nm='Turn'}
    else{g.board.push(d.pop());g.street='river';nm='River'}
    this.log(`<b>${nm}</b>: ${fmtCards(g.board)}`);
    g.currentBet=0;g.minRaise=g.bb;g.raises=0;
    g.players.forEach(p=>{p.needs=canAct(p);if(canAct(p))p.last=''});
    g.toAct=-1;this.render();const tok=++this.tok;
    if(g.players.filter(canAct).length<=1){this.timer=setTimeout(()=>{if(tok===this.tok)this.endStreet()},this.watch?250:this.fwd?700:Math.max(800,this.delay()));return}
    this.timer=setTimeout(()=>{if(tok===this.tok)this.advance(g.button)},this.watch?80:this.fwd?350:450)}

  winByFold(){
    const g=this.g,w=g.players.find(live);let amt=this.pot();amt-=this.rakeCut(amt);
    w.stack+=amt;w.won=amt;w.last=`+${nf(amt)}`;if(w.human)g.wins++;
    g.msg=`${w.human?'Você leva':w.name+' leva'} o pote de ${nf(amt)} — todos desistiram.`;
    this.log(`<span class="gold">${g.msg}</span>`);this.finishHand()}

  showdown(){
    const g=this.g,lv=g.players.filter(live);
    lv.forEach(p=>{p.res=best7(p.hole.concat(g.board));p.show=true});
    this.log('Showdown: '+lv.map(p=>`${p.name} ${fmtCards(p.hole)} (${describe(p.res.score)})`).join(' · '));
    const ps=g.players.filter(p=>p.inHand),levels=[...new Set(ps.map(p=>p.total).filter(t=>t>0))].sort((a,b)=>a-b);
    let prev=0,lastW=null;const back=new Map(),N=this.N;let rk=this.rakeCut(ps.reduce((a,p)=>a+p.total,0));
    levels.forEach((L,li)=>{
      let amt=0;ps.forEach(p=>amt+=Math.max(0,Math.min(p.total,L)-prev));
      const el=ps.filter(p=>live(p)&&p.total>=L);prev=L;if(rk>0){const c=Math.min(rk,amt);amt-=c;rk-=c}if(!amt)return;
      let ws;if(!el.length)ws=lastW;else{let best=null;el.forEach(p=>{if(!best||cmp(p.res.score,best)>0)best=p.res.score});ws=el.filter(p=>cmp(p.res.score,best)===0)}
      lastW=ws;const dist=p=>{const k=(g.players.indexOf(p)-g.button+N)%N;return k===0?N:k};
      ws=[...ws].sort((a,b)=>dist(a)-dist(b));
      const share=Math.floor(amt/ws.length);let rem=amt-share*ws.length;
      ws.forEach(w=>{const x=share+(rem>0?1:0);if(rem>0)rem--;w.stack+=x;
        if(el.length===1&&li===levels.length-1&&lv.length>1)back.set(w,(back.get(w)||0)+x);else w.won+=x})});
    lv.forEach(p=>p.last=describe(p.res.score));
    const winners=lv.filter(p=>p.won>0).sort((a,b)=>b.won-a.won);
    const parts=winners.map(w=>`${w.human?'Você vence':w.name+' vence'} ${nf(w.won)} com ${describe(w.res.score).toLowerCase()}`);
    back.forEach((v,p)=>parts.push(`${nf(v)} não pagos voltam para ${p.human?'você':p.name}`));
    g.msg=(winners.length>1&&winners.every(w=>cmp(w.res.score,winners[0].res.score)===0)?'Pote dividido — ':'')+parts.join(' · ');
    if(winners[0])g.hl=new Set(winners[0].res.hand.map(c=>c.id));
    if(g.players[0].won>0)g.wins++;
    this.log(`<span class="gold">${g.msg}</span>`);this.finishHand()}

  finishHand(){
    const g=this.g;g.over=true;g.toAct=-1;this.saveHand();this.dealerAfter();
    g.players.forEach(p=>{if(p.inHand){p.st.hands++;if(p.vf)p.st.vpip++;if(p.pf)p.st.pfr++}});
    if(LIVES.on()){const bots=g.players.filter(p=>!p.human&&p.inHand);
      if(this.mode==='cash'){bots.forEach(p=>LIVES.cashHand(p.name,p.stack-p.startStack,p.startStack));LIVES.commit()}
      const bw=bots.slice().sort((a,b)=>(b.stack-b.startStack)-(a.stack-a.startStack));
      if(bw.length){const w=bw[0],l=bw[bw.length-1],say=(p,k)=>{const t=LIVES.talk(p.name,k);if(t)this.chatMsg(p.name,t,'talk')};
        if(w.stack-w.startStack>=25*g.bb&&Math.random()<.35)say(w,'win');else if(l.startStack-l.stack>=25*g.bb&&Math.random()<.3)say(l,'lose')}
      const all=g.players.filter(p=>p.inHand),top=all.slice().sort((a,b)=>(b.stack-b.startStack)-(a.stack-a.startStack))[0];
      if(top&&top.stack>top.startStack){const wn=top.human?'Você':top.name;
        all.forEach(p=>{if(p.human||p===top)return;const lost=p.startStack-p.stack;if(lost<=0)return;
          if(p.stack===0){LIVES.relAdd(p.name,wn,-2);LIVES.note(p.name,`Perdeu tudo para ${wn} numa mão. Não vai esquecer.`)}else if(lost>=p.startStack*.4)LIVES.relAdd(p.name,wn,-1);
          if(top.human&&lost>=20*g.bb&&Math.random()<.4)this.botAsk(p.name,LIVES.atYou(p.name,'lostTo'))});
        const me=g.players[0];if(!top.human&&me.inHand&&me.startStack-me.stack>=20*g.bb&&Math.random()<.35)this.botAsk(top.name,LIVES.atYou(top.name,'beat'))}
      LIVES.commit()}
    if(this.mode==='tour'){
      const busted=g.players.filter(p=>!p.out&&p.stack===0).sort((a,b)=>b.startStack-a.startStack);
      const remaining=g.players.filter(p=>!p.out&&p.stack>0);
      busted.forEach((p,k)=>{p.out=true;p.inHand=false;p.place=this.aliveOthers()+remaining.length+1+k;p.outHand=g.hands;
        if(g.mtt){const pl=p.place;g.mtt.busted.push({name:p.name,place:pl,mesa:1,hand:g.hands});const pr=this.prizeOf(pl);this.mttNews(`${p.human?'Você':p.name} caiu na Mesa 1 em ${pl}º${pr?` (R$ ${nf(pr)})`:''}.`);if(!p.human&&LIVES.bio(p.name)&&LIVES.on())LIVES.tourEnd(p.name,pl,g.mtt.N,g.mtt.buyin,g.mtt.pays)}
        else if(!p.human&&LIVES.on())LIVES.tourEnd(p.name,p.place,this.N,this.sngBuy(),null,false,this.rkTag());
        this.log(`<span class="bad">✖ ${p.human?'Você foi eliminado':p.name+' foi eliminado'} em ${p.place}º lugar</span>`)});
      const me=g.players[0];
      if(busted.includes(me))g.msg+=` <br><b class="bad">Você foi eliminado em ${me.place}º lugar.</b>${g.mtt&&this.prizeOf(me.place)?` <b class="ok">Prêmio: R$ ${nf(this.prizeOf(me.place))}</b>`:''}`;
      if(g.mtt)this.mttCheck();
      if(remaining.length+this.aliveOthers()===1){const w=remaining[0];w.place=1;g.finished=true;this.watch=false;if(g.mtt){g.mtt.busted.push({name:w.name,place:1,mesa:1,hand:g.hands});if(!w.human&&LIVES.bio(w.name)&&LIVES.on())LIVES.tourEnd(w.name,1,g.mtt.N,g.mtt.buyin,g.mtt.pays)}else if(!w.human&&LIVES.on())LIVES.tourEnd(w.name,1,this.N,this.sngBuy(),null,false,this.rkTag());
        g.msg=`🏆 <b>${w.human?'Você venceu o torneio!':w.name+' venceu o torneio!'}</b>${g.mtt?` Prêmio: R$ ${nf(this.prizeOf(1))}.`:''}`;this.log(`<span class="gold">${g.msg}</span>`);this.postResult()}
      if(busted.includes(me)||g.finished)HIST.setMeta(this.sid,{place:me.place,of:this.field(),prize:g.mtt?this.prizeOf(me.place):0,buyin:g.mtt?g.mtt.buyin:0});
      if((busted.includes(me)||g.finished)&&me.place&&!g.prizePaid){g.prizePaid=true;const sat=g.ev&&g.ev.sat,pr=sat?(me.place===2?sat:0):g.mtt?this.prizeOf(me.place):this.sngPrize(me.place);
        if(sat&&me.place===1)this.log(`<span class="gold">🎫 Você ganhou o pacote da etapa: inscrição, passagem e hotel.</span>`);
        if(pr){const mine=SCOUT.prize(this.sid,pr);WALLET.add(mine,`Prêmio: ${me.place}º lugar no ${this.tname()}${mine!==pr?` (R$ ${brl(pr)} dividido com a banca)`:''}`);this.log(`<span class="ok">💰 R$ ${brl(mine)} foram para a sua carteira${mine!==pr?' (o resto foi pra banca)':''}.</span>`)}
        try{SCOUT.judge(this,{place:me.place,of:this.field()})}catch(e){}try{if(g.ev)CAL.finish(g.ev.key,{place:me.place,of:this.field(),prize:pr||0})}catch(e){}
        try{LIFE.onTour({buy:(g.ev&&g.ev.buy)||(g.mtt&&g.mtt.buyin)||this.sngBuy(),leg:!!(g.ev&&g.ev.leg),place:me.place,of:this.field(),prize:pr||0,mtt:!!g.mtt,pays:g.mtt?g.mtt.pays.length:CIRC.pays(this.N).length,nm:this.tname()})}catch(e){}}
      if(g.mtt&&!g.finished&&!me.out)this.mttTick()}
    if(this.leaveAfter&&this.mode==='cash'){this.cashOut();return}
    this.save();this.render();this.autoNext()}
  autoNext(){const g=this.g;if(!g||g.finished||!g.over)return;
    if(this.mode==='tour'&&g.players[0].out&&!this.watch)return;
    if(this.mode==='cash'&&g.players[0].stack===0)return;
    if(this.$('oAuto').checked||this.watch){const tok=++this.tok;this.timer=setTimeout(()=>{if(tok===this.tok)this.startHand()},this.watch?700:2400)}}

  /* ----- IA: decide a ação de qualquer jogador (bots e treinador) ----- */
  decide(i,S,rng=Math.random,itMul=1){
    if(i!==0)S=this.adapt(i,S);
    const g=this.g,p=g.players[i];this._e=null;this._need=null;
    const eqv=(...a)=>{let e=equityVs(...a);if(i!==0&&this._tq!=null){const sd=Math.max(0,1.1-this._tq)*.18;e=Math.max(0,Math.min(1,e+(Math.random()*2-1)*sd))}return e};
    const meB=!!(S.vsMe&&(g.sbI===0||g.bbI===0));
    const toCall=Math.max(0,g.currentBet-p.bet),pot=this.pot();
    const maxTo=p.bet+p.stack,minTo=g.currentBet===0?g.bb:g.currentBet+g.minRaise;
    const others=g.players.filter((q,k)=>k!==i&&live(q));
    const canRaise=maxTo>g.currentBet&&g.raises<5&&others.some(canAct);
    const unit=Math.max(1,g.sb);
    const C=why=>({type:toCall===0?'check':'call',why});
    const F=why=>toCall===0?{type:'check',why}:{type:'fold',why};
    const R=(to,why)=>{if(!canRaise)return C(why);to=Math.round(to/unit)*unit;to=Math.max(to,minTo);if(to>=maxTo*.6)to=maxTo;return{type:'raise',to:Math.min(to,maxTo),why}};
    const effC=Math.min(maxTo,Math.max(0,...others.map(q=>q.stack+q.bet))),effBB=effC/g.bb;
    const hu=g.players.filter(q=>q.inHand).length===2;
    const opps=()=>others.map(q=>this.od(q));
    if(g.street==='preflop'){
      const key=handKey(p.hole),hp=HPCT[key],nb=this.behind(i);
      const ag=g.pfAgg>=0?g.players[g.pfAgg]:null;
      if(toCall>0&&(toCall>=p.stack||(ag&&ag.allIn&&g.pfRaises>0))){
        const pay=Math.min(toCall,p.stack),e=eqv(p.hole,[],opps(),Math.round(300*itMul)),need=pay/(pot+pay);this._e=e;this._need=need;
        const risk=this.mode==='tour'&&pay>=p.stack*.5&&effBB>10?.03:0;
        if(e>=need+S.M+risk)return{type:'call',why:`Contra o all-in, sua chance estimada é ${pct(e)} e o preço exige ${pct(need)}${risk?' (+ margem por arriscar a vida no torneio)':''}: pague.`};
        return F(`Contra o all-in, ${key} vence só ~${pct(e)} da faixa estimada e o preço exige ${pct(need)}${risk?' (+ margem de torneio)':''}: desista.`)}
      if(g.pfRaises===0){
        const limpers=others.filter(q=>q.vf).length;
        if(effBB<=13){const sh=Math.min(1,pushPct(nb,hu,effBB)*S.W*(S.vsMe&&S.R.shTight>=.07?1.25:1));
          if(hp<=sh)return R(maxTo,`Com ${effBB.toFixed(0)} BB efetivos o jogo é all-in ou desistir. ${key} está no top ${pct(hp)} e daqui o all-in vale com o top ${pct(sh)}.`);
          if(toCall===0)return{type:'check',why:'Stack curto e mão fora da faixa de all-in, mas você está no big blind sem aumento: check.'};
          return F(`Com ${effBB.toFixed(0)} BB, jogue all-in ou desista. ${key} (top ${pct(hp)}) está fora da faixa de all-in (top ${pct(sh)}).`)}
        let open=Math.min(1,rfiPct(nb,hu)*S.W)*(limpers?.75:1);
        if(meB&&S.R.foldBlind>=.6)open=Math.min(1,open*(1+(S.R.foldBlind-.5)*1.6));
        if(S.vsMe&&hu&&S.R.shTight>=.07)open=Math.min(1,open*1.3);
        if(hp<=open){
          if(S.passive&&rng()>S.A+.25)return C('Joga passivo: só paga.');
          const size=((i===g.sbI&&!hu)?3:(effBB<40?2.2:2.5))*g.bb+limpers*g.bb;
          return R(size,`${key} está no top ${pct(hp)} e, com ${nb} jogador${nb!==1?'es':''} ainda para falar, abre-se o top ${pct(open)}${limpers?' (contra limpers, um pouco mais apertado e maior)':''}. Aumente para ~${nf(size)}.`)}
        if(toCall===0)return{type:'check',why:`${key} (top ${pct(hp)}) é fraca, mas você está no big blind sem aumento: veja o flop de graça.`};
        if(S.W>1.3&&hp<=open*1.6&&toCall<=g.bb)return C('Entra pagando (limp).');
        if(!limpers&&nb<=2&&rng()<S.B*.25)return R(2.5*g.bb,'Tentativa de roubar os blinds.');
        if(!limpers&&meB&&S.R.foldBlind>=.6&&rng()<(S.R.foldBlind-.45))return R(2.5*g.bb,'Rouba os blinds de quem larga demais.');
        return F(`Desista: ${key} (top ${pct(hp)}) está fora da faixa de abertura desta posição (top ${pct(open)}).`)}
      const Rr=ag.range,inPos=this.ip(i,ag),callers=others.filter(q=>q.vf&&q!==ag).length;
      if(g.pfRaises===1){
        if(effBB<=22){const jam=Math.max(.04,Rr*.45)*S.W;
          if(hp<=jam)return R(maxTo,`Stack curto (${effBB.toFixed(0)} BB): re-aumente all-in. ${key} (top ${pct(hp)}) está bem contra a faixa estimada de ${ag.human?'você':ag.name} (top ${pct(Rr)}).`)}
        const v3=Math.max(.025,Rr*.2)*Math.min(S.W,1.3)*(S.vsMe&&ag.human&&S.R.vpFull>.3?1.5:1),callR=Math.min(.55,Rr*(i===g.bbI?1.25:inPos?.8:.45)*S.W),price=toCall/Math.max(1,maxTo);
        if(hp<=v3)return R(g.currentBet*(inPos?3:3.8)+callers*g.currentBet,`3-bet por valor: ${key} (top ${pct(hp)}) está no topo da faixa contra quem abriu o top ${pct(Rr)}.`);
        if(key[2]==='s'&&hp<=.35&&hp>callR*.6&&rng()<S.B*.35*(S.vsMe&&ag.human&&S.R.foldPre>=.7?2.2:1))return R(g.currentBet*3.2,'3-bet de blefe com mão do mesmo naipe.');
        if(hp<=callR&&price<=.12)return C(`Pague: ${key} (top ${pct(hp)}) está na faixa de call contra uma abertura de top ${pct(Rr)}${i===g.bbI?' (no BB você já tem fichas no pote)':inPos?' e você terá posição':''}.`);
        if(key.length===2&&price<=.06)return C(`Pague para tentar a trinca (set mining): custa só ${pct(price)} do seu stack.`);
        return F(`Desista: ${key} (top ${pct(hp)}) é fraca contra a faixa de quem aumentou (top ${pct(Rr)}).`)}
      if(g.pfRaises===2){const price=toCall/Math.max(1,maxTo);
        if(hp<=.026*Math.min(S.W,1.4))return R(effBB<=40?maxTo:g.currentBet*2.3,`4-bet: ${key} está entre as melhores mãos (top ${pct(hp)}).`);
        if(hp<=.075*S.W&&price<=.25)return C(`Pague o 3-bet: ${key} (top ${pct(hp)}) joga bem contra uma faixa de 3-bet.`);
        return F(`Desista contra o 3-bet: ${key} (top ${pct(hp)}) não é forte o suficiente.`)}
      if(hp<=.02*Math.min(S.W,1.5))return R(maxTo,`Contra 4-bet só continuam as melhores mãos: ${key} é uma delas — all-in.`);
      {const e=eqv(p.hole,[],opps(),Math.round(250*itMul)),need=toCall/(pot+toCall);this._e=e;this._need=need;
        if(e>=need+S.M)return C(`O preço está bom: ~${pct(e)} contra ${pct(need)} necessários.`);
        return F(`Desista contra 4-bet+: ${key} vence só ~${pct(e)} dessa faixa.`)}}
    /* pós-flop */
    const n=others.length,e=eqv(p.hole,g.board,opps(),Math.round((n>2?140:220)*itMul));this._e=e;
    const outs=drawOuts(p.hole,g.board),desc=describe(bestAny(p.hole.concat(g.board)).score).toLowerCase(),riv=g.street==='river';
    if(toCall===0){
      const vt=(n===1?.6:n===2?.5:.42)-S.A*.04-(S.vsMe&&S.R.station?.06:0);
      if(e>=vt){const f=riv&&e>.8?.75:e>.75?.66:.5;
        if(rng()<.75+S.A*.25)return R(pot*f,`Aposte por valor (~${Math.round(f*100)}% do pote): com ${desc} você vence ~${pct(e)} contra as faixas estimadas.`);
        return{type:'check',why:'Check para induzir aposta (slowplay).'}}
      if(outs>=8&&!riv&&n<=2&&rng()<.3+S.A*.45)return R(pot*.55,`Semi-blefe: projeto com ~${outs} outs — pode ganhar agora ou melhorar depois.`);
      if(g.pfAgg===i&&g.street==='flop'&&n<=2&&rng()<.4+S.A*.35-(n-1)*.15)return R(pot*(n===1?.33:.5),'Continuation bet: você aumentou pré-flop e representa a mão forte; aposta pequena no flop.');
      if(n===1&&riv&&e<.2&&rng()<S.B*this.ftb(others[0])*1.2)return R(pot*.66,'Blefe no river: sua mão não vence no showdown e o adversário mostrou fraqueza.');
      if(n===1&&g.street==='turn'&&e<.35&&rng()<S.B*.35)return R(pot*.5,'Aposta de pressão no turn.');
      if(S.vsMe&&n===1&&!riv&&S.R.foldBet>=.55&&e<.5&&rng()<(S.R.foldBet-.4)*1.1)return R(pot*.5,'Explora: adversário larga demais contra aposta.');
      return{type:'check',why:e>=.35?`Check: mão média (${desc}, ~${pct(e)}). Controle o tamanho do pote.`:`Check: mão fraca (~${pct(e)} contra as faixas estimadas).`}}
    const need=toCall/(pot+toCall),implied=(outs>=4&&!riv&&effC>pot*2)?.05:0,remain=p.stack-toCall;this._need=need;
    if(e>=(n===1?.72:.62)&&rng()<.5+S.A*.45)return R(g.currentBet+(pot+toCall)*.8,`Aumente por valor: com ${desc} você vence ~${pct(e)} contra as faixas estimadas.`);
    if(outs>=9&&g.street==='flop'&&n===1&&rng()<S.A*.3)return R(g.currentBet+(pot+toCall)*.75,`Semi-blefe aumentando: projeto forte (~${outs} outs) + chance de ele desistir.`);
    const lite=S.vsMe&&S.R.overbet>=.06&&g.players[0].bet===g.currentBet?.05:0;
    if(e+implied>=need+S.M-lite){
      if(remain<pot*.3&&e>=need)return R(maxTo,`Você já está comprometido com o pote (sobram poucas fichas): all-in.`);
      return{type:'call',why:`Pague: sua chance (~${pct(e)}${implied?' + odds implícitas do projeto':''}) cobre o preço (${pct(need)}).`}}
    if(n===1&&!riv&&toCall<pot*.5&&rng()<S.B*.12)return R(g.currentBet+(pot+toCall)*.8,'Blefe aumentando.');
    return{type:'fold',why:`Desista: com ${desc} você vence ~${pct(e)}, e o preço exige ${pct(need)}.`}}

  recFor(){const g=this.g,p=g.players[0],d=this.decide(0,COACH_STY,()=>.5,1.5);
    return{d,e:this._e,need:this._need,tok:this.tok,st:g.street,tc:Math.min(Math.max(0,g.currentBet-p.bet),p.stack),pot:this.pot(),stk:+((p.stack+p.bet)/g.bb).toFixed(1),b:g.board.map(c=>c.id).join('')}}
  record(type,to){const g=this.g,r=(this.pendRec&&this.pendRec.tok===this.tok)?this.pendRec:this.recFor();this.pendRec=null;
    const code=t=>t==='fold'?'f':t==='check'?'x':t==='call'?'c':'r',A=code(type),R=code(r.d.type),cat=catOf(r.st==='preflop',A,R);
    let ev=null;if((cat==='call_bad'||cat==='fold_bad')&&r.e!=null&&r.need!=null)ev=+Math.max(0,Math.abs(r.e-r.need)*(r.pot+r.tc)/g.bb).toFixed(2);
    this.cur.d.push({s:r.st[0],a:A,to:A==='r'?Math.round(to):null,ra:R,rto:R==='r'?r.d.to:null,why:r.d.why,e:r.e!=null?+r.e.toFixed(3):null,nd:r.need!=null?+r.need.toFixed(3):null,tc:r.tc,pot:r.pot,stk:r.stk,b:r.b,cat,ev})}
  saveHand(){const g=this.g,me=g.players[0],c=this.cur;if(!c)return;this.cur=null;
    Object.assign(c,{b:g.board.map(x=>x.id).join(''),net:me.stack-me.startStack,sd:me.show?1:0,w:me.won>0?1:0,vp:me.vf?1:0,pr:me.pf?1:0,t:Date.now()});
    HIST.addHand(this.sid,c)}
  /* ----- treinador ----- */
  coachSoon(){const el=this.$('coach');if(!this.$('oCoach').checked){el.style.display='none';return}el.style.display='';
    const g=this.g;if(!g||g.toAct!==0||g.over)return this.renderCoach();
    el.innerHTML='<h3>Treinador</h3><p class="muted">Analisando…</p>';const tok=this.tok;setTimeout(()=>{if(tok===this.tok)this.coach()},40)}
  renderCoach(){const el=this.$('coach');if(!this.$('oCoach').checked){el.style.display='none';return}el.style.display='';
    if(!(this.g&&this.g.toAct===0&&!this.g.over))el.innerHTML='<h3>Treinador</h3><p class="muted">A análise aparece quando for a sua vez. Ele usa a mesma lógica do bot mais forte (Tubarão) e explica o porquê.</p>'}
  coach(){
    const g=this.g,el=this.$('coach'),p=g.players[0];if(g.toAct!==0||g.over)return;
    const r=(this.pendRec&&this.pendRec.tok===this.tok)?this.pendRec:(this.pendRec=this.recFor()),d=r.d,toCall=Math.max(0,g.currentBet-p.bet),pot=this.pot(),pos=this.posMap()[0];
    let h='<h3>Treinador</h3>';
    if(g.street==='preflop'){const key=handKey(p.hole);h+=`<p>Sua mão: <b>${key}</b> — top <b>${pct(HPCT[key])}</b> das mãos iniciais. Posição: <b>${pos}</b> (${POSDESC[pos]||''}).</p>`}
    else{const o=drawOuts(p.hole,g.board);h+=`<p>Você tem: <b class="gold">${describe(bestAny(p.hole.concat(g.board)).score)}</b>${o?` · projeto com ~${o} outs`:''}</p>`}
    if(this.mode==='tour'){const bb=(p.stack+p.bet)/g.bb;h+=`<p class="muted" style="margin-top:-4px">Seu stack: ${bb.toFixed(1)} BB · M = ${this.mOf(p).toFixed(1)}</p>`}
    if(toCall>0)h+=`<p class="muted" style="margin-top:-4px">Para pagar ${nf(Math.min(toCall,p.stack))} num pote de ${nf(pot)}, você precisa vencer ${pct(Math.min(toCall,p.stack)/(pot+Math.min(toCall,p.stack)))} das vezes.</p>`;
    const lab=d.type==='fold'?'Desistir':d.type==='check'?'Check':d.type==='call'?`Pagar ${nf(Math.min(toCall,p.stack))}`:(d.to>=p.bet+p.stack?`All-in (${nf(d.to)})`:g.currentBet===0?`Apostar ${nf(d.to)}`:`Aumentar para ${nf(d.to)}`);
    h+=`<div class="sug"><div class="muted" style="font-size:12px">RECOMENDAÇÃO</div><b class="gold" style="font-size:17px">${lab}</b><div style="margin-top:4px">${d.why}</div>
      <button class="sm" data-r="useSug" style="margin-top:8px">Seguir sugestão</button></div>
      <p class="muted" style="font-size:12px;margin-top:8px">As chances são calculadas contra as faixas estimadas de cada adversário (posição, ações nesta mão e estatísticas do HUD), não contra mãos aleatórias.</p>`;
    el.innerHTML=h;const tok=this.tok;this.$('useSug').onclick=()=>{if(tok===this.tok&&g.toAct===0)this.act(0,d.type,d.to)}}
  mOf(p){const g=this.g,n=g.players.filter(q=>!q.out&&(q.stack>0||q.inHand)).length;return(p.stack+p.bet)/(g.sb+g.bb+(g.anteType==='bb'?g.ante:g.ante*n))}

  /* ----- interface ----- */
  render(){this.renderTable();this.renderControls();this.renderStats();this.renderLog();this.renderChat();this.renderTour();if(!(this.g&&this.g.toAct===0&&!this.g.over))this.renderCoach()}
  renderTable(){
    const g=this.g,tb=this.$('table'),mob=matchMedia('(max-width:640px)').matches;
    let h='<div class="pfelt"></div>';
    if(!g){tb.innerHTML=h+`<div class="pcenter"><div class="pmsg muted">${this.mode==='tour'?'Configure o torneio abaixo e comece.':'Escolha quantos bots e sente à mesa.'}</div></div>`;return}
    tb.classList.toggle('many',this.N>6);const N=this.N,rx=mob?39:41,ry=mob?40:38,cx=50,cy=49,ang=k=>Math.PI/2+k*2*Math.PI/N;
    const pt=(k,f,da=0)=>[cx+rx*f*Math.cos(ang(k)+da),cy+ry*f*Math.sin(ang(k)+da)];
    const pm=this.posMap(),study=this.$('oOpen').checked,showSt=this.$('oSty').checked,hud=this.$('oHud').checked;
    const w=mob?(N>6?74:90):(N>6?114:130);
    g.players.forEach((p,i)=>{const[x,y]=pt(i,1);const sty=`left:${x}%;top:${y}%;width:${w}px`;
      if(p.out&&p.empty){h+=`<div class="pseat out" style="${sty}"><div class="pcards"></div><div class="pinfo"><div class="pstyle">lugar vazio</div></div></div>`;return}
      if(p.out){h+=`<div class="pseat out" style="${sty}"><div class="pcards"></div><div class="pinfo"><div class="pname">${p.name}</div><div class="pstyle">eliminado · ${p.place}º</div></div></div>`;return}
      const cls=['pseat'];if(i===g.toAct&&!g.over)cls.push('turn');if(!p.inHand||p.folded)cls.push('dimmed');if(g.over&&p.won>0)cls.push('win');if(this.bub&&this.bub[p.name]&&this.bub[p.name].until>Date.now())cls.push('talk');
      let cards='';
      if(p.inHand&&p.hole.length){
        if(p.human)cards=p.hole.map(c=>cardHTML(c,(p.folded?'dim ':'')+(g.hl.has(c.id)?'hl':''))).join('');
        else if(p.show||(study&&!p.folded))cards=p.hole.map(c=>cardHTML(c,'sm'+(g.hl.has(c.id)?' hl':''))).join('');
        else if(!p.folded)cards='<span class="card back sm"></span><span class="card back sm"></span>'}
      const s=p.st,hl=hud&&s.hands?`<div class="phud">VPIP ${Math.round(s.vpip/s.hands*100)} · PFR ${Math.round(s.pfr/s.hands*100)} · AF ${(s.agg/Math.max(1,s.calls)).toFixed(1)}</div>`:'';
      h+=`<div class="${cls.join(' ')}" style="${sty}">${p.human&&this.clk&&i===g.toAct&&!g.over?`<span class="ptime">⏱ ${Math.ceil(this.clk.left/1000)}</span>`:''}${!p.human&&this.botClk&&this.botClk.j===i?`<span class="ptime" data-bt>⏱ ${this.botClk.base?Math.max(0,Math.ceil(this.botClk.base+this.botClk.used*30-(Date.now()-this.botClk.t0)/1000)):0}</span>`:''}<div class="pcards">${cards}</div>
        <div class="pinfo">${(()=>{const bb=this.bub&&this.bub[p.name];return bb&&bb.until>Date.now()?`<div class="pbub${y<34?' dn':''}${x<30?' l':x>70?' r':''}${bb.kind==='ask'?' ask':''}${bb.kind==='info'?' info':''}" data-bub="${p.name}">${bb.t}</div>`:''})()}${!p.human&&LIVES.on()?(()=>{const e=LIVES.mood(p.name);return e?`<span class="pemo" data-emo="${p.name}">${e[0]}</span>`:''})():''}${typeof FACE!=='undefined'?`<span class="pav"${!p.human&&typeof LIVES!=='undefined'&&LIVES.s&&LIVES.s.bots[p.name]?` data-pf="${p.name}"`:''}>${p.human?(LIFE.s?FACE.me('mesa',44):FACE.svg({g:'m',age:28,skin:'#c68b5e',hc:'#2b1d14',hair:'curto',cl:'camiseta',top:'#3f7d64',bg:'#1f6a50'},44,{})):FACE.bot(p.name,44,g.over&&p.won>0?'feliz':undefined)}</span>`:''}<div class="pname"${!p.human&&typeof LIVES!=='undefined'&&LIVES.s&&LIVES.s.bots[p.name]?` data-pf="${p.name}"`:''}>${p.name}${p.human&&typeof LIFE!=='undefined'?LIFE.patch():''}${pm[i]&&pm[i]!=='BTN'?`<span class="ppos">${pm[i]}</span>`:''}</div>
        <div class="pstack">${nf(p.stack)}${this.mode==='tour'?` <span class="muted bbx" style="font-size:11px">${(p.stack/g.bb).toFixed(0)} BB</span>`:''}</div>
        ${!p.human&&showSt?`<div class="pstyle">${STY[p.style].nm}</div>`:''}${hl}</div><div class="pact">${p.last||''}</div></div>`;
      if(p.bet>0&&!g.over){const[bx,by]=pt(i,.6);h+=`<div class="pchip" style="left:${bx}%;top:${by}%">${nf(p.bet)}</div>`}
      if(i===g.button&&p.inHand){const[dx,dy]=pt(i,.68,.3);h+=`<div class="pdealer" style="left:${dx}%;top:${dy}%">D</div>`}});
    const bd=g.board.map(c=>cardHTML(c,g.hl.size?(g.hl.has(c.id)?'hl':'dim'):'')).join('')+'<span class="slot"></span>'.repeat(5-g.board.length);
    {const D=this.dealerObj(),db=this.dbub&&this.dbub.until>Date.now()?this.dbub.t:'';
      var dtg=`<div class="dtag" data-dl>${D.emo} ${D.name}${db?`<div class="dbub">${db}</div>`:''}</div>`}
    h+=`<div class="pcenter">${dtg}${g.scout&&!g.scout.done?`<div class="sctag">👀 ${SCOUTS[g.scout.k].nm} assistindo</div>`:''}<div class="pboard">${bd}</div><div class="ppot${!g.over&&this.pot()>0?' has':''}">${g.over?'':'Pote: '+nf(this.pot())}</div><div class="pmsg">${g.msg}</div></div>`;
    tb.innerHTML=h;
    {const dt=tb.querySelector('[data-dl]');if(dt)dt.onclick=ev=>{ev.stopPropagation();const D=this.dealerObj();this.dbub={t:`${D.name}, ${D.age} anos (${D.tipo}). ${D.story}`,until:Date.now()+7000};clearTimeout(this._db);this._db=setTimeout(()=>this.renderTable(),7100);this.renderTable()}}
    tb.querySelectorAll('[data-emo]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();const n=e.dataset.emo,m=LIVES.mood(n);if(!m)return;this.bub=this.bub||{};this.bub[n]={t:`${m[0]} ${m[1]}`,kind:'info',until:Date.now()+4000};clearTimeout(this._bt);this._bt=setTimeout(()=>this.renderTable(),4100);this.renderTable()});
    tb.querySelectorAll('[data-bub]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();if(!LIVES.on())return;this.chatOpen=true;this.unread=0;this.renderChat()})}
  renderControls(){
    const c=this.$('ctl'),g=this.g,T=this.mode==='tour';this.root.classList.toggle('agmode',!!(T&&CAL.on()&&(!g||g.paused)));
    if(T&&g&&g.paused){const f=+g.ev.key.split('@')[1];c.innerHTML=`<div class="pwait">🌙 Fim do Dia ${g.ev.idx+1} do <b>${g.ev.nm}</b>. Suas fichas estão ensacadas: <b>${nf(g.players[0].stack)}</b>.<br>O Dia ${g.ev.idx+2} é ${CAL.fmt(f+g.ev.idx+1,true)}. Avance o calendário e jogue pela Agenda.</div>`+renderAgenda();bindAgenda(c,m=>{this.lastMsg=m||'';this.render()});return}
    if(T&&!g&&CAL.on()){const sv=SAVES.data.tour;let rb='';if(sv&&sv.players&&sv.ev&&!sv.paused)rb=`<div class="pwait" style="margin-bottom:12px"><b>${sv.ev.nm} em andamento</b> · mão ${sv.hands} · seu stack ${nf(sv.players[0].stack)}<br><button class="pri" data-r="bResume2" style="margin-top:8px">Continuar</button></div>`;
      c.innerHTML=rb+(this.lastMsg?`<div class="pwait" style="margin-bottom:12px">${this.lastMsg}</div>`:'')+renderAgenda();if(rb)this.$('bResume2').onclick=()=>this.resume(sv);bindAgenda(c,m=>{this.lastMsg=m||'';this.render()});return}
    if(!g){
      const opt=(arr,def,fmt=x=>x)=>arr.map(v=>`<option value="${v}"${v===def?' selected':''}>${fmt(v)}</option>`).join('');
      const sv=SAVES.data[this.mode];let rb='';
      if(sv&&sv.players&&sv.players[0]){const meS=sv.players[0].stack,alive=sv.players.filter(p=>!p.out).length,lvl=(sv.levels&&sv.levels[sv.level])||[sv.sb,sv.bb];
        rb=`<div class="pwait" style="margin-bottom:12px"><b>${T?'Torneio':'Partida'} em andamento</b><br>Mão ${sv.hands}${T?` · nível ${sv.level+1} (blinds ${nf(lvl[0])}/${nf(lvl[1])}) · ${alive} jogadores`:''} · seu stack ${nf(meS)}${T?` (${Math.round(meS/sv.bb)} BB)`:''}<br><span class="muted" style="font-size:12px">Salvo em ${new Date(sv.savedAt).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}${sv.rebuilt?' · stacks dos bots estimados':''}</span><br>
          <button class="pri" data-r="bResume" style="margin-top:8px">Continuar</button> <button class="sm" data-r="bDiscard" style="margin-top:8px">Descartar</button></div>`}
      c.innerHTML=(CAR.id==='qp'?'<div class="vsum" style="margin:0 0 12px">⚡ <b>Jogo rápido</b>: nada aqui conta pra carreira e o dinheiro é ilimitado. Para voltar à carreira: ☰ Mais › Menu principal.</div>':'')+rb+(this.lastMsg?`<div class="pwait" style="margin-bottom:12px">${this.lastMsg}</div>`:'')+`<div class="muted" style="font-size:14px;margin-bottom:10px;text-align:center">💰 Sua carteira: <b data-wallet>R$ ${brl(WALLET.s.bal)}</b> · ${T?'buy-in R$ '+nf(LIVES.BUYIN)+' (mesa única) ou R$ 1.000 (multimesas)':'no cash cada ficha vale R$ 1'}</div><div class="setup">
        ${T?`<div><label>Formato</label><select data-r="sFmt"><option value="sng">Mesa única</option><option value="mtt">Multimesas · buy-in R$ 1.000</option></select></div>
        <div data-r="wField" style="display:none"><label>Jogadores no torneio</label><select data-r="sField">${opt([18,27,36,45],27,v=>`${v} jogadores (${v/9} mesas)`)}</select></div>`:''}
        <div data-r="wBots"><label>Bots na mesa</label><select data-r="sBots">${opt([1,2,3,4,5,6,7,8],T?7:5,v=>`${v} bot${v>1?'s':''} (${v+1} jogadores)`)}</select></div>
        ${T?`<div><label>Estrutura</label><select data-r="sStruct">${Object.entries(STRUCTS).map(([k,x])=>`<option value="${k}"${k==='ps'?' selected':''}>${x.nm}</option>`).join('')}</select></div>
        <div><label>Blinds sobem a cada</label><select data-r="sHpl">${opt([8,10,12,15,20,30],12,v=>v+' mãos')}</select></div>`
        :`<div><label>Onde jogar</label><select data-r="sWhere"><option value="on"${(localStorage.getItem('escolaPoker.where')||'on')==='on'?' selected':''}>🖥️ Online, de casa · qualquer hora</option><option value="live"${localStorage.getItem('escolaPoker.where')==='live'?' selected':''}>♣️ Ao vivo no clube · 14h às 4h</option></select></div><div><label>Mesa</label><select data-r="sStake">${Object.entries(STAKES).map(([k,x])=>`<option value="${k}"${k===(localStorage.getItem('escolaPoker.stake')||'baixa')?' selected':''}>${x.nm} · blinds R$ ${x.sb}/${x.bb} · buy-in R$ ${nf(x.stack)}</option>`).join('')}</select></div>`}
        <div><button class="pri" data-r="bStart">${T?'Começar torneio':'Sentar à mesa'}</button></div></div>${T?'<div class="muted" data-r="sDesc" style="font-size:13px;text-align:center;margin-top:10px"></div>':''}`;
      if(T){const sel=this.$('sStruct'),upd=()=>{const x=STRUCTS[sel.value];this.$('sHpl').value=String(x.hpl);
          this.$('sDesc').innerHTML=`${x.ds} Stack inicial: <b>${nf(x.stack)}</b> = <b>${Math.round(x.stack/x.levels[0][1])} BB</b>.`;this.renderTour()};
        sel.onchange=upd;this.$('sHpl').onchange=()=>this.renderTour();upd();
        const fm=this.$('sFmt'),fu=()=>{upd();const mt=fm.value==='mtt';this.$('wField').style.display=mt?'':'none';this.$('wBots').style.display=mt?'none':'';
          const N=+this.$('sField').value;if(mt)this.$('sDesc').innerHTML=`${STRUCTS[sel.value].ds} <br><b>Multimesas:</b> ${N} jogadores em ${N/9} mesas de 9. Você joga a Mesa 1; as outras rodam em paralelo e, conforme saem eliminados, jogadores são transferidos e mesas são desfeitas até a mesa final. Buy-in R$ 1.000 (fictício) · prêmio total <b>R$ ${nf(N*1000)}</b>: 1º R$ ${nf(N*500)} · 2º R$ ${nf(N*300)} · 3º R$ ${nf(N*200)}. O 4º lugar é a bolha.`};
        fm.onchange=fu;this.$('sField').onchange=fu;sel.onchange=fu}
      if(this.$('bResume')){this.$('bResume').onclick=()=>this.resume(SAVES.data[this.mode]);
        this.$('bDiscard').onclick=()=>{const b=this.$('bDiscard');if(b.dataset.ok){if(!T)this.cashSaveOut();SAVES.del(this.mode);this.render()}else{b.dataset.ok=1;b.textContent='Confirmar descarte'}}}
      this.$('bStart').onclick=()=>{const bots=+this.$('sBots').value;this.lastMsg='';
        const SK=T?null:STAKES[this.$('sStake').value],buy=T?(this.$('sFmt').value==='mtt'?1000:LIVES.BUYIN):SK.stack;if(SK)try{localStorage.setItem('escolaPoker.stake',this.$('sStake').value)}catch(e){}
        if(!T&&this.$('sWhere')&&this.$('sWhere').value==='live'&&CAL.on()){if(CLK.now()>=25.5){this.lastMsg=`<b class="bad">O clube já fechou</b> (${CLK.fmt()}). Online funciona a qualquer hora.`;this.render();return}if(CLK.now()<14)CLK.to(14)}
        const stk=T&&SCOUT.staked(buy);if(!stk&&!WALLET.can(buy)){this.lastMsg=`<b class="bad">Saldo insuficiente.</b> Você tem R$ ${brl(WALLET.s.bal)} e o buy-in é R$ ${brl(buy)}. Deposite na carteira (aba Circuito › Carteira).`;this.render();return}
        if(!T)this.cashSaveOut();
        if(stk){WALLET.add(0,`Buy-in de R$ ${brl(buy)} pago pela ${SCOUTS.stake.org}`);this.stakedNow=buy}else WALLET.add(-buy,T?`Buy-in: ${this.$('sFmt').value==='mtt'?'Torneio Multimesas':'Sit & Go da Escola'}`:`Sentou no cash: ${SK.nm} (R$ ${SK.sb}/${SK.bb})`);this.paidNow=buy;try{LIFE.onStart(T?'tour':'cash',T&&this.$('sFmt').value==='mtt')}catch(e){}
        if(T){const x=STRUCTS[this.$('sStruct').value],base={stack:x.stack,hpl:+this.$('sHpl').value,sb:x.levels[0][0],bb:x.levels[0][1],levels:x.levels,anteType:x.anteType,structNm:x.nm};
          if(this.$('sFmt').value==='mtt'){const N=+this.$('sField').value,keys=Object.keys(STY),pool=[...BOTNAMES,...EXTRAS.slice().sort(()=>Math.random()-.5).slice(0,N-1-BOTNAMES.length)].sort(()=>Math.random()-.5);
            const seat=pool.slice(0,8),rest=pool.slice(8),tables=[];for(let k=0;k<rest.length;k+=9)tables.push({id:tables.length+2,btn:Math.random()*9|0,ps:rest.slice(k,k+9).map(n=>({name:n,style:LIVES.styleOf(n)||keys[Math.random()*keys.length|0],stack:x.stack}))});
            this.startGame(Object.assign(base,{bots:8,field:N,buyin:1000,mtt:{seat,state:{N,buyin:1000,pays:CIRC.pays(N),tables,busted:[],news:[],bubble:false,itm:false,final:false}}}))}
          else this.startGame(Object.assign(base,{bots}))}
        else{const W=this.$('sWhere'),on=!W||W.value==='on';if(W)try{localStorage.setItem('escolaPoker.where',W.value)}catch(e){}
          if(on){this.startGame({bots,stack:SK.stack,sb:SK.sb,bb:SK.bb,names:ONL.nicks(bots)});this.g.online=true;this.log(`<div class="lh lvl">🖥️ Sala online · ${SK.nm} (R$ ${SK.sb}/${SK.bb}). Ninguém aqui te conhece pessoalmente: só os apelidos.</div>`);this.save()}
          else this.startGame({bots,stack:SK.stack,sb:SK.sb,bb:SK.bb})}};return}
    const me=g.players[0];
    if(T&&g.finished){const pr=g.mtt?this.prizeOf(me.place):0;c.innerHTML=`<div class="pwait">${g.msg}<br>Sua colocação: <b>${me.place}º de ${this.field()}</b>${g.mtt?(pr?` · <b class="ok">seu prêmio: R$ ${nf(pr)}</b>`:` · sem prêmio (buy-in R$ ${nf(g.mtt.buyin)})`):''}<br><button class="pri" data-r="bNew" style="margin-top:10px">${CAL.on()?'Voltar à agenda':'Novo torneio'}</button> <button data-r="bRev" style="margin-top:10px">Revisar torneio 🔎</button></div>`;
      {const sid=this.sid;this.$('bRev').onclick=()=>goReview(sid)}
      this.$('bNew').onclick=()=>{this.stop();this.g=null;this.watch=false;this.resetUI();this.render()};return}
    if(T&&me.out&&g.mtt){const pr=this.prizeOf(me.place);
      c.innerHTML=`<div class="pwait">Você foi eliminado em <b>${me.place}º lugar</b> de ${g.mtt.N}.${pr?` <b class="ok">Prêmio: R$ ${nf(pr)}</b> (lucro R$ ${nf(pr-g.mtt.buyin)}).`:` Perdeu o buy-in de R$ ${nf(g.mtt.buyin)}.`}<br>Ainda restam ${this.aliveAll()} no torneio.<br><button class="pri" data-r="bFin" style="margin-top:10px">Ver como termina</button> <button data-r="bNew" style="margin-top:10px">Novo torneio</button> <button data-r="bRev" style="margin-top:10px">Revisar torneio 🔎</button></div>`;
      {const sid=this.sid;this.$('bRev').onclick=()=>goReview(sid)}
      this.$('bFin').onclick=()=>this.mttFinish();
      this.$('bNew').onclick=()=>{this.stop();SAVES.del(this.mode);this.g=null;this.watch=false;this.resetUI();this.render()};return}
    if(T&&me.out){
      if(this.watch){c.innerHTML='<div class="pwait">Assistindo ao restante do torneio em alta velocidade… <button class="sm" data-r="bPause">Pausar</button></div>';this.$('bPause').onclick=()=>{this.watch=false;this.render()};return}
      c.innerHTML=`<div class="pwait">Você foi eliminado em <b>${me.place}º lugar</b>.<br><button class="pri" data-r="bWatch" style="margin-top:10px">Assistir até o fim</button> <button data-r="bNew" style="margin-top:10px">Novo torneio</button> <button data-r="bRev" style="margin-top:10px">Revisar torneio 🔎</button></div>`;
      {const sid=this.sid;this.$('bRev').onclick=()=>goReview(sid)}
      this.$('bWatch').onclick=()=>{this.watch=true;this.render();if(g.over)this.startHand()};
      this.$('bNew').onclick=()=>{this.stop();this.g=null;this.watch=false;this.resetUI();this.render()};return}
    if(g.needRebuy){c.innerHTML=`<div class="pwait">Você ficou sem fichas.<br><button class="pri" data-r="bRe" style="margin-top:10px">Recomprar R$ ${nf(g.startStack)}</button></div>`;
      const rv=g.startStack*LIVES.CHIP;if(!WALLET.can(rv)){c.innerHTML=`<div class="pwait">Você ficou sem fichas e a carteira não cobre a recompra (R$ ${brl(rv)}).<br><button class="pri" data-r="bOut" style="margin-top:10px">Sair da mesa</button></div>`;this.$('bOut').onclick=()=>this.cashOut();return}
      this.$('bRe').onclick=()=>{WALLET.add(-rv,`Recompra no cash: ${stakeOf(g).nm} (R$ ${nf(g.startStack)})`);g.cashIn=(g.cashIn||0)+rv;me.stack=g.startStack;g.buyins++;this.startHand()};
      c.querySelector('.pwait').insertAdjacentHTML('beforeend',` <button data-r="bOut" style="margin-top:10px">Sair da mesa</button>`);this.$('bOut').onclick=()=>this.cashOut();return}
    if(g.over){c.innerHTML=`<div class="pbtns"><button class="pri" data-r="bNext">Próxima mão →</button></div>${this.$('oAuto').checked?'<div class="pwait" style="margin-top:6px;font-size:13px">Próxima mão começa sozinha…</div>':''}`;
      this.$('bNext').onclick=()=>this.startHand();return}
    if(g.toAct!==0){const w=g.players[g.toAct],outH=me.folded||!me.inHand;c.innerHTML=`<div class="pwait">${me.folded?'Você desistiu desta mão. ':''}${w?`Vez de <b>${w.name}</b>…`:'…'}${outH&&!this.watch&&!this.fwd?'<br><button class="sm" data-r="bFF" style="margin-top:8px">⏩ Pular para o fim da mão</button>':''}${outH?'':this.preRow()}</div>`;
      c.querySelectorAll('[data-pre]').forEach(b=>b.onclick=()=>{const k=b.dataset.pre;if(this.pre&&this.pre.k===k)this.pre=null;else this.pre={k,v:Math.max(0,g.currentBet-me.bet),hand:g.hands,street:g.street};
        const quit=this.pre&&(k==='fold'||k==='cf')&&this.$('oSkip').checked;this.fwd=!!quit;
        if(quit&&this._pendAct){clearTimeout(this.timer);const fn=this._pendAct;if(this.botClk)this.botClk.used=this.botClk.cards;fn();return}
        this.renderControls()});
      const ff=this.$('bFF');if(ff)ff.onclick=()=>{this.fwd=true;if(this._pendAct){clearTimeout(this.timer);const fn=this._pendAct;if(this.botClk)this.botClk.used=this.botClk.cards;fn()}this.renderControls()};return}
    const toCall=Math.max(0,g.currentBet-me.bet),maxTo=me.bet+me.stack,minTo=Math.min(maxTo,g.currentBet===0?g.bb:g.currentBet+g.minRaise);
    const canRaise=maxTo>g.currentBet&&g.players.some((q,k)=>k!==0&&canAct(q)),pot=this.pot(),unit=Math.max(1,g.sb);
    let h='<div class="pbtns">';
    if(toCall>0)h+='<button class="pfold" data-r="aFold">Desistir</button>';
    h+=toCall===0?'<button data-r="aCheck">Check</button>':`<button data-r="aCall">${toCall>=me.stack?'Pagar all-in '+nf(me.stack):'Pagar '+nf(toCall)}</button>`;
    if(canRaise)h+='<button class="pri" data-r="aRaise"></button>';h+='</div>';
    const cl=v=>Math.min(maxTo,Math.max(minTo,Math.round(v/unit)*unit));
    if(canRaise&&maxTo>minTo){const base=pot+toCall,P=[];
      if(g.street==='preflop'&&g.currentBet<=g.bb)P.push(['2,5 BB','set',g.bb*2.5],['3 BB','set',g.bb*3]);else if(g.street==='preflop')P.push(['3x','set',g.currentBet*3]);
      P.push(['−1 BB','add',-g.bb],['+1 BB','add',g.bb],['+⅓ pote','add',base/3],['+½ pote','add',base*.5],['+Pote','add',base],['Mín','set',minTo],['All-in','set',maxTo]);
      h+='<div class="praise">'+P.map(([l,k,v])=>`<button data-k="${k}" data-v="${Math.round(v)}"${l==='All-in'?' class="pallin"':''}>${l}</button>`).join('')+
        `<input type="range" data-r="rSl" min="${minTo}" max="${maxTo}" step="1" value="${minTo}"><input type="number" data-r="rNum" min="${minTo}" max="${maxTo}" value="${minTo}"></div><div class="muted" style="font-size:12px;margin-top:4px">Os botões com “+” somam a cada toque: toque duas vezes em “+½ pote” para apostar um pote.</div>`}
    if(this.clk){const tb=g.tb||{n:0},cash=this.mode!=='tour';
      h=`<div class="pclk" data-r="clk"><div class="pclkbar"><i></i></div><span data-r="clkT"></span><button class="sm" data-r="clkUse"${tb.n?'':' disabled'}>⏱ +30s · ${tb.n} cart${tb.n===1?'ão':'ões'}</button>${cash&&tb.bought!==g.hands&&me.stack>=g.bb?`<button class="sm" data-r="clkBuy">+30s por 1 BB</button>`:''}</div>`+h}
    c.innerHTML=h;let val=minTo;
    if(this.clk){this.clkDraw();const u=this.$('clkUse');if(u)u.onclick=()=>this.clkExt('card');const bb=this.$('clkBuy');if(bb)bb.onclick=()=>this.clkExt('buy')}
    const setR=v=>{v=Math.min(maxTo,Math.max(minTo,Math.round(+v||minTo)));val=v;const sl=this.$('rSl');if(sl){sl.value=v;this.$('rNum').value=v}
      this.$('aRaise').textContent=v===maxTo?`All-in ${nf(v)}`:(g.currentBet===0?`Apostar ${nf(v)}`:`Aumentar para ${nf(v)}`)};
    if(canRaise){setR(minTo);this.$('aRaise').onclick=()=>this.act(0,'raise',val);
      let touched=false;c.querySelectorAll('.praise button').forEach(b=>b.onclick=()=>{const v=+b.dataset.v;if(b.dataset.k==='set')setR(v>=maxTo?maxTo:cl(v));else setR(cl((touched?val:g.currentBet)+v));touched=true});
      const sl=this.$('rSl');if(sl){sl.oninput=()=>{touched=true;setR(sl.value)};this.$('rNum').onchange=()=>setR(this.$('rNum').value)}}
    if(toCall>0)this.$('aFold').onclick=()=>this.act(0,'fold');
    if(toCall===0)this.$('aCheck').onclick=()=>this.act(0,'check');else this.$('aCall').onclick=()=>this.act(0,'call')}
  renderStats(){const el=this.$('stats'),g=this.g;
    if(!g){el.innerHTML=this.mode==='tour'?'Torneio: stack igual para todos, blinds sobem, perdeu tudo está fora.':'Mesa de cash game: fichas acabaram, recompra.';return}
    const me=g.players[0];
    if(this.mode==='tour'){const L=g.levels[g.level],alive=g.players.filter(p=>!p.out).length;
      const AA=g.mtt?this.aliveAll():alive,m=g.mtt,tag=m?(AA===m.pays.length+1?' · <b class="bad">💥 BOLHA</b>':AA<=m.pays.length?' · <b class="ok">💰 no dinheiro</b>':''):'';
      el.innerHTML=`Mão <b>#${g.hands}</b> · nível <b>${g.level+1}</b> (${nf(L[0])}/${nf(L[1])}${anteTxt(L[2],g.anteType)}) · restam <b>${AA}/${this.field()}</b>${m?` · ${m.tables.length?(m.tables.length+1)+' mesas':'mesa final'}`:''}${tag} · você: <b>${me.out?'eliminado ('+me.place+'º)':nf(me.stack)}</b>`;return}
    const saldo=me.stack-g.startStack*g.buyins;
    el.innerHTML=`${stakeOf(g).nm} (R$ ${stakeOf(g).sb}/${stakeOf(g).bb}) · mão <b>#${g.hands}</b> · na mesa <b>R$ ${nf(me.stack)}</b> · sessão <b style="color:${saldo>=0?'var(--ok)':'var(--bad)'}">${saldo>=0?'+R$ ':'−R$ '}${nf(Math.abs(saldo))}</b> · 💰 carteira <b data-wallet>R$ ${brl(WALLET.s.bal)}</b>`}
  renderLog(){const g=this.g,l=this.$('log');if(!g)return;l.innerHTML=g.log.map(x=>`<div>${x}</div>`).join('');l.scrollTop=l.scrollHeight}
  renderTour(){
    if(this.mode!=='tour')return;const g=this.g,ti=this.$('tinfo'),sd=this.$('stand');
    const sx=!g&&this.$('sStruct')?STRUCTS[this.$('sStruct').value]:STRUCTS.ps,LV=g?g.levels:sx.levels,AT=g?g.anteType:sx.anteType;
    const struct=(from)=>{const hpl=g?g.hpl:(this.$('sHpl')?+this.$('sHpl').value:sx.hpl),st0=g?g.startStack:sx.stack;return`<table class="small"><tr><th>Nível</th><th>Blinds</th><th>Ante${AT==='bb'?' (BB)':''}</th><th>Mãos</th>${g?'':'<th>Stack inicial</th>'}</tr>${LV.slice(from,from+(g?5:12)).map((L,k)=>{const lv=from+k;
      return`<tr class="${g&&lv===g.level?'cur':''}"><td>${lv+1}</td><td>${nf(L[0])}/${nf(L[1])}</td><td>${L[2]?nf(L[2]):'–'}</td><td>${lv*hpl+1}–${(lv+1)*hpl}</td>${g?'':`<td>${Math.round(st0/L[1])} BB</td>`}</tr>`}).join('')}</table>`};
    if(!g){ti.innerHTML=`<h3>Como funciona</h3><p>Todos começam com o mesmo stack. Os blinds sobem a cada X mãos e há <b>ante</b> (uma aposta obrigatória extra). Quem perde todas as fichas é eliminado. O último que sobrar vence.</p>
      <p>A coluna "Stack inicial" mostra quantos big blinds o stack inicial vale em cada nível: é assim que se mede a velocidade de um torneio.</p>
      <p class="muted">Diferente do cash game, aqui fichas não são dinheiro: sobreviver importa. Com stack curto (menos de ~13 BB), o jogo vira <b>all-in ou desistir</b> — o treinador mostra as faixas.</p>`;
      sd.innerHTML=`<h3>Estrutura de blinds</h3><p class="muted" style="margin-top:0;font-size:13px">${sx.nm}</p>`+struct(0);return}
    const L=g.levels[g.level],me=g.players[0],alive=g.players.filter(p=>!p.out),avg=alive.reduce((s,p)=>s+p.stack+p.total,0)/alive.length;
    const left=g.hpl-((g.hands-1)%g.hpl)-1,nx=g.levels[Math.min(g.level+1,g.levels.length-1)];
    let mz='';if(!me.out){const M=this.mOf(me);const z=M>=20?['ok','Zona verde: jogo normal, todas as jogadas disponíveis.']:M>=10?['gold','Zona amarela: comece a roubar blinds com mais frequência.']:M>=6?['warn','Zona laranja: prefira all-in ou desistir em vez de aumentos pequenos.']:['bad','Zona vermelha: all-in ou desistir com faixa ampla — os blinds estão te consumindo.'];
      mz=`<div class="tip">Seu stack: <b>${nf(me.stack)}</b> = <b>${(me.stack/g.bb).toFixed(1)} BB</b> · M de Harrington: <b class="${z[0]}">${M.toFixed(1)}</b><br><span style="font-size:14px">${z[1]}</span></div>`}
    ti.innerHTML=`<h3>Nível ${g.level+1}: ${nf(L[0])}/${nf(L[1])}${anteTxt(L[2],g.anteType)}</h3>
      <p>${g.finished?'Torneio encerrado.':`Próximo nível em <b>${left===0?'1':left+1}</b> mão${left?'s':''}: ${nf(nx[0])}/${nf(nx[1])}${anteTxt(nx[2],g.anteType)}.`}<br>
      Jogadores: <b>${alive.length}/${this.N}</b> · stack médio: <b>${nf(avg)}</b> (${(avg/g.bb).toFixed(0)} BB)</p>${mz}
      <p class="muted" style="font-size:13px">M = seu stack ÷ custo de uma volta na mesa (SB + BB + antes).${g.structNm?' Estrutura: '+g.structNm+'.':''} Indica quantas voltas você aguenta sem jogar.</p>${struct(Math.max(0,g.level-1))}`;
    if(g.mtt){const m=g.mtt,AA=g.finished?1:this.aliveAll(),all=[...alive.filter(p=>!p.empty).map(p=>({name:p.name,chips:p.stack+(g.over?0:p.total),mesa:1,me:p.human})),...m.tables.flatMap(t=>t.ps.map(p=>({name:p.name,chips:p.stack,mesa:t.id})))].sort((a,b)=>b.chips-a.chips),
        avgA=all.length?all.reduce((s,p)=>s+p.chips,0)/all.length:0,myR=all.findIndex(p=>p.me)+1,P=m.pays.length;
      let bub='';if(!me.out&&!g.finished){if(AA>P&&AA<=P+3){const mine=me.stack+(g.over?0:me.total);bub=`<div class="tip"><b class="bad">💥 Perto da bolha (${AA} restantes, ${P} premiados).</b><br><span style="font-size:14px">${mine<avgA*.7?'Seu stack está abaixo da média: só entre all-in com mão forte e deixe os outros se eliminarem.':mine>avgA*1.4?'Você é stack grande: pressione os médios, que estão com medo de cair na bolha.':'Stack médio: evite brigar com os grandes; ataque os blinds de quem está apertado.'}</span></div>`}
        else if(AA<=P)bub=`<div class="tip"><b class="ok">💰 No dinheiro!</b> <span style="font-size:14px">Cada posição a mais vale: 3º R$ ${nf(this.prizeOf(3))} → 2º R$ ${nf(this.prizeOf(2))} → 1º R$ ${nf(this.prizeOf(1))}.</span></div>`}
      ti.innerHTML+=`<h3 style="margin-top:14px">Torneio multimesas</h3><p style="margin-top:0">${AA}/${m.N} vivos · ${g.finished?'encerrado':m.tables.length?(m.tables.length+1)+' mesas':'mesa final'} · média ${nf(avgA)} fichas${myR?` · você é o <b>${myR}º em fichas</b>`:''}</p>
        <p style="margin:0">Prêmio total R$ ${nf(m.N*m.buyin)}: <b>1º R$ ${nf(this.prizeOf(1))}</b> · 2º R$ ${nf(this.prizeOf(2))} · 3º R$ ${nf(this.prizeOf(3))}</p>${bub}
        ${m.news.length?`<details><summary class="muted" style="font-size:13px;margin-top:6px">Notícias das outras mesas</summary>${m.news.map(t=>`<div style="font-size:13px;padding:2px 0">${t}</div>`).join('')}</details>`:''}`;
      const top=all.slice(0,10);if(myR>10)top.push(all[myR-1]);
      const rowsM=top.map(p=>`<tr${p.me?' class="me"':''}><td>${all.indexOf(p)+1}</td><td>${p.name}</td><td>${p.mesa}</td><td>${nf(p.chips)}</td></tr>`).join('');
      const bus=m.busted.slice().sort((a,b)=>a.place-b.place).filter(x=>g.finished||x.place<=P+3||m.busted.length-m.busted.indexOf(x)<=8).map(x=>`<tr class="gone${x.name==='Você'?' me':''}"><td>${x.place}º</td><td>${x.name}</td><td>${x.mesa}</td><td>${this.prizeOf(x.place)?'R$ '+nf(this.prizeOf(x.place)):'–'}</td></tr>`).join('');
      sd.innerHTML=`<h3>${g.finished?'Classificação final':'Fichas no torneio'}</h3><table class="small"><tr><th>#</th><th>Jogador</th><th>Mesa</th><th>Fichas</th></tr>${g.finished?'':rowsM}${bus}</table>`;return}
    const showSt=this.$('oSty').checked;
    const rows=[...alive].sort((a,b)=>(b.stack+b.total)-(a.stack+a.total)).map((p,k)=>`<tr${p.human?' class="me"':''}><td>${k+1}</td><td>${p.name}${!p.human&&showSt?` <span class="muted">(${STY[p.style].nm})</span>`:''}</td><td>${nf(p.stack+(g.over?0:p.total))}</td><td>${((p.stack+(g.over?0:p.total))/g.bb).toFixed(0)} BB</td></tr>`).join('');
    const outs=g.players.filter(p=>p.out).sort((a,b)=>a.place-b.place).map(p=>`<tr class="${p.human?'me ':''}gone"><td>${p.place}º</td><td>${p.name}${!p.human?` <span class="muted">(${STY[p.style].nm})</span>`:''}</td><td colspan="2">eliminado na mão ${p.outHand}</td></tr>`).join('');
    sd.innerHTML=`<h3>${g.finished?'Classificação final':'Classificação'}</h3><table class="small"><tr><th>#</th><th>Jogador</th><th>Fichas</th><th></th></tr>${rows}${outs}</table>`}
}

document.querySelectorAll('.stylelist').forEach(el=>el.innerHTML=Object.values(STY).map(x=>`<div class="tip"><b class="gold">${x.nm}</b> — ${x.ds}</div>`).join(''));
