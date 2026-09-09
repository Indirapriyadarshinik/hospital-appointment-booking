const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;
const patientId = localStorage.getItem("patientId");

if (!patientId) {
    window.location.href = "../login.html";
}

async function loadDashboard() {

    try {

        // Patient Profile
        const profileRes = await fetch(`${API_BASE_URL}/patient/profile/${patientId}`);
        const profileData = await profileRes.json();

        if (profileData.success) {

            document.getElementById("patientName").textContent =
                profileData.patient.fullName;

            document.getElementById("welcomeName").textContent =
                profileData.patient.fullName;

        }

        // Appointments

        const appointmentRes = await fetch(`${API_BASE_URL}/patient/appointments/${patientId}`);

        const appointmentData = await appointmentRes.json();

        if (appointmentData.success) {

            const appointments = appointmentData.appointments;

            document.getElementById("totalAppointments").textContent =
                appointments.length;

            document.getElementById("upcomingAppointments").textContent =
                appointments.filter(a => a.status === "Pending").length;

            document.getElementById("completedAppointments").textContent =
                appointments.filter(a => a.status === "Completed").length;

        }

    }

    catch (error) {

        console.log(error);

    }

}

loadDashboard();

function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[character]));
}

async function loadDashboardDoctors() {
    const list = document.getElementById("dashboardDoctorList");
    if (!list) return;
    try {
        const response = await fetch(`${API_BASE_URL}/admin/doctors`);
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error("Unable to load doctors.");
        if (result.doctors.length === 0) {
            list.innerHTML = '<div class="col-12 text-muted">No doctors have been added yet.</div>';
            return;
        }
        list.innerHTML = result.doctors.slice(0, 3).map((doctor) => `
            <div class="col-md-4"><div class="border rounded-3 p-3 h-100">
                <h5 class="mb-1">${escapeHtml(doctor.fullName)}</h5>
                <p class="text-muted mb-2">${escapeHtml(doctor.department)}</p>
                <small>${escapeHtml(doctor.experience || "Experience not specified")}</small>
                <a href="book-appointment.html" class="btn btn-primary btn-sm d-block mt-3">Book Appointment</a>
            </div></div>`).join("");
    } catch (error) {
        console.error(error);
        list.innerHTML = '<div class="col-12 text-danger">Unable to load doctors.</div>';
    }
}

loadDashboardDoctors();
