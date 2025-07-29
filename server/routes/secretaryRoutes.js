const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    getSecretaryInfo, getAllTheses
} = require("../controllers/secretaryController");

// public
// private
router.use(validateToken);
router.get("/", getSecretaryInfo);
router.get("/theses", getAllTheses);


module.exports = router;