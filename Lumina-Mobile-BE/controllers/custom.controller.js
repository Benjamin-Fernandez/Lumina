const SwaggerClient = require("swagger-client");
const yaml = require("js-yaml");

const loadSchema = async ({ schema }) => {
  try {
    const parsedSchema = yaml.load(schema);
    console.log("Loaded Schema:", parsedSchema);

    // Initialize SwaggerClient
    const client = await SwaggerClient({
      spec: parsedSchema,
    });

    console.log("Loaded Schema Spec:", client.spec);
    console.log("Operations available:", client.apis.default);

    return client;
  } catch (error) {
    console.error("Error loading SwaggerClient:", error.message);
  }
};

const callEndpoint = async ({ client, message }) => {
  try {
    console.log("Sending request...");
    console.log("Query:", message);
    console.log("Client:", client);

    const operation = client.spec.paths["/getResponse"];
    if (!operation) {
      throw new Error("Operation not found for /getResponse");
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
      const response = await client.execute({
        operationId: "getResponse",
        requestBody: {
          [requestBodyQueryKey]: message, // Use the dynamic key
        },
      });
      if (!response) {
        console.error("No response returned from the API.");
        return "No response from API.";
      }

      return response.body;
    } else {
      const response = await client.execute({
        operationId: "getResponse",
        requestBody: message,
      });
      if (!response) {
        console.error("No response returned from the API.");
        return "No response from API.";
      }

      return response.body;
    }
  } catch (error) {
    console.error("Error calling endpoint:", error);
    return `Error: ${error.message}`;
  }
};

const customEndpoint = async (req, res) => {
  const { message, schema } = req.body;

  try {
    const client = await loadSchema({ schema });
    const response = await callEndpoint({ client, message });
    console.log(response); // Log the final response
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error calling custom endpoint:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { customEndpoint };
