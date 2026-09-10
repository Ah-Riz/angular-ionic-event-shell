import { expect, test } from '@playwright/test';
import {
  hitTargetInside,
  outletStack,
  seedSession,
} from './helpers/auth';

test.describe('tabs pointer hit-testing', () => {
  test.beforeEach(async ({ page }) => {
    await seedSession(page);
  });

  test('agenda has no empty covering outlet and rows receive clicks', async ({
    page,
  }) => {
    await page.goto('/tabs/agenda');
    await expect(page.locator('.session-row').first()).toBeVisible();

    const stack = await outletStack(page);
    expect(stack.length).toBeGreaterThanOrEqual(2);
    expect(stack.some((o) => o.emptyCover)).toBe(false);

    expect(await hitTargetInside(page, '.session-row')).toBe('inside');

    await page.locator('.session-row').first().click();
    await expect(page).toHaveURL(/\/session\//);
  });

  test('home today rows receive clicks (not stolen by outlet)', async ({
    page,
  }) => {
    await page.goto('/tabs/home');
    await expect(page.locator('.today-row').first()).toBeVisible();

    const stack = await outletStack(page);
    expect(stack.some((o) => o.emptyCover)).toBe(false);
    expect(await hitTargetInside(page, '.today-row')).toBe('inside');

    await page.locator('.today-row').first().click();
    await expect(page).toHaveURL(/\/session\//);
  });
});
