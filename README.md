# maxxturing.github.io

Personal site for Maxx Turing — hand-written static HTML, hosted on GitHub Pages
(custom domain `maxxturing.com` via the `CNAME` file).

There is no site generator. Every page is plain HTML with no front matter and no
template language; `tools/build-site.py` just copies the publishable files and
writes `sitemap.xml`. `.github/workflows/deploy.yml` runs it on every push to
`main` and deploys the result.

## Local setup

No toolchain to install — the site is static HTML. To preview it:

```bash
python3 -m http.server 8000
```

Open http://127.0.0.1:8000/. Note that pretty URLs like `/timeline/` resolve
because the directories contain `index.html`, so they work here exactly as they
do in production.

To reproduce what actually gets published — the same thing CI builds:

```bash
python3 tools/build-site.py     # stages into _site/ (git-ignored)
```

It publishes the files `git ls-files` reports, minus the `NOPUBLISH` list at the
top of the script, so **only committed files are ever published** — an untracked
scratch file in your working tree cannot leak into a deploy. It also writes
`sitemap.xml`, taking the domain from `CNAME`.

## Checks

`.github/workflows/deploy.yml` runs these on every push, and a failure blocks the
deploy. Run them yourself before pushing:

```bash
python3 tools/sync-partials.py --check   # pages match _partials/
npx htmlhint@1.9.2 index.html timeline/index.html cv/index.html meet-maxx/index.html
```

The workflow additionally asserts that the built artifact contains `CNAME` (a
missing one silently drops the custom domain) and that no source file — `CLAUDE.md`,
`_partials/`, `tools/`, `scripts/` — reached the published site.

## Shared blocks (`_partials/`)

Every page here — `index.html`, `timeline/index.html`, `cv/index.html` and
`meet-maxx/index.html` — is hand-written static HTML served as-is. There is no
template language, so a page cannot `include` anything. Blocks that appear on
more than one page live in `_partials/` instead, and each page marks the region
it borrows:

```html
<!-- @partial:contact -->
...generated — edit _partials/contact.html, not this...
<!-- /@partial:contact -->
```

Current partials are `contact.html` (the contact section, on the two long pages)
and `analytics.html` (the GA4 tag, on all four — so the measurement ID has one
home). Which pages get rewritten is the `TARGETS` list in the script; a page
without the markers is left alone either way.

Edit the file in `_partials/`, then rewrite the pages that borrow it:

```bash
python3 tools/sync-partials.py           # rewrite every marked region
python3 tools/sync-partials.py --check   # exit 1 if a region is stale
```

`_partials/` is in `NOPUBLISH`, so it never reaches the published site. CI fails
the deploy if a page has drifted from its partial; to catch it before you push,
wire the same check into a local pre-commit hook:

```bash
printf '#!/bin/sh\npython3 tools/sync-partials.py --check\n' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Troubleshooting

- **`stale (run tools/sync-partials.py)`** — a shared block was edited in a page
  instead of in `_partials/`. Fix the partial, then run the script to rewrite the
  pages.
- **Deploy failed on "Verify the artifact"** — either `CNAME` went missing (which
  would drop the custom domain) or a source file reached the output. Check
  `NOPUBLISH` in `tools/build-site.py`.
- **A new file didn't publish** — `build-site.py` ships only what `git ls-files`
  reports. Commit it.

## Tech notes

- **Build:** `tools/build-site.py` — a file copy plus `sitemap.xml`. The site
  previously ran on Jekyll, which did only those two things here; it was dropped
  because it required a Ruby toolchain, and GitHub Pages built with a different
  Jekyll major version than a local `bundle exec` did.
- **Sitemap:** generated from the published files; `<lastmod>` is each file's git
  commit date, so it reflects real edits rather than checkout time.
- **Styles:** one hand-written `site.css` at the repo root, plus a `<style>`
  block in `timeline/index.html` for the timeline's own layout. No framework,
  no build step.
- **Scripts:** inline `<script>` at the foot of the two long pages; `cv/` and
  `meet-maxx/` are bare iframe wrappers. No jQuery, no bundler.
- **Images:** capped at 2000px on the long edge (2600px for the hero) and lazy
  below the fold. Please resize before committing a camera original — the pages
  once shipped 70MB of them.

### What lives under `assets/`

`img/`, `video/` and `docs/` — all three are referenced by the pages, and
that is the whole of it. The old theme's `css/` (with its SCSS), `scripts/`
(jQuery, Modernizr, wow.js, instafeed) and `fonts/` (Font Awesome) are gone;
the site loads no icon font and pulls its typefaces from Google Fonts via an
`@import` at the top of `site.css`.

## Reference

- GitHub Pages with a custom workflow: https://docs.github.com/pages

### Mobile / accessibility reminders

- Viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Keep media responsive: `img, embed, object, video { max-width: 100%; }`
- Tap targets: `nav a, button { min-width: 48px; min-height: 48px; }` with ~40px spacing.
