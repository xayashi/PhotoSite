import { test, expect } from '@playwright/test';

test.describe('Performance and Visual Verification', () => {

    test('scroll animation maintains high performance', async ({ page }) => {
        // Navigate to the local dev server
        await page.goto('/');

        // Wait for initial images to load (OptimizedImage uses <picture> with opacity transition)
        await page.waitForSelector('[data-card] picture img');

        // Performance measurement: Check for long tasks during scroll
        const longTasks = await page.evaluate(async () => {
            const tasks = [];
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    tasks.push(entry);
                }
            });
            observer.observe({ entryTypes: ['longtask'] });

            // Simulate a series of scrolls
            for (let i = 0; i < 5; i++) {
                window.dispatchEvent(new WheelEvent('wheel', { deltaY: 500 }));
                await new Promise(r => setTimeout(r, 100));
            }

            await new Promise(r => setTimeout(r, 500));
            observer.disconnect();
            return tasks;
        });

        // We expect no "long tasks" (tasks > 50ms) during scroll on a modern machine
        // This indicates the animation loop is not blocking the main thread
        expect(longTasks.length).toBeLessThan(3);
    });

    test('mobile images preserve aspect ratio on Samsung A16 viewport', async ({ page }) => {
        // Set viewport to Samsung A16-like dimensions (approx 412x915)
        await page.setViewportSize({ width: 412, height: 915 });
        await page.goto('/');

        // Wait for the first project card
        const firstCard = page.locator('[data-card]').first();
        await expect(firstCard).toBeVisible();

        // Check the image inside the card
        const firstImage = firstCard.locator('img');
        const box = await firstImage.boundingBox();

        if (box) {
            const aspectRatio = box.width / box.height;

            // With our fix (aspect-ratio: 4/5), the ratio should be around 0.8
            // Stretched images would have much smaller/larger ratios
            console.log(`Mobile Image Aspect Ratio: ${aspectRatio}`);
            expect(aspectRatio).toBeGreaterThan(0.5);
            expect(aspectRatio).toBeLessThan(1.2);
        }
    });

    test('no excessive re-renders (checking for duplicate cursor)', async ({ page }) => {
        await page.goto('/');

        // Check if only one CustomCursor is present
        const cursors = await page.locator('[data-cursor-container]').count();
        expect(cursors).toBe(1);
    });

    // ============================================
    // Mobile Performance Regression Tests
    // ============================================

    test('film grain is hidden on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/');

        const filmGrainDisplay = await page.evaluate(() => {
            const bodyAfter = window.getComputedStyle(document.body, '::after');
            return bodyAfter.display;
        });

        expect(filmGrainDisplay).toBe('none');
    });

    test('archive only expands first chapter by default', async ({ page }) => {
        await page.goto('/archive');
        await page.waitForTimeout(500);

        // First chapter should be expanded
        const firstChapterButton = page.locator('button[aria-expanded]').first();
        await expect(firstChapterButton).toHaveAttribute('aria-expanded', 'true');

        // If there are more chapters, they should be collapsed
        const chapterButtons = page.locator('button[aria-expanded]');
        const count = await chapterButtons.count();
        if (count > 1) {
            const secondChapterButton = chapterButtons.nth(1);
            await expect(secondChapterButton).toHaveAttribute('aria-expanded', 'false');
        }
    });

    test('ProjectDetail does not use background-attachment: fixed', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(300);

        // Click the first card to open it
        const firstCard = page.locator('[data-card]').first();
        await firstCard.click();
        await page.waitForTimeout(200);

        // Click the VIEW button
        const viewButton = page.locator('text=VIEW').first();
        await viewButton.click();
        await page.waitForTimeout(800);

        // Check the project detail dialog
        const dialog = page.locator('[role="dialog"]');
        const bgAttachment = await dialog.evaluate(el => {
            return window.getComputedStyle(el).backgroundAttachment;
        });

        expect(bgAttachment).not.toBe('fixed');
    });

    test('overlay transition completes within 600ms on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/');
        await page.waitForTimeout(500);

        // Click first card then VIEW
        const firstCard = page.locator('[data-card]').first();
        await firstCard.click();
        await page.waitForTimeout(200);
        const viewButton = page.locator('text=VIEW').first();
        await viewButton.click();

        const start = Date.now();

        // Wait for the overlay to be fully visible (opacity: 1, translateY: 0)
        await page.waitForSelector('[role="dialog"].translate-y-0', { timeout: 2000 });

        const elapsed = Date.now() - start;
        expect(elapsed).toBeLessThan(600);
    });
});
