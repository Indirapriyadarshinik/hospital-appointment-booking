const { v4: uuidv4 } = require("uuid");
const dynamoDB = require("../config/aws");

const APPOINTMENTS_TABLE = "Appointments";
const MESSAGES_TABLE = "ChatMessages";

async function getVerifiedAppointment(appointmentId, role, userId) {
    if (!appointmentId || !role || !userId) {
        const error = new Error("appointmentId, role and userId are required.");
        error.statusCode = 400;
        throw error;
    }

    const result = await dynamoDB.get({
        TableName: APPOINTMENTS_TABLE,
        Key: { appointmentId }
    }).promise();

    const appointment = result.Item;
    const isPatient = role === "patient" && appointment && appointment.patientId === userId;
    const isDoctor = role === "doctor" && appointment && appointment.doctorId === userId;
    if (!isPatient && !isDoctor) {
        const error = new Error("You are not allowed to access this conversation.");
        error.statusCode = 403;
        throw error;
    }
    return appointment;
}

exports.getMessages = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { role, userId } = req.query;
        await getVerifiedAppointment(appointmentId, role, userId);

        const data = await dynamoDB.query({
            TableName: MESSAGES_TABLE,
            KeyConditionExpression: "appointmentId = :appointmentId",
            ExpressionAttributeValues: { ":appointmentId": appointmentId },
            ScanIndexForward: true
        }).promise();

        return res.json({ success: true, messages: data.Items || [] });
    } catch (error) {
        console.error("Get chat messages error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.code === "ResourceNotFoundException"
                ? "ChatMessages table is not configured yet."
                : error.message || "Unable to load messages."
        });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { role, userId, senderName, message } = req.body;
        await getVerifiedAppointment(appointmentId, role, userId);

        const text = String(message || "").trim();
        if (!text) return res.status(400).json({ success: false, message: "Message cannot be empty." });
        if (text.length > 1000) return res.status(400).json({ success: false, message: "Message is too long." });

        const chatMessage = {
            appointmentId,
            createdAt: new Date().toISOString(),
            messageId: uuidv4(),
            senderId: userId,
            senderRole: role,
            senderName: String(senderName || role).slice(0, 100),
            message: text
        };
        await dynamoDB.put({ TableName: MESSAGES_TABLE, Item: chatMessage }).promise();
        return res.status(201).json({ success: true, message: chatMessage });
    } catch (error) {
        console.error("Send chat message error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.code === "ResourceNotFoundException"
                ? "ChatMessages table is not configured yet."
                : error.message || "Unable to send message."
        });
    }
};
