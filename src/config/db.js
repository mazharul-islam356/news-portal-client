const { MongoClient } = require("mongodb");

// Use .env for Mongo URI in production
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://showpex2024_db_user:gzZlmeMCHO8fq8Pf@cluster0.pnavans.mongodb.net/?appName=Cluster0";

const client = new MongoClient(MONGO_URI);

console.log("ENV MONGO_URI:", process.env.MONGO_URI);
console.log(
  "NEWS CONTROLLER:",
  require("../modules/category/category.controller"),
);
const connectDB = async () => {
  try {
    await client.connect();
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

const db = client.db("news_portal");

module.exports = { connectDB, db };
