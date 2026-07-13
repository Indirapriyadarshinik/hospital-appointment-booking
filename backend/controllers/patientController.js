const sns = require("../config/sns");
const dynamoDB = require("../config/aws");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// ================= REGISTER =================

exports.registerPatient = async (req, res) => {
    try {

        const {
            fullName,
            email,
            phone,
            password,
            gender,
            age
        } = req.body;

        if (!fullName || !email || !phone || !password || !gender || !age) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const patient = {
            patientId: "PAT-" + uuidv4().substring(0, 8).toUpperCase(),
            fullName,
            email,
            phone,
            password: hashedPassword,
            gender,
            age,
            createdAt: new Date().toISOString()
        };

        await dynamoDB.put({
            TableName: "Patients",
            Item: patient
        }).promise();

        return res.status(201).json({
            success: true,
            message: "Patient Registered Successfully",
            patientId: patient.patientId
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// ================= LOGIN =================

exports.loginPatient = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required."
            });
        }

        const data = await dynamoDB.scan({
            TableName: "Patients"
        }).promise();

        const patient = data.Items.find(item => item.email === email);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found."
            });
        }

        const isMatch = await bcrypt.compare(password, patient.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            patientId: patient.patientId,
            fullName: patient.fullName
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ================= BOOK APPOINTMENT =================

exports.bookAppointment = async (req, res) => {

    try {

        const {
            patientId,
            doctorId,
            department,
            appointmentDate,
            appointmentTime,
            bloodGroup,
            emergencyContact,
            symptoms,
            medicalHistory,
            medications,
            allergies,
            emergencyCase,
            notes
        } = req.body;

        if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !symptoms) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const appointment = {

            appointmentId: "APT-" + uuidv4().substring(0,8).toUpperCase(),

            patientId,
            doctorId,
            department,
            appointmentDate,
            appointmentTime,
            bloodGroup,
            emergencyContact,
            symptoms,
            medicalHistory,
            medications,
            allergies,
            emergencyCase,
            notes,

            status: "Pending",

            createdAt: new Date().toISOString()

        };

        await dynamoDB.put({

            TableName: "Appointments",

            Item: appointment

        }).promise();

        return res.status(201).json({

            success: true,

            message: "Appointment Booked Successfully",

            appointmentId: appointment.appointmentId

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

exports.getAppointments = async (req, res) => {

    try {

        const patientId = req.params.patientId;

        const params = {

            TableName: "Appointments"

        };

        const data = await dynamoDB.scan(params).promise();

        const appointments = data.Items.filter(

            item => item.patientId === patientId

        );

        return res.status(200).json({

            success: true,

            appointments

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};
// Get Patient Profile
//const getPatientProfile = async (req, res) => {
  exports.getPatientProfile = async (req, res) => {  
    try {
        const { patientId } = req.params;

        const params = {
            TableName: "Patients",
            Key: {
                patientId: patientId
            }
        };

        const result = await dynamoDB.get(params).promise();

        if (!result.Item) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            patient: result.Item
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
