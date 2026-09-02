#!/usr/bin/env python3
"""Stage the publishable site into _site/ and write its sitemap.

This replaces Jekyll. Jekyll never did anything here except emit sitemap.xml
and withhold a handful of source files from the output — every other file it
copied byte for byte — so those two jobs are all this has to reproduce.

What gets published is decided by `git ls-files` minus NOPUBLISH below, so only
committed files ever ship: a stray scratch file in the working tree cannot leak
into a deploy the way it would with a plain directory copy.

Usage:
    python3 tools/build-site.py            stage into _site/
    python3 tools/build-site.py --out DIR  stage somewhere else
"""

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Source files that must never reach the published site. These are the same
# paths Jekyll's `exclude:` held back, plus the build tooling itself.
NOPUBLISH = re.compile(
    r"""^(
          \.github/       # workflows
        | _partials/      # sources for the synced blocks, not pages
        | tools/          # this script and sync-partials.py
        | scripts/        # local media helpers
        | CLAUDE\.md$
        | TODO\.md$
        | README\.md$
        | Gemfile$
        | Gemfile\.lock$
        | _config\.yml$
        | \.htmlhintrc$
        | \.gitignore$
    )""",
    re.VERBOSE,
)

# Pages worth listing for search engines, in the order jekyll-sitemap emitted
# them. PDFs are included because the previous sitemap included them — this
# script is a like-for-like replacement, not a change of SEO surface.
PDF_SUFFIX = ".pdf"


def tracked_files():
    out = subprocess.run(
        ["git", "-C", str(ROOT), "ls-files", "-z"],
        capture_output=True, text=True, check=True,
    ).stdout
    return [p for p in out.split("\0") if p]


def last_commit_iso(path):
    """Commit date of the file, so lastmod reflects real edits rather than
    whenever CI happened to check the tree out."""
    r = subprocess.run(
        ["git", "-C", str(ROOT), "log", "-1", "--format=%cI", "--", path],
        capture_output=True, text=True,
    )
    return r.stdout.strip() or None


def site_url():
    """One source of truth for the domain: the CNAME that GitHub Pages serves."""
    host = (ROOT / "CNAME").read_text().strip()
    return f"https://{host}"


def url_for(rel):
    """Map a repo path to its served URL path."""
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def build_sitemap(published, base):
    entries = []
    for rel in published:
        if rel.endswith("index.html") or rel.endswith(PDF_SUFFIX):
            entries.append((url_for(rel), last_commit_iso(rel)))
    # stable, and shallow paths first so the homepage leads
    entries.sort(key=lambda e: (e[0].count("/"), e[0]))

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, mod in entries:
        lines.append("  <url>")
        lines.append(f"    <loc>{base}{loc}</loc>")
        if mod:
            lines.append(f"    <lastmod>{mod}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n", len(entries)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="_site")
    args = ap.parse_args()

    out = (ROOT / args.out).resolve()
    if out == ROOT:
        sys.exit("refusing to stage over the repo root")
    if out.exists():
        shutil.rmtree(out)

    published = [p for p in tracked_files() if not NOPUBLISH.match(p)]
    for rel in published:
        dst = out / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / rel, dst)

    # GitHub Pages drops the custom domain unless CNAME is in the artifact.
    if not (out / "CNAME").exists():
        sys.exit("CNAME missing from the staged site — the custom domain would break")

    base = site_url()
    xml, n = build_sitemap(published, base)
    (out / "sitemap.xml").write_text(xml)

    held = len(tracked_files()) - len(published)
    try:                      # --out may point outside the repo
        shown = out.relative_to(ROOT)
    except ValueError:
        shown = out
    print(f"staged {len(published)} files into {shown}/ "
          f"({held} held back)")
    print(f"sitemap.xml: {n} urls, base {base}")


if __name__ == "__main__":
    main()
