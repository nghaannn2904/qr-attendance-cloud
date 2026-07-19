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
exports.getClassesByStudent = (studentId, callback) => {


    const sql = `

        SELECT

            c.id,

            c.section,

            s.subject_name,

            s.subject_code


        FROM enrollments e


        JOIN classes c

            ON e.class_id = c.id


        JOIN subjects s

            ON c.subject_id = s.id


        WHERE e.student_id = ?


    `;



    db.query(

        sql,

        [studentId],

        callback

    );


};
exports.findByCode = (studentCode, callback) => {

    const sql = `
        SELECT
            id,
            student_code,
            full_name,
            email
        FROM students
        WHERE student_code = ?
    `;

    db.query(sql, [studentCode], callback);

};
// =========================
// CHI TIẾT LỚP SINH VIÊN
// =========================

exports.getClassDetail = (studentId, classId, callback) => {


    const sql = `

        SELECT

            c.id,
            c.section,

            s.subject_name,
            s.subject_code,

            t.full_name AS teacher_name,

            c.class_type,

            c.semester


        FROM enrollments e


        JOIN classes c

            ON e.class_id = c.id


        JOIN subjects s

            ON c.subject_id = s.id


        LEFT JOIN teachers t

            ON c.teacher_id = t.id



        WHERE

            e.student_id = ?

        AND

            c.id = ?

    `;


    db.query(

        sql,

        [
            studentId,
            classId
        ],

        callback

    );


};




// =========================
// LỊCH SỬ ĐIỂM DANH SINH VIÊN
// =========================


exports.getAttendanceHistory = (

    studentId,
    classId,
    callback

) => {


    const sql = `


        SELECT
    ats.lesson_no,
    ats.session_date,
    ar.check_in_time,

    CASE
        WHEN ar.status = 'PRESENT' THEN 'Có mặt'
        WHEN ar.status = 'LATE' THEN 'Đi trễ'
        WHEN ar.status = 'ABSENT' THEN 'Vắng'
        ELSE 'Vắng'
    END AS status

FROM attendance_sessions ats

LEFT JOIN attendance_records ar
ON ats.id = ar.session_id
AND ar.student_id = ?

WHERE ats.class_id = ?

AND ats.session_date <= CURDATE()
ORDER BY ats.lesson_no;
    `;



    db.query(

        sql,

        [

            studentId,

            classId

        ],

        callback

    );


};