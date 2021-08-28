const { BASE_URL } = require('./config')

module.exports = async (page) => {
  try {
    console.log('Verifying if you are logged in')
    await page.goto(`${BASE_URL}/me`, { waitUntil: 'networkidle' })
    await page.waitForSelector('a.g-avatar', { timeout: 5000 })
    return true
  } catch (err) {
    return false
  }
}
