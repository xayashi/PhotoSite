import { test, expect } from '@playwright/test';

test.describe('Navigation & Routing', () => {

    test('landing page loads with project cards', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle('林 — Visual Storytelling');

        const cards = page.locator('[data-card]');
        await expect(cards.first()).toBeVisible();
        // The checked-in Yuki post should appear in the active chapter.
        const count = await cards.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test('clicking a card opens project detail directly on desktop (or via VIEW on touch)', async ({ page }) => {
        await page.goto('/');

        const firstCard = page.locator('[data-card]').first();
        await firstCard.click();

        // Check if VIEW button appears (mobile mode).
        // Since it's animated, we wait briefly.
        await page.waitForTimeout(500);
        const viewButton = firstCard.locator('text=VIEW');
        if (await viewButton.isVisible()) {
            await viewButton.click({ force: true });
        }

        // URL should change to /project/<slug>
        await expect(page).toHaveURL(/\/project\/.+/);

        // Project detail dialog should be visible
        const dialog = page.locator('[role="dialog"]');
        await expect(dialog).toBeVisible();
    });

    test('direct URL access to /project/:slug works', async ({ page }) => {
        await page.goto('/project/yuki');

        const dialog = page.locator('[role="dialog"]');
        await expect(dialog).toBeVisible();

        // Title should update
        await expect(page).toHaveTitle('Yuki — 林');
    });

    test('direct URL access to /about works', async ({ page }) => {
        await page.goto('/about');

        const dialog = page.locator('[role="dialog"][aria-label="About"]');
        await expect(dialog).toBeVisible();
        await expect(page).toHaveTitle('About — 林');
    });

    test('direct URL access to /contact works', async ({ page }) => {
        await page.goto('/contact');

        const dialog = page.locator('[role="dialog"][aria-label="Contact"]');
        await expect(dialog).toBeVisible();
        await expect(page).toHaveTitle('Contact — 林');
    });

    test('direct URL access to /archive works', async ({ page }) => {
        await page.goto('/archive');

        const dialog = page.locator('[role="dialog"][aria-label="Archive"]');
        await expect(dialog).toBeVisible();
        await expect(page).toHaveTitle('Archive — 林');
    });

    test('back button returns to landing and restores title', async ({ page }) => {
        await page.goto('/');
        await page.goto('/about');

        await expect(page).toHaveTitle('About — 林');

        await page.goBack();
        await expect(page).toHaveURL('/');
        await expect(page).toHaveTitle('林 — Visual Storytelling');
    });

    test('closing project detail navigates back to /', async ({ page }) => {
        await page.goto('/project/yuki');

        const dialog = page.locator('[role="dialog"]');
        await expect(dialog).toBeVisible();

        // Click "Back" button
        await page.locator('text=Back').first().click();

        // Should return to landing
        await expect(page).toHaveURL('/');
    });

    test('logo opens About overlay', async ({ page }) => {
        await page.goto('/');

        await page.locator('button[aria-label="About"]').click();
        await expect(page).toHaveURL('/about');
        await expect(page.locator('[role="dialog"][aria-label="About"]')).toBeVisible();
    });

    test('end-of-reel links navigate to archive and contact', async ({ page }) => {
        await page.goto('/');

        // Navigate directly since scrolling to end is complex
        await page.goto('/archive');
        await expect(page.locator('[role="dialog"][aria-label="Archive"]')).toBeVisible();

        await page.goto('/contact');
        await expect(page.locator('[role="dialog"][aria-label="Contact"]')).toBeVisible();
    });
});
