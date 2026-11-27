# TODO

Open work on the site. Each item says where it lives and what you need to know
to start, so none of it needs rediscovering. Not published — see `NOPUBLISH` in
`tools/build-site.py`.

Last brought up to date on **27 November 2026**, after the site review and the
timeline work that followed it. Items are renumbered every time something is
removed, so a stale "item N" reference anywhere is a bug.

Done and removed on 26–27 November: Font Awesome icons (every timeline entry
now has one, inlined as SVG — see item 1's note); the timeline category
colours; the group-photo pass (the DWYL photo was the one that mattered and is
fixed); the review PRs — self-hosted fonts, resized images and re-encoded
clips, canonical links, Person JSON-LD, a trimmed sitemap, a 404 page, skip
links, and the CV opening directly on phones; testimonials on the home page;
and the timeline's year markers, entry links (`/timeline/#slug`), maps that
load on click, sentence-case titles and the Startbook-era entries.

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

## 1. How the timeline is built now (read before editing it)

Not a task — notes that used to be spread across older items, kept so nobody
re-derives them.

- **Icons.** Each `DATA` entry names an icon with `ic:'briefcase'` etc. The
  paths live in `ICONS` near the top of the script: Font Awesome Free 6.5.2
  solid, inlined so no icon font loads. To add one, take the SVG from
  `@fortawesome/fontawesome-free@6.5.2/svgs/solid/<name>.svg` and add its
  `[viewBox width, path]`. The carousel arrows, the `⟶` rebrand arrow and the
  `↓` hint are still Unicode, deliberately.
- **Entry addresses** are `slug(e.st)`, the short title. Renaming an entry's
  `st` changes its URL and breaks any link already shared to it.
- **Third parties.** Google Analytics loads on every page (statistics only,
  with a footer opt-out — see item 3). Google Maps and YouTube load only when
  someone clicks; fonts are self-hosted.

## 2. Review the timeline categories and filtering

Both live near the top of `timeline/index.html`'s inline JS. (The colours
were re-picked on 27 November: closest pair now CIE76 dE 41, all at least 7:1
on the open card.)

- **The filter pills** are built from `CATS`, so adding or renaming a category
  flows through automatically, counts included. Caveat: the filter is
  single-select with no "clear" beyond the `All` pill, and filtering only
  toggles `.is-hidden`. Consider whether multi-select is wanted.
- **Category order matters.** Each entry's `cat` array drives both `data-cats`
  (the filter) and the `.tl-cat` tag row, and the *first* entry in the array
  picks the accent via `CATS[cats[0]]`. Re-check which entries are
  multi-category and whether the leading one is the right accent.

## 3. Open questions from the 26–27 November review

- **Analytics.** GA runs on every page; visitors can switch it off in the
  footer's "Cookie settings" dialog. If this ever changes, the alternatives
  are GA behind a consent banner (Consent Mode, denied by default) or a
  cookieless tool such as Umami.
- **NEF Pitch Days.** Maxx helped host every one until 2023; the details are in
  `maxx@centreforentrepreneurs.org`, which he no longer has. A timeline entry
  would need someone at CfE to supply dates and photos.
- **Tech for Good 2024 photos.** The timeline carousel shows the 2025 final;
  no 2024 photos were found in the Startbook Drive or on startbook.co.uk.
- **Timeline crops left alone:** `tl-ef`, `tl-nefcohort` and `tl-oxent` lose
  people at the edges, and `tl-kantan` crops the stand's logo. Maxx looked and
  is happy with them.
- **Not checked:** the timeline by keyboard and screen reader on a phone.

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

- **Never tested:** desktop Safari and Firefox. A real phone was checked by
  hand on 26 November and works, including the three still tiles — kanga
  selfies (`.has-deal`), bush walk snaps (`.has-shot`) and scaly sidekick
  (`.has-macro`, whose loupe opens only within `NEAR` of the lizard when a
  mouse steers it, and straight away on a tap). The keyboard path was checked in Chrome on 26
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

