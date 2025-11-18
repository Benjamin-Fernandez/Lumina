const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();




// Middleware -> needed to parse the request body which is in JSON format
app.use(express.json({ limit: "50mb" }));




// Importing routes
const userRoute = require("./routes/user.route");
const conversationRoute = require("./routes/conversation.route");
const messageRoute = require("./routes/message.route");
const openaiRoute = require("./routes/openai.route");
const chatbotRoute = require("./routes/chatbot.route");
const customRoute = require("./routes/custom.route");




/* 1. Insert routes in index.js
2. Create a new file in routes folder
3. Create a new file in controllers folder */
app.use("/user", userRoute);
app.use("/conversation", conversationRoute);
app.use("/message", messageRoute);
app.use("/openai", openaiRoute);
app.use("/chatbot", chatbotRoute);
app.use("/custom", customRoute);




const PORT = process.env.PORT || 3002;




mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("Connected to database");
  /*
  req -> request object
  res -> response object
  '/' -> root route
  Whenever we visit the root route, the callback function is executed
  res.send() sends a response to the client
  */
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);




    // ----------------------------------- Endpoints ------------- ----------------------
    // GET request to the root route
    app.get("/", (req, res) => {
      res.send("WELCOME TO LUMINA!");
    });


    // DEBUG endpoint to check environment variables
    app.get("/debug/env", (req, res) => {
      res.json({
        AZURE_OPENAI_API_BASE: process.env.AZURE_OPENAI_API_BASE ? "SET" : "UNDEFINED",
        AZURE_OPENAI_APIVERSION: process.env.AZURE_OPENAI_APIVERSION || "UNDEFINED",
        AZURE_OPENAI_APIKEY: process.env.AZURE_OPENAI_APIKEY ? `SET (length: ${process.env.AZURE_OPENAI_APIKEY.length})` : "UNDEFINED",
        MONGODB_URI: process.env.MONGODB_URI ? "SET" : "UNDEFINED",
        NODE_ENV: process.env.NODE_ENV || "UNDEFINED",
      });
    });
  });
});















