import path from 'path'

function upload_path(dirname) {
  return async function _middleware(ctx, next) {
    const upload_folder_path = path.join(dirname, '/uploads')
    ctx.context = ctx.context || {}
    ctx.context =  Object.assign(ctx.context, { upload_folder_path })

    await next()
  }
}



export default upload_path
