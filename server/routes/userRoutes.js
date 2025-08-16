const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    loginUser,
    logoutUser,
    getUser,
    getAnnouncements,
} = require("../controllers/userController");

// public
router.post("/login", loginUser);
router.get("/announcements", getAnnouncements)
// private
router.use(validateToken);
router.post("/logout", logoutUser);
router.post("/current", getUser);


module.exports = router;