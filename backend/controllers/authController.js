const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Teacher = require("../models/teacherModel");

exports.login = (req, res) => {

    const { email, password } = req.body;

    Teacher.findByEmail(email, (err, teacher) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Lỗi server"
            });
        }

        if (!teacher) {
            return res.status(401).json({
                success: false,
                message: "Email không tồn tại"
            });
        }

        bcrypt.compare(password, teacher.password, (err, isMatch) => {

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Sai mật khẩu"
                });
            }

            const token = jwt.sign(
                {
                    id: teacher.id,
                    email: teacher.email,
                    role: "teacher"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            res.json({
                success: true,
                message: "Đăng nhập thành công",
                token,
                teacher: {
                    id: teacher.id,
                    full_name: teacher.full_name,
                    email: teacher.email
                }
            });

        });

    });

};