/* ===================== HISTÓRICO E ANÁLISE ===================== */
const CATS={
  ok:{nm:'Alinhado ao treinador',w:0},
  pf_loose:{nm:'Pré-flop: entrou com mão fraca demais',w:1,tip:'Respeite as faixas por posição (aba 3). Mão fora da faixa custa fichas no longo prazo, principalmente nas primeiras posições, onde muita gente ainda fala depois de você.'},
  pf_tight:{nm:'Pré-flop: desistiu de mão jogável',w:.8,tip:'Você está largando mãos lucrativas. Do cutoff e do botão abra mais mãos; no big blind, defenda mais contra aumentos pequenos (você já tem fichas no pote).'},
  pf_passive:{nm:'Pré-flop: pagou quando era para aumentar',w:.7,tip:'Entre no pote aumentando, não pagando. O aumento dá duas formas de ganhar: todos desistem ou você tem a melhor mão — e tira a vantagem de quem só pagaria.'},
  pf_aggr:{nm:'Pré-flop: aumentou fora da faixa',w:.5,tip:'Aumentar com mão fora da faixa às vezes rouba os blinds, mas te deixa em situações difíceis depois do flop. Guarde isso para o botão e o cutoff.'},
  call_bad:{nm:'Pagou sem odds',w:1,tip:'Antes de pagar, compare sua chance de vencer com o preço: valor a pagar ÷ (pote + valor a pagar). Se a chance for menor, desista — por mais que doa.'},
  fold_bad:{nm:'Desistiu com odds a favor',w:1,tip:'Quando a aposta é pequena perto do pote, o preço é baixo: pague mesmo com mão média ou com projeto. Desistir ali entrega fichas a quem está blefando.'},
  passive:{nm:'Faltou apostar/aumentar por valor',w:.6,tip:'Com mão forte, aposte. Dar check com a melhor mão deixa de ganhar fichas e dá carta grátis para o adversário te passar.'},
  aggr:{nm:'Apostou/aumentou fora do plano',w:.5,tip:'Blefe funciona contra quem desiste (Rocha, Tubarão) e com poucos adversários. Contra a Estação e em pote com vários jogadores, quase nunca.'}};
function catOf(pre,A,R){
  if(A===R)return'ok';
  if(pre){if(R==='f')return A==='x'?'ok':'pf_loose';if(A==='f')return'pf_tight';if(R==='r')return'pf_passive';if(A==='r')return'pf_aggr';return'ok'}
  if(A==='c'&&R==='f')return'call_bad';if(A==='f')return'fold_bad';if(R==='r')return'passive';if(A==='r')return'aggr';return'ok'}

const HIST={db:null,status:'carregando',docs:{},cur:{},q:Promise.resolve(),LS:'escolaPoker.hist.v1',
  loadLocal(){try{const x=JSON.parse(localStorage.getItem(this.LS)||'{}');if(x&&typeof x==='object')this.docs=x}catch(e){}},
  saveLocal(){try{let s=JSON.stringify(this.docs);
    if(s.length>4e6){const ks=Object.keys(this.docs).sort((a,b)=>(this.docs[a].t||0)-(this.docs[b].t||0));while(s.length>4e6&&ks.length>1){delete this.docs[ks.shift()];s=JSON.stringify(this.docs)}}
    localStorage.setItem(this.LS,s)}catch(e){}},
  async init(){
    this.loadLocal();this.status='local';refreshAnalysis();
    try{
      if(!window.claude||!window.claude.use)throw 0;
      const db=await Promise.race([window.claude.use('db'),new Promise(r=>setTimeout(()=>r(null),10000))]);
      if(!db)throw 0;this.db=db;
      const snap=await Promise.race([db.collection('sessions').limit(1000).get(),new Promise((_,j)=>setTimeout(()=>j('timeout'),15000))]);
      const remote={};snap.docs.forEach(d=>{const x=d.data();if(x&&Array.isArray(x.hands))remote[d.id]=JSON.parse(JSON.stringify(x))});
      for(const[id,x]of Object.entries(remote)){const l=this.docs[id];if(!l||(l.hands||[]).length<=x.hands.length)this.docs[id]=x}
      for(const[id,x]of Object.entries(this.docs)){if(x.hands&&x.hands.length&&(!remote[id]||remote[id].hands.length<x.hands.length))this.push(id)}
      this.status='nuvem';this.saveLocal();SAVES.remote(db);LIVES.remote(db);WALLET.remote(db);LIFE.remote(db);CAR.remote(db)
    }catch(e){this.status=this.db?'erro':'local'}
    refreshAnalysis()},
  push(id){if(!this.db||!this.docs[id])return;const body=JSON.parse(JSON.stringify(this.docs[id]));const ref=this.db.collection('sessions').doc(id);
    this.q=this.q.then(()=>ref.set(body)).catch(err=>{
      if(err&&err.code==='quota_exceeded'){this.status='cheio';refreshAnalysis();return}
      if(err&&err.code==='unavailable')return new Promise(r=>setTimeout(r,800+Math.random()*800)).then(()=>ref.set(body)).catch(()=>{})})},
  newSession(mode,cfg){const sid=Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    this.cur[sid]={chunk:1,mode,cfg:{bots:cfg.bots,stack:cfg.stack,hpl:cfg.hpl||0,st:cfg.structNm||'',field:cfg.field||0,buyin:cfg.buyin||0},t:Date.now()};return sid},
  docId(sid){const c=this.cur[sid];let id=sid+'_'+c.chunk;
    if(this.docs[id]&&this.docs[id].hands.length>=150){c.chunk++;id=sid+'_'+c.chunk}
    if(!this.docs[id])this.docs[id]={sid,car:CAR.id,mode:c.mode,t:c.t,chunk:c.chunk,cfg:c.cfg,hands:[]};return id},
  addHand(sid,h){if(!this.cur[sid])return;const id=this.docId(sid);this.docs[id].hands.push(h);this.docs[id].u=Date.now();this.saveLocal();this.push(id);refreshAnalysis()},
  setMeta(sid,m){if(!this.cur[sid])return;Object.assign(this.cur[sid],m);const id=this.docId(sid);Object.assign(this.docs[id],m);this.saveLocal();this.push(id)},
  async clear(){const ids=Object.keys(this.docs).filter(k=>(this.docs[k].car||'c1')===CAR.id);ids.forEach(k=>delete this.docs[k]);this.cur={};this.saveLocal();
    if(this.db)for(const id of ids){try{await this.db.collection('sessions').doc(id).delete()}catch(e){}}},
  sessions(){const by={};Object.values(this.docs).forEach(d=>{if(!d||!d.sid||(d.car||'c1')!==CAR.id)return;const s=by[d.sid]||(by[d.sid]={sid:d.sid,mode:d.mode,t:d.t,cfg:d.cfg,hands:[]});
      s.hands.push(...(d.hands||[]));if(d.place)s.place=d.place;if(d.of)s.of=d.of;if(d.prize!=null)s.prize=d.prize;if(d.buyin)s.buyin=d.buyin});
    return Object.values(by).filter(s=>s.hands.length).sort((a,b)=>a.t-b.t)},
  hands(){const out=[];this.sessions().forEach(s=>s.hands.forEach(h=>out.push(Object.assign({mode:s.mode,sid:s.sid},h))));return out.sort((a,b)=>(a.t||0)-(b.t||0))}};

