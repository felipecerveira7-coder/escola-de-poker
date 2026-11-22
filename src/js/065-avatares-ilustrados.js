/* =============== v57: avatares ilustrados (rosto, cabelo, roupa e expressão) para todo mundo =============== */
const FACE={
  C:new Map(),
  EYE:['#3b2a1e','#5a3b22','#2f5a3a','#3a5a7a','#6b4a2a','#2a2a2a'],
  BG:['#7b2d52','#1f6a50','#2a4f7a','#6a4a1f','#4a2f6a','#2f5f6a','#7a3a2a','#3c4a5a'],
  TOP:['#c0396b','#3f7d64','#2d5d9a','#e0a83a','#6b4c9a','#2a2a2e','#e9e9e9','#8a3a2a','#3a6f8a','#5b6b3a'],
  SKIN:['#f1d3b6','#e3b48f','#c68b5e','#8d5a3b','#5a3a26'],
  HC:['#1b1410','#2b1d14','#5b3a1e','#9a6b3a','#c9a063','#b5452b'],
  rnd(seed){let x=(hashN(String(seed))%2147483646)+1;return()=>((x=(x*16807)%2147483647)/2147483647)},
  sh(h,f){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?0:255,p=Math.abs(f);r=Math.round((t-r)*p+r);g=Math.round((t-g)*p+g);b=Math.round((t-b)*p+b);return'#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)},
  mix(a,b,t){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16),c=s=>Math.round(((A>>s)&255)*(1-t)+((B>>s)&255)*t);return'#'+((1<<24)+(c(16)<<16)+(c(8)<<8)+c(0)).toString(16).slice(1)},
  gray(h,a){return a>=64?'#dcdcdc':a>=56?this.mix(h,'#c4c4c4',.6):a>=48?this.mix(h,'#a8a8a8',.28):h},
  /* aparência estável a partir de uma semente */
  gen(seed,g,age){const r=this.rnd(seed),pk=a=>a[Math.floor(r()*a.length)];age=age||30;
    const hair=g==='f'?pk(['longo','chanel','coque','cacheado','rabo','franja','longo']):pk(age>44?['curto','calvo','curto','careca','topete']:['curto','topete','cacheado','raspado','curto']);
    return{skin:pk(this.SKIN),hc:pk(this.HC),hair,top:pk(this.TOP),cl:pk(g==='f'?['blusa','camiseta','blusa','jaqueta','camisa']:['camiseta','camisa','polo','moletom','jaqueta']),
      gl:r()<.16?pk(['redondo','quadrado']):'sem',beard:g==='m'?pk(['sem','sem','curta','cheia','bigode','cavanhaque']):'sem',ear:g==='f'&&r()<.6,bg:pk(this.BG),eye:pk(this.EYE)}},
  /* desenho: o = aparência + {g,age}, sz em px, x = {mood,hat,ring,chain,watch,capLogo,sq} */
  svg(o,sz,x){x=x||{};const key=JSON.stringify([o,sz,x]);let s=this.C.get(key);if(s)return s;s=this.draw(o,sz,x);if(this.C.size>600)this.C.clear();this.C.set(key,s);return s},
  draw(o,sz,x){const S=this,F=o.g==='f',age=o.age||30,md=x.mood||'neutro',id='fc'+hashN(JSON.stringify([o,sz,x])).toString(36),sh=(c,f)=>S.sh(c,f);
    const P=o.skin||'#e3b48f',Pd=sh(P,-.22),H=S.gray(o.hc||'#2b1d14',age),T=o.top||'#3f7d64',E=o.eye||'#3b2a1e',lip=F?'#b4405a':sh(P,-.38),sq=x.sq;
    const defs=`<radialGradient id="${id}b" cx=".5" cy=".32" r=".8"><stop offset="0" stop-color="${sh(o.bg||'#1f6a50',.16)}"/><stop offset="1" stop-color="${sh(o.bg||'#1f6a50',-.4)}"/></radialGradient>
      <radialGradient id="${id}s" cx=".4" cy=".32" r=".75"><stop offset="0" stop-color="${sh(P,.14)}"/><stop offset=".68" stop-color="${P}"/><stop offset="1" stop-color="${sh(P,-.16)}"/></radialGradient>
      <linearGradient id="${id}c" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${sh(T,.12)}"/><stop offset="1" stop-color="${sh(T,-.32)}"/></linearGradient>
      <linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sh(H,.18)}"/><stop offset="1" stop-color="${sh(H,-.12)}"/></linearGradient>
      <clipPath id="${id}k">${sq?'<rect width="120" height="120" rx="14"/>':'<circle cx="60" cy="60" r="58"/>'}</clipPath>`;
    const hf=`url(#${id}h)`;
    /* cabelo de trás */
    const back={longo:`<path d="M34 58 C30 30 44 22 60 22 C76 22 90 30 86 58 C88 80 92 98 84 108 L36 108 C28 98 32 80 34 58Z" fill="${hf}"/>`,
      chanel:`<path d="M35 54 C33 32 46 24 60 24 C74 24 87 32 85 54 L86 76 C80 80 75 78 75 72 L45 72 C45 78 40 80 34 76Z" fill="${hf}"/>`,
      rabo:`<path d="M78 34 C94 40 96 70 86 90 C84 74 82 54 74 42Z" fill="${hf}"/>`,
      franja:`<path d="M35 56 C32 32 46 24 60 24 C74 24 88 32 85 56 C86 76 88 90 82 98 L38 98 C32 90 34 76 35 56Z" fill="${hf}"/>`,
      cacheado:F?`<g fill="${hf}"><circle cx="36" cy="60" r="10"/><circle cx="84" cy="60" r="10"/><circle cx="38" cy="76" r="9"/><circle cx="82" cy="76" r="9"/><circle cx="40" cy="90" r="8"/><circle cx="80" cy="90" r="8"/></g>`:''}[o.hair]||'';
    /* roupa */
    const body=`<path d="M10 124 C12 97 32 86 60 86 C88 86 108 97 110 124Z" fill="url(#${id}c)"/>`,cd=sh(T,-.4);
    const cl={camiseta:`<path d="M47 87 Q60 98 73 87" fill="none" stroke="${cd}" stroke-width="2.6"/>`,
      camisa:`<path d="M49 85 L60 98 L55.5 102 L45 89Z M71 85 L60 98 L64.5 102 L75 89Z" fill="${sh(T,.28)}" stroke="${cd}" stroke-width=".8"/><circle cx="60" cy="106" r="1.4" fill="${cd}"/><circle cx="60" cy="115" r="1.4" fill="${cd}"/>`,
      polo:`<path d="M50 85 L58 95 L54 98 L46 89Z M70 85 L62 95 L66 98 L74 89Z" fill="${sh(T,.15)}" stroke="${cd}" stroke-width=".8"/><path d="M60 92 L60 106" stroke="${cd}" stroke-width="1.2"/><circle cx="60" cy="97" r="1.2" fill="#eee"/><circle cx="60" cy="103" r="1.2" fill="#eee"/>`,
      moletom:`<path d="M34 94 C38 80 82 80 86 94 C78 89 70 87 60 87 C50 87 42 89 34 94Z" fill="${sh(T,-.22)}"/><path d="M54 92 L52 108 M66 92 L68 108" stroke="#e6e6e6" stroke-width="1.6" stroke-linecap="round"/>`,
      blusa:`<path d="M49 86 L60 101 L71 86 Q60 90 49 86Z" fill="url(#${id}s)"/><path d="M49 86 L60 101 L71 86" fill="none" stroke="${cd}" stroke-width="1.2"/>`,
      jaqueta:`<path d="M50 86 L60 124 L70 86 Q60 91 50 86Z" fill="${S.TOP[(hashN(T)%S.TOP.length)]}"/><path d="M44 87 L55 108 L50 87Z M76 87 L65 108 L70 87Z" fill="${sh(T,-.28)}"/><path d="M60 100 L60 124" stroke="${cd}" stroke-width="1"/>`,
      terno:`<path d="M48 86 L60 124 L72 86 Q60 92 48 86Z" fill="#f4f4f4"/><path d="M57.5 92 L62.5 92 L61.4 96 L64 116 L60 121 L56 116 L58.6 96Z" fill="${x.tie||'#a51f2d'}"/><path d="M45 87 L58 114 L52 92 L48 86Z M75 87 L62 114 L68 92 L72 86Z" fill="${sh(T,-.3)}"/>`,
      jaleco:`<path d="M10 124 C12 97 32 86 60 86 C88 86 108 97 110 124Z" fill="#f3f5f7"/><path d="M49 86 L60 112 L71 86 Q60 91 49 86Z" fill="url(#${id}c)"/><path d="M44 88 L57 116 L51 90Z M76 88 L63 116 L69 90Z" fill="#dfe4ea"/><rect x="72" y="104" width="10" height="7" rx="1.5" fill="none" stroke="#c9d0d8"/>`,
      farda:`<path d="M49 85 L60 97 L55.5 101 L45 89Z M71 85 L60 97 L64.5 101 L75 89Z" fill="${sh(T,-.15)}"/><rect x="70" y="103" width="9" height="6" rx="1" fill="#e9c35a"/><path d="M26 100 L38 96" stroke="#e9c35a" stroke-width="2"/>`}[o.cl||'camiseta']||'';
    const neck=`<path d="M51 70 L51 88 Q60 94 69 88 L69 70Z" fill="${sh(P,-.08)}"/><path d="M51 75 Q60 84 69 75 L69 71 Q60 80 51 71Z" fill="${Pd}" opacity=".55"/>`;
    const chain=x.chain?`<path d="M47 88 C51 101 69 101 73 88" fill="none" stroke="#e9c35a" stroke-width="2.4"/><circle cx="60" cy="99" r="2.4" fill="#f0c96e"/>`:'';
    const ears=`<ellipse cx="38.5" cy="55" rx="4" ry="6" fill="${P}"/><ellipse cx="81.5" cy="55" rx="4" ry="6" fill="${P}"/><path d="M38 52 Q36.4 55 38.4 58 M82 52 Q83.6 55 81.6 58" stroke="${Pd}" stroke-width="1.1" fill="none"/>`;
    const head=F?`<path d="M39 52 C39 34 47 29 60 29 C73 29 81 34 81 52 C81 67 72 79 60 79 C48 79 39 67 39 52Z" fill="url(#${id}s)"/>`:`<path d="M38 52 C38 34 46 28 60 28 C74 28 82 34 82 52 C82 68 74 80 60 80 C46 80 38 68 38 52Z" fill="url(#${id}s)"/>`;
    const ear=o.ear?`<circle cx="38.5" cy="62.5" r="2.4" fill="#e9c35a"/><circle cx="81.5" cy="62.5" r="2.4" fill="#e9c35a"/>`:'';
    /* rosto */
    const blush=`<ellipse cx="46.5" cy="62" rx="4.6" ry="2.6" fill="#e0607a" opacity="${md==='feliz'?.32:md==='tilt'?.5:F?.22:.12}"/><ellipse cx="73.5" cy="62" rx="4.6" ry="2.6" fill="#e0607a" opacity="${md==='feliz'?.32:md==='tilt'?.5:F?.22:.12}"/>`;
    const wr=age>=45?`<g fill="none" stroke="${Pd}" stroke-linecap="round" opacity="${age>=60?.75:.5}"><path d="M54.5 61.5 Q52.5 65 54 68.5 M65.5 61.5 Q67.5 65 66 68.5"/>${age>=58?'<path d="M43 51 L40.5 50 M43 53.5 L40.5 54 M77 51 L79.5 50 M77 53.5 L79.5 54"/><path d="M47 56 Q51 58 55 56 M65 56 Q69 58 73 56"/>':''}</g>`:'';
    const eye=(cx,L)=>{const cy=52;let e=`<ellipse cx="${cx}" cy="${cy}" rx="4.3" ry="2.9" fill="#fff"/><circle cx="${cx+(md==='confiante'?.8:0)}" cy="${cy+.1}" r="2.35" fill="${E}"/><circle cx="${cx+(md==='confiante'?.8:0)}" cy="${cy+.1}" r="1.15" fill="#111"/><circle cx="${cx+.9}" cy="${cy-.9}" r=".75" fill="#fff"/>`;
      if(md==='cansado')e+=`<path d="M${cx-4.8} ${cy-3.4} L${cx+4.8} ${cy-3.4} L${cx+4.8} ${cy+.3} Q${cx} ${cy+.9} ${cx-4.8} ${cy+.3}Z" fill="${sh(P,-.06)}"/><path d="M${cx-4.4} ${cy+.3} Q${cx} ${cy+.9} ${cx+4.4} ${cy+.3}" stroke="${sh(P,-.45)}" stroke-width="1" fill="none"/><path d="M${cx-3.6} ${cy+3.6} Q${cx} ${cy+5.4} ${cx+3.6} ${cy+3.6}" stroke="#6a4a6a" stroke-width="1.2" fill="none" opacity=".4"/>`;
      else if(md==='tilt'){const a=L?[cx-5,cy-4.2,cx+5,cy-4.2,cx+5,cy-.4,cx-5,cy-2.8]:[cx-5,cy-4.2,cx+5,cy-4.2,cx+5,cy-2.8,cx-5,cy-.4];e+=`<path d="M${a[0]} ${a[1]} L${a[2]} ${a[3]} L${a[4]} ${a[5]} L${a[6]} ${a[7]}Z" fill="${P}"/>`}
      else if(md==='feliz')e+=`<path d="M${cx-5} ${cy+3.4} Q${cx} ${cy-.2} ${cx+5} ${cy+3.4} L${cx+5} ${cy+4.4} L${cx-5} ${cy+4.4}Z" fill="${P}"/>`;
      else e+=`<path d="M${cx-4.3} ${cy-.6} Q${cx} ${cy-3.6} ${cx+4.3} ${cy-.6}" stroke="${F?'#1a1a1a':sh(P,-.5)}" stroke-width="${F?1.5:1}" fill="none"/>`;
      if(F)e+=`<path d="M${L?cx-4.3:cx+4.3} ${cy-1} L${L?cx-6:cx+6} ${cy-2.4}" stroke="#1a1a1a" stroke-width="1.1" stroke-linecap="round"/>`;
      if(age>=62&&md!=='cansado')e+=`<path d="M${cx-3.6} ${cy+3.6} Q${cx} ${cy+5} ${cx+3.6} ${cy+3.6}" stroke="${Pd}" stroke-width="1" fill="none"/>`;return e};
    const BR={neutro:[[45,44.2],[50.5,42.4],[56,43.6]],feliz:[[45,43.2],[50.5,40.4],[56,42.2]],triste:[[45,45.4],[50.5,44.2],[56,41.4]],tilt:[[45,41.8],[50.5,42.8],[56,46.4]],cansado:[[45,45.4],[50.5,44.6],[56,45.2]],confiante:[[45,44.2],[50.5,42.4],[56,43.6]]}[md]||[[45,44],[50,42.4],[56,43.6]];
    const bl=b=>`M${b[0][0]} ${b[0][1]} Q${b[1][0]} ${b[1][1]} ${b[2][0]} ${b[2][1]}`,br=b=>`M${120-b[0][0]} ${b[0][1]-(md==='confiante'?2.4:0)} Q${120-b[1][0]} ${b[1][1]-(md==='confiante'?3:0)} ${120-b[2][0]} ${b[2][1]-(md==='confiante'?1:0)}`;
    const brows=`<path d="${bl(BR)} ${br(BR)}" stroke="${o.hair==='careca'||o.hair==='raspado'?sh(H,-.1):sh(H,-.18)}" stroke-width="${F?1.8:2.5}" stroke-linecap="round" fill="none"/>`;
    const nose=`<path d="M60.5 54 Q58.6 59.6 57 61.4 Q60 63.2 63 61.4" fill="none" stroke="${sh(P,-.3)}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="60" cy="58" rx="1.4" ry="3.4" fill="#fff" opacity=".18"/>`;
    const mouth={feliz:`<path d="M52.5 65 Q60 75 67.5 65 Q60 67.6 52.5 65Z" fill="#5a1f22"/><path d="M54 65.7 Q60 67.8 66 65.7 L65.3 67.2 Q60 68.9 54.7 67.2Z" fill="#fff"/><path d="M56 71 Q60 72.4 64 71" stroke="#e0707a" stroke-width="1.6" fill="none" opacity=".7"/>`,
      triste:`<path d="M54.5 69.2 Q60 65.2 65.5 69.2" stroke="${lip}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
      tilt:`<path d="M53.5 69.6 Q60 65 66.5 69.6" stroke="#6a2a2a" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M56 67.8 L64 67.8" stroke="#fff" stroke-width="1.2" opacity=".8"/>`,
      cansado:`<ellipse cx="60" cy="68" rx="2.8" ry="1.8" fill="#5a1f22"/>`,
      confiante:`<path d="M54.5 67.6 Q61.5 69.4 66.6 64.6" stroke="${lip}" stroke-width="2" fill="none" stroke-linecap="round"/>`}[md]||(F?`<path d="M54 67 Q57 65.2 60 66.2 Q63 65.2 66 67 Q60 70.6 54 67Z" fill="${lip}"/><path d="M54.6 67 Q60 68 65.4 67" stroke="${sh(lip,-.35)}" stroke-width=".7" fill="none"/>`:`<path d="M54.5 67 Q60 68.6 65.5 67" stroke="${lip}" stroke-width="1.9" fill="none" stroke-linecap="round"/>`);
    const lipF=F&&md==='feliz'?`<path d="M52.5 65 Q60 75 67.5 65" stroke="${lip}" stroke-width="1.4" fill="none"/>`:'';
    /* cabelo da frente */
    const front={curto:`<path d="M37 50 C35 30 46 22 60 22 C75 22 86 30 83 50 C81 42 78 37 72 35 C64 38 52 38 44 36 C40 39 38 44 37 50Z" fill="${hf}"/>`,
      topete:`<path d="M37 50 C35 32 42 18 58 16 C72 14 85 24 83 50 C81 42 78 36 72 34 C62 37 50 36 44 35 C40 39 38 44 37 50Z" fill="${hf}"/><path d="M48 24 Q60 16 74 22" stroke="${sh(H,.35)}" stroke-width="2" fill="none" opacity=".6"/>`,
      raspado:`<path d="M38.5 46 C39 29 49 24 60 24 C71 24 81 29 81.5 46 C77 37 70 34 60 34 C50 34 43 37 38.5 46Z" fill="${H}" opacity=".5"/>`,
      calvo:`<path d="M37.5 54 C36.5 43 38.5 38 42 35.5 L43 48Z M82.5 54 C83.5 43 81.5 38 78 35.5 L77 48Z" fill="${hf}"/><ellipse cx="54" cy="35" rx="8" ry="3.2" fill="#fff" opacity=".22"/>`,
      careca:`<ellipse cx="54" cy="35" rx="8" ry="3.2" fill="#fff" opacity=".25"/>`,
      cacheado:`<g fill="${hf}"><circle cx="40" cy="42" r="8.5"/><circle cx="46" cy="31" r="9"/><circle cx="57" cy="25" r="10"/><circle cx="69" cy="26" r="9.5"/><circle cx="78" cy="33" r="9"/><circle cx="81" cy="44" r="8"/></g><g fill="${sh(H,.28)}" opacity=".5"><circle cx="54" cy="22" r="2.6"/><circle cx="68" cy="23" r="2.2"/></g>`,
      longo:`<path d="M38 60 C34 34 46 24 60 24 C74 24 86 34 82 60 C80 46 76 38 66 34 C58 40 46 42 40 47 C39 51 38.5 55 38 60Z" fill="${hf}"/><path d="M39 62 C37 80 39 96 45 104 C46 92 46 80 43 66Z M81 62 C83 80 81 96 75 104 C74 92 74 80 77 66Z" fill="${hf}"/>`,
      chanel:`<path d="M37 52 C35 30 48 24 60 24 C72 24 85 30 83 52 C77 42 69 37 60 37 C51 37 43 42 37 52Z" fill="${hf}"/>`,
      coque:`<circle cx="60" cy="19" r="10" fill="${hf}"/><path d="M38 48 C37 30 48 26 60 26 C72 26 83 30 82 48 C78 38 70 34 60 34 C50 34 42 38 38 48Z" fill="${hf}"/>`,
      rabo:`<path d="M38 48 C37 30 48 26 60 26 C72 26 83 30 82 48 C78 38 70 34 60 34 C50 34 42 38 38 48Z" fill="${hf}"/><circle cx="78" cy="36" r="3" fill="${x.tie||'#c0396b'}"/>`,
      franja:`<path d="M38 50 C36 28 48 22 60 22 C72 22 84 28 82 50 L81 41.4 Q60 44.6 39 41.4Z" fill="${hf}"/>`}[o.hair]||'';
    /* barba */
    const bd={curta:`<path d="M40 58 C41 74 50 81 60 81 C70 81 79 74 80 58 C78 68 72 73 60 73 C48 73 42 68 40 58Z" fill="${H}" opacity=".38"/><path d="M53 64.6 Q60 62.4 67 64.6 Q60 63.8 53 64.6Z" fill="${H}" opacity=".5"/>`,
      cheia:`<path d="M38 54 C38 77 48 87 60 87 C72 87 82 77 82 54 C80 66 74 72 66 70.5 Q60 69 54 70.5 C46 72 40 66 38 54Z" fill="${hf}"/><path d="M52 65.6 Q56 62 60 63.6 Q64 62 68 65.6 Q64 64.8 60 65.8 Q56 64.8 52 65.6Z" fill="${H}"/>`,
      bigode:`<path d="M51 66 Q55 61.6 60 63.4 Q65 61.6 69 66 Q65 64.6 60 65.6 Q55 64.6 51 66Z" fill="${H}"/>`,
      cavanhaque:`<path d="M54 72 C54 80 57 83 60 83 C63 83 66 80 66 72 C63 75 57 75 54 72Z" fill="${H}"/><path d="M53 65 Q60 62.4 67 65 Q60 64 53 65Z" fill="${H}"/>`}[o.beard]||'';
    const gl={redondo:`<g fill="#fff" fill-opacity=".1" stroke="#2a2a2a" stroke-width="1.6"><circle cx="50.5" cy="52" r="5.6"/><circle cx="69.5" cy="52" r="5.6"/></g><path d="M56 51.6 Q60 49.8 64 51.6 M44.9 51 L39 49 M75.1 51 L81 49" stroke="#2a2a2a" stroke-width="1.4" fill="none"/>`,
      quadrado:`<g fill="#fff" fill-opacity=".1" stroke="#1d1d1d" stroke-width="1.8"><rect x="43.5" y="47.4" width="13.4" height="9.4" rx="2.4"/><rect x="63.1" y="47.4" width="13.4" height="9.4" rx="2.4"/></g><path d="M56.9 51 L63.1 51 M43.5 50 L39 48.6 M76.5 50 L81 48.6" stroke="#1d1d1d" stroke-width="1.6"/>`,
      escuro:`<path d="M42.5 47 L57.5 47 L56.6 54 Q55 58 50 58 Q44 58 43 53Z M62.5 47 L77.5 47 L77 53 Q76 58 70 58 Q65 58 63.4 54Z" fill="#111"/><path d="M57.5 48.4 L62.5 48.4 M42.5 48 L39 47 M77.5 48 L81 47" stroke="#111" stroke-width="1.8"/><path d="M45 49 L49 49 M65 49 L69 49" stroke="#fff" stroke-width="1.2" opacity=".45"/>`,
      neon:`<defs><linearGradient id="${id}n" x1="0" x2="1"><stop offset="0" stop-color="#2de2e6"/><stop offset="1" stop-color="#ff3cac"/></linearGradient></defs><path d="M41 47 L79 47 L78 54 Q77 58 70 58 Q64 58 62 53 L58 53 Q56 58 50 58 Q43 58 42 54Z" fill="url(#${id}n)"/><path d="M45 49 L52 49" stroke="#fff" stroke-width="1.3" opacity=".7"/>`}[o.gl]||'';
    const hat={cartola:`<rect x="41" y="4" width="38" height="24" rx="2" fill="#141414"/><rect x="41" y="21" width="38" height="4.5" fill="#7a1f2a"/><ellipse cx="60" cy="29" rx="28" ry="4.6" fill="#0d0d0d"/><path d="M45 6 L45 20" stroke="#fff" stroke-width="1.4" opacity=".14"/>`,
      coroa:`<path d="M39 33 L41 13 L51 24 L60 8 L69 24 L79 13 L81 33Z" fill="#e9c35a" stroke="#a8842a" stroke-width="1.2"/><rect x="39" y="29" width="42" height="5" fill="#d4ab3e"/><circle cx="60" cy="22" r="2.4" fill="#c0392b"/><circle cx="48" cy="27" r="1.8" fill="#2d5d9a"/><circle cx="72" cy="27" r="1.8" fill="#2d8a5a"/>`,
      bone:`<path d="M36 41 C36 20 84 20 84 41 Z" fill="${x.capC||'#c9302c'}"/><path d="M80 39 C93 39 99 42 99 44 L80 44Z" fill="${sh(x.capC||'#c9302c',-.2)}"/><circle cx="60" cy="23" r="2" fill="${sh(x.capC||'#c9302c',-.2)}"/>${x.capLogo?`<text x="60" y="38" font-size="10" text-anchor="middle">${x.capLogo}</text>`:''}`,
      chapeu:`<ellipse cx="60" cy="34" rx="32" ry="6" fill="#d9b56a"/><path d="M42 34 C42 16 78 16 78 34Z" fill="#e6c37a"/><rect x="42" y="28" width="36" height="4" fill="#8a5a2a"/>`}[x.hat]||'';
    const watch=x.watch?`<g><rect x="6" y="99" width="22" height="9" rx="3" fill="${P}"/><rect x="14" y="96" width="9" height="15" rx="2" fill="${x.watch==='ouro'?'#e9c35a':'#333'}"/><circle cx="18.5" cy="103.5" r="3.2" fill="${x.watch==='ouro'?'#2b4a7a':'#ddd'}"/></g>`:'';
    const ring=x.ring?'<circle cx="104" cy="104" r="4" fill="none" stroke="#e9c35a" stroke-width="2.4"/>':'';
    const fx=sz<30?'':{tilt:'<g transform="translate(92 24)" stroke="#ff4a50" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M-6 -2 Q-2 -2 -2 -6 M6 -2 Q2 -2 2 -6 M-6 2 Q-2 2 -2 6 M6 2 Q2 2 2 6"/></g>',
      triste:'<path d="M88 36 Q93 45 88 49 Q83 45 88 36Z" fill="#9ad8ff" stroke="#3a8ac0" stroke-width=".8"/>',
      cansado:'<g fill="#d8e8ff" font-weight="800" font-family="sans-serif"><text x="86" y="32" font-size="12">z</text><text x="95" y="22" font-size="9">z</text></g>'}[md]||'';
    const border=x.bord?`${sq?`<rect x="1" y="1" width="118" height="118" rx="14"`:'<circle cx="60" cy="60" r="58"'} fill="none" stroke="${x.bord}" stroke-width="${x.bw||2.5}"/>`:'';
    return`<svg class="avsvg fsvg" width="${sz}" height="${sz}" viewBox="0 0 120 120"${x.lbl?` aria-label="${x.lbl}"`:''}><defs>${defs}</defs><g clip-path="url(#${id}k)"><rect width="120" height="120" fill="url(#${id}b)"/>${back}${body}${cl}${neck}${chain}${ears}${head}${ear}${wr}${blush}${eye(50.5,1)}${eye(69.5,0)}${brows}${nose}${bd}${mouth}${lipF}${front}${gl}${hat}${watch}${ring}${fx}</g>${border}</svg>`},
  /* quem é quem */
  isF(n){return(typeof FEM!=='undefined'&&FEM.has(n))||['Carla','Elisa','Gabi','Íris'].includes(n)},
  CLJ:[[/Advogad|Empresári|Bancári|Corretor|Contador|Funcionári/,'terno'],[/Médic|Dentista|Enfermeir|Farmac|Chef/,'jaleco'],[/Policial/,'farda'],[/[Ss]treamer|Estudante|Programador|Criador|Influenc|Jogador/,'moletom'],[/Mecânic|Pedreir|Mestre|Agricult|Caminhon|Motorista|Entregador|oficina/,'polo'],[/Professor|Aposent|Arquitet|Jornalist/,'camisa']],
  botMood(n){try{if(!LIVES.on())return'neutro';const st=LIVES.state(n);if(!st)return'neutro';const t=new Set(st.tags.map(x=>x[0]));if(t.has('tilt')||t.has('irrit'))return'tilt';if(t.has('press'))return'triste';if(t.has('cans'))return'cansado';if(t.has('conf'))return'confiante';const m=st.b.mood;return m>=1?'feliz':m<=-1?'triste':'neutro'}catch(e){return'neutro'}},
  botLook(n){const B=(typeof LIVES!=='undefined'&&LIVES.bio&&LIVES.bio(n))||{},g=this.isF(n)?'f':'m',age=B.age||32,o=Object.assign(this.gen('bot:'+n,g,age),{g,age});
    const c=this.CLJ.find(([re])=>re.test(B.job||''));if(c)o.cl=c[1]==='terno'&&g==='f'&&hashN(n)%2?'camisa':c[1];if(g==='f'&&o.cl==='polo')o.cl='camiseta';return o},
  botHat(n){const B=(LIVES.bio&&LIVES.bio(n))||{};return/Agricult/.test(B.job||'')?'chapeu':/Motorista|Entregador|Caminhon/.test(B.job||'')&&hashN(n)%2?'bone':''},
  bot(n,sz,mood){return this.svg(this.botLook(n),sz,{mood:mood||this.botMood(n),hat:this.botHat(n),capC:'#2d5d9a',lbl:n})},
  fam(p,sz){const g=p.id==='mae'||p.id==='irma'?'f':'m',age=p.id==='mae'?56:p.id==='pai'?59:26,o=Object.assign(this.gen('fam:'+p.id+p.nm,g,age),{g,age});if(p.id==='mae')o.cl='blusa';if(p.id==='pai')o.cl=hashN(p.nm)%2?'camisa':'polo';
    return this.svg(o,sz,{mood:p.b>=72?'feliz':p.b<35?'triste':'neutro',lbl:p.nm})},
  LEG:{barao:{g:'m',age:72,hair:'calvo',beard:'bigode',cl:'terno',top:'#1c1c22',bg:'#5a1f2a',skin:'#e3b48f',hc:'#888888',gl:'sem',eye:'#3b2a1e',x:{hat:'cartola',tie:'#7a1f2a',mood:'confiante'}},
    neon:{g:'m',age:23,hair:'topete',beard:'sem',cl:'moletom',top:'#3a1a6a',bg:'#2a1050',skin:'#c68b5e',hc:'#7a3cff',gl:'neon',eye:'#2a2a2a',x:{chain:1,mood:'confiante'}},
    celeste:{g:'f',age:74,hair:'coque',beard:'sem',cl:'blusa',top:'#2f5f6a',bg:'#1f4a4a',skin:'#f1d3b6',hc:'#cfcfcf',gl:'redondo',ear:true,eye:'#3a5a7a',x:{mood:'feliz'}},
    prof:{g:'m',age:58,hair:'calvo',beard:'curta',cl:'camisa',top:'#dfe6ee',bg:'#1f2f4a',skin:'#e3b48f',hc:'#5b4a3a',gl:'quadrado',eye:'#3b2a1e',x:{mood:'neutro'}},
    rei:{g:'m',age:50,hair:'curto',beard:'cheia',cl:'terno',top:'#141a2a',bg:'#6a4a1f',skin:'#8d5a3b',hc:'#1b1410',gl:'sem',eye:'#2a2a2a',x:{hat:'coroa',tie:'#c9a63e',chain:1,mood:'confiante'}}},
  leg(L,sz,mood){const d=this.LEG[L.id];if(!d)return`<span style="font-size:${sz*.6}px">${L.emo}</span>`;const{x,...o}=d;return this.svg(o,sz,Object.assign({},x,mood?{mood}:{},{lbl:L.nm}))},
  person(p,sz,mood){if(!p)return'';const lk=p.look||(p.look=PAV.gen(p.id||p.nm,p.g)),r=this.rnd('pp:'+(p.id||p.nm)),g=p.g||'f',age=p.age||28;
    const o={g,age,skin:lk.skin,hc:lk.hc,hair:lk.hair,top:lk.top,bg:lk.bg,beard:lk.beard||'sem',ear:!!lk.ear,gl:lk.gl||(lk.glasses?(r()<.5?'redondo':'quadrado'):'sem'),eye:lk.eye||this.EYE[Math.floor(r()*this.EYE.length)],cl:lk.cl||(g==='f'?['blusa','camiseta','blusa','jaqueta'][Math.floor(r()*4)]:['camiseta','camisa','polo','jaqueta'][Math.floor(r()*4)])};
    const L=LIFE.s&&LIFE.s.love,m=mood||(L&&L===p?(p.b>=60?'feliz':p.b<25?'triste':'neutro'):'feliz');return this.svg(o,sz,{mood:m,sq:sz>80,lbl:p.nm})},
  /* o jogador, com o que veste */
  me(ctx,sz){if(!LIFE.s||typeof OUT==='undefined')return'';const Ls=OUT.st(),A=Ls.av,W=c=>Ls[ctx]&&Object.values(Ls[ctx]).includes(c);
    const cl=W('terno')?'terno':W('jaqueta')?'jaqueta':W('camisa')?'camisa':W('moletom')?'moletom':'camiseta';
    const o={g:A.g||'m',age:LIFE.s.age||28,skin:this.SKIN[A.pele||0]||'#c68b5e',hc:A.cor||'#2b1d14',hair:A.cab==='careca'?'careca':(A.cab||'curto'),beard:A.barba||'sem',cl,top:{terno:'#1f2a44',jaqueta:'#1d1d1f',camisa:'#f2f2f2',moletom:'#6b7380',camiseta:'#3f7d64'}[cl],bg:'#1f6a50',eye:'#3b2a1e',gl:W('oculos')?'escuro':'sem'};
    const s=LIFE.s,mood=s.energy!=null&&s.energy<25?'cansado':s.mood>=1?'feliz':s.mood<=-1?'triste':'neutro',sp=LIFE.sps&&LIFE.sps()[0];
    return this.svg(o,sz,{mood,hat:W('bone')?'bone':'',capLogo:sp?sp.emo:'',chain:W('corrente'),watch:W('patek')||W('rolex')||W('relogio')?'ouro':W('ultra')||W('gshock')?'aco':'',ring:W('anel'),bord:s.hof?'#f0c96e':'rgba(255,255,255,.18)',bw:s.hof?3:2,lbl:'Seu avatar'})}};
/* todo mundo usa o mesmo desenhista */
PAV.svg=function(p,sz){return FACE.person(p,sz)};
AV.svg=function(ctx,sz){return FACE.me(ctx,sz)};
/* fichas voando: apostas indo pro pote e pote indo pro vencedor */
const CHIPFX={
  layer(tb){const par=tb.parentElement;if(!par)return null;if(getComputedStyle(par).position==='static')par.style.position='relative';let L=par.querySelector(':scope>.flyL');if(!L){L=document.createElement('div');L.className='flyL';par.appendChild(L)}
    L.style.left=tb.offsetLeft+'px';L.style.top=tb.offsetTop+'px';L.style.width=tb.offsetWidth+'px';L.style.height=tb.offsetHeight+'px';return L},
  fly(tb,from,to,n,kind){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const L=this.layer(tb);if(!L)return;
    for(let i=0;i<n;i++){const c=document.createElement('div');c.className='flychip'+(kind?' '+kind:'');const j=()=>(Math.random()-.5)*2.4;c.style.left=(from[0]+j())+'%';c.style.top=(from[1]+j())+'%';L.appendChild(c);
      setTimeout(()=>{c.style.left=(to[0]+j())+'%';c.style.top=(to[1]+j())+'%';c.style.opacity='0'},30+i*55);setTimeout(()=>c.remove(),700+i*55)}},
  pos(el){return[parseFloat(el.style.left),parseFloat(el.style.top)]}};
{const _rt=Table.prototype.renderTable;Table.prototype.renderTable=function(){const tb=this.$&&this.$('table'),g=this.g;
  const old=tb?[...tb.querySelectorAll('.pchip')].map(e=>CHIPFX.pos(e)):[];_rt.apply(this,arguments);
  try{if(!tb||!g)return;const now=tb.querySelectorAll('.pchip').length,C=[50,49];
    if(old.length&&!now&&this._fxH===g.hands)old.forEach((p,i)=>CHIPFX.fly(tb,p,C,3,i%3===1?'g':i%3===2?'k':''));
    if(g.over&&this._fxO!==g.hands){this._fxO=g.hands;const seats=tb.querySelectorAll('.pseat');g.players.forEach((p,i)=>{if(p.won>0&&seats[i])setTimeout(()=>CHIPFX.fly(tb,C,CHIPFX.pos(seats[i]),7,i%2?'g':''),old.length?380:60)})}
    this._fxH=g.hands}catch(e){}}}
