const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;
const patientId = localStorage.getItem("patientId");

if (!patientId) {
    alert("Please log in to book an appointment.");
    window.location.href = "../login.html";
} else {
    loadPatientProfile();
    loadDoctors();
}

const doctor = document.getElementById("doctor");
const department = document.getElementById("department");
const departmentByDoctor = {};

doctor.addEventListener("change", () => {
    department.value = departmentByDoctor[doctor.value] || "";
});

document.getElementById("appointmentDate").min = new Date().toISOString().split("T")[0];

async function loadDoctors() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/doctors`);
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error("Unable to load doctors.");

        doctor.innerHTML = '<option value="">Select Doctor</option>';
        result.doctors.forEach((item) => {
            departmentByDoctor[item.doctorId] = item.department;
            const option = document.createElement("option");
            option.value = item.doctorId;
            option.textContent = `${item.fullName} (${item.department})`;
            doctor.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert("Unable to load doctors. Please try again later.");
    }
}

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
