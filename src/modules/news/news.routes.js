const express = require("express");
const router = express.Router();

const controller = require("./news.controller");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");

// CREATE
router.post("/", auth, upload.array("images", 5), controller.createNews);

// GET ALL
router.get("/", controller.getAllNews);

// GET SINGLE
router.get("/:id", controller.getSingleNews);

// UPDATE
router.patch("/:id", upload.array("images", 5), controller.updateNews);

// DELETE
router.delete("/:id", auth, controller.deleteNews);

module.exports = router;
