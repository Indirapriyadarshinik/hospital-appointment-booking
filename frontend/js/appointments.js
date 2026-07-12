// Show Patient Name

const patientName = localStorage.getItem("patientName");

if (patientName) {
    document.getElementById("patientName").textContent = patientName;
}

// Get Patient ID

const patientId = localStorage.getItem("patientId");

// Load Appointments

async function loadAppointments() {

    try {

        const response = await fetch(`http://54.237.235.28:3000/patient/appointments/${patientId}`);

        const result = await response.json();

        const table = document.getElementById("appointmentTable");

        table.innerHTML = "";

        if (!result.success) {

            alert(result.message);

            return;

        }

        if (result.appointments.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No Appointments Found
                    </td>
                </tr>
            `;

            return;

        }

        result.appointments.forEach(app => {

            let doctorName = "";

            switch (app.doctorId) {

                case "DR001":
                    doctorName = "Dr. Rahul Sharma";
                    break;

                case "DR002":
                    doctorName = "Dr. Priya Reddy";
                    break;

                case "DR003":
                    doctorName = "Dr. Naveen Kumar";
                    break;

                case "DR004":
                    doctorName = "Dr. Arjun Kumar";
                    break;

                default:
                    doctorName = app.doctorId;

            }

            let statusBadge = "";

            if (app.status === "Pending") {

                statusBadge = `<span class="badge bg-warning text-dark">Pending</span>`;

            }

            else if (app.status === "Approved") {

                statusBadge = `<span class="badge bg-success">Approved</span>`;

            }

            else {

                statusBadge = `<span class="badge bg-danger">Rejected</span>`;

            }

            table.innerHTML += `

                <tr>

                    <td>${app.appointmentId}</td>

                    <td>${doctorName}</td>

                    <td>${app.department}</td>

                    <td>${app.appointmentDate}</td>

                    <td>${app.appointmentTime}</td>

                    
                    <td>${statusBadge}</td>

<td>

<button
class="btn btn-primary btn-sm"
onclick='viewDetails(${JSON.stringify(app)})'>

View

</button>

</td>

                </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

        alert("Unable to load appointments.");

    }

}

// Load data automatically

loadAppointments();
function viewDetails(appointment){

    localStorage.setItem(
        "selectedAppointment",
        JSON.stringify(appointment)
    );

    window.location.href = "appointmentDetails.html";

}