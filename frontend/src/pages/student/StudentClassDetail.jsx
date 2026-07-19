import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";

import "../../styles/studentClassDetail.css";


function StudentClassDetail() {
    
    console.log("StudentClassDetail render");


    const navigate = useNavigate();

    const { id } = useParams();


    const [classInfo, setClassInfo] = useState(null);

    const [attendanceHistory, setAttendanceHistory] = useState([]);





    useEffect(() => {


        loadClassDetail();

        loadAttendanceHistory();


    }, []);







    // =========================
    // LOAD THÔNG TIN LỚP
    // =========================


    const loadClassDetail = async () => {


        try {


            const token = localStorage.getItem(
                "studentToken"
            );


            const res = await api.get(

                `/student/classes/${id}`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );


            setClassInfo(res.data);



        }

        catch (err) {


            console.log(err);


        }


    };









    // =========================
    // LOAD LỊCH SỬ ĐIỂM DANH
    // =========================


    const loadAttendanceHistory = async () => {


        try {


            const token = localStorage.getItem(
                "studentToken"
            );



            const res = await api.get(


                `/student/classes/${id}/attendance-history`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }


            );



            setAttendanceHistory(

                res.data.data || []

            );



        }

        catch (err) {


            console.log(err);


        }


    };








console.log("attendanceHistory =", attendanceHistory);
    return (


        <div className="student-detail-page">



            <div className="container py-5">





                <button

                    className="back-btn"

                    onClick={() => navigate(-1)}

                >

                    ← Quay lại

                </button>









                {/* THÔNG TIN LỚP */}



                <div className="detail-card mt-4">



                    <div className="detail-header">



                        <div className="detail-icon">


                            <i className="bi bi-book"></i>


                        </div>





                        <div>


                            <h2>


                                {
                                    classInfo?.subject_name
                                    ||
                                    "Đang tải..."
                                }


                            </h2>



                            <p>


                                Mã lớp:

                                {" "}


                                {
                                    classInfo?.section
                                }


                            </p>


                        </div>




                    </div>









                    <div className="class-info">



                        <p>

                            👨‍🏫

                            Giảng viên:

                            {" "}

                            {
                                classInfo?.teacher_name
                                ||
                                "Chưa cập nhật"
                            }

                        </p>





                        <p>

                            📚

                            Loại lớp:

                            {" "}

                            {
                                classInfo?.class_type
                                ||
                                "Chưa cập nhật"
                            }

                        </p>





                        <p>

                            📅

                            Học kỳ:

                            {" "}

                            {
                                classInfo?.semester
                                ||
                                "Chưa cập nhật"
                            }

                        </p>



                    </div>




                </div>












                {/* LỊCH SỬ ĐIỂM DANH */}





                <h4 className="section-title">


                    📅 Lịch sử điểm danh


                </h4>








                <div className="detail-card">



                    <table className="table history-table">



                        <thead>


                            <tr>


                                <th>

                                    Buổi

                                </th>


                                <th>

                                    Ngày

                                </th>


                                <th>

                                    Trạng thái

                                </th>



                            </tr>


                        </thead>









                        <tbody>





                            {


                                attendanceHistory.length > 0 ?



                                    attendanceHistory.map(

                                        (item, index) => (



                                            <tr key={index}>


                                                <td>


                                                    {

                                                        item.lesson_no

                                                            ?

                                                            `Buổi ${item.lesson_no}`

                                                            :

                                                            `Buổi ${index + 1}`

                                                    }


                                                </td>





                                                <td>


                                                    {


                                                        new Date(

                                                            item.session_date

                                                        )

                                                            .toLocaleDateString(

                                                                "vi-VN"

                                                            )


                                                    }


                                                </td>







                                                <td
                                                    className={
                                                        item.status === "Có mặt"
                                                            ? "text-success fw-bold"
                                                            : item.status === "Đi trễ"
                                                                ? "text-warning fw-bold"
                                                                : "text-danger fw-bold"
                                                    }
                                                >
                                                    {
                                                        item.status === "Có mặt"
                                                            ? "Có mặt ✅"
                                                            : item.status === "Đi trễ"
                                                                ? "Đi trễ ⏰"
                                                                : "Vắng ❌"
                                                    }
                                                </td>




                                            </tr>



                                        ))



                                    :



                                    <tr>


                                        <td

                                            colSpan="3"

                                            className="text-center"

                                        >


                                            Chưa có lịch sử điểm danh


                                        </td>


                                    </tr>



                            }





                        </tbody>





                    </table>





                </div>









            </div>




        </div>


    );


}



export default StudentClassDetail;