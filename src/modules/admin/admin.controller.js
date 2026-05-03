const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env.local" });

const ADMIN_PHONE = process.env.ADMIN_PHONE;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const loginAdmin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log("ENV PHONE:", ADMIN_PHONE);
    console.log("ENV PASSWORD:", ADMIN_PASSWORD);
    console.log("INPUT:", phone, password);

    if (phone !== ADMIN_PHONE || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ role: "admin", phone }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginAdmin };
