const asyncHandler = require("express-async-handler");
const {sequelize, secretary, thesis, thesis_topics, student, professor} = require("../config/dbConnection");
const { Op } = require('sequelize');


//@desc Get current secretary user
//@route Get /api/secretary
//@access Private
const getSecretaryInfo = asyncHandler(async (req, res) => {
  const loggedSecretary = await secretary.findOne({ where: {secretary_userid: req.user.id} });
  res.status(200).json(loggedSecretary);
});

//@desc get all active and review theses
//@route Get /api/secretary/theses/active
//@access Private
const getActiveTheses = asyncHandler(async (req, res) => {
  const loggedSecretary = await secretary.findOne({ where: {secretary_userid: req.user.id} });
  const activeTheses = await thesis.findAll({
    where: {
      [Op.or]: [
        { thesis_status: { [Op.like]: "Active" } },
        { thesis_status: { [Op.like]: "Review" } }
      ]
    }
  });
  const studentAMs = activeTheses.map(thesis => thesis.student_am);
  const activeThesesStudents = await student.findAll({where: { am: studentAMs }});

  const topicIDs = activeTheses.map(thesis => thesis.topic_id);
  const activeThesisTopics = await thesis_topics.findAll({where: { id: topicIDs }});

  const supervisorAMs = activeTheses.map(thesis => thesis.supervisor_am);
  const activeThesesSupervisors = await professor.findAll({where: { am: supervisorAMs }});

  const data = activeTheses.map(thesis => {
    const top = activeThesisTopics.find(r => r.id === thesis.topic_id);
    const stud = activeThesesStudents.find(st => st.am === thesis.student_am);
    const sup = activeThesesSupervisors.find(prof => prof.am === thesis.supervisor_am);

    return {
      id: thesis.id,
      title: top.title,
      supervisor_name: `${sup.first_name} ${sup.last_name}`,
      status: thesis.thesis_status,
      assignment_date: thesis.assignment_date,
      student_name: `${stud.first_name} ${stud.last_name}`
    };
  });

  res.status(200).json(data);
});

module.exports = {getSecretaryInfo, getActiveTheses};