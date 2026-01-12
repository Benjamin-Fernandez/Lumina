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
    required: false,
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
    required: false, // Optional for managed deployments (set after deployment)
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
  authType: {
    type: String,
    required: false,
  },
  apiKey: {
    type: String,
    required: false,
  },
  // NEW: Deployment automation fields
  deploymentType: {
    type: String,
    enum: ['external', 'managed'],
    default: 'external',
    required: false,
  },
  functionAppName: {
    type: String,
    required: false,
  },
},
{
  timestamps: true,
}
);




const Plugin = mongoose.model("Plugin", PluginSchema);
module.exports = Plugin;















