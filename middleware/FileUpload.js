const multer=require('multer');
const fs=require('fs');
const path=require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fileDestination = 'public/uploads'
        //check if there folder already exists
        if (!fs.existsSync(fileDestination)) {
            fs.mkdirSync(fileDestination, { recursive: true })
            cb(null, fileDestination)
        }
        else {
            cb(null, fileDestination)
        }
    },
    filename: (req, file, cb) => {
        let filename = path.basename(file.originalname, path.extname(file.originalname))
        let ext = path.extname(file.originalname)
        cb(null, filename + "_" + Date.now() + ext)
    }
})
let imagefilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|png|svg|gif|jpeg|JPG|PNG|SVG|GIF|JPEG)$/)) {
        return cb(new Error("you can upload image only"), false)
    }
    else {
        cb(null, true)
    }
}
let upload = multer({
    storage: storage,
    fileFilter: imagefilter,
    limits: 2000000
})
module.exports = upload