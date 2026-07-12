const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Student = require("../models/studentAuthModel");

exports.login = (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng nhập đầy đủ thông tin"
        });
    }

    // Chuẩn hóa email
    email = email.trim().toLowerCase();

    Student.findByEmail(email, (err, student) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Lỗi server"
            });
        }

        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Tài khoản không tồn tại"
            });
        }

        bcrypt.compare(password, student.password, (err, isMatch) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Lỗi server"
                });
            }

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Sai mật khẩu"
                });
            }

            const token = jwt.sign(
                {
                    id: student.id,
                    role: "student"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            return res.json({
                success: true,
                message: "Đăng nhập thành công",
                token,
                student: {
                    id: student.id,
                    student_code: student.student_code,
                    full_name: student.full_name,
                    email: student.email
                }
            });

        });

    });

};