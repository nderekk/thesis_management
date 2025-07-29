const asyncHandler = require("express-async-handler");
const {sequelize, secretary} = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Get current secretary user
//@route Get /api/secretary
//@access Private
const getSecretaryInfo = asyncHandler(async (req, res) => {
  if ( req.user.role !== "secretary") {
    return res.status(401).json({ error: "Error - Not Authorized" });
  }

  const loggedSecretary = await secretary.findOne({ where: {secretary_userid: req.user.id} });
  res.status(200).json(loggedSecretary);
});

//@desc Get all theses for secretary
//@route GET /api/secretary/theses
//@access Private
const getAllTheses = asyncHandler(async (req, res) => {
  if (req.user.role !== "secretary") {
    return res.status(401).json({ error: "Error - Not Authorized" });
  }
  const { thesis, student, professor, thesis_topics } = require("../config/dbConnection");
  const allTheses = await thesis.findAll({
    include: [
      { model: student, as: 'student_am_student', attributes: ['am', 'first_name', 'last_name'] },
      { model: professor, as: 'supervisor_am_professor', attributes: ['am', 'first_name', 'last_name'] },
      { model: thesis_topics, as: 'topic', attributes: ['title'] }
    ]
  });
  const result = allTheses.map(t => ({
    id: t.id,
    title: t.topic ? t.topic.title : '',
    studentId: t.student_am,
    studentName: t.student_am_student ? `${t.student_am_student.first_name} ${t.student_am_student.last_name}` : '',
    supervisorId: t.supervisor_am,
    supervisorName: t.supervisor_am_professor ? `${t.supervisor_am_professor.first_name} ${t.supervisor_am_professor.last_name}` : '',
    status: t.thesis_status,
    assignedDate: t.assignment_date,
    apNumber: t.ap_from_gs,
    nemertisLink: t.nemertes_link,
    // add more fields as needed
  }));
  res.status(200).json(result);
});

module.exports = {getSecretaryInfo, getAllTheses};