const {constants} = require("../utils/constants");
const errorHandler = (err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(constants.VALIDATION_ERROR);
    return res.json({
      title: "Validation Failed",
      message: "File too large. Max size is 10 MB",
    });
  }

  if (err.message.includes("Only PDFs")) {
    res.status(constants.VALIDATION_ERROR);
    return res.json({
      title: "Validation Failed",
      message: "Only PDF files are allowed",
    });
  }

  if (err.message.includes("Only JSONs")) {
    res.status(constants.VALIDATION_ERROR);
    return res.json({
      title: "Validation Failed",
      message: "Only JSON files are allowed",
    });
  }
  
  switch (res.statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({ 
        title: "Validation Failed",
        message: err.message, 
      });
      break;
    case constants.NOT_FOUND: 
      res.json({ 
        title: "Not Found", 
        message: err.message, 
      });
      break;
    case constants.UNAUTHORIZED: 
      res.json({ 
        title: "Unauthorized", 
        message: err.message, 
      });
      break;
    case constants.FORBIDDEN: 
      res.json({ 
        title: "Forbidden", 
        message: err.message, 
      });
      break;
    case constants.SERVER_ERROR: 
      res.json({ 
        title: "Server error", 
        message: err.message, 
      });
      break;
    default:
      console.log(`${res.statusCode} No Error ola gucci\n`, err.stack);
      break;    
    }
};

module.exports = errorHandler;