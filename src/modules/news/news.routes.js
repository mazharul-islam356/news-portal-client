const router = require("express").Router();
const controller = require("./news.controller");
const auth = require("../../middleware/auth");
const { upload } = require("../../middleware/upload");

router.post("/", auth, upload.single("image"), controller.createNews);
router.get("/", controller.getAllNews);
router.get("/:id", controller.getSingleNews);
router.put("/:id", auth, upload.single("image"), controller.updateNews);
router.delete("/:id", auth, controller.deleteNews);

module.exports = router;
