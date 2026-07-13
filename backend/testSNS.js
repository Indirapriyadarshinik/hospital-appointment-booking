require("dotenv").config();

const sns = require("./config/sns");

async function testSNS() {

    try {

        const result = await sns.publish({

            TopicArn: process.env.SNS_TOPIC_ARN,

            Subject: "SNS Test",

            Message: "Hospital Appointment System SNS is working successfully."

        }).promise();

        console.log(result);

    } catch (err) {

        console.log(err);

    }

}

testSNS();