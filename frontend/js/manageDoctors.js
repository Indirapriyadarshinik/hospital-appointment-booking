const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;

function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[character]));
}

async function loadDoctors() {
    const body = document.getElementById("doctorsTableBody");
    try {
        const response = await fetch(`${API_BASE_URL}/admin/doctors`);
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error("Unable to load doctors.");
        body.innerHTML = result.doctors.length
            ? result.doctors.map((doctor) => `<tr>
                <td>${escapeHtml(doctor.doctorId)}</td>
                <td>${escapeHtml(doctor.fullName)}</td>
                <td>${escapeHtml(doctor.department)}</td>
                <td>${escapeHtml(doctor.experience || "—")}</td>
                <td><span class="badge bg-success">Available</span></td>
                <td><a class="btn btn-primary btn-sm" href="add-doctor.html">Add Doctor</a></td>
            </tr>`).join("")
            : '<tr><td colspan="6" class="text-center">No doctors found.</td></tr>';
    } catch (error) {
        body.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Unable to load doctors.</td></tr>';
    }
}

loadDoctors();
