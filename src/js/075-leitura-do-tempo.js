/* =============== v64: a mesa aprende o SEU tempo (demorar não é sempre mão fraca) =============== */
const TELL={
  SHARP:['calculista','frio','fria','paciente','confiante'],
  st(T){if(typeof LIVES!=='undefined'&&LIVES.on()){LIVES.s.htell=LIVES.s.htell||{ss:0,sw:0,fs:0,fw:0};return LIVES.s.htell}T._ht=T._ht||{ss:0,sw:0,fs:0,fw:0};return T._ht},
  kind(ht){if(!ht)return'';if(ht.secs>=8)return'slow';if(ht.secs<=2.5&&ht.street!=='preflop')return'fast';return''},
  /* o que esse bot acha que a demora (ou a pressa) significa: chance de mão forte */
  belief(T,name,kind){const B=(typeof LIVES!=='undefined'&&LIVES.bio(name))||{},sharp=this.SHARP.includes(B.trait),M=this.st(T);
    const [a,b]=kind==='slow'?(sharp?[2,2]:[1,3]):(sharp?[2,2]:[3,2]),w=sharp?1:.45,s=kind==='slow'?M.ss:M.fs,f=kind==='slow'?M.sw:M.fw;
    return{p:(a+w*s)/(a+b+w*(s+f)),sharp,n:s+f}},
  /* força real da sua mão no showdown */
  strength(me,board){const r=best7(me.hole.concat(board)).score,c=r[0];if(c>=2){const bo=board.length>=5?best7(board).score:null;return bo&&cmp(bo,r)===0?'w':'s'}
    if(c===1){const top=Math.max(...board.map(x=>x.r));return r[1]>=top?'s':'w'}return'w'},
  learnFrom(T){const g=T.g,me=g&&g.players[0];if(!g||!me||!me.inHand||me.folded||!me.hole||g.board.length<5)return;const L=(g.hTells||[]).filter(x=>x.hand===g.hands&&this.kind(x));if(!L.length)return;
    const s=this.strength(me,g.board),M=this.st(T);let slow=0;L.forEach(x=>{const k=this.kind(x);if(k==='slow'){s==='s'?M.ss++:M.sw++;slow++}else{s==='s'?M.fs++:M.fw++}});
    if(slow&&!g._tellLog){g._tellLog=1;T.log(`<span class="muted">🧠 A mesa viu: você demorou e estava ${s==='s'?'<b>forte</b>':'<b>fraco</b>'}. Os jogadores mais atentos guardam isso (${M.ss} vezes forte, ${M.sw} fraco).</span>`)}
    try{LIVES.commit&&LIVES.commit()}catch(e){}},
  say(T,name){const ht=T.g&&T.g.hTell;if(!ht||this.kind(ht)!=='slow')return null;const b=this.belief(T,name,'slow');
    return b.p<.42?['Pensou bastante, hein. Vou pagar pra ver.','Demorou demais pra ser forte.','Esse tempo todo… tô desconfiado.']:b.p>.58?['Já vi esse filme: tu demora quando tá forte.','Demorou assim da última vez e tinha o nuts.','Hmm… essa demora não me engana mais.']:['Difícil te ler, viu.','Não sei se tu tá blefando ou armando.']}};
/* guarda cada decisão sua na mão (tempo + ação) */
{const P=Table.prototype,_ac=P.act;P.act=function(i,type,to){const g=this.g,p=g&&g.players[i],me=!!(p&&p.human&&g.toAct===i&&!g.over);const r=_ac.apply(this,arguments);
  try{if(me&&g.hTell){g.hTells=(g.hTells||[]).filter(x=>x.hand===g.hands);g.hTells.push(Object.assign({},g.hTell))}}catch(e){}return r};
  const _sd=P.showdown;P.showdown=function(){try{TELL.learnFrom(this)}catch(e){console.warn(e)}return _sd.apply(this,arguments)};
  /* a leitura do tempo agora usa o que a mesa aprendeu com você, pra qualquer ação (aposta, call ou check demorado) */
  P.tellAdj=function(i,X){const g=this.g,ht=g.hTell,me=g.players[0];if(!ht||ht.hand!==g.hands||!me.inHand||me.folded)return X;const kind=TELL.kind(ht);if(!kind)return X;
    const b=TELL.belief(this,g.players[i].name,kind),e=(b.p-.5)*2*(b.sharp?1:.6)*(typeof LIFE!=='undefined'&&LIFE.has&&LIFE.has('oculos')?.5:1);
    const agg=(ht.type==='raise'||ht.type==='bet')&&me.bet>0;
    if(agg){X.M+=.05*e;X.B*=Math.max(.3,1-.35*e)}else if(ht.type==='check'){X.B*=Math.max(.3,1-.4*e);X.A=Math.max(0,Math.min(1,X.A-.08*e))}else if(ht.type==='call'){X.B*=Math.max(.4,1-.3*e)}
    return X}}
