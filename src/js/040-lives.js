/* ----- lives ----- */
const LIVEX={K:{qa:{nm:'Perguntas e respostas',emo:'💬',h:1,en:5,m:.7},mao:{nm:'Análise de mãos',emo:'🧠',h:2,en:8,m:1},cash:{nm:'Live jogando online',emo:'🃏',h:3,en:15,m:1.4}},
  go(k){const s=LIFE.s,K=this.K[k];if(!K)return'';if(LIFE.daily('live'))return'Você já fez live hoje.';const tc=CLK.can(K.h,'a live');if(tc)return tc;if(s.energy<K.en)return'Sem energia pra live.';
    LIFE.mark('live');CLK.add(K.h);s.energy-=K.en;const view=Math.round((20+s.fans*.004+s.fame*3)*K.m*(.6+Math.random()*.8)),gain=Math.round(view*(.5+Math.random())*(1+LIFE.ifx('post'))),don=Math.round(view*(.3+Math.random()*.7)*2);
    s.fans+=gain;WALLET.add(don,`Doações da live (${K.nm.toLowerCase()})`);LIFE.addFame(.2*K.m);s.liveN=(s.liveN||0)+1;LIFE.sps().forEach(c=>{if(c.req&&c.req.post)c.done.post=(c.done.post||0)+1});
    let extra='';if(k==='cash'){const v=Math.round((Math.random()*2-.8)*(800+s.fame*40)/10)*10;WALLET.add(v,'Resultado da sessão online na live');extra=v>=0?` Ganhou R$ ${brl(v)} na sessão.`:` Perdeu R$ ${brl(-v)} na sessão, ao vivo.`}
    FEED.push('Twitch','🔴',`${CIRC.me()} fez live: ${K.nm.toLowerCase()} com ${nf(view)} pessoas assistindo.`,'#AoVivo');LIFE.commit();
    return`🔴 ${nf(view)} pessoas assistiram. +${nf(gain)} seguidores e R$ ${brl(don)} em doações.${extra} Conta como post pros patrocinadores.`},
  panel(){const d=LIFE.daily('live');return`<div class="panel"><h3>🔴 Lives</h3><p class="muted" style="margin-top:0;font-size:13px">Marcas querem quem transmite. Live rende seguidores, doações e conta como post nos contratos. Uma por dia.</p>
    ${d?'<p class="muted" style="margin:0">Você já fez live hoje.</p>':`<div class="dacts">${Object.entries(this.K).map(([k,K])=>`<button class="sm" data-live="${k}">${K.emo} ${K.nm} · ${K.h}h</button>`).join('')}</div>`}</div>`}};

