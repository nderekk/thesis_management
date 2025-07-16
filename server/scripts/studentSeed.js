const dotenv = require("dotenv").config({ path: __dirname + "/../.env" });
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/dbConnection");

const Student = require("../models/student")(sequelize, DataTypes);

async function addStudents() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await sequelize.sync({ alter: true });
    console.log('✅ All models synchronized.');

    const students = [
      {
        first_name: 'John',
        last_name: 'Doe',
        father_name: 'George',
        semester: 6,
        email: 'johndoe@student.com',
        phone_number: 2610999999,
        mobile_number: 6901234567,
        address: '123 Main Street',
        city: 'Patras',
        post_code: 26500,
        student_userid: 2 // Make sure this ID exists in your user table
      },
      {
        first_name: 'Maria',
        last_name: 'Papadopoulou',
        father_name: 'Nikos',
        semester: 8,
        email: 'mariapapa@student.com',
        phone_number: 2610888888,
        mobile_number: 6912345678,
        address: '456 Another St',
        city: 'Athens',
        post_code: 11523,
        student_userid: 4 // Adjust according to your user table
      }
    ];

    for (const studentData of students) {
      const student = await Student.create(studentData);
      console.log(`🎓 Created student with AM ${student.am} and name ${student.first_name} ${student.last_name}`);
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Failed to seed students:', error);
  }
}

addStudents();
