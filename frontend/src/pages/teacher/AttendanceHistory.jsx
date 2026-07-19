import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/classDetail.css";

function AttendanceHistory() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);

    useEffect(() => {

        loadHistory();

    }, []);

    const loadHistory = async () => {

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

            setHistory(res.data.data);
            console.log(res.data.data);
            console.log(res.data.data[0]);

        }

        catch (err) {

            console.log(err);

        }

    };

    // Lấy tất cả cột Buổi từ dữ liệu
    const lessonColumns =
        history.length > 0
            ? Object.keys(history[0].attendance)
            : [];
    return (

        <div className="class-detail-page teacher-page">

            <div className="container py-5">

                <button
                    className="btn btn-secondary mb-4"
                    onClick={() => navigate(-1)}
                >
                    ← Quay lại
                </button>

                <div className="class-detail-card">

                    <h2 className="mb-4">
                        Lịch sử điểm danh
                    </h2>

                    <div className="table-responsive">

                        <table className="table table-bordered">

                            <thead>

                                <tr>

                                    <th className="text-center">STT</th>

                                    <th className="text-center">MSSV</th>

                                    <th>Họ tên</th>

                                    {
                                        lessonColumns.map((lesson) => (

                                            <th
                                                key={lesson}
                                                className="text-center"
                                            >
                                                {lesson}
                                            </th>

                                        ))
                                    }

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    history.length > 0 ?

                                        history.map((sv, index) => (

                                            <tr key={sv.student_code}>

                                                <td className="text-center">
                                                    {index + 1}
                                                </td>

                                                <td className="text-center">
                                                    {sv.student_code}
                                                </td>

                                                <td>
                                                    {sv.full_name}
                                                </td>


                                                {
                                                    lessonColumns.map((lesson) => (

                                                        <td
                                                            key={lesson}
                                                            className={
                                                                sv.attendance[lesson] === "Có mặt"
                                                                    ? "attendance-present"
                                                                    : "attendance-absent"
                                                            }
                                                        >

                                                            {sv.attendance[lesson]}

                                                        </td>

                                                    ))
                                                }


                                            </tr>

                                        ))

                                        :

                                        <tr>

                                            <td
                                                colSpan={lessonColumns.length + 3}
                                                className="text-center"
                                            >
                                                Chưa có dữ liệu
                                            </td>

                                        </tr>

                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AttendanceHistory;