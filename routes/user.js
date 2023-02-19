const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // IF THE FIELDS ARE NOT FILLED IN *************************\\
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing parameter" });
    }

    const emailAlreadyExists = await User.findOne({ email });

    // IF THE E-MAIL ENTERED ALREADY EXISTS******************\\
    if (emailAlreadyExists) {
      return res.status(409).json({ message: "This e-mail already exists" });
    }

    const salt = uid2(16);
    const hash = SHA256(salt + password).toString(encBase64);
    const token = uid2(64);

    const newUser = new User({
      email,
      username,
      token: token,
      hash: hash,
      salt: salt,
    });

    await newUser.save();

    const clientRes = {
      _id: newUser._id,
      email: newUser.email,
      token: newUser.token,
      username: newUser.username,
    };

    res.json(clientRes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newHash = SHA256(user.salt + password).toString(encBase64);

    if (newHash === user.hash) {
      res.json({
        message: "Log in successfull, welcome.",
        _id: user._id,
        token: user.token,
        username: user.username,
      });
    } else {
      res.status(400).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
