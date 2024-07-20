const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const userController = new UserController();
const authenticateToken = require("../middleware/authenticateToken");
const {
  createUserValidation,
  loginUserValidation,
} = require("../middleware/user.validation");

router.get("/user", authenticateToken, userController.findById);
router.post("/user/register", createUserValidation, userController.create);
router.put("/user", authenticateToken, userController.update);
router.delete("/user", authenticateToken, userController.delete);
router.post("/user/login", loginUserValidation, userController.login);
router.get("/user/verify/:id", userController.verify);
//router.post('/mail/send', userController.send);

module.exports = router;
