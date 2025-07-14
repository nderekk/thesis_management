const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  // ta epomena duo lines ta sizitame alla gia tora komple
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Token missing from request");
  }

  token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401);
    throw new Error("Token missing after Bearer");
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err){
      res.status(401);
      throw new Error("User not Authorized");
    }
    // analoga me ti json tha kanoume sign
    req.user = decoded.user;
    next(); 
  });
});

module.exports = validateToken;