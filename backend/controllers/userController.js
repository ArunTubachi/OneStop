const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {

    const { name, email, phone, password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, phone, password)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, phone, hashedPassword],
            (err, result) => {

                if (err) {

                    console.error("REGISTER ERROR:", err);

                    if (err.code === "ER_DUP_ENTRY") {

                        return res.status(400).json({
                            message: "Email already registered"
                        });

                    }

                    return res.status(500).json({
                        message: "User registration failed"
                    });

                }

                const token = jwt.sign(

                    {
                        id: result.insertId,
                        email: email,
                        role: "user"
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn: "7d"
                    }

                );

                res.status(201).json({

                    message: "User registered successfully",

                    token,

                    user: {
                        id: result.insertId,
                        name,
                        email,
                        role: "user"
                    }

                });

            }
        );

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

};
exports.loginUser = (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM users
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
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(

            {
                id: user.id,
                email: user.email,
                role: "user"
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        res.status(200).json({

            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: "user"
            }

        });

    });

};

exports.getServices = (req, res) => {

    const sql = `
        SELECT * FROM services
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

exports.getApprovedWorkers = (req, res) => {

    const category = req.query.category;

    let sql = `
        SELECT * FROM workers
        WHERE status = 'Approved'
    `;

    let values = [];

    if (category) {

        sql += ` AND category = ?`;

        values.push(category);

    }

    db.query(sql, values, (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Database error"
            });

        }

        res.status(200).json(result);

    });

};

exports.createBooking = (req, res) => {

    const {
        user_id,
        worker_id,
        service_id,
        booking_date,
        time_slot,
        address,
        notes
    } = req.body;

    const checkSql = `
        SELECT * FROM bookings
        WHERE worker_id = ?
        AND booking_date = ?
        AND time_slot = ?
        AND status IN ('Pending', 'Accepted')
    `;

    db.query(
        checkSql,
        [worker_id, booking_date, time_slot],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Database error"
                });

            }

            if (result.length > 0) {

                return res.status(400).json({
                    message: "This slot is already booked"
                });

            }

            const insertSql = `
                INSERT INTO bookings
                (
                    user_id,
                    worker_id,
                    service_id,
                    booking_date,
                    time_slot,
                    address,
                    notes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [
                    user_id,
                    worker_id,
                    service_id,
                    booking_date,
                    time_slot,
                    address,
                    notes
                ],
                (err, result) => {

                    if (err) {

                        return res.status(500).json({
                            message: "Booking failed"
                        });

                    }

                    res.status(201).json({
                        message: "Booking created successfully"
                    });

                }
            );

        }
    );

};