/* ----- presentes pra família: gosto de cada um, aniversário vale o dobro, 2 por semana ----- */
const GIFTX=[
  {id:'g_flores',nm:'Buquê de flores',emo:'💐',price:150},{id:'g_cesta',nm:'Cesta de café da manhã',emo:'🧺',price:220},{id:'g_spa',nm:'Dia de spa',emo:'💆',price:450},
  {id:'g_bolo',nm:'Bolo de confeitaria',emo:'🎂',price:120},{id:'g_ingfut',nm:'Ingresso pro jogo do time',emo:'⚽',price:300},{id:'g_camisa',nm:'Camisa oficial do time',emo:'👕',price:450},
  {id:'g_ferr',nm:'Kit de ferramentas',emo:'🧰',price:600},{id:'g_pesca',nm:'Kit de pesca',emo:'🎣',price:800},{id:'g_show',nm:'Ingresso de show',emo:'🎤',price:500},
  {id:'g_bolsa',nm:'Bolsa de grife',emo:'👜',price:6000},{id:'g_jantar',nm:'Jantar com a família toda',emo:'🍽️',price:900},{id:'g_livro',nm:'Livro e kit leitura',emo:'📖',price:150},
  {id:'g_viagem',nm:'Viagem pra Gramado',emo:'🏔️',price:9000},{id:'g_cel',nm:'Celular novo pra família',emo:'📱',price:1500}];
const GCATS=[['esp_g','🎁','Especiais'],['bel','🧴','Beleza'],['joia','💍','Joias'],['moda','👕','Moda'],['tec','📱','Celulares'],['audio','🎧','Áudio'],['info','🎮','Games'],['casa','🛋️','Casa'],['elet','🍳','Cozinha'],['esp','🏋️','Esporte'],['merc','🍷','Bebidas']];
const GTASTE={
  mae:{love:['g_flores','g_spa','g_cesta','g_jantar','g_viagem','pulseira','anel','perfume','airfryer','capsula','robo','skincare','sofa'],like:['bel','joia','casa','elet','g_bolo','g_livro','vinho','g_cel'],hate:['ps5','switch','energetico','creatina','print3d','halteres','g_ferr','bone','champ']},
  pai:{love:['churras','blue','g_pesca','g_ferr','g_ingfut','g_camisa','tv','gshock','relogio','g_jantar','g_viagem'],like:['elet','esp','merc','camisa','corrida','vinho','g_livro','violao','casa'],hate:['skincare','ring','bone','switch','g_spa','g_flores','jordan']},
  irma:{love:['perfume','nicho','skincare','g_bolsa','iphone','airpods','g_show','jbl','g_spa','pulseira'],like:['bel','moda','tec','audio','joia','g_flores','g_cesta','vinho'],hate:['halteres','creatina','g_ferr','g_pesca','churras','g_livro']},
  irmao:{love:['ps5','switch','jordan','iphone','jbl','g_camisa','g_ingfut','airpods','notebook','monitor'],like:['info','tec','audio','esp','moda','g_show','churras','bone'],hate:['skincare','g_flores','g_spa','perfume','g_bolsa','vinil']}};
const GIFT={
  all(){return GIFTX.map(x=>Object.assign({cat:'esp_g'},x)).concat(ITEMS.filter(x=>!['pet','auto','viag','poker','inst'].includes(x.cat)&&!['protetor','moletom','oculos','cadeira','patek','rolex','corrente','relogio','cafe'].includes(x.id)))},
  find(id){return this.all().find(x=>x.id===id)},
  tier(p,x){const T=GTASTE[p.id]||GTASTE.irmao;if(p.fav===x.id)return 4;if(T.love.includes(x.id))return 4;if(T.hate.includes(x.id))return 0;if(T.like.includes(x.id)||T.like.includes(x.cat))return 3;return 2},
  TN:['detestou','não curtiu','achou ok','gostou','amou'],TE:['😖','😕','😐','🙂','😍'],TP:[-6,-3,3,7,12],
  week(){return Math.floor(CAL.today()/7)},
  bday(p){return CAL.items(CAL.today()).find(it=>it.kind==='fam'&&it.ref&&it.ref.fam===p.id&&/Aniversário/.test(it.title))},
  seed(p){if(!p.fav){const T=GTASTE[p.id]||GTASTE.irmao;p.fav=pickA(T.love)}p.gk=p.gk||{};p.gl=p.gl||[];return p},
  give(pid,gid){const p=FAM.get(pid),x=this.find(gid);if(!p||!x)return'';this.seed(p);const bd=this.bday(p),w=this.week();
    if(!bd&&p.gw&&p.gw.w===w&&p.gw.n>=2)return`Você já deu 2 presentes pra ${p.nm} esta semana. Guarde pro próximo (aniversário não tem limite).`;
    const tc=CLK.can(1,'comprar e entregar');if(tc)return tc;const c=x.price;if(!WALLET.can(c))return'Saldo insuficiente.';
    WALLET.add(-c,`Presente pra ${p.nm}: ${x.nm}`);CLK.add(1);
    let t=this.tier(p,x);const rep=p.gl.filter(i=>i===gid).length;if(rep&&t>2)t--;
    let v=this.TP[t];if(t>=3)v+=Math.min(4,Math.max(0,Math.round(Math.log10(c/100)*1.5)));if(bd)v*=2;
    FAM.bond(p,v);p.gk[gid]=this.tier(p,x);p.gl.push(gid);if(p.gl.length>30)p.gl.shift();if(!bd)p.gw=p.gw&&p.gw.w===w?{w,n:p.gw.n+1}:{w,n:1};
    if(t>=3)LIFE.addMood(.5);LIFE.commit();
    const who=p.id==='mae'?'Sua mãe':p.id==='pai'?'Seu pai':p.nm,line=[`"Pra que isso? Guarda pra você…"`,`"Ah… obrigado."`,`"Que gentil, obrigado."`,`"Adorei! Vou usar muito."`,`"Não acredito! Era exatamente o que eu queria!"`][t].replace('obrigado',p.id==='mae'||p.id==='irma'?'obrigada':'obrigado');
    return`${this.TE[t]} ${who} ${this.TN[t]} ${x.emo} ${x.nm}${rep&&this.tier(p,x)>2?' (de novo… já não é surpresa)':''}. ${line} Laço ${v>=0?'+':''}${v}${bd?' (aniversário: vale o dobro)':''}.`},
  hint(p){this.seed(p);const x=this.find(p.fav);return x?`${p.id==='mae'?'Ela':p.id==='pai'?'Ele':p.id==='irma'?'Ela':'Ele'} comentou que anda de olho em ${x.emo} ${x.nm.toLowerCase()}.`:''},
  panel(pid){const p=FAM.get(pid);if(!p)return'';this.seed(p);const c=FAM.gc||'esp_g',L=this.all().filter(x=>x.cat===c).sort((a,b)=>a.price-b.price),w=this.week(),bd=this.bday(p),left=bd?'∞':2-((p.gw&&p.gw.w===w)?p.gw.n:0);
    const known=Object.entries(p.gk).filter(([k,t])=>t>=3).map(([k])=>(this.find(k)||{}).nm).filter(Boolean);
    return`<div class="gpick"><div style="font-size:13px;margin-bottom:6px">${bd?'🎂 <b>Hoje é aniversário!</b> Presente vale o dobro. ':''}Presentes restantes esta semana: <b>${left}</b>. ${known.length?`Já sabe que gosta de: ${known.slice(-6).join(', ')}.`:'Ligue pra descobrir do que gosta: às vezes comentam.'}</div>
      <div class="lcats">${GCATS.map(([k,e,t])=>`<button class="${c===k?'on':''}" data-gc="${k}">${e} ${t}</button>`).join('')}</div>
      <div class="gl">${L.map(x=>{const k=p.gk[x.id];return`<button class="sm" data-gg="${pid}:${x.id}">${x.emo} ${x.nm} · R$ ${brl(x.price)}${k!=null?` ${this.TE[k]}`:''}</button>`}).join('')}</div>
      <p class="muted" style="font-size:11px;margin:6px 0 0">Cada um tem seu gosto: amou, gostou, achou ok, não curtiu ou detestou. Repetir o mesmo presente perde a graça. Presente caro ajuda um pouco, mas acertar o gosto vale muito mais.</p></div>`}};
