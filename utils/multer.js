const multer = require('multer');
const cloudinary = require("./cloudinary")

// Multer configuration
const storage = multer.diskStorage({
    cloudinary: cloudinary,
});

const upload = multer({ storage: storage });

module.exports = upload;