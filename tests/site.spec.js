import { test, expect } from '@playwright/test';

test('home communicates positioning and featured work', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Santiago Madriz/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Software built');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Techy' })).toBeVisible();
  await expect(page.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/santiago-madriz');
});

test('all internal navigation targets resolve', async ({ page, request }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href')))]);
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.ok(), `Expected ${href} to resolve`).toBeTruthy();
  }
});

test('project and writing indexes expose real detail pages', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('.project-card')).toHaveCount(4);
  await page.goto('/writing');
  await expect(page.locator('.writing-item')).toHaveCount(2);
});

test('layout has no horizontal overflow', async ({ page }) => {
  for (const path of ['/', '/projects', '/projects/techy', '/writing', '/about']) {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(dimensions.scroll, `${path} should not overflow`).toBe(dimensions.client);
  }
});
