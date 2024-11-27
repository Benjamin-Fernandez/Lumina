const Plugin = require("../models/plugin.model");

// GET request to find plugin by user email
const getPluginByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const plugin = await Plugin.findOne({ email });
    res.status(200).json({ plugin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET request to find plugin by id
const getPluginById = async (req, res) => {
  try {
    const { id } = req.params;
    const plugin = await Plugin.findById(id);
    res.status(200).json({ plugin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST request to create a new plugin
const createPlugin = async (req, res) => {
  try {
    const plugin = await Plugin.create(req.body);
    res.status(200).json({ plugin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT request to update plugin by id
const updatePluginById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, version, author, email } = req.body;
    const update = {
      name,
      version,
      image,
      category,
      description,
      activated,
      schema,
      endpoint,
      path,
      httpMethod,
      parametersRequired,
      parameters,
      requestBodyRequired,
      requestBodySchema,
      requestFormat,
      requestContentType,
      responseStatusCode,
      responseContentType,
      responseSchema,
    };

    const plugin = await Plugin.findByIdAndUpdate(id, update, { new: true });

    if (!plugin) {
      return res.status(404).json({ message: "Plugin not found" });
    }

    res.status(200).json({ plugin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE request to delete plugin by id
const deletePluginById = async (req, res) => {
  try {
    const { id } = req.params;
    const plugin = await Plugin.findByIdAndDelete(id);

    if (!plugin) {
      return res.status(404).json({ message: "Plugin not found" });
    }

    res.status(200).json({ message: "Plugin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPluginByEmail,
  getPluginById,
  createPlugin,
  updatePluginById,
  deletePluginById,
};
