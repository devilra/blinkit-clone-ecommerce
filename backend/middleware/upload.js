const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
  //console.log("multer image file,", file);
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".webp") {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

module.exports = upload;
