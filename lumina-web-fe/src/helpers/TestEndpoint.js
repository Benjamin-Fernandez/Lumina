import SwaggerClient from "swagger-client";
import yaml, { Type } from "js-yaml";

const loadSchema = async ({ yamlString }) => {
  try {
    const schema = yaml.load(yamlString);

    // Initialize SwaggerClient
    const client = await SwaggerClient({
      spec: schema,
    });
    return client;
  } catch (error) {
    console.error("Error loading SwaggerClient:", error.message);
  }
};

const callEndpoint = async ({ client, query, path }) => {
  try {
    const operation = client.spec.paths[path];
    if (!operation) {
      throw new Error("Operation not found in the schema.");
    }

    if (operation?.post?.requestBody?.content["application/json"]) {
      const requestBodySchema =
        operation?.post.requestBody?.content["application/json"]?.schema;
      if (!requestBodySchema) {
        throw new Error("No schema found for requestBody in /getResponse");
      }

      const requestBodyQueryKey = requestBodySchema.properties;
      if (!requestBodyQueryKey) {
        throw new Error(
          console.log("Request Body Schema: ", requestBodySchema),
          "requestBodyQueryKey is undefined. Check the schema properties."
        );
      }
      const response = await client.execute({
        operationId: "getResponse",
        requestBody: {
          [requestBodyQueryKey]: query,
        },
      });

      // Ensure response.body is properly handled
      if (!response) {
        console.error("No response returned from the API.");
        return "No response from API.";
      }

      // Convert object responses to strings consistently
      return typeof response.body === "object"
        ? JSON.stringify(response.body, null, 2)
        : String(response.body); // Convert to string explicitly
    } else {
      const response = await client.execute({
        operationId: "getResponse",
        requestBody: query,
      });
      // Ensure response.body is properly handled
      if (!response) {
        console.error("No response returned from the API.");
        return "No response from API.";
      }

      // Convert object responses to strings consistently
      return typeof response.body === "object"
        ? JSON.stringify(response.body, null, 2)
        : String(response.body); // Convert to string explicitly
    }
  } catch (error) {
    console.error("Error calling endpoint:", error);
    return `Error: ${error.message}`;
  }
};

const testEndpoint = async ({ yamlString, query, path }) => {
  const client = await loadSchema({ yamlString });
  const response = await callEndpoint({ client, query, path });
  return response;
};

export default testEndpoint;
