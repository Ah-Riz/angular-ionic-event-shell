import { Page } from '@playwright/test';

export const DEMO_EMAIL = 'demo@konverge.edge';
const STORAGE_KEY = 'konverge-edge-session';

/** Seed auth before any navigation (survives full page loads). */
export async function seedSession(
  page: Page,
  email = DEMO_EMAIL
): Promise<void> {
  await page.addInitScript(
    ({ key, value }) => {
      localStorage.setItem(key, value);
    },
    { key: STORAGE_KEY, value: JSON.stringify({ email }) }
  );
}

/** Clear auth before navigation. */
export async function clearSession(page: Page): Promise<void> {
  await page.addInitScript((key) => {
    localStorage.removeItem(key);
  }, STORAGE_KEY);
}

/** Full UI login from the login page. */
export async function loginViaUi(
  page: Page,
  email = DEMO_EMAIL
): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByRole('button', { name: 'Enter conference' }).click();
  await page.waitForURL('**/tabs/home');
}

/** Hit-test: element under the center of a selector must belong to that selector. */
export async function hitTargetInside(
  page: Page,
  selector: string
): Promise<string> {
  return page.evaluate((sel) => {
    const row = document.querySelector(sel);
    if (!row) {
      return 'missing';
    }
    const r = row.getBoundingClientRect();
    const el = document.elementFromPoint(
      r.left + r.width / 2,
      r.top + Math.min(24, r.height / 2)
    );
    if (!el) {
      return 'null';
    }
    if (el.closest(sel)) {
      return 'inside';
    }
    return el.tagName;
  }, selector);
}

/** Describe ion-router-outlet stack for the tabs click regression. */
export async function outletStack(page: Page): Promise<
  { kids: number; height: number; emptyCover: boolean }[]
> {
  return page.evaluate(() => {
    const vh = window.innerHeight;
    return Array.from(document.querySelectorAll('ion-router-outlet')).map(
      (o) => {
        const b = o.getBoundingClientRect();
        const kids = o.children.length;
        const coversViewport = b.height >= vh * 0.9 && b.width >= 100;
        return {
          kids,
          height: Math.round(b.height),
          emptyCover: coversViewport && kids === 0,
        };
      }
    );
  });
}
