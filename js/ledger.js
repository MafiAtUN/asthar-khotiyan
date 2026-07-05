/* ============================================================
   LEDGER.JS
   The paper exhibit cards (grouped by era, with click-to-chart
   linking and per-card source links) and the Sources & further
   reading list. Both renderers are re-runnable for the language
   toggle. Defines flash() (also used by chart.js at click time).
   ============================================================ */

/* ============================================================
   LEDGER (paper exhibit cards)
   ============================================================ */
const ERA_GROUPS=[
  {label:"Inheritance and crisis",span:"1996 – 2001"},
  {label:"The reform decade",span:"2001 – 2006"},
  {label:"Emergency interlude",span:"2007 – 2008"},
  {label:"Growth, and the slow leak",span:"2009 – Aug 2024"},
  {label:"Reckoning",span:"Aug 2024 – present"}
];
function renderLedger(){
  const ledger=document.getElementById('ledger');
  ledger.innerHTML='';
  ERA_GROUPS.forEach((g,gi)=>{
    const evs=EVENTS.filter(e=>e.era===gi);
    if(!evs.length)return;
    const box=document.createElement('div');
    box.className='era-group';
    box.innerHTML=`<div class="era-title">${tx(g.label)}<span class="era-span">${tx(g.span)}</span></div>`;
    const grid=document.createElement('div');
    grid.className='entries';
    evs.forEach(ev=>{
      const cardEl=document.createElement('div');
      cardEl.className='entry'+(ev.n?'':' ghost-card');
      if(ev.n)cardEl.dataset.n=ev.n;
      const src=EVENT_SOURCES[ev.title];
      const srcHTML=src?`<a class="e-src" href="${src.url}" target="_blank" rel="noopener noreferrer">${tx('Source')}: ${tx(src.name)} ↗</a>`:'';
      cardEl.innerHTML=
        `<div class="e-top"><div class="e-disc">${ev.n?num(ev.n):'&middot;'}</div>`+
        `<div class="e-year">${num(ev.year)}</div>`+
        `<div class="e-npl">${ev.n?((isBn()?'খেলাপি ':'NPL ')+num(valueAt(ev.x).toFixed(1))+'%'):''}</div>`+
        `<div class="e-tag ${ev.tag}">${tx(ev.tagLabel)}</div></div>`+
        `<h3>${evTitle(ev)}</h3><p>${evBody(ev)}</p>`+srcHTML;
      if(ev.n){
        cardEl.addEventListener('click',()=>{
          document.getElementById('chart-anchor').scrollIntoView({block:'center'});
          const g2=discEls[ev.n];
          document.querySelectorAll('.disc.active').forEach(x=>x.classList.remove('active'));
          if(g2){g2.classList.add('active');setTimeout(()=>g2.classList.remove('active'),2600);}
          flash(cardEl);
        });
      }
      // The source link opens a new tab; don't also trigger the card's jump-to-chart.
      const a=cardEl.querySelector('.e-src');
      if(a)a.addEventListener('click',e=>e.stopPropagation());
      grid.appendChild(cardEl);
    });
    box.appendChild(grid);
    ledger.appendChild(box);
  });
}
renderLedger();
I18N.rerender.push(renderLedger);

/* ============================================================
   SOURCES & FURTHER READING
   ============================================================ */
function renderRefs(){
  const host=document.getElementById('refs');
  if(!host) return;
  host.innerHTML='';
  const CATS=[['data','Primary data'],['events','Key events'],['regulators','Comparator regulators']];
  CATS.forEach(([cat,enLabel])=>{
    const items=REFERENCES.filter(r=>r.cat===cat);
    if(!items.length) return;
    const group=document.createElement('div');
    group.className='ref-group';
    const label=isBn()?(BN['src.cat.'+cat]||enLabel):enLabel;
    let html=`<h3>${label}</h3><ul>`;
    items.forEach(r=>{
      html+=`<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${isBn()?r.bn:r.en} <span class="ref-out" aria-hidden="true">↗</span></a></li>`;
    });
    html+='</ul>';
    group.innerHTML=html;
    host.appendChild(group);
  });
}
renderRefs();
I18N.rerender.push(renderRefs);

/* ============================================================
   FLASH (shared row highlight)
   ============================================================ */
function flash(row){
  document.querySelectorAll('.entry.active').forEach(x=>x.classList.remove('active'));
  row.classList.add('active');
  setTimeout(()=>row.classList.remove('active'),2000);
}
