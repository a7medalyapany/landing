/**
 * Points Payload at TEST_DATABASE_URL so tests never read or write the dev (or prod)
 * database. Must run before `src/payload.config.ts` is imported — it reads
 * DATABASE_URL at import time. Safe to call more than once per process.
 */
export function pointToTestDatabase(): void {
  if (process.env.TESTS_USE_TEST_DATABASE === 'true') return

  const testURL = process.env.TEST_DATABASE_URL
  if (!testURL) {
    throw new Error(
      'TEST_DATABASE_URL is not set. Tests refuse to run against DATABASE_URL — add a separate database to .env (see .env.example).',
    )
  }
  if (testURL === process.env.DATABASE_URL) {
    throw new Error('TEST_DATABASE_URL must point to a different database than DATABASE_URL.')
  }

  process.env.DATABASE_URL = testURL
  process.env.TESTS_USE_TEST_DATABASE = 'true'
}
