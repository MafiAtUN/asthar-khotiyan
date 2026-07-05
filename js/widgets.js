/* ==============================================================
   PEOPLES-EDITION WIDGETS
   1) White Paper receipt  2) Family-share calculator
   3) "What could this build" converter  4) Share bar
   5) Downloadable stat cards (canvas)
   Requires data-peoples.js. Containers expected (see sections.html):
   #receipt, #familyshare, #converter, #sharebar
   ============================================================== */
(function(){
  const LANG = () => (document.documentElement.dataset.lang || 'bn');
  const BN_DIGITS = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  const bn = n => String(n).replace(/[0-9]/g, d => BN_DIGITS[+d]);
  const fmt = n => {
    const s = Math.round(n).toLocaleString('en-IN');
    return LANG()==='bn' ? bn(s) : s;
  };
  const PAGE_URL = location.origin + location.pathname;

  /* ---------- 1) WHITE PAPER RECEIPT ---------- */
  const rc = document.getElementById('receipt');
  function renderReceipt(){
    if (!rc) return;
    const L = LANG();
    rc.innerHTML =
      `<div class="rcp">
        <div class="rcp-head">${L==='bn'?RECEIPT.title_bn:RECEIPT.title_en}</div>
        <div class="rcp-meta">${L==='bn'?RECEIPT.meta_bn:RECEIPT.meta_en}</div>
        <div class="rcp-rule"></div>
        ${RECEIPT.items.map(i=>
          `<div class="rcp-row"><span>${L==='bn'?i.bn:i.en}</span><b>${L==='bn'?i.val:i.val_en}</b></div>`
        ).join('')}
        <div class="rcp-rule"></div>
        <div class="rcp-routes">${L==='bn'?RECEIPT.routes_bn:RECEIPT.routes_en}</div>
        <div class="rcp-src">${RECEIPT.src}</div>
        <div class="rcp-disc">${L==='bn'?RECEIPT.disclaimer_bn:RECEIPT.disclaimer_en}</div>
      </div>`;
  }

  /* ---------- 2) FAMILY SHARE ---------- */
  const fs = document.getElementById('familyshare');
  let famN = 4;
  function renderFamily(){
    if (!fs) return;
    const L = LANG();
    const total = PER_CAPITA_TK * famN;
    fs.innerHTML =
      `<div class="fam-row">${[1,2,3,4,5,6,7,8].map(n=>
        `<button class="fam-p ${n<=famN?'on':''}" data-n="${n}" aria-label="${n}">
           <svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="7" r="4" fill="currentColor"/><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="currentColor"/></svg>
         </button>`).join('')}
       </div>
       <div class="fam-out">
         <span class="fam-num">৳${fmt(total)}</span>
         <span class="fam-lab">${L==='bn'
           ? `আপনার ${bn(famN)} জনের পরিবারের ভাগে পড়া খেলাপি ঋণের বোঝা`
           : `Your family of ${famN}'s share of the distressed-loan burden`}</span>
       </div>
       <button class="pe-share" data-card="family">📤 ${L==='bn'?'এই সংখ্যাটা শেয়ার করুন':'Share this number'}</button>`;
    fs.querySelectorAll('.fam-p').forEach(b=>b.addEventListener('click',()=>{ famN=+b.dataset.n; renderFamily(); }));
    bindShare(fs);
  }

  /* ---------- 3) CONVERTER ---------- */
  const cv = document.getElementById('converter');
  let unitId = 'padma';
  function renderConverter(){
    if (!cv) return;
    const L = LANG();
    const u = CONVERTER_UNITS.find(x=>x.id===unitId);
    const count = DISTRESSED_TOTAL_CR / u.unit_cr;
    const shown = count >= 100 ? Math.round(count) : Math.round(count*10)/10;
    const iconRows = Math.min(60, Math.round(Math.min(count, 60)));
    cv.innerHTML =
      `<div class="cv-tabs">${CONVERTER_UNITS.map(x=>
        `<button class="cv-tab ${x.id===unitId?'on':''}" data-u="${x.id}">${L==='bn'?x.bn:x.en}</button>`).join('')}
       </div>
       <div class="cv-out">
         <span class="cv-num">${fmt(shown)}${count>60?'':''}</span>
         <span class="cv-lab">${L==='bn'
            ? `এতগুলো "${u.bn}" বানানো যেত মোট বিপদগ্রস্ত ঋণের টাকায় (৳১০.৮৭ লাখ কোটি)`
            : `"${u.en}" could be built with total distressed loans (Tk 10.87 lakh crore)`}</span>
       </div>
       <div class="cv-army" aria-hidden="true">${'<span class="cv-i"></span>'.repeat(iconRows)}${count>60?'<span class="cv-more">+'+fmt(Math.round(count-60))+'</span>':''}</div>
       <div class="cv-src">${u.src}${u.verify ? (L==='bn'?' · সমন্বয়ের সময় সংখ্যাটি যাচাই করুন':' · verify exact figure on integration') : ''}</div>
       <button class="pe-share" data-card="converter">📤 ${L==='bn'?'শেয়ার করুন':'Share'}</button>`;
    cv.querySelectorAll('.cv-tab').forEach(b=>b.addEventListener('click',()=>{ unitId=b.dataset.u; renderConverter(); }));
    bindShare(cv);
  }

  /* ---------- 4) SHARE BAR ---------- */
  const sb = document.getElementById('sharebar');
  function renderShareBar(){
    if (!sb) return;
    const L = LANG();
    const text = encodeURIComponent(L==='bn'
      ? 'ব্যাংকে রাখা প্রতি ১০০ টাকার ৩১ টাকা আর ফিরছে না। ৩০ বছরের হিসাব, প্রতিটি সংখ্যার সোর্সসহ:'
      : 'Of every 100 taka in Bangladesh’s banks, 31 is not coming back. The 30-year ledger, every number sourced:');
    const url = encodeURIComponent(PAGE_URL);
    sb.innerHTML =
      `<span class="sb-lab">${L==='bn'?'ছড়িয়ে দিন':'Spread it'}</span>
       <a class="sb-btn" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${url}">Facebook</a>
       <a class="sb-btn" target="_blank" rel="noopener" href="https://wa.me/?text=${text}%20${url}">WhatsApp</a>
       <a class="sb-btn" target="_blank" rel="noopener" href="https://x.com/intent/tweet?text=${text}&url=${url}">X</a>
       <a class="sb-btn" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${url}">LinkedIn</a>
       <button class="sb-btn" id="sb-copy">${L==='bn'?'লিংক কপি':'Copy link'}</button>`;
    const cp = sb.querySelector('#sb-copy');
    cp.addEventListener('click',async()=>{
      try{ await navigator.clipboard.writeText(PAGE_URL);
        cp.textContent = LANG()==='bn'?'কপি হয়েছে ✓':'Copied ✓';
        setTimeout(renderShareBar, 1600);
      }catch(e){ prompt('URL:', PAGE_URL); }
    });
  }

  /* ---------- 5) STAT CARDS (canvas 1080x1350) ---------- */
  function makeCard(kind){
    const L = LANG();
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1350;
    const x = c.getContext('2d');
    /* field */
    const g = x.createLinearGradient(0,0,0,1350);
    g.addColorStop(0,'#123A29'); g.addColorStop(1,'#0A2318');
    x.fillStyle = g; x.fillRect(0,0,1080,1350);
    /* hairline frame */
    x.strokeStyle = 'rgba(226,179,60,.5)'; x.lineWidth = 3;
    x.strokeRect(36,36,1008,1278);
    /* red disc */
    x.fillStyle = '#E8434F'; x.beginPath(); x.arc(96,110,20,0,7); x.fill();
    x.fillStyle = '#E2B33C';
    x.font = '600 30px "Sometype Mono", monospace';
    x.fillText(L==='bn' ? 'আস্থার খতিয়ান' : 'THE LEDGER OF TRUST', 136, 121);

    let big, line1, line2;
    if (kind==='family'){
      big = '৳'+ (LANG()==='bn' ? bn((PER_CAPITA_TK*famN).toLocaleString('en-IN')) : (PER_CAPITA_TK*famN).toLocaleString('en-IN'));
      line1 = L==='bn' ? `${bn(famN)} জনের একটি পরিবারের ভাগে` : `One family of ${famN}'s share of`;
      line2 = L==='bn' ? 'পড়া খেলাপি ঋণের বোঝা' : 'the distressed-loan burden';
    } else if (kind==='converter'){
      const u = CONVERTER_UNITS.find(z=>z.id===unitId);
      const n = Math.round(DISTRESSED_TOTAL_CR/u.unit_cr);
      big = LANG()==='bn' ? bn(n.toLocaleString('en-IN')) : n.toLocaleString('en-IN');
      line1 = L==='bn' ? `"${u.bn}" বানানো যেত` : `"${u.en}" could be built`;
      line2 = L==='bn' ? 'বিপদগ্রস্ত ঋণের মোট টাকায়' : 'with total distressed loans';
    } else {
      big = L==='bn' ? '৩৫.৭%' : '35.7%';
      line1 = L==='bn' ? 'খেলাপি ঋণে বাংলাদেশ এখন' : 'Bangladesh now has the';
      line2 = L==='bn' ? 'পৃথিবীতে এক নম্বরে (সেপ্টে. ২০২৫)' : 'world’s highest bad-loan ratio';
    }
    x.fillStyle = '#F0E8D2';
    x.font = '700 200px "Bricolage Grotesque", sans-serif';
    x.textAlign = 'center';
    x.fillText(big, 540, 660);
    x.font = '400 52px "Tiro Bangla", serif';
    x.fillStyle = '#CBD3BC';
    x.fillText(line1, 540, 790);
    x.fillText(line2, 540, 862);
    /* source + url */
    x.font = '400 30px "Sometype Mono", monospace';
    x.fillStyle = '#8FA491';
    x.fillText(L==='bn' ? 'সোর্স: বাংলাদেশ ব্যাংক · IMF · বিশ্বব্যাংক' : 'Sources: Bangladesh Bank · IMF · World Bank', 540, 1180);
    x.fillStyle = '#E2B33C';
    x.fillText(PAGE_URL.replace(/^https?:\/\//,''), 540, 1236);
    return c;
  }
  function bindShare(scope){
    scope.querySelectorAll('.pe-share').forEach(b=>{
      b.addEventListener('click', async ()=>{
        const canvas = makeCard(b.dataset.card);
        canvas.toBlob(async blob=>{
          const file = new File([blob], 'asthar-khotiyan.png', {type:'image/png'});
          if (navigator.canShare && navigator.canShare({files:[file]})){
            try { await navigator.share({files:[file], title:'আস্থার খতিয়ান', url:PAGE_URL}); return; } catch(e){}
          }
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'asthar-khotiyan-card.png';
          a.click();
        }, 'image/png');
      });
    });
  }

  function renderAll(){ renderReceipt(); renderFamily(); renderConverter(); renderShareBar(); }
  renderAll();
  document.addEventListener('langchange', renderAll);
})();
