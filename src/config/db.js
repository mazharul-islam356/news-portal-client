const { MongoClient } = require("mongodb");

// Use .env for Mongo URI in production
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://showpex2024_db_user:Rjq4MI7dDoXY1Tis@customecommerce.lqmhvtg.mongodb.net/?appName=customecommerce";

const client = new MongoClient(MONGO_URI);

console.log("ENV MONGO_URI:", process.env.MONGO_URI);

const connectDB = async () => {
  try {
    await client.connect();
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

const db = client.db("rufaida_elegance");

module.exports = { connectDB, db };
