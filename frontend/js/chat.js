const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;
const appointmentId = new URLSearchParams(window.location.search).get("appointmentId");
const role = localStorage.getItem("activeRole");
const userId = role === "doctor" ? localStorage.getItem("doctorId") : localStorage.getItem("patientId");
const senderName = role === "doctor" ? localStorage.getItem("doctorName") : localStorage.getItem("patientName");
const messagesElement = document.getElementById("messages");
const errorElement = document.getElementById("chatError");

document.getElementById("appointmentLabel").textContent = appointmentId ? `Appointment: ${appointmentId}` : "Appointment not selected";

if (!appointmentId || !userId || !["doctor", "patient"].includes(role)) {
    showError("Please log in and open chat from an appointment.");
    document.getElementById("messageForm").classList.add("d-none");
} else {
    loadMessages();
    setInterval(loadMessages, 5000);
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove("d-none");
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value || "";
    return div.innerHTML;
}

async function loadMessages() {
    try {
        const response = await fetch(`${API_BASE_URL}/chat/${encodeURIComponent(appointmentId)}?role=${role}&userId=${encodeURIComponent(userId)}`);
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load messages.");
        errorElement.classList.add("d-none");
        if (!result.messages.length) {
            messagesElement.innerHTML = '<p class="text-muted">No messages yet. Start the conversation.</p>';
            return;
        }
        const atBottom = messagesElement.scrollHeight - messagesElement.scrollTop - messagesElement.clientHeight < 40;
        messagesElement.innerHTML = result.messages.map((item) => {
            const mine = item.senderId === userId;
            const time = new Date(item.createdAt).toLocaleString();
            return `<div class="message ${mine ? "mine" : ""}"><strong>${escapeHtml(item.senderName)}</strong><br>${escapeHtml(item.message)}<small>${time}</small></div>`;
        }).join("");
        if (atBottom) messagesElement.scrollTop = messagesElement.scrollHeight;
    } catch (error) {
        showError(error.message);
    }
}

document.getElementById("messageForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("messageInput");
    const message = input.value.trim();
    if (!message) return;
    try {
        const response = await fetch(`${API_BASE_URL}/chat/${encodeURIComponent(appointmentId)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role, userId, senderName, message })
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to send message.");
        input.value = "";
        await loadMessages();
        messagesElement.scrollTop = messagesElement.scrollHeight;
    } catch (error) {
        showError(error.message);
    }
});

function goBack() {
    window.location.href = role === "doctor" ? "doctor/dashboard.html" : "patient/myappointments.html";
}
