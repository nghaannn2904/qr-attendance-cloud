const jwt = require("jsonwebtoken");
const Attendance = require("../models/attendanceModel");

/**
 * Giáo viên mở điểm danh / tạo QR mới
 */
exports.startSession = (req, res) => {

    const classId = req.params.classId;

    Attendance.getTodaySession(classId, (err, sessions) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        const createQr = (sessionId) => {

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

            // Đóng tất cả QR đang OPEN của buổi học
            Attendance.expireCurrentQr(sessionId, (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                // Tạo QR mới
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

                        return res.json({
                            success: true,
                            session_id: sessionId,
                            qr_token: qrToken,
                            countdown: 120
                        });

                    }
                );

            });

        };

        // Nếu hôm nay đã có buổi học thì chỉ tạo QR mới
        if (sessions.length > 0) {
            return createQr(sessions[0].id);
        }

        // Nếu chưa có buổi học thì tạo mới
        // Nếu chưa có buổi học thì tạo mới
        Attendance.getLastLessonNo(classId, (err3, rows) => {

            if (err3) {
                return res.status(500).json({
                    success: false,
                    message: err3.message
                });
            }

            const lessonNo = (rows[0].lastLesson || 0) + 1;

            Attendance.createSession(
                {
                    class_id: classId,
                    lesson_no: lessonNo,
                    title: `Buổi ${lessonNo}`
                },
                (err4, result) => {

                    if (err4) {
                        return res.status(500).json({
                            success: false,
                            message: err4.message
                        });
                    }

                    createQr(result.insertId);

                }
            );

        });

    });

};

/**
 * Sinh viên quét QR
 */
exports.checkIn = (req, res) => {

    const { token } = req.body;
    const studentId = req.user.id;

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

        // Kiểm tra thời gian hết hạn
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
/**
 * Giáo viên xem danh sách điểm danh
 */
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