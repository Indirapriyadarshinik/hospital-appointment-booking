// Welcome Message

const patientName = localStorage.getItem("patientName");

if (patientName) {

    document.getElementById("patientName").textContent = patientName;

}

// Doctor -> Department Mapping

const doctor = document.getElementById("doctor");
const department = document.getElementById("department");

doctor.addEventListener("change", function () {

    switch (doctor.value) {

        case "DR001":
            department.value = "Cardiology";
            break;

        case "DR002":
            department.value = "Dermatology";
            break;

        case "DR003":
            department.value = "Orthopedics";
            break;

        case "DR004":
            department.value = "Neurology";
            break;

        default:
            department.value = "";

    }

});

// Appointment Form

const form = document.getElementById("appointmentForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const appointment = {

        patientId: localStorage.getItem("patientId"),

        doctorId: doctor.value,

        department: department.value,

        appointmentDate: document.getElementById("appointmentDate").value,

        appointmentTime: document.getElementById("appointmentTime").value,

        bloodGroup: document.getElementById("bloodGroup").value,

        emergencyContact: document.getElementById("emergencyContact").value,

        symptoms: document.getElementById("symptoms").value,

        medicalHistory: document.getElementById("medicalHistory").value,

        medications: document.getElementById("medications").value,

        allergies: document.getElementById("allergies").value,

        emergencyCase: document.querySelector('input[name="emergency"]:checked').value,

        notes: document.getElementById("notes").value

    };
    console.log("Appointment Data:", appointment);
    console.log("Sending Request...");

    try {

        const response = await fetch("http://54.234.25.242:3000/patient/book-appointment", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(appointment)

        });

        const result = await response.json();

        if (result.success) {

            alert("Appointment Booked Successfully.");

            window.location.href = "appointments.html";

        }

        else {

            alert(result.message);

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

});