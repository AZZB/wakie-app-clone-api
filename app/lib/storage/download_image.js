import downloader from 'image-downloader'
import path from 'path'


async function download_image(url, dest) {
  const { filename } = await downloader.image({url, dest})
  const name = path.basename(filename)
  return name
}


export default download_image
