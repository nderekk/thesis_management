const asyncHandler = require("express-async-handler");
const {sequelize, user} = require("../config/dbConnection");
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
    res.status(200).json({ accessToken });
  }else{
    res.status(401);
    throw new Error("Email or password incorrect");
  }
});

module.exports = { loginUser };