# [Santiago Madriz — Engineering Portfolio](https://santiagomadriz.com/dev/)

Recruiter-facing engineering portfolio for Santiago Madriz, built with Astro and TypeScript.

## Purpose

Communicate a focused professional story: software engineering strengthened by deep quality-engineering instincts, demonstrated through a small number of real, production-minded projects.

## Content

- Selected engineering work with a dedicated visual preview for every project
- A production Techy case study linked to [techy-cr.com](https://techy-cr.com/)
- A private-repository Galería Mexicana case study linked to its [live storefront](https://galeriamexicanacr.com/)
- Prominent live-site, repository, and quality-pipeline links at the start of every case study
- URL-aware primary navigation with a clear animated current-section indicator
- Dark visual system with eye-friendly warm-gray typography, selective color accents, restrained expanded display typography, and visible animated film-grain texture
- A compact custom laptop render whose perspective and roll respond clearly to scroll, with reduced-motion accessibility support
- Viewport-aware entrance transitions for navigation, text, controls, cards, imagery, credentials, and footer content
- An interactive Spanish Sentiment Lab demo with an explicit OpenAI availability disclaimer
- Native work-experience and education sections with official employer references
- Teaching experience and directly verifiable certificates

## Local development

Requires Node.js 22.19 or newer.

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run build
npx playwright install chromium
npm test
```

The Playwright suite covers desktop and mobile positioning, the scroll-responsive laptop, reduced-motion behavior, non-overlapping workflow cards, navigation integrity, project previews, experience, credentials, and horizontal layout overflow. GitHub Actions runs the production build and desktop smoke suite.

## Deployment

The site is statically generated into `dist/` and published below `/dev/` on the main GitHub Pages site.

```bash
GITHUB_PAGES=true PORTFOLIO_BASE=/dev npm run build
```

The production portfolio is published at `https://santiagomadriz.com/dev/`.
