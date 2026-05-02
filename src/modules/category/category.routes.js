const express = require("express");
const router = express.Router();

const controller = require("./category.controller");
const auth = require("../../middleware/auth");

// CREATE
router.post("/", auth, controller.createCategory);

// GET ALL
router.get("/", controller.getCategories);

// UPDATE
router.put("/:id", auth, controller.updateCategory);

// DELETE
router.delete("/:id", auth, controller.deleteCategory);

module.exports = router;
