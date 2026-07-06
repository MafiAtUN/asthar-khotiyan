/* ==============================================================
   GEOGRAPHIC NPL WAR-MAP (night-ledger style)
   A world choropleth shading each country by its bad-loan ratio
   (pale gold = low, deep red = high). Bangladesh is the single
   darkest country, outlined and pulsing. Countries at war or in
   acute crisis carry a hatch overlay and a crossed-swords mark.
   Requires: worldmap-data.js (WORLD_PATHS, WORLD_CENTROIDS) and
   data-peoples.js (DANGER_MAP) loaded first. A small toggle
   switches between this map and the NPL-vs-CRAR scatter.
   ============================================================== */
(function(){
  const svg = document.getElementById('worldmap');
  if (!svg || typeof WORLD_PATHS === 'undefined') return;
  const NSm = 'http://www.w3.org/2000/svg';
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LANG = () => (document.documentElement.dataset.lang || 'bn');
  const mk = (t,a,p)=>{const e=document.createElementNS(NSm,t);for(const k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e;};

  /* ---- Country meta. NPL/CRAR for the eight scatter economies are
     pulled from the verified DANGER_MAP; Ukraine, Lebanon and Tunisia
     are the war/crisis extras (NPL only). ---- */
  const ISO2ID = {BGD:'BD',IND:'IN',PAK:'PK',LKA:'LK',NPL:'NP',IDN:'ID',VNM:'VN',PHL:'PH'};
  const EXTRA = {
    UKR:{npl:12.8, when:'May 2026', war:true, hero:false,
      name_bn:'ইউক্রেন', name_en:'Ukraine',
      st_bn:'যুদ্ধরত, তবু এখন বাংলাদেশের নিচে', st_en:'At war, yet now below Bangladesh',
      src:'National Bank of Ukraine, 12.8% (May 2026, EU-aligned basis; ~24% earlier in 2025)'},
    LBN:{npl:23.8, when:'2025', war:true, hero:false,
      name_bn:'লেবানন', name_en:'Lebanon',
      st_bn:'অর্থনৈতিক ধস (প্রাক্কলন)', st_en:'Economic collapse (estimate)',
      src:'Crisis-era estimate, unverified against a current primary source'},
    TUN:{npl:14.7, when:'Mar 2025', war:true, hero:false,
      name_bn:'তিউনিসিয়া', name_en:'Tunisia',
      st_bn:'রাজস্ব সংকট', st_en:'Fiscal crisis',
      src:'Central Bank of Tunisia (via Fitch), Mar 2025'}
  };
  const STATUS = {
    BGD:{bn:'রেফারেন্স · সবচেয়ে গাঢ়', en:'The reference, darkest'},
    LKA:{bn:'খেলাপ-পরবর্তী পুনরুদ্ধার', en:'Post-default recovery'},
    PAK:{bn:'সমকক্ষ অর্থনীতি', en:'Peer economy'},
    NPL:{bn:'সমকক্ষ অর্থনীতি', en:'Peer economy'},
    VNM:{bn:'সমকক্ষ অর্থনীতি', en:'Peer economy'},
    IDN:{bn:'সমকক্ষ অর্থনীতি', en:'Peer economy'},
    PHL:{bn:'সমকক্ষ অর্থনীতি', en:'Peer economy'},
    IND:{bn:'সমকক্ষ অর্থনীতি', en:'Peer economy'}
  };
  // Assemble the display list keyed by ISO3.
  const C = {};
  for (const iso in ISO2ID){
    const d = (typeof DANGER_MAP !== 'undefined') ? DANGER_MAP.find(x=>x.id===ISO2ID[iso]) : null;
    if (!d) continue;
    C[iso] = {npl:d.npl, crar:d.crar, when:d.when, src:d.src, hero:!!d.hero,
      name_bn:d.name, name_en:d.en, war:false,
      st_bn:(STATUS[iso]||{}).bn, st_en:(STATUS[iso]||{}).en};
  }
  for (const iso in EXTRA){ C[iso] = Object.assign({crar:null}, EXTRA[iso]); }

  /* ---- Sequential colour scale: pale gold (low NPL) to deep red (high) ---- */
  const STOPS = [[0,[235,220,168]],[6,[226,179,60]],[12,[214,138,61]],[20,[207,81,54]],[27,[196,33,47]],[31,[150,17,26]]];
  function nplColor(v){
    v = Math.max(0, Math.min(31, v));
    for (let i=0;i<STOPS.length-1;i++){
      const [a,ca]=STOPS[i], [b,cb]=STOPS[i+1];
      if (v>=a && v<=b){ const t=(v-a)/(b-a);
        return 'rgb('+ca.map((c,k)=>Math.round(c+(cb[k]-c)*t)).join(',')+')'; }
    }
    return 'rgb(150,17,26)';
  }

  /* ---- one-time geometry: ocean, hatch pattern, backdrop, target fills ---- */
  const defs = mk('defs',{});
  const hatch = mk('pattern',{id:'wm-hatch',width:6,height:6,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'}, defs);
  mk('line',{x1:0,y1:0,x2:0,y2:6,stroke:'#0A2318','stroke-width':2.4,opacity:.55}, hatch);
  mk('rect',{x:0,y:0,width:1000,height:500,fill:'#0B2519'});                 /* ocean */

  // faint world backdrop
  for (const iso in WORLD_PATHS){
    mk('path',{d:WORLD_PATHS[iso], fill:'#123726', stroke:'#1B4331','stroke-width':0.6});
  }
  // shaded target countries (interactive)
  const tip = document.getElementById('wm-tip');
  const card = svg.closest('.comp-card') || svg.parentElement;
  function posTip(cx,cy){
    const r = card.getBoundingClientRect();
    let x=cx-r.left+16, y=cy-r.top-12;
    if (x+270>r.width) x=cx-r.left-276;
    if (x<8) x=8;
    tip.style.left=x+'px'; tip.style.top=y+'px';
  }
  function show(iso,cx,cy){
    const c=C[iso], L=LANG();
    tip.innerHTML =
      `<div class="t-year">${L==='bn'?c.name_bn:c.name_en} · ${c.when||''}</div>`+
      `<div class="t-val">NPL ${c.npl}%${(c.crar!=null)?' · CRAR '+c.crar+'%':''}${c.war?' · ⚔️':''}</div>`+
      `<div class="t-ev">${L==='bn'?(c.st_bn||''):(c.st_en||'')}</div>`+
      `<div class="t-sub">${c.src||''}</div>`;
    tip.classList.add('show'); posTip(cx,cy);
  }
  Object.keys(C).forEach(iso=>{
    if (!WORLD_PATHS[iso]) return;
    const c=C[iso];
    const g = mk('g',{tabindex:0, role:'button', style:'cursor:pointer',
      'aria-label':`${c.name_en}: NPL ${c.npl}%`});
    mk('path',{d:WORLD_PATHS[iso], fill:nplColor(c.npl),
      stroke:c.hero?'#F0E8D2':'#0A2318','stroke-width':c.hero?1.4:0.5, class:'wm-c','data-iso':iso}, g);
    if (c.war) mk('path',{d:WORLD_PATHS[iso], fill:'url(#wm-hatch)', 'pointer-events':'none'}, g);
    g.addEventListener('mouseenter',e=>show(iso,e.clientX,e.clientY));
    g.addEventListener('mousemove',e=>posTip(e.clientX,e.clientY));
    g.addEventListener('mouseleave',()=>tip.classList.remove('show'));
    g.addEventListener('focus',()=>{const r=g.getBoundingClientRect();show(iso,r.left+r.width/2,r.top);});
    g.addEventListener('blur',()=>tip.classList.remove('show'));
  });

  /* ---- Bangladesh halo pulse + war markers + labels (re-localised) ---- */
  if (!REDUCED){
    const st=document.createElement('style');
    st.textContent='@keyframes wmpulse{0%{r:6;opacity:.6}70%{r:20;opacity:0}100%{r:20;opacity:0}} .wm-halo{animation:wmpulse 2.4s ease-out infinite}';
    document.head.appendChild(st);
  }
  const bd = WORLD_CENTROIDS['BGD'];
  if (bd){
    if (!REDUCED) mk('circle',{cx:bd[0],cy:bd[1],r:6,fill:'none',stroke:'#E8434F','stroke-width':1.6,class:'wm-halo','pointer-events':'none'});
    mk('circle',{cx:bd[0],cy:bd[1],r:3,fill:'#E8434F',stroke:'#F0E8D2','stroke-width':1,'pointer-events':'none'});
  }
  // crossed-swords badges on war/crisis countries (red ring so the flag reads at any glyph weight)
  ['UKR','LBN','TUN'].forEach(iso=>{
    const p=WORLD_CENTROIDS[iso]; if(!p) return;
    mk('circle',{cx:p[0],cy:p[1],r:7.5,fill:'rgba(10,35,24,.92)',stroke:'#E8434F','stroke-width':1.4,'pointer-events':'none'});
    mk('text',{x:p[0],y:p[1]+3.6,'text-anchor':'middle','pointer-events':'none',
      style:'font-size:10px',fill:'#FF7A84'}).textContent='⚔️';
  });

  function localize(){
    const L=LANG();
    // labels (name + NPL) for the four headline countries, redrawn each toggle
    svg.querySelectorAll('.wm-lab').forEach(e=>e.remove());
    const lab=(iso,dx,dy,anchor)=>{
      const p=WORLD_CENTROIDS[iso], c=C[iso]; if(!p||!c) return;
      const t=mk('text',{x:p[0]+dx,y:p[1]+dy,'text-anchor':anchor||'middle','pointer-events':'none',class:'wm-lab',
        fill:c.hero?'#FF7A84':'#F0E8D2',
        style:'font-family:Sometype Mono,monospace;font-size:'+(c.hero?'12px':'10px')+';font-weight:'+(c.hero?'700':'600')});
      t.textContent = (L==='bn'?c.name_bn:c.name_en)+' '+c.npl+'%';
    };
    lab('BGD', 6, 22, 'start');
    lab('UKR', 0, -10);
    lab('LBN', 8, 14, 'start');
    lab('TUN', -6, 16, 'end');
    // legend
    renderLegend();
  }

  /* ---- legend: gradient scale + war key ---- */
  const legend = document.getElementById('wm-legend');
  function renderLegend(){
    if (!legend) return;
    const L=LANG();
    const grad = [0,6,12,20,27,31].map(v=>nplColor(v)).join(',');
    legend.innerHTML =
      `<div class="wm-scale">
         <span class="wm-scale-lab">${L==='bn'?'কম':'Low'}</span>
         <span class="wm-bar" style="background:linear-gradient(90deg,${grad})"></span>
         <span class="wm-scale-lab">${L==='bn'?'বেশি':'High'}</span>
         <span class="wm-scale-cap">${L==='bn'?'খেলাপি ঋণের হার (NPL %)':'Bad-loan ratio (NPL %)'}</span>
       </div>
       <div class="wm-war"><span class="wm-sword">⚔️</span>${L==='bn'?'যুদ্ধ বা তীব্র সংকটে':'at war or in acute crisis'}</div>`;
  }

  localize();
  document.addEventListener('langchange', localize);

  /* ---- map / scatter view toggle ---- */
  const mapWrap = document.getElementById('worldmap-wrap');
  const scWrap  = document.getElementById('dangermap-wrap');
  const btnMap  = document.getElementById('vt-map');
  const btnSc   = document.getElementById('vt-scatter');
  function setView(v){
    const map = v==='map';
    if (mapWrap) mapWrap.hidden = !map;
    if (scWrap)  scWrap.hidden  = map;
    if (btnMap){ btnMap.classList.toggle('on',map); btnMap.setAttribute('aria-pressed',String(map)); }
    if (btnSc){ btnSc.classList.toggle('on',!map); btnSc.setAttribute('aria-pressed',String(!map)); }
  }
  if (btnMap) btnMap.addEventListener('click',()=>setView('map'));
  if (btnSc)  btnSc.addEventListener('click',()=>setView('scatter'));
  setView('map');
})();
