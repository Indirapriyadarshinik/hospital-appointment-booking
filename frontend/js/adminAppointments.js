const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;

function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[character]));
}

async function loadAppointments() {
    const body = document.getElementById("appointmentsTableBody");
    try {
        const response = await fetch(`${API_BASE_URL}/admin/appointments`);
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error("Unable to load appointments.");

        body.innerHTML = result.appointments.length
            ? result.appointments.map((appointment) => {
                const status = appointment.status || "Pending";
                const badge = status === "Approved" ? "bg-success" : status === "Rejected" ? "bg-danger" : "bg-warning text-dark";
                return `<tr>
                    <td>${escapeHtml(appointment.appointmentId)}</td>
                    <td>${escapeHtml(appointment.patientId)}</td>
                    <td>${escapeHtml(appointment.doctorId)}</td>
                    <td>${escapeHtml(appointment.appointmentDate)}</td>
                    <td>${escapeHtml(appointment.appointmentTime)}</td>
                    <td><span class="badge ${badge}">${escapeHtml(status)}</span></td>
                    <td>—</td>
                </tr>`;
            }).join("")
            : '<tr><td colspan="7" class="text-center">No appointments found.</td></tr>';
    } catch (error) {
        body.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Unable to load appointments.</td></tr>';
    }
}

loadAppointments();
