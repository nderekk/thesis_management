const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
    loginUser,
} = require("../controllers/userController");

router.post("/login", loginUser);

module.exports = router;