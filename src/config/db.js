const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI;

let client;
let db;

const connectDB = async () => {
  if (db) return db; // reuse connection

  client = new MongoClient(MONGO_URI);
  await client.connect();

  db = client.db("news_portal");

  console.log("MongoDB connected");

  return db;
};

// ✅ CommonJS export
module.exports = connectDB;
