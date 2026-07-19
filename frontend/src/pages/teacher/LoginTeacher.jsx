import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { teacherLogin } from "../../api/authApi";

import "../../styles/auth.css";

function LoginTeacher() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await teacherLogin({
                email,
                password
            });

            localStorage.setItem(
                "teacherToken",
                res.data.token
            );

            localStorage.setItem(
                "teacher",
                JSON.stringify(res.data.teacher)
            );

            navigate("/teacher/dashboard");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Đăng nhập thất bại"
            );

        }

    };

    return (

        <div className="auth-page">

            <div className="container py-5">

                <div className="card auth-card shadow-lg border-0 mx-auto">

                    <div className="row g-0">

                        {/* LEFT */}

                        <div className="col-12 col-lg-5 auth-left">

                            <div className="auth-left-content">

                                <i className="bi bi-person-workspace auth-icon"></i>

                                <h2 className="fw-bold mt-4">

                                    Giáo viên

                                </h2>

                                <p className="mb-0">

                                    QR Attendance System

                                </p>

                            </div>

                        </div>

                        {/* RIGHT */}

                        <div className="col-12 col-lg-7">

                            <div className="auth-form">

                                <h2 className="mb-2">

                                    Đăng nhập

                                </h2>

                                <p className="text-muted mb-4">

                                    Vui lòng đăng nhập để tiếp tục.

                                </p>

                                <form onSubmit={handleLogin}>

                                    <div className="mb-3">

                                        <label className="form-label">

                                            Email

                                        </label>

                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="mb-4">

                                        <label className="form-label">

                                            Mật khẩu

                                        </label>

                                        <input
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        />

                                    </div>

                                    <button
                                        className="btn btn-primary btn-login w-100"
                                    >

                                        Đăng nhập

                                    </button>

                                </form>

                                <div className="text-center mt-4">

                                    <Link
                                        to="/"
                                        className="back-home"
                                    >

                                        ← Quay về Trang chủ

                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default LoginTeacher;