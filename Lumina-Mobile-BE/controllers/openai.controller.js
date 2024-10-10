const getResponse = async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  try {
    const response = await axios.post(
      `${process.env.AZURE_OPENAI_API_BASE}/openai/deployments/ANV2Exp-AzureOpenAI-NorthCtrlUS-TWY-GPT4o/chat/completions?api-version=${process.env.AZURE_OPENAI_APIVERSION}`,
      {
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
      }
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getResponse };
