const User = require("../models/user.model");

// GET Request to find all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
    console.log("Users found successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT Request to update user by id
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, domain } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, email, domain });
    res.status(200).json({ user });
    console.log("User updated successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    console.log("User found by email: ", user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, updateUserById, createUser, getUserByEmail };
