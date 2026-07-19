const express = require("express");
const cors = require("cors");
require("dotenv").config();


// Database
require("./config/db");


// Routes
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




// Home

app.get("/", (req,res)=>{

    res.send("🚀 QR Attendance API đang chạy!");

});




// =====================
// TEACHER
// =====================


app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/classes",
    classRoutes
);


app.use(
    "/api/students",
    studentRoutes
);



// =====================
// STUDENT
// =====================


// Login sinh viên

app.use(
    "/api/student",
    studentAuthRoutes
);


// Chức năng sinh viên

app.use(
    "/api/student",
    studentRoutes
);




// =====================
// ENROLLMENT
// =====================

app.use(
    "/api",
    enrollmentRoutes
);




// =====================
// ATTENDANCE QR
// =====================

app.use(
    "/api",
    attendanceRoutes
);




// 404

app.use((req,res)=>{

    res.status(404).json({

        success:false,

        message:"API không tồn tại!"

    });

});





app.listen(

    PORT,

    "0.0.0.0",

    ()=>{

        console.log(
            `🚀 Server đang chạy tại port ${PORT}`
        );

    }

);