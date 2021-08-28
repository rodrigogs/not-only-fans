const path = require('path')
const clickImage = require('./clickImage')
const downloadFile = require('./downloadFile')
const { BASE_URL } = require('./config')

async function* imageDownloadLinkGenerator(page, totalImages) {
  let index = 1
  do {
    try {
      const success = await clickImage(page, index)
      if (!success) continue
      await page.waitForSelector('img.pswp__img', { timeout: 5000 })
      const link = await page.$eval('img.pswp__img', (img) =>
        img.getAttribute('src'),
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

module.exports = async (page, subscription, imagesDir) => {
  console.log(`[${subscription}] Waiting for model page to load...`)
  await page.goto(`${BASE_URL}/${subscription}/photos`, {
    waitUntil: 'networkidle',
  })
  await page.waitForSelector('button.b-tabs__nav__item.m-current')
  const totalImages = await page.$eval(
    'button.b-tabs__nav__item.m-current',
    (totalPhotosBadge) =>
      Number(totalPhotosBadge.textContent.trim().match(/\d+/g).join('')),
  )
  console.log(`[${subscription}] Downloading ${totalImages} images...`)
  let index = 1
  for await (const downloadLink of imageDownloadLinkGenerator(
    page,
    totalImages,
  )) {
    try {
      const filePath = path.join(imagesDir, `${index}.jpg`)
      await downloadFile(filePath, downloadLink)
      console.log(
        `[${subscription}] Downloaded ${index} from ${totalImages} images`,
      )
    } catch (err) {
      console.log(`[${subscription}] Failed to download image: ${downloadLink}`)
      console.error(err)
    } finally {
      index++
    }
  }
}
