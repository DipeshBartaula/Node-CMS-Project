const {
  loginUser,
  renderRegisterForm,
  registerUser,
  renderLoginForm,
  logOut,
  forgotPassword,
  checkForgotPassword,
} = require("../controller/auth/authController");

const router = require("express").Router();

router.route("/register").get(renderRegisterForm).post(registerUser);
router.route("/login").get(renderLoginForm).post(loginUser);
router.route("/logout").get(logOut);
router.route("/forgotPassword").get(forgotPassword).post(checkForgotPassword);

module.exports = router;
