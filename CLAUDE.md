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

**`build-site.py` publishes what `git ls-files` reports, minus `NOPUBLISH`.**
Two consequences: an uncommitted file will not ship no matter what is on disk
(and a build run against a tree with staged-but-missing files will fail on the
copy), and **any new root-level doc is published unless you add it to
`NOPUBLISH`** — that is how `CLAUDE.md` ended up live and indexed at
`/CLAUDE`. The workflow has a guard that fails the build if a known source file
reaches the artifact; extend it alongside `NOPUBLISH`.

**`CNAME` must be inside the published artifact** or GitHub Pages drops the
custom domain. There is a workflow guard asserting this. Do not remove it.

**`_partials/` covers markup only — not the JavaScript.** The contact-form and
mobile-menu handlers are copy-pasted into both `index.html` and
`timeline/index.html` and nothing keeps them in step. Edit both, and diff them
after. See `TODO.md` item 6.

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

**Deploys take about 40–50 seconds** from push to live. Verify against the live
URL rather than assuming, and pass `--retry 2 --retry-all-errors` to `curl` in
any health poll — a single transient failure is not an outage, and curl already
prints `000` on failure, so a `|| echo 000` fallback doubles it into `000000`.

**A 200 does not mean a link works.** `oxfordentrepreneurs.com` returns 200 and
is a parked squatter page (114 bytes, JS-redirecting to `/lander`). Several
dead links in this repo were not 404s either — they were domains on parking IPs
answering only on port 80, so an `https://` link hung until the browser gave up
rather than failing fast. Check what is *at* a URL, not just its status.
