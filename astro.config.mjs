import { defineConfig } from 'astro/config';

const publicSite = process.env.PORTFOLIO_SITE ?? 'https://santiagomadriz.com';
const publicBase = process.env.PORTFOLIO_BASE ?? '/dev';

export default defineConfig({
  site: publicSite,
  base: process.env.GITHUB_PAGES === 'true' ? publicBase : '/',
  output: 'static'
});
