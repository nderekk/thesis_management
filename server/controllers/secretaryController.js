const asyncHandler = require("express-async-handler");
const {
  sequelize, secretary, thesis_topics,
  student, professor, users
  , thesis, thesis_cancellation, thesis_grade} = require("../config/dbConnection");
const { Op, json } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');

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

//@desc Get current secretary user
//@route Get /api/secretary/import-data
//@access Private
const importData = asyncHandler(async (req, res) => {
  let stuCount = 0;
  let profCount = 0;
  let filePath = null;

  if (req.file)
    filePath = path.join(__dirname, `../uploads/${req.file.filename}`);
  else {
    res.status(400);
    throw new Error("No file uploaded");
  }
  try{
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    await fs.unlink(filePath); // clean up

    const requiredFields = [
      'name', 'surname', 'father_name', 'student_number',
      'street', 'number', 'city', 'postcode',
      'landline_telephone', 'mobile_telephone', 'email'
    ];

    const students = Array.isArray(jsonData.students) ? jsonData.students : [];
    const professors = Array.isArray(jsonData.professors) ? jsonData.professors : [];
    if (students.length === 0 && professors.length === 0)
      throw new Error("invalid json format");

    const validStudents = students.filter(student => {
      return requiredFields.every(field => field in student && student[field]);
    });

    await Promise.all(validStudents.map(async stu => {
      const t = await sequelize.transaction();

      try{
        let user = await users.create({
          email: stu.email,
          role: 'student',
          password: 'password'
        }, { transaction: t });

       await student.create({
        first_name: stu.name,
        last_name: stu.surname,
        father_name: stu.father_name,
        email: stu.email,
        phone_number: stu.landline_telephone,
        mobile_number: stu.mobile_telephone,
        address: `${stu.street} ${stu.number}`,
        city: stu.city,
        post_code: stu.postcode,
        student_userid: user.id
      }, { transaction: t });

      await t.commit();
      stuCount++;
      } catch (err) {
        await t.rollback();
        console.error(err);
      }
    }));
      
      const requiredProfFields = [
        'name', 'surname',
        'topic', 'mobile', 'email'
      ];

      const validProfessors = professors.filter(professor => {
        return requiredProfFields.every(field => field in professor && professor[field]);
      });

      await Promise.all(validProfessors.map(async prof => {
        const t = await sequelize.transaction();
        try{
          let user = await users.create({
            email: prof.email,
            role: 'professor',
            password: 'password'
          }, { transaction: t });

          await professor.create({
            first_name: prof.name,
            last_name: prof.surname,
            email: prof.email,
            phone_number: prof.mobile,
            field_of_expertise: prof.topic,
            prof_userid: user.id
          }, { transaction: t });
          await t.commit();
          profCount++;
          } catch (err) {
        await t.rollback();
        console.error(err);
      }
      }));
        res.status(200).json({ success: `Imported ${stuCount} students and ${profCount} professors!`});

  } catch (err) {
    // console.log(err.message);
    res.status(500);
    throw new Error(err.message);
  }
});


//@desc Get all theses for secretary
//@route GET /api/secretary/theses
//@access Private
const getAllTheses = asyncHandler(async (req, res) => {
  if (req.user.role !== "secretary") {
    return res.status(401).json({ error: "Error - Not Authorized" });
  }
  const { student, professor, thesis_topics } = require("../config/dbConnection");
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

//@desc Update AP number for thesis assignment
//@route PUT /api/secretary/theses/:id/ap
//@access Private
const updateThesisApNumber = asyncHandler(async (req, res) => {
  if (req.user.role !== "secretary") {
    return res.status(401).json({ error: "Error - Not Authorized" });
  }

  const { id } = req.params;
  const { apNumber } = req.body;

  try {
    const thesisRecord = await thesis.findByPk(id);
    if (!thesisRecord) {
      return res.status(404).json({ error: "Διπλωματική δεν βρέθηκε" });
    }

    if (thesisRecord.thesis_status !== 'Active') {
      return res.status(400).json({ error: "Η διπλωματική πρέπει να είναι ενεργή για να ενημερωθεί ο ΑΠ" });
    }

    await thesisRecord.update({ ap_from_gs: apNumber });
    
    res.status(200).json({ 
      message: "Αριθμός Πρωτοκόλλου ενημερώθηκε επιτυχώς",
      thesis: thesisRecord 
    });
  } catch (error) {
    res.status(500).json({ error: "Σφάλμα κατά την ενημέρωση: " + error.message });
  }
});

//@desc Cancel thesis assignment
//@route PUT /api/secretary/theses/:id/cancel
//@access Private
const cancelThesis = asyncHandler(async (req, res) => {
  if (req.user.role !== "secretary") {
    return res.status(401).json({ error: "Error - Not Authorized" });
  }

  const { id } = req.params;
  const { assemblyNumber, assemblyYear, reason } = req.body;

  try {
    const thesisRecord = await thesis.findByPk(id);
    if (!thesisRecord) {
      return res.status(404).json({ error: "Διπλωματική δεν βρέθηκε" });
    }

    if (thesisRecord.thesis_status !== 'Active') {
      return res.status(400).json({ error: "Η διπλωματική πρέπει να είναι ενεργή για να ακυρωθεί" });
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Update thesis status to cancelled
      await thesisRecord.update({ thesis_status: 'Cancelled' }, { transaction });

      // Create cancellation record
      await thesis_cancellation.create({
        thesis_id: id,
        reason: 'By Secretary',
        reason_text: reason,
        assembly_number: assemblyNumber,
        assembly_year: assemblyYear
      }, { transaction });

      await transaction.commit();

      res.status(200).json({ 
        message: "Η ανάθεση διπλωματικής ακυρώθηκε επιτυχώς",
        thesis: thesisRecord 
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ error: "Σφάλμα κατά την ακύρωση: " + error.message });
  }
});

//@desc Complete thesis (change status to Completed)
//@route PUT /api/secretary/theses/:id/complete
//@access Private
const completeThesis = asyncHandler(async (req, res) => {
  if (req.user.role !== "secretary") {
    return res.status(401).json({ error: "Error - Not Authorized" });
  }

  const { id } = req.params;

  try {
    const thesisRecord = await thesis.findByPk(id);
    if (!thesisRecord) {
      return res.status(404).json({ error: "Διπλωματική δεν βρέθηκε" });
    }

    if (thesisRecord.thesis_status !== 'Review') {
      return res.status(400).json({ error: "Η διπλωματική πρέπει να είναι υπό εξέταση για να ολοκληρωθεί" });
    }

    // Check if thesis has grade and nemertis link
    const thesisGrade = await thesis_grade.findOne({ where: { thesis_id: id } });
    
    if (!thesisGrade || !thesisGrade.final_grade) {
      return res.status(400).json({ error: "Απαιτείται να έχει καταχωρηθεί βαθμός για τη διπλωματική" });
    }

    if (!thesisRecord.nemertes_link) {
      return res.status(400).json({ error: "Απαιτείται να έχει αναρτηθεί ο σύνδεσμος προς το Νημερτή" });
    }

    // Update thesis status to completed
    await thesisRecord.update({ 
      thesis_status: 'Completed',
      completion_date: new Date()
    });
    
    res.status(200).json({ 
      message: "Η διπλωματική ολοκληρώθηκε επιτυχώς",
      thesis: thesisRecord 
    });
  } catch (error) {
    res.status(500).json({ error: "Σφάλμα κατά την ολοκλήρωση: " + error.message });
  }
});

//@desc Get thesis details with grades and cancellation info
//@route GET /api/secretary/theses/:id
//@access Private
const getThesisDetails = asyncHandler(async (req, res) => {
  if (req.user.role !== "secretary") {
    return res.status(401).json({ error: "Error - Not Authorized" });
  }

  const { id } = req.params;

  try {
    const { student, professor, thesis_topics } = require("../config/dbConnection");
    
    const thesisRecord = await thesis.findByPk(id, {
      include: [
        { model: student, as: 'student_am_student', attributes: ['am', 'first_name', 'last_name'] },
        { model: professor, as: 'supervisor_am_professor', attributes: ['am', 'first_name', 'last_name'] },
        { model: thesis_topics, as: 'topic', attributes: ['title'] }
      ]
    });

    if (!thesisRecord) {
      return res.status(404).json({ error: "Διπλωματική δεν βρέθηκε" });
    }

    // Get thesis grade
    const thesisGrade = await thesis_grade.findOne({ where: { thesis_id: id } });
    
    // Get cancellation info if exists
    const cancellation = await thesis_cancellation.findOne({ where: { thesis_id: id } });

    const result = {
      id: thesisRecord.id,
      title: thesisRecord.topic ? thesisRecord.topic.title : '',
      studentId: thesisRecord.student_am,
      studentName: thesisRecord.student_am_student ? `${thesisRecord.student_am_student.first_name} ${thesisRecord.student_am_student.last_name}` : '',
      supervisorId: thesisRecord.supervisor_am,
      supervisorName: thesisRecord.supervisor_am_professor ? `${thesisRecord.supervisor_am_professor.first_name} ${thesisRecord.supervisor_am_professor.last_name}` : '',
      status: thesisRecord.thesis_status,
      assignedDate: thesisRecord.assignment_date,
      completionDate: thesisRecord.completion_date,
      apNumber: thesisRecord.ap_from_gs,
      nemertisLink: thesisRecord.nemertes_link,
      hasGrade: !!thesisGrade && !!thesisGrade.final_grade,
      finalGrade: thesisGrade ? thesisGrade.final_grade : null,
      cancellation: cancellation ? {
        reason: cancellation.reason,
        reasonText: cancellation.reason_text,
        assemblyNumber: cancellation.assembly_number,
        assemblyYear: cancellation.assembly_year
      } : null
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Σφάλμα κατά την ανάκτηση: " + error.message });
  }
});

module.exports = {
  getSecretaryInfo, 
  getAllTheses, 
  updateThesisApNumber, 
  cancelThesis, 
  completeThesis,
  getThesisDetails,
  getActiveTheses, 
  importData
};