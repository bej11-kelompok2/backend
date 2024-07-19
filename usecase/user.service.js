const UserRepository = require("../repository/user.repository");
const bcrypt = require("bcrypt");
const {
  generateToken,
  verifyToken,
  generateVerifyToken,
} = require("../util/jwt.config");
const { sendEmail } = require("../util/mail");

class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async findById(id) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async create(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await this.userRepo.create(user);

    let token = generateVerifyToken(newUser.id);

    const BASEURL = process.env.BASEURL;

    let mail = {
      from: "bej11platinum2@gmail.com",
      to: user.email,
      subject: "Pendaftaran Akun di BingleShop!",
      html: `Hi, ${user.username}, terima kasih telah mendaftar di Bingle Shop!. <br /><br /> Sebelum memulai berbelanja, silahkan klik link berikut untuk menyelesaikan pendaftaran Anda. <br /><br /> <a href="${BASEURL}/api/v1/user/verify/${token}">Link Daftar</a>`,
    };

    const sendResult = sendEmail(mail);

    return;
  }

  async update(id, userUpdates) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await this.userRepo.update(id, userUpdates);

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return updatedUser;
  }

  async delete(id) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const deletedUser = await this.userRepo.delete(id);

    if (!deletedUser) {
      throw new Error("Failed to delete user");
    }

    return deletedUser;
  }

  async login(email, password) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = generateToken(user.id, user.role);
    return { token };
  }

  async verify(id) {
    const token = verifyToken(id);

    const verify = await this.userRepo.verify(token);

    return verify;
  }
}

module.exports = UserService;
