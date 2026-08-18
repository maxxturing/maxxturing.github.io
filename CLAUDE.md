# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

Personal site for Maxx Turing — Jekyll on GitHub Pages, custom domain
`maxxturing.com`. Almost everything lives in `index.html` (markup + inline JS)
and `site.css`. See `README.md` for local preview setup.

The timeline (`/timeline/`) is the exception: `timeline/index.html` is
self-contained, with its own inline `<style>` block and its own inline JS. The
entries live in a `DATA` array of objects (`d`/`y` date, `cat` array, `st`/`sb`
collapsed title+summary, `t`/`b` expanded title+HTML), and the categories live
in a `CATS` map above it. No icon font is loaded anywhere on the site — the
badges and labels are Unicode glyphs.

## TODO

- [ ] **Update the labels in the Beyond work section.** These are the
  `.gal-badge` buttons on the gallery figures in `index.html` (the
  `<section id="beyond">` block, roughly lines 357–364). Current labels:
  - `▶ video` — used on six figures (skydive, Cape Town, Camps Bay, Savute,
    St Anton, snowboarding)
  - `📷 the shot →` — the Okavango wildlife figure
  - `🔍 look closer` — the lizard macro figure

  When changing them, keep these in sync:
  - the button's visible text **and** its `aria-label` (the pattern is
    `"<label> — <data-subject>"`, and the badge text is its accessible name);
  - the inline JS around `index.html:470–478`, which swaps `badge.textContent`
    and rewrites `aria-label` to report playback/sound state — those replacement
    strings need to match the new wording.

- [ ] **Add newer material to the Beyond work section** — e.g. from Australia.
  The eight figures in `<section id="beyond">` are all older trips (Algarve,
  Cape Town, Botswana, the Alps). To add one, copy an existing `<figure>` and
  keep its anatomy intact:
  - `class="duo reveal g-<letter>"` plus a behaviour class (`has-video`,
    `has-shot`, `has-seq`, `has-macro`) — the behaviour class is what the inline
    JS hooks; `.gal` is a flex-wrap row, so the `g-*` letter only matters for
    the grid overrides around `site.css:580`;
  - `style="--ar:<aspect ratio>"`, optionally `--vpos` to shift the video crop;
  - a poster `<img>` with real `alt`, plus the `<video muted loop playsinline
    preload="none" aria-hidden="true" tabindex="-1">` for video figures;
  - the `.gal-badge` button with `data-subject` and a matching `aria-label` (see
    the label TODO below), and a `<figcaption>` — two `<span class="cap-a">` /
    `cap-b` captions if the figure reveals a second image.

  Media goes in `assets/img/` and `assets/video/`. Note that several earlier
  commits deleted ~290 MB of unreferenced media, so keep new files referenced
  and reasonably compressed.

- [ ] **Font Awesome icons on the timeline.** Replace the Unicode glyphs on
  `/timeline/` with a proper icon set. Nothing is loaded today, so this means
  adding Font Awesome (self-hosted in `assets/` rather than a CDN — the rest of
  the site ships zero third-party requests) and then swapping the glyph
  characters in `timeline/index.html`: the carousel arrows `‹`/`›`, the rebrand
  arrow `⟶`, the `↓` in `.tl-hint`, and the category swatches if those should
  become icons too. Keep the `aria-label`s on the arrow buttons; give any
  decorative icon `aria-hidden="true"`.

- [ ] **Review the timeline categories, filtering and colours.** All three live
  near the top of `timeline/index.html`'s inline JS:
  - `CATS` (~line 331) defines the four categories and their colours:
    `venture` `#FF8A33`, `politics` `#E6B33E`, `learning` `#E0743A`,
    `life` `#E0B57A`. `learning` and `venture` are close enough to be hard to
    tell apart in an 8px swatch, and `life` reads as washed-out next to the
    others — worth re-picking the ramp.
  - The filter pills are built from `CATS` (~line 437–456), so adding or
    renaming a category flows through automatically, including the per-category
    counts. One caveat: the filter is single-select and has no "clear"
    beyond the `All` pill, and filtering only toggles `.is-hidden` — consider
    whether multi-select is wanted.
  - Each entry's `cat` array drives both `data-cats` (used by the filter) and
    the `.tl-cat` tag row; the first category in the array also picks the
    entry's accent (`CATS[cats[0]]`, ~line 389), so category *order* within an
    entry is meaningful, not just membership. Re-check which entries are
    multi-category and whether the leading one is the right accent.

- [ ] **Put "The Long Game" on the same line.** In the timeline lead
  (`timeline/index.html:267–270`) the sentence `I'm playing The Long Game.` is
  separated from the preceding copy by blank lines in the source. HTML collapses
  those to a single space, so it already renders in the same paragraph but wraps
  awkwardly. Tidy the source onto one line and stop the link phrase breaking
  mid-name (e.g. `white-space:nowrap` on the anchor, or a non-breaking space).
