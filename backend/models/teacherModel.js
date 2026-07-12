const db = require("../config/db");

exports.findByEmail = (email, callback) => {
    const sql = "SELECT * FROM teachers WHERE email = ?";

    db.query(sql, [email], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, results[0]);
    });
};