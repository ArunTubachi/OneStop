const db = require("../config/db");

// ==========================
// CREATE BOOKING
// ==========================

const createBooking = (req, res) => {

    const bookingData = req.body;

    const sql = `

    INSERT INTO bookings
    (
        user_id,
        worker_id,
        service_id,
        booking_date,
        time_slot,
        address,
        notes,
        status
    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?)

`;

    const values = [

        bookingData.user_id,
        bookingData.worker_id,
        bookingData.service_id,
        bookingData.booking_date,
        bookingData.time_slot,
        bookingData.address,
        bookingData.notes || "",
        "Pending"

    ];

    db.query(sql, values, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Booking failed"
            });

        }

        res.status(201).json({

            message: "Booking Created Successfully"

        });

    });

};

// ==========================
// GET ALL BOOKINGS
// ==========================

const getAllBookings = (req, res) => {

    const sql = `

    SELECT

        bookings.*,

        services.service_name,

        workers.name AS worker_name

    FROM bookings

    LEFT JOIN services
    ON bookings.service_id = services.id

    LEFT JOIN workers
    ON bookings.worker_id = workers.id

    ORDER BY bookings.created_at DESC

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

// ==========================
// GET USER BOOKINGS
// ==========================

const getUserBookings = (req, res) => {

    const email = req.params.email;

    const sql = `
    
        SELECT * FROM bookings
        WHERE customer_email = ?
        ORDER BY created_at DESC
    
    `;

    db.query(sql, [email], (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Database error"
            });

        }

        res.status(200).json(result);

    });

};

// ==========================
// EXPORTS
// ==========================

module.exports = {

    createBooking,
    getAllBookings,
    getUserBookings

};