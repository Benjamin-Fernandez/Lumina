const express = require("express");
const router = express.Router();
const Plugin = require("../models/plugin.model");

const {
  getPluginByEmail,
  getPluginById,
  createPlugin,
  updatePluginById,
  deletePluginById,
} = require("../controllers/plugin.controller");

// GET request to find plugin by user email
router.get("/email/:email", getPluginByEmail);

// GET request to find plugin by id
router.get("/:id", getPluginById);

// POST request to create a new plugin
router.post("/", createPlugin);

// PUT request to update plugin by id
router.put("/:id", updatePluginById);

// DELETE request to delete plugin by id
router.delete("/:id", deletePluginById);

module.exports = router;
