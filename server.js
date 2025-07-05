const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Default route to check if the server is working
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Webhook route for Dialogflow
app.post('/webhook', async (req, res) => {
  try {
    const { queryResult } = req.body;
    const userMessage = queryResult.queryText;

    // Example: Forward message to OpenAI for response
    const openAiResponse = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003', // Use the correct model
      prompt: userMessage,
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const openAiReply = openAiResponse.data.choices[0].text.trim();

    // Send the response back to Dialogflow
    res.json({
      fulfillmentText: openAiReply,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  }
});

// Set the port from the environment variable, or fallback to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on http://localhost:${PORT}`);
});
