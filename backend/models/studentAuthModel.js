const db = require("../config/db");

exports.findByEmail = (email, callback) => {

    const sql = `
        SELECT *
        FROM students
        WHERE email = ?
        LIMIT 1
    `;

    db.query(sql, [email], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results[0]);

    });

};