const User = require("../models/user.model");

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ user });
    console.log("User created successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    res.status(200).json({ user });
    console.log("User found by email");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, getUserByEmail };
