/* =============== v62: o dia é medido em horas e energia (acabou o "uma coisa por dia") =============== */
/* que horas cada torneio começa */
function tStartH(ev){const id=ev&&ev.id,E=ev&&ev.E||{};if(E.h)return E.h;if(ev&&ev.part>0)return 13;return{noite:21,turbo:20,sabado:16,domingo:14,main:13,etapa:13,sat:20,nac:12,latam:12,mundial:12}[id]||19}
/* atrasou demais? (devolve o motivo ou '') */
function tLate(ev){if(!ev||!CAL.on()||!LIFE.s)return'';const t=CAL.today();if(ev.first+(ev.part||0)!==t&&!(t>=ev.first&&t<ev.first+(ev.E.days||1)))return'';
  const part=t-ev.first,st=part>0?13:tStartH(ev),lim=part>0?22:st+((ev.E.days||1)>1?3:2),n=CLK.now();
  return n>lim?`O ${ev.E.nm} ${part>0?`retomou às ${CLK.fmt(st)}`:`começou às ${CLK.fmt(st)}`} e a inscrição tardia acabou às ${CLK.fmt(lim)}. Já são ${CLK.fmt(n)}.`:''}
/* quanto tempo leva cada compromisso */
function ITEMH(it){return{gig:3,meet:1.5,lesson:2,mkt:2,fam:3,love:3,life:2.5,hg:5,hgv:5}[it&&it.kind]||2}
/* registra o que você fez no dia (vários por dia) */
function dayDid(t,what){const A=CAL.st();A.did=A.did||{};(A.did[t]=A.did[t]||[]).push(what);if(!A.used[t])A.used[t]=what}
function dayBusy(t){const A=CAL.st();return!!((A.did&&A.did[t]&&A.did[t].length)||A.used[t])}
