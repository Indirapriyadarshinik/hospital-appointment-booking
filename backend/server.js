const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("Bucket:", process.env.S3_BUCKET_NAME);
console.log("Region:", process.env.AWS_REGION);
console.log("Access Key Prefix:", process.env.AWS_ACCESS_KEY_ID?.substring(0, 4));
console.log("Access Key Length:", process.env.AWS_ACCESS_KEY_ID?.length);
console.log("Secret Key Length:", process.env.AWS_SECRET_ACCESS_KEY?.length);

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