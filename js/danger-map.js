/* ==============================================================
   DANGER MAP: NPL (x) vs CRAR (y) scatter, night-ledger style.
   Requires: data-peoples.js loaded first, a container:
   <div class="comp-card"><svg id="dangermap" viewBox="0 0 1120 640"></svg>
   <div class="tip" id="dm-tip"></div></div>
   Uses CSS vars: --gold --red --blue --cream --cream-2 --dim
   --hair --hair-2 --field --paper --paper-ink
   ============================================================== */
(function(){
  const svg = document.getElementById('dangermap');
  if (!svg) return;
  const NSd = 'http://www.w3.org/2000/svg';
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LANG = () => (document.documentElement.dataset.lang || 'bn');

  const DW=1120, DH=640, m={t:36,r:40,b:86,l:70};
  const XMAX=36, YMIN=-6, YMAX=30;
  const dx = v => m.l + v/XMAX*(DW-m.l-m.r);
  const dy = v => m.t + (1-(v-YMIN)/(YMAX-YMIN))*(DH-m.t-m.b);
  const mk = (t,a,p)=>{const e=document.createElementNS(NSd,t);for(const k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e;};

  /* quadrant tints: split at NPL=8 (x) and CRAR=10 (y) */
  const qx = dx(8), qy = dy(10);
  mk('rect',{x:m.l, y:m.t, width:qx-m.l, height:qy-m.t, fill:'#1B5E3B', opacity:.16});                       /* safe */
  mk('rect',{x:qx, y:m.t, width:dx(XMAX)-qx, height:qy-m.t, fill:'#C9A24B', opacity:.10});                   /* stressed, cushioned */
  mk('rect',{x:m.l, y:qy, width:qx-m.l, height:dy(YMIN)-qy, fill:'#C9A24B', opacity:.16});                   /* thin cushion */
  mk('rect',{x:qx, y:qy, width:dx(XMAX)-qx, height:dy(YMIN)-qy, fill:'#C4212F', opacity:.14});               /* danger */

  const QL = {
    bn: ["নিরাপদ অঞ্চল","চাপে, কিন্তু কুশন আছে","পাতলা কুশন","বিপদ অঞ্চল"],
    en: ["Safe zone","Stressed, but cushioned","Thin cushion","Danger zone"]
  };
  function quadLabels(){
    svg.querySelectorAll('.dm-quad').forEach(e=>e.remove());
    const L = QL[LANG()];
    const specs = [
      [m.l+14, m.t+22, L[0], '#7FBF9A'],
      [dx(XMAX)-14, m.t+22, L[1], '#C9A24B', 'end'],
      [m.l+14, dy(YMIN)-14, L[2], '#C9A24B'],
      [dx(XMAX)-14, dy(YMIN)-14, L[3], '#FF7A84', 'end']
    ];
    specs.forEach(s=>{
      const t = mk('text',{x:s[0], y:s[1], class:'dm-quad', fill:s[3],
        'text-anchor':s[4]||'start',
        style:'font-family:Sometype Mono,monospace;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase'});
      t.textContent = s[2];
    });
  }

  /* grid + axes */
  for (let v=0; v<=XMAX; v+=6){
    mk('line',{x1:dx(v),x2:dx(v),y1:m.t,y2:dy(YMIN),stroke:'#1A3C2C','stroke-width':1});
    mk('text',{x:dx(v),y:dy(YMIN)+20,'text-anchor':'middle',fill:'#8FA491',
      style:'font-family:Sometype Mono,monospace;font-size:11px'}).textContent=v;
  }
  for (let v=YMIN+1; v<=YMAX; v+=5){
    const vv = Math.round(v/5)*5; if (vv<YMIN||vv>YMAX) continue;
  }
  [-5,0,5,10,15,20,25,30].forEach(v=>{
    mk('line',{x1:m.l,x2:dx(XMAX),y1:dy(v),y2:dy(v),stroke:v===0?'#4E7A62':'#1A3C2C','stroke-width':v===0?1.6:1});
    mk('text',{x:m.l-10,y:dy(v)+4,'text-anchor':'end',fill:'#8FA491',
      style:'font-family:Sometype Mono,monospace;font-size:11px'}).textContent=v;
  });
  /* Basel line */
  mk('line',{x1:m.l,x2:dx(XMAX),y1:dy(10),y2:dy(10),stroke:'#8FB6E8','stroke-width':1.3,'stroke-dasharray':'6 5',opacity:.8});
  mk('text',{x:dx(XMAX)-6,y:dy(10)-7,'text-anchor':'end',fill:'#8FB6E8',
    style:'font-family:Sometype Mono,monospace;font-size:10.5px;font-weight:600'}).textContent='Basel III · 10%';
  /* zero cushion label */
  const zeroLab = mk('text',{x:m.l+8,y:dy(0)-7,fill:'#FF7A84',
    style:'font-family:Sometype Mono,monospace;font-size:10.5px;font-weight:600',class:'dm-zero'});

  /* axis titles */
  const axl = mk('text',{x:(m.l+dx(XMAX))/2,y:DH-26,'text-anchor':'middle',fill:'#CBD3BC',
    style:'font-family:Sometype Mono,monospace;font-size:12px',class:'dm-ax-x'});
  const ayl = mk('text',{x:0,y:0,'text-anchor':'middle',fill:'#CBD3BC',
    transform:`translate(20 ${(m.t+dy(YMIN))/2}) rotate(-90)`,
    style:'font-family:Sometype Mono,monospace;font-size:12px',class:'dm-ax-y'});

  /* halo pulse for Bangladesh */
  if (!REDUCED){
    const st = document.createElement('style');
    st.textContent = '@keyframes dmpulse{0%{r:18;opacity:.55}70%{r:40;opacity:0}100%{r:40;opacity:0}} .dm-halo{animation:dmpulse 2.4s ease-out infinite}';
    document.head.appendChild(st);
  }

  const tip = document.getElementById('dm-tip');
  const card = svg.closest('.comp-card') || svg.parentElement;
  function posTip(cx,cy){
    const r = card.getBoundingClientRect();
    let x=cx-r.left+16, y=cy-r.top-12;
    if (x+280>r.width) x=cx-r.left-286;
    if (x<8) x=8;
    tip.style.left=x+'px'; tip.style.top=y+'px';
  }

  DANGER_MAP.forEach(c=>{
    const X=dx(Math.min(c.npl,XMAX-0.5)), Y=dy(c.crar);
    const g = mk('g',{tabindex:0, role:'button', style:'cursor:pointer'});
    if (c.hero){
      mk('circle',{cx:X,cy:Y,r:18,fill:'none',stroke:'#E8434F','stroke-width':2,class:'dm-halo'},g);
      mk('circle',{cx:X,cy:Y,r:13,fill:'#E8434F',stroke:'#0D2B1F','stroke-width':2.5},g);
    } else {
      mk('circle',{cx:X,cy:Y,r:11,fill:'#E2B33C',opacity:.85,stroke:'#0D2B1F','stroke-width':2},g);
    }
    const lbl = mk('text',{x:X,y:Y+4,'text-anchor':'middle',fill:c.hero?'#F0E8D2':'#0D2B1F',
      style:'font-family:Sometype Mono,monospace;font-size:9px;font-weight:700'},g);
    lbl.textContent = c.id;
    const name = mk('text',{x:X,y:Y-(c.hero?24:18),'text-anchor':'middle',
      fill:c.hero?'#FF7A84':'#CBD3BC', class:'dm-name','data-id':c.id,
      style:'font-family:Sometype Mono,monospace;font-size:11px;font-weight:600'},g);

    const show=(cx,cy)=>{
      const L=LANG();
      tip.innerHTML =
        `<div class="t-year">${L==='bn'?c.name:c.en} · ${c.when}</div>`+
        `<div class="t-val">NPL ${c.npl}%${c.approx?' ~':''} · CRAR ${c.crar}%</div>`+
        `<div class="t-ev">${L==='bn'?c.note_bn:c.note_en}</div>`+
        `<div class="t-sub">${c.src}</div>`;
      tip.classList.add('show'); posTip(cx,cy);
    };
    g.addEventListener('mouseenter',e=>show(e.clientX,e.clientY));
    g.addEventListener('mousemove',e=>posTip(e.clientX,e.clientY));
    g.addEventListener('mouseleave',()=>tip.classList.remove('show'));
    g.addEventListener('focus',()=>{const r=g.getBoundingClientRect();show(r.left+r.width/2,r.top);});
    g.addEventListener('blur',()=>tip.classList.remove('show'));
  });

  function localize(){
    const L = LANG();
    quadLabels();
    zeroLab.textContent = L==='bn' ? 'কুশন শেষ · ০%' : 'Cushion gone · 0%';
    axl.textContent = L==='bn' ? 'খেলাপি ঋণের হার (NPL %) · বেশি হলে খারাপ →' : 'Non-performing loans (%) · higher is worse →';
    ayl.textContent = L==='bn' ? 'মূলধনের কুশন (CRAR %) · বেশি হলে নিরাপদ ↑' : 'Capital cushion (CRAR %) · higher is safer ↑';
    svg.querySelectorAll('.dm-name').forEach(t=>{
      const c = DANGER_MAP.find(x=>x.id===t.dataset.id);
      t.textContent = L==='bn' ? c.name : c.en;
    });
  }
  localize();
  document.addEventListener('langchange', localize);
})();
