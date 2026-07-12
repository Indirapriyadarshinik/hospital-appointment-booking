const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
    uploadReport,
    getPatientReports
} = require("../controllers/reportController");
router.post(
    "/upload",
    upload.single("report"),
    uploadReport
);
router.get(
    "/patient/:patientId", 
    getPatientReports);

module.exports = router;