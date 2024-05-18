const express = require("express");
require('dotenv').config();
const app = express();
const userRoutes = require("./routes/user.routes");
const sellerRoutes = require("./routes/seller.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use("/api/v1", userRoutes, sellerRoutes, cartRoutes, orderRoutes);

port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Server is running on port ${port}`);
});
