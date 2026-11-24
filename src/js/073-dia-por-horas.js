/* =============== v62: o dia é medido em horas e energia (acabou o "uma coisa por dia") =============== */
/* que horas cada torneio começa */
function tStartH(ev){const id=ev&&ev.id,E=ev&&ev.E||{};if(E.h)return E.h;if(ev&&ev.part>0)return 13;return{noite:21,turbo:20,sabado:16,domingo:14,main:13,etapa:13,sat:20,nac:12,latam:12,mundial:12}[id]||19}
/* atrasou demais? (devolve o motivo ou '') */
function tLate(ev){if(!ev||!CAL.on()||!LIFE.s)return'';const t=CAL.today();if(ev.first+(ev.part||0)!==t&&!(t>=ev.first&&t<ev.first+(ev.E.days||1)))return'';
  const part=t-ev.first,st=part>0?13:tStartH(ev),reg=!!CAL.st().reg[ev.key],lim=reg?(part>0?22:24.5):st+((ev.E.days||1)>1?3:2),n=CLK.now();
  return n>lim?(reg?`O ${ev.E.nm} ${part>0?`retomou às ${CLK.fmt(st)}`:`começou às ${CLK.fmt(st)}`} e suas fichas foram blindadas até acabar: já são ${CLK.fmt(n)}.`:`O ${ev.E.nm} começou às ${CLK.fmt(st)} e a inscrição tardia acabou às ${CLK.fmt(lim)}. Já são ${CLK.fmt(n)}.`):''}
/* quanto tempo leva cada compromisso */
function ITEMH(it){return{gig:3,meet:1.5,lesson:2,mkt:2,fam:3,love:3,life:2.5,hg:5,hgv:5}[it&&it.kind]||2}
/* registra o que você fez no dia (vários por dia) */
function dayDid(t,what){const A=CAL.st();A.did=A.did||{};(A.did[t]=A.did[t]||[]).push(what);if(!A.used[t])A.used[t]=what}
function dayBusy(t){const A=CAL.st();return!!((A.did&&A.did[t]&&A.did[t].length)||A.used[t])}
/* chegou atrasado num torneio em que estava inscrito: entra, mas as fichas foram sendo blindadas */
function lateFactor(h){return Math.max(.4,1-h*.07)}
{const _pl=CAL.play;CAL.play=function(key){const ev=this.byKey(key),t=this.today(),late=ev&&t===ev.first&&!this.st().done[key]&&!(TOUR.g&&TOUR.g.ev&&TOUR.g.ev.key===key)?CLK.now()-tStartH(ev):0;
  const r=_pl.apply(this,arguments);try{if(!r&&late>.5&&TOUR.g&&TOUR.g.ev&&TOUR.g.ev.key===key){const me=TOUR.g.players[0],f=lateFactor(late),old=me.stack;me.stack=Math.max(TOUR.g.bb*10,Math.round(old*f));
    TOUR.log(`<div class="lh lvl">⏰ Você chegou ${late>=1?Math.round(late)+'h':Math.round(late*60)+' min'} atrasado: as fichas ficaram na mesa pagando blinds. Começa com ${nf(me.stack)} em vez de ${nf(old)}.</div>`);TOAST.show(`⏰ Chegou atrasado: começa com ${nf(me.stack)} fichas.`);TOUR.render()}}catch(e){console.warn(e)}return r}}
/* aviso quando o relógio passa da hora de um torneio em que você está inscrito */
function tourAlarm(h0){try{if(!CAL.on()||!LIFE.s)return;const A=CAL.st(),t=CAL.today(),h1=CLK.now();if(h1<=h0)return;
  CAL.events(t).forEach(ev=>{if(!A.reg[ev.key]||A.done[ev.key]||ev.part>0||(TOUR.g&&TOUR.g.ev&&TOUR.g.ev.key===ev.key))return;const st=tStartH(ev);
    if(h0<st&&h1>=st){const m=`⏰ O ${ev.E.nm} começou às ${CLK.fmt(st)} e você está inscrito. Dá pra entrar ainda, mas cada hora de atraso custa fichas.`;TOAST.show(m);LIFE.note('⏰',`${ev.E.nm} já começou`,m.slice(2))}})}catch(e){}}
{const _a=CLK.add,_t=CLK.to;CLK.add=function(){const h0=LIFE.s&&CAL.on()?this.now():0;const r=_a.apply(this,arguments);tourAlarm(h0);return r};CLK.to=function(){const h0=LIFE.s&&CAL.on()?this.now():0;const r=_t.apply(this,arguments);tourAlarm(h0);return r}}
/* antes de começar algo que passa da hora do torneio: aviso na própria ação */
function tourClash(hours){try{if(!CAL.on()||!LIFE.s)return'';const A=CAL.st(),t=CAL.today(),n=CLK.now();const ev=CAL.events(t).find(e=>A.reg[e.key]&&!A.done[e.key]&&!e.part&&n<tStartH(e)&&n+hours>tStartH(e));return ev?`${ev.E.nm} começa às ${CLK.fmt(tStartH(ev))}`:''}catch(e){return''}}
/* conserto único: encontro empurrou o relógio e fez perder o Dia 1 de um torneio grande em que estava inscrito */
function fixDateClash(){const s=LIFE.s;if(!s||s.fixDC1||!CAL.on())return;s.fixDC1=1;const A=CAL.st(),t=CAL.today();
  const ev=CAL.events(t).find(e=>A.reg[e.key]&&!A.done[e.key]&&!e.part&&(e.E.days||1)>1);if(!ev||!(s.lastDate&&s.lastDate.d===t)||CLK.now()<=tStartH(ev))return;
  s.hr=tStartH(ev);LIFE.note('↩️',`Você chega a tempo do ${ev.E.nm}`,`O relógio voltou pras ${CLK.fmt(s.hr)}: o encontro não vai custar o Dia 1. A Agenda está com o botão de jogar.`);LIFE.commit()}
{const _rl=renderLife;renderLife=function(){try{fixDateClash()}catch(e){}return _rl.apply(this,arguments)}}
/* data do calendário no lugar de "dia 8": 29/11 */
function DT(d){try{if(d==null||!LIVES.s||!LIVES.s.calStart)return'';const x=CAL.date(+d);return`${String(x.getDate()).padStart(2,'0')}/${String(x.getMonth()+1).padStart(2,'0')}`}catch(e){return''}}
/* torneio de vários dias: se você cai antes do fim, o resultado final só sai no último dia (sem spoiler) */
{const _ar=CIRC.article;CIRC.article=function(o){try{const k=TOUR.g&&TOUR.g.ev&&TOUR.g.ev.key,ev=k&&CAL.byKey(k),last=ev?ev.first+(ev.E.days||1)-1:0,t=CAL.today();
    if(ev&&(ev.E.days||1)>1&&t<last){const Q=LIVES.s.newsQ=LIVES.s.newsQ||[];Q.push({d:last,o:JSON.parse(JSON.stringify(o))});
      const me=(o.res||[]).find(x=>x.name==='Você'),left=Math.max(9,Math.round(o.of*(t-ev.first+1===1?.4:.2)));
      this.post({k:'vida',title:`${ev.E.nm}: fim do Dia ${t-ev.first+1}`,body:`${me?`${this.me()} caiu em ${me.place}º. `:''}Cerca de ${left} jogadores seguem vivos. O campeão sai em ${CAL.fmt(last)}.`});LIVES.commit();return}}catch(e){console.warn(e)}
  return _ar.apply(this,arguments)}}
{const _sd=CAL.startDay;CAL.startDay=function(d){const r=_sd.apply(this,arguments);try{const Q=LIVES.s.newsQ||[];if(Q.length){const now=Q.filter(x=>x.d<=d);LIVES.s.newsQ=Q.filter(x=>x.d>d);now.forEach(x=>{try{_arOrig(x.o)}catch(e){}});LIVES.commit()}}catch(e){}return r}}
function _arOrig(o){const k=TOUR.g;TOUR.g=null;try{CIRC.article(o)}finally{TOUR.g=k}}
/* guarda em que dia você caiu */
{const _fn=CAL.finish;CAL.finish=function(key,res){const r=_fn.apply(this,arguments);try{const A=this.st(),dn=A.done[key],ev=/^[a-z]+@\d+/.test(key)?this.byKey(key):null;if(dn&&ev&&!dn.bd&&!dn.noshow)dn.bd=Math.max(1,this.today()-ev.first+1)}catch(e){}return r}}
