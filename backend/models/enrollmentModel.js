const db = require("../config/db");

// Thêm nhiều sinh viên vào lớp
exports.addStudentToClass = (classId, studentId, callback) => {

    const sql = `
        INSERT IGNORE INTO enrollments
        (
            class_id,
            student_id
        )
        VALUES (?,?)
    `;

    db.query(
        sql,
        [
            classId,
            studentId
        ],
        callback
    );

};
//Lấy danh sách sinh viên của một lớp
exports.getStudentsByClass = (classId, callback) => {

    const sql = `
        SELECT
            s.id,
            s.student_code,
            s.full_name,
            s.email
        FROM enrollments e
        JOIN students s
            ON e.student_id = s.id
        WHERE e.class_id = ?
        ORDER BY s.student_code
    `;

    db.query(sql, [classId], callback);

};
// Xóa sinh viên khỏi lớp
exports.removeStudentFromClass = (classId, studentId, callback) => {

    const sql = `
        DELETE FROM enrollments
        WHERE class_id = ? AND student_id = ?
    `;

    db.query(sql, [classId, studentId], callback);

};