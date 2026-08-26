"""Dependency-free structural checks for the static portfolio site."""

from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).parents[1]
HTML = ROOT / "index.html"


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.local_references: list[str] = []
        self.fragment_links: list[str] = []
        self.errors: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if element_id := values.get("id"):
            if element_id in self.ids:
                self.errors.append(f"Duplicate id: {element_id}")
            self.ids.add(element_id)

        for attribute in ("src", "href"):
            reference = values.get(attribute)
            if not reference:
                continue
            if reference.startswith("#"):
                self.fragment_links.append(reference[1:])
                continue
            parsed = urlparse(reference)
            if not parsed.scheme and not reference.startswith("//"):
                self.local_references.append(unquote(parsed.path))

        if tag == "button" and not values.get("type"):
            self.errors.append("Every button must declare its type")
        if any(name.lower().startswith("on") for name, _ in attrs):
            self.errors.append(f"Inline event handler found on <{tag}>")
        if tag == "img" and not values.get("alt"):
            self.errors.append("Every image must provide alt text")


def main() -> int:
    parser = SiteParser()
    parser.feed(HTML.read_text(encoding="utf-8"))

    for fragment in parser.fragment_links:
        if fragment and fragment not in parser.ids:
            parser.errors.append(f"Missing fragment target: #{fragment}")

    for reference in parser.local_references:
        if reference and not (ROOT / reference).is_file():
            parser.errors.append(f"Missing local file: {reference}")

    page = HTML.read_text(encoding="utf-8").lower()
    for required in ("<main", "<nav", "<h1", "<table"):
        if required not in page:
            parser.errors.append(f"Required markup not found: {required}")

    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    if "prefers-reduced-motion" not in css:
        parser.errors.append("Reduced-motion CSS is missing")
    if re.search(r"url\(\s*['\"]?https?://", css, re.IGNORECASE):
        parser.errors.append("External CSS asset found")
    if "<form" in page:
        parser.errors.append("The portfolio demo must not collect user data")

    if parser.errors:
        print("Site validation failed:")
        for error in parser.errors:
            print(f"- {error}")
        return 1

    print(
        f"Site validation passed: {len(parser.ids)} unique ids, "
        f"{len(parser.local_references)} local references, "
        f"{len(parser.fragment_links)} fragment links."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
