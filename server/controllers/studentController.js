const asyncHandler = require("express-async-handler");
const {sequelize, } = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Get Thesis Info
//@route Get /api/student/:id/thesis
//@access Private
const getThesisInfo = asyncHandler(async (req, res) => {
  
});

module.exports = {getThesisInfo};