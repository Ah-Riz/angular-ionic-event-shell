import { expect, test } from '@playwright/test';
import { seedSession } from './helpers/auth';

test.describe('navigation flows', () => {
  test.beforeEach(async ({ page }) => {
    await seedSession(page);
  });

  test('tab bar switches Home / Agenda / Attendees', async ({ page }) => {
    await page.goto('/tabs/home');
    await expect(page.getByRole('tab', { name: 'Home' })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    await page.getByRole('tab', { name: 'Agenda' }).click();
    await expect(page).toHaveURL(/\/tabs\/agenda/);
    await expect(page.getByRole('tab', { name: 'Agenda' })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    await page.getByRole('tab', { name: 'Attendees' }).click();
    await expect(page).toHaveURL(/\/tabs\/attendees/);
    await expect(page.getByRole('tab', { name: 'Attendees' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  test('home up-next and tiles navigate', async ({ page }) => {
    await page.goto('/tabs/home');
    await expect(page.locator('.up-next')).toBeVisible();

    await page.getByRole('link', { name: 'Full agenda' }).click();
    await expect(page).toHaveURL(/\/tabs\/agenda/);

    await page.goto('/tabs/home');
    await page.getByRole('link', { name: 'Attendees' }).click();
    await expect(page).toHaveURL(/\/tabs\/attendees/);

    await page.goto('/tabs/home');
    await page.locator('.up-next').click();
    await expect(page).toHaveURL(/\/session\//);
  });

  test('agenda day segment, bookmark, and session open', async ({ page }) => {
    await page.goto('/tabs/agenda');
    await expect(page.locator('.session-row').first()).toBeVisible();

    const segments = page.locator('ion-segment-button');
    const count = await segments.count();
    expect(count).toBeGreaterThan(1);

    await segments.nth(1).click();
    await expect(page.locator('.session-row').first()).toBeVisible();

    const firstRow = page.locator('.session-row').first();
    const bookmark = firstRow.locator('.bookmark-btn');
    await bookmark.click();
    await expect(page).toHaveURL(/\/tabs\/agenda/);
    await expect(bookmark.locator('ion-icon')).toHaveAttribute(
      'name',
      'bookmark'
    );

    await firstRow.click();
    await expect(page).toHaveURL(/\/session\//);
  });

  test('session speakers, related, and back', async ({ page }) => {
    await page.goto('/session/s1');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.locator('.speaker').first().click();
    await expect(page).toHaveURL(/\/attendee\//);
    await page.goBack();
    await expect(page).toHaveURL(/\/session\/s1/);

    const related = page.locator('.related-row').first();
    await expect(related).toBeVisible();
    await related.click();
    await expect(page).toHaveURL(/\/session\/(?!s1)/);

    await page.locator('ion-back-button').click();
    await expect(page).toHaveURL(/\/(session\/|tabs\/)/);
  });

  test('attendees filter, search, detail, and meeting toast', async ({
    page,
  }) => {
    await page.goto('/tabs/attendees');
    await expect(page.locator('.attendee-card').first()).toBeVisible();
    const before = await page.locator('.attendee-card').count();

    const saas = page.locator('.industry-chip', { hasText: 'SaaS' });
    await saas.scrollIntoViewIfNeeded();
    await saas.click();
    await expect
      .poll(async () => page.locator('.attendee-card').count())
      .toBeLessThan(before);

    await page.locator('.industry-chip', { hasText: 'All' }).click();
    await page.locator('ion-searchbar input').fill('Maya');
    await expect(page.locator('.attendee-card')).toHaveCount(1);

    await page.locator('.attendee-card').first().click();
    await expect(page).toHaveURL(/\/attendee\//);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Maya');

    await page.getByRole('button', { name: 'Request meeting' }).click();
    const alert = page.locator('ion-alert');
    await expect(alert).toBeVisible();
    await alert.locator('button', { hasText: 'Request meeting' }).click();
    await expect(page.locator('ion-toast')).toBeVisible({ timeout: 15_000 });
  });
});
