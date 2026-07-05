/* ============================================================
   STORY.JS
   Shared helpers (used by every module), reading-progress bar,
   and the scrollytelling sticky line. Loaded after data.js.
   ============================================================ */

/* ============================================================
   SHARED HELPERS
   ============================================================ */
const NS='http://www.w3.org/2000/svg';
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function E(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
function valueAt(x){
  if(x<=SERIES[0][0])return SERIES[0][1];
  if(x>=SERIES[SERIES.length-1][0])return SERIES[SERIES.length-1][1];
  for(let i=0;i<SERIES.length-1;i++){
    const [x0,y0]=SERIES[i],[x1,y1]=SERIES[i+1];
    if(x>=x0&&x<=x1)return y0+(y1-y0)*(x-x0)/(x1-x0);
  }
  return null;
}

/* ============================================================
   READING PROGRESS
   ============================================================ */
const prog=document.getElementById('progress');
addEventListener('scroll',()=>{
  const h=document.documentElement;
  prog.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
},{passive:true});

/* ============================================================
   SCROLL STORY
   ============================================================ */
(function(){
  const s=document.getElementById('storychart');
  const SW=760,SH=380,ml=44,mr=26,mt=20,mb=40;
  const sx=v=>ml+(v-1996.5)/(2026.4-1996.5)*(SW-ml-mr);
  const sy=v=>mt+(1-v/45)*(SH-mt-mb);
  /* era bands */
  const bands=ERAS.map(e=>E('rect',{x:sx(e.from),y:mt,width:sx(e.to)-sx(e.from),height:sy(0)-mt,fill:e.tone?'#16452F':'#123A2A',class:'s-band'},s));
  /* grid + axes */
  [0,10,20,30,40].forEach(v=>{
    E('line',{x1:ml,x2:SW-mr,y1:sy(v),y2:sy(v),class:'s-grid'},s);
    E('text',{x:ml-8,y:sy(v)+3.5,'text-anchor':'end',class:'s-axis'},s).textContent=v;
  });
  [1997,2005,2015,2025].forEach(yr=>{
    E('text',{x:sx(yr),y:SH-16,'text-anchor':'middle',class:'s-axis'},s).textContent=yr;
  });
  /* ghost of full path */
  let dfull='';
  SERIES.forEach((p,i)=>{dfull+=(i?'L ':'M ')+sx(p[0]).toFixed(1)+' '+sy(p[1]).toFixed(1)+' ';});
  dfull+='L '+sx(QPEAK.x).toFixed(1)+' '+sy(30.6).toFixed(1)+' ';
  E('path',{d:dfull,class:'s-ghost'},s);
  /* animated line (same geometry) */
  const line=E('path',{d:dfull,class:'s-line'},s);
  const total=line.getTotalLength();
  line.style.strokeDasharray=total;
  line.style.strokeDashoffset=total;
  if(!REDUCE)line.style.transition='stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)';
  const cursor=E('circle',{class:'s-cursor',r:6,cx:sx(1997),cy:sy(37.5)},s);

  /* length along path where x >= target px (binary search) */
  function lenAtX(targetPx){
    let lo=0,hi=total;
    for(let i=0;i<24;i++){
      const mid=(lo+hi)/2;
      (line.getPointAtLength(mid).x<targetPx)?lo=mid:hi=mid;
    }
    return (lo+hi)/2;
  }

  const bignum=document.getElementById('bignum');
  const biglab=document.getElementById('bignumlab');
  let numAnim=null;
  function setNum(target,lab){
    biglab.textContent=lab;
    if(REDUCE){bignum.textContent=target.toFixed(1);return;}
    const from=parseFloat(bignum.textContent)||0;
    const t0=performance.now(),dur=650;
    cancelAnimationFrame(numAnim);
    (function tick(t){
      const k=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-k,3);
      bignum.textContent=(from+(target-from)*e).toFixed(1);
      if(k<1)numAnim=requestAnimationFrame(tick);
    })(t0);
  }
  function goTo(step){
    const toYear=parseFloat(step.dataset.to);
    const L=lenAtX(sx(toYear));
    line.style.strokeDashoffset=Math.max(0,total-L);
    const pt=line.getPointAtLength(L);
    cursor.setAttribute('cx',pt.x);cursor.setAttribute('cy',pt.y);
    setNum(parseFloat(step.dataset.num),step.dataset.lab);
    /* light bands up to current year */
    bands.forEach((b,i)=>b.classList.toggle('on',ERAS[i].from<=toYear));
  }
  const steps=[...document.querySelectorAll('.step')];
  const io=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        steps.forEach(st=>st.classList.toggle('active',st===en.target));
        goTo(en.target);
      }
    });
  },{rootMargin:'-42% 0px -42% 0px'});
  steps.forEach(st=>io.observe(st));
  goTo(steps[0]); steps[0].classList.add('active');
})();
