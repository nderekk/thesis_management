const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require("dotenv").config();
const {sequelize} = require("../config/dbConnection");

// Import your model definition (adjust path if needed)
const User = require('../models/user')(sequelize, DataTypes);

async function addUsers() {
  try {
    await sequelize.authenticate(); // check db connection
    console.log('✅ Connection has been established successfully.');

    await sequelize.sync({alter: true}); // syncs tables an exei allages tis vazei
    console.log('✅ All models synchronized.');
    // Sync model if needed (optional, be careful on production)
    // await User.sync({ force: false });

    const users = [
      { email: 'professor@example.com', password: 'securepass1', role: 'professor' },
      { email: 'student@example.com', password: 'securepass2', role: 'student' },
      { email: 'secretary@example.com', password: 'securepass3', role: 'secretary' },
    ];

    for (const userData of users) {
      const user = await User.create(userData);
      console.log(`Created user with id ${user.id} and role ${user.role}`);
    }

    await sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database or create users:', error);
  }
}

addUsers();
