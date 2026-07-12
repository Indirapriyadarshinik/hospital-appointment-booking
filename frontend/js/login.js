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

        apiUrl = "http://localhost:3000/patient/login";

    }

    else if (role === "Doctor") {

        alert("Doctor Login API is not completed yet.");

        return;

    }

    else if (role === "Admin") {

        alert("Admin Login API is not completed yet.");

        return;

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

        if (result.success) {

            alert("Login Successful");

            localStorage.setItem("patientId", result.patientId);

            localStorage.setItem("patientName", result.fullName);

            window.location.href = "patient/dashboard.html";

        }

        else {

            alert(result.message);

        }

    }

    catch (error) {

        console.error(error);

        alert("Server Error");

    }

});