const jwt = require("jsonwebtoken");
const Attendance = require("../models/attendanceModel");


const createQrForSession = (sessionId, lesson, res) => {

    const now = new Date();

    const end = new Date(now.getTime() + 2 * 60 * 1000);

    const qrToken = jwt.sign(
        {
            session_id: sessionId,
            type: "ATTENDANCE"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2m"
        }
    );

    Attendance.expireCurrentQr(sessionId, (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        Attendance.createQr(
            {
                session_id: sessionId,
                qr_token: qrToken,
                start_time: now,
                end_time: end
            },
            (err2) => {

                if (err2) {
                    return res.status(500).json({
                        success: false,
                        message: err2.message
                    });
                }

                res.json({
                    success: true,
                    session_id: sessionId,
                    lesson_no: lesson.lesson_no,
                    title: lesson.title,
                    qr_token: qrToken,
                    countdown: 120
                });

            }
        );

    });

};
/**
 * Giáo viên mở điểm danh / tạo QR mới
 */
exports.openSessionQr = (req, res) => {

    const sessionId = req.params.sessionId;

    Attendance.getSessionById(sessionId, (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy buổi học"
            });
        }

        createQrForSession(sessionId, rows[0], res);

    });

};

/**
 * Sinh viên quét QR
 */
exports.checkIn = (req, res) => {

    console.log("========== CHECK IN ==========");
    console.log("Authorization:", req.headers.authorization);
    console.log("Decoded User:", req.user);
    console.log("==============================");

    const { token } = req.body;
    const studentId = req.user.id;

    console.log("Student ID:", studentId);

    // Kiểm tra JWT của QR
    try {

        jwt.verify(token, process.env.JWT_SECRET);

    } catch (err) {

        return res.status(400).json({
            success: false,
            message: "QR không hợp lệ hoặc đã hết hạn"
        });

    }

    // Lấy QR trong database
    Attendance.getSessionByToken(token, (err, sessions) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (sessions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "QR không tồn tại"
            });
        }

        const session = sessions[0];

        // Kiểm tra QR còn hạn
        if (new Date() > new Date(session.end_time)) {

            return res.status(400).json({
                success: false,
                message: "QR đã hết hạn"
            });

        }

        // Kiểm tra sinh viên đã điểm danh chưa
        Attendance.checkExists(session.session_id, studentId, (err2, result) => {

            if (err2) {
                return res.status(500).json({
                    success: false,
                    message: err2.message
                });
            }

            if (result.length > 0) {

                return res.status(400).json({
                    success: false,
                    message: "Bạn đã điểm danh rồi"
                });

            }

            // Ghi nhận điểm danh
            Attendance.insertRecord(session.session_id, studentId, (err3) => {

                if (err3) {
                    return res.status(500).json({
                        success: false,
                        message: err3.message
                    });
                }

                return res.json({
                    success: true,
                    message: "Điểm danh thành công"
                });

            });

        });

    });

};
exports.getAttendanceList = (req, res) => {

    const classId = req.params.classId;
    const sessionId = req.params.sessionId;

    Attendance.getAttendanceList(classId, sessionId, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        return res.json({
            success: true,
            session_id: sessionId,
            total: result.length,
            data: result
        });

    });

};
exports.getSessions = (req, res) => {


    const classId = req.params.classId;


    Attendance.getSessionsByClass(
        classId,

        (err, result) => {


            if (err) {

                return res.status(500).json({

                    message: err.message

                });

            }


            res.json(result);


        }

    );


};
exports.getAttendanceHistory = (req, res) => {


    const classId = req.params.classId;


    Attendance.getAttendanceHistory(

        classId,

        (err, result) => {


            if (err) {

                return res.status(500).json({

                    success: false,

                    message: err.message

                });

            }


            res.json({

                success: true,

                data: result

            });


        }

    );


};
exports.getSessions = (req, res) => {

    const classId = req.params.classId;

    Attendance.getSessions(classId, (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.json({
            success: true,
            data: result
        });

    });

};
exports.createSession = (req, res) => {

    const classId = req.params.classId;

    Attendance.getLastLessonNo(classId, (err, rows) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        const lessonNo = (rows[0].lastLesson || 0) + 1;

        Attendance.createSession({

            class_id: classId,

            lesson_no: lessonNo,

            title: `Buổi ${lessonNo}`,

            session_date: req.body.session_date,

            start_time: req.body.start_time,

            end_time: req.body.end_time

        }, (err2) => {

            if (err2) {

                return res.status(500).json({
                    success: false,
                    message: err2.message
                });

            }

            res.json({
                success: true,
                message: "Đã thêm buổi học."
            });

        });

    });

};
exports.updateSession = (req, res) => {

    Attendance.updateSession(

        {
            id: req.params.sessionId,
            session_date: req.body.session_date,
            start_time: req.body.start_time,
            end_time: req.body.end_time
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
                message: "Đã cập nhật buổi học."
            });

        }

    );

};
exports.deleteSession = (req,res)=>{


    const sessionId = req.params.sessionId;


    Attendance.getSessionById(
        sessionId,

        (err, rows)=>{


            if(err)
                return res.status(500).json({
                    success:false,
                    message:err.message
                });


            const classId = rows[0].class_id;



            Attendance.deleteSession(

                sessionId,


                (err2)=>{


                    if(err2)
                        return res.status(500).json({
                            success:false,
                            message:err2.message
                        });



                    Attendance.reOrderLessonNo(

                        classId,

                        (err3)=>{


                            if(err3)
                                return res.status(500).json({
                                    success:false,
                                    message:err3.message
                                });



                            res.json({

                                success:true,

                                message:"Đã xóa và cập nhật lại số buổi."

                            });


                        }

                    );


                }

            );


        }

    );


};
exports.openCurrentSessionQr = (req,res)=>{


    const classId = req.params.classId;


    Attendance.getCurrentSession(
        classId,

        (err, rows)=>{


            if(err){

                return res.status(500).json({

                    success:false,

                    message:err.message

                });

            }



            if(rows.length === 0){

                return res.status(404).json({

                    success:false,

                    message:"Hôm nay không có buổi học."

                });

            }



            const session = rows[0];



            createQrForSession(

                session.id,

                session,

                res

            );


        }

    );


};