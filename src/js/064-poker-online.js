/* ----- poker online: qualquer hora, apelidos, rakeback ----- */
const ONL={
  N:['river_rat88','AAces_SP','fold2win','gauchoNuts','ShipItBR','tiltmaster','KK_noTilt','donkeykong_rs','sereia_do_flop','monstro_3bet','padeiro_allin','ZéDoRiver','callstation99','Nit_Paciente','luckbox_poa','GTO_wannabe','bluffinho','pinguim_poker','turbo_tchê','senna_dos_blinds','vovó_shark','pokerPai','ninja_do_check','donaFlop'],
  nicks(k){return this.N.slice().sort(()=>Math.random()-.5).slice(0,k)},
  rb(){return .3+(LIFE.s&&LIFE.spById&&LIFE.spById('mundial')?.2:0)+(LIFE.s&&LIFE.spById&&LIFE.spById('asdeouro')?.1:0)}};
(function(){try{
  const _cs=Table.prototype.cashSeats;Table.prototype.cashSeats=function(){const g=this.g;if(g&&g.online){if(g.hands<1||Math.random()>.05)return;const ps=g.players.filter(p=>!p.human&&!p.out);if(!ps.length)return;const p=pickA(ps),used=new Set(g.players.map(x=>x.name)),nn=ONL.N.find(n=>!used.has(n));if(!nn)return;
      this.log(`<span class="muted">🖥️ ${p.name} saiu da mesa · ${nn} sentou</span>`);p.name=nn;p.style=pickA(Object.keys(STY));p.stack=g.startStack;p.st={hands:0,vpip:0,pfr:0,agg:0,calls:0,fbet:0,facedBet:0};return}return _cs.call(this)};
  const _co=Table.prototype.cashOut;Table.prototype.cashOut=function(){const g=this.g;if(!g||this.mode!=='cash')return _co.call(this);const on=!!g.online,hands=g.hands||0,bb=g.bb;_co.call(this);
    try{if(CAL.on()&&LIFE.s){CLK.add(Math.max(.25,hands/(on?70:30))+(on||g.home?0:.5));LIFE.commit()}
      if(on&&hands>0){const v=Math.round(hands*bb*LIVES.CHIP*.06*ONL.rb());if(v>0){WALLET.add(v,`Rakeback da sala online (${Math.round(ONL.rb()*100)}%)`);this.lastMsg+=` 🖥️ Rakeback de ${Math.round(ONL.rb()*100)}%: <b class="ok">+R$ ${brl(v)}</b>.`;this.render()}}}catch(e){}};
  const _os2=LIFE.onStart;LIFE.onStart=function(kind,mtt){_os2.call(this,kind,mtt);try{if(kind==='cash'&&this.s){const W=document.querySelector('#cashRoot [data-r="sWhere"]');if(!W||W.value==='on'){this.s.energy=Math.min(100,this.s.energy+3);this.commit()}}}catch(e){}};
  const _ax=Table.prototype.aiCtx;Table.prototype.aiCtx=function(){const r=_ax.call(this);return this.g&&this.g.online?`MESA ONLINE: os outros jogadores são desconhecidos com apelidos, falando pelo chat da sala. Ninguém conhece ${CIRC.me()} pessoalmente, mas alguém pode reconhecer o nome dele se ele for famoso. Respostas curtas, jeito de chat de internet.\n`+r:r};
}catch(e){console.warn('onl',e)}})();
