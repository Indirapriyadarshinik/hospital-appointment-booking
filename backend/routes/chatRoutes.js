const express = require("express");
const { getMessages, sendMessage } = require("../controllers/chatController");

const router = express.Router();

router.get("/:appointmentId", getMessages);
router.post("/:appointmentId", sendMessage);

module.exports = router;
