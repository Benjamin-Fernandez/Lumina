const User = require("../models/user.model");

// GET request to user route with id parameter
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET request to find user by email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST request to create a new user
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT request to update user by email
const updateUserByEmail = async (req, res) => {
  try {
    console.log(req.params);
    const { email } = req.params;
    const { favourite_chatbot, remove_favourite_chatbot } = req.body;

    // Initialize update object
    let update = {};

    // Add to favourite_chatbots array
    if (favourite_chatbot) {
      update.$push = {
        ...update.$push,
        favourite_chatbot: { $each: favourite_chatbot },
      };
    }

    // Remove from favourite_chatbots array
    if (remove_favourite_chatbot) {
      update.$pull = {
        ...update.$pull,
        favourite_chatbot: { $in: remove_favourite_chatbot },
      };
    }

    const user = await User.findOneAndUpdate(email, update, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE request to delete user by email
const deleteUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOneAndDelete(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUserByEmail,
  deleteUserByEmail,
};
