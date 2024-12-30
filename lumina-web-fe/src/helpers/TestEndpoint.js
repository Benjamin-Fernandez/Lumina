import SwaggerClient from "swagger-client";
import yaml, { Type } from "js-yaml";

const loadSchema = async ({ yamlString }) => {
  try {
    const schema = yaml.load(yamlString);
    console.log("Loaded Schema:", schema);

    // Initialize SwaggerClient
    const client = await SwaggerClient({
      spec: schema,
    });

    console.log("Loaded Schema Spec:", client.spec);
    console.log("Operations available:", client.apis.default);

    return client;
  } catch (error) {
    console.error("Error loading SwaggerClient:", error.message);
  }
};

const callEndpoint = async ({ client, query, path, apiKey }) => {
  try {
    console.log("Sending request...");
    console.log("Query:", query);
    console.log("Client:", client);

    const operation = client.spec.paths[path];
    if (!operation) {
      throw new Error("Operation not found in the schema.");
    }

    if (operation?.post?.requestBody?.content["application/json"]) {
      const requestBodySchema =
        operation?.post.requestBody?.content["application/json"]?.schema;
      if (!requestBodySchema) {
        console.log("Operation: ", operation);
        throw new Error("No schema found for requestBody in /getResponse");
      }

      const requestBodyQueryKey = requestBodySchema.properties;
      if (!requestBodyQueryKey) {
        throw new Error(
          console.log("Request Body Schema: ", requestBodySchema),
          "requestBodyQueryKey is undefined. Check the schema properties."
        );
      }
      if (apiKey === "") {
        const response = await client.execute({
          operationId: "getResponse",
          requestBody: {
            [requestBodyQueryKey]: query, // Use the dynamic key
          },
        });
        if (!response) {
          console.error("No response returned from the API.");
          return "No response from API.";
        }
        return response.body;
      } else {
        console.log(apiKey, requestBodyQueryKey);
        const response = await client.execute({
          operationId: "getResponse",
          requestBody: {
            [requestBodyQueryKey]: query, // Use the dynamic key
          },
          headers: {
            Apikey: apiKey,
            "Content-Type": "application/json",
          },
        });
        if (!response) {
          console.error("No response returned from the API.");
          return "No response from API.";
        }

        return response.body;
      }
    } else {
      if (apiKey === "") {
        const response = await client.execute({
          operationId: "getResponse",
          requestBody: query,
        });
        if (!response) {
          console.error("No response returned from the API.");
          return "No response from API.";
        }

        return response.body;
      } else {
        console.log(apiKey);
        const response = await client.execute({
          operationId: "getResponse",
          requestBody: query,
          headers: {
            Apikey: apiKey,
            "Content-Type": "application/json",
          },
        });
        if (!response) {
          console.error("No response returned from the API.");
          return "No response from API.";
        }

        return response.body;
      }
    }
  } catch (error) {
    console.error("Error calling endpoint:", error);
    return `Error: ${error.message}`;
  }
};

const testEndpoint = async ({ yamlString, query, path, apiKey }) => {
  const client = await loadSchema({ yamlString });
  const response = await callEndpoint({ client, query, path, apiKey });
  console.log(response); // Log the final response
  return response;
};

export default testEndpoint;
