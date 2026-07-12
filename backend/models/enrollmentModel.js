const db = require("../config/db");

// Thêm nhiều sinh viên vào lớp
exports.addStudentsToClass = (classId, studentIds, callback) => {

    if (!studentIds || studentIds.length === 0) {
        return callback(null, {
            affectedRows: 0
        });
    }

    // Tạo dữ liệu dạng:
    // [[1,1],[1,2],[1,3]]
    const values = studentIds.map(studentId => [classId, studentId]);

    const sql = `
        INSERT IGNORE INTO enrollments(class_id, student_id)
        VALUES ?
    `;

    db.query(sql, [values], callback);

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