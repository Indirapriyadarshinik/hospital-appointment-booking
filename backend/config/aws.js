const AWS = require("aws-sdk");
require("dotenv").config();

const awsConfig = { region: process.env.AWS_REGION };

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    awsConfig.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    awsConfig.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
}

AWS.config.update(awsConfig);

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDB;
