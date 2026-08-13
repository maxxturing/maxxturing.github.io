# maxxturing.github.io

Personal site for Maxx Turing, built with [Jekyll](https://jekyllrb.com/) and
hosted on GitHub Pages (custom domain `maxxturing.com` via the `CNAME` file).

## Local setup

GitHub Pages builds the site for you on push — these steps are only for previewing
changes locally.

### 1. Use a modern Ruby

macOS ships an old, deprecated system Ruby (2.6) that **cannot** build this site's
native gem dependencies. Install a current Ruby with Homebrew:

```bash
brew install ruby
```

Then put it ahead of the system Ruby on your `PATH`. Add this line to your
`~/.zshrc` (Apple Silicon path shown; use `/usr/local/opt/ruby/bin` on Intel Macs):

```bash
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
```

Reload your shell (`source ~/.zshrc`) and confirm you're on the Homebrew Ruby:

```bash
ruby -v   # should be 3.x / 4.x, not 2.6
```

### 2. Install dependencies

From the repo root:

```bash
bundle install
```

Gems install into the Homebrew Ruby's user-owned gem directory, so no `sudo`
is required.

### 3. Serve the site

```bash
bundle exec jekyll serve
```

Open http://127.0.0.1:4000/. The server watches for changes and rebuilds
automatically; stop it with `Ctrl+C`.

To do a one-off build without serving:

```bash
bundle exec jekyll build   # output goes to _site/ (git-ignored)
```

## Shared blocks (`_partials/`)

Every page here — `index.html`, `timeline/index.html`, `cv/index.html` and
`meet-maxx/index.html` — is hand-written static HTML with no YAML front matter,
so Jekyll copies them verbatim and `{% include %}` never runs in them. That is
why there is no `_layouts/` or `_includes/`: nothing could reach them. Blocks
that appear on more than one page live in `_partials/` instead, and each page
marks the region it borrows:

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

`_partials/` starts with an underscore, so Jekyll never publishes it. To catch a
forgotten sync before it ships, wire the check into a local pre-commit hook:

```bash
printf '#!/bin/sh\npython3 tools/sync-partials.py --check\n' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Troubleshooting

- **`make failed` / native extension errors (ffi, nokogiri) during `bundle install`** —
  you're almost certainly on the old system Ruby. Recheck `ruby -v` (step 1).
- **`Could not locate Gemfile`** — run commands from the repo root.

## Tech notes

- **Plugins:** `jekyll-sitemap`, `jekyll-paginate`, `jemoji` — listed under
  `plugins:` in `_config.yml` (not `plugins_dir:`, which is where Jekyll looks
  for plugin *files*; getting those two confused is what kept `sitemap.xml`
  a 404).
- **Markdown:** kramdown — only relevant if a page ever gains front matter.
- **Styles:** one hand-written `site.css` at the repo root, plus a `<style>`
  block in `timeline/index.html` for the timeline's own layout. No framework,
  no build step.
- **Scripts:** inline `<script>` at the foot of the two long pages; `cv/` and
  `meet-maxx/` are bare iframe wrappers. No jQuery, no bundler.
- **Images:** capped at 2000px on the long edge (2600px for the hero) and lazy
  below the fold. Please resize before committing a camera original — the pages
  once shipped 70MB of them.

### Legacy under `assets/`

`assets/img/`, `assets/video/` and `assets/docs/` are live. The rest —
`assets/css/` (including `scss/`), `assets/scripts/`, `assets/fonts/` — is left
over from the old Bootstrap/jQuery theme and is not referenced by any page.

## Reference

- Jekyll docs: https://jekyllrb.com/

### Mobile / accessibility reminders

- Viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Keep media responsive: `img, embed, object, video { max-width: 100%; }`
- Tap targets: `nav a, button { min-width: 48px; min-height: 48px; }` with ~40px spacing.
