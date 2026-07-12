const Student = require("../models/studentModel");

// Thêm sinh viên
exports.create = (req, res) => {

    const { student_code, full_name, email } = req.body;

    Student.createStudent(
        {
            student_code,
            full_name,
            email
        },
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Thêm sinh viên thành công!"
            });

        }
    );

};

// Lấy danh sách sinh viên
exports.getAll = (req, res) => {

    Student.getAllStudents((err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(results);

    });

};

// Xóa sinh viên
exports.delete = (req, res) => {

    const id = req.params.id;

    Student.deleteStudent(id, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "Xóa sinh viên thành công!"
        });

    });

};