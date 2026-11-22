/* ---------- regras: exemplo e mesa ---------- */
(function(){
  const hole=parse('Ah 9h'),board=parse('Kh 7c 4h 2h Js');
  const r=best7([...hole,...board]);const ids=new Set(r.hand.map(c=>c.id));
  document.getElementById('ex-hole').innerHTML=hole.map(c=>cardHTML(c,ids.has(c.id)?'hl':'dim')).join('');
  document.getElementById('ex-board').innerHTML=board.map(c=>cardHTML(c,ids.has(c.id)?'hl':'dim')).join('');
  const seats=[['BTN',60,'late','Botão'],['SB',120,'blind','Small blind'],['BB',180,'blind','Big blind'],['UTG',240,'early','Under the gun'],['MP',300,'mid','Meio'],['CO',0,'late','Cutoff']];
  const col={early:'#ef6f5e',mid:'#e8b84f',late:'#5fcf8a',blind:'#8fb3c9'};
  let svg=`<ellipse cx="300" cy="170" rx="200" ry="105" fill="#145a41" stroke="#4a2c17" stroke-width="12"/>
  <text x="300" y="165" text-anchor="middle" fill="#a8c1b4" font-size="14" font-family="IBM Plex Sans">sentido do jogo: horário ↻</text>`;
  seats.forEach(([n,ang,k,full])=>{const t=ang*Math.PI/180,x=300+252*Math.cos(t),y=170+138*Math.sin(t);
    svg+=`<circle cx="${x}" cy="${y}" r="27" fill="${col[k]}"/><text x="${x}" y="${y+5}" text-anchor="middle" font-weight="700" font-size="14" fill="#10241b" font-family="IBM Plex Sans">${n}</text>`;
    if(n==='BTN'){const bx=300+175*Math.cos(t),by=170+92*Math.sin(t);svg+=`<circle cx="${bx}" cy="${by}" r="11" fill="#fbf8ef"/><text x="${bx}" y="${by+4}" text-anchor="middle" font-size="11" font-weight="700" fill="#1d1d1d">D</text>`}});
  const lg=[['early','Início (age cedo)'],['mid','Meio'],['late','Final (melhor posição)'],['blind','Blinds']];
  lg.forEach(([k,t],i)=>{svg+=`<rect x="${20+i*145}" y="322" width="12" height="12" rx="3" fill="${col[k]}"/><text x="${38+i*145}" y="333" fill="#a8c1b4" font-size="12" font-family="IBM Plex Sans">${t}</text>`});
  document.getElementById('tablesvg').innerHTML=svg;
})();

