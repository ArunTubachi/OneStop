const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerWorker = async (req, res) => {

    const {
        name,
        email,
        phone,
        password,
        category,
        experience,
        address
    } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO workers
            (
                name,
                email,
                phone,
                password,
                category,
                experience,
                address
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                name,
                email,
                phone,
                hashedPassword,
                category,
                experience,
                address
            ],
            (err, result) => {

                if (err) {

                    return res.status(500).json({
                        message: "Worker registration failed",
                        error: err
                    });

                }

                res.status(201).json({
                    message: "Registration submitted. Waiting for admin approval."
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

};

exports.loginWorker = (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM workers
        WHERE email = ?
    `;

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        const worker = result[0];

        if (worker.status === "Pending") {

            return res.status(403).json({
                message: "Your account is still pending admin approval"
            });

        }

        if (worker.status === "Rejected") {

            return res.status(403).json({
                message: "Your registration was rejected by admin"
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            worker.password
        );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid password"
            });

        }

        const token = jwt.sign(

    {
        id: worker.id,
        email: worker.email,
        role: "worker"
    },

    process.env.JWT_SECRET,

    {
        expiresIn: "7d"
    }

);

res.status(200).json({

    message: "Login successful",

    token,

    worker: {

        id: worker.id,
        name: worker.name,
        email: worker.email,
        category: worker.category,
        availability: worker.availability,
        role: "worker"

    }

});

    });

};

exports.getWorkerBookings = (req, res) => {

    const workerId = req.params.id;

    const sql = `
        SELECT * FROM bookings
        WHERE worker_id = ?
    `;

    db.query(sql, [workerId], (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Database error"
            });

        }

        res.status(200).json(result);

    });

};

exports.acceptBooking = (req, res) => {

    const bookingId = req.params.id;

    const bookingSql = `
        SELECT * FROM bookings
        WHERE id = ?
    `;

    db.query(bookingSql, [bookingId], (err, result) => {

        if (err || result.length === 0) {

            return res.status(500).json({
                message: "Booking not found"
            });

        }

        const workerId = result[0].worker_id;

        const updateBookingSql = `
            UPDATE bookings
            SET status = 'Accepted'
            WHERE id = ?
        `;

        db.query(updateBookingSql, [bookingId], (err) => {

            if (err) {

                return res.status(500).json({
                    message: "Booking update failed"
                });

            }

            const updateWorkerSql = `
                UPDATE workers
                SET availability = 'Busy'
                WHERE id = ?
            `;

            db.query(updateWorkerSql, [workerId]);

            res.status(200).json({
                message: "Booking accepted"
            });

        });

    });

};

exports.rejectBooking = (req, res) => {

    const bookingId = req.params.id;

    const sql = `
        UPDATE bookings
        SET status = 'Rejected'
        WHERE id = ?
    `;

    db.query(sql, [bookingId], (err) => {

        if (err) {

            return res.status(500).json({
                message: "Rejection failed"
            });

        }

        res.status(200).json({
            message: "Booking rejected"
        });

    });

};

exports.completeBooking = (req, res) => {

    const bookingId = req.params.id;

    const bookingSql = `
        SELECT * FROM bookings
        WHERE id = ?
    `;

    db.query(bookingSql, [bookingId], (err, result) => {

        if (err || result.length === 0) {

            return res.status(500).json({
                message: "Booking not found"
            });

        }

        const workerId = result[0].worker_id;

        const updateBookingSql = `
            UPDATE bookings
            SET status = 'Completed'
            WHERE id = ?
        `;

        db.query(updateBookingSql, [bookingId], (err) => {

            if (err) {

                return res.status(500).json({
                    message: "Completion failed"
                });

            }

            const updateWorkerSql = `
                UPDATE workers
                SET availability = 'Available'
                WHERE id = ?
            `;

            db.query(updateWorkerSql, [workerId]);

            res.status(200).json({
                message: "Booking completed"
            });

        });

    });

};

const getApprovedWorkers = (req, res) => {

    const category = req.query.category;

    let sql = `
    
        SELECT * FROM workers
        WHERE status = 'Approved'
    
    `;

    if (category) {

        sql += ` AND category='${category}'`;

    }

    db.query(sql, (error, results) => {

        if (error) {

            console.log(error);

            return res.status(500).json({

                success: false,
                message: "Database Error"

            });

        }

        res.json(results);

    });

};

exports.getApprovedWorkers = getApprovedWorkers;