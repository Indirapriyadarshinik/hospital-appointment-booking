const express = require("express");
const router = express.Router();

const {
    registerPatient,
    loginPatient,
    bookAppointment,
    getAppointments,
    getPatientProfile
} = require("../controllers/patientController");

router.post("/register", registerPatient);

router.post("/login", loginPatient);

router.post("/book-appointment", bookAppointment);

router.get("/appointments/:patientId", getAppointments);

router.get("/profile/:patientId", getPatientProfile);
router.get("/test", (req, res) => {
    res.send("Patient Route Working");
});

module.exports = router;