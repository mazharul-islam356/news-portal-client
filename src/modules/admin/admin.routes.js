const express = require("express");
const { loginAdmin } = require("./admin.controller");

const router = express.Router();

router.post("/login", loginAdmin);

module.exports = router;
