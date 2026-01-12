/**
* Deployment Routes
* Handles file upload and routing for plugin deployment
*/


const express = require("express");
const router = express.Router();
const multer = require("multer");
const deployController = require("../controllers/deploy.controller");


// Configure multer for zip file uploads
// Using memory storage for direct buffer access
const storage = multer.memoryStorage();


const upload = multer({
 storage: storage,
 limits: {
   fileSize: 50 * 1024 * 1024, // 50MB max file size
 },
 fileFilter: (req, file, cb) => {
   // Accept only zip files
   if (
     file.mimetype === "application/zip" ||
     file.mimetype === "application/x-zip-compressed" ||
     file.originalname.endsWith(".zip")
   ) {
     cb(null, true);
   } else {
     cb(new Error("Only .zip files are allowed"), false);
   }
 },
});


// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
 if (err instanceof multer.MulterError) {
   if (err.code === "LIMIT_FILE_SIZE") {
     return res.status(400).json({
       success: false,
       error: "File too large. Maximum size is 50MB.",
     });
   }
   return res.status(400).json({
     success: false,
     error: `Upload error: ${err.message}`,
   });
 } else if (err) {
   return res.status(400).json({
     success: false,
     error: err.message,
   });
 }
 next();
};


/**
* POST /api/deploy/validate
* Validate zip file structure without deploying
*/
router.post(
 "/validate",
 upload.single("file"),
 handleMulterError,
 deployController.validateZip
);


/**
* POST /api/deploy/:pluginId
* Deploy zip file to Azure Functions
*/
router.post(
 "/:pluginId",
 upload.single("file"),
 handleMulterError,
 deployController.deployPlugin
);


/**
* GET /api/deploy/:pluginId/status
* Get deployment status for a plugin
*/
router.get("/:pluginId/status", deployController.getDeploymentStatus);


/**
* DELETE /api/deploy/:pluginId
* Delete deployed function app
*/
router.delete("/:pluginId", deployController.deleteDeployment);


module.exports = router;







