require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const app = express();

require("./db/conn");
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use("/menu", require("./router/menu-routes"));
app.use("/cart", require("./router/cart-routes"));
app.use("/orders",require("./router/order-routes"))
const port = process.env.PORT;

app.listen(port, () => {
  console.log("server is running");
});
