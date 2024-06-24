const UserRepository = require("../repository/user.repository");
const bcrypt = require("bcrypt");
const { generateToken } = require("../util/jwt.config");
const { sendEmail } = require('../util/mail');

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
    
    //send email
    let user = await this.userRepo.findByEmail(user.email);
    
    let mail = {
        from: 'bej11platinum2@gmail.com',
        to: user.email,
        subject: 'Pendaftaran Akun di BEJ Platinum',
        text: 'Hi, ' + user.username + '. \n\r Silakan klik link berikut untuk menyelesaikan pendaftaran Anda. \n\r <a href="http://localhost:3000/api/v1/mail/verify/' + user.id+'">Link Daftar</a>'
    }
    const sendResult = sendEmail(mail);


    return {newUser, sendResult};
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
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = generateToken(user.id, user.role);
    return { token, user };
  }

  async verify(id) {
    return await this.userRepo.verify(id);
  }
}

module.exports = UserService;
