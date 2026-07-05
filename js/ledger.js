/* ============================================================
   LEDGER.JS
   The paper exhibit cards, grouped by era, with click-to-chart
   linking. Defines flash() (also used by chart.js at click time).
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
const ledger=document.getElementById('ledger');
ERA_GROUPS.forEach((g,gi)=>{
  const evs=EVENTS.filter(e=>e.era===gi);
  if(!evs.length)return;
  const box=document.createElement('div');
  box.className='era-group';
  box.innerHTML=`<div class="era-title">${g.label}<span class="era-span">${g.span}</span></div>`;
  const grid=document.createElement('div');
  grid.className='entries';
  evs.forEach(ev=>{
    const cardEl=document.createElement('div');
    cardEl.className='entry'+(ev.n?'':' ghost-card');
    if(ev.n)cardEl.dataset.n=ev.n;
    cardEl.innerHTML=
      `<div class="e-top"><div class="e-disc">${ev.n??'&middot;'}</div>`+
      `<div class="e-year">${ev.year}</div>`+
      `<div class="e-npl">${ev.n?('NPL '+valueAt(ev.x).toFixed(1)+'%'):''}</div>`+
      `<div class="e-tag ${ev.tag}">${ev.tagLabel}</div></div>`+
      `<h3>${ev.title}</h3><p>${ev.body}</p>`;
    if(ev.n){
      cardEl.addEventListener('click',()=>{
        document.getElementById('chart-anchor').scrollIntoView({block:'center'});
        const g2=discEls[ev.n];
        document.querySelectorAll('.disc.active').forEach(x=>x.classList.remove('active'));
        if(g2){g2.classList.add('active');setTimeout(()=>g2.classList.remove('active'),2600);}
        flash(cardEl);
      });
    }
    grid.appendChild(cardEl);
  });
  box.appendChild(grid);
  ledger.appendChild(box);
});

/* ============================================================
   FLASH (shared row highlight)
   ============================================================ */
function flash(row){
  document.querySelectorAll('.entry.active').forEach(x=>x.classList.remove('active'));
  row.classList.add('active');
  setTimeout(()=>row.classList.remove('active'),2000);
}
