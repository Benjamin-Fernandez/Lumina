const SwaggerClient = require("swagger-client");
const yaml = require("js-yaml");


/**
* Structured logging utility for plugin execution
* Provides consistent logging format for debugging and monitoring
*/
const pluginLogger = {
 logRequest: (pluginName, path, requestData) => {
   const timestamp = new Date().toISOString();
   console.log("=".repeat(60));
   console.log(`[${timestamp}] PLUGIN REQUEST`);
   console.log(`Plugin: ${pluginName || "Unknown"}`);
   console.log(`Path: ${path}`);
   console.log(`Request Data:`, JSON.stringify(requestData, null, 2));
   console.log("=".repeat(60));
 },
 logResponse: (pluginName, path, response, duration) => {
   const timestamp = new Date().toISOString();
   console.log("-".repeat(60));
   console.log(`[${timestamp}] PLUGIN RESPONSE`);
   console.log(`Plugin: ${pluginName || "Unknown"}`);
   console.log(`Path: ${path}`);
   console.log(`Duration: ${duration}ms`);
   console.log(`Response:`, typeof response === "object" ? JSON.stringify(response, null, 2) : response);
   console.log("-".repeat(60));
 },
 logError: (pluginName, path, error, duration) => {
   const timestamp = new Date().toISOString();
   console.error("!".repeat(60));
   console.error(`[${timestamp}] PLUGIN ERROR`);
   console.error(`Plugin: ${pluginName || "Unknown"}`);
   console.error(`Path: ${path}`);
   console.error(`Duration: ${duration}ms`);
   console.error(`Error: ${error.message}`);
   console.error(`Stack: ${error.stack}`);
   console.error("!".repeat(60));
 },
};


/**
* Load and parse OpenAPI schema, initialize SwaggerClient
*/
const loadSchema = async ({ schema, authType, apiKey }) => {
 try {
   const parsedSchema = yaml.load(schema);
   console.log("Loaded Schema:", parsedSchema);


   // Build authorization config if API key is provided
   let clientConfig = { spec: parsedSchema };


   if (authType && apiKey) {
     if (authType === "apiKey") {
       // Add API key as header
       clientConfig.authorizations = {
         api_key: apiKey,
       };
       // Also inject into requestInterceptor for more reliable header injection
       clientConfig.requestInterceptor = (req) => {
         req.headers["X-API-Key"] = apiKey;
         return req;
       };
     } else if (authType === "bearer") {
       clientConfig.requestInterceptor = (req) => {
         req.headers["Authorization"] = `Bearer ${apiKey}`;
         return req;
       };
     }
   }


   // Initialize SwaggerClient with auth config
   const client = await SwaggerClient(clientConfig);


   console.log("Loaded Schema Spec:", client.spec);
   console.log("Operations available:", client.apis.default);


   return client;
 } catch (error) {
   console.error("Error loading SwaggerClient:", error.message);
   throw error;
 }
};


/**
* Call plugin endpoint with dynamic path support
* @param {Object} params - Parameters for the endpoint call
* @param {Object} params.client - SwaggerClient instance
* @param {string} params.message - Current user message
* @param {string} params.path - Dynamic path to call (no longer hardcoded)
*/
const callEndpoint = async ({ client, message, path }) => {
 // Use provided path or default to /getResponse for backward compatibility
 const targetPath = path || "/getResponse";


 try {
   console.log("Sending request to path:", targetPath);
   console.log("Message:", message);


   const operation = client.spec.paths[targetPath];
   if (!operation) {
     throw new Error(`Operation not found for path: ${targetPath}`);
   }


   // Find the operationId from the schema (don't hardcode "getResponse")
   const operationId = operation?.post?.operationId || "getResponse";
   console.log("Using operationId:", operationId);


   // Build request body based on content type
   if (operation?.post?.requestBody?.content["application/json"]) {
     const requestBodySchema =
       operation?.post.requestBody?.content["application/json"]?.schema;
     if (!requestBodySchema) {
       console.log("Operation: ", operation);
       throw new Error(`No schema found for requestBody in ${targetPath}`);
     }


     const requestBodyQueryKey = requestBodySchema.properties;
     if (!requestBodyQueryKey) {
       throw new Error(
         `requestBodyQueryKey is undefined for ${targetPath}. Check the schema properties.`
       );
     }


     // Build request body - maintain backward compatibility by only sending the query key
     // Note: We do NOT include _lumina_context in the request body to avoid breaking
     // existing plugins that have strict JSON schema validation.
     // Plugins that need context can implement a separate endpoint or use headers.
     const requestBody = {
       [requestBodyQueryKey]: message,
     };


     const response = await client.execute({
       operationId: operationId,
       requestBody: requestBody,
     });


     if (!response) {
       console.error("No response returned from the API.");
       return "No response from API.";
     }


     return response.body;
   } else {
     // For text/plain or other content types
     const response = await client.execute({
       operationId: operationId,
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


/**
* Main endpoint handler for custom plugin execution
*
* Expected request body:
* {
*   message: string,           // Current user message (required)
*   schema: string,            // OpenAPI YAML schema (required)
*   path: string,              // Endpoint path to call (optional, defaults to /getResponse)
*   conversationHistory: Array, // Previous messages for context (optional)
*   userEmail: string,         // User identifier (optional)
*   conversationId: string,    // Conversation ID (optional)
*   authType: string,          // "none", "apiKey", or "bearer" (optional)
*   apiKey: string,            // API key for authentication (optional)
*   pluginName: string,        // Plugin name for logging (optional)
* }
*/
const customEndpoint = async (req, res) => {
 const startTime = Date.now();
 const {
   message,
   schema,
   path,
   conversationHistory,
   userEmail,
   // conversationId - received but not currently used (reserved for future use)
   authType,
   apiKey,
   pluginName,
 } = req.body;


 // Validate required fields
 if (!message) {
   return res.status(400).json({ error: "message is required" });
 }
 if (!schema) {
   return res.status(400).json({ error: "schema is required" });
 }


 const targetPath = path || "/getResponse";


 // Log the incoming request
 pluginLogger.logRequest(pluginName, targetPath, {
   message,
   hasConversationHistory: !!(conversationHistory && conversationHistory.length > 0),
   conversationHistoryLength: conversationHistory?.length || 0,
   hasUserEmail: !!userEmail,
   hasAuth: !!(authType && apiKey),
   authType: authType || "none",
 });


 try {
   const client = await loadSchema({ schema, authType, apiKey });
   const response = await callEndpoint({
     client,
     message,
     path: targetPath,
   });


   const duration = Date.now() - startTime;
   pluginLogger.logResponse(pluginName, targetPath, response, duration);


   res.status(200).json({ response });
 } catch (error) {
   const duration = Date.now() - startTime;
   pluginLogger.logError(pluginName, targetPath, error, duration);


   res.status(500).json({ error: error.message });
 }
};


module.exports = { customEndpoint };





