const { users } = require("../../model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../services/sendEmail");
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

  // const allUsers = await users.findAll();

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
    //for sending to multiple email holders
    // for (var i = 0; i < allUsers.length; i++) {
    //   await sendEmail({
    //     email: allUsers[i].email,
    //     subject: "This is bulk gmail",
    //     otp: "This is to notify tha twe are closing soon",
    //   });
    // }
    const generatedOtp = Math.floor(10000 * Math.random(9999));
    await sendEmail({
      email: email,
      subject: "Forgot Password OTP",
      otp: generatedOtp,
    });
    emailExists[0].otp = generatedOtp;
    emailExists[0].otpGeneratedTime = Date.now();
    await emailExists[0].save();

    res.redirect("/otp?email=" + email);
  }
};

exports.renderOtpForm = (req, res) => {
  const email = req.query.email;
  res.render("otpForm", { email: email });
};

exports.handleOTP = async (req, res) => {
  const otp = req.body.otp;
  const email = req.params.id;
  if (!otp || !email) {
    return res.send("Please send email,otp");
  }
  const userData = await users.findAll({
    where: {
      email: email,
      otp: otp,
    },
  });
  if (userData.length == 0) {
    res.send("Invalid otp");
  } else {
    const currentTime = Date.now(); //current time
    const otpGeneratedTime = userData[0].otpGeneratedTime; //old time
    if (currentTime - otpGeneratedTime <= 120000) {
      userData[0].otp = null;
      userData[0].otpGeneratedTime = null;
      await userData[0].save();

      res.redirect("/passwordChange");
    } else {
      res.send("Otp has expired");
    }
  }
};

exports.renderPasswordChangeForm = (req, res) => {
  res.render("passwordChangeForm");
};
