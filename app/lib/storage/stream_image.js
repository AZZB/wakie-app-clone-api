import path from 'path'
import fs from 'fs'


export default async function streamImage(upload_folder_path, filename) {
  const full_path = path.join(upload_folder_path, filename)
  const fstat = await stat(full_path)

  if(fstat.isFile()) {
    return {
      type: path.extname(full_path),
      stream: fs.createReadStream(full_path)
    }
  }

  return Promise.reject('is not file')
}


function stat(file) {
  return new Promise(function(resolve, reject) {
    fs.stat(file, function(err, stat) {
      if (err) {
        reject(err);
      } else {
        resolve(stat);
      }
    });
  });
}
