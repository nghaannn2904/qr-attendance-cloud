import api from "./axios";

export const teacherLogin = (data) => {
    return api.post("/auth/login", data);
};