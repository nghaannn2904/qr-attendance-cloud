const db = require("../config/db");

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

exports.getSessionById = (id, callback) => {

    const sql = `
        SELECT *
        FROM attendance_sessions
        WHERE id = ?
        LIMIT 1
    `;

    db.query(sql, [id], callback);

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
        INSERT INTO attendance_records
        (
            session_id,
            student_id,
            check_in_time,
            status
        )
        VALUES
        (
            ?,
            ?,
            NOW(),
            'PRESENT'
        )
    `;


    db.query(
        sql,
        [
            sessionId,
            studentId
        ],
        callback
    );

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

/**
 * Lịch sử điểm danh tổng hợp
 */
exports.getAttendanceHistory = (classId, callback) => {

    const sql = `

        SELECT

            st.student_code,

            st.full_name,

            ats.lesson_no,

            CASE

                WHEN ar.status = 'PRESENT'
                THEN 'Có mặt'

                WHEN ar.status = 'ABSENT'
                THEN 'Vắng'

                ELSE 'Vắng'

            END AS status


        FROM enrollments e


        JOIN students st

        ON e.student_id = st.id


        JOIN attendance_sessions ats

        ON ats.class_id = e.class_id


        LEFT JOIN attendance_records ar

        ON ar.session_id = ats.id

        AND ar.student_id = st.id


       WHERE e.class_id = ?

AND ats.session_date <= CURDATE()


ORDER BY

st.student_code,

ats.lesson_no
    `;


    db.query(sql, [classId], (err, rows) => {


        if (err)
            return callback(err);



        const result = {};



        rows.forEach(row => {


            if (!result[row.student_code]) {


                result[row.student_code] = {

                    student_code: row.student_code,

                    full_name: row.full_name,

                    attendance: {}

                };


            }



            result[row.student_code]
                .attendance[row.lesson_no]
                =
                row.status;



        });



        callback(

            null,

            Object.values(result)

        );



    });


};
exports.getSessions = (classId, callback) => {

    const sql = `
        SELECT
            id,
            lesson_no,
            title,
            DATE_FORMAT(session_date,'%Y-%m-%d') AS session_date,
            TIME_FORMAT(start_time,'%H:%i') AS start_time,
            TIME_FORMAT(end_time,'%H:%i') AS end_time
        FROM attendance_sessions
        WHERE class_id = ?
        ORDER BY lesson_no ASC
    `;


    db.query(
        sql,
        [classId],
        callback
    );

};
exports.createSession = (data, callback) => {

    const sql = `
        INSERT INTO attendance_sessions
        (
            class_id,
            lesson_no,
            title,
            session_date,
            start_time,
            end_time,
            status
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            'OPEN'
        )
    `;

    db.query(
        sql,
        [
            data.class_id,
            data.lesson_no,
            data.title,
            data.session_date,
            data.start_time,
            data.end_time
        ],
        callback
    );

};
exports.updateSession = (data, callback) => {

    const sql = `
        UPDATE attendance_sessions
        SET
            session_date = ?,
            start_time = ?,
            end_time = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            data.session_date,
            data.start_time,
            data.end_time,
            data.id
        ],
        callback
    );

};
exports.deleteSession = (id, callback) => {

    const sql = `
        DELETE
        FROM attendance_sessions
        WHERE id = ?
    `;

    db.query(sql, [id], callback);

};
exports.getCurrentSession = (classId, callback) => {

    const sql = `
        SELECT *
        FROM attendance_sessions
        WHERE class_id = ?

        AND CURDATE() BETWEEN 
        DATE_SUB(session_date, INTERVAL 1 DAY)
        AND DATE_ADD(session_date, INTERVAL 1 DAY)

        ORDER BY session_date ASC
        LIMIT 1
    `;


    db.query(
        sql,
        [classId],
        callback
    );

};
exports.getCurrentSession = (classId, callback) => {


    const sql = `

        SELECT *

        FROM attendance_sessions

        WHERE class_id = ?

        AND session_date = CURDATE()

        ORDER BY start_time ASC

        LIMIT 1

    `;


    db.query(
        sql,
        [classId],
        callback
    );


};
exports.reOrderLessonNo = (classId, callback) => {


    const sql = `

        SELECT id

        FROM attendance_sessions

        WHERE class_id = ?

        ORDER BY session_date ASC, start_time ASC

    `;


    db.query(
        sql,
        [classId],

        (err, rows) => {


            if (err)
                return callback(err);



            let count = 1;


            const updateNext = () => {


                if (count > rows.length) {

                    return callback(null);

                }


                const sqlUpdate = `

                    UPDATE attendance_sessions

                    SET lesson_no = ?

                    WHERE id = ?

                `;


                db.query(

                    sqlUpdate,

                    [
                        count,
                        rows[count - 1].id
                    ],

                    (err) => {

                        if (err)
                            return callback(err);


                        count++;

                        updateNext();

                    }

                );


            };


            updateNext();


        }
    );


};