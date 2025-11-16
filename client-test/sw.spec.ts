import process from "node:process"
import { expect, test } from "@playwright/test"
const injectManifest = process.env.SW === 'true'
const swName = `${injectManifest ? 'claims-sw.js' : 'sw.js'}`

test.describe('React Service Worker', () => {
  test('registers and precaches assets', async ({ page }) => {
    await page.goto('/')

    const swURL = await page.evaluate(async () => {
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_resolve, reject) => setTimeout(() => reject(new Error('Service worker registration failed: time out')), 10000)),
      ])
      return registration.active?.scriptURL ?? null
    })
    expect(swURL).toBe(`http://localhost:4173/${swName}`)

    const cacheContents = await page.evaluate(async () => {
      const cacheState: Record<string, Array<string>> = {}
      for (const cacheName of await caches.keys()) {
        const cache = await caches.open(cacheName)
        cacheState[cacheName] = (await cache.keys()).map(req => req.url)
      }
      return cacheState
    })

    expect(Object.keys(cacheContents)).toEqual(['workbox-precache-v2-http://localhost:4173/'])

    const urls = cacheContents['workbox-precache-v2-http://localhost:4173/'].map(url => url.slice('http://localhost:4173/'.length))
    expect(urls.some(url => url.startsWith('manifest.webmanifest?__WB_REVISION__='))).toBeTruthy()
    expect(urls.some(url => url.startsWith('index.html?__WB_REVISION__='))).toBeTruthy()
    expect(urls.some(url => url.startsWith(swName))).toBeFalsy()
  })
})

