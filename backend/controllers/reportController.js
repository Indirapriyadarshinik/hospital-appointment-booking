const dynamoDB = require("../config/aws");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const s3 = require("../config/s3");

exports.uploadReport = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please select a file."
            });

        }

        const {

            patientId,
            appointmentId

        } = req.body;

        if (!patientId || !appointmentId) {

            return res.status(400).json({
                success: false,
                message: "patientId and appointmentId are required."
            });

        }

        const fileName = Date.now() + "-" + req.file.originalname;

        const command = new PutObjectCommand({

            Bucket: process.env.S3_BUCKET_NAME,

            Key: "reports/" + fileName,

            Body: req.file.buffer,

            ContentType: req.file.mimetype

        });

        await s3.send(command);

        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/reports/${fileName}`;

        const report = {

            reportId: "REP-" + uuidv4().substring(0,8).toUpperCase(),

            patientId,

            appointmentId,

            fileName,

            fileUrl,

            uploadedAt: new Date().toISOString()

        };

        await dynamoDB.put({

            TableName: "Reports",

            Item: report

        }).promise();

        return res.status(201).json({

            success: true,

            message: "Report Uploaded Successfully",

            report

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
exports.getPatientReports = async (req, res) => {

    try {

        const { patientId } = req.params;

        const params = {

            TableName: "Reports",

            FilterExpression: "patientId = :pid",

            ExpressionAttributeValues: {

                ":pid": patientId

            }

        };

        const result = await dynamoDB.scan(params).promise();

        return res.status(200).json({

            success: true,

            reports: result.Items

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};