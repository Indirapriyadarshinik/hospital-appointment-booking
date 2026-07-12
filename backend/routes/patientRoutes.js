const express = require("express");
const router = express.Router();

const {
    registerPatient,
    loginPatient,
    bookAppointment,
    getAppointments
} = require("../controllers/patientController");

router.post("/register", registerPatient);

router.post("/login", loginPatient);

router.post("/book-appointment", bookAppointment);

router.get("/appointments/:patientId", getAppointments);

module.exports = router;