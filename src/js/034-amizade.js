/* ----- amizade: níveis, vantagens, convites, aniversários ----- */
const FR={
  LV:[[4.5,'Irmão','🫂'],[3.5,'Parceiro','🤜🤛'],[2,'Amigo','🤝'],[1,'Chegado','🙂']],
  lv(n){const r=LIFE.rel(n);const i=this.LV.findIndex(x=>r>=x[0]);return i<0?0:4-i},
  name(n){const r=LIFE.rel(n),x=this.LV.find(x=>r>=x[0]);return x?x[2]+' '+x[1]:''},
  perks(n){const l=this.lv(n);return[[2,'🤝 Amigo','Te manda dicas sobre o estado dos outros jogadores.'],[3,'🤜🤛 Parceiro','Troca 5% de action com você: se os dois jogarem o mesmo torneio, cada um leva 5% do prêmio do outro.'],[4,'🫂 Irmão','Te indica pras marcas: mais propostas de patrocínio.']].map(([k,t,d])=>`<div style="font-size:13px;padding:2px 0">${l>=k?'✅':'🔒'} <b>${t}</b>: ${d}</div>`).join('')},
  bd(n){const h=hashN(n+'bday'),m=h%12,d=1+((h>>4)%28);return{m,d,txt:`${String(d).padStart(2,'0')}/${String(m+1).padStart(2,'0')}`}},
  isBd(n,d){const t=CAL.date(d),b=this.bd(n);return t.getMonth()===b.m&&t.getDate()===b.d},
  seen(n){const s=LIFE.s;s.seen=s.seen||{};s.seen[n]=CAL.today()},
  daily(d){const s=LIFE.s;if(!s||!LIVES.s)return;s.seen=s.seen||{};const bots=Object.keys(LIVES.s.bots).filter(n=>LIVES.bio(n));
    /* aniversários */
    s.bds={d,l:bots.filter(n=>this.isBd(n,d)&&LIFE.rel(n)>=1),done:[]};s.bds.l.forEach(n=>LIFE.note('🎂',`Hoje é aniversário de ${n}`,`${FR.name(n)||'Conhecido'}. Mande parabéns pelo Celular${LIFE.rel(n)>=2?': amigo que esquece aniversário perde ponto':''}.`));
    /* convite dos amigos */
    s.finv=null;const cand=bots.filter(n=>LIFE.rel(n)>=1.5&&LIVES.s.bots[n].bank>300).sort(()=>Math.random()-.5);
    if(cand.length&&Math.random()<.35){const n=cand[0],k=OUTX.top(n),A=OUTA[k];s.finv={n,k,d};LIFE.text(n,pickA([`Bora ${A.nm.toLowerCase()} hoje? Cada um paga o seu 🍻`,`Tô a fim de ${A.nm.toLowerCase()} hoje. Cola?`,`E aí, sumido! ${A.nm} hoje, topa?`]),{k:'inv'})}
    /* dicas de amigo */
    bots.filter(n=>this.lv(n)>=2).forEach(n=>{if(Math.random()>=.12)return;const o=bots.filter(m=>m!==n&&LIVES.state(m)&&LIVES.state(m).tags.length);if(!o.length)return;const m=pickA(o),tg=LIVES.state(m).tags[0];
      LIFE.text(n,pickA([`Dica: ${m} tá ${tg[0]==='tilt'?'tiltado, joga solto':tg[0]==='press'?'apertado de grana, vai arriscar':tg[0]==='cans'?'morto de cansado':'numa fase estranha'}. Se pegar ele na mesa, aproveita.`,`Fica ligado no ${m}: ${tg[2].toLowerCase()}`]))});
    /* irmão indica marca */
    if(bots.some(n=>this.lv(n)>=4)&&Math.random()<.1){try{const b=s.offers.length;LIFE.genOffer();if(s.offers.length>b){const n=pickA(bots.filter(n=>this.lv(n)>=4));LIFE.text(n,'Falei bem de você pro pessoal de uma marca. Olha a aba Marcas 😉')}}catch(e){}}
    /* sumiço esfria amizade */
    bots.forEach(n=>{const r=LIFE.rel(n),last=s.seen[n];if(r>=2&&last!=null&&d-last>12)LIVES.relAdd(n,'Você',-.12);if(last==null)s.seen[n]=d})},
  endDay(d){const s=LIFE.s;if(!s)return;
    if(s.bds&&s.bds.d===d)s.bds.l.filter(n=>!s.bds.done.includes(n)&&LIFE.rel(n)>=2).forEach(n=>{LIVES.relAdd(n,'Você',-.3);LIVES.note(n,`${CIRC.me()} esqueceu o aniversário dele.`);LIFE.note('😕',`${n} reparou que você esqueceu o aniversário`,'Amizade −0,3.')});
    if(s.finv&&s.finv.d===d&&!s.finv.ans){const n=s.finv.n;LIVES.relAdd(n,'Você',-.3);LIFE.note('📵',`Você deixou ${n} no vácuo`,'Ele te chamou pra sair e você nem respondeu. Amizade −0,3.')}},
  bdSend(n){const s=LIFE.s;if(!s.bds||!s.bds.l.includes(n)||s.bds.done.includes(n))return'';s.bds.done.push(n);LIFE.mine(n,pickA(['Feliz aniversário!! Muita saúde e muito river a favor 🎂','Parabéns, parceiro! Que venha um ano de mesa final 🏆','Feliz aniversário! Hoje a primeira rodada é por minha conta 🍻']));
    LIVES.relAdd(n,'Você',LIFE.rel(n)>=2?.8:.4);this.seen(n);LIFE.text(n,pickA(['Valeu demais! 🙏','Que moral, obrigado!','Lembrou! Valeu, irmão 😄']));LIVES.commit();LIFE.commit();return'🎂 Parabéns enviado.'},
  answer(yes){const s=LIFE.s,v=s.finv;if(!v||v.ans)return'';v.ans=yes?'y':'n';const n=v.n;
    if(!yes){LIFE.mine(n,'Hoje não vai dar, foi mal!');LIVES.relAdd(n,'Você',-.1);LIFE.commit();return'Você recusou.'}
    const old=OUTX.mode;OUTX.mode='racha';const m=OUTX.go(n,v.k);OUTX.mode=old;if(/^Vocês já|duas vezes|Não dá|sem energia|Saldo/.test(m)){v.ans=null;return m}LIFE.mine(n,'Bora!');LIVES.relAdd(n,'Você',.2);LIFE.commit();return m},
  /* troca de action com parceiros */
  tour:{},swap(o){const s=LIFE.s;let txt=[];Object.entries(this.tour).forEach(([n,r])=>{if(this.lv(n)<3)return;const his=r.prize||0,mine=o.prize||0,v=Math.round(his*.05)-Math.round(mine*.05);if(!his&&!mine)return;
      if(v)WALLET.add(v,`Troca de 5% com ${n}`);LIVES.s.bots[n].bank-=v;txt.push(`${n} ${v>=0?`te passou R$ ${brl(v)}`:`recebeu R$ ${brl(-v)}`}`)});
    if(txt.length)LIFE.note('🤜🤛','Troca de action com os parceiros',txt.join(' · ')+'.');this.tour={}}};

