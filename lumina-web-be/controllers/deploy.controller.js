/**
* Deployment Controller
* Handles HTTP requests for plugin deployment operations
*/




const deploymentService = require("../services/deploymentService");
const Plugin = require("../models/plugin.model");




/**
* POST /api/deploy/validate
* Validate zip file structure before deployment
*/
exports.validateZip = async (req, res) => {
try {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No zip file uploaded"
    });
  }




  const result = deploymentService.validateZipStructure(req.file.buffer);




  return res.status(result.valid ? 200 : 400).json({
    success: result.valid,
    errors: result.errors,
    warnings: result.warnings,
    fileCount: result.fileCount
  });
} catch (err) {
  console.error("Validation error:", err);
  return res.status(500).json({
    success: false,
    error: "Validation failed",
    details: err.message
  });
}
};




/**
* POST /api/deploy/:pluginId
* Deploy zip file to Azure Functions for a specific plugin
* Body should include: userEmail (for authorization)
*/
exports.deployPlugin = async (req, res) => {
try {
  const { pluginId } = req.params;
  // Get userEmail from form data or query (since this is multipart)
  const userEmail = req.body.userEmail || req.query.userEmail;




  if (!userEmail) {
    return res.status(400).json({
      success: false,
      error: "userEmail is required for authorization"
    });
  }




  // Verify plugin exists and user has permission
  const plugin = await Plugin.findById(pluginId);
  if (!plugin) {
    return res.status(404).json({
      success: false,
      error: "Plugin not found"
    });
  }




  // Check authorization (plugin owner)
  if (plugin.userEmail !== userEmail) {
    return res.status(403).json({
      success: false,
      error: "Not authorized to deploy this plugin"
    });
  }




  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No zip file uploaded"
    });
  }




  // Validate zip structure first
  const validation = deploymentService.validateZipStructure(req.file.buffer);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: "Invalid zip structure",
      details: validation.errors
    });
  }




  // Generate function app name
  const functionAppName = deploymentService.generateFunctionAppName(pluginId);




  // Deploy to Azure
  const deployResult = await deploymentService.deployFunctionApp(
    functionAppName,
    req.file.buffer,
    {
      pluginId: pluginId,
      developerId: plugin.userEmail
    }
  );




  if (!deployResult.success) {
    return res.status(500).json({
      success: false,
      error: "Deployment failed",
      details: deployResult.error
    });
  }




  // Update plugin with deployment info and auto-activate
  plugin.deploymentType = "managed";
  plugin.functionAppName = functionAppName;
  plugin.endpoint = deployResult.functionUrl;
  plugin.path = "/api/http_trigger"; // Azure Functions use /api/ prefix
  plugin.activated = true; // Auto-activate after successful deployment


  // Update the schema to replace placeholder URL with actual Function App URL
  if (plugin.schema) {
    // Replace placeholder URL with actual Function App URL
    if (plugin.schema.includes("placeholder.azurewebsites.net")) {
      plugin.schema = plugin.schema.replace(
        /https:\/\/placeholder\.azurewebsites\.net/g,
        deployResult.functionUrl
      );
    }
    // Ensure the schema path matches the actual Azure Functions path
    // Azure Functions use /api/ prefix, so update any /http_trigger to /api/http_trigger
    if (plugin.schema.includes("/http_trigger:") && !plugin.schema.includes("/api/http_trigger:")) {
      plugin.schema = plugin.schema.replace(
        /\/http_trigger:/g,
        "/api/http_trigger:"
      );
    }
  }


  await plugin.save();




  return res.status(200).json({
    success: true,
    message: "Deployment successful",
    functionAppName: functionAppName,
    functionUrl: deployResult.functionUrl,
    warnings: validation.warnings
  });




} catch (err) {
  console.error("Deployment error:", err);
  return res.status(500).json({
    success: false,
    error: "Deployment failed",
    details: err.message
  });
}
};




/**
* GET /api/deploy/:pluginId/status
* Get deployment status for a plugin
*/
exports.getDeploymentStatus = async (req, res) => {
try {
  const { pluginId } = req.params;




  const plugin = await Plugin.findById(pluginId);
  if (!plugin) {
    return res.status(404).json({
      success: false,
      error: "Plugin not found"
    });
  }




  if (plugin.deploymentType !== "managed" || !plugin.functionAppName) {
    return res.status(200).json({
      success: true,
      deploymentType: plugin.deploymentType || "external",
      managed: false
    });
  }




  const status = await deploymentService.getDeploymentStatus(plugin.functionAppName);




  return res.status(200).json({
    success: true,
    deploymentType: "managed",
    managed: true,
    functionAppName: plugin.functionAppName,
    ...status
  });




} catch (err) {
  console.error("Status check error:", err);
  return res.status(500).json({
    success: false,
    error: "Failed to get deployment status",
    details: err.message
  });
}
};












/**
* DELETE /api/deploy/:pluginId
* Delete a deployed function app and reset plugin to external mode
* Query param: userEmail (for authorization)
*/
exports.deleteDeployment = async (req, res) => {
try {
  const { pluginId } = req.params;
  const userEmail = req.query.userEmail || req.body?.userEmail;




  if (!userEmail) {
    return res.status(400).json({
      success: false,
      error: "userEmail is required for authorization"
    });
  }




  const plugin = await Plugin.findById(pluginId);
  if (!plugin) {
    return res.status(404).json({
      success: false,
      error: "Plugin not found"
    });
  }




  // Check authorization
  if (plugin.userEmail !== userEmail) {
    return res.status(403).json({
      success: false,
      error: "Not authorized to delete this deployment"
    });
  }




  if (plugin.deploymentType !== "managed" || !plugin.functionAppName) {
    return res.status(400).json({
      success: false,
      error: "Plugin is not using managed deployment"
    });
  }




  // Delete from Azure
  const deleteResult = await deploymentService.deleteFunctionApp(plugin.functionAppName);




  if (!deleteResult.success) {
    return res.status(500).json({
      success: false,
      error: "Failed to delete Azure function",
      details: deleteResult.error
    });
  }




  // Reset plugin to external mode
  plugin.deploymentType = "external";
  plugin.functionAppName = undefined;
  plugin.endpoint = "";
  await plugin.save();




  return res.status(200).json({
    success: true,
    message: "Deployment deleted successfully"
  });




} catch (err) {
  console.error("Delete deployment error:", err);
  return res.status(500).json({
    success: false,
    error: "Failed to delete deployment",
    details: err.message
  });
}
};










