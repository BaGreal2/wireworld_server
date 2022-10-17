const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const schemaValidate = require("../middlewares/schemaValidate");
const authValidator = require("../validationSchemas/authValidator");

const generateAccessToken = (id, username) => {
  const payload = {
    id,
    username,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

router.post(
  "/registration",
  schemaValidate(authValidator.create),
  async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const candidate_username = await User.findOne({ username });
      const candidate_email = await User.findOne({ email });
      if (candidate_username || candidate_email) {
        return res.status(500).json({ message: "User is already registered!" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({ email, username, password: hashPassword });
      await user.save();
      res.json({
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(500).json({ message: `User ${username} not found!` });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(500).json({ message: `Wrong password!` });
    }
    const token = generateAccessToken(user._id, user.username);
    return res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.post("/users", async (req, res) => {
  try {
    res.json("No errors!");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
