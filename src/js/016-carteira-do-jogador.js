/* ----- carteira do jogador (dinheiro fictício) ----- */
const brl=v=>(Math.round(v*100)/100).toLocaleString('pt-BR',{minimumFractionDigits:Number.isInteger(Math.round(v*100)/100)?0:2,maximumFractionDigits:2});
