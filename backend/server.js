const express = require("express");
const cors = require("cors");
require("dotenv").config();

const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/patient", patientRoutes);
app.use("/doctor", doctorRoutes);
app.use("/admin", adminRoutes);
app.use("/report", reportRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Hospital Appointment Booking Backend Running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
