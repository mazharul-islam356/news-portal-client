const express = require("express");
const cors = require("cors");
require("dotenv").config();

const adminRoutes = require("./modules/admin/admin.routes");
const newsRoutes = require("./modules/news/news.routes");
const categoryRoutes = require("./modules/category/category.routes");

const { upload } = require("./middleware/upload");

const app = express();
const helmet = require("helmet");
app.use(helmet());
// middleware
app.use(express.json());

// CORS config
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

if (process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Ignore specific extension errors
    if (
      typeof args[0] === "string" &&
      args[0].includes("Composite:ERROR") &&
      args[0].includes("Extension context invalidated")
    ) {
      return; // do nothing
    }
    // For all other errors, log normally
    originalConsoleError(...args);
  };
}
// routes

app.use("/api/admin", adminRoutes);

app.use("/api/news", newsRoutes);
app.use("/api/category", categoryRoutes);

app.post("/api/upload-images", upload.array("images"), async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path);
    res.json({ success: true, images: imageUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/", (req, res) => {
  console.log("Root route accessed");
  res.status(200).json({
    success: true,
    message: "Server is running successfully!",
  });
});

module.exports = app;
