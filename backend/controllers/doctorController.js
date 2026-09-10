const sns = require("../config/sns");
const ses = require("../config/ses");
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

        const isBcryptHash = /^\$2[aby]\$/.test(doctor.password || "");
        const isMatch = isBcryptHash
            ? await bcrypt.compare(password, doctor.password)
            : password === doctor.password;

        if (!isMatch) {

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

exports.getDoctorProfile = async (req, res) => {
    try {
        const result = await dynamoDB.get({
            TableName: "Doctors",
            Key: { doctorId: req.params.doctorId }
        }).promise();

        if (!result.Item) {
            return res.status(404).json({ success: false, message: "Doctor not found." });
        }

        const { password, ...doctor } = result.Item;
        return res.json({ success: true, doctor });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Unable to load doctor profile." });
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
        if (process.env.SNS_TOPIC_ARN || process.env.SES_FROM_EMAIL) {
            try {
                const patientData = await dynamoDB.get({
                    TableName: "Patients",
                    Key: { patientId: appointment.patientId }
                }).promise();

                if (patientData.Item) {
                    const subject = "Appointment Approved";
                    const message = `Hello ${patientData.Item.fullName},\n\nYour appointment ${appointment.appointmentId} has been approved.\nDate: ${appointment.appointmentDate}\nTime: ${appointment.appointmentTime}`;

                    if (process.env.SES_FROM_EMAIL && patientData.Item.email) {
                        await ses.sendEmail({
                            Source: process.env.SES_FROM_EMAIL,
                            Destination: { ToAddresses: [patientData.Item.email] },
                            Message: {
                                Subject: { Data: subject, Charset: "UTF-8" },
                                Body: { Text: { Data: message, Charset: "UTF-8" } }
                            }
                        }).promise();
                    }

                    if (process.env.SNS_TOPIC_ARN) {
                        await sns.publish({
                            TopicArn: process.env.SNS_TOPIC_ARN,
                            Subject: subject,
                            Message: message
                        }).promise();
                    }
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
