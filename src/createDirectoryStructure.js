const path = require('path')
const fs = require('fs')

const createDir = async (dir) => {
  try {
    await fs.promises.mkdir(dir)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

module.exports = async (subscription) => {
  console.log(`Creating directory structures for model ${subscription}...`)
  const baseDir = '.models'
  await createDir(baseDir)
  const modelDir = path.join(baseDir, subscription)
  await createDir(modelDir)
  const imagesDir = path.join(modelDir, 'images')
  await createDir(imagesDir)
  const videosDir = path.join(modelDir, 'videos')
  await createDir(videosDir)
  return {
    baseDir,
    modelDir,
    imagesDir,
    videosDir,
  }
}
