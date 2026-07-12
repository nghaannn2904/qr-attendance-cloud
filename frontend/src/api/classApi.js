import api from "./axios";

export const getMyClasses = (token) => {

    return api.get("/classes", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

};
export const getStudentsByClass = (classId, token) => {

    return api.get(`/classes/${classId}/students`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

};
export const startAttendance = (classId, token) => {

    return api.post(
        `/classes/${classId}/attendance/open`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

};
export const getAttendanceList = (
    classId,
    sessionId,
    token
) => {

    return api.get(
        `/classes/${classId}/attendance/${sessionId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

};