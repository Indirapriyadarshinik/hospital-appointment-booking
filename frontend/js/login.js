const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password || !role) {
        alert("Please fill all fields.");
        return;
    }

    let apiUrl = "";

    if (role === "Patient") {
        apiUrl = "http://54.237.235.28:3000/patient/login";
    }
    else if (role === "Doctor") {
        apiUrl = "http://54.237.235.28:3000/doctor/login";
    }
    else if (role === "Admin") {
        apiUrl = "http://54.237.235.28:3000/admin/login";
    }

    try {

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const result = await response.json();

        if (!result.success) {
            alert(result.message);
            return;
        }

        alert("Login Successful");

        if (role === "Patient") {

            localStorage.setItem("patientId", result.patientId);
            localStorage.setItem("patientName", result.fullName);

            window.location.href = "patient/dashboard.html";

        }
        else if (role === "Doctor") {

            localStorage.setItem("doctorId", result.doctorId);
            localStorage.setItem("doctorName", result.fullName);
            localStorage.setItem("department", result.department);

            window.location.href = "doctor/dashboard.html";

        }
        else if (role === "Admin") {

            window.location.href = "admin/dashboard.html";

        }

    }
    catch (error) {

        console.error(error);
        alert("Server Error");

    }

});