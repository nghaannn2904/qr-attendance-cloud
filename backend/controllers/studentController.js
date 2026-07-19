const Student = require("../models/studentModel");

// Thêm sinh viên
exports.create = (req, res) => {

    const { student_code, full_name, email } = req.body;

    Student.createStudent(
        {
            student_code,
            full_name,
            email
        },
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Thêm sinh viên thành công!"
            });

        }
    );

};

// Lấy danh sách sinh viên
exports.getAll = (req, res) => {

    Student.getAllStudents((err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(results);

    });

};

// Xóa sinh viên
exports.delete = (req, res) => {

    const id = req.params.id;

    Student.deleteStudent(id, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "Xóa sinh viên thành công!"
        });

    });

}; exports.getClasses = (req, res) => {


    const studentId = req.user.id;



    Student.getClassesByStudent(

        studentId,

        (err, result) => {


            if (err) {

                return res.status(500).json({

                    success: false,

                    message: err.message

                });

            }



            res.json(result);


        }

    );


};
exports.searchStudent = (req, res) => {

    const studentCode = req.params.studentCode;

    Student.findByCode(studentCode, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {

            return res.json({
                success: false,
                message: "Không tìm thấy sinh viên."
            });

        }

        res.json({
            success: true,
            student: result[0]
        });

    });

};
// =========================
// CHI TIẾT LỚP
// =========================

exports.getClassDetail = (req, res) => {


    const studentId = req.user.id;

    const classId = req.params.id;



    Student.getClassDetail(

        studentId,

        classId,

        (err, result) => {


            if (err) {

                return res.status(500).json({

                    success: false,

                    message: err.message

                });

            }



            res.json(result[0]);


        }

    );


};







// =========================
// LỊCH SỬ ĐIỂM DANH
// =========================


exports.getAttendanceHistory = (req,res)=>{


    const studentId = req.user.id;
    const classId = req.params.id;


    console.log("studentId:", studentId);
    console.log("classId:", classId);


    Student.getAttendanceHistory(

        studentId,

        classId,

        (err,result)=>{


            if(err){

                console.log("SQL ERROR:", err);

                return res.status(500).json({

                    success:false,

                    message:err.message

                });

            }


            console.log("DATA:", result);


            res.json({

                success:true,

                data:result

            });


        }

    );


};