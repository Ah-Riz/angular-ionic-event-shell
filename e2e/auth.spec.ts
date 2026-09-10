import { expect, test } from '@playwright/test';
import {
  DEMO_EMAIL,
  clearSession,
  loginViaUi,
} from './helpers/auth';

test.describe('auth', () => {
  test('unauthenticated tabs redirect to login', async ({ page }) => {
    await clearSession(page);
    await page.goto('/tabs/home');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText('KonvergeEdge')).toBeVisible();
  });

  test('login enables CTA, lands on home with signed-in email', async ({
    page,
  }) => {
    await clearSession(page);
    await page.goto('/login');

    const enter = page.getByRole('button', { name: 'Enter conference' });
    await expect(enter).toBeDisabled();

    await page.getByLabel('Email').fill(DEMO_EMAIL);
    await expect(enter).toBeEnabled();
    await enter.click();

    await expect(page).toHaveURL(/\/tabs\/home/);
    await expect(page.getByText(`Signed in as ${DEMO_EMAIL}`)).toBeVisible();
  });

  test('logout returns to login and blocks tabs', async ({ page }) => {
    // Use UI login only — seedSession's init script would re-auth on next goto.
    await clearSession(page);
    await loginViaUi(page);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/tabs/agenda');
    await expect(page).toHaveURL(/\/login/);
  });

  test('loginViaUi helper reaches home', async ({ page }) => {
    await clearSession(page);
    await loginViaUi(page);
    await expect(page).toHaveURL(/\/tabs\/home/);
  });
});
