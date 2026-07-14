const API_BASE_URL = "http://localhost:3000";
const doctorId = localStorage.getItem("doctorId");
const doctorName = localStorage.getItem("doctorName");

if (!doctorId) {
    alert("Please log in as a doctor.");
    window.location.href = "../login.html";
} else {
    document.getElementById("doctorName").textContent = doctorName || "Doctor";
    loadAppointments();
}

async function loadAppointments() {
    const table = document.getElementById("appointmentTable");
    table.innerHTML = '<tr><td colspan="7">Loading appointments...</td></tr>';

    try {
        const response = await fetch(`${API_BASE_URL}/doctor/appointments?doctorId=${encodeURIComponent(doctorId)}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to load appointments.");
        }

        if (result.appointments.length === 0) {
            table.innerHTML = '<tr><td colspan="7">No appointments found.</td></tr>';
            return;
        }

        table.innerHTML = result.appointments.map((app) => {
            const badgeClass = app.status === "Pending"
                ? "bg-warning text-dark"
                : app.status === "Approved" ? "bg-success" : "bg-danger";
            const actions = app.status === "Pending"
                ? `<button class="btn btn-success btn-sm me-2" onclick="updateAppointmentStatus('${app.appointmentId}', 'approve')">Accept</button>
                   <button class="btn btn-danger btn-sm" onclick="updateAppointmentStatus('${app.appointmentId}', 'reject')">Reject</button>`
                : "—";

            return `<tr>
                <td>${app.appointmentId}</td>
                <td>${app.patientId}</td>
                <td>${app.department || "—"}</td>
                <td>${app.appointmentDate}</td>
                <td>${app.appointmentTime}</td>
                <td><span class="badge ${badgeClass}">${app.status}</span></td>
                <td>${actions}</td>
            </tr>`;
        }).join("");
    } catch (error) {
        console.error(error);
        table.innerHTML = '<tr><td colspan="7">Unable to load appointments.</td></tr>';
    }
}

async function updateAppointmentStatus(appointmentId, action) {
    const actionLabel = action === "approve" ? "accept" : "reject";
    if (!confirm(`Do you want to ${actionLabel} this appointment?`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/doctor/${action}/${appointmentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ doctorId })
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to update appointment.");
        }

        alert(result.message);
        loadAppointments();
    } catch (error) {
        console.error(error);
        alert(error.message || "Unable to update appointment.");
    }
}
