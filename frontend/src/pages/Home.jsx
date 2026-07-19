import { Link } from "react-router-dom";

import HeroSection from "../components/home/HeroSection";

import "../styles/home.css";

function Home() {

    return (

        <div
            className="
                home-page
                container-fluid
                d-flex
                justify-content-center
                align-items-center
                py-4
                px-3
            "
        >

            <div
                className="
                    card
                    border-0
                    shadow-lg
                    home-card
                    w-100
                "
            >

                <div className="row g-0">

                    {/* Left */}

                    <div
                        className="
                            col-12
                            col-lg-6
                            p-4
                            p-md-5
                            d-flex
                            flex-column
                            justify-content-center
                        "
                    >

                        <h1 className="home-title text-primary mb-3">

                            QR Attendance System

                        </h1>

                        <h4 className="home-subtitle mb-4">

                            Hệ thống điểm danh bằng QR Code

                        </h4>

                        <p className="text-muted lh-lg">

                            Ứng dụng hỗ trợ giảng viên tạo mã QR để
                            điểm danh nhanh chóng, giúp sinh viên
                            xác nhận có mặt chỉ với một lần quét.
                        </p>

                        <div className="d-grid gap-3 mt-4">

                            <Link
                                to="/teacher/login"
                                className="
                                    btn
                                    btn-primary
                                    btn-home
                                    d-flex
                                    align-items-center
                                    justify-content-center
                                "
                            >

                                <i
                                    className="
                                        bi
                                        bi-person-workspace
                                        fs-5
                                        me-2
                                    "
                                ></i>

                                <span>

                                    Đăng nhập Giáo viên

                                </span>

                            </Link>

                            <Link
                                to="/student/login"
                                className="
                                    btn
                                    btn-success
                                    btn-home
                                    d-flex
                                    align-items-center
                                    justify-content-center
                                "
                            >

                                <i
                                    className="
                                        bi
                                        bi-mortarboard-fill
                                        fs-5
                                        me-2
                                    "
                                ></i>

                                <span>

                                    Đăng nhập Sinh viên

                                </span>

                            </Link>

                        </div>

                    </div>

                    {/* Right */}

                    <HeroSection />

                </div>

            </div>

        </div>

    );

}

export default Home;