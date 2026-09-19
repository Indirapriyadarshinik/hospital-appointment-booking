const express = require("express");
const { getMessages, sendMessage, getUnreadMessages } = require("../controllers/chatController");

const router = express.Router();

router.get("/unread/list", getUnreadMessages);
router.get("/:appointmentId", getMessages);
router.post("/:appointmentId", sendMessage);

module.exports = router;
