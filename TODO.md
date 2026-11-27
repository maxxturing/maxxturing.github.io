# TODO

Open work on the site. Each item says where it lives and what you need to know
to start, so none of it needs rediscovering. Not published — see `NOPUBLISH` in
`tools/build-site.py`.

Last reviewed **5 September 2026** against the live site; items 1–3 below
have not been re-checked since. On **26 November 2026** the two Beyond work
items (labels, and newer material) were done and removed, and item 4 was added
from that work — its references are current as of that date.

Down from eleven items to four. Removed as done: the timeline lead and hint
copy; the duplicated contact-form and nav JS (now one copy in `/site.js`); the
unreferenced-media sweep; the image-dimensions question (answered — see the
gotcha in `CLAUDE.md`, which also says not to "fix" it); and both Beyond work
items — the badges now name the activity, captions give the place, and the
gallery gained a kangaroo tile. Removed as won't-do: `x.votemaxx.com`'s
certificate, Squarespace-side and not worth chasing, since the site links
straight to <https://x.com/VoteMaxx>.

Items are renumbered every time something is removed, so a stale "item N"
reference anywhere is a bug. There are none in this file as of 26 November.

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
deleted. If a future signature wants self-hosted icons, they are in the
private backup of the old history, at `5a50833`.

---

## 1. Font Awesome icons on the timeline

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

## 2. Review the timeline categories, filtering and colours

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

## 3. Do a real browser pass on `/timeline/`

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

## 4. Beyond work gallery: loose ends

The gallery was rebuilt on 25–26 November. It is now a fixed 3×3 of equal 4:3
tiles (`.gal` in `site.css`, rows sized from the gallery width via
`#beyond .wrap{container-type:inline-size}`), and hovering a tile grows it while
the others move — the script is "The gallery grows" in `index.html`'s inline JS.
A tile opens once the pointer rests on it for `HOVER` (500ms, shown by a hand
sweeping once round, `.gal-wait`, wiping the orange grade off the photo
behind it, `.gal-clear`; `--hover` on `.gal` in `site.css` must match; the tile then grows over
`MOVE`, 500ms, and a clip or a still's reveal starts once it has — `.rev-growing` marks a still's wait), grows in the same
move that folds the open one away, and stays open until
its X, Escape, another tile opening, or the pointer leaving the gallery; one
sound setting is shared by all the clips.
Shapes come from `data-grow` on the `<figure>`: none = 2×2, `tall` = 1×2 (the
portrait clips, St Anton and snowboarding), `letterbox` = 2×2 with the whole
16:9 frame shown, the bars filled by a blurred copy of the clip drawn on a
`.vid-amb` canvas (Signal Hill, Okavango). Read that
comment block before touching it: the grown tile is anchored on the cell under
the pointer (or, switching from an open tile or opening by keyboard, on its own
cell as it will be once the open one folds), and the tile that opens is pinned to its cell so its X folds it
back there (tiles reflow out of order around it until the pointer leaves the
gallery), or the grid thrashes.

Verified in Chrome on desktop and in a phone-width frame. Still open:

- **Never tested:** a real touch device for the three still tiles — kanga
  selfies (`.has-deal`), bush walk snaps (`.has-shot`) and scaly sidekick
  (`.has-macro`, whose loupe now opens only within `NEAR` of the lizard) — and
  any browser other than Chrome. The keyboard path was checked in Chrome on 26
  November with real key presses: Tab to a badge, Enter opens (a clip's second
  Enter toggles sound), Escape closes with focus left on the badge, and the X
  is one Shift+Tab back from the badge.
- **Built for exactly nine tiles.** A tenth needs a decision about where it
  sits; the `.gal` comment in `site.css` says the same.
- **Sync points.** The kangaroo prints land on shutter frames: `--d` on
  `.deal-print.p1`–`p4` in `site.css` must match `SHOT_AT` + n × `BURST` in the
  page script. The skydive clip carries `data-vol="0.35"` (wind roar) and
  `--hpos`/`--vzoom` to crop a title card's "VE" off its left edge — the
  lettering reaches 15.2% of the frame width.

