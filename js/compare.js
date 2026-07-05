/* ============================================================
   COMPARE.JS
   Cross-country snapshot bars and the small-multiple trajectory
   panels. Reads SNAP, ASIA_AVG, COMP, SERIES from data.js and the
   current language from i18n.js. Both renderers are re-runnable so
   the language toggle can redraw them.
   ============================================================ */

/* ============================================================
   SNAPSHOT BARS
   ============================================================ */
function renderSnapshot(){
  const s=document.getElementById('snapshot');
  s.innerHTML='';
  const SW=1120,ML=150,MR=110,MT=16,rowH=40,barH=22,maxV=40;
  const bx=v=>ML+v/maxV*(SW-ML-MR);
  E('line',{x1:bx(ASIA_AVG),x2:bx(ASIA_AVG),y1:MT-4,y2:MT+SNAP.length*rowH+6,stroke:'#C9A24B','stroke-width':1.3,'stroke-dasharray':'5 4'},s);
  E('text',{x:bx(ASIA_AVG)+6,y:MT+SNAP.length*rowH+18,class:'bar-note',fill:'#C9A24B'},s).textContent=tx('Asian bank average · 1.6% (ADB)');
  SNAP.forEach((r,i)=>{
    const y=MT+i*rowH;
    E('text',{x:ML-12,y:y+barH/2+4,'text-anchor':'end',class:'bar-lab','font-weight':r.bd?600:400,fill:r.bd?'#E8434F':'#CBD3BC'},s).textContent=tx(r.c);
    E('rect',{x:ML,y:y,width:0,height:barH,rx:2,fill:r.bd?'#E8434F':'#E2B33C',opacity:r.bd?1:.6,class:'snap-bar','data-w':bx(r.v)-ML},s);
    E('text',{x:bx(r.v)+10,y:y+barH/2+4,class:'bar-val',fill:r.bd?'#E8434F':'#F0E8D2'},s).textContent=num(r.v+'%');
    if(r.note)E('text',{x:bx(r.v)+70,y:y+barH/2+4,class:'bar-note'},s).textContent=tx(r.note);
  });
  const bars=s.querySelectorAll('.snap-bar');
  if(REDUCE){bars.forEach(b=>b.setAttribute('width',b.dataset.w));}
  else{
    const io=new IntersectionObserver(es=>{
      if(es[0].isIntersecting){
        bars.forEach((b,i)=>{
          b.style.transition=`width .9s ${i*70}ms cubic-bezier(.4,0,.2,1)`;
          requestAnimationFrame(()=>b.setAttribute('width',b.dataset.w));
        });
        io.disconnect();
      }
    },{threshold:.3});
    io.observe(s);
  }
}
renderSnapshot();
I18N.rerender.push(renderSnapshot);

/* ============================================================
   SMALL MULTIPLES
   ============================================================ */
function renderMultiples(){
  const host=document.getElementById('multiples');
  host.innerHTML='';
  const PW=360,PH=210,ml=30,mr=10,mt=12,mb=26;
  const px_=v=>ml+(v-1997)/(2025.5-1997)*(PW-ml-mr);
  const py_=v=>mt+(1-v/50)*(PH-mt-mb);
  COMP.forEach(cn=>{
    const panel=document.createElement('div');
    panel.className='panel';
    panel.innerHTML=`<h4>${tx(cn.name)}<span class="now">${isBn()?'এখন':'now'} ${num(cn.now)}</span></h4><div class="storyl">${tx(cn.story)}</div>`;
    const ps=document.createElementNS(NS,'svg');
    ps.setAttribute('viewBox',`0 0 ${PW} ${PH}`);
    ps.setAttribute('role','img');
    ps.setAttribute('aria-label',`NPL trajectory for ${cn.name} against Bangladesh`);
    const mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);ps.appendChild(e);return e;};
    [0,25,50].forEach(v=>{
      mk('line',{x1:ml,x2:PW-mr,y1:py_(v),y2:py_(v),class:'mini-grid'});
      mk('text',{x:ml-5,y:py_(v)+3,'text-anchor':'end',class:'mini-axis'}).textContent=num(v);
    });
    [2000,2010,2020].forEach(yr=>mk('text',{x:px_(yr),y:PH-8,'text-anchor':'middle',class:'mini-axis'}).textContent=num(yr));
    let db='';
    SERIES.forEach((p,i)=>{db+=(i?'L ':'M ')+px_(p[0]).toFixed(1)+' '+py_(p[1]).toFixed(1)+' ';});
    mk('path',{d:db,class:'mini-bd'});
    let dc='';
    cn.pts.forEach((p,i)=>{dc+=(i?'L ':'M ')+px_(p[0]).toFixed(1)+' '+py_(p[1]).toFixed(1)+' ';});
    mk('path',{d:dc,class:'mini-line'});
    cn.pts.forEach(p=>mk('circle',{cx:px_(p[0]),cy:py_(p[1]),r:2.4,fill:'#8FB6E8'}));
    if(cn.note){
      const nx=px_(cn.note.x),ny=py_(cn.note.y);
      const anchor=cn.note.x>2016?'end':'start';
      const lx=cn.note.x>2016?nx-8:nx+8;
      mk('circle',{cx:nx,cy:ny,r:4.2,fill:'none',stroke:'#8FB6E8','stroke-width':1.6});
      mk('text',{x:lx,y:ny-8,'text-anchor':anchor,class:'mini-note'}).textContent=tx(cn.note.t);
    }
    panel.appendChild(ps);
    const take=document.createElement('p');
    take.className='take';take.textContent=tx(cn.take);
    panel.appendChild(take);
    host.appendChild(panel);
  });
}
renderMultiples();
I18N.rerender.push(renderMultiples);
