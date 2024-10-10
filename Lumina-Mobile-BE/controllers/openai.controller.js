const axios = require("../config/axiosConfig");
require("dotenv").config();

const getResponse = async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  const payload = {
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are an AI assistant that helps people find information.",
          },
        ],
      },
      ...messages.map((message) => {
        //console.log("Message: ", message);
        //console.log("Content: ", message.content);
        return {
          role: message.fromSelf ? "user" : "assistant", // Use 'user' if the message is from the user, 'assistant' otherwise
          content: [
            {
              type: "text",
              text: message.content,
            },
          ],
        };
      }),
    ],
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 800,
  };

  //console.log("Payload: ", payload);
  try {
    const API = `${process.env.AZURE_OPENAI_API_BASE}?api-version=${process.env.AZURE_OPENAI_APIVERSION}&api-key=${process.env.AZURE_OPENAI_APIKEY}`;
    //console.log("API endpoint", API);
    //console.log("Payload", payload);
    const response = await axios.post(API, payload);
    res.status(200).json({ response: response.data });
    //console.log("Response: ", response.data);
  } catch (error) {
    console.error(
      "Error fetching response:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getResponse };
