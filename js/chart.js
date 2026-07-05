/* ============================================================
   CHART.JS
   The explore chart (NPL line + CRAR / IMF-estimate / Basel III
   layer toggles, event discs, hover tip) and the figures-strip
   counters. Reads globals from data.js and story.js.
   ============================================================ */

/* ============================================================
   EXPLORE CHART
   ============================================================ */
const svg=document.getElementById('chart');
const tip=document.getElementById('tip');
const card=document.querySelector('.chart-card');
const W=1200,H=620,M={t:44,r:36,b:78,l:58};
const X0=1996.5,X1=2026.4;
const state={crar:false,dist:false,basel:false,drawn:false};
let discEls={},Y0=0,Y1=45,hoverRule,hoverDot;
const xs=v=>M.l+(v-X0)/(X1-X0)*(W-M.l-M.r);
const ys=v=>M.t+(1-(v-Y0)/(Y1-Y0))*(H-M.t-M.b);
function positionTip(cx,cy){
  const r=card.getBoundingClientRect();
  let x=cx-r.left+16,y=cy-r.top-12;
  if(x+300>r.width)x=cx-r.left-306;
  if(x<8)x=8;
  tip.style.left=x+'px';tip.style.top=y+'px';
}
function render(){
  svg.innerHTML='';
  Y1=state.dist?62:45; Y0=state.crar?-6:0;
  discEls={};
  const defs=E('defs',{},svg);
  const grad=E('linearGradient',{id:'areaGrad',x1:0,y1:0,x2:0,y2:1},defs);
  E('stop',{offset:'0%','stop-color':'#E2B33C','stop-opacity':.22},grad);
  E('stop',{offset:'100%','stop-color':'#E2B33C','stop-opacity':.01},grad);
  ERAS.forEach(e=>{
    E('rect',{x:xs(e.from),y:M.t-14,width:xs(e.to)-xs(e.from),height:(H-M.b+30)-(M.t-14),fill:e.tone?'#16452F':'#113526',opacity:.5},svg);
    E('rect',{x:xs(e.from),y:H-M.b+36,width:xs(e.to)-xs(e.from),height:16,fill:e.tone?'#1E5B3F':'#174B33',stroke:'#25503C','stroke-width':.6},svg);
    if(xs(e.to)-xs(e.from)>84)
      E('text',{x:(xs(e.from)+xs(e.to))/2,y:H-M.b+47.5,'text-anchor':'middle',class:'era-lab'},svg).textContent=tx(e.label);
  });
  const step=state.dist?10:5;
  for(let v=Math.ceil(Y0/step)*step;v<=Y1;v+=step){
    E('line',{x1:M.l,x2:W-M.r,y1:ys(v),y2:ys(v),class:v===0&&Y0<0?'zeroline':'gridline'},svg);
    E('text',{x:M.l-10,y:ys(v)+3.5,'text-anchor':'end',class:'axis-lab-y'},svg).textContent=num(v===Y1?v+'%':v);
  }
  const xStep=innerWidth<700?7:4;
  for(let yr=1997;yr<=2025;yr+=xStep)
    E('text',{x:xs(yr),y:H-M.b+22,'text-anchor':'middle',class:'axis-lab'},svg).textContent=num(yr);
  E('text',{x:xs(2025),y:H-M.b+22,'text-anchor':'middle',class:'axis-lab','font-weight':600},svg).textContent=num('2025');
  if(state.basel){
    E('line',{x1:M.l,x2:W-M.r,y1:ys(10),y2:ys(10),class:'basel-line'},svg);
    E('text',{x:W-M.r-4,y:ys(10)-6,'text-anchor':'end',class:'series-lab',fill:'#8FB6E8'},svg).textContent=tx('Basel III minimum CRAR · 10%');
  }
  let d='',dArea=`M ${xs(SERIES[0][0])} ${ys(Math.max(0,Y0))} `;
  SERIES.forEach((p,i)=>{
    d+=(i?'L ':'M ')+xs(p[0]).toFixed(1)+' '+ys(p[1]).toFixed(1)+' ';
    dArea+='L '+xs(p[0]).toFixed(1)+' '+ys(p[1]).toFixed(1)+' ';
  });
  dArea+=`L ${xs(SERIES[SERIES.length-1][0])} ${ys(Math.max(0,Y0))} Z`;
  E('path',{d:dArea,class:'npl-area'},svg);
  const linePath=E('path',{d,class:'npl-line'},svg);
  if(!state.drawn&&!REDUCE){
    const L=linePath.getTotalLength();
    linePath.style.strokeDasharray=L;linePath.style.strokeDashoffset=L;
    linePath.getBoundingClientRect();
    linePath.style.transition='stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)';
    const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){linePath.style.strokeDashoffset=0;io.disconnect();}},{threshold:.2});
    io.observe(svg);
  }
  state.drawn=true;
  SERIES.forEach(p=>E('circle',{cx:xs(p[0]),cy:ys(p[1]),r:3.2,fill:'#E2B33C',stroke:'#0D2B1F','stroke-width':1.4},svg));
  E('line',{x1:xs(QPEAK.x),y1:ys(30.6)-4,x2:xs(QPEAK.x),y2:ys(QPEAK.y)+7,class:'peak-stem'},svg);
  E('circle',{cx:xs(QPEAK.x),cy:ys(QPEAK.y),r:5.5,fill:'none',stroke:'#E8434F','stroke-width':2.6},svg);
  E('text',{x:xs(QPEAK.x)-12,y:ys(QPEAK.y)-12,'text-anchor':'end',class:'callout'},svg).textContent=tx(QPEAK.label);
  /* Mar 2026 quarterly marker (hollow), same treatment as the Sep 2025 QPEAK:
     the story continues past the Dec 2025 year-end, rising again to 32.3%. */
  E('line',{x1:xs(2025),y1:ys(30.6),x2:xs(Q2026.x),y2:ys(Q2026.y),class:'peak-stem'},svg);
  E('circle',{cx:xs(Q2026.x),cy:ys(Q2026.y),r:5.5,fill:'none',stroke:'#E8434F','stroke-width':2.6},svg);
  E('text',{x:xs(Q2026.x),y:ys(Q2026.y)-13,'text-anchor':'end',class:'callout'},svg).textContent=tx(Q2026.label);
  const c1=E('text',{x:xs(1999),y:ys(41.1)-46,'text-anchor':'middle',class:'callout'},svg);
  E('tspan',{x:xs(1999),class:'big'},c1).textContent=num('41.1%');
  E('tspan',{x:xs(1999),dy:15},c1).textContent=tx('1999 peak');
  const c2=E('text',{x:xs(2011),y:ys(6.1)+56,'text-anchor':'middle',class:'callout'},svg);
  E('tspan',{x:xs(2011),class:'big'},c2).textContent=num('6.1%');
  E('tspan',{x:xs(2011),dy:15},c2).textContent=tx('2011 low');
  const c3=E('text',{x:xs(2025)-16,y:ys(30.6)-2,'text-anchor':'end',class:'callout'},svg);
  E('tspan',{x:xs(2025)-16,class:'big red'},c3).textContent=num('30.6%');
  E('tspan',{x:xs(2025)-16,dy:15},c3).textContent=tx('Dec 2025');
  if(state.crar){
    let dc='';
    CRAR.forEach((p,i)=>{dc+=(i?'L ':'M ')+xs(p.x).toFixed(1)+' '+ys(p.y).toFixed(1)+' ';});
    E('path',{d:dc,class:'crar-line'},svg);
    CRAR.forEach(p=>{
      const c=E('circle',{cx:xs(p.x),cy:ys(p.y),r:4,class:'crar-dot',style:'cursor:pointer'},svg);
      c.addEventListener('mouseenter',e=>{
        tip.innerHTML=`<div class="t-year">${num(p.lab)}</div><div class="t-val">${num(p.y.toFixed(2))}%</div><div class="t-sub">${tx('Sector CRAR (capital to risk-weighted assets)')}</div>`;
        tip.classList.add('show');positionTip(e.clientX,e.clientY);
      });
      c.addEventListener('mouseleave',()=>tip.classList.remove('show'));
    });
    E('text',{x:xs(2020)-6,y:ys(11.6)-10,class:'series-lab',fill:'#8FB6E8'},svg).textContent='CRAR';
    const lc=CRAR[CRAR.length-1];
    E('text',{x:xs(lc.x)+10,y:ys(lc.y)+4,class:'series-lab',fill:'#8FB6E8'},svg).textContent=tx('−2.64%');
  }
  if(state.dist){
    DIST.forEach(p=>{
      E('line',{x1:xs(p.x),y1:ys(valueAt(p.x)),x2:xs(p.x),y2:ys(p.y)+8,class:'dist-stem'},svg);
      const g=E('g',{style:'cursor:pointer'},svg);
      E('rect',{x:xs(p.x)-6.5,y:ys(p.y)-6.5,width:13,height:13,class:'dist-dia',transform:`rotate(45 ${xs(p.x)} ${ys(p.y)})`},g);
      const anchor=p.x>2024?'end':'start';
      const lx=p.x>2024?xs(p.x)-12:xs(p.x)+12;
      E('text',{x:lx,y:ys(p.y)+4,'text-anchor':anchor,class:'series-lab',fill:'#E8434F'},g).textContent=num(p.y)+'% · '+tx(p.lab);
      g.addEventListener('mouseenter',e=>{
        tip.innerHTML=`<div class="t-year">${tx(p.lab)}</div><div class="t-val">≈${num(p.y)}%</div><div class="t-ev">${tx(p.note)}.</div>`;
        tip.classList.add('show');positionTip(e.clientX,e.clientY);
      });
      g.addEventListener('mousemove',e=>positionTip(e.clientX,e.clientY));
      g.addEventListener('mouseleave',()=>tip.classList.remove('show'));
    });
  }
  EVENTS.filter(e=>e.n).forEach(ev=>{
    const px=xs(ev.x),py=ys(valueAt(ev.x));
    const off=(DISC_POS[ev.n]||{dy:-26}).dy;
    const g=E('g',{class:'disc',tabindex:0,role:'button','aria-label':`Event ${ev.n}: ${evTitle(ev)}`},svg);
    E('line',{x1:px,y1:py+(off>0?5:-5),x2:px,y2:py+off+(off>0?-11:11),stroke:'#E8434F','stroke-width':1.2,opacity:.7},g);
    E('circle',{cx:px,cy:py+off,r:10.5},g);
    E('text',{x:px,y:py+off+3.4,'text-anchor':'middle'},g).textContent=num(ev.n);
    discEls[ev.n]=g;
    const show=(cx,cy)=>{
      tip.innerHTML=`<div class="t-year">${num(ev.year)} &middot; ${isBn()?'নং':'No.'} ${num(ev.n)}</div><div class="t-val">${num(valueAt(ev.x).toFixed(1))}%</div><div class="t-ev"><b>${evTitle(ev)}.</b></div>`;
      tip.classList.add('show');positionTip(cx,cy);
    };
    g.addEventListener('mouseenter',e=>show(e.clientX,e.clientY));
    g.addEventListener('mousemove',e=>positionTip(e.clientX,e.clientY));
    g.addEventListener('mouseleave',()=>tip.classList.remove('show'));
    g.addEventListener('focus',()=>{const r=g.getBoundingClientRect();show(r.left+r.width/2,r.top);});
    g.addEventListener('blur',()=>tip.classList.remove('show'));
    g.addEventListener('click',()=>{
      const row=document.querySelector(`.entry[data-n="${ev.n}"]`);
      if(row){row.scrollIntoView({block:'center'});flash(row);}
    });
  });
  hoverRule=E('line',{class:'hover-rule',y1:M.t-14,y2:ys(Math.max(0,Y0)),opacity:0},svg);
  hoverDot=E('circle',{class:'hover-dot',r:5,opacity:0},svg);
}
svg.addEventListener('mousemove',e=>{
  if(e.target.closest('.disc')||e.target.classList.contains('crar-dot')||e.target.closest('g[style]'))return;
  const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;
  const p=pt.matrixTransform(svg.getScreenCTM().inverse());
  const xv=X0+(p.x-M.l)/(W-M.l-M.r)*(X1-X0);
  const yr=Math.round(xv);
  const rec=SERIES.find(s=>s[0]===yr);
  if(!rec||p.y<M.t-14||p.y>ys(Math.max(0,Y0))){hideHover();return;}
  hoverRule.setAttribute('x1',xs(yr));hoverRule.setAttribute('x2',xs(yr));
  hoverRule.setAttribute('opacity',1);
  hoverDot.setAttribute('cx',xs(yr));hoverDot.setAttribute('cy',ys(rec[1]));
  hoverDot.setAttribute('opacity',1);
  let extra='';
  const cr=CRAR.find(c=>Math.abs(c.x-yr)<.3);
  if(state.crar&&cr)extra+=`<div class="t-sub">CRAR ${num(cr.y.toFixed(2))}%</div>`;
  tip.innerHTML=`<div class="t-year">${num(yr)}</div><div class="t-val">${num(rec[1].toFixed(1))}%</div>${extra}`;
  tip.classList.add('show');
  positionTip(e.clientX,e.clientY);
});
svg.addEventListener('mouseleave',hideHover);
function hideHover(){
  if(hoverRule)hoverRule.setAttribute('opacity',0);
  if(hoverDot)hoverDot.setAttribute('opacity',0);
  tip.classList.remove('show');
}
function bindToggle(id,key){
  const b=document.getElementById(id);
  b.addEventListener('click',()=>{
    state[key]=!state[key];
    if(key==='crar'&&state.crar&&!state.basel){state.basel=true;
      document.getElementById('btn-basel').setAttribute('aria-pressed','true');}
    b.setAttribute('aria-pressed',state[key]);
    render();
  });
}
bindToggle('btn-crar','crar');
bindToggle('btn-dist','dist');
bindToggle('btn-basel','basel');
render();
// Re-draw the whole chart (labels, callouts, tooltips) when the language switches.
I18N.rerender.push(render);

/* ============================================================
   COUNTERS (figures strip)
   ============================================================ */
(function(){
  const nums=[...document.querySelectorAll('.fig .num[data-count]')];
  const finalOf=n=>n.dataset.count+(n.dataset.suffix||'%');
  if(REDUCE){nums.forEach(n=>{n._done=true;n.textContent=num(finalOf(n));});}
  else{
    const io=new IntersectionObserver(es=>{
      es.forEach(en=>{
        if(!en.isIntersecting)return;
        const n=en.target,target=parseFloat(n.dataset.count),suf=n.dataset.suffix||'%';
        const t0=performance.now(),dur=1100;
        (function tick(t){
          const k=Math.min(1,(t-t0)/dur),e2=1-Math.pow(1-k,3);
          n.textContent=num((target*e2).toFixed(target%1?1:0)+suf);
          if(k<1)requestAnimationFrame(tick); else n._done=true;
        })(t0);
        io.unobserve(n);
      });
    },{threshold:.5});
    nums.forEach(n=>io.observe(n));
  }
  // On language switch, re-format the already-settled counters in the new numerals.
  I18N.rerender.push(()=>nums.forEach(n=>{ if(n._done) n.textContent=num(finalOf(n)); }));
})();
