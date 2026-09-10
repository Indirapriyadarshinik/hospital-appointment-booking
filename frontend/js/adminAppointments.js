const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;
let appointments = [];

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

        appointments = result.appointments;
        body.innerHTML = appointments.length
            ? appointments.map((appointment, index) => {
                const status = appointment.status || "Pending";
                const badge = status === "Approved" ? "bg-success" : status === "Rejected" ? "bg-danger" : "bg-warning text-dark";
                return `<tr>
                    <td>${escapeHtml(appointment.appointmentId)}</td>
                    <td>${escapeHtml(appointment.patientId)}</td>
                    <td>${escapeHtml(appointment.doctorId)}</td>
                    <td>${escapeHtml(appointment.appointmentDate)}</td>
                    <td>${escapeHtml(appointment.appointmentTime)}</td>
                    <td><span class="badge ${badge}">${escapeHtml(status)}</span></td>
                    <td><button class="btn btn-info btn-sm" onclick="showAppointmentByIndex(${index})"><i class="bi bi-eye-fill"></i></button></td>
                </tr>`;
            }).join("")
            : '<tr><td colspan="7" class="text-center">No appointments found.</td></tr>';
        document.getElementById("totalAppointmentsCount").textContent = result.appointments.length;
        document.getElementById("pendingAppointmentsCount").textContent = result.appointments.filter((item) => item.status === "Pending").length;
        document.getElementById("approvedAppointmentsCount").textContent = result.appointments.filter((item) => item.status === "Approved").length;
        document.getElementById("rejectedAppointmentsCount").textContent = result.appointments.filter((item) => item.status === "Rejected").length;
    } catch (error) {
        body.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Unable to load appointments.</td></tr>';
    }
}

loadAppointments();

function showAppointmentByIndex(index) {
    const appointment = appointments[index];
    if (!appointment) return;
    const fields = [
        ["Appointment ID", appointment.appointmentId],
        ["Patient ID", appointment.patientId],
        ["Doctor ID", appointment.doctorId],
        ["Department", appointment.department],
        ["Date", appointment.appointmentDate],
        ["Time", appointment.appointmentTime],
        ["Reason", appointment.reason || appointment.symptoms],
        ["Status", appointment.status]
    ];
    document.getElementById("appointmentDetails").innerHTML = fields.map(([label, value]) =>
        `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value || "—")}</td></tr>`
    ).join("");
    new bootstrap.Modal(document.getElementById("appointmentModal")).show();
}
