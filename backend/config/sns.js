const AWS = require("aws-sdk");

const snsConfig = { region: process.env.AWS_REGION };

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    snsConfig.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    snsConfig.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
}

const sns = new AWS.SNS(snsConfig);

module.exports = sns;
