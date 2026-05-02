const express = require("express");
const router = express.Router();

const controller = require("./news.controller");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");

// CREATE
router.post("/", auth, upload.single("image"), controller.createNews);

// GET ALL
router.get("/", controller.getAllNews);

// GET SINGLE
router.get("/:id", controller.getSingleNews);

// UPDATE
router.put("/:id", auth, upload.single("image"), controller.updateNews);

// DELETE
router.delete("/:id", auth, controller.deleteNews);

module.exports = router;
