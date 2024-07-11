const UserService = require("./user.service");
const UserRepository = require("../repository/user.repository");
const bcrypt = require("bcrypt");
const {
  generateToken,
  verifyToken,
  generateVerifyToken,
} = require("../util/jwt.config");
const { sendEmail } = require("../util/mail");

jest.mock("../repository/user.repository");
jest.mock("bcrypt");
jest.mock("../util/jwt.config");
jest.mock("../util/mail");

describe("UserService", () => {
  let userService;

  beforeEach(() => {
    UserRepository.mockClear();
    userService = new UserService();
  });

  describe("findById", () => {
    it("should find user by id", async () => {
      userService.userRepo.findById.mockResolvedValue({
        id: 1,
        name: "User",
      });

      const user = await userService.findById(1);
      expect(user).toEqual({ id: 1, name: "User" });
    });

    it("should throw error if user not found", async () => {
      userService.userRepo.findById.mockResolvedValue(null);

      await expect(userService.findById(1)).rejects.toThrow("User not found");
    });
  });

  describe("update", () => {
    it("should update user", async () => {
      userService.userRepo.findById.mockResolvedValue({
        id: 1,
        name: "User",
      });

      userService.userRepo.update.mockResolvedValue({
        id: 1,
        name: "Updated User",
      });

      const updatedUser = await userService.update(1, {
        name: "Updated User",
      });
      expect(updatedUser).toEqual({ id: 1, name: "Updated User" });
    });

    it("should throw error if user not found", async () => {
      userService.userRepo.findById.mockResolvedValue(null);

      await expect(
        userService.update(1, { name: "Updated User" })
      ).rejects.toThrow("User not found");
    });
  });

  describe("delete", () => {
    it("should delete user", async () => {
      userService.userRepo.findById.mockResolvedValue({
        id: 1,
        name: "User",
      });

      userService.userRepo.delete.mockResolvedValue({
        id: 1,
        name: "Deleted User",
      });

      const deletedUser = await userService.delete(1);
      expect(deletedUser).toEqual({ id: 1, name: "Deleted User" });
    });

    it("should throw error if user not found", async () => {
      userService.userRepo.findById.mockResolvedValue(null);

      await expect(userService.delete(1)).rejects.toThrow("User not found");
    });
  });

  describe("login", () => {
    it("should login user with valid credentials", async () => {
      const user = {
        id: 1,
        email: "user@example.com",
        password: "hashedPassword",
        role: "user",
      };

      userService.userRepo.findByEmail = jest.fn().mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue("authToken");

      const result = await userService.login("user@example.com", "password");
      expect(result).toEqual({ token: "authToken", user });
    });

    it("should throw error if user not found", async () => {
      userService.userRepo.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(
        userService.login("user@example.com", "password")
      ).rejects.toThrow("User not found");
    });

    it("should throw error if password is invalid", async () => {
      const user = {
        id: 1,
        email: "user@example.com",
        password: "hashedPassword",
        role: "user",
      };

      userService.userRepo.findByEmail = jest.fn().mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        userService.login("user@example.com", "password")
      ).rejects.toThrow("Invalid password");
    });
  });

  describe("verify", () => {
    it("should verify user", async () => {
      verifyToken.mockReturnValue({ id: 1 });
      userService.userRepo.verify.mockResolvedValue(true);

      const result = await userService.verify("verifyToken");
      expect(result).toEqual(true);
    });

    it("should throw error if token is invalid", async () => {
      verifyToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(userService.verify("invalidToken")).rejects.toThrow(
        "Invalid token"
      );
    });
  });

  describe("create", () => {
    it("should create a new user and send verification email", async () => {
      const user = {
        username: "User",
        email: "user@example.com",
        password: "password",
      };
      const newUser = { ...user, id: 1 };

      bcrypt.hash.mockResolvedValue("hashedPassword");
      userService.userRepo.create.mockResolvedValue(newUser);
      generateVerifyToken.mockReturnValue("verifyToken");
      sendEmail.mockResolvedValue(true);

      const token = await userService.create(user);
      expect(token).toEqual("verifyToken");
      expect(sendEmail).toHaveBeenCalledWith({
        from: "bej11platinum2@gmail.com",
        to: user.email,
        subject: "Pendaftaran Akun di BEJ Platinum",
        text: expect.stringContaining("Hi, User"),
      });
    });
  });
});
