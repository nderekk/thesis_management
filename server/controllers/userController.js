const asyncHandler = require("express-async-handler");
const {sequelize, user, blacklist} = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc Login User
//@route Post /api/user/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  if (!(email && password)){
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const loggedUser = await user.findOne({ where: {email: email} });
  // if (user && await bcrypt.compare(password, user.password)){
  if (loggedUser && password === loggedUser.password){
    const accessToken = jwt.sign({
      user: {
        role: loggedUser.role,
        email: loggedUser.email,
        id: loggedUser.id
      }
    }, 
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "59m"}
    );
    let options = {
      maxAge: 20 * 60 * 1000, // would expire in 20minutes
      httpOnly: true, // The cookie is only accessible by the web server
      secure: true,
      sameSite: "Strict",
    };
    res.cookie("SessionID", accessToken, options);
    res.status(200).json({ msg: "Welcome" });
  }else{
    res.status(401);
    throw new Error("Email or password incorrect");
  }
});

//@desc Logout User
//@route Post /api/user/logout
//@access Private
const logoutUser = asyncHandler(async (req, res) => {
  blacklist.create({
    token: req.token
  });
  res.status(200).json(`Antio ${req.user.role}`);
});

module.exports = { loginUser, logoutUser };