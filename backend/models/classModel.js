const db = require("../config/db");

/**
 * Tạo lớp học
 */
exports.createClass = (data, callback) => {

    const sql = `
        INSERT INTO classes
        (
            subject_id,
            section,
            class_type,
            semester,
            academic_year,
            teacher_id
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.subject_id,
            data.section,
            data.class_type,
            data.semester,
            data.academic_year,
            data.teacher_id
        ],
        callback
    );

};

/**
 * Lấy lớp của giáo viên
 */
exports.getClassesByTeacher = (teacherId, callback) => {

    const sql = `
        SELECT
            c.*,
            s.subject_name,
            s.subject_code
        FROM classes c
        JOIN subjects s
            ON c.subject_id = s.id
        WHERE c.teacher_id = ?
        ORDER BY c.id DESC
    `;

    db.query(sql, [teacherId], callback);

};