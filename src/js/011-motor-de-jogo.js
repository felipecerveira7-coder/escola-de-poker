/* ===================== MOTOR DE JOGO (mesa e torneio) ===================== */
const RV={A:14,K:13,Q:12,J:11,T:10,9:9,8:8,7:7,6:6,5:5,4:4,3:3,2:2};
let ORDER169=`AA KK QQ JJ AKs TT AQs AKo AJs KQs 99 ATs AQo KJs 88 QJs KTs A9s AJo QTs KQo 77 JTs A8s K9s ATo A5s A7s KJo 66 Q9s T9s A4s A6s QJo J9s 55 A3s K8s KTo A2s 98s T8s QTo K7s 44 JTo 87s Q8s A9o K6s J8s 97s 33 K5s 76s T7s 22 A8o K4s 86s 65s Q7s K9o J7s K3s 96s 54s Q6s T9o A7o 75s A5o 98o K2s Q5s J9o A6o 64s 85s T6s Q4s A4o J6s 53s 87o Q9o 74s Q3s 95s J5s T8o A3o 43s 63s K8o Q2s J4s 76o A2o 84s 97o J3s T5s 52s 65o J8o K7o 73s 94s J2s T4s 86o 42s 62s Q8o T3s 93s K6o 54o 83s 75o 32s T2s 92s 82s K5o 64o 72s J7o K4o 96o Q7o 53o K3o T7o 85o 43o 74o Q6o K2o 63o J6o Q5o 95o 52o 84o T6o Q4o 42o J5o 73o Q3o 62o 94o J4o Q2o 32o 83o T5o J3o 93o 72o J2o T4o 82o 92o T3o T2o`.split(/\s+/);
(function(){const R='AKQJT98765432',all=[];for(let i=0;i<13;i++)for(let j=i;j<13;j++){if(i===j)all.push(R[i]+R[j]);else all.push(R[i]+R[j]+'s',R[i]+R[j]+'o')}
  const ok=new Set(all),seen=new Set();ORDER169=ORDER169.filter(k=>ok.has(k)&&!seen.has(k)&&seen.add(k));all.forEach(k=>{if(!seen.has(k))ORDER169.push(k)})})();
const CARD={},FULL_DECK=newDeck();FULL_DECK.forEach(c=>CARD[c.id]=c);
const HPCT={},COMBOS=[];
(function(){let cum=0;ORDER169.forEach(k=>{const a=k[0],b=k[1];
  if(k.length===2){for(let x=0;x<4;x++)for(let y=x+1;y<4;y++)COMBOS.push([CARD[a+SUITS[x]],CARD[b+SUITS[y]]])}
  else if(k[2]==='s')SUITS.forEach(s=>COMBOS.push([CARD[a+s],CARD[b+s]]));
  else SUITS.forEach(s=>SUITS.forEach(t=>{if(s!==t)COMBOS.push([CARD[a+s],CARD[b+t]])}));
  cum+=k.length===2?6:k[2]==='s'?4:12;HPCT[k]=cum/1326})})();
const topK=p=>Math.max(6,Math.min(1326,Math.round(1326*p)));
const nf=n=>Math.round(n).toLocaleString('pt-BR');
const pct=x=>Math.round(x*100)+'%';
const fmtCards=cs=>cs.map(c=>`<span class="${c.s==='h'||c.s==='d'?'rc':''}">${lbl(c.r)}${SYM[c.s]}</span>`).join(' ');
const live=p=>p.inHand&&!p.folded&&!p.out,canAct=p=>live(p)&&!p.allIn;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function handKey(h){const ch=r=>'23456789TJQKA'[r-2];const[a,b]=h[0].r>=h[1].r?h:[h[1],h[0]];return a.r===b.r?ch(a.r)+ch(b.r):ch(a.r)+ch(b.r)+(a.s===b.s?'s':'o')}
function bestAny(cs){const n=cs.length;if(n===5)return{score:eval5(cs),hand:cs};if(n===7)return best7(cs);
  let best=null,hand=null;for(let a=0;a<n;a++){const h=cs.filter((_,i)=>i!==a);const s=eval5(h);if(!best||cmp(s,best)>0){best=s;hand=h}}return{score:best,hand}}

/* força relativa da mão no board: 0 nada · 1 par fraco · 2 par top/overpair · 3 dois pares/trinca · 4 sequência ou melhor */
function handLevel(hole,board){
  const sc=bestAny(hole.concat(board)).score,c=sc[0];
  const br=board.map(x=>x.r),maxB=Math.max(...br),bc={};br.forEach(r=>bc[r]=(bc[r]||0)+1);
  const hr=hole.map(x=>x.r);
  if(board.length===5&&cmp(eval5(board),sc)===0)return 0;
  if(c>=4)return 4;
  if(c===3)return bc[sc[1]]>=3?(hr.some(r=>r>=maxB)?1:0):3;
  if(c===2){const on=r=>bc[r]>=2,[a,b]=[sc[1],sc[2]];
    if(on(a)&&on(b))return hr.some(r=>r>=maxB)?1:0;
    if(on(a)||on(b)){const m=on(a)?b:a;return m>=maxB?2:1}
    return 3}
  if(c===1){const pr=sc[1];if(bc[pr]>=2)return 0;if(hr[0]===hr[1])return pr>maxB?2:1;return pr===maxB?2:1}
  return 0}
function drawOuts(hole,board){
  if(board.length>=5)return 0;const all=hole.concat(board);let outs=0;
  const cur=bestAny(all).score[0];
  if(cur<5)SUITS.forEach(s=>{if(all.filter(c=>c.s===s).length===4&&hole.some(c=>c.s===s))outs+=9});
  if(cur<4){const rs=new Set(all.map(c=>c.r));if(rs.has(14))rs.add(1);
    const hs=new Set(hole.flatMap(c=>c.r===14?[14,1]:[c.r]));let n=0;
    for(let r=2;r<=14;r++){if(rs.has(r))continue;const s2=new Set(rs);s2.add(r);if(r===14)s2.add(1);
      for(let lo=1;lo<=10;lo++){const w=[lo,lo+1,lo+2,lo+3,lo+4];
        if(w.every(x=>s2.has(x))&&(w.includes(r)||(r===14&&w.includes(1)))&&w.some(x=>hs.has(x))){n++;break}}}
    outs+=n*4-(outs&&n?2:0)}
  return Math.min(15,outs)}

/* equidade por Monte Carlo contra as faixas estimadas de cada adversário */
function sampleCombo(range,used){const k=topK(range);
  for(let t=0;t<80;t++){const c=COMBOS[Math.random()*k|0];if(!used.has(c[0].id)&&!used.has(c[1].id))return c}
  for(;;){const a=FULL_DECK[Math.random()*52|0],b=FULL_DECK[Math.random()*52|0];if(a!==b&&!used.has(a.id)&&!used.has(b.id))return[a,b]}}
function fitsActions(c,board,o){
  if(board.length<3||(!o.pressure&&!o.calls))return true;
  const lv=handLevel(c,board),dr=drawOuts(c,board);
  const need=o.pressure>=3?3:o.pressure===2?2:1;
  if(lv>=need)return true;
  if(dr>=8&&need<=2)return true;
  if(dr>=4&&need===1)return true;
  return Math.random()<(o.pressure?o.bluffP:.3)}
function equityVs(hole,board,opps,iters){
  if(!opps.length)return 1;let win=0;
  for(let it=0;it<iters;it++){
    const used=new Set([...hole,...board].map(c=>c.id)),hands=[];
    for(const o of opps){let c;for(let t=0;t<25;t++){c=sampleCombo(o.range,used);if(fitsActions(c,board,o))break}
      used.add(c[0].id);used.add(c[1].id);hands.push(c)}
    const b=board.slice();while(b.length<5){const x=FULL_DECK[Math.random()*52|0];if(!used.has(x.id)){used.add(x.id);b.push(x)}}
    const my=best7(hole.concat(b)).score;let ties=0,lost=false;
    for(const h of hands){const c=cmp(best7(h.concat(b)).score,my);if(c>0){lost=true;break}if(c===0)ties++}
    if(!lost)win+=1/(ties+1)}
  return win/iters}

/* faixas de referência: % de mãos para abrir (RFI) e para all-in curto, pelo nº de jogadores que ainda falam depois */
const RFI={1:.42,2:.45,3:.28,4:.21,5:.17,6:.14,7:.12,8:.10};
const PUSH={1:.58,2:.40,3:.28,4:.22,5:.18,6:.15,7:.13,8:.12};
const rfiPct=(nb,hu)=>hu?.8:(RFI[nb]||.1);
const pushPct=(nb,hu,bb)=>Math.min(1,(hu?.7:(PUSH[nb]||.12))*Math.pow(10/Math.max(1,bb),.6));

const BOTNAMES=['Bruno','Carla','Diego','Elisa','Fábio','Gabi','Hugo','Íris'];
const EXTRAS=['Ana','Rafael','Lucas','Mariana','Paulo','Juliana','Rodrigo','Camila','Tiago','Patrícia','Marcelo','Fernanda','André','Letícia','Gustavo','Beatriz','Leandro','Renata','Vinícius','Sabrina','Caio','Débora','Otávio','Larissa','Mateus','Priscila','Jorge','Tânia','Roberto','Vanessa','Sérgio','Aline','Wagner','Natália','Eduardo','Bianca','César','Lorena','Igor','Simone'];
const STY={
  tag:{nm:'Tubarão',ds:'tight-agressivo e sólido: faixas corretas por posição, c-bet, semi-blefe e push/fold certinhos. O mais difícil de enfrentar.',W:1,A:.75,B:.35,M:0},
  rock:{nm:'Rocha',ds:'joga só mãos fortes e quase nunca blefa. Quando aumenta, acredite; roube os blinds dele.',W:.6,A:.45,B:.08,M:.04},
  lag:{nm:'Maníaco',ds:'joga muitas mãos e aposta sem parar. Pague mais leve e deixe ele blefar.',W:1.7,A:.95,B:.8,M:-.02},
  station:{nm:'Estação',ds:'paga quase tudo e raramente aumenta. Nunca blefe contra ele; aposte por valor.',W:1.5,A:.15,B:.04,M:-.07,passive:true},
  bal:{nm:'Equilibrado',ds:'jogo sólido, um pouco menos agressivo que o Tubarão.',W:.9,A:.6,B:.3,M:.01}};
const COACH_STY=STY.tag;
const LEVELS=[[10,20,0],[15,30,0],[25,50,0],[50,100,0],[75,150,15],[100,200,25],[150,300,40],[200,400,50],[300,600,75],[400,800,100],[600,1200,150],[800,1600,200],[1000,2000,250],[1500,3000,400],[2000,4000,500],[3000,6000,750],[5000,10000,1000],[8000,16000,2000],[10000,20000,3000],[15000,30000,4000]];

const STRUCTS={
  ps:{nm:'PokerStars padrão (online)',stack:10000,hpl:12,anteType:'each',
    ds:'Como os torneios regulares da PokerStars (Sunday Million / Sunday Kickoff): 10.000 fichas, blinds 40/80 com ante 10 (125 BB). Os blinds sobem só ~20% por nível e todos pagam um ante pequeno.',
    levels:[[40,80,10],[50,100,12],[60,120,15],[75,150,20],[100,200,25],[125,250,30],[150,300,40],[175,350,45],[200,400,50],[250,500,60],[300,600,75],[350,700,90],[400,800,100],[500,1000,125],[600,1200,150],[700,1400,175],[800,1600,200],[1000,2000,250],[1250,2500,325],[1500,3000,375],[1750,3500,450],[2000,4000,500],[2500,5000,625],[3000,6000,750],[3500,7000,875],[4000,8000,1000],[5000,10000,1250],[6000,12000,1500],[7000,14000,1750],[8000,16000,2000],[10000,20000,2500],[12500,25000,3000],[15000,30000,4000],[20000,40000,5000],[25000,50000,6000]]},
  deep:{nm:'Deep stack (estilo Sunday Million Live)',stack:50000,hpl:20,anteType:'bb',
    ds:'Estrutura de torneio ao vivo: 50.000 fichas, blinds 100/200 com ante do big blind (250 BB). Só quem está no BB paga o ante da mesa toda. Bem mais lento, muito jogo pós-flop.',
    levels:[[100,200,200],[100,300,300],[200,400,400],[200,500,500],[300,600,600],[400,800,800],[500,1000,1000],[600,1200,1200],[1000,1500,1500],[1000,2000,2000],[1200,2500,2500],[1500,3000,3000],[2000,4000,4000],[2500,5000,5000],[3000,6000,6000],[4000,8000,8000],[5000,10000,10000],[6000,12000,12000],[8000,16000,16000],[10000,20000,20000],[12000,25000,25000],[15000,30000,30000],[20000,40000,40000],[25000,50000,50000],[30000,60000,60000],[40000,80000,80000]]},
  turbo:{nm:'Turbo (Sit & Go rápido)',stack:1500,hpl:8,anteType:'each',
    ds:'A estrutura antiga desta mesa: 1.500 fichas, blinds 10/20 (75 BB) que praticamente dobram a cada nível. Rápido e com muito all-in.',
    levels:null}};
STRUCTS.turbo.levels=LEVELS;
const anteTxt=(a,t)=>a?` · ante ${nf(a)}${t==='bb'?' (BB)':''}`:'';
const POSN={2:['BTN','BB'],3:['BTN','SB','BB'],4:['BTN','SB','BB','CO'],5:['BTN','SB','BB','UTG','CO'],6:['BTN','SB','BB','UTG','MP','CO'],7:['BTN','SB','BB','UTG','MP','HJ','CO'],8:['BTN','SB','BB','UTG','UTG+1','MP','HJ','CO'],9:['BTN','SB','BB','UTG','UTG+1','MP','LJ','HJ','CO']};
const POSDESC={BTN:'botão, a melhor posição',SB:'small blind',BB:'big blind',UTG:'primeiro a falar','UTG+1':'segunda posição inicial',MP:'posição do meio',LJ:'lojack, posição média',HJ:'hijack, posição média-tardia',CO:'cutoff, posição tardia'};

