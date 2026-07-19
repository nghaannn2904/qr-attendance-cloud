import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import "../../styles/studentDashboard.css";



function DashboardStudent(){


    const navigate = useNavigate();


    const [student,setStudent] = useState(null);

    const [classes,setClasses] = useState([]);





    useEffect(()=>{


        const data = JSON.parse(

            localStorage.getItem("student")

        );


        setStudent(data);


        loadClasses();


    },[]);







    const loadClasses = async()=>{


        try{


            const token = localStorage.getItem(

                "studentToken"

            );



            const res = await api.get(

                "/student/classes",

                {

                    headers:{

                        Authorization:

                        `Bearer ${token}`

                    }

                }

            );



            setClasses(res.data);



        }

        catch(err){

            console.log(err);

        }


    };







    const logout = ()=>{


        localStorage.removeItem(

            "studentToken"

        );


        localStorage.removeItem(

            "student"

        );


        navigate("/");


    };







    return(


        <div className="student-page">



            <div className="student-dashboard">







                {/* NAVBAR */}


                <nav className="student-navbar">


                    <div className="container d-flex justify-content-between align-items-center">



                        <h4 className="fw-bold text-success mb-0">

                            QR Attendance

                        </h4>







                        <div className="d-flex align-items-center gap-3">



                            <div className="student-avatar">


                                {student?.full_name?.charAt(0)}


                            </div>






                            <span className="d-none d-md-block">


                                {student?.full_name}


                            </span>






                            <button


                                className="btn btn-outline-danger btn-sm"


                                onClick={logout}


                            >

                                Đăng xuất


                            </button>



                        </div>


                    </div>


                </nav>









                <div className="container py-5">







                    <h2 className="fw-bold">


                        Xin chào,

                        {" "}

                        {student?.full_name}



                    </h2>







                    <p className="text-muted">


                        Xem lớp học và điểm danh QR


                    </p>









                    {/* BUTTON QR */}



                    <button


                        className="student-scan-main"


                        onClick={()=>navigate("/student/scan")}


                    >



                        <i className="bi bi-qr-code-scan"></i>


                        Quét QR điểm danh



                    </button>









                    <h4 className="fw-bold mt-4 mb-3">


                        Lớp học của bạn


                    </h4>









                    <div className="row g-4">





                        {


                            classes.length > 0 ?



                            classes.map((item)=>(



                                <div


                                    className="col-12 col-md-6 col-lg-4"


                                    key={item.id}


                                >





                                    <div className="student-class-card">






                                        <div className="student-class-title">





                                            <div className="student-class-icon">


                                                <i className="bi bi-book"></i>


                                            </div>







                                            <h3>


                                                {item.subject_name}


                                            </h3>





                                        </div>









                                        <div className="student-class-bottom">





                                            <p className="student-code">


                                                Mã lớp:

                                                {" "}

                                                {item.section}



                                            </p>







                                            <button


                                                className="btn-enter-class"


                                                onClick={()=>navigate(

                                                    `/student/class/${item.id}`

                                                )}


                                            >


                                                Vào lớp



                                            </button>







                                        </div>







                                    </div>





                                </div>




                            ))



                            :



                            <div className="text-center text-muted">


                                Chưa tham gia lớp nào


                            </div>




                        }





                    </div>






                </div>






            </div>



        </div>



    );


}



export default DashboardStudent;