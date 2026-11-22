/* ----- avisos que aparecem perto do polegar ----- */
const TOAST={t:null,
  show(m){if(!m)return;const txt=String(m).replace(/<[^>]+>/g,'').trim();if(!txt)return;let el=document.getElementById('toast');if(!el){el=document.createElement('div');el.id='toast';document.body.appendChild(el);el.onclick=()=>el.classList.remove('on')}
    el.textContent=txt;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');clearTimeout(this.t);this.t=setTimeout(()=>el.classList.remove('on'),Math.min(9000,2600+txt.length*45));try{if(navigator.vibrate)navigator.vibrate(12)}catch(e){}}};

