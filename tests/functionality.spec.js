import { test, expect } from '@playwright/test';

test.describe('Functionality', () => {

    test.describe('SEO & Meta Tags', () => {

        test('index.html has Open Graph tags', async ({ page }) => {
            await page.goto('/');

            const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
            expect(ogTitle).toBe('林 — Visual Storytelling');

            const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
            expect(ogDesc).toBeTruthy();

            const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
            expect(ogImage).toContain('http');

            const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
            expect(ogType).toBe('website');
        });

        test('index.html has Twitter Card tags', async ({ page }) => {
            await page.goto('/');

            const card = await page.locator('meta[name="twitter:card"]').getAttribute('content');
            expect(card).toBe('summary_large_image');

            const title = await page.locator('meta[name="twitter:title"]').getAttribute('content');
            expect(title).toBeTruthy();
        });

        test('canonical link is present', async ({ page }) => {
            await page.goto('/');

            const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
            expect(canonical).toContain('http');
        });

        test('dynamic titles update per route', async ({ page }) => {
            await page.goto('/');
            await expect(page).toHaveTitle('林 — Visual Storytelling');

            await page.goto('/about');
            await expect(page).toHaveTitle('About — 林');

            await page.goto('/contact');
            await expect(page).toHaveTitle('Contact — 林');

            await page.goto('/archive');
            await expect(page).toHaveTitle('Archive — 林');

            await page.goto('/project/mono');
            await expect(page).toHaveTitle('Mono — 林');
        });
    });

    test.describe('Share Button', () => {

        test('share button copies link on desktop (clipboard fallback)', async ({ page, context }) => {
            // Grant clipboard permissions
            await context.grantPermissions(['clipboard-read', 'clipboard-write']);

            await page.goto('/project/mono');
            await expect(page.locator('[role="dialog"]')).toBeVisible();

            // Click share
            await page.locator('text=Share').click();

            // "Link copied" toast should appear
            const toast = page.locator('text=Link copied');
            await expect(toast).toBeVisible();

            // Clipboard should contain the current URL
            const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
            expect(clipboardText).toContain('/project/mono');
        });
    });

    test.describe('Project Detail', () => {

        test('legacy project renders cover, title, description, and images', async ({ page }) => {
            await page.goto('/project/mono');

            const dialog = page.locator('[role="dialog"]');
            await expect(dialog).toBeVisible();

            // Hero title
            await expect(dialog.locator('h1')).toContainText('Mono');

            // Subtitle (appears in both hero and footer, use first)
            await expect(dialog.locator('text=Tokyo, 2024').first()).toBeVisible();

            // Description section
            await expect(dialog.locator('text=About the Series')).toBeVisible();

            // Gallery images should exist
            const images = dialog.locator('.space-y-16 img, .space-y-24 img');
            const count = await images.count();
            expect(count).toBeGreaterThan(0);
        });

        test('legacy project lightbox opens on image click', async ({ page }) => {
            await page.goto('/project/mono');

            const dialog = page.locator('[role="dialog"]');
            await expect(dialog).toBeVisible();

            // Click first gallery image
            const firstImage = dialog.locator('.space-y-16 .cursor-pointer, .space-y-24 .cursor-pointer').first();
            await firstImage.click();

            // Lightbox should appear (portal on body)
            const lightbox = page.locator('[aria-label="Image viewer"]');
            await expect(lightbox).toBeVisible();

            // Close with Escape
            await page.keyboard.press('Escape');
            await expect(lightbox).not.toBeVisible();
        });

        test('back to top button scrolls up', async ({ page }) => {
            await page.goto('/project/lumina');

            const dialog = page.locator('[role="dialog"]');
            await expect(dialog).toBeVisible();

            // Scroll down in the detail overlay
            const scrollContainer = dialog.locator('.overflow-y-auto');
            await scrollContainer.evaluate(el => el.scrollTop = el.scrollHeight);

            // Click back to top
            await page.locator('text=Back to Top').click();

            // Wait for smooth scroll animation to complete
            await page.waitForTimeout(1500);

            const scrollTop = await scrollContainer.evaluate(el => el.scrollTop);
            expect(scrollTop).toBeLessThan(400);
        });
    });

    test.describe('Archive', () => {

        test('archive shows chapters with posts', async ({ page }) => {
            await page.goto('/archive');

            const dialog = page.locator('[role="dialog"][aria-label="Archive"]');
            await expect(dialog).toBeVisible();

            // Should have chapter headers
            const chapters = dialog.locator('button[aria-expanded]');
            const chapterCount = await chapters.count();
            expect(chapterCount).toBeGreaterThan(0);

            // Posts should be visible (chapters expanded by default)
            const postButtons = dialog.locator('ul li button');
            const postCount = await postButtons.count();
            expect(postCount).toBeGreaterThan(0);
        });

        test('clicking archive post navigates to project', async ({ page }) => {
            await page.goto('/archive');

            const dialog = page.locator('[role="dialog"][aria-label="Archive"]');
            await expect(dialog).toBeVisible();

            // Click first post
            const firstPost = dialog.locator('ul li button').first();
            await firstPost.click();

            // Should navigate to a project URL
            await expect(page).toHaveURL(/\/project\/.+/);
        });

        test('chapter toggle collapses and expands', async ({ page }) => {
            await page.goto('/archive');

            const dialog = page.locator('[role="dialog"][aria-label="Archive"]');
            // Target by aria-controls to get a stable reference
            const chapterBtn = dialog.locator('button[aria-controls="chapter-0"]');
            await expect(chapterBtn).toHaveAttribute('aria-expanded', 'true');

            // Collapse
            await chapterBtn.click();
            await expect(chapterBtn).toHaveAttribute('aria-expanded', 'false');

            // Expand
            await chapterBtn.click();
            await expect(chapterBtn).toHaveAttribute('aria-expanded', 'true');
        });
    });

    test.describe('Landing Page', () => {

        // Removed 'progress bar exists' test because the progress bar was removed based on feedback

        test('scroll hint visible on desktop', async ({ page }) => {
            await page.goto('/');
            await expect(page.locator('text=Scroll to Explore')).toBeVisible();
        });

        test('custom cursor exists on desktop', async ({ page }) => {
            await page.goto('/');

            const cursor = page.locator('[data-cursor-container]');
            await expect(cursor).toBeAttached();
        });
    });
});
