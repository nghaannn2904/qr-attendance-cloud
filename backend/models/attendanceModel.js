const db = require("../config/db");

/**
 * Tìm buổi học của lớp trong ngày hôm nay
 */
exports.getTodaySession = (classId, callback) => {

    const sql = `
        SELECT *
        FROM attendance_sessions
        WHERE class_id = ?
        AND session_date = CURDATE()
        LIMIT 1
    `;

    db.query(sql, [classId], callback);

};

/**
 * Tạo buổi học mới
 */
exports.createSession = (data, callback) => {

    const sql = `
        INSERT INTO attendance_sessions
        (
            class_id,
            lesson_no,
            session_date,
            title,
            status
        )
        VALUES (?, ?, CURDATE(), ?, 'OPEN')
    `;

    db.query(
        sql,
        [
            data.class_id,
            data.lesson_no,
            data.title
        ],
        callback
    );

};
/**
 * Lấy số buổi học lớn nhất của lớp
 */
exports.getLastLessonNo = (classId, callback) => {

    const sql = `
        SELECT MAX(lesson_no) AS lastLesson
        FROM attendance_sessions
        WHERE class_id = ?
    `;

    db.query(sql, [classId], callback);

};


/**
 * Lấy QR theo token
 */
exports.getSessionByToken = (token, callback) => {

    const sql = `
        SELECT
            q.*,
            s.class_id,
            s.lesson_no,
            s.session_date,
            s.title
        FROM attendance_qr q
        JOIN attendance_sessions s
            ON q.session_id = s.id
        WHERE q.qr_token = ?
        LIMIT 1
    `;

    db.query(sql, [token], callback);

};

/**
 * Tạo QR cho buổi học
 */
exports.createQr = (data, callback) => {

    const sql = `
        INSERT INTO attendance_qr
        (
            session_id,
            qr_token,
            start_time,
            end_time
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.session_id,
            data.qr_token,
            data.start_time,
            data.end_time
        ],
        callback
    );

};

exports.expireCurrentQr = (sessionId, callback) => {

    const sql = `
        UPDATE attendance_qr
        SET end_time = NOW()
        WHERE session_id = ?
        AND end_time > NOW()
    `;

    db.query(sql, [sessionId], callback);

};

/**
 * check sinh viên đã điểm danh chưa
 */
exports.checkExists = (sessionId, studentId, callback) => {

    const sql = `
        SELECT * FROM attendance_records
        WHERE session_id = ? AND student_id = ?
    `;

    db.query(sql, [sessionId, studentId], callback);
};


/**
 * insert điểm danh
 */
exports.insertRecord = (sessionId, studentId, callback) => {

    const sql = `
        INSERT INTO attendance_records(session_id, student_id)
        VALUES (?, ?)
    `;

    db.query(sql, [sessionId, studentId], callback);
};
/**
 * Lấy danh sách điểm danh của một buổi học
 */
exports.getAttendanceList = (classId, sessionId, callback) => {

    const sql = `
        SELECT
            s.id,
            s.student_code,
            s.full_name,
            ar.check_in_time,
            IFNULL(ar.status, 'ABSENT') AS status
        FROM enrollments e
        JOIN students s
            ON e.student_id = s.id
        LEFT JOIN attendance_records ar
            ON ar.student_id = s.id
            AND ar.session_id = ?
        WHERE e.class_id = ?
        ORDER BY s.student_code
    `;

    db.query(sql, [sessionId, classId], callback);

};