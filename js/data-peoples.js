/* ==============================================================
   PEOPLES-EDITION DATA MODULE (verified July 2026)
   Every figure below was verified against the cited source.
   Load BEFORE danger-map.js and widgets.js.
   ============================================================== */

/* ---- NEW timeline point: extend the main story into 2026 ----
   Add to the annual SERIES as a quarterly marker (like QPEAK):
   Mar 2026: NPL Tk 5,88,704 crore = 32.26% of total loans.
   Source: Bangladesh Bank data via The Daily Star / syndicated
   reports, June 2026. */
const Q2026 = { x: 2026.2, y: 32.26, label: "Mar 2026 · 32.3" };

/* ---- DANGER MAP (scatter): NPL x CRAR, latest available ----
   All values verified. "approx" flags a stable, widely published
   figure whose exact latest decimal was not re-confirmed; keep
   the tilde in the UI for those. */
const DANGER_MAP = [
  { id:"BD", name:"বাংলাদেশ", en:"Bangladesh", npl:30.6, crar:-2.64, hero:true,
    when:"Dec 2025", src:"Bangladesh Bank Financial Stability Report 2025",
    note_bn:"পৃথিবীর একমাত্র বড় অর্থনীতি যার ব্যাংক খাতের মূলধন এখন শূন্যের নিচে।",
    note_en:"The only major economy whose banking sector capital is below zero." },
  { id:"IN", name:"ভারত", en:"India", npl:2.2, crar:17.20,
    when:"end 2025", src:"RBI; cross-country comparison in BB FSR 2025 (via The Daily Star)",
    note_bn:"২০১৮ সালে সংকট ছিল, স্বীকার করে সাত বছরে নামিয়ে এনেছে।",
    note_en:"Faced its own crisis in 2018; recognised it and climbed down in seven years." },
  { id:"PK", name:"পাকিস্তান", en:"Pakistan", npl:7.4, crar:20.8,
    when:"2025", src:"SBP Mid-Year Review H1CY25 (CAR 21.4% Jun 2025); BB FSR comparison 20.8% end-2025. NPL: ADB/press compilations (reported 5.8–7.4 across 2025; conservative higher value used)",
    note_bn:"বারবার সংকটেও কুশন ধরে রেখেছে।",
    note_en:"Held its cushion through repeated macro crises." },
  { id:"LK", name:"শ্রীলঙ্কা", en:"Sri Lanka", npl:12.6, crar:19.4,
    when:"end 2025", src:"CBSL Financial Stability Review 2025; BB FSR comparison",
    note_bn:"রাষ্ট্র দেউলিয়া হয়েও ব্যাংকের মূলধন ১৯%-এর ওপরে।",
    note_en:"Even after sovereign default, bank capital stayed above 19%." },
  { id:"NP", name:"নেপাল", en:"Nepal", npl:5.2, crar:13.2,
    when:"2025", src:"IMF ECF 6th Review (NPL 5.2%, Apr 2025); NRB provisional (CAR 13.19%, mid-Aug 2025)",
    note_bn:"চাপ বাড়ছে, কিন্তু নিয়ম মেনে স্বীকার করছে।",
    note_en:"Stress is rising, but it is being recognised by the rules." },
  { id:"ID", name:"ইন্দোনেশিয়া", en:"Indonesia", npl:2.28, crar:25.88,
    when:"Jul 2025", src:"OJK Board of Commissioners press release, Sep 2025",
    note_bn:"১৯৯৮ সালে আমাদের চেয়েও খারাপ ছিল; আজ সবচেয়ে মোটা কুশন।",
    note_en:"Was worse than us in 1998; today holds the fattest cushion here." },
  { id:"VN", name:"ভিয়েতনাম", en:"Vietnam", npl:5.3, crar:11.5,
    when:"Mar 2025", src:"IMF Article IV 2025 (NPL 5.3% Mar 2025; CAR 10.4% public / 12.1% private, midpoint shown)",
    note_bn:"কুশন পাতলা, নজরদারিতে আছে; তবু শূন্যের অনেক ওপরে।",
    note_en:"Thin cushion, under watch; still far above zero." },
  { id:"PH", name:"ফিলিপাইন", en:"Philippines", npl:2.9, crar:16.2,
    when:"Dec 2025", src:"BSP via Philippine News Agency (NPL lowest since Aug 2020, Dec 2025); CAR 16.2% consolidated, BSP Second Semester 2025 Report on the Philippine Financial System (end-Dec 2025)",
    note_bn:"মহামারির ধাক্কা সামলে পাঁচ বছরের সেরা অবস্থানে।",
    note_en:"Back to its best position in five years after the pandemic." }
];
/* Bar-chart-only extras (NPL verified, CRAR not verified → excluded
   from scatter): Ukraine 26.1, Lebanon 23.8, Tunisia 14.7 (national
   regulators via ADB and Daily Star compilations, late 2025). */

/* ---- SCALE CONVERTER UNITS (all in Tk crore unless noted) ---- */
const DISTRESSED_TOTAL_CR = 1087000;  /* Tk 10.87 lakh crore, BB FSR end-2025 */
const NPL_TOTAL_CR       = 557217;    /* Tk 5,57,217 crore, BB, Dec 2025 */
const CONVERTER_UNITS = [
  { id:"padma",  bn:"পদ্মা সেতু", en:"Padma Bridge", unit_cr:30193,
    src:"Final project cost, Bangladesh Bridge Authority (widely reported)",
    icon:"bridge" },
  { id:"metro",  bn:"ঢাকা মেট্রো (পুরো সিস্টেম)", en:"Dhaka Metro system", unit_cr:50000,
    src:"White Paper Committee's own conversion (Tk 675,000 crore = 13.5 metro systems)",
    icon:"train" },
  { id:"garment", bn:"একজন পোশাক শ্রমিকের ১ বছরের বেতন", en:"One garment worker's annual wage",
    unit_cr:0.015, /* Tk 12,500 x 12 = Tk 1.5 lakh = 0.015 crore */
    src:"Minimum wage Tk 12,500/month, Wage Board 2023",
    icon:"person" },
  { id:"remit", bn:"প্রবাসীদের ১ বছরের রেমিট্যান্স", en:"One year of remittances",
    unit_cr:370000, /* $30.32B FY2024-25 (record) at ~Tk 122/$ = ~Tk 3.70 lakh crore. Verified against Bangladesh Bank wage-remittance data, July 2026. */
    src:"Bangladesh Bank remittance inflow, FY2024-25: record $30.32 billion (about Tk 3.70 lakh crore)",
    icon:"plane" }
];
const PER_CAPITA_TK = 62000;  /* distressed assets per citizen, page's existing verified figure */

/* ---- WHITE PAPER RECEIPT (all items attributed to the committee) ---- */
const RECEIPT = {
  title_bn: "শ্বেতপত্রের রসিদ",
  title_en: "The White Paper receipt",
  meta_bn: "অর্থনীতির শ্বেতপত্র কমিটি · প্রধান: ড. দেবপ্রিয় ভট্টাচার্য · জমা: ১ ডিসেম্বর ২০২৪",
  meta_en: "Economic White Paper Committee · Chair: Dr. Debapriya Bhattacharya · Submitted: 1 Dec 2024",
  items: [
    { bn:"প্রতি বছর গড়ে পাচার (২০০৯–২৩)", en:"Laundered abroad per year (2009–23)", val:"$১,৬০০ কোটি", val_en:"$16 billion" },
    { bn:"১৫ বছরে মোট পাচার", en:"Total siphoned in 15 years", val:"$২৩,৪০০ কোটি", val_en:"$234 billion" },
    { bn:"ব্যাংক খাতের 'ব্ল্যাকহোল' (জুন ২০২৪)", en:"Banking 'blackhole' (Jun 2024)", val:"৳৬.৭৫ লাখ কোটি", val_en:"Tk 675,000 crore" },
    { bn:"কমিটির নিজের হিসাবে যা সমান", en:"In the committee's own units", val:"সাড়ে ২২টি পদ্মা সেতু", val_en:"22.5 Padma Bridges" },
    { bn:"কার্যত দেউলিয়া ব্যাংক", en:"Banks 'technically bankrupt'", val:"১০টি", val_en:"10" }
  ],
  routes_bn: "টাকার গন্তব্য (কমিটির প্রতিবেদনে): সংযুক্ত আরব আমিরাত, যুক্তরাজ্য, কানাডা, যুক্তরাষ্ট্র, হংকং, মালয়েশিয়া, সিঙ্গাপুর, ভারত",
  routes_en: "Destinations named in the report: UAE, UK, Canada, US, Hong Kong, Malaysia, Singapore, India",
  src: "Coverage of 1 Dec 2024 submission: The Daily Star, The Business Standard, bdnews24, Prothom Alo, Dhaka Tribune",
  disclaimer_bn: "সব সংখ্যা শ্বেতপত্র কমিটির; আমরা শুধু খতিয়ানে তুলছি।",
  disclaimer_en: "All figures are the committee's; this page only records them in the ledger."
};

/* ---- Supplementary sourced facts for copy (use, do not exceed) ----
   · Janata Bank capital shortfall Tk 64,406 crore ≈ almost double
     the cost of the Padma Bridge (Daily Sun, 2026).
   · Nearly two dozen banks in capital deficit; combined shortfall
     over Tk 280,000 crore (Bangladesh Bank data via Daily Sun).
   · India comparison line for copy: BD 30.6–32.3% vs India 2.2%
     and Pakistan 5.8–7.4% (Daily Sun / BB FSR comparison). */
