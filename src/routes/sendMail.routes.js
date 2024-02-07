const express = require("express");
const bodyParser = require("body-parser");

const sendEmail = require("../middleware/sendEmail");

const router = express.Router();

router.use(bodyParser.json());

/**
* @swagger
* /api/sendMail/code:
*   post:
*     tags:
*       - SendCode
*     summary: Send verification code via email
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 description: Email address to send the verification code.
*               html:
*                 type: string
*                 description: HTML content of the email.
*               subject:
*                 type: string
*                 description: Subject of the email.
*     responses:
*       '200':
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 code:
*                   type: string
*                   description: Code string.
*       '400':
*         description: Bad request. Missing or invalid parameters.
*       '500':
*         description: Internal Server Error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   description: Error sending the verification code.
*/

router.post("/code", sendEmail);

module.exports = router;
