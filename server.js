const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';  // Your OpenAI API Key here

// Webhook endpoint to handle Dialogflow requests
app.post('/webhook', async (req, res) => {
  const userQuery = req.body.queryResult.queryText;  // Get user's message

  try {
    // Send request to OpenAI API
    const openAIResponse = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',  // Use GPT-3
      prompt: userQuery,
      max_tokens: 50,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    // Send response back to Dialogflow
    const responseText = openAIResponse.data.choices[0].text.trim();
    res.json({
      fulfillmentText: responseText,  // Send OpenAI response to Dialogflow
    });
  } catch (error) {
    console.error(error);
    res.json({
      fulfillmentText: "Sorry, I couldn't process that. Try again later.",
    });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Webhook server is running on http://localhost:3000');
});
