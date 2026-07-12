const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const auth = require("../middleware/authMiddleware");

/**
 * GV tạo QR
 */
router.post(
    "/classes/:classId/attendance/open",
    auth.verifyToken,
    auth.verifyTeacher,

    attendanceController.startSession
);

/**
 * SV check-in QR
 */
router.post(
    "/attendance/check-in",
    auth.verifyToken,
    attendanceController.checkIn
);

/**
 * Giáo viên xem danh sách điểm danh
 */
router.get(
    "/classes/:classId/attendance/:sessionId",
    auth.verifyToken,
    attendanceController.getAttendanceList
);

module.exports = router;

