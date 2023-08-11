var router = require("express").Router();
const { adminAuth } = require("../middleware/auth");
const tagServices = require("../services/tag");

router.get("/", tagServices.findAll);
router.post("/", [adminAuth], tagServices.create);
router.delete("/:id", [adminAuth], tagServices.delete);
router.put("/:id", [adminAuth], tagServices.update);
router.get("/:id", [adminAuth], tagServices.findTag);

module.exports = router;
