const API_BASE_URL = "http://54.234.25.242:3000";
const patientId = localStorage.getItem("patientId");

if (!patientId) {
    alert("Please log in to book an appointment.");
    window.location.href = "../login.html";
} else {
    loadPatientProfile();
}

const doctor = document.getElementById("doctor");
const department = document.getElementById("department");
const departmentByDoctor = {
    DR001: "Cardiology",
    DR002: "Dermatology",
    DR003: "Orthopedic",
    DR004: "Neurology",
    DR005: "Pediatrics",
    DR006: "Gynecology"
};

doctor.addEventListener("change", () => {
    department.value = departmentByDoctor[doctor.value] || "";
});

document.getElementById("appointmentDate").min = new Date().toISOString().split("T")[0];

async function loadPatientProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/patient/profile/${patientId}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to load patient profile.");
        }

        const patient = result.patient;
        document.getElementById("patientName").textContent = patient.fullName;
        document.getElementById("patientFullName").value = patient.fullName;
        document.getElementById("patientEmail").value = patient.email;
        localStorage.setItem("patientName", patient.fullName);
    } catch (error) {
        console.error(error);
        alert("Unable to load your profile. Please log in again.");
        localStorage.removeItem("patientId");
        localStorage.removeItem("patientName");
        window.location.href = "../login.html";
    }
}

document.getElementById("appointmentForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!document.getElementById("terms").checked) {
        alert("Please confirm that the information is correct.");
        return;
    }

    const appointment = {
        patientId,
        doctorId: doctor.value,
        department: department.value,
        appointmentDate: document.getElementById("appointmentDate").value,
        appointmentTime: document.getElementById("appointmentTime").value,
        symptoms: document.getElementById("symptoms").value.trim(),
        notes: document.getElementById("notes").value.trim(),
        reason: document.getElementById("reason").value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/patient/book-appointment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(appointment)
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to book appointment.");
        }

        alert("Appointment booked successfully.");
        window.location.href = "myappointments.html";
    } catch (error) {
        console.error(error);
        alert(error.message || "Unable to book appointment. Please try again.");
    }
});
