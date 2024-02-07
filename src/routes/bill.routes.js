const express = require("express");
const { bucket, upload } = require("../config/firebaseConfig");
const router = express.Router();

/**
 * @swagger
 * /api/bill/pdf/{filename}:
 *   get:
 *     tags:
 *       - UploadFile
 *     summary: Download PDF file
 *     description: Downloads a PDF file stored in Firebase Storage.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: file
 *     responses:
 *       '200':
 *         description: PDF file downloaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               format: binary
 *       '400':
 *         description: The PDF file was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error uploading the image
 */
router.get("/pdf/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;

    const fileExists = await bucket.file(filename).exists();
    if (!fileExists[0]) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = bucket.file(filename);
    const fileStream = file.createReadStream();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${filename}`);

    fileStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting PDF file" });
  }
});


/**
 * @swagger
 * /api/bill:
 *   post:
 *     tags:
 *       - UploadFile
 *     summary: Upload an file to Firebase
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: file
 *     responses:
 *       '200':
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of file uploaded to Firebase
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error uploading the image
 */
router.post("/", upload, async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Obtener la fecha y hora actual
    const currentDate = new Date().toISOString().replace(/[-:.]/g, "_");
    const filename = `${currentDate}.pdf`;

    const { buffer } = file;

    const remoteFile = bucket.file(filename);
    await remoteFile.save(buffer);

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${remoteFile.name}`;

    res.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al subir el archivo a Firebase Storage" });
  }
});

module.exports = router;
