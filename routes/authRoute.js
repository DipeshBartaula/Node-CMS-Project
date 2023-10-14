const {
  loginUser,
  renderRegisterForm,
  registerUser,
  renderLoginForm,
  logOut,
  forgotPassword,
  checkForgotPassword,
  renderOtpForm,
  handleOTP,
  renderPasswordChangeForm,
  handlePasswordChange,
} = require("../controller/auth/authController");
const catchError = require("../services/catchError");

const router = require("express").Router();

router
  .route("/register")
  .get(catchError(renderRegisterForm))
  .post(catchError(registerUser));
router
  .route("/login")
  .get(catchError(renderLoginForm))
  .post(catchError(loginUser));
router.route("/logout").get(logOut);
router
  .route("/forgotPassword")
  .get(catchError(forgotPassword))
  .post(catchError(checkForgotPassword));
router.route("/otp").get(renderOtpForm);
router.route("/otp/:id").post(handleOTP);

router.route("/passwordChange").get(renderPasswordChangeForm);
router.route("/passwordChange/:email/:otp").post(handlePasswordChange);

module.exports = router;
