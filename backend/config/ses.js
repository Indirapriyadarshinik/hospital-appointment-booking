const AWS = require("aws-sdk");

const sesConfig = { region: process.env.AWS_REGION };

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    sesConfig.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    sesConfig.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
}

module.exports = new AWS.SES(sesConfig);
