const express = require("express");

const app = express();
const userRoutes = require("./routes/user.routes");
const sellerRoutes = require("./routes/seller.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const logger = require("./util/logger");
const http = require("http");
const socket = require("./util/socketio");
const server = http.createServer(app);

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use("/api/v1", userRoutes, sellerRoutes, cartRoutes, orderRoutes);

socket(server);

port = process.env.PORT || 3000;

server.listen(3000, () => {
  logger.info(`Server is running on port ${port}`);
  console.log(`Server is running on port ${port}`);
});
