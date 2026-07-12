const patientId = localStorage.getItem("patientId");

if (!patientId) {
    window.location.href = "../login.html";
}

async function loadDashboard() {

    try {

        // Patient Profile
        const profileRes = await fetch(`http://54.234.25.242:3000/patient/profile/${patientId}`);
        const profileData = await profileRes.json();

        if (profileData.success) {

            document.getElementById("patientName").textContent =
                profileData.patient.fullName;

            document.getElementById("welcomeName").textContent =
                profileData.patient.fullName;

        }

        // Appointments

        const appointmentRes = await fetch(`http://54.234.25.242:3000/patient/appointments/${patientId}`);

        const appointmentData = await appointmentRes.json();

        if (appointmentData.success) {

            const appointments = appointmentData.appointments;

            document.getElementById("totalAppointments").textContent =
                appointments.length;

            document.getElementById("upcomingAppointments").textContent =
                appointments.filter(a => a.status === "Pending").length;

            document.getElementById("completedAppointments").textContent =
                appointments.filter(a => a.status === "Completed").length;

        }

    }

    catch (error) {

        console.log(error);

    }

}

loadDashboard();