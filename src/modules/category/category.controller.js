const connectDB = require("../../config/db");
const { ObjectId } = require("mongodb");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db.collection("categories").insertOne({
      ...req.body,
      createdAt: new Date(),
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
exports.getCategories = async (req, res) => {
  try {
    const db = await connectDB();

    const data = await db.collection("categories").find().toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db
      .collection("categories")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteCategory = async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db.collection("categories").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
