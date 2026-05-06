const express = require("express");
const router = express.Router();

const controller = require("./news.controller");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");

// CREATE
router.post("/", auth, upload.array("images", 5), controller.createNews);

// GET ALL
router.get("/", controller.getAllNews);
router.get("/breaking-news", controller.getNewsByFlag("isBreaking"));
router.get("/trending-news", controller.getNewsByFlag("isTrending"));
router.get("/featured-news", controller.getNewsByFlag("isFeatured"));
router.get("/latest-news", controller.getNewsByFlag("isLatest"));
router.get("/breaking-top-news", controller.getNewsByFlag("isBreakingTop"));

// GET SINGLE
router.get("/:id", controller.getSingleNews);

// UPDATE
router.patch("/:id", upload.array("images", 5), controller.updateNews);

// DELETE
router.delete("/:id", auth, controller.deleteNews);

module.exports = router;
