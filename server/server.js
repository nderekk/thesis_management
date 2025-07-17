const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const {sequelize} = require("./config/dbConnection");
const cors = require('cors');

const app = express();
// middleware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');  // ή το συγκεκριμένο origin σου αντί για '*'
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
// app.use("/api/<thing>", require("./routes/<analogo_route>"));
app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate(); // check db connection
    console.log('✅ Connection has been established successfully.');

    await sequelize.sync({alter: true}); // syncs tables an exei allages tis vazei
    console.log('✅ All models synchronized.');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // stop app if DB connection fails
  }
}

startServer();

