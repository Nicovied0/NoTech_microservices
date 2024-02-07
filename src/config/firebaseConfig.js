const admin = require("firebase-admin");
const multer = require("multer");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://notech-413520.appspot.com",
});

const bucket = admin.storage().bucket();

const upload = multer({ storage: multer.memoryStorage() }).single("myFile");

module.exports = { bucket, upload };
