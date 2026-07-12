import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

import { checkIn } from "../../api/studentApi";

function ScanQR() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: 250
            },
            false
        );

        scanner.render(

            async (decodedText) => {

                try {

                    await scanner.clear();

                    const res = await checkIn(
                        token,
                        decodedText
                    );

                    alert(res.data.message);

                    navigate("/student/dashboard");

                } catch (err) {

                    alert(
                        err.response?.data?.message ||
                        "Điểm danh thất bại."
                    );

                }

            },

            () => {
                // bỏ qua lỗi khi đang quét
            }

        );

        return () => {

            scanner.clear().catch(() => { });

        };

    }, []);

    return (

        <div className="container mt-5">

            <h2>Quét mã QR</h2>

            <hr />

            <div id="reader"></div>

        </div>

    );

}

export default ScanQR;