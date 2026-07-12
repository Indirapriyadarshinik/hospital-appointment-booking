// Doctor Name

const doctorName = localStorage.getItem("doctorName");

if (doctorName) {

    document.getElementById("doctorName").textContent = doctorName;

}

// Load Appointments

loadAppointments();

async function loadAppointments() {

    try {

        const response = await fetch("http://localhost:3000/doctor/appointments");

        const result = await response.json();

        const table = document.getElementById("appointmentTable");

        table.innerHTML = "";

        result.appointments.forEach(app => {

            let badge = "";

            if (app.status === "Pending") {

                badge = `<span class="badge bg-warning text-dark">Pending</span>`;

            }

            else if (app.status === "Approved") {

                badge = `<span class="badge bg-success">Approved</span>`;

            }

            else {

                badge = `<span class="badge bg-danger">Rejected</span>`;

            }

            table.innerHTML += `

            <tr>

                <td>${app.appointmentId}</td>

                <td>${app.patientId}</td>

                <td>${app.department}</td>

                <td>${app.appointmentDate}</td>

                <td>${app.appointmentTime}</td>

                <td>${badge}</td>

                <td>

                    <button
                        class="btn btn-success btn-sm me-2"
                        onclick="approveAppointment('${app.appointmentId}')">

                        Approve

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="rejectAppointment('${app.appointmentId}')">

                        Reject

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

// Temporary Buttons

function approveAppointment(id){

    alert("Approve API will be added next.\n\nAppointment: " + id);

}

async function rejectAppointment(id) {

    try {

        const response = await fetch(

            `http://localhost:3000/doctor/reject/${id}`,

            {
                method: "PUT"
            }

        );

        const result = await response.json();

        alert(result.message);

        loadAppointments();

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}