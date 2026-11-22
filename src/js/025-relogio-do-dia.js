/* ----- relógio do dia: as ações gastam horas (acorda 9h, depois da meia-noite cansa, às 2h apaga) ----- */
const CLK={
  base(){const s=LIFE.s,wd=CAL.date(CAL.today()).getDay();return s.job&&wd>=1&&wd<=5?18:9},
  now(){const s=LIFE.s;if(!s||!CAL.on())return 12;const t=CAL.today();
    if(s.hrDay!==t){const late=s.hrDay!=null&&s.hrDay===t-1&&s.hr>24?s.hr-24:0;
      if(late>0){s.lateDay=t;const p=Math.round(Math.min(14,late*6));s.energy=Math.max(0,s.energy-p);LIFE.note('🥱',late>=2?'Você apagou às 2h':'Dormiu tarde',`Foi deitar ${this.fmt(s.hr)}. Acordou com −${p} de energia.`)}
      s.hrDay=t;s.hr=this.base()}
    return s.hr},
  fmt(h){h=h==null?this.now():h;const H=Math.floor(h)%24,M=Math.round((h-Math.floor(h))*60/5)*5;return`${String(H).padStart(2,'0')}:${String(M%60).padStart(2,'0')}`},
  txt(){const h=this.now();return`${h>=24?'🌙':h>=18?'🌆':'🕘'} ${this.fmt(h)}${h>=24?' (madrugada)':''}`},
  left(){return 26-this.now()},
  can(h,what){if(!CAL.on())return'';const n=this.now();if(n+h>26)return`Não dá tempo: já são ${this.fmt(n)} e ${what||'isso'} leva ${h>=1?Math.round(h)+'h':Math.round(h*60)+' min'}. Avance o dia.`;return''},
  add(h){if(!LIFE.s||!CAL.on())return;this.now();LIFE.s.hr=Math.min(26,LIFE.s.hr+h)},
  to(h){if(!LIFE.s||!CAL.on())return;this.now();LIFE.s.hr=Math.min(26,Math.max(LIFE.s.hr,h))}};

