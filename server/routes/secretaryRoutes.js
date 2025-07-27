const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const { authSecretary } = require("../middleware/authHandler");
const {uploadJSON} = require('../middleware/uploadHandler');
const router = express.Router();
const {
    getSecretaryInfo,
    getActiveTheses,
    importData
} = require("../controllers/secretaryController");

// public
// private
router.use(validateToken);
router.use(authSecretary);
router.get("/", getSecretaryInfo);
router.get("/theses/active", getActiveTheses);
router.post("/import-data", uploadJSON.single('file'), importData)


module.exports = router;