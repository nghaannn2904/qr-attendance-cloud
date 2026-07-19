console.log("Attendance route loaded");
const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const auth = require("../middleware/authMiddleware");


router.post(
    "/classes/:classId/sessions",
    auth.verifyToken,
    auth.verifyTeacher,
    attendanceController.createSession
);


// =====================
// SV check-in
// =====================

router.post(
    "/attendance/check-in",
    auth.verifyToken,
    attendanceController.checkIn
);


// =====================
// LỊCH SỬ TỔNG HỢP
// ĐỂ TRƯỚC :sessionId
// =====================

router.get(

    "/classes/:classId/attendance/history",

    auth.verifyToken,

    auth.verifyTeacher,

    attendanceController.getAttendanceHistory

);



// =====================
// XEM 1 BUỔI CỤ THỂ
// =====================

router.get(

    "/classes/:classId/attendance/:sessionId",

    auth.verifyToken,

    attendanceController.getAttendanceList

);


router.get(
    "/classes/:classId/sessions",
    auth.verifyToken,
    auth.verifyTeacher,
    attendanceController.getSessions
);

router.post(

    "/classes/:classId/sessions/:sessionId/open",

    auth.verifyToken,

    auth.verifyTeacher,

    attendanceController.openSessionQr

);

router.put(

    "/classes/:classId/sessions/:sessionId",

    auth.verifyToken,

    auth.verifyTeacher,

    attendanceController.updateSession

);

router.delete(

    "/classes/:classId/sessions/:sessionId",

    auth.verifyToken,

    auth.verifyTeacher,

    attendanceController.deleteSession

);

router.post(

    "/classes/:classId/attendance/open",

    auth.verifyToken,

    auth.verifyTeacher,

    attendanceController.openCurrentSessionQr

);

module.exports = router;