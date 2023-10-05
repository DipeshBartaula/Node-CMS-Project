const { users } = require("../../model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
      //GENERATE TOKEN HERE

      const token = jwt.sign(
        { id: associatedDataWithEmail[0].id },
        process.env.SECRETKEY,
        {
          expiresIn: "30d",
        }
      );
      // console.log("This is token" + token)
      // console.log(process.env.SECRETEKEY);
      res.cookie("token", token); // browser ma application tab bitra cookei vanney ma save hunxa

      res.send("Logged in success");
    } else {
      res.send("Invalid password");
    }
  }
  // exists xaina vaney -> []
  // exists xa vane -> [{name:"", password:"",email:""}]
};

exports.logOut = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};

exports.forgotPassword = (req, res) => {
  res.render("forgotPassword");
};

exports.checkForgotPassword = async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.send("Please provide email");
  }

  //if email => check if that email is in the table or not
  const emailExists = await users.findAll({
    where: {
      email: email,
    },
  });

  if (emailExists.length == 0) {
    return res.send("Users with that email doesn't exist");
  } else {
    //Send otp to that email
  }
};
