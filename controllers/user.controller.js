const UserService = require('../usecase/user.service');
const BaseResponse = require('../util/base.response')

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  findById = async (req, res) => {
    try {
      const user = await this.userService.findById(req.params.id);
      res.json(new BaseResponse(true, 'User found', user));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }

  create = async (req, res) => {
    try {
      // if body is empty or null or undefined return error
      if (!req.body) {
        throw new Error('Body is empty');
      } else if (!req.body.username || !req.body.email || !req.body.password || !req.body.address || !req.body.phone_number || !req.body.gender) {
        throw new Error('Username, email, password, address, phone_number, gender are required');
      }
      const user = await this.userService.create(req.body);
      res.json(new BaseResponse(true, 'User created', user));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }

  login = async (req, res) => {
    try {
      const { user, token } = await this.userService.login(req.body.email, req.body.password);
      const data = { user, token }
      res.json(new BaseResponse(true, 'User logged in', data));
    }
    catch (error) {
      res.status(401).json(new BaseResponse(false, error.message, null));
    }
  }

  update = async (req, res) => {
    try {
      const user = await this.userService.update(req.params.id, req.body);
      res.json(new BaseResponse(true, 'User updated', user));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }

  delete = async (req, res) => {
    try {
      await this.userService.delete(req.params.id);
      res.json(new BaseResponse(true, 'User deleted', null));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }
}

module.exports = UserController;
