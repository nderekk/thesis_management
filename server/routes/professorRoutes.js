const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    getProfessorInfo
} = require("../controllers/professorController");

// public
// private
router.use(validateToken);
router.post("/", getProfessorInfo);


module.exports = router;