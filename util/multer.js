const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file,  callback) => {
        callback(null, './uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const upload = multer({ 
    storage: storage, 
    fileFilter: (req, file, callback) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            return callback(null, true)
        } else {
            callback(null, false);
            return callback(new Error('Only .png, .jpg, and .jpeg'))
        }
    }

})

module.exports = upload

