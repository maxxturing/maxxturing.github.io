# TODO

Open work on the site. Each item says where it lives and what you need to know
to start, so none of it needs rediscovering. Not published — see `NOPUBLISH` in
`tools/build-site.py`.

Last reviewed **5 September 2026** against `dff4bcd`, which is live. Every
file path, line number, colour and count below was re-checked against the tree
on that date, not carried over.

Down from eleven items to five. Removed as done: the timeline lead and hint
copy; the duplicated contact-form and nav JS (now one copy in `/site.js`); the
unreferenced-media sweep; and the image-dimensions question (answered — see the
gotcha in `CLAUDE.md`, which also says not to "fix" it). Removed as won't-do:
`x.votemaxx.com`'s certificate, Squarespace-side and not worth chasing, since
the site links straight to <https://x.com/VoteMaxx>.

Items are renumbered every time something is removed, so a stale "item N"
reference anywhere is a bug. The only two in this file point at items 1 and 2
and are correct as of this review.

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

The `.gal-badge` buttons on the gallery figures in `index.html` — the section
is `<section class="section" id="beyond">` at `:351`, and the eight
`<figure class="duo reveal g-…">` rows run `:358`–`:365`.
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
  one grid override that uses it, `.gal .g-a,.gal .g-f{grid-row:auto;}` at
  `site.css:586`, inside the mobile media query.
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

- the carousel arrows `‹` / `›` — three carousels, so six buttons. Keep the
  `aria-label`s ("Previous" / "Next") on them
- the rebrand arrow `⟶` (2 occurrences)
- the `↓` in `.tl-hint` (`:287`)
- the category swatches, if those should become icons

Note the disclosure chevron is **no longer** a bare glyph: it is
`<span class="tl-chev" aria-hidden="true">+</span>` inside the header button,
and `.tl-card.open .tl-chev` rotates it 135°. If it becomes an icon, keep it
`aria-hidden` — the button's accessible name must stay the entry title alone.
Give any decorative icon `aria-hidden="true"`.

## 4. Review the timeline categories, filtering and colours

All three live near the top of `timeline/index.html`'s inline JS.

- **`CATS`** defines four categories and their colours, and the problem is
  measurable rather than a matter of taste. Perceptual distance (CIE76 dE,
  where under about 15 reads as "the same colour" at swatch size):

  | pair | dE |
  |---|---|
  | `venture` `#FF8A33` vs `learning` `#E0743A` | **15.8** |
  | `politics` `#E6B33E` vs `life` `#E0B57A` | 27.8 |
  | every other pair | 32–41 |

  So `venture` and `learning` are the collision, at roughly half the separation
  of the next-closest pair. Contrast against the open card (`--panel2`
  `#241C13`) is fine everywhere and is not the issue: `venture` 7.15:1,
  `politics` 8.70:1, `learning` 5.38:1, `life` 8.84:1 — though `learning` is
  the weakest and `life` the palest, which is why `life` reads washed out.
  Re-pick the ramp so no pair sits under about 25 dE while all four stay above
  4.5:1 on the card.
- **The filter pills** are built from `CATS`, so adding or renaming a category
  flows through automatically, counts included. Caveat: the filter is
  single-select with no "clear" beyond the `All` pill, and filtering only
  toggles `.is-hidden`. Consider whether multi-select is wanted.
- **Category order matters.** Each entry's `cat` array drives both `data-cats`
  (the filter) and the `.tl-cat` tag row, and the *first* entry in the array
  picks the accent via `CATS[cats[0]]`. Re-check which entries are
  multi-category and whether the leading one is the right accent.

## 5. Do a real browser pass on `/timeline/`

The most useful ten minutes available on this site, for two reasons.

**The behaviour is verified; the appearance is not.** The mobile menu and the
contact form were checked in jsdom against the live pages on 4 September —
32 assertions, both pages, covering the burger's `aria-expanded`, Escape
returning focus, link-click closing, and the form's success and failure paths.
jsdom confirms structure and behaviour and cannot tell you whether the focus
ring looks right, whether the collapse animation still feels smooth with
`visibility` delayed behind it, or how a screen reader actually announces an
entry. Tab through the timeline, open and close a few entries by keyboard, and
check Escape-and-return-focus on a phone.

**And a lot of unseen layout landed on 4–5 September.** Eleven company logos
were added to timeline entries and every judgement about how they sit was made
by reading CSS, not by looking. Static analysis was wrong three times that day —
on the icon canvas, on rendered sizes, and on an upscale sweep — so treat the
list below as unverified:

- **Logos in three-column rows.** Nine rows went from two columns to three when
  a logo was inserted, which narrowed every cell and made `object-fit:cover`
  crop the photographs harder. Only three photos carry an `object-position`:
  `tl-cbp1` (75%), `tl-cbp2` (38%), `tl-oxent2` (68%), all pre-existing, plus
  `tl-hp-portrait` (78%) which was fixed after the crop cut the subject to the
  edge. **The other ~15 are on default centre and have never been looked at.**
  Any with an off-centre subject will have the same fault.
- **Four logos render slightly upscaled** — `medopad-logo` 1.71×,
  `tl-fac-logo` 1.59×, `dwyl-logo` 1.29×, `tl-jws-crest` 1.28×. Those are upper
  bounds: `.pad` uses `object-fit:contain`, so the row height may bind before
  the width and the real figure may be lower. Flat-colour logos tolerate this
  far better than type-heavy artwork, so this may well be fine. Look before
  changing anything.
- **The MBA entry** puts the Quantic wordmark and the Smartly cohort sheet side
  by side in a `.tl-figrow.onethird` with `align-items:start`, and the sheet's
  box is capped at 680px with `object-fit:contain`. Check the sheet is still
  readable at that size and that the pair stacks properly under 600px.
- **Two bounded figures**: `tl-startbook.jpg` is cropped to 3:2 anchored bottom,
  and `tl-foundertribe.jpg` is capped at its native 720px and centred.
