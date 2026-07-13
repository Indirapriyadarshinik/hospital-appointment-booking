const API_BASE_URL = "http://54.234.25.242:3000";

function setStatus(id, text, isHealthy) {
    const element = document.getElementById(id);
    element.textContent = text;
    element.className = isHealthy ? "text-success" : "text-danger";
}

function formatTime(value) {
    if (!value) return "Not available";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
}

async function loadAdminDashboard() {
    const activityTable = document.getElementById("recentActivities");

    try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to load dashboard.");
        }

        const { stats, recentAppointments } = result;
        document.getElementById("totalPatients").textContent = stats.totalPatients;
        document.getElementById("totalDoctors").textContent = stats.totalDoctors;
        document.getElementById("todaysAppointments").textContent = stats.todaysAppointments;
        document.getElementById("pendingAppointments").textContent = stats.pendingAppointments;

        const notificationItems = document.querySelector(".bi-bell-fill").closest(".card").querySelectorAll("p");
        notificationItems[0].textContent = `• ${stats.pendingAppointments} Pending Appointments`;
        notificationItems[1].textContent = `• ${stats.todaysAppointments} Appointments Today`;
        notificationItems[2].textContent = `• ${stats.totalPatients} Total Registered Patients`;

        if (recentAppointments.length === 0) {
            activityTable.innerHTML = '<tr><td colspan="3">No recent appointments found.</td></tr>';
        } else {
            activityTable.innerHTML = recentAppointments.map((appointment) => `
                <tr>
                    <td>Appointment ${appointment.status || "Updated"}</td>
                    <td>${appointment.patientId || "Patient"}</td>
                    <td>${formatTime(appointment.createdAt)}</td>
                </tr>
            `).join("");
        }

        setStatus("serverStatus", "Online", true);
        setStatus("databaseStatus", "Connected", true);
        setStatus("awsStatus", "Connected", true);
    } catch (error) {
        console.error(error);
        activityTable.innerHTML = '<tr><td colspan="3">Unable to load recent activity.</td></tr>';
        setStatus("serverStatus", "Unavailable", false);
        setStatus("databaseStatus", "Unavailable", false);
        setStatus("awsStatus", "Unavailable", false);
    }
}

loadAdminDashboard();
