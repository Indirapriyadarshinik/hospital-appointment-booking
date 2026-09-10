const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;

function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[character]));
}

async function loadPatients() {
    const body = document.getElementById("patientsTableBody");
    try {
        const response = await fetch(`${API_BASE_URL}/admin/patients`);
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error("Unable to load patients.");
        body.innerHTML = result.patients.length
            ? result.patients.map((patient) => `<tr>
                <td>${escapeHtml(patient.patientId)}</td>
                <td>${escapeHtml(patient.fullName)}</td>
                <td>${escapeHtml(patient.email)}</td>
                <td>${escapeHtml(patient.phone)}</td>
                <td><span class="badge bg-success">Active</span></td>
            </tr>`).join("")
            : '<tr><td colspan="5" class="text-center">No patients found.</td></tr>';
    } catch (error) {
        body.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Unable to load patients.</td></tr>';
    }
}

loadPatients();
