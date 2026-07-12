const db = require("../config/db");

// Thêm sinh viên
exports.createStudent = (student, callback) => {

    const sql = `
        INSERT INTO students(student_code, full_name, email)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            student.student_code,
            student.full_name,
            student.email
        ],
        callback
    );
};

// Lấy tất cả sinh viên
exports.getAllStudents = (callback) => {

    const sql = "SELECT * FROM students";

    db.query(sql, callback);

};

// Xóa sinh viên
exports.deleteStudent = (id, callback) => {

    const sql = "DELETE FROM students WHERE id=?";

    db.query(sql, [id], callback);

};