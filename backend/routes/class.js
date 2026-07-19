const express = require("express");
const router = express.Router();

const classController = require("../controllers/classController");

const auth = require("../middleware/authMiddleware");



// Tạo lớp

router.post(
    "/",
    auth.verifyToken,
    classController.create
);



// Lấy danh sách lớp giáo viên

router.get(
    "/",
    auth.verifyToken,
    classController.getAll
);



// Lấy chi tiết lớp

router.get(
    "/:id",
    auth.verifyToken,
    classController.getDetail
);



// Lấy sinh viên trong lớp

router.get(
    "/:id/students",
    auth.verifyToken,
    classController.getStudents
);

router.delete(
    "/:classId/students/:studentId",
    auth.verifyToken,
    auth.verifyTeacher,
    classController.removeStudent
);

router.get(

    "/:id/attendance",

    auth.verifyToken,

    classController.getAttendance

);
module.exports = router;