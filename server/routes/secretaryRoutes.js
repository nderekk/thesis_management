const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    getSecretaryInfo
} = require("../controllers/secretaryController");

// public
// private
router.use(validateToken);
router.get("/", getSecretaryInfo);


module.exports = router;