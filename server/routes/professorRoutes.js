const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const upload = require('../middleware/uploadHandler');
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

module.exports = router;