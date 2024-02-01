const multer = require("multer");

const storage = multer.diskStorage({});

function isImage(file) {
  const fileExtension = file.originalname.split(".").pop();

  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  const isImageExtension = imageExtensions.includes(
    fileExtension.toLowerCase()
  );

  const isImageMIME = file.mimetype.startsWith("image/");

  return isImageExtension && isImageMIME;
}

function fileFilter(req, file, cb) {
  if (isImage(file)) {
    cb(null, true);
  } else {
    cb(new Error("El archivo no es una imagen válida"));
  }
}

const upload = multer({ storage, fileFilter });

module.exports = upload.single("image");
