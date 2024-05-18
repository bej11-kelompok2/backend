const UserRepository = require('../repository/user.repository');
const bcrypt = require('bcrypt');
const { generateToken } = require('../util/jwt.config');

class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async findById(id) {
    return await this.userRepo.findById(id);
  }

  async create(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await this.userRepo.create(user);
    return newUser;
  }

  async login(email, password) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Password is incorrect');
    }
    return user;
  }

  async update(id, userUpdates) {
    return await this.userRepo.update(id, userUpdates);
  }

  async delete(id) {
    return await this.userRepo.delete(id);
  }

  async login(email, password) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Password is incorrect');
    }

    const token = generateToken(user.id);
    return { token, user };
  }
}

module.exports = UserService;
