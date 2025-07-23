const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const upload = require('../middleware/uploadHandler');
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
} = require("../controllers/studentController");

// public
// private
router.use(validateToken);
router.get("/thesis", getThesisInfo);
router.get("/", getStudentInfo);
router.put("/", modifyStudentInfo);
router.get("/professorList", professorList);
router.post("/inviteProfessor", inviteProfessor);
router.post('/upload-pdf', upload.single('file'), uploadPdf);
router.post("/exam-date", setExamDate);
router.get("/exam-date", getExamDate);


module.exports = router;