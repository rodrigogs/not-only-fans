const { BASE_URL } = require('./config')

module.exports = async (page) => {
  console.log('Discovering subscriptions...')
  await page.goto(`${BASE_URL}/my/subscriptions/active?limit=100`, {
    waitUntil: 'networkidle',
  })
  await page.waitForSelector('div.b-fans__container', { timeout: 30000 })
  await page.waitForSelector('div.b-fans__container a.b-username')
  await page.evaluate(() => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    return (async () => {
      while (document.body.scrollHeight > Math.round(window.pageYOffset + window.innerHeight)) {
        window.scrollTo(0, document.body.scrollHeight)
        await sleep(2000)
      }
    })()
  })
  const subscriptions = await page.$$eval(
    'div.b-fans__container a.b-username',
    (elements) => elements.map((el) => el.getAttribute('href').replace('/', '')),
  )
  return subscriptions
}
