// Express server pour DigitalOcean App Platform
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

const API_KEY = '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';

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'FIONA.AI API is running' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { model, max_tokens, system, messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens,
        system,
        messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 FIONA.AI API running on port ${PORT}`);
});
