# ROG Zephyrus G14 — Product Microsite Redesign

A self-contained, responsive product study of the original 2020 ROG Zephyrus G14. This repository began as an early multi-page HTML/CSS coursework project and was rebuilt to demonstrate current front-end judgement rather than preserve raw assignment code.

## What changed

- Reframed the site as an independent student redesign instead of an official ASUS storefront.
- Replaced hotlinked images and promotional video with original CSS-built artwork.
- Removed non-functional sign-in and contact forms that could imply real data collection.
- Consolidated four repetitive pages and stylesheets into one semantic experience.
- Reworked the product copy against official historical ROG material.
- Added slow ambient motion for circuit paths, telemetry, feature graphics, chassis lighting, and system flow, plus animated compute, render, thermal, and display diagrams. The hero lid remains static, and all remaining motion has a reduced-motion fallback.
- Added responsive layouts, keyboard-friendly navigation, focus states, reduced-motion support, and progressive enhancement.
- Added a small dependency-free validation script for local links and baseline markup rules.

## Run locally

The site has no build step or runtime dependencies.

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Validate

```bash
python tests/check_site.py
node --check script.js
```

## Technical approach

- Semantic HTML5 sections and a real specification table
- CSS Grid, Flexbox, custom properties, gradients, masks, and responsive typography
- Vanilla JavaScript for navigation state, scroll progress, reveal effects, and optional pointer motion
- No framework, analytics, external fonts, image CDN, form submission, or authentication

## Product sources

The specification summary describes the 2020 GA401 family and was cross-checked against official ASUS/ROG material:

- [ROG Zephyrus G14 hands-on and configuration overview](https://rog.asus.com/articles/hands-on/hands-on-the-14-rog-zephyrus-g14-games-as-well-as-it-travels/)
- [ROG Zephyrus G14 lab report](https://rog.asus.com/us/articles/reviews/rog-zephyrus-g14-lab-report-2/)

Configurations and availability varied by market. The website intentionally avoids pricing or current-availability claims.

## Disclaimer

This is an independent educational redesign by Jevint Felixciano. ASUS, ROG, Zephyrus, Ryzen, GeForce, and related names and marks belong to their respective owners. The project is not affiliated with or endorsed by ASUS.

The source code is released under the [MIT License](LICENSE).
