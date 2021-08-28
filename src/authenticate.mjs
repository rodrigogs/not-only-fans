import { BASE_URL, STATE_FILE } from './config'

export default async (page, context) => {
  console.log('Authenticating...')
  await page.goto(BASE_URL)
  await page.waitForSelector('button.m-login-btn')
  await page.evaluate(() => window.alert('Please login to continue!'))
  await page.waitForSelector('div.g-user-username', { timeout: 120000 })
  await context.storageState({ path: STATE_FILE })
}
