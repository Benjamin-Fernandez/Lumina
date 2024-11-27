const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

const {
  createUser,
  getUserByEmail,
} = require("../controllers/user.controller");

// POST request to create a new user
router.post("/", createUser);

// GET request to find user by email
router.get("/email/:email", getUserByEmail);

module.exports = router;
