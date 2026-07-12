const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/adminController");

router.post("/login", loginAdmin);

router.get("/", (req, res) => {
    res.send("Admin Route Working");
});

module.exports = router;