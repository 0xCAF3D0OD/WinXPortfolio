import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.start-btn')).toContainText('démarrer')
  await expect(page.locator('.title-text').first()).toContainText('kevin@cloud')
})
