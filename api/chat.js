// DigitalOcean Serverless Function pour l'API Anthropic
// Cette fonction fait le pont entre votre site et l'API Claude

export default async function handler(request, response) {
  // Configuration CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = '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';

  try {
    const { model, max_tokens, system, messages } = request.body;

    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
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

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return response.status(apiResponse.status).json(errorData);
    }

    const data = await apiResponse.json();
    return response.status(200).json(data);

  } catch (error) {
    console.error('Error:', error);
    return response.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
