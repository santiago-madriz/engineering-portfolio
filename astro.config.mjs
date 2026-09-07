import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://santiago-madriz.dev',
  base: process.env.GITHUB_PAGES === 'true' ? '/santiago-madriz.dev' : '/',
  output: 'static'
});
