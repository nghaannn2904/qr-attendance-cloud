const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Kết nối Database
require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth");
const classRoutes = require("./routes/class");
const studentRoutes = require("./routes/student");
const enrollmentRoutes = require("./routes/enrollment");
const attendanceRoutes = require("./routes/attendanceRoutes");
const studentAuthRoutes = require("./routes/studentAuth");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Trang chủ
app.get("/", (req, res) => {
    res.send("🚀 QR Attendance API đang chạy!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api/student", studentAuthRoutes);

// QR attendance routes
app.use("/api", attendanceRoutes);

// API không tồn tại
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API không tồn tại!"
    });
});

// Khởi động Server
// Khởi động Server
app.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log(`🚀 Server đang chạy tại port ${PORT}`);
    }
);