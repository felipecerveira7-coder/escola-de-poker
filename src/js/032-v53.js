/* =============== v53: legado, lendas, amizades, datas, humor, mídia, investimentos =============== */
const SARC='Leia nas entrelinhas: o jogador pode ser sarcástico, irônico, debochado, fazer piada, duplo sentido ou falar sério com cara de brincadeira. Descubra o tom REAL (ex.: "parabéns pela sorte" depois de uma bad beat é alfinetada; "adorei perder pra você" é ironia; elogio exagerado pode ser deboche) e reaja como uma pessoa esperta reagiria: pode rir, devolver a ironia, se ofender ou entrar na brincadeira.';
const dayKey=d=>{const t=CAL.date(d);return`${t.getDate()}/${t.getMonth()+1}`};
const hashN=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)};

