const router = require("express").Router();
const authController = require("../controllers/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/allLengths", authController.allLengths);
module.exports = router;
