const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {blacklist} = require("../config/dbConnection");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  // ta epomena duo lines ta sizitame alla gia tora komple
  const authHeader = req.headers['cookie'];
  if (!authHeader) {
    res.status(401);
    throw new Error("Token missing from request");
  }
  const cookie = authHeader.split('=')[1]; // If there is, split the cookie string to get the actual jwt token
  token = cookie.split(';')[0];
  if (!token) {
    res.status(401);
    throw new Error("Token missing from cookie");
  }
  const checkIfBlacklisted = await blacklist.findOne({ where: { token: token } });
  if (checkIfBlacklisted){
    res.status(401);
    throw new Error("Not logged in");
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err){
      res.status(401);
      throw new Error("User not Authorized");
    }
    // analoga me ti json tha kanoume sign
    req.user = decoded.user;
    req.token = token;
    next(); 
  });
});

module.exports = validateToken;