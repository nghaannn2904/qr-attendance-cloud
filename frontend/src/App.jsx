import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import LoginTeacher from "./pages/teacher/LoginTeacher";
import DashboardTeacher from "./pages/teacher/DashboardTeacher";
import ClassDetail from "./pages/teacher/ClassDetail";

import LoginStudent from "./pages/student/LoginStudent";
import DashboardStudent from "./pages/student/DashboardStudent";
import ScanQR from "./pages/student/ScanQR";
import StudentClassDetail from "./pages/student/StudentClassDetail";
import AttendanceHistory from "./pages/teacher/AttendanceHistory";
function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/teacher/login"
        element={<LoginTeacher />}
      />

      <Route
        path="/teacher/dashboard"
        element={<DashboardTeacher />}
      />

      <Route
        path="/teacher/class/:id"
        element={<ClassDetail />}
      />

      <Route
        path="/student/login"
        element={<LoginStudent />}
      />

      <Route
        path="/student/dashboard"
        element={<DashboardStudent />}
      />

      <Route
        path="/student/scan"
        element={<ScanQR />}
      />

      <Route

        path="/student/class/:id"

        element={<StudentClassDetail />}

      />
      <Route

        path="/teacher/classes/:id/attendance"

        element={<AttendanceHistory />}

      />

    </Routes>

  );

}

export default App;