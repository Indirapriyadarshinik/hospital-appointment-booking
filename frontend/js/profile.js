const patientId = localStorage.getItem("patientId");

if (!patientId) {
    alert("Please login first.");
    window.location.href = "../login.html";
}

async function loadPatientProfile() {

    try {

        const response = await fetch(
            `http://54.234.25.242:3000/patient/profile/${patientId}`
        );

        const result = await response.json();

        if (!result.success) {
            alert(result.message);
            return;
        }

        const patient = result.patient;

        document.getElementById("welcomeName").innerText = patient.fullName;
        document.getElementById("profileName").innerText = patient.fullName;
        document.getElementById("patientId").innerText = patient.patientId;

        document.getElementById("fullName").value = patient.fullName || "";
        document.getElementById("email").value = patient.email || "";
        document.getElementById("phone").value = patient.phone || "";
        document.getElementById("age").value = patient.age || "";
        document.getElementById("address").value = patient.address || "";

        if (patient.gender) {
            document.getElementById("gender").value = patient.gender;
        }

    } catch (error) {

        console.log(error);
        alert("Unable to load profile.");

    }

}

loadPatientProfile();