const connectDB = require("../../config/db");
const { ObjectId } = require("mongodb");

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db.collection("categories").insertOne({
      ...req.body,
      createdAt: new Date(),
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
const getCategories = async (req, res) => {
  try {
    const db = await connectDB();

    const data = await db.collection("categories").find().toArray();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const updateCategory = async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db
      .collection("categories")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
const deleteCategory = async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db.collection("categories").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ EXPORT
module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
