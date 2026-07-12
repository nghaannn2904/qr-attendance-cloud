const jwt = require("jsonwebtoken");

/**
 * Kiểm tra token
 */
exports.verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Chưa có token."
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ."
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Token hết hạn hoặc không hợp lệ."
        });

    }

};

/**
 * Chỉ giáo viên
 */
exports.verifyTeacher = (req, res, next) => {

    if (req.user.role !== "teacher") {
        return res.status(403).json({
            success: false,
            message: "Chỉ giáo viên mới được phép."
        });
    }

    next();

};

/**
 * Chỉ sinh viên
 */
exports.verifyStudent = (req, res, next) => {

    if (req.user.role !== "student") {
        return res.status(403).json({
            success: false,
            message: "Chỉ sinh viên mới được phép."
        });
    }

    next();

};