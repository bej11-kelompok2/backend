const UserService = require("../usecase/user.service");
const BaseResponse = require("../util/base.response");
const logger = require("../util/logger");
const { validationResult } = require("express-validator");
class UserController {
  constructor() {
    this.userService = new UserService();
  }

  findById = async (req, res) => {
    try {
      const user = await this.userService.findById(req.user.userId);

      if (!user) {
        logger.error("User not found");
        return res
          .status(400)
          .json(new BaseResponse(false, "User not found", null));
      }

      return res.json(new BaseResponse(true, "Success", user));
    } catch (error) {
      logger.error(error.message);
      res.status(500).json(new BaseResponse(false, error.message, null));
    }
  };

  create = async (req, res) => {
    try {
      // if body is empty or null or undefined return error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const data = await this.userService.create(req.body);
      res.json(new BaseResponse(true, "User created", data));
    } catch (error) {
      logger.error(error.message);
      res.status(400).json(new BaseResponse(false, error.message, null));
    }
  };

  login = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { user, token } = await this.userService.login(
        req.body.email,
        req.body.password
      );
      const data = { user, token };

      if (!data) {
        logger.error("login failed");
        return res
          .status(400)
          .json(new BaseResponse(false, "User not found", null));
      }

      return res.json(new BaseResponse(true, "Login success", data));
    } catch (error) {
      logger.error(error.message);
      res.status(500).json(new BaseResponse(false, error.message, null));
    }
  };

  update = async (req, res) => {
    try {
      const user = await this.userService.update(req.user.userId, req.body);
      return res.json(new BaseResponse(true, "User updated", user));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  };

  delete = async (req, res) => {
    try {
      await this.userService.delete(req.user.userId);
      return res.json(new BaseResponse(true, "User deleted", null));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  };

  verify = async (req, res) => {
    try {
      const userverify = await this.userService.verify(req.params.id);
      res.json(new BaseResponse(true, "User verified", userverify));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  };
}

module.exports = UserController;
