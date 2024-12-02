const mongoose = require("mongoose");
const PluginSchema = mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: [true, "Please provide an email"],
    },
    userName: {
      type: String,
      required: [true, "Please provide a username"],
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    version: {
      type: String,
      required: [true, "Please provide a version"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    activated: {
      type: Boolean,
      required: [true, "Please provide an activation status"],
    },
    schema: {
      type: String,
      required: [true, "Please provide a schema"],
    },
    endpoint: {
      type: String,
      required: [true, "Please provide an endpoint"],
    },
    path: {
      type: String,
      required: [true, "Please provide a path"],
    },
    requestBodyQueryKey: {
      type: String,
      required: false,
    },
    requestFormat: {
      type: String,
      required: false,
    },
    requestContentType: {
      type: String,
      required: false,
    },
    responseStatusCode: {
      type: String,
      required: [true, "Please provide a response status code"],
    },
    responseFormat: {
      type: String,
      required: [true, "Please provide a response content type"],
    },
    responseBodyKey: {
      type: String,
      required: [true, "Please provide a response schema"],
    },
  },
  {
    timestamps: true,
  }
);

const Plugin = mongoose.model("Plugin", PluginSchema);
module.exports = Plugin;
