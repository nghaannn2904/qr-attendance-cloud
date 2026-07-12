const express = require("express");
const router = express.Router();

const enrollmentController = require("../controllers/enrollmentController");
const auth = require("../middleware/authMiddleware");

// Thêm nhiều sinh viên vào lớp
router.post(
    "/classes/:classId/students",
    auth.verifyToken,
    enrollmentController.addStudents
);

// Lấy danh sách sinh viên của lớp
router.get(
    "/classes/:classId/students",
    auth.verifyToken,
    enrollmentController.getStudentsByClass
);

module.exports = router;
// Xóa sinh viên khỏi lớp
router.delete(
    "/classes/:classId/students/:studentId",
    auth.verifyToken,
    enrollmentController.removeStudent
);