// v68 · Fichas de torneio realistas
// Fichas de torneio não valem dinheiro: o que muda é a profundidade em big blinds.
// Referências: clubes BR (R$ 50–300 → 10–20 mil fichas), BSOP Main Event (40 mil),
// BSOP Championship (100 mil, 300/600), WSOP Main Event (60 mil, 100/200, ante do BB).

// Escada de blinds ao vivo (ante do big blind = 1 BB), números redondos como nos cassinos.
const LIVE_BB=[200,300,400,500,600,800,1000,1200,1500,2000,2500,3000,4000,5000,6000,8000,10000,12000,15000,20000,25000,30000,40000,50000,60000,80000,100000,120000,150000,200000,250000,300000,400000,500000,600000,800000,1000000,1200000,1500000,2000000,2500000,3000000];
function liveLevels(bb0){const i=Math.max(0,LIVE_BB.indexOf(bb0));return LIVE_BB.slice(i).map(b=>[b/2,b,b])}

STRUCTS.clube={nm:'Clube turbo (Sit & Go / satélite)',stack:15000,hpl:8,anteType:'bb',
  ds:'Como os torneios rápidos de clube no Brasil: 15.000 fichas, blinds 100/200 (75 BB), ante do big blind a partir do 5º nível. Os blinds quase dobram a cada nível.',
  levels:LEVELS.map(([s,b,a])=>[s*10,b*10,a?b*10:0])};
STRUCTS.sab={nm:'Clube regular (30 mil)',stack:30000,hpl:12,anteType:'bb',
  ds:'Torneio regular de fim de semana: 30.000 fichas, blinds 100/200 com ante do big blind (150 BB).',levels:liveLevels(200)};
STRUCTS.live={nm:'Main Event estilo BSOP (40 mil)',stack:40000,hpl:12,anteType:'bb',
  ds:'Como o Main Event do BSOP: 40.000 fichas, blinds 100/200 com ante do big blind (200 BB).',levels:liveLevels(200)};
STRUCTS.champ={nm:'Championship (100 mil)',stack:100000,hpl:12,anteType:'bb',
  ds:'Como o BSOP Championship: 100.000 fichas, blinds 300/600 com ante do big blind (166 BB).',levels:liveLevels(600)};
STRUCTS.wsop={nm:'Mundial estilo WSOP (60 mil)',stack:60000,hpl:12,anteType:'bb',
  ds:'Como o Main Event da WSOP: 60.000 fichas, blinds 100/200 com ante do big blind (300 BB). O torneio mais profundo do ano.',levels:liveLevels(200)};

// Cada evento com o stack proporcional ao buy-in.
{const M={noite:['clube',8],turbo:['clube',8],sat:['clube',8],sabado:['sab',12],domingo:['live',12],etapa:['live',12],main:['live',12],nac:['champ',12],latam:['champ',12],mundial:['wsop',12]};
  Object.entries(M).forEach(([k,[st,h]])=>{if(EVTS[k]){EVTS[k].st=st;EVTS[k].hpl=h}})}

// Texto curto do stack para a agenda: "40 mil fichas (200 BB)".
function stTxt(E){try{const x=STRUCTS[E&&E.st];if(!x)return'';return`${x.stack>=1000?nf(x.stack/1000)+' mil':nf(x.stack)} fichas (${Math.round(x.stack/x.levels[0][1])} BB)`}catch(e){return''}}

// Fichas compactas na mesa: 45.300 · 152,4k · 1,25M
function kf(n){n=Math.round(n||0);const a=Math.abs(n);
  if(a<100000)return n.toLocaleString('pt-BR');
  if(a<999950)return(n/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+'k';
  return(n/1e6).toLocaleString('pt-BR',{maximumFractionDigits:2})+'M'}
