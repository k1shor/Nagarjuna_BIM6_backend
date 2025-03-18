const multer = require('multer')
const fs = require('fs') //file system
const path = require('path') //file path

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dstn = 'public/uploads'

        if(!fs.existsSync(dstn)){
            fs.mkdirSync(dstn, {recursive: true})
        }

        cb(null, dstn)
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname)
        const basename = path.basename(file.originalname, extname)

        const fieldname = file.fieldname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        const filename = `${fieldname}-${basename}-${uniqueSuffix}${extname}`

        cb(null, filename)
    }
})

const upload = multer({ storage: storage })

module.exports = upload