const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const {
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  getUserByEmail,
} = require("../controllers/user.controller");

// GET request to find user by id
router.get("/:id", getUserById);

// GET request to find user by email
router.get("/email/:email", getUserByEmail);

// POST request to create a new user
router.post("/", createUser);

// PUT request to update user by id
router.put("/:id", updateUserById);

// DELETE request to delete user by id
router.delete("/:id", deleteUserById);

module.exports = router;
