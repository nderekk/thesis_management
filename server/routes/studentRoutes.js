const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    getThesisInfo
} = require("../controllers/studentController");

// public
// private
router.use(validateToken);
router.get("/:id/thesis", getThesisInfo);



module.exports = router;