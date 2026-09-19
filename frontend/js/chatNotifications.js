const CHAT_API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;
const chatRole = localStorage.getItem("activeRole");
const chatUserId = chatRole === "doctor" ? localStorage.getItem("doctorId") : localStorage.getItem("patientId");
let previousUnreadCount = 0;

if (["doctor", "patient"].includes(chatRole) && chatUserId) {
    addChatAlertButton();
    checkChatAlerts();
    setInterval(checkChatAlerts, 10000);
}

function addChatAlertButton() {
    const button = document.createElement("button");
    button.id = "chatAlertButton";
    button.type = "button";
    button.className = "btn btn-success position-fixed bottom-0 end-0 m-4 shadow";
    button.innerHTML = 'Chat alerts <span id="chatUnreadCount" class="badge text-bg-danger ms-1 d-none">0</span>';
    button.addEventListener("click", async () => {
        if ("Notification" in window && Notification.permission === "default") await Notification.requestPermission();
        if (button.dataset.appointmentId) window.location.href = `../chat.html?appointmentId=${encodeURIComponent(button.dataset.appointmentId)}`;
        else alert("No unread chat messages.");
    });
    document.body.appendChild(button);
}

async function checkChatAlerts() {
    try {
        const response = await fetch(`${CHAT_API_BASE_URL}/chat/unread/list?role=${chatRole}&userId=${encodeURIComponent(chatUserId)}`);
        const result = await response.json();
        if (!response.ok || !result.success) return;
        const messages = result.messages || [];
        const button = document.getElementById("chatAlertButton");
        const count = document.getElementById("chatUnreadCount");
        count.textContent = messages.length;
        count.classList.toggle("d-none", messages.length === 0);
        button.dataset.appointmentId = messages[0]?.appointmentId || "";
        if (messages.length > previousUnreadCount && "Notification" in window && Notification.permission === "granted") {
            const newest = messages[messages.length - 1];
            new Notification(`New message from ${newest.senderName}`, { body: newest.message.slice(0, 120) });
        }
        previousUnreadCount = messages.length;
    } catch (error) {
        console.warn("Unable to check chat alerts", error);
    }
}
