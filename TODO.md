# TODO

Open work on the site. Each item says where it lives and what you need to know
to start, so none of it needs rediscovering. Not published — see `NOPUBLISH` in
`tools/build-site.py`.

Last reviewed 3 September 2026 against `23c0803`.

---

## 1. Decide what to cut from the unreferenced media

**28 files, 48.4 MB** that no page, stylesheet or config points at.
`london.mp4` alone is 41 MB of that.

Review them here, with thumbnails and a keep/cut toggle — it writes the
`git rm` command for whatever you pick:
<https://claude.ai/code/artifact/d2edb9b9-f332-4cae-9417-a3a622e03310>

Groups, so the decision is easier:

- `assets/img/london.mp4` — 41.5 MB, by far the biggest win
- **Your photos** (~6.1 MB) — `skiportrait`, `comm-group`, `seated-laptop`,
  `comm-nefplus`, `sp-award`, `comm-cvc`, `nyan`. Genuinely yours and usable;
  plausible material for a future gallery entry (see item 3).
- **Superseded logos** (~0.7 MB) — `medopad-logo`, `hacktrain-logo`,
  `dwyl-logo`, `udacity-logo`, `oxford-entrepreneurs-logo` and friends. The
  timeline uses `tl-`-prefixed versions of these now.
- `assets/img/meta-cover.png` — only ever referenced by `author-img:` in
  `_config.yml`, which went with Jekyll. The real social image is
  `og-cover.jpg`.
- `avatar-256px.png` — note this one sits at the **repo root**, not under
  `assets/`. Any scan that only walks `assets/` will miss it.

Two things to know before running anything:

- Deleting stops these being **served** and shrinks a fresh checkout
  (150 MB → ~102 MB). It does **not** shrink the repo: they stay in git
  history, so `.git` keeps its ~694 MB. Reclaiming that means a history
  rewrite — a separate, more disruptive job, not to be done casually to a
  live repo.
- `assets/img/logo-maxxturing.svg` will show up in any unreferenced scan and
  must **not** be deleted. It is the only vector copy of the wordmark; every
  favicon and app icon is a rasterised PNG/ICO. README says the same.

## 2. Update the labels in the Beyond work section

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

## 3. Add newer material to the Beyond work section

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
  (see item 2), and a `<figcaption>` — two `<span class="cap-a">` / `cap-b`
  captions if the figure reveals a second image.

Media goes in `assets/img/` and `assets/video/`. Keep new files referenced and
reasonably compressed; several earlier commits deleted ~290 MB of orphans.

## 4. Font Awesome icons on the timeline

No icon font is loaded anywhere on the site today — every badge and label is a
Unicode glyph. Doing this means adding Font Awesome **self-hosted in
`assets/`**, not from a CDN: the site currently ships zero third-party requests
and that is worth keeping.

Glyphs to swap in `timeline/index.html`:

- the carousel arrows `‹` / `›` — keep the `aria-label`s on those buttons
- the rebrand arrow `⟶` (2 occurrences)
- the `↓` in `.tl-hint` (`:288`)
- the category swatches, if those should become icons

Note the disclosure chevron is **no longer** a bare glyph: it is
`<span class="tl-chev" aria-hidden="true">+</span>` inside the header button,
and `.tl-card.open .tl-chev` rotates it 135°. If it becomes an icon, keep it
`aria-hidden` — the button's accessible name must stay the entry title alone.
Give any decorative icon `aria-hidden="true"`.

## 5. Review the timeline categories, filtering and colours

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

## 6. Put "The Long Game" on the same line

In the timeline lead the sentence `I'm playing The Long Game.` is separated
from the preceding copy by blank lines in the source. HTML collapses them to a
single space, so it already renders in the same paragraph but wraps awkwardly.
Tidy the source onto one line and stop the link phrase breaking mid-name —
`white-space:nowrap` on the anchor, or a non-breaking space.

## 7. The timeline hint copy is now slightly wrong

`timeline/index.html:288` reads *"Tap any moment to expand the full story ↓"*.
That was true when the whole card was clickable. It is not any more: only the
header button expands an entry, deliberately, so that selecting text in an open
entry no longer collapses it. Reword — and it is now worth saying the keyboard
works, since it did not before.

## 8. The contact-form and nav JS is duplicated and unsynced

`_partials/` keeps the **markup** of the contact section and the analytics tag
in step across pages, and `tools/sync-partials.py --check` fails the build if a
page drifts. The **JavaScript** for those same features is not covered: the
contact-form handler and the mobile-menu handler are each copy-pasted into both
`index.html` and `timeline/index.html`, outside any `@partial:` region.

They are byte-identical today (bar indentation) because both copies were edited
together, but nothing enforces it. Either extend the partial mechanism to cover
a script block, or move the shared JS into a real `.js` file both pages load.

## 9. Verify whether the missing image dimensions actually cost anything

`index.html` has 68 `<img>` elements and only **one** carries `width`/`height`.
`timeline/index.html` is better at 27 of 60. Missing intrinsic dimensions
normally means layout shift.

It may not matter here: the galleries and rotators get their box from CSS
`aspect-ratio` (`.sp-stage` is `3/2`, `.comm-grid .duo` is `4/3`, the `.gal`
figures use a per-figure `--ar`), so those reserve space before the image
loads. What is not obviously covered is the hero and the one-off inline shots.

Measure it before fixing it — check CLS in a real browser rather than adding
136 attributes on principle.

## 10. Not in this repo: `x.votemaxx.com` has no valid certificate

The timeline no longer links to it, but the subdomain still resolves to
Squarespace and still throws a full-page TLS warning to anyone who reaches it
from an old tweet, a printed leaflet or a bookmark:
`no alternative certificate subject name matches target host name`.

Your other `votemaxx.com` subdomains (`islington.`, `bunhill-2021.`,
`facebook.`, `instagram.`, `stmstj.`) are all fine, so this looks like one that
was missed in the Squarespace domain settings rather than a deliberate
retirement. Either add it there so a cert is issued, or drop the DNS record.

## 11. Do a real browser pass on the accessibility work

The timeline disclosure buttons and the mobile menu were verified in jsdom,
which confirms structure and behaviour but is not a browser. It cannot tell you
whether the focus ring actually looks right, whether the collapse animation
still feels smooth with `visibility` delayed behind it, or how a real screen
reader announces things.

Worth ten minutes: tab through `/timeline/`, open and close a few entries with
the keyboard, and check the menu's Escape-and-return-focus on a phone.
