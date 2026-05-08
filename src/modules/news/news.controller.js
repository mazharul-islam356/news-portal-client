const connectDB = require("../../config/db");
const { ObjectId } = require("mongodb");

// CREATE NEWS
const createNews = async (req, res) => {
  try {
    const db = await connectDB();

    if (!req.body.title_bn || !req.body.content_bn) {
      return res.status(400).json({
        message: "title_bn and content_bn required",
      });
    }

    if (!req.body.category_bn || !req.body.category_en) {
      return res.status(400).json({
        message: "Category required!",
      });
    }

    // status
    const status = req.body.status || "draft";

    // publishedAt logic
    let publishedAt = null;

    if (status === "published") {
      publishedAt = new Date(); // publish now
    }

    if (status === "scheduled" && req.body.publishedAt) {
      const parsed = new Date(req.body.publishedAt);
      if (!isNaN(parsed)) {
        publishedAt = parsed;
      }
    }
    const toFlag = (val) => {
      const num = Number(val);
      return num === 1 ? 1 : 0;
    };

    const images = req.files?.map((file) => file.path) || [];

    const news = {
      title: {
        bn: req.body.title_bn,
        en: req.body.title_en || "",
      },

      // summary: {
      //   bn: req.body.summary_bn || "",
      //   en: req.body.summary_en || "",
      // },

      content: {
        bn: req.body.content_bn,
        en: req.body.content_en || "",
      },

      writer: {
        bn: req.body.writer_bn,
        en: req.body.writer_en || "",
      },

      category: {
        bn: req.body.category_bn,
        en: req.body.category_en || "",
      },

      tags: req.body.tags ? req.body.tags.split(",").map((t) => t.trim()) : [],

      featuredImage: images,

      views: 0,

      // ✅ FLAGS (0/1 system)
      isBreakingTop: toFlag(req.body.isBreakingTop),
      isLatest: toFlag(req.body.isLatest),
      isBreaking: toFlag(req.body.isBreaking),
      isTrending: toFlag(req.body.isTrending),
      isFeatured: toFlag(req.body.isFeatured),

      status,
      publishedAt,

      createdAt: new Date(),
      updatedAt: null,

      author: req.admin || null,
    };

    const result = await db.collection("news").insertOne(news);

    return res.status(201).json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("CREATE NEWS ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

const getNewsByFlag = (flag) => async (req, res) => {
  try {
    const db = await connectDB();

    const news = await db
      .collection("news")
      .find({
        [flag]: 1,
        status: "published",
      })
      .sort({ publishedAt: -1 })
      .toArray();

    res.json(news);
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

// news details
const getNewsById = async (req, res) => {
  try {
    const db = await connectDB();

    const { id } = req.params;

    const news = await db.collection("news").findOne({
      _id: new ObjectId(id),
    });

    if (!news) {
      return res.status(404).json({
        message: "News not found",
      });
    }

    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
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

// category wise news
const getNewsByCategory = async (req, res) => {
  try {
    const db = await connectDB();

    const { category, lang = "en" } = req.query;

    if (!category) {
      return res.status(400).json({
        message: "category is required",
      });
    }

    const categoryField = `category.${lang}`;

    const news = await db
      .collection("news")
      .find({
        [categoryField]: {
          $regex: `^${category}$`,
          $options: "i", // case-insensitive
        },
        status: "published",
      })
      .sort({ publishedAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      total: news.length,
      data: news,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// UPDATE NEWS
const updateNews = async (req, res) => {
  try {
    const db = await connectDB();

    const {
      title_bn,
      title_en,
      content_bn,
      content_en,
      writer_bn,
      writer_en,
      category_bn,
      category_en,
      tags,
      status,
      publishedAt,
      existingImages,
    } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    // Helper function to convert to 0/1
    const toFlag = (val) => {
      const num = Number(val);
      return num === 1 ? 1 : 0;
    };

    // Update title
    if (title_bn || title_en) {
      updateData.title = {
        bn: title_bn || "",
        en: title_en || "",
      };
    }

    // Update content
    if (content_bn || content_en) {
      updateData.content = {
        bn: content_bn || "",
        en: content_en || "",
      };
    }

    // Update writer
    if (writer_bn || writer_en) {
      updateData.writer = {
        bn: writer_bn || "",
        en: writer_en || "",
      };
    }

    // Update category
    if (category_bn || category_en) {
      updateData.category = {
        bn: category_bn || "",
        en: category_en || "",
      };
    }

    // Update tags
    if (tags) {
      updateData.tags = tags.split(",").map((t) => t.trim());
    }

    // Update flags
    if (req.body.isBreakingTop !== undefined) {
      updateData.isBreakingTop = toFlag(req.body.isBreakingTop);
    }
    if (req.body.isLatest !== undefined) {
      updateData.isLatest = toFlag(req.body.isLatest);
    }
    if (req.body.isBreaking !== undefined) {
      updateData.isBreaking = toFlag(req.body.isBreaking);
    }
    if (req.body.isTrending !== undefined) {
      updateData.isTrending = toFlag(req.body.isTrending);
    }
    if (req.body.isFeatured !== undefined) {
      updateData.isFeatured = toFlag(req.body.isFeatured);
    }

    // Update status and publishedAt
    if (status) {
      updateData.status = status;

      if (status === "published") {
        updateData.publishedAt = new Date();
      } else if (status === "scheduled" && publishedAt) {
        const parsed = new Date(publishedAt);
        if (!isNaN(parsed)) {
          updateData.publishedAt = parsed;
        }
      } else if (status === "draft") {
        updateData.publishedAt = null;
      }
    }

    // Handle images (combine existing + new)
    let allImages = [];

    // Keep existing images
    if (existingImages) {
      if (Array.isArray(existingImages)) {
        allImages.push(...existingImages);
      } else if (typeof existingImages === "string") {
        allImages.push(existingImages);
      }
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map((file) => file.path);
      allImages.push(...newImagePaths);
    }

    // Update featuredImage array
    if (allImages.length > 0) {
      updateData.featuredImage = allImages;
    } else if (allImages.length === 0 && existingImages === undefined) {
      // If no images at all (existing removed and no new added)
      updateData.featuredImage = [];
    }

    const result = await db
      .collection("news")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      result,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
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
  getNewsByFlag,
  getSingleNews,
  updateNews,
  getNewsByCategory,
  deleteNews,
  getNewsById,
};
