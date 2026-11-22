/* ===================== VIDA: casa, carros, celular, mídia, patrocínio ===================== */
const HOMES=[
  {id:'pais',nm:'Quarto na casa dos pais',emo:'🛏️',rent:0,price:0,comfort:1,status:0,desc:'Comida pronta, roupa lavada e zero aluguel. Mas chegar às 4 da manhã de um torneio é complicado.'},
  {id:'kit',nm:'Kitnet no Centro',emo:'🏚️',rent:30,price:85000,comfort:0,status:0,desc:'25 m², janela pro prédio do lado e um vizinho que ouve pagode até tarde. Dá pra dormir. Mais ou menos.'},
  {id:'ap2',nm:'Apartamento de 2 quartos',emo:'🏢',rent:80,price:260000,comfort:1,status:1,desc:'Bairro tranquilo. O segundo quarto vira escritório de estudo, com monitor e cadeira boa.'},
  {id:'casa',nm:'Casa com pátio',emo:'🏡',rent:150,price:520000,comfort:2,status:2,desc:'Churrasqueira, pátio e espaço pra receber os amigos depois do torneio.'},
  {id:'cob',nm:'Cobertura com vista',emo:'🌆',rent:380,price:1500000,comfort:3,status:4,desc:'Vista pro Guaíba e piscina na sacada. Os fotógrafos do Feltro adoram.'},
  {id:'man',nm:'Mansão com sala de poker',emo:'🏰',rent:850,price:4200000,comfort:4,status:6,desc:'Sala de poker com mesa profissional, adega e cinema. O home game mais disputado do circuito.'}];
const CARS=[
  {id:'usado',nm:'Hatch popular 2012',emo:'🚗',price:28000,upk:12,status:0,desc:'O ar só funciona no máximo, mas leva e traz.'},
  {id:'sedan',nm:'Sedã médio seminovo',emo:'🚙',price:95000,upk:25,status:1,desc:'Confortável e discreto. Ninguém pede carona e ninguém repara.'},
  {id:'suv',nm:'SUV zero',emo:'🛻',price:210000,upk:45,status:2,desc:'Alto, espaçoso, cheiro de novo. Chega no clube e as pessoas olham.'},
  {id:'esp',nm:'Esportivo alemão',emo:'🏎️',price:620000,upk:120,status:4,desc:'0 a 100 em 4 segundos. O manobrista do clube já sabe seu nome.'},
  {id:'super',nm:'Supercarro italiano',emo:'🏁',price:2400000,upk:350,status:7,desc:'Vermelho, barulhento, inconfundível. Vira manchete onde para.'}];
const LCATS=[['poker','🃏','Poker'],['tec','📱','Celulares'],['info','💻','Informática e games'],['audio','🎧','Áudio'],['moda','👕','Moda'],['joia','💍','Relógios e joias'],['bel','🧴','Beleza'],['casa','🛋️','Casa e móveis'],['elet','🍳','Eletrodomésticos'],['esp','🏋️','Esportes e fitness'],['auto','🚘','Acessórios pro carro'],['viag','🧳','Viagem'],['inst','🎸','Instrumentos'],['pet','🐾','Pets'],['merc','🛒','Mercado e bebidas']];
/* efeitos: status · regen (energia por noite) · tire (energia a menos por torneio) · love (encontros rendem mais) · mood (humor sobe todo dia) · post (posts dão mais fãs) · fame (repercussão na compra) · upk (gasto mensal) · car (precisa de carro) · cons (consumível: en energia agora, md humor agora) */
const ITEMS=[
  {id:'protetor',cat:'poker',nm:'Protetor de cartas da sorte',emo:'🪙',price:350,status:0,fx:'+1 de humor ao começar um torneio.',desc:'Uma ficha antiga pra pôr em cima das cartas. Superstição pura, mas todo pro tem o seu.'},
  {id:'oculos',cat:'poker',nm:'Óculos escuros de mesa',emo:'🕶️',price:600,status:0,fx:'Os bots leem menos o tempo que você leva pra agir.',desc:'Clássico. Esconde o olhar quando a mão é boa.'},
  {id:'baralho',cat:'poker',nm:'Kit 2 baralhos Copag 139',emo:'🂡',price:65,mood:.05,desc:'O baralho oficial dos clubes brasileiros. Pra treinar shuffle em casa.'},
  {id:'maleta',cat:'poker',nm:'Maleta 500 fichas clay',emo:'🎰',price:450,mood:.1,desc:'Fichas de 14 g, com feltro e dois baralhos. Treino de contagem de pilha.'},
  {id:'mesapk',cat:'poker',nm:'Mesa de poker 8 lugares',emo:'🟩',price:3900,mood:.15,love:1,desc:'Pano verde, porta-copos, iluminação. A casa vira clube.'},
  {id:'livros',cat:'poker',nm:'Coleção de livros de poker',emo:'📚',price:420,mood:.05,post:.1,desc:'Os clássicos de teoria e torneio. Dá assunto pra post de estratégia.'},
  {id:'galaxya',cat:'tec',nm:'Samsung Galaxy A16',emo:'📱',price:1099,post:.1,desc:'Um dos celulares mais buscados do Mercado Livre. Câmera honesta pros stories.'},
  {id:'iphone',cat:'tec',nm:'iPhone 17 Pro Max 256 GB',emo:'📱',price:9999,status:1,post:.3,fame:.5,desc:'O topo da Apple. Foto da mesa final sai com cara de revista.'},
  {id:'fold',cat:'tec',nm:'Galaxy Z Fold dobrável',emo:'📲',price:12999,status:1,post:.25,desc:'Abre e vira um tablet. Dá pra ver o replay da mão na tela grande.'},
  {id:'watch',cat:'tec',nm:'Smartwatch com monitor de sono',emo:'⌚',price:1499,regen:2,desc:'Avisa quando você dormiu mal e cobra a hora de deitar.'},
  {id:'ultra',cat:'tec',nm:'Apple Watch Ultra',emo:'⌚',price:7999,status:1,regen:3,desc:'Titânio, GPS, sono, batimentos. E ainda aparece no pulso na transmissão.'},
  {id:'ring',cat:'tec',nm:'Ring light com tripé',emo:'💡',price:120,post:.1,desc:'Luz boa muda qualquer vídeo de bastidor.'},
  {id:'gopro',cat:'tec',nm:'Câmera de ação GoPro',emo:'🎥',price:2799,post:.2,desc:'Pra gravar a viagem até o torneio e os vlogs do dia.'},
  {id:'ssd',cat:'info',nm:'SSD 1 TB',emo:'💾',price:399,regen:1,desc:'O produto mais vendido do Mercado Livre. O PC liga na hora e o rastreador de mãos não trava.'},
  {id:'cadeira',cat:'info',nm:'Cadeira ergonômica de estudo',emo:'🪑',price:3500,status:0,regen:5,fx:'Recupera +5 de energia por noite.',desc:'Pra aguentar as horas revendo mãos.'},
  {id:'monitor',cat:'info',nm:'Monitor ultrawide 34"',emo:'🖥️',price:2199,tire:2,desc:'Seis mesas online sem sobrepor janela.'},
  {id:'notebook',cat:'info',nm:'Notebook gamer',emo:'💻',price:6499,tire:2,post:.1,desc:'Estuda solver no quarto do hotel.'},
  {id:'ps5',cat:'info',nm:'PlayStation 5 Slim',emo:'🎮',price:3699,mood:.2,desc:'Desligar a cabeça depois de um bust também é treino.'},
  {id:'switch',cat:'info',nm:'Nintendo Switch 2',emo:'🕹️',price:4499,mood:.2,desc:'Joga na cama, no avião, no intervalo do torneio.'},
  {id:'print3d',cat:'info',nm:'Impressora 3D',emo:'🖨️',price:3299,mood:.1,desc:'Virou mania no Mercado Livre. Você imprime protetor de cartas personalizado.'},
  {id:'alexa',cat:'info',nm:'Echo Dot com Alexa',emo:'🔵',price:399,regen:1,desc:'Apaga a luz, toca chuva pra dormir e lembra do horário do torneio.'},
  {id:'jbl',cat:'audio',nm:'Fone Bluetooth JBL',emo:'🎧',price:249,tire:1,desc:'Fone bluetooth: segundo mais vendido do site. Música no caminho do clube.'},
  {id:'fone',cat:'audio',nm:'Fone com cancelamento de ruído',emo:'🎧',price:1800,status:0,tire:5,fx:'Torneios cansam menos (−5 de energia gasta).',desc:'A mesa some. Só você e as cartas.'},
  {id:'airpods',cat:'audio',nm:'AirPods Pro',emo:'🤍',price:2499,tire:3,desc:'Discreto na mesa, cancelamento bom no avião.'},
  {id:'boombox',cat:'audio',nm:'Caixa de som JBL Boombox',emo:'🔊',price:2999,mood:.15,love:1,desc:'Home game com trilha sonora.'},
  {id:'vinil',cat:'audio',nm:'Toca-discos com vinis',emo:'💿',price:1800,mood:.15,love:2,desc:'Jantar em casa com disco tocando conta ponto.'},
  {id:'moletom',cat:'moda',nm:'Moletom da sorte',emo:'🧥',price:180,status:0,fx:'Humor melhor depois de uma derrota.',desc:'Velho, confortável e com fama de dar sorte.'},
  {id:'kitbasico',cat:'moda',nm:'Kit cuecas e meias',emo:'🧦',price:89,mood:.05,desc:'Cueca, meia e shorts lideram moda masculina no site. Tava precisando.'},
  {id:'bone',cat:'moda',nm:'Boné aba reta',emo:'🧢',price:150,post:.05,desc:'Marca registrada nas fotos.'},
  {id:'corrida',cat:'moda',nm:'Tênis de corrida',emo:'👟',price:499,regen:1,desc:'Amortecimento bom. Corrida de manhã, cabeça limpa à tarde.'},
  {id:'jordan',cat:'moda',nm:'Tênis Air Jordan 1',emo:'👟',price:1499,love:1,fame:.3,desc:'Os fãs reparam no pé do jogador na mesa final.'},
  {id:'camisa',cat:'moda',nm:'Camisa social premium',emo:'👔',price:399,love:1,desc:'Pra jantar e pra entrevista.'},
  {id:'jaqueta',cat:'moda',nm:'Jaqueta de couro',emo:'🧥',price:1200,love:2,desc:'Funciona em qualquer encontro.'},
  {id:'terno',cat:'moda',nm:'Terno sob medida',emo:'🤵',price:4500,status:1,love:3,fame:.4,desc:'Pra premiação, gala e coletiva de imprensa.'},
  {id:'gshock',cat:'joia',nm:'Relógio G-Shock',emo:'⌚',price:899,desc:'Indestrutível. Cronômetro pros níveis de blind.',post:.05},
  {id:'pulseira',cat:'joia',nm:'Pulseira de prata',emo:'📿',price:450,love:1,desc:'Discreta e bonita.'},
  {id:'anel',cat:'joia',nm:'Anel de ouro 18k',emo:'💍',price:3500,love:2,desc:'Bate na mesa quando você dá call. Fica a dúvida se é tell.'},
  {id:'corrente',cat:'joia',nm:'Corrente de ouro',emo:'📿',price:12000,status:1,fx:'+1 de status.',desc:'Brilha na transmissão.'},
  {id:'relogio',cat:'joia',nm:'Relógio suíço',emo:'⌚',price:45000,status:2,fx:'+2 de status.',desc:'Pesado, preciso e caro. As marcas reparam.'},
  {id:'rolex',cat:'joia',nm:'Rolex Submariner',emo:'⌚',price:95000,status:3,fame:1,love:2,desc:'O relógio que todo campeão tira foto com o troféu.'},
  {id:'patek',cat:'joia',nm:'Patek Philippe Nautilus',emo:'💎',price:650000,status:4,fame:2,love:3,desc:'Lista de espera de anos. Comprou no paralelo, com ágio.'},
  {id:'skincare',cat:'bel',nm:'Kit skincare (sérum vitamina C)',emo:'🧴',price:180,love:1,desc:'Séruns faciais estão entre os campeões de venda. Cara descansada mesmo depois de 12 horas de mesa.'},
  {id:'aparador',cat:'bel',nm:'Aparador de barba',emo:'🪒',price:249,love:1,desc:'Barba feita pra foto do pódio.'},
  {id:'perfume',cat:'bel',nm:'Perfume importado 100 ml',emo:'🌫️',price:1100,love:3,desc:'Clássico amadeirado. Elogio garantido no encontro.'},
  {id:'nicho',cat:'bel',nm:'Perfume de nicho',emo:'🫙',price:3200,love:4,desc:'Aquele que ninguém mais na mesa usa.'},
  {id:'massag',cat:'bel',nm:'Massageador elétrico',emo:'💆',price:299,regen:2,desc:'Pescoço e lombar agradecem depois do torneio de dois dias.'},
  {id:'travesseiro',cat:'casa',nm:'Travesseiro viscoelástico',emo:'🛏️',price:199,regen:2,desc:'Dormir bem é a skill mais subestimada do poker.'},
  {id:'blackout',cat:'casa',nm:'Cortina blackout',emo:'🌑',price:189,regen:2,desc:'Torneio acaba às 4h. Dá pra dormir até meio-dia de verdade.'},
  {id:'colchao',cat:'casa',nm:'Colchão king de molas ensacadas',emo:'🛌',price:4990,regen:6,love:1,desc:'O maior salto de energia que dinheiro compra.'},
  {id:'sofa',cat:'casa',nm:'Sofá retrátil',emo:'🛋️',price:3499,regen:2,mood:.05,love:1,desc:'Filme no domingo, cochilo depois do almoço.'},
  {id:'tv',cat:'casa',nm:'Smart TV 65" 4K',emo:'📺',price:3799,mood:.15,love:1,desc:'Assiste às transmissões dos grandes torneios em tela grande.'},
  {id:'arcond',cat:'casa',nm:'Ar-condicionado split',emo:'❄️',price:2499,regen:4,upk:120,desc:'Verão gaúcho sem ar não dá. Aumenta a conta de luz.'},
  {id:'robo',cat:'casa',nm:'Robô aspirador',emo:'🤖',price:1499,regen:1,mood:.05,desc:'Uma tarefa a menos depois de um dia inteiro de mesa.'},
  {id:'ripado',cat:'casa',nm:'Painel ripado e quadros',emo:'🖼️',price:650,love:1,post:.05,desc:'O fundo das suas lives fica bonito.'},
  {id:'airfryer',cat:'elet',nm:'Air fryer 4,5 L',emo:'🍟',price:349,regen:1,desc:'Uma das mais vendidas do site. Come melhor sem perder tempo.'},
  {id:'capsula',cat:'elet',nm:'Cafeteira de cápsula',emo:'☕',price:499,tire:1,desc:'Um espresso antes do nível 1.'},
  {id:'espresso',cat:'elet',nm:'Máquina de espresso automática',emo:'☕',price:5999,tire:3,love:1,desc:'Moe o grão na hora. Café de barista em casa.'},
  {id:'lavadora',cat:'elet',nm:'Lava e seca 12 kg',emo:'🧺',price:3299,regen:1,desc:'Roupa da viagem lavada e seca no mesmo dia.'},
  {id:'geladeira',cat:'elet',nm:'Geladeira frost free inverter',emo:'🧊',price:4299,regen:1,desc:'Comida de verdade na semana do festival.'},
  {id:'adega',cat:'elet',nm:'Adega climatizada',emo:'🍷',price:1899,love:2,desc:'Vinho na temperatura certa pro jantar a dois.'},
  {id:'creatina',cat:'esp',nm:'Creatina 1 kg (todo mês)',emo:'💪',price:99,regen:2,upk:99,desc:'Campeã de vendas do Mercado Livre. Repõe todo mês.'},
  {id:'halteres',cat:'esp',nm:'Kit halteres e kettlebell',emo:'🏋️',price:599,regen:2,mood:.05,desc:'Treino rápido em casa antes do torneio.'},
  {id:'ergo',cat:'esp',nm:'Bicicleta ergométrica',emo:'🚴',price:1899,regen:3,mood:.05,desc:'Pedala vendo replay de mão.'},
  {id:'esteira',cat:'esp',nm:'Esteira elétrica',emo:'🏃',price:4299,regen:4,mood:.1,desc:'Phil Ivey e cia. juram que cardio ganha torneio longo.'},
  {id:'padel',cat:'esp',nm:'Raquete de padel',emo:'🎾',price:899,mood:.1,love:1,desc:'O esporte da moda entre os jogadores de poker.'},
  {id:'speed',cat:'esp',nm:'Bike speed de carbono',emo:'🚲',price:18000,status:1,regen:3,mood:.1,desc:'Pedal de domingo com o pessoal do circuito.'},
  {id:'prancha',cat:'esp',nm:'Prancha de surf',emo:'🏄',price:2500,mood:.15,desc:'Pra quando o festival for no litoral.'},
  {id:'multimidia',cat:'auto',nm:'Central multimídia CarPlay',emo:'🗺️',price:1299,car:1,tire:1,desc:'Podcast de poker no caminho, GPS sem celular na mão.'},
  {id:'som',cat:'auto',nm:'Som automotivo e película',emo:'🔈',price:1800,car:1,love:1,desc:'Carro com som bom faz diferença no primeiro encontro.'},
  {id:'dashcam',cat:'auto',nm:'Câmera veicular',emo:'📹',price:399,car:1,mood:.05,desc:'Volta do torneio de madrugada mais tranquila.'},
  {id:'rodas',cat:'auto',nm:'Rodas aro 20',emo:'🛞',price:9000,car:1,status:1,desc:'O carro chega no clube e todo mundo olha.'},
  {id:'mala',cat:'viag',nm:'Mala de bordo rígida',emo:'🧳',price:1200,tire:2,desc:'Não despacha, não espera esteira. Chega no hotel e já vai pro registro.'},
  {id:'pescoco',cat:'viag',nm:'Travesseiro de pescoço',emo:'😴',price:79,tire:1,desc:'Dorme no ônibus a caminho do festival.'},
  {id:'mochila',cat:'viag',nm:'Mochila antifurto pra notebook',emo:'🎒',price:199,tire:1,desc:'Mochila é das mais vendidas do site. Tudo do torneio num lugar só.'},
  {id:'powerbank',cat:'viag',nm:'Power bank 20.000 mAh',emo:'🔋',price:149,tire:1,desc:'Celular nunca morre no dia 2 do torneio.'},
  {id:'violao',cat:'inst',nm:'Violão',emo:'🎸',price:1199,mood:.15,love:1,desc:'Pra desligar a cabeça. E pra impressionar no churrasco.'},
  {id:'teclado',cat:'inst',nm:'Teclado musical',emo:'🎹',price:1499,mood:.15,desc:'Aprender música treina paciência.'},
  {id:'guitarra',cat:'inst',nm:'Guitarra Stratocaster',emo:'🎸',price:9500,mood:.2,love:2,status:0,desc:'Sonho de infância. Agora o poker paga.'},
  {id:'gato',cat:'pet',nm:'Adoção + enxoval de gato',emo:'🐈',price:900,mood:.3,upk:220,desc:'Cama, arranhador, ração premium e veterinário. Alguém te esperando em casa.'},
  {id:'cao',cat:'pet',nm:'Adoção + enxoval de cachorro',emo:'🐕',price:1400,mood:.35,regen:1,upk:320,desc:'Passeio todo dia de manhã. Ração e vet todo mês.'},
  {id:'aquario',cat:'pet',nm:'Aquário completo 100 L',emo:'🐠',price:1200,mood:.15,upk:60,desc:'Olhar peixe nadando baixa a ansiedade antes do torneio.'},
  {id:'energetico',cat:'merc',nm:'Fardo de energético',emo:'⚡',price:45,cons:1,en:15,desc:'+15 de energia na hora. No máximo 2 por dia.'},
  {id:'cafe',cat:'merc',nm:'Café especial 500 g',emo:'☕',price:69,cons:1,en:8,desc:'+8 de energia na hora.'},
  {id:'churras',cat:'merc',nm:'Kit churrasco (picanha e carvão)',emo:'🥩',price:350,cons:1,en:8,md:1,desc:'+1 de humor e +8 de energia. Domingo é domingo.'},
  {id:'vinho',cat:'merc',nm:'Vinho tinto',emo:'🍷',price:120,cons:1,md:1,desc:'+1 de humor na hora.'},
  {id:'champ',cat:'merc',nm:'Champagne pra comemorar',emo:'🍾',price:450,cons:1,md:2,fame:.2,desc:'+2 de humor e foto pro Instagram.'},
  {id:'blue',cat:'merc',nm:'Whisky Blue Label (coleção)',emo:'🥃',price:1600,love:1,status:0,desc:'Fica na estante e sai em ocasião especial.'}];
const IFXN={status:'status',regen:'energia por noite',tire:'energia a menos por torneio',love:'nos encontros',mood:'humor por dia',post:'fãs por post',upk:'por mês'};
function ifxTxt(x){if(x.fx)return x.fx;if(x.cons)return[x.en?`+${x.en} de energia agora`:'',x.md?`+${x.md} de humor agora`:''].filter(Boolean).join(' · ')+' · consumível';
  const a=[];if(x.status)a.push(`+${x.status} de status`);if(x.regen)a.push(`+${x.regen} de energia por noite`);if(x.tire)a.push(`torneio cansa −${x.tire}`);if(x.love)a.push(`+${x.love} nos encontros`);
  if(x.mood)a.push(`humor ${x.mood>=.3?'bem ':''}mais alto todo dia`);if(x.post)a.push(`+${Math.round(x.post*100)}% de fãs por post`);if(x.fame)a.push('repercute nas redes');if(x.upk)a.push(`R$ ${brl(x.upk)}/mês`);if(x.car)a.push('precisa de carro');return a.join(' · ')||'Só pelo prazer de ter.'}
const SPONS=[
  {id:'padaria',nm:'Padaria Pão de Ouro',emo:'🥐',fame:6,status:0,day:25,win:300,itm:80,dur:10,req:{t:3},desc:'A padaria do bairro quer o nome dela no seu boné.'},
  {id:'cafe',nm:'Café Grão Forte',emo:'☕',fame:13,status:0,day:60,win:800,itm:200,dur:14,req:{t:4,post:2},desc:'Café torrado na serra. Quer fotos suas estudando com uma xícara do lado.'},
  {id:'raio',nm:'Energético Raio',emo:'⚡',fame:22,status:1,day:140,win:2000,itm:400,dur:14,req:{t:5,post:3},desc:'Marca jovem e barulhenta. Quer presença nas redes.'},
  {id:'clube',nm:'Feltro Poker Club',emo:'♣️',fame:32,status:1,day:300,win:0,itm:0,pct:.08,dur:21,req:{t:6,mtt:2},desc:'O clube paga um fixo mais 8% de todos os seus prêmios. Quer você nos torneios grandes.'},
  {id:'tempo',nm:'Relógios Tempo Real',emo:'⏱️',fame:44,status:3,day:600,win:6000,itm:1200,dur:21,req:{t:6,iv:1},desc:'Relojoaria de luxo. Só patrocina quem tem imagem de vencedor.'},
  {id:'cofre',nm:'Banco Cofre',emo:'🏦',fame:60,status:5,day:1400,win:15000,itm:3000,dur:30,req:{t:8,iv:2},clean:true,desc:'Banco digital. Imagem impecável: nada de provocação na imprensa.'},
  {id:'liga',nm:'Liga Nacional de Poker (embaixador)',emo:'🏆',fame:78,status:6,day:3000,win:25000,itm:5000,dur:30,req:{t:10,mtt:3,post:4,iv:2},desc:'O topo: rosto oficial do poker brasileiro.'},
  {id:'mundial',nm:'Sala Mundial de Poker Online (embaixador global)',emo:'🌎',fame:88,status:0,day:12000,win:200000,itm:20000,dur:60,req:{t:10,mtt:4,post:6,iv:3},desc:'Embaixador global de uma grande sala online: salário de estrela, viagens e buy-ins pagos.'}];
{const NV={padaria:[30,400,100],cafe:[80,1000,250],raio:[250,3000,600],clube:[500,0,0],tempo:[1200,10000,2000],cofre:[2500,25000,5000],liga:[5000,40000,8000],mundial:[16000,250000,25000]};SPONS.forEach(p=>{const v=NV[p.id];if(v){p.day=v[0];p.win=v[1];p.itm=v[2]}})}
const SP_OLD={padaria:[25,300,80],cafe:[60,800,200],raio:[140,2000,400],clube:[300,0,0],tempo:[600,6000,1200],cofre:[1400,15000,3000],liga:[3000,25000,5000],mundial:[12000,200000,20000]};
const SPCH=id=>(typeof LIFE!=='undefined'&&LIFE.s&&LIFE.s.champN&&['mundial','liga','tempo','cofre'].includes(id))?1.25:1;
const SPK=b=>b==null?1:b>=2500?1:b>=1000?.5:b>=500?.3:b>=200?.15:.08;
const FAMEL=[[0,'Desconhecido','🙂'],[8,'Rosto conhecido no clube','😃'],[20,'Regular respeitado','😎'],[35,'Nome do circuito','🤠'],[55,'Estrela do feltro','🌟'],[80,'Lenda','👑']];
const PAYK={'conservador':.85,'calculista':.75,'frio':.75,'fria':.75,'paciente':.75,'confiante':.6,'supersticioso':.5,'cabeça quente':.45,'impulsivo':.35,'desesperado':.25};
const lx=t=>String(t||'').replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const pickA=a=>a[Math.random()*a.length|0];

const LIFE={LS:CAR.ls('escolaPoker.life.v1'),s:null,db:null,tab:'casa',open:null,
  fresh(){return{v:1,fame:0,fans:40,energy:100,mood:0,home:'kit',own:{},fin:null,cars:[],car:null,items:[],sp:null,strikes:0,offers:[],ivs:[],ivRun:null,heads:[],notes:[],th:{},req:{},loans:[],day:null,did:{},posts:[],sum:null,seeded:false,updatedAt:0}},
  load(){try{const x=JSON.parse(localStorage.getItem(this.LS)||'null');this.s=x&&x.v?Object.assign(this.fresh(),x):this.fresh()}catch(e){this.s=this.fresh()}},
  saveLocal(){try{localStorage.setItem(this.LS,JSON.stringify(this.s))}catch(e){}},
  async remote(db){this.db=db;try{const d=await db.collection('life').doc('me'+CAR.sfx()).get();const x=d&&d.exists?d.data():null;
      if(x&&x.v&&(x.updatedAt||0)>(this.s.updatedAt||0)){this.s=Object.assign(this.fresh(),JSON.parse(JSON.stringify(x)));this.saveLocal()}else if(this.s.updatedAt)this.push()}catch(e){}
    this.ready=true;try{syncFix()}catch(e){}
    this.badge();if(location.hash==='#vida')renderLife()},
  push(){if(!this.db)return;const body=JSON.parse(JSON.stringify(this.s)),ref=this.db.collection('life').doc('me'+CAR.sfx());HIST.q=HIST.q.then(()=>ref.set(body)).catch(()=>{})},
  commit(){if(!this.ready&&!(this.s.updatedAt>0)){this.saveLocal();this.badge();return}this.s.updatedAt=Date.now();this.saveLocal();clearTimeout(this._t);this._t=setTimeout(()=>this.push(),1200);this.badge();try{CAR.touch(true)}catch(e){}},
  /* ---------- números ---------- */
  homeObj(id){return HOMES.find(h=>h.id===(id||this.s.home))||HOMES[1]},
  status(){const s=this.s;return this.homeObj().status+Math.max(0,...s.cars.map(c=>(CARS.find(x=>x.id===c)||{status:0}).status))+s.items.reduce((a,i)=>a+((ITEMS.find(x=>x.id===i)||{}).status||0),0)},
  has(i){return this.s&&this.s.items.includes(i)},
  ifx(k){if(!this.s)return 0;const CAP={regen:25,tire:10,love:10,mood:.6,post:.8};const v=this.s.items.reduce((a,i)=>a+((ITEMS.find(x=>x.id===i)||{})[k]||0),0);return CAP[k]!=null?Math.min(CAP[k],v):v},
  level(){let L=FAMEL[0];FAMEL.forEach(x=>{if(this.s.fame>=x[0])L=x});return L},
  regenRate(){const H=this.homeObj();return 30+H.comfort*8+this.ifx('regen')+(this.s.cars.length?3:0)},
  regen(){const s=this.s,now=Date.now();if(!s.eT||CAL.on()){s.eT=now;return}const h=(now-s.eT)/3.6e6;if(h<.01)return;s.energy=clamp(s.energy+h*this.regenRate()/4,0,100);s.eT=now},
  cardAdj(){if(this.s)this.regen();const e=this.s?this.s.energy:100;return e>=75?1:e<15?-2:e<35?-1:0},
  energyTxt(){const e=this.s.energy;return e>=75?'Descansado: +1 cartão de tempo nas mesas':e<15?'Exausto: −2 cartões de tempo':e<35?'Cansado: −1 cartão de tempo':'Normal'},
  spFix(){const s=this.s;try{if(s.retro&&LIVES.ready&&this.ready&&LIVES.s&&!LIVES.s.botRetro&&HIST.status==='nuvem')RETRO.applyBots()}catch(e){}if(s.spFix)return;s.spFix=1;const n=(s.notes||[]).find(x=>/^Contrato encerrado: /.test(x.title)&&/trocou de patrocinador/.test(x.body||'')&&Date.now()-x.t<5*864e5);if(!n)return;
    const p=SPONS.find(x=>x.nm===n.title.replace('Contrato encerrado: ',''));if(!p||this.spById(p.id)||this.sps().some(x=>this.spCat(x.id)===this.spCat(p.id)))return;if(s.spBan)delete s.spBan[p.id];
    const c={id:p.id,nm:p.nm,emo:p.emo,day:p.day,win:p.win,itm:p.itm,pct:p.pct||0,req:p.req,clean:!!p.clean,start:s.day,end:s.day+p.dur,done:{t:0,mtt:0,post:0,iv:0}};if(!s.sp)s.sp=c;else{s.spx=s.spx||[];s.spx.push(c)}
    this.note(p.emo,`Contrato restaurado: ${p.nm}`,'Agora dá pra ter vários patrocinadores ao mesmo tempo. Só marcas concorrentes não dividem o mesmo jogador.');this.commit()},
  sps(){const s=this.s;if(!s)return[];s.spx=s.spx||[];return[s.sp,...s.spx].filter(Boolean)},
  spById(id){return this.sps().find(x=>x.id===id)||null},
  spRivals(id){return this.sps().filter(x=>x.id!==id&&this.spCat(x.id)===this.spCat(id))},
  spFix2(){const s=this.s;if(!s||s.spFix2)return;s.spFix2=1;const seen={};(s.notes||[]).filter(x=>/^Contrato encerrado: /.test(x.title)&&/concorrente direta/.test(x.body||'')&&Date.now()-x.t<10*864e5).forEach(n=>{const p=SPONS.find(x=>x.nm===n.title.replace('Contrato encerrado: ',''));if(!p||seen[p.id]||this.spById(p.id)||this.spRivals(p.id).length)return;seen[p.id]=1;if(s.spBan)delete s.spBan[p.id];
    const c={id:p.id,nm:p.nm,emo:p.emo,day:p.day,win:p.win,itm:p.itm,pct:p.pct||0,req:p.req,clean:!!p.clean,start:s.day,end:s.day+p.dur,done:{t:0,mtt:0,post:0,iv:0}};if(!s.sp)s.sp=c;else{s.spx=s.spx||[];s.spx.push(c)}
    this.note(p.emo,`Contrato restaurado: ${p.nm}`,'Clube ao vivo e sala online são ramos diferentes: as duas marcas convivem. Só concorrentes diretos (mesmo ramo) se excluem, e agora o app avisa antes de assinar.')});this.commit()},
  dropSp(id){const s=this.s;s.spx=s.spx||[];if(s.sp&&s.sp.id===id)s.sp=s.spx.shift()||null;else s.spx=s.spx.filter(x=>x.id!==id)},
  spCat(id){return({clube:'clube',mundial:'sala',asdeouro:'sala',cafe:'cafe',raio:'energetico',padaria:'padaria',tempo:'relogio',cofre:'banco',liga:'liga'})[id]||id},
  patch(){const L=this.sps();return L.length?`<span class="ppatch" title="${lx(L.map(x=>x.nm).join(', '))}">${L.map(x=>x.emo).join('')}</span>`:''},
  addFame(v){const s=this.s;if(v>0)v*=1+this.status()*.04;s.hype=clamp((s.hype||0)+v*1.5,0,15);if(v>0)s.fans+=Math.round(v*(18+s.fame*2.2)*(.7+Math.random()*.6));this.calc()},
  /* fama = carreira + troféus + ranking + técnica + mídia (recalculada, nunca cai por jogar) */
  parts(){const T=HIST.sessions().filter(x=>x.mode==='tour'&&x.place);let C=0,W=0,P=0;
    T.forEach(x=>{const of=x.of||((x.cfg&&x.cfg.bots||0)+1);C+=CIRC.pts(x.place,of);if(x.place===1)W++;else if(x.place<=3)P++});
    const tab=CIRC.table(),pos=tab.findIndex(r=>r.me)+1,me=tab[pos-1];
    let ok=0,n=0;const H=HIST.hands();for(let k=H.length-1;k>=0&&n<600;k--)(H[k].d||[]).forEach(d=>{if(!d||!d.cat)return;n++;if(d.cat==='ok')ok++});
    const tec=n>=30?clamp((ok/n-.6)/.35,0,1)*10:0;
    return{car:40*(1-Math.exp(-C/1500)),tro:Math.min(15,W*3+P*1.5),rk:me&&me.pts?(pos===1?10:pos===2?7:pos===3?5:pos<=5?3:pos<=10?1:0):0,tec,hype:this.s.hype||0,C,W,P,T:T.length,pos,okp:n?ok/n:0,dn:n}},
  botFame(n){const b=LIVES.s.bots[n];if(!b)return 0;const C=b.cpts!=null?b.cpts:((b.sea&&b.sea.pts)||0),r=b.res||{},W=r.wins||0,P=b.pod||Math.max(0,(r.itm||0)-W);
    return 40*(1-Math.exp(-C/1500))+Math.min(15,W*3+P*1.5)+5+(b.mood>=2?1:0)},
  calc(){const s=this.s;if(!s||!LIVES.s)return 0;if(this._ct&&Date.now()-this._ct<1500)return s.fame;this._ct=Date.now();
    const p=this.parts();p.rk=p.rk;let f=p.car+p.tro+p.tec+p.hype;
    const tab=CIRC.table(),pos=tab.findIndex(r=>r.me)+1;f+=p.rk;s.fp=p;s.fame=clamp(f,0,100);s.fans=Math.max(s.fans||0,Math.round(40+s.fame*s.fame*10));return s.fame},
  famous(){const me=CIRC.me(),tab=CIRC.table(),L=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&LIVES.bio(n)).map(n=>{const pos=tab.findIndex(r=>r.name===n)+1,row=tab[pos-1];
      return{n,f:this.botFame(n)+(row&&row.pts?(pos===1?10:pos===2?7:pos===3?5:pos<=5?3:pos<=10?1:0):0)}});L.push({n:me,f:this.s.fame,me:true});return L.sort((a,b)=>b.f-a.f)},
  addMood(v){this.s.mood=clamp(this.s.mood+v,-3,3)},
  rel(n){return LIVES.rel(n,'Você')},
  relTxt(n){const r=this.rel(n);return r>=2?'Amigo':r>=1?'Chegado':r<=-2?'Rival':r<=-1?'Desafeto':'Conhecido'},
  daily(key){return this.s.did[key]===LIVES.s.day},
  mark(key){this.s.did[key]=LIVES.s.day},
  /* fama inicial: o que você já fez no circuito */
  seed(){const s=this.s;if(s.seeded)return;const TT=HIST.sessions().filter(x=>x.mode==='tour'&&x.place);if(!TT.length&&HIST.status!=='nuvem')return;s.seeded=true;this._ct=0;let f=0;
    TT.forEach(x=>{const of=x.of||((x.cfg&&x.cfg.bots||0)+1),mtt=!!(x.cfg&&x.cfg.field);f+=this.tourFame(x.place,of,(x.prize||0)>0,mtt)});
    this.calc();if(s.day==null)s.day=LIVES.s.day},
  tourFame(place,of,itm,mtt){const k=Math.sqrt(of/9);return place===1?(mtt?7:3)*k:itm?((mtt?3:1.2)*(1-(place-1)/of)+.5)*k:.15},
  /* ---------- passagem dos dias ---------- */
  sync(){if(!this.s||!LIVES.s)return;this.seed();this.spFix();try{if(this.ready)this.spFix2()}catch(e){}this.regen();this._ct=0;this.calc();const s=this.s;if(s.day==null)s.day=LIVES.s.day;
    let n=Math.min(40,LIVES.s.day-s.day);if(n<=0)return;const sum={days:n,it:{}},cm=CAR.cfg().cost;const add=(k,v)=>sum.it[k]=(sum.it[k]||0)+(v<0&&k!=='financiamento'?Math.round(v*cm):v);
    for(let i=0;i<n;i++){s.day++;this.oneDay(add)}
    s.day=LIVES.s.day;Object.entries(sum.it).forEach(([k,v])=>{if(v)WALLET.add(v,k.charAt(0).toUpperCase()+k.slice(1))});
    sum.t=Date.now();s.sum=sum;this.commit()},
  jobPay(){const j=this.s.job;return j?(j.week?j.pay*5:j.pay*20):0},
  oneDay(add){const s=this.s,H=this.homeObj(),dt=CAL.date(s.day),dm=dt.getDate(),wd=dt.getDay(),half=s.loveHome?.5:1;
    s.energy=clamp(s.energy+this.regenRate(),0,100);if(s.job&&wd>=1&&wd<=5)s.energy=Math.max(0,s.energy-s.job.tire);
    if(wd===1){add('mercado e despesas da semana',-280);if(!s.cars.length)add('transporte da semana',-105);this.sps().forEach(p=>add(`patrocínio ${p.nm} (semana)`,p.day*7));if(s.job&&s.job.week)add('bico (semana)',this.jobPay())}
    if(dm===5){if(s.job&&!s.job.week)add('salário',this.jobPay());
      if(s.own[H.id])add('condomínio e IPTU',-Math.round(H.rent*.25*30));else if(H.rent)add('aluguel',-Math.round(H.rent*30*half));
      Object.keys(s.own).filter(id=>id!==H.id).forEach(id=>{const X=this.homeObj(id);add('aluguel recebido',Math.round((X.rent*.7-X.rent*.25)*30))});
      if(s.fin){const p=Math.min(s.fin.rem,s.fin.daily*30);s.fin.rem-=p;add('parcela do financiamento',-p);if(s.fin.rem<=.5){this.note('🏦','Financiamento quitado',`A ${this.homeObj(s.fin.home).nm} é toda sua. Acabaram as parcelas.`);s.fin=null}}}
    if(dm===10&&H.id!=='pais')add('luz, água e internet',-Math.round((150+H.comfort*90)*half));
    if(dm===15)s.cars.forEach(c=>{const C=CARS.find(x=>x.id===c);if(C)add('carros: seguro e manutenção',-C.upk*30)});
    this.sps().filter(p=>s.day>=p.end).forEach(p=>this.spEnd(p));
    s.mood+=s.mood>0?-.5:s.mood<0?.5:0;if(WALLET.s.bal<0)this.addMood(-1);{const im=this.ifx('mood');if(im&&s.mood<2)s.mood=Math.min(2,s.mood+im)}
    if(dm===20){const u=this.ifx('upk');if(u)add('assinaturas e manutenção (loja)',-u)}
    s.hype=(s.hype||0)*.93;this._ct=0;s.fans+=Math.round(s.fame*s.fame*.05*Math.random());
    s.offers=s.offers.filter(o=>s.day-o.day<=3);s.ivs=s.ivs.filter(o=>s.day-o.day<=2);
    this.genOffer();this.genTexts();this.loansTick();try{HG.gen()}catch(e){}try{SCOUT.daily(add)}catch(e){}},
  /* ---------- patrocínio ---------- */
  genOffer(){const s=this.s,st=this.status();if(s.offers.length>=2||Math.random()<.4)return;
    const ok=SPONS.filter(p=>s.fame>=p.fame&&st>=p.status&&!this.sps().some(x=>x.id===p.id)&&!s.offers.some(o=>o.id===p.id)&&!(s.spBan||{})[p.id]);if(!ok.length)return;
    const p=ok[ok.length-1-(Math.random()<.35&&ok.length>1?1:0)];const o={id:p.id,day:s.day,mult:1};s.offers.push(o);
    this.note(p.emo,`Proposta: ${p.nm}`,`R$ ${brl(p.day)} por dia durante ${p.dur} dias${p.win?`, bônus de R$ ${brl(p.win)} por título`:''}${p.pct?`, mais ${Math.round(p.pct*100)}% dos prêmios`:''}. Responda em até 3 dias na aba Patrocínio.`,'offer')},
  spTerms(o){const p=SPONS.find(x=>x.id===o.id);const m=(o.mult||1)*SPCH(o.id);return Object.assign({},p,{day:Math.round(p.day*m),win:Math.round(p.win*m),itm:Math.round(p.itm*m)})},
  reqTxt(r){const a=[];if(r.t)a.push(`${r.t} torneios`);if(r.mtt)a.push(`${r.mtt} multimesas`);if(r.post)a.push(`${r.post} posts`);if(r.iv)a.push(`${r.iv} entrevista${r.iv>1?'s':''}`);return a.join(', ')},
  spAccept(id){const s=this.s,o=s.offers.find(x=>x.id===id);if(!o)return;const T=this.spTerms(o);
    const rival=this.sps().find(x=>x.id!==T.id&&this.spCat(x.id)===this.spCat(T.id));if(rival){this.note(rival.emo,`Contrato encerrado: ${rival.nm}`,`A ${T.nm} é concorrente direta: as duas marcas não dividem o mesmo jogador.`);this.relSp(rival.id);this.dropSp(rival.id)}
    this.dropSp(T.id);const nsp={id:T.id,nm:T.nm,emo:T.emo,day:T.day,win:T.win,itm:T.itm,pct:T.pct||0,req:T.req,clean:!!T.clean,start:s.day,end:s.day+T.dur,done:{t:0,mtt:0,post:0,iv:0}};if(!s.sp){s.sp=nsp;s.strikes=0}else{s.spx=s.spx||[];s.spx.push(nsp)}
    s.offers=s.offers.filter(x=>x.id!==id);this.addFame(1.5);
    CIRC.post({k:'vida',title:`${CIRC.me()} fecha patrocínio com ${T.nm}`,body:`Contrato de ${T.dur} dias. Agora o ${T.emo} vai estar no boné em todas as mesas.`});LIVES.commit();this.commit()},
  relSp(id){this.s.spBan=this.s.spBan||{};this.s.spBan[id]=this.s.day+7},
  spNego(id){const s=this.s,o=s.offers.find(x=>x.id===id);if(!o||o.neg)return null;const p=SPONS.find(x=>x.id===id);o.neg=true;
    const ch=clamp(.35+(s.fame-p.fame)/40+this.status()*.02,.1,.85);
    if(Math.random()<ch){o.mult=1.25;this.commit();return true}s.offers=s.offers.filter(x=>x.id!==id);this.relSp(id);this.commit();return false},
  spRefuse(id){this.s.offers=this.s.offers.filter(x=>x.id!==id);this.relSp(id);this.commit()},
  spMet(p){const sp=p||this.s.sp;if(!sp)return true;return Object.entries(sp.req).every(([k,v])=>(sp.done[k]||0)>=v)},
  spEnd(p){const s=this.s,sp=p||s.sp;if(!sp)return;const ok=this.spMet(sp);this.dropSp(sp.id);
    if(ok){this.addFame(1);const o={id:sp.id,day:s.day,mult:1.15,renew:true};s.offers=s.offers.filter(x=>x.id!==sp.id);s.offers.push(o);
      this.note(sp.emo,`${sp.nm} quer renovar`,`Você cumpriu o contrato. A marca oferece renovação com 15% a mais. Responda em até 3 dias.`,'offer')}
    else{this.addFame(-2);this.relSp(sp.id);this.note(sp.emo,`${sp.nm} não renovou`,`Faltou cumprir: ${this.reqTxt(Object.fromEntries(Object.entries(sp.req).filter(([k,v])=>(sp.done[k]||0)<v).map(([k,v])=>[k,v-(sp.done[k]||0)])))}.`);
      CIRC.post({k:'bast',title:'',body:`${sp.nm} encerrou o patrocínio de ${CIRC.me()}. Dizem que faltou entrega.`})}},
  /* ---------- notificações e mensagens ---------- */
  note(emo,title,body,kind){const s=this.s;s.notes.unshift({t:Date.now(),emo,title,body,kind:kind||'',read:false});if(s.notes.length>60)s.notes.length=60},
  text(n,txt,o){const s=this.s,T=s.th[n]=s.th[n]||{m:[],u:0};T.m.push(Object.assign({f:'them',x:txt,t:Date.now()},o||{}));if(T.m.length>40)T.m.splice(0,T.m.length-40);T.u++;T.t=Date.now()},
  mine(n,txt){const T=this.s.th[n]=this.s.th[n]||{m:[],u:0};T.m.push({f:'me',x:txt,t:Date.now()});T.t=Date.now()},
  unread(){const s=this.s;if(!s)return 0;return Object.values(s.th).reduce((a,t)=>a+(t.u||0),0)+((s.love&&s.love.tu)||0)+s.notes.filter(x=>!x.read).length+(s.ivs.length?1:0)},
  badge(){const a=document.querySelector('nav a[href="#vida"]');if(!a)return;const u=this.unread();a.innerHTML=`<span class="ni">🏠</span><span class="nl">Vida</span>${u?`<span class="vbdg nbg">${u>9?'9+':u}</span>`:''}`},
  genTexts(){const s=this.s,bots=LIVES.ALL().filter(n=>LIVES.bio(n)&&LIVES.s.bots[n]),r=Math.random;
    /* pedido de empréstimo */
    if(r()<.35){const c=bots.filter(n=>{const b=LIVES.s.bots[n],B=LIVES.bio(n);return this.rel(n)>=0&&!s.req[n]&&!s.loans.some(l=>l.n===n&&!l.paid)&&(b.cond.aluguel||b.bank<(B.rent||800)*.5)});
      if(c.length){const n=pickA(c),B=LIVES.bio(n),v=Math.max(300,Math.round(((B.rent||600)*(.6+r()*.6))/50)*50);s.req[n]={v,day:s.day};
        this.text(n,pickA([`Oi... que vergonha pedir isso, mas tô apertado${LIVES.s.bots[n].cond.aluguel?' com o aluguel':''}. Me empresta R$ ${brl(v)}? Te devolvo em uma semana.`,`Cara, preciso de uma força. R$ ${brl(v)} até semana que vem. Tu sabe que eu pago.`,`Situação chata aqui. Tem como me emprestar R$ ${brl(v)}? Juro que devolvo.`]),{k:'loan',v})}}
    /* papo de amigo */
    const fr=bots.filter(n=>this.rel(n)>=1);if(fr.length&&r()<.6){const n=pickA(fr),b=LIVES.s.bots[n],d=(b.diary||[])[0];
      this.text(n,d&&r()<.6?pickA([`Tu não sabe da última: ${d.t.charAt(0).toLowerCase()+d.t.slice(1)}`,`Dia doido. ${d.t}`]):pickA(['E aí, vai jogar hoje?','Tô revendo umas mãos de 3-bet, depois me explica uma coisa?','Bora marcar um home game qualquer dia desses?','Viu o Feltro de hoje? O ranking tá pegando fogo.','Saudade de uma mesa boa. Tô só no cash pequeno essa semana.']))}
    /* rival cutuca */
    const rv=bots.filter(n=>this.rel(n)<=-2);if(rv.length&&r()<.3){const n=pickA(rv);this.text(n,pickA(['Vi teu nome no jornal. Aproveita enquanto dura.','Me espera no próximo multimesas.','Ainda tô lembrando daquela mão. Vai ter volta.']))}},
  loansTick(){const s=this.s;s.loans.filter(l=>!l.paid).forEach(l=>{const b=LIVES.s.bots[l.n],B=LIVES.bio(l.n);if(!b||!B)return;
    if(s.day>=l.due&&b.bank>l.v*1.5&&Math.random()<(PAYK[B.trait]||.5)){this.repay(l);return}
    if(s.day>l.due+7&&!l.late){l.late=true;LIVES.relAdd(l.n,'Você',-.5);CIRC.post({k:'bast',title:'',body:`${l.n} está devendo R$ ${brl(l.v)} para ${CIRC.me()} e sumiu do clube.`})}})},
  repay(l){const b=LIVES.s.bots[l.n];b.bank-=l.v;l.paid=true;WALLET.add(l.v,`${l.n} devolveu o empréstimo`);LIVES.relAdd(l.n,'Você',.5);
    this.text(l.n,pickA([`Tá na tua conta: R$ ${brl(l.v)}. Valeu demais, de verdade.`,`Te mandei os R$ ${brl(l.v)}. Fico te devendo uma, mas agora só uma.`]));LIVES.commit()},
  lend(n){const s=this.s,q=s.req[n];if(!q)return;if(!WALLET.can(q.v))return'Saldo insuficiente.';WALLET.add(-q.v,`Empréstimo para ${n}`);
    const b=LIVES.s.bots[n];b.bank+=q.v;delete b.cond.aluguel;LIVES.relAdd(n,'Você',1.5);b.mood=Math.min(3,b.mood+1);LIVES.note(n,`${CIRC.me()} emprestou R$ ${nf(q.v)} quando ninguém mais emprestou.`);
    s.loans.push({n,v:q.v,day:s.day,due:s.day+7});delete s.req[n];this.mine(n,`Mandei os R$ ${brl(q.v)}. Sem pressa.`);this.text(n,pickA(['Nem sei como agradecer. Salvou meu mês.','Valeu, sério. Não esqueço disso.']));this.mark('lend');LIVES.commit();this.commit()},
  deny(n){const s=this.s;if(!s.req[n])return;delete s.req[n];LIVES.relAdd(n,'Você',-.5);this.mine(n,'Agora não dá, foi mal.');this.text(n,pickA(['Tranquilo, entendo.','Ok… vou dar um jeito.']));LIVES.commit();this.commit()},
  collect(l){const b=LIVES.s.bots[l.n];if(!b)return;if(b.bank>=l.v){this.mine(l.n,'E aquele dinheiro?');this.repay(l)}else{LIVES.relAdd(l.n,'Você',-.3);this.mine(l.n,'E aquele dinheiro?');this.text(l.n,pickA(['Tô sem ainda, me dá mais uns dias.','Juro que tô juntando. Semana que vem.']));LIVES.commit()}this.commit()},
  call(n){const b=LIVES.s.bots[n],B=LIVES.bio(n);if(!b||!B||this.daily('call:'+n))return null;this.mark('call:'+n);this.s.energy=Math.max(0,this.s.energy-2);
    if(this.rel(n)<=-2){this.commit();return`${n} viu quem era e não atendeu.`}
    LIVES.relAdd(n,'Você',.3);const st=LIVES.state(n),d=(b.diary||[])[0];let t=`${n} atendeu`;
    if(st&&st.tags.some(x=>x[0]==='tilt'))t+=', ainda irritado com o jogo. Reclamou dos bad beats por dez minutos.';
    else if(st&&st.tags.some(x=>x[0]==='press'))t+=` meio sem graça. Contou que o dinheiro tá curto e que tá tentando segurar as contas.`;
    else if(d)t+=`. Contou que ${d.t.charAt(0).toLowerCase()+d.t.slice(1)}`;else t+=`. Falaram de ${B.job.toLowerCase()==='estudante de medicina'?'faculdade':'trabalho'}, família e da próxima rodada do circuito.`;
    if(b.mood>=1)t+=' Estava de ótimo humor.';LIVES.commit();this.commit();return t},
  outCost(){return Math.round(120*(1+this.status()*.15)/10)*10},
  out(n){const s=this.s,b=LIVES.s.bots[n];if(!b)return null;if(this.daily('out:'+n))return`Vocês já saíram hoje.`;
    if(Object.keys(s.did).filter(k=>k.startsWith('out:')&&s.did[k]===LIVES.s.day).length>=2)return'Você já saiu duas vezes hoje. Descansa.';
    if(this.rel(n)<=-2){this.mark('out:'+n);this.commit();return`${n} respondeu: "Sair contigo? Nem pensar."`}
    const c=this.outCost();if(!WALLET.can(c))return'Saldo insuficiente.';this.mark('out:'+n);WALLET.add(-c,`Saiu com ${n}`);
    s.energy=Math.max(0,s.energy-12);this.addMood(1);LIVES.relAdd(n,'Você',1.2);b.mood=Math.min(3,b.mood+1);LIVES.note(n,`Saiu com ${CIRC.me()} pra tomar uma. Noite boa.`);
    LIVES.commit();this.commit();return pickA([`Vocês foram num boteco perto do clube. ${n} riu a noite toda.`,`Jantaram juntos e falaram de poker até o restaurante fechar.`,`Foram ver o jogo num bar. ${n} pagou a primeira rodada.`])+` (−R$ ${brl(c)})`},
  async chat(n,txt){const s=this.s,b=LIVES.s.bots[n],B=LIVES.bio(n);if(!b||!B)return;this.mine(n,txt);this.commit();
    const me=CIRC.me(),T=s.th[n],hist=T.m.slice(-10).map(m=>`${m.f==='me'?me:n}: ${m.x}`).join('\n'),st=LIVES.state(n),r=this.rel(n),M=CIRC.mine();
    const prompt=`Você está simulando uma conversa de WhatsApp dentro de um jogo de poker brasileiro. Responda como ${n}: ${B.age} anos, ${B.job}; ${B.fam}; temperamento ${B.trait}. Dinheiro: R$ ${nf(Math.round(b.bank))}. Estado: ${st&&st.tags.length?st.tags.map(x=>x[2]).join(' '):'normal'}. Lembranças: ${(b.diary||[]).slice(0,4).map(x=>x.t).join(' / ')||'nada marcante'}.
Relação com ${me}: ${this.relTxt(n)} (${r.toFixed(1)} numa escala de -5 a 5). Sobre você mesmo: ${(()=>{try{return PUB.bot(n)}catch(e){return''}})()}
O que você e todo o circuito sabem sobre ${me} (você lê o jornal, acompanha o ranking e as redes dele; use quando fizer sentido, sem despejar tudo):
${(()=>{try{return PUB.me()}catch(e){return''}})()}${(()=>{try{return TOUR.g&&!TOUR.g.finished&&TOUR.g.ev?`\nAgora mesmo ${me} está jogando: ${PUB.table(TOUR.g,TOUR)}${TOUR.g.players.some(p=>p.name===n&&!p.out)?` Você (${n}) está na mesma mesa que ele!`:''}`:''}catch(e){return''}})()}
Conversa até agora:
${hist}
Escreva de 1 a 2 mensagens curtas de WhatsApp, em português do Brasil informal, coerentes com a personalidade e a relação (rival provoca, amigo é caloroso). Não invente que ${me} disse algo que ele não disse. ${SARC}
Responda só com JSON: {"msgs":["..."],"rel":0} — rel de -1 a 1: como a mensagem de ${me} mexeu com a simpatia de ${n}.`;
    this.typing=n;if(location.hash==='#vida')renderLife();
    const v=await AIX.ask(prompt);this.typing=null;
    const ms=v&&Array.isArray(v.msgs)?v.msgs.filter(x=>typeof x==='string'&&x.trim()).slice(0,2):[];
    if(ms.length){ms.forEach(x=>this.text(n,x.slice(0,280)));if(v.rel)LIVES.relAdd(n,'Você',clamp(+v.rel||0,-1,1))}
    else this.text(n,LIVES.hear(n,LIVES.intent(txt)).replace(/^["“]|["”]$/g,''));
    T.u=0;LIVES.commit();this.commit();if(location.hash==='#vida')renderLife()},
  /* ---------- compras ---------- */
  buy(kind,id,mode){const s=this.s;let msg='';
    if(kind==='home'){const H=this.homeObj(id);
      if(mode==='rent'){const fee=600+H.rent*5;if(!WALLET.can(fee))return'Saldo insuficiente para a mudança.';WALLET.add(-fee,`Mudança: ${H.nm}`);s.home=id;msg=`Mudou para ${H.nm}.`}
      if(mode==='cash'){if(!WALLET.can(H.price))return'Saldo insuficiente.';WALLET.add(-H.price,`Compra: ${H.nm}`);s.own[id]=true;s.home=id;msg=`Comprou ${H.nm}.`}
      if(mode==='fin'){if(s.fin)return'Você já tem um financiamento. Quite antes.';const e=Math.round(H.price*.2),rem=Math.round(H.price*.8*1.15);if(!WALLET.can(e))return'Saldo insuficiente para a entrada.';
        WALLET.add(-e,`Entrada (20%): ${H.nm}`);s.own[id]=true;s.home=id;s.fin={home:id,rem,daily:Math.round(rem/360)};msg=`Comprou ${H.nm} financiada.`}
      if(mode==='move'){s.home=id;msg=`Mudou para ${H.nm}.`}
      if(mode==='sell'){if(s.fin&&s.fin.home===id)return'Quite o financiamento antes de vender.';const v=Math.round(H.price*.9);WALLET.add(v,`Venda: ${H.nm}`);delete s.own[id];msg=`Vendeu ${H.nm}.`}
      if(['cash','fin'].includes(mode)&&H.status>=2){this.addFame(.6);CIRC.post({k:'bast',title:'',body:`${CIRC.me()} comprou ${H.nm.toLowerCase()}. Os vizinhos já perguntaram quando é o home game.`})}}
    if(kind==='car'){const C=CARS.find(x=>x.id===id);
      if(mode==='buy'){if(!WALLET.can(C.price))return'Saldo insuficiente.';WALLET.add(-C.price,`Compra: ${C.nm}`);s.cars.push(id);msg=`Comprou ${C.nm}.`;
        if(C.status>=2){this.addFame(.4*C.status);CIRC.post({k:'bast',title:'',body:`${CIRC.me()} chegou ao clube de ${C.nm.toLowerCase()}. ${pickA(['Teve gente tirando foto.','O manobrista quase não acreditou.','A rival da mesa 3 fingiu que não viu.'])}`})}
        this.reactBuy(C.nm)}
      if(mode==='sell'){const v=Math.round(C.price*.7);WALLET.add(v,`Venda: ${C.nm}`);s.cars.splice(s.cars.indexOf(id),1);msg=`Vendeu ${C.nm}.`}}
    if(kind==='item'){const I=ITEMS.find(x=>x.id===id);if(!I)return'';
      if(mode==='sell'){const k=s.items.indexOf(id);if(k<0||I.cat==='pet')return'';const v=Math.round(I.price*(I.cat==='joia'?.8:.5));s.items.splice(k,1);WALLET.add(v,`Venda (usado): ${I.nm}`);msg=`Vendeu ${I.nm} por R$ ${brl(v)}.`}
      else{if(I.car&&!s.cars.length)return'Você precisa de um carro pra isso.';if(!I.cons&&s.items.includes(id))return'Você já tem.';if(!WALLET.can(IP(I)))return'Saldo insuficiente.';
        if(I.cons){const u=(s.cons=s.cons||{});if(u.d!==s.day){u.d=s.day;u.n={}}if((u.n[id]||0)>=2)return'Já usou 2 hoje. Amanhã tem mais.';u.n[id]=(u.n[id]||0)+1;
          WALLET.add(-IP(I),`Mercado: ${I.nm}`);if(I.en)s.energy=clamp(s.energy+I.en,0,100);if(I.md)this.addMood(I.md);if(I.fame)this.addFame(I.fame);msg=`${I.emo} ${I.nm}: ${ifxTxt(I).replace(' · consumível','')}.`}
        else{WALLET.add(-IP(I),`Compra: ${I.nm}`);s.items.push(id);msg=`${I.emo} Comprou ${I.nm}.`;if(I.status||I.fame)this.addFame(.3*(I.status||0)+(I.fame||0));
          if(I.price>=40000)try{CIRC.post({k:'vida',title:`${CIRC.me()} aparece com ${I.nm.toLowerCase()}`,body:'Foto nas redes, comentário de todo lado. O circuito repara.'})}catch(e){}}}}
    if(kind==='fin'&&s.fin){if(!WALLET.can(s.fin.rem))return'Saldo insuficiente para quitar.';WALLET.add(-s.fin.rem,`Quitação: ${this.homeObj(s.fin.home).nm}`);s.fin=null;msg='Financiamento quitado.'}
    LIVES.commit();this.commit();return msg},
  reactBuy(nm){LIVES.ALL().filter(n=>LIVES.s.bots[n]&&Math.abs(this.rel(n))>=1.5).slice(0,2).forEach(n=>this.text(n,this.rel(n)>0?pickA([`Que carro é esse?! Me dá uma carona amanhã.`,`Vi tua foto com o ${nm.toLowerCase()}. Tá podendo, hein!`]):pickA([`Comprou carro com as fichas de quem?`,`Carro novo não ganha mão.`])))},
  /* ---------- redes sociais ---------- */
  POSTS:[{id:'bast',nm:'📸 Bastidores da mesa',f:.4,fans:1},{id:'dica',nm:'🧠 Dica de estratégia',f:.6,fans:1.4},{id:'res',nm:'🏆 Mostrar resultado',f:1,fans:2,need:'res'},{id:'publi',nm:'🤝 Publi do patrocinador',f:.3,fans:.6,need:'sp'}],
  post(id){const s=this.s,P=this.POSTS.find(x=>x.id===id);if(!P||this.daily('post'))return null;if(P.need==='res'&&!(s.lastRes&&s.day-s.lastRes.day<=1&&s.lastRes.itm))return null;if(P.need==='sp'&&!s.sp)return null;
    this.mark('post');const f0=s.fans;this.addFame(P.f);s.fans+=Math.round((30+s.fame*s.fame*.8)*P.fans*(1+this.ifx('post'))*(.6+Math.random()*.8));const gain=s.fans-f0;
    this.sps().forEach(p=>{if(id==='publi'||Math.random()<.5)p.done.post++});
    const fr=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&this.rel(n)>=1),rv=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&this.rel(n)<=-1.5);
    const com=[];if(fr.length)com.push([pickA(fr),pickA(['Monstro! 👏','Brabo demais.','Ensina a gente aí 😂','Orgulho de ter jogado contigo.'])]);
    if(rv.length&&Math.random()<.6)com.push([pickA(rv),pickA(['Hmm, contaram só as mãos que ganhou.','Postar é fácil, quero ver na mesa.','Saudades da humildade.'])]);
    com.push([pickA(['@fichadeouro','@rivergirl_poa','@tio_do_allin','@bluffzinho','@grinder_rs']),pickA(['Quando sai o curso?','Melhor conteúdo de poker do RS.','Me segue de volta!','Esse é dos bons.'])]);
    s.posts.unshift({day:s.day,id,nm:P.nm,gain,com});if(s.posts.length>15)s.posts.length=15;this.commit();return{gain,com}},
  /* ---------- torneios e cash (ganchos das mesas) ---------- */
  onStart(kind,mtt){if(!this.s)return;this.regen();this.s.energy=Math.max(0,this.s.energy-(kind==='tour'?Math.max(3,(mtt?25:15)-this.ifx('tire')):8));this.commit()},
  onTour(o){const s=this.s;if(!s)return;this.sync();const itm=o.prize>0;this.addFame(o.place===1?(o.mtt?2.5:1.2):itm?.6:0);this._ct=0;this.calc();
    this.addMood(o.place===1?2:itm?1:this.has('moletom')?0:-1);s.lastRes={day:s.day,place:o.place,of:o.of,itm,prize:o.prize,mtt:o.mtt,nm:o.nm};
    this.sps().forEach(sp=>{sp.done.t++;if(o.mtt)sp.done.mtt++;let b=0;const kk=SPK(o.buy);if(o.place===1)b+=Math.round(sp.win*kk);else if(itm)b+=Math.round(sp.itm*kk);if(sp.pct&&o.prize)b+=Math.round(o.prize*sp.pct);
      if(b)WALLET.add(b,`Bônus ${sp.nm}: ${o.place}º lugar`)});
    const fr=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&this.rel(n)>=1),rv=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&this.rel(n)<=-2);
    if(o.place===1||itm){fr.sort(()=>Math.random()-.5).slice(0,o.place===1?3:1).forEach(n=>this.text(n,pickA(o.place===1?['Campeão!!! Vi no Feltro agora 🏆','QUE TORNEIO! Paga a cerveja agora, hein.','Monstro demais. Parabéns!']:[`Boa! ${o.place}º e no dinheiro.`,'Mandou bem hoje, premiação é premiação.'])));
      rv.slice(0,1).forEach(n=>Math.random()<.6&&this.text(n,pickA(['Sorte de principiante dura pouco.','Aproveita que a maré tá boa.','Na próxima eu tô na tua mesa.'])))}
    else if(fr.length&&Math.random()<.4)this.text(pickA(fr),pickA(['Faz parte. Amanhã tem mais.','Vi que caiu. Variância é isso aí, cabeça erguida.']));
    const bubble=o.pays&&o.place===o.pays+1,want=o.place===1||(o.mtt&&o.place<=9)||bubble||(itm&&Math.random()<.6)||(s.fame>=15&&Math.random()<.3);
    if(want&&!s.ivs.length){const js=LIVES.ALL().filter(n=>LIVES.bio(n)&&/Jornalista/.test(LIVES.bio(n).job));const j=js.length?pickA(js):'O Feltro';
      s.ivs.push({day:s.day,j,ctx:{place:o.place,of:o.of,prize:o.prize,mtt:o.mtt,nm:o.nm,bubble}});this.note('🎤',`${j} quer te entrevistar`,`Sobre o ${o.nm}. A entrevista sai no Feltro. Responda na aba Mídia até amanhã.`,'iv')}
    LIVES.commit();this.commit()},
  onCash(res,buy){const s=this.s;if(!s)return;if(buy&&res>=buy){this.addFame(.4);this.addMood(1)}else if(buy&&res<=-buy*.5)this.addMood(-1);this.commit()},
  /* ---------- entrevistas ---------- */
  target(){const bots=LIVES.ALL().filter(n=>LIVES.s.bots[n]&&LIVES.bio(n));let rv=null,m=-1;bots.forEach(n=>{const r=this.rel(n);if(r<m){m=r;rv=n}});
    if(rv)return{n:rv,kind:'rival'};const T=CIRC.table().filter(x=>!x.me);return T.length&&T[0].pts?{n:T[0].name,kind:'leader',pts:T[0].pts}:null},
  ivQs(iv){const c=iv.ctx,me=CIRC.me(),s=this.s,qs=[];
    if(c.place===1)qs.push({q:`Campeão do ${c.nm}! Qual foi o momento decisivo?`,a:{h:'Tive sorte nas horas certas. A mesa estava muito forte, sinceramente.',c:'Joguei o meu jogo do início ao fim. Eu sabia que ia chegar.',p:'Momento decisivo? Quando eu sentei. O resto foi cumprir tabela.'}});
    else if(c.prize>0)qs.push({q:`${c.place}º lugar e R$ ${brl(c.prize)} no bolso. Sai satisfeito?`,a:{h:'Muito. Cada premiação conta, e aprendi bastante hoje.',c:'Satisfeito, mas eu vim pra ganhar. Faltou pouco.',p:'Satisfeito nada. Caí pra quem nem devia estar naquela mão.'}});
    else if(c.bubble)qs.push({q:'Eliminado na bolha. Dói mais que as outras?',a:{h:'Dói, mas faz parte. Vou rever a mão com calma.',c:'Bolha é risco calculado. Eu jogo pra ganhar, não pra entrar no dinheiro.',p:'Dói ver o cara pagar aquilo e acertar o river. Mas tudo bem, ele precisava mais.'}});
    else qs.push({q:`Saída em ${c.place}º. O que deu errado hoje?`,a:{h:'Errei uma leitura importante. Vou rever a mão e voltar melhor.',c:'Nada de errado. Poker é variância, a conta fecha no longo prazo.',p:'Deu errado que tem gente pagando com qualquer coisa e acertando o river.'}});
    const T=this.target();
    if(T&&T.kind==='rival')qs.push({q:`${T.n} tem falado de você nas mesas. Quer responder?`,tg:T.n,a:{h:`Respeito o ${T.n}. Ganha quem jogar melhor.`,c:'Respondo na mesa. Sabe onde me encontrar.',p:`${T.n}? Adoro jogar contra. Sempre saio com as fichas.`}});
    else if(T)qs.push({q:`${T.n} lidera o ranking com ${nf(T.pts)} pontos. Dá pra alcançar?`,tg:T.n,a:{h:`${T.n} está jogando muito. Vou tentar chegar perto.`,c:'Dá, e vai. A temporada é longa.',p:`Que aproveite o topo enquanto dura. Já, já vai ver minhas costas.`}});
    if(s.sp)qs.push({q:`Como é jogar com o patch da ${s.sp.nm}?`,sp:1,a:{h:'Um orgulho. Eles apostaram em mim quando pouca gente apostava.',c:'Parceria certa. Eles sabem que vão aparecer muito.',p:'Eles tiveram sorte de me achar antes da concorrência.'}});
    else if(c.prize>=2000)qs.push({q:'E o que você vai fazer com o prêmio?',a:{h:'Guardar a maior parte. Banca é banca.',c:'Investir em mim: estudo e torneios maiores.',p:'Carro novo. E vou passar buzinando na frente dos adversários.'}});
    else qs.push({q:'Qual o próximo objetivo?',a:{h:'Continuar estudando e subir no ranking com calma.',c:'Liderar o ranking até o fim da temporada.',p:'Ganhar tudo. E aposentar uns três aí da mesa.'}});
    return qs},
  ivStart(){const s=this.s,iv=s.ivs[0];if(!iv)return;s.ivRun={iv,qs:this.ivQs(iv),k:0,ans:[]};this.commit()},
  ivAnswer(tone,quote){const s=this.s,R=s.ivRun;if(!R)return;const Q=R.qs[R.k];const me=CIRC.me();quote=quote||Q.a[tone];R.ans.push({q:Q.q,tone,x:quote,tg:Q.tg});
    this.addFame({h:.4,c:.9,p:1.6}[tone]);if(tone==='p')s.fans+=Math.round(60+s.fame*8);
    if(Q.tg&&LIVES.s.bots[Q.tg]){const b=LIVES.s.bots[Q.tg];if(tone==='p'){LIVES.relAdd(Q.tg,'Você',-2);b.tilt=Math.min(3,b.tilt+1);LIVES.note(Q.tg,`Leu a entrevista de ${me} e não gostou nada.`)}else if(tone==='h')LIVES.relAdd(Q.tg,'Você',1)}
    if(tone==='p'&&s.sp&&s.sp.clean){s.strikes++;if(s.strikes>=2){const sp=s.sp;s.sp=null;this.relSp(sp.id);this.addFame(-2);this.note(sp.emo,`${sp.nm} rompeu o contrato`,'A cláusula de imagem foi quebrada: duas provocações na imprensa.');CIRC.post({k:'vida',title:`${sp.nm} rompe com ${me}`,body:'O banco alegou quebra da cláusula de imagem depois de declarações polêmicas.'})}
      else this.note(s.sp.emo,`Aviso da ${s.sp.nm}`,'A marca não gostou da provocação. Mais uma e o contrato cai.')}
    R.k++;if(R.k>=R.qs.length)this.ivEnd();this.commit()},
  ivEnd(){const s=this.s,R=s.ivRun,me=CIRC.me();if(!R)return;const best=R.ans.find(a=>a.tone==='p')||R.ans.find(a=>a.tone==='c')||R.ans[0];const sh=best.x.length>90?best.x.slice(0,87)+'…':best.x;
    const title=best.tone==='p'&&best.tg?`${me} provoca ${best.tg}: "${sh}"`:`"${sh}", diz ${me}`;
    const body=`Em entrevista a ${R.iv.j} depois do ${R.iv.ctx.nm} (${R.iv.ctx.place}º de ${R.iv.ctx.of}), ${me} também disse: "${R.ans.filter(a=>a!==best).map(a=>a.x).join(' ')}"`;
    CIRC.post({k:'vida',title,body});s.heads.unshift({day:s.day,title,j:R.iv.j});if(s.heads.length>20)s.heads.length=20;this.sps().forEach(p=>p.done.iv++);
    s.ivs=s.ivs.filter(x=>x!==R.iv&&x.day!==R.iv.day);s.ivRun=null;s.notes.forEach(n=>{if(n.kind==='iv')n.read=true});LIVES.commit()},
  async ivFree(txt){const R=this.s.ivRun;if(!R)return;const Q=R.qs[R.k];
    const v=await AIX.ask(`Contexto público do jogador (o jornalista sabe disso): ${(()=>{try{return PUB.me()}catch(e){return''}})()}
Num jogo de poker brasileiro, um jornalista perguntou a ${CIRC.me()}: "${Q.q}". Ele respondeu: "${txt.replace(/"/g,"'")}".
${SARC}\nClassifique o tom REAL como "h" (humilde), "c" (confiante) ou "p" (provocador): deboche, ironia ácida e alfinetada contam como provocador. Reescreva a resposta como uma citação curta de jornal (até 25 palavras), mantendo o sentido e a voz dele.
Responda só com JSON: {"tom":"h","citacao":"..."}`);
    const tone=v&&['h','c','p'].includes(v.tom)?v.tom:/(sorte|lixo|fraco|pato|ruim|aposent|melhor que)/i.test(txt)?'p':/(vou|sei|ganhar|liderar)/i.test(txt)?'c':'h';
    this.ivAnswer(tone,(v&&v.citacao?String(v.citacao):txt).slice(0,200).replace(/[<>]/g,''))}};
LIFE.load();try{LIFE.badge()}catch(e){}

