const sns = require("../config/sns");
const dynamoDB = require("../config/aws");
const bcrypt = require("bcrypt");

exports.loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and Password are required."
            });

        }

        const params = {
            TableName: "Doctors"
        };

        const data = await dynamoDB.scan(params).promise();

        const doctor = data.Items.find(
            item => item.email === email
        );

        if (!doctor) {

            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });

        }

        // Temporary plain-text password check
        if (password !== doctor.password) {

            return res.status(401).json({
                success: false,
                message: "Invalid Password."
            });

        }

        return res.status(200).json({

            success: true,
            message: "Doctor Login Successful",
            doctorId: doctor.doctorId,
            fullName: doctor.fullName,
            department: doctor.department

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
exports.getAppointments = async (req, res) => {

    try {

        const { doctorId } = req.query;

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "doctorId is required." });
        }

        const params = {
            TableName: "Appointments",
            FilterExpression: "doctorId = :doctorId",
            ExpressionAttributeValues: { ":doctorId": doctorId }
        };

        const data = await dynamoDB.scan(params).promise();

        return res.status(200).json({

            success: true,
            appointments: data.Items

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
exports.approveAppointment = async (req, res) => {

    try {

        const appointmentId = req.params.appointmentId;
        const { doctorId } = req.body;

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "doctorId is required." });
        }

        const params = {

            TableName: "Appointments",

            Key: {
                appointmentId: appointmentId
            },

            UpdateExpression: "SET #status = :status",

            ExpressionAttributeNames: {
                "#status": "status"
            },

            ExpressionAttributeValues: {
                ":status": "Approved",
                ":doctorId": doctorId,
                ":pending": "Pending"
            },

            ConditionExpression: "doctorId = :doctorId AND #status = :pending",

            ReturnValues: "ALL_NEW"

        };

        const data = await dynamoDB.update(params).promise();

        const appointment = data.Attributes;
        if (process.env.SNS_TOPIC_ARN) {
            try {
                const patientData = await dynamoDB.get({
                    TableName: "Patients",
                    Key: { patientId: appointment.patientId }
                }).promise();

                if (patientData.Item) {
                    await sns.publish({
                        TopicArn: process.env.SNS_TOPIC_ARN,
                        Subject: "Appointment Approved",
                        Message: `Hello ${patientData.Item.fullName},\n\nYour appointment ${appointment.appointmentId} has been approved.\nDate: ${appointment.appointmentDate}\nTime: ${appointment.appointmentTime}`
                    }).promise();
                }
            } catch (notificationError) {
                console.error("Appointment approved, but notification could not be sent:", notificationError);
            }
        }

        return res.status(200).json({

            success: true,

            message: "Appointment Approved",

            appointment: data.Attributes

        });

    }

    catch (error) {

        console.log(error);

        if (error.code === "ConditionalCheckFailedException") {
            return res.status(409).json({
                success: false,
                message: "This appointment is no longer pending or is assigned to another doctor."
            });
        }

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};
exports.rejectAppointment = async (req, res) => {

    try {

        const appointmentId = req.params.appointmentId;
        const { doctorId } = req.body;

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "doctorId is required." });
        }

        const params = {

            TableName: "Appointments",

            Key: {
                appointmentId: appointmentId
            },

            UpdateExpression: "SET #status = :status",

            ExpressionAttributeNames: {
                "#status": "status"
            },

            ExpressionAttributeValues: {
                ":status": "Rejected",
                ":doctorId": doctorId,
                ":pending": "Pending"
            },

            ConditionExpression: "doctorId = :doctorId AND #status = :pending",

            ReturnValues: "ALL_NEW"

        };

        const data = await dynamoDB.update(params).promise();

        return res.status(200).json({

            success: true,

            message: "Appointment Rejected",

            appointment: data.Attributes

        });

    }

    catch (error) {

        console.log(error);

        if (error.code === "ConditionalCheckFailedException") {
            return res.status(409).json({
                success: false,
                message: "This appointment is no longer pending or is assigned to another doctor."
            });
        }

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};
exports.addDoctorNotes = async (req, res) => {

    try {

        const appointmentId = req.params.appointmentId;

        const {

            diagnosis,
            prescription,
            advice

        } = req.body;

        const params = {

            TableName: "Appointments",

            Key: {

                appointmentId: appointmentId

            },

            UpdateExpression:
            "SET diagnosis = :d, prescription = :p, advice = :a",

            ExpressionAttributeValues: {

                ":d": diagnosis,
                ":p": prescription,
                ":a": advice

            },

            ReturnValues: "ALL_NEW"

        };

        const data = await dynamoDB.update(params).promise();

        return res.status(200).json({

            success: true,

            message: "Doctor Notes Saved Successfully",

            appointment: data.Attributes

        });

    }

    catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};
