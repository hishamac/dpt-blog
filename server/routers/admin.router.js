const router = require("express").Router();
const authController = require("../controllers/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/getRole", authController.getRole);
router.get("/getLoggedAdmin", authController.getLoggedAdmin);

module.exports = router;
