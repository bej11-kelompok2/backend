const express = require("express");

require('dotenv').config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Server is running on port ${port}`);
});
