const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.loginAdmin = (req, res) => {

    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    const sql = `
        SELECT * FROM admins
        WHERE email = ? AND password = ?
    `;

    db.query(
        sql,
        [email, password],
        (err, result) => {

            console.log(result);

            if (err) {

                return res.status(500).json({
                    message: "Database error"
                });

            }

            if (result.length === 0) {

                return res.status(401).json({
                    message: "Invalid admin credentials"
                });

            }

            const admin = result[0];

const token = jwt.sign(

    {
        id: admin.id,
        email: admin.email,
        role: "admin"
    },

    process.env.JWT_SECRET,

    {
        expiresIn: "7d"
    }

);

res.status(200).json({

    message: "Admin login successful",

    token,

    admin: {

        id: admin.id,
        email: admin.email,
        role: "admin"

    }

});

        }
    );

};

exports.getPendingWorkers = (req, res) => {

    const sql = `
        SELECT * FROM workers
        WHERE status = 'Pending'
    `;

    db.query(sql, (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Database error"
            });

        }

        res.status(200).json(result);

    });

};

exports.approveWorker = (req, res) => {

    const workerId = req.params.id;

    const sql = `
        UPDATE workers
        SET status = 'Approved'
        WHERE id = ?
    `;

    db.query(sql, [workerId], (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Approval failed"
            });

        }

        res.status(200).json({
            message: "Worker approved successfully"
        });

    });

};

exports.rejectWorker = (req, res) => {

    const workerId = req.params.id;

    const sql = `
        UPDATE workers
        SET status = 'Rejected'
        WHERE id = ?
    `;

    db.query(sql, [workerId], (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Rejection failed"
            });

        }

        res.status(200).json({
            message: "Worker rejected successfully"
        });

    });

};