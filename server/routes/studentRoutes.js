const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    getThesisInfo,
    getStudentInfo,
    modifyStudentInfo,
    professorList,
} = require("../controllers/studentController");

// public
// private
router.use(validateToken);
router.get("/thesis", getThesisInfo);
router.get("/", getStudentInfo);
router.put("/", modifyStudentInfo);
router.get("/professorList", professorList);


module.exports = router;