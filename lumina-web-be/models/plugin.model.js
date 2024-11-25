const mongoose = require("mongoose");
const PluginSchema = mongoose.Schema({
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
    type: Buffer,
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
  httpMethod: {
    type: String,
    required: [true, "Please provide an HTTP Method"],
  },
  parametersRequired: {
    type: Boolean,
    required: true,
  },
  parameters: {
    type: String,
    required: false,
  },
  requestBodyRequired: {
    type: Boolean,
    required: true,
  },
  requestBodySchema: {
    type: String,
    required: false,
  },
  requestFormat: {
    type: String,
    required: [true, "Please provide a request format"],
  },
  requestContentType: {
    type: String,
    required: [true, "Please provide a request content type"],
  },
  responseStatusCode: {
    type: String,
    required: [true, "Please provide a response status code"],
  },
  responseContentType: {
    type: String,
    required: [true, "Please provide a response content type"],
  },
  responseSchema: {
    type: String,
    required: [true, "Please provide a response schema"],
  },
});

const Plugin = mongoose.model("Plugin", PluginSchema);
module.exports = Plugin;
