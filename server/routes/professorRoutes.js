const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {upload} = require('../middleware/uploadHandler');
const {authProfessor} = require('../middleware/authHandler');
const router = express.Router();
const {
    getProfessorInfo,
    getTopics,
    createTopic,
    editTopic,
    deleteTopic,
    getStats,
    getThesesList,
    searchStudent,
    assignTopicToStudent,
    getCommitteeRequests,
    putThesisReview,
    postCancelThesis,
    getThesisNotes,
    postThesisNotes,s
} = require("../controllers/professorController");

// public
// private
router.use(validateToken);
router.use(authProfessor);
router.get("/", getProfessorInfo);
router.get("/topics", getTopics);
router.post("/topic", upload.single('file'), createTopic);
router.delete("/topic", deleteTopic);
router.put("/topic", upload.single('file'), editTopic);
router.get("/stats", getStats)
router.get("/thesesList", getThesesList);
router.get("/searchStudent", searchStudent);
router.put("/assignTopic", assignTopicToStudent);
router.get("/committeeRequests", getCommitteeRequests);
router.put("/updateToReview", putThesisReview);
router.post("/cancelThesis", postCancelThesis);
router.get("/thesisNotes", getThesisNotes);
router.post("/thesisNotes", postThesisNotes);

module.exports = router;