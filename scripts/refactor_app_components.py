#!/usr/bin/env python3
"""Split src/Temp.tsx functions into reusable component files.

Usage: run from repo root (same directory as scripts/):
    python3 scripts/refactor_app_components.py

This reads src/Temp.tsx or src/app/Temp.tsx (first one that exists), extracts
all top-level `function Name()` declarations except the default export, groups
functions that share the same alphabetic prefix (e.g. Frame1/Frame2 -> Frame),
writes each group into `src/components/generated/<Name>.tsx`, and replaces the
inlined function definitions with imports in Temp.tsx.
"""

from __future__ import annotations

import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Set, Tuple

REPO_ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = REPO_ROOT / "src"
TARGET_FILE_NAME = "Temp.tsx"
SOURCE_CANDIDATES = [SRC_DIR / TARGET_FILE_NAME, SRC_DIR / "app" / TARGET_FILE_NAME]
SOURCE_FILE: Path | None = None
for candidate in SOURCE_CANDIDATES:
    if candidate.exists():
        SOURCE_FILE = candidate
        break

if SOURCE_FILE is None:
    sys.exit("Temp.tsx not found in src/ or src/app/. Place the file before running.")

SOURCE_DIR = SOURCE_FILE.parent
GENERATED_ROOT = SRC_DIR / "components" / "generated"
GENERATED_ROOT.mkdir(parents=True, exist_ok=True)

FunctionBlock = Dict[str, Tuple[int, int, str]]


def detect_default_export_name(source: str) -> str | None:
    match = re.search(r"export\s+default\s+function\s+(\w+)", source)
    return match.group(1) if match else None


def parse_functions(source: str, skip_name: str | None) -> FunctionBlock:
    pattern = re.compile(r"^function\s+(\w+)\s*\(", re.MULTILINE)
    blocks: FunctionBlock = {}
    for match in pattern.finditer(source):
        name = match.group(1)
        if skip_name and name == skip_name:
            continue
        body_start, body_end = find_function_body(source, match.end(), name)
        blocks[name] = (match.start(), body_end, source[match.start():body_end].rstrip())
    return blocks


def find_function_body(source: str, idx: int, name: str) -> Tuple[int, int]:
    length = len(source)
    paren_depth = 1
    while idx < length:
        ch = source[idx]
        if ch == "(":
            paren_depth += 1
        elif ch == ")":
            paren_depth -= 1
            if paren_depth == 0:
                idx += 1
                break
        elif ch in {'"', '\'', '`'}:
            idx = skip_string(source, idx)
            continue
        elif ch == "/" and idx + 1 < length and source[idx + 1] in {"/", "*"}:
            idx = skip_comment(source, idx)
            continue
        idx += 1
    else:
        raise ValueError(f"Unbalanced parentheses in function {name}")

    idx = skip_whitespace_comments(source, idx)

    if idx < length and source[idx] == ":":
        idx += 1
        while idx < length and source[idx] != "{":
            ch = source[idx]
            if ch in {'"', '\'', '`'}:
                idx = skip_string(source, idx)
                continue
            if ch == "/" and idx + 1 < length and source[idx + 1] in {"/", "*"}:
                idx = skip_comment(source, idx)
                continue
            idx += 1
        idx = skip_whitespace_comments(source, idx)

    if idx >= length or source[idx] != "{":
        raise ValueError(f"Cannot locate body for function {name}")

    body_start = idx
    idx += 1
    brace_depth = 1
    while idx < length:
        ch = source[idx]
        if ch in {'"', '\'', '`'}:
            idx = skip_string(source, idx)
            continue
        if ch == "/" and idx + 1 < length and source[idx + 1] in {"/", "*"}:
            idx = skip_comment(source, idx)
            continue
        if ch == "{":
            brace_depth += 1
        elif ch == "}":
            brace_depth -= 1
            if brace_depth == 0:
                return body_start, idx + 1
        idx += 1

    raise ValueError(f"Unclosed body for function {name}")


def skip_whitespace_comments(source: str, idx: int) -> int:
    length = len(source)
    while idx < length:
        ch = source[idx]
        if ch in {" ", "\t", "\n", "\r"}:
            idx += 1
            continue
        if ch == "/" and idx + 1 < length and source[idx + 1] in {"/", "*"}:
            idx = skip_comment(source, idx)
            continue
        break
    return idx


def skip_comment(source: str, idx: int) -> int:
    nxt = source[idx + 1]
    if nxt == "/":
        idx += 2
        length = len(source)
        while idx < length and source[idx] not in "\n\r":
            idx += 1
        return idx
    if nxt == "*":
        idx += 2
        length = len(source)
        while idx < length - 1:
            if source[idx] == "*" and source[idx + 1] == "/":
                return idx + 2
            idx += 1
        raise ValueError("Unterminated block comment")
    return idx + 1


def skip_string(source: str, idx: int) -> int:
    quote = source[idx]
    if quote == "`":
        return skip_template(source, idx)
    idx += 1
    length = len(source)
    while idx < length:
        ch = source[idx]
        if ch == "\\":
            idx += 2
            continue
        if ch == quote:
            return idx + 1
        idx += 1
    raise ValueError("Unterminated string literal")


def skip_template(source: str, idx: int) -> int:
    idx += 1
    length = len(source)
    while idx < length:
        ch = source[idx]
        if ch == "\\":
            idx += 2
            continue
        if ch == "`":
            return idx + 1
        if ch == "$" and idx + 1 < length and source[idx + 1] == "{":
            idx = skip_template_expr(source, idx + 2)
            continue
        idx += 1
    raise ValueError("Unterminated template literal")


def skip_template_expr(source: str, idx: int) -> int:
    depth = 1
    length = len(source)
    while idx < length:
        ch = source[idx]
        if ch in {'"', '\'', '`'}:
            idx = skip_string(source, idx)
            continue
        if ch == "/" and idx + 1 < length and source[idx + 1] in {"/", "*"}:
            idx = skip_comment(source, idx)
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return idx + 1
        idx += 1
    raise ValueError("Unterminated ${...} expression")


def initial_owner_map(functions: List[str]) -> Dict[str, str]:
    owners: Dict[str, str] = {}
    pattern = re.compile(r"^(?P<base>[A-Za-z_][A-Za-z_0-9]*?)(?P<num>\d+)$")
    for name in functions:
        match = pattern.match(name)
        owners[name] = match.group("base") if match else name
    return owners


def build_reference_map(blocks: FunctionBlock) -> Dict[str, Set[str]]:
    names = list(blocks.keys())
    refs: Dict[str, Set[str]] = {name: set() for name in names}
    if not names:
        return refs
    pattern = re.compile(
        r"\b(" + "|".join(re.escape(n) for n in sorted(names, key=len, reverse=True)) + r")\b"
    )
    for parent, (_, _, code) in blocks.items():
        for match in pattern.findall(code):
            if match == parent:
                continue
            refs.setdefault(match, set()).add(parent)
    return refs


def adjust_owners(owners: Dict[str, str], refs: Dict[str, Set[str]]) -> Dict[str, str]:
    changed = True
    while changed:
        changed = False
        for name, parents in refs.items():
            if not parents:
                continue
            valid_parents = [p for p in parents if p in owners]
            if len(valid_parents) == 1:
                parent_owner = owners.get(valid_parents[0])
                if parent_owner and owners.get(name) != parent_owner:
                    owners[name] = parent_owner
                    changed = True
    return owners


def group_by_owner(owners: Dict[str, str]) -> Dict[str, List[str]]:
    groups: Dict[str, List[str]] = {}
    for name, base in owners.items():
        groups.setdefault(base, []).append(name)
    for names in groups.values():
        names.sort()
    return groups


def needs_symbol(code: str, symbol: str) -> bool:
    return bool(re.search(rf"\b{re.escape(symbol)}\b", code))


def resolve_import_path(spec: str, from_dir: Path) -> str:
    if spec.startswith("."):
        source_path = (SOURCE_FILE.parent / spec).resolve()
        relative = os.path.relpath(source_path, from_dir)
        posix = Path(relative).as_posix()
        if not posix.startswith("."):
            posix = f"./{posix}"
        return posix
    return spec


def drop_import(source: str, symbol: str) -> str:
    pattern = re.compile(rf"^\s*import\s+{symbol}[^\n]*\n", re.MULTILINE)
    return pattern.sub("", source)


def insert_imports(source: str, imports: List[str]) -> str:
    if not imports:
        return source
    lines = source.splitlines()
    idx = 0
    directives = {"'use client';", '"use client";', "'use server';", '"use server";'}
    while idx < len(lines) and lines[idx].strip() in directives:
        idx += 1
    while idx < len(lines) and lines[idx].startswith("import "):
        idx += 1
    new_lines = lines[:idx] + imports + lines[idx:]
    return "\n".join(new_lines) + "\n"


def main() -> None:
    source = SOURCE_FILE.read_text(encoding="utf-8")
    default_export = detect_default_export_name(source)
    blocks = parse_functions(source, skip_name=default_export)

    svg_import = re.search(r'import\s+svgPaths\s+from\s+["\']([^"\']+)["\'];', source)
    img_import = re.search(r'import\s+imgImage\s+from\s+["\']([^"\']+)["\'];', source)
    svg_spec = svg_import.group(1) if svg_import else None
    img_spec = img_import.group(1) if img_import else None

    names = list(blocks.keys())
    if not names:
        print("No helper functions found in Temp.tsx")
        return

    owners = initial_owner_map(names)
    refs = build_reference_map(blocks)
    owners = adjust_owners(owners, refs)
    grouped = group_by_owner(owners)
    base_order = sorted(grouped.keys())

    removal_ranges: List[Tuple[int, int]] = []
    import_lines: List[str] = []

    for base_name in base_order:
        fn_names = grouped[base_name]
        target_dir = GENERATED_ROOT
        target_dir.mkdir(parents=True, exist_ok=True)
        target_file = target_dir / f"{base_name}.tsx"

        snippets: List[str] = []
        for fn in fn_names:
            start, end, code = blocks[fn]
            removal_ranges.append((start, end))
            snippets.append(code.strip())

        component_code = "\n\n".join(snippets)
        primary_name = next((fn for fn in fn_names if fn == base_name), fn_names[0])
        component_code = component_code.replace(
            f"function {primary_name}", f"export default function {base_name}", 1
        )

        imports: List[str] = []
        dependency_imports: List[str] = []
        for dep_name in base_order:
            if dep_name == base_name:
                continue
            if re.search(rf"\b{re.escape(dep_name)}\b", component_code):
                dep_path = Path(
                    os.path.relpath((GENERATED_ROOT / dep_name).with_suffix(""), target_dir)
                ).as_posix()
                if not dep_path.startswith("."):
                    dep_path = f"./{dep_path}"
                dependency_imports.append(f'import {dep_name} from "{dep_path}";')
        if needs_symbol(component_code, "svgPaths"):
            if svg_spec:
                imports.append(f'import svgPaths from "{resolve_import_path(svg_spec, target_dir)}";')
            else:
                print(f"Warning: {base_name} uses svgPaths but no import found in Temp.tsx")
        if needs_symbol(component_code, "imgImage"):
            if img_spec:
                imports.append(f'import imgImage from "{img_spec}";')
            else:
                print(f"Warning: {base_name} uses imgImage but no import found in Temp.tsx")
        if "React." in component_code:
            imports.append('import type React from "react";')

        all_imports = [*dependency_imports, *imports]
        file_body = "\n\n".join(filter(None, ["\n".join(all_imports).strip(), component_code])).strip()
        target_file.write_text(file_body + "\n", encoding="utf-8")

        relative_import = Path(os.path.relpath(target_file.with_suffix(""), SOURCE_DIR)).as_posix()
        if not relative_import.startswith("."):
            relative_import = f"./{relative_import}"
        import_lines.append(f'import {base_name} from "{relative_import}";')

    removal_ranges.sort(key=lambda r: r[0], reverse=True)
    updated_source = source
    for start, end in removal_ranges:
        updated_source = updated_source[:start] + updated_source[end:]

    if svg_spec:
        updated_source = drop_import(updated_source, "svgPaths")
    if img_spec:
        updated_source = drop_import(updated_source, "imgImage")

    updated_source = insert_imports(updated_source, import_lines)
    SOURCE_FILE.write_text(updated_source.rstrip() + "\n", encoding="utf-8")

    print("Generated components:")
    for line in import_lines:
        print("  " + line)
    print("Updated Temp.tsx with new imports.")


if __name__ == "__main__":
    main()
