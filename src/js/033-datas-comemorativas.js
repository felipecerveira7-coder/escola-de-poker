/* ----- datas comemorativas ----- */
const HOL={
  easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(y,mo-1,da,12)},
  nth(y,mo,wd,n){const x=new Date(y,mo,1,12);while(x.getDay()!==wd)x.setDate(x.getDate()+1);x.setDate(x.getDate()+7*(n-1));return x},
  of(d){if(!CAL.on()||!LIVES.s)return null;const t=CAL.date(d),y=t.getFullYear(),M=t.getMonth(),D=t.getDate(),same=x=>x.getMonth()===M&&x.getDate()===D;
    if(M===11&&(D===24||D===25))return{id:'natal',nm:'Natal',emo:'🎄',tip:'Presente pra família vale o dobro. Ceia em família deixa todo mundo feliz.'};
    if(M===11&&D===31)return{id:'reveillon',nm:'Réveillon',emo:'🎆',tip:'Sair com os amigos hoje rende o dobro de amizade.'};
    if(M===0&&D===1)return{id:'anonovo',nm:'Ano-novo',emo:'🥂',tip:'Ressaca coletiva: o circuito descansa.'};
    if(M===5&&D===12)return{id:'namorados',nm:'Dia dos Namorados',emo:'💘',tip:'Encontro hoje começa com clima melhor. Esquecer pega mal.'};
    const bf=this.nth(y,10,5,4),bfd=Math.round((t-bf)/864e5);if(bfd>=0&&bfd<=3)return{id:'bf',nm:'Black Friday',emo:'🛍️',tip:'Loja com 25% de desconto até segunda (Cyber Monday).'};
    if(same(this.nth(y,4,0,2)))return{id:'maes',nm:'Dia das Mães',emo:'💐',tip:'Presente pra mãe vale o dobro.'};
    if(same(this.nth(y,7,0,2)))return{id:'pais',nm:'Dia dos Pais',emo:'👔',tip:'Presente pro pai vale o dobro.'};
    const e=this.easter(y),cv=new Date(e);cv.setDate(e.getDate()-47);const cd=Math.round((t-cv)/864e5);if(cd>=-3&&cd<=0)return{id:'carnaval',nm:'Carnaval',emo:'🎭',tip:'Sair com os amigos hoje rende o dobro de amizade.'};
    return null},
  tag(d){const h=this.of(d);return h?` · <span class="gold">${h.emo} ${h.nm}</span>`:''},
  disc(){const h=this.of(CAL.today());return h&&h.id==='bf'?.75:1},
  famDay(p){const h=this.of(CAL.today());return!!h&&(h.id==='natal'||(h.id==='maes'&&p.id==='mae')||(h.id==='pais'&&p.id==='pai'))},
  party(){const h=this.of(CAL.today());return!!h&&['reveillon','carnaval'].includes(h.id)}};
const IP=I=>Math.round(I.price*HOL.disc());

