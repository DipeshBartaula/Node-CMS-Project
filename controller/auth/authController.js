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

exports.loginUser = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  //SERVER Side validation
  if (!email || !password) {
    return res.send("Email and password are required");
  }

  // check if that email exists or not
  const associatedDataWithEmail = await users.findAll({
    where: {
      email,
    },
  });
  // console.log(associatedDataWithEmail[0]);
  if (associatedDataWithEmail.length == 0) {
    res.send("User with that email doesn't exists");
  } else {
    // check if password matches or not
    const associatedEmailPassword = associatedDataWithEmail[0].password;
    const isMatched = bcrypt.compareSync(password, associatedEmailPassword); // true or false
    if (isMatched) {
      res.send("Logged in success");
    } else {
      res.send("Invalid password");
    }
  }
  // exists xaina vaney -> []
  // exists xa vane -> [{name:"", password:"",email:""}]
};
