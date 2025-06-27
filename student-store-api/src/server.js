// importing needed things
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderItemRoutes = require("./routes/orderItemRoutes");

const corsOption = {
  origin: "http://localhost:5173",
};

// Middleware, using what is needed
app.use(express.json());
app.use(cors(corsOption));
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/order-items", orderItemRoutes);

// route for the root path,. the default "/"
app.get("/", (req, res) => {
  res.send("Loading Student Store App...");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
