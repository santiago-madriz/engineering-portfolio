import { defineConfig } from 'astro/config';

const publicSite = process.env.PORTFOLIO_SITE ?? 'https://santiagomadriz.com';
const configuredBase = process.env.PORTFOLIO_BASE ?? '/dev';
const publicBase = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;

export default defineConfig({
  site: publicSite,
  base: process.env.GITHUB_PAGES === 'true' ? publicBase : '/',
  output: 'static'
});
