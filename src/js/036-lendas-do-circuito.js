/* ----- lendas do circuito ----- */
const LEGS=[
  {id:'barao',nm:'O Barão',emo:'🎩',st:'rock',buy:20000,fame:35,desc:'Joga desde os anos 80 no Clube do Comércio. Paciente como pedra: só entra com mão boa. Roube os blinds dele.'},
  {id:'neon',nm:'Kid Neon',emo:'🕶️',st:'lag',buy:50000,fame:45,desc:'Streamer de 23 anos que ficou rico no online. Aumenta tudo e não respeita ninguém. Pague mais leve.'},
  {id:'celeste',nm:'Dona Celeste',emo:'👵',st:'station',buy:120000,fame:55,desc:'Ex-crupiê de cassino no Uruguai. Paga até o fim pra ver suas cartas. Nunca blefe contra ela.'},
  {id:'prof',nm:'O Professor',emo:'🧮',st:'tag',buy:300000,fame:65,desc:'Matemático que joga com solver na cabeça. Zero tilt, faixas perfeitas.'},
  {id:'rei',nm:'O Rei do Feltro',emo:'👑',st:'tag',buy:1000000,fame:75,desc:'A lenda viva do poker brasileiro. Heads-up de R$ 1 milhão cada lado. Quem vence vira o novo rei.'}];
const LEG={
  st(){const s=LIFE.s;s.leg=s.leg||{};return s.leg},
  open(i){const L=LEGS[i],S=this.st();if(i>0&&!(S[LEGS[i-1].id]||{}).w)return false;return LIFE.s.fame>=L.fame},
  play(id){const i=LEGS.findIndex(x=>x.id===id),L=LEGS[i],S=this.st(),r=S[id]||{},t=CAL.today();if(!L)return'';
    if(!this.open(i))return i>0&&!(S[LEGS[i-1].id]||{}).w?`Vença ${LEGS[i-1].nm} primeiro.`:`Precisa de fama ${L.fame}.`;
    if(r.last!=null&&t-r.last<3)return`${L.nm} só aceita revanche daqui a ${3-(t-r.last)} dia(s).`;
    if(TOUR.g&&!TOUR.g.finished&&!(TOUR.g.players[0]&&TOUR.g.players[0].out))return'Termine o torneio em andamento primeiro.';
    const tc=CLK.can(3,'um heads-up');if(tc)return tc;if(!WALLET.can(L.buy))return`Precisa de R$ ${brl(L.buy)} pra sentar.`;
    S[id]=Object.assign(r,{last:t});WALLET.add(-L.buy,`Heads-up contra ${L.nm}`);try{if(SAVES.data.tour&&!(TOUR.g&&TOUR.g.finished))SAVES.del('tour')}catch(e){}
    const x=STRUCTS.sab||STRUCTS.ps,st=STY[L.st]?L.st:'tag';TOUR.stop();TOUR.lastMsg='';try{LIFE.onStart('tour',false)}catch(e){}TOUR.paidNow=L.buy;
    TOUR.startGame({stack:x.stack,hpl:10,sb:x.levels[0][0],bb:x.levels[0][1],levels:x.levels,anteType:x.anteType,structNm:x.nm,ev:{key:`leg@${id}@${t}`,nm:`Heads-up: ${L.nm}`,idx:0,stops:[],days:1,sat:0,buy:L.buy,leg:id},bots:1,names:[L.nm],styles:{[L.nm]:st}});
    TOUR.log(`<div class="lh lvl">${L.emo} Heads-up contra ${L.nm} · R$ ${brl(L.buy)} cada lado. Quem ficar com todas as fichas leva R$ ${brl(L.buy*2)}.</div>`);location.hash='#torneio';LIFE.commit();return''},
  done(id,res){const L=LEGS.find(x=>x.id===id),S=this.st(),r=S[id]=S[id]||{};if(!L)return;const me=CIRC.me();
    if(res.place===1){r.w=(r.w||0)+1;LIFE.addFame(3);TROPH.add({k:'lenda',nm:`Heads-up contra ${L.nm}`,emo:L.emo,prize:L.buy*2});
      CIRC.post({k:'vida',title:`${me} derruba ${L.nm} no heads-up`,body:`Levou R$ ${brl(L.buy*2)} e ${id==='rei'?'agora é o novo Rei do Feltro':'segue na trilha das lendas'}.`});LIFE.note(L.emo,`Você venceu ${L.nm}!`,id==='rei'?'Você é o novo Rei do Feltro. A coroa é sua.':`Próxima lenda liberada${LEGS[LEGS.indexOf(L)+1]?': '+LEGS[LEGS.indexOf(L)+1].nm:''}.`)}
    else{r.l=(r.l||0)+1;LIFE.note(L.emo,`${L.nm} venceu o heads-up`,'Revanche liberada em 3 dias.')}LIFE.commit()},
  panel(){const S=this.st();return`<div class="panel"><h3>⚔️ Lendas do circuito</h3><p class="muted" style="margin-top:0;font-size:13px">Cinco lendas, um heads-up cada. Vença uma pra liberar a próxima. Cada uma joga de um jeito: leia a dica.</p>
    ${LEGS.map((L,i)=>{const r=S[L.id]||{},op=this.open(i),lock=i>0&&!(S[LEGS[i-1].id]||{}).w;return`<div class="vrow" style="display:block;padding:8px 0;${!op?'opacity:.55':''}"><span class="rav lgav">${FACE.leg(L,52)}</span><b>${L.nm}</b>${r.w?' <span class="vtag">👑 vencida</span>':''}<div style="font-size:13px" class="muted">${L.desc}</div>
      <div style="font-size:13px;margin:4px 0">R$ ${brl(L.buy)} cada lado · prêmio R$ ${brl(L.buy*2)}${r.w||r.l?` · ${r.w||0}V ${r.l||0}D`:''}</div>
      ${lock?`<span class="muted" style="font-size:12px">🔒 Vença ${LEGS[i-1].nm} primeiro</span>`:LIFE.s.fame<L.fame?`<span class="muted" style="font-size:12px">🔒 Fama ${L.fame} (você tem ${Math.round(LIFE.s.fame)})</span>`:`<button class="sm pri" data-leg="${L.id}">Desafiar</button>`}</div>`}).join('')}</div>`}};

