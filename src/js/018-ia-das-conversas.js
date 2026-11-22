/* ----- IA das conversas (pede ao Claude; sem ela, usa as falas prontas) ----- */
const AIX={fn:null,off:false,until:0,busy:false,used:false,
  init(){try{if(window.claude&&window.claude.use)Promise.resolve(window.claude.use('sample')).then(s=>{this.fn=s||null;[typeof CASH!=='undefined'&&CASH,typeof TOUR!=='undefined'&&TOUR].forEach(t=>t&&t.g&&t.renderChat())}).catch(()=>{})}catch(e){}},
  ready(){return!!this.fn&&!this.off&&Date.now()>this.until&&!this.busy},
  async ask(prompt){if(!this.ready())return null;this.busy=true;
    try{let v;if(typeof this.fn.json==='function')v=await this.fn.json(prompt,{modelTier:'quick',cache:false});
      else{const r=await this.fn(prompt,{modelTier:'quick',cache:false}),t=(r&&r.text)||'',m=t.match(/\{[\s\S]*\}/);v=m?JSON.parse(m[0]):null}
      this.used=true;return v}
    catch(e){if(e&&e.code==='not_granted')this.off=true;else this.until=Date.now()+(e&&e.code==='rate_limited'?120000:20000);return null}
    finally{this.busy=false}}};
const STAKES={baixa:{nm:'Mesa baixa',sb:1,bb:2,stack:200},media:{nm:'Mesa média',sb:2,bb:5,stack:500},alta:{nm:'Mesa alta',sb:5,bb:10,stack:1000}};
const stakeOf=g=>Object.values(STAKES).find(x=>x.bb===g.bb&&x.stack===g.startStack)||{nm:'Mesa',sb:g.sb,bb:g.bb,stack:g.startStack};
const WALLET={LS:CAR.ls('escolaPoker.wallet.v1'),s:null,db:null,
  fresh(){return{bal:5000,log:[{t:Date.now(),v:5000,txt:'Saldo inicial',bal:5000}],updatedAt:0}},
  load(){try{const x=JSON.parse(localStorage.getItem(this.LS)||'null');this.s=x&&typeof x.bal==='number'?x:this.fresh()}catch(e){this.s=this.fresh()}},
  saveLocal(){try{localStorage.setItem(this.LS,JSON.stringify(this.s))}catch(e){}},
  async remote(db){this.db=db;try{const d=await db.collection('wallet').doc('me'+CAR.sfx()).get();const x=d&&d.exists?d.data():null;
      if(x&&typeof x.bal==='number'&&(x.updatedAt||0)>=(this.s.updatedAt||0)){this.s=JSON.parse(JSON.stringify(x));this.saveLocal()}else if(this.s.updatedAt)this.push()}catch(e){}
    this.ready=true;this.refresh()},
  push(){if(!this.db)return;const body=JSON.parse(JSON.stringify(this.s)),ref=this.db.collection('wallet').doc('me'+CAR.sfx());HIST.q=HIST.q.then(()=>ref.set(body)).catch(()=>{})},
  add(v,txt){if(CAR.id==='qp'){this.s.bal=1e6;this.refresh();return}v=Math.round(v*100)/100;if(!v&&!txt)return;this.s.bal=Math.round((this.s.bal+v)*100)/100;this.s.log.unshift({t:Date.now(),v,txt,bal:this.s.bal});
    if(this.s.log.length>300)this.s.log.length=300;if(!this.ready&&!(this.s.updatedAt>0)){this.saveLocal();this.refresh();return}this.s.updatedAt=Date.now();this.saveLocal();this.push();this.refresh()},
  can(v){return CAR.id==='qp'||this.s.bal+1e-9>=v},
  refresh(){document.querySelectorAll('[data-wallet]').forEach(e=>e.textContent='R$ '+brl(this.s.bal));
    if(typeof renderCircuit==='function'&&location.hash==='#circuito'&&renderCircuit.tab==='cart')renderCircuit()}};
WALLET.load();if(CAR.id==='qp')WALLET.s.bal=1e6;
