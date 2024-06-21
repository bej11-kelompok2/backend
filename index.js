const express = require("express");

const app = express();
const userRoutes = require("./routes/user.routes");
const sellerRoutes = require("./routes/seller.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const logger = require("./util/logger");
// const swaggerJSON = require('./swagger.json')
// const swaggerUI = require('swagger-ui-express')


require('dotenv').config();

app.use(logger)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use("/api/v1", userRoutes, sellerRoutes, cartRoutes, orderRoutes);

// app.use( '/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON))



port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Server is running on port ${port}`);
});
