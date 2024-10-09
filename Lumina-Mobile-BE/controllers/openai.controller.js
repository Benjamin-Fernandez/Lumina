const getResponse = async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  try {
    const response = await axios.post(
      `${process.env.OPENAI_API_ENDPOINT}/conversations/${process.env.OPENAI_CONVERSATION_ID}/append`,
      {
        messages: messages.map((message) => {
          return {
            role: "user",
            content: message,
          };
        }),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getResponse };
