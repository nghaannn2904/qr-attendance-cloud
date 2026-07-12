const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const auth = require("../middleware/authMiddleware");

// Thêm sinh viên
router.post("/", auth.verifyToken, studentController.create);

// Lấy danh sách sinh viên
router.get("/", auth.verifyToken, studentController.getAll);

// Xóa sinh viên
router.delete("/:id", auth.verifyToken, studentController.delete);

module.exports = router;