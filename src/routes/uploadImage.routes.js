const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const uploadMiddleware = require("../middleware/uploadMiddleware");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

function uploadImageToCloudinary(imageFile) {
  return new Promise((resolve, reject) => {
    console.log(process.env.CLOUD_NAME);
    console.log(process.env.API_KEY);
    console.log(process.env.API_SECRET);
    cloudinary.uploader.upload(imageFile.path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    });
  });
}

/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags:
 *       - UploadImage
 *     summary: Upload an image to Cloudinary
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: file
 *     responses:
 *       '200':
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of image uploaded to Cloudinary
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
router.post("/", uploadMiddleware, async (req, res) => {
  try {
    const imageUrl = await uploadImageToCloudinary(req.file);
    console.log(imageUrl);
    res.json({ url: imageUrl });
  } catch (error) {
    console.error("Error uploading the image:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
