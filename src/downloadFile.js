const fs = require('fs')
const axios = require('axios')

module.exports = async (filePath, link, contentType = 'image/jpeg') => {
  const response = await axios.get(link, {
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': contentType,
      Accept: contentType,
    },
  })
  await fs.promises.writeFile(filePath, response.data)
}
