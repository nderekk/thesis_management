const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const {sequelize} = require("./config/dbConnection");
const cors = require('cors');
const path = require("path");

const app = express();

// middleware //

// HTML Files - SPA => More frequent refresh rates
app.use('/', express.static(path.join(__dirname, '../client'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate');
    }
  }
}));

// CSS Files - 7 Day Caching
app.use('/styles_new', express.static(path.join(__dirname, '../client/styles'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=604800');
  }
}));

// JS Files - 7 Day Caching
app.use('/scriptz',express.static(path.join(__dirname, '../client/scripts'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Cache-Control', 'public, max-age=604800');
  }
}));

app.use(express.json());
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/professor", require("./routes/professorRoutes"));
app.use("/api/secretary", require("./routes/secretaryRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "../server/uploads")));
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
      console.log(`🚀 Server is running on port http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // stop app if DB connection fails
  }
}

startServer();

