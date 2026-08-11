#!/usr/bin/env python3
"""Sync shared HTML blocks from _partials/ into the static pages.

index.html and timeline/index.html are hand-written static pages with no YAML
front matter, so Jekyll copies them verbatim and {% include %} never runs in
them. This keeps the shared blocks in one place anyway: each page marks the
region it borrows, and this script rewrites that region from the partial.

    <!-- @partial:contact -->
    ...generated, do not edit here...
    <!-- /@partial:contact -->

Usage:
    python3 tools/sync-partials.py           rewrite every marked region
    python3 tools/sync-partials.py --check   exit 1 if any region is stale

Run it after editing anything in _partials/. --check is what you want in a
pre-commit hook.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PARTIALS = ROOT / "_partials"

# Pages that may borrow partials. A page only changes if it carries the markers.
TARGETS = [
    "index.html",
    "timeline/index.html",
]


def marked_region(name):
    return re.compile(
        r"(?P<indent>[ \t]*)<!-- @partial:%s -->\n"
        r".*?"
        r"[ \t]*<!-- /@partial:%s -->" % (re.escape(name), re.escape(name)),
        re.DOTALL,
    )


def render(name, indent):
    body = (PARTIALS / f"{name}.html").read_text().rstrip("\n")
    lines = [(indent + line if line.strip() else line) for line in body.split("\n")]
    return (
        f"{indent}<!-- @partial:{name} -->\n"
        + "\n".join(lines)
        + f"\n{indent}<!-- /@partial:{name} -->"
    )


def sync(check):
    names = sorted(p.stem for p in PARTIALS.glob("*.html"))
    if not names:
        sys.exit(f"no partials found in {PARTIALS}")

    stale, written = [], []
    for target in TARGETS:
        path = ROOT / target
        original = path.read_text()
        updated = original
        for name in names:
            updated = marked_region(name).sub(
                lambda m: render(name, m.group("indent")), updated
            )
        if updated == original:
            continue
        if check:
            stale.append(target)
        else:
            path.write_text(updated)
            written.append(target)

    if check:
        if stale:
            print("stale (run tools/sync-partials.py): " + ", ".join(stale))
            return 1
        print(f"up to date: {', '.join(names)} across {len(TARGETS)} pages")
        return 0

    print(f"synced {', '.join(names)} -> " + (", ".join(written) if written else "no changes"))
    return 0


if __name__ == "__main__":
    args = sys.argv[1:]
    if args and args[0] not in ("--check",):
        sys.exit(__doc__)
    sys.exit(sync(check=bool(args)))
