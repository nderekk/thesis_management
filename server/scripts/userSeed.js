const dotenv = require("dotenv").config();
const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require("../config/dbConnection");

const User = require("../models/user")(sequelize, DataTypes);

async function addUsers() {
  try {
    await sequelize.authenticate(); // check db connection
    console.log('✅ Connection has been established successfully.');

    await sequelize.sync({alter: true}); // syncs tables an exei allages tis vazei
    console.log('✅ All models synchronized.');
    // Sync model if needed (optional, be careful on production)
    // await User.sync({ force: false });

    const users = [
      { email: 'skegias@kathigitas.com', password: '123', role: 'professor' },
      { email: 'skegias@mathitas.com', password: '123', role: 'student' },
      { email: 'skegias@gramateias.com', password: '123', role: 'secretary' },
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
