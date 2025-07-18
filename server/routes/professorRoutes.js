const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    getProfessorInfo,
    getProfessorThesis
} = require("../controllers/professorController");

// public
// private
router.use(validateToken);
router.get("/", getProfessorInfo);
router.get("/thesis", getProfessorThesis);


module.exports = router;