import { defineConfig, devices } from '@playwright/test';

// Real-browser E2E across a device matrix: each project emulates a device profile (UA + touch + viewport) against both example apps — CSR (Vite, :3001) and SSR (Next.js, :3002).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'iphone', use: { ...devices['iPhone 15'] } },
    { name: 'ipad', use: { ...devices['iPad Pro 11'] } },
    { name: 'galaxy-s24', use: { ...devices['Galaxy S24'] } },
    {
      name: 'galaxy-tab-s9',
      // Playwright derives Sec-CH-UA-Mobile/userAgentData.mobile from its isMobile flag, but real Android tablets report mobile=false per the UA-CH spec (the mobile hint mirrors the UA 'Mobile' token). isMobile:false reproduces the real signal.
      use: { ...devices['Galaxy Tab S9'], isMobile: false },
    },
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'desktop-safari', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: [
    {
      command: 'pnpm --dir examples/basic install && pnpm --dir examples/basic dev',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command:
        'pnpm --dir examples/nextjs install && pnpm --dir examples/nextjs build && pnpm --dir examples/nextjs start',
      url: 'http://localhost:3002',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
});
