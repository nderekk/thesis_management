const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    getThesisInfo,
    getStudentInfo,
} = require("../controllers/studentController");

// public
// private
router.use(validateToken);
router.get("/thesis", getThesisInfo);
router.get("/", getStudentInfo);


module.exports = router;