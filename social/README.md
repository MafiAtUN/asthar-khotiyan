# Social share kit

Ready-to-post images and captions for **আস্থার খতিয়ান · The Ledger of Trust**.

## Files

- `share-kit.html` — the editable design source. Open it in a browser to see the
  OG cover and all seven carousel cards laid out. Edit the copy/colours here, then
  re-render (below).
- `../assets/og-cover.png` — 1200×630 link-preview image (referenced by the
  `og:image` / `twitter:image` meta tags). This is what shows in the card when the
  URL is shared on Facebook / LinkedIn / X.
- `ig-1.png … ig-7.png` — 1080×1080 Instagram / LinkedIn carousel, in order:
  1. Hook — 35.7%, highest on Earth
  2. What is a bad loan (plain terms)
  3. The 30-year arc (41 → 6 → 35.7)
  4. Higher than countries at war (bar comparison)
  5. How big is the hole (budget / Padma Bridges / per citizen)
  6. The airbag is gone (CRAR below zero)
  7. Every bad loan was once someone's savings + link

## Re-rendering after an edit

Images are captured from `share-kit.html` with Playwright at 2× (retina). From the
project root:

```bash
python3 -m http.server 8791 &                 # serve the folder
# then run a Playwright script that screenshots #og and .card[data-ig="1..7"]
# into ../assets/og-cover.png and ig-N.png at deviceScaleFactor:2
```

(The one-off render script used to generate these lives outside the repo; any headless
screenshot of the named elements at their fixed pixel sizes reproduces them.)

## Suggested captions

**Facebook (anger / scale angle)**
> Bangladesh's banks now hold the highest bad-loan ratio of ANY country on Earth —
> higher than Ukraine, higher than Lebanon, higher than nations at war.
>
> The pile of distressed credit is ~Tk 10.87 lakh crore. That's about 1.4× the entire
> national budget, or 36 Padma Bridges, or Tk 62,000 of bad credit for every man,
> woman and child in the country.
>
> And who pays to fix it? Your taxes. Here's the full 30-year story, in plain
> language (and full Bangla): 👇
> https://mafiatun.github.io/asthar-khotiyan/

**LinkedIn (professional / method angle)**
> The most honest thing a financial system can do is admit a loss.
>
> I spent time turning 30 years of Bangladesh Bank, IMF and World Bank data into a
> single scroll-driven story — one number, the non-performing-loan ratio, from a 41%
> peak in 1999, down to 6% through a genuine reform decade, and up to 35.7% in 2025:
> the highest reported anywhere on Earth.
>
> It's fully bilingual (English ⇄ বাংলা), every figure is sourced, and it closes on
> the one thing every recovery — India's, Indonesia's, Nepal's — started with:
> recognising the losses honestly.
>
> Read it here 👇 https://mafiatun.github.io/asthar-khotiyan/

**Instagram (carousel caption)**
> 35.7%. The highest bad-loan ratio of any country on Earth — higher than nations at
> war. Swipe for the 30-year story of how Bangladesh's banks got here, and what it
> means for your money. Full interactive version (English ⇄ বাংলা) at the link in
> bio. #Bangladesh #banking #NPL #economy #dataviz #আস্থার_খতিয়ান

_Tip: post the carousel with cards 1→7 in order; put the URL in your bio and end the
caption with "link in bio" since Instagram captions aren't clickable._
