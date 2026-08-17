# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

Personal site for Maxx Turing — Jekyll on GitHub Pages, custom domain
`maxxturing.com`. Almost everything lives in `index.html` (markup + inline JS)
and `site.css`. See `README.md` for local preview setup.

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
