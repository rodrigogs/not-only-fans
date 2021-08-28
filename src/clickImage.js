module.exports = async (page, index) => {
  try {
    await page.waitForSelector(`div.b-photos__item:nth-child(${index}) img`, { timeout: 500 })
  } catch (err) {
    console.log(`[${index}] Image not found`)
    return false
  }
  await page.click(`div.b-photos__item:nth-child(${index})`)
  return true
}
