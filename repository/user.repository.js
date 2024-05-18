const { User } = require('../models');
const { UniqueConstraintError } = require('sequelize'); // Import the relevant error type


class UserRepository {
  async findById(id) {
    const data = await User.findByPk(id);

    if (!data) {
      throw new Error('User not found');
    } else {
      return data;
    }
  }

  async create(user) {
    try {
      return await User.create(user);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new Error('User already exists');
      } else {
        throw new Error('Error creating user');
      }
    }
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async update(id, userUpdates) {
    return await User.update(userUpdates, { where: { id } });
  }

  async delete(id) {
    return await User.destroy({ where: { id } });
  }
}

module.exports = UserRepository;
