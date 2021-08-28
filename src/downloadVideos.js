const path = require('path')
const clickImage = require('./clickImage')
const downloadFile = require('./downloadFile')
const { BASE_URL } = require('./config')

async function* videoDownloadLinkGenerator(page, totalImages) {
  let index = 1
  do {
    try {
      const success = await clickImage(page, index)
      if (!success) continue
      await page.waitForSelector('video.vjs-tech', { timeout: 15000 })
      const link = await page.$eval('video.vjs-tech', (video) =>
        video.getAttribute('src'),
      )
      yield link
      await page.click('button.pswp__button--close')
    } catch (err) {
      console.error(err)
    } finally {
      index++
    }
  } while (totalImages > index - 1)
}

module.exports = async (page, subscription, videosDir) => {
  console.log(`[${subscription}] Waiting for model page to load...`)
  await page.goto(`${BASE_URL}/${subscription}/videos`, {
    waitUntil: 'networkidle',
  })
  await page.waitForSelector('button.b-tabs__nav__item.m-current')
  const totalVideos = await page.$eval(
    'button.b-tabs__nav__item.m-current',
    (totalVideosBadge) =>
      Number(totalVideosBadge.textContent.trim().match(/\d+/g).join('')),
  )
  console.log(`[${subscription}] Downloading ${totalVideos} videos...`)
  let index = 1
  for await (const downloadLink of videoDownloadLinkGenerator(
    page,
    totalVideos,
  )) {
    try {
      const filePath = path.join(videosDir, `${index}.mp4`)
      await downloadFile(filePath, downloadLink, 'video/mp4')
      console.log(
        `[${subscription}] Downloaded ${index} from ${totalVideos} videos`,
      )
    } catch (err) {
      console.log(`[${subscription}] Failed to download video: ${downloadLink}`)
      console.error(err)
    } finally {
      index++
    }
  }
}
