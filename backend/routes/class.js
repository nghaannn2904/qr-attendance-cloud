const express = require("express");
const router = express.Router();

const classController = require("../controllers/classController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth.verifyToken, classController.create);

router.get("/", auth.verifyToken, classController.getAll);

module.exports = router;