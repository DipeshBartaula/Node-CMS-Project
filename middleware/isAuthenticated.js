const jwt = require("jsonwebtoken");
// const promisify = require("util").promisify;
const { promisify } = require("util");
const { users } = require("../model");
const { decodeToken } = require("../services/decodeToken");

exports.isAuthenticated = async (req, res, next) => {
  //cookies.token, token is the name given in the cookie
  const token = req.cookies.token;

  //check if token given or not
  if (!token) {
    return res.redirect("/login");
  }

  //verify token if it is legit or not
  const decryptedResult = await decodeToken(token, process.env.SECRETKEY);
  // console.log(decryptedResult);

  //check if that id( userId) users exists in table
  const userExist = await users.findAll({
    where: {
      id: decryptedResult.id,
    },
  });

  if (userExist.length === 0) {
    res.send("User with that token doens't exist");
  } else {
    //middleware le next ma jada tala ko data lera janxa
    req.user = userExist[0]; // alternative decryptedResult.id
    // console.log(userExist[0]);
    next();
  }
};
