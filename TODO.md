# TODO

Open work on the site. Each item says where it lives and what you need to know
to start, so none of it needs rediscovering. Not published — see `NOPUBLISH` in
`tools/build-site.py`.

Last reviewed 4 September 2026. Four items are done and have been removed: the
timeline lead and hint copy, the duplicated contact-form and nav JS (now one
copy in `/site.js`), and the unreferenced-media sweep. The rest are renumbered
each time, so a stale "item N" reference elsewhere is a bug.

---

## Do not delete these

Two files are referenced by nothing in this repo and both are load-bearing.
Every unreferenced-file scan will offer them up; keep both.

- **`avatar-256px.png`** (repo root) — the portrait in Maxx's old Gmail
  signature. The signature has been replaced, but **every email already sent
  still points at this exact URL** and those cannot be updated. It can never be
  renamed, nor tidied into `assets/`, however odd it looks at the root — the
  untidiness is why `assets/`-only scans kept missing it.
- **`assets/img/logo-maxxturing.svg`** — the only vector copy of the wordmark.
  Every favicon and app icon is a rasterised PNG/ICO, so this is the source
  they are regenerated from.

The media sweep that used to be item 1 here is done: 28 files and 48 MB became
one file, and that one is `avatar-256px.png` above. Twelve of the 28 turned out
to be missing references rather than dead weight. Published site: 150 MB → 104 MB.

The four `assets/img/sig-*.png` social icons briefly lived here too, for a
hand-built signature that lost out to a HubSpot-generated one. They have been
deleted. If a future signature wants self-hosted icons, they are in history at
`5a50833`.

---

## 1. Update the labels in the Beyond work section

The `.gal-badge` buttons on the gallery figures in `index.html`
(`<section id="beyond">`, the eight `<figure class="duo reveal …">` rows).
Current labels:

- `▶ video` — six figures (skydive, Cape Town, Camps Bay, Savute, St Anton,
  snowboarding)
- `📷 the shot →` — the Okavango wildlife figure
- `🔍 look closer` — the lizard macro figure

Keep these in sync when changing them:

- the button's visible text **and** its `aria-label` (pattern is
  `"<label> — <data-subject>"`; the badge text is its accessible name);
- the inline JS that swaps `badge.textContent` and rewrites `aria-label` to
  report playback and sound state — search `soundLabel` and `label('▶ video')`.
  Those replacement strings must match the new wording or the button will
  announce something the eye never sees.

## 2. Add newer material to the Beyond work section

The eight figures are all older trips (Algarve, Cape Town, Botswana, the Alps).
Australia is the obvious gap. To add one, copy an existing `<figure>` and keep
its anatomy intact:

- `class="duo reveal g-<letter>"` plus a behaviour class (`has-video`,
  `has-shot`, `has-seq`, `has-macro`) — the behaviour class is what the inline
  JS hooks. `.gal` is a flex-wrap row, so the `g-*` letter only matters for the
  grid overrides around `site.css:580`.
- `style="--ar:<aspect ratio>"`, optionally `--vpos` to shift the video crop.
- a poster `<img>` with real `alt`, plus, for video figures,
  `<video muted loop playsinline preload="none" aria-hidden="true" tabindex="-1">`.
- the `.gal-badge` button with `data-subject` and a matching `aria-label`
  (see item 1), and a `<figcaption>` — two `<span class="cap-a">` / `cap-b`
  captions if the figure reveals a second image.

Media goes in `assets/img/` and `assets/video/`. Keep new files referenced and
reasonably compressed; several earlier commits deleted ~290 MB of orphans.

## 3. Font Awesome icons on the timeline

No icon font is loaded anywhere on the site today — every badge and label is a
Unicode glyph. Doing this means adding Font Awesome **self-hosted in
`assets/`**, not from a CDN: the site currently ships zero third-party requests
and that is worth keeping.

Glyphs to swap in `timeline/index.html`:

- the carousel arrows `‹` / `›` — keep the `aria-label`s on those buttons
- the rebrand arrow `⟶` (2 occurrences)
- the `↓` in `.tl-hint` (`:286`)
- the category swatches, if those should become icons

Note the disclosure chevron is **no longer** a bare glyph: it is
`<span class="tl-chev" aria-hidden="true">+</span>` inside the header button,
and `.tl-card.open .tl-chev` rotates it 135°. If it becomes an icon, keep it
`aria-hidden` — the button's accessible name must stay the entry title alone.
Give any decorative icon `aria-hidden="true"`.

## 4. Review the timeline categories, filtering and colours

All three live near the top of `timeline/index.html`'s inline JS.

- **`CATS`** defines four categories and their colours: `venture` `#FF8A33`,
  `politics` `#E6B33E`, `learning` `#E0743A`, `life` `#E0B57A`. `learning` and
  `venture` are close enough to be hard to tell apart in an 8px swatch, and
  `life` reads washed-out beside the others. Worth re-picking the ramp.
- **The filter pills** are built from `CATS`, so adding or renaming a category
  flows through automatically, counts included. Caveat: the filter is
  single-select with no "clear" beyond the `All` pill, and filtering only
  toggles `.is-hidden`. Consider whether multi-select is wanted.
- **Category order matters.** Each entry's `cat` array drives both `data-cats`
  (the filter) and the `.tl-cat` tag row, and the *first* entry in the array
  picks the accent via `CATS[cats[0]]`. Re-check which entries are
  multi-category and whether the leading one is the right accent.

## 5. Verify whether the missing image dimensions actually cost anything

Only `index.html` is left: **2 of 71** `<img>` elements carry
`width`/`height`. `timeline/index.html` is now **71 of 71** — the eleven
figures added on 4 September all carry dimensions, which finished off what was
already 27 of 60. Missing intrinsic dimensions normally means layout shift.

It may not matter on `index.html` either: the galleries and rotators get their
box from CSS `aspect-ratio` (`.sp-stage` is `3/2`, `.comm-grid .duo` is `4/3`,
the `.gal` figures use a per-figure `--ar`), so those reserve space before the
image loads. What is not obviously covered is the hero and the one-off inline
shots.

Measure it before fixing it — check CLS in a real browser rather than adding
69 attributes on principle. If the timeline now measures clean and the
homepage does not, that is the answer.

## 6. Not in this repo: `x.votemaxx.com` has no valid certificate

The timeline no longer links to it, but the subdomain still resolves to
Squarespace and still throws a full-page TLS warning to anyone who reaches it
from an old tweet, a printed leaflet or a bookmark:
`no alternative certificate subject name matches target host name`.

Your other `votemaxx.com` subdomains (`islington.`, `bunhill-2021.`,
`facebook.`, `instagram.`, `stmstj.`) are all fine, so this looks like one that
was missed in the Squarespace domain settings rather than a deliberate
retirement. Either add it there so a cert is issued, or drop the DNS record.

## 7. Do a real browser pass on the accessibility work

The timeline disclosure buttons and the mobile menu were verified in jsdom,
which confirms structure and behaviour but is not a browser. It cannot tell you
whether the focus ring actually looks right, whether the collapse animation
still feels smooth with `visibility` delayed behind it, or how a real screen
reader announces things.

Worth ten minutes: tab through `/timeline/`, open and close a few entries with
the keyboard, and check the menu's Escape-and-return-focus on a phone.
