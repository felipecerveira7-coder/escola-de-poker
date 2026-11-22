/* =============== v58: sons — tudo sintetizado na hora (sem arquivos de áudio) =============== */
const SFX={ctx:null,m:null,ambK:null,ambN:null,
  muted(){if(this.m==null){try{this.m=localStorage.getItem('escolaPoker.mute')==='1'}catch(e){this.m=false}}return this.m},
  toggle(){this.m=!this.muted();try{localStorage.setItem('escolaPoker.mute',this.m?'1':'0')}catch(e){}const k=this.want;this.ambStop();if(!this.m&&k)this.amb(k);if(!this.m)this.play('chip',{n:2})},
  ac(){if(this.muted())return null;if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;this.ctx=new C();this.out=this.ctx.createGain();this.out.gain.value=.55;
      const cp=this.ctx.createDynamicsCompressor();this.out.connect(cp);cp.connect(this.ctx.destination)}
    if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});return this.ctx},
  buf:{},noise(d){const c=this.ctx,k=Math.round(d*100);if(!this.buf[k]){const b=c.createBuffer(1,Math.max(1,c.sampleRate*d|0),c.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1;this.buf[k]=b}const s=c.createBufferSource();s.buffer=this.buf[k];return s},
  env(g,t,a,pk,dec){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,pk),t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dec)},
  osc(type,f,t,a,pk,dec,f2){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+a+dec);o.connect(g);g.connect(this.out);this.env(g,t,a,pk,dec);o.start(t);o.stop(t+a+dec+.05);return o},
  nz(d,t,type,f,q,a,pk,dec,f2){const c=this.ctx,n=this.noise(d),fl=c.createBiquadFilter(),g=c.createGain();fl.type=type;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+d);fl.Q.value=q;n.connect(fl);fl.connect(g);g.connect(this.out);this.env(g,t,a,pk,dec);n.start(t);n.stop(t+d)},
  play(k,o){o=o||{};const c=this.ac();if(!c||c.state!=='running'&&!this._uk)return;const t=c.currentTime+.01+(o.at||0);try{this.K[k]&&this.K[k].call(this,t,o)}catch(e){}},
  K:{
    card(t){this.nz(.09,t,'bandpass',2400+Math.random()*1200,.8,.003,.45,.06);this.nz(.05,t+.02,'highpass',5000,.5,.002,.12,.03)},
    flip(t){this.nz(.07,t,'bandpass',1700,1,.003,.4,.05);this.nz(.07,t+.07,'bandpass',2600,1,.003,.35,.05)},
    chip(t,o){const n=o.n||2;for(let i=0;i<n;i++){const tt=t+i*.05+Math.random()*.025;this.osc('sine',3600*(1+Math.random()*.08),tt,.002,.12,.07);this.osc('sine',5300*(1+Math.random()*.06),tt,.002,.06,.05);this.nz(.04,tt,'highpass',3200,.7,.001,.3,.025)}},
    knock(t){[0,.12].forEach(d=>{this.osc('sine',150,t+d,.003,.6,.11,55);this.nz(.03,t+d,'lowpass',900,.7,.001,.25,.02)})},
    fold(t){this.nz(.28,t,'bandpass',3200,.7,.02,.28,.22,500)},
    allin(t){this.osc('sine',70,t,.005,.9,.9,38);this.nz(.6,t,'lowpass',260,.8,.01,.5,.5);this.osc('triangle',220,t+.05,.02,.08,.6,440)},
    win(t){this.K.chip.call(this,t,{n:8});[523.3,659.3,784,1046.5].forEach((f,i)=>this.osc('triangle',f,t+.25+i*.09,.01,.14,.45))},
    turn(t){this.osc('sine',880,t,.005,.12,.18);this.osc('sine',1318.5,t+.09,.005,.1,.25)},
    tick(t){this.osc('square',1400,t,.001,.05,.03)},
    beat(t){for(let i=0;i<3;i++){const b=t+i*.85;this.osc('sine',62,b,.004,.9,.16,42);this.osc('sine',58,b+.22,.004,.6,.18,40)}},
    ooh(t){const c=this.ctx,bp=c.createBiquadFilter(),lp=c.createBiquadFilter(),g=c.createGain();bp.type='bandpass';bp.frequency.value=520;bp.Q.value=2.5;lp.type='lowpass';lp.frequency.value=1100;bp.connect(lp);lp.connect(g);g.connect(this.out);
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.55,t+.25);g.gain.exponentialRampToValueAtTime(.0001,t+1.6);
      for(let i=0;i<9;i++){const o=c.createOscillator(),f=150+Math.random()*190;o.type='sawtooth';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.78,t+1.5);o.detune.value=(Math.random()-.5)*30;o.connect(bp);o.start(t+Math.random()*.08);o.stop(t+1.7)}},
    cheer(t){const c=this.ctx,n=this.noise(2.4),bp=c.createBiquadFilter(),g=c.createGain();bp.type='bandpass';bp.frequency.value=1400;bp.Q.value=.6;n.connect(bp);bp.connect(g);g.connect(this.out);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.35,t+.3);g.gain.exponentialRampToValueAtTime(.0001,t+2.3);n.start(t);n.stop(t+2.4);
      for(let i=0;i<26;i++)this.nz(.03,t+.1+Math.random()*1.8,'bandpass',1800+Math.random()*1500,1.2,.001,.2+Math.random()*.2,.03)},
    ding(t){this.osc('sine',988,t,.004,.18,.25);this.osc('sine',1480,t+.12,.004,.15,.35)},
    whoosh(t){this.nz(.5,t,'bandpass',400,.8,.15,.3,.3,2600)},
    boom(t){this.osc('sine',55,t,.005,1,1.4,30);this.nz(1,t,'lowpass',180,.7,.01,.6,.9)}},
  /* ambiente por lugar */
  want:null,
  amb(k){this.want=k;if(this.ambK===k)return;this.ambStop();if(!k)return;const c=this.ac();if(!c)return;this.ambK=k;const t=c.currentTime,nodes=[],G=c.createGain();G.gain.setValueAtTime(.0001,t);G.gain.exponentialRampToValueAtTime(1,t+1.5);G.connect(this.out);nodes.push(G);
    const mur=(f,v)=>{const n=this.noise(4),lp=c.createBiquadFilter(),g=c.createGain(),l=c.createOscillator(),lg=c.createGain();n.loop=true;lp.type='bandpass';lp.frequency.value=f;lp.Q.value=.7;g.gain.value=v;l.frequency.value=.17;lg.gain.value=v*.5;l.connect(lg);lg.connect(g.gain);n.connect(lp);lp.connect(g);g.connect(G);n.start();l.start();nodes.push(n,l)};
    if(k==='room')mur(300,.025);
    if(k==='club'||k==='casino')mur(450,k==='casino'?.07:.05),mur(900,.025);
    if(k==='casino'){[130.8,164.8,196,246.9].forEach(f=>{const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=f;g.gain.value=.006;o.connect(g);g.connect(G);o.start();nodes.push(o)})}
    if(k==='bar')mur(500,.06),mur(1200,.02);
    this.ambN=nodes;if(k!=='room')this.ambI=setInterval(()=>{if(Math.random()<.5)this.play('chip',{n:1+(Math.random()*3|0)})},2600)},
  ambStop(){clearInterval(this.ambI);const N=this.ambN;this.ambN=null;this.ambK=null;if(N&&this.ctx){const t=this.ctx.currentTime;try{N[0].gain.cancelScheduledValues(t);N[0].gain.setValueAtTime(N[0].gain.value,t);N[0].gain.exponentialRampToValueAtTime(.0001,t+.6)}catch(e){}setTimeout(()=>N.forEach(n=>{try{n.stop?n.stop():n.disconnect()}catch(e){}}),700)}}};
/* o iPhone só libera o som depois de um toque */
['pointerdown','touchend','keydown'].forEach(ev=>addEventListener(ev,()=>{if(SFX.muted())return;const c=SFX.ac();if(c&&!SFX._uk){SFX._uk=1;const b=c.createBuffer(1,1,22050),s=c.createBufferSource();s.buffer=b;s.connect(c.destination);s.start(0)}if(SFX.want&&!SFX.ambK)SFX.amb(SFX.want)},true));
