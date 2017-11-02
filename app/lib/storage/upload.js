import multer from 'koa-multer'

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    if(file.mimetype === 'image/jpeg') var ext = 'jpg'

    cb(null, `${file.fieldname}-${Date.now()}.${ext}`)
  },
})

const upload = multer({storage}).single('photo')


export default upload
