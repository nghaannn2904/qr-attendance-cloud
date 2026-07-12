import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyClasses } from "../../api/classApi";

function DashboardTeacher() {

    const teacher = JSON.parse(localStorage.getItem("teacher"));
    const token = localStorage.getItem("token");
    const navigate = useNavigate();


    const [classes, setClasses] = useState([]);

    useEffect(() => {

        loadClasses();

    }, []);

    const loadClasses = async () => {

        try {

            const res = await getMyClasses(token);

            console.log("API:", res.data);

            setClasses(res.data);

        } catch (err) {

            console.log(err);



        };
    };
    console.log("teacher:", teacher);
    console.log("classes:", classes);
    console.log("isArray:", Array.isArray(classes));

    return (

        <div className="container mt-5">

            <h2>Dashboard Giáo viên</h2>

            <hr />

            <h4>Xin chào, {teacher?.full_name}</h4>

            <br />

            <h5>Lớp học của bạn</h5>

            {
                classes.length === 0
                    ? (
                        <p>Chưa có lớp.</p>
                    )
                    : (
                        classes.map((item) => (

                            <div
                                key={item.id}
                                className="card mb-3 shadow-sm"
                            >

                                <div className="card-body">

                                    <h5>
                                        Lớp {item.section}
                                    </h5>

                                    <p>

                                        Loại lớp:
                                        {" "}
                                        {item.class_type}

                                    </p>

                                    <p>

                                        Học kỳ:
                                        {" "}
                                        {item.semester}

                                    </p>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/teacher/class/${item.id}`)}
                                    >
                                        Quản lý
                                    </button>

                                </div>

                            </div>

                        ))
                    )
            }

        </div>

    );

}

export default DashboardTeacher;