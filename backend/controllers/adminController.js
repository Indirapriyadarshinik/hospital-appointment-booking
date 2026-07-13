exports.loginAdmin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {

            return res.json({
                success: true,
                message: "Admin Login Successful"
            });

        }

        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const dynamoDB = require("../config/aws");
const { v4: uuidv4 } = require("uuid");

exports.createDoctor = async (req, res) => {
    try {
        const { fullName, email, phone, password, department, experience, qualification, consultationFee, availableDays, availableTime, address } = req.body;
        if (!fullName || !email || !phone || !password || !department) {
            return res.status(400).json({ success: false, message: "Name, email, phone, password and department are required." });
        }

        const existing = await dynamoDB.scan({
            TableName: "Doctors",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: { ":email": email }
        }).promise();
        if ((existing.Items || []).length > 0) {
            return res.status(409).json({ success: false, message: "A doctor already exists with this email." });
        }

        const doctor = {
            doctorId: "DR" + uuidv4().replace(/-/g, "").slice(0, 6).toUpperCase(),
            fullName, email, phone, password, department, experience, qualification,
            consultationFee, availableDays, availableTime, address,
            createdAt: new Date().toISOString()
        };
        await dynamoDB.put({ TableName: "Doctors", Item: doctor }).promise();
        return res.status(201).json({ success: true, message: "Doctor created successfully.", doctor });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Unable to create doctor." });
    }
};

exports.getPatients = async (req, res) => {
    try {
        const data = await dynamoDB.scan({ TableName: "Patients" }).promise();
        return res.json({ success: true, patients: data.Items || [] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Unable to load patients." });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const data = await dynamoDB.scan({ TableName: "Doctors" }).promise();
        const doctors = (data.Items || []).map(({ password, ...doctor }) => doctor);
        return res.json({ success: true, doctors });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Unable to load doctors." });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const data = await dynamoDB.scan({ TableName: "Appointments" }).promise();
        return res.json({ success: true, appointments: data.Items || [] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Unable to load appointments." });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const [patientsData, doctorsData, appointmentsData] = await Promise.all([
            dynamoDB.scan({ TableName: "Patients", Select: "COUNT" }).promise(),
            dynamoDB.scan({ TableName: "Doctors", Select: "COUNT" }).promise(),
            dynamoDB.scan({ TableName: "Appointments" }).promise()
        ]);

        const appointments = appointmentsData.Items || [];
        const today = new Date().toISOString().slice(0, 10);

        return res.status(200).json({
            success: true,
            stats: {
                totalPatients: patientsData.Count || 0,
                totalDoctors: doctorsData.Count || 0,
                todaysAppointments: appointments.filter((item) => item.appointmentDate === today).length,
                pendingAppointments: appointments.filter((item) => item.status === "Pending").length
            },
            recentAppointments: [...appointments]
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                .slice(0, 5)
                .map(({ appointmentId, patientId, status, createdAt }) => ({ appointmentId, patientId, status, createdAt }))
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Unable to load dashboard statistics." });
    }
};
