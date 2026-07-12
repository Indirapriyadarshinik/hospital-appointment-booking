const dynamoDB = require("./config/aws");

const params = {
    TableName: "Patients"
};

dynamoDB.scan(params, (err, data) => {

    if (err) {

        console.log("Connection Failed");
        console.log(err);

    } else {

        console.log("✅ Connected Successfully");
        console.log(data);

    }

});