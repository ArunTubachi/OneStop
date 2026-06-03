const serviceRoutes = require("./routes/serviceRoutes");

const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");
const db = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const workerRoutes = require("./routes/workerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);


app.get("/", (req, res) => {
    res.send("Home Service Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// ==========================
// GET ALL BOOKINGS
// ==========================

app.get("/api/bookings", (req, res) => {

    const sql = `

        SELECT * FROM bookings
        ORDER BY created_at DESC

    `;

    db.query(sql, (error, results) => {

        if (error) {

            console.log(error);

            res.status(500).json({

                success: false,
                message: "Database error"

            });

        } else {

            res.json(results);

        }

    });

});