const connectDB = require("../../config/db");
const { ObjectId } = require("mongodb");

// CREATE NEWS
const createNews = async (req, res) => {
  try {
    const db = await connectDB();

    const news = {
      ...req.body,
      featuredImage: req.file?.path || null,
      createdAt: new Date(),
      views: 0,
    };

    const result = await db.collection("news").insertOne(news);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL NEWS
const getAllNews = async (req, res) => {
  try {
    const db = await connectDB();

    const news = await db
      .collection("news")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE NEWS
const getSingleNews = async (req, res) => {
  try {
    const db = await connectDB();

    const news = await db.collection("news").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    await db
      .collection("news")
      .updateOne({ _id: news._id }, { $inc: { views: 1 } });

    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE NEWS
const updateNews = async (req, res) => {
  try {
    const db = await connectDB();

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    if (req.file) {
      updateData.featuredImage = req.file.path;
    }

    const result = await db
      .collection("news")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE NEWS
const deleteNews = async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db.collection("news").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ EXPORT (IMPORTANT)
module.exports = {
  createNews,
  getAllNews,
  getSingleNews,
  updateNews,
  deleteNews,
};
