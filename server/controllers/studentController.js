const asyncHandler = require("express-async-handler");
const {sequelize, student, thesis, thesis_topics, professor, trimelis_requests, thesis_presentation} = require("../config/dbConnection");
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
  const committeeProfessors = await trimelis_requests.findAll({ attributes : ["prof_am" , "answer"], where: {thesis_id: studentThesis.id}});
  const profAms = committeeProfessors.map(req => req.prof_am);
  const committeeProfessorsInfo = await professor.findAll({attributes: ["first_name" , "last_name", "am"] , where: {am : profAms}});
  const finalCommitteProfessors = committeeProfessorsInfo.map(prof => {
    const req = committeeProfessors.find(r => r.prof_am === prof.am);
        return {
          first_name: `${prof.first_name}`,
          last_name: `${prof.last_name}`,
          am: prof.am,
          answer: req.answer || 'unknown'
        };
    });
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
      invitedProfessors : finalCommitteProfessors,
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

//@desc student uploads pdf
//@route Post /api/student/upload-pdf
//@access Private
const uploadPdf = asyncHandler(async (req, res) => {
  if ( req.user.role !== "student") {
    res.status(401)
    throw new Error("Not Authorized Endpoint");
  }
  
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});
  const filePath = `/uploads/${req.file.filename}`;

  if (!studentThesis) {
    return res.status(404).json({ message: 'Thesis not found for student' });
  }

  studentThesis.thesis_content_file = filePath;
  await studentThesis.save();
  
  res.status(200);
  res.json({
    message: 'Upload successful',
    filePath: `/uploads/${req.file.filename}`
  });
});

//@desc set exam date
//@route Post /api/student/exam-date
//@access Private
const setExamDate = asyncHandler(async (req, res) => {
  if ( req.user.role !== "student") {
    res.status(401)
    throw new Error("Not Authorized Endpoint");
  }
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});

  // const thesis_presentation = await thesis.findOne({ where: {id: studentThesis.id}});
  
  // if (!thesis_presentation) {
  //   return res.status(404).json({ message: 'No Thesis Presentation found for student' });
  // }
  const pres = await thesis_presentation.create({
        thesis_id: studentThesis.id,
        date_time: new Date(req.body.date_time),
        presentation_type: req.body.presentation_type,
        venue: req.body.venue
  });
  // res.status(200).json("Presentation logged Successfully");
  res.status(200).json(pres);

});

//@desc get exam date
//@route Get /api/student/exam-date
//@access Private
const getExamDate = asyncHandler(async (req, res) => {
  if ( req.user.role !== "student") {
    res.status(401)
    throw new Error("Not Authorized Endpoint");
  }
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});

  const pres = await thesis_presentation.findOne({ where: {thesis_id: studentThesis.id}});

  if (!pres) {
    res.status(404).json({ date: "YY-MM-DD", time: "--:--" , venue: " "});
  }
  else {
    const [date, timeWithMs] = pres.date_time.toISOString().split("T");
    const time = timeWithMs.slice(0, 5);
    res.status(200).json({
      date: date, 
      time: time, 
      presentation_type: pres.presentation_type,
      venue: pres.venue
    });
  }

});

module.exports = {getThesisInfo, getStudentInfo, modifyStudentInfo, 
  professorList, inviteProfessor, uploadPdf, setExamDate, getExamDate};
