const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;
const doctorId = localStorage.getItem("doctorId");

if (!doctorId) {
    window.location.href = "../login.html";
} else {
    loadDoctorProfile();
}

function setText(id, value, fallback = "Not specified") {
    document.getElementById(id).textContent = value || fallback;
}

async function loadDoctorProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/doctor/profile/${encodeURIComponent(doctorId)}`);
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load profile.");

        const doctor = result.doctor;
        setText("doctorTopName", doctor.fullName);
        setText("doctorFullName", doctor.fullName);
        setText("doctorDepartment", doctor.department);
        setText("doctorEmail", doctor.email);
        setText("doctorPhone", doctor.phone);
        setText("doctorQualification", doctor.qualification);
        setText("doctorExperience", doctor.experience);
        setText("doctorAddress", doctor.address);
    } catch (error) {
        console.error(error);
        alert("Unable to load doctor profile.");
    }
}
