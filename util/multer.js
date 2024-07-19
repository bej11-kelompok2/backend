const multer = require("multer");

const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
      return callback(
        new Error("Only .png, .jpg, and .jpeg formats are allowed!")
      );
    }
  },
});

module.exports = upload;
