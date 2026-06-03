const express = require("express");

const router = express.Router();

const {
    loginAdmin,
    getPendingWorkers,
    approveWorker,
    rejectWorker
} = require("../controllers/adminController");

router.post("/login", loginAdmin);

router.get("/pending-workers", getPendingWorkers);

router.put("/approve-worker/:id", approveWorker);

router.put("/reject-worker/:id", rejectWorker);

module.exports = router;