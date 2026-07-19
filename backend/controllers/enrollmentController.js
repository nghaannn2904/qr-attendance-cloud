const Enrollment = require("../models/enrollmentModel");

// Thêm nhiều sinh viên vào lớp
exports.addStudents = (req, res) => {

    const classId = req.params.classId;
    const { student_id } = req.body;

    if (!student_id) {

        return res.status(400).json({
            success: false,
            message: "Thiếu student_id"
        });

    }

    Enrollment.addStudentToClass(
        classId,
        student_id,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                added: result.affectedRows,
                message: "Đã thêm sinh viên vào lớp."
            });

        }
    );

};
// Lấy danh sách sinh viên của một lớp
exports.getStudentsByClass = (req, res) => {

    const classId = req.params.classId;

    Enrollment.getStudentsByClass(classId, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            students: results
        });

    });

};
// Xóa sinh viên khỏi lớp
exports.removeStudent = (req, res) => {

    const classId = req.params.classId;
    const studentId = req.params.studentId;

    Enrollment.removeStudentFromClass(
        classId,
        studentId,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Sinh viên không tồn tại trong lớp."
                });
            }

            res.json({
                success: true,
                message: "Xóa sinh viên khỏi lớp thành công."
            });

        }
    );

};