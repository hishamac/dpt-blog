const router = require("express").Router();

const authController = require('../controllers/auth')
const upload = require('../utils/uploadImage')

router.post("/register", [upload], authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/getUserRole", authController.getUserRole);
router.get("/getLoggedUser", authController.getLoggedUser);

module.exports = router;
