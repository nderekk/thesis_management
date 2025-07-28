const asyncHandler = require("express-async-handler");
const {sequelize, professor, thesis_topics, thesis, student , trimelis_requests} = require("../config/dbConnection");
const deleteUploadedFile = require("../utils/fileDeleter");
const { Op, fn } = require('sequelize');

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

//@desc Get professor's topics
//@route Get /api/professor/topics
//@access Private
const getTopics = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  const professorThesisTopics = await thesis_topics.findAll({where: {prof_am: loggedProfessor.am} })
  res.status(200).json({
    data: professorThesisTopics.map(topic => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      status: topic.topic_status,
      original_file_name: topic.original_file_name,
      createdDate: topic.createdAt.toISOString().split("T")[0],
      student_am: topic.student_am
    })),
  });
});

//@desc create professor topic
//@route Post /api/professor/topic
//@access Private
const createTopic = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });

    const topic = await thesis_topics.create({
    title: req.body.title, 
    description: req.body.description,
    attached_discription_file: (req.file) ? `${req.file.filename}` : null,
    original_file_name: (req.file) ? `${req.file.originalname}` : null,
    prof_am: loggedProfessor.am,
    topic_status: "unassigned"
  });
  res.status(200).json(topic);
});

//@desc edit professor topic
//@route PUT /api/professor/topic
//@access Private
const editTopic = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  const targetTopic = await thesis_topics.findOne({where: {prof_am: loggedProfessor.am, id:req.body.id} });
  const prevFile = targetTopic.attached_discription_file;
  const prevOriginalFile = targetTopic.original_file_name;

  if (!targetTopic) {
    res.status(404)
    throw new Error("Topic not Found");
  }
  else {
    const {
      title,
      description,
      topic_status,
      student_am,
    } = req.body;
    console.log(student_am);

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (topic_status !== undefined) updateData.topic_status = topic_status;
    if (student_am !== undefined) updateData.student_am = student_am;
    if (student_am === "") updateData.student_am = null;
    if (req.file && `${req.file.originalname}` !== prevOriginalFile) {
      updateData.attached_discription_file = `${req.file.filename}`;
      updateData.original_file_name = `${req.file.originalname}`;
    }
    else {
      updateData.attached_discription_file = prevFile;
      updateData.original_file_name = prevOriginalFile;
    }

    if (Object.keys(updateData).length === 0) {
        res.status(400);
        throw new Error('No fields provided for update');
    }  
    await targetTopic.update(updateData);
    if (req.file && `${req.file.originalname}` !== prevOriginalFile)
      deleteUploadedFile(prevFile);

    res.status(200).json(targetTopic);
  }
});

//@desc delete professor topic
//@route DELETE /api/professor/topic
//@access Private
const deleteTopic = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  const targetTopic = await thesis_topics.findOne({where: {prof_am: loggedProfessor.am, id:req.body.id} });

  await targetTopic.destroy();
  deleteUploadedFile(targetTopic.attached_discription_file);
  res.status(200).json(`Topic ${req.body.id} deleted`);
});

//@desc Get professor's theses list
//@route Get /api/professor/thesesList
//@access Private
const getThesesList = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  const professorThesesSupervisor = await thesis.findAll({
    where: {
      [Op.or]: [
        { supervisor_am: loggedProfessor.am },
        { prof2_am: loggedProfessor.am },
        { prof3_am: loggedProfessor.am }
      ]
    }
  });
  const topicIDs = professorThesesSupervisor.map(thesis => thesis.topic_id);
  const professorThesesTopics = await thesis_topics.findAll({where: { id: topicIDs }});

  const studentIDs = professorThesesSupervisor.map(thesis => thesis.student_am);
  const studentThesesIDs = await student.findAll({where: { am: studentIDs }});

  const professorThesesInfo = professorThesesSupervisor.map(prof => {
    const req = professorThesesTopics.find(r => r.id === prof.topic_id);
    const stud = studentThesesIDs.find(st => st.am === prof.student_am);

    let role = null;
    if (prof.supervisor_am === loggedProfessor.am) {
      role = 'Supervisor';
    }else {
      role = 'Committee Member';
    }
      return {
        thesis_id: prof.id,
        thesis_title: req.title,
        professor_role: role,
        thesis_status: prof.thesis_status,
        thesis_ass_date: prof.assignment_date,
        student_name: `${stud.first_name} ${stud.last_name}`
      };
    });

  res.status(200).json(professorThesesInfo);
});

//@desc get ALL professor's thesis
//@route Get /api/professor/Stats
//@access Private
const getStats = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });

  // avg time stats
  const [supervisorResults] = await sequelize.query(`
    SELECT AVG(DATEDIFF(completion_date, assignment_date)) AS avg_days, COUNT(*) AS n1
    FROM thesis
    WHERE thesis_status = 'Completed'
      AND (supervisor_am = :am)
  `, {
    replacements: { am: loggedProfessor.am },
    type: sequelize.QueryTypes.SELECT
  });
  const [committeeResults] = await sequelize.query(`
    SELECT AVG(DATEDIFF(completion_date, assignment_date)) AS avg_days, COUNT(*) AS n2
    FROM thesis
    WHERE thesis_status = 'Completed'
      AND (prof2_am = :am OR prof3_am = :am)
  `, {
    replacements: { am: loggedProfessor.am },
    type: sequelize.QueryTypes.SELECT
  });
  const totalAvg = ((committeeResults.avg_days * committeeResults.n2) +
    (supervisorResults.avg_days * supervisorResults.n1)) / (supervisorResults.n1 + committeeResults.n2);
  

  // avg grade stats
  const [supervisorGrade] = await sequelize.query(`
    SELECT AVG(final_grade) AS grade, COUNT(*) AS n1 FROM thesis_grade INNER JOIN thesis 
      ON thesis_id = thesis.id AND (thesis.supervisor_am = :am)
  `, {
    replacements: { am: loggedProfessor.am },
    type: sequelize.QueryTypes.SELECT
  });

  const [committeeGrade] = await sequelize.query(`
    SELECT AVG(final_grade) AS grade, COUNT(*) AS n2 FROM thesis_grade INNER JOIN thesis 
      ON thesis_id = thesis.id AND (thesis.prof2_am = :am OR thesis.prof3_am = :am)
  `, {
    replacements: { am: loggedProfessor.am },
    type: sequelize.QueryTypes.SELECT
  });
  const totalGrade = ((supervisorGrade.grade * supervisorGrade.n1) +
    (committeeGrade.grade * committeeGrade.n2)) / (supervisorGrade.n1 + committeeGrade.n2);


  // count stats
  const [supervisorCount] = await sequelize.query(`
    SELECT COUNT(*) AS n1
    FROM thesis
    WHERE (supervisor_am = :am)
  `, {
    replacements: { am: loggedProfessor.am },
    type: sequelize.QueryTypes.SELECT
  });
  const [committeeCount] = await sequelize.query(`
    SELECT COUNT(*) AS n2
    FROM thesis
    WHERE (prof2_am = :am OR prof3_am = :am)
  `, {
    replacements: { am: loggedProfessor.am },
    type: sequelize.QueryTypes.SELECT
  });
  const totalCount = supervisorCount.n1 + committeeCount.n2;

  
  res.status(200).json({
    supervisorAvg: Number(supervisorResults.avg_days), 
    committeeAvg: Number(committeeResults.avg_days), 
    totalAvg: totalAvg ? Number(totalAvg) : 0,

    supervisorGrade: Number(supervisorGrade.grade),
    committeeGrade: Number(committeeGrade.grade),
    totalGrade: totalGrade ? Number(totalGrade) : 0,

    supervisorCount: Number(supervisorCount.n1),
    committeeCount: Number(committeeCount.n2),
    totalCount: Number(totalCount)
  });
});

//@desc Search students by AM or name
//@route GET /api/professor/searchStudent
//@access Private
const searchStudent = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Missing query' });
  const students = await student.findAll({
    where: {
      [Op.or]: [
        { am: { [Op.like]: `%${query}%` } },
        { first_name: { [Op.like]: `%${query}%` } },
        { last_name: { [Op.like]: `%${query}%` } },
      ]
    },
    attributes: ['am', 'first_name', 'last_name', 'email']
  });
  res.status(200).json(students);
});

//@desc Assign topic to student (temp assignment)
//@route PUT /api/professor/assignTopic
//@access Private
const assignTopicToStudent = asyncHandler(async (req, res) => {
  const { topicId, studentAm } = req.body;
  if (!topicId || !studentAm) return res.status(400).json({ message: 'Missing topicId or studentAm' });
  // Find topic and check if available
  const topic = await thesis_topics.findOne({ where: { id: topicId, topic_status: 'unassigned' } });
  if (!topic) return res.status(404).json({ message: 'Topic not available' });
  // Check if student already has a thesis
  const existingThesis = await thesis.findOne({ where: { student_am: studentAm } });
  if (existingThesis) return res.status(400).json({ message: 'Student already has a thesis' });
  // Set topic as temp_assigned
  await sequelize.transaction(async (t) => {
    await topic.update({ topic_status: 'temp_assigned', student_am: studentAm });
    // Create thesis row with Pending status
    /* @MHPWS NA TO KNAOUME TRIGGER??????? */
    // await thesis.create({
    //   topic_id: topicId,
    //   student_am: studentAm,
    //   supervisor_am: topic.prof_am,
    //   thesis_status: 'Pending',
    //   assignment_date: new Date()
    // });
  });
  res.status(200).json({ message: 'Topic temporarily assigned' });
});

//@desc Get committee professors for a thesis
//@route GET /api/professor/committeeRequests
//@access Private 
const getCommitteeRequests = asyncHandler(async (req, res) => {
  const committeeProfessors = await trimelis_requests.findAll();
  const profIDs = committeeProfessors.map(prof => prof.prof_am);
  const professorNames = await professor.findAll({where: { am: profIDs}});

  const committeeInfo = committeeProfessors.map(prof => {
    const names = professorNames.find(r => r.am === prof.prof_am);

    return {
      thesis_id: prof.thesis_id,
      answer: prof.answer,
      invite_date: prof.invite_date,
      answer_date: prof.answer_date,
      professor_name: `${names.first_name} ${names.last_name}`
    };
  });
  
  res.status(200).json(committeeInfo);
});

//@desc get all professor's invitations
//@route GET /api/professor/invitations
//@access Private 
const getInvitationsList = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  const requests = await trimelis_requests.findAll({
    where: {
      prof_am: loggedProfessor.am
    }
  });
  console.log(requests);
  const invitations = await Promise.all(requests.map(async r => {
    const th = await thesis.findOne({where: {
      id: r.thesis_id
    }});
    const topic = await thesis_topics.findOne({where: {
      id: th.topic_id
    }});
    const stu = await student.findOne({ where: {
      am: th.student_am
    }});
    const supervisor = await professor.findOne({where: {
      am: th.supervisor_am
    }});

    return {
      id: r.id,
      title: topic.title,
      answer: r.answer,
      invite_date: r.invite_date,
      answer_date: r.answer_date,
      student_am: stu.am,
      student_name: `${stu.first_name} ${stu.last_name}`,
      supervisor: `${supervisor.first_name} ${supervisor.last_name}`
    };
  }));
  
  res.status(200).json(invitations);
});

//@desc accept or decline an invitation
//@route PUT /api/professor/invitations/respond
//@access Private 
const respondToInvitation = asyncHandler(async (req, res) => {
  const invitation = await trimelis_requests.findOne({where: {
    id: req.body.invitationId
  }});
  if (invitation.answer === 'accepted' || invitation.answer === 'declined') {
    res.status(400);
    throw new Error("Cant change already settled invitation");
  }
  await invitation.update({
    answer: req.body.response,
    answer_date: fn('CURDATE')
  });

  res.status(200).json({ message: `Invitation ${req.body.response}` });
});

module.exports = {
  getProfessorInfo, getTopics, createTopic, 
  editTopic, deleteTopic, getStats, getThesesList,
  searchStudent, assignTopicToStudent, getCommitteeRequests,
  getInvitationsList, respondToInvitation
};