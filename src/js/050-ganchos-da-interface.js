/* ----- ganchos da interface ----- */
(function(){try{
  LIFE.tab='hoje';
  /* renderLife: guarda o que você digitava, a rolagem e anima troca de aba */
  const _rl=renderLife;let lastTab=null;
  renderLife=function(){const el=document.getElementById('vidaRoot');const vals={};let foc=null,sel=0;const sy=window.scrollY;
    if(el){el.querySelectorAll('input[data-r],textarea[data-r]').forEach(i=>{vals[i.dataset.r]=i.value});const a=document.activeElement;if(a&&el.contains(a)&&a.dataset&&a.dataset.r){foc=a.dataset.r;sel=a.selectionStart||0}}
    _rl.apply(this,arguments);if(!el)return;const tab=LIFE.tab;
    Object.entries(vals).forEach(([k,v])=>{const i=el.querySelector(`[data-r="${k}"]`);if(i&&v&&!i.value)i.value=v});if(foc){const i=el.querySelector(`[data-r="${foc}"]`);if(i){i.focus({preventScroll:true});try{i.setSelectionRange(sel,sel)}catch(e){}}}
    if(lastTab!==null&&lastTab!==tab){el.classList.remove('tabin');void el.offsetWidth;el.classList.add('tabin');const top=el.querySelector('.vsubs');if(top&&window.scrollY>200)window.scrollTo({top:Math.max(0,top.getBoundingClientRect().top+window.scrollY-120)})}else window.scrollTo(0,sy);
    lastTab=tab;HUD.render()};
  /* bottom sheets: arrastar pra baixo fecha */
  let drag=null;document.addEventListener('touchstart',e=>{const h=e.target.closest&&e.target.closest('.dbox');if(!h)return;const ov=h.parentElement;if(!ov||!ov.__close)return;const sc=e.target.closest('.bpscroll,.dlog');if(sc&&sc.scrollTop>0)return;if(e.target.closest('input,textarea,button,a'))return;drag={y:e.touches[0].clientY,box:h,ov,dy:0}},{passive:true});
  document.addEventListener('touchmove',e=>{if(!drag)return;drag.dy=Math.max(0,e.touches[0].clientY-drag.y);drag.box.style.transform=`translateY(${drag.dy}px)`},{passive:true});
  document.addEventListener('touchend',()=>{if(!drag)return;const d=drag;drag=null;if(d.dy>110){d.box.style.transition='transform .18s';d.box.style.transform='translateY(100%)';setTimeout(()=>d.ov.__close&&d.ov.__close(),170)}else{d.box.style.transition='transform .18s';d.box.style.transform='';setTimeout(()=>d.box.style.transition='',200)}});
  const _dr=DATE.render;DATE.render=function(){_dr.apply(this,arguments);const ov=document.getElementById('dOv');if(ov&&ov.className==='dov')ov.__close=()=>{if(DATE.st()&&DATE.st().over)DATE.close();else{DATE.min=true;DATE.render()}}};
  const _bo=BOTP.open;BOTP.open=function(){_bo.apply(this,arguments);const ov=document.getElementById('bpOv');if(ov)ov.__close=()=>BOTP.close()};
  const _pr=PRESS.render;PRESS.render=function(){_pr.apply(this,arguments);const ov=document.getElementById('prOv');if(ov)ov.__close=()=>{const P=LIFE.s.press;if(P&&P.over)PRESS.close()}};
  /* cartas entrando com animação, só as novas */
  const _rt=Table.prototype.renderTable;Table.prototype.renderTable=function(){_rt.apply(this,arguments);try{const g=this.g;if(!g)return;if(this._dh!==g.hands){this._dh=g.hands;this._seen=new Set()}const tb=this.$('table');if(!tb)return;
    tb.querySelectorAll('.card[data-id]').forEach(c=>{const k=c.closest('.pseat')?'p'+c.dataset.id:'b'+c.dataset.id;if(!this._seen.has(k)){this._seen.add(k);c.classList.add('deal')}})}catch(e){}};
  /* look: efeitos */
  DATE.look=function(){const it=OUT.items('role').filter(x=>x.cat!=='bel');const a=it.length?it.map(x=>x.nm.toLowerCase()):['a melhor roupa do armário'];if(OUT.wear('role','nicho'))a.push('perfume de nicho');else if(OUT.wear('role','perfume'))a.push('perfume importado');else a.push('um banho caprichado');return a};
  const _ds=DATE.start;DATE.start=function(k,via){const r=_ds.apply(this,arguments);try{const d=this.st();if(d&&d.turns===0&&!d.lookB){d.lookB=1;let v=0;if(['jantar','chique'].includes(k)&&OUT.formal('role'))v+=2;if(OUT.wear('role','nicho')||OUT.wear('role','perfume'))v+=1;if(['lanche','cinema'].includes(k)&&OUT.wear('role','terno'))v-=1;if(v){this.apply(v);LIFE.commit();this.render()}}}catch(e){}return r};
  LOOK.best=function(){return OUT.items('mesa').sort((a,b)=>b.price-a.price)[0]||null};
  const _os=LIFE.onStart;LIFE.onStart=function(kind,mtt){_os.call(this,kind,mtt);try{if(kind==='tour'&&this.s&&(OUT.wear('mesa','moletom')||OUT.wear('mesa','corrida'))){this.s.energy=Math.min(100,this.s.energy+3);this.commit()}}catch(e){}};
  const _pa=PRESS.answer;PRESS.answer=async function(tone,txt){if(OUT.formal('mesa'))LIFE.addFame(.15);return _pa.call(this,tone,txt)};
  /* botões globais */
  document.addEventListener('click',e=>{const h=e.target.closest&&e.target.closest('[data-r="hdrT"]');if(h){e.preventDefault();e.stopPropagation();LIFE.hdrOpen=!LIFE.hdrOpen;renderLife();return}
    const lg=e.target.closest&&e.target.closest('#clOv [data-lgo]');if(lg){e.preventDefault();e.stopPropagation();OUT.close();LIFE.tab='loja';LIFE.lcat=lg.dataset.lgo;location.hash='#vida';setTimeout(()=>renderLife(),30);return}},true);
  const _ba=bindAgenda;bindAgenda=function(el,after){return _ba.call(this,el,m=>{if(m)TOAST.show(m);after(m)})};
  LOOK.icons=function(){return AV.svg('mesa',18)};
  document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-vg],[data-go],[data-cl],[data-hud]');if(!t)return;const d=t.dataset;
    if(d.vg){e.preventDefault();e.stopPropagation();const G=VG.G.find(g=>g[0]===d.vg);LIFE.tab=VG.last[d.vg]||G[3][0];LIFE.open=null;renderLife();return}
    if(d.go){e.preventDefault();e.stopPropagation();HOJE.go(d.go);return}
    if(d.cl){e.preventDefault();e.stopPropagation();const[a,b,c]=d.cl.split('|');if(a==='x'){OUT.close();return}if(a==='tab'){OUT.tab=b;OUT.render();return}OUT.set(a,b,a==='av'&&b==='pele'?+c:c);OUT.render();HUD.last='';HUD.render();return}},true);
  document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.pact button,.acts button,[data-a]');if(b)try{if(navigator.vibrate)navigator.vibrate(8)}catch(x){}},{passive:true});
  window.addEventListener('hashchange',()=>{HUD.last='';HUD.render()});setInterval(()=>{try{HUD.render()}catch(e){}},1000);setTimeout(()=>{try{HUD.render()}catch(e){}},400);
}catch(e){console.warn('ux55',e)}})();

