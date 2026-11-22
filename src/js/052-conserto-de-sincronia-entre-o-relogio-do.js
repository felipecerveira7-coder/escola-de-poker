/* ----- conserto de sincronia entre o relógio dos bots e a sua agenda ----- */
function syncFix(){try{if(!LIVES.ready||!LIFE.ready||!LIFE.s||!LIVES.s||CAR.id==='qp')return;const L=LIVES.s,F=LIFE.s;let ch=false;
  if((F.day||0)>(L.day||0)){L.day=F.day;ch=true}
  if(!L.relFix&&F.th){L.relFix=1;[['Natália',2.5],['Priscila',2],['Otávio',-2.5]].forEach(([n,v])=>{if(F.th[n]&&L.bots[n]){const cur=LIVES.rel(n,'Você');if(Math.abs(cur)<1){LIVES.relAdd(n,'Você',v-cur);ch=true}}})}
  if(!L.calFix&&L.calStart){L.calFix=1;const A=F.ag||{},W={domingo:0,sabado:6,turbo:3},k=Object.keys(Object.assign({},A.reg||{},A.done||{})).find(k=>W[k.split('@')[0]]!=null);
    if(k){const n=+k.split('@')[1],want=W[k.split('@')[0]],cur=new Date(L.calStart+(n-1)*864e5).getDay();let sh=((cur-want)+7)%7;if(sh>3)sh-=7;if(sh){L.calStart-=sh*864e5;ch=true}}}
  if(ch){LIVES.s.updatedAt=Date.now();LIVES.saveLocal();LIVES.push();try{TOUR.render()}catch(e){}try{if(location.hash==='#vida')renderLife()}catch(e){}}}catch(e){}}
