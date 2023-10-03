const {
  loginUser,
  renderRegisterForm,
  registerUser,
  renderLoginForm,
  logOut,
} = require("../controller/auth/authController");

const router = require("express").Router();

router.route("/register").get(renderRegisterForm).post(registerUser);
router.route("/login").get(renderLoginForm).post(loginUser);
router.route("/logout").get(logOut);

module.exports = router;
