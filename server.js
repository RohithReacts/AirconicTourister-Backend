require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const productsRoutes = require("./src/routes/productsRoutes");
const userRoutes = require("./src/routes/userRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Handle JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Malformed JSON in request body",
      error: err.message,
    });
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Airconic Tourister Backend API Running");
});

connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server Running On Port " + process.env.PORT);
});
