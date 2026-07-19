const db = require("../config/db");





/**
 * Tạo lớp học
 */
exports.createClass = (data,callback)=>{


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


        VALUES (?,?,?,?,?,?)

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
exports.getClassesByTeacher = (teacherId,callback)=>{


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



    db.query(

        sql,

        [teacherId],

        callback

    );


};









/**
 * Chi tiết lớp
 */
exports.getDetail = (classId,callback)=>{


    const sql = `


        SELECT


            c.id,


            c.section,


            c.class_type,


            c.semester,


            c.academic_year,



            s.subject_name,


            s.subject_code



        FROM classes c



        JOIN subjects s



        ON c.subject_id = s.id



        WHERE c.id = ?



    `;



    db.query(

        sql,

        [classId],

        callback

    );


};









/**
 * Danh sách sinh viên trong lớp
 */
exports.getStudents = (classId,callback)=>{


    const sql = `


        SELECT


            st.id,


            st.student_code,


            st.full_name,


            st.email



        FROM enrollments e



        JOIN students st



        ON e.student_id = st.id



        WHERE e.class_id = ?



        ORDER BY st.student_code ASC



    `;



    db.query(

        sql,

        [classId],

        callback

    );


};

// Xóa sinh viên khỏi lớp

exports.removeStudent = (

    classId,
    studentId,
    callback

)=>{


    const sql = `

        DELETE FROM enrollments

        WHERE class_id = ?

        AND student_id = ?

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
// Lịch sử điểm danh

exports.getAttendance = (classId, callback)=>{


    const sql = `

        SELECT

            st.student_code,

            st.full_name,

            ar.check_in_time,

            ar.status


        FROM attendance_records ar


        JOIN attendance_sessions ats

        ON ar.session_id = ats.id


        JOIN students st

        ON ar.student_id = st.id


        WHERE ats.class_id = ?


        ORDER BY ar.check_in_time DESC

    `;


    db.query(

        sql,

        [classId],

        callback

    );


};