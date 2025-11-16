#!/usr/bin/env python3
"""Print function component names from a TypeScript/TSX file.

Usage:

    python3 scripts/list_functions.py [path]

If no path is supplied it defaults to src/Temp.tsx. The script scans the file
for `function Name(` declarations and prints each name on its own line in the
order it appears in the source.
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "path",
        nargs="?",
        default="src/Temp.tsx",
        help="Path to the TS/TSX file to inspect (default: src/Temp.tsx)",
    )
    return parser.parse_args()


def extract_function_names(text: str) -> list[str]:
    pattern = re.compile(r"^function\s+(\w+)\s*\(", re.MULTILINE)
    return pattern.findall(text)


def main() -> None:
    args = parse_args()
    target = Path(args.path)
    if not target.exists():
        raise SystemExit(f"File not found: {target}")

    names = extract_function_names(target.read_text())
    if not names:
        print("(no function declarations found)")
        return

    print("\n".join(names))


if __name__ == "__main__":
    main()
