const { users } = require("../../model");
const bcrypt = require("bcryptjs");

exports.renderRegisterForm = (req, res) => {
  res.render("register");
};

exports.registerUser = async (req, res) => {
  // console.log(req.body);
  // const email = req.body.email;
  // const username = req.body.username;
  // const password = req.body.password;

  const { email, username, password, confirmPassword } = req.body;

  //check if confirmPassword match with password
  if (password !== confirmPassword) {
    return res.send("Password and confirm passsword didn't match");
  }

  //Insert into Table(users)
  await users.create({
    email,
    username,
    password: bcrypt.hashSync(password, 8),
  });

  res.redirect("/login");
};

//Login starts from here

exports.renderLoginForm = (req, res) => {
  res.render("login");
};
