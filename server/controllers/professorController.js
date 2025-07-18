const asyncHandler = require("express-async-handler");
const {sequelize, professor, thesis_topics} = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Get current professor
//@route Get /api/professor
//@access Private
const getProfessorInfo = asyncHandler(async (req, res) => {
  if ( req.user.role !== "professor") {
    return res.status(401).json({ error: "Error - Not Authorized" });
  }
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  res.status(200).json(loggedProfessor);
});

//@desc Get professor thesis
//@route Get /api/professor/thesis
//@access Private
const getProfessorThesis = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  const professorThesisTopics = await thesis_topics.findAll({where: {prof_am: loggedProfessor.am} })
  res.status(200).json({
  thesisTopics: professorThesisTopics.map(topic => ({
    title: topic.title,
    description: topic.description,
  })),
});
});

module.exports = {getProfessorInfo,getProfessorThesis};