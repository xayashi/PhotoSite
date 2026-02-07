import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {

    test('landing page has correct landmarks and sr-only heading', async ({ page }) => {
        await page.goto('/');

        // <main> landmark exists
        await expect(page.locator('main')).toBeVisible();

        // sr-only <h1> with site name
        const h1 = page.locator('h1.sr-only');
        await expect(h1).toHaveCount(1);
        await expect(h1).toContainText('林');

        // Main navigation has aria-label
        const nav = page.locator('nav[aria-label="Main navigation"]');
        await expect(nav).toBeAttached();
    });

    test('cards are keyboard accessible', async ({ page }) => {
        await page.goto('/');

        const firstCard = page.locator('[data-card]').first();

        // Cards have role="button" and tabIndex
        await expect(firstCard).toHaveAttribute('role', 'button');
        await expect(firstCard).toHaveAttribute('tabindex', '0');

        // Card has an aria-label
        const label = await firstCard.getAttribute('aria-label');
        expect(label).toBeTruthy();
        expect(label).toContain('—');
    });

    test('overlay dialogs have correct ARIA attributes', async ({ page }) => {
        // About
        await page.goto('/about');
        const aboutDialog = page.locator('[role="dialog"][aria-label="About"]');
        await expect(aboutDialog).toHaveAttribute('aria-modal', 'true');

        // Contact
        await page.goto('/contact');
        const contactDialog = page.locator('[role="dialog"][aria-label="Contact"]');
        await expect(contactDialog).toHaveAttribute('aria-modal', 'true');

        // Archive
        await page.goto('/archive');
        const archiveDialog = page.locator('[role="dialog"][aria-label="Archive"]');
        await expect(archiveDialog).toHaveAttribute('aria-modal', 'true');
    });

    test('project detail dialog has ARIA attributes', async ({ page }) => {
        await page.goto('/project/mono');

        const dialog = page.locator('[role="dialog"][aria-modal="true"]');
        await expect(dialog).toBeVisible();

        const label = await dialog.getAttribute('aria-label');
        expect(label).toBe('Mono');
    });

    test('close buttons have aria-label', async ({ page }) => {
        await page.goto('/about');

        const closeBtn = page.locator('button[aria-label="Close"]');
        await expect(closeBtn).toBeVisible();
    });

    test('Escape key closes project detail overlay', async ({ page }) => {
        await page.goto('/project/mono');
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        await page.keyboard.press('Escape');
        // ProjectDetail has a 600ms fade-out animation before navigating
        await expect(page).toHaveURL('/', { timeout: 10000 });
    });

    test('focus trap keeps Tab within About overlay', async ({ page }) => {
        await page.goto('/about');
        await expect(page.locator('[role="dialog"][aria-label="About"]')).toBeVisible();

        // Tab repeatedly and verify focus stays within the dialog
        for (let i = 0; i < 10; i++) {
            await page.keyboard.press('Tab');
        }

        // Focused element should still be inside the dialog
        const focusedInDialog = await page.evaluate(() => {
            const dialog = document.querySelector('[role="dialog"][aria-label="About"]');
            return dialog?.contains(document.activeElement) ?? false;
        });
        expect(focusedInDialog).toBe(true);
    });

    test('focus trap keeps Tab within Contact overlay', async ({ page }) => {
        await page.goto('/contact');
        await expect(page.locator('[role="dialog"][aria-label="Contact"]')).toBeVisible();

        for (let i = 0; i < 10; i++) {
            await page.keyboard.press('Tab');
        }

        const focusedInDialog = await page.evaluate(() => {
            const dialog = document.querySelector('[role="dialog"][aria-label="Contact"]');
            return dialog?.contains(document.activeElement) ?? false;
        });
        expect(focusedInDialog).toBe(true);
    });

    test('archive chapter toggles have aria-expanded and aria-controls', async ({ page }) => {
        await page.goto('/archive');

        const chapterBtn = page.locator('button[aria-expanded]').first();
        await expect(chapterBtn).toBeAttached();

        const controls = await chapterBtn.getAttribute('aria-controls');
        expect(controls).toBeTruthy();

        // The controlled element should exist
        const controlled = page.locator(`#${controls}`);
        await expect(controlled).toBeAttached();
    });

    test('archive posts use semantic list markup', async ({ page }) => {
        await page.goto('/archive');

        // Posts should be in <ul> > <li>
        const list = page.locator('[role="dialog"] ul');
        await expect(list.first()).toBeAttached();

        const items = list.first().locator('li');
        const count = await items.count();
        expect(count).toBeGreaterThan(0);
    });
});
