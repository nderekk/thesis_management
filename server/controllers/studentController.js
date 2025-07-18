const asyncHandler = require("express-async-handler");
const {sequelize, student, thesis, thesis_topics, professor} = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Get Thesis Info
//@route Get /api/student/thesis
//@access Private
const getThesisInfo = asyncHandler(async (req, res) => {
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});
  const thesisTopic = await thesis_topics.findOne({ where: {id: studentThesis.topic_id}});
  const prof = await professor.findOne({ where: {am: studentThesis.supervisor_am}})
  res.status(200).json({
    title: thesisTopic.title, 
    description: thesisTopic.description,
    assignedDate: studentThesis.assignment_date,
    status: studentThesis.thesis_status,
    supervisor: `Dr. ${prof.first_name} ${prof.last_name}`,
  });

});

//@desc Get current student
//@route Get /api/student
//@access Private
const getStudentInfo = asyncHandler(async (req, res) => {
  if ( req.user.role !== "student") {
    return res.status(403).json({ error: "Error - Not Authorized" });
  }
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  res.status(200).json(loggedStudent);
});

module.exports = {getThesisInfo, getStudentInfo};