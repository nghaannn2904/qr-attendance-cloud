const express = require("express");

const router = express.Router();


const studentController = require("../controllers/studentController");

const auth = require("../middleware/authMiddleware");



// =========================
// GIÁO VIÊN QUẢN LÝ SV
// =========================


// Thêm sinh viên
router.post(
    "/",
    auth.verifyToken,
    studentController.create
);



// Lấy danh sách sinh viên
router.get(
    "/",
    auth.verifyToken,
    studentController.getAll
);



// Xóa sinh viên
router.delete(
    "/:id",
    auth.verifyToken,
    studentController.delete
);





// =========================
// SINH VIÊN XEM LỚP
// =========================


router.get(

    "/classes",

    auth.verifyToken,

    auth.verifyStudent,

    studentController.getClasses

);

router.get(
    "/search/:studentCode",
    auth.verifyToken,
    studentController.searchStudent
);

// Chi tiết lớp sinh viên
router.get(

    "/classes/:id",

    auth.verifyToken,

    auth.verifyStudent,

    studentController.getClassDetail

);



router.get(

    "/classes/:id/attendance-history",

    auth.verifyToken,

    auth.verifyStudent,

    studentController.getAttendanceHistory

);
module.exports = router;