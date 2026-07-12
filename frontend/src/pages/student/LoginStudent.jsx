import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentLogin } from "../../api/studentApi";

function LoginStudent() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await studentLogin({
                email,
                password
            });

            localStorage.setItem(
                "student",
                JSON.stringify(res.data.student)
            );

            localStorage.setItem(
                "studentToken",
                res.data.token
            );

            alert("Đăng nhập thành công");

            navigate("/student/dashboard");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Đăng nhập thất bại"
            );

        }

    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-body">

                            <h3 className="text-center mb-4">
                                Đăng nhập Sinh viên
                            </h3>

                            <form onSubmit={handleLogin}>

                                <input
                                    className="form-control mb-3"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                                <input
                                    type="password"
                                    className="form-control mb-3"
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                                <button className="btn btn-success w-100">
                                    Đăng nhập
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default LoginStudent;