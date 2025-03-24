const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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
  .connect(
    "mongodb://lumina-web:FBZAlH4Ljxo2pgaZ9s2qRYnibC2YFBhr6gfJntrPvGTBipL9ZUnxXWvkKGBFHSnY5g5ZcSgBvNwqACDbIG2Fng==@lumina-web.mongo.cosmos.azure.com:10255/lumina-web?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@lumina-web@"
  )
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });
