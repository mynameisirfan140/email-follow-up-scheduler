```javascript
const axios = require('axios');
const { OPENAI_API_KEY } = process.env;

async function generateReminder(emailSubject, emailBody) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `You are a polite assistant. Write a short follow‑up email reminder for the email below.
Subject: ${emailSubject}
Body: ${emailBody}
The reminder should be courteous, reference the original email, and suggest a reasonable next step.`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );

  const content = response.data.choices[0].message.content.trim();
  return content;
}

module.exports = {
  generateReminder,
};