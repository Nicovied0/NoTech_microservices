const express = require("express");
const bodyParser = require("body-parser");

const sendEmail = require("../middleware/sendEmail");

const userRoute = express.Router();

userRoute.use(bodyParser.json());

userRoute.post("/code", sendEmail);

module.exports = userRoute;
