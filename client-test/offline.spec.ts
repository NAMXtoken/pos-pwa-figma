import { expect, test } from "@playwright/test"
const injectManifest = process.env.SW === 'true'
const swName = `${injectManifest ? 'claims-sw.js' : 'sw.js'}`

test.describe('React Offline Support', () => {
  test('renders about route and stays cached when offline', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('/')

    const swUrl = await page.evaluate(async () => {
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Service worker registration failed: time out')), 10000)),
      ])
      return registration.active?.scriptURL ?? null
    })

    expect(swUrl).toBe(`http://localhost:4173/${swName}`)

    await page.waitForSelector('a[href="/about"]', { timeout: 2000 })
    await context.setOffline(true)
    await page.getByRole('link', { name: 'About' }).click()

    const url = await page.evaluate(async () => {
      await new Promise(resolve => setTimeout(resolve, 3000))
      return window.location.href
    })

    expect(url).toBe('http://localhost:4173/about')
    await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible()

    await page.reload({ waitUntil: 'load' })
    expect(page.url()).toBe('http://localhost:4173/about')
    await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible()

    await context.close()
  })
})

