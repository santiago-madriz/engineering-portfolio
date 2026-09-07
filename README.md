# santiago-madriz.dev

Recruiter-facing engineering portfolio for Santiago Madriz, built with Astro and TypeScript.

## Purpose

Communicate a focused professional story: software engineering strengthened by deep quality-engineering instincts, demonstrated through a small number of real, production-minded projects.

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

The Playwright suite covers desktop and mobile positioning, navigation integrity, project and writing content, and horizontal layout overflow. GitHub Actions runs the production build and desktop smoke suite.

## Deployment

The site builds to `dist/` and can be deployed to Cloudflare Pages, Netlify, Vercel, or GitHub Pages. Set the production project to build with `npm run build` and publish `dist`.

The production portfolio is published at `https://santiagomadriz.com/dev/`.
