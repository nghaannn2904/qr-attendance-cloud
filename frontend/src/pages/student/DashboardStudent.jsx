import { useNavigate } from "react-router-dom";

function DashboardStudent() {

    const student = JSON.parse(
        localStorage.getItem("student")
    );

    const navigate = useNavigate();

    return (

        <div className="container mt-5">

            <h2>
                Xin chào {student?.full_name}
            </h2>

            <hr />

            <div className="card shadow-sm p-4">

                <p>
                    <strong>MSSV:</strong>{" "}
                    {student?.student_code}
                </p>

                <p>
                    <strong>Email:</strong>{" "}
                    {student?.email}
                </p>

                <div className="d-grid mt-3">

                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate("/student/scan")}
                    >
                        📷 Quét QR điểm danh
                    </button>

                </div>

            </div>

        </div>

    );

}

export default DashboardStudent;