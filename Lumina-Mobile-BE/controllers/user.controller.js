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

// PUT request to update user by id
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      conversation,
      favourite_chatbots,
      remove_conversation,
      remove_favourite_chatbots,
    } = req.body;

    // Initialize update object
    let update = {};

    // Add to conversation array
    if (conversation) {
      update.$push = { conversation: { $each: conversation } };
    }

    // Add to favourite_chatbots array
    if (favourite_chatbots) {
      update.$push = {
        ...update.$push,
        favourite_chatbots: { $each: favourite_chatbots },
      };
    }

    // Remove from conversation array
    if (remove_conversation) {
      update.$pull = { conversation: { $in: remove_conversation } };
    }

    // Remove from favourite_chatbots array
    if (remove_favourite_chatbots) {
      update.$pull = {
        ...update.$pull,
        favourite_chatbots: { $in: remove_favourite_chatbots },
      };
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE request to delete user by id
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

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
  updateUserById,
  deleteUserById,
};
