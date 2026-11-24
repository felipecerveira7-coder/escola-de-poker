/* =============== v66: itens novos com efeitos novos (mente, estudo, grind online, viagem, roupas) + o que cada peça rende no closet =============== */
/* efeitos novos: cabeça fria (calm), cartões de tempo (tcard), viagem (trav), rakeback (rbk), estudo (study) */
Object.assign(ICAP,{calm:.5,tcard:2,trav:.4,rbk:.15,study:.5});
LCATS.splice(1,0,['mente','🧘','Mente e foco'],['estudo','📖','Estudo'],['online','🖥️','Grind online']);
ITEMS.push(
  {id:'meditacao',cat:'mente',nm:'App de meditação (plano anual)',emo:'🧘',price:299,calm:.1,desc:'Dez minutos antes do torneio. Respira, solta o ombro, joga a próxima mão.'},
  {id:'diario',cat:'mente',nm:'Caderno de sessões (diário de tilt)',emo:'📓',price:89,calm:.05,desc:'Anota o que te tirou do sério. Na terceira vez você já vê o padrão chegando.'},
  {id:'ruido',cat:'mente',nm:'Máquina de ruído branco',emo:'🌊',price:229,calm:.03,regen:1,desc:'Chuva de fundo pra dormir depois de um bust doído.'},
  {id:'psico',cat:'mente',nm:'Psicólogo do esporte (mensal)',emo:'🧠',price:1200,calm:.25,mood:.05,upk:1200,desc:'O que os grandes fazem e não contam: alguém pra organizar a cabeça toda semana.'},
  {id:'ioga',cat:'mente',nm:'Tapete e aulas de ioga online',emo:'🧎',price:349,calm:.06,regen:1,desc:'Alonga as costas de 12 horas sentado e baixa a ansiedade.'},
  {id:'tracker',cat:'estudo',nm:'Tracker de mãos com HUD',emo:'📊',price:450,study:.12,desc:'Guarda cada mão que você joga. Revisar vira hábito.'},
  {id:'solver',cat:'estudo',nm:'Solver GTO (assinatura)',emo:'🧮',price:2400,study:.22,upk:200,desc:'Mostra a jogada ótima em cada spot. Treino rende muito mais.'},
  {id:'curso',cat:'estudo',nm:'Curso de torneios com um pro',emo:'🎓',price:1997,study:.15,desc:'Aulas gravadas sobre ICM, bolha e mesa final.'},
  {id:'coach',cat:'estudo',nm:'Mentoria com coach (4 aulas)',emo:'🧑‍🏫',price:4000,study:.25,calm:.05,desc:'Alguém olhando suas mãos e dizendo onde você vaza fichas.'},
  {id:'ranges',cat:'estudo',nm:'Cartela de ranges plastificada',emo:'🗂️',price:59,tcard:1,desc:'Decisão de pré-flop na ponta da língua: sobra tempo pras difíceis.'},
  {id:'xadrez',cat:'estudo',nm:'Relógio de xadrez pra treino',emo:'♟️',price:159,tcard:1,desc:'Treina decidir sob pressão. Na mesa, o tempo rende mais.'},
  {id:'vip',cat:'online',nm:'Clube VIP da sala online (anual)',emo:'💠',price:1500,rbk:.1,upk:125,desc:'Rakeback maior em todo o cash online.'},
  {id:'nobreak',cat:'online',nm:'Nobreak + internet de backup',emo:'🔌',price:899,rbk:.03,tire:1,desc:'Caiu a luz no meio do grind? Não pra você.'},
  {id:'azul',cat:'online',nm:'Óculos com filtro de luz azul',emo:'👓',price:249,regen:1,desc:'Olho descansado depois de 8 horas de tela. Vai no rosto: se usar na mesa, tira os óculos escuros.'},
  {id:'setup',cat:'online',nm:'Setup de grind (2 monitores + braço articulado)',emo:'🖥️',price:3900,rbk:.04,tire:2,desc:'Mais mesas abertas sem se perder. Grind rende mais.'},
  {id:'milhas',cat:'viag',nm:'Cartão black com milhas',emo:'💳',price:1200,trav:.2,status:1,upk:100,desc:'Passagem com milhas e upgrade de assento. Viagem pros festivais sai mais barata.'},
  {id:'salavip',cat:'viag',nm:'Acesso a sala VIP de aeroporto (anual)',emo:'🛋️',price:690,trav:.1,regen:1,desc:'Cochilo e comida boa antes do voo pro torneio.'},
  {id:'jetlag',cat:'viag',nm:'Kit anti-jet lag (máscara e melatonina)',emo:'😴',price:119,trav:.08,desc:'Chega em Las Vegas sem parecer zumbi.'},
  {id:'hoodie',cat:'moda',nm:'Moletom com capuz de marca',emo:'🧥',price:890,post:.03,desc:'O uniforme da nova geração do poker. Confortável na mesa.'},
  {id:'blazer',cat:'moda',nm:'Blazer de alfaiataria',emo:'🧥',price:1600,love:2,desc:'Arrumado sem parecer formatura. Conta como roupa social.'},
  {id:'bucket',cat:'moda',nm:'Chapéu bucket',emo:'👒',price:180,post:.03,desc:'Estilo de quem joga online e aparece na live.'});
OUT.SLOTS.forEach(S=>{if(S[0]==='tronco')S[3].push('hoodie','blazer');if(S[0]==='olhos')S[3].push('azul');if(S[0]==='cab')S[3].push('bucket')});
{const _f=OUT.formal;OUT.formal=function(ctx){return _f.call(this,ctx)||this.wear(ctx,'blazer')}}
/* conforto na mesa vale pro moletom com capuz também */
{const _os=LIFE.onStart;LIFE.onStart=function(kind){_os.apply(this,arguments);try{if(kind==='tour'&&this.s&&OUT.wear('mesa','hoodie')&&!OUT.wear('mesa','moletom')&&!OUT.wear('mesa','corrida')){this.s.energy=Math.min(100,this.s.energy+3);this.commit()}}catch(e){}}}
/* cabeça fria: o desgaste mental sobe menos */
{const _b=SOC.burnAdd;SOC.burnAdd=function(v){if(v>0)v*=1-LIFE.ifx('calm');return _b.call(this,v)}}
/* cartões de tempo extras no começo de cada mesa */
{const P=Table.prototype,_ti=P.tbInit;P.tbInit=function(){const had=!!(this.g&&this.g.tb),r=_ti.apply(this,arguments);try{if(!had&&LIFE.s){const k=Math.floor(LIFE.ifx('tcard'));if(k>0){r.n+=k;const g=this.g;setTimeout(()=>this.g===g&&this.log(`<span class="ok">⏱ +${k} cartão${k>1?'ões':''} de tempo pelos seus itens de estudo.</span>`),400)}}}catch(e){}return r}}
/* rakeback online */
{const _rb=ONL.rb;ONL.rb=function(){return _rb.apply(this,arguments)+(LIFE.s?LIFE.ifx('rbk'):0)}}
/* viagem: desconto na passagem e menos jet lag */
{const _rg=CAL.register;CAL.register=function(key){const r0=_rg.apply(this,arguments);try{const r=this.st().reg[key],t=LIFE.ifx('trav');if(r&&r.tr>0&&!r.trd&&t>0){const d=Math.round(r.tr*t);if(d>0){WALLET.add(d,'Desconto na viagem (milhas e cartão)');r.tr-=d;r.trd=1;LIFE.commit()}}}catch(e){}return r0}}
{const _n=LIFE.note;LIFE.note=function(emo,title,body){if(/^Fuso horário/.test(title||'')&&LIFE.s){const t=LIFE.ifx('trav');if(t>0){const back=Math.round(15*t*2);LIFE.s.energy=Math.min(100,LIFE.s.energy+back);body=`Seis horas de diferença, mas seus itens de viagem ajudaram: −${15-back} de energia.`}}return _n.call(this,emo,title,body)}}
/* estudo: o treino rende em dobro às vezes */
{const _sa=SOC.act;SOC.act=function(op){const P=this.st&&this.st().prop,before=P?P.prog:null,r=_sa.apply(this,arguments);try{if(op==='train'&&P&&P.prog===before+1&&Math.random()<LIFE.ifx('study')){P.prog++;LIFE.commit();return r+` 📖 Com o material de estudo, o treino rendeu em dobro (${P.prog}/${P.need}).`}}catch(e){}return r}}
/* textos dos efeitos novos (loja, perfil e closet) */
Object.assign(IFXN,{calm:'desgaste mental a menos',tcard:'cartão de tempo',trav:'desconto em viagem',rbk:'rakeback online',study:'chance de treino em dobro'});
function ifxNew(x){const a=[];if(x.calm)a.push(`desgaste mental −${Math.round(x.calm*100)}%`);if(x.tcard)a.push(`+${x.tcard} cartão de tempo nas mesas`);if(x.trav)a.push(`viagem ${Math.round(x.trav*100)}% mais barata e menos jet lag`);if(x.rbk)a.push(`+${Math.round(x.rbk*100)}% de rakeback online`);if(x.study)a.push(`${Math.round(x.study*100)}% de chance do treino render em dobro`);return a}
{const _t=ifxTxt;ifxTxt=function(x){let t=_t(x);const n=ifxNew(x);if(n.length){t=t.replace('Só pelo prazer de ter.','');t=(n.join(' · ')+(t?' · '+t:'')).replace(/ · $/,'')}return t}}
{const _p=itemPanel;itemPanel=function(){let h=_p();if(!LIFE.s)return h;const r=k=>itemRaw(k,LIFE.s.items),row=(ic,nm,k,fmt)=>{const raw=r(k);if(!raw)return'';const ef=LIFE.ifx(k);return`<div class="ifr"><span>${ic} ${nm}</span><b>${fmt(ef)}</b>${raw>ICAP[k]?`<span class="muted">limite ${fmt(ICAP[k])}; acima rende 1/4</span>`:''}</div>`};
  const add=row('🧘','Desgaste mental a menos','calm',v=>Math.round(v*100)+'%')+row('⏱','Cartões de tempo extras','tcard',v=>'+'+Math.floor(v))+row('✈️','Desconto em viagem','trav',v=>Math.round(v*100)+'%')+row('💠','Rakeback online extra','rbk',v=>'+'+Math.round(v*100)+'%')+row('📖','Treino em dobro','study',v=>Math.round(v*100)+'%');
  return h.replace(/<div class="ifr"><span>💎 Status/,add+'<div class="ifr"><span>💎 Status')}}
/* closet: o que cada peça rende */
const WEARFX={mesa:{moletom:'🛋️ torneio cansa −3',corrida:'🛋️ torneio cansa −3',hoodie:'🛋️ torneio cansa −3',oculos:'🕶️ esconde o seu tempo dos bots',azul:'👓 tira os óculos escuros: seu tempo fica à mostra',terno:'📸 rende mais fama na coletiva',camisa:'📸 rende mais fama na coletiva',blazer:'📸 rende mais fama na coletiva'},
  role:{terno:'🍷 +2 no jantar e no chique · −1 em lanche e cinema',camisa:'🍷 +2 no jantar e no chique',blazer:'🍷 +2 no jantar e no chique',perfume:'🌫️ +1 no clima do encontro',nicho:'🌫️ +1 no clima do encontro'}};
function clFx(x,ctx){const w=(WEARFX[ctx]||{})[x.id]||(ctx==='mesa'&&x.price>=40000?'💎 à mostra: os bots comentam (rivais provocam)':'');const own=x.id==='oculos'?'':ifxTxt(x).replace(/<[^>]+>/g,'').replace('Só pelo prazer de ter.','');
  return`${w?`<span class="clw">${w}</span>`:''}${own?`<span class="clo">sempre: ${own}</span>`:''}`}
{const _r=OUT.render;OUT.render=function(){const r=_r.apply(this,arguments);try{const ov=document.getElementById('clOv');if(!ov)return r;const t=(ov.querySelector('.lcats .on')||{}).dataset;const ctx=t&&t.cl?t.cl.split('|')[1]:'mesa';
  ov.querySelectorAll('[data-cl]').forEach(b=>{const p=b.dataset.cl.split('|');if(p.length!==3||p[0]==='av'||b.textContent.startsWith('✖'))return;const x=ITEMS.find(i=>i.id===p[2]);if(!x||b.querySelector('.clfx'))return;const fx=clFx(x,ctx);if(fx)b.insertAdjacentHTML('beforeend',`<small class="clfx">${fx}</small>`)})}catch(e){console.warn(e)}return r}}
