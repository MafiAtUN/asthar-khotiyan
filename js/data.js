/* ============================================================
   DATA
   Every data array for The Ledger of Trust, as plain consts.
   Loaded first; all other scripts read these globals.
   Each array is annotated with its source below.
   ============================================================ */

// Gross NPL as % of total loans, all scheduled banks, year-end.
// Source: Bangladesh Bank annual reports (1997-2011, via published academic compilations);
// Bangladesh Bank quarterly statistics (2012-2025), cross-checked vs World Bank indicators and CEIC.
const SERIES = [
  [1997,37.5],[1998,40.7],[1999,41.1],[2000,34.9],[2001,31.5],
  [2002,28.0],[2003,22.1],[2004,17.6],[2005,13.6],[2006,13.2],
  [2007,13.2],[2008,10.8],[2009,9.2],[2010,7.3],[2011,6.1],
  [2012,10.0],[2013,8.9],[2014,9.7],[2015,8.8],[2016,9.2],
  [2017,9.3],[2018,10.3],[2019,9.3],[2020,7.7],[2021,7.9],
  [2022,8.2],[2023,9.0],[2024,20.2],[2025,30.6]
];
// Intra-year quarterly peak reading (annual SERIES uses December values).
// Source: Bangladesh Bank quarterly banking statistics, Sep 2025.
const QPEAK = {x:2025.72, y:35.7, label:"Sep 2025 · 35.7"};
// Sector Capital to Risk-Weighted Assets Ratio (percent), quarterly points.
// Source: Bangladesh Bank Financial Stability Reports and quarterly assessments.
const CRAR = [
  {x:2020,y:11.6,lab:"Dec 2020"},{x:2023,y:11.64,lab:"Dec 2023"},
  {x:2024.45,y:10.64,lab:"Jun 2024"},{x:2024.72,y:6.86,lab:"Sep 2024"},
  {x:2024.98,y:3.08,lab:"Dec 2024"},{x:2025.45,y:4.47,lab:"Jun 2025"},
  {x:2025.72,y:1.56,lab:"Sep 2025"},{x:2025.98,y:-2.64,lab:"Dec 2025"}
];
// Broader distressed-asset estimates vs the reported classified stock.
// Source: IMF staff estimate (2019); Bangladesh Bank Financial Stability Report distressed-asset measures (end-2024, end-2025).
const DIST = [
  {x:2019.45,y:25,lab:"IMF estimate, 2019",note:"IMF staff put actual distressed loans near Tk 2.5 trillion, roughly double the reported classified stock"},
  {x:2024.98,y:44,lab:"BB FSR, end 2024",note:"Defaulted plus rescheduled plus written-off loans, Tk 7.56 lakh crore"},
  {x:2025.98,y:59,lab:"BB FSR, end 2025",note:"Distressed assets reach Tk 10.87 lakh crore, 59 percent of all outstanding credit"}
];
// Government-in-office periods, for era shading (no causal claim implied).
// Source: historical record of Bangladesh governments.
const ERAS = [
  {from:1996.6,to:2001.75,label:"AL government",tone:0},
  {from:2001.75,to:2006.85,label:"BNP-led coalition",tone:1},
  {from:2006.85,to:2009.0,label:"Caretaker govt",tone:0},
  {from:2009.0,to:2024.6,label:"AL government",tone:1},
  {from:2024.6,to:2026.35,label:"Interim govt",tone:0}
];
// Annotation ledger entries mapped to the chart's numbered discs.
// Source: Bangladesh Bank records, IMF assessments, audit findings, and contemporary reporting.
const EVENTS = [
 {n:1,x:1997,era:0,year:"1997",tag:"glob",tagLabel:"Global",title:"Asian financial crisis sweeps the region",body:"Currency and banking collapses hit East and Southeast Asia. Bangladesh's closed capital account and limited foreign borrowing insulate its banks from direct contagion, but the crisis pushes regional regulators, including Bangladesh Bank, toward stronger prudential standards."},
 {n:2,x:1998,era:0,year:"1998",tag:"glob",tagLabel:"Global",title:"The flood of the century",body:"Floodwaters cover roughly two-thirds of the country for months, damaging crops, small enterprises, and repayment capacity across rural and industrial portfolios in an already strained credit system."},
 {n:3,x:1999,era:0,year:"1999",tag:"sec",tagLabel:"Sector",title:"The all-time peak: 41.1 percent",body:"Bad loans reach their recorded maximum. The stock reflects decades of accumulated distress: directed lending by nationalised banks since the 1970s, weak appraisal, thin recovery infrastructure, and lending shaped by influence across successive governments."},
 {n:4,x:2001,era:0,year:"2001",tag:"pol",tagLabel:"Political",title:"Transfer of power, continuity of reform",body:"A BNP-led coalition takes office after national elections. The financial sector reform agenda, backed by the World Bank and IMF, continues across the transition: loan classification tightens, recovery courts expand, and central bank capacity is rebuilt."},
 {n:null,x:2003,era:1,year:"2002–06",tag:"reg",tagLabel:"Regulatory",title:"The quiet machinery of repair",body:"The Central Bank Strengthening Project modernises supervision. Provisioning and classification rules are tightened stepwise, money-loan courts accelerate recovery, and private banks expand market share with far cleaner books than the state banks. The ratio falls by half in five years."},
 {n:5,x:2007,era:2,year:"2007",tag:"pol",tagLabel:"Political",title:"Caretaker government and the anti-corruption drive",body:"A military-backed caretaker administration postpones elections and pursues high-profile corruption cases. State-owned banks are corporatised as public limited companies with new boards, a structural change intended to distance lending from day-to-day political direction."},
 {n:6,x:2008,era:2,year:"2008",tag:"glob",tagLabel:"Global",title:"Global financial crisis, limited local burn",body:"The collapse of major Western institutions triggers a worldwide credit crunch. Bangladesh's banks, funded by domestic deposits and barred from complex securities, are largely spared; exports and remittances slow but the NPL decline continues."},
 {n:7,x:2009,era:3,year:"2009",tag:"pol",tagLabel:"Political",title:"Awami League returns to office",body:"A landslide election victory begins what becomes a fifteen-year period of single-party government. Early years continue the downward NPL trend; the licensing environment and bank governance arrangements set in this period shape the following decade."},
 {n:8,x:2010.7,era:3,year:"2010–11",tag:"sec",tagLabel:"Sector",title:"The Dhaka stock market boom and crash",body:"Share prices roughly triple and then collapse, wiping out an estimated hundreds of billions of taka in market value. Margin lending and bank exposure to the capital market draw regulatory scrutiny and dent household confidence in financial institutions."},
 {n:9,x:2011,era:3,year:"2011",tag:"sec",tagLabel:"Sector",title:"The series low: 6.1 percent",body:"The ratio touches its best recorded level. Analysts note the reading is flattered by large write-offs and rescheduling as well as genuine improvement; even so, it marks the credible end point of the 1999 to 2011 reform arc."},
 {n:10,x:2012,era:3,year:"2012",tag:"sec",tagLabel:"Sector",title:"Hall-Mark, and the rules catch up",body:"A roughly Tk 3,500 crore fraudulent loan scheme at a state bank's hotel branch becomes the era's defining scandal. The same year, Bangladesh Bank adopts stricter, internationally aligned classification rules; the ratio jumps to 10 percent as hidden distress is recognised."},
 {n:11,x:2013,era:3,year:"2013",tag:"sec",tagLabel:"Sector",title:"BASIC Bank unravels; nine new licences",body:"Audits reveal that most of a once-profitable state bank's portfolio was disbursed irregularly between 2009 and 2013. In parallel, nine new private banks are licensed, a decision critics link to political connection and later associate with several of the weakest institutions."},
 {n:12,x:2016,era:3,year:"2016",tag:"sec",tagLabel:"Sector",title:"The central bank cyber heist",body:"Hackers use fraudulent SWIFT messages to move 81 million dollars from Bangladesh Bank's account at the Federal Reserve Bank of New York. The theft is a landmark in global financial cybercrime and a reputational shock to the country's monetary authority."},
 {n:null,x:2017,era:3,year:"2017",tag:"sec",tagLabel:"Sector",title:"Ownership change at the largest private bank",body:"Board and ownership changes at Islami Bank Bangladesh, the country's biggest private lender, concentrate control with a single business group. Later inquiries by the central bank and press investigations trace large related-party exposures to this period."},
 {n:13,x:2019,era:3,year:"2019",tag:"reg",tagLabel:"Regulatory",title:"The two-percent rescheduling window; the IMF dissents",body:"Defaulters may regularise loans with a two percent down payment and extended terms. The published ratio stabilises, while IMF staff estimate that true distressed assets are roughly double the reported classified figure, a gap visible in the estimates layer above."},
 {n:14,x:2020,era:3,year:"2020",tag:"glob",tagLabel:"Global",title:"Pandemic moratorium freezes the picture",body:"A blanket repayment moratorium during COVID-19 means loans cannot slip into default regardless of payment behaviour. The ratio falls to 7.7 percent, a reading nearly all observers treat as an artefact of the freeze rather than improvement."},
 {n:15,x:2022,era:3,year:"2022",tag:"glob",tagLabel:"Global",title:"Forex crisis and the turn to the IMF",body:"Post-pandemic import costs and the Ukraine war drain reserves; the taka loses about a quarter of its value in a year. Sri Lanka's default sharpens regional anxiety, and Bangladesh requests IMF support while relaxed classification keeps reported NPLs near 8 percent."},
 {n:16,x:2023,era:3,year:"2023",tag:"reg",tagLabel:"Regulatory",title:"The 4.7 billion dollar programme and an NPL roadmap",body:"The IMF approves a 4.7 billion dollar arrangement with financial sector conditions attached. Bangladesh Bank publishes a roadmap to cut bad loans and pledges a return to international classification standards, commitments that set up the disclosures of 2025."},
 {n:17,x:2024.6,era:4,year:"Aug 2024",tag:"pol",tagLabel:"Political",title:"The July Uprising and a change of government",body:"Mass protests end fifteen years of Awami League rule; an interim government led by Muhammad Yunus takes office. Boards of a dozen banks are reconstituted, special audits begin, and loans of several large, politically connected groups slip into default. The year-end ratio more than doubles to 20.2 percent, and the capital ratio begins its collapse."},
 {n:18,x:2025.3,era:4,year:"2025",tag:"reg",tagLabel:"Regulatory",title:"The 90-day standard returns; the mountain becomes visible",body:"Loans overdue beyond 90 days are again classified as non-performing, replacing the previous 180-day practice. Combined with inspection-driven reclassification, recognised bad loans surge past Tk 4 lakh crore within a quarter as long-deferred distress is booked at once."},
 {n:19,x:2025.72,era:4,year:"Sep 2025",tag:"sec",tagLabel:"Sector",title:"Highest reported ratio in the world",body:"At 35.7 percent, Bangladesh's NPL ratio exceeds that of every other reporting country, including economies at war. The central bank frames the number as the true picture finally surfacing; sector CRAR falls to 1.56 percent the same quarter."},
 {n:20,x:2025.98,era:4,year:"Dec 2025",tag:"reg",tagLabel:"Regulatory",title:"Rescheduling relief trims the headline; capital turns negative",body:"A relaxed rescheduling policy pulls the ratio back to 30.6 percent, but sector CRAR ends the year at negative 2.64 percent against a Basel III minimum of 10, and broader distressed assets reach 59 percent of all credit."},
 {n:null,x:2026.15,era:4,year:"Feb 2026",tag:"pol",tagLabel:"Political",title:"A national election, and an open question",body:"Bangladesh votes in its first general election since the transition. Whichever direction policy takes, the sector's arithmetic is unforgiving: rebuilding capital, resolving distressed assets, and restoring depositor confidence is the work of years, as the 1999 to 2011 arc showed once before. By March 2026 the reported ratio has edged up again to 32.3 percent (Tk 5,88,704 crore): recognition is only the first step."},
 // Human-lens exhibits (ghost cards): the story the line cannot tell on its own.
 // Appended at the end so they render last within their era group; EVENTS_BN must stay index-aligned.
 {n:null,x:2019.6,era:3,year:"2009–24",tag:"human",tagLabel:"Human",title:"Two borrowers, two rulebooks",body:"This is the arithmetic ordinary Bangladeshis felt in their gut. A small trader who missed a few instalments could lose collateral, a shop, a home, to a money-loan court. Meanwhile the 2019 rules let a politically connected group owing thousands of crore reschedule with a two-percent down payment and keep borrowing. Neither the fraud nor the favours ever showed up as a single line on the chart; the gap between those two experiences is where the bad-loan pile quietly grew."},
 {n:null,x:2025.9,era:4,year:"2025",tag:"human",tagLabel:"Human",title:"Every bad loan was once someone's savings",body:"A non-performing loan is not abstract money. It began as a deposit, a garment worker's savings, a retiree's pension, a remittance wired home from the Gulf. When Tk 10.87 lakh crore of credit turns distressed, the loss does not vanish; it lands on depositors, on the taxpayers who recapitalise state banks, and on every citizen who pays more for a weaker taka. That is the real ledger of trust the title points to."}
];
// Vertical label offsets for the annotation discs (presentation only, not data).
const DISC_POS = {
  1:{dy:-26},2:{dy:-26},3:{dy:-26},4:{dy:-26},5:{dy:-26},
  6:{dy:-26},7:{dy:-26},8:{dy:26},9:{dy:26},10:{dy:-26},
  11:{dy:26},12:{dy:-26},13:{dy:-26},14:{dy:26},15:{dy:26},
  16:{dy:-26},17:{dy:-30},18:{dy:30},19:{dy:-26},20:{dy:30}
};
// Late-2025 cross-country gross NPL ratios (percent of total loans).
// Source: national regulators as compiled by the ADB NPL Watch and press analyses.
const SNAP = [
  {c:"Bangladesh",v:35.7,note:"Sep 2025",bd:true},
  {c:"Lebanon",v:23.8,note:"crisis-era estimate, unverified"},
  {c:"Tunisia",v:14.7,note:"political and fiscal turmoil"},
  {c:"Sri Lanka",v:12.6,note:"post-default recovery"},
  {c:"Pakistan",v:7.4,note:"after IMF stabilisation"},
  {c:"Nepal",v:4.4,note:""},
  {c:"India",v:2.3,note:"20-year low"}
];
// Asian bank average NPL ratio (percent).
// Source: Asian Development Bank (ADB).
const ASIA_AVG = 1.6;
// Comparator-country NPL trajectories, selected anchor years, common 0-50% scale.
// Source: RBI (India), Bank Indonesia/OJK (Indonesia), CBSL (Sri Lanka), SBP (Pakistan),
// NRB (Nepal), and the World Bank NPL indicator. Values between anchors are linearly connected;
// definitions vary across regimes, so read for shape rather than decimal precision.
const COMP = [
 {name:"India",now:"2.3%",story:"RBI · gross NPA, scheduled commercial banks",
  pts:[[1998,14.4],[2003,8.8],[2008,2.3],[2011,2.4],[2015,4.6],[2018,11.2],[2020,8.2],[2023,3.9],[2025,2.3]],
  note:{x:2018,y:11.2,t:"2015 AQR + IBC"},
  take:"A forced Asset Quality Review in 2015 surfaced hidden stress; the 2016 bankruptcy code and recapitalisation then drove the ratio from an 11.2 percent peak to a 20-year low in seven years."},
 {name:"Indonesia",now:"2.2%",story:"Bank Indonesia / OJK · post-1998 series",
  pts:[[1998,48.6],[2000,34.4],[2003,6.8],[2005,6.3],[2013,1.6],[2020,2.8],[2022,2.2]],
  note:{x:1998,y:48.6,t:"1998 crisis"},
  take:"The Asian crisis pushed nearly half of all loans into default, worse than Bangladesh's 1999 peak. A dedicated asset management company (IBRA) carved bad assets out of banks, and the ratio never returned to double digits."},
 {name:"Sri Lanka",now:"12.6%",story:"CBSL · gross NPL, licensed banks",
  pts:[[1998,16.6],[2002,15.3],[2010,5.4],[2014,4.2],[2018,3.4],[2021,4.5],[2022,10.9],[2023,12.8],[2025,12.6]],
  note:{x:2022,y:10.9,t:"2022 default"},
  take:"Even a sovereign default and the region's deepest crisis since independence produced an NPL ratio only about a third of Bangladesh's 2025 peak, and its banks stayed capitalised above 19 percent CRAR."},
 {name:"Pakistan",now:"7.4%",story:"SBP · gross NPL, all banks",
  pts:[[1999,25.9],[2005,8.3],[2008,10.5],[2011,16.2],[2015,11.4],[2019,8.6],[2022,7.3],[2025,7.4]],
  note:{x:2011,y:16.2,t:"2011 cycle peak"},
  take:"A chronic double-digit problem through two decades of political and macro instability, yet contained: recognition stayed honest, and the ratio has held below 10 percent since 2019 with capital above 20 percent."},
 {name:"Nepal",now:"4.4%",story:"NRB · gross NPL, commercial banks",
  pts:[[2002,30.4],[2007,9.6],[2012,2.6],[2019,1.8],[2023,3.0],[2025,4.4]],
  note:{x:2002,y:30.4,t:"early-2000s cleanup"},
  take:"A small neighbour that faced a Bangladesh-scale problem in the early 2000s, with nearly a third of loans bad, and resolved it within a decade through foreign management contracts at the two largest state banks."}
];

// Per-event "check the source" links, keyed by the event's English title.
// Rendered as an open-in-new-tab link on the matching ledger card.
// Source: official pages (Bangladesh Bank, IMF, World Bank) and Wikipedia summaries, verified July 2026.
const EVENT_SOURCES = {
  "Asian financial crisis sweeps the region":            {url:"https://en.wikipedia.org/wiki/1997_Asian_financial_crisis", name:"Wikipedia"},
  "The flood of the century":                            {url:"https://en.wikipedia.org/wiki/1998_Bangladesh_flood", name:"Wikipedia"},
  "The all-time peak: 41.1 percent":                     {url:"https://data.worldbank.org/indicator/FB.AST.NPER.ZS?locations=BD", name:"World Bank"},
  "Global financial crisis, limited local burn":         {url:"https://en.wikipedia.org/wiki/2007%E2%80%932008_financial_crisis", name:"Wikipedia"},
  "Awami League returns to office":                      {url:"https://en.wikipedia.org/wiki/2008_Bangladeshi_general_election", name:"Wikipedia"},
  "The Dhaka stock market boom and crash":               {url:"https://en.wikipedia.org/wiki/2011_Bangladesh_share_market_scam", name:"Wikipedia"},
  "The series low: 6.1 percent":                         {url:"https://data.worldbank.org/indicator/FB.AST.NPER.ZS?locations=BD", name:"World Bank"},
  "Hall-Mark, and the rules catch up":                   {url:"https://en.wikipedia.org/wiki/Hallmark-Sonali_Bank_Loan_Scam", name:"Wikipedia"},
  "BASIC Bank unravels; nine new licences":              {url:"https://en.wikipedia.org/wiki/BASIC_Bank_Limited", name:"Wikipedia"},
  "The central bank cyber heist":                        {url:"https://en.wikipedia.org/wiki/Bangladesh_Bank_robbery", name:"Wikipedia"},
  "Ownership change at the largest private bank":        {url:"https://en.wikipedia.org/wiki/Islami_Bank_Bangladesh", name:"Wikipedia"},
  "The two-percent rescheduling window; the IMF dissents":{url:"https://www.imf.org/en/Countries/BGD", name:"IMF"},
  "Pandemic moratorium freezes the picture":             {url:"https://www.bb.org.bd/en/index.php/publication/publictn/0/37", name:"Bangladesh Bank"},
  "Forex crisis and the turn to the IMF":                {url:"https://www.imf.org/en/Countries/BGD", name:"IMF"},
  "The 4.7 billion dollar programme and an NPL roadmap": {url:"https://www.imf.org/en/news/articles/2023/01/30/pr2325-bangladesh-imf-executive-board-approves-usd-ecf-eff-and-usd-under-rsf", name:"IMF"},
  "The July Uprising and a change of government":         {url:"https://en.wikipedia.org/wiki/July_Uprising", name:"Wikipedia"},
  "The 90-day standard returns; the mountain becomes visible":{url:"https://www.bb.org.bd/en/index.php/publication/publictn/0/37", name:"Bangladesh Bank"},
  "Highest reported ratio in the world":                 {url:"https://data.worldbank.org/indicator/FB.AST.NPER.ZS?locations=BD", name:"World Bank"},
  "Rescheduling relief trims the headline; capital turns negative":{url:"https://www.bb.org.bd/en/index.php/publication/publictn/0/37", name:"Bangladesh Bank"}
};

// Curated "Sources & further reading" list, grouped by category.
// Each entry carries English + Bangla labels; the category keys resolve via i18n.
// Source: verified landing pages, July 2026. All open in a new tab.
const REFERENCES = [
  {cat:"data", url:"https://www.bb.org.bd/en/index.php/publication/publictn/0/37", en:"Bangladesh Bank, Financial Stability Reports", bn:"বাংলাদেশ ব্যাংক, আর্থিক স্থিতিশীলতা প্রতিবেদন"},
  {cat:"data", url:"https://www.bb.org.bd", en:"Bangladesh Bank, home & statistics", bn:"বাংলাদেশ ব্যাংক, মূল সাইট ও পরিসংখ্যান"},
  {cat:"data", url:"https://data.worldbank.org/indicator/FB.AST.NPER.ZS?locations=BD", en:"World Bank, NPL ratio, Bangladesh series", bn:"বিশ্বব্যাংক, খেলাপি ঋণের হার, বাংলাদেশ সারি"},
  {cat:"data", url:"https://www.imf.org/en/Countries/BGD", en:"IMF, Bangladesh country page & Article IV", bn:"আইএমএফ, বাংলাদেশ কান্ট্রি পেজ ও আর্টিকেল IV"},
  {cat:"data", url:"https://www.adb.org/countries/bangladesh/main", en:"ADB, Bangladesh & Asia NPL context", bn:"এডিবি, বাংলাদেশ ও এশিয়ার খেলাপি ঋণ প্রেক্ষাপট"},
  {cat:"events", url:"https://en.wikipedia.org/wiki/1997_Asian_financial_crisis", en:"1997 Asian financial crisis", bn:"১৯৯৭ এশীয় আর্থিক সংকট"},
  {cat:"events", url:"https://en.wikipedia.org/wiki/2011_Bangladesh_share_market_scam", en:"2011 Bangladesh share-market scam", bn:"২০১১ বাংলাদেশ শেয়ারবাজার কেলেঙ্কারি"},
  {cat:"events", url:"https://en.wikipedia.org/wiki/Hallmark-Sonali_Bank_Loan_Scam", en:"Hall-Mark–Sonali Bank loan scam", bn:"হল-মার্ক–সোনালী ব্যাংক ঋণ কেলেঙ্কারি"},
  {cat:"events", url:"https://en.wikipedia.org/wiki/BASIC_Bank_Limited", en:"BASIC Bank and its loan scandal", bn:"বেসিক ব্যাংক ও এর ঋণ কেলেঙ্কারি"},
  {cat:"events", url:"https://en.wikipedia.org/wiki/Bangladesh_Bank_robbery", en:"Bangladesh Bank cyber heist, 2016", bn:"বাংলাদেশ ব্যাংক সাইবার চুরি, ২০১৬"},
  {cat:"events", url:"https://www.imf.org/en/news/articles/2023/01/30/pr2325-bangladesh-imf-executive-board-approves-usd-ecf-eff-and-usd-under-rsf", en:"IMF approves the $4.7bn programme, 2023", bn:"আইএমএফের ৪৭০ কোটি ডলার কর্মসূচি অনুমোদন, ২০২৩"},
  {cat:"events", url:"https://en.wikipedia.org/wiki/July_Uprising", en:"The July Uprising, 2024", bn:"জুলাই অভ্যুত্থান, ২০২৪"},
  {cat:"regulators", url:"https://www.rbi.org.in", en:"Reserve Bank of India (RBI)", bn:"রিজার্ভ ব্যাংক অব ইন্ডিয়া (RBI)"},
  {cat:"regulators", url:"https://www.sbp.org.pk", en:"State Bank of Pakistan (SBP)", bn:"স্টেট ব্যাংক অব পাকিস্তান (SBP)"},
  {cat:"regulators", url:"https://www.cbsl.gov.lk", en:"Central Bank of Sri Lanka (CBSL)", bn:"সেন্ট্রাল ব্যাংক অব শ্রীলঙ্কা (CBSL)"},
  {cat:"regulators", url:"https://www.nrb.org.np", en:"Nepal Rastra Bank (NRB)", bn:"নেপাল রাষ্ট্র ব্যাংক (NRB)"},
  {cat:"regulators", url:"https://www.ojk.go.id", en:"Financial Services Authority, Indonesia (OJK)", bn:"ফিন্যান্সিয়াল সার্ভিসেস অথরিটি, ইন্দোনেশিয়া (OJK)"},
  // Peoples-edition sources: danger-map cross-country CRAR/NPL and the White Paper receipts.
  {cat:"peoples", url:"https://www.sbp.org.pk/FSR/index.html", en:"State Bank of Pakistan, Financial Stability / H1CY25 Mid-Year Review", bn:"স্টেট ব্যাংক অব পাকিস্তান, আর্থিক স্থিতিশীলতা ও H1CY25 মধ্যবর্ষ পর্যালোচনা"},
  {cat:"peoples", url:"https://www.cbsl.gov.lk/en/publications/economic-and-financial-reports/financial-stability-review", en:"Central Bank of Sri Lanka, Financial Stability Review 2025", bn:"সেন্ট্রাল ব্যাংক অব শ্রীলঙ্কা, ফিন্যান্সিয়াল স্ট্যাবিলিটি রিভিউ ২০২৫"},
  {cat:"peoples", url:"https://www.ojk.go.id/en/berita-dan-kegiatan/siaran-pers/Default.aspx", en:"OJK Indonesia, Board of Commissioners press release (Sep 2025)", bn:"OJK ইন্দোনেশিয়া, কমিশনার্স বোর্ডের প্রেস বিজ্ঞপ্তি (সেপ্টেম্বর ২০২৫)"},
  {cat:"peoples", url:"https://www.imf.org/en/Countries/VNM", en:"IMF, Vietnam Article IV 2025", bn:"আইএমএফ, ভিয়েতনাম আর্টিকেল IV ২০২৫"},
  {cat:"peoples", url:"https://www.imf.org/en/Countries/NPL", en:"IMF, Nepal ECF 6th Review (Apr 2025)", bn:"আইএমএফ, নেপাল ECF ষষ্ঠ পর্যালোচনা (এপ্রিল ২০২৫)"},
  {cat:"peoples", url:"https://www.nrb.org.np", en:"Nepal Rastra Bank, provisional financial indicators (mid-Aug 2025)", bn:"নেপাল রাষ্ট্র ব্যাংক, প্রাথমিক আর্থিক সূচক (মধ্য-আগস্ট ২০২৫)"},
  {cat:"peoples", url:"https://www.bsp.gov.ph", en:"Bangko Sentral ng Pilipinas, banking indicators (via Philippine News Agency)", bn:"ব্যাংকো সেন্ট্রাল এনগ পিলিপিনাস, ব্যাংকিং সূচক (ফিলিপাইন নিউজ এজেন্সির মাধ্যমে)"},
  {cat:"peoples", url:"https://www.thedailystar.net", en:"White Paper on the Bangladesh economy (Dec 2024): The Daily Star coverage", bn:"বাংলাদেশ অর্থনীতির শ্বেতপত্র (ডিসেম্বর ২০২৪): দ্য ডেইলি স্টার প্রতিবেদন"},
  {cat:"peoples", url:"https://www.tbsnews.net", en:"White Paper committee findings: The Business Standard coverage", bn:"শ্বেতপত্র কমিটির ফলাফল: দ্য বিজনেস স্ট্যান্ডার্ড প্রতিবেদন"},
  {cat:"peoples", url:"https://bank.gov.ua/en/stability/npl", en:"National Bank of Ukraine, loan portfolio quality (NPLs)", bn:"ন্যাশনাল ব্যাংক অব ইউক্রেন, ঋণ-মান (খেলাপি ঋণ)"},
  {cat:"peoples", url:"https://www.bct.gov.tn/", en:"Central Bank of Tunisia, banking indicators", bn:"সেন্ট্রাল ব্যাংক অব তিউনিসিয়া, ব্যাংকিং সূচক"}
];
