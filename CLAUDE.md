# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

Personal site for Maxx Turing — hand-written static HTML on GitHub Pages, custom
domain `maxxturing.com`. There is no site generator: `tools/build-site.py` copies
the publishable files and writes `sitemap.xml`, and `.github/workflows/deploy.yml`
runs it on every push to `main`. Almost everything lives in `index.html` (markup +
inline JS) and `site.css`. See `README.md` for local preview setup.

Two checks block a deploy: `tools/sync-partials.py --check` (pages must match
`_partials/`) and htmlhint against `.htmlhintrc`. Run both before pushing.

The timeline (`/timeline/`) is the exception: `timeline/index.html` is
self-contained, with its own inline `<style>` block and its own inline JS. The
entries live in a `DATA` array of objects (`d`/`y` date, `cat` array, `st`/`sb`
collapsed title+summary, `t`/`b` expanded title+HTML), and the categories live
in a `CATS` map above it. No icon font is loaded anywhere on the site — the
badges and labels are Unicode glyphs.

## Open work

Tracked in `TODO.md`, not here — file and line references included so items can
be picked up cold. Read it before starting anything; several items warn about
sync traps you would otherwise walk into.

## Gotchas

Things that have already cost someone an hour. Roughly in the order you are
likely to hit them.

**`grep` in this environment is a ugrep wrapper.** It can exit **2 (error)**,
not 1 (no match), for invocations that mix `-r` with a file list, and complex
patterns can fail outright with `exceeds complexity limits`. So
`if ! grep -q "$x" files…` silently treats an error as "not found". This
produced a completely wrong unreferenced-file list once. For existence checks
across many files, read them in Python and use `in`, rather than trusting an
exit code.

**Scans must cover the repo root, not just `assets/`.** `avatar-256px.png`
lives at the top level, and an `assets/`-only sweep misses it. So do the
favicons, `cv.pdf` and the app icons — those *are* referenced, and must not be
swept up.

**`avatar-256px.png` at the repo root is the email-signature portrait.** No
page loads it, so every unreferenced-file scan reports it — and it is
load-bearing. Its URL is frozen: emails already sent point at that exact path
and can never be updated, so it cannot be renamed or tidied into `assets/` no
matter how odd it looks at the root. The signature itself has since been
replaced, which does not help — the old emails are still out there. Keep it,
keep its name. README and `TODO.md` say the same.

**...and must search only the *published* files.** The other half of the same
trap: `TODO.md` names `london.mp4`, `avatar-256px.png` and `meta-cover.png` in
prose, and `README.md` names `logo-maxxturing.svg`. Search every tracked file
and all four look referenced, so a 50.7 MB answer comes back as 6.9 MB. Build
the haystack from `git ls-files` minus `NOPUBLISH` — the same list
`build-site.py` publishes — since only a published file can cause one to be
served. (Sizes: the TODO quotes MiB, a scan in bytes reports MB. 48.4 MiB and
50.7 MB are the same pile.)

**`build-site.py` publishes what `git ls-files` reports, minus `NOPUBLISH`.**
Two consequences: an uncommitted file will not ship no matter what is on disk
(and a build run against a tree with staged-but-missing files will fail on the
copy), and **any new root-level doc is published unless you add it to
`NOPUBLISH`** — that is how `CLAUDE.md` ended up live and indexed at
`/CLAUDE`. The workflow has a guard that fails the build if a known source file
reaches the artifact; extend it alongside `NOPUBLISH`.

**`CNAME` must be inside the published artifact** or GitHub Pages drops the
custom domain. There is a workflow guard asserting this. Do not remove it.

**Shared JavaScript lives in `/site.js` — don't put it back in the pages.**
The mobile-menu and contact-form handlers were once copy-pasted into both
`index.html` and `timeline/index.html`, with nothing keeping them in step
(`_partials/` covers markup only, and still does). They are now one copy in
`site.js` at the repo root, beside `site.css`, loaded with
`<script src="/site.js" defer></script>`. Two things about that tag: the path
is root-relative on purpose — `index.html` uses relative asset paths elsewhere,
but a relative one here would resolve to `/timeline/site.js` from the timeline
— and `defer` is what lets the file call `getElementById` at top level. Each
block returns early if its element is absent, so adding the file to `cv/` or
`meet-maxx/` stays harmless. Everything else in those pages' inline `<script>`
blocks is page-specific and belongs where it is.

**Do not add `width`/`height` to the images that lack them.** It looks like an
easy win — 69 of `index.html`'s 71 `<img>` carry no intrinsic dimensions — and
it would buy nothing. Every one of the 69 sits in a container that reserves its
box first: `.sp-stage` is `aspect-ratio:3/2` with the images
`position:absolute;inset:0`, `.sp-thumb` is a fixed `height:52px`, `.gal .duo`
is `height:300px` with width from `flex-basis:calc(var(--ar) * 300px)`,
`.cred-photo` has `min-height`/`aspect-ratio`, and the hero, the `.band` photo
and the two reveal overlays (`.shot-print`, `.macro-glass`) are all absolutely
positioned — out of flow, so they cannot shift anything. Layout shift needs the
*intrinsic* size to influence layout and here it never does.
`timeline/index.html` is 71 of 71 already, so there is nothing to do there
either.

**Collapsed timeline panels must stay `visibility:hidden`.** A `.tl-collapse`
at `grid-template-rows:0fr` is invisible but still in the accessibility tree,
with its links tab-focusable — keyboard users land on invisible targets inside
closed entries. The `visibility` rules and their transition delay are load-
bearing, not cosmetic.

**The timeline entry header is a real `<button>` inside its `<h3>`.** Only that
button toggles; the card body deliberately does not, so selecting text in an
open entry no longer closes it. Keep `aria-expanded` in step via `setMenu`-style
single-path updates, keep the chevron `aria-hidden`, and keep `aria-controls`
pointing at a unique panel id. Same pattern for the burger: every state change
goes through one function so the class and the attribute cannot disagree.

**`.mobile-menu.open` is not inside the 880px media query but `.nav .burger`
is.** Widening past the breakpoint used to strand an open menu on screen with
no control left to close it. There is now a `matchMedia` listener handling it —
if you touch the breakpoint, keep them in agreement.

**No Ruby. No Jekyll.** Both are gone; `Gemfile`, `Gemfile.lock` and
`_config.yml` were deleted. Preview with `python3 -m http.server`. If you see
instructions mentioning `bundle exec`, they are stale.

**Deploy time is wildly variable — budget minutes, not seconds.** Three
consecutive deploys took **135**, **168** and **258** seconds. This file used
to claim 40–50; treat that as a best case nobody should plan around. So do not
conclude a push failed because the new file 404s a minute later: confirm that
`git rev-parse origin/main` carries the commit, then keep polling for four or
five minutes before suspecting the workflow. Verify against the live URL
rather than assuming, and pass `--retry 2` and `--retry-all-errors` to `curl`
in any health poll — a single transient failure is not an outage, and curl
already prints `000` on failure, so a `|| echo 000` fallback doubles it into
`000000`.

**A 200 does not mean a link works.** `oxfordentrepreneurs.com` returns 200 and
is a parked squatter page (114 bytes, JS-redirecting to `/lander`). Several
dead links in this repo were not 404s either — they were domains on parking IPs
answering only on port 80, so an `https://` link hung until the browser gave up
rather than failing fast. Check what is *at* a URL, not just its status.
