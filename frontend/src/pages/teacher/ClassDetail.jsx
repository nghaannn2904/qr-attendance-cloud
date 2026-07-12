import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";


import {
    getStudentsByClass,
    startAttendance,
    getAttendanceList
} from "../../api/classApi";
function ClassDetail() {

    const { id } = useParams();

    const token = localStorage.getItem("token");

    const [students, setStudents] = useState([]);

    const [qrToken, setQrToken] = useState("");

    const [countdown, setCountdown] = useState(0);

    const [sessionId, setSessionId] = useState(null);

    const [attendance, setAttendance] = useState([]);


    const [showAttendance, setShowAttendance] = useState(false);
    useEffect(() => {

        loadStudents();

    }, []);

    useEffect(() => {

        if (countdown <= 0) return;

        const timer = setInterval(() => {

            setCountdown((prev) => prev - 1);

        }, 1000);

        return () => clearInterval(timer);

    }, [countdown]);

    const loadStudents = async () => {

        try {

            const res = await getStudentsByClass(id, token);

            console.log(res.data);

            setStudents(res.data.students);

        } catch (err) {

            console.log(err);

        }

    };

    const handleOpenAttendance = async () => {

        try {

            const res = await startAttendance(id, token);

            console.log(res.data);

            setQrToken(res.data.qr_token);

            setCountdown(res.data.countdown);

            setSessionId(res.data.session_id);

        } catch (err) {

            console.log(err);

            console.log(err.response);

            console.log(err.response?.data);

            alert(
                err.response?.data?.message || "Không thể mở QR."
            );

        }

    };

    const handleViewAttendance = async () => {

        if (!sessionId) {

            alert("Chưa có buổi điểm danh nào.");

            return;

        }

        try {

            const res = await getAttendanceList(
                id,
                sessionId,
                token
            );

            console.log(res.data);

            setAttendance(res.data.data || []);

            setShowAttendance(true);

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Không lấy được danh sách điểm danh"
            );

        }

    };

    return (

        <div className="container mt-5">

            <h2>Quản lý lớp</h2>

            <hr />

            <h4>ID lớp: {id}</h4>

            <br />

            <button
                className="btn btn-success mb-4"
                onClick={handleOpenAttendance}
            >
                Mở QR điểm danh
            </button>

            <button
                className="btn btn-primary mb-4 ms-2"
                onClick={handleViewAttendance}
            >
                Xem điểm danh
            </button>

            {
                qrToken && (

                    <div className="text-center mb-5">

                        <QRCode
                            value={qrToken}
                            size={220}
                        />

                        <h5 className="mt-3">
                            QR còn hiệu lực: {countdown} giây
                        </h5>

                        <div className="mt-4">

                            <label className="form-label fw-bold">
                                QR Token
                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                value={qrToken}
                                readOnly
                            />

                            <button
                                className="btn btn-secondary mt-3"
                                onClick={() => {

                                    navigator.clipboard.writeText(qrToken);

                                    alert("Đã sao chép QR Token!");

                                }}
                            >
                                📋 Copy Token
                            </button>

                        </div>

                    </div>

                )
            }

            <h4>Danh sách sinh viên</h4>

            <hr />

            {
                students.length === 0
                    ? (
                        <p>Chưa có sinh viên.</p>
                    )
                    : (
                        students.map((student) => (

                            <div
                                className="card mb-3 shadow-sm"
                                key={student.id}
                            >

                                <div className="card-body">

                                    <h5>

                                        {student.full_name}

                                    </h5>

                                    <p>

                                        MSSV:

                                        {" "}

                                        {student.student_code}

                                    </p>

                                    <p>

                                        Email:

                                        {" "}

                                        {student.email}

                                    </p>

                                </div>

                            </div>

                        ))
                    )
            }

            {
                showAttendance && (

                    <>

                        <h4 className="mt-5">
                            Kết quả điểm danh
                        </h4>

                        <table className="table table-bordered">

                            <thead>
                                <tr>
                                    <th>MSSV</th>
                                    <th>Họ tên</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian</th>
                                </tr>
                            </thead>


                            <tbody>

                                {
                                    attendance.length === 0

                                        ?

                                        (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="text-center"
                                                >
                                                    Chưa có ai điểm danh
                                                </td>
                                            </tr>
                                        )

                                        :

                                        attendance.map((item) => (

                                            <tr key={item.id}>

                                                <td>
                                                    {item.student_code}
                                                </td>

                                                <td>
                                                    {item.full_name}
                                                </td>

                                                <td>
                                                    {item.status}
                                                </td>

                                                <td>
                                                    {item.check_in_time || "-"}
                                                </td>

                                            </tr>

                                        ))

                                }

                            </tbody>

                        </table>

                    </>

                )
            }

        </div>

    );

}

export default ClassDetail;