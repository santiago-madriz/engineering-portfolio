import { defineConfig, devices } from '@playwright/test';
const baseURL = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:4321';

export default defineConfig({
  testDir: './tests',
  use: { baseURL, trace: 'on-first-retry', screenshot: 'only-on-failure' },
  webServer: { command: 'npm run dev -- --host 127.0.0.1', url: baseURL, reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } }
  ]
});
