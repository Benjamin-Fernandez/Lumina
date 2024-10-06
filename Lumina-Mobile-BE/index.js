const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Importing models
const User = require("./models/user.model");

// Middleware -> needed to parse the request body which is in JSON format
app.use(express.json());

mongoose
  .connect(
    "mongodb://lumina-mobile:7DQyl8h3mD1xnMEPb6K9KCInYZh7rYMcEOfGqHBAHpCD7qGCFTDwE4zdfLEXUAMGHRX3asMN4eAWACDbLr22kg%3D%3D@lumina-mobile.mongo.cosmos.azure.com:10255/lumina-mobile?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@lumina-mobile@"
  )
  .then(() => {
    console.log("Connected to database");
    /*
    req -> request object
    res -> response object
    '/' -> root route
    Whenever we visit the root route, the callback function is executed
    res.send() sends a response to the client 
    */
    app.listen(3000, () => {
      console.log("Server running on port 3000");

      // ----------------------------------- Endpoints ------------- ----------------------
      // GET request to the root route
      app.get("/", (req, res) => {
        res.send("Hello World!");
      });

      // POST request to user route
      app.post("/api/user", async (req, res) => {
        try {
          const user = await User.create(req.body);
          res.status(200).json({ user });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
    });
  });
