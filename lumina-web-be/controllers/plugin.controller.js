const Plugin = require("../models/plugin.model");


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
   const uploadImage = await fetch(
     "https://luminawebfiles.blob.core.windows.net/plugin-images?sp=racwd&st=2025-02-05T07:24:42Z&se=2025-06-30T15:24:42Z&spr=https&sv=2022-11-02&sr=c&sig=EAT5lIS7iH2KkdB7YN6q9Lsb6w4w%2Bl9OYqdsO3ZZEy8%3D",
     {
       method: "PUT",
       headers: {
         "x-ms-blob-type": "BlockBlob",
         "Content-Type": "image/jpeg",
       },
       body: req.body.image,
     }
   );
   if (!uploadImage.ok) {
     throw new Error("Failed to upload image");
   }
   const imageURI = `https://luminawebfiles.blob.core.windows.net/plugin-images/${req.body.imageFileName}`;
   req.body.image = imageURI;
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





