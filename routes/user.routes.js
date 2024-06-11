const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const userController = new UserController();

router.get('/user/:id', userController.findById);
router.post('/user/register', userController.create);
router.put('/user/:id', userController.update);
router.delete('/user/:id', userController.delete);
router.post('/user/login', userController.login);

module.exports = router;
