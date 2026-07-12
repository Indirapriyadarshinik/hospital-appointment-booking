const patientId = localStorage.getItem("patientId");

if (!patientId) {

    alert("Please Login First");

    window.location.href = "login.html";

}

async function loadReports() {

    try {

        const response = await fetch(

            `http://54.234.25.242:3000/report/patient/${patientId}`

        );

        const data = await response.json();

        const table = document.getElementById("reportTable");

        table.innerHTML = "";

        if (data.reports.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="3" class="text-center">

                        No Reports Found

                    </td>

                </tr>

            `;

            return;

        }

        data.reports.forEach(report => {

            table.innerHTML += `

                <tr>

                    <td>${report.fileName}</td>

                    <td>${new Date(report.uploadedAt).toLocaleDateString()}</td>

                    <td>

                        <a
                            href="${report.fileUrl}"
                            target="_blank"
                            class="btn btn-success btn-sm">

                            <i class="bi bi-download"></i>

                            Download

                        </a>

                    </td>

                </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

        alert("Unable to Load Reports");

    }

}

loadReports();