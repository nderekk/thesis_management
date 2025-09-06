const asyncHandler = require("express-async-handler");
const {sequelize, professor, thesis_topics, thesis, student , trimelis_requests, thesis_cancellation, thesis_comments, thesis_grade, announcements, thesis_logs} = require("../config/dbConnection");
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
      attached_file_name : topic.attached_discription_file,
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
  const manage = req.query.manage === "true";
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });

  const baseConditions = [
    {
      [Op.or]: [
        { supervisor_am: loggedProfessor.am },
        { prof2_am: loggedProfessor.am },
        { prof3_am: loggedProfessor.am }
      ]
    }
  ];

  if (manage) {
    baseConditions.push({ thesis_status: { [Op.ne]: "Completed" } });
  }

  const whereClause = baseConditions.length === 1 ? baseConditions[0] : { [Op.and]: baseConditions };

  const professorThesesSupervisor = await thesis.findAll({ where: whereClause });
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
        student_name: `${stud.first_name} ${stud.last_name}`,
        enableGrading: prof.enableGrading,
        draft_text : prof.thesis_content_file,
        enableAnnouncement : prof.enableAnnounce,
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
    supervisorAvg: Number(supervisorResults.avg_days)/30, 
    committeeAvg: Number(committeeResults.avg_days)/30, 
    totalAvg: totalAvg ? Number(totalAvg)/30 : 0,

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

//@desc Update thesis from Active to Review
//@route PUT /api/professor/updateToReview
//@access Private
const putThesisReview = asyncHandler(async (req, res) => {
  const { thesisID } = req.body;
  if (!thesisID) return res.status(400).json({ message: 'Missing thesisID' });

  const currentThesis = await thesis.findOne({ where : { id : thesisID } });

  if (currentThesis.ap_from_gs){
    await currentThesis.update({ thesis_status: 'Review'});
    res.status(200).json({ message: 'Status changed from Active to Review.' });
  } else {
    res.status(400).json({ message: 'Απαιτείται αριθμός πρωτοκολλου απο την Γραμματεία' });
  }
});


//@desc Cancel a thesis
//@route POST /api/professor/cancelThesis
//@access Private
const postCancelThesis = asyncHandler(async (req, res) => {
  const { thesisID , assemblyYear , assemblyNumber } = req.body;
  if (!thesisID || !assemblyNumber || !assemblyYear) return res.status(400).json({ message: 'Missing thesisID , assembly year or assembly number.' });

  const thesisCancellation = await thesis_cancellation.create({
    thesis_id : thesisID,
    reason : 'By Professor',
    assembly_year : assemblyYear,
    assembly_number : assemblyNumber
  });
  res.status(200).json(thesisCancellation);

});

//@desc Get notes from a thesis (only creator can see). If thesisID provided, filter by it.
//@route GET /api/professor/thesisNotes
//@access Private
const getThesisNotes = asyncHandler(async (req, res) => {
  const prof = await professor.findOne({ where : { prof_userid : req.user.id}});
  const { thesisID } = req.query;

  const whereClause = { prof_am: prof.am };
  if (thesisID) whereClause.thesis_id = thesisID;

  const thesisNotes = await thesis_comments.findAll({ 
    where: whereClause,
    order: [["comment_date", "DESC"], ["id", "DESC"]]
  });

  res.status(200).json(thesisNotes);
});

//@desc Cancel a thesis
//@route POST /api/professor/thesisNotes
//@access Private
const postThesisNotes = asyncHandler(async (req, res) => {
  const { thesisID , newNotes } = req.body;
  if (!thesisID || !newNotes) return res.status(400).json({ message: 'Missing thesisID or new notes' });

  const prof = await professor.findOne({ where : { prof_userid : req.user.id}})

  const postNewNote = await thesis_comments.create({
    thesis_id : thesisID,
    prof_am: prof.am,
    comments : newNotes,
    comment_date : fn('CURDATE')
  });
  res.status(200).json(postNewNote);

});

//@desc Enabling the grading system
//@route PUT /api/professor/enableGrading
//@access Private
const putEnableGrading = asyncHandler(async (req, res) => {
  const { thesisID } = req.body;
  if (!thesisID) return res.status(400).json({ message: 'Missing thesisID' });

  const currentThesis = await thesis.findOne({ where : { id : thesisID } });

  await currentThesis.update({ enableGrading: 1});
  res.status(200).json({ message: 'Grading got enabled.' });

});

//@desc Each professor can post the grade
//@route PUT /api/professor/postGrade
//@access Private
const postGrade = asyncHandler(async (req, res) => {
  const { thesisID, grade1, grade2, grade3, grade4 } = req.body;
  if (!thesisID || !grade1 || !grade2 || !grade3 || !grade4) return res.status(400).json({ message: 'Missing thesisID or grade' });

  const currentThesis = await thesis_grade.findOne({ where : { thesis_id : thesisID } });

  const prof = await professor.findOne({where: {prof_userid : req.user.id}});
  const profID = prof.am; 

  if((currentThesis.prof1am === profID) && (currentThesis.prof1_grade1 === null))
    await currentThesis.update({prof1_grade1: grade1 , prof1_grade2: grade2, prof1_grade3: grade3, prof1_grade4: grade4});
  else if((currentThesis.prof2am === profID) && (currentThesis.prof2_grade1 === null))
    await currentThesis.update({prof2_grade1: grade1 , prof2_grade2: grade2, prof2_grade3: grade3, prof2_grade4: grade4});
  else if((currentThesis.prof3am === profID) && (currentThesis.prof3_grade1 === null))
    await currentThesis.update({prof3_grade1: grade1 , prof3_grade2: grade2, prof3_grade3: grade3, prof3_grade4: grade4});
  else
    return res.status(400).json({ message: 'You have already submitted a grade' });

  res.status(200).json({currentThesis});

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

//@desc Get grades of a thesis
//@route POST /api/professor/getGradeList
//@access Private
const getGradeList = asyncHandler(async (req, res) => {
  
  const grades = await thesis_grade.findOne({ where: {thesis_id: req.body.thesisID} });

  if(grades){
    const prof1 = await professor.findOne({ where: {am: grades.prof1am} });
    const prof2 = await professor.findOne({ where: {am: grades.prof2am} });
    const prof3 = await professor.findOne({ where: {am: grades.prof3am} });

    const prof = await professor.findOne({where: {prof_userid : req.user.id}});
    const profID = prof.am; 

    const prof1grades = 
        {prof_name: `${prof1.first_name} ${prof1.last_name}`,
        grade1: grades.prof1_grade1,
        grade2: grades.prof1_grade2,
        grade3: grades.prof1_grade3,
        grade4: grades.prof1_grade4
      };
    
    const prof2grades = 
        {prof_name: `${prof2.first_name} ${prof2.last_name}`,
        grade1: grades.prof2_grade1,
        grade2: grades.prof2_grade2,
        grade3: grades.prof2_grade3,
        grade4: grades.prof2_grade4
      };
    
    const prof3grades = 
        {prof_name: `${prof3.first_name} ${prof3.last_name}`,
        grade1: grades.prof3_grade1,
        grade2: grades.prof3_grade2,
        grade3: grades.prof3_grade3,
        grade4: grades.prof3_grade4
      };
    
    
    if(profID === grades.prof1am){
      res.status(200).json([prof2grades,prof3grades]);
    }else if(profID === grades.prof2am){
      res.status(200).json([prof1grades,prof3grades]);
    }else if(profID === grades.prof3am){
      res.status(200).json([prof1grades,prof2grades]);
    }else
      res.status(200).json({});

}else
   res.status(200).json({});

});

//@desc Get grades of a thesis ONLY for the professor who queried
//@route POST /api/professor/getProfsGrade
//@access Private
const getProfsGrade = asyncHandler(async (req, res) => {
  
  const grades = await thesis_grade.findOne({ where: {thesis_id: req.body.thesisID} });

  if(grades){
    const prof1 = await professor.findOne({ where: {am: grades.prof1am} });
    const prof2 = await professor.findOne({ where: {am: grades.prof2am} });
    const prof3 = await professor.findOne({ where: {am: grades.prof3am} });

    const prof = await professor.findOne({where: {prof_userid : req.user.id}});
    const profID = prof.am; 

    const prof1grades = 
        {prof_name: `${prof1.first_name} ${prof1.last_name}`,
        grade1: grades.prof1_grade1,
        grade2: grades.prof1_grade2,
        grade3: grades.prof1_grade3,
        grade4: grades.prof1_grade4
      };
    
    const prof2grades = 
        {prof_name: `${prof2.first_name} ${prof2.last_name}`,
        grade1: grades.prof2_grade1,
        grade2: grades.prof2_grade2,
        grade3: grades.prof2_grade3,
        grade4: grades.prof2_grade4
      };
    
    const prof3grades = 
        {prof_name: `${prof3.first_name} ${prof3.last_name}`,
        grade1: grades.prof3_grade1,
        grade2: grades.prof3_grade2,
        grade3: grades.prof3_grade3,
        grade4: grades.prof3_grade4
      };
    
    
    if(profID === grades.prof1am){
      res.status(200).json(prof1grades);
    }else if(profID === grades.prof2am){
      res.status(200).json(prof2grades);
    }else if(profID === grades.prof3am){
      res.status(200).json(prof3grades);
    }else
      res.status(200).json({});

}else
   res.status(200).json({});

});

//@desc accept or decline an invitation
//@route POST /api/professor/newAnnouncement
//@access Private 
const postAnnouncement = asyncHandler(async (req, res) => {
  const { thesisID , announcementText} = req.body;
  if (!thesisID || !announcementText) return res.status(400).json({ message: 'Missing thesisID or announcement text.' });
  
  const createAnnouncement = await announcements.create({
    thesis_id : thesisID,
    announcement_datetime : fn('NOW'),
    announcement_content : announcementText
  });

  res.status(200).json({ createAnnouncement });
});

//@desc Get comprehensive thesis details including logs, grades, and committee
//@route GET /api/professor/thesis/:id
//@access Private
const getThesisDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Get current professor
  const currentProfessor = await professor.findOne({ where: { prof_userid: req.user.id } });
  if (!currentProfessor) {
    res.status(404);
    throw new Error("Professor not found");
  }

  // Get thesis with related data
  const thesisData = await thesis.findOne({
    where: { id: id },
    include: [
      {
        model: thesis_topics,
        as: 'topic',
        attributes: ['title', 'description', 'attached_discription_file', 'original_file_name']
      },
      {
        model: student,
        as: 'student_am_student',
        attributes: ['first_name', 'last_name', 'am', 'email', 'semester']
      },
      {
        model: professor,
        as: 'supervisor_am_professor',
        attributes: ['first_name', 'last_name', 'am', 'email', 'field_of_expertise']
      },
      {
        model: professor,
        as: 'prof2_am_professor',
        attributes: ['first_name', 'last_name', 'am', 'email', 'field_of_expertise']
      },
      {
        model: professor,
        as: 'prof3_am_professor',
        attributes: ['first_name', 'last_name', 'am', 'email', 'field_of_expertise']
      }
    ]
  });

  if (!thesisData) {
    res.status(404);
    throw new Error("Thesis not found");
  }

  // Check if professor is involved in this thesis
  const isInvolved = 
    thesisData.supervisor_am === currentProfessor.am ||
    thesisData.prof2_am === currentProfessor.am ||
    thesisData.prof3_am === currentProfessor.am;

  if (!isInvolved) {
    res.status(403);
    throw new Error("Not authorized to view this thesis");
  }

  // Get thesis logs (action timeline)
  const thesisLogs = await sequelize.query(`
    SELECT 
      timedate,
      prev_status,
      new_status
    FROM thesis_logs 
    WHERE thesis_id = :thesisId 
    ORDER BY timedate ASC
  `, {
    replacements: { thesisId: id },
    type: sequelize.QueryTypes.SELECT
  });

  // Get thesis grade
  const thesisGrade = await thesis_grade.findOne({ where: { thesis_id: id } });

  // Get thesis presentation info
  const thesisPresentation = await sequelize.query(`
    SELECT 
      date_time,
      presentation_type,
      venue
    FROM thesis_presentation 
    WHERE thesis_id = :thesisId
  `, {
    replacements: { thesisId: id },
    type: sequelize.QueryTypes.SELECT
  });

  // Get links (nemertis, etc.)
  const thesisLinks = await sequelize.query(`
    SELECT url 
    FROM links 
    WHERE thesis_id = :thesisId
  `, {
    replacements: { thesisId: id },
    type: sequelize.QueryTypes.SELECT
  });

  // Determine professor's role in this thesis
  let professorRole = '';
  if (thesisData.supervisor_am === currentProfessor.am) {
    professorRole = 'Επιβλέπων';
  } else if (thesisData.prof2_am === currentProfessor.am) {
    professorRole = 'Μέλος Τριμελούς';
  } else if (thesisData.prof3_am === currentProfessor.am) {
    professorRole = 'Μέλος Τριμελούς';
  }

  // Prepare response
  const response = {
    thesis: {
      id: thesisData.id,
      title: thesisData.topic.title,
      description: thesisData.topic.description,
      status: thesisData.thesis_status,
      assignment_date: thesisData.assignment_date,
      completion_date: thesisData.completion_date,
      thesis_content_file: thesisData.thesis_content_file,
      nemertes_link: thesisData.nemertes_link,
      enableGrading: thesisData.enableGrading,
      enableAnnounce: thesisData.enableAnnounce
    },
    student: {
      am: thesisData.student_am_student.am,
      name: `${thesisData.student_am_student.first_name} ${thesisData.student_am_student.last_name}`,
      email: thesisData.student_am_student.email,
      semester: thesisData.student_am_student.semester
    },
    committee: {
      supervisor: {
        am: thesisData.supervisor_am_professor.am,
        name: `${thesisData.supervisor_am_professor.first_name} ${thesisData.supervisor_am_professor.last_name}`,
        email: thesisData.supervisor_am_professor.email,
        field: thesisData.supervisor_am_professor.field_of_expertise
      },
      prof2: thesisData.prof2_am_professor ? {
        am: thesisData.prof2_am_professor.am,
        name: `${thesisData.prof2_am_professor.first_name} ${thesisData.prof2_am_professor.last_name}`,
        email: thesisData.prof2_am_professor.email,
        field: thesisData.prof2_am_professor.field_of_expertise
      } : null,
      prof3: thesisData.prof3_am_professor ? {
        am: thesisData.prof3_am_professor.am,
        name: `${thesisData.prof3_am_professor.first_name} ${thesisData.prof3_am_professor.last_name}`,
        email: thesisData.prof3_am_professor.email,
        field: thesisData.prof3_am_professor.field_of_expertise
      } : null
    },
    professorRole: professorRole,
    actionTimeline: thesisLogs,
    grades: thesisGrade ? {
      final_grade: thesisGrade.final_grade,
      prof1_grades: {
        grade1: thesisGrade.prof1_grade1,
        grade2: thesisGrade.prof1_grade2,
        grade3: thesisGrade.prof1_grade3,
        grade4: thesisGrade.prof1_grade4
      },
      prof2_grades: {
        grade1: thesisGrade.prof2_grade1,
        grade2: thesisGrade.prof2_grade2,
        grade3: thesisGrade.prof2_grade3,
        grade4: thesisGrade.prof2_grade4
      },
      prof3_grades: {
        grade1: thesisGrade.prof3_grade1,
        grade2: thesisGrade.prof3_grade2,
        grade3: thesisGrade.prof3_grade3,
        grade4: thesisGrade.prof3_grade4
      }
    } : null,
    presentation: thesisPresentation.length > 0 ? thesisPresentation[0] : null,
    links: thesisLinks.map(link => link.url)
  };

  res.status(200).json(response);
});

module.exports = {
  getProfessorInfo, getTopics, createTopic, getThesisNotes,
  editTopic, deleteTopic, getStats, getThesesList,postCancelThesis,
  searchStudent, assignTopicToStudent, getCommitteeRequests, putThesisReview,
  postThesisNotes , putEnableGrading, postGrade, getInvitationsList, respondToInvitation,
  getGradeList, getProfsGrade, postAnnouncement, getThesisDetails
};