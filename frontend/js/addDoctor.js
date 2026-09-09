const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;

document.getElementById("addDoctorForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const doctor = {
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        password: document.getElementById("password").value,
        department: document.getElementById("department").value,
        experience: document.getElementById("experience").value.trim(),
        qualification: document.getElementById("qualification").value.trim(),
        consultationFee: document.getElementById("consultationFee").value,
        availableDays: document.getElementById("availableDays").value,
        availableTime: document.getElementById("availableTime").value.trim(),
        address: document.getElementById("address").value.trim()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/admin/doctors`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(doctor)
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to create doctor.");

        alert(`Doctor account created. Doctor ID: ${result.doctor.doctorId}`);
        event.target.reset();
    } catch (error) {
        alert(error.message || "Unable to create doctor.");
    }
});
