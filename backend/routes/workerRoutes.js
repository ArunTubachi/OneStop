const express = require("express");

const router = express.Router();

const {
    registerWorker,
    loginWorker,
    getWorkerBookings,
    acceptBooking,
    rejectBooking,
    completeBooking,
    getApprovedWorkers
} = require("../controllers/workerController");

router.post("/register", registerWorker);

router.post("/login", loginWorker);

router.get("/bookings/:id", getWorkerBookings);

router.put("/accept-booking/:id", acceptBooking);

router.put("/reject-booking/:id", rejectBooking);

router.put("/complete-booking/:id", completeBooking);

router.get("/approved", getApprovedWorkers);

module.exports = router;