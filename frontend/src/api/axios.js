import axios from "axios";

const api = axios.create({
    baseURL: `http://${window.location.hostname}:3000/api`,
    timeout: 10000,
});

api.interceptors.response.use(

    (response) => response,

    (error) => {

        // JWT hết hạn hoặc không hợp lệ
        if (error.response?.status === 401) {

            localStorage.removeItem("teacher");
            localStorage.removeItem("teacherToken");

            localStorage.removeItem("student");
            localStorage.removeItem("studentToken");

            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

            window.location.href = "/";

            return Promise.reject(error);
        }

        // Server lỗi
        if (error.response?.status >= 500) {

            alert("Máy chủ đang gặp sự cố. Vui lòng thử lại sau.");

            return Promise.reject(error);
        }

        // Không kết nối được backend
        if (!error.response) {

            alert("Không thể kết nối tới máy chủ.");

            return Promise.reject(error);
        }

        return Promise.reject(error);

    }

);

export default api;