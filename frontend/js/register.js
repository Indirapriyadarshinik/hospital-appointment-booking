const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const patientData = {

        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        password: document.getElementById("password").value,
        gender: document.getElementById("gender").value,
        age: Number(document.getElementById("age").value)

    };

    try {

        const response = await fetch("http://54.237.235.28:3000/patient/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(patientData)

        });

        const result = await response.json();

        if (result.success) {

            alert("✅ Registration Successful!");

            window.location.href = "login.html";

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("❌ Server Error!");

    }

});