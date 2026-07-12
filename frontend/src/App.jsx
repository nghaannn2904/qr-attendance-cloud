import { Routes, Route } from "react-router-dom";

import LoginTeacher from "./pages/teacher/LoginTeacher";
import DashboardTeacher from "./pages/teacher/DashboardTeacher";
import ClassDetail from "./pages/teacher/ClassDetail";
import LoginStudent from "./pages/student/LoginStudent";
import DashboardStudent from "./pages/student/DashboardStudent";
import ScanQR from "./pages/student/ScanQR";
function App() {

  return (

    <Routes>

      <Route
        path="/"
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


    </Routes>

  );

}

export default App;