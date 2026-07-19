import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import api from "../../api/axios";
import "../../styles/classDetail.css";

function ClassDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [classInfo, setClassInfo] = useState(null);
    const [students, setStudents] = useState([]);

    const [qrData, setQrData] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [showAddStudent, setShowAddStudent] = useState(false);

    const [studentCode, setStudentCode] = useState("");

    const [searchStudent, setSearchStudent] = useState(null);

    const [searchError, setSearchError] = useState("");

    const [deleteMode, setDeleteMode] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [addMessage, setAddMessage] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const [showSessionModal, setShowSessionModal] = useState(false);

    const [sessions, setSessions] = useState([]);

    const [sessionDate, setSessionDate] = useState("");

    const [startTime, setStartTime] = useState("");

    const [endTime, setEndTime] = useState("");
    const [editingSession, setEditingSession] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    useEffect(() => {

        console.log("EDIT MODE:", editingSession);

    }, [editingSession]);
    useEffect(() => {

        loadClass();
        loadStudents();

    }, [id]);

    // ==========================
    // COUNTDOWN QR
    // ==========================

    useEffect(() => {

        if (countdown <= 0) return;

        const timer = setInterval(() => {

            setCountdown(prev => {

                if (prev <= 1) {
                    return 0;
                }

                return prev - 1;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, [countdown]);

    useEffect(() => {

        if (countdown === 0 && qrData) {

            setQrData(null);

        }

    }, [countdown, qrData]);

    // ==========================
    // LOAD CLASS
    // ==========================

    const loadClass = async () => {

        try {

            const token = localStorage.getItem("teacherToken");

            const res = await api.get(

                `/classes/${id}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setClassInfo(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    // ==========================
    // LOAD STUDENTS
    // ==========================

    const loadStudents = async () => {

        try {

            const token = localStorage.getItem("teacherToken");

            const res = await api.get(

                `/classes/${id}/students`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setStudents(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    // ==========================
    // LỊCH SỬ ĐIỂM DANH
    // ==========================

    const loadAttendanceHistory = async () => {

        try {

            const token = localStorage.getItem("teacherToken");

            const res = await api.get(

                `/classes/${id}/attendance/history`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            setAttendanceHistory(res.data.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const loadSessions = async () => {

        try {

            const token = localStorage.getItem("teacherToken");

            const res = await api.get(

                `/classes/${id}/sessions`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setSessions(res.data.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const createSession = async () => {

        try {

            const token = localStorage.getItem("teacherToken");

            await api.post(

                `/classes/${id}/sessions`,

                {

                    session_date: sessionDate,

                    start_time: startTime,

                    end_time: endTime

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setSessionDate("");

            setStartTime("");

            setEndTime("");

            loadSessions();

        }

        catch (err) {

            console.log(err);

        }

    };

    const updateSession = async () => {

        try {

            const token = localStorage.getItem("teacherToken");

            await api.put(

                `/classes/${id}/sessions/${editingSession.id}`,

                {

                    session_date: sessionDate,

                    start_time: startTime,

                    end_time: endTime

                },

                {

                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                }

            );

            setEditingSession(null);

            setSessionDate("");

            setStartTime("");

            setEndTime("");

            loadSessions();

        }

        catch (err) {

            console.log(err);

        }

    };
    // ==========================
    // MỞ QR
    // ==========================

    const startAttendance = async () => {

        try {

            const token = localStorage.getItem("teacherToken");

            const res = await api.post(

                `/classes/${id}/attendance/open`,

                {},

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setQrData(res.data);

            setCountdown(res.data.countdown);

        }

        catch (err) {

            console.log(err);

        }

    };

    const openSessionQr = async (sessionId) => {

        try {

            const token = localStorage.getItem("teacherToken");

            const res = await api.post(

                `/classes/${id}/sessions/${sessionId}/open`,

                {},

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setQrData(res.data);
            setCountdown(res.data.countdown);

        }

        catch (err) {

            alert(
                err.response?.data?.message ||
                "Không mở được QR."
            );

        }

    };

    const deleteSession = async (sessionId) => {

        if (!window.confirm("Bạn có chắc muốn xóa buổi học này?")) {
            return;
        }

        try {

            const token = localStorage.getItem("teacherToken");

            await api.delete(

                `/classes/${id}/sessions/${sessionId}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            loadSessions();

        }

        catch (err) {

            alert(
                err.response?.data?.message ||
                "Không thể xóa buổi học."
            );

        }

    };

    // ==========================
    // TÌM SINH VIÊN
    // ==========================

    const searchStudentByCode = async () => {

        if (!studentCode.trim()) {

            alert("Nhập MSSV");

            return;

        }

        try {

            const token = localStorage.getItem("teacherToken");

            const res = await api.get(

                `/students/search/${studentCode}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            if (res.data.success) {

                setSearchStudent(res.data.student);

                setSearchError("");

            }

            else {

                setSearchStudent(null);

                setSearchError(res.data.message);

            }

        }

        catch {

            setSearchStudent(null);

            setSearchError("Không tìm thấy sinh viên.");

        }

    };

    // ==========================
    // THÊM VÀO LỚP
    // ==========================

    const addStudent = async () => {

        if (!searchStudent) {

            alert("Chưa chọn sinh viên");

            return;

        }

        try {

            const token = localStorage.getItem("teacherToken");

            const res = await api.post(

                `/classes/${id}/students`,

                {

                    student_id: searchStudent.id

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setAddMessage(res.data.message);

            setShowAddStudent(false);

            setStudentCode("");

            setSearchStudent(null);

            loadStudents();

        }

        catch (err) {

            alert(

                err.response?.data?.message ||

                "Có lỗi xảy ra."

            );

        }

    };
    // ==========================
    // XÓA SINH VIÊN KHỎI LỚP
    // ==========================

    const removeStudent = async (studentId) => {


        try {

            const token = localStorage.getItem("teacherToken");


            const res = await api.delete(

                `/classes/${id}/students/${studentId}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );


            setDeleteMessage(res.data.message);


            loadStudents();


            setShowDeleteConfirm(false);

            setSelectedStudentId(null);


        }


        catch (err) {

            alert(

                err.response?.data?.message ||

                "Xóa sinh viên thất bại."

            );

        }

    };

    return (

        <div className="class-detail-page teacher-page">

            <div className="container py-5">

                <button

                    className="btn btn-secondary mb-4"

                    onClick={() => navigate(-1)}

                >

                    ← Quay lại

                </button>

                {

                    classInfo && (

                        <div className="class-detail-card">

                            {/* HEADER */}

                            <div className="class-header">

                                <div className="class-icon">

                                    <i className="bi bi-book"></i>

                                </div>

                                <div className="class-info">

                                    <h2>

                                        {classInfo.subject_name}

                                    </h2>

                                    <p className="class-code">

                                        Mã lớp {classInfo.section}

                                    </p>

                                </div>

                                <div className="d-flex gap-2">

                                    <button

                                        className="qr-btn"

                                        onClick={startAttendance}

                                    >

                                        <i className="bi bi-qr-code"></i>

                                        Mở điểm danh

                                    </button>

                                    <button

                                        className="btn btn-warning"

                                        onClick={() => {

                                            loadSessions();

                                            setShowSessionModal(true);

                                        }}

                                    >

                                        <i className="bi bi-calendar-week me-2"></i>

                                        Quản lý buổi học

                                    </button>


                                    <button
                                        className="btn btn-info"
                                        onClick={() => navigate(`/teacher/classes/${id}/attendance`)}
                                    >
                                        <i className="bi bi-calendar-check me-2"></i>
                                        Lịch sử điểm danh
                                    </button>


                                </div>

                            </div>

                            {/* QR */}

                            {

                                qrData && (

                                    <div className="qr-display">

                                        <h5>
                                            Quét mã để điểm danh {qrData.title}
                                        </h5>

                                        <QRCodeCanvas

                                            value={qrData.qr_token}

                                            size={220}

                                        />

                                        <p className="qr-time">

                                            Thời gian còn lại

                                            {" "}

                                            {countdown}

                                            {" "}

                                            giây

                                        </p>

                                    </div>

                                )

                            }

                            <hr />

                            {/* DANH SÁCH + BUTTON */}

                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <h4 className="student-title mb-0">

                                    Danh sách sinh viên

                                </h4>

                                <div className="d-flex gap-2">

                                    <button

                                        className="btn btn-success"

                                        onClick={() => {

                                            setShowAddStudent(!showAddStudent);

                                            setStudentCode("");

                                            setSearchStudent(null);

                                            setSearchError("");

                                        }}

                                    >

                                        <i className="bi bi-person-plus-fill me-2"></i>

                                        Thêm sinh viên

                                    </button>


                                    <button

                                        className="btn btn-danger"

                                        onClick={() => {

                                            setDeleteMode(true);

                                            setShowAddStudent(false);

                                        }}

                                    >

                                        <i className="bi bi-trash-fill me-2"></i>

                                        Xóa sinh viên

                                    </button>


                                </div>

                            </div>

                            {/* FORM THÊM */}

                            {

                                showAddStudent && (

                                    <div className="card border-0 shadow-sm mb-4">

                                        <div className="card-body">

                                            <h5 className="fw-bold mb-3">

                                                THÊM SINH VIÊN VÀO LỚP

                                            </h5>

                                            <div className="input-group mb-3">

                                                <input

                                                    type="text"

                                                    className="form-control"

                                                    placeholder="Nhập MSSV"

                                                    value={studentCode}

                                                    onChange={(e) =>

                                                        setStudentCode(

                                                            e.target.value

                                                        )

                                                    }

                                                />

                                                <button

                                                    className="btn btn-primary"

                                                    onClick={searchStudentByCode}

                                                >

                                                    Tìm

                                                </button>

                                            </div>

                                            {

                                                searchError && (

                                                    <div className="alert alert-danger">

                                                        {searchError}

                                                    </div>

                                                )

                                            }

                                            {

                                                searchStudent && (

                                                    <div className="alert alert-success">

                                                        <p>

                                                            <b>MSSV:</b>

                                                            {" "}

                                                            {

                                                                searchStudent.student_code

                                                            }

                                                        </p>

                                                        <p>

                                                            <b>Họ tên:</b>

                                                            {" "}

                                                            {

                                                                searchStudent.full_name

                                                            }

                                                        </p>

                                                        <p>

                                                            <b>Email:</b>

                                                            {" "}

                                                            {

                                                                searchStudent.email

                                                            }

                                                        </p>

                                                        <hr />

                                                        <p>

                                                            Thêm sinh viên này vào lớp?

                                                        </p>

                                                        <div className="d-flex gap-2">

                                                            <button

                                                                className="btn btn-success"

                                                                onClick={addStudent}

                                                            >

                                                                Thêm vào lớp

                                                            </button>

                                                            <button

                                                                className="btn btn-secondary"

                                                                onClick={() => {

                                                                    setShowAddStudent(false);

                                                                    setSearchStudent(null);

                                                                    setStudentCode("");

                                                                }}

                                                            >

                                                                Đóng

                                                            </button>

                                                        </div>

                                                    </div>

                                                )

                                            }

                                        </div>

                                    </div>

                                )

                            }

                            {/* TABLE */}

                            <div className="table-responsive">

                                <table className="table student-table">

                                    <thead>

                                        <tr>

                                            <th>STT</th>

                                            <th>MSSV</th>

                                            <th>Họ tên</th>

                                            <th>Email</th>

                                            {
                                                deleteMode && (
                                                    <th>Xóa</th>
                                                )
                                            }

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            students.length > 0 ?

                                                students.map((sv, index) => (

                                                    <tr key={sv.id}>

                                                        <td>
                                                            {index + 1}
                                                        </td>


                                                        <td>
                                                            {sv.student_code}
                                                        </td>


                                                        <td>
                                                            {sv.full_name}
                                                        </td>


                                                        <td>
                                                            {sv.email}
                                                        </td>


                                                        {
                                                            deleteMode && (

                                                                <td className="delete-column">

                                                                    <button

                                                                        className="btn btn-danger btn-sm delete-btn"

                                                                        onClick={() => {

                                                                            setSelectedStudentId(sv.id);

                                                                            setShowDeleteConfirm(true);

                                                                        }}

                                                                    >

                                                                        <i className="bi bi-trash-fill"></i>

                                                                    </button>


                                                                </td>

                                                            )
                                                        }


                                                    </tr>

                                                ))

                                                :

                                                <tr>

                                                    <td
                                                        colSpan={deleteMode ? 5 : 4}
                                                        className="text-center"
                                                    >

                                                        Chưa có sinh viên

                                                    </td>

                                                </tr>

                                        }

                                    </tbody>

                                </table>
                                {

                                    deleteMode && (

                                        <div className="text-center mt-3">
                                            {
                                                addMessage && (

                                                    <div className="alert alert-success">

                                                        {addMessage}

                                                    </div>

                                                )
                                            }
                                            {
                                                deleteMessage && (

                                                    <div className="alert alert-success">

                                                        {deleteMessage}

                                                    </div>

                                                )
                                            }
                                            {
                                                showDeleteConfirm && (

                                                    <div className="delete-confirm-box">


                                                        <h5>

                                                            Xác nhận xóa sinh viên

                                                        </h5>


                                                        <p>

                                                            Bạn có chắc muốn xóa sinh viên này khỏi lớp?

                                                        </p>


                                                        <div className="d-flex justify-content-center gap-3">


                                                            <button

                                                                className="btn btn-secondary"

                                                                onClick={() => {

                                                                    setShowDeleteConfirm(false);

                                                                    setSelectedStudentId(null);

                                                                }}

                                                            >

                                                                Bỏ qua

                                                            </button>



                                                            <button

                                                                className="btn btn-danger"

                                                                onClick={() => removeStudent(selectedStudentId)}

                                                            >

                                                                Xóa

                                                            </button>


                                                        </div>


                                                    </div>

                                                )
                                            }

                                            <button

                                                className="btn btn-primary"

                                                onClick={() => {

                                                    setDeleteMode(false);

                                                    setShowDeleteConfirm(false);

                                                    setDeleteMessage("");

                                                }}

                                            >
                                                Hoàn thành thao tác

                                            </button>


                                        </div>

                                    )

                                }

                            </div>

                        </div>

                    )

                }

            </div>
            {
                showSessionModal && (

                    <div className="session-modal-overlay">

                        <div className="session-modal">

                            <h3>

                                Quản lý buổi học

                            </h3>

                            <hr />

                            <div className="row g-2 mb-4">

                                <div className="col">
                                    <input

                                        type="date"

                                        className="form-control"

                                        value={sessionDate}

                                        onChange={(e) => setSessionDate(e.target.value)}

                                    />

                                </div>

                                <div className="col">

                                    <input

                                        type="time"

                                        className="form-control"

                                        value={startTime}

                                        onChange={(e) => setStartTime(e.target.value)}

                                    />

                                </div>

                                <div className="col">

                                    <input

                                        type="time"

                                        className="form-control"

                                        value={endTime}

                                        onChange={(e) => setEndTime(e.target.value)}

                                    />

                                </div>

                                <div className="col-auto d-flex gap-2">

                                    <button
                                        className="btn btn-success"
                                        onClick={editingSession ? updateSession : createSession}
                                    >
                                        {editingSession ? "Lưu" : "Thêm buổi"}
                                    </button>

                                    {editingSession && (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => {

                                                setEditingSession(null);
                                                setSessionDate("");
                                                setStartTime("");
                                                setEndTime("");

                                            }}
                                        >
                                            Hủy
                                        </button>
                                    )}

                                </div>

                            </div>

                            <hr />

                            {

                                sessions.map(session => (

                                    <div
                                        key={session.id}
                                        className="session-card"
                                    >

                                        <h5>

                                            Buổi {session.lesson_no}

                                        </h5>

                                        <p>

                                            {
                                                new Date(session.session_date)
                                                    .toLocaleDateString("vi-VN")
                                            }
                                        </p>

                                        <p>

                                            {session.start_time}

                                            {" - "}

                                            {session.end_time}

                                        </p>

                                        <div className="d-flex gap-2">

                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => openSessionQr(session.id)}
                                            >

                                                Mở QR

                                            </button>

                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => {

                                                    setEditingSession(session);

                                                    setSessionDate(
                                                        session.session_date
                                                    );

                                                    setStartTime(
                                                        session.start_time.substring(0, 5)
                                                    );

                                                    setEndTime(
                                                        session.end_time.substring(0, 5)
                                                    );

                                                    setShowEditModal(true);

                                                }}
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteSession(session.id)}
                                            >
                                                Xóa
                                            </button>

                                        </div>

                                    </div>

                                ))

                            }
                            {
                                showEditModal && (

                                    <div className="edit-modal-overlay">

                                        <div className="edit-modal">

                                            <h4>
                                                Sửa Buổi {editingSession?.lesson_no}
                                            </h4>


                                            <div className="mb-3">

                                                <label>
                                                    Ngày học
                                                </label>

                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={sessionDate}
                                                    onChange={
                                                        e => setSessionDate(e.target.value)
                                                    }
                                                />

                                            </div>


                                            <div className="mb-3">

                                                <label>
                                                    Giờ bắt đầu
                                                </label>

                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={startTime}
                                                    onChange={
                                                        e => setStartTime(e.target.value)
                                                    }
                                                />

                                            </div>


                                            <div className="mb-3">

                                                <label>
                                                    Giờ kết thúc
                                                </label>

                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={endTime}
                                                    onChange={
                                                        e => setEndTime(e.target.value)
                                                    }
                                                />

                                            </div>


                                            <div className="d-flex justify-content-end gap-2">


                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => {

                                                        setShowEditModal(false);

                                                        setEditingSession(null);

                                                    }}
                                                >
                                                    Bỏ qua
                                                </button>


                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {

                                                        updateSession();

                                                        setShowEditModal(false);

                                                    }}
                                                >
                                                    Sửa
                                                </button>


                                            </div>


                                        </div>

                                    </div>

                                )
                            }
                            <div className="text-end mt-4">

                                <button

                                    className="btn btn-secondary"

                                    onClick={() => setShowSessionModal(false)}

                                >

                                    Đóng

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }
        </div>

    );
}
export default ClassDetail;