const Class = require("../models/classModel");



/**
 * Tạo lớp học
 */
exports.create = (req,res)=>{


    const teacher_id = req.user.id;



    const {

        subject_id,

        section,

        class_type,

        semester,

        academic_year


    } = req.body;



    Class.createClass(

        {

            subject_id,

            section,

            class_type,

            semester,

            academic_year,

            teacher_id

        },


        (err)=>{


            if(err){

                return res.status(500).json({

                    success:false,

                    message:err.message

                });

            }



            res.json({

                success:true,

                message:"Tạo lớp thành công"

            });



        }


    );


};







/**
 * Lấy danh sách lớp của giáo viên
 */
exports.getAll = (req,res)=>{


    const teacherId = req.user.id;



    Class.getClassesByTeacher(

        teacherId,


        (err,result)=>{


            if(err){

                return res.status(500).json({

                    message:err.message

                });

            }



            res.json(result);



        }


    );


};








/**
 * Lấy thông tin chi tiết lớp
 */
exports.getDetail = (req,res)=>{


    const classId = req.params.id;



    Class.getDetail(

        classId,


        (err,result)=>{


            if(err){

                return res.status(500).json({

                    message:err.message

                });

            }



            res.json(result[0]);



        }


    );


};








/**
 * Lấy danh sách sinh viên trong lớp
 */
exports.getStudents = (req,res)=>{


    const classId = req.params.id;



    Class.getStudents(

        classId,


        (err,result)=>{


            if(err){

                return res.status(500).json({

                    message:err.message

                });

            }



            res.json(result);



        }


    );


};
// Xóa sinh viên khỏi lớp

// Xóa sinh viên khỏi lớp

exports.removeStudent = (req,res)=>{

    const {
        classId,
        studentId
    } = req.params;


    Class.removeStudent(

        classId,
        studentId,

        (err,result)=>{


            if(err){

                return res.status(500).json({

                    message:err.message

                });

            }


            if(result.affectedRows === 0){

                return res.status(404).json({

                    message:"Sinh viên không tồn tại trong lớp."

                });

            }


            res.json({

                success:true,

                message:"Đã xóa sinh viên khỏi lớp."

            });


        }

    );

};
// Lấy lịch sử điểm danh

exports.getAttendance = (req,res)=>{


    const classId = req.params.id;



    Class.getAttendance(

        classId,


        (err,result)=>{


            if(err){

                return res.status(500).json({

                    message:err.message

                });

            }



            res.json(result);


        }


    );


};
// Lấy lịch sử điểm danh

exports.getAttendance = (req,res)=>{

    const classId = req.params.id;


    Class.getAttendance(

        classId,

        (err,result)=>{


            if(err){

                return res.status(500).json({

                    message:err.message

                });

            }


            res.json(result);


        }

    );

};