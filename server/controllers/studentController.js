const asyncHandler = require("express-async-handler");
const {
  sequelize, student, thesis, thesis_topics, 
  professor, trimelis_requests, thesis_presentation, thesis_grade, links, thesis_logs
} = require("../config/dbConnection");
const {fn, Op} = require('sequelize');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { link } = require("fs");
const deleteUploadedFile = require("../utils/fileDeleter");

//@desc Get Thesis Info
//@route Get /api/student/thesis
//@access Private
const getThesisInfo = asyncHandler(async (req, res) => {
  let studentThesis = null;
  if (req.user.role === 'student'){
    const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
    studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});
  } else {
    studentThesis = await thesis.findOne({ where: {id: req.query.id}});
  }
  if (!studentThesis) return res.status(200).json('empty');
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
  const thesisLogs =  await thesis_logs.findAll({where: {thesis_id : studentThesis.id}});

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
  } else{
    committeeMembers= [
        `${supervisor.first_name} ${supervisor.last_name}`,
        `${prof2.first_name} ${prof2.last_name}` ,
        `${prof3.first_name} ${prof3.last_name}` , 
      ];
  }

  const thesisGrade = await thesis_grade.findOne({ where: {thesis_id: studentThesis.id}});

  res.status(200).json({
    title: thesisTopic.title, 
    description: thesisTopic.description,
    assignedDate: studentThesis.assignment_date,
    status: studentThesis.thesis_status,
    supervisor: `${supervisor.first_name} ${supervisor.last_name}`,
    committeeMembers : committeeMembers,
    invitedProfessors : finalCommitteProfessors,
    grade: thesisGrade ? thesisGrade.final_grade : null,
    completionDate: studentThesis.completion_date,
    thesisLogs: thesisLogs,
    ap_from_gs: studentThesis.ap_from_gs,
    libraryLink: studentThesis.nemertes_link
  });

});

//@desc Get current student
//@route Get /api/student
//@access Private
const getStudentInfo = asyncHandler(async (req, res) => {
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  res.status(200).json(loggedStudent);
});

//@desc modify student info
//@route Put /api/student
//@access Private
const modifyStudentInfo = asyncHandler(async (req, res) => {
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
  if (newAddress !== undefined) updateData.address = newAddress;
  if (newCity !== undefined) updateData.city = newCity;
  if (newPostCode !== undefined) updateData.post_code = newPostCode;
  if (newEmail !== undefined) updateData.email = newEmail;
  if (newMobile !== undefined) updateData.mobile_number = newMobile;
  if (newPhone !== undefined) updateData.phone_number = newPhone;

  if (Object.keys(updateData).length === 0) {
      res.status(400);
      throw new Error('No fields provided for update');
  }  

  await loggedStudent.update(updateData);
  res.status(200).json(loggedStudent);
});

//@desc Get professors to invite
//@route Get /api/student/professorList
//@access Private
const professorList = asyncHandler(async (req, res) => {
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
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});
  if (studentThesis.thesis_status !== 'Pending'){
    res.status(400)
    throw new Error("Ur thesis isnt fit for new committee members");
  }
  const existingInvitations = await trimelis_requests.findAll({ where: {
    prof_am:req.body.prof_am,
    thesis_id: studentThesis.id,
    answer: { [Op.ne]: 'accepted' } 
  }});
  if(existingInvitations.length === 0){
    const invitedProfessor = await trimelis_requests.create({ 
      thesis_id : studentThesis.id,
      prof_am : req.body.prof_am,
      answer : 'pending',
      invite_date : fn('NOW'),
    });

    res.status(200).json(invitedProfessor);
  }
  
  res.status(400);
  throw new Error( "Invite alr exists");
});

//@desc get ipovoli ilikou eksetashs info
//@route GET /api/student/thesis-material
//@access Private
const getThesisMaterial = asyncHandler(async (req, res) => {  
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});

  if (!studentThesis) {
    return res.status(404).json({ message: 'Thesis not found for student' });
  }

  const fileName = studentThesis.thesis_content_filename;
  const linkList = await links.findAll({ attributes: ["url"], where: {thesis_id: studentThesis.id} });
  
  res.status(200);
  res.json({
    fileExists: fileName ? true : false, // exists and uparxei file alliws empty
    fileName: fileName,
    links: linkList.map(link => link.url)
  });
});

//@desc student uploads pdf
//@route Post /api/student/upload-pdf
//@access Private
const uploadPdf = asyncHandler(async (req, res) => {  
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});
  const prevFile = studentThesis.thesis_content_file;
  const prevOriginalFile = studentThesis.thesis_content_filename;
  const filePath = `${req.file.filename}`;
  const fileName = `${req.file.originalname}`;

  if (!studentThesis) {
    return res.status(404).json({ message: 'Thesis not found for student' });
  }

  deleteUploadedFile(prevFile);
  studentThesis.thesis_content_file = filePath;
  studentThesis.thesis_content_filename = fileName;
  await studentThesis.save();
  
  res.status(200);
  res.json({
    message: 'Upload successful',
    filePath: `/uploads/${req.file.filename}`,
    fileName: fileName
  });
});

//@desc student add links only
//@route PUT /api/student/append-link
//@access Private
const appendLinks = asyncHandler(async (req, res) => {  
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});
  const ls = req.body.links;
          
  if (!studentThesis) {
    return res.status(404).json({ message: 'Thesis not found for student' });
  }

  const linkList = await links.findAll({ where: {thesis_id: studentThesis.id} });

  linkList.map(async link => (
    !ls.includes(link.url) ? await link.destroy() : ls.splice(ls.indexOf(link.url), 1)
  ));
  
  await Promise.all(ls.map(async link => {
    await links.create({
      thesis_id: studentThesis.id,
      url: link
    });
  }));
  
  res.status(200);
  res.json({
    message: 'Links Added',
    links: ls,
  });
});

//@desc create exam date
//@route Post /api/student/exam-date
//@access Private
const setExamDate = asyncHandler(async (req, res) => {
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});

  const pres = await thesis_presentation.create({
        thesis_id: studentThesis.id,
        date_time: new Date(req.body.date_time),
        presentation_type: req.body.presentation_type,
        venue: req.body.venue
  });
  res.status(200).json(pres);

});

//@desc get exam date
//@route Get /api/student/exam-date
//@access Private
const getExamDate = asyncHandler(async (req, res) => {
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});

  const pres = await thesis_presentation.findOne({ where: {thesis_id: studentThesis.id}});

  if (!pres) {
    res.status(200).json({ date: "YYYY-MM-DD", time: "--:--" , venue: "", presentation_type: ""});
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

//@desc get exam date
//@route Put /api/student/exam-date
//@access Private
const modifyExamDate = asyncHandler(async (req, res) => {
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});

  const pres = await thesis_presentation.findOne({ where: {thesis_id: studentThesis.id}});

  if (!pres) {
    res.status(404)
    throw new Error("Presentation Date not Found");
  }
  else {
    const {
      presentation_type,
      date,
      time,
      venue,
    } = req.body;

    const updateData = {};
    if (presentation_type !== undefined) updateData.presentation_type = presentation_type;
    if (date !== undefined) updateData.date = date;
    if (time !== undefined) updateData.time = time;
    if (venue !== undefined) updateData.venue = venue;

    if (Object.keys(updateData).length === 0) {
        res.status(400);
        throw new Error('No fields provided for update');
    } 
    
    console.log(updateData)

    await pres.update(updateData);

    res.status(200).json(pres);
  }
});

//@desc get thesis grade
//@route Get /api/student/thesis/grade
//@access Private
const getThesisGrade = asyncHandler(async (req, res) => {
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});
  const thesisGrade = await thesis_grade.findOne({ where: {thesis_id: studentThesis.id}});
  if (thesisGrade)
    res.status(200).json(thesisGrade.final_grade);
  else 
    res.status(200).json("ungraded");
});


//@desc post thesis grade
//@route POST /api/student/uploadLinks
//@access Private
const postUploadLinks = asyncHandler(async (req, res) => {
  const loggedStudent = await student.findOne({ where: {student_userid: req.user.id} });
  const studentThesis = await thesis.findOne({ where: {student_am: loggedStudent.am}});

  try {
    let { thesisLinks } = req.body; 

    if (!Array.isArray(thesisLinks)) {
      await links.create({
         thesis_id : studentThesis.id,
         url :  thesisLinks
        }); 
    }else{
      for (const singleLink of thesisLinks) {
        await links.create({
          thesis_id : studentThesis.id,
          url :  singleLink
          }); 
      }
    }

    res.status(201).json({ message: "Links saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save links" });
  }
});

module.exports = {getThesisInfo, getStudentInfo, modifyStudentInfo, 
  professorList, inviteProfessor, uploadPdf, setExamDate, 
  getExamDate, modifyExamDate, getThesisGrade, postUploadLinks, 
  getThesisMaterial, appendLinks};
  
