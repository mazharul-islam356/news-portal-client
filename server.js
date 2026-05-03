const app = require("./src/app");
const connectDB = require("./src/config/db"); // ✅ FIXED

require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB Connection failed:", err);
  });
