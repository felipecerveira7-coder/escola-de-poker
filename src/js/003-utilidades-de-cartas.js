/* ---------- utilidades de cartas ---------- */
const SYM={s:'♠',h:'♥',d:'♦',c:'♣'}, SUITS=['s','h','d','c'];
const RCH={14:'A',13:'K',12:'Q',11:'J',10:'10'};
const lbl=r=>RCH[r]||String(r);
const SING={14:'Ás',13:'Rei',12:'Dama',11:'Valete'};
const PLUR={14:'Ases',13:'Reis',12:'Damas',11:'Valetes',10:'Dez',9:'Noves',8:'Oitos',7:'Setes',6:'Seis',5:'Cincos',4:'Quatros',3:'Treses',2:'Dois'};
const sing=r=>SING[r]||String(r);
function parse(str){return str.split(' ').map(t=>{const s=t.slice(-1),rc=t.slice(0,-1);const r={A:14,K:13,Q:12,J:11,T:10}[rc]||+rc;return {r,s,id:rc+s}})}
function newDeck(){const d=[];for(let r=2;r<=14;r++)for(const s of SUITS)d.push({r,s,id:(r===10?'T':lbl(r))+s});for(let i=d.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[d[i],d[j]]=[d[j],d[i]]}return d}
function cardHTML(c,cls=''){const red=c.s==='h'||c.s==='d';return `<span class="card ${red?'red':''} ${cls}" data-id="${c.id}"><b>${lbl(c.r)}</b><i>${SYM[c.s]}</i></span>`}
const cardsHTML=(cs,cls='')=>cs.map(c=>cardHTML(c,cls)).join('');

