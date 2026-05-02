const router = require("express").Router();
const controller = require("./category.controller");
const auth = require("../../middleware/auth");

router.post("/", auth, controller.createCategory);
router.get("/", controller.getCategories);
router.put("/:id", auth, controller.updateCategory);
router.delete("/:id", auth, controller.deleteCategory);

module.exports = router;
