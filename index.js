#!/usr/bin/env node

const fs = require('fs')
const promisePool = require('@rodrigogs/promise-pool')
const playwright = require('playwright')
const createDirectoryStructure = require('./src/createDirectoryStructure')
const verifyAuth = require('./src/verifyAuth')
const authenticate = require('./src/authenticate')
const findSubscriptions = require('./src/findSubscriptions')
const chooseSubscriptions = require('./src/chooseSubscriptions')
const downloadPhotos = require('./src/downloadPhotos')
const downloadVideos = require('./src/downloadVideos')
const { STATE_FILE } = require('./src/config')

const browserType = 'chromium'
let browser
let context

const closeBrowser = async () => {
  if (browser) await browser.close()
  browser = null
}

const getNewContext = () => fs.promises
  .access(STATE_FILE, fs.constants.R_OK)
  .then(() => browser.newContext({ storageState: STATE_FILE }))
  .catch(() => browser.newContext())

const downloadData = (selectedSubscriptions) => {
  function* subscriptionsGenerator(subscriptions) {
    yield* subscriptions
  }
  return promisePool({
    concurrency: 3,
    generator: subscriptionsGenerator(selectedSubscriptions),
    processor: async (subscription) => {
      let page
      try {
        const { imagesDir, videosDir } = await createDirectoryStructure(
          subscription,
        )
        page = await context.newPage()
        await downloadPhotos(page, subscription, imagesDir)
        await downloadVideos(page, subscription, videosDir)
        console.log(`[${subscription}] Done !`)
      } finally {
        page && await page.close()
      }
    },
  })
}

const resolveSubscriptions = async () => {
  const page = await context.newPage()
  const isAuthenticated = await verifyAuth(page)
  if (!isAuthenticated) await authenticate(page, context)
  const subscriptions = await findSubscriptions(page)
  await page.close()
  return chooseSubscriptions(subscriptions)
}

(async () => {
  try {
    browser = await playwright[browserType].launch({ headless: false })
    context = await getNewContext()
    const subscriptions = await resolveSubscriptions()
    await downloadData(subscriptions)
  } catch (err) {
    console.error(err)
  } finally {
    await closeBrowser()
  }
})()

// gently shutdown
process.on('SIGINT', async () => {
  await closeBrowser()
  process.exit(0)
})
