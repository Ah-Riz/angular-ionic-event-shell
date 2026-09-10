import { expect, test } from '@playwright/test';
import { seedSession } from './helpers/auth';

test.describe('UI continuity', () => {
  test.beforeEach(async ({ page }) => {
    await seedSession(page);
  });

  test('home uses h2 section head and timeline-lite today rows', async ({
    page,
  }) => {
    await page.goto('/tabs/home');
    await expect(page.locator('.section-head h2')).toHaveCount(1);
    await expect(page.locator('.section-head h3')).toHaveCount(0);

    const today = page.locator('.today-row').first();
    await expect(today).toBeVisible();
    await expect(today).not.toHaveClass(/ef-surface/);
  });

  test('session related rows are non-card; speakers use two initials', async ({
    page,
  }) => {
    await page.goto('/session/s1');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const related = page.locator('.related-row').first();
    await expect(related).toBeVisible();
    await expect(related).not.toHaveClass(/ef-surface/);

    const initials = (await page.locator('.speaker .ef-avatar').first().innerText()).trim();
    expect(initials.length).toBe(2);
    expect(initials).toMatch(/^[A-Z]{2}$/);
  });

  test('cold session load does not flash not-found before title', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      (window as unknown as { __keSawNotFound?: boolean }).__keSawNotFound =
        false;
      const mark = () => {
        const text = document.body?.innerText ?? '';
        if (text.includes('Session not found')) {
          (window as unknown as { __keSawNotFound?: boolean }).__keSawNotFound =
            true;
        }
      };
      const start = () => {
        mark();
        const obs = new MutationObserver(mark);
        if (document.body) {
          obs.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
          });
        }
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
      } else {
        start();
      }
    });

    await page.goto('/session/s1');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.empty-state')).toHaveCount(0);

    const sawNotFound = await page.evaluate(
      () =>
        (window as unknown as { __keSawNotFound?: boolean }).__keSawNotFound ===
        true
    );
    expect(sawNotFound).toBe(false);
  });

  test('invalid session empty state uses text-action', async ({ page }) => {
    await page.goto('/session/does-not-exist');
    const empty = page.locator('.empty-state');
    await expect(empty).toBeVisible();
    await expect(empty.locator('.text-action')).toBeVisible();
    await expect(empty.locator('ion-button')).toHaveCount(0);
  });

  test('attendee profile shows industry chip without company duplicate', async ({
    page,
  }) => {
    await page.goto('/attendee/a1');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Maya Chen'
    );

    const company = (await page.locator('.company').innerText()).trim();
    expect(company).toBe('Northwind Events');
    expect(company).not.toContain('·');

    await expect(page.locator('.profile-card .chip')).toHaveCount(1);
    await expect(page.locator('.profile-card .chip')).toContainText(
      'Event Tech'
    );
  });

  test('agenda descriptions are clamped to two lines', async ({ page }) => {
    await page.goto('/tabs/agenda');
    await expect(page.locator('.session-row .desc').first()).toBeVisible();

    const clamp = await page
      .locator('.session-row .desc')
      .first()
      .evaluate((el) => getComputedStyle(el).webkitLineClamp);
    expect(clamp).toBe('2');
  });
});
