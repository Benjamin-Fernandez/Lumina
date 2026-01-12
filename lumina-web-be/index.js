// index.js
require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const morgan = require("morgan"); // optional request logging


const app = express();


/* ---------- Middleware ---------- */
app.use(express.json({ limit: "50mb" }));
app.use(
 cors({
   origin: process.env.FRONTEND_ORIGIN || "*",
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
 })
);
// app.use(morgan("dev")); // optional


/* ---------- Basic routes ---------- */
app.get("/", (_, res) => res.send("API up"));
app.get("/health", (_, res) => {
 // 1 = connected, 2 = connecting
 const connected = mongoose.connection.readyState === 1;
 res.status(connected ? 200 : 503).send(connected ? "OK" : "DB not connected");
});


/* ---------- Feature routes ---------- */
app.use("/user", require("./routes/user.route"));
app.use("/plugin", require("./routes/plugin.route"));
app.use("/api/deploy", require("./routes/deploy.route"));


/* ---------- Start HTTP first (Azure requires binding to provided PORT) ---------- */
const PORT = process.env.PORT || 8080; // Azure injects PORT; 8080 fallback works locally too
app.listen(PORT, "0.0.0.0", () => {
 console.log(`HTTP listening on ${PORT}`);
});


/* ---------- Connect to Cosmos Mongo in background (non-blocking) ---------- */
const uri = process.env.MONGODB_URI;
if (!uri) {
 console.error("MONGODB_URI not set – running without DB connection");
} else {
 (async () => {
   try {
     await mongoose.connect(uri, {
       serverSelectionTimeoutMS: 10000, // fail fast if blocked
       maxPoolSize: 10,
       socketTimeoutMS: 20000,
     });
     console.log("DB connected");
   } catch (err) {
     console.error("DB connect failed:", err.message);
   }
 })();
}


/* ---------- Graceful shutdown ---------- */
process.on("SIGTERM", async () => {
 console.log("SIGTERM received: closing DB");
 try {
   await mongoose.connection.close();
 } catch {}
 process.exit(0);
});


process.on("unhandledRejection", (err) => {
 console.error("Unhandled promise rejection:", err);
});





