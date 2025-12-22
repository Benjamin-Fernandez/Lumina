const Plugin = require("../models/plugin.model");
const crypto = require("crypto");


// Azure Blob Storage configuration
const AZURE_STORAGE_ACCOUNT = "luminawebfiles";
const AZURE_CONTAINER_NAME = "plugin-images";


/**
* Generate a unique filename for the image
*/
const generateUniqueFilename = (originalName = "image.jpg") => {
 const timestamp = Date.now();
 const randomId = crypto.randomBytes(8).toString("hex");
 const extension = originalName.includes(".")
   ? originalName.split(".").pop()
   : "jpg";
 return `plugin-${timestamp}-${randomId}.${extension}`;
};


/**
* Convert base64 data URL to Buffer
*/
const parseBase64Image = (base64DataUrl) => {
 if (base64DataUrl.startsWith("data:")) {
   const matches = base64DataUrl.match(/^data:([^;]+);base64,(.+)$/);
   if (!matches) {
     throw new Error("Invalid base64 data URL format");
   }
   return {
     contentType: matches[1],
     buffer: Buffer.from(matches[2], "base64"),
   };
 }
 return {
   contentType: "image/jpeg",
   buffer: Buffer.from(base64DataUrl, "base64"),
 };
};


// GET request to find all plugins
const getPlugin = async (req, res) => {
try {
  const plugin = await Plugin.find();
  res.status(200).json({ plugin });
} catch (error) {
  res.status(500).json({ error: error.message });
}
};




// GET request to find plugin by user email
const getPluginByEmail = async (req, res) => {
try {
  const { email } = req.params;
  const plugin = await Plugin.find({ userEmail: email });
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
   let imageURI = null; // Default to null if no image provided


   // Only attempt image upload if image is provided
   if (req.body.image) {
     const sasToken = process.env.AZURE_BLOB_SAS_TOKEN;


     if (sasToken) {
       try {
         const { buffer, contentType } = parseBase64Image(req.body.image);
         const filename = generateUniqueFilename();
         const blobUrl = `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${filename}?${sasToken}`;


         const uploadResponse = await fetch(blobUrl, {
           method: "PUT",
           headers: {
             "x-ms-blob-type": "BlockBlob",
             "Content-Type": contentType,
             "Content-Length": buffer.length.toString(),
           },
           body: buffer,
         });


         if (uploadResponse.ok) {
           imageURI = `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${filename}`;
         } else {
           console.warn("Azure Blob upload failed, creating plugin without image");
         }
       } catch (uploadError) {
         console.warn("Image upload failed, creating plugin without image:", uploadError.message);
       }
     } else {
       console.warn("AZURE_BLOB_SAS_TOKEN not set, skipping image upload");
     }
   }


   const pluginData = { ...req.body, image: imageURI };
   const plugin = await Plugin.create(pluginData);
   res.status(201).json({ plugin });
 } catch (error) {
   console.error("Error creating plugin:", error);
   res.status(500).json({ error: error.message });
 }
};




// PUT request to update plugin by id
const updatePluginById = async (req, res) => {
try {
  const { id } = req.params;
  const {
    name,
    version,
    image,
    category,
    description,
    activated,
    schema,
    endpoint,
    path,
    requestBodyQueryKey,
    requestFormat,
    requestContentType,
    responseStatusCode,
    responseFormat,
    responseBodyKey,
    authType,
    apiKey,
  } = req.body;
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
    requestBodyQueryKey,
    requestFormat,
    requestContentType,
    responseStatusCode,
    responseFormat,
    responseBodyKey,
    authType,
    apiKey,
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
getPlugin,
getPluginByEmail,
getPluginById,
createPlugin,
updatePluginById,
deletePluginById,
};


