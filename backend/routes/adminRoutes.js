const express = require("express");
const router = express.Router();

const { loginAdmin, getDashboardStats, createDoctor, getPatients, getDoctors, getAllAppointments } = require("../controllers/adminController");

router.post("/login", loginAdmin);

router.get("/dashboard-stats", getDashboardStats);
router.post("/doctors", createDoctor);
router.get("/doctors", getDoctors);
router.get("/patients", getPatients);
router.get("/appointments", getAllAppointments);

router.get("/", (req, res) => {
    res.send("Admin Route Working");
});

module.exports = router;
