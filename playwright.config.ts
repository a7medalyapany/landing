import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import 'dotenv/config'

import { pointToTestDatabase } from './tests/helpers/pointToTestDatabase'

// The e2e dev server and the seed helpers both inherit this, so they share the test DB.
pointToTestDatabase()

// Its own port, so it never collides with your `pnpm dev` on :3000.
const PORT = 3001
const baseURL = `http://localhost:${PORT}`

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    // Never reuse a running server: it may be connected to the dev database.
    // Next allows one `next dev` per directory, so stop `pnpm dev` before running e2e.
    command: `pnpm dev --port ${PORT}`,
    reuseExistingServer: false,
    url: baseURL,
    timeout: 180_000,
  },
})
