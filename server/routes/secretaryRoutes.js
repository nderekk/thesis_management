const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    getSecretaryInfo, 
    getAllTheses, 
    updateThesisApNumber, 
    cancelThesis, 
    completeThesis,
    getThesisDetails
} = require("../controllers/secretaryController");

// public
// private
router.use(validateToken);
router.get("/", getSecretaryInfo);
router.get("/theses", getAllTheses);
router.get("/theses/:id", getThesisDetails);
router.put("/theses/:id/ap", updateThesisApNumber);
router.put("/theses/:id/cancel", cancelThesis);
router.put("/theses/:id/complete", completeThesis);

module.exports = router;