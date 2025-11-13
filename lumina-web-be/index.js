const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();


// Middleware -> needed to parse the request body which is in JSON format
app.use(express.json({ limit: "50mb" }));


// Middleware -> needed to allow request from frontend
app.use(
 cors({
   // origin: "https://polite-desert-08f77b110.4.azurestaticapps.net", // Allow requests from your frontend LOCAL TESTING
   origin: "*",
   methods: ["GET", "POST", "PUT"], // Allow GET and POST requests
   // credentials: true, // If you need to include credentials (like cookies)
 })
);


// Importing routes
const userRoute = require("./routes/user.route");
const pluginRoute = require("./routes/plugin.route");
const PORT = process.env.PORT || 3001;
app.use("/user", userRoute);
app.use("/plugin", pluginRoute);


mongoose
 .connect(process.env.MONGODB_URI)
 .then(() => {
   console.log("Connected to database");
   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });
 })
 .catch(() => {
   console.log("Connection failed");
 });





