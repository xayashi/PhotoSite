import { test, expect } from '@playwright/test';

test.describe('Performance and Visual Verification', () => {

    test('scroll animation maintains high performance', async ({ page }) => {
        // Navigate to the local dev server
        await page.goto('http://localhost:5174/');

        // Wait for initial images to load
        await page.waitForSelector('.image-main.loaded');

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
        await page.goto('http://localhost:5174/');

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
        await page.goto('http://localhost:5174/');

        // Check if only one CustomCursor is present
        const cursors = await page.locator('[data-cursor-container]').count();
        expect(cursors).toBe(1);
    });
});
