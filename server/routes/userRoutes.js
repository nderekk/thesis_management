const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    loginUser,
    logoutUser,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.use(validateToken);
router.post("/logout", logoutUser);

module.exports = router;