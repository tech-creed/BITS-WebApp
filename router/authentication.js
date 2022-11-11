const express = require("express");

// route controller
const AuthController = require("../controller/authentication.js");
const router = express.Router();

// authentication GET routes
router.get("/login", AuthController.LoginGet)
router.get("/signup", AuthController.SignupGet)


module.exports = router;