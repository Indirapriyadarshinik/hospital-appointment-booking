const appointment = JSON.parse(localStorage.getItem("selectedAppointment"));

if (!appointment) {

    alert("No Appointment Selected");

    window.location.href = "appointments.html";

}

let doctorName = "";

switch (appointment.doctorId) {

    case "DR001":
        doctorName = "Dr. Rahul Sharma";
        break;

    case "DR002":
        doctorName = "Dr. Priya Reddy";
        break;

    case "DR003":
        doctorName = "Dr. Naveen Kumar";
        break;

    case "DR004":
        doctorName = "Dr. Arjun Kumar";
        break;

    default:
        doctorName = appointment.doctorId;

}

document.getElementById("appointmentId").textContent =
appointment.appointmentId;

document.getElementById("doctor").textContent =
doctorName;

document.getElementById("department").textContent =
appointment.department;

document.getElementById("status").textContent =
appointment.status;

document.getElementById("diagnosis").textContent =
appointment.diagnosis || "Not Available";

document.getElementById("prescription").textContent =
appointment.prescription || "Not Available";

document.getElementById("advice").textContent =
appointment.advice || "Not Available";