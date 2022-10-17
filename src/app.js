const express = require("express");
const volleyball = require("volleyball");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const { Server } = require("socket.io");

const Level = require("./routes/Level");
const authRouter = require("./routes/authRouter");

require("dotenv").config();
const app = express();
const http = require("http").createServer(app);
const io = new Server(http, {
  cors: {
    origin: "*",
  },
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(volleyball);
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use("/levels", Level);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

module.exports = http;
