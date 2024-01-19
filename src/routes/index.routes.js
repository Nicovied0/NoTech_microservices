const express = require("express");
const router = express.Router();

const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");


router.use("/user", userRoute);
router.use("/auth", authRoute);

module.exports = router;
