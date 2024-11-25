const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json()); // So that we can pass in JSON data in the body of the request

mongoose
  .connect(
    "mongodb://lumina-web:FBZAlH4Ljxo2pgaZ9s2qRYnibC2YFBhr6gfJntrPvGTBipL9ZUnxXWvkKGBFHSnY5g5ZcSgBvNwqACDbIG2Fng==@lumina-web.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@lumina-web@"
  )
  .then(() => {
    console.log("Connected to database");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });

// const SwaggerClient = require("swagger-client");
// const fs = require("fs");
// const yaml = require("js-yaml");

// const loadSchema = async () => {
//   try {
//     const schema = yaml.load(fs.readFileSync("./schema.yaml", "utf8"));
//     console.log("Loaded Schema:", schema);

//     // Initialize SwaggerClient
//     const client = await SwaggerClient({
//       spec: schema,
//     });

//     console.log("Loaded Schema Spec:", client.spec);
//     console.log("Operations available:", client.apis.default);

//     return client;
//   } catch (error) {
//     console.error("Error loading SwaggerClient:", error.message);
//   }
// };

// const callEndpoint = async (client) => {
//   try {
//     console.log("Sending request...");
//     const response = await client.execute({
//       operationId: "sayHello",
//       requestBody: {
//         query: "hello", // Ensure the correct structure
//       },
//     });

//     if (!response) {
//       console.error("No response returned from the API.");
//       return "No response from API.";
//     }

//     // console.log("Response Status:", response.statusCode); // Check if status is available
//     // console.log("Response Body:", response.body); // Check the body

//     return response.body;
//   } catch (error) {
//     console.error("Error calling endpoint:", error);
//     return `Error: ${error.message}`;
//   }
// };

// const main = async () => {
//   const client = await loadSchema();
//   const response = await callEndpoint(client);
//   console.log(response); // Log the final response
// };

// main();
