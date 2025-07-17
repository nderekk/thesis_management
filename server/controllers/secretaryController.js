const asyncHandler = require("express-async-handler");
const {sequelize, secretary} = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Get current secretary user
//@route Get /api/secretary
//@access Private
const getSecretaryInfo = asyncHandler(async (req, res) => {
  const loggedSecretary = await secretary.findOne({ where: {secretary_userid: req.user.id} });
  res.status(200).json(loggedSecretary);
});

module.exports = {getSecretaryInfo};