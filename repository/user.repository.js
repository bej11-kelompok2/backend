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
      user.isVerified = false;

      const createdUser = await User.create(user, {
        attributes: { exclude: ["password"] },
      });

      return createdUser;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new Error("User already exists");
      } else {
        throw new Error(error.message);
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
    try {
      const [affectedRows] = await User.update(
        { isVerified: true },
        {
          where: { id },
        }
      );

      if (affectedRows === 0) {
        throw new Error("User not found or already verified");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UserRepository;
