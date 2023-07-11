var router = require("express").Router();
const upload = require("../utils/uploadImage");
const authorServices = require("../services/author");
const { adminAuth } = require("../middleware/auth");

router.get("/", authorServices.findAll);
router.get("/:id", authorServices.findAuthor);
router.get("/:id/posts", authorServices.findAuthorPosts);
router.post("/", [adminAuth, upload], authorServices.create);
router.put("/:id", [adminAuth, upload], authorServices.update);
router.delete("/:id", [adminAuth, upload], authorServices.delete);

module.exports = router;
