const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

const socket = (app) => {
  const io = socketIo(app);

  const socketToken = (socket, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers["authorization"];
    if (!token) {
      return next(new Error("Authentication error"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }

      socket.user = decoded;
      next();
    });
  };

  io.use(socketToken);

  io.on("connection", (socket) => {
    console.log("User connected", socket.user.userId);

    socket.on("joinRoom", ({ userId, sellerId }) => {
      if (socket.user.role == "seller") {
        sellerId = socket.user.userId;
      } else if (socket.user.role == "user") {
        userId = socket.user.userId;
      }

      const room = `${userId}_${sellerId}`;
      console.log(socket.user.userId, socket.user.role);

      if (!socket.rooms.has(room)) {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      }
    });

    socket.on("sendMessage", ({ userId, sellerId, message }) => {
      if (socket.user.role == "seller") {
        sellerId = socket.user.userId;
      } else if (socket.user.role == "user") {
        userId = socket.user.userId;
      }

      const room = `${userId}_${sellerId}`;
      console.log(`Message received: ${message}`);
      send = socket.broadcast.to(room).emit("message", message);
      console.log(send);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.user.userId);
    });
  });
};

module.exports = socket;
