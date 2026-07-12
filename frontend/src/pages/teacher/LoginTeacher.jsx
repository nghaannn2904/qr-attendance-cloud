import { useState } from "react";
import { teacherLogin } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

function LoginTeacher() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await teacherLogin({
                email,
                password
            });

            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "teacher",
                JSON.stringify(res.data.teacher)
            );

            navigate("/teacher/dashboard");

        } catch (err) {

            alert(
                err.response?.data?.message || "Đăng nhập thất bại"
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
                                Đăng nhập giáo viên
                            </h3>

                            <form onSubmit={handleLogin}>

                                <div className="mb-3">

                                    <label>Email</label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                </div>

                                <div className="mb-3">

                                    <label>Mật khẩu</label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                </div>

                                <button
                                    className="btn btn-primary w-100"
                                >
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

export default LoginTeacher;