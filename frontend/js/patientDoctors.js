const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;

function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[character]));
}

async function loadDoctors() {
    const list = document.getElementById("doctorList");
    try {
        const response = await fetch(`${API_BASE_URL}/admin/doctors`);
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error("Unable to load doctors.");

        if (result.doctors.length === 0) {
            list.innerHTML = '<div class="col-12"><div class="alert alert-info">No doctors are available yet. Please check again later.</div></div>';
            return;
        }

        list.innerHTML = result.doctors.map((doctor) => `
            <div class="col-lg-4">
                <div class="card doctor-card p-4 text-center h-100">
                    <i class="bi bi-person-circle doctor-img"></i>
                    <h4 class="mt-3">${escapeHtml(doctor.fullName)}</h4>
                    <p class="text-muted">${escapeHtml(doctor.department)}</p>
                    <div class="rating mb-2">★★★★★</div>
                    <span class="badge bg-success mb-3">Available</span>
                    <p>${escapeHtml(doctor.experience || "Experience not specified")}</p>
                    <a href="book-appointment.html" class="btn btn-primary">Book Appointment</a>
                </div>
            </div>
        `).join("");

        const statistics = document.querySelectorAll(".row.mt-5 h3");
        if (statistics[0]) statistics[0].textContent = result.doctors.length;
        const patientName = localStorage.getItem("patientName");
        if (patientName) document.querySelector(".topbar div:last-child").innerHTML = `<i class="bi bi-person-circle"></i> Welcome, ${escapeHtml(patientName)}`;
    } catch (error) {
        console.error(error);
        list.innerHTML = '<div class="col-12"><div class="alert alert-danger">Unable to load doctors. Please try again later.</div></div>';
    }
}

loadDoctors();
