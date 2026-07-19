import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import "../../styles/dashboard.css";


function DashboardTeacher() {

    const navigate = useNavigate();


    const [teacher, setTeacher] = useState(null);

    const [classes, setClasses] = useState([]);



    useEffect(() => {


        const data =
            JSON.parse(
                localStorage.getItem("teacher")
            );


        setTeacher(data);


        loadClasses();


    }, []);




    const loadClasses = async () => {

        try {


            const token =
                localStorage.getItem(
                    "teacherToken"
                );



            const res =
                await api.get(
                    "/classes",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );



            console.log(res.data);


            setClasses(res.data);



        }
        catch (err) {

            console.log(err);

        }


    };





    const logout = () => {


        localStorage.removeItem(
            "teacherToken"
        );


        localStorage.removeItem(
            "teacher"
        );


        navigate("/");


    };





    return (


        <div className="dashboard-page teacher-page">


            {/* NAVBAR */}

            <nav className="dashboard-navbar">


                <div className="container d-flex justify-content-between align-items-center">


                    <h4 className="mb-0 text-primary fw-bold">

                        QR Attendance

                    </h4>





                    <div className="d-flex align-items-center gap-3">


                        <div className="teacher-avatar">


                            {
                                teacher?.full_name
                                    ?.charAt(0)
                            }


                        </div>





                        <span className="d-none d-md-block">


                            {
                                teacher?.full_name
                            }


                        </span>






                        <button

                            className="
                            btn
                            btn-outline-danger
                            btn-sm
                            "

                            onClick={logout}

                        >

                            Đăng xuất


                        </button>



                    </div>



                </div>


            </nav>







            <div className="container py-5">



                <h2 className="fw-bold mb-2">


                    Xin chào,
                    {" "}
                    {teacher?.full_name}


                </h2>





                <p className="text-muted">


                    Quản lý lớp học và điểm danh QR Code


                </p>






                <div className="row g-4 mt-3">





                    {


                        classes.length > 0 ?



                            classes.map((item) => (



                                <div

                                    className="
                            col-12
                            col-md-6
                            col-lg-4
                            "

                                    key={item.id}

                                >





                                    <div className="class-card">





                                        {/* ICON + TÊN MÔN */}



                                        <div className="class-top">


                                            <div className="class-icon">


                                                <i className="bi bi-book"></i>


                                            </div>






                                            <h3>


                                                {
                                                    item.subject_name
                                                }


                                            </h3>



                                        </div>









                                        {/* MÃ LỚP + BUTTON */}



                                        <div className="class-bottom">



                                            <div className="class-code">


                                                Mã lớp:
                                                {" "}
                                                {item.section}



                                            </div>





                                            <button


                                                className="btn-class"



                                                onClick={() =>


                                                    navigate(
                                                        `/teacher/class/${item.id}`
                                                    )


                                                }


                                            >


                                                Quản lý lớp



                                            </button>




                                        </div>






                                    </div>





                                </div>



                            ))



                            :



                            <div className="text-center text-muted">


                                Chưa có lớp học


                            </div>


                    }



                </div>





            </div>




        </div>



    );


}



export default DashboardTeacher;