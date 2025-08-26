const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {upload} = require('../middleware/uploadHandler');
const {authStudent, authStudentSecretary} = require('../middleware/authHandler');
const router = express.Router();
const {
    getThesisInfo,
    getStudentInfo,
    modifyStudentInfo,
    professorList,
    inviteProfessor,
    uploadPdf,
    setExamDate,
    getExamDate,
    modifyExamDate,
    getThesisGrade,
} = require("../controllers/studentController");

// public
// private
router.use(validateToken);
router.get("/thesis", authStudentSecretary, getThesisInfo);
router.use(authStudent);
router.get("/", getStudentInfo);
router.put("/", modifyStudentInfo);
router.get("/professorList", professorList);
router.post("/inviteProfessor", inviteProfessor);
router.post('/upload-pdf', upload.single('file'), uploadPdf);
router.post("/exam-date", setExamDate);
router.get("/exam-date", getExamDate);
router.put("/exam-date", modifyExamDate);
router.get("/thesis/grade", getThesisGrade);


module.exports = router;