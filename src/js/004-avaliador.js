/* ---------- avaliador ---------- */
function eval5(cs){
  const rs=cs.map(c=>c.r).sort((a,b)=>b-a);
  const flush=cs.every(c=>c.s===cs[0].s);
  const u=[...new Set(rs)];let sh=0;
  if(u.length===5){if(u[0]-u[4]===4)sh=u[0];else if(u.join()==='14,5,4,3,2')sh=5}
  const cnt={};rs.forEach(r=>cnt[r]=(cnt[r]||0)+1);
  const g=Object.entries(cnt).map(([r,n])=>[+r,n]).sort((a,b)=>b[1]-a[1]||b[0]-a[0]);
  const tb=g.map(x=>x[0]);
  if(sh&&flush)return[sh===14?9:8,sh];
  if(g[0][1]===4)return[7,...tb];
  if(g[0][1]===3&&g[1][1]===2)return[6,...tb];
  if(flush)return[5,...rs];
  if(sh)return[4,sh];
  if(g[0][1]===3)return[3,...tb];
  if(g[0][1]===2&&g[1][1]===2)return[2,...tb];
  if(g[0][1]===2)return[1,...tb];
  return[0,...rs];
}
function cmp(a,b){for(let i=0;i<Math.max(a.length,b.length);i++){const d=(a[i]||0)-(b[i]||0);if(d)return d}return 0}
function best7(cs){let best=null,hand=null;
  for(let a=0;a<cs.length;a++)for(let b=a+1;b<cs.length;b++){
    const h=cs.filter((_,i)=>i!==a&&i!==b);const s=eval5(h);
    if(!best||cmp(s,best)>0){best=s;hand=h}}
  return{score:best,hand}}
const CAT=['Carta alta','Par','Dois pares','Trinca','Sequência','Flush','Full house','Quadra','Straight flush','Royal flush'];
function describe(s){const[c,a,b]=s;switch(c){
  case 9:return'Royal flush';
  case 8:return`Straight flush até o ${sing(a)}`;
  case 7:return`Quadra de ${PLUR[a]}`;
  case 6:return`Full house: ${PLUR[a]} com ${PLUR[b]}`;
  case 5:return`Flush, ${sing(a)} alto`;
  case 4:return`Sequência até o ${sing(a)}`;
  case 3:return`Trinca de ${PLUR[a]}`;
  case 2:return`Dois pares: ${PLUR[a]} e ${PLUR[b]}`;
  case 1:return`Par de ${PLUR[a]}`;
  default:return`Carta alta: ${sing(a)}`}}

