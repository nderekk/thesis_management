const asyncHandler = require("express-async-handler");
const {
  sequelize, secretary, thesis, thesis_topics,
  student, professor, users
  } = require("../config/dbConnection");
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
//@route Get /api/secretary
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

module.exports = {getSecretaryInfo, getActiveTheses, importData};