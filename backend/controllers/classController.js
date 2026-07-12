const Class = require("../models/classModel");

/**
 * Tạo lớp
 */
exports.create = (req, res) => {

    const teacher_id = req.user.id;

    const {
        subject_id,
        section,
        class_type,
        semester,
        academic_year
    } = req.body;

    Class.createClass(
        {
            subject_id,
            section,
            class_type,
            semester,
            academic_year,
            teacher_id
        },
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Tạo lớp thành công."
            });

        }
    );

};

/**
 * Lấy danh sách lớp của giáo viên
 */
exports.getAll = (req, res) => {

    const teacherId = req.user.id;

    Class.getClassesByTeacher(
        teacherId,
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json(results);

        }
    );

};