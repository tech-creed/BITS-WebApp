const express = require("express");

// route controller
const AuthController = require("../controller/authentication.js");
const router = express.Router();

// authentication GET routes
router.get("/login_signup", AuthController.LoginSignupGet)
router.get("/reset_feedback", AuthController.ResetFeedbackGet)
router.get("/reset_password/:tmpid/:tmptoken/:userid", AuthController.EmailVerificationGet)
router.get("/logout", AuthController.AuthLogout)

// authentication POST routes
router.post("/login", AuthController.LoginPost)
router.post("/signup", AuthController.SignupPost)
router.post("/reset", AuthController.PasswordResetPost)
router.post("/feedback", AuthController.FeedbackPost)
router.post("/reset_password", AuthController.ChangePasswordPost)

module.exports = router;