const express = require("express");
const router = express.Router();

const {
    loginDoctor,
    getAppointments,
    approveAppointment,
    rejectAppointment,
    addDoctorNotes
} = require("../controllers/doctorController");

router.post("/login", loginDoctor);

router.get("/appointments", getAppointments);

router.put("/approve/:appointmentId", approveAppointment);

router.put("/reject/:appointmentId", rejectAppointment);

router.put("/notes/:appointmentId", addDoctorNotes);

module.exports = router;