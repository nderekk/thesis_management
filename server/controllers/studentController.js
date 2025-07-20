const asyncHandler = require("express-async-handler");
const {sequelize, student, thesis, thesis_topics, professor, trimelis_requests} = require("../config/dbConnection");
const {fn} = require('sequelize');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Get Thesis Info
//@route Get /api/student/thesis
//@access Private
const getThesisInfo = asyncHandler(async (req, res) => {
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});
  const thesisTopic = await thesis_topics.findOne({ where: {id: studentThesis.topic_id}});
  const supervisor = await professor.findOne({ where: {am: studentThesis.supervisor_am}});
  const prof2 = await professor.findOne({ where: {am: studentThesis.prof2_am} });
  const prof3 = await professor.findOne({ where: {am: studentThesis.prof3_am} });
  const invitedProfessors = await trimelis_requests.findAll({ attributes : ["prof_am"], where: {thesis_id: studentThesis.id , answer: 'pending'}});
  const profAms = invitedProfessors.map(req => req.prof_am);
  const invitedProfessorsInfo = await professor.findAll({attributes: ["first_name" , "last_name", "am"] , where: {am : profAms}});
  var committeeMembers = null;

  if(!prof2 || !prof3){
     if(prof2){
      committeeMembers = [
      `${supervisor.first_name} ${supervisor.last_name}`,
      `${prof2.first_name} ${prof2.last_name}`
    ];
     }else if(prof3){
      committeeMembers = [
      `${supervisor.first_name} ${supervisor.last_name}`,
      `${prof3.first_name} ${prof3.last_name}`,
      ];
     }else
        committeeMembers = [`${supervisor.first_name} ${supervisor.last_name}`,];
  }else{
    committeeMembers= [
        `${supervisor.first_name} ${supervisor.last_name}`,
        `${prof2.first_name} ${prof2.last_name}` ,
        `${prof3.first_name} ${prof3.last_name}` , 
      ];
  }

    res.status(200).json({
      title: thesisTopic.title, 
      description: thesisTopic.description,
      assignedDate: studentThesis.assignment_date,
      status: studentThesis.thesis_status,
      supervisor: `${supervisor.first_name} ${supervisor.last_name}`,
      committeeMembers : committeeMembers,
      invitedProfessors : invitedProfessorsInfo,
      });
  

});

//@desc Get current student
//@route Get /api/student
//@access Private
const getStudentInfo = asyncHandler(async (req, res) => {
  if ( req.user.role !== "student") {
    res.status(401)
    throw new Error("Not Authorized Endpoint");
  }
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  res.status(200).json(loggedStudent);
});

//@desc modify student info
//@route Put /api/student
//@access Private
const modifyStudentInfo = asyncHandler(async (req, res) => {
  if ( req.user.role !== "student") {
    res.status(401)
    throw new Error("Not Authorized Endpoint");
  }
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });

  const {
    newAddress,
    newCity,
    newPostCode,
    newEmail,
    newMobile,
    newPhone
  } = req.body;

  const updateData = {};
  if (newAddress !== undefined) updateData.newAddress = newAddress;
  if (newCity !== undefined) updateData.newCity = newCity;
  if (newPostCode !== undefined) updateData.newPostCode = newPostCode;
  if (newEmail !== undefined) updateData.newEmail = newEmail;
  if (newMobile !== undefined) updateData.newMobile = newMobile;
  if (newPhone !== undefined) updateData.newPhone = newPhone;

  if (Object.keys(updateData).length === 0) {
      res.status(400);
      throw new Error('No fields provided for update');
  }  

  await loggedStudent.update({
    address: newAddress, 
    email: newEmail,
    phone_number: newPhone,
    mobile_number: newMobile,
    city: newCity,
    post_code: newPostCode
  });
  res.status(200).json(loggedStudent);
});

//@desc Get professors to invite
//@route Get /api/student/professorList
//@access Private
const professorList = asyncHandler(async (req, res) => {
  if ( req.user.role !== "student") {
    res.status(401)
    throw new Error("Not Authorized Endpoint");
  }
  const professors = await professor.findAll({attributes: ["first_name" , "last_name", "am"]});
  res.status(200).json({
    p: professors.map(prof => ({
      name: `${prof.first_name} ${prof.last_name}`,
      id: prof.am
    }))
  });
});

//@desc Post invited professor
//@route Post /api/student/inviteProfessor
//@access Private
const inviteProfessor = asyncHandler(async (req, res) => {
  if ( req.user.role !== "student") {
    res.status(401)
    throw new Error("Not Authorized Endpoint");
  }
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});
  const invitedProfessor = await trimelis_requests.create({ 
    thesis_id : studentThesis.id,
    prof_am : req.body.prof_am,
    answer : 'pending',
    invite_date : fn('NOW'),
  });
  res.status(200).json(invitedProfessor);
});

module.exports = {getThesisInfo, getStudentInfo, modifyStudentInfo, professorList, inviteProfessor};
