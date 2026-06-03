const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getServices,
    getApprovedWorkers,
    createBooking
} = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/services", getServices);

router.get("/workers", getApprovedWorkers);

router.post("/book-service", createBooking);

module.exports = router;