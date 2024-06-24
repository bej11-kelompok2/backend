const { User } = require("../models");
const { UniqueConstraintError } = require("sequelize"); // Import the relevant error type

class UserRepository {
  async findById(id) {
    const data = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!data) {
      throw new Error("User not found");
    } else {
      return data;
    }
  }

  async create(user) {
    try {
      return await User.create(user, {
        attributes: { exclude: ["password"] },
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new Error("User already exists");
      } else {
        throw new Error("Error creating user");
      }
    }
  }

  async findByEmail(email) {
    return await User.findOne({
      where: { email },
    });
  }

  async update(id, userUpdates) {
    return await User.update(userUpdates, { where: { id } });
  }

  async delete(id) {
    return await User.destroy({ where: { id } });
  }

  async verify(id) {
    return data = await User.update({'isVerified': '1'}, {
      where: {
          id
      }
     })
  }
}

module.exports = UserRepository;
