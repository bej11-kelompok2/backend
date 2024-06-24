const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const userController = new UserController();
const authenticateToken = require("../middleware/authenticateToken");

router.get("/user", authenticateToken, userController.findById);
router.post("/user/register", userController.create);
router.put("/user/:id", userController.update);
router.delete("/user/:id", userController.delete);
router.post("/user/login", userController.login);
router.get("/user/verify/:id", userController.verify);
//router.post('/mail/send', userController.send);

module.exports = router;
