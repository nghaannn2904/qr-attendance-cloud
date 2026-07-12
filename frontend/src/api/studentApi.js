import api from "./axios";

/**
 * Đăng nhập sinh viên
 */
export const studentLogin = (data) => {

    return api.post("/student/login", data);

};

/**
 * Sinh viên điểm danh
 */
export const checkIn = (token, qrToken) => {

    return api.post(
        "/attendance/check-in",
        {
            token: qrToken
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

};