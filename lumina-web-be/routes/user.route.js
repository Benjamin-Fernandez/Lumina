const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

const {
  getUsers,
  createUser,
  updateUserById,
  getUserByEmail,
} = require("../controllers/user.controller");

// GET Request to find all users
router.get("/", getUsers);

// PUT Request to update user by id
router.put("/:id", updateUserById);

// POST request to create a new user
router.post("/", createUser);

// GET request to find user by email
router.get("/email/:email", getUserByEmail);

module.exports = router;
