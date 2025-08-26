const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const { authSecretary } = require("../middleware/authHandler");
const {uploadJSON} = require('../middleware/uploadHandler');
const router = express.Router();
const {
    getSecretaryInfo,
    getActiveTheses,
    importData, 
    getAllTheses, 
    updateThesisApNumber, 
    cancelThesis, 
    completeThesis,
    getThesisDetails
} = require("../controllers/secretaryController");

// public
// private
router.use(validateToken);
router.use(authSecretary);
router.get("/", getSecretaryInfo);
router.get("/theses/active", getActiveTheses);
router.post("/import-data", uploadJSON.single('file'), importData)
router.get("/theses", getAllTheses);
router.get("/theses/:id", getThesisDetails);
router.put("/theses/:id/ap", updateThesisApNumber);
router.put("/theses/:id/cancel", cancelThesis);
router.put("/theses/:id/complete", completeThesis);

module.exports = router;