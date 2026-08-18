import { expect, test } from '@playwright/test';

const CSR_URL = 'http://localhost:3001';
const SSR_URL = 'http://localhost:3002';

interface Expectation {
  type: 'mobile' | 'tablet' | 'desktop';
  // os is asserted only where the emulated UA pins it (desktop-chrome's os depends on the host machine).
  os?: string;
  touch?: boolean;
}

// The ratio is whatever the emulated device reports, so it is read from the descriptor instead of being duplicated here. The matrix covers 1, 2, 2.5 and 3.
const expectedDpr = (testInfo: {
  project: { use: { deviceScaleFactor?: number } };
}) => String(testInfo.project.use.deviceScaleFactor ?? 1);

const EXPECTATIONS: Record<string, Expectation> = {
  iphone: { type: 'mobile', os: 'ios', touch: true },
  ipad: { type: 'tablet', os: 'ios', touch: true },
  'galaxy-s24': { type: 'mobile', os: 'android', touch: true },
  'galaxy-tab-s9': { type: 'tablet', os: 'android', touch: true },
  'desktop-chrome': { type: 'desktop', touch: false },
  'desktop-safari': { type: 'desktop', os: 'macos', touch: false },
};

test.describe('CSR example (Vite)', () => {
  test('detects the emulated device from the first render', async ({
    page,
  }, testInfo) => {
    const expected = EXPECTATIONS[testInfo.project.name];
    await page.goto(CSR_URL);

    await expect(page.getByTestId('type')).toHaveText(expected.type);
    if (expected.os) {
      await expect(page.getByTestId('os')).toHaveText(expected.os);
    }
    if (expected.touch !== undefined) {
      await expect(page.getByTestId('isTouchPrimary')).toHaveText(
        String(expected.touch)
      );
    }
    await expect(page.getByTestId('dpr')).toHaveText(expectedDpr(testInfo));
    // Pure CSR: hydration flag is true immediately (no server involved).
    await expect(page.getByTestId('isHydrated')).toHaveText('true');
  });
});

test.describe('SSR example (Next.js)', () => {
  test('server HTML carries the safe default before any JS runs', async ({
    request,
  }) => {
    const response = await request.get(SSR_URL);
    const html = await response.text();
    // The raw server response must render the frozen server snapshot regardless of the requesting device.
    expect(html).toMatch(/data-testid="type"[^>]*>desktop</);
    expect(html).toMatch(/data-testid="os"[^>]*>unknown</);
    expect(html).toMatch(/data-testid="isHydrated"[^>]*>false</);
    // The ratio is unknowable server-side, so the server always sends the CSS pixel baseline.
    expect(html).toMatch(/data-testid="dpr"[^>]*>1</);
  });

  test('hydrates to the real device with zero hydration errors', async ({
    page,
  }, testInfo) => {
    const expected = EXPECTATIONS[testInfo.project.name];

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(String(err)));

    await page.goto(SSR_URL);

    // The post-hydration correction render must land on the real values.
    await expect(page.getByTestId('isHydrated')).toHaveText('true');
    await expect(page.getByTestId('type')).toHaveText(expected.type);
    if (expected.os) {
      await expect(page.getByTestId('os')).toHaveText(expected.os);
    }

    await expect(page.getByTestId('dpr')).toHaveText(expectedDpr(testInfo));

    // The first-paint capture proves what the server rendered.
    await expect(page.getByTestId('first-type')).toHaveText('desktop');
    await expect(page.getByTestId('first-dpr')).toHaveText('1');
    await expect(page.getByTestId('first-isHydrated')).toHaveText('false');

    // React logs hydration mismatches via console.error, and there must be none.
    const hydrationIssues = [...consoleErrors, ...pageErrors].filter((text) =>
      /hydrat|did not match|mismatch/i.test(text)
    );
    expect(hydrationIssues).toEqual([]);
  });
});

test.describe('reactivity contract', () => {
  test('orientation updates on viewport rotation while type/os stay static', async ({
    page,
  }, testInfo) => {
    const expected = EXPECTATIONS[testInfo.project.name];
    await page.goto(CSR_URL);

    const viewport = page.viewportSize();
    test.skip(!viewport, 'viewport size unavailable');
    const { width, height } = viewport!;
    const portraitFirst = height >= width;

    await expect(page.getByTestId('orientation')).toHaveText(
      portraitFirst ? 'portrait' : 'landscape'
    );

    // Rotate: swap viewport dimensions and the matchMedia listener must fire.
    await page.setViewportSize({ width: height, height: width });
    await expect(page.getByTestId('orientation')).toHaveText(
      portraitFirst ? 'landscape' : 'portrait'
    );

    // Device identity is session-static by contract, so rotation must not change it.
    await expect(page.getByTestId('type')).toHaveText(expected.type);
    // The ratio tracks display density, not viewport size, so resizing must not move it either.
    await expect(page.getByTestId('dpr')).toHaveText(expectedDpr(testInfo));
  });
});
