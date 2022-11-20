const express = require('express')

// route controller
const UserController = require("../controller/user_controller.js");
const router = express.Router();

// Index GET routes
router.get("/dashboard", UserController.Dashboard)

module.exports = router;