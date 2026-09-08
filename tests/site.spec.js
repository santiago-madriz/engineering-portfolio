import { test, expect } from '@playwright/test';

test('home communicates positioning and featured work', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Santiago Madriz/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Software built');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAttribute('data-typed', 'complete');
  await expect(page.locator('.typewriter-caret')).toHaveCSS('animation-name', 'typewriter-caret');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Techy' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Software Engineer II' })).toBeVisible();
  await expect(page.getByText('Costa Rica · Available for opportunities')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/santiago-madriz');
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.ambient-motion')).toHaveCount(1);
  await expect(page.getByRole('img', { name: 'Interactive 3D laptop with a modern wallpaper, rotating through a full turn while scrolling' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Impact, measured.' })).toBeVisible();
  await expect(page.getByText('99.5%')).toHaveCount(0);
  await expect(page.getByText('80%')).toBeVisible();
  await expect(page.locator('.impact-bars .impact-card')).toHaveCount(3);
  const actionLayout = await page.evaluate(() => {
    const github = [...document.querySelectorAll('a')].find((link) => link.textContent?.includes('GitHub')).getBoundingClientRect();
    const laptop = document.querySelector('[data-laptop-model]').getBoundingClientRect();
    return { githubRight: github.right, githubHeight: github.height, laptopLeft: laptop.left, laptopHeight: laptop.height };
  });
  expect(actionLayout.laptopLeft).toBeGreaterThan(actionLayout.githubRight);
  expect(actionLayout.laptopLeft - actionLayout.githubRight).toBeLessThanOrEqual(12);
  expect(Math.abs(actionLayout.laptopHeight - actionLayout.githubHeight)).toBeLessThanOrEqual(2);
});

test('content enters smoothly throughout the page', async ({ page }) => {
  await page.goto('/');
  const entranceElements = page.locator('[data-enter]');
  expect(await entranceElements.count()).toBeGreaterThan(35);
  await expect(page.getByRole('heading', { level: 1 })).toHaveClass(/entered/);
  await expect(page.getByRole('link', { name: 'View selected work' })).toHaveCSS('transition-duration', /0\.72s/);

  await page.getByRole('heading', { name: /Real work/ }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: /Real work/ })).toHaveClass(/entered/);
  await page.getByRole('heading', { name: 'Techy' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'Techy' })).toHaveClass(/entered/);
});

test('skip link stays hidden during touch-style scrolling and appears for keyboard navigation', async ({ page }) => {
  await page.goto('/');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(skipLink).toHaveCSS('opacity', '0');
  await expect(skipLink).toHaveCSS('pointer-events', 'none');
  if ((page.viewportSize()?.width ?? 999) <= 620) return;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveCSS('opacity', '1');
});

test('laptop responds to scroll and preserves reduced-motion preferences', async ({ page }) => {
  await page.goto('/');
  const laptop = page.locator('[data-laptop-model]');
  await expect(laptop).toHaveAttribute('data-rotation', '0');
  await expect(laptop.locator('canvas')).toBeVisible();
  await expect(laptop).toHaveClass(/model-loaded/, { timeout: 15000 });
  await laptop.evaluate((element) => {
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, window.innerWidth <= 620 ? top + element.clientHeight : 800);
  });
  await expect(laptop).toHaveAttribute('data-rotation', '360');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(laptop).toHaveAttribute('data-rotation', '0');
  await page.evaluate(() => window.scrollTo(0, 800));
  await expect(laptop).toHaveAttribute('data-rotation', '0');
});

test('primary navigation identifies the current section', async ({ page }) => {
  for (const [path, label] of [['/projects', 'Work'], ['/projects/techy', 'Work'], ['/experience', 'Experience'], ['/credentials', 'Credentials']]) {
    await page.goto(path);
    await expect(page.getByRole('link', { name: label, exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('nav[aria-label="Primary navigation"] a[aria-current="page"]')).toHaveCount(1);
  }
});

test('all internal navigation targets resolve', async ({ page, request }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href')))]);
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.ok(), `Expected ${href} to resolve`).toBeTruthy();
  }
});

test('work, experience, and credentials are exposed', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('.project-card')).toHaveCount(5);
  await expect(page.locator('.project-preview')).toHaveCount(5);
  await page.goto('/experience');
  await expect(page.locator('.career-role')).toHaveCount(5);
  await page.goto('/credentials');
  await expect(page.locator('.teaching-preview')).toHaveCount(2);
  await expect(page.locator('.teaching-preview img')).toHaveCount(2);
  await expect(page.getByRole('link', { name: /AI for Everyone teaching post/ })).toHaveAttribute('href', 'https://lnkd.in/p/eF3dfbv8');
  await expect(page.getByRole('link', { name: /Communication in Tech workshop post/ })).toHaveAttribute('href', 'https://lnkd.in/p/e3vPtWsC');
  await expect(page.locator('.credential-card')).toHaveCount(3);
  await expect(page.getByRole('link', { name: /View work experience/ })).toHaveAttribute('href', '/experience');
});

test('experience dates stay clear of the active timeline accent', async ({ page }) => {
  await page.goto('/experience');
  const role = page.locator('.career-role').first();
  await role.hover();
  const spacing = await role.evaluate((element) => {
    const roleBox = element.getBoundingClientRect();
    const timeBox = element.querySelector('time').getBoundingClientRect();
    return timeBox.left - roleBox.left;
  });
  expect(spacing).toBeGreaterThanOrEqual(15.5);
});

test('home experience dates stay clear of the featured banner edge', async ({ page }) => {
  await page.goto('/');
  const role = page.locator('.experience-item').first();
  const spacing = await role.locator('time').evaluate((element) => parseFloat(getComputedStyle(element).paddingLeft));
  expect(spacing).toBeGreaterThanOrEqual(16);
});

test('layout has no horizontal overflow', async ({ page }) => {
  for (const path of ['/', '/projects', '/projects/techy', '/projects/galeria-mexicana', '/experience', '/credentials']) {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(dimensions.scroll, `${path} should not overflow`).toBe(dimensions.client);
  }
});

test('mobile header uses two balanced rows', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 999) > 620, 'Mobile layout assertion');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const layout = await page.evaluate(() => {
    const brand = document.querySelector('.brand').getBoundingClientRect();
    const cta = document.querySelector('.header-cta').getBoundingClientRect();
    const nav = document.querySelector('.site-header nav').getBoundingClientRect();
    return {
      brandTop: brand.top,
      ctaTop: cta.top,
      firstRowBottom: Math.max(brand.bottom, cta.bottom),
      navTop: nav.top,
      navWidth: nav.width,
      headerWidth: document.querySelector('.site-header').getBoundingClientRect().width
    };
  });
  expect(Math.abs(layout.brandTop - layout.ctaTop)).toBeLessThanOrEqual(4);
  expect(layout.navTop).toBeGreaterThan(layout.firstRowBottom);
  expect(Math.abs(layout.navWidth - layout.headerWidth)).toBeLessThanOrEqual(1);
});

test('mobile engineering workflow cards never overlap', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 999) > 620, 'Mobile layout assertion');
  await page.goto('/');
  const cards = await page.locator('.system-card').evaluateAll((items) => items.map((item) => {
    const rect = item.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom };
  }));
  expect(cards).toHaveLength(3);
  expect(cards[0].bottom).toBeLessThanOrEqual(cards[1].top);
  expect(cards[1].bottom).toBeLessThanOrEqual(cards[2].top);
});

test('case-study links appear before the technical content', async ({ page }) => {
  for (const path of ['/projects/techy', '/projects/galeria-mexicana', '/projects/spanish-sentiment-lab', '/projects/photography-platform', '/projects/playwright-quality-engineering']) {
    await page.goto(path);
    const links = page.locator('header.page-intro + .case-links');
    await expect(links, `${path} should expose links immediately after its intro`).toBeVisible();
    await expect(links.locator('a').first()).toBeVisible();
  }
});
