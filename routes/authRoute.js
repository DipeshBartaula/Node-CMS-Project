const {
  registerUser,
  loginUser,
} = require("../controller/auth/authController");

const router = require("express").Router();

router.route("/register").get(registerUser);
router.route("/login").get(loginUser);

module.exports = router;
