const {Sequelize} = require("sequelize");
const initModels = require("../models/init-models");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
);

const models = initModels(sequelize);

module.exports = {
  sequelize,
  Sequelize,
  ...models
};