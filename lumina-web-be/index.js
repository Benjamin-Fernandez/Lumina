const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT"] }));

// Routes
app.get("/", (_, res) => res.send("API up"));
app.get("/health", (_, res) => res.status(200).send("OK"));
app.use("/user", require("./routes/user.route"));
app.use("/plugin", require("./routes/plugin.route"));

// Port binding for Azure
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`HTTP listening on ${port}`);
});

// Connect to Cosmos (Mongo API) in the background; don't crash app if it fails
const uri = process.env.MONGODB_URI;
(async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // fail fast if blocked
    });
    console.log("DB connected");
  } catch (err) {
    console.error("DB connect failed:", err.message);
  }
})();
