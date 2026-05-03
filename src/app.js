const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const adminRoutes = require("./modules/admin/admin.routes");
const newsRoutes = require("./modules/news/news.routes");
const categoryRoutes = require("./modules/category/category.routes");
const upload = require("./middleware/upload"); // ✅ FIXED (no destructuring)

const app = express();

// =======================
// SECURITY MIDDLEWARE
// =======================
app.use(helmet());

// =======================
// CORE MIDDLEWARE
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// CORS CONFIG
// =======================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// =======================
// ROUTES
// =======================
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/news", newsRoutes);

// =======================
// IMAGE UPLOAD ROUTE
// =======================
app.post("/api/upload-images", upload.array("images"), async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path);

    res.status(200).json({
      success: true,
      images: imageUrls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// HEALTH CHECK ROUTE
// =======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully!",
  });
});

// =======================
// GLOBAL ERROR HANDLER (optional but good practice)
// =======================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

module.exports = app;
