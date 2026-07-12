const express = require("express");
const router = express.Router();

const studentAuthController = require("../controllers/studentAuthController");

router.post("/login", studentAuthController.login);

module.exports = router;