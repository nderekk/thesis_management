const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const { authSecretary } = require("../middleware/authHandler");
const router = express.Router();
const {
    getSecretaryInfo,
    getActiveTheses
} = require("../controllers/secretaryController");

// public
// private
router.use(validateToken);
router.use(authSecretary);
router.get("/", getSecretaryInfo);
router.get("/theses/active", getActiveTheses);



module.exports = router;