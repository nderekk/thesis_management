const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    loginUser,
    logoutUser,
    getUser,
} = require("../controllers/userController");

// public
router.post("/login", loginUser);
// private
router.use(validateToken);
router.post("/logout", logoutUser);
router.post("/current", getUser);


module.exports = router;