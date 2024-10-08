const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const {
  getUserById,
  createUser,
  updateUserByEmail,
  deleteUserByEmail,
  getUserByEmail,
} = require("../controllers/user.controller");

// GET request to find user by id
router.get("/:id", getUserById);

// GET request to find user by email
router.get("/email/:email", getUserByEmail);

// POST request to create a new user
router.post("/", createUser);

// PUT request to update user by email
router.put("/email/:email", updateUserByEmail);

// DELETE request to delete user by id
router.delete("/email/:email", deleteUserByEmail);

module.exports = router;
