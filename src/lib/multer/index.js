const multer = require('multer');

const storage = multer.memoryStorage();
const multerHandler = multer({ storage });

module.exports = multerHandler;
