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

## Troubleshooting

- **`make failed` / native extension errors (ffi, nokogiri) during `bundle install`** —
  you're almost certainly on the old system Ruby. Recheck `ruby -v` (step 1).
- **`Could not locate Gemfile`** — run commands from the repo root.

## Tech notes

- **Plugins:** `jekyll-sitemap`, `jekyll-paginate`, `jemoji` (see `Gemfile` / `_config.yml`).
- **Markdown:** kramdown.
- **Styles:** SCSS under `assets/css/scss/` plus plain CSS in `assets/css/`.

## Reference

- Jekyll docs: https://jekyllrb.com/
- Smooth scrolling snippet: https://css-tricks.com/snippets/jquery/smooth-scrolling/

### Bootstrap responsive helpers

- `d-block d-md-none` — hide on medium and larger screens.
- `d-none d-md-block` — hide on small and extra-small screens.

### Mobile / accessibility reminders

- Viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Keep media responsive: `img, embed, object, video { max-width: 100%; }`
- Tap targets: `nav a, button { min-width: 48px; min-height: 48px; }` with ~40px spacing.
